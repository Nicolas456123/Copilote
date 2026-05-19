import { useState } from 'react';
import { DOMAINS } from '../../lib/constants';

export default function CreateProjectAI({ onCreate, loading }) {
  const [open, setOpen] = useState(false);
  const [idea, setIdea] = useState('');
  const [preview, setPreview] = useState(null);

  const handleGenerate = async () => {
    if (!idea.trim()) return;
    const result = await onCreate(idea.trim());
    if (result) setPreview(result);
  };

  const accept = () => {
    if (preview) {
      onCreate(null, preview);
      setPreview(null);
      setIdea('');
      setOpen(false);
    }
  };

  const reset = () => {
    setPreview(null);
    setIdea('');
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="w-full p-2.5 rounded-lg border-2 border-dashed border-coral bg-coral/5 text-coral text-sm font-semibold cursor-pointer font-nunito hover:bg-coral/10 transition-colors"
      >
        ✨ Créer un projet avec l'IA
      </button>
    );
  }

  const previewLines = (steps, depth = 0) => {
    return (steps || []).flatMap(s => [
      <div key={s.text + depth} className="text-[13px] text-ink leading-snug" style={{ paddingLeft: depth * 12 }}>
        {depth === 0 ? '•' : '◦'} {s.text}
      </div>,
      ...previewLines(s.children, depth + 1),
    ]);
  };

  return (
    <div className="bg-surface rounded-2xl p-3 border border-line shadow-sm animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-bold text-coral">✨ NOUVEAU PROJET — IA</div>
        <button
          onClick={() => { setOpen(false); reset(); }}
          className="bg-transparent border-none text-ink-soft text-base cursor-pointer"
        >×</button>
      </div>

      {!preview ? (
        <>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="Décris ton idée : « Lancer une chaîne YouTube sur le BTP » · « Apprendre à mixer une chanson sur FL Studio » · « Faire le code moto en 1 mois »…"
            rows={3}
            autoFocus
            className="w-full text-[14px] py-2 px-2.5 rounded-lg border border-line bg-surface font-nunito resize-none focus:outline-none focus:border-coral"
          />
          <button
            onClick={handleGenerate}
            disabled={!idea.trim() || loading}
            className="w-full mt-2 py-2 rounded-lg border-none bg-navy text-white text-[14px] font-semibold cursor-pointer font-nunito disabled:opacity-40"
          >
            {loading ? '… génération' : 'Générer le projet'}
          </button>
        </>
      ) : (
        <>
          <div className="text-[12px] text-ink-muted mb-1">
            Domaine : <b style={{ color: DOMAINS[preview.domain]?.color }}>{DOMAINS[preview.domain]?.icon} {DOMAINS[preview.domain]?.label}</b>
          </div>
          <div className="text-base font-bold text-ink mb-2">{preview.name}</div>
          <div className="bg-surface-2 rounded-lg p-2.5 mb-2 max-h-64 overflow-auto">
            {previewLines(preview.steps)}
          </div>
          <div className="flex gap-1.5">
            <button
              onClick={reset}
              className="px-3 py-1.5 rounded-lg border border-line bg-transparent text-ink-muted text-[13px] cursor-pointer font-nunito"
            >
              Recommencer
            </button>
            <button
              onClick={accept}
              className="flex-1 py-1.5 rounded-lg border-none bg-sage text-white text-[13px] font-semibold cursor-pointer font-nunito"
            >
              ✓ Créer ce projet
            </button>
          </div>
        </>
      )}
    </div>
  );
}
