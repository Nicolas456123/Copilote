export type ReminderType = {
  id: string;
  label: string;
  emoji: string;
  body: string;
  defaultTimes: string[];
};

export const REMINDER_TYPES: Record<string, ReminderType> = {
  pitch: {
    id: 'pitch',
    label: 'Oreille absolue (LA 440)',
    emoji: '🎹',
    body: "Imagine le LA 440, puis vérifie.",
    defaultTimes: ['10:00', '14:00', '19:00'],
  },
  lucidReality: {
    id: 'lucidReality',
    label: 'Reality checks (rêve lucide)',
    emoji: '🌙',
    body: "Regarde tes mains. Es-tu en train de rêver ?",
    defaultTimes: ['09:00', '12:00', '15:00', '18:00', '21:00'],
  },
  lucidJournal: {
    id: 'lucidJournal',
    label: 'Journal de rêves (matin)',
    emoji: '📓',
    body: "Note tes rêves avant qu'ils s'effacent.",
    defaultTimes: ['07:30'],
  },
};

export type ReminderState = {
  enabled: boolean;
  times: string[];
};

export function defaultReminderState(): Record<string, ReminderState> {
  const obj: Record<string, ReminderState> = {};
  Object.values(REMINDER_TYPES).forEach((t) => {
    obj[t.id] = { enabled: false, times: [...t.defaultTimes] };
  });
  return obj;
}

export function notificationId(typeId: string, time: string): string {
  return `${typeId}_${time.replace(':', '')}`;
}

export function parseTime(time: string): { hour: number; minute: number } {
  const [h, m] = time.split(':');
  return { hour: Number(h), minute: Number(m) };
}
