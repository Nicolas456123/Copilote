export default function StepItem({ step, onToggle, onDelete, onDetail, loading, isLast }) {
  return (
    <div className={`flex items-start gap-2 py-1.5 ${!isLast ? "border-b border-line-soft" : ""}`}>
      <button
        onClick={onToggle}
        className="w-[22px] h-[22px] rounded-[5px] shrink-0 mt-0.5 flex items-center justify-center text-white text-[13px] cursor-pointer"
        style={{
          border: `2px solid ${step.done ? "#81B29A" : "var(--color-line)"}`,
          background: step.done ? "#81B29A" : "transparent",
        }}
      >
        {step.done && "✓"}
      </button>
      <div className={`flex-1 text-sm font-medium leading-snug ${step.done ? "text-ink-soft line-through" : "text-ink"}`}>
        {step.text}
      </div>
      <div className="flex gap-0.5 shrink-0">
        {!step.done && onDetail && (
          <button
            onClick={onDetail}
            disabled={loading}
            title="Détailler"
            className="bg-none border-none cursor-pointer text-[15px] p-0.5 opacity-50 hover:opacity-100 disabled:opacity-30"
          >
            🔍
          </button>
        )}
        <button
          onClick={onDelete}
          className="bg-none border-none text-ink-soft text-[15px] cursor-pointer p-0.5 hover:text-coral"
        >
          ×
        </button>
      </div>
    </div>
  );
}
