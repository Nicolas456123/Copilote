import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function requestPermission(): Promise<'granted' | 'denied' | 'undetermined'> {
  if (!Device.isDevice) return 'undetermined';
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return 'granted';
  const { status } = await Notifications.requestPermissionsAsync();
  return status as 'granted' | 'denied' | 'undetermined';
}

export async function getPermission(): Promise<string> {
  const { status } = await Notifications.getPermissionsAsync();
  return status;
}

export async function setupAndroidChannel() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Rappels',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#E07A5F',
    });
  }
}

export type DailyReminder = {
  id: string;
  hour: number;
  minute: number;
  title: string;
  body: string;
};

export async function scheduleDaily({
  id,
  hour,
  minute,
  title,
  body,
}: DailyReminder): Promise<string> {
  await cancelByIdentifier(id);
  return Notifications.scheduleNotificationAsync({
    identifier: id,
    content: {
      title,
      body,
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
}

export async function cancelByIdentifier(id: string): Promise<void> {
  try {
    await Notifications.cancelScheduledNotificationAsync(id);
  } catch {
    /* not scheduled */
  }
}

export async function cancelAll(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}

export async function listScheduled() {
  return Notifications.getAllScheduledNotificationsAsync();
}

export async function showNow(title: string, body: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, sound: 'default' },
    trigger: null,
  });
}
