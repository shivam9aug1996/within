import { useCallback, useEffect, useRef, useState } from "react";
import { advanceSession, countRepetition } from "../lib/session";
import type { Session, Settings } from "../lib/types";
export function useSession(
  settings: Settings,
  initial: Session,
  onSave: (session: Session) => void,
  autoStart: boolean,
) {
  const [session, setSession] = useState(initial);
  const [running, setRunning] = useState(autoStart);
  const current = useRef(initial);
  const start = useCallback(() => setRunning(true), []);
  const commit = useCallback(
    (next: Session) => {
      current.current = next;
      setSession(next);
      onSave(next);
    },
    [onSave],
  );
  useEffect(() => {
    if (!running || session.completed) return;
    let previous = performance.now();
    const interval = window.setInterval(() => {
      const now = performance.now();
      const seconds = (now - previous) / 1000;
      previous = now;
      commit(advanceSession(current.current, seconds, settings));
    }, 1000);
    const pauseWhenHidden = () => {
      if (document.hidden) setRunning(false);
    };
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", pauseWhenHidden);
    };
  }, [running, session.completed, settings, commit]);
  const count = useCallback(() => {
    if (!running || current.current.completed) return;
    commit(countRepetition(current.current, settings.target));
  }, [running, settings.target, commit]);
  const undo = () =>
    commit({
      ...current.current,
      count: Math.max(0, current.current.count - 1),
    });
  const finish = () => {
    setRunning(false);
    commit({ ...current.current, completed: true });
  };
  return {
    session,
    running,
    count,
    undo,
    finish,
    start,
    toggle: () => setRunning((value) => !value),
  };
}
