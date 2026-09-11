export const MALA = 108;
export function malaSize(target: number) {
  return target > 0 ? target : MALA;
}
export function malaBeads(count: number, size = MALA) {
  if (count <= 0) return 0;
  const rest = count % size;
  return rest === 0 ? size : rest;
}
export function malasCompleted(count: number, size = MALA) {
  return Math.floor(Math.max(0, count) / size);
}
export function malaCaption(
  count: number,
  target: number,
  t: { mala: string; malas: string },
) {
  if (target > 0 && target !== MALA) return null;
  const done = malasCompleted(count);
  if (target === MALA) return t.mala;
  if (done <= 0) return t.mala;
  return `${done} ${done === 1 ? t.mala : t.malas}`;
}
