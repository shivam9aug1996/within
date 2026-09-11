import { useState } from "react";
import { choiceSelection, type RankedChoice } from "../lib/saved-choices";
import type { Settings } from "../lib/types";
import type { Copy } from "../lib/translations";
import { ChoiceText } from "./choice-text";
import { OptionGroup } from "./option-group";
interface Props {
  settings: Settings;
  copy: Copy;
  choices: RankedChoice[];
  update: (patch: Partial<Settings>) => void;
  onChosen: () => void;
  onAddOwn: () => void;
  onManage: () => void;
}
export function NameSelection({
  settings: s,
  copy: t,
  choices,
  update,
  onChosen,
  onAddOwn,
  onManage,
}: Props) {
  const selected =
    s.selection === "custom"
      ? choices.find((item) => item.custom && item.text === s.custom)
      : choices.find((item) => item.id === s.selection);
  const saved = choices.filter((item) => item.custom);
  return (
    <>
      <p className="choice-hint">
        {s.kind === "mantra" ? t.tapMantra : t.tapName}
      </p>
      <OptionGroup
        label={t.choose}
        className={`name-options ${s.kind}`}
        value={selected?.id ?? ""}
        onChange={(id) => {
          if (id === "new") {
            onAddOwn();
            return;
          }
          const item = choices.find((choice) => choice.id === id);
          if (item) {
            update(choiceSelection(item));
            onChosen();
          }
        }}
        options={[
          ...choices.map((item) => ({
            value: item.id,
            label: (
              <ChoiceText
                text={item.text}
                hindi={item.hindi}
                english={item.english}
                language={s.language}
              />
            ),
          })),
          {
            value: "new",
            label: (
              <>
                <span className="custom-plus" aria-hidden="true">
                  ＋
                </span>
                <small>{t.own}</small>
              </>
            ),
          },
        ]}
      />
      {saved.length > 0 && (
        <button type="button" className="text-button manage-saved" onClick={onManage}>
          {s.kind === "mantra" ? t.manageMantras : t.manageNames}
        </button>
      )}
    </>
  );
}
export function SavedList({
  settings: s,
  copy: t,
  choices,
  onEdit,
  onDelete,
}: {
  settings: Settings;
  copy: Copy;
  choices: RankedChoice[];
  onEdit: (choice: RankedChoice) => void;
  onDelete: (choice: RankedChoice) => void;
}) {
  const [pending, setPending] = useState("");
  return (
    <ul className="saved-list">
      {choices.map((item) => (
        <li key={item.id} className="saved-row">
          <ChoiceText
            text={item.text}
            hindi={item.hindi}
            english={item.english}
            language={s.language}
          />
          {pending === item.id ? (
            <div className="saved-row-confirm">
              <p>{s.kind === "mantra" ? t.confirmDeleteMantra : t.confirmDeleteName}</p>
              <div className="saved-row-actions">
                <button type="button" className="secondary-button" onClick={() => setPending("")}>
                  {t.keep}
                </button>
                <button
                  type="button"
                  className="secondary-button"
                  onClick={() => {
                    onDelete(item);
                    setPending("");
                  }}
                >
                  {t.delete}
                </button>
              </div>
            </div>
          ) : (
            <div className="saved-row-actions">
              <button type="button" className="secondary-button" onClick={() => onEdit(item)}>
                {t.edit}
              </button>
              <button type="button" className="secondary-button" onClick={() => setPending(item.id)}>
                {t.delete}
              </button>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
