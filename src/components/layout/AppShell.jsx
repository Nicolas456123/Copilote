import { useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import BottomNav from './BottomNav';
import Spinner from '../ui/Spinner';
import { initDB } from '../../lib/api';
import { useProjects } from '../../hooks/useProjects';
import { useHabits } from '../../hooks/useHabits';
import { useStreak } from '../../hooks/useStreak';
import { useSettings } from '../../hooks/useSettings';
import { useJournal } from '../../hooks/useJournal';
import { useFocusTimer } from '../../hooks/useFocusTimer';
import { useAI } from '../../hooks/useAI';
import { useXP } from '../../hooks/useXP';
import { useWeeklyPlan } from '../../hooks/useWeeklyPlan';
import { useSkills } from '../../hooks/useSkills';

export default function AppShell() {
  const initDone = useRef(false);
  useEffect(() => {
    if (!initDone.current) {
      initDone.current = true;
      initDB().catch(() => {});
    }
  }, []);

  const projectsHook = useProjects();
  const habitsHook = useHabits();
  const { streak, actedToday, markActed } = useStreak();
  const settingsHook = useSettings();
  const journalHook = useJournal();
  const focusHook = useFocusTimer();
  const planHook = useWeeklyPlan();
  const skillsHook = useSkills();

  const aiHook = useAI({
    projects: projectsHook.projects,
    habitsToday: habitsHook.habitsToday,
    habitsTotal: habitsHook.habitsTotal,
    gymThisWeek: habitsHook.gymThisWeek,
    streak,
    myWhy: settingsHook.myWhy,
  });

  const { level } = useXP({
    habitLog: habitsHook.habitLog,
    projects: projectsHook.projects,
    entries: journalHook.entries,
  });

  const allLoaded = projectsHook.loaded && habitsHook.loaded && settingsHook.loaded && journalHook.loaded && skillsHook.skillsLoaded;

  if (!allLoaded) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-cream to-surface-2">
        <Spinner size={32} />
      </div>
    );
  }

  const context = {
    ...projectsHook,
    ...habitsHook,
    ...settingsHook,
    ...journalHook,
    ...focusHook,
    ...aiHook,
    ...planHook,
    ...skillsHook,
    // Toute action terminée nourrit la série (le score = l'action).
    complete: async (id, key) => { await skillsHook.complete(id, key); markActed(); },
    streak,
    actedToday,
    markActed,
    level,
  };

  return (
    <div className="font-nunito max-w-[440px] mx-auto min-h-screen bg-cream flex flex-col">
      <Header
        streak={streak}
        gymThisWeek={habitsHook.gymThisWeek}
        habitsToday={habitsHook.habitsToday}
        habitsTotal={habitsHook.habitsTotal}
        level={level}
      />
      <div className="flex-1 overflow-auto px-4 pb-28">
        <Outlet context={context} />
      </div>
      <BottomNav />
    </div>
  );
}
