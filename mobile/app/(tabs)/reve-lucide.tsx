import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Linking, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/Card';
import { LUCID_PROGRAM } from '../../lib/lucidProgram';
import { storage } from '../../lib/storage';
import { useLucidTraining } from '../../hooks/useLucidTraining';

const TIPS = [
  'Regarde tes mains : nombre étrange de doigts ?',
  'Pince ton nez et essaie de respirer. Tu peux ? Tu rêves.',
  'Lis un texte, regarde ailleurs, relis : les lettres changent ?',
  'Pousse ton doigt contre ta paume : passe-t-il à travers ?',
  'Saute légèrement : retombes-tu lentement ?',
];

const SAGE = '#81B29A';
const CORAL = '#E07A5F';

type Check = { timestamp: string; wasDreaming: boolean };
type Dream = { id: string; date: string; text: string; lucid: boolean };

function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function Tabs({ value, onChange }: { value: 'practice' | 'program'; onChange: (v: 'practice' | 'program') => void }) {
  return (
    <View className="flex-row gap-1 p-1 rounded-xl bg-surface-2 dark:bg-d-surface-2 mb-3">
      {(['practice', 'program'] as const).map((v) => (
        <Pressable
          key={v}
          onPress={() => onChange(v)}
          className={`flex-1 py-2 rounded-lg ${value === v ? 'bg-surface dark:bg-d-surface' : ''}`}
        >
          <Text
            className={`text-sm font-semibold text-center ${
              value === v ? 'text-ink dark:text-d-ink' : 'text-ink-muted dark:text-d-ink-muted'
            }`}
          >
            {v === 'practice' ? '✋ Pratique' : '📖 Programme'}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

function Practice() {
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
    Haptics.selectionAsync();
    setTip(TIPS[Math.floor(Math.random() * TIPS.length)]);
    setPhase('check');
  };

  const finishCheck = async (wasDreaming: boolean) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    const next = [...checks, { timestamp: new Date().toISOString(), wasDreaming }];
    setChecks(next);
    await storage.set('lucidRealityChecks', next);
    setPhase('idle');
  };

  const submitDream = async () => {
    if (!dreamText.trim()) return;
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
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
    <>
      <Card className="mb-3">
        <Text className="text-xs font-bold mb-2" style={{ color: CORAL }}>
          RÉALITY CHECKS
        </Text>
        <Text className="text-sm text-ink-muted dark:text-d-ink-muted mb-3">
          <Text className="font-bold text-ink dark:text-d-ink">{checksToday}</Text> fait
          {checksToday > 1 ? 's' : ''} aujourd'hui · cible 5+
        </Text>

        {phase === 'idle' && (
          <View>
            <Pressable onPress={startCheck} className="py-3 rounded-xl bg-navy mb-2">
              <Text className="text-base font-semibold text-white text-center">✋ Reality check</Text>
            </Pressable>
            <Pressable
              onPress={() => setPhase('dream')}
              className="py-3 rounded-xl border"
              style={{ borderColor: CORAL }}
            >
              <Text className="text-base font-semibold text-center" style={{ color: CORAL }}>
                📓 Noter un rêve
              </Text>
            </Pressable>
          </View>
        )}

        {phase === 'check' && (
          <View>
            <View className="py-3 px-3 rounded-xl bg-surface-2 dark:bg-d-surface-2 mb-2">
              <Text className="text-base font-bold text-ink dark:text-d-ink text-center mb-1">
                Suis-je en train de rêver ?
              </Text>
              <Text className="text-sm text-ink-muted dark:text-d-ink-muted text-center">
                {tip}
              </Text>
            </View>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => finishCheck(false)}
                className="flex-1 py-2.5 rounded-xl"
                style={{ backgroundColor: SAGE }}
              >
                <Text className="text-sm font-semibold text-white text-center">😐 Éveillé</Text>
              </Pressable>
              <Pressable
                onPress={() => finishCheck(true)}
                className="flex-1 py-2.5 rounded-xl"
                style={{ backgroundColor: CORAL }}
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
              className="px-3 py-2 rounded-xl border border-line dark:border-d-line bg-surface dark:bg-d-surface text-sm text-ink dark:text-d-ink mb-2"
              style={{ minHeight: 90, textAlignVertical: 'top' }}
            />
            <Pressable
              onPress={() => setDreamLucid((v) => !v)}
              className="flex-row items-center gap-2 mb-2"
            >
              <View
                className="w-5 h-5 rounded items-center justify-center"
                style={{
                  borderWidth: 2,
                  borderColor: dreamLucid ? CORAL : '#D1D5DB',
                  backgroundColor: dreamLucid ? CORAL : 'transparent',
                }}
              >
                {dreamLucid && <Text className="text-white text-xs">✓</Text>}
              </View>
              <Text className="text-sm text-ink dark:text-d-ink">
                ✨ J'étais lucide pendant ce rêve
              </Text>
            </Pressable>
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => {
                  setPhase('idle');
                  setDreamText('');
                  setDreamLucid(false);
                }}
                className="px-4 py-2 rounded-xl border border-line dark:border-d-line"
              >
                <Text className="text-sm text-ink-muted dark:text-d-ink-muted">Annuler</Text>
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
          <Text className="text-xs font-bold mb-2" style={{ color: CORAL }}>
            AUJOURD'HUI
          </Text>
          {dreamsToday.map((d) => (
            <View key={d.id} className="py-1">
              <Text className="text-sm text-ink dark:text-d-ink leading-5">
                {d.lucid && <Text style={{ color: CORAL }}>✨ </Text>}
                {d.text}
              </Text>
            </View>
          ))}
        </Card>
      )}
    </>
  );
}

function Program() {
  const { state, weekData, todayTasks, tasksDone, tasksTotal, toggleTask, start, setWeek } =
    useLucidTraining();
  const [openLesson, setOpenLesson] = useState(false);
  const [openSources, setOpenSources] = useState(false);

  if (!state.started) {
    return (
      <Card>
        <Text className="text-sm font-bold mb-2" style={{ color: CORAL }}>
          🌙 PROGRAMME — 6 SEMAINES
        </Text>
        <Text className="text-base text-ink dark:text-d-ink leading-6 mb-3">
          Parcours progressif basé sur la recherche (Aspy 2017, méthode LaBerge). Chaque
          semaine ajoute une technique, avec leçon et checklist quotidienne.
        </Text>
        <View className="mb-3">
          {LUCID_PROGRAM.map((w) => (
            <View key={w.week} className="flex-row gap-2 mb-1.5">
              <Text className="text-sm font-bold text-ink dark:text-d-ink w-8">S{w.week}</Text>
              <Text className="text-sm text-ink-muted dark:text-d-ink-muted flex-1">
                {w.title}
              </Text>
            </View>
          ))}
        </View>
        <Pressable onPress={start} className="py-3 rounded-xl" style={{ backgroundColor: CORAL }}>
          <Text className="text-base font-semibold text-white text-center">
            ▶ Commencer le programme
          </Text>
        </Pressable>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-3">
        <View className="flex-row items-center justify-between mb-2">
          <View>
            <Text className="text-xs font-bold" style={{ color: CORAL }}>
              SEMAINE {weekData.week}
            </Text>
            <Text className="text-base font-semibold text-ink dark:text-d-ink">
              {weekData.title}
            </Text>
          </View>
          <Text className="text-sm font-semibold text-ink-muted dark:text-d-ink-muted">
            {tasksDone}/{tasksTotal}
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
          <View className="flex-row gap-1">
            {LUCID_PROGRAM.map((w) => (
              <Pressable
                key={w.week}
                onPress={() => setWeek(w.week)}
                className={`px-3 py-1 rounded-lg ${
                  w.week === weekData.week ? 'bg-navy' : 'bg-surface-2 dark:bg-d-surface-2'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    w.week === weekData.week
                      ? 'text-white'
                      : 'text-ink-muted dark:text-d-ink-muted'
                  }`}
                >
                  S{w.week}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <Text className="text-sm italic text-ink-muted dark:text-d-ink-muted leading-5 mb-3">
          {weekData.focus}
        </Text>

        <Text className="text-xs font-bold mb-2" style={{ color: CORAL }}>
          AUJOURD'HUI
        </Text>
        {weekData.tasks.map((task) => {
          const done = !!todayTasks[task.id];
          return (
            <Pressable
              key={task.id}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                toggleTask(task.id);
              }}
              className="flex-row items-center gap-2 py-2 px-2.5 rounded-lg mb-1"
              style={{ backgroundColor: done ? 'rgba(129,178,154,0.1)' : undefined }}
            >
              <View
                className="w-5 h-5 rounded items-center justify-center"
                style={{
                  borderWidth: 1,
                  borderColor: done ? SAGE : '#D1D5DB',
                  backgroundColor: done ? SAGE : 'transparent',
                }}
              >
                {done && <Text className="text-white text-xs">✓</Text>}
              </View>
              <Text
                className={`flex-1 text-sm ${
                  done ? 'text-ink dark:text-d-ink' : 'text-ink-muted dark:text-d-ink-muted'
                }`}
              >
                {task.label}
              </Text>
            </Pressable>
          );
        })}

        <View className="mt-3 py-2 px-3 rounded-xl" style={{ backgroundColor: 'rgba(242,204,143,0.3)' }}>
          <Text className="text-sm text-ink dark:text-d-ink leading-5">
            💡 <Text className="font-bold">Astuce</Text> · {weekData.tip}
          </Text>
        </View>
      </Card>

      <Pressable
        onPress={() => setOpenLesson((o) => !o)}
        className="bg-surface dark:bg-d-surface rounded-xl p-3 mb-2 flex-row justify-between items-center"
      >
        <Text className="text-sm font-bold text-ink dark:text-d-ink">📖 Leçon complète</Text>
        <Text className="text-base text-ink-muted dark:text-d-ink-muted">
          {openLesson ? '▾' : '▸'}
        </Text>
      </Pressable>
      {openLesson && (
        <Card className="mb-2">
          <Text className="text-sm text-ink dark:text-d-ink leading-6">{weekData.lesson}</Text>
        </Card>
      )}

      <Pressable
        onPress={() => setOpenSources((o) => !o)}
        className="bg-surface dark:bg-d-surface rounded-xl p-3 mb-2 flex-row justify-between items-center"
      >
        <Text className="text-sm font-bold text-ink dark:text-d-ink">
          🔗 Sources ({weekData.sources.length})
        </Text>
        <Text className="text-base text-ink-muted dark:text-d-ink-muted">
          {openSources ? '▾' : '▸'}
        </Text>
      </Pressable>
      {openSources && (
        <Card className="mb-2">
          {weekData.sources.map((s) => (
            <Pressable key={s.url} onPress={() => Linking.openURL(s.url)} className="py-1.5">
              <Text className="text-sm underline" style={{ color: CORAL }}>
                → {s.label}
              </Text>
            </Pressable>
          ))}
        </Card>
      )}
    </>
  );
}

export default function ReveLucideScreen() {
  const [tab, setTab] = useState<'practice' | 'program'>('practice');

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-d-cream">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-2xl font-bold text-ink dark:text-d-ink mt-4 mb-3">
          🌙 Rêve lucide
        </Text>
        <Tabs value={tab} onChange={setTab} />
        {tab === 'practice' ? <Practice /> : <Program />}
      </ScrollView>
    </SafeAreaView>
  );
}
