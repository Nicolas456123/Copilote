import Card from '../ui/Card';
import { getPrincipleOfDay } from '../../lib/discipline';

export default function ContinuityStreak({ streak = 0 }) {
  return (
    <Card className="text-center">
      <div className="text-[11px] font-bold tracking-[0.18em] uppercase text-ink-muted mb-1">
        Continuité
      </div>
      <div className="text-[40px] font-extrabold text-ink leading-none">{streak}</div>
      <div className="text-[13px] text-ink-muted mb-3">
        {streak <= 1 ? 'jour' : 'jours'} sans interruption
      </div>
      <p className="text-[13px] text-ink leading-relaxed border-t border-line-soft pt-3 italic">
        « {getPrincipleOfDay()} »
      </p>
    </Card>
  );
}
