import { collectSavedChoices, removeCustomChoice, replaceCustomChoice, saveCustomChoice } from "../lib/saved-choices";
import { useCallback, useEffect, useRef, useState } from "react";
import { readPractice, writePractice } from "../lib/storage";
import { discardSession as clearSession, recordSession } from "../lib/history";
import { setWakeLock } from "../lib/wake-lock";
import {
  defaults,
  type SavedChoice,
  type SavedPractice,
  type Session,
  type Settings,
} from "../lib/types";
export function usePracticeStore() {
  const [data, setData] = useState<SavedPractice>({
    settings: defaults,
    session: null,
  });
  const latest = useRef(data);
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  const [autoStart, setAutoStart] = useState(false);
  const [editing, setEditing] = useState<SavedChoice | null>(null);
  useEffect(() => {
    try {
      const restored = readPractice();
      restored.savedChoices = collectSavedChoices(restored);
      // Old unfinished sessions gain an identity without inventing past completion dates.
      if (
        restored.session &&
        !restored.session.completed &&
        !restored.session.id
      )
        restored.session.id = crypto.randomUUID();
      latest.current = restored;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronize browser storage after hydration
      setData(restored);
    } catch {
      setStorageError(true);
    }
    setReady(true);
  }, []);
  const persist = useCallback((next: SavedPractice, render = true) => {
    latest.current = next;
    try {
      writePractice(next);
    } catch {
      setStorageError(true);
    }
    if (render) setData(next);
  }, []);
  const updateSettings = (settings: Settings) =>
    persist({ ...latest.current, settings });
  const saveSession = useCallback(
    (session: Session) => {
      const current = latest.current.session;
      if (!current || (current.id && session.id && current.id !== session.id))
        return;
      persist(recordSession(latest.current, session), session.completed);
    },
    [persist],
  );
  const discardSession = () => {
    setAutoStart(false);
    setWakeLock(false);
    persist(clearSession(latest.current));
  };
  const start = () => {
    setWakeLock(true);
    const session = {
      id: crypto.randomUUID(),
      startedAt: new Date().toISOString(),
      count: 0,
      elapsed: 0,
      completed: false,
    };
    persist({ ...saveCustomChoice(latest.current), session });
    setAutoStart(true);
  };
  const saveChoice = () => persist(saveCustomChoice(latest.current));
  const removeChoice = (choice: SavedChoice) =>
    persist(removeCustomChoice(latest.current, choice));
  const replaceChoice = (previous: SavedChoice, settings: Settings) =>
    persist(replaceCustomChoice(latest.current, previous, settings));
  const consumeAutoStart = useCallback(() => setAutoStart(false), []);
  const snapshot = useCallback(() => latest.current, []);
  return {
    data,
    ready,
    storageError,
    autoStart,
    editing,
    consumeAutoStart,
    snapshot,
    updateSettings,
    saveSession,
    discardSession,
    start,
    saveChoice,
    removeChoice,
    replaceChoice,
    setEditing,
  };
}
