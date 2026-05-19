import { useCallback, useEffect, useRef, useState } from 'react';
import { storage } from '../lib/storage';
import { showNotification, getPermission } from '../lib/notifications';

const STORAGE_KEY = 'reminders';
const TICK_MS = 30 * 1000;

export const REMINDER_TYPES = {
  pitch: {
    id: 'pitch',
    label: 'Oreille absolue (LA 440)',
    emoji: '🎹',
    body: 'Test de l\'oreille absolue. Imagine le LA 440, puis vérifie.',
    defaultTimes: ['10:00', '14:00', '19:00'],
  },
  lucidReality: {
    id: 'lucidReality',
    label: 'Reality checks (rêve lucide)',
    emoji: '🌙',
    body: 'Reality check : regarde tes mains, compte tes doigts. Es-tu en train de rêver ?',
    defaultTimes: ['09:00', '12:00', '15:00', '18:00', '21:00'],
  },
  lucidJournal: {
    id: 'lucidJournal',
    label: 'Journal de rêves (matin)',
    emoji: '📓',
    body: 'Note tes rêves de la nuit avant qu\'ils s\'effacent.',
    defaultTimes: ['07:30'],
  },
};

function defaultState() {
  const obj = {};
  Object.values(REMINDER_TYPES).forEach(t => {
    obj[t.id] = {
      enabled: false,
      times: [...t.defaultTimes],
      fired: {},
    };
  });
  return obj;
}

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function nowHHMM() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function pruneFired(fired) {
  const today = todayKey();
  const next = {};
  Object.entries(fired || {}).forEach(([k, v]) => {
    if (k.startsWith(today)) next[k] = v;
  });
  return next;
}

function loadInitialState() {
  const stored = storage.get(STORAGE_KEY);
  const merged = defaultState();
  if (stored) {
    Object.keys(merged).forEach(id => {
      if (stored[id]) merged[id] = { ...merged[id], ...stored[id] };
      merged[id].fired = pruneFired(merged[id].fired);
    });
  }
  return merged;
}

export function useReminders() {
  const [state, setState] = useState(loadInitialState);
  const [permission, setPermission] = useState(getPermission());
  const stateRef = useRef(state);

  useEffect(() => {
    stateRef.current = state;
    storage.set(STORAGE_KEY, state);
  }, [state]);

  const fire = useCallback(async (typeId, slotKey) => {
    const t = REMINDER_TYPES[typeId];
    if (!t) return;
    const ok = await showNotification(`${t.emoji} ${t.label}`, {
      body: t.body,
      tag: `${typeId}-${slotKey}`,
      data: { typeId, slotKey, url: '/' },
    });
    if (ok) {
      setState(prev => ({
        ...prev,
        [typeId]: {
          ...prev[typeId],
          fired: { ...prev[typeId].fired, [slotKey]: Date.now() },
        },
      }));
    }
  }, []);

  useEffect(() => {
    const tick = () => {
      if (getPermission() !== 'granted') return;
      const today = todayKey();
      const now = nowHHMM();
      Object.values(REMINDER_TYPES).forEach(t => {
        const s = stateRef.current[t.id];
        if (!s || !s.enabled) return;
        s.times.forEach(time => {
          if (time <= now) {
            const slotKey = `${today}_${time}`;
            if (!s.fired[slotKey]) {
              fire(t.id, slotKey);
            }
          }
        });
      });
    };
    tick();
    const iv = setInterval(tick, TICK_MS);
    const onVis = () => { if (!document.hidden) tick(); };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      clearInterval(iv);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, [fire]);

  const toggleType = useCallback((typeId, enabled) => {
    setState(prev => ({ ...prev, [typeId]: { ...prev[typeId], enabled } }));
  }, []);

  const setTimes = useCallback((typeId, times) => {
    setState(prev => ({ ...prev, [typeId]: { ...prev[typeId], times: [...times].sort() } }));
  }, []);

  const addTime = useCallback((typeId, time) => {
    setState(prev => {
      const cur = prev[typeId].times;
      if (cur.includes(time)) return prev;
      return { ...prev, [typeId]: { ...prev[typeId], times: [...cur, time].sort() } };
    });
  }, []);

  const removeTime = useCallback((typeId, time) => {
    setState(prev => ({
      ...prev,
      [typeId]: { ...prev[typeId], times: prev[typeId].times.filter(t => t !== time) },
    }));
  }, []);

  const refreshPermission = useCallback(() => {
    setPermission(getPermission());
  }, []);

  const testNotification = useCallback(async () => {
    return showNotification('🔔 Copilote — test', {
      body: 'Les notifications fonctionnent ! Tu seras prévenu pour tes entraînements.',
      tag: 'test',
    });
  }, []);

  const missedToday = useCallback((typeId) => {
    const s = state[typeId];
    if (!s || !s.enabled) return [];
    const today = todayKey();
    const now = nowHHMM();
    return s.times.filter(time => time <= now && !s.fired[`${today}_${time}`]);
  }, [state]);

  return {
    state,
    permission,
    refreshPermission,
    toggleType,
    setTimes,
    addTime,
    removeTime,
    testNotification,
    missedToday,
  };
}
