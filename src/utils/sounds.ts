/**
 * sounds.ts — Micro-interactions audio using Web Audio API
 */

let audioCtx: AudioContext | null = null;
let masterGain: GainNode | null = null;

function initAudio() {
  if (typeof window === 'undefined') return;
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.value = 0.15; // Global volume
    masterGain.connect(audioCtx.destination);
  }
  if (audioCtx.state === 'suspended') audioCtx.resume();
}

/** Soft "Pop" for primary actions (Copy, Star) */
export function playPop() {
  if (typeof window === 'undefined') return;
  initAudio();
  if (!audioCtx || !masterGain) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(masterGain);

  osc.type = 'sine';
  
  const now = audioCtx.currentTime;
  
  // Frequency drop for the "pop" feel
  osc.frequency.setValueAtTime(600, now);
  osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);

  // Volume envelope
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(1, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

  osc.start(now);
  osc.stop(now + 0.1);
}

/** Subtle "Tick" for secondary actions (Settings toggle, Theme change) */
export function playTick() {
  if (typeof window === 'undefined') return;
  initAudio();
  if (!audioCtx || !masterGain) return;

  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.connect(gain);
  gain.connect(masterGain);

  osc.type = 'triangle';
  
  const now = audioCtx.currentTime;
  
  osc.frequency.setValueAtTime(800, now);
  
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.5, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

  osc.start(now);
  osc.stop(now + 0.05);
}
