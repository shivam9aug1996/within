import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { rankChoices, type RankedChoice } from "../lib/saved-choices";
import { type SavedPractice, type Settings } from "../lib/types";
import type { Copy } from "../lib/translations";
import { NameSelection, SavedList } from "./name-selection";
interface Props {
  saved: SavedPractice;
  settings: Settings;
  copy: Copy;
  onChange: (settings: Settings) => void;
  onContinue: () => void;
  onAddOwn: () => void;
  onEdit: (choice: RankedChoice) => void;
  onDelete: (choice: RankedChoice) => void;
  backHref: string;
}
export function NameScreen({
  saved,
  settings: s,
  copy: t,
  onChange,
  onContinue,
  onAddOwn,
  onEdit,
  onDelete,
  backHref,
}: Props) {
  const [managing, setManaging] = useState(false);
  const ranked = useMemo(
    () =>
      rankChoices(
        s.kind,
        s.language,
        saved.savedChoices ?? [],
        saved.history ?? [],
      ),
    [s.kind, s.language, saved.savedChoices, saved.history],
  );
  const custom = ranked.filter((item) => item.custom);
  const update = (patch: Partial<Settings>) => onChange({ ...s, ...patch });
  useEffect(() => {
    if (managing && custom.length === 0) setManaging(false);
  }, [managing, custom.length]);
  return (
    <section className="choose-screen choose-name-screen screen-enter" aria-labelledby="choose-name-heading">
      {managing ? (
        <button type="button" className="step-back" onClick={() => setManaging(false)}>
          ← {t.stepBack}
        </button>
      ) : (
        <Link className="step-back" href={backHref}>
          ← {t.stepBack}
        </Link>
      )}
      <h1 id="choose-name-heading">
        {managing
          ? s.kind === "mantra"
            ? t.savedMantras
            : t.savedNames
          : s.kind === "mantra"
            ? t.chooseMantra
            : t.chooseName}
      </h1>
      {managing ? (
        <SavedList
          settings={s}
          copy={t}
          choices={custom}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ) : (
        <NameSelection
          key={s.kind}
          settings={s}
          copy={t}
          choices={ranked}
          update={update}
          onChosen={onContinue}
          onAddOwn={onAddOwn}
          onManage={() => setManaging(true)}
        />
      )}
    </section>
  );
}
