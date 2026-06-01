import { useState } from 'react';
import Spinner from '../ui/Spinner';
import { DOMAINS } from '../../lib/constants';
import { FEEDBACK, tierOf, tierProgress, fallbackAction } from '../../lib/skills';

export default function SkillCard({ skill, generating, complete, generate, setLevel, setActive, remove }) {
  const [open, setOpen] = useState(false);
  const tier = tierOf(skill.level);
  const dom = DOMAINS[skill.domain];
  const act = skill.currentAction || fallbackAction(skill);
  const pct = tierProgress(skill.level);

  return (
    <div className="rounded-2xl border border-line-soft bg-surface-2 p-3.5">
      {/* En-tête : compétence + palier */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg shrink-0">{dom?.icon || "🎯"}</span>
        <div className="flex-1 min-w-0">
          <div className="text-[14px] font-extrabold text-ink leading-tight truncate">{skill.name}</div>
          <div className="text-[11px] font-bold" style={{ color: tier.color }}>
            {tier.icon} {tier.name} · {Math.round(skill.level)}/100
          </div>
        </div>
        <button
          onClick={() => setOpen(o => !o)}
          className="w-7 h-7 rounded-full text-ink-muted hover:bg-line-soft transition-colors shrink-0 text-sm"
          aria-label="Régler"
        >
          {open ? '✕' : '⋯'}
        </button>
      </div>

      {/* Barre de progression dans le palier */}
      <div className="h-1.5 rounded-full bg-line-soft overflow-hidden mb-3">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: tier.color }} />
      </div>

      {/* La prochaine marche */}
      <div className="rounded-xl bg-surface p-3 mb-2.5">
        <div className="text-[10px] font-bold tracking-wider uppercase text-ink-muted mb-1">
          Prochaine marche {act.ai ? '✨' : ''}
        </div>
        {generating ? (
          <div className="flex items-center gap-2 py-1.5 text-[13px] text-ink-muted">
            <Spinner size={16} /> Calibrage de la juste marche…
          </div>
        ) : (
          <>
            <div className="text-[14px] font-semibold text-ink leading-snug">{act.action}</div>
            <div className="text-[11px] text-ink-muted mt-1">
              ⏱ ~{act.minutes} min{act.rationale ? ` · ${act.rationale}` : ''}
            </div>
          </>
        )}
      </div>

      {/* Retour en un tap → auto-régulation */}
      <div className="grid grid-cols-4 gap-1.5">
        {Object.entries(FEEDBACK).map(([key, f]) => (
          <button
            key={key}
            onClick={() => complete(skill.id, key)}
            disabled={generating}
            className="flex flex-col items-center gap-0.5 py-1.5 rounded-lg border border-line-soft bg-surface text-ink-muted hover:border-navy hover:text-ink transition-all disabled:opacity-40"
          >
            <span className="text-base leading-none">{f.icon}</span>
            <span className="text-[9px] font-semibold leading-tight text-center">{f.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => generate(skill.id)}
        disabled={generating}
        className="w-full mt-2 text-[12px] font-semibold text-ink-muted hover:text-ink transition-colors disabled:opacity-40"
      >
        ↻ Proposer une autre marche
      </button>

      {/* Réglages : recalibrer / réserve / supprimer */}
      {open && (
        <div className="mt-3 pt-3 border-t border-line-soft flex flex-col gap-3">
          <div>
            <div className="flex justify-between text-[11px] font-semibold text-ink-muted mb-1">
              <span>Recalibrer le niveau</span>
              <span>{Math.round(skill.level)}/100</span>
            </div>
            <input
              type="range" min="0" max="100" value={Math.round(skill.level)}
              onChange={e => setLevel(skill.id, Number(e.target.value))}
              className="w-full accent-navy"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setActive(skill.id, false)}
              className="flex-1 py-1.5 rounded-lg bg-surface border border-line-soft text-[12px] font-semibold text-ink-muted hover:text-ink transition-colors"
            >
              💤 Mettre en réserve
            </button>
            <button
              onClick={() => { if (confirm(`Supprimer "${skill.name}" ?`)) remove(skill.id); }}
              className="py-1.5 px-3 rounded-lg bg-coral/10 text-coral text-[12px] font-semibold hover:bg-coral/20 transition-colors"
            >
              Supprimer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
