import { REMINDER_TYPES } from '../hooks/useReminders';

function pad(n) { return String(n).padStart(2, '0'); }

function utcStamp(d = new Date()) {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`;
}

function localDate(d = new Date()) {
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
}

function escapeText(s) {
  return String(s).replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

function foldLine(line) {
  if (line.length <= 75) return line;
  const out = [];
  let i = 0;
  while (i < line.length) {
    out.push((i === 0 ? '' : ' ') + line.slice(i, i + 73));
    i += 73;
  }
  return out.join('\r\n');
}

export function buildICS(state) {
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Copilote//Rappels//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Copilote — Rappels',
    'X-APPLE-CALENDAR-COLOR:#E07A5F',
  ];
  const stamp = utcStamp();
  const today = localDate();

  Object.values(REMINDER_TYPES).forEach(type => {
    const s = state[type.id];
    if (!s || !s.enabled) return;
    s.times.forEach(time => {
      const [hh, mm] = time.split(':');
      const uid = `copilote-${type.id}-${hh}${mm}@copilote.app`;
      const dtStart = `${today}T${hh}${mm}00`;
      const summary = `${type.emoji} ${type.label}`;
      lines.push(
        'BEGIN:VEVENT',
        foldLine(`UID:${uid}`),
        `DTSTAMP:${stamp}`,
        `DTSTART:${dtStart}`,
        'DURATION:PT5M',
        'RRULE:FREQ=DAILY',
        foldLine(`SUMMARY:${escapeText(summary)}`),
        foldLine(`DESCRIPTION:${escapeText(type.body)}`),
        'BEGIN:VALARM',
        'ACTION:DISPLAY',
        foldLine(`DESCRIPTION:${escapeText(summary)}`),
        'TRIGGER:-PT0M',
        'END:VALARM',
        'END:VEVENT',
      );
    });
  });

  lines.push('END:VCALENDAR');
  return lines.join('\r\n');
}

export function downloadICS(state) {
  const ics = buildICS(state);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'copilote-rappels.ics';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
