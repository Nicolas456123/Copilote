import { useState, useEffect, useCallback } from 'react';
import { fetchStreak, updateStreak } from '../lib/api';
import { getTodayKey } from '../utils/time';

function yesterdayKey() {
  return new Date(Date.now() - 86400000).toISOString().slice(0, 10);
}

// La série ne récompense QUE l'action, jamais le simple fait d'ouvrir l'app.
// Elle avance quand Nicolas fait le minimum du jour (markActed), et se rompt
// dès qu'un jour passe sans rien faire. Le score ne ment pas.
export function useStreak() {
  const [streak, setStreak] = useState(0);
  const [lastDate, setLastDate] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchStreak()
      .then(data => {
        const today = getTodayKey();
        const yest = yesterdayKey();
        let s = data.currentStreak || 0;
        const last = data.lastDate || "";
        // Dernier jour agi ni aujourd'hui ni hier → la chaîne est rompue.
        if (last && last !== today && last !== yest && s !== 0) {
          s = 0;
          updateStreak({ currentStreak: 0, lastDate: last }).catch(() => {});
        }
        setStreak(s);
        setLastDate(last);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  // À appeler quand une vraie action du jour est faite.
  const markActed = useCallback(() => {
    const today = getTodayKey();
    if (lastDate === today) return; // déjà compté aujourd'hui
    const next = lastDate === yesterdayKey() ? streak + 1 : 1;
    setStreak(next);
    setLastDate(today);
    updateStreak({ currentStreak: next, lastDate: today }).catch(() => {});
  }, [lastDate, streak]);

  return { streak, actedToday: loaded && lastDate === getTodayKey(), markActed, streakLoaded: loaded };
}
