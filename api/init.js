import { getDb } from './_db.js';

const SCHEMA = `
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  domain TEXT NOT NULL,
  name TEXT NOT NULL,
  link TEXT DEFAULT '',
  steps TEXT DEFAULT '[]',
  week_focus INTEGER DEFAULT 0,
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS habit_logs (
  id TEXT PRIMARY KEY,
  habit_id TEXT NOT NULL,
  date TEXT NOT NULL,
  completed INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS journal_entries (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL UNIQUE,
  mood TEXT NOT NULL,
  tags TEXT DEFAULT '[]',
  raw_text TEXT DEFAULT '',
  ai_text TEXT DEFAULT '',
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS focus_sessions (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  step_id TEXT,
  duration INTEGER DEFAULT 0,
  date TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS streaks (
  id TEXT PRIMARY KEY DEFAULT 'main',
  current_streak INTEGER DEFAULT 0,
  last_date TEXT DEFAULT ''
);
`;

const DEFAULT_PROJECTS = [
  { domain: "gamedev", name: "Hybelior - Jeu vidéo", link: "" },
  { domain: "gamedev", name: "Hybelior - Lore & Livre", link: "https://hybelior-world-site.vercel.app/" },
  { domain: "music", name: "Falling Again (chanson)", link: "" },
  { domain: "music", name: "Productions Electro", link: "" },
  { domain: "music", name: "Compositions Orchestrales", link: "" },
  { domain: "work", name: "ChantierHub", link: "https://chantierhub.vercel.app" },
  { domain: "learning", name: "Curiosita (app)", link: "https://nicolas456123.github.io/Curiosita/" },
  { domain: "learning", name: "Apprendre l'Italien", link: "" },
  { domain: "learning", name: "Apprendre l'Allemand", link: "" },
  { domain: "learning", name: "Code Moto", link: "" },
  { domain: "learning", name: "Culture Générale & Sciences", link: "" },
  { domain: "health", name: "MiamWeek (alimentation)", link: "https://miamweek.vercel.app" },
];

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });

  const db = getDb();
  try {
    const statements = SCHEMA.split(';').filter(s => s.trim());
    for (const stmt of statements) {
      await db.execute(stmt);
    }

    // Seed projects if empty
    const existing = await db.execute("SELECT COUNT(*) as count FROM projects");
    if (existing.rows[0].count === 0) {
      for (let i = 0; i < DEFAULT_PROJECTS.length; i++) {
        const p = DEFAULT_PROJECTS[i];
        await db.execute({
          sql: "INSERT INTO projects (id, domain, name, link, steps) VALUES (?, ?, ?, ?, '[]')",
          args: [`init-${i}`, p.domain, p.name, p.link],
        });
      }
    }

    // Seed streak if empty
    const streakExists = await db.execute("SELECT COUNT(*) as count FROM streaks");
    if (streakExists.rows[0].count === 0) {
      await db.execute("INSERT INTO streaks (id, current_streak, last_date) VALUES ('main', 0, '')");
    }

    return res.status(200).json({ ok: true, message: "Schema created and seeded" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
