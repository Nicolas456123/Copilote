# Copilote

Mon compagnon de vie personnel : une app qui m'aide à garder le cap sur mes
projets (game dev, musique, travail, apprentissage, santé), à tenir mes
habitudes au quotidien, et à ne pas me laisser déborder. Un copilote dopé à
l'IA (Claude) qui me recentre, découpe mes projets en étapes et célèbre mes
avancées.

> Le contexte et la vision détaillée sont dans [`COPILOTE_VISION.md`](./COPILOTE_VISION.md).

## Fonctionnalités

- **Accueil** — cap du jour, streak, focus de la semaine, copilote IA (« recentre-moi », « j'ai la flemme », planification…).
- **Habitudes** — tracker quotidien (lever tôt, sport, repas, apprendre, créer, coucher tôt) avec vue semaine.
- **Projets** — projets hiérarchiques par domaine, étapes cochables, actions IA (découper, conseil, débloquer, célébrer).
- **Focus** — timer anti-hyperfocus avec alerte à 60 min.
- **Journal** — check-in d'humeur guidé par questions + historique (calendrier).
- **PWA** — installable sur téléphone, fonctionne hors-ligne (service worker).

## Stack

| Partie | Techno |
|--------|--------|
| **Web** (`src/`) | React 19 + Vite + Tailwind CSS v4 + React Router 7 + PWA (`vite-plugin-pwa`) |
| **API** (`api/`) | Fonctions serverless Vercel, base Turso/libSQL (`@libsql/client`), IA via l'API Claude (Anthropic) |
| **Mobile** (`mobile/`) | Expo (SDK 54) + Expo Router + NativeWind |

## Structure

```
.
├── src/            # App web (pages, composants, hooks, lib)
├── api/            # Fonctions serverless (Vercel) : IA, projets, habitudes, journal…
├── mobile/         # App native Expo / React Native
├── public/         # Assets statiques (favicon…)
├── index.html      # Point d'entrée web
└── vite.config.js  # Config Vite + PWA
```

## Démarrage (web)

```bash
npm install
npm run dev        # serveur de dev Vite (http://localhost:5173)
npm run build      # build de production
npm run preview    # prévisualise le build
npm run lint       # ESLint
```

## Démarrage (mobile)

```bash
cd mobile
npm install
npm start          # Expo (puis i / a / w pour iOS / Android / web)
```

## Variables d'environnement

À définir côté serveur (Vercel ou `.env.local`) pour faire tourner l'API :

| Variable | Usage |
|----------|-------|
| `ANTHROPIC_API_KEY` | Clé API Claude (actions IA) |
| `TURSO_DATABASE_URL` | URL de la base Turso/libSQL |
| `TURSO_AUTH_TOKEN` | Token d'auth Turso |

## Déploiement

Pensé pour **Vercel** : le front est servi en statique et les fichiers de
`api/` deviennent des fonctions serverless (voir `vercel.json`).
