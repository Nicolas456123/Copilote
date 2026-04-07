import { DOMAINS } from '../../lib/constants';
import { formatTime } from '../../utils/time';

export default function Timer({ focusTask, focusTime, focusRunning, focusNudge, setFocusRunning, stopFocus }) {
  const domainColor = DOMAINS[focusTask.domain]?.color || "#3D405B";

  return (
    <div className="flex flex-col items-center gap-3.5">
      <div
        className="w-[180px] h-[180px] rounded-full flex flex-col items-center justify-center text-white shadow-2xl"
        style={{
          background: focusNudge
            ? "linear-gradient(135deg, #E07A5F, #F2CC8F)"
            : `linear-gradient(135deg, ${domainColor}, #5A5F7A)`,
          animation: focusNudge ? "pulse 2s infinite" : "none",
        }}
      >
        <div className="text-[32px] font-extrabold tabular-nums">{formatTime(focusTime)}</div>
        <div className="text-[11px] opacity-80 mt-0.5">{focusRunning ? "En cours…" : "En pause"}</div>
      </div>

      <div className="text-center">
        <div className="text-sm font-semibold text-navy">{focusTask.text}</div>
        <div className="text-[11px] text-gray-400">{focusTask.projectName}</div>
      </div>

      {focusNudge && (
        <div className="px-4 py-2.5 rounded-xl bg-coral/10 text-coral text-xs font-semibold text-center animate-pulse">
          ⏰ 1h ! Fais une pause.
        </div>
      )}

      <div className="flex gap-2.5">
        <button
          onClick={() => setFocusRunning(!focusRunning)}
          className="px-6 py-2.5 rounded-xl border-none text-white text-sm font-bold cursor-pointer font-nunito"
          style={{ background: focusRunning ? "#F2CC8F" : "#81B29A" }}
        >
          {focusRunning ? "⏸ Pause" : "▶ Go"}
        </button>
        <button
          onClick={stopFocus}
          className="px-6 py-2.5 rounded-xl border border-gray-200 bg-transparent text-gray-400 text-sm font-semibold cursor-pointer font-nunito hover:text-coral hover:border-coral transition-colors"
        >
          Arrêter
        </button>
      </div>
    </div>
  );
}
