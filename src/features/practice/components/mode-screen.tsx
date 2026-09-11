import Link from "next/link";
import { selectedLabel, selectedText, type Mode, type Settings } from "../lib/types";
import type { Copy } from "../lib/translations";
import { ChoiceText } from "./choice-text";
import { Lotus } from "./lotus";
import { ModeSettings } from "./mode-settings";
interface Props {
  settings: Settings;
  copy: Copy;
  onChange: (settings: Settings) => void;
  onStart: () => void;
}
const modes: {
  value: Mode;
  symbol: string;
  hint: "countHint" | "breathHint" | "timeHint";
}[] = [
  { value: "count", symbol: "◌", hint: "countHint" },
  { value: "breath", symbol: "≈", hint: "breathHint" },
  { value: "time", symbol: "◷", hint: "timeHint" },
];
export function ModeScreen({ settings: s, copy: t, onChange, onStart }: Props) {
  const update = (patch: Partial<Settings>) => onChange({ ...s, ...patch });
  const valid = s.selection !== "custom" || s.custom.trim().length > 0;
  return (
    <section className="choose-screen screen-enter" aria-labelledby="choose-mode-heading">
      <Link className="step-back" href="/choose/name">
        ← {t.stepBack}
      </Link>
      <p className="chosen-practice">
        <ChoiceText
          text={selectedText(s)}
          hindi={selectedText(s)}
          english={selectedLabel(s)}
          language={s.language}
        />
      </p>
      <h1 id="choose-mode-heading">{t.chooseModeTitle}</h1>
      <p className="intro">{t.chooseModeHint}</p>
      <div className="kind-cards">
        {modes.map((mode) => (
          <button
            key={mode.value}
            type="button"
            className={s.mode === mode.value ? "selected" : ""}
            aria-pressed={s.mode === mode.value}
            onClick={() => update({ mode: mode.value })}
          >
            <span className="option-symbol" aria-hidden="true">
              {mode.symbol}
            </span>
            <span>
              <strong>{t[mode.value]}</strong>
              <small>{t[mode.hint]}</small>
            </span>
          </button>
        ))}
      </div>
      <ModeSettings settings={s} copy={t} update={update} />
      <div className="start-dock">
        <button
          className="primary-button start-button"
          disabled={!valid}
          onClick={onStart}
        >
          <Lotus />
          {t.start}
          <span aria-hidden="true">→</span>
        </button>
      </div>
      <p className="privacy-note">
        <span aria-hidden="true">♧</span> {t.private}
      </p>
    </section>
  );
}