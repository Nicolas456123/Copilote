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
    <View className="border-t border-line-soft pt-3 mt-3">
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-2 flex-1">
          <Text className="text-lg">{type.emoji}</Text>
          <Text className="text-sm font-semibold text-ink flex-1">{type.label}</Text>
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
                className="flex-row items-center gap-1 py-1 px-2.5 rounded-lg bg-surface-2"
              >
                <Text className="text-sm font-semibold text-ink">{t}</Text>
                <Pressable onPress={() => onRemove(type.id, t)}>
                  <Text className="text-base text-ink-muted">×</Text>
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
              className="flex-1 px-3 py-2 rounded-lg border border-line bg-surface text-sm text-ink"
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
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-2xl font-bold text-ink mt-4 mb-4">🔔 Rappels</Text>

        <Card className="mb-3">
          {permission === 'granted' ? (
            <View className="py-2 px-3 rounded-lg bg-sage/15 mb-3">
              <Text className="text-sm font-semibold text-sage">✓ Notifications activées</Text>
            </View>
          ) : permission === 'denied' ? (
            <View className="py-2 px-3 rounded-lg bg-coral/15 mb-3">
              <Text className="text-sm text-coral">
                ✗ Notifications bloquées. Active-les dans Réglages iOS → Copilote → Notifications.
              </Text>
            </View>
          ) : (
            <Pressable onPress={ask} className="py-3 rounded-xl bg-coral mb-3">
              <Text className="text-base font-semibold text-white text-center">
                🔔 Activer les notifications
              </Text>
            </Pressable>
          )}

          {permission === 'granted' && (
            <Pressable onPress={test} className="py-2 rounded-xl border border-line bg-surface">
              <Text className="text-sm font-semibold text-ink text-center">
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

        <Text className="text-xs text-ink-soft leading-5 px-2">
          Les rappels sont programmés nativement par iOS et sonnent même quand l'app est complètement fermée. Plus besoin d'export Calendrier.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
