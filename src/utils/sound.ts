let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const AudioContextClass =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AudioContextClass) return null;
  if (!audioCtx) {
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playTone(
  frequency: number,
  duration = 0.25,
  type: OscillatorType = 'sine',
  gainLevel = 0.08,
  delay = 0,
  muted = false
) {
  if (muted) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const startTime = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(frequency, startTime);

  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(gainLevel, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

export function playCandleChime(muted = false) {
  playTone(523.25, 0.35, 'triangle', 0.07, 0, muted);
  playTone(659.25, 0.35, 'triangle', 0.07, 0.09, muted);
  playTone(783.99, 0.5, 'triangle', 0.08, 0.18, muted);
  playTone(1046.5, 0.65, 'sine', 0.06, 0.28, muted);
}

export function playBalloonPop(muted = false) {
  playTone(260, 0.08, 'sine', 0.12, 0, muted);
  playTone(640, 0.14, 'triangle', 0.07, 0.03, muted);
  playTone(920, 0.2, 'sine', 0.05, 0.07, muted);
}

export function playBowRelease(muted = false) {
  playTone(392, 0.18, 'triangle', 0.08, 0, muted);
  playTone(587.33, 0.35, 'sine', 0.07, 0.1, muted);
  playTone(783.99, 0.55, 'sine', 0.08, 0.2, muted);
}

export function playBirthdayMelody(muted = false) {
  const notes = [
    { f: 392, d: 0.22, t: 0 },
    { f: 392, d: 0.18, t: 0.25 },
    { f: 440, d: 0.36, t: 0.48 },
    { f: 392, d: 0.36, t: 0.88 },
    { f: 523.25, d: 0.36, t: 1.28 },
    { f: 493.88, d: 0.65, t: 1.68 },
  ];
  for (const n of notes) {
    playTone(n.f, n.d, 'triangle', 0.06, n.t, muted);
  }
}
