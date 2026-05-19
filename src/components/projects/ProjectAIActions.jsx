import { useState } from 'react';
import AIBtn from '../ui/AIBtn';

export default function ProjectAIActions({
  domainColor,
  onBreakdown, onAdvice, onReorganize, onUnblock, onCelebrate,
  onCustomModify,
  isLoading,
}) {
  const [editingInstr, setEditingInstr] = useState(false);
  const [instruction, setInstruction] = useState('');

  const submitModify = () => {
    if (!instruction.trim()) return;
    onCustomModify(instruction.trim());
    setInstruction('');
    setEditingInstr(false);
  };

  return (
    <div className="bg-surface-2 rounded-lg p-2.5 mb-2.5">
      <div className="text-[12px] font-bold text-ink/40 mb-1.5 tracking-wide">🤖 ACTIONS IA</div>
      <div className="flex gap-1.5 flex-wrap">
        <AIBtn icon="🔪" label="Découper" onClick={onBreakdown} loading={isLoading("breakdown")} />
        <AIBtn icon="💡" label="Conseil" onClick={onAdvice} loading={isLoading("advice")} />
        <AIBtn icon="🔄" label="Réorganiser" onClick={onReorganize} loading={isLoading("reorg")} color={`linear-gradient(135deg, ${domainColor}, ${domainColor}cc)`} />
        <AIBtn icon="⚡" label="Débloquer" onClick={onUnblock} loading={isLoading("unblock")} color="linear-gradient(135deg, #E07A5F, #c94c30)" />
        <AIBtn icon="🎉" label="Célébrer" onClick={onCelebrate} loading={isLoading("celebrate")} color="linear-gradient(135deg, #81B29A, #5a9e80)" />
        <AIBtn icon="✏️" label="Modifier" onClick={() => setEditingInstr(true)} loading={isLoading("modify")} color="linear-gradient(135deg, #3D405B, #5A5F7A)" />
      </div>

      {editingInstr && (
        <div className="mt-2 animate-fade-in">
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            placeholder="Dis exactement à l'IA ce que tu veux changer : ajouter une étape, retirer X, réorganiser dans tel sens, fusionner deux étapes…"
            rows={3}
            autoFocus
            onKeyDown={(e) => {
              if (e.key === 'Escape') { setEditingInstr(false); setInstruction(''); }
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submitModify();
            }}
            className="w-full text-[13px] py-2 px-2.5 rounded-lg border border-line bg-surface font-nunito resize-none focus:outline-none focus:border-coral"
          />
          <div className="flex gap-1.5 mt-1.5">
            <button
              onClick={() => { setEditingInstr(false); setInstruction(''); }}
              className="px-3 py-1.5 rounded-lg border border-line bg-transparent text-ink-muted text-[13px] cursor-pointer font-nunito"
            >
              Annuler
            </button>
            <button
              onClick={submitModify}
              disabled={!instruction.trim() || isLoading("modify")}
              className="flex-1 py-1.5 rounded-lg border-none bg-navy text-white text-[13px] font-semibold cursor-pointer font-nunito disabled:opacity-40"
            >
              {isLoading("modify") ? '…' : 'Appliquer (les étapes non faites seront remplacées)'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
