import { useState, useEffect, useCallback } from 'react';
import { fetchSettings, updateSetting } from '../lib/api';

export function useSettings() {
  const [myWhy, setMyWhyState] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then(data => setMyWhyState(data.myWhy || ""))
      .catch(err => console.error("Failed to fetch settings:", err))
      .finally(() => setLoaded(true));
  }, []);

  const setMyWhy = useCallback((value) => {
    setMyWhyState(value);
    updateSetting("myWhy", value);
  }, []);

  return { myWhy, setMyWhy, loaded };
}
