import { useState, useCallback } from 'react';
import { callAI, callAIJSON } from '../lib/api';
import { NICOLAS_CONTEXT, DOMAINS } from '../lib/constants';
import { getProgress, getNextStep } from '../utils/progress';

const SYS_JSON = `Réponds UNIQUEMENT avec un JSON array de strings courtes (max 12 mots chacune). Sans markdown ni backticks.`;

export function useAI({ projects, habitsToday, habitsTotal, gymThisWeek, streak, myWhy }) {
  const [aiMsg, setAiMsg] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiAction, setAiAction] = useState(null);
  const [projMsg, setProjMsg] = useState({});

  const buildContext = useCallback(() => {
    const projectsSummary = projects.map(p => {
      const pr = getProgress(p);
      const nx = getNextStep(p);
      return `${DOMAINS[p.domain]?.icon} ${p.name} ${Math.round(pr)}%${nx ? ` → ${nx.text}` : ""}`;
    }).join("\n");
    return `${NICOLAS_CONTEXT}${myWhy ? `\nSon pourquoi : "${myWhy}"` : ""}\nHabitudes aujourd'hui: ${habitsToday}/${habitsTotal} faites. Gym cette semaine: ${gymThisWeek}/3.\nStreak: ${streak}j.\nProjets:\n${projectsSummary}`;
  }, [projects, habitsToday, habitsTotal, gymThisWeek, streak, myWhy]);

  const askAI = useCallback(async (prompt) => {
    setAiLoading(true);
    setAiMsg("");
    try {
      const text = await callAI(buildContext(), prompt);
      setAiMsg(text || "Je suis là 💪");
    } catch {
      setAiMsg("Continue d'avancer, un pas à la fois. Tu fais déjà beaucoup ! 💪");
    }
    setAiLoading(false);
  }, [buildContext]);

  const aiPlanWeek = useCallback(async () => {
    setAiLoading(true);
    setAiMsg("");
    try {
      const projectsSummary = projects.map(p => `${p.name} (${Math.round(getProgress(p))}%)`).join(", ");
      const text = await callAI(
        `${NICOLAS_CONTEXT} Sois concis. Propose 2-3 priorités pour cette semaine parmi ses projets, en expliquant pourquoi. Pas de listes à puces.`,
        `Aide-moi à choisir mes priorités de la semaine. Mes projets : ${projectsSummary}. Gym: ${gymThisWeek}/3 cette semaine.`
      );
      setAiMsg(text);
    } catch {
      setAiMsg("Choisis 2-3 projets max pour la semaine. Tu ne peux pas tout faire en même temps, et c'est OK !");
    }
    setAiLoading(false);
  }, [projects, gymThisWeek]);

  const isActionLoading = useCallback((pid, act) => aiAction === `${pid}:${act}`, [aiAction]);

  const aiBreakdown = useCallback(async (project) => {
    setAiAction(`${project.id}:breakdown`);
    try {
      const names = await callAIJSON(SYS_JSON,
        `D\u00E9coupe ce projet en 5-8 étapes clés concrètes et chronologiques.\nProjet : "${project.name}" (domaine: ${DOMAINS[project.domain]?.label})`
      );
      const steps = names.map((s, i) => ({ id: `${project.id}-${Date.now()}-${i}`, text: s, done: false }));
      setAiAction(null);
      return steps;
    } catch {
      setProjMsg(prev => ({ ...prev, [project.id]: "Erreur, r\u00E9essaye !" }));
      setAiAction(null);
      return null;
    }
  }, []);

  const aiDetailStep = useCallback(async (project, step) => {
    setAiAction(`${project.id}:detail`);
    try {
      const subs = await callAIJSON(SYS_JSON,
        `D\u00E9coupe cette étape en 3-5 sous-étapes concrètes.\nProjet: "${project.name}"\nÉtape: "${step.text}"`
      );
      const subSteps = subs.map((s, i) => ({ id: `sub${Date.now()}-${i}`, text: s, done: false }));
      setAiAction(null);
      return subSteps;
    } catch {
      setProjMsg(prev => ({ ...prev, [project.id]: "Erreur, r\u00E9essaye !" }));
      setAiAction(null);
      return null;
    }
  }, []);

  const aiProjectAction = useCallback(async (project, action, prompt) => {
    setAiAction(`${project.id}:${action}`);
    try {
      const prog = getProgress(project);
      const done = project.steps.filter(s => s.done).map(s => s.text).join(", ") || "rien";
      const todo = project.steps.filter(s => !s.done).map(s => s.text).join(", ") || "tout fait";
      const text = await callAI(
        `${NICOLAS_CONTEXT} Sois concis (3-4 phrases). Pas de listes.`,
        `${prompt}\nProjet: "${project.name}" (${Math.round(prog)}%)\nFait: ${done}\nReste: ${todo}`
      );
      setProjMsg(prev => ({ ...prev, [project.id]: text }));
    } catch {
      setProjMsg(prev => ({ ...prev, [project.id]: "Erreur, r\u00E9essaye !" }));
    }
    setAiAction(null);
  }, []);

  const aiReorganize = useCallback(async (project) => {
    setAiAction(`${project.id}:reorg`);
    try {
      const todoSteps = project.steps.filter(s => !s.done).map(s => s.text);
      if (todoSteps.length < 2) {
        setProjMsg(prev => ({ ...prev, [project.id]: "Rien à réorganiser !" }));
        setAiAction(null);
        return null;
      }
      const reordered = await callAIJSON(SYS_JSON,
        `Réorganise ces étapes dans l'ordre optimal.\nProjet: "${project.name}"\nÉtapes: ${JSON.stringify(todoSteps)}`
      );
      const newTodo = reordered.map((t, i) => ({ id: `r${Date.now()}-${i}`, text: t, done: false }));
      setProjMsg(prev => ({ ...prev, [project.id]: "✅ Réorganisé !" }));
      setAiAction(null);
      return newTodo;
    } catch {
      setProjMsg(prev => ({ ...prev, [project.id]: "Erreur !" }));
      setAiAction(null);
      return null;
    }
  }, []);

  const clearProjMsg = useCallback((pid) => {
    setProjMsg(prev => { const n = { ...prev }; delete n[pid]; return n; });
  }, []);

  return {
    aiMsg, aiLoading, aiAction, projMsg,
    askAI, aiPlanWeek,
    aiBreakdown, aiDetailStep, aiProjectAction, aiReorganize,
    isActionLoading, clearProjMsg,
  };
}
