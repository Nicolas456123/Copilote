import { useCallback, useEffect, useMemo, useState } from 'react';
import { storage } from '../lib/storage';
import { LUCID_PROGRAM } from '../lib/lucidProgram';

const KEY = 'lucidTraining';

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function defaultState() {
  return {
    started: false,
    startDate: null,
    currentWeek: 1,
    dailyTasks: {},
    dreamSigns: [],
  };
}

export function useLucidTraining({ checksToday = 0, dreamsToday = [] } = {}) {
  const [state, setState] = useState(() => {
    const stored = storage.get(KEY);
    return stored ? { ...defaultState(), ...stored } : defaultState();
  });

  useEffect(() => { storage.set(KEY, state); }, [state]);

  const weekData = LUCID_PROGRAM.find(w => w.week === state.currentWeek) || LUCID_PROGRAM[0];
  const today = todayKey();
  const todayTasks = useMemo(() => state.dailyTasks[today] || {}, [state.dailyTasks, today]);

  const isTaskDone = useCallback((task) => {
    if (task.source === 'rc') return checksToday >= (task.target || 10);
    if (task.source === 'dreams') return dreamsToday.length > 0;
    if (task.source === 'dreamSigns') return state.dreamSigns.length > 0;
    return !!todayTasks[task.id];
  }, [checksToday, dreamsToday.length, state.dreamSigns.length, todayTasks]);

  const toggleTask = useCallback((taskId) => {
    setState(prev => {
      const day = { ...(prev.dailyTasks[today] || {}) };
      day[taskId] = !day[taskId];
      return { ...prev, dailyTasks: { ...prev.dailyTasks, [today]: day } };
    });
  }, [today]);

  const start = useCallback(() => {
    setState(prev => ({ ...prev, started: true, startDate: prev.startDate || today, currentWeek: prev.currentWeek || 1 }));
  }, [today]);

  const setWeek = useCallback((week) => {
    if (week < 1 || week > LUCID_PROGRAM.length) return;
    setState(prev => ({ ...prev, currentWeek: week }));
  }, []);

  const reset = useCallback(() => {
    setState(defaultState());
  }, []);

  const addDreamSign = useCallback((text, category = 'context') => {
    if (!text.trim()) return;
    setState(prev => ({
      ...prev,
      dreamSigns: [...prev.dreamSigns, {
        id: Date.now().toString(),
        text: text.trim(),
        category,
        createdAt: new Date().toISOString(),
      }],
    }));
  }, []);

  const removeDreamSign = useCallback((id) => {
    setState(prev => ({ ...prev, dreamSigns: prev.dreamSigns.filter(s => s.id !== id) }));
  }, []);

  const tasksDone = weekData.dailyTasks.filter(t => isTaskDone(t)).length;
  const tasksTotal = weekData.dailyTasks.length;
  const allDoneToday = tasksDone === tasksTotal;

  const streak = (() => {
    let n = 0;
    const d = new Date();
    while (true) {
      const k = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
      const day = state.dailyTasks[k];
      if (!day) break;
      const doneCount = weekData.dailyTasks.filter(t => {
        if (t.source) return false;
        return !!day[t.id];
      }).length;
      const need = weekData.dailyTasks.filter(t => !t.source).length;
      if (doneCount < Math.max(1, need - 1)) break;
      n++;
      d.setDate(d.getDate() - 1);
      if (n > 60) break;
    }
    return n;
  })();

  return {
    state,
    weekData,
    todayTasks,
    isTaskDone,
    tasksDone,
    tasksTotal,
    allDoneToday,
    streak,
    toggleTask,
    start,
    setWeek,
    reset,
    addDreamSign,
    removeDreamSign,
  };
}
