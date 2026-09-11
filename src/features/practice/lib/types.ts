export type Language = "en" | "hi";
export type Mode = "count" | "breath" | "time";
export type Kind = "naam" | "mantra";
export type PracticeView =
  | "home"
  | "choose"
  | "name"
  | "custom"
  | "mode"
  | "practice"
  | "history";
export interface Settings {
  language: Language;
  kind: Kind;
  selection: string;
  custom: string;
  customHindi?: string;
  customEnglish?: string;
  mode: Mode;
  target: number;
  minutes: number;
  breathSeconds: number;
  sound?: boolean;
}
export interface Session {
  id?: string;
  startedAt?: string;
  completedAt?: string;
  count: number;
  elapsed: number;
  completed: boolean;
}
export interface SavedChoice {
  kind: Kind;
  text: string;
  hindi?: string;
  english?: string;
}
export interface HistoryEntry {
  kind?: Kind;
  id: string;
  finishedAt: string;
  text: string;
  hindi?: string;
  english?: string;
  mode: Mode;
  count: number;
  elapsed: number;
  cycles: number;
}
export interface SavedPractice {
  savedChoices?: SavedChoice[];
  history?: HistoryEntry[];
  settings: Settings;
  session: Session | null;
}
export const defaults: Settings = {
  language: "en",
  kind: "naam",
  selection: "ram",
  custom: "",
  mode: "count",
  target: 0,
  minutes: 5,
  breathSeconds: 4,
  sound: false,
};
export const choices = {
  naam: [
    { id: "ram", text: "राम", en: "Ram", hi: "राम" },
    { id: "krishna", text: "कृष्ण", en: "Krishna", hi: "कृष्ण" },
    { id: "shiva", text: "शिव", en: "Shiva", hi: "शिव" },
    { id: "waheguru", text: "वाहेगुरु", en: "Waheguru", hi: "वाहेगुरु" },
  ],
  mantra: [
    {
      id: "om",
      text: "ॐ नमः शिवाय",
      en: "Om Namah Shivaya",
      hi: "ॐ नमः शिवाय",
    },
    {
      id: "vasudeva",
      text: "ॐ नमो भगवते वासुदेवाय",
      en: "Om Namo Bhagavate Vasudevaya",
      hi: "ॐ नमो भगवते वासुदेवाय",
    },
  ],
};
export function selectedText(settings: Settings) {
  return settings.selection === "custom"
    ? settings.customHindi?.trim() || settings.custom.trim()
    : (choices[settings.kind].find((item) => item.id === settings.selection)
        ?.text ?? "राम");
}
export function selectedLabel(settings: Settings) {
  if (settings.selection === "custom") {
    const label = settings.language === "hi"
      ? settings.customHindi
      : settings.customEnglish;
    return label?.trim() || settings.custom.trim();
  }
  return choices[settings.kind].find((item) => item.id === settings.selection)
    ?.[settings.language] ?? (settings.language === "hi" ? "राम" : "Ram");
}
