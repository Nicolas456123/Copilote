import { useState } from 'react';
import Card from '../ui/Card';
import {
  MANSON_VALUES,
  MANSON_FALSE_VALUES,
  MANSON_PRINCIPLES,
  getDailyPrinciple,
} from '../../lib/mansonValues';

export default function MansonValues() {
  const [openId, setOpenId] = useState(null);
  const [showFalse, setShowFalse] = useState(false);
  const [openFalseId, setOpenFalseId] = useState(null);
  const [showAllPrinciples, setShowAllPrinciples] = useState(false);
  const daily = getDailyPrinciple();

  return (
    <Card>
      <div className="rounded-xl bg-gradient-to-br from-[#3D405B] to-[#5d6082] p-3 mb-3">
        <div className="text-[12px] font-bold text-sand mb-1.5 tracking-wider">
          💭 PENSÉE DU JOUR — {daily.index + 1}/{MANSON_PRINCIPLES.length}
        </div>
        <div className="text-[12.5px] text-white leading-relaxed italic">
          "{daily.text}"
        </div>
        <button
          onClick={() => setShowAllPrinciples(s => !s)}
          className="mt-2 text-[12px] text-sand/70 underline cursor-pointer bg-transparent border-none p-0 font-nunito"
        >
          {showAllPrinciples ? "Masquer les 12 principes" : "Voir les 12 principes"}
        </button>
        {showAllPrinciples && (
          <div className="mt-2 flex flex-col gap-1 animate-fade-in">
            {MANSON_PRINCIPLES.map((p, i) => (
              <div
                key={i}
                className={`text-[13px] leading-relaxed py-1 px-2 rounded ${i === daily.index ? "bg-surface/15 text-white" : "text-white/70"}`}
              >
                <span className="text-sand font-bold mr-1.5">{i + 1}.</span>
                {p}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="text-sm font-bold text-coral mb-2">📕 LES 5 VALEURS — MANSON</div>
      <div className="text-[13px] text-ink-muted mb-2.5 leading-relaxed">
        Lis-les chaque jour. Touche une valeur pour voir où elle apparaît dans ta vie.
      </div>
      <div className="flex flex-col gap-1.5">
        {MANSON_VALUES.map((v, i) => {
          const isOpen = openId === v.id;
          return (
            <div
              key={v.id}
              onClick={() => setOpenId(isOpen ? null : v.id)}
              className="rounded-xl p-2.5 cursor-pointer transition-all"
              style={{
                background: isOpen ? `${v.color}14` : "var(--color-surface-2)",
                borderLeft: `3px solid ${v.color}`,
              }}
            >
              <div className="flex items-center gap-2">
                <span
                  className="flex items-center justify-center w-6 h-6 rounded-full text-[13px] font-bold text-white shrink-0"
                  style={{ background: v.color }}
                >
                  {i + 1}
                </span>
                <span className="text-base">{v.icon}</span>
                <span className="text-[15px] font-bold text-ink flex-1">{v.title}</span>
                <span className="text-ink-soft text-sm">{isOpen ? "−" : "+"}</span>
              </div>
              <div className="text-[14px] text-ink/80 italic mt-1 ml-8 leading-snug">
                "{v.pitch}"
              </div>
              {isOpen && (
                <div className="text-[14px] text-ink-muted leading-relaxed mt-2 ml-8 animate-fade-in">
                  {v.trigger}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={() => setShowFalse(s => !s)}
        className="w-full mt-3 py-2 rounded-xl border border-dashed border-line bg-transparent text-ink-muted text-[13px] font-semibold cursor-pointer font-nunito"
      >
        {showFalse ? "Masquer les 4 fausses valeurs" : "⚠️ Voir les 4 fausses valeurs (à éviter)"}
      </button>

      {showFalse && (
        <div className="flex flex-col gap-1.5 mt-2 animate-fade-in">
          <div className="text-[13px] text-ink-muted leading-relaxed mb-1">
            À fuir : ces valeurs n'engendrent que des problèmes inextricables.
          </div>
          {MANSON_FALSE_VALUES.map(v => {
            const isOpen = openFalseId === v.id;
            return (
              <div
                key={v.id}
                onClick={() => setOpenFalseId(isOpen ? null : v.id)}
                className="rounded-xl p-2.5 cursor-pointer transition-all bg-[#faf5f2]"
                style={{ borderLeft: "3px solid #c0392b" }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-base">{v.icon}</span>
                  <span className="text-[15px] font-bold text-ink flex-1 line-through decoration-1 decoration-[#c0392b]/40">
                    {v.title}
                  </span>
                  <span className="text-ink-soft text-sm">{isOpen ? "−" : "+"}</span>
                </div>
                <div className="text-[14px] text-ink/70 italic mt-1 ml-6 leading-snug">
                  "{v.pitch}"
                </div>
                {isOpen && (
                  <div className="text-[14px] text-ink-muted leading-relaxed mt-2 ml-6 animate-fade-in">
                    {v.detail}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
