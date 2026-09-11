/** Local calendar day of year, so the thought changes at midnight in the person's timezone. */
export function dailyIndex(length: number, now = new Date()) {
  if (length <= 0) return 0;
  const day = Math.round(
    (Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) -
      Date.UTC(now.getFullYear(), 0, 1)) /
      86_400_000,
  );
  return ((day % length) + length) % length;
}
