interface Env { DB: D1Database }
interface TaskInput { id?:string; title?:string; description?:string; status?:"todo"|"in_progress"|"done"; priority?:"low"|"medium"|"high"; assignee?:string; due_date?:string }
const json=(data:unknown,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store"}});
export const onRequestGet:PagesFunction<Env>=async({env})=>{
 try{const {results}=await env.DB.prepare("SELECT id,title,description,status,priority,assignee,due_date FROM tasks ORDER BY created_at DESC").all();return json({tasks:results})}
 catch{return json({error:"Unable to load tasks. Check the D1 binding and database schema."},503)}
};
export const onRequestPost:PagesFunction<Env>=async({request,env})=>{
 let body:TaskInput;try{body=await request.json() as TaskInput}catch{return json({error:"Invalid JSON body."},400)}
 const title=body.title?.trim();if(!title)return json({error:"A task title is required."},400);
 const task={id:body.id||crypto.randomUUID(),title,description:body.description||"",status:body.status||"todo",priority:body.priority||"medium",assignee:body.assignee||"",due_date:body.due_date||""};
 if(!["todo","in_progress","done"].includes(task.status)||!["low","medium","high"].includes(task.priority))return json({error:"Invalid task status or priority."},400);
 try{await env.DB.prepare("INSERT INTO tasks (id,title,description,status,priority,assignee,due_date) VALUES (?,?,?,?,?,?,?)").bind(task.id,task.title,task.description,task.status,task.priority,task.assignee,task.due_date).run();return json({task},201)}
 catch{return json({error:"Unable to save task to the database."},503)}
};