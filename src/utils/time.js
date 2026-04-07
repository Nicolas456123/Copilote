export function formatTime(s) {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  return h > 0
    ? `${h}h${String(m).padStart(2, "0")}`
    : `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export function getWeekId() {
  const d = new Date();
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d - jan1) / 86400000 + jan1.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

export function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

export function getWeekDates() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return Array.from({ length: 7 }, (_, i) => {
    const date = new Date(d);
    date.setDate(diff + i);
    return date.toISOString().slice(0, 10);
  });
}

export function getDayName(dateStr) {
  return new Date(dateStr).toLocaleDateString("fr-FR", { weekday: "short" }).slice(0, 2);
}

export function getMonthDates(year, month) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const dates = [];
  // Pad start of week
  const startPad = (firstDay.getDay() + 6) % 7; // Monday = 0
  for (let i = startPad - 1; i >= 0; i--) {
    const d = new Date(year, month, -i);
    dates.push({ date: d.toISOString().slice(0, 10), currentMonth: false });
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const d = new Date(year, month, i);
    dates.push({ date: d.toISOString().slice(0, 10), currentMonth: true });
  }
  // Pad end
  while (dates.length % 7 !== 0) {
    const d = new Date(year, month + 1, dates.length - startPad - lastDay.getDate() + 1);
    dates.push({ date: d.toISOString().slice(0, 10), currentMonth: false });
  }
  return dates;
}
