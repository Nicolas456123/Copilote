import { useState, useEffect, useCallback } from 'react';
import { fetchHabitLog, toggleHabitAPI } from '../lib/api';
import { DEFAULT_HABITS } from '../lib/constants';
import { getTodayKey, getWeekDates } from '../utils/time';

export function useHabits() {
  const [habits] = useState(DEFAULT_HABITS);
  const [habitLog, setHabitLog] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchHabitLog()
      .then(data => setHabitLog(data))
      .catch(err => console.error("Failed to fetch habits:", err))
      .finally(() => setLoaded(true));
  }, []);

  const today = getTodayKey();
  const todayHabits = habitLog[today] || {};

  const toggleHabit = useCallback((id) => {
    const newVal = !todayHabits[id];
    setHabitLog(prev => ({
      ...prev,
      [today]: { ...prev[today], [id]: newVal },
    }));
    toggleHabitAPI(id, today, newVal);
  }, [today, todayHabits]);

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
