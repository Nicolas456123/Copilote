import { useOutletContext, Link } from 'react-router-dom';
import NorthStar from '../components/cap/NorthStar';
import SkillLadder from '../components/cap/SkillLadder';

// L'accueil va à l'essentiel : le cap, puis le plan. Rien d'autre.
export default function AccueilPage() {
  const ctx = useOutletContext();

  return (
    <div className="flex flex-col gap-3.5">
      <NorthStar
        objective={ctx.objective}
        adjust={ctx.adjustObjective}
        adjusting={ctx.adjustingObjective}
        reset={ctx.resetObjective}
      />
      <SkillLadder ctx={ctx} />

      <Link
        to="/plus"
        className="text-center text-[13px] font-semibold text-ink-muted py-2 no-underline hover:text-ink transition-colors"
      >
        Le reste →
      </Link>
    </div>
  );
}
