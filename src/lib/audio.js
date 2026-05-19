let sharedCtx = null;

function createCtx() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  return new Ctx();
}

async function getCtx() {
  if (!sharedCtx || sharedCtx.state === 'closed') {
    sharedCtx = createCtx();
    if (!sharedCtx) return null;
  }
  if (sharedCtx.state === 'suspended') {
    try {
      await sharedCtx.resume();
    } catch {
      try { await sharedCtx.close(); } catch { /* ignore */ }
      sharedCtx = createCtx();
      if (!sharedCtx) return null;
      try { await sharedCtx.resume(); } catch { /* ignore */ }
    }
  }
  return sharedCtx;
}

const PIANO_HARMONICS = [
  { mult: 1, gain: 1.0 },
  { mult: 2, gain: 0.55 },
  { mult: 3, gain: 0.22 },
  { mult: 4, gain: 0.16 },
  { mult: 5, gain: 0.10 },
  { mult: 6, gain: 0.06 },
  { mult: 7, gain: 0.04 },
];

export async function playPianoNote(frequency = 440, durationSec = 2.2) {
  const ctx = await getCtx();
  if (!ctx) return;

  const now = ctx.currentTime + 0.02;
  const peak = 0.35;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(peak, now + 0.012);
  master.gain.exponentialRampToValueAtTime(peak * 0.5, now + 0.18);
  master.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(4500, now);
  filter.frequency.exponentialRampToValueAtTime(1200, now + durationSec);
  filter.Q.value = 0.6;

  master.connect(filter);
  filter.connect(ctx.destination);

  PIANO_HARMONICS.forEach(({ mult, gain }) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.value = frequency * mult;
    g.gain.value = gain;
    osc.connect(g);
    g.connect(master);
    osc.start(now);
    osc.stop(now + durationSec + 0.05);
  });
}

export async function playA440() {
  return playPianoNote(440, 2.2);
}

export function noteFromSemitone(offsetFromA4) {
  return 440 * Math.pow(2, offsetFromA4 / 12);
}

export const NOTES_AROUND_A4 = [
  { name: 'Fa',  short: 'F',  offset: -4, sharp: false },
  { name: 'Fa#', short: 'F#', offset: -3, sharp: true  },
  { name: 'Sol', short: 'G',  offset: -2, sharp: false },
  { name: 'Sol#',short: 'G#', offset: -1, sharp: true  },
  { name: 'La',  short: 'A',  offset:  0, sharp: false, target: true },
  { name: 'La#', short: 'A#', offset:  1, sharp: true  },
  { name: 'Si',  short: 'B',  offset:  2, sharp: false },
  { name: 'Do',  short: 'C',  offset:  3, sharp: false },
  { name: 'Do#', short: 'C#', offset:  4, sharp: true  },
  { name: 'Ré',  short: 'D',  offset:  5, sharp: false },
];

export function ecartLabel(semitones) {
  const abs = Math.abs(semitones);
  if (abs === 0) return 'Juste';
  if (abs === 1) return '1/2 ton';
  if (abs % 2 === 0) return `${abs / 2} ton${abs > 2 ? 's' : ''}`;
  return `${(abs / 2).toFixed(1)} tons`;
}
