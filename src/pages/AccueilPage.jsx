import { useState } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import LockIn from '../components/cap/LockIn';
import NorthStar from '../components/cap/NorthStar';
import SkillLadder from '../components/cap/SkillLadder';
import { fallbackAction } from '../lib/skills';
import { DOMAINS } from '../lib/constants';
import { OBJECTIVE } from '../lib/discipline';

// L'accueil ne propose pas, il ordonne : UNE action, maintenant. Le plan et
// tout le reste sont des outils repliés — pas l'écran. On agit d'abord.
export default function AccueilPage() {
  const ctx = useOutletContext();
  const [idx, setIdx] = useState(0);
  const [locked, setLocked] = useState(false);
  const [showAll, setShowAll] = useState(false);

  const active = ctx.activeSkills || [];
  // On sert l'axe le moins récemment touché : rien ne pourrit, pas d'hyperfocus.
  const ordered = [...active].sort((a, b) => (a.updatedAt || '').localeCompare(b.updatedAt || ''));
  const skill = ordered.length ? ordered[idx % ordered.length] : null;
  const act = skill ? (skill.currentAction || fallbackAction(skill)) : null;
  const dom = skill ? DOMAINS[skill.domain] : null;
  const generating = skill && ctx.generatingId === skill.id;

  return (
    <div className="flex flex-col gap-4 pt-1">
      {/* Le cap, en une ligne — pas un mur de réflexion */}
      <div className="text-center">
        <div className="text-[10px] font-bold tracking-[0.22em] uppercase text-ink-soft">{OBJECTIVE.eyebrow}</div>
        <div className="text-[13px] font-bold text-ink-muted">{OBJECTIVE.title}</div>
      </div>

      {/* Le score : il ne bouge que si tu agis */}
      <div className="flex items-center justify-center gap-2 text-[13px]">
        {ctx.actedToday ? (
          <span className="font-bold text-sage">✓ Minimum tenu aujourd'hui</span>
        ) : (
          <span className="font-bold text-coral">Pas encore agi aujourd'hui</span>
        )}
        <span className="text-line">·</span>
        <span className="font-extrabold text-ink">🔥 {ctx.streak}</span>
      </div>

      {/* L'UNE action — pas un menu */}
      {skill ? (
        <div className="rounded-3xl bg-gradient-to-br from-navy to-[#5A5F7A] p-6 text-white shadow-lg flex flex-col items-center text-center">
          <div className="text-[11px] font-bold tracking-[0.18em] uppercase opacity-50 mb-2">
            {dom?.icon} {skill.name}
          </div>
          <div className="text-[19px] font-extrabold leading-snug min-h-[2.2em] flex items-center">
            {generating ? 'Calibrage…' : act.action}
          </div>
          {!generating && (
            <div className="text-[12px] opacity-70 mt-1.5">⏱ ~{act.minutes} min · commence, c'est tout</div>
          )}
          <button
            onClick={() => setLocked(true)}
            disabled={generating}
            className="mt-5 w-full py-3.5 rounded-2xl bg-white text-navy text-[16px] font-extrabold disabled:opacity-40 hover:opacity-90 transition-opacity"
          >
            🔒 Maintenant — 1 minute
          </button>
          {ordered.length > 1 && (
            <button
              onClick={() => setIdx(i => i + 1)}
              className="mt-2 text-[12px] font-semibold text-white/60 hover:text-white/90 transition-colors"
            >
              → une autre
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-3xl bg-surface-2 p-6 text-center">
          <div className="text-[15px] font-bold text-ink">Aucun axe actif</div>
          <button onClick={() => setShowAll(true)} className="mt-2 text-[13px] font-semibold text-coral">
            Activer un axe →
          </button>
        </div>
      )}

      {/* Tout le plan — replié par défaut. Le plan reste un outil, pas l'écran. */}
      <button
        onClick={() => setShowAll(s => !s)}
        className="text-center text-[13px] font-semibold text-ink-muted py-1 hover:text-ink transition-colors"
      >
        {showAll ? 'Masquer le plan ▾' : 'Tout le plan ▸'}
      </button>
      {showAll && (
        <div className="flex flex-col gap-3.5 animate-fade-in">
          <NorthStar
            objective={ctx.objective}
            adjust={ctx.adjustObjective}
            adjusting={ctx.adjustingObjective}
            reset={ctx.resetObjective}
          />
          <SkillLadder ctx={ctx} />
        </div>
      )}

      <Link
        to="/plus"
        className="text-center text-[13px] font-semibold text-ink-soft py-2 no-underline hover:text-ink-muted transition-colors"
      >
        Le reste →
      </Link>

      {locked && skill && (
        <LockIn
          action={act.action}
          onFeedback={key => { ctx.complete(skill.id, key); setLocked(false); }}
          onClose={() => setLocked(false)}
        />
      )}
    </div>
  );
}
