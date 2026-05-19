import { useCallback, useState } from 'react';
import { storage } from '../lib/storage';

const KEY_CHECKS = 'lucidRealityChecks';
const KEY_DREAMS = 'lucidDreams';
const TARGET_PER_DAY = 5;

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isoToDay(iso) {
  return iso.slice(0, 10);
}

export function useLucidDream() {
  const [checks, setChecks] = useState(() => storage.get(KEY_CHECKS) || []);
  const [dreams, setDreams] = useState(() => storage.get(KEY_DREAMS) || []);
  const loaded = true;

  const today = todayKey();
  const checksToday = checks.filter(c => isoToDay(c.timestamp) === today);
  const dreamsToday = dreams.filter(d => d.date === today);
  const hadLucidToday = dreamsToday.some(d => d.lucid);

  const recordCheck = useCallback((wasDreaming = false) => {
    setChecks(prev => {
      const next = [...prev, { timestamp: new Date().toISOString(), wasDreaming }];
      storage.set(KEY_CHECKS, next);
      return next;
    });
  }, []);

  const addDream = useCallback((text, lucid = false) => {
    setDreams(prev => {
      const entry = {
        id: Date.now().toString(),
        date: todayKey(),
        timestamp: new Date().toISOString(),
        text: text.trim(),
        lucid,
      };
      const next = [...prev, entry];
      storage.set(KEY_DREAMS, next);
      return next;
    });
  }, []);

  const toggleDreamLucid = useCallback((id) => {
    setDreams(prev => {
      const next = prev.map(d => d.id === id ? { ...d, lucid: !d.lucid } : d);
      storage.set(KEY_DREAMS, next);
      return next;
    });
  }, []);

  const removeDream = useCallback((id) => {
    setDreams(prev => {
      const next = prev.filter(d => d.id !== id);
      storage.set(KEY_DREAMS, next);
      return next;
    });
  }, []);

  const lucidStreak = (() => {
    const dates = new Set(dreams.filter(d => d.lucid).map(d => d.date));
    let streak = 0;
    const d = new Date();
    while (dates.has(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  })();

  const dreamRecallStreak = (() => {
    const dates = new Set(dreams.map(d => d.date));
    let streak = 0;
    const d = new Date();
    while (dates.has(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`)) {
      streak++;
      d.setDate(d.getDate() - 1);
    }
    return streak;
  })();

  return {
    loaded,
    target: TARGET_PER_DAY,
    checksToday: checksToday.length,
    checks,
    dreams,
    dreamsToday,
    hadLucidToday,
    lucidStreak,
    dreamRecallStreak,
    recordCheck,
    addDream,
    toggleDreamLucid,
    removeDream,
  };
}
