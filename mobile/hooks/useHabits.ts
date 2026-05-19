import { useCallback, useEffect, useState } from 'react';
import { storage } from '../lib/storage';
import { DEFAULT_HABITS } from '../lib/constants';

const KEY = 'habitLog';

export type HabitLog = Record<string, Record<string, boolean>>;

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getWeekDates(): string[] {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  });
}

const DAY_NAMES = ['di', 'lu', 'ma', 'me', 'je', 've', 'sa'];
export function getDayName(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  return DAY_NAMES[new Date(y, m - 1, d).getDay()] || '';
}

export function useHabits() {
  const [log, setLog] = useState<HabitLog>({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      setLog((await storage.get<HabitLog>(KEY)) || {});
      setLoaded(true);
    })();
  }, []);

  const today = todayKey();
  const todayHabits = log[today] || {};
  const habitsToday = DEFAULT_HABITS.filter((h) => todayHabits[h.id]).length;
  const habitsTotal = DEFAULT_HABITS.length;
  const weekDates = getWeekDates();
  const gymThisWeek = weekDates.filter((d) => log[d]?.gym).length;

  const toggleHabit = useCallback((id: string) => {
    setLog((prev) => {
      const next = {
        ...prev,
        [today]: { ...prev[today], [id]: !prev[today]?.[id] },
      };
      storage.set(KEY, next);
      return next;
    });
  }, [today]);

  return {
    habits: DEFAULT_HABITS,
    log,
    today,
    todayHabits,
    habitsToday,
    habitsTotal,
    weekDates,
    gymThisWeek,
    toggleHabit,
    loaded,
  };
}
