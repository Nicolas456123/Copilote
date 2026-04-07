import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import DomainFilter from '../components/projects/DomainFilter';
import ProjectCard from '../components/projects/ProjectCard';
import { DOMAINS } from '../lib/constants';
import { domainProjects } from '../utils/progress';

export default function ProjetsPage() {
  const ctx = useOutletContext();
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [expandedProject, setExpandedProject] = useState(null);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const handleAddProject = () => {
    if (newProjectName.trim() && selectedDomain) {
      ctx.addProject(selectedDomain, newProjectName);
      setNewProjectName("");
      setShowAddProject(false);
    }
  };

  const handleBreakdown = async (p) => {
    const steps = await ctx.aiBreakdown(p);
    if (steps) ctx.addSteps(p.id, steps);
  };

  const handleDetailStep = async (p, step) => {
    const subs = await ctx.aiDetailStep(p, step);
    if (subs) ctx.insertStepsAfter(p.id, step.id, subs);
  };

  const handleReorganize = async (p) => {
    const newSteps = await ctx.aiReorganize(p);
    if (newSteps) ctx.replaceUndoneSteps(p.id, newSteps);
  };

  const domains = selectedDomain ? [selectedDomain] : Object.keys(DOMAINS);

  return (
    <div className="flex flex-col gap-3">
      <DomainFilter selected={selectedDomain} onSelect={setSelectedDomain} />

      {domains.map(domKey => {
        const dp = domainProjects(domKey, ctx.projects);
        if (dp.length === 0 && selectedDomain !== domKey) return null;
        const d = DOMAINS[domKey];

        return (
          <div key={domKey}>
            {!selectedDomain && (
              <div className="text-[13px] font-bold my-2 flex items-center gap-1.5" style={{ color: d.color }}>
                {d.icon} {d.label}
              </div>
            )}
            {dp.map(p => (
              <ProjectCard
                key={p.id}
                project={p}
                expanded={expandedProject === p.id}
                onToggleExpand={() => setExpandedProject(expandedProject === p.id ? null : p.id)}
                weekFocus={ctx.weekFocus}
                onToggleWeekFocus={ctx.toggleWeekFocus}
                onToggleStep={ctx.toggleStep}
                onDeleteStep={ctx.deleteStep}
                onAddStep={ctx.addStep}
                onDeleteProject={ctx.deleteProject}
                onBreakdown={() => handleBreakdown(p)}
                onAdvice={() => ctx.aiProjectAction(p, "advice", "Donne-moi un conseil concret pour avancer maintenant.")}
                onReorganize={() => handleReorganize(p)}
                onUnblock={() => ctx.aiProjectAction(p, "unblock", "Je bloque. Identifie ce qui coince et propose une solution.")}
                onCelebrate={() => ctx.aiProjectAction(p, "celebrate", "Félicite-moi pour mon avancement !")}
                onDetailStep={handleDetailStep}
                isActionLoading={ctx.isActionLoading}
                projMsg={ctx.projMsg[p.id]}
                onClearMsg={() => ctx.clearProjMsg(p.id)}
              />
            ))}
          </div>
        );
      })}

      {selectedDomain && (
        showAddProject ? (
          <div className="flex gap-1.5">
            <input
              value={newProjectName}
              onChange={e => setNewProjectName(e.target.value)}
              placeholder={`Nouveau projet ${DOMAINS[selectedDomain]?.label}…`}
              onKeyDown={e => e.key === "Enter" && handleAddProject()}
              autoFocus
              className="flex-1 p-2.5 rounded-lg border border-gray-100 text-[13px] font-nunito outline-none focus:border-sage"
            />
            <button
              onClick={handleAddProject}
              className="px-3.5 py-2.5 rounded-lg border-none text-white text-[13px] font-bold cursor-pointer font-nunito"
              style={{ background: DOMAINS[selectedDomain]?.color }}
            >
              +
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowAddProject(true)}
            className="p-2.5 rounded-lg border-2 border-dashed border-gray-200 bg-transparent text-gray-400 text-xs cursor-pointer font-nunito hover:border-sage hover:text-sage transition-colors"
          >
            + Ajouter un projet
          </button>
        )
      )}
    </div>
  );
}
