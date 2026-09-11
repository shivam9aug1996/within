let audio: AudioContext | null = null;
function context() {
  const Audio = window.AudioContext || window.webkitAudioContext;
  if (!Audio) return null;
  if (!audio) audio = new Audio();
  if (audio.state === "suspended") void audio.resume();
  return audio;
}
function partial(
  ctx: AudioContext,
  frequency: number,
  duration: number,
  volume: number,
  {
    type = "sine",
    attack = 0.008,
    slide = 0,
  }: { type?: OscillatorType; attack?: number; slide?: number } = {},
) {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency * (slide ? 1.025 : 1), now);
  if (slide) osc.frequency.exponentialRampToValueAtTime(frequency, now + 0.14);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(volume, now + attack);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.05);
}
function woodTick(ctx: AudioContext) {
  const now = ctx.currentTime;
  const seconds = 0.018;
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < data.length; i++)
    data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
  const noise = ctx.createBufferSource();
  noise.buffer = buffer;
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(380, now);
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.04, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + seconds);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  noise.start(now);
  noise.stop(now + seconds + 0.01);
}
export function playBead() {
  const ctx = context();
  if (!ctx) return;
  woodTick(ctx);
  partial(ctx, 240, 0.045, 0.032, { attack: 0.003 });
  partial(ctx, 96, 0.06, 0.018, { attack: 0.004 });
}
export function playBell() {
  const ctx = context();
  if (!ctx) return;
  const root = 247;
  partial(ctx, root, 2.4, 0.05, { slide: 1, attack: 0.006 });
  partial(ctx, root * 2.01, 1.6, 0.014, { attack: 0.01 });
  partial(ctx, root * 2.76, 1.2, 0.012, { attack: 0.012 });
  partial(ctx, root * 4.07, 0.55, 0.006, { attack: 0.008 });
  partial(ctx, 1480, 0.06, 0.007, { type: "sine", attack: 0.002 });
}
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}
