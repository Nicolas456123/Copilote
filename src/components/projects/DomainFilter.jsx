import { DOMAINS } from '../../lib/constants';

export default function DomainFilter({ selected, onSelect }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={() => onSelect(null)}
        className={`px-3.5 py-1.5 rounded-lg border-none whitespace-nowrap text-xs font-semibold cursor-pointer font-nunito transition-all ${
          !selected ? "bg-navy text-white" : "bg-[#f0ede8] text-gray-400"
        }`}
      >
        Tous
      </button>
      {Object.entries(DOMAINS).map(([key, d]) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className="px-3.5 py-1.5 rounded-lg border-none whitespace-nowrap text-xs font-semibold cursor-pointer font-nunito transition-all"
          style={{
            background: selected === key ? d.color : "#f0ede8",
            color: selected === key ? "white" : "#666",
          }}
        >
          {d.icon} {d.label}
        </button>
      ))}
    </div>
  );
}
