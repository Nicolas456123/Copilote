import { useState } from 'react';
import Spinner from '../ui/Spinner';
import { DOMAINS } from '../../lib/constants';
import { FEEDBACK, tierOf, tierProgress, fallbackAction } from '../../lib/skills';

export default function SkillCard({ skill, generating, complete, generate, setLevel, setHorizon, setActive, remove }) {
  const [open, setOpen] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState(false);

  const tier = tierOf(skill.level);
  const dom = DOMAINS[skill.domain];
  const act = skill.currentAction || fallbackAction(skill);
  const pct = tierProgress(skill.level);

  return (
    <div className="rounded-2xl border border-line-soft bg-surface-2 overflow-hidden">
      {/* Ligne repliée : domaine + objectif moyen terme + prochaine action */}
      <button onClick={() => setOpen(o => !o)} className="w-full text-left p-3.5">
        <div className="flex items-center gap-2">
          <span className="text-lg shrink-0">{dom?.icon || "🎯"}</span>
          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-extrabold text-ink leading-tight">{skill.name}</div>
            <div className="text-[11px] font-bold" style={{ color: tier.color }}>
              {tier.icon} {tier.name} · {Math.round(skill.level)}/100
            </div>
          </div>
          <span className="text-ink-muted text-sm shrink-0">{open ? '▾' : '▸'}</span>
        </div>

        <div className="h-1 rounded-full bg-line-soft overflow-hidden my-2">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: tier.color }} />
        </div>

        {skill.midTerm && (
          <div className="text-[12px] text-ink-muted leading-snug">🎯 {skill.midTerm}</div>
        )}
        <div className="text-[13px] font-semibold text-ink leading-snug mt-1">
          {generating ? 'Calibrage…' : `→ ${act.action}`}
        </div>
      </button>

      {/* Déplié : agir */}
      {open && (
        <div className="px-3.5 pb-3.5 -mt-1">
          {/* La prochaine action en détail */}
          <div className="rounded-xl bg-surface p-3 mb-2.5">
            {generating ? (
              <div className="flex items-center gap-2 py-1 text-[13px] text-ink-muted">
                <Spinner size={16} /> Calibrage de la juste action…
              </div>
            ) : (
              <>
                <div className="text-[14px] font-semibold text-ink leading-snug">{act.action}</div>
                <div className="text-[11px] text-ink-muted mt-1">
                  ⏱ ~{act.minutes} min{act.ai ? ' · ✨ sur mesure' : ''}
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

          <div className="flex items-center justify-center gap-3 mt-2">
            <button onClick={() => generate(skill.id)} disabled={generating}
              className="text-[12px] font-semibold text-ink-muted hover:text-ink transition-colors disabled:opacity-40">
              ↻ Autre action
            </button>
            <span className="text-line-soft">·</span>
            <button onClick={() => setFixing(f => !f)} disabled={generating}
              className="text-[12px] font-semibold text-ink-muted hover:text-ink transition-colors disabled:opacity-40">
              🤔 Pas cohérent ?
            </button>
            <span className="text-line-soft">·</span>
            <button onClick={() => setEditing(e => !e)}
              className="text-[12px] font-semibold text-ink-muted hover:text-ink transition-colors">
              ⚙︎ Plan
            </button>
          </div>

          {/* Ajuster l'action en direct */}
          {fixing && (
            <div className="mt-2 flex gap-2">
              <input
                value={note} onChange={e => setNote(e.target.value)}
                placeholder="Qu'est-ce qui cloche ?"
                className="flex-1 px-3 py-2 rounded-lg border border-line-soft bg-surface text-[13px] text-ink outline-none focus:border-navy"
                autoFocus
                onKeyDown={e => { if (e.key === 'Enter' && note.trim()) { generate(skill.id, note.trim()); setNote(""); setFixing(false); } }}
              />
              <button
                onClick={() => { if (note.trim()) { generate(skill.id, note.trim()); setNote(""); setFixing(false); } }}
                disabled={!note.trim() || generating}
                className="px-3 rounded-lg bg-navy text-white text-[12px] font-bold disabled:opacity-40">
                Ajuster
              </button>
            </div>
          )}

          {/* Régler le plan : horizons + niveau */}
          {editing && (
            <div className="mt-3 pt-3 border-t border-line-soft flex flex-col gap-2.5">
              <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Long terme</label>
              <textarea
                defaultValue={skill.longTerm} rows={2}
                onBlur={e => setHorizon(skill.id, 'longTerm', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-line-soft bg-surface text-[13px] text-ink outline-none focus:border-navy resize-none"
              />
              <label className="text-[11px] font-bold uppercase tracking-wider text-ink-muted">Moyen terme</label>
              <textarea
                defaultValue={skill.midTerm} rows={2}
                onBlur={e => setHorizon(skill.id, 'midTerm', e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-line-soft bg-surface text-[13px] text-ink outline-none focus:border-navy resize-none"
              />
              <div className="flex justify-between text-[11px] font-semibold text-ink-muted">
                <span>Niveau</span><span>{Math.round(skill.level)}/100</span>
              </div>
              <input type="range" min="0" max="100" value={Math.round(skill.level)}
                onChange={e => setLevel(skill.id, Number(e.target.value))} className="w-full accent-navy" />
              <div className="flex gap-2">
                <button onClick={() => setActive(skill.id, false)}
                  className="flex-1 py-1.5 rounded-lg bg-surface border border-line-soft text-[12px] font-semibold text-ink-muted hover:text-ink transition-colors">
                  💤 En réserve
                </button>
                <button onClick={() => { if (confirm(`Retirer « ${skill.name} » du plan ?`)) remove(skill.id); }}
                  className="py-1.5 px-3 rounded-lg bg-coral/10 text-coral text-[12px] font-semibold hover:bg-coral/20 transition-colors">
                  Retirer
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
