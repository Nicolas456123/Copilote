export const MANSON_VALUES = [
  {
    id: "responsibility",
    icon: "🎯",
    title: "La responsabilité radicale",
    pitch: "Prendre la responsabilité de tout ce qui nous arrive dans la vie, sans nous occuper de désigner un coupable.",
    trigger: "Quand un sous-traitant déconne, quand un projet n'avance pas. Le réflexe c'est de chercher pourquoi : charge, ils ont mal compris, j'ai pas le temps. Pas de qui c'est la faute. Quoi maintenant.",
    color: "#E07A5F",
  },
  {
    id: "uncertainty",
    icon: "🌫️",
    title: "L'incertitude",
    pitch: "Reconnaître notre propre ignorance et cultiver le doute permanent quant à nos propres croyances.",
    trigger: "Quand tu es sûr de ta solution — technique sur chantier, design dans Hybelior, mix sur un morceau. C'est exactement à ce moment-là qu'il faut douter. Chaque \"je sais ce qui marche\" est une porte qui se ferme.",
    color: "#9B5DE5",
  },
  {
    id: "failure",
    icon: "💥",
    title: "L'échec",
    pitch: "Être disposé à prendre connaissance de nos défauts, de nos erreurs, pour y remédier.",
    trigger: "Quand un truc n'est pas bon du premier coup — une compo, un prototype Unreal, une routine qui foire au bout de 4 jours. Le piège c'est l'abandon déguisé en perfectionnisme. Le mauvais d'abord, le bon ensuite.",
    color: "#F2CC8F",
  },
  {
    id: "rejection",
    icon: "🚫",
    title: "Le rejet",
    pitch: "La capacité à dire et à entendre « non » pour définir clairement ce qu'on accepte et n'accepte pas dans la vie.",
    trigger: "Quand tu as l'envie d'ouvrir un nouveau projet alors que quatre tournent déjà. Quand on te demande de rester tard. Quand un sous-traitant pousse un délai irréaliste. Dire non protège ce qui compte.",
    color: "#3D405B",
  },
  {
    id: "mortality",
    icon: "⏳",
    title: "La contemplation de notre condition de mortel",
    pitch: "Considérer sérieusement notre propre mort est ce qui nous aidera à relativiser toutes les autres valeurs.",
    trigger: "Le soir, au moment où tu choisis ton hyperfocus. Trois heures à 1h du matin sur Copilote ou sur Hybelior — ce n'est pas neutre. Si tu meurs dans dix ans, lequel tu regretteras ?",
    color: "#81B29A",
  },
];

export const MANSON_PRINCIPLES = [
  "Toujours rechercher des expériences positives engendre souvent, au final, des expériences négatives.",
  "Toute action comporte un sacrifice associé, et on doit l'accepter : tout ce qui nous fait nous sentir bien va à un moment nous faire nous sentir mal.",
  "Il est capital d'apprendre à établir des priorités afin de focaliser son attention sur ce qui en vaut vraiment la peine.",
  "Se simplifier la vie contribue à faire de soi quelqu'un de vraiment heureux.",
  "Les problèmes et les souffrances font partie intégrante de la vie et sont inévitables ; à nous donc de savoir nous créer de « bons » problèmes.",
  "Chacun est responsable de son interprétation et de ses réactions face aux événements. Il est indispensable d'en prendre l'entière responsabilité.",
  "L'action est source de motivation ; ce n'est pas seulement la motivation qui crée l'action.",
  "Notre existence n'a rien d'exceptionnelle. L'accepter nous rend libre. L'extraordinaire se trouve dans l'ordinaire.",
  "Le « plus » n'est pas le « mieux ».",
  "On est dans une perpétuelle quête de vérité (qu'on n'atteint jamais) : on se trompe tout le temps et juste un peu moins au fur et à mesure de nos apprentissages dans la vie.",
  "Renoncer à certaines expériences permet de vivre la plénitude et la profondeur de celles pour lesquelles on aura choisi de s'engager.",
  "La mort est ce qui donne du sens à la vie.",
];

export function getDailyPrinciple(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const dayOfYear = Math.floor(diff / 86400000);
  return {
    text: MANSON_PRINCIPLES[dayOfYear % MANSON_PRINCIPLES.length],
    index: dayOfYear % MANSON_PRINCIPLES.length,
  };
}

export const MANSON_FALSE_VALUES = [
  {
    id: "pleasure",
    icon: "🍭",
    title: "Le plaisir",
    pitch: "Le plaisir n'est pas la cause du bonheur, il en est un effet.",
    detail: "La forme de satisfaction la plus superficielle et la plus facile à obtenir — donc à perdre. Nécessaire à dose, jamais suffisant.",
  },
  {
    id: "wealth",
    icon: "💰",
    title: "La réussite matérielle",
    pitch: "Une fois les besoins fondamentaux couverts, la corrélation avec le bonheur est quasi nulle.",
    detail: "Au-delà de la nourriture et de l'abri, gagner plus n'apporte plus rien sur le bonheur — la recherche est claire là-dessus.",
  },
  {
    id: "rightness",
    icon: "☝️",
    title: "Avoir toujours raison",
    pitch: "Avoir toujours le dernier mot, c'est s'interdire de tirer leçon de ses erreurs.",
    detail: "Si tu ne peux pas voir les choses sous un autre angle, tu fermes la porte à toute expérience. Pas d'apprentissage possible.",
  },
  {
    id: "positivity",
    icon: "😀",
    title: "Rester positif quoi qu'il arrive",
    pitch: "La vie est parfois juste nulle à chier. C'est OK d'exprimer le négatif.",
    detail: "Le bon côté des choses a ses avantages, mais nier le négatif est un piège. À exprimer sainement, en accord avec tes valeurs.",
  },
];
