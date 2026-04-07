import { useState, useEffect, useCallback } from 'react';
import { storage } from '../lib/storage';
import { DEFAULT_HABITS } from '../lib/constants';
import { getTodayKey, getWeekDates } from '../utils/time';

export function useHabits() {
  const [habits] = useState(DEFAULT_HABITS);
  const [habitLog, setHabitLog] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = storage.get("habitLog");
    if (saved) setHabitLog(saved);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) storage.set("habitLog", habitLog);
  }, [habitLog, loaded]);

  const today = getTodayKey();
  const todayHabits = habitLog[today] || {};

  const toggleHabit = useCallback((id) => {
    setHabitLog(prev => ({
      ...prev,
      [today]: { ...prev[today], [id]: !prev[today]?.[id] },
    }));
  }, [today]);

  const habitsToday = habits.filter(h => todayHabits[h.id]).length;
  const habitsTotal = habits.length;
  const habitsProgress = habitsTotal > 0 ? (habitsToday / habitsTotal) * 100 : 0;

  const weekDates = getWeekDates();
  const gymThisWeek = weekDates.filter(d => habitLog[d]?.gym).length;

  return {
    habits, habitLog, todayHabits, today,
    toggleHabit,
    habitsToday, habitsTotal, habitsProgress,
    weekDates, gymThisWeek,
    loaded,
  };
}
