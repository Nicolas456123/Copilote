import { getDb } from './_db.js';

export default async function handler(req, res) {
  const db = getDb();

  try {
    if (req.method === "GET") {
      const result = await db.execute("SELECT * FROM habit_logs ORDER BY date DESC");
      // Group by date: { "2026-04-08": { wake: true, gym: true } }
      const log = {};
      for (const r of result.rows) {
        if (!log[r.date]) log[r.date] = {};
        log[r.date][r.habit_id] = Boolean(r.completed);
      }
      return res.status(200).json(log);
    }

    if (req.method === "POST") {
      const { habitId, date, completed } = req.body;
      const id = `hl-${date}-${habitId}`;

      if (completed) {
        await db.execute({
          sql: "INSERT OR REPLACE INTO habit_logs (id, habit_id, date, completed) VALUES (?, ?, ?, 1)",
          args: [id, habitId, date],
        });
      } else {
        await db.execute({
          sql: "DELETE FROM habit_logs WHERE habit_id = ? AND date = ?",
          args: [habitId, date],
        });
      }
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
