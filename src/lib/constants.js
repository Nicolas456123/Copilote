export const DOMAINS = {
  gamedev: { label: "Game Dev", icon: "🎮", color: "#9B5DE5", desc: "Hybelior & Unreal Engine" },
  music: { label: "Musique", icon: "🎵", color: "#F15BB5", desc: "Electro, Orchestral, Pop" },
  work: { label: "Travail", icon: "🏗️", color: "#E07A5F", desc: "BTP & ChantierHub" },
  learning: { label: "Apprentissage", icon: "📚", color: "#00BBF9", desc: "Langues, Sciences, Culture" },
  health: { label: "Santé", icon: "💪", color: "#81B29A", desc: "Sport, Sommeil, Alimentation" },
  daily: { label: "Quotidien", icon: "🏠", color: "#F2CC8F", desc: "Courses, Maison, Admin" },
};

export const DEFAULT_PROJECTS = [
  { domain: "gamedev", name: "Hybelior - Jeu vidéo", link: "", steps: [] },
  { domain: "gamedev", name: "Hybelior - Lore & Livre", link: "https://hybelior-world-site.vercel.app/", steps: [] },
  { domain: "music", name: "Falling Again (chanson)", link: "", steps: [] },
  { domain: "music", name: "Productions Electro", link: "", steps: [] },
  { domain: "music", name: "Compositions Orchestrales", link: "", steps: [] },
  { domain: "work", name: "ChantierHub", link: "https://chantierhub.vercel.app", steps: [] },
  { domain: "learning", name: "Curiosita (app)", link: "https://nicolas456123.github.io/Curiosita/", steps: [] },
  { domain: "learning", name: "Apprendre l'Italien", link: "", steps: [] },
  { domain: "learning", name: "Apprendre l'Allemand", link: "", steps: [] },
  { domain: "learning", name: "Code Moto", link: "", steps: [] },
  { domain: "learning", name: "Culture Générale & Sciences", link: "", steps: [] },
  { domain: "health", name: "MiamWeek (alimentation)", link: "https://miamweek.vercel.app", steps: [] },
];

export const DEFAULT_HABITS = [
  { id: "wake", label: "Levé 6h-7h", icon: "⏰", domain: "health" },
  { id: "gym", label: "Salle de sport", icon: "🏋️", domain: "health", target: 3, unit: "/sem" },
  { id: "eat", label: "Repas équilibré", icon: "🥗", domain: "health" },
  { id: "learn", label: "Apprendre quelque chose", icon: "📖", domain: "learning" },
  { id: "create", label: "Créer (code/musique/jeu)", icon: "🎨", domain: "gamedev" },
  { id: "sleep", label: "Couché avant 23h", icon: "🌙", domain: "health" },
];

export const NICOLAS_CONTEXT = `Tu es le copilote de vie de Nicolas. Il est ingénieur bâtiment (chargé d'affaires BTP) et gère de nombreux projets personnels ambitieux en parallèle de son travail :
- 🎮 Hybelior : un jeu vidéo sur Unreal Engine (avec un site de lore et un livre déjà commencé)
- 🎵 Musique : productions electro, compositions orchestrales, chansons pop (dont "Falling Again") sur FL Studio
- 🏗️ ChantierHub : un outil de gestion de chantier déjà bien avancé
- 📚 Apprentissage : app Curiosita, langues (italien + allemand), code moto, culture générale et sciences
- 💪 Santé : salle de sport 3x/semaine, réveil 6-7h, alimentation (app MiamWeek)
Il se sent souvent débordé et découragé par l'ampleur de tout ça, mais il refuse de lâcher. Il a tendance à s'hyperfocaliser et à se coucher tard. Il a la flemme des corvées. Ton rôle : l'aider à avancer sans se noyer, le motiver, le cadrer, et lui rappeler que chaque petit pas compte. Sois concis (3-5 phrases max), chaleureux, direct. Français. Pas de listes à puces.`;

export const MOOD_OPTIONS = [
  { emoji: "🔥", label: "En feu", value: 5 },
  { emoji: "😊", label: "Bien", value: 4 },
  { emoji: "😐", label: "Neutre", value: 3 },
  { emoji: "😔", label: "Difficile", value: 2 },
  { emoji: "😴", label: "Fatigué", value: 1 },
];

export const REASON_TAGS = {
  positive: [
    "Journée productive",
    "Progrès sur un projet",
    "Bonne séance sport",
    "Bien dormi",
    "Mangé équilibré",
    "Moment créatif",
  ],
  negative: [
    "Procrastination",
    "Fatigue",
    "Couché trop tard",
    "Dispersé",
    "Pas de sport",
    "Stress travail",
  ],
  neutral: [
    "Routine",
    "Journée normale",
    "Travail chargé",
    "Repos mérité",
  ],
};

export const QUICK_LINKS = [
  { label: "ChantierHub", url: "https://chantierhub.vercel.app", icon: "🏗️" },
  { label: "Curiosita", url: "https://nicolas456123.github.io/Curiosita/", icon: "📚" },
  { label: "MiamWeek", url: "https://miamweek.vercel.app", icon: "🥗" },
  { label: "Hybelior Lore", url: "https://hybelior-world-site.vercel.app/", icon: "🎮" },
];

export const XP_REWARDS = {
  habit: 10,
  projectStep: 25,
  focusSession: 50,
  journal: 100,
};

export const XP_PER_LEVEL = 500;
