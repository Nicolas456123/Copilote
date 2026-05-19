export type LucidWeek = {
  week: number;
  title: string;
  focus: string;
  lesson: string;
  tip: string;
  sources: { label: string; url: string }[];
  tasks: { id: string; label: string }[];
};

export const LUCID_PROGRAM: LucidWeek[] = [
  {
    week: 1,
    title: 'Se rappeler ses rêves',
    focus: 'Sans rappel, pas de lucidité. On pose les fondations.',
    lesson: `Avant de chercher la lucidité, ton cerveau doit pouvoir restituer ses rêves. Sauter cette étape est la raison #1 d'abandon.

Au réveil : reste immobile, yeux fermés. Laisse le rêve remonter avant tout mouvement. Capte d'abord les fragments (émotions, couleurs), puis déroule.

Si rien ne vient, écris "rien" — c'est important. Avant de dormir : énonce "je vais me rappeler mes rêves".`,
    tip: 'Immobile + yeux fermés au réveil. Le mouvement efface le rêve.',
    sources: [
      { label: 'Oneironauts — Dream recall', url: 'https://oneironauts.io/blog/dream_recall_article' },
    ],
    tasks: [
      { id: 'preSleepIntention', label: 'Intention avant de dormir' },
      { id: 'journal', label: 'Noter rêve(s) ou "rien" au réveil' },
      { id: 'noScreens', label: 'Pas d\'écran 30 min avant le coucher' },
      { id: 'noCaffeineAfternoon', label: 'Pas de caféine après 14h' },
    ],
  },
  {
    week: 2,
    title: 'Reality checks',
    focus: 'Tester la réalité plusieurs fois par jour.',
    lesson: `À force de tester éveillé, le geste finit par se déclencher dans tes rêves — il échoue, tu deviens lucide.

Les 2 meilleurs (à combiner) :
- Pince-nez : pince ton nez, essaie de respirer. Air qui passe → tu rêves.
- Lecture : lis, regarde ailleurs, relis. Si ça change → tu rêves.

10-15 par jour, ~10 secondes chacun. Toujours avec sincérité.`,
    tip: 'Toujours 2 checks différents pour confirmer.',
    sources: [
      { label: 'Oneironauts — Reality checks', url: 'https://oneironauts.io/blog/reality-checks-for-lucid-dreaming' },
      { label: 'Aspy 2017 (ScienceDaily)', url: 'https://www.sciencedaily.com/releases/2017/10/171019100812.htm' },
    ],
    tasks: [
      { id: 'journal', label: 'Journal de rêves' },
      { id: 'realityChecks', label: '10+ reality checks (pince-nez + lecture)' },
      { id: 'doorTrigger', label: 'Reality check à chaque passage de porte' },
    ],
  },
  {
    week: 3,
    title: 'Tes dream signs',
    focus: 'Identifier les motifs récurrents de TES rêves.',
    lesson: `Stephen LaBerge classe les dream signs en 4 catégories :
- Conscience intérieure (pensées étranges)
- Action (impossible)
- Forme (corps/objets distordus)
- Contexte (lieux impossibles)

Relis 2 semaines de journal. Surligne, catégorise. Garde top 5. Ces 5 deviennent tes déclencheurs personnels.`,
    tip: 'Top 5 personnel à la fin de la semaine.',
    sources: [
      { label: 'LaBerge — A Course in Lucid Dreaming', url: 'https://www.coronacircus.com/wp-content/uploads/2021/01/LaBerge-Stephen-Levitan-Lynne.-A-Course-in-Lucid-Dreaming.pdf' },
    ],
    tasks: [
      { id: 'journal', label: 'Journal de rêves' },
      { id: 'realityChecks', label: '10+ reality checks' },
      { id: 'reviewJournal', label: 'Relire le journal et marquer les bizarreries' },
      { id: 'addDreamSign', label: 'Ajouter au moins 1 dream sign' },
    ],
  },
  {
    week: 4,
    title: 'MILD — la technique reine',
    focus: 'Programmer ton cerveau à se souvenir qu\'il rêve.',
    lesson: `MILD = Mnemonic Induction of Lucid Dreams (LaBerge, 1980).

À chaque réveil nocturne :
1. Rappelle le rêve en détail
2. Répète : "La prochaine fois que je rêve, je me rappellerai que je rêve"
3. Visualise-toi retourner dans le rêve et devenir lucide
4. Alterne mantra/visualisation jusqu'à t'endormir

Étude Aspy 2017 : ceux qui se rendorment en moins de 5 min après MILD ont ~46% de succès.`,
    tip: 'La dernière pensée avant sommeil = l\'intention.',
    sources: [
      { label: 'Aspy 2017 — ResearchGate', url: 'https://www.researchgate.net/publication/319855294' },
    ],
    tasks: [
      { id: 'journal', label: 'Journal de rêves' },
      { id: 'realityChecks', label: '10+ reality checks' },
      { id: 'mildBeforeSleep', label: 'MILD avant de dormir' },
      { id: 'mildNightWaking', label: 'MILD si réveil nocturne' },
    ],
  },
  {
    week: 5,
    title: 'WBTB + MILD',
    focus: 'Exploiter le REM dense de fin de nuit.',
    lesson: `WBTB = Wake Back To Bed.

1. Dors 4h30 à 6h
2. Alarme douce, lève-toi vraiment
3. Reste éveillé 30-60 min, actif mais calme : journal, lecture lucide
4. PAS d'écran. PAS de café.
5. Retour au lit + MILD immédiatement

1-2 nuits par semaine MAX. Week-end idéal.`,
    tip: 'Réserve WBTB au week-end.',
    sources: [
      { label: 'Frontiers 2020 — Sleep & lucid dreaming', url: 'https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2020.01383/full' },
    ],
    tasks: [
      { id: 'journal', label: 'Journal de rêves' },
      { id: 'realityChecks', label: '10+ reality checks' },
      { id: 'mildBeforeSleep', label: 'MILD avant de dormir' },
      { id: 'wbtbSession', label: 'WBTB cette nuit (cible 1-2x/sem)' },
    ],
  },
  {
    week: 6,
    title: 'SSILD — alternative',
    focus: 'Tester SSILD sur tes nuits WBTB.',
    lesson: `SSILD = Senses Initiated Lucid Dream (Cosmic Iron, 2011). Plus facile pour beaucoup.

Après WBTB, allongé :
- 4-6 cycles rapides (~3-5 sec) : Vue → Son → Toucher
- Puis 3-4 cycles lents (~30 sec) sur chaque sens

Reprends position naturelle, laisse-toi t'endormir.

Compare avec MILD sur 2 nuits. Garde ce qui marche pour toi.`,
    tip: 'SSILD marche par relâchement, pas concentration.',
    sources: [
      { label: 'Cosmic Iron — SSILD officiel', url: 'https://medium.com/@cosmiciron/the-official-ssild-guide-1d4557a13782' },
    ],
    tasks: [
      { id: 'journal', label: 'Journal de rêves' },
      { id: 'realityChecks', label: '10+ reality checks' },
      { id: 'wbtbSession', label: 'WBTB cette nuit' },
      { id: 'ssildOrMild', label: 'Tester SSILD (1-2x cette semaine)' },
    ],
  },
];
