import { getGreeting, getBedtimeWarning } from '../../utils/greeting';
import ThemeToggle from './ThemeToggle';

export default function Header({ streak, gymThisWeek, habitsToday, habitsTotal, level }) {
  const bedtime = getBedtimeWarning();

  return (
    <div className="px-5 pt-5 pb-2">
      <div className="flex items-start justify-between gap-2">
        <div className="text-[22px] font-extrabold text-ink flex-1 text-center pl-12">{getGreeting()}</div>
        <ThemeToggle />
      </div>
      <div className="flex gap-2 justify-center mt-2 flex-wrap">
        {streak > 0 && (
          <span className="bg-gradient-to-r from-sand to-coral text-white px-3 py-0.5 rounded-full text-sm font-bold">
            🔥 {streak}j
          </span>
        )}
        {level > 0 && (
          <span className="bg-gradient-to-r from-[#9B5DE5] to-[#F15BB5] text-white px-3 py-0.5 rounded-full text-sm font-bold">
            ⭐ Nv.{level}
          </span>
        )}
        <span className="bg-sage/15 text-sage px-3 py-0.5 rounded-full text-sm font-bold">
          💪 Gym {gymThisWeek}/3
        </span>
        <span className="bg-[#00BBF9]/10 text-[#00BBF9] px-3 py-0.5 rounded-full text-sm font-bold">
          ✅ {habitsToday}/{habitsTotal}
        </span>
      </div>
      {bedtime && (
        <div className="mt-2 px-3.5 py-2 rounded-lg bg-coral/10 text-coral text-sm font-semibold text-center">
          {bedtime}
        </div>
      )}
    </div>
  );
}
