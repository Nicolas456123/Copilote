import { useMemo, useState, useEffect } from 'react';
import { XP_REWARDS, XP_PER_LEVEL } from '../lib/constants';
import { fetchFocusSessions } from '../lib/api';

export function useXP({ habitLog, projects, entries }) {
  const [focusSessions, setFocusSessions] = useState([]);

  useEffect(() => {
    fetchFocusSessions()
      .then(data => setFocusSessions(data))
      .catch(() => {});
  }, []);

  return useMemo(() => {
    let xp = 0;

    if (habitLog) {
      Object.values(habitLog).forEach(day => {
        Object.values(day).forEach(checked => {
          if (checked) xp += XP_REWARDS.habit;
        });
      });
    }

    if (projects) {
      projects.forEach(p => {
        if (p.steps) {
          p.steps.forEach(s => {
            if (s.done) xp += XP_REWARDS.projectStep;
          });
        }
      });
    }

    focusSessions.forEach(s => {
      if (s.duration >= 25 * 60) xp += XP_REWARDS.focusSession;
    });

    if (entries) {
      xp += entries.length * XP_REWARDS.journal;
    }

    const level = Math.floor(xp / XP_PER_LEVEL);
    const xpInLevel = xp % XP_PER_LEVEL;
    const xpProgress = (xpInLevel / XP_PER_LEVEL) * 100;

    return { xp, level, xpInLevel, xpProgress };
  }, [habitLog, projects, entries, focusSessions]);
}
