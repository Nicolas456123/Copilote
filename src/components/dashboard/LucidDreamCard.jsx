import { useState } from 'react';
import Card from '../ui/Card';
import { useLucidDream } from '../../hooks/useLucidDream';

const REALITY_CHECK_TIPS = [
  'Regarde tes mains : ont-elles un nombre étrange de doigts ?',
  'Essaie de respirer en pinçant ton nez. Tu peux ? Tu rêves.',
  'Lis un texte, regarde ailleurs, relis : les lettres changent ?',
  'Pousse ton doigt contre ta paume : passe-t-il à travers ?',
  'Saute légèrement : retombes-tu lentement ?',
];

function formatDate(iso) {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function LucidDreamCard() {
  const {
    target, checksToday, dreams, dreamsToday, hadLucidToday,
    lucidStreak, dreamRecallStreak,
    recordCheck, addDream, toggleDreamLucid, removeDream,
  } = useLucidDream();

  const [phase, setPhase] = useState('idle');
  const [tip, setTip] = useState(REALITY_CHECK_TIPS[0]);
  const [dreamText, setDreamText] = useState('');
  const [dreamLucid, setDreamLucid] = useState(false);
  const [showHistory, setShowHistory] = useState(false);

  const checkProgress = Math.min(checksToday, target);
  const dots = Array.from({ length: target }, (_, i) => i < checkProgress);

  const startCheck = () => {
    setTip(REALITY_CHECK_TIPS[Math.floor(Math.random() * REALITY_CHECK_TIPS.length)]);
    setPhase('check');
  };

  const finishCheck = (wasDreaming) => {
    recordCheck(wasDreaming);
    setPhase('idle');
  };

  const submitDream = () => {
    if (!dreamText.trim()) return;
    addDream(dreamText, dreamLucid);
    setDreamText('');
    setDreamLucid(false);
    setPhase('idle');
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-bold text-coral">🌙 RÊVE LUCIDE</div>
        <div className="flex gap-1">
          {dots.map((on, i) => (
            <div
              key={i}
              className="w-2.5 h-2.5 rounded-full"
              style={{ background: on ? '#81B29A' : '#e5e0d8' }}
            />
          ))}
        </div>
      </div>

      <div className="text-[13px] text-gray-400 mb-2.5 leading-relaxed">
        Reality checks : <b className="text-navy">{checksToday}/{target}</b> aujourd'hui · Rappel rêves : <b className="text-navy">{dreamRecallStreak}j</b>
        {lucidStreak > 0 && <> · Lucides : <b className="text-coral">{lucidStreak}j</b> 🔥</>}
      </div>

      {phase === 'idle' && (
        <div className="flex flex-col gap-1.5">
          <button
            onClick={startCheck}
            className="w-full py-2.5 rounded-xl border-none bg-navy text-white text-[15px] font-semibold cursor-pointer font-nunito"
          >
            ✋ Reality check
          </button>
          <button
            onClick={() => setPhase('dream')}
            className="w-full py-2 rounded-xl border border-coral bg-transparent text-coral text-[14px] font-semibold cursor-pointer font-nunito"
          >
            📓 Noter un rêve {hadLucidToday && '· ✨ lucide aujourd\'hui'}
          </button>
        </div>
      )}

      {phase === 'check' && (
        <div className="flex flex-col gap-2 animate-fade-in">
          <div className="text-[14px] text-navy text-center py-3 px-2 bg-[#f5f2ee] rounded-xl leading-relaxed">
            <b>Suis-je en train de rêver ?</b>
            <br />
            <span className="text-[13px] text-gray-500">{tip}</span>
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={() => finishCheck(false)}
              className="flex-1 py-2 rounded-xl border-none bg-sage text-white text-[14px] font-semibold cursor-pointer font-nunito"
            >
              😐 Éveillé
            </button>
            <button
              onClick={() => finishCheck(true)}
              className="flex-1 py-2 rounded-xl border-none bg-coral text-white text-[14px] font-semibold cursor-pointer font-nunito"
            >
              ✨ Je rêve !
            </button>
          </div>
          <button
            onClick={() => setPhase('idle')}
            className="text-[12px] text-gray-400 underline bg-transparent border-none cursor-pointer font-nunito"
          >
            Annuler
          </button>
        </div>
      )}

      {phase === 'dream' && (
        <div className="flex flex-col gap-2 animate-fade-in">
          <textarea
            value={dreamText}
            onChange={(e) => setDreamText(e.target.value)}
            placeholder="Note rapidement ton rêve : lieux, personnes, émotions, indices bizarres..."
            rows={4}
            autoFocus
            className="w-full text-[14px] py-2 px-3 rounded-xl border border-gray-200 bg-white font-nunito resize-none focus:outline-none focus:border-coral"
          />
          <label className="flex items-center gap-2 text-[14px] text-navy cursor-pointer">
            <input
              type="checkbox"
              checked={dreamLucid}
              onChange={(e) => setDreamLucid(e.target.checked)}
              className="w-4 h-4 accent-coral cursor-pointer"
            />
            ✨ J'étais lucide pendant ce rêve
          </label>
          <div className="flex gap-1.5">
            <button
              onClick={() => { setPhase('idle'); setDreamText(''); setDreamLucid(false); }}
              className="px-3 py-2 rounded-xl border border-gray-200 bg-transparent text-gray-400 text-[14px] cursor-pointer font-nunito"
            >
              Annuler
            </button>
            <button
              onClick={submitDream}
              disabled={!dreamText.trim()}
              className="flex-1 py-2 rounded-xl border-none bg-navy text-white text-[14px] font-semibold cursor-pointer font-nunito disabled:opacity-40"
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}

      {phase === 'idle' && dreamsToday.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-gray-100">
          <div className="text-[12px] text-gray-400 font-semibold mb-1">AUJOURD'HUI</div>
          {dreamsToday.map(d => (
            <div key={d.id} className="text-[13px] text-navy py-1 leading-relaxed">
              {d.lucid && <span className="text-coral">✨ </span>}
              {d.text}
            </div>
          ))}
        </div>
      )}

      {phase === 'idle' && dreams.length > 0 && (
        <div className="mt-2.5 pt-2 border-t border-gray-100">
          <button
            onClick={() => setShowHistory(s => !s)}
            className="w-full text-left text-[13px] text-gray-500 font-semibold bg-transparent border-none cursor-pointer p-0 font-nunito"
          >
            {showHistory ? '▾' : '▸'} Historique ({dreams.length})
          </button>
          {showHistory && (
            <div className="flex flex-col gap-1 mt-2 max-h-64 overflow-y-auto animate-fade-in">
              {[...dreams].reverse().slice(0, 30).map(d => (
                <div key={d.id} className="flex items-start gap-2 text-[13px] py-1.5 px-2 rounded-lg bg-[#fafafa]">
                  <button
                    onClick={() => toggleDreamLucid(d.id)}
                    className="bg-transparent border-none cursor-pointer text-[14px] mt-0.5"
                    title="Basculer lucide"
                  >
                    {d.lucid ? '✨' : '·'}
                  </button>
                  <div className="flex-1">
                    <div className="text-gray-400 text-[12px] tabular-nums">{formatDate(d.timestamp)}</div>
                    <div className="text-navy">{d.text}</div>
                  </div>
                  <button
                    onClick={() => removeDream(d.id)}
                    className="text-gray-300 text-[12px] bg-transparent border-none cursor-pointer hover:text-coral"
                    title="Supprimer"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
