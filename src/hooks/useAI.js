import { useState, useCallback } from 'react';
import { callAI, callAIJSON } from '../lib/api';
import { NICOLAS_CONTEXT, DOMAINS } from '../lib/constants';
import { getProgress, getNextStep } from '../utils/progress';
import { treeToOutline, namesToTree, flattenForAI } from '../utils/stepTree';

const SYS_JSON = `Réponds UNIQUEMENT avec un JSON array de strings courtes (max 12 mots chacune). Sans markdown ni backticks.`;
const SYS_TREE = `Réponds UNIQUEMENT avec un JSON array. Chaque élément est soit une string (étape feuille), soit un objet { "text": "...", "children": [...] } (étape avec sous-étapes). Max 3 niveaux de profondeur. Textes courts (max 12 mots). Sans markdown.`;
const SYS_PROJECT = `Réponds UNIQUEMENT avec un JSON: { "domain": "<id>", "name": "<nom court>", "steps": [...] } où steps suit le format imbriqué (string ou { text, children }). domain doit être l'un des: gamedev, music, work, learning, health, daily. Sans markdown.`;

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

  const isActionLoading = useCallback((a, b) => {
    const key = b === undefined ? a : `${a}:${b}`;
    return aiAction === key;
  }, [aiAction]);

  const aiBreakdown = useCallback(async (project) => {
    setAiAction(`${project.id}:breakdown`);
    try {
      const tree = await callAIJSON(SYS_TREE,
        `Découpe ce projet en 5-8 étapes clés concrètes et chronologiques, du plus global au plus élémentaire. Tu peux nester des sous-étapes (objet { text, children }) quand une étape est complexe — max 3 niveaux.\nProjet : "${project.name}" (domaine: ${DOMAINS[project.domain]?.label})`
      );
      const steps = namesToTree(tree, `${project.id}-`);
      setAiAction(null);
      return steps;
    } catch {
      setProjMsg(prev => ({ ...prev, [project.id]: "Erreur, réessaye !" }));
      setAiAction(null);
      return null;
    }
  }, []);

  const aiDetailStep = useCallback(async (project, step) => {
    setAiAction(`${project.id}:detail`);
    try {
      const subs = await callAIJSON(SYS_TREE,
        `Découpe cette étape en 3-5 sous-étapes concrètes. Tu peux nester (objet { text, children }) si une sous-étape mérite encore d'être détaillée — max 2 niveaux de profondeur.\nProjet: "${project.name}"\nÉtape à découper: "${step.text}"`
      );
      const subSteps = namesToTree(subs, 'sub');
      setAiAction(null);
      return subSteps;
    } catch {
      setProjMsg(prev => ({ ...prev, [project.id]: "Erreur, réessaye !" }));
      setAiAction(null);
      return null;
    }
  }, []);

  const aiCustomModify = useCallback(async (project, instruction) => {
    setAiAction(`${project.id}:modify`);
    try {
      const outline = treeToOutline(project.steps) || '(aucune étape)';
      const newTree = await callAIJSON(SYS_TREE,
        `Modifie l'arborescence d'étapes selon l'instruction. Renvoie l'arborescence COMPLÈTE des étapes NON FAITES, dans le nouvel ordre/structure souhaité. Les étapes déjà cochées (✓) sont préservées par le système, ne les inclus pas.\nProjet: "${project.name}"\nÉtapes actuelles :\n${outline}\n\nInstruction : ${instruction}`
      );
      const newSteps = namesToTree(newTree, 'm');
      setProjMsg(prev => ({ ...prev, [project.id]: "✅ Mis à jour selon ton instruction." }));
      setAiAction(null);
      return newSteps;
    } catch {
      setProjMsg(prev => ({ ...prev, [project.id]: "Erreur, réessaye !" }));
      setAiAction(null);
      return null;
    }
  }, []);

  const aiCreateProject = useCallback(async (idea) => {
    setAiAction('new:create');
    try {
      const domainsList = Object.entries(DOMAINS).map(([k, v]) => `${k} (${v.label})`).join(', ');
      const result = await callAIJSON(SYS_PROJECT,
        `Crée un projet à partir de cette idée. Choisis le bon domaine parmi : ${domainsList}. Donne un nom court et clair. Découpe en 5-8 étapes clés concrètes du plus global au plus élémentaire, avec nesting (objets { text, children }) quand pertinent — max 3 niveaux.\n\nIdée : ${idea}`
      );
      setAiAction(null);
      if (!result || !DOMAINS[result.domain]) return null;
      return {
        domain: result.domain,
        name: result.name,
        steps: namesToTree(result.steps || [], 'p'),
      };
    } catch {
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
      setProjMsg(prev => ({ ...prev, [project.id]: "Erreur, réessaye !" }));
    }
    setAiAction(null);
  }, []);

  const aiReorganize = useCallback(async (project) => {
    setAiAction(`${project.id}:reorg`);
    try {
      const flat = flattenForAI(project.steps).filter(s => !s.done);
      if (flat.length < 2) {
        setProjMsg(prev => ({ ...prev, [project.id]: "Rien à réorganiser !" }));
        setAiAction(null);
        return null;
      }
      const outline = treeToOutline(project.steps);
      const reordered = await callAIJSON(SYS_TREE,
        `Réorganise les étapes NON FAITES dans l'ordre optimal. Renvoie l'arborescence des étapes non faites (string ou { text, children }). Conserve les sous-étapes existantes si pertinentes.\nProjet: "${project.name}"\nArborescence actuelle :\n${outline}`
      );
      const newTodo = namesToTree(reordered, 'r');
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
    aiCustomModify, aiCreateProject,
    isActionLoading, clearProjMsg,
  };
}
