import { useState } from 'react';
import Card from '../ui/Card';
import SkillCard from './SkillCard';
import { DOMAINS } from '../../lib/constants';
import { START_LEVELS, tierOf } from '../../lib/skills';

export default function SkillLadder({ ctx }) {
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [domain, setDomain] = useState("learning");
  const [startLevel, setStartLevel] = useState(START_LEVELS[0].level);
  const [showReserve, setShowReserve] = useState(false);

  const submit = async () => {
    if (!name.trim()) return;
    await ctx.addSkill({ name, domain, level: startLevel });
    setName("");
    setDomain("learning");
    setStartLevel(START_LEVELS[0].level);
    setAdding(false);
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-0.5">
        <div className="text-[15px] font-extrabold text-ink">🪜 La juste marche</div>
        {ctx.reserveSkills.length > 0 && (
          <button
            onClick={() => setShowReserve(s => !s)}
            className="text-[12px] font-semibold text-ink-muted hover:text-ink transition-colors"
          >
            Réserve ({ctx.reserveSkills.length})
          </button>
        )}
      </div>
      <p className="text-[12px] text-ink-muted mb-3 leading-snug">
        Une action calibrée sur ton niveau exact. Tu n'as pas à juger si c'est trop — le système ajuste.
      </p>

      <div className="flex flex-col gap-2.5">
        {ctx.activeSkills.map(s => (
          <SkillCard
            key={s.id}
            skill={s}
            generating={ctx.generatingId === s.id}
            complete={ctx.complete}
            generate={ctx.generate}
            setLevel={ctx.setLevel}
            setActive={ctx.setActive}
            remove={ctx.remove}
          />
        ))}
        {ctx.activeSkills.length === 0 && (
          <p className="text-[13px] text-ink-muted text-center py-3">
            Aucune compétence active. Ajoutes-en une ou réactive-la depuis la réserve.
          </p>
        )}
      </div>

      {/* Réserve : compétences mises de côté (anti-surcharge) */}
      {showReserve && ctx.reserveSkills.length > 0 && (
        <div className="mt-3 pt-3 border-t border-line-soft flex flex-col gap-1.5">
          <div className="text-[11px] font-bold uppercase tracking-wider text-ink-muted mb-0.5">En réserve</div>
          {ctx.reserveSkills.map(s => {
            const t = tierOf(s.level);
            return (
              <div key={s.id} className="flex items-center gap-2 text-[13px]">
                <span>{DOMAINS[s.domain]?.icon || "🎯"}</span>
                <span className="flex-1 min-w-0 truncate text-ink">{s.name}</span>
                <span className="text-[11px] font-bold" style={{ color: t.color }}>{t.icon} {Math.round(s.level)}</span>
                <button
                  onClick={() => ctx.setActive(s.id, true)}
                  className="text-[12px] font-semibold text-sage hover:underline"
                >
                  Activer
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Ajouter une compétence */}
      {adding ? (
        <div className="mt-3 pt-3 border-t border-line-soft flex flex-col gap-2.5">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Nouvelle compétence (ex: Espagnol, Dessin…)"
            className="w-full px-3 py-2 rounded-lg border border-line-soft bg-surface text-[14px] text-ink outline-none focus:border-navy"
            autoFocus
          />
          <select
            value={domain}
            onChange={e => setDomain(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-line-soft bg-surface text-[14px] text-ink outline-none focus:border-navy"
          >
            {Object.entries(DOMAINS).map(([k, v]) => (
              <option key={k} value={k}>{v.icon} {v.label}</option>
            ))}
          </select>
          <div>
            <div className="text-[12px] font-semibold text-ink-muted mb-1.5">Où en es-tu ?</div>
            <div className="grid grid-cols-2 gap-1.5">
              {START_LEVELS.map(l => (
                <button
                  key={l.level}
                  onClick={() => setStartLevel(l.level)}
                  className={`py-2 rounded-lg text-[12px] font-semibold border transition-all ${
                    startLevel === l.level
                      ? 'bg-navy text-white border-navy'
                      : 'bg-surface text-ink-muted border-line-soft hover:text-ink'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={submit}
              disabled={!name.trim()}
              className="flex-1 py-2 rounded-lg bg-navy text-white text-[13px] font-bold disabled:opacity-40"
            >
              Ajouter
            </button>
            <button
              onClick={() => { setAdding(false); setName(""); }}
              className="py-2 px-4 rounded-lg bg-surface border border-line-soft text-[13px] font-semibold text-ink-muted"
            >
              Annuler
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full mt-3 py-2 rounded-lg border border-dashed border-line-soft text-[13px] font-semibold text-ink-muted hover:text-ink hover:border-navy transition-all"
        >
          ＋ Ajouter une compétence
        </button>
      )}
    </Card>
  );
}
