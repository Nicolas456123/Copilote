// Entraînement de diction — régulier, court, concret. Exercices en français
// classés par palier (niveau 0–100 → 5 paliers), pour rouler dans la boucle
// d'action de l'app (« L'instant » + Lock-in). Pas de page à part : la diction
// se travaille comme n'importe quel axe.

export const VIRELANGUES = [
  "Un chasseur sachant chasser doit savoir chasser sans son chien.",
  "Les chaussettes de l'archiduchesse sont-elles sèches, archi-sèches ?",
  "Ton thé t'a-t-il ôté ta toux ?",
  "Trois tortues trottaient sur trois toits très étroits.",
  "Si six scies scient six cyprès, six cents scies scient six cents cyprès.",
  "Didon dîna, dit-on, du dos d'un dodu dindon.",
  "Je veux et j'exige d'exquises excuses.",
  "Tes laitues naissent-elles ? Si tes laitues naissent, mes laitues naîtront.",
  "La pie niche haut, l'oie niche bas, où niche l'hibou ?",
  "Natacha n'attacha pas son chat Pacha qui s'échappa.",
];

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

// Un exercice concret, calibré sur le palier du niveau (0–100).
export function dictionExercise(level = 0) {
  const t = Math.min(4, Math.max(0, Math.floor(level / 20)));
  const vl = rand(VIRELANGUES);
  const pools = [
    [ // 0 — Découverte : le corps avant les mots
      { action: "Échauffement : bâille grand, fais vibrer tes lèvres (brrr) 30 s, puis A-E-I-O-U bien ouverts ×5.", minutes: 5 },
      { action: "Souffle : inspire 4 s par le ventre, expire 8 s sur un « ssss » régulier. Répète ×6.", minutes: 5 },
      { action: "Articule au ralenti, exagéré : ba-be-bi-bo-bu / ta-te-ti-to-tu / ka-ke-ki-ko-ku.", minutes: 6 },
    ],
    [ // 1 — Initiation : exagérer l'articulation
      { action: `Virelangue au ralenti, sur-articulé ×3 : « ${vl} »`, minutes: 6 },
      { action: "Lis un paragraphe avec un stylo entre les dents, puis enlève-le et relis : sens la netteté.", minutes: 7 },
      { action: "Détache les fins de mots : lis 5 phrases en marquant nettement la dernière consonne de chaque mot.", minutes: 6 },
    ],
    [ // 2 — Pratique : vitesse et lecture
      { action: `Virelangue « ${vl} » : lent ×2, puis de plus en plus vite ×3 sans bafouiller.`, minutes: 7 },
      { action: "Lecture à voix haute, débit lent et posé, avec une vraie pause à chaque point. 1 page.", minutes: 8 },
      { action: "Sons durs (R, S, CH) : prends 3 mots difficiles, répète chacun 10 fois, bien propres.", minutes: 7 },
    ],
    [ // 3 — Aisance : s'enregistrer
      { action: `Enregistre-toi sur « ${vl} » (vite ×3), réécoute, repère le son qui glisse, refais-le propre.`, minutes: 9 },
      { action: "Enregistre 1 min de lecture à voix haute, puis réécoute : note débit, fins de mots, pauses.", minutes: 9 },
      { action: "Débit : lis un texte 30 % plus lentement que ton réflexe, articulation pleine, sans traîner.", minutes: 8 },
    ],
    [ // 4 — Maîtrise : en conditions réelles
      { action: "Improvise 1 min sur un sujet au hasard (enregistré) : diction nette, débit maîtrisé. Réécoute, 1 correction.", minutes: 10 },
      { action: `Enchaîne 3 virelangues durs, vite et sans faute : « ${vl} » puis deux de ton choix.`, minutes: 9 },
      { action: "Lis « comme un présentateur » : projection, intention, pauses, fins de mots ciselées. Enregistre-toi.", minutes: 10 },
    ],
  ];
  const ex = rand(pools[t]);
  return { action: ex.action, minutes: ex.minutes, rationale: "Diction — calibré sur ton palier." };
}

// L'axe Diction prêt à l'emploi, avec une première action déjà posée (stable).
export function dictionSkill() {
  const ex = dictionExercise(20);
  return {
    id: `sk-diction-${Date.now()}`,
    name: "Diction",
    domain: "learning",
    kind: "diction",
    level: 20,
    longTerm: "Une diction nette et un débit maîtrisé, à l'oral comme en public.",
    midTerm: "Articuler les virelangues moyens, vite et sans bafouiller.",
    active: true,
    currentAction: { ...ex, ai: false, at: new Date().toISOString() },
    history: [],
    updatedAt: new Date(0).toISOString(), // « jamais touché » → proposé en premier
  };
}
