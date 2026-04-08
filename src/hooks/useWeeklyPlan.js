import { useState, useEffect, useCallback } from 'react';
import { fetchWeeklyPlan, generateWeeklyPlan, updateTaskStatus, rescheduleTask } from '../lib/api';
import { getTodayKey } from '../utils/time';

export function useWeeklyPlan() {
  const [tasks, setTasks] = useState([]);
  const [weekId, setWeekId] = useState("");
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchWeeklyPlan()
      .then(data => {
        setTasks(data.tasks || []);
        setWeekId(data.weekId || "");
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const generate = useCallback(async () => {
    setLoading(true);
    try {
      const data = await generateWeeklyPlan();
      setTasks(data.tasks || []);
      setWeekId(data.weekId || "");
    } catch (err) {
      console.error("Failed to generate plan:", err);
    }
    setLoading(false);
  }, []);

  const markDone = useCallback(async (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: "done" } : t));
    await updateTaskStatus(taskId, "done");
  }, []);

  const markSkipped = useCallback(async (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: "skipped" } : t));
    await updateTaskStatus(taskId, "skipped");
  }, []);

  const postpone = useCallback(async (taskId) => {
    const today = new Date(getTodayKey());
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const newDay = tomorrow.toISOString().slice(0, 10);

    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, day: newDay } : t));
    await rescheduleTask(taskId, newDay);
  }, []);

  const today = getTodayKey();
  const todayTasks = tasks.filter(t => t.day === today);
  const upcomingTasks = tasks.filter(t => t.day > today);
  const pastTasks = tasks.filter(t => t.day < today);
  const overdueTasks = pastTasks.filter(t => t.status === "todo");

  return {
    tasks, weekId, loading, loaded,
    todayTasks, upcomingTasks, overdueTasks,
    generate, markDone, markSkipped, postpone,
  };
}
