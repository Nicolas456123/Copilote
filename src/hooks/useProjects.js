import { useState, useEffect, useCallback } from 'react';
import { fetchProjects, createProject as createProjectAPI, updateProject, deleteProjectAPI } from '../lib/api';
import {
  normalizeTree, updateStepById, removeStepById,
  addChildToStep, addChildrenToStep, replaceChildrenOfStep, makeStepId,
} from '../utils/stepTree';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [weekFocus, setWeekFocus] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchProjects()
      .then(data => {
        const normalized = data.map(p => ({ ...p, steps: normalizeTree(p.steps) }));
        setProjects(normalized);
        setWeekFocus(normalized.filter(p => p.weekFocus).map(p => p.id));
      })
      .catch(err => console.error("Failed to fetch projects:", err))
      .finally(() => setLoaded(true));
  }, []);

  const syncProject = useCallback((id, updates) => {
    updateProject({ id, ...updates }).catch(err => console.error("Sync error:", err));
  }, []);

  const mutateProjectSteps = useCallback((pid, mutator) => {
    setProjects(prev => {
      const updated = prev.map(p => p.id === pid ? { ...p, steps: mutator(p.steps) } : p);
      const project = updated.find(p => p.id === pid);
      if (project) syncProject(pid, { steps: project.steps });
      return updated;
    });
  }, [syncProject]);

  const addProject = useCallback((domain, name, opts = {}) => {
    if (!name.trim()) return null;
    const id = Date.now().toString();
    const steps = normalizeTree(opts.steps || []);
    const newProject = {
      id,
      domain,
      name: name.trim(),
      steps,
      link: opts.link || "",
      weekFocus: false,
    };
    setProjects(prev => [...prev, newProject]);
    createProjectAPI({ id, domain, name: name.trim(), link: newProject.link, steps });
    return id;
  }, []);

  const deleteProject = useCallback((id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    deleteProjectAPI(id);
  }, []);

  const toggleStep = useCallback((pid, sid) => {
    mutateProjectSteps(pid, steps =>
      updateStepById(steps, sid, s => ({ ...s, done: !s.done }))
    );
  }, [mutateProjectSteps]);

  const deleteStep = useCallback((pid, sid) => {
    mutateProjectSteps(pid, steps => removeStepById(steps, sid));
  }, [mutateProjectSteps]);

  const addStep = useCallback((pid, text, parentId = null) => {
    if (!text.trim()) return;
    const child = { id: makeStepId(), text: text.trim(), done: false, children: [] };
    mutateProjectSteps(pid, steps => addChildToStep(steps, parentId, child));
  }, [mutateProjectSteps]);

  const addSteps = useCallback((pid, newSteps, parentId = null) => {
    mutateProjectSteps(pid, steps => addChildrenToStep(steps, parentId, newSteps));
  }, [mutateProjectSteps]);

  const insertStepsAfter = useCallback((pid, afterStepId, newSteps) => {
    mutateProjectSteps(pid, steps => addChildrenToStep(steps, afterStepId, newSteps));
  }, [mutateProjectSteps]);

  const replaceChildren = useCallback((pid, parentId, newChildren) => {
    mutateProjectSteps(pid, steps => replaceChildrenOfStep(steps, parentId, newChildren));
  }, [mutateProjectSteps]);

  const replaceUndoneSteps = useCallback((pid, newSteps) => {
    mutateProjectSteps(pid, steps => {
      const done = (steps || []).filter(s => {
        const isLeafDone = (!s.children || s.children.length === 0) && s.done;
        const allChildrenDone = s.children?.length > 0 && s.children.every(c => c.done);
        return isLeafDone || allChildrenDone;
      });
      return [...done, ...normalizeTree(newSteps)];
    });
  }, [mutateProjectSteps]);

  const toggleWeekFocus = useCallback((id) => {
    setWeekFocus(prev => {
      const newFocus = prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev;
      setProjects(current => {
        current.forEach(p => {
          const shouldFocus = newFocus.includes(p.id);
          if (shouldFocus !== prev.includes(p.id)) {
            updateProject({ id: p.id, week_focus: shouldFocus });
          }
        });
        return current;
      });
      return newFocus;
    });
  }, []);

  const focusProjects = projects.filter(p => weekFocus.includes(p.id));

  return {
    projects, setProjects, loaded,
    weekFocus, focusProjects, toggleWeekFocus,
    addProject, deleteProject,
    toggleStep, deleteStep, addStep, addSteps, insertStepsAfter,
    replaceChildren, replaceUndoneSteps,
  };
}
