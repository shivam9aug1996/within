export function counted(n: number, singular: string, plural: string) {
  return `${n} ${n === 1 ? singular : plural}`;
}
export function formatDuration(
  seconds: number,
  t: { second: string; seconds: string; minute: string; minutes: string },
) {
  const total = Math.max(0, Math.floor(seconds));
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;
  const minuteLabel = `${minutes} ${minutes === 1 ? t.minute : t.minutes}`;
  const secondLabel = `${remainder} ${remainder === 1 ? t.second : t.seconds}`;
  if (minutes === 0) return secondLabel;
  if (remainder === 0) return minuteLabel;
  return `${minuteLabel} ${secondLabel}`;
}
