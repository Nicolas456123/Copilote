import { useMemo } from 'react';
import { XP_REWARDS, XP_PER_LEVEL } from '../lib/constants';
import { storage } from '../lib/storage';

export function useXP({ habitLog, projects, entries }) {
  return useMemo(() => {
    let xp = 0;

    // XP from habits
    if (habitLog) {
      Object.values(habitLog).forEach(day => {
        Object.values(day).forEach(checked => {
          if (checked) xp += XP_REWARDS.habit;
        });
      });
    }

    // XP from project steps
    if (projects) {
      projects.forEach(p => {
        if (p.steps) {
          p.steps.forEach(s => {
            if (s.done) xp += XP_REWARDS.projectStep;
          });
        }
      });
    }

    // XP from focus sessions
    const sessions = storage.get("focusSessions") || [];
    sessions.forEach(s => {
      if (s.duration >= 25 * 60) xp += XP_REWARDS.focusSession;
    });

    // XP from journal entries
    if (entries) {
      xp += entries.length * XP_REWARDS.journal;
    }

    const level = Math.floor(xp / XP_PER_LEVEL);
    const xpInLevel = xp % XP_PER_LEVEL;
    const xpProgress = (xpInLevel / XP_PER_LEVEL) * 100;

    return { xp, level, xpInLevel, xpProgress };
  }, [habitLog, projects, entries]);
}
