import { useCallback, useEffect, useState } from 'react';
import { storage } from '../lib/storage';
import { LUCID_PROGRAM } from '../lib/lucidProgram';

const KEY = 'lucidTraining';

type DreamSign = { id: string; text: string; category: string };

type State = {
  started: boolean;
  startDate: string | null;
  currentWeek: number;
  dailyTasks: Record<string, Record<string, boolean>>;
  dreamSigns: DreamSign[];
};

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function defaultState(): State {
  return {
    started: false,
    startDate: null,
    currentWeek: 1,
    dailyTasks: {},
    dreamSigns: [],
  };
}

export function useLucidTraining() {
  const [state, setState] = useState<State>(defaultState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      const stored = await storage.get<State>(KEY);
      if (stored) setState({ ...defaultState(), ...stored });
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (loaded) storage.set(KEY, state);
  }, [state, loaded]);

  const weekData = LUCID_PROGRAM.find((w) => w.week === state.currentWeek) || LUCID_PROGRAM[0];
  const today = todayKey();
  const todayTasks = state.dailyTasks[today] || {};

  const toggleTask = useCallback((taskId: string) => {
    setState((prev) => {
      const day = { ...(prev.dailyTasks[today] || {}) };
      day[taskId] = !day[taskId];
      return { ...prev, dailyTasks: { ...prev.dailyTasks, [today]: day } };
    });
  }, [today]);

  const start = useCallback(() => {
    setState((prev) => ({
      ...prev,
      started: true,
      startDate: prev.startDate || today,
    }));
  }, [today]);

  const setWeek = useCallback((week: number) => {
    if (week < 1 || week > LUCID_PROGRAM.length) return;
    setState((prev) => ({ ...prev, currentWeek: week }));
  }, []);

  const addDreamSign = useCallback((text: string, category: string) => {
    if (!text.trim()) return;
    setState((prev) => ({
      ...prev,
      dreamSigns: [
        ...prev.dreamSigns,
        { id: Date.now().toString(), text: text.trim(), category },
      ],
    }));
  }, []);

  const removeDreamSign = useCallback((id: string) => {
    setState((prev) => ({ ...prev, dreamSigns: prev.dreamSigns.filter((s) => s.id !== id) }));
  }, []);

  const tasksDone = weekData.tasks.filter((t) => todayTasks[t.id]).length;
  const tasksTotal = weekData.tasks.length;

  return {
    state,
    loaded,
    weekData,
    todayTasks,
    tasksDone,
    tasksTotal,
    toggleTask,
    start,
    setWeek,
    addDreamSign,
    removeDreamSign,
  };
}
