import { useOutletContext, Link } from 'react-router-dom';
import NorthStar from '../components/cap/NorthStar';
import SkillLadder from '../components/cap/SkillLadder';
import ContinuityStreak from '../components/cap/ContinuityStreak';

// L'accueil : la page d'arrivée. Elle ne concerne QUE le cap et la
// progression calibrée. Le reste (projets, IA, focus, journal…) vit ailleurs.
export default function AccueilPage() {
  const ctx = useOutletContext();

  return (
    <div className="flex flex-col gap-3.5">
      <NorthStar />
      <SkillLadder ctx={ctx} />
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
