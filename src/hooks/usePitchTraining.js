import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'pitchTrainingHistory';
const LEGACY_KEY = 'pitchTrainingLog';
const DAILY_TARGET = 3;

function localDateKey(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function todayKey() {
  return localDateKey(new Date());
}

function isoToLocalDate(iso) {
  return localDateKey(new Date(iso));
}

function readHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const obj = JSON.parse(legacy);
      const migrated = [];
      Object.entries(obj).forEach(([date, count]) => {
        for (let i = 0; i < count; i++) {
          migrated.push({
            timestamp: `${date}T12:00:00.000Z`,
            result: 'validated',
            ecart: 0,
            migrated: true,
          });
        }
      });
      return migrated;
    }
    return [];
  } catch {
    return [];
  }
}

function writeHistory(arr) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(arr)); } catch {}
}

export function usePitchTraining() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  const today = todayKey();
  const todayHistory = history
    .filter(s => isoToLocalDate(s.timestamp) === today)
    .sort((a, b) => a.timestamp.localeCompare(b.timestamp));
  const todayCount = todayHistory.length;
  const validatedToday = todayHistory.filter(s => s.result === 'validated').length;
  const done = todayCount >= DAILY_TARGET;

  const recordSession = useCallback((session) => {
    setHistory(prev => {
      const next = [...prev, { timestamp: new Date().toISOString(), ...session }];
      writeHistory(next);
      return next;
    });
  }, []);

  const removeSession = useCallback((timestamp) => {
    setHistory(prev => {
      const next = prev.filter(s => s.timestamp !== timestamp);
      writeHistory(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    writeHistory([]);
    setHistory([]);
  }, []);

  return {
    todayCount,
    validatedToday,
    target: DAILY_TARGET,
    done,
    history,
    todayHistory,
    recordSession,
    removeSession,
    clearAll,
  };
}
