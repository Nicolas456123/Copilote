export const JOURNAL_QUESTIONS = [
  {
    id: "mood",
    question: "Comment tu te sens en ce moment ?",
    choices: [
      { emoji: "🔥", label: "En feu, motivé", value: "en_feu" },
      { emoji: "😊", label: "Bien, tranquille", value: "bien" },
      { emoji: "😔", label: "Fatigué ou découragé", value: "fatigue" },
    ],
  },
  {
    id: "energy",
    question: "Ton niveau d'énergie aujourd'hui ?",
    choices: [
      { emoji: "⚡", label: "Plein d'énergie", value: "haute" },
      { emoji: "🔋", label: "Correct, ça va", value: "moyenne" },
      { emoji: "🪫", label: "Vidé, épuisé", value: "basse" },
    ],
  },
  {
    id: "productive",
    question: "As-tu avancé sur quelque chose aujourd'hui ?",
    choices: [
      { emoji: "🚀", label: "Oui, bien avancé !", value: "beaucoup" },
      { emoji: "🐢", label: "Un peu, doucement", value: "un_peu" },
      { emoji: "😶", label: "Pas vraiment", value: "non" },
    ],
  },
  {
    id: "highlight",
    question: "Le moment fort de ta journée ?",
    choices: [
      { emoji: "💪", label: "Sport / Santé", value: "sport" },
      { emoji: "🎨", label: "Création (code, musique, jeu)", value: "creation" },
      { emoji: "🧘", label: "Repos / Détente", value: "repos" },
    ],
  },
  {
    id: "tomorrow",
    question: "Qu'est-ce que tu veux améliorer demain ?",
    choices: [
      { emoji: "⏰", label: "Me lever plus tôt", value: "reveil" },
      { emoji: "🎯", label: "Rester concentré", value: "focus" },
      { emoji: "🌙", label: "Me coucher à l'heure", value: "coucher" },
    ],
  },
];
