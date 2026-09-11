import type { Copy } from "../lib/translations";
import { counted, formatDuration } from "../lib/format";
import { malasCompleted } from "../lib/mala";
import type { Session, Settings } from "../lib/types";
import { dailyIndex } from "../lib/thoughts";
import { Lotus } from "./lotus";
export function formatTime(seconds: number) {
  return `${Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0")}:${Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0")}`;
}
function sittingStat(
  session: Session,
  settings: Settings,
  t: Copy,
) {
  const time = formatDuration(session.elapsed, t);
  if (settings.mode === "count") {
    const malas = malasCompleted(session.count);
    if (malas > 0)
      return {
        value: `${malas} ${malas === 1 ? t.mala : t.malas}`,
        label: `${counted(session.count, t.repetition, t.repetitions)} · ${time}`,
      };
    return {
      value: counted(session.count, t.repetition, t.repetitions),
      label: time,
    };
  }
  if (settings.mode === "breath") {
    const cycles = Math.floor(session.elapsed / (settings.breathSeconds * 2));
    return { value: counted(cycles, t.cycle, t.cycles), label: time };
  }
  return { value: time, label: t.duration };
}
export function Completion({
  session,
  settings,
  copy: t,
  onAgain,
  onHome,
}: {
  session: Session;
  settings: Settings;
  copy: Copy;
  onAgain: () => void;
  onHome: () => void;
}) {
  const sitting = sittingStat(session, settings, t);
  return (
    <section className="completion screen-enter">
      <Lotus className="completion-lotus" />
      <p className="eyebrow">{t[settings.kind]}</p>
      <h1>
        {t.completed}
        <br />
        <em>{t.completedAccent}</em>
      </h1>
      <p className="intro">{t.endHint}</p>
      <div className="session-stats">
        <div>
          <strong>{sitting.value}</strong>
          <span>{sitting.label}</span>
        </div>
      </div>
      <blockquote className="thought-quote">
        {t.quotes[dailyIndex(t.quotes.length)]}
      </blockquote>
      <button className="primary-button" onClick={onAgain}>
        {t.again}
        <span aria-hidden="true">→</span>
      </button>
      <button className="text-button" onClick={onHome}>
        {t.back}
      </button>
    </section>
  );
}
