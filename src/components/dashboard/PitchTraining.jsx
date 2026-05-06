import { useState } from 'react';
import Card from '../ui/Card';
import { playA440 } from '../../lib/audio';
import { usePitchTraining } from '../../hooks/usePitchTraining';

export default function PitchTraining() {
  const { todayCount, target, done, incrementToday, resetToday } = usePitchTraining();
  const [phase, setPhase] = useState('idle');

  const startSession = () => {
    setPhase('imagine');
  };

  const reveal = () => {
    playA440();
    setPhase('compare');
  };

  const replay = () => {
    playA440();
  };

  const validate = () => {
    incrementToday();
    setPhase('idle');
  };

  const cancel = () => {
    setPhase('idle');
  };

  const dots = Array.from({ length: target }, (_, i) => i < todayCount);

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <div className="text-xs font-bold text-coral">🎹 OREILLE ABSOLUE — LA 440</div>
        <div className="flex gap-1">
          {dots.map((filled, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full transition-colors"
              style={{ background: filled ? '#81B29A' : '#e5e0d8' }}
            />
          ))}
        </div>
      </div>

      <div className="text-[11px] text-gray-400 mb-2.5 leading-relaxed">
        {done
          ? "Fait pour aujourd'hui. Reviens demain."
          : `Entraîne ton cerveau ${target}× par jour à entendre le LA 440. ${todayCount}/${target} aujourd'hui.`}
      </div>

      {phase === 'idle' && !done && (
        <button
          onClick={startSession}
          className="w-full py-2.5 rounded-xl border-none bg-navy text-white text-[13px] font-semibold cursor-pointer font-nunito"
        >
          ▶ Démarrer une session
        </button>
      )}

      {phase === 'idle' && done && (
        <button
          onClick={resetToday}
          className="w-full py-2 rounded-xl border border-gray-200 bg-transparent text-gray-400 text-[11px] cursor-pointer font-nunito"
        >
          Reset (en cas d'erreur)
        </button>
      )}

      {phase === 'imagine' && (
        <div className="flex flex-col gap-2 animate-fade-in">
          <div className="text-[12px] text-navy text-center py-3 px-2 bg-[#f5f2ee] rounded-xl leading-relaxed">
            Ferme les yeux. Imagine le <b>LA 440</b> dans ta tête.
            <br />Chante-le, hum-le.
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={reveal}
              className="flex-1 py-2.5 rounded-xl border-none bg-coral text-white text-[13px] font-semibold cursor-pointer font-nunito"
            >
              🎹 Jouer le LA
            </button>
            <button
              onClick={cancel}
              className="px-3 py-2.5 rounded-xl border border-gray-200 bg-transparent text-gray-400 text-xs cursor-pointer font-nunito"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {phase === 'compare' && (
        <div className="flex flex-col gap-2 animate-fade-in">
          <div className="text-[12px] text-navy text-center py-3 px-2 bg-[#f5f2ee] rounded-xl leading-relaxed">
            Compare avec ce que tu avais en tête.
            <br />Ressens la note.
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={replay}
              className="flex-1 py-2.5 rounded-xl border border-coral bg-transparent text-coral text-[13px] font-semibold cursor-pointer font-nunito"
            >
              🔁 Rejouer
            </button>
            <button
              onClick={validate}
              className="flex-1 py-2.5 rounded-xl border-none bg-sage text-white text-[13px] font-semibold cursor-pointer font-nunito"
            >
              ✓ Validé +1
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}
