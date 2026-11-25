interface Env { DB:D1Database }
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store"}});
export const onRequestPatch:PagesFunction<Env>=async({request,env,params})=>{
 let body:{status?:string;title?:string;priority?:string};try{body=await request.json() as typeof body}catch{return json({error:"Invalid JSON body."},400)}
 const fields:string[]=[],values:unknown[]=[];
 if(body.status!==undefined){if(!["todo","in_progress","done"].includes(body.status))return json({error:"Invalid status."},400);fields.push("status = ?");values.push(body.status)}
 if(body.title!==undefined){if(!body.title.trim())return json({error:"Title cannot be empty."},400);fields.push("title = ?");values.push(body.title.trim())}
 if(body.priority!==undefined){if(!["low","medium","high"].includes(body.priority))return json({error:"Invalid priority."},400);fields.push("priority = ?");values.push(body.priority)}
 if(!fields.length)return json({error:"No supported fields supplied."},400);
 fields.push("updated_at = CURRENT_TIMESTAMP");values.push(params.id);
 try{const result=await env.DB.prepare("UPDATE tasks SET "+fields.join(", ")+" WHERE id = ?").bind(...values).run();return result.meta.changes?json({ok:true}):json({error:"Task not found."},404)}
 catch{return json({error:"Unable to update task."},503)}
};
export const onRequestDelete:PagesFunction<Env>=async({env,params})=>{
 try{const result=await env.DB.prepare("DELETE FROM tasks WHERE id = ?").bind(params.id).run();return result.meta.changes?json({ok:true}):json({error:"Task not found."},404)}
 catch{return json({error:"Unable to delete task."},503)}
};