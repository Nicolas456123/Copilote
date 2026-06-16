import { useState, useEffect } from 'react';
import { FEEDBACK } from '../../lib/skills';
import { formatTime } from '../../utils/time';

// ── Mode Lock-in ──────────────────────────────────────────────────────────
// L'instant d'exécution. On ne décide plus, on agit. Compte à rebours pour
// court-circuiter la délibération, puis UNE minute — « 1 minute c'est mieux
// que zéro ». Une pensée intrusive ? On la « gare » sans quitter la tâche.

const PARKING_KEY = 'copilote.parking';

function park(thought) {
  try {
    const prev = JSON.parse(localStorage.getItem(PARKING_KEY) || '[]');
    prev.push({ thought, at: new Date().toISOString() });
    localStorage.setItem(PARKING_KEY, JSON.stringify(prev));
  } catch { /* localStorage indisponible : on n'empêche pas l'action */ }
}

export default function LockIn({ action, onFeedback, onClose }) {
  const [phase, setPhase] = useState('countdown'); // countdown · running · done
  const [count, setCount] = useState(5);
  const [left, setLeft] = useState(60);
  const [note, setNote] = useState('');
  const [parked, setParked] = useState(false);

  // 5 → 1 puis GO : on bouge avant que le cerveau monte sa défense.
  useEffect(() => {
    if (phase !== 'countdown') return undefined;
    const id = setTimeout(() => {
      if (count <= 1) { setPhase('running'); setLeft(60); }
      else setCount(count - 1);
    }, 850);
    return () => clearTimeout(id);
  }, [phase, count]);

  // La minute : 60 → 0.
  useEffect(() => {
    if (phase !== 'running') return undefined;
    const id = setTimeout(() => {
      if (left <= 1) setPhase('done');
      else setLeft(left - 1);
    }, 1000);
    return () => clearTimeout(id);
  }, [phase, left]);

  const submitNote = () => {
    if (!note.trim()) return;
    park(note.trim());
    setNote(''); setParked(true);
    setTimeout(() => setParked(false), 2400);
  };

  const again = () => { setLeft(60); setPhase('running'); };

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center px-6 text-white animate-fade-in"
      style={{ background: 'linear-gradient(160deg, #3D405B, #232539)' }}
    >
      {/* L'action déjà décidée — rappelée, pas re-décidée */}
      <div className="absolute top-8 left-0 right-0 px-8 text-center">
        <div className="text-[11px] font-bold tracking-[0.22em] uppercase opacity-50 mb-1">Lock-in</div>
        <div className="text-[15px] font-semibold opacity-90 leading-snug">{action}</div>
      </div>

      {phase === 'countdown' && (
        <div className="flex flex-col items-center">
          <div className="text-[120px] font-extrabold tabular-nums leading-none animate-pulse">{count}</div>
          <div className="text-[15px] opacity-70 mt-2 text-center max-w-[280px]">
            Tu n'as pas à avoir envie. Juste à commencer.
          </div>
        </div>
      )}

      {phase === 'running' && (
        <div className="flex flex-col items-center">
          <div className="text-[72px] font-extrabold tabular-nums leading-none">{formatTime(left)}</div>
          <div className="text-[17px] font-bold text-sand mt-3">1 minute, c'est mieux que zéro.</div>
          <div className="text-[14px] opacity-70 mt-1 text-center max-w-[260px]">
            Même si la prépa dure plus longtemps. Le but, c'est de bouger.
          </div>
          <button
            onClick={() => setPhase('done')}
            className="mt-6 px-6 py-2.5 rounded-xl bg-sage text-white text-[15px] font-bold hover:opacity-90 transition-opacity"
          >
            C'est lancé →
          </button>
        </div>
      )}

      {phase === 'done' && (
        <div className="flex flex-col items-center w-full max-w-[320px]">
          <div className="text-[40px]">🎉</div>
          <div className="text-[20px] font-extrabold mt-1">Tu es lancé.</div>
          <div className="text-[14px] opacity-75 mt-1 text-center">
            Le plus dur — commencer — est fait. Continue, ou note ton ressenti.
          </div>
          <button
            onClick={again}
            className="mt-5 w-full py-3 rounded-xl bg-sand text-navy text-[15px] font-bold hover:opacity-90 transition-opacity"
          >
            ↻ Encore 1 minute
          </button>
          {onFeedback && (
            <div className="grid grid-cols-4 gap-1.5 mt-2.5 w-full">
              {Object.entries(FEEDBACK).map(([key, f]) => (
                <button
                  key={key}
                  onClick={() => onFeedback(key)}
                  className="flex flex-col items-center gap-0.5 py-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <span className="text-base leading-none">{f.icon}</span>
                  <span className="text-[9px] font-semibold leading-tight text-center">{f.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Le parking : déposer la pensée intrusive sans quitter la tâche */}
      <div className="absolute bottom-24 left-0 right-0 px-6">
        {parked ? (
          <div className="text-center text-[13px] text-sand font-semibold">🅿️ Noté. On y reviendra à la revue.</div>
        ) : (
          <div className="flex gap-2 max-w-[360px] mx-auto">
            <input
              value={note}
              onChange={e => setNote(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') submitNote(); }}
              placeholder="🅿️ Une pensée te tire ailleurs ? Gare-la ici."
              className="flex-1 px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 text-[13px] outline-none focus:border-white/50"
            />
            {note.trim() && (
              <button onClick={submitNote} className="px-3 rounded-lg bg-white text-navy text-[12px] font-bold">
                Garer
              </button>
            )}
          </div>
        )}
      </div>

      <button
        onClick={onClose}
        className="absolute bottom-8 left-0 right-0 mx-auto text-[13px] font-semibold text-white/50 hover:text-white/80 transition-colors"
      >
        Quitter
      </button>
    </div>
  );
}
