import { useState } from 'react';
import { Platform, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/Card';
import { useReminders } from '../../hooks/useReminders';
import { REMINDER_TYPES, type ReminderState } from '../../lib/reminders';

function TypeRow({
  type,
  state,
  onToggle,
  onAdd,
  onRemove,
}: {
  type: (typeof REMINDER_TYPES)[string];
  state: ReminderState;
  onToggle: (id: string, v: boolean) => void;
  onAdd: (id: string, time: string) => void;
  onRemove: (id: string, time: string) => void;
}) {
  const [newTime, setNewTime] = useState('');

  const handleAdd = () => {
    if (!/^\d{2}:\d{2}$/.test(newTime)) return;
    onAdd(type.id, newTime);
    setNewTime('');
  };

  return (
    <View className="border-t border-line-soft dark:border-d-line-soft pt-3 mt-3">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2 flex-1">
          <Text className="text-lg">{type.emoji}</Text>
          <Text className="text-sm font-semibold text-ink dark:text-d-ink flex-1">
            {type.label}
          </Text>
        </View>
        <Switch
          value={state.enabled}
          onValueChange={(v) => onToggle(type.id, v)}
          trackColor={{ false: '#E5E7EB', true: '#81B29A' }}
        />
      </View>

      {state.enabled && (
        <View>
          <View className="flex-row flex-wrap gap-2 mb-2">
            {state.times.map((t) => (
              <View
                key={t}
                className="flex-row items-center gap-1 py-1 px-2.5 rounded-lg bg-surface-2 dark:bg-d-surface-2"
              >
                <Text className="text-sm font-semibold text-ink dark:text-d-ink">{t}</Text>
                <Pressable onPress={() => onRemove(type.id, t)}>
                  <Text className="text-base text-ink-muted dark:text-d-ink-muted">×</Text>
                </Pressable>
              </View>
            ))}
          </View>
          <View className="flex-row gap-2">
            <TextInput
              value={newTime}
              onChangeText={setNewTime}
              placeholder="08:30"
              placeholderTextColor="#9CA3AF"
              keyboardType={Platform.OS === 'ios' ? 'numbers-and-punctuation' : 'default'}
              className="flex-1 px-3 py-2 rounded-lg border border-line dark:border-d-line bg-surface dark:bg-d-surface text-sm text-ink dark:text-d-ink"
            />
            <Pressable
              onPress={handleAdd}
              className="px-3 py-2 rounded-lg bg-navy"
            >
              <Text className="text-sm font-semibold text-white">+ Ajouter</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}

export default function RappelsScreen() {
  const { state, permission, ask, toggleType, addTime, removeTime, test } = useReminders();

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-d-cream">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-2xl font-bold text-ink dark:text-d-ink mt-4 mb-4">
          🔔 Rappels
        </Text>

        <Card className="mb-3">
          {permission === 'granted' ? (
            <View className="py-2 px-3 rounded-lg mb-3" style={{ backgroundColor: 'rgba(129,178,154,0.15)' }}>
              <Text className="text-sm font-semibold" style={{ color: '#81B29A' }}>
                ✓ Notifications activées
              </Text>
            </View>
          ) : permission === 'denied' ? (
            <View className="py-2 px-3 rounded-lg mb-3" style={{ backgroundColor: 'rgba(224,122,95,0.15)' }}>
              <Text className="text-sm" style={{ color: '#E07A5F' }}>
                ✗ Notifications bloquées. Active-les dans Réglages iOS → Expo Go → Notifications.
              </Text>
            </View>
          ) : (
            <Pressable onPress={ask} className="py-3 rounded-xl mb-3" style={{ backgroundColor: '#E07A5F' }}>
              <Text className="text-base font-semibold text-white text-center">
                🔔 Activer les notifications
              </Text>
            </Pressable>
          )}

          {permission === 'granted' && (
            <Pressable
              onPress={test}
              className="py-2 rounded-xl border border-line dark:border-d-line bg-surface dark:bg-d-surface"
            >
              <Text className="text-sm font-semibold text-ink dark:text-d-ink text-center">
                🧪 Tester une notification
              </Text>
            </Pressable>
          )}

          {Object.values(REMINDER_TYPES).map((type) => (
            <TypeRow
              key={type.id}
              type={type}
              state={state[type.id]}
              onToggle={toggleType}
              onAdd={addTime}
              onRemove={removeTime}
            />
          ))}
        </Card>

        <Text className="text-xs text-ink-soft dark:text-d-ink-soft leading-5 px-2">
          Les rappels sont programmés nativement par iOS et sonnent même quand l'app est complètement fermée.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
