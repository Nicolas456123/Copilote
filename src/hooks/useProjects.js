import { useState, useEffect, useCallback } from 'react';
import { storage } from '../lib/storage';
import { DEFAULT_PROJECTS } from '../lib/constants';
import { getWeekId } from '../utils/time';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [weekFocus, setWeekFocus] = useState([]);
  const [weekFocusWeek, setWeekFocusWeek] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = storage.get("projects");
    if (saved) {
      setProjects(saved);
    } else {
      const init = DEFAULT_PROJECTS.map((dp, i) => ({ ...dp, id: `init-${i}`, steps: [] }));
      setProjects(init);
    }
    setWeekFocus(storage.get("weekFocus") || []);
    setWeekFocusWeek(storage.get("weekFocusWeek") || "");
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) storage.set("projects", projects);
  }, [projects, loaded]);

  useEffect(() => {
    if (loaded) storage.set("weekFocus", weekFocus);
  }, [weekFocus, loaded]);

  useEffect(() => {
    if (loaded) {
      const w = getWeekId();
      if (weekFocusWeek !== w) {
        setWeekFocus([]);
        setWeekFocusWeek(w);
      }
      storage.set("weekFocusWeek", weekFocusWeek);
    }
  }, [weekFocusWeek, loaded]);

  const addProject = useCallback((domain, name) => {
    if (!name.trim()) return;
    setProjects(prev => [...prev, { id: Date.now().toString(), domain, name: name.trim(), steps: [], link: "" }]);
  }, []);

  const deleteProject = useCallback((id) => {
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  const toggleStep = useCallback((pid, sid) => {
    setProjects(prev => prev.map(p =>
      p.id === pid ? { ...p, steps: p.steps.map(s => s.id === sid ? { ...s, done: !s.done } : s) } : p
    ));
  }, []);

  const deleteStep = useCallback((pid, sid) => {
    setProjects(prev => prev.map(p =>
      p.id === pid ? { ...p, steps: p.steps.filter(s => s.id !== sid) } : p
    ));
  }, []);

  const addStep = useCallback((pid, text) => {
    if (!text.trim()) return;
    setProjects(prev => prev.map(p =>
      p.id === pid ? { ...p, steps: [...p.steps, { id: `s${Date.now()}`, text: text.trim(), done: false }] } : p
    ));
  }, []);

  const addSteps = useCallback((pid, steps) => {
    setProjects(prev => prev.map(p =>
      p.id === pid ? { ...p, steps: [...p.steps, ...steps] } : p
    ));
  }, []);

  const insertStepsAfter = useCallback((pid, afterStepId, newSteps) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== pid) return p;
      const idx = p.steps.findIndex(s => s.id === afterStepId);
      const ns = [...p.steps];
      ns.splice(idx + 1, 0, ...newSteps);
      return { ...p, steps: ns };
    }));
  }, []);

  const replaceUndoneSteps = useCallback((pid, newSteps) => {
    setProjects(prev => prev.map(p => {
      if (p.id !== pid) return p;
      const doneSteps = p.steps.filter(s => s.done);
      return { ...p, steps: [...doneSteps, ...newSteps] };
    }));
  }, []);

  const toggleWeekFocus = useCallback((id) => {
    setWeekFocus(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : prev.length < 3 ? [...prev, id] : prev
    );
  }, []);

  const focusProjects = projects.filter(p => weekFocus.includes(p.id));

  return {
    projects, setProjects, loaded,
    weekFocus, focusProjects, toggleWeekFocus,
    addProject, deleteProject,
    toggleStep, deleteStep, addStep, addSteps, insertStepsAfter, replaceUndoneSteps,
  };
}
