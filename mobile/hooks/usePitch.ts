import { useCallback, useEffect, useState } from 'react';
import { storage } from '../lib/storage';

const KEY = 'pitchTrainingHistory';
const DAILY_TARGET = 3;

export type PitchSession = {
  timestamp: string;
  result: 'validated' | 'off';
  ecart: number;
  guess?: number;
};

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function usePitch() {
  const [history, setHistory] = useState<PitchSession[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      setHistory((await storage.get<PitchSession[]>(KEY)) || []);
      setLoaded(true);
    })();
  }, []);

  const today = todayKey();
  const todayHistory = history.filter((s) => s.timestamp.startsWith(today));
  const todayCount = todayHistory.length;
  const validatedToday = todayHistory.filter((s) => s.result === 'validated').length;
  const done = todayCount >= DAILY_TARGET;

  const recordSession = useCallback((session: Omit<PitchSession, 'timestamp'>) => {
    setHistory((prev) => {
      const next = [...prev, { timestamp: new Date().toISOString(), ...session }];
      storage.set(KEY, next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    storage.set(KEY, []);
    setHistory([]);
  }, []);

  return {
    history,
    todayHistory,
    todayCount,
    validatedToday,
    target: DAILY_TARGET,
    done,
    loaded,
    recordSession,
    clearAll,
  };
}
