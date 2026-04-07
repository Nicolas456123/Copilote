# COPILOTE — Vision & Contexte complet

## Qui suis-je

Je suis Nicolas, ingénieur bâtiment (chargé d'affaires BTP). Je gère plusieurs chantiers en simultané au travail, et en parallèle j'ai de nombreux projets personnels ambitieux. Je me sens souvent débordé et découragé par l'ampleur de tout ça, mais je refuse de lâcher. J'ai tendance à m'hyperfocaliser sur un projet et oublier le reste, à me coucher trop tard, et j'ai la flemme des corvées (courses, vaisselle, ménage). Je veux m'améliorer un peu chaque jour.

## Mes projets actifs

### 🎮 Game Dev
- **Hybelior** — Mon jeu vidéo sur Unreal Engine (inclut du multijoueur)
- **Hybelior Lore** — Site web avec le lore/univers du jeu, un livre déjà commencé → https://hybelior-world-site.vercel.app/

### 🎵 Musique (FL Studio)
- Productions **electro**
- Compositions **orchestrales**
- Écriture de **chansons pop** (dont "Falling Again" en cours)

### 🏗️ Travail
- **ChantierHub** — App de gestion de chantier déjà bien avancée → https://chantierhub.vercel.app

### 📚 Apprentissage
- **Curiosita** — App d'apprentissage que j'ai créée, à perfectionner → https://nicolas456123.github.io/Curiosita/
- Apprendre l'**italien** et l'**allemand**
- Passer le **code moto**
- **Culture générale & sciences**

### 💪 Santé & Vie quotidienne
- **MiamWeek** — App de planification repas/courses → https://miamweek.vercel.app
- Salle de sport **3x/semaine**
- Se réveiller entre **6h et 7h**
- Améliorer mon **alimentation**

## Ce qu'on a construit jusqu'ici

On a créé un prototype React (fichier unique `copilote.jsx`) dans Claude.ai avec les features suivantes :

### Accueil (Dashboard)
- Salutation contextuelle (heure du jour, alerte si tard le soir)
- Streak de jours consécutifs
- Badges rapides : streak, gym X/3, habitudes X/6
- **Copilote IA** : bloc avec 4 boutons qui appellent l'API Claude (Sonnet) :
  - "J'ai la flemme" → motivation personnalisée
  - "Recentre-moi" → dit quoi faire maintenant
  - "Planifier la semaine" → propose 2-3 priorités
  - "Bravo à moi" → célébration de l'avancement
- Focus de la semaine : 2-3 projets marqués prioritaires (⭐)
- "Mon Pourquoi" : texte personnel de motivation toujours visible
- Vue d'ensemble des 6 domaines avec barres de progression
- Liens rapides vers mes outils (ChantierHub, Curiosita, MiamWeek, Hybelior)

### Habitudes (tracker quotidien)
- 6 habitudes : Levé 6-7h, Salle de sport, Repas équilibré, Apprendre, Créer, Couché avant 23h
- Compteur gym hebdomadaire (X/3)
- Vue semaine avec dots de progression par jour

### Projets (par domaine)
- Filtrable par domaine (Game Dev, Musique, Travail, Apprentissage, Santé, Quotidien)
- Chaque projet a des étapes cochables (progression auto-calculée)
- **5 boutons IA par projet** qui appellent Claude :
  - 🔪 Découper → génère 5-8 étapes concrètes
  - 💡 Conseil → conseil personnalisé pour avancer
  - 🔄 Réorganiser → remet les étapes dans l'ordre optimal
  - ⚡ Débloquer → identifie ce qui bloque et propose une solution
  - 🎉 Célébrer → félicite l'avancement
- 🔍 sur chaque étape → sous-découpe en sous-étapes
- Ajout manuel d'étapes
- Étoile ⭐ pour marquer un projet comme focus de la semaine

### Focus (timer)
- Sélection d'une étape de projet
- Timer avec alerte à 60 min (anti-hyperfocus)
- Pause / Arrêter

## Ce que je veux maintenant

Transforme ce prototype en une **vraie application** complète et déployable. Voici ce que j'attends :

1. **Architecture propre** — Multi-fichiers, composants séparés, routing (React Router)
2. **Persistance** — Base de données (Supabase, Firebase, ou autre) pour que mes données soient sauvegardées et synchronisées
3. **Intégration Claude AI** — Les boutons IA doivent appeler l'API Anthropic (clé en variable d'env). Le system prompt doit contenir tout mon contexte (projets, habitudes, streak, pourquoi)
4. **Notifications / Rappels** — Notifications push ou alertes pour : réveil, rappel gym, alerte coucher tard, rappels d'habitudes
5. **PWA** — Installable sur mon téléphone comme une app native
6. **Design** — Garder l'esthétique chaude actuelle (palette : #3D405B, #E07A5F, #81B29A, #F2CC8F, fond #FFF8F0, font Nunito)
7. **Déploiement** — Prêt à déployer sur Vercel

## Stack technique
- React + Vite
- Tailwind ou CSS-in-JS (au choix selon ce qui est le plus propre)
- Supabase ou Firebase pour le backend
- API Anthropic pour l'IA
- PWA avec service worker
- Déploiement Vercel

## Priorité
Commence par l'architecture et le routing, puis les composants un par un. Demande-moi si tu as besoin de précisions. Le fichier `copilote.jsx` actuel est dans le dossier comme référence.
