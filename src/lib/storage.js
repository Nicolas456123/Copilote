const PREFIX = "copilote:";

export const storage = {
  get(key) {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value));
    } catch (e) {
      console.error("Storage error:", e);
    }
  },

  remove(key) {
    localStorage.removeItem(PREFIX + key);
  },
};
