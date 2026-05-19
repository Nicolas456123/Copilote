import { DOMAINS } from '../../lib/constants';

export default function DomainFilter({ selected, onSelect }) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={() => onSelect(null)}
        className={`px-3.5 py-1.5 rounded-lg border-none whitespace-nowrap text-sm font-semibold cursor-pointer font-nunito transition-all ${
          !selected ? "bg-navy text-white" : "bg-surface-2 text-ink-muted"
        }`}
      >
        Tous
      </button>
      {Object.entries(DOMAINS).map(([key, d]) => (
        <button
          key={key}
          onClick={() => onSelect(key)}
          className="px-3.5 py-1.5 rounded-lg border-none whitespace-nowrap text-sm font-semibold cursor-pointer font-nunito transition-all"
          style={{
            background: selected === key ? d.color : "var(--color-surface-2)",
            color: selected === key ? "white" : "var(--color-ink-muted)",
          }}
        >
          {d.icon} {d.label}
        </button>
      ))}
    </div>
  );
}
