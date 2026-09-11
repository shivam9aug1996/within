import type { Session, Settings } from "./types";
/** Elapsed time is supplied by a monotonic clock, never by counting ticks. */
export function advanceSession(
  session: Session,
  seconds: number,
  settings: Settings,
): Session {
  if (session.completed) return session;
  const elapsed = session.elapsed + Math.max(0, seconds);
  const completed =
    settings.mode === "time" && elapsed >= settings.minutes * 60;
  return {
    ...session,
    elapsed: completed ? settings.minutes * 60 : elapsed,
    completed,
  };
}
export function countRepetition(session: Session, target: number): Session {
  if (session.completed) return session;
  const count = session.count + 1;
  return { ...session, count, completed: target > 0 && count >= target };
}
