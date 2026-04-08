import { DOMAINS } from '../../lib/constants';

export default function TaskSelector({ projects, focusProjects, onSelectTask }) {
  const source = focusProjects.length > 0 ? focusProjects : projects.slice(0, 6);
  const tasks = source.flatMap(p =>
    (p.steps?.filter(s => !s.done) || []).slice(0, 2).map(s => ({
      ...s,
      projectName: p.name,
      projectId: p.id,
      domain: p.domain,
    }))
  );

  if (tasks.length === 0) {
    return (
      <div className="text-center text-gray-300 py-5 text-[13px]">
        Structure tes projets d'abord (🔪 Découper)
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-1.5">
      {tasks.map(task => (
        <button
          key={task.id}
          onClick={() => onSelectTask(task)}
          className="p-3 px-4 rounded-xl border border-gray-100 bg-white text-[13px] font-semibold text-navy cursor-pointer text-left font-nunito flex items-center gap-2 hover:border-coral/30 hover:shadow-sm transition-all"
        >
          <span>{DOMAINS[task.domain]?.icon}</span>
          <div className="flex-1">
            <div>{task.text}</div>
            <div className="text-[10px] text-gray-400 font-normal">{task.projectName}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
