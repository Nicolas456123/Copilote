import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/Card';

export default function AccueilScreen() {
  const hour = new Date().getHours();
  const greeting =
    hour < 5 || hour > 22 ? 'Tu devrais dormir 😴' : hour < 12 ? 'Bonjour Nicolas ☀️' : hour < 18 ? 'Bel après-midi 🌤️' : 'Bonsoir 🌙';

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-2xl font-bold text-ink text-center mt-4 mb-3">{greeting}</Text>

        <Card className="mb-3">
          <Text className="text-xs font-bold text-coral mb-2">✨ COPILOTE — NATIF</Text>
          <Text className="text-base text-ink leading-6">
            Bienvenue dans la version iOS native. Les rappels sont maintenant gérés par
            iOS lui-même — ils sonnent même quand l'app est complètement fermée.
          </Text>
        </Card>

        <Card className="mb-3">
          <Text className="text-xs font-bold text-coral mb-2">🔔 RAPPELS</Text>
          <Text className="text-sm text-ink-muted leading-5">
            Va dans l'onglet Rappels pour activer les notifications. Une fois autorisées,
            les rappels seront programmés nativement et fiables même app fermée.
          </Text>
        </Card>

        <Card className="mb-3">
          <Text className="text-xs font-bold text-coral mb-2">🌙 RÊVE LUCIDE</Text>
          <Text className="text-sm text-ink-muted leading-5">
            Reality checks et journal de rêves dans l'onglet dédié.
          </Text>
        </Card>

        <View className="items-center mt-6">
          <Text className="text-xs text-ink-soft text-center">
            Version 0.1 — scaffold natif. Plus de features à venir.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
