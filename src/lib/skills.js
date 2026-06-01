import { NICOLAS_CONTEXT, DOMAINS } from './constants';

// ── Le système "La juste marche" ────────────────────────────────────────
// Chaque compétence a un niveau 0→100. Le système propose toujours UNE
// action calibrée sur ce niveau (zone de progression optimale), puis
// s'auto-régule selon le retour de Nicolas. Il n'a jamais à juger lui-même
// si c'est "trop" : la boucle de feedback s'en charge.

export const TIERS = [
  { name: "Découverte", icon: "🌱", color: "#81B29A" }, // 0–19
  { name: "Initiation", icon: "🌿", color: "#00BBF9" }, // 20–39
  { name: "Pratique", icon: "🌳", color: "#F2CC8F" },   // 40–59
  { name: "Aisance", icon: "⭐", color: "#E07A5F" },    // 60–79
  { name: "Maîtrise", icon: "🏆", color: "#9B5DE5" },   // 80–100
];

export function tierOf(level) {
  const index = Math.min(TIERS.length - 1, Math.max(0, Math.floor(level / 20)));
  return { ...TIERS[index], index };
}

// Progression à l'intérieur du palier courant (0–100 %), pour la barre.
export function tierProgress(level) {
  if (level >= 100) return 100;
  return (level % 20) / 20 * 100;
}

// Auto-diagnostic de départ : adapte le système à n'importe quel niveau.
export const START_LEVELS = [
  { label: "Je débute totalement", level: 6 },
  { label: "J'ai quelques bases", level: 28 },
  { label: "Je suis à l'aise", level: 52 },
  { label: "Je suis déjà avancé", level: 76 },
];

// Retour après action → ajustement auto-régulé du niveau.
// C'est le cœur du système : il maintient l'action dans la zone optimale.
export const FEEDBACK = {
  easy:    { label: "Trop facile",   icon: "😴", delta: +6, note: "trop facile" },
  good:    { label: "Parfait",       icon: "👌", delta: +4, note: "bien calibré" },
  hard:    { label: "Dur mais fait", icon: "💪", delta: +3, note: "difficile mais réussi" },
  toohard: { label: "Trop dur",      icon: "😓", delta: -3, note: "trop dur, non terminé" },
};

export function applyFeedback(level, key) {
  const f = FEEDBACK[key];
  if (!f) return level;
  return Math.max(0, Math.min(100, Math.round(level + f.delta)));
}

// Action de secours (sans IA) : le système reste utilisable hors-ligne
// ou si la clé API manque. Toujours calibrée par palier.
export function fallbackAction(skill) {
  const t = tierOf(skill.level).index;
  const templates = [
    { action: `Explore les bases de ${skill.name} : 10 min de découverte, sans pression.`, minutes: 10 },
    { action: `Pratique un fondamental de ${skill.name} de façon délibérée.`, minutes: 15 },
    { action: `Travaille un exercice concret de ${skill.name}, un cran au-dessus de d'habitude.`, minutes: 20 },
    { action: `Applique ${skill.name} à une vraie tâche un peu exigeante.`, minutes: 30 },
    { action: `Affine un détail de maîtrise en ${skill.name}, ou transmets-le.`, minutes: 30 },
  ];
  return { ...templates[t], rationale: "Calibré sur ton palier actuel." };
}

// ── Prompts IA ──────────────────────────────────────────────────────────
export function buildSkillSystem() {
  return `${NICOLAS_CONTEXT}

Ton rôle ici : coach de progression. Tu proposes UNE seule action concrète pour faire progresser une compétence, calibrée EXACTEMENT sur son niveau (0 = débutant total, 100 = maîtrise).
Règles strictes :
- L'action doit tenir dans une seule session courte et être réaliste aujourd'hui.
- Zone de progression optimale : un cran au-dessus du confort, jamais écrasante. Pas de surcharge.
- Plus le niveau est bas, plus c'est élémentaire ; plus il est haut, plus c'est pointu.
- Tiens compte des derniers retours pour ajuster l'exigence.
Réponds UNIQUEMENT en JSON, sans markdown : { "action": "<action concrète et précise, max 18 mots>", "minutes": <entier 5-45>, "rationale": "<pourquoi cette marche, max 10 mots>" }`;
}

export function buildSkillPrompt(skill) {
  const t = tierOf(skill.level);
  const recent = (skill.history || []).slice(-3).map(h => h.note).join(", ") || "aucun retour pour l'instant";
  const domain = DOMAINS[skill.domain]?.label || "";
  return `Compétence : "${skill.name}"${domain ? ` (domaine ${domain})` : ""}.
Niveau actuel : ${Math.round(skill.level)}/100 — palier "${t.name}".
Derniers retours : ${recent}.
Donne la prochaine marche, calibrée à ce niveau précis.`;
}

// Compétences de départ, tirées du profil de Nicolas. Modifiables.
export function seedSkills() {
  const base = [
    { name: "Allemand", domain: "learning", level: 16 },
    { name: "Italien", domain: "learning", level: 30 },
    { name: "Game Dev (Unreal)", domain: "gamedev", level: 44 },
    { name: "Production musicale (FL)", domain: "music", level: 38 },
    { name: "Endurance physique", domain: "health", level: 28 },
  ];
  return base.map((s, i) => ({
    id: `sk-${Date.now()}-${i}`,
    name: s.name,
    domain: s.domain,
    level: s.level,
    active: false, // exemples gardés mais secondaires : à activer soi-même
    currentAction: null, // généré paresseusement / fallback à l'affichage
    history: [],
    updatedAt: new Date().toISOString(),
  }));
}
