import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'pitchTrainingLog';
const DAILY_TARGET = 3;

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function readLog() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

export function usePitchTraining() {
  const [log, setLog] = useState({});

  useEffect(() => {
    setLog(readLog());
  }, []);

  const today = todayKey();
  const todayCount = log[today] || 0;
  const done = todayCount >= DAILY_TARGET;

  const incrementToday = useCallback(() => {
    setLog(prev => {
      const next = { ...prev, [today]: (prev[today] || 0) + 1 };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [today]);

  const resetToday = useCallback(() => {
    setLog(prev => {
      const next = { ...prev, [today]: 0 };
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
      return next;
    });
  }, [today]);

  return { todayCount, target: DAILY_TARGET, done, incrementToday, resetToday };
}
