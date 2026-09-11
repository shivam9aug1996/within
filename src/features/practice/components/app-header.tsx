import Link from "next/link";
import type { Copy } from "../lib/translations";
import type { Language, PracticeView } from "../lib/types";
import { Lotus } from "./lotus";
export function AppHeader({
  language,
  copy: t,
  onLanguage,
  view,
  sanctum = false,
}: {
  language: Language;
  copy: Copy;
  onLanguage: (language: Language) => void;
  view: PracticeView;
  sanctum?: boolean;
}) {
  const inFlow =
    view === "practice" ||
    view === "choose" ||
    view === "name" ||
    view === "custom" ||
    view === "mode";
  const onHome =
    view === "home" ||
    view === "choose" ||
    view === "name" ||
    view === "custom" ||
    view === "mode";
  return (
    <>
      {!sanctum && (
        <header className="site-header">
          <Link className="brand" href="/" aria-label="Within">
            <Lotus />
            <span>
              within<span className="brand-dot">.</span>
            </span>
          </Link>
          <div className="language-options" role="group" aria-label={t.language}>
            <button
              lang="hi"
              aria-pressed={language === "hi"}
              onClick={() => onLanguage("hi")}
            >
              हिन्दी
            </button>
            <button
              lang="en"
              aria-pressed={language === "en"}
              onClick={() => onLanguage("en")}
            >
              English
            </button>
          </div>
        </header>
      )}
      <nav className={sanctum ? "main-nav is-sanctum" : "main-nav"} aria-label={t.home}>
        <Link href="/" aria-current={onHome ? "page" : undefined}>
          {inFlow ? "← " : ""}
          {t.homeLabel}
        </Link>
        {!sanctum && (
          <Link
            href="/history"
            aria-current={view === "history" ? "page" : undefined}
          >
            {t.history}
          </Link>
        )}
      </nav>
    </>
  );
}