let sharedCtx = null;

function getCtx() {
  if (!sharedCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    sharedCtx = new Ctx();
  }
  if (sharedCtx.state === "suspended") sharedCtx.resume();
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

export function playPianoNote(frequency = 440, durationSec = 2.2) {
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime;
  const peak = 0.35;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(peak, now + 0.008);
  master.gain.exponentialRampToValueAtTime(peak * 0.5, now + 0.18);
  master.gain.exponentialRampToValueAtTime(0.0001, now + durationSec);

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(4500, now);
  filter.frequency.exponentialRampToValueAtTime(1200, now + durationSec);
  filter.Q.value = 0.6;

  master.connect(filter);
  filter.connect(ctx.destination);

  PIANO_HARMONICS.forEach(({ mult, gain }) => {
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = frequency * mult;
    g.gain.value = gain;
    osc.connect(g);
    g.connect(master);
    osc.start(now);
    osc.stop(now + durationSec + 0.05);
  });
}

export function playA440() {
  playPianoNote(440, 2.2);
}
