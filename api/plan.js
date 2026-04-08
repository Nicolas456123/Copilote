import { getDb } from './_db.js';

function getWeekId() {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

function getWeekDays() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(d);
    date.setDate(diff + i);
    return date.toISOString().slice(0, 10);
  });
}

export default async function handler(req, res) {
  const db = getDb();
  const weekId = getWeekId();

  try {
    // GET - récupérer le plan de la semaine
    if (req.method === "GET") {
      const result = await db.execute({
        sql: "SELECT * FROM weekly_tasks WHERE week_id = ? ORDER BY day, sort_order",
        args: [weekId],
      });
      const tasks = result.rows.map(r => ({
        id: r.id,
        weekId: r.week_id,
        projectId: r.project_id,
        projectName: r.project_name,
        domain: r.domain,
        taskText: r.task_text,
        day: r.day,
        status: r.status,
        sortOrder: r.sort_order,
      }));
      return res.status(200).json({ weekId, tasks });
    }

    // POST - générer un plan via l'IA ou ajouter des tâches manuellement
    if (req.method === "POST") {
      const { action } = req.body;

      // Générer un plan IA
      if (action === "generate") {
        // Récupérer les projets avec étapes non faites
        const projects = await db.execute("SELECT * FROM projects");
        const projectsData = projects.rows.map(r => ({
          id: r.id,
          domain: r.domain,
          name: r.name,
          steps: JSON.parse(r.steps || "[]"),
          weekFocus: Boolean(r.week_focus),
        }));

        // Construire le contexte pour l'IA
        const projectSummary = projectsData
          .filter(p => p.steps.some(s => !s.done))
          .map(p => {
            const todo = p.steps.filter(s => !s.done).map(s => s.text);
            const done = p.steps.filter(s => s.done).length;
            const total = p.steps.length;
            return `${p.weekFocus ? "⭐ " : ""}${p.name} (${done}/${total}) - À faire: ${todo.slice(0, 5).join(", ")}`;
          })
          .join("\n");

        const weekDays = getWeekDays();
        const dayNames = weekDays.map(d =>
          new Date(d).toLocaleDateString("fr-FR", { weekday: "long" }) + " " + d
        ).join(", ");

        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (!apiKey || apiKey === "your_key_here") {
          return res.status(500).json({ error: "ANTHROPIC_API_KEY not configured" });
        }

        const systemPrompt = `Tu es le copilote de Nicolas, ingénieur BTP. Tu dois créer un planning hebdomadaire réaliste.
Règles:
- Maximum 2-3 tâches par jour (il travaille en journée)
- Priorise les projets marqués ⭐ (focus de la semaine)
- Gym 3x/semaine (lundi, mercredi, vendredi idéalement)
- Soirs et weekend pour les projets perso
- Tâches concrètes et actionnables (30-60min chacune)
- Pas de tâche le dimanche sauf si urgent

Réponds UNIQUEMENT avec un JSON array. Chaque objet:
{"day": "YYYY-MM-DD", "projectName": "nom", "domain": "domaine", "task": "description courte"}

Pas de markdown, pas de backticks, juste le JSON array.`;

        const userPrompt = `Crée le planning de cette semaine.
Jours: ${dayNames}
Projets:\n${projectSummary}`;

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 2000,
            system: systemPrompt,
            messages: [{ role: "user", content: userPrompt }],
          }),
        });

        const data = await response.json();
        const text = data.content?.map(c => c.text || "").join("") || "[]";
        let plan;
        try {
          plan = JSON.parse(text.replace(/```json|```/g, "").trim());
        } catch {
          return res.status(500).json({ error: "Failed to parse AI response", raw: text });
        }

        // Supprimer l'ancien plan de la semaine
        await db.execute({ sql: "DELETE FROM weekly_tasks WHERE week_id = ?", args: [weekId] });

        // Insérer les nouvelles tâches
        for (let i = 0; i < plan.length; i++) {
          const t = plan[i];
          // Trouver le project_id correspondant
          const match = projectsData.find(p =>
            p.name.toLowerCase().includes(t.projectName?.toLowerCase() || "")
          );
          await db.execute({
            sql: "INSERT INTO weekly_tasks (id, week_id, project_id, project_name, domain, task_text, day, status, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, 'todo', ?)",
            args: [
              `wt-${Date.now()}-${i}`,
              weekId,
              match?.id || "",
              t.projectName || "",
              t.domain || match?.domain || "",
              t.task || "",
              t.day || "",
              i,
            ],
          });
        }

        // Récupérer les tâches insérées
        const result = await db.execute({
          sql: "SELECT * FROM weekly_tasks WHERE week_id = ? ORDER BY day, sort_order",
          args: [weekId],
        });
        const tasks = result.rows.map(r => ({
          id: r.id,
          weekId: r.week_id,
          projectId: r.project_id,
          projectName: r.project_name,
          domain: r.domain,
          taskText: r.task_text,
          day: r.day,
          status: r.status,
          sortOrder: r.sort_order,
        }));

        return res.status(200).json({ weekId, tasks, generated: true });
      }

      // Reporter les tâches non faites au lendemain
      if (action === "reschedule") {
        const { taskId, newDay } = req.body;
        await db.execute({
          sql: "UPDATE weekly_tasks SET day = ? WHERE id = ?",
          args: [newDay, taskId],
        });
        return res.status(200).json({ ok: true });
      }
    }

    // PUT - mettre à jour le statut d'une tâche
    if (req.method === "PUT") {
      const { id, status } = req.body;
      if (!id) return res.status(400).json({ error: "id required" });
      await db.execute({
        sql: "UPDATE weekly_tasks SET status = ? WHERE id = ?",
        args: [status, id],
      });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
