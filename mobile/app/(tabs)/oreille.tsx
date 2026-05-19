import * as Haptics from 'expo-haptics';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Card from '../../components/Card';
import {
  NOTES_AROUND_A4,
  ecartLabel,
  noteFromSemitone,
  playA440,
  playPianoNote,
} from '../../lib/audio';
import { usePitch } from '../../hooks/usePitch';

const SAGE = '#81B29A';
const SAND = '#F2CC8F';
const CORAL = '#E07A5F';
const DEEP = '#c0392b';

function ecartColor(ecart: number) {
  const abs = Math.abs(ecart);
  if (abs === 0) return SAGE;
  if (abs <= 1) return SAND;
  if (abs <= 2) return CORAL;
  return DEEP;
}

export default function OreilleScreen() {
  const { todayCount, validatedToday, target, done, recordSession, todayHistory } = usePitch();
  const [phase, setPhase] = useState<'idle' | 'imagine' | 'compare'>('idle');
  const [picked, setPicked] = useState<number | null>(null);
  const [flash, setFlash] = useState<{ result: string; ecart: number } | null>(null);

  const startSession = () => {
    setPicked(null);
    setPhase('imagine');
  };

  const reveal = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await playA440();
    setPhase('compare');
  };

  const replay = async () => {
    await playA440();
  };

  const validateJust = () => {
    recordSession({ result: 'validated', ecart: 0 });
    setFlash({ result: 'validated', ecart: 0 });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setPhase('idle');
    setPicked(null);
    setTimeout(() => setFlash(null), 2200);
  };

  const pickNote = async (offset: number) => {
    setPicked(offset);
    await playPianoNote(noteFromSemitone(offset), 1.5);
  };

  const confirmOff = () => {
    if (picked === null) return;
    if (picked === 0) {
      validateJust();
    } else {
      recordSession({ result: 'off', ecart: picked, guess: picked });
      setFlash({ result: 'off', ecart: picked });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      setPhase('idle');
      setPicked(null);
      setTimeout(() => setFlash(null), 2200);
    }
  };

  const cancel = () => {
    setPicked(null);
    setPhase('idle');
  };

  const dots = Array.from({ length: target }, (_, i) => {
    if (i >= todayHistory.length) return '#E5E7EB';
    return ecartColor(todayHistory[i].ecart ?? 99);
  });

  return (
    <SafeAreaView className="flex-1 bg-cream dark:bg-d-cream">
      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 24 }}>
        <Text className="text-2xl font-bold text-ink dark:text-d-ink mt-4 mb-4">
          🎹 Oreille absolue — LA 440
        </Text>

        <Card>
          <View className="flex-row items-center justify-between mb-2">
            <Text className="text-sm font-bold" style={{ color: CORAL }}>
              {done ? '✓ Fait pour aujourd\'hui' : 'Entraîne-toi 3× par jour'}
            </Text>
            <View className="flex-row gap-1">
              {dots.map((c, i) => (
                <View key={i} className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c }} />
              ))}
            </View>
          </View>
          <Text className="text-sm text-ink-muted dark:text-d-ink-muted mb-3 leading-5">
            {done
              ? `${validatedToday}/${todayCount} justes.`
              : `${todayCount}/${target} aujourd'hui · ${validatedToday} justes.`}
          </Text>

          {flash && phase === 'idle' && (
            <View
              className="py-2 px-3 rounded-xl mb-2"
              style={{ backgroundColor: `${ecartColor(flash.ecart)}22` }}
            >
              <Text
                className="text-sm text-center font-semibold"
                style={{ color: ecartColor(flash.ecart) }}
              >
                {flash.result === 'validated'
                  ? '✓ Juste ! Ancré.'
                  : `Écart : ${ecartLabel(flash.ecart)} ${flash.ecart > 0 ? 'au-dessus' : 'en dessous'}`}
              </Text>
            </View>
          )}

          {phase === 'idle' && (
            <Pressable onPress={startSession} className="py-3 rounded-xl bg-navy">
              <Text className="text-base font-semibold text-white text-center">
                ▶ Démarrer une session
              </Text>
            </Pressable>
          )}

          {phase === 'imagine' && (
            <View>
              <View className="py-4 px-3 rounded-xl bg-surface-2 dark:bg-d-surface-2 mb-2">
                <Text className="text-base text-ink dark:text-d-ink text-center">
                  Ferme les yeux. Imagine le <Text style={{ fontWeight: 'bold' }}>LA 440</Text>.
                </Text>
                <Text className="text-base text-ink dark:text-d-ink text-center mt-1">
                  Chante-le, hum-le.
                </Text>
              </View>
              <View className="flex-row gap-2">
                <Pressable onPress={reveal} className="flex-1 py-3 rounded-xl" style={{ backgroundColor: CORAL }}>
                  <Text className="text-base font-semibold text-white text-center">
                    🎹 Jouer le LA
                  </Text>
                </Pressable>
                <Pressable
                  onPress={cancel}
                  className="px-4 py-3 rounded-xl border border-line dark:border-d-line"
                >
                  <Text className="text-sm text-ink-muted dark:text-d-ink-muted">Annuler</Text>
                </Pressable>
              </View>
            </View>
          )}

          {phase === 'compare' && (
            <View>
              <View className="py-3 px-3 rounded-xl bg-surface-2 dark:bg-d-surface-2 mb-2">
                <Text className="text-sm text-ink dark:text-d-ink text-center leading-5">
                  Tu avais juste ? Sinon clique la note que tu pensais avoir.
                </Text>
              </View>
              <View className="flex-row gap-2 mb-2">
                <Pressable onPress={replay} className="flex-1 py-2 rounded-xl border" style={{ borderColor: CORAL }}>
                  <Text className="text-sm font-semibold text-center" style={{ color: CORAL }}>
                    🔁 Rejouer
                  </Text>
                </Pressable>
                <Pressable onPress={validateJust} className="flex-1 py-2 rounded-xl" style={{ backgroundColor: SAGE }}>
                  <Text className="text-sm font-semibold text-white text-center">
                    ✓ Juste !
                  </Text>
                </Pressable>
              </View>
              <View className="flex-row gap-0.5 mb-2">
                {NOTES_AROUND_A4.map((n) => {
                  const isTarget = n.target;
                  const isPicked = picked === n.offset;
                  return (
                    <Pressable
                      key={n.offset}
                      onPress={() => pickNote(n.offset)}
                      className={`flex-1 py-2 rounded-lg items-center ${n.sharp ? 'bg-navy' : 'bg-surface-2 dark:bg-d-surface-2'}`}
                      style={{
                        borderWidth: isPicked ? 2 : isTarget ? 2 : 0,
                        borderColor: isPicked ? CORAL : isTarget ? SAGE : undefined,
                        transform: [{ scale: isPicked ? 0.95 : 1 }],
                      }}
                    >
                      <Text
                        className="text-[10px] font-bold"
                        style={{ color: n.sharp ? 'white' : '#3D405B' }}
                      >
                        {n.short}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
              {picked !== null && (
                <View className="flex-row items-center gap-2">
                  <View
                    className="flex-1 py-2 rounded-xl"
                    style={{ backgroundColor: `${ecartColor(picked)}22` }}
                  >
                    <Text
                      className="text-sm text-center font-semibold"
                      style={{ color: ecartColor(picked) }}
                    >
                      {picked === 0
                        ? "C'est le LA. Bien joué."
                        : `Écart : ${ecartLabel(picked)} ${picked > 0 ? 'au-dessus' : 'en dessous'}`}
                    </Text>
                  </View>
                  <Pressable onPress={confirmOff} className="px-4 py-2 rounded-xl bg-navy">
                    <Text className="text-sm font-semibold text-white">Enregistrer</Text>
                  </Pressable>
                </View>
              )}
              <Pressable onPress={cancel} className="mt-2">
                <Text className="text-xs text-ink-soft dark:text-d-ink-soft text-center underline">
                  Annuler la session
                </Text>
              </Pressable>
            </View>
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}
