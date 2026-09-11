import { scriptLabels, validSavedChoices } from "./saved-choices";
import { validHistory } from "./history";
import { choices, defaults, type SavedPractice } from "./types";
const KEY = "within.practice.v1";
export function readPractice(): SavedPractice {
  const fallback = { settings: defaults, session: null };
  const raw = localStorage.getItem(KEY);
  if (!raw) return fallback;
  try {
    const data = JSON.parse(raw);
    const s = data.settings;
    if (
      !s ||
      !["en", "hi"].includes(s.language) ||
      !["naam", "mantra"].includes(s.kind) ||
      !["count", "breath", "time"].includes(s.mode) ||
      typeof s.custom !== "string" ||
      s.custom.length > 200 ||
      ![0, 11, 27, 54, 108].includes(s.target) ||
      ![1, 5, 10, 15, 30].includes(s.minutes) ||
      ![3, 4, 5, 6].includes(s.breathSeconds)
    )
      return fallback;
    if (
      s.selection !== "custom" &&
      !choices[s.kind as keyof typeof choices].some(
        (item) => item.id === s.selection,
      )
    )
      return fallback;
    s.sound = s.sound === true;
    const labels = scriptLabels(s.customHindi, s.customEnglish);
    delete s.customHindi;
    delete s.customEnglish;
    if (labels.hindi) s.customHindi = labels.hindi;
    if (labels.english) s.customEnglish = labels.english;
    const history =
      data.history === undefined ? {} : { history: validHistory(data.history) };
    const savedChoices =
      data.savedChoices === undefined
        ? {}
        : { savedChoices: validSavedChoices(data.savedChoices) };
    const session = data.session;
    if (session) {
      if (typeof session.id !== "string") delete session.id;
      if (
        typeof session.startedAt !== "string" ||
        !Number.isFinite(Date.parse(session.startedAt))
      )
        delete session.startedAt;
      if (
        typeof session.completedAt !== "string" ||
        !Number.isFinite(Date.parse(session.completedAt))
      )
        delete session.completedAt;
    }
    if (
      session &&
      (!Number.isSafeInteger(session.count) ||
        session.count < 0 ||
        !Number.isFinite(session.elapsed) ||
        session.elapsed < 0 ||
        typeof session.completed !== "boolean")
    )
      return { settings: s, session: null, ...history, ...savedChoices };
    return {
      settings: s,
      session: session ?? null,
      ...history,
      ...savedChoices,
    };
  } catch {
    return fallback;
  }
}
export function writePractice(data: SavedPractice) {
  localStorage.setItem(KEY, JSON.stringify(data));
}
