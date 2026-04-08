import { useState, useEffect } from 'react';
import { fetchStreak, updateStreak } from '../lib/api';
import { getTodayKey } from '../utils/time';

export function useStreak() {
  const [streak, setStreak] = useState(0);
  const [lastDate, setLastDate] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchStreak()
      .then(data => {
        setStreak(data.currentStreak || 0);
        setLastDate(data.lastDate || "");
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const today = getTodayKey();
    if (lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const newStreak = lastDate === yesterday ? streak + 1 : 1;
      setStreak(newStreak);
      setLastDate(today);
      updateStreak({ currentStreak: newStreak, lastDate: today });
    }
  }, [loaded]);

  return { streak };
}
