import { useCallback, useEffect, useState } from 'react';
import { storage } from '../lib/storage';
import {
  REMINDER_TYPES,
  defaultReminderState,
  notificationId,
  parseTime,
  type ReminderState,
} from '../lib/reminders';
import {
  getPermission,
  requestPermission,
  scheduleDaily,
  cancelByIdentifier,
  showNow,
  setupAndroidChannel,
} from '../lib/notifications';

const KEY = 'reminders';

export function useReminders() {
  const [state, setState] = useState<Record<string, ReminderState>>(defaultReminderState);
  const [permission, setPermission] = useState<string>('undetermined');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      await setupAndroidChannel();
      const stored = await storage.get<Record<string, ReminderState>>(KEY);
      if (stored) {
        const merged = defaultReminderState();
        Object.keys(merged).forEach((id) => {
          if (stored[id]) merged[id] = { ...merged[id], ...stored[id] };
        });
        setState(merged);
      }
      setPermission(await getPermission());
      setLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (loaded) storage.set(KEY, state);
  }, [state, loaded]);

  const ask = useCallback(async () => {
    const result = await requestPermission();
    setPermission(result);
    return result;
  }, []);

  const reapplyAll = useCallback(async (next: Record<string, ReminderState>) => {
    for (const type of Object.values(REMINDER_TYPES)) {
      const s = next[type.id];
      for (const t of type.defaultTimes.concat(s?.times || [])) {
        await cancelByIdentifier(notificationId(type.id, t));
      }
      if (s?.enabled) {
        for (const time of s.times) {
          const { hour, minute } = parseTime(time);
          await scheduleDaily({
            id: notificationId(type.id, time),
            hour,
            minute,
            title: `${type.emoji} ${type.label}`,
            body: type.body,
          });
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!loaded || permission !== 'granted') return;
    reapplyAll(state);
  }, [state, permission, loaded, reapplyAll]);

  const toggleType = useCallback((typeId: string, enabled: boolean) => {
    setState((prev) => ({ ...prev, [typeId]: { ...prev[typeId], enabled } }));
  }, []);

  const addTime = useCallback((typeId: string, time: string) => {
    setState((prev) => {
      const cur = prev[typeId].times;
      if (cur.includes(time)) return prev;
      return { ...prev, [typeId]: { ...prev[typeId], times: [...cur, time].sort() } };
    });
  }, []);

  const removeTime = useCallback((typeId: string, time: string) => {
    setState((prev) => ({
      ...prev,
      [typeId]: { ...prev[typeId], times: prev[typeId].times.filter((t) => t !== time) },
    }));
  }, []);

  const test = useCallback(async () => {
    await showNow('🔔 Copilote — test', 'Les notifications natives marchent !');
  }, []);

  return {
    state,
    permission,
    loaded,
    ask,
    toggleType,
    addTime,
    removeTime,
    test,
  };
}
