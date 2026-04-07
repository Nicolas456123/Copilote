import { useState } from 'react';
import Card from '../ui/Card';
import { getMonthDates, getTodayKey } from '../../utils/time';

const WEEKDAY_NAMES = ["Lu", "Ma", "Me", "Je", "Ve", "Sa", "Di"];

export default function MoodCalendar({ entries, onSelectDate }) {
  const today = getTodayKey();
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });

  const dates = getMonthDates(viewDate.year, viewDate.month);
  const monthLabel = new Date(viewDate.year, viewDate.month).toLocaleDateString("fr-FR", { month: "long", year: "numeric" });

  const entryMap = {};
  entries.forEach(e => { entryMap[e.date] = e; });

  const prevMonth = () => {
    setViewDate(v => v.month === 0 ? { year: v.year - 1, month: 11 } : { ...v, month: v.month - 1 });
  };
  const nextMonth = () => {
    setViewDate(v => v.month === 11 ? { year: v.year + 1, month: 0 } : { ...v, month: v.month + 1 });
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <button onClick={prevMonth} className="bg-none border-none text-gray-400 cursor-pointer text-base px-2">‹</button>
        <span className="text-sm font-bold text-navy capitalize">{monthLabel}</span>
        <button onClick={nextMonth} className="bg-none border-none text-gray-400 cursor-pointer text-base px-2">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAY_NAMES.map(d => (
          <div key={d} className="text-[10px] text-gray-400 text-center font-semibold pb-1">{d}</div>
        ))}
        {dates.map(({ date, currentMonth }) => {
          const entry = entryMap[date];
          const isToday = date === today;
          return (
            <button
              key={date}
              onClick={() => entry && onSelectDate(entry)}
              className={`w-full aspect-square rounded-lg flex items-center justify-center text-[11px] border-none cursor-pointer font-nunito transition-all ${
                !currentMonth ? "opacity-30" : ""
              } ${isToday ? "ring-2 ring-coral" : ""} ${
                entry ? "bg-white hover:bg-gray-50" : "bg-transparent"
              }`}
            >
              {entry ? (
                <span className="text-base">{entry.mood.emoji}</span>
              ) : (
                <span className="text-gray-300">{new Date(date).getDate()}</span>
              )}
            </button>
          );
        })}
      </div>
    </Card>
  );
}
