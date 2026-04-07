import { useOutletContext } from 'react-router-dom';
import ProgressRing from '../components/ui/ProgressRing';
import HabitItem from '../components/habits/HabitItem';
import WeekView from '../components/habits/WeekView';

export default function HabitudesPage() {
  const { habits, todayHabits, toggleHabit, habitsToday, habitsTotal, habitsProgress, weekDates, habitLog, gymThisWeek, today } = useOutletContext();

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex items-center gap-3.5">
        <ProgressRing progress={habitsProgress} size={64} stroke={5} color="#81B29A">
          {habitsToday}/{habitsTotal}
        </ProgressRing>
        <div>
          <div className="text-base font-extrabold text-navy">Habitudes du jour</div>
          <div className="text-xs text-gray-400">
            {habitsProgress === 100 ? "Tout coché ! 🎉" : habitsProgress >= 50 ? "Continue ! 💪" : "Allez, on s'y met !"}
          </div>
        </div>
      </div>

      {habits.map(h => (
        <HabitItem
          key={h.id}
          habit={h}
          checked={todayHabits[h.id]}
          onToggle={() => toggleHabit(h.id)}
          gymThisWeek={gymThisWeek}
        />
      ))}

      <WeekView weekDates={weekDates} habitLog={habitLog} habits={habits} today={today} />
    </div>
  );
}
