import Card from '../ui/Card';
import { AXES, OBJECTIVE } from '../../lib/discipline';

export default function DailyContinuity({ todayAxes = {}, today, toggle }) {
  const done = AXES.filter(a => todayAxes[a.id]).length;
  const total = AXES.length;

  const status =
    done === 0
      ? "La journée est encore vide. Une seule action suffit à maintenir la trajectoire."
      : done === total
        ? "Trajectoire pleine. C'est la régularité qui construit, pas l'intensité."
        : "La trajectoire est maintenue. Chaque axe touché compte.";

  return (
    <Card>
      <div className="flex items-center justify-between mb-1">
        <div className="text-[15px] font-extrabold text-ink">La règle du jour</div>
        <div className="text-sm font-bold text-sage">{done}/{total}</div>
      </div>
      <p className="text-[13px] text-ink-muted leading-snug mb-3 italic">« {OBJECTIVE.rule} »</p>

      <div className="flex flex-col gap-2">
        {AXES.map(a => {
          const on = !!todayAxes[a.id];
          return (
            <button
              key={a.id}
              onClick={() => toggle(today, a.id)}
              className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${
                on ? 'border-transparent' : 'border-line-soft bg-surface-2'
              }`}
              style={on ? { backgroundColor: a.color + '18', borderColor: a.color + '55' } : undefined}
            >
              <span className="text-xl shrink-0">{a.icon}</span>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold text-ink">{a.label}</div>
                <div className="text-[12px] text-ink-muted leading-snug">{a.minimal}</div>
              </div>
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${
                  on ? '' : 'bg-line-soft'
                }`}
                style={on ? { backgroundColor: a.color } : undefined}
              >
                {on ? '✓' : ''}
              </span>
            </button>
          );
        })}
      </div>

      <p className="text-[12px] text-ink-muted mt-3 text-center leading-snug">{status}</p>
    </Card>
  );
}
