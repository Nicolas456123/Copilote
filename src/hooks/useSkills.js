import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchSettings, updateSetting, callAIJSON } from '../lib/api';
import { getTodayKey } from '../utils/time';
import {
  applyFeedback, fallbackAction, seedSkills,
  buildSkillSystem, buildSkillPrompt, FEEDBACK,
} from '../lib/skills';

export function useSkills() {
  const [skills, setSkills] = useState([]);
  const [generatingId, setGeneratingId] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const skillsRef = useRef([]);

  // Source unique de vérité : un ref synchrone + le state pour le rendu.
  const persist = useCallback((next) => {
    skillsRef.current = next;
    setSkills(next);
    updateSetting("plan", JSON.stringify(next)).catch(() => {});
  }, []);

  useEffect(() => {
    fetchSettings()
      .then(data => {
        let parsed = [];
        if (data.plan) {
          try { parsed = JSON.parse(data.plan); } catch { parsed = []; }
        }
        if (!Array.isArray(parsed) || parsed.length === 0) {
          parsed = seedSkills();
          updateSetting("plan", JSON.stringify(parsed)).catch(() => {});
        }
        skillsRef.current = parsed;
        setSkills(parsed);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const updateOne = useCallback((id, patch) => {
    const next = skillsRef.current.map(s =>
      s.id === id ? { ...s, ...(typeof patch === 'function' ? patch(s) : patch), updatedAt: new Date().toISOString() } : s
    );
    persist(next);
    return next;
  }, [persist]);

  // Génère (ou régénère) la prochaine marche, calibrée au niveau courant.
  // `correction` : ce que Nicolas juge incohérent, pour ajuster en direct.
  // IA d'abord, repli sur une action templatée si indisponible.
  const generate = useCallback(async (id, correction) => {
    const skill = skillsRef.current.find(s => s.id === id);
    if (!skill) return;
    setGeneratingId(id);
    let action;
    try {
      const r = await callAIJSON(buildSkillSystem(), buildSkillPrompt(skill, correction));
      if (r && typeof r.action === 'string' && r.action.trim()) {
        action = {
          action: r.action.trim(),
          minutes: Math.max(5, Math.min(45, parseInt(r.minutes, 10) || 15)),
          rationale: typeof r.rationale === 'string' ? r.rationale.trim() : "",
          ai: true,
        };
      }
    } catch { /* repli ci-dessous */ }
    if (!action) action = { ...fallbackAction(skill), ai: false };
    action.at = new Date().toISOString();
    updateOne(id, { currentAction: action });
    setGeneratingId(null);
  }, [updateOne]);

  // Retour utilisateur → ajuste le niveau, puis prépare la marche suivante.
  const complete = useCallback(async (id, feedbackKey) => {
    const skill = skillsRef.current.find(s => s.id === id);
    if (!skill) return;
    const newLevel = applyFeedback(skill.level, feedbackKey);
    const entry = {
      date: getTodayKey(),
      key: feedbackKey,
      note: FEEDBACK[feedbackKey]?.note || "",
      from: Math.round(skill.level),
      to: newLevel,
    };
    updateOne(id, s => ({
      level: newLevel,
      history: [...(s.history || []), entry].slice(-8),
      currentAction: null,
    }));
    await generate(id);
  }, [updateOne, generate]);

  const addSkill = useCallback(async ({ name, domain, level }) => {
    const skill = {
      id: `sk-${Date.now()}`,
      name: name.trim(),
      domain: domain || "learning",
      level: Math.max(0, Math.min(100, level ?? 6)),
      active: true,
      currentAction: null,
      history: [],
      updatedAt: new Date().toISOString(),
    };
    persist([...skillsRef.current, skill]);
    await generate(skill.id);
    return skill.id;
  }, [persist, generate]);

  const setLevel = useCallback((id, level) => {
    updateOne(id, { level: Math.max(0, Math.min(100, Math.round(level))) });
  }, [updateOne]);

  const setHorizon = useCallback((id, field, value) => {
    updateOne(id, { [field]: value });
  }, [updateOne]);

  const setActive = useCallback((id, active) => updateOne(id, { active }), [updateOne]);

  const remove = useCallback((id) => {
    persist(skillsRef.current.filter(s => s.id !== id));
  }, [persist]);

  return {
    skills,
    activeSkills: skills.filter(s => s.active),
    reserveSkills: skills.filter(s => !s.active),
    generatingId,
    skillsLoaded: loaded,
    generate, complete, addSkill, setLevel, setHorizon, setActive, remove,
  };
}
