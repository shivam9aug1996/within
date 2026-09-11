import { test } from "node:test";
import { createRequire } from "node:module";
import assert from "node:assert/strict";
import fs from "node:fs";
import ts from "typescript";
import { mantraCases } from "./mantra-check.mjs";
const loadModule = createRequire(import.meta.url);
// Compile the small pure modules for Node without adding a test dependency.
loadModule.extensions[".ts"] = (module, filename) => {
  const { outputText } = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
    },
  });
  module._compile(outputText, filename);
};
const { defaults } = loadModule("../src/features/practice/lib/types.ts");
const { advanceSession, countRepetition } = loadModule(
  "../src/features/practice/lib/session.ts",
);
const { readPractice, writePractice } = loadModule(
  "../src/features/practice/lib/storage.ts",
);
const empty = { count: 0, elapsed: 0, completed: false };

test("rapid repetitions stop exactly at the target", () => {
  let session = empty;
  for (let i = 0; i < 150; i++) session = countRepetition(session, 108);
  assert.equal(session.count, 108);
  assert.equal(session.completed, true);
});
test("open counting does not finish at a mala boundary", () => {
  assert.equal(countRepetition({ ...empty, count: 107 }, 0).completed, false);
});
test("timer uses elapsed duration and clamps a delayed tick to its target", () => {
  const settings = { ...defaults, mode: "time", minutes: 1 };
  const next = advanceSession({ ...empty, elapsed: 58.5 }, 3.8, settings);
  assert.equal(next.elapsed, 60);
  assert.equal(next.completed, true);
  assert.deepEqual(advanceSession(next, 10, settings), next);
});
test("breathing tracks time without inventing repetitions", () => {
  const next = advanceSession(empty, 16, { ...defaults, mode: "breath" });
  assert.equal(next.count, 0);
  assert.equal(next.completed, false);
});
test("progress round trips and corrupt data safely falls back", () => {
  let value = null;
  global.localStorage = {
    getItem: () => value,
    setItem: (_key, data) => {
      value = data;
    },
  };
  const saved = {
    settings: { ...defaults, language: "hi" },
    session: { ...empty, count: 37, elapsed: 42.3 },
  };
  writePractice(saved);
  assert.deepEqual(readPractice(), saved);
  value = "{bad json";
  assert.deepEqual(readPractice(), { settings: defaults, session: null });
  value = JSON.stringify({ ...saved, session: { ...empty, count: -5 } });
  assert.equal(readPractice().session, null);
  value = JSON.stringify({
    ...saved,
    settings: { ...defaults, mode: "invalid" },
  });
  assert.deepEqual(readPractice().settings, defaults);
});

const { recordSession, discardSession, dateGroup, lastSitWhisper } = loadModule(
  "../src/features/practice/lib/history.ts",
);
test("finished sessions are archived once with their own practice details", () => {
  const saved = { settings: defaults, session: null };
  const session = {
    ...empty,
    id: "session-1",
    count: 11,
    elapsed: 20,
    completed: true,
  };
  const finished = recordSession(
    saved,
    session,
    new Date("2026-09-09T12:00:00Z"),
  );
  assert.equal(finished.history.length, 1);
  assert.equal(finished.history[0].text, "राम");
  assert.equal(finished.history[0].count, 11);
  assert.equal(finished.history[0].finishedAt, "2026-09-09T12:00:00.000Z");
  assert.equal(recordSession(finished, session).history.length, 1);
  assert.equal(
    recordSession(saved, { ...session, completed: false }).history,
    undefined,
  );
});
test("leaving a session clears it without writing history", () => {
  const history = [
    {
      id: "kept",
      kind: "naam",
      text: "राम",
      finishedAt: "2026-09-09T12:00:00.000Z",
      mode: "count",
      count: 11,
      elapsed: 20,
      cycles: 0,
    },
  ];
  const saved = {
    settings: defaults,
    session: { ...empty, id: "open", count: 50, elapsed: 12 },
    history,
  };
  const left = discardSession(saved);
  assert.equal(left.session, null);
  assert.equal(left.history, history);
  assert.equal(left.settings, defaults);
});
test("date groups use local calendar days across year boundaries", () => {
  const now = new Date(2026, 0, 1, 0, 5);
  assert.equal(
    dateGroup(new Date(2025, 11, 31, 23, 55).toISOString(), now),
    "yesterday",
  );
  assert.equal(
    dateGroup(new Date(2026, 0, 1, 0, 1).toISOString(), now),
    "today",
  );
  assert.equal(
    dateGroup(new Date(2025, 11, 30, 12).toISOString(), now),
    "earlier",
  );
});
test("home whisper is one line from the last sit or this week", () => {
  const t = {
    today: "Today",
    yesterday: "Yesterday",
    thisWeek: "This week",
    sit: "sit",
    sits: "sits",
    satToday: "You sat today",
    satYesterday: "You sat yesterday",
    second: "second",
    seconds: "seconds",
    minute: "minute",
    minutes: "minutes",
  };
  const now = new Date(2026, 8, 11, 12);
  const same = { name: "राम", mode: "count", target: 11 };
  const sit = (when, extra = {}) => ({
    id: String(when),
    text: "राम",
    mode: "count",
    count: 108,
    elapsed: 60,
    cycles: 0,
    finishedAt: new Date(when).toISOString(),
    ...extra,
  });
  assert.equal(lastSitWhisper([], t, "en", now), null);
  assert.equal(
    lastSitWhisper([sit(new Date(2026, 8, 11, 8), { count: 11 })], t, "en", now, same),
    "You sat today",
  );
  assert.equal(
    lastSitWhisper([sit(new Date(2026, 8, 11, 8))], t, "en", now, same),
    "You sat today · 108",
  );
  assert.equal(
    lastSitWhisper([sit(new Date(2026, 8, 10, 18))], t, "en", now),
    "Yesterday · राम · 108",
  );
  assert.equal(
    lastSitWhisper(
      [
        sit(new Date(2026, 8, 7, 10), { id: "a" }),
        sit(new Date(2026, 8, 8, 10), { id: "b" }),
        sit(new Date(2026, 8, 9, 10), { id: "c" }),
      ],
      t,
      "en",
      now,
    ),
    "This week · 3 sits",
  );
});
test("history survives reload and rejects malformed entries", () => {
  let value;
  global.localStorage = {
    getItem: () => value,
    setItem: (_key, data) => {
      value = data;
    },
  };
  const archived = recordSession(
    { settings: defaults, session: null },
    { ...empty, id: "saved", completed: true, count: 27 },
  );
  writePractice(archived);
  assert.deepEqual(readPractice(), archived);
  value = JSON.stringify({
    ...archived,
    history: [...archived.history, { id: "broken" }],
  });
  assert.equal(readPractice().history.length, 1);
});

  const {
    saveCustomChoice,
    collectSavedChoices,
    rankChoices,
    validSavedChoices,
    settingsForKind,
    removeCustomChoice,
    replaceCustomChoice,
  } = loadModule("../src/features/practice/lib/saved-choices.ts");
test("multiple saved choices survive reload without saving intermediate drafts", () => {
  let value;
  global.localStorage = {
    getItem: () => value,
    setItem: (_key, data) => {
      value = data;
    },
  };
  let saved = {
    settings: { ...defaults, selection: "custom", custom: "Hari" },
    session: null,
    savedChoices: [],
  };
  saved = saveCustomChoice(saved);
  saved = saveCustomChoice({
    ...saved,
    settings: { ...saved.settings, custom: "Radhe" },
  });
  saved = {
    ...saved,
    settings: { ...saved.settings, custom: "unfinished draft" },
  };
  writePractice(saved);
  assert.deepEqual(
    collectSavedChoices(readPractice()).map((item) => item.text),
    ["Hari", "Radhe"],
  );
  const legacy = {
    settings: { ...defaults, selection: "custom", custom: "Hari" },
    session: null,
  };
  assert.equal(collectSavedChoices(legacy)[0].text, "Hari");
});
test("saved choices normalize duplicates and retain separate practice kinds", () => {
  const result = validSavedChoices([
    { kind: "naam", text: " Hari   Om " },
    { kind: "naam", text: "hari om" },
    { kind: "mantra", text: "Hari Om" },
    { kind: "naam", text: "राम" },
    { kind: "bad", text: "no" },
    { kind: "naam", text: "" },
  ]);
  assert.equal(result.length, 2);
  assert.equal(result[0].kind, "naam");
  assert.equal(result[1].kind, "mantra");
});
test("ranking counts sessions equally across modes and preserves stable ties", () => {
  const history = [
    {
      id: "1",
      kind: "naam",
      text: "कृष्ण",
      mode: "count",
      count: 1,
      elapsed: 2,
    },
    {
      id: "2",
      kind: "naam",
      text: "कृष्ण",
      mode: "breath",
      count: 0,
      elapsed: 20,
    },
    {
      id: "3",
      kind: "naam",
      text: "कृष्ण",
      mode: "time",
      count: 0,
      elapsed: 60,
    },
    {
      id: "4",
      kind: "naam",
      text: "राम",
      mode: "count",
      count: 10000,
      elapsed: 1000,
    },
  ];
  const original = JSON.stringify(history);
  assert.equal(rankChoices("naam", "en", [], history)[0].id, "krishna");
  assert.deepEqual(
    rankChoices("naam", "en", [], []).map((item) => item.id),
    ["ram", "krishna", "shiva", "waheguru"],
  );
  assert.equal(JSON.stringify(history), original);
  assert.equal(
    rankChoices("naam", "hi", [], [...history, history[0]])[0].sessions,
    3,
  );
});
test("same custom text is ranked independently by kind, and legacy built-ins contribute", () => {
  const library = [
    { kind: "naam", text: "Hari" },
    { kind: "mantra", text: "Hari" },
  ];
  const history = [
    { id: "n", kind: "naam", text: "Hari" },
    { id: "old", text: "शिव" },
  ];
  assert.equal(
    rankChoices("mantra", "en", library, history).at(-1).sessions,
    0,
  );
  assert.equal(rankChoices("naam", "en", library, history)[0].id, "shiva");
  assert.equal(rankChoices("naam", "en", library, history)[1].text, "Hari");
});
test("switching practice kind selects the first ranked choice for that kind", () => {
  const mantra = settingsForKind(defaults, "mantra", [], []);
  assert.equal(mantra.kind, "mantra");
  assert.equal(mantra.selection, "om");
  assert.equal(settingsForKind(defaults, "naam", [], []).selection, "ram");
  assert.equal(settingsForKind(mantra, "mantra", [], []), mantra);
});
test("a deleted custom name leaves the list and does not return from history", () => {
  const hari = { kind: "naam", text: "Hari", hindi: "हरि", english: "Hari" };
  const saved = {
    settings: { ...defaults, selection: "custom", custom: "Hari", customHindi: "हरि", customEnglish: "Hari" },
    session: null,
    savedChoices: [hari, { kind: "naam", text: "Radhe" }],
    history: [
      {
        id: "1",
        kind: "naam",
        text: "Hari",
        mode: "count",
        count: 1,
        elapsed: 1,
        finishedAt: "2026-09-10T00:00:00.000Z",
        cycles: 0,
      },
    ],
  };
  const removed = removeCustomChoice(saved, hari);
  assert.deepEqual(
    removed.savedChoices.map((item) => item.text),
    ["Radhe"],
  );
  assert.equal(removed.settings.selection, "ram");
  assert.deepEqual(
    collectSavedChoices(removed).map((item) => item.text),
    ["Radhe"],
  );
  const edited = replaceCustomChoice(saved, hari, {
    ...saved.settings,
    custom: "राधा",
    customHindi: "राधा",
    customEnglish: "Radha",
  });
  assert.deepEqual(
    edited.savedChoices.map((item) => item.text).sort(),
    ["Radhe", "राधा"],
  );
  assert.equal(edited.settings.custom, "राधा");
});

const { suggestHindi, suggestEnglish, suggestOtherScript, resolveCustomChoice, ROMAN_HINDI } = loadModule(
  "../src/features/practice/lib/hindi-input.ts",
);
test("english names suggest a few hindi spellings", () => {
  assert.equal(suggestHindi("radha")[0], "राधा");
  assert.equal(suggestHindi("krishna")[0], "कृष्ण");
  assert.ok(suggestHindi("shiva").includes("शिव"));
  assert.ok(suggestHindi("jai shri ram")[0].includes("राम"));
  assert.deepEqual(suggestHindi("राधा"), []);
  assert.ok(suggestHindi("radha").length <= 4);
});
test("honorific ji becomes जी, not a short जि", () => {
  assert.deepEqual(suggestHindi("radha ji"), ["राधा जी"]);
  assert.equal(suggestHindi("ram ji")[0], "राम जी");
  assert.ok(!suggestHindi("radha ji").some((item) => item.includes("जि") || item.includes("रध ")));
});
test("unknown words get a few phonetic readings, known names stay corrected", () => {
  assert.equal(suggestHindi("bal")[0], "बाल");
  assert.ok(suggestHindi("bal").includes("बल"));
  assert.equal(suggestHindi("krishan")[0], "कृष्ण");
  assert.equal(suggestHindi("bal krishan")[0], "बाल कृष्ण");
  assert.ok(suggestHindi("bal krishan").includes("बल कृष्ण"));
  assert.equal(suggestHindi("shyam")[0], "श्याम");
  assert.ok(suggestHindi("bal krishan").length <= 4);
});
test("om namah shivay keeps the visarga and the last word", () => {
  assert.equal(suggestHindi("om namah shivay")[0], "ॐ नमः शिवाय");
  assert.ok(suggestHindi("om namah shivaya").includes("ॐ नमः शिवाय"));
  assert.ok(
    suggestHindi("om namah shivay").every((item) => item.includes("शिवाय")),
  );
  assert.ok(!suggestHindi("om namah shivay").some((item) => /नामाह|नमह/.test(item)));
  assert.equal(suggestHindi("om namha shivay")[0], "ॐ नमः शिवाय");
  assert.equal(suggestHindi("namha")[0], "नमः");
  assert.equal(suggestHindi("om nam shivay")[0], "ॐ नमः शिवाय");
  assert.deepEqual(suggestHindi("om nam shivay"), ["ॐ नमः शिवाय"]);
  assert.notEqual(suggestHindi("nam")[0], "नमः");
});
test("hindi names suggest a few english spellings", () => {
  assert.equal(suggestEnglish("राधा")[0], "Radha");
  assert.ok(suggestEnglish("शिव").some((item) => /shiv/i.test(item)));
  assert.deepEqual(suggestEnglish("radha"), []);
});
test("the other-script helper picks hindi or english from what was typed", () => {
  assert.equal(suggestOtherScript("radha").script, "hi");
  assert.equal(suggestOtherScript("राधा").script, "en");
  assert.deepEqual(suggestOtherScript("").options, []);
});
test("continuing without a tap uses the first other-script spelling", () => {
  assert.deepEqual(resolveCustomChoice("radha"), {
    selection: "custom",
    custom: "राधा",
    customHindi: "राधा",
    customEnglish: "Radha",
  });
  assert.equal(resolveCustomChoice("राधा").customEnglish, "Radha");
  assert.equal(resolveCustomChoice("राधा", "not-a-guess").customEnglish, "Radha");
  const picked = suggestHindi("shiva")[1];
  if (picked) assert.equal(resolveCustomChoice("shiva", picked).customHindi, picked);
});
test("common names and honorifics keep their usual spellings", () => {
  assert.equal(suggestHindi("hanuman")[0], "हनुमान");
  assert.equal(suggestHindi("durga")[0], "दुर्गा");
  assert.equal(suggestHindi("lakshmi")[0], "लक्ष्मी");
  assert.equal(suggestHindi("ganesh")[0], "गणेश");
  assert.equal(suggestHindi("ganesha")[0], "गणेश");
  assert.equal(suggestHindi("waheguru")[0], "वाहेगुरु");
  assert.equal(suggestHindi("sita")[0], "सीता");
  assert.equal(suggestHindi("hari")[0], "हरि");
  assert.equal(suggestHindi("krishana")[0], "कृष्ण");
  assert.equal(suggestHindi("shiv")[0], "शिव");
  assert.equal(suggestHindi("jee")[0], "जी");
  assert.equal(suggestHindi("sri")[0], "श्री");
  assert.equal(suggestHindi("shree")[0], "श्री");
  assert.equal(suggestHindi("hanuman ji")[0], "हनुमान जी");
  assert.equal(suggestHindi("krishna ji")[0], "कृष्ण जी");
  assert.equal(suggestHindi("shiv ji")[0], "शिव जी");
  assert.notEqual(suggestHindi("ram ji")[0], "राधा जी");
});
test("known mantras survive spacing, case, and short roman spellings", () => {
  assert.equal(suggestHindi("  OM NAMAH SHIVAY  ")[0], "ॐ नमः शिवाय");
  assert.equal(suggestHindi("om namah shiv")[0], "ॐ नमः शिवाय");
  assert.equal(suggestHindi("om nam shivaya")[0], "ॐ नमः शिवाय");
  assert.equal(suggestHindi("jai sri ram")[0], "जय श्री राम");
  assert.equal(suggestHindi("jai shree ram")[0], "जय श्री राम");
  assert.equal(suggestHindi("sita ram")[0], "सीता राम");
  assert.equal(suggestHindi("radha krishna")[0], "राधा कृष्ण");
  assert.equal(suggestHindi("radhe krishna")[0], "राधे कृष्ण");
  assert.equal(suggestHindi("hare krishna")[0], "हरे कृष्ण");
  assert.equal(suggestHindi("om namo bhagavate vasudevaya")[0], "ॐ नमो भगवते वासुदेवाय");
});
test("close-phrase matching does not steal unrelated names", () => {
  assert.deepEqual(suggestHindi(""), []);
  assert.deepEqual(suggestHindi("   "), []);
  assert.deepEqual(suggestHindi("जय श्री राम"), []);
  assert.ok(suggestHindi("jai ram")[0] !== "जय श्री राम");
  assert.ok(suggestHindi("nam")[0] !== "नमः");
  assert.ok(suggestHindi("bal")[0] !== "राम");
  assert.ok(suggestHindi("om nam shivay").length <= 4);
});
test("english suggestions prefer dictionary names and skip roman input", () => {
  assert.equal(suggestEnglish("कृष्ण")[0], "Krishna");
  assert.ok(suggestEnglish("ॐ नमः शिवाय").some((item) => /namah shivay/i.test(item)));
  assert.ok(suggestEnglish("राम").some((item) => /^ram/i.test(item)));
  assert.deepEqual(suggestEnglish(""), []);
  assert.deepEqual(suggestEnglish("Krishna"), []);
});
test("resolveCustomChoice keeps both scripts for mantras and typed hindi", () => {
  const mantra = resolveCustomChoice("om nam shivay");
  assert.equal(mantra.selection, "custom");
  assert.equal(mantra.custom, "ॐ नमः शिवाय");
  assert.equal(mantra.customHindi, "ॐ नमः शिवाय");
  assert.equal(mantra.customEnglish, "Om Nam Shivay");
  const hindi = resolveCustomChoice("हनुमान");
  assert.equal(hindi.custom, "हनुमान");
  assert.equal(hindi.customHindi, "हनुमान");
  assert.match(hindi.customEnglish, /hanuman/i);
  const empty = resolveCustomChoice("   ");
  assert.equal(empty.custom, "");
  assert.equal(empty.customHindi, "");
  assert.equal(empty.customEnglish, "");
  assert.equal(suggestOtherScript("om nam shivay").options[0], "ॐ नमः शिवाय");
  assert.equal(suggestOtherScript("ॐ").script, "en");
});
test("the roman-hindi table uses the listed Devanagari as the first suggestion", () => {
  assert.equal(ROMAN_HINDI.length, 247);
  for (const [roman, hindi] of ROMAN_HINDI) {
    assert.equal(suggestHindi(roman)[0], hindi, roman);
  }
});
test("the mantra table uses the listed Devanagari as the first suggestion", () => {
  assert.equal(mantraCases.length, 149);
  for (const [roman, hindi] of mantraCases) {
    assert.equal(suggestHindi(roman)[0], hindi, roman);
  }
});

const { dailyIndex } = loadModule("../src/features/practice/lib/thoughts.ts");
const { translations } = loadModule(
  "../src/features/practice/lib/translations.ts",
);
test("the daily thought stays on the same local calendar day", () => {
  assert.equal(translations.en.quotes.length, translations.hi.quotes.length);
  assert.equal(dailyIndex(7, new Date(2026, 0, 1, 0, 5)), 0);
  assert.equal(dailyIndex(7, new Date(2026, 0, 1, 23, 50)), 0);
  assert.equal(dailyIndex(7, new Date(2026, 0, 2, 0, 5)), 1);
  assert.equal(dailyIndex(7, new Date(2026, 0, 8)), 0);
  assert.equal(dailyIndex(0), 0);
});

const { counted, formatDuration } = loadModule(
  "../src/features/practice/lib/format.ts",
);
test("one thing is singular, anything else is plural", () => {
  const en = translations.en;
  assert.equal(counted(1, en.cycle, en.cycles), "1 Breath cycle");
  assert.equal(counted(0, en.cycle, en.cycles), "0 Breath cycles");
  assert.equal(counted(2, en.cycle, en.cycles), "2 Breath cycles");
  assert.equal(counted(1, en.repetition, en.repetitions), "1 Repetition");
  assert.equal(counted(11, en.repetition, en.repetitions), "11 Repetitions");
});
test("history duration is spoken, not written like a clock", () => {
  const en = translations.en;
  const hi = translations.hi;
  assert.equal(formatDuration(6, en), "6 seconds");
  assert.equal(formatDuration(1, en), "1 second");
  assert.equal(formatDuration(60, en), "1 minute");
  assert.equal(formatDuration(75, en), "1 minute 15 seconds");
  assert.equal(formatDuration(6.9, en), "6 seconds");
  assert.equal(formatDuration(6, hi), "6 सेकंड");
  assert.equal(formatDuration(60, hi), "1 मिनट");
});

const { malaBeads, malasCompleted, malaCaption, malaSize, MALA } = loadModule(
  "../src/features/practice/lib/mala.ts",
);
test("a mala fills 108 beads and then starts the next round", () => {
  assert.equal(MALA, 108);
  assert.equal(malaSize(0), 108);
  assert.equal(malaSize(11), 11);
  assert.equal(malaSize(27), 27);
  assert.equal(malaBeads(0), 0);
  assert.equal(malaBeads(1), 1);
  assert.equal(malaBeads(107), 107);
  assert.equal(malaBeads(108), 108);
  assert.equal(malaBeads(109), 1);
  assert.equal(malaBeads(5, 11), 5);
  assert.equal(malaBeads(11, 11), 11);
  assert.equal(malasCompleted(107), 0);
  assert.equal(malasCompleted(108), 1);
  assert.equal(malasCompleted(216), 2);
  assert.equal(malaCaption(12, 11, translations.en), null);
  assert.equal(malaCaption(40, 108, translations.en), "mala");
  assert.equal(malaCaption(40, 0, translations.en), "mala");
  assert.equal(malaCaption(108, 0, translations.en), "1 mala");
  assert.equal(malaCaption(220, 0, translations.en), "2 malas");
});

test("older saved settings still load when sound is missing", () => {
  let value;
  global.localStorage = {
    getItem: () => value,
    setItem: (_key, data) => {
      value = data;
    },
  };
  const { sound, ...settings } = defaults;
  writePractice({
    settings,
    session: null,
  });
  assert.equal(readPractice().settings.sound, false);
  assert.equal(readPractice().settings.kind, "naam");
});

const { attachWakeLock } = loadModule(
  "../src/features/practice/lib/wake-lock.ts",
);
function mockPage(hidden = false) {
  const listeners = new Map();
  return {
    hidden,
    addEventListener(type, fn) {
      listeners.set(type, [...(listeners.get(type) ?? []), fn]);
    },
    removeEventListener(type, fn) {
      listeners.set(
        type,
        (listeners.get(type) ?? []).filter((listener) => listener !== fn),
      );
    },
    emit(type) {
      for (const listener of listeners.get(type) ?? []) listener();
    },
  };
}
function mockWakeLock() {
  let released = true;
  let requests = 0;
  let releases = 0;
  return {
    stats: () => ({ requests, releases, held: !released }),
    api: {
      request: async () => {
        requests += 1;
        released = false;
        return {
          get released() {
            return released;
          },
          release: async () => {
            released = true;
            releases += 1;
          },
          addEventListener() {},
        };
      },
    },
  };
}
test("wake lock is held while sitting and released when it ends", async () => {
  const page = mockPage();
  const wake = mockWakeLock();
  const lock = attachWakeLock({ wakeLock: wake.api, document: page });
  lock.setActive(true);
  await Promise.resolve();
  assert.deepEqual(wake.stats(), { requests: 1, releases: 0, held: true });
  lock.setActive(false);
  await Promise.resolve();
  assert.equal(wake.stats().held, false);
  assert.equal(wake.stats().releases, 1);
  lock.stop();
});
test("wake lock waits until the screen is visible and a gesture if needed", async () => {
  const page = mockPage(true);
  const wake = mockWakeLock();
  const lock = attachWakeLock({ wakeLock: wake.api, document: page });
  lock.setActive(true);
  await Promise.resolve();
  assert.equal(wake.stats().requests, 0);
  page.hidden = false;
  page.emit("visibilitychange");
  await Promise.resolve();
  assert.equal(wake.stats().requests, 1);
  lock.stop();
  await Promise.resolve();
  assert.equal(wake.stats().held, false);
});
test("missing wake lock support is ignored", () => {
  const lock = attachWakeLock({ wakeLock: undefined, document: mockPage() });
  lock.setActive(true);
  lock.stop();
});

