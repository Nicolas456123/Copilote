import { useOutletContext } from 'react-router-dom';
import CopilotCard from '../components/copilot/CopilotCard';
import WeekFocus from '../components/copilot/WeekFocus';
import MyWhy from '../components/copilot/MyWhy';
import MansonValues from '../components/copilot/MansonValues';
import DomainsOverview from '../components/copilot/DomainsOverview';
import QuickLinks from '../components/copilot/QuickLinks';
import WeeklyGraph from '../components/dashboard/WeeklyGraph';
import ProgressionCard from '../components/dashboard/ProgressionCard';
import DailyPlan from '../components/dashboard/DailyPlan';
import PitchTraining from '../components/dashboard/PitchTraining';
import LucidDreamCard from '../components/dashboard/LucidDreamCard';
import LucidProgramCard from '../components/dashboard/LucidProgramCard';
import RemindersCard from '../components/dashboard/RemindersCard';
import { useXP } from '../hooks/useXP';

// "Le reste" : tout ce qui est secondaire par rapport au cap.
// À explorer dans le temps libre, sans pression.
export default function PlusPage() {
  const ctx = useOutletContext();
  const { xp, level, xpInLevel, xpProgress } = useXP({
    habitLog: ctx.habitLog,
    projects: ctx.projects,
    entries: ctx.entries,
  });

  return (
    <div className="flex flex-col gap-3.5">
      <div className="pt-1">
        <h1 className="text-lg font-extrabold text-ink">Le reste</h1>
        <p className="text-[13px] text-ink-muted">Tout ça est du plus. Sans pression.</p>
      </div>

      <CopilotCard
        aiMsg={ctx.aiMsg}
        aiLoading={ctx.aiLoading}
        askAI={ctx.askAI}
        aiPlanWeek={ctx.aiPlanWeek}
      />
      <RemindersCard />
      <PitchTraining />
      <LucidProgramCard />
      <LucidDreamCard />
      <DailyPlan
        todayTasks={ctx.todayTasks}
        overdueTasks={ctx.overdueTasks}
        upcomingTasks={ctx.upcomingTasks}
        loading={ctx.loading}
        generate={ctx.generate}
        markDone={ctx.markDone}
        markSkipped={ctx.markSkipped}
        postpone={ctx.postpone}
        hasPlan={ctx.tasks?.length > 0}
      />
      <WeekFocus focusProjects={ctx.focusProjects} />
      <MansonValues />
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
