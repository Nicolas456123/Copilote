import { DOMAINS } from '../../lib/constants';

export default function HabitItem({ habit, checked, onToggle, gymThisWeek }) {
  const d = DOMAINS[habit.domain];

  return (
    <div
      onClick={onToggle}
      className="flex items-center gap-3 px-4 py-3.5 rounded-2xl border border-black/5 cursor-pointer transition-all"
      style={{
        background: checked ? `${d?.color}10` : "white",
        opacity: checked ? 0.7 : 1,
      }}
    >
      <div
        className="w-7 h-7 rounded-full flex items-center justify-center text-white text-sm shrink-0 transition-colors"
        style={{
          border: `2px solid ${checked ? "#81B29A" : "#ddd"}`,
          background: checked ? "#81B29A" : "transparent",
        }}
      >
        {checked && "✓"}
      </div>
      <span className="text-xl">{habit.icon}</span>
      <div className="flex-1">
        <div className={`text-sm font-semibold text-navy ${checked ? "line-through" : ""}`}>{habit.label}</div>
        {habit.target && (
          <div className="text-[11px] text-gray-400">
            {habit.id === "gym" ? `${gymThisWeek}/${habit.target} cette semaine` : `Objectif: ${habit.target}${habit.unit}`}
          </div>
        )}
      </div>
    </div>
  );
}
