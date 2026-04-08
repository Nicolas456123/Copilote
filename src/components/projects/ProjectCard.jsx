import { useState } from 'react';
import ProgressRing from '../ui/ProgressRing';
import Spinner from '../ui/Spinner';
import ProjectAIActions from './ProjectAIActions';
import StepItem from './StepItem';
import { DOMAINS } from '../../lib/constants';
import { getProgress } from '../../utils/progress';

export default function ProjectCard({
  project, expanded, onToggleExpand, weekFocus, onToggleWeekFocus,
  onToggleStep, onDeleteStep, onAddStep, onDeleteProject,
  onBreakdown, onAdvice, onReorganize, onUnblock, onCelebrate, onDetailStep,
  isActionLoading, projMsg, onClearMsg,
}) {
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const pr = getProgress(project);
  const d = DOMAINS[project.domain];
  const isF = weekFocus.includes(project.id);
  const loading = isActionLoading;
  const msg = projMsg;
  const doneC = project.steps?.filter(s => s.done).length || 0;
  const totalC = project.steps?.length || 0;

  const handleAddStep = () => {
    if (newText.trim()) {
      onAddStep(project.id, newText.trim());
      setNewText("");
      setAdding(false);
    }
  };

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden mb-2 shadow-sm transition-all"
      style={{ border: expanded ? `2px solid ${d.color}30` : "1px solid transparent" }}
    >
      {/* Header */}
      <div className="flex items-center gap-2.5 px-3.5 py-3 cursor-pointer" onClick={onToggleExpand}>
        <ProgressRing progress={pr} size={44} stroke={3} color={pr === 100 ? "#81B29A" : d.color} />
        <div className="flex-1">
          <div className="text-sm font-bold text-navy flex items-center gap-1">
            {project.name}
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-xs text-gray-400">🔗</a>
            )}
          </div>
          <div className="text-[11px] text-gray-400">
            {totalC === 0 ? "Pas encore structuré" : pr === 100 ? "Terminé ! 🎉" : `${doneC}/${totalC} étapes`}
          </div>
        </div>
        <button
          onClick={e => { e.stopPropagation(); onToggleWeekFocus(project.id); }}
          title={isF ? "Retirer du focus" : "Ajouter au focus semaine"}
          className="bg-none border-none text-lg cursor-pointer p-1"
          style={{ opacity: isF ? 1 : 0.3 }}
        >
          ⭐
        </button>
        <span className={`text-gray-300 text-base transition-transform ${expanded ? "rotate-90" : ""}`}>›</span>
      </div>

      {/* Progress bar */}
      {totalC > 0 && (
        <div className="h-0.5 bg-gray-100">
          <div className="h-full transition-all duration-600" style={{ width: `${pr}%`, background: pr === 100 ? "#81B29A" : d.color }} />
        </div>
      )}

      {/* Expanded content */}
      {expanded && (
        <div className="px-3.5 pt-2.5 pb-3.5 animate-fade-in">
          <ProjectAIActions
            project={project}
            domainColor={d.color}
            onBreakdown={onBreakdown}
            onAdvice={onAdvice}
            onReorganize={onReorganize}
            onUnblock={onUnblock}
            onCelebrate={onCelebrate}
            isLoading={(act) => loading(`${project.id}:${act}`)}
          />

          {msg && (
            <div className="relative px-3 py-2.5 rounded-lg mb-2.5 bg-gradient-to-br from-navy to-[#5A5F7A] text-xs text-white leading-relaxed animate-fade-in">
              <button onClick={onClearMsg} className="absolute top-1 right-1.5 bg-none border-none text-white/30 text-xs cursor-pointer">×</button>
              🤖 {msg}
            </div>
          )}

          {loading && <div className="text-center py-3"><Spinner size={20} /></div>}

          {project.steps?.map((step, i) => (
            <StepItem
              key={step.id}
              step={step}
              isLast={i === project.steps.length - 1}
              onToggle={() => onToggleStep(project.id, step.id)}
              onDelete={() => onDeleteStep(project.id, step.id)}
              onDetail={() => onDetailStep(project, step)}
              loading={!!loading}
            />
          ))}

          {totalC === 0 && !loading && (
            <div className="text-center py-3 text-gray-300 text-xs">
              Clique "🔪 D\u00E9couper" pour structurer ce projet avec l'IA
            </div>
          )}

          {adding ? (
            <div className="flex gap-1.5 mt-1.5">
              <input
                value={newText}
                onChange={e => setNewText(e.target.value)}
                placeholder="Nouvelle étape…"
                onKeyDown={e => e.key === "Enter" && handleAddStep()}
                autoFocus
                className="flex-1 p-1.5 rounded-lg border border-gray-100 text-xs font-nunito outline-none focus:border-sage"
              />
              <button onClick={handleAddStep} className="px-2.5 py-1.5 rounded-lg border-none bg-sage text-white text-[11px] font-bold cursor-pointer font-nunito">OK</button>
            </div>
          ) : (
            <button
              onClick={() => { setAdding(true); setNewText(""); }}
              className="w-full p-1.5 rounded-lg mt-1.5 border border-dashed border-gray-200 bg-transparent text-gray-400 text-[11px] cursor-pointer font-nunito hover:border-sage hover:text-sage transition-colors"
            >
              + Ajouter manuellement
            </button>
          )}

          <button
            onClick={() => onDeleteProject(project.id)}
            className="mt-3 p-1.5 border-none bg-transparent text-coral text-[11px] cursor-pointer font-nunito w-full text-center opacity-40 hover:opacity-100 transition-opacity"
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}
