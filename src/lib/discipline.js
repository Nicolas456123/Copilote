// Le cap : objectif unique et principe central qui structurent l'accueil.
// Tout le reste de l'app est secondaire ("du plus").

export const OBJECTIVE = {
  eyebrow: "Le cap",
  title: "Compétence générale par la discipline",
  pillars: "Discipline · Apprentissage · Constance",
  statement:
    "Devenir une personne fiable dans ses actions, capable de progresser dans n'importe quel domaine sans dépendre de la motivation ou de l'inspiration.",
  rule: "Aucun jour ne doit être totalement vide de progression.",
};

// Les 4 axes du développement global. Chaque axe a une action minimale
// quotidienne : pas de performance exigée, juste une continuité minimale.
export const AXES = [
  {
    id: "ax-discipline",
    label: "Discipline",
    icon: "🧱",
    color: "#E07A5F",
    minimal: "Agir une fois sans négocier avec moi-même.",
    desc: "Réduire la dépendance à la décision. Agir même sans motivation.",
  },
  {
    id: "ax-learning",
    label: "Apprentissage",
    icon: "📖",
    color: "#00BBF9",
    minimal: "Une vraie session, sans distraction.",
    desc: "Comprendre, retenir, réutiliser. Répétition intelligente.",
  },
  {
    id: "ax-body",
    label: "Condition physique",
    icon: "💪",
    color: "#81B29A",
    minimal: "Bouger le corps, même un minimum.",
    desc: "Endurance de base, éviter la stagnation physique.",
  },
  {
    id: "ax-lucidity",
    label: "Observation & lucidité",
    icon: "🧭",
    color: "#9B5DE5",
    minimal: "Observer avant de réagir.",
    desc: "Analyser les causes plutôt que les effets, garder une distance.",
  },
];

// Principes qui tournent jour après jour pour ancrer l'état d'esprit.
export const PRINCIPLES = [
  "Ce n'est pas ce que tu fais parfois qui compte, mais ce que tu fais systématiquement.",
  "L'action précède la motivation. La répétition crée la stabilité.",
  "La performance durable ne repose pas sur l'intensité, mais sur la répétition.",
  "Une action faible mais cohérente maintient la trajectoire.",
  "L'arrêt complet, même temporaire, est plus dangereux que la lenteur.",
  "Les efforts invisibles s'accumulent. La différence apparaît sur la durée.",
  "Agir sans dépendre de l'état du moment.",
  "La stabilité remplace la motivation.",
];

export function getPrincipleOfDay(date = new Date()) {
  const dayIndex = Math.floor(date.getTime() / 86400000);
  return PRINCIPLES[((dayIndex % PRINCIPLES.length) + PRINCIPLES.length) % PRINCIPLES.length];
}
