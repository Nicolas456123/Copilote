import { useState, useEffect, useCallback } from 'react';
import { fetchSettings, updateSetting } from '../lib/api';

export function useSettings() {
  const [myWhy, setMyWhyState] = useState("");
  // Journal des 4 axes par jour : { "2026-06-01": { "ax-discipline": true } }
  const [axesLog, setAxesLog] = useState({});
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then(data => {
        setMyWhyState(data.myWhy || "");
        if (data.dailyAxes) {
          try { setAxesLog(JSON.parse(data.dailyAxes)); } catch { /* ignore corrupt blob */ }
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

  return { myWhy, setMyWhy, axesLog, toggleAxis, loaded };
}
