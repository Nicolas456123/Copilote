import * as Haptics from 'expo-haptics';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/Card';
import { useHabits, getDayName } from '../../hooks/useHabits';

const SAGE = '#81B29A';
const CORAL = '#E07A5F';

export default function HabitudesScreen() {
  const {
    habits,
    todayHabits,
    habitsToday,
    habitsTotal,
    weekDates,
    gymThisWeek,
    log,
    today,
    toggleHabit,
  } = useHabits();

  const handleToggle = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    toggleHabit(id);
  };

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-d-cream">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-2xl font-bold text-ink dark:text-d-ink mt-4 mb-1">
          ✅ Habitudes du jour
        </Text>
        <Text className="text-base text-ink-muted dark:text-d-ink-muted mb-4">
          {habitsToday === habitsTotal ? '🎉 Toutes faites !' : `${habitsToday}/${habitsTotal} aujourd'hui`}
        </Text>

        {habits.map((h) => {
          const checked = !!todayHabits[h.id];
          const isGym = h.id === 'gym';
          return (
            <Pressable
              key={h.id}
              onPress={() => handleToggle(h.id)}
              className="bg-surface dark:bg-d-surface rounded-2xl px-4 py-3.5 mb-2 flex-row items-center gap-3"
              style={{ opacity: checked ? 0.7 : 1 }}
            >
              <View
                className="w-7 h-7 rounded-full items-center justify-center"
                style={{
                  borderWidth: 2,
                  borderColor: checked ? SAGE : '#D1D5DB',
                  backgroundColor: checked ? SAGE : 'transparent',
                }}
              >
                {checked && <Text className="text-white text-base">✓</Text>}
              </View>
              <Text className="text-xl">{h.icon}</Text>
              <View className="flex-1">
                <Text
                  className="text-base font-semibold text-ink dark:text-d-ink"
                  style={checked ? { textDecorationLine: 'line-through' } : undefined}
                >
                  {h.label}
                </Text>
                {isGym && (
                  <Text className="text-sm text-ink-muted dark:text-d-ink-muted">
                    {gymThisWeek}/{(h as { target?: number }).target ?? 3} cette semaine
                  </Text>
                )}
              </View>
            </Pressable>
          );
        })}

        <Card className="mt-4">
          <Text className="text-sm font-bold text-ink dark:text-d-ink mb-3">📅 SEMAINE</Text>
          <View className="flex-row justify-between">
            {weekDates.map((d) => {
              const dayLog = log[d] || {};
              const count = habits.filter((h) => dayLog[h.id]).length;
              const isToday = d === today;
              const filled = count > 0;
              return (
                <View key={d} className="items-center flex-1">
                  <Text
                    className={`text-xs mb-1 ${
                      isToday ? 'font-extrabold' : 'text-ink-muted dark:text-d-ink-muted'
                    }`}
                    style={isToday ? { color: CORAL } : undefined}
                  >
                    {getDayName(d)}
                  </Text>
                  <View
                    className="w-7 h-7 rounded-full items-center justify-center"
                    style={{
                      backgroundColor: count === habits.length
                        ? SAGE
                        : filled
                          ? `rgba(129,178,154,${count / habits.length})`
                          : 'transparent',
                      borderWidth: isToday ? 2 : 0,
                      borderColor: isToday ? CORAL : undefined,
                    }}
                  >
                    <Text
                      className="text-xs font-bold"
                      style={{ color: filled ? 'white' : '#9CA3AF' }}
                    >
                      {count || '·'}
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
