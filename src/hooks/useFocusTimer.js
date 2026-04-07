import { useState, useRef, useEffect, useCallback } from 'react';
import { storage } from '../lib/storage';
import { getTodayKey } from '../utils/time';

export function useFocusTimer() {
  const [focusTask, setFocusTask] = useState(null);
  const [focusTime, setFocusTime] = useState(0);
  const [focusRunning, setFocusRunning] = useState(false);
  const [focusNudge, setFocusNudge] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (focusRunning) {
      timerRef.current = setInterval(() => {
        setFocusTime(t => {
          if (t + 1 === 3600) setFocusNudge(true);
          return t + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [focusRunning]);

  const startFocus = useCallback((task) => {
    setFocusTask(task);
    setFocusTime(0);
    setFocusNudge(false);
  }, []);

  const stopFocus = useCallback(() => {
    if (focusTime > 0 && focusTask) {
      const sessions = storage.get("focusSessions") || [];
      sessions.push({
        id: `fs-${Date.now()}`,
        projectId: focusTask.projectId,
        stepId: focusTask.id,
        duration: focusTime,
        date: getTodayKey(),
      });
      storage.set("focusSessions", sessions);
    }
    setFocusRunning(false);
    setFocusTask(null);
    setFocusTime(0);
    setFocusNudge(false);
  }, [focusTime, focusTask]);

  return {
    focusTask, focusTime, focusRunning, focusNudge,
    setFocusRunning, startFocus, stopFocus,
  };
}
