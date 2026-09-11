import Link from "next/link";
import { useMemo, useState } from "react";
import {
  resolveCustomChoice,
  suggestOtherScript,
} from "../lib/hindi-input";
import type { Kind, Settings } from "../lib/types";
import type { Copy } from "../lib/translations";
import { OptionGroup } from "./option-group";
type CustomPatch = Pick<
  Settings,
  "selection" | "custom" | "customHindi" | "customEnglish"
>;
interface Props {
  copy: Copy;
  kind: Kind;
  editingText?: string;
  onCommit: (patch: CustomPatch) => void;
}
export function CustomNameScreen({
  copy: t,
  kind,
  editingText = "",
  onCommit,
}: Props) {
  const [typed, setTyped] = useState(editingText);
  const [picked, setPicked] = useState("");
  const suggestions = useMemo(() => suggestOtherScript(typed), [typed]);
  const selected = suggestions.options.includes(picked)
    ? picked
    : (suggestions.options[0] ?? "");
  const preview = resolveCustomChoice(typed, selected);
  const pickLabel =
    suggestions.script === "hi" ? t.pickHindi : t.pickEnglish;
  return (
    <section
      className="choose-screen custom-name-screen screen-enter"
      aria-labelledby="custom-name-heading"
    >
      <Link className="step-back" href="/choose/name">
        ← {t.stepBack}
      </Link>
      <h1 id="custom-name-heading">
        {kind === "mantra"
          ? editingText
            ? t.editMantra
            : t.customMantra
          : editingText
            ? t.editName
            : t.customName}
      </h1>
      <p className="intro" id="custom-type-hint">
        {t.typeEither}
      </p>
      <div className="custom-field">
        <input
          maxLength={200}
          value={typed}
          autoFocus
          autoComplete="off"
          spellCheck={false}
          placeholder={kind === "mantra" ? t.customHintMantra : t.customHintName}
          aria-labelledby="custom-name-heading"
          aria-describedby="custom-type-hint"
          lang={suggestions.script === "en" ? "hi" : "en"}
          onChange={(event) => {
            setTyped(event.target.value);
            setPicked("");
          }}
        />
      </div>
      {suggestions.options.length > 0 && (
        <>
          <p className="choice-hint">{pickLabel}</p>
          <OptionGroup
            label={pickLabel}
            className="name-options suggestion-options"
            value={selected}
            onChange={setPicked}
            options={suggestions.options.map((item) => ({
              value: item,
              label: (
                <span
                  className="sacred-name"
                  lang={suggestions.script === "hi" ? "hi" : "en"}
                >
                  {item}
                </span>
              ),
            }))}
          />
        </>
      )}
      <div className="start-dock">
        <button
          type="button"
          className="primary-button start-button"
          disabled={!typed.trim()}
          onClick={() => onCommit(preview)}
        >
          {editingText ? t.save : t.continue}
          {preview.custom ? ` · ${preview.custom}` : ""}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
}
