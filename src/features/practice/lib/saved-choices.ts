import {
  choices,
  type Kind,
  type SavedChoice,
  type SavedPractice,
  type Settings,
} from "./types";
export function normalizeText(text: string) {
  return text.normalize("NFC").trim().replace(/\s+/gu, " ").toLowerCase();
}
export function choiceKey(choice: SavedChoice) {
  return `${choice.kind}:${normalizeText(choice.text)}`;
}
export function scriptLabels(hindi: unknown, english: unknown) {
  const labels: Pick<SavedChoice, "hindi" | "english"> = {};
  if (typeof hindi === "string" && hindi.trim() && hindi.trim().length <= 200)
    labels.hindi = hindi.trim();
  if (typeof english === "string" && english.trim() && english.trim().length <= 200)
    labels.english = english.trim();
  return labels;
}
export function validSavedChoices(value: unknown): SavedChoice[] {
  if (!Array.isArray(value)) return [];
  const unique = new Map<string, SavedChoice>();
  for (const item of value) {
    if (
      !item ||
      !["naam", "mantra"].includes(item.kind) ||
      typeof item.text !== "string" ||
      !item.text.trim() ||
      item.text.length > 200
    )
      continue;
    const choice: SavedChoice = {
      kind: item.kind,
      text: item.text.trim(),
      ...scriptLabels(item.hindi, item.english),
    };
    if (
      !choices[choice.kind].some(
        (item) => normalizeText(item.text) === normalizeText(choice.text),
      )
    )
      unique.set(choiceKey(choice), { ...unique.get(choiceKey(choice)), ...choice });
  }
  return [...unique.values()];
}
/** Recover choices only where older data tells us their practice type. */
export function collectSavedChoices(saved: SavedPractice): SavedChoice[] {
  if (saved.savedChoices !== undefined)
    return validSavedChoices(saved.savedChoices);
  const current =
    saved.settings.selection === "custom"
      ? [{
          kind: saved.settings.kind,
          text: saved.settings.custom,
          ...scriptLabels(saved.settings.customHindi, saved.settings.customEnglish),
        }]
      : [];
  return validSavedChoices([
    ...(saved.history
      ?.slice().reverse()
      ?.filter((entry) => entry.kind)
      .map((entry) => ({
        kind: entry.kind,
        text: entry.text,
        ...scriptLabels(entry.hindi, entry.english),
      })) ?? []),
    ...current,
  ]);
}
export function saveCustomChoice(
  saved: SavedPractice,
  settings = saved.settings,
): SavedPractice {
  if (settings.selection !== "custom" || !settings.custom.trim()) return saved;
  return {
    ...saved,
    savedChoices: validSavedChoices([
      ...(saved.savedChoices ?? []),
      {
        kind: settings.kind,
        text: settings.custom,
        ...scriptLabels(settings.customHindi, settings.customEnglish),
      },
    ]),
  };
}
export function omitSavedChoice(saved: SavedPractice, choice: SavedChoice): SavedPractice {
  const key = choiceKey(choice);
  return {
    ...saved,
    savedChoices: (saved.savedChoices ?? []).filter(
      (item) => choiceKey(item) !== key,
    ),
  };
}
function isSelectedCustom(settings: Settings, choice: SavedChoice) {
  return (
    settings.selection === "custom" &&
    settings.kind === choice.kind &&
    normalizeText(settings.custom) === normalizeText(choice.text)
  );
}
export function removeCustomChoice(
  saved: SavedPractice,
  choice: SavedChoice,
): SavedPractice {
  const next = omitSavedChoice(saved, choice);
  if (!isSelectedCustom(next.settings, choice)) return next;
  const first = rankChoices(
    next.settings.kind,
    next.settings.language,
    next.savedChoices ?? [],
    next.history ?? [],
  )[0];
  return { ...next, settings: { ...next.settings, ...choiceSelection(first) } };
}
export function replaceCustomChoice(
  saved: SavedPractice,
  previous: SavedChoice,
  settings: Settings,
): SavedPractice {
  return saveCustomChoice(
    { ...omitSavedChoice(saved, previous), settings },
    settings,
  );
}
export interface RankedChoice extends SavedChoice {
  id: string;
  label: string;
  custom: boolean;
  sessions: number;
}
export function rankChoices(
  kind: Kind,
  language: Settings["language"],
  savedChoices: SavedChoice[],
  history: NonNullable<SavedPractice["history"]>,
): RankedChoice[] {
  const totals = new Map<string, number>();
  const seen = new Set<string>();
  for (const entry of history) {
    if (seen.has(entry.id)) continue;
    seen.add(entry.id);
    // Old records lack kind; only unambiguous built-in text can be attributed.
    const entryKind =
      entry.kind ??
      (Object.keys(choices) as Kind[]).find((type) =>
        choices[type].some(
          (item) => normalizeText(item.text) === normalizeText(entry.text),
        ),
      );
    if (entryKind !== kind) continue;
    const key = choiceKey({ kind, text: entry.text });
    totals.set(key, (totals.get(key) ?? 0) + 1);
  }
  const available = [
    ...choices[kind].map((item) => ({
      id: item.id,
      kind,
        text: item.text,
        hindi: item.hi,
        english: item.en,
      label: item[language],
      custom: false,
    })),
    ...savedChoices
      .filter((item) => item.kind === kind)
      .map((item) => ({
        ...item,
        id: choiceKey(item),
        label: (language === "hi" ? item.hindi : item.english) || item.text,
        custom: true,
      })),
  ];
  return available
    .map((item) => ({ ...item, sessions: totals.get(choiceKey(item)) ?? 0 }))
    .sort((a, b) => b.sessions - a.sessions);
}
export function choiceSelection(item: RankedChoice) {
  return {
    selection: item.custom ? "custom" : item.id,
    custom: item.custom ? item.text : "",
    customHindi: item.custom ? item.hindi ?? "" : "",
    customEnglish: item.custom ? item.english ?? "" : "",
  };
}
export function settingsForKind(
  settings: Settings,
  kind: Kind,
  savedChoices: SavedChoice[] = [],
  history: NonNullable<SavedPractice["history"]> = [],
): Settings {
  if (kind === settings.kind) return settings;
  const first = rankChoices(kind, settings.language, savedChoices, history)[0];
  return { ...settings, kind, ...choiceSelection(first) };
}
