export const DEFAULT_HABITS = [
  { id: 'wake', label: 'Levé 6h-7h', icon: '⏰' },
  { id: 'gym', label: 'Salle de sport', icon: '🏋️', target: 3, unit: '/sem' },
  { id: 'eat', label: 'Repas équilibré', icon: '🥗' },
  { id: 'learn', label: 'Apprendre quelque chose', icon: '📖' },
  { id: 'create', label: 'Créer (code/musique/jeu)', icon: '🎨' },
  { id: 'sleep', label: 'Couché avant 23h', icon: '🌙' },
] as const;

export type Habit = (typeof DEFAULT_HABITS)[number];
