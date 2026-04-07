import { useState, useEffect, useCallback } from 'react';
import { storage } from '../lib/storage';

export function useSettings() {
  const [myWhy, setMyWhy] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setMyWhy(storage.get("myWhy") || "");
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) storage.set("myWhy", myWhy);
  }, [myWhy, loaded]);

  return { myWhy, setMyWhy, loaded };
}
