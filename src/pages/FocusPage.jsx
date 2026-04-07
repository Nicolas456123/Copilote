import { useOutletContext } from 'react-router-dom';
import TaskSelector from '../components/focus/TaskSelector';
import Timer from '../components/focus/Timer';

export default function FocusPage() {
  const { projects, focusProjects, focusTask, focusTime, focusRunning, focusNudge, setFocusRunning, startFocus, stopFocus } = useOutletContext();

  return (
    <div className="flex flex-col gap-3.5 items-center pt-4">
      <div className="text-lg font-extrabold text-navy">Mode Focus</div>
      {!focusTask ? (
        <>
          <div className="text-[13px] text-gray-400 text-center">Choisis un projet focus et plonge-toi dedans.</div>
          <TaskSelector
            projects={projects}
            focusProjects={focusProjects}
            onSelectTask={startFocus}
          />
        </>
      ) : (
        <Timer
          focusTask={focusTask}
          focusTime={focusTime}
          focusRunning={focusRunning}
          focusNudge={focusNudge}
          setFocusRunning={setFocusRunning}
          stopFocus={stopFocus}
        />
      )}
    </div>
  );
}
