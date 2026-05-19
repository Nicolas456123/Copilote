import Card from '../ui/Card';
import { getDayName } from '../../utils/time';

export default function WeekView({ weekDates, habitLog, habits, today }) {
  const total = habits.length;

  return (
    <Card>
      <div className="text-sm font-bold text-ink mb-2">📅 SEMAINE</div>
      <div className="flex gap-1 justify-between">
        {weekDates.map(d => {
          const dayHabits = habitLog[d] || {};
          const count = habits.filter(h => dayHabits[h.id]).length;
          const isToday = d === today;

          return (
            <div key={d} className="text-center flex-1">
              <div className={`text-[12px] ${isToday ? "text-coral font-extrabold" : "text-ink-muted"}`}>
                {getDayName(d)}
              </div>
              <div
                className="w-7 h-7 rounded-full mx-auto mt-1 flex items-center justify-center text-[12px] font-bold"
                style={{
                  background: count === total ? "#81B29A" : count > 0 ? `rgba(129,178,154,${count / total})` : "var(--color-surface-2)",
                  color: count > 0 ? "white" : "var(--color-ink-soft)",
                  border: isToday ? "2px solid #E07A5F" : "none",
                }}
              >
                {count || "·"}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
