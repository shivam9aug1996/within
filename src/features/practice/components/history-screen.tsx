import Link from "next/link";
import { useMemo } from "react";
import { counted, formatDuration } from "../lib/format";
import { dateGroup } from "../lib/history";
import type { Copy } from "../lib/translations";
import type { HistoryEntry, Language } from "../lib/types";
export function HistoryScreen({
  entries,
  language,
  copy: t,
}: {
  entries: HistoryEntry[];
  language: Language;
  copy: Copy;
}) {
  const groups = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(
      language === "hi" ? "hi-IN" : "en-IN",
      { day: "numeric", month: "long", year: "numeric" },
    );
    const result = new Map<string, HistoryEntry[]>();
    for (const entry of [...entries].sort(
      (a, b) => Date.parse(b.finishedAt) - Date.parse(a.finishedAt),
    )) {
      const relative = dateGroup(entry.finishedAt);
      const label =
        relative === "earlier"
          ? formatter.format(new Date(entry.finishedAt))
          : t[relative];
      result.set(label, [...(result.get(label) ?? []), entry]);
    }
    return [...result];
  }, [entries, language, t]);
  return (
    <section className="history-screen screen-enter">
      <h1>{t.history}</h1>
      <p className="intro">{t.historyIntro}</p>
      {groups.length === 0 ? (
        <div className="empty-history">
          <p>{t.emptyHistory}</p>
          <Link className="primary-button" href="/">
            {t.start} →
          </Link>
        </div>
      ) : (
        groups.map(([label, sessions]) => (
          <section className="history-day" key={label}>
            <h2>{label}</h2>
            <ul>
              {sessions.map((entry) => (
                <li className="history-entry" key={entry.id}>
                  <div>
                    <h3>{entry.text}</h3>
                    <span>
                      {entry.mode === "time" ? t.timer : t[entry.mode]} ·{" "}
                      <time dateTime={entry.finishedAt}>
                        {new Intl.DateTimeFormat(
                          language === "hi" ? "hi-IN" : "en-IN",
                          { hour: "numeric", minute: "2-digit" },
                        ).format(new Date(entry.finishedAt))}
                      </time>
                    </span>
                  </div>
                  <div className="history-details">
                    {entry.mode === "count" && (
                      <span>
                        {counted(entry.count, t.repetition, t.repetitions)}
                      </span>
                    )}
                    {entry.mode === "breath" && (
                      <span>
                        {counted(entry.cycles, t.cycle, t.cycles)}
                      </span>
                    )}
                    <span>{formatDuration(entry.elapsed, t)}</span>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
      <p className="history-note">{t.localHistory}</p>
    </section>
  );
}
