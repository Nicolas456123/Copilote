# Copilote — App native (Expo)

Version iOS native de Copilote. Construite avec Expo + Expo Router + NativeWind.

## Pourquoi cette version

La version web (PWA) atteint ses limites sur iPhone :
- Les notifications planifiées ne sonnent pas quand l'app est fermée
- Pas d'accès aux APIs natives iOS

Cette version résout ça avec **expo-notifications** : les rappels sont programmés par iOS lui-même et sonnent même app complètement fermée. Pas besoin d'export Calendrier.

## Lancer en dev

Prérequis : Node 20+, l'app **Expo Go** installée sur ton iPhone (gratuite, App Store).

```bash
cd mobile
npm install
npm start
```

Scanne le QR code affiché dans le terminal avec l'appareil photo iPhone → Expo Go ouvre l'app.

## Tester les notifications

1. Onglet **Rappels**
2. "🔔 Activer les notifications" → autorise dans iOS
3. "🧪 Tester une notification" → une notif arrive immédiatement
4. Active un type, ajoute un horaire dans 1-2 minutes
5. Ferme **complètement** Expo Go (swipe up) → la notif arrivera quand même à l'heure dite

## Structure

```
mobile/
├── app/                 # Expo Router (file-based)
│   ├── _layout.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx        # Accueil
│       ├── rappels.tsx      # Configuration notifs
│       └── reve-lucide.tsx  # Reality checks + journal
├── components/
│   └── Card.tsx
├── hooks/
│   └── useReminders.ts
├── lib/
│   ├── notifications.ts     # wrapper expo-notifications
│   ├── reminders.ts         # types + helpers
│   └── storage.ts           # AsyncStorage wrapper
├── global.css               # NativeWind base
├── tailwind.config.js
├── babel.config.js
├── metro.config.js
├── app.json                 # config Expo
└── package.json
```

## Roadmap

- [x] Scaffold + nav 3 onglets
- [x] Reminders avec notifications natives planifiées
- [x] Reality checks + journal de rêves (basique)
- [ ] Accueil avec greeting + badges
- [ ] Habitudes
- [ ] Projets (hiérarchiques + IA)
- [ ] Focus timer (avec haptics)
- [ ] Journal Manson
- [ ] Programme rêve lucide 6 semaines
- [ ] Oreille absolue avec expo-av (vrai son natif)
- [ ] Thème sombre via useColorScheme + NativeWind

## Quand sortir du sous-dossier

Le projet vit dans `mobile/` du repo Copilote. Pour l'extraire en repo propre :

```bash
git subtree split --prefix=mobile -b mobile-only
# Crée le nouveau repo sur GitHub
git push <nouveau-remote> mobile-only:main
```

## Vers TestFlight / App Store

Quand tu prends ton compte Apple Developer (99 €/an) :

```bash
npm install -g eas-cli
eas login
eas build --platform ios
eas submit --platform ios
```

EAS Build compile dans le cloud (pas besoin de Mac).
