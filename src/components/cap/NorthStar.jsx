import { useState } from 'react';
import Spinner from '../ui/Spinner';
import { OBJECTIVE } from '../../lib/discipline';

export default function NorthStar({ objective, adjust, adjusting, reset }) {
  const [fixing, setFixing] = useState(false);
  const [note, setNote] = useState("");
  const obj = objective || { title: OBJECTIVE.title, statement: OBJECTIVE.statement };
  const customized = obj.title !== OBJECTIVE.title || obj.statement !== OBJECTIVE.statement;

  const send = () => {
    if (!note.trim()) return;
    adjust(note.trim());
    setNote(""); setFixing(false);
  };

  return (
    <div className="bg-gradient-to-br from-navy to-[#5A5F7A] rounded-3xl p-5 text-white shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <div className="text-[11px] font-bold tracking-[0.22em] uppercase opacity-50">{OBJECTIVE.eyebrow}</div>
        <button
          onClick={() => setFixing(f => !f)}
          className="text-[11px] font-semibold text-white/70 hover:text-white transition-colors"
        >
          {fixing ? '✕' : '🤔 Ajuster'}
        </button>
      </div>

      {adjusting ? (
        <div className="flex items-center gap-2 py-3 text-[14px] text-white/80">
          <Spinner size={16} /> Claude reformule ton objectif…
        </div>
      ) : (
        <>
          <h1 className="text-[22px] font-extrabold leading-tight mb-1.5">{obj.title}</h1>
          <div className="text-sm font-bold text-sand mb-3">{OBJECTIVE.pillars}</div>
          <p className="text-[14px] leading-relaxed opacity-80">{obj.statement}</p>
        </>
      )}

      {/* Ajustement en direct de l'objectif */}
      {fixing && !adjusting && (
        <div className="mt-3 flex flex-col gap-2">
          <input
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Qu'est-ce qui n'est pas cohérent ?"
            className="w-full px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 text-[13px] outline-none focus:border-white/50"
            autoFocus
            onKeyDown={e => { if (e.key === 'Enter') send(); }}
          />
          <div className="flex gap-2 items-center">
            <button
              onClick={send}
              disabled={!note.trim()}
              className="flex-1 py-1.5 rounded-lg bg-white text-navy text-[12px] font-bold disabled:opacity-40"
            >
              Ajuster avec Claude
            </button>
            {customized && (
              <button
                onClick={() => { reset(); setFixing(false); }}
                className="py-1.5 px-3 rounded-lg bg-white/10 border border-white/20 text-white text-[12px] font-semibold"
              >
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
