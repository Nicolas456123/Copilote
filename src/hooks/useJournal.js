import { useState, useEffect, useCallback } from 'react';
import { storage } from '../lib/storage';
import { getTodayKey } from '../utils/time';
import { callAI } from '../lib/api';

const JOURNAL_SYSTEM = `Tu es le copilote de Nicolas. Reformule ce check-in en un court paragraphe de journal intime (3-4 phrases), chaleureux et encourageant. Garde le sens exact mais rends-le agr\u00E9able à relire. Fran\u00E7ais. Pas de listes.`;

export function useJournal() {
  const [entries, setEntries] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setEntries(storage.get("journal") || []);
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) storage.set("journal", entries);
  }, [entries, loaded]);

  const todayEntry = entries.find(e => e.date === getTodayKey());

  const createEntry = useCallback(async ({ mood, tags, customText }) => {
    const tagText = tags.join(", ");
    const raw = customText
      ? `Humeur: ${mood.label}. Raisons: ${tagText}. Note: ${customText}`
      : `Humeur: ${mood.label}. Raisons: ${tagText}.`;

    let aiText = "";
    try {
      aiText = await callAI(JOURNAL_SYSTEM, raw);
    } catch {
      aiText = raw;
    }

    const entry = {
      id: `j-${Date.now()}`,
      date: getTodayKey(),
      mood,
      tags,
      rawText: customText || "",
      aiText,
      createdAt: new Date().toISOString(),
    };

    setEntries(prev => {
      const filtered = prev.filter(e => e.date !== entry.date);
      return [entry, ...filtered];
    });

    return entry;
  }, []);

  const updateEntryText = useCallback((id, newText) => {
    setEntries(prev => prev.map(e => e.id === id ? { ...e, aiText: newText } : e));
  }, []);

  return { entries, todayEntry, createEntry, updateEntryText, loaded };
}
