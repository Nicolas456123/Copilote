export const LUCID_PROGRAM = [
  {
    week: 1,
    title: 'Fondations — se rappeler ses rêves',
    focus: 'Sans rappel, pas de lucidité. On installe la base.',
    technique: 'journal',
    lesson: `Avant de chercher la lucidité, ton cerveau doit pouvoir restituer ses rêves. C'est la marche numéro un — sauter cette étape est la raison #1 d'abandon.

**Protocole quotidien**
1. Carnet/téléphone à portée de main.
2. Au réveil : reste **immobile, yeux fermés**, laisse le rêve remonter avant tout mouvement.
3. Capte d'abord les fragments (émotions, couleurs, une image), puis déroule.
4. Écris au présent. Date chaque entrée. Note l'heure.
5. Si rien ne vient : écris "rien" — c'est important.
6. Avant de dormir : énonce mentalement "**je vais me rappeler mes rêves**".

**Attendu**
Progrès visible en 1-2 semaines, plusieurs pages de rappel possible en semaine 3.

**Pièges**
Alarme stridente (efface le rêve), ouvrir les yeux ou regarder le téléphone en premier, sauter les "nuits sans rêve".`,
    sources: [
      { label: 'Oneironauts — Dream recall', url: 'https://oneironauts.io/blog/dream_recall_article' },
      { label: 'Dream Network — 10 méthodes recall', url: 'https://dreamnetworkjournal.com/bcpov1zffway/ten-methods-for-improving-dream-recall' },
    ],
    dailyTasks: [
      { id: 'preSleepIntention', label: 'Avant de dormir : "je vais me rappeler mes rêves"' },
      { id: 'journal', label: 'Au réveil : noter rêve(s) ou "rien"', source: 'dreams' },
      { id: 'noScreens', label: 'Pas d\'écran 30 min avant le coucher' },
      { id: 'noCaffeineAfternoon', label: 'Pas de caféine après 14h' },
    ],
    tip: 'Immobile + yeux fermés au réveil. Le mouvement efface le rêve.',
  },
  {
    week: 2,
    title: 'Reality checks',
    focus: 'Installer le réflexe : tester la réalité plusieurs fois par jour.',
    technique: 'realityChecks',
    lesson: `Un reality check est un test rapide pour vérifier si tu rêves. À force de le faire éveillé, il finit par se déclencher dans tes rêves — et là il échoue, ce qui te rend lucide.

**Les 2 meilleurs (à combiner)**
- **Pince-nez** : pince ton nez, essaie de respirer. Si l'air passe → tu rêves. Fiabilité ~90%+.
- **Lecture** : lis un texte, détourne le regard, relis. Si ça change → tu rêves.

Pourquoi ces deux gagnent : résultat **binaire et indiscutable**. Compter les doigts ou sauter est plus ambigu.

**Combien**
10 à 15 par jour, ~10 secondes chacun. Toujours avec une question **sincère** : "et si c'était OUI cette fois ?"

**Quand**
Ancre-les à des déclencheurs : chaque passage de porte, chaque déverrouillage du téléphone, chaque fois que tu vois tes mains, après toute émotion ou événement bizarre.

**Le piège #1**
Faire le geste en pilote automatique. Si tu sais d'avance que tu es éveillé, ton cerveau apprend "je ne rêve jamais" — exactement l'inverse de ce qu'on veut.

**Étude Aspy 2017** : le reality check seul est faible. Ce qui marche, c'est sa combinaison avec MILD + WBTB (voir semaines 4-5).`,
    sources: [
      { label: 'Oneironauts — Reality checks', url: 'https://oneironauts.io/blog/reality-checks-for-lucid-dreaming' },
      { label: 'ScienceDaily — Aspy 2017', url: 'https://www.sciencedaily.com/releases/2017/10/171019100812.htm' },
    ],
    dailyTasks: [
      { id: 'journal', label: 'Journal de rêves', source: 'dreams' },
      { id: 'realityChecks', label: '10+ reality checks (pince-nez + lecture)', target: 10, source: 'rc' },
      { id: 'doorTrigger', label: 'Reality check à chaque passage de porte' },
    ],
    tip: 'Toujours 2 checks différents pour confirmer.',
  },
  {
    week: 3,
    title: 'Tes dream signs',
    focus: 'Identifier les motifs récurrents de TES rêves.',
    technique: 'dreamSigns',
    lesson: `Les dream signs sont les bizarreries qui reviennent dans tes rêves. Une fois identifiés, ils deviennent tes déclencheurs personnels de lucidité.

**Les 4 catégories de LaBerge**
- **Conscience intérieure** : pensées/émotions étranges, savoir des choses sans raison.
- **Action** : actions impossibles (voler, traverser un mur), comportements anormaux des autres.
- **Forme** : ton corps, des objets, des personnes distordus.
- **Contexte** : lieux ou situations impossibles (être dans ton école primaire à ton âge actuel).

**Cette semaine**
1. Relis tes 2 semaines de journal.
2. Surligne tout ce qui est bizarre.
3. Catégorise.
4. Garde ton **top 5**.
5. À chaque fois que tu croises un de ces 5 éveillé → reality check immédiat.
6. Ces 5 serviront aussi dans MILD (semaine 4).

**Normal de ne pas tout voir tout de suite** : les dream signs se révèlent surtout après plusieurs semaines de journal régulier.`,
    sources: [
      { label: 'Wikipedia — Lucid dream', url: 'https://en.wikipedia.org/wiki/Lucid_dream' },
      { label: 'LaBerge — A Course in Lucid Dreaming (PDF)', url: 'https://www.coronacircus.com/wp-content/uploads/2021/01/LaBerge-Stephen-Levitan-Lynne.-A-Course-in-Lucid-Dreaming.pdf' },
    ],
    dailyTasks: [
      { id: 'journal', label: 'Journal de rêves', source: 'dreams' },
      { id: 'realityChecks', label: '10+ reality checks', target: 10, source: 'rc' },
      { id: 'reviewJournal', label: 'Relire le journal et marquer les bizarreries' },
      { id: 'addDreamSign', label: 'Ajouter au moins 1 dream sign cette semaine', source: 'dreamSigns' },
    ],
    tip: 'Vise un top 5 personnel à la fin de la semaine.',
  },
  {
    week: 4,
    title: 'MILD — la technique reine',
    focus: 'Programmer ton cerveau à se souvenir qu\'il rêve.',
    technique: 'mild',
    lesson: `MILD = **Mnemonic Induction of Lucid Dreams** (Stephen LaBerge, 1980). La technique cognitive la plus étudiée — utilise la mémoire prospective (la même qui te fait penser à acheter du pain en rentrant).

**Protocole** (à chaque réveil nocturne, et avant de te rendormir)
1. Rappelle le rêve dont tu viens de te réveiller, **en détail**.
2. Répète mentalement : « **La prochaine fois que je rêve, je me rappellerai que je rêve.** » Avec **intention sincère** — pas en pilote automatique.
3. **Visualise-toi retourner dans ce rêve**, repérer un dream sign, et devenir lucide. Réécris la fin en lucide.
4. Alterne mantra et visualisation jusqu'à t'endormir.

La **dernière pensée** avant le sommeil doit être l'intention.

**Étude Aspy 2017** : les participants qui se rendorment en moins de 5 minutes après MILD ont **~46% de succès**. La vitesse compte autant que la technique.

**Pièges**
- Réciter le mantra sans intention.
- Visualiser sans engagement émotionnel.
- Rester éveillé trop longtemps après le protocole.`,
    sources: [
      { label: 'LaBerge — A Course in Lucid Dreaming (PDF)', url: 'https://www.coronacircus.com/wp-content/uploads/2021/01/LaBerge-Stephen-Levitan-Lynne.-A-Course-in-Lucid-Dreaming.pdf' },
      { label: 'Aspy 2017 — ResearchGate', url: 'https://www.researchgate.net/publication/319855294_Reality_testing_and_the_mnemonic_induction_of_lucid_dreams_Findings_from_the_national_Australian_lucid_dream_induction_study' },
    ],
    dailyTasks: [
      { id: 'journal', label: 'Journal de rêves', source: 'dreams' },
      { id: 'realityChecks', label: '10+ reality checks', target: 10, source: 'rc' },
      { id: 'mildBeforeSleep', label: 'MILD avant de dormir' },
      { id: 'mildNightWaking', label: 'MILD si réveil nocturne' },
    ],
    tip: 'La dernière pensée avant sommeil = l\'intention.',
  },
  {
    week: 5,
    title: 'WBTB + MILD',
    focus: 'Exploiter le REM dense de fin de nuit. La combinaison gagnante.',
    technique: 'wbtb',
    lesson: `**WBTB = Wake Back To Bed.** Le REM s'allonge en fin de nuit ; te réveiller à ce moment-là et te rendormir avec MILD multiplie les chances de lucidité.

**Protocole**
1. Dors **4h30 à 6h**.
2. Alarme douce. **Lève-toi vraiment** (sortir du lit).
3. Reste éveillé **30 à 60 minutes** (sweet spot étude Frontiers 2020). Actif mais calme : relire ton journal, lire sur le rêve lucide, visualiser ton intention.
4. **Pas d'écran lumineux. Pas de café.**
5. Retourne au lit. **MILD immédiatement.**

**Fréquence : 1 à 2 nuits par semaine MAX.** Plus = dette de sommeil. Week-end idéal.

**Pourquoi ça marche**
Pendant le REM tardif, ton cortex préfrontal (la conscience) est plus facile à engager. Tu rentres en REM avec une conscience semi-éveillée — état idéal pour la lucidité.

**Pièges**
Rester éveillé moins de 10 min (cortex pas assez activé), plus de 90 min (tu te rendors mal), faire WBTB toutes les nuits (épuisement).`,
    sources: [
      { label: 'Frontiers — Sleep & lucid dreaming (2020)', url: 'https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2020.01383/full' },
      { label: 'MDPI — Sleep cycle review', url: 'https://www.mdpi.com/2624-5175/4/2/21' },
    ],
    dailyTasks: [
      { id: 'journal', label: 'Journal de rêves', source: 'dreams' },
      { id: 'realityChecks', label: '10+ reality checks', target: 10, source: 'rc' },
      { id: 'mildBeforeSleep', label: 'MILD avant de dormir' },
      { id: 'wbtbSession', label: 'WBTB cette nuit (cible 1-2x/semaine)' },
    ],
    tip: 'Réserve WBTB au week-end pour éviter la dette de sommeil.',
  },
  {
    week: 6,
    title: 'SSILD — alternative à MILD',
    focus: 'Tester SSILD sur tes nuits WBTB, comparer.',
    technique: 'ssild',
    lesson: `**SSILD = Senses Initiated Lucid Dream** (Cosmic Iron, 2011). Le consensus communautaire la classe parmi les plus faciles pour débutants.

**À faire après WBTB** (4-6h de sommeil + 5 min éveillé), allongé confortablement.

**Échauffement** : 4-6 cycles rapides (~3-5 sec chacun) : Vue → Son → Toucher.

**Cycles principaux** : 3-4 cycles lents (~30 sec chacun) :
- **Vue** : observe le noir derrière tes paupières (sans forcer, sans chercher d'image).
- **Son** : écoute les sons ambiants ou internes.
- **Toucher** : ressens le poids du corps, la température, ta respiration.

Après les cycles : reprends une position naturelle, laisse-toi t'endormir normalement. Si tu te réveilles plus tard → reality check : tu rêves peut-être déjà.

**Pièges**
Trop forcer la concentration (SSILD marche par **relâchement**), sauter WBTB, faire SSILD toutes les nuits.

**Compare** : sur 2 nuits WBTB cette semaine, fais une MILD, une SSILD. Garde ce qui marche pour TON cerveau.`,
    sources: [
      { label: 'Cosmic Iron — Official SSILD guide', url: 'https://medium.com/@cosmiciron/the-official-ssild-guide-1d4557a13782' },
      { label: 'The Lucid Guide — SSILD', url: 'https://www.thelucidguide.com/techniques/senses-initiated-lucid-dream-(ssild)' },
    ],
    dailyTasks: [
      { id: 'journal', label: 'Journal de rêves', source: 'dreams' },
      { id: 'realityChecks', label: '10+ reality checks', target: 10, source: 'rc' },
      { id: 'wbtbSession', label: 'WBTB cette nuit' },
      { id: 'ssildOrMild', label: 'Tester SSILD au lieu de MILD (1-2x cette semaine)' },
    ],
    tip: 'Compare MILD vs SSILD sur 2 nuits, garde ce qui marche pour toi.',
  },
];

export const SLEEP_HYGIENE = `**Hygiène de sommeil pour le rêve lucide**
- **Caféine** : demi-vie 5-7h. Coupure début d'après-midi. Retarde le REM.
- **Alcool** : supprime le REM en début de nuit → rebond plus tard (rêves vifs mais fragmentés, mauvais rappel). Évite dans les 3h avant le coucher.
- **Écrans** : la lumière bleue retarde la mélatonine. Coupure 1-2h avant le coucher.
- **Horaire stable** : un réveil régulier stabilise tes fenêtres REM — indispensable pour WBTB.
- **REM rebound** : une nuit légèrement plus courte produit souvent un matin plus REM-dense le lendemain. Utile pour WBTB.`;

export const REALITY_CHECK_RANKING = [
  { name: 'Pince-nez', score: 'Élevée', note: 'Pince ton nez, essaie de respirer. Air qui passe = tu rêves. Binaire, indiscutable.' },
  { name: 'Lecture', score: 'Élevée', note: 'Lis, regarde ailleurs, relis. Le texte mute en rêve.' },
  { name: 'Horloge digitale', score: 'Élevée', note: 'Même mécanisme que la lecture — les chiffres changent.' },
  { name: 'Inspecter ses mains', score: 'Moyenne+', note: 'Doigts en trop, paumes qui fondent. Facile et visuel.' },
  { name: 'Doigt à travers la paume', score: 'Moyenne', note: 'En rêve le corps est souvent perméable.' },
  { name: 'Interrupteur', score: 'Moyenne', note: 'Les rêves simulent mal les changements de lumière.' },
  { name: 'Sauter / gravité', score: 'Faible', note: 'Ambigu — la physique du rêve peut imiter celle éveillée.' },
];

export const ASPY_2017 = `**Étude Aspy 2017 (Université d'Adélaïde)**
- N = 169 participants, 1 semaine d'entraînement après semaine de baseline.
- Combinaison MILD + reality testing + WBTB : **~17% de succès sur la semaine**.
- Parmi ceux qui se rendorment en **moins de 5 min** après MILD : **~46% de succès**.
- Reality testing seul : pas significatif. MILD seul : modeste. **C'est la combinaison qui marche.**
- Publiée dans *Dreaming* (APA), septembre 2017.`;

export const EXPECTATIONS = `**Combien de temps avant ton premier rêve lucide ?**
- Pratiquant régulier : médiane ~3-4 semaines, fourchette 1-8 semaines.
- Premiers rêves lucides souvent **courts** (quelques secondes), arrêtés par l'excitation.
- Rêves lucides stables et contrôlés : 2-6 mois de pratique.
- **Raison #1 d'échec** : sauter la phase journal/recall.`;
