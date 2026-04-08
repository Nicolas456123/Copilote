import { getDb } from './_db.js';

export default async function handler(req, res) {
  const db = getDb();

  try {
    if (req.method === "GET") {
      const result = await db.execute("SELECT * FROM projects ORDER BY created_at");
      const projects = result.rows.map(r => ({
        id: r.id,
        domain: r.domain,
        name: r.name,
        link: r.link || "",
        steps: JSON.parse(r.steps || "[]"),
        weekFocus: Boolean(r.week_focus),
      }));
      return res.status(200).json(projects);
    }

    if (req.method === "POST") {
      const { id, domain, name, link, steps } = req.body;
      await db.execute({
        sql: "INSERT INTO projects (id, domain, name, link, steps) VALUES (?, ?, ?, ?, ?)",
        args: [id || `p-${Date.now()}`, domain, name, link || "", JSON.stringify(steps || [])],
      });
      return res.status(201).json({ ok: true });
    }

    if (req.method === "PUT") {
      const { id, steps, week_focus, name, link } = req.body;
      if (!id) return res.status(400).json({ error: "id required" });

      const updates = [];
      const args = [];

      if (steps !== undefined) { updates.push("steps = ?"); args.push(JSON.stringify(steps)); }
      if (week_focus !== undefined) { updates.push("week_focus = ?"); args.push(week_focus ? 1 : 0); }
      if (name !== undefined) { updates.push("name = ?"); args.push(name); }
      if (link !== undefined) { updates.push("link = ?"); args.push(link); }

      updates.push("updated_at = datetime('now')");
      args.push(id);

      await db.execute({
        sql: `UPDATE projects SET ${updates.join(", ")} WHERE id = ?`,
        args,
      });
      return res.status(200).json({ ok: true });
    }

    if (req.method === "DELETE") {
      const { id } = req.body;
      if (!id) return res.status(400).json({ error: "id required" });
      await db.execute({ sql: "DELETE FROM projects WHERE id = ?", args: [id] });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
