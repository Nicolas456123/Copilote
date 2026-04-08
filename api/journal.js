import { getDb } from './_db.js';

export default async function handler(req, res) {
  const db = getDb();

  try {
    if (req.method === "GET") {
      const result = await db.execute("SELECT * FROM journal_entries ORDER BY date DESC");
      const entries = result.rows.map(r => ({
        id: r.id,
        date: r.date,
        mood: JSON.parse(r.mood),
        tags: JSON.parse(r.tags || "[]"),
        rawText: r.raw_text || "",
        aiText: r.ai_text || "",
        createdAt: r.created_at,
      }));
      return res.status(200).json(entries);
    }

    if (req.method === "POST") {
      const { id, date, mood, tags, rawText, aiText } = req.body;
      // Upsert: replace if same date
      await db.execute({
        sql: "DELETE FROM journal_entries WHERE date = ?",
        args: [date],
      });
      await db.execute({
        sql: "INSERT INTO journal_entries (id, date, mood, tags, raw_text, ai_text) VALUES (?, ?, ?, ?, ?, ?)",
        args: [id, date, JSON.stringify(mood), JSON.stringify(tags), rawText || "", aiText || ""],
      });
      return res.status(201).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
