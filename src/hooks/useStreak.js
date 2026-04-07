import { useState, useEffect } from 'react';
import { storage } from '../lib/storage';
import { getTodayKey } from '../utils/time';

export function useStreak() {
  const [streak, setStreak] = useState(0);
  const [lastDate, setLastDate] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setStreak(storage.get("streak") || 0);
    setLastDate(storage.get("lastDate") || "");
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    const today = getTodayKey();
    if (lastDate !== today) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      if (lastDate === yesterday) setStreak(s => s + 1);
      else setStreak(1);
      setLastDate(today);
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded) {
      storage.set("streak", streak);
      storage.set("lastDate", lastDate);
    }
  }, [streak, lastDate, loaded]);

  return { streak };
}
