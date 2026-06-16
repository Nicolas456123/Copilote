import { NICOLAS_CONTEXT, DOMAINS } from './constants';
import { dictionExercise, dictionSkill } from './diction';

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
// ou si la clé API manque. Toujours calibrée par palier, orientée objectif.
export function fallbackAction(skill) {
  // Axes à contenu curé : on puise dans leur librairie dédiée.
  if (skill.kind === 'diction') return dictionExercise(skill.level);
  const t = tierOf(skill.level).index;
  const goal = skill.midTerm || skill.name;
  const templates = [
    { action: `Premier petit pas vers « ${goal} » : 10 min, sans pression.`, minutes: 10 },
    { action: `Travaille un fondamental utile à « ${goal} ».`, minutes: 15 },
    { action: `Un exercice concret vers « ${goal} », un cran au-dessus.`, minutes: 20 },
    { action: `Avance « ${goal} » sur une vraie tâche exigeante.`, minutes: 30 },
    { action: `Peaufine un détail avancé de « ${goal} », ou transmets-le.`, minutes: 30 },
  ];
  return { ...templates[t], rationale: "Calibré sur ton palier." };
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

export function buildSkillPrompt(skill, correction) {
  const t = tierOf(skill.level);
  const recent = (skill.history || []).slice(-3).map(h => h.note).join(", ") || "aucun retour pour l'instant";
  const prev = skill.currentAction?.action ? `\nProposition précédente : "${skill.currentAction.action}".` : "";
  const fix = correction
    ? `\nNicolas trouve cette proposition incohérente. Ce qui cloche : "${correction}". Corrige le tir et propose une action vraiment pertinente.`
    : "";
  return `Domaine : "${skill.name}".${skill.longTerm ? `\nVision long terme : ${skill.longTerm}` : ""}${skill.midTerm ? `\nObjectif moyen terme (priorité actuelle) : ${skill.midTerm}` : ""}
Niveau actuel : ${Math.round(skill.level)}/100 — palier "${t.name}".
Derniers retours : ${recent}.${prev}${fix}
Propose LA prochaine action concrète qui fait avancer vers l'objectif moyen terme, calibrée à ce niveau précis.`;
}

// Le plan : un axe par domaine, avec vision long terme et objectif moyen
// terme. Pré-rempli depuis le profil de Nicolas, entièrement modifiable.
export function seedSkills() {
  const base = [
    {
      domain: "gamedev", level: 44,
      longTerm: "Sortir Hybelior : un jeu Unreal avec multijoueur, et son univers (lore + livre).",
      midTerm: "Un prototype jouable d'une boucle de gameplay d'Hybelior.",
    },
    {
      domain: "music", level: 38,
      longTerm: "Maîtriser electro, orchestral et pop, et publier des morceaux finis.",
      midTerm: "Terminer la chanson « Falling Again » de bout en bout.",
    },
    {
      domain: "work", level: 55,
      longTerm: "Exceller comme chargé d'affaires BTP et faire grandir ChantierHub.",
      midTerm: "Fiabiliser ChantierHub sur un chantier réel en cours.",
    },
    {
      domain: "learning", level: 30,
      longTerm: "Parler italien et allemand, passer le code moto, élargir culture & sciences.",
      midTerm: "Atteindre un niveau conversationnel de base en italien.",
    },
    {
      domain: "health", level: 30,
      longTerm: "Corps solide : sport régulier, réveil 6-7h, alimentation maîtrisée.",
      midTerm: "Tenir 3 séances de sport par semaine, 4 semaines d'affilée.",
    },
    {
      domain: "daily", level: 25,
      longTerm: "Un quotidien fluide : courses, maison et admin sans charge mentale.",
      midTerm: "Mettre en place une routine hebdo simple pour courses + ménage.",
    },
  ];
  const seeded = base.map((s, i) => ({
    id: `sk-${Date.now()}-${i}`,
    name: DOMAINS[s.domain]?.label || s.domain,
    domain: s.domain,
    level: s.level,
    longTerm: s.longTerm,
    midTerm: s.midTerm,
    active: true,
    currentAction: null, // généré paresseusement / fallback à l'affichage
    history: [],
    updatedAt: new Date().toISOString(),
  }));
  return [...seeded, dictionSkill()];
}
