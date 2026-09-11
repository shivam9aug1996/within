# Within

A quiet, bilingual space for Naam Jap and Mantra Jap, built with Next.js and React.

## Development

```sh
npm install
npm run dev
```

Open http://localhost:3000. Use `npm run dev -- --webpack` in environments that restrict Turbopack worker ports.

## Checks

```sh
npm run lint
npm test
npm run build
```

`npm run build -- --webpack` provides an alternative production build for restricted environments.

## Structure

- `src/features/practice/components`: focused setup, practice, and completion UI.
- `src/features/practice/hooks`: session timing and interaction lifecycle.
- `src/features/practice/lib`: typed settings, translations, storage, and pure session operations.
- `src/app/styles`: shared visual foundations and responsive styles.

The `/` route is home: a first visit asks Naam Jap or Mantra Jap, later visits offer one-tap begin or continue, `/choose` asks the practice type, `/choose/name` asks the name, `/choose/mode` asks how to practise and begins, `/practice` is the current session, and `/history` groups completed sessions by local calendar day. Home and browser Back leave the session paused and saved. An unfinished session must be finished before a different practice can start.

Count, breath, and timed sessions work locally without a backend. Each repetition and periodic elapsed-time update is saved in `within.practice.v1` in browser storage. Refresh restores an unfinished session paused. Switching to a hidden tab pauses practice. Timer precision is approximately one second; time away does not count. Breath cycles are distinct from mantra repetitions.

Language and settings persist on the same browser. Storage validation safely handles malformed saved data; unavailable storage displays a notice. Clearing browser data removes progress. Completed sessions are retained in history with their date, selected text, mode, repetitions or breath cycles, and duration. Authentication, cloud sync, audio, and live AI are not included. Historical sessions from before history was introduced cannot be reconstructed.

Custom names and mantras can be saved explicitly or by starting a session. Each practice type has its own saved choices. Suggestions are ordered by completed session count across all three modes, with stable ties; selecting a choice does not change its position. Preferences, choices, and history remain local to the browser.

UI translations are separate from sacred text. CSS uses opacity and transform animation, with a reduced-motion alternative. No external fonts or animation libraries are fetched at runtime.
