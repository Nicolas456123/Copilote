import Card from '../ui/Card';
import Spinner from '../ui/Spinner';
import { DOMAINS } from '../../lib/constants';

export default function DailyPlan({ todayTasks, overdueTasks, upcomingTasks, loading, generate, markDone, markSkipped, postpone, hasPlan }) {

  if (!hasPlan) {
    return (
      <Card>
        <div className="text-xs font-bold text-navy mb-2">📋 PLAN DE LA SEMAINE</div>
        <div className="text-center py-4">
          <div className="text-[13px] text-gray-400 mb-3">
            Pas encore de plan cette semaine. L'IA va analyser tes projets et créer un planning réaliste.
          </div>
          <button
            onClick={generate}
            disabled={loading}
            className="px-5 py-2.5 rounded-xl border-none bg-gradient-to-r from-coral to-[#c94c30] text-white text-sm font-bold cursor-pointer font-nunito disabled:opacity-60 transition-all hover:shadow-lg"
          >
            {loading ? <Spinner size={16} /> : "🤖 Générer mon plan"}
          </button>
        </div>
      </Card>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Overdue tasks */}
      {overdueTasks.length > 0 && (
        <Card className="border-2 border-coral/20">
          <div className="text-xs font-bold text-coral mb-2">⚠️ EN RETARD ({overdueTasks.length})</div>
          {overdueTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onDone={() => markDone(task.id)}
              onSkip={() => markSkipped(task.id)}
              onPostpone={() => postpone(task.id)}
              overdue
            />
          ))}
        </Card>
      )}

      {/* Today's tasks */}
      <Card>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-bold text-navy">🎯 AUJOURD'HUI</div>
          <button
            onClick={generate}
            disabled={loading}
            className="text-[10px] text-coral bg-none border-none cursor-pointer font-nunito font-semibold"
          >
            {loading ? "..." : "🔄 Regénérer"}
          </button>
        </div>
        {todayTasks.length > 0 ? (
          todayTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onDone={() => markDone(task.id)}
              onSkip={() => markSkipped(task.id)}
              onPostpone={() => postpone(task.id)}
            />
          ))
        ) : (
          <div className="text-center text-gray-300 py-2 text-xs">
            Rien de prévu aujourd'hui — profite ou avance librement !
          </div>
        )}
      </Card>

      {/* Upcoming preview */}
      {upcomingTasks.length > 0 && (
        <Card>
          <div className="text-xs font-bold text-navy mb-2">📅 À VENIR</div>
          {groupByDay(upcomingTasks).slice(0, 3).map(({ day, tasks }) => (
            <div key={day} className="mb-2 last:mb-0">
              <div className="text-[10px] font-semibold text-gray-400 mb-1">
                {new Date(day).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric" })}
              </div>
              {tasks.map(task => (
                <div key={task.id} className="flex items-center gap-2 py-1 pl-2">
                  <span className="text-xs">{DOMAINS[task.domain]?.icon || "📌"}</span>
                  <span className="text-[11px] text-gray-500">{task.taskText}</span>
                </div>
              ))}
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

function TaskItem({ task, onDone, onSkip, onPostpone, overdue }) {
  const isDone = task.status === "done";
  const isSkipped = task.status === "skipped";
  const domainIcon = DOMAINS[task.domain]?.icon || "📌";
  const domainColor = DOMAINS[task.domain]?.color || "#999";

  return (
    <div className={`flex items-start gap-2.5 py-2 border-b border-gray-50 last:border-0 ${isDone || isSkipped ? "opacity-50" : ""}`}>
      <button
        onClick={onDone}
        disabled={isDone || isSkipped}
        className="w-6 h-6 rounded-md shrink-0 mt-0.5 flex items-center justify-center text-white text-[11px] cursor-pointer border-none"
        style={{
          background: isDone ? "#81B29A" : "transparent",
          border: `2px solid ${isDone ? "#81B29A" : "#ddd"}`,
        }}
      >
        {isDone && "✓"}
      </button>
      <div className="flex-1 min-w-0">
        <div className={`text-[13px] font-semibold leading-snug ${isDone ? "line-through text-gray-300" : isSkipped ? "line-through text-gray-300" : "text-navy"}`}>
          {task.taskText}
        </div>
        <div className="text-[10px] mt-0.5 flex items-center gap-1">
          <span>{domainIcon}</span>
          <span style={{ color: domainColor }}>{task.projectName}</span>
        </div>
      </div>
      {!isDone && !isSkipped && (
        <div className="flex gap-1 shrink-0">
          <button
            onClick={onPostpone}
            title="Reporter à demain"
            className="bg-none border-none cursor-pointer text-xs p-1 opacity-40 hover:opacity-100"
          >
            ➡️
          </button>
          <button
            onClick={onSkip}
            title="Passer"
            className="bg-none border-none cursor-pointer text-xs p-1 opacity-40 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}
      {isSkipped && <span className="text-[10px] text-gray-300">passé</span>}
    </div>
  );
}

function groupByDay(tasks) {
  const groups = {};
  tasks.forEach(t => {
    if (!groups[t.day]) groups[t.day] = [];
    groups[t.day].push(t);
  });
  return Object.entries(groups)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([day, tasks]) => ({ day, tasks }));
}
