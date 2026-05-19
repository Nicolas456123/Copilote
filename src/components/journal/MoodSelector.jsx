import { MOOD_OPTIONS } from '../../lib/constants';

export default function MoodSelector({ selected, onSelect }) {
  return (
    <div>
      <div className="text-sm font-bold text-ink mb-2">Comment tu te sens ?</div>
      <div className="flex gap-2 justify-center">
        {MOOD_OPTIONS.map(m => (
          <button
            key={m.value}
            onClick={() => onSelect(m)}
            className={`flex flex-col items-center gap-1 p-3 rounded-2xl border-2 cursor-pointer transition-all font-nunito ${
              selected?.value === m.value
                ? "border-coral bg-coral/10 scale-110"
                : "border-transparent bg-surface hover:border-line"
            }`}
          >
            <span className="text-2xl">{m.emoji}</span>
            <span className="text-[12px] font-semibold text-ink">{m.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
