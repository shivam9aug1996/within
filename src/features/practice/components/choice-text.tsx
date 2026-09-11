import { hasDevanagari } from "../lib/hindi-input";
import type { Language } from "../lib/types";
/** One presentation for built-in and custom choices, without guessing a script. */
export function ChoiceText({
  text,
  hindi,
  english,
  language,
}: {
  text: string;
  hindi?: string;
  english?: string;
  language: Language;
}) {
  const primary = hindi || text;
  const secondary =
    language === "en" && english && english !== primary ? english : null;
  return (
    <>
      <span
        className="sacred-name"
        lang={hasDevanagari(primary) ? "hi" : undefined}
      >
        {primary}
      </span>
      {secondary && <small lang="en">{secondary}</small>}
    </>
  );
}
