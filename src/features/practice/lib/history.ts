import { counted, formatDuration } from "./format";
import {
  selectedText,
  type HistoryEntry,
  type Language,
  type SavedPractice,
  type Session,
} from "./types";
import { scriptLabels } from "./saved-choices";
export function recordSession(
  saved: SavedPractice,
  session: Session,
  now = new Date(),
): SavedPractice {
  const history = saved.history ?? [];
  if (
    !session.completed ||
    !session.id ||
    history.some((entry) => entry.id === session.id)
  )
    return { ...saved, session };
  const finishedAt = session.completedAt ?? now.toISOString();
  const entry: HistoryEntry = {
    id: session.id,
    kind: saved.settings.kind,
    finishedAt,
    text: saved.settings.selection === "custom"
      ? saved.settings.custom.trim()
      : selectedText(saved.settings),
    ...(saved.settings.selection === "custom"
      ? scriptLabels(saved.settings.customHindi, saved.settings.customEnglish)
      : {}),
    mode: saved.settings.mode,
    count: session.count,
    elapsed: session.elapsed,
    cycles: Math.floor(session.elapsed / (saved.settings.breathSeconds * 2)),
  };
  return {
    ...saved,
    session: { ...session, completedAt: finishedAt },
    history: [entry, ...history],
  };
}
export function discardSession(saved: SavedPractice): SavedPractice {
  return { ...saved, session: null };
}
export function validHistory(value: unknown): HistoryEntry[] {
  if (!Array.isArray(value)) return [];
  return value.filter((entry): entry is HistoryEntry =>
    Boolean(
      entry &&
      typeof entry.id === "string" &&
      (entry.kind === undefined ||
        entry.kind === "naam" ||
        entry.kind === "mantra") &&
      typeof entry.text === "string" &&
      entry.text.length <= 200 &&
      typeof entry.finishedAt === "string" &&
      Number.isFinite(Date.parse(entry.finishedAt)) &&
      ["count", "breath", "time"].includes(entry.mode) &&
      Number.isSafeInteger(entry.count) &&
      entry.count >= 0 &&
      Number.isSafeInteger(entry.cycles) &&
      entry.cycles >= 0 &&
      Number.isFinite(entry.elapsed) &&
      entry.elapsed >= 0,
    ),
  ).map(({ hindi, english, ...entry }) => ({
    ...entry,
    ...scriptLabels(hindi, english),
  }));
}
/** Calendar-day comparison avoids DST and midnight errors from dividing timestamps. */
export function dateGroup(
  date: string,
  now = new Date(),
): "today" | "yesterday" | "earlier" {
  const day = new Date(date).toDateString();
  if (day === now.toDateString()) return "today";
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  return day === yesterday.toDateString() ? "yesterday" : "earlier";
}
function startOfWeek(now: Date) {
  const weekday = now.getDay();
  const mondayOffset = weekday === 0 ? 6 : weekday - 1;
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - mondayOffset);
}
function sitFigure(
  entry: HistoryEntry,
  t: { second: string; seconds: string; minute: string; minutes: string },
) {
  if (entry.mode === "time") return formatDuration(entry.elapsed, t);
  if (entry.mode === "breath") return String(entry.cycles);
  if (entry.count > 0) return String(entry.count);
  return formatDuration(entry.elapsed, t);
}
function sitWhen(
  entry: HistoryEntry,
  language: Language,
  now: Date,
  t: { today: string; yesterday: string },
) {
  const group = dateGroup(entry.finishedAt, now);
  if (group !== "earlier") return t[group];
  return new Intl.DateTimeFormat(language === "hi" ? "hi-IN" : "en-IN", {
    day: "numeric",
    month: "short",
  }).format(new Date(entry.finishedAt));
}
export function lastSitWhisper(
  entries: HistoryEntry[],
  t: {
    today: string;
    yesterday: string;
    thisWeek: string;
    sit: string;
    sits: string;
    satToday: string;
    satYesterday: string;
    second: string;
    seconds: string;
    minute: string;
    minutes: string;
  },
  language: Language,
  now = new Date(),
  current?: { name: string; mode: string; target: number },
) {
  if (entries.length === 0) return null;
  const last = [...entries].sort(
    (a, b) => Date.parse(b.finishedAt) - Date.parse(a.finishedAt),
  )[0];
  const recent = dateGroup(last.finishedAt, now);
  const figure = sitFigure(last, t);
  const sameName = Boolean(current && last.text === current.name);
  if (recent === "today" || recent === "yesterday") {
    if (!sameName) return `${t[recent]} · ${last.text} · ${figure}`;
    const sat = recent === "today" ? t.satToday : t.satYesterday;
    const sameCount =
      current &&
      last.mode === "count" &&
      current.mode === "count" &&
      current.target > 0 &&
      last.count === current.target;
    if (sameCount || last.mode !== "count") return sat;
    return `${sat} · ${figure}`;
  }
  const weekStart = startOfWeek(now).getTime();
  const sitsThisWeek = entries.filter(
    (entry) => Date.parse(entry.finishedAt) >= weekStart,
  ).length;
  if (sitsThisWeek > 1)
    return `${t.thisWeek} · ${counted(sitsThisWeek, t.sit, t.sits)}`;
  if (sameName) return `${sitWhen(last, language, now, t)} · ${figure}`;
  return `${sitWhen(last, language, now, t)} · ${last.text} · ${figure}`;
}
