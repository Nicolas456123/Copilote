import { useOutletContext, Link } from 'react-router-dom';
import NorthStar from '../components/cap/NorthStar';
import SkillLadder from '../components/cap/SkillLadder';
import DailyContinuity from '../components/cap/DailyContinuity';
import ContinuityStreak from '../components/cap/ContinuityStreak';

// L'accueil : la page d'arrivée. Elle ne concerne QUE le cap.
// Le reste (projets, IA, focus, journal, entraînements…) vit ailleurs.
export default function AccueilPage() {
  const ctx = useOutletContext();
  const todayAxes = ctx.axesLog?.[ctx.today] || {};

  return (
    <div className="flex flex-col gap-3.5">
      <NorthStar />
      <SkillLadder ctx={ctx} />
      <DailyContinuity todayAxes={todayAxes} today={ctx.today} toggle={ctx.toggleAxis} />
      <ContinuityStreak streak={ctx.streak} />

      <Link
        to="/plus"
        className="text-center text-[13px] font-semibold text-ink-muted py-2 no-underline hover:text-ink transition-colors"
      >
        Le reste (projets, focus, IA, journal…) →
      </Link>
    </div>
  );
}
