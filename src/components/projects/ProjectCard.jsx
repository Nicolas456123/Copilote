import { useState } from 'react';
import ProgressRing from '../ui/ProgressRing';
import Spinner from '../ui/Spinner';
import ProjectAIActions from './ProjectAIActions';
import StepItem from './StepItem';
import { DOMAINS } from '../../lib/constants';
import { getProgress } from '../../utils/progress';
import { leafStats } from '../../utils/stepTree';

export default function ProjectCard({
  project, expanded, onToggleExpand, weekFocus, onToggleWeekFocus,
  onToggleStep, onDeleteStep, onAddStep, onDeleteProject,
  onBreakdown, onAdvice, onReorganize, onUnblock, onCelebrate, onDetailStep,
  onCustomModify,
  isActionLoading, projMsg, onClearMsg,
}) {
  const [adding, setAdding] = useState(false);
  const [newText, setNewText] = useState("");
  const pr = getProgress(project);
  const d = DOMAINS[project.domain];
  const isF = weekFocus.includes(project.id);
  const loading = isActionLoading;
  const msg = projMsg;
  const { done: doneC, total: totalC } = leafStats(project.steps);

  const handleAddStep = () => {
    if (newText.trim()) {
      onAddStep(project.id, newText.trim());
      setNewText("");
      setAdding(false);
    }
  };

  return (
    <div
      className="bg-surface rounded-2xl overflow-hidden mb-2 shadow-sm transition-all"
      style={{ border: expanded ? `2px solid ${d.color}30` : "1px solid transparent" }}
    >
      <div className="flex items-center gap-2.5 px-3.5 py-3 cursor-pointer" onClick={onToggleExpand}>
        <ProgressRing progress={pr} size={44} stroke={3} color={pr === 100 ? "#81B29A" : d.color} />
        <div className="flex-1">
          <div className="text-base font-bold text-ink flex items-center gap-1">
            {project.name}
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="text-sm text-ink-muted">🔗</a>
            )}
          </div>
          <div className="text-[13px] text-ink-muted">
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
        <span className={`text-ink-soft text-base transition-transform ${expanded ? "rotate-90" : ""}`}>›</span>
      </div>

      {totalC > 0 && (
        <div className="h-0.5 bg-surface-2">
          <div className="h-full transition-all duration-600" style={{ width: `${pr}%`, background: pr === 100 ? "#81B29A" : d.color }} />
        </div>
      )}

      {expanded && (
        <div className="px-3.5 pt-2.5 pb-3.5 animate-fade-in">
          <ProjectAIActions
            domainColor={d.color}
            onBreakdown={onBreakdown}
            onAdvice={onAdvice}
            onReorganize={onReorganize}
            onUnblock={onUnblock}
            onCelebrate={onCelebrate}
            onCustomModify={onCustomModify}
            isLoading={(act) => loading(`${project.id}:${act}`)}
          />

          {msg && (
            <div className="relative px-3 py-2.5 rounded-lg mb-2.5 bg-gradient-to-br from-navy to-[#5A5F7A] text-sm text-white leading-relaxed animate-fade-in">
              <button onClick={onClearMsg} className="absolute top-1 right-1.5 bg-none border-none text-white/30 text-sm cursor-pointer">×</button>
              🤖 {msg}
            </div>
          )}

          {(loading(`${project.id}:breakdown`) || loading(`${project.id}:reorg`) || loading(`${project.id}:modify`) || loading(`${project.id}:detail`)) && (
            <div className="text-center py-3"><Spinner size={20} /></div>
          )}

          {project.steps?.map(step => (
            <StepItem
              key={step.id}
              step={step}
              depth={0}
              onToggle={(sid) => onToggleStep(project.id, sid)}
              onDelete={(sid) => onDeleteStep(project.id, sid)}
              onDetail={(s) => onDetailStep(project, s)}
              onAddChild={(parentId, text) => onAddStep(project.id, text, parentId)}
              loading={loading(`${project.id}:detail`)}
            />
          ))}

          {totalC === 0 && !loading(`${project.id}:breakdown`) && (
            <div className="text-center py-3 text-ink-soft text-sm">
              Clique "🔪 Découper" pour structurer ce projet avec l'IA
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
                className="flex-1 p-1.5 rounded-lg border border-line-soft text-sm font-nunito outline-none focus:border-sage"
              />
              <button onClick={handleAddStep} className="px-2.5 py-1.5 rounded-lg border-none bg-sage text-white text-[13px] font-bold cursor-pointer font-nunito">OK</button>
            </div>
          ) : (
            <button
              onClick={() => { setAdding(true); setNewText(""); }}
              className="w-full p-1.5 rounded-lg mt-1.5 border border-dashed border-line bg-transparent text-ink-muted text-[13px] cursor-pointer font-nunito hover:border-sage hover:text-sage transition-colors"
            >
              + Ajouter manuellement
            </button>
          )}

          <button
            onClick={() => onDeleteProject(project.id)}
            className="mt-3 p-1.5 border-none bg-transparent text-coral text-[13px] cursor-pointer font-nunito w-full text-center opacity-40 hover:opacity-100 transition-opacity"
          >
            Supprimer
          </button>
        </div>
      )}
    </div>
  );
}
