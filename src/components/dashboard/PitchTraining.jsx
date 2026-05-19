import { useState } from 'react';
import Card from '../ui/Card';
import { playA440, playPianoNote, noteFromSemitone, NOTES_AROUND_A4, ecartLabel } from '../../lib/audio';
import { usePitchTraining } from '../../hooks/usePitchTraining';

function formatTime(iso) {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function formatDate(iso) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function ecartColor(ecart) {
  const abs = Math.abs(ecart);
  if (abs === 0) return '#81B29A';
  if (abs <= 1) return '#F2CC8F';
  if (abs <= 2) return '#E07A5F';
  return '#c0392b';
}

function PianoKeyboard({ onPick, picked }) {
  return (
    <div className="flex gap-0.5 mt-2">
      {NOTES_AROUND_A4.map(n => {
        const isTarget = n.target;
        const isPicked = picked === n.offset;
        return (
          <button
            key={n.offset}
            onClick={() => onPick(n)}
            className={`flex-1 py-2 rounded-lg border-none text-[12px] font-bold cursor-pointer font-nunito transition-all ${n.sharp ? 'bg-navy text-white' : 'bg-surface-2 text-ink'}`}
            style={{
              outline: isPicked ? '2px solid #E07A5F' : isTarget ? '2px solid #81B29A' : 'none',
              outlineOffset: isPicked || isTarget ? '-2px' : 0,
              transform: isPicked ? 'scale(0.95)' : 'scale(1)',
            }}
            title={`${n.name} (${n.offset > 0 ? '+' : ''}${n.offset} demi-tons)`}
          >
            {n.short}
          </button>
        );
      })}
    </div>
  );
}

export default function PitchTraining() {
  const { todayCount, validatedToday, target, done, todayHistory, history, recordSession, removeSession, clearAll } = usePitchTraining();
  const [phase, setPhase] = useState('idle');
  const [pickedNote, setPickedNote] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [flash, setFlash] = useState(null);

  const startSession = () => {
    setPickedNote(null);
    setPhase('imagine');
  };

  const reveal = () => {
    playA440();
    setPhase('compare');
  };

  const replay = () => playA440();

  const finish = (session) => {
    recordSession(session);
    setFlash(session);
    setPickedNote(null);
    setPhase('idle');
    setTimeout(() => setFlash(null), 2200);
  };

  const validateJust = () => {
    finish({ result: 'validated', ecart: 0 });
  };

  const pickNote = (note) => {
    setPickedNote(note.offset);
    playPianoNote(noteFromSemitone(note.offset), 1.5);
  };

  const confirmOff = () => {
    if (pickedNote === null) return;
    if (pickedNote === 0) {
      finish({ result: 'validated', ecart: 0 });
    } else {
      finish({ result: 'off', ecart: pickedNote, guess: pickedNote });
    }
  };

  const cancel = () => {
    setPickedNote(null);
    setPhase('idle');
  };

  const dots = Array.from({ length: target }, (_, i) => {
    if (i >= todayHistory.length) return { color: '#e5e0d8' };
    const s = todayHistory[i];
    return { color: ecartColor(s.ecart ?? 99) };
  });

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-bold text-coral">🎹 OREILLE ABSOLUE — LA 440</div>
        <div className="flex gap-1">
          {dots.map((d, i) => (
            <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
          ))}
        </div>
      </div>

      <div className="text-[13px] text-ink-muted mb-2.5 leading-relaxed">
        {done
          ? `✓ Fait pour aujourd'hui · ${validatedToday}/${todayCount} justes.`
          : `Entraîne ton cerveau ${target}× par jour. ${todayCount}/${target} aujourd'hui · ${validatedToday} justes.`}
      </div>

      {flash && phase === 'idle' && (
        <div
          className="text-[14px] text-center py-2 px-3 rounded-xl mb-2 animate-fade-in font-semibold"
          style={{ background: `${ecartColor(flash.ecart)}22`, color: ecartColor(flash.ecart) }}
        >
          {flash.result === 'validated'
            ? '✓ Juste ! Ancré.'
            : `Écart : ${ecartLabel(flash.ecart)} ${flash.ecart > 0 ? 'au-dessus' : 'en dessous'}`}
        </div>
      )}

      {phase === 'idle' && (
        <button
          onClick={startSession}
          className="w-full py-2.5 rounded-xl border-none bg-navy text-white text-[15px] font-semibold cursor-pointer font-nunito"
        >
          ▶ Démarrer une session
        </button>
      )}

      {phase === 'imagine' && (
        <div className="flex flex-col gap-2 animate-fade-in">
          <div className="text-[14px] text-ink text-center py-3 px-2 bg-surface-2 rounded-xl leading-relaxed">
            Ferme les yeux. Imagine le <b>LA 440</b>.
            <br />Chante-le, hum-le.
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={reveal}
              className="flex-1 py-2.5 rounded-xl border-none bg-coral text-white text-[15px] font-semibold cursor-pointer font-nunito"
            >
              🎹 Jouer le LA
            </button>
            <button
              onClick={cancel}
              className="px-3 py-2.5 rounded-xl border border-line bg-transparent text-ink-muted text-sm cursor-pointer font-nunito"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      {phase === 'compare' && (
        <div className="flex flex-col gap-2 animate-fade-in">
          <div className="text-[14px] text-ink text-center py-2 px-2 bg-surface-2 rounded-xl leading-relaxed">
            Tu avais juste ? Sinon clique la note que tu pensais avoir.
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={replay}
              className="flex-1 py-2 rounded-xl border border-coral bg-transparent text-coral text-[14px] font-semibold cursor-pointer font-nunito"
            >
              🔁 Rejouer
            </button>
            <button
              onClick={validateJust}
              className="flex-1 py-2 rounded-xl border-none bg-sage text-white text-[14px] font-semibold cursor-pointer font-nunito"
            >
              ✓ Juste !
            </button>
          </div>
          <PianoKeyboard onPick={pickNote} picked={pickedNote} />
          {pickedNote !== null && (
            <div className="flex items-center gap-1.5 mt-1 animate-fade-in">
              <div
                className="flex-1 text-[14px] text-center py-2 rounded-xl font-semibold"
                style={{
                  background: `${ecartColor(pickedNote)}22`,
                  color: ecartColor(pickedNote),
                }}
              >
                {pickedNote === 0
                  ? 'C\'est le LA. Bien joué.'
                  : `Écart : ${ecartLabel(pickedNote)} ${pickedNote > 0 ? 'au-dessus' : 'en dessous'}`}
              </div>
              <button
                onClick={confirmOff}
                className="px-3 py-2 rounded-xl border-none bg-navy text-white text-[14px] font-semibold cursor-pointer font-nunito"
              >
                Enregistrer
              </button>
            </div>
          )}
          <button
            onClick={cancel}
            className="text-[12px] text-ink-muted underline bg-transparent border-none cursor-pointer mt-1 font-nunito"
          >
            Annuler la session
          </button>
        </div>
      )}

      {phase === 'idle' && (history.length > 0 || done) && (
        <div className="mt-3 pt-2.5 border-t border-line-soft">
          <button
            onClick={() => setShowHistory(s => !s)}
            className="w-full text-left text-[13px] text-ink-muted font-semibold bg-transparent border-none cursor-pointer p-0 font-nunito"
          >
            {showHistory ? '▾' : '▸'} Historique ({history.length})
          </button>
          {showHistory && (
            <div className="flex flex-col gap-1 mt-2 max-h-48 overflow-y-auto animate-fade-in">
              {[...history].reverse().slice(0, 30).map(s => {
                const noteShort = s.guess !== undefined
                  ? NOTES_AROUND_A4.find(n => n.offset === s.guess)?.short
                  : null;
                return (
                  <div
                    key={s.timestamp}
                    className="flex items-center gap-2 text-[13px] py-1 px-2 rounded-lg bg-surface-3"
                  >
                    <span className="text-ink-muted tabular-nums">
                      {formatDate(s.timestamp)} {formatTime(s.timestamp)}
                    </span>
                    <span
                      className="flex-1 font-semibold"
                      style={{ color: ecartColor(s.ecart ?? 0) }}
                    >
                      {s.result === 'validated'
                        ? '✓ Juste'
                        : `${noteShort ? `→ ${noteShort}` : '✗'} (${ecartLabel(s.ecart)})`}
                    </span>
                    <button
                      onClick={() => removeSession(s.timestamp)}
                      className="text-ink-soft text-[12px] bg-transparent border-none cursor-pointer hover:text-coral"
                      title="Supprimer"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
              {history.length > 0 && (
                <button
                  onClick={() => { if (confirm("Vider tout l'historique ?")) clearAll(); }}
                  className="text-[12px] text-ink-soft underline bg-transparent border-none cursor-pointer mt-1 font-nunito self-end"
                >
                  Tout effacer
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
