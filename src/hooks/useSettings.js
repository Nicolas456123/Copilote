import { useState, useEffect, useCallback } from 'react';
import { fetchSettings, updateSetting, callAIJSON } from '../lib/api';
import { OBJECTIVE } from '../lib/discipline';

const DEFAULT_OBJECTIVE = { title: OBJECTIVE.title, statement: OBJECTIVE.statement };

const OBJECTIVE_SYS = `Tu aides Nicolas à reformuler l'objectif central de son app de progression. Garde l'esprit : discipline, apprentissage, constance, progression réaliste sans dépendre de la motivation.
Réponds UNIQUEMENT en JSON, sans markdown : { "title": "<titre court, max 8 mots>", "statement": "<énoncé clair de l'objectif, max 35 mots>" }`;

export function useSettings() {
  const [myWhy, setMyWhyState] = useState("");
  // Journal des 4 axes par jour : { "2026-06-01": { "ax-discipline": true } }
  const [axesLog, setAxesLog] = useState({});
  // Objectif central, personnalisable en direct (override du défaut).
  const [objective, setObjective] = useState(DEFAULT_OBJECTIVE);
  const [adjustingObjective, setAdjustingObjective] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then(data => {
        setMyWhyState(data.myWhy || "");
        if (data.dailyAxes) {
          try { setAxesLog(JSON.parse(data.dailyAxes)); } catch { /* ignore corrupt blob */ }
        }
        if (data.objective) {
          try {
            const o = JSON.parse(data.objective);
            if (o && o.title) setObjective({ title: o.title, statement: o.statement || DEFAULT_OBJECTIVE.statement });
          } catch { /* ignore */ }
        }
      })
      .catch(err => console.error("Failed to fetch settings:", err))
      .finally(() => setLoaded(true));
  }, []);

  const setMyWhy = useCallback((value) => {
    setMyWhyState(value);
    updateSetting("myWhy", value);
  }, []);

  const toggleAxis = useCallback((date, axisId) => {
    setAxesLog(prev => {
      const day = { ...(prev[date] || {}) };
      if (day[axisId]) delete day[axisId];
      else day[axisId] = true;
      const next = { ...prev, [date]: day };
      updateSetting("dailyAxes", JSON.stringify(next));
      return next;
    });
  }, []);

  // Ajuste l'objectif via Claude selon ce que Nicolas trouve incohérent.
  const adjustObjective = useCallback(async (note) => {
    if (!note?.trim()) return;
    setAdjustingObjective(true);
    try {
      const cur = objective;
      const r = await callAIJSON(
        OBJECTIVE_SYS,
        `Objectif actuel — titre : "${cur.title}", énoncé : "${cur.statement}". Ce que Nicolas veut ajuster : "${note.trim()}". Propose une version révisée.`
      );
      if (r && r.title) {
        const next = { title: String(r.title), statement: String(r.statement || cur.statement) };
        setObjective(next);
        updateSetting("objective", JSON.stringify(next));
      }
    } catch { /* on garde l'objectif courant si l'IA échoue */ }
    setAdjustingObjective(false);
  }, [objective]);

  const resetObjective = useCallback(() => {
    setObjective(DEFAULT_OBJECTIVE);
    updateSetting("objective", "");
  }, []);

  return {
    myWhy, setMyWhy,
    axesLog, toggleAxis,
    objective, adjustObjective, resetObjective, adjustingObjective,
    loaded,
  };
}
