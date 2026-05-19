const ICON = '/favicon.svg';
const BADGE = '/favicon.svg';

export function isSupported() {
  return typeof window !== 'undefined' && 'Notification' in window && 'serviceWorker' in navigator;
}

export function getPermission() {
  if (!isSupported()) return 'unsupported';
  return Notification.permission;
}

export async function requestPermission() {
  if (!isSupported()) return 'unsupported';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  const result = await Notification.requestPermission();
  return result;
}

async function getRegistration() {
  try {
    return await navigator.serviceWorker.ready;
  } catch {
    return null;
  }
}

export async function showNotification(title, options = {}) {
  if (!isSupported() || Notification.permission !== 'granted') return false;
  const reg = await getRegistration();
  const opts = {
    icon: ICON,
    badge: BADGE,
    vibrate: [120, 60, 120],
    requireInteraction: false,
    ...options,
  };
  try {
    if (reg && reg.showNotification) {
      await reg.showNotification(title, opts);
    } else {
      new Notification(title, opts);
    }
    return true;
  } catch (e) {
    console.error('Notification error:', e);
    return false;
  }
}
