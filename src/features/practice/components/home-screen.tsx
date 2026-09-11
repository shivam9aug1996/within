import Link from "next/link";
import { lastSitWhisper } from "../lib/history";
import {
  selectedText,
  type Kind,
  type SavedPractice,
} from "../lib/types";
import type { Copy } from "../lib/translations";
import { KindScreen } from "./kind-screen";
import { Lotus } from "./lotus";
import { modeSummary } from "./mode-settings";
function Welcome({ copy: t }: { copy: Copy }) {
  return (
    <section className="welcome">
      <h1>
        {t.title} <em>{t.titleAccent}</em>
      </h1>
      <p className="intro">{t.intro}</p>
    </section>
  );
}
export function HomeScreen({
  saved,
  copy: t,
  onStart,
  onChooseKind,
  resume = false,
}: {
  saved: SavedPractice;
  copy: Copy;
  onStart: () => void;
  onChooseKind: (kind: Kind) => void;
  resume?: boolean;
}) {
  const returning = (saved.history?.length ?? 0) > 0;
  const mode = modeSummary(saved.settings, t);
  const whisper = lastSitWhisper(
    saved.history ?? [],
    t,
    saved.settings.language,
    new Date(),
    {
      name: selectedText(saved.settings),
      mode: saved.settings.mode,
      target: saved.settings.target,
    },
  );
  if (resume) {
    return (
      <div className="home-content screen-enter">
        <Welcome copy={t} />
        <section className="home-card">
          <h2>{t.saved}</h2>
          <p className="resume-name">{selectedText(saved.settings)}</p>
          <p className="resume-mode">{mode}</p>
          <p>{t.pendingHint}</p>
          <Link className="primary-button" href="/practice">
            {t.resume} →
          </Link>
        </section>
      </div>
    );
  }
  if (!returning) {
    return (
      <div className="home-content">
        <KindScreen copy={t} onChoose={onChooseKind} />
      </div>
    );
  }
  return (
    <div className="home-content screen-enter">
      <Welcome copy={t} />
      <section className="home-card">
        <p className="resume-name">{selectedText(saved.settings)}</p>
        <p className="resume-mode">{mode}</p>
        <p className="home-whisper">{whisper ?? t.beginReady}</p>
        <button className="primary-button start-button" onClick={onStart}>
          <Lotus />
          {t.start}
          <span aria-hidden="true">→</span>
        </button>
        <Link className="text-button change-practice" href="/choose">
          {t.changePractice}
        </Link>
      </section>
    </div>
  );
}
