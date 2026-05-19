import { useState } from 'react';
import { isStepFullyDone } from '../../utils/stepTree';

const MAX_DEPTH = 3;
const INDENTS = ['', 'pl-4', 'pl-8', 'pl-10'];

export default function StepItem({
  step, depth = 0,
  onToggle, onDelete, onDetail, onAddChild,
  loading,
}) {
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState('');
  const hasChildren = !!step.children?.length;
  const fullyDone = isStepFullyDone(step);
  const canNest = depth < MAX_DEPTH - 1;
  const indent = INDENTS[Math.min(depth, INDENTS.length - 1)];

  const submitAdd = () => {
    if (newText.trim()) {
      onAddChild(step.id, newText.trim());
      setNewText('');
      setAdding(false);
    }
  };

  return (
    <div className={indent}>
      <div className="flex items-start gap-2 py-1.5">
        <button
          onClick={() => onToggle(step.id)}
          className="w-[22px] h-[22px] rounded-[5px] shrink-0 mt-0.5 flex items-center justify-center text-white text-[13px] cursor-pointer bg-transparent"
          style={{
            border: `2px solid ${fullyDone ? '#81B29A' : 'var(--color-line)'}`,
            background: fullyDone ? '#81B29A' : 'transparent',
          }}
        >
          {fullyDone && '✓'}
        </button>
        <div className={`flex-1 text-sm font-medium leading-snug ${fullyDone ? 'text-ink-soft line-through' : 'text-ink'}`}>
          {step.text}
        </div>
        <div className="flex gap-0.5 shrink-0">
          {!fullyDone && canNest && onDetail && (
            <button
              onClick={() => onDetail(step)}
              disabled={loading}
              title="Découper en sous-étapes"
              className="bg-none border-none cursor-pointer text-[15px] p-0.5 opacity-50 hover:opacity-100 disabled:opacity-30"
            >
              🔍
            </button>
          )}
          {canNest && (
            <button
              onClick={() => setAdding(true)}
              title="Ajouter une sous-étape"
              className="bg-none border-none cursor-pointer text-[14px] p-0.5 opacity-50 hover:opacity-100 text-sage"
            >
              +
            </button>
          )}
          <button
            onClick={() => onDelete(step.id)}
            className="bg-none border-none text-ink-soft text-[15px] cursor-pointer p-0.5 hover:text-coral"
          >
            ×
          </button>
        </div>
      </div>

      {adding && (
        <div className="flex gap-1.5 ml-7 mb-1.5 animate-fade-in">
          <input
            value={newText}
            onChange={e => setNewText(e.target.value)}
            placeholder="Sous-étape…"
            onKeyDown={e => {
              if (e.key === 'Enter') submitAdd();
              if (e.key === 'Escape') { setAdding(false); setNewText(''); }
            }}
            autoFocus
            className="flex-1 p-1 rounded-lg border border-line-soft text-[13px] font-nunito outline-none focus:border-sage"
          />
          <button
            onClick={submitAdd}
            className="px-2 py-1 rounded-lg border-none bg-sage text-white text-[12px] font-bold cursor-pointer font-nunito"
          >OK</button>
          <button
            onClick={() => { setAdding(false); setNewText(''); }}
            className="px-2 py-1 rounded-lg border-none bg-transparent text-ink-soft text-[12px] cursor-pointer font-nunito"
          >×</button>
        </div>
      )}

      {hasChildren && (
        <div className="border-l border-line-soft ml-2.5">
          {step.children.map(child => (
            <StepItem
              key={child.id}
              step={child}
              depth={depth + 1}
              onToggle={onToggle}
              onDelete={onDelete}
              onDetail={onDetail}
              onAddChild={onAddChild}
              loading={loading}
            />
          ))}
        </div>
      )}
    </div>
  );
}
