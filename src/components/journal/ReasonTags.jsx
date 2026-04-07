import { REASON_TAGS } from '../../lib/constants';

export default function ReasonTags({ selected, onToggle }) {
  const allTags = [
    ...REASON_TAGS.positive.map(t => ({ text: t, type: "positive" })),
    ...REASON_TAGS.neutral.map(t => ({ text: t, type: "neutral" })),
    ...REASON_TAGS.negative.map(t => ({ text: t, type: "negative" })),
  ];

  const colorMap = {
    positive: { bg: "bg-sage/15", activeBg: "bg-sage", text: "text-sage", activeText: "text-white" },
    neutral: { bg: "bg-sand/20", activeBg: "bg-sand", text: "text-navy", activeText: "text-navy" },
    negative: { bg: "bg-coral/10", activeBg: "bg-coral", text: "text-coral", activeText: "text-white" },
  };

  return (
    <div>
      <div className="text-xs font-bold text-navy mb-2">Pourquoi ? <span className="font-normal text-gray-400">(plusieurs choix)</span></div>
      <div className="flex flex-wrap gap-1.5">
        {allTags.map(tag => {
          const isSelected = selected.includes(tag.text);
          const c = colorMap[tag.type];
          return (
            <button
              key={tag.text}
              onClick={() => onToggle(tag.text)}
              className={`px-3 py-1.5 rounded-full text-[11px] font-semibold cursor-pointer font-nunito border-none transition-all ${
                isSelected ? `${c.activeBg} ${c.activeText}` : `${c.bg} ${c.text}`
              }`}
            >
              {tag.text}
            </button>
          );
        })}
      </div>
    </div>
  );
}
