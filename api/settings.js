import { getDb } from './_db.js';

export default async function handler(req, res) {
  const db = getDb();

  try {
    if (req.method === "GET") {
      const result = await db.execute("SELECT * FROM settings");
      const settings = {};
      for (const r of result.rows) {
        settings[r.key] = r.value;
      }
      return res.status(200).json(settings);
    }

    if (req.method === "PUT") {
      const { key, value } = req.body;
      if (!key) return res.status(400).json({ error: "key required" });
      await db.execute({
        sql: "INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)",
        args: [key, value || ""],
      });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
