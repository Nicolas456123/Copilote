import { getDb } from './_db.js';

export default async function handler(req, res) {
  const db = getDb();

  try {
    if (req.method === "GET") {
      const result = await db.execute("SELECT * FROM focus_sessions ORDER BY date DESC");
      const sessions = result.rows.map(r => ({
        id: r.id,
        projectId: r.project_id,
        stepId: r.step_id,
        duration: r.duration,
        date: r.date,
      }));
      return res.status(200).json(sessions);
    }

    if (req.method === "POST") {
      const { id, projectId, stepId, duration, date } = req.body;
      await db.execute({
        sql: "INSERT INTO focus_sessions (id, project_id, step_id, duration, date) VALUES (?, ?, ?, ?, ?)",
        args: [id, projectId || "", stepId || "", duration, date],
      });
      return res.status(201).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
