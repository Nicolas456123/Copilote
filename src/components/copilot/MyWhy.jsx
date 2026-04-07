import { useState } from 'react';
import Card from '../ui/Card';

export default function MyWhy({ myWhy, setMyWhy }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");

  const startEdit = () => { setDraft(myWhy); setEditing(true); };
  const save = () => { setMyWhy(draft); setEditing(false); };

  return (
    <Card>
      <div className="text-xs font-bold text-coral mb-1.5">🔥 MON POURQUOI</div>
      {editing ? (
        <div className="flex flex-col gap-1.5">
          <textarea
            value={draft}
            onChange={e => setDraft(e.target.value)}
            placeholder="Pourquoi tu fais tout \u00E7a ?"
            className="w-full p-2.5 rounded-lg border border-gray-200 text-[13px] font-nunito resize-y min-h-[50px] outline-none focus:border-coral transition-colors"
          />
          <div className="flex gap-1.5">
            <button onClick={save} className="px-3.5 py-1.5 rounded-lg border-none bg-sage text-white text-xs font-semibold cursor-pointer font-nunito">OK</button>
            <button onClick={() => setEditing(false)} className="px-3.5 py-1.5 rounded-lg border border-gray-200 bg-transparent text-gray-400 text-xs cursor-pointer font-nunito">Annuler</button>
          </div>
        </div>
      ) : myWhy ? (
        <div onClick={startEdit} className="text-[13px] text-navy leading-relaí cursor-pointer">"{myWhy}"</div>
      ) : (
        <button
          onClick={startEdit}
          className="w-full p-2.5 rounded-lg border-2 border-dashed border-gray-200 bg-transparent text-gray-400 text-xs cursor-pointer font-nunito"
        >
          + D\u00E9finis ton pourquoi
        </button>
      )}
    </Card>
  );
}
