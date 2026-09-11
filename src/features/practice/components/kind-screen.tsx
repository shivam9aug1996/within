import type { Copy } from "../lib/translations";
import type { Kind } from "../lib/types";
interface Props {
  copy: Copy;
  selectedKind?: Kind;
  onChoose: (kind: Kind) => void;
}
export function KindScreen({ copy: t, selectedKind, onChoose }: Props) {
  return (
    <section className="choose-screen screen-enter" aria-labelledby="choose-kind-heading">
      <p className="eyebrow">{t.chooseKind}</p>
      <h1 id="choose-kind-heading">{t.chooseKindTitle}</h1>
      <p className="intro">{t.chooseKindHint}</p>
      <div className="kind-cards">
        <button
          type="button"
          className={selectedKind === "naam" ? "selected" : ""}
          aria-pressed={selectedKind ? selectedKind === "naam" : undefined}
          onClick={() => onChoose("naam")}
        >
          <span className="option-symbol">र</span>
          <span>
            <strong>{t.naam}</strong>
            <small>{t.naamHint}</small>
          </span>
        </button>
        <button
          type="button"
          className={selectedKind === "mantra" ? "selected" : ""}
          aria-pressed={selectedKind ? selectedKind === "mantra" : undefined}
          onClick={() => onChoose("mantra")}
        >
          <span className="option-symbol">ॐ</span>
          <span>
            <strong>{t.mantra}</strong>
            <small>{t.mantraHint}</small>
          </span>
        </button>
      </div>
      <p className="privacy-note">
        <span aria-hidden="true">♧</span> {t.private}
      </p>
    </section>
  );
}