import { useCallback, useEffect, useState } from 'react';
import { storage } from '../lib/storage';

const KEY = 'themePreference';
const VALID = ['auto', 'light', 'dark'];

function systemPrefersDark() {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function resolve(pref) {
  if (pref === 'dark') return 'dark';
  if (pref === 'light') return 'light';
  return systemPrefersDark() ? 'dark' : 'light';
}

function applyTheme(mode) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (mode === 'dark') root.classList.add('dark');
  else root.classList.remove('dark');
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', mode === 'dark' ? '#0E0F1A' : '#FFF8F0');
}

export function useTheme() {
  const [preference, setPreference] = useState(() => {
    const stored = storage.get(KEY);
    return VALID.includes(stored) ? stored : 'auto';
  });
  const resolved = resolve(preference);

  useEffect(() => {
    applyTheme(resolved);
    storage.set(KEY, preference);
  }, [preference, resolved]);

  useEffect(() => {
    if (preference !== 'auto' || typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      applyTheme(resolve('auto'));
      setPreference('auto');
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [preference]);

  const setTheme = useCallback((pref) => {
    if (VALID.includes(pref)) setPreference(pref);
  }, []);

  const cycle = useCallback(() => {
    setPreference(prev => {
      const idx = VALID.indexOf(prev);
      return VALID[(idx + 1) % VALID.length];
    });
  }, []);

  return { preference, resolved, setTheme, cycle };
}
