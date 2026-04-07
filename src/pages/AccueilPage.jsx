import { useOutletContext } from 'react-router-dom';
import CopilotCard from '../components/copilot/CopilotCard';
import WeekFocus from '../components/copilot/WeekFocus';
import MyWhy from '../components/copilot/MyWhy';
import DomainsOverview from '../components/copilot/DomainsOverview';
import QuickLinks from '../components/copilot/QuickLinks';
import WeeklyGraph from '../components/dashboard/WeeklyGraph';
import ProgressionCard from '../components/dashboard/ProgressionCard';
import { useXP } from '../hooks/useXP';

export default function AccueilPage() {
  const ctx = useOutletContext();
  const { xp, level, xpInLevel, xpProgress } = useXP({
    habitLog: ctx.habitLog,
    projects: ctx.projects,
    entries: ctx.entries,
  });

  return (
    <div className="flex flex-col gap-3.5">
      <CopilotCard
        aiMsg={ctx.aiMsg}
        aiLoading={ctx.aiLoading}
        askAI={ctx.askAI}
        aiPlanWeek={ctx.aiPlanWeek}
      />
      <WeekFocus focusProjects={ctx.focusProjects} />
      <ProgressionCard xp={xp} level={level} xpInLevel={xpInLevel} xpProgress={xpProgress} />
      <WeeklyGraph
        weekDates={ctx.weekDates}
        habitLog={ctx.habitLog}
        habits={ctx.habits}
        today={ctx.today}
      />
      <MyWhy myWhy={ctx.myWhy} setMyWhy={ctx.setMyWhy} />
      <DomainsOverview projects={ctx.projects} />
      <QuickLinks />
    </div>
  );
}
