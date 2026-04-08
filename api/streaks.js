import { getDb } from './_db.js';

export default async function handler(req, res) {
  const db = getDb();

  try {
    if (req.method === "GET") {
      const result = await db.execute("SELECT * FROM streaks WHERE id = 'main'");
      if (result.rows.length === 0) {
        return res.status(200).json({ currentStreak: 0, lastDate: "" });
      }
      const r = result.rows[0];
      return res.status(200).json({ currentStreak: r.current_streak, lastDate: r.last_date });
    }

    if (req.method === "PUT") {
      const { currentStreak, lastDate } = req.body;
      await db.execute({
        sql: "INSERT OR REPLACE INTO streaks (id, current_streak, last_date) VALUES ('main', ?, ?)",
        args: [currentStreak, lastDate],
      });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
