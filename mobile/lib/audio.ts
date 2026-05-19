import { Audio } from 'expo-av';

const SAMPLE_RATE = 44100;
const HARMONICS: Array<{ mult: number; gain: number }> = [
  { mult: 1, gain: 1.0 },
  { mult: 2, gain: 0.55 },
  { mult: 3, gain: 0.22 },
  { mult: 4, gain: 0.16 },
  { mult: 5, gain: 0.10 },
  { mult: 6, gain: 0.06 },
  { mult: 7, gain: 0.04 },
];
const HARMONIC_SUM = HARMONICS.reduce((s, h) => s + h.gain, 0);

function uint8ToBase64(bytes: Uint8Array): string {
  const chunks: string[] = [];
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    chunks.push(String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + CHUNK))));
  }
  // eslint-disable-next-line no-undef
  if (typeof btoa === 'function') return btoa(chunks.join(''));
  // RN fallback
  // @ts-expect-error global Buffer in RN polyfill if present
  return Buffer.from(chunks.join(''), 'binary').toString('base64');
}

function buildPianoWav(frequencyHz: number, durationSec: number): string {
  const numSamples = Math.floor(SAMPLE_RATE * durationSec);
  const bytesPerSample = 2;
  const dataSize = numSamples * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  view.setUint8(0, 0x52); view.setUint8(1, 0x49); view.setUint8(2, 0x46); view.setUint8(3, 0x46); // RIFF
  view.setUint32(4, 36 + dataSize, true);
  view.setUint8(8, 0x57); view.setUint8(9, 0x41); view.setUint8(10, 0x56); view.setUint8(11, 0x45); // WAVE
  view.setUint8(12, 0x66); view.setUint8(13, 0x6d); view.setUint8(14, 0x74); view.setUint8(15, 0x20); // fmt
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  view.setUint8(36, 0x64); view.setUint8(37, 0x61); view.setUint8(38, 0x74); view.setUint8(39, 0x61); // data
  view.setUint32(40, dataSize, true);

  const attackSamples = Math.floor(SAMPLE_RATE * 0.012);
  const releaseStart = numSamples - Math.floor(SAMPLE_RATE * 0.25);
  const peak = 0.4 / HARMONIC_SUM;

  for (let i = 0; i < numSamples; i++) {
    const t = i / SAMPLE_RATE;
    let env: number;
    if (i < attackSamples) env = i / attackSamples;
    else if (i > releaseStart) env = Math.max(0, 1 - (i - releaseStart) / (numSamples - releaseStart));
    else env = Math.exp(-1.2 * (t - 0.012));

    let sample = 0;
    for (const { mult, gain } of HARMONICS) {
      sample += Math.sin(2 * Math.PI * frequencyHz * mult * t) * gain;
    }
    sample *= env * peak;
    const intSample = Math.max(-32768, Math.min(32767, Math.floor(sample * 32767)));
    view.setInt16(44 + i * 2, intSample, true);
  }

  return 'data:audio/wav;base64,' + uint8ToBase64(new Uint8Array(buffer));
}

let cachedSounds: Record<string, Audio.Sound> = {};
let audioModeSet = false;

async function ensureAudioMode() {
  if (audioModeSet) return;
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: true,
    staysActiveInBackground: false,
    shouldDuckAndroid: true,
  });
  audioModeSet = true;
}

export async function playPianoNote(frequencyHz = 440, durationSec = 2.2) {
  await ensureAudioMode();
  const key = `${frequencyHz}-${durationSec}`;
  if (!cachedSounds[key]) {
    const uri = buildPianoWav(frequencyHz, durationSec);
    const { sound } = await Audio.Sound.createAsync({ uri }, { shouldPlay: false });
    cachedSounds[key] = sound;
  }
  const sound = cachedSounds[key];
  try {
    await sound.setPositionAsync(0);
    await sound.playAsync();
  } catch {
    try { await sound.unloadAsync(); } catch { /* noop */ }
    delete cachedSounds[key];
    const uri = buildPianoWav(frequencyHz, durationSec);
    const { sound: fresh } = await Audio.Sound.createAsync({ uri }, { shouldPlay: true });
    cachedSounds[key] = fresh;
  }
}

export async function playA440() {
  return playPianoNote(440, 2.2);
}

export function noteFromSemitone(offset: number): number {
  return 440 * Math.pow(2, offset / 12);
}

export const NOTES_AROUND_A4 = [
  { name: 'Fa',   short: 'F',  offset: -4, sharp: false },
  { name: 'Fa#',  short: 'F#', offset: -3, sharp: true },
  { name: 'Sol',  short: 'G',  offset: -2, sharp: false },
  { name: 'Sol#', short: 'G#', offset: -1, sharp: true },
  { name: 'La',   short: 'A',  offset:  0, sharp: false, target: true },
  { name: 'La#',  short: 'A#', offset:  1, sharp: true },
  { name: 'Si',   short: 'B',  offset:  2, sharp: false },
  { name: 'Do',   short: 'C',  offset:  3, sharp: false },
  { name: 'Do#',  short: 'C#', offset:  4, sharp: true },
  { name: 'Ré',   short: 'D',  offset:  5, sharp: false },
] as const;

export function ecartLabel(semitones: number): string {
  const abs = Math.abs(semitones);
  if (abs === 0) return 'Juste';
  if (abs === 1) return '1/2 ton';
  if (abs % 2 === 0) return `${abs / 2} ton${abs > 2 ? 's' : ''}`;
  return `${(abs / 2).toFixed(1)} tons`;
}
