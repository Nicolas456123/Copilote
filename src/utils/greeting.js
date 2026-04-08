export function getGreeting() {
  const h = new Date().getHours();
  if (h < 6) return "Tu devrais dormir 😴";
  if (h < 12) return "Bonjour Nicolas ☀️";
  if (h < 18) return "Bon après-midi 💪";
  if (h < 22) return "Bonne soirée 🌙";
  return "Il se fait tard… 🌙";
}

export function getBedtimeWarning() {
  const h = new Date().getHours();
  if (h >= 23 || h < 5) return "⚠️ Il est tard ! Pense à dormir.";
  if (h >= 22) return "🌙 Commence à ralentir…";
  return null;
}
