import Card from '../ui/Card';
import { getDayName } from '../../utils/time';

export default function WeeklyGraph({ weekDates, habitLog, habits, today }) {
  const total = habits.length;

  return (
    <Card>
      <div className="text-xs font-bold text-navy mb-2">📈 SEMAINE EN COURS</div>
      <div className="flex items-end gap-1.5 h-20 justify-between">
        {weekDates.map(d => {
          const dayHabits = habitLog[d] || {};
          const count = habits.filter(h => dayHabits[h.id]).length;
          const pct = total > 0 ? (count / total) * 100 : 0;
          const isToday = d === today;

          return (
            <div key={d} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md transition-all duration-500"
                style={{
                  height: `${Math.max(pct * 0.6, 4)}px`,
                  background: pct === 100 ? "#81B29A" : pct > 0 ? `rgba(129,178,154,${0.3 + pct / 200})` : "#f0f0f0",
                }}
              />
              <span className={`text-[10px] ${isToday ? "text-coral font-extrabold" : "text-gray-400"}`}>
                {getDayName(d)}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
