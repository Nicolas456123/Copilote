import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/Card';
import { storage } from '../../lib/storage';

const TIPS = [
  'Regarde tes mains : nombre étrange de doigts ?',
  'Essaie de respirer en pinçant ton nez. Tu peux ? Tu rêves.',
  'Lis un texte, regarde ailleurs, relis : les lettres changent ?',
  'Pousse ton doigt contre ta paume : passe-t-il à travers ?',
  'Saute légèrement : retombes-tu lentement ?',
];

type Check = { timestamp: string; wasDreaming: boolean };
type Dream = { id: string; date: string; text: string; lucid: boolean };

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export default function ReveLucideScreen() {
  const [checks, setChecks] = useState<Check[]>([]);
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [tip, setTip] = useState(TIPS[0]);
  const [phase, setPhase] = useState<'idle' | 'check' | 'dream'>('idle');
  const [dreamText, setDreamText] = useState('');
  const [dreamLucid, setDreamLucid] = useState(false);

  useEffect(() => {
    (async () => {
      setChecks((await storage.get<Check[]>('lucidRealityChecks')) || []);
      setDreams((await storage.get<Dream[]>('lucidDreams')) || []);
    })();
  }, []);

  const today = todayKey();
  const checksToday = checks.filter((c) => c.timestamp.startsWith(today)).length;
  const dreamsToday = dreams.filter((d) => d.date === today);

  const startCheck = () => {
    setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
    setPhase('check');
  };

  const finishCheck = async (wasDreaming: boolean) => {
    const next = [...checks, { timestamp: new Date().toISOString(), wasDreaming }];
    setChecks(next);
    await storage.set('lucidRealityChecks', next);
    setPhase('idle');
  };

  const submitDream = async () => {
    if (!dreamText.trim()) return;
    const entry: Dream = {
      id: Date.now().toString(),
      date: todayKey(),
      text: dreamText.trim(),
      lucid: dreamLucid,
    };
    const next = [...dreams, entry];
    setDreams(next);
    await storage.set('lucidDreams', next);
    setDreamText('');
    setDreamLucid(false);
    setPhase('idle');
  };

  return (
    <SafeAreaView className="flex-1 bg-cream">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-2xl font-bold text-ink mt-4 mb-4">🌙 Rêve lucide</Text>

        <Card className="mb-3">
          <Text className="text-xs font-bold text-coral mb-2">RÉALITY CHECKS</Text>
          <Text className="text-sm text-ink-muted mb-3">
            <Text className="font-bold text-ink">{checksToday}</Text> faits aujourd'hui · cible 5+
          </Text>

          {phase === 'idle' && (
            <View>
              <Pressable onPress={startCheck} className="py-3 rounded-xl bg-navy mb-2">
                <Text className="text-base font-semibold text-white text-center">
                  ✋ Reality check
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setPhase('dream')}
                className="py-3 rounded-xl border border-coral"
              >
                <Text className="text-base font-semibold text-coral text-center">
                  📓 Noter un rêve
                </Text>
              </Pressable>
            </View>
          )}

          {phase === 'check' && (
            <View>
              <View className="py-3 px-3 rounded-xl bg-surface-2 mb-2">
                <Text className="text-base font-bold text-ink text-center mb-1">
                  Suis-je en train de rêver ?
                </Text>
                <Text className="text-sm text-ink-muted text-center">{tip}</Text>
              </View>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => finishCheck(false)}
                  className="flex-1 py-2.5 rounded-xl bg-sage"
                >
                  <Text className="text-sm font-semibold text-white text-center">😐 Éveillé</Text>
                </Pressable>
                <Pressable
                  onPress={() => finishCheck(true)}
                  className="flex-1 py-2.5 rounded-xl bg-coral"
                >
                  <Text className="text-sm font-semibold text-white text-center">✨ Je rêve !</Text>
                </Pressable>
              </View>
            </View>
          )}

          {phase === 'dream' && (
            <View>
              <TextInput
                value={dreamText}
                onChangeText={setDreamText}
                placeholder="Note rapidement ton rêve : lieux, personnes, indices bizarres…"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                className="px-3 py-2 rounded-xl border border-line bg-surface text-sm text-ink mb-2"
                style={{ minHeight: 90, textAlignVertical: 'top' }}
              />
              <Pressable
                onPress={() => setDreamLucid((v) => !v)}
                className="flex-row items-center gap-2 mb-2"
              >
                <View
                  className={`w-5 h-5 rounded border-2 items-center justify-center ${
                    dreamLucid ? 'bg-coral border-coral' : 'border-line'
                  }`}
                >
                  {dreamLucid && <Text className="text-white text-xs">✓</Text>}
                </View>
                <Text className="text-sm text-ink">✨ J'étais lucide pendant ce rêve</Text>
              </Pressable>
              <View className="flex-row gap-2">
                <Pressable
                  onPress={() => {
                    setPhase('idle');
                    setDreamText('');
                    setDreamLucid(false);
                  }}
                  className="px-4 py-2 rounded-xl border border-line"
                >
                  <Text className="text-sm text-ink-muted">Annuler</Text>
                </Pressable>
                <Pressable
                  onPress={submitDream}
                  className="flex-1 py-2 rounded-xl bg-navy"
                  disabled={!dreamText.trim()}
                  style={{ opacity: dreamText.trim() ? 1 : 0.4 }}
                >
                  <Text className="text-sm font-semibold text-white text-center">Enregistrer</Text>
                </Pressable>
              </View>
            </View>
          )}
        </Card>

        {dreamsToday.length > 0 && (
          <Card className="mb-3">
            <Text className="text-xs font-bold text-coral mb-2">AUJOURD'HUI</Text>
            {dreamsToday.map((d) => (
              <View key={d.id} className="py-1">
                <Text className="text-sm text-ink leading-5">
                  {d.lucid && <Text className="text-coral">✨ </Text>}
                  {d.text}
                </Text>
              </View>
            ))}
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
