interface Env { DB: D1Database }
export const onRequestGet: PagesFunction<Env> = async ({ env }) => {
  try { await env.DB.prepare("SELECT 1").first(); return Response.json({ ok: true, database: "connected" }); }
  catch { return Response.json({ ok: false, database: "unavailable" }, { status: 503 }); }
};