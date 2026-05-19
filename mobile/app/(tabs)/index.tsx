import { Link } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/Card';
import { useHabits } from '../../hooks/useHabits';
import { usePitch } from '../../hooks/usePitch';

function greeting(h: number): string {
  if (h < 5 || h > 22) return 'Tu devrais dormir 😴';
  if (h < 12) return 'Bonjour Nicolas ☀️';
  if (h < 18) return 'Bel après-midi 🌤️';
  return 'Bonsoir 🌙';
}

export default function AccueilScreen() {
  const hour = new Date().getHours();
  const { habitsToday, habitsTotal, gymThisWeek } = useHabits();
  const { todayCount, target } = usePitch();

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-d-cream">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-2xl font-bold text-ink dark:text-d-ink text-center mt-4 mb-3">
          {greeting(hour)}
        </Text>

        <View className="flex-row gap-2 justify-center flex-wrap mb-4">
          <View className="py-1 px-3 rounded-full" style={{ backgroundColor: 'rgba(129,178,154,0.15)' }}>
            <Text className="text-sm font-bold" style={{ color: '#81B29A' }}>
              💪 Gym {gymThisWeek}/3
            </Text>
          </View>
          <View className="py-1 px-3 rounded-full" style={{ backgroundColor: 'rgba(0,187,249,0.1)' }}>
            <Text className="text-sm font-bold" style={{ color: '#00BBF9' }}>
              ✅ {habitsToday}/{habitsTotal}
            </Text>
          </View>
        </View>

        <Card className="mb-3">
          <Text className="text-xs font-bold mb-2" style={{ color: '#E07A5F' }}>
            🎹 OREILLE ABSOLUE
          </Text>
          <Text className="text-base text-ink dark:text-d-ink mb-2">
            {todayCount >= target ? '✓ Fait aujourd\'hui' : `${todayCount}/${target} aujourd'hui`}
          </Text>
          <Link href="/oreille" asChild>
            <Pressable className="py-2.5 rounded-xl bg-navy">
              <Text className="text-sm font-semibold text-white text-center">▶ Démarrer</Text>
            </Pressable>
          </Link>
        </Card>

        <Card className="mb-3">
          <Text className="text-xs font-bold mb-2" style={{ color: '#E07A5F' }}>
            🌙 RÊVE LUCIDE
          </Text>
          <Text className="text-sm text-ink-muted dark:text-d-ink-muted leading-5 mb-2">
            Reality checks, journal de rêves et programme 6 semaines basé sur Aspy 2017 + LaBerge.
          </Text>
          <Link href="/reve-lucide" asChild>
            <Pressable className="py-2.5 rounded-xl bg-navy">
              <Text className="text-sm font-semibold text-white text-center">Ouvrir</Text>
            </Pressable>
          </Link>
        </Card>

        <Card className="mb-3">
          <Text className="text-xs font-bold mb-2" style={{ color: '#E07A5F' }}>
            🔔 RAPPELS
          </Text>
          <Text className="text-sm text-ink-muted dark:text-d-ink-muted leading-5 mb-2">
            Notifications natives iOS qui sonnent même app fermée. Configure les horaires pour pitch, reality checks, journal du matin.
          </Text>
          <Link href="/rappels" asChild>
            <Pressable className="py-2.5 rounded-xl border border-line dark:border-d-line">
              <Text className="text-sm font-semibold text-ink dark:text-d-ink text-center">
                Configurer
              </Text>
            </Pressable>
          </Link>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
