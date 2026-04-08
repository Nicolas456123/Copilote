import { useState, useEffect, useCallback } from 'react';
import { fetchProjects, createProject as createProjectAPI, updateProject, deleteProjectAPI } from '../lib/api';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [weekFocus, setWeekFocus] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchProjects()
      .then(data => {
        setProjects(data);
        setWeekFocus(data.filter(p => p.weekFocus).map(p => p.id));
      })
      .catch(err => console.error("Failed to fetch projects:", err))
      .finally(() => setLoaded(true));
  }, []);

  const syncProject = useCallback((id, updates) => {
    updateProject({ id, ...updates }).catch(err => console.error("Sync error:", err));
  }, []);

  const addProject = useCallback((domain, name) => {
    if (!name.trim()) return;
    const id = Date.now().toString();
    const newProject = { id, domain, name: name.trim(), steps: [], link: "", weekFocus: false };
    setProjects(prev => [...prev, newProject]);
    createProjectAPI({ id, domain, name: name.trim(), link: "", steps: [] });
  }, []);

  const deleteProject = useCallback((id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    deleteProjectAPI(id);
  }, []);

  const toggleStep = useCallback((pid, sid) => {
    setProjects(prev => {
      const updated = prev.map(p =>
        p.id === pid ? { ...p, steps: p.steps.map(s => s.id === sid ? { ...s, done: !s.done } : s) } : p
      );
      const project = updated.find(p => p.id === pid);
      if (project) syncProject(pid, { steps: project.steps });
      return updated;
    });
  }, [syncProject]);

  const deleteStep = useCallback((pid, sid) => {
    setProjects(prev => {
      const updated = prev.map(p =>
        p.id === pid ? { ...p, steps: p.steps.filter(s => s.id !== sid) } : p
      );
      const project = updated.find(p => p.id === pid);
      if (project) syncProject(pid, { steps: project.steps });
      return updated;
    });
  }, [syncProject]);

  const addStep = useCallback((pid, text) => {
    if (!text.trim()) return;
    setProjects(prev => {
      const updated = prev.map(p =>
        p.id === pid ? { ...p, steps: [...p.steps, { id: `s${Date.now()}`, text: text.trim(), done: false }] } : p
      );
      const project = updated.find(p => p.id === pid);
      if (project) syncProject(pid, { steps: project.steps });
      return updated;
    });
  }, [syncProject]);

  const addSteps = useCallback((pid, steps) => {
    setProjects(prev => {
      const updated = prev.map(p =>
        p.id === pid ? { ...p, steps: [...p.steps, ...steps] } : p
      );
      const project = updated.find(p => p.id === pid);
      if (project) syncProject(pid, { steps: project.steps });
      return updated;
    });
  }, [syncProject]);

  const insertStepsAfter = useCallback((pid, afterStepId, newSteps) => {
    setProjects(prev => {
      const updated = prev.map(p => {
        if (p.id !== pid) return p;
        const idx = p.steps.findIndex(s => s.id === afterStepId);
        const ns = [...p.steps];
        ns.splice(idx + 1, 0, ...newSteps);
        return { ...p, steps: ns };
      });
      const project = updated.find(p => p.id === pid);
      if (project) syncProject(pid, { steps: project.steps });
      return updated;
    });
  }, [syncProject]);

  const replaceUndoneSteps = useCallback((pid, newSteps) => {
    setProjects(prev => {
      const updated = prev.map(p => {
        if (p.id !== pid) return p;
        const doneSteps = p.steps.filter(s => s.done);
        return { ...p, steps: [...doneSteps, ...newSteps] };
      });
      const project = updated.find(p => p.id === pid);
      if (project) syncProject(pid, { steps: project.steps });
      return updated;
    });
  }, [syncProject]);

  const toggleWeekFocus = useCallback((id) => {
    setWeekFocus(prev => {
      const newFocus = prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev;
      // Sync all projects' week_focus
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
    toggleStep, deleteStep, addStep, addSteps, insertStepsAfter, replaceUndoneSteps,
  };
}
