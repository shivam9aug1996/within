import type { Settings } from "../lib/types";
import type { Copy } from "../lib/translations";
import { OptionGroup } from "./option-group";
export function modeSummary(settings: Settings, t: Copy) {
  if (settings.mode === "count")
    return `${t.count} · ${settings.target || t.open}`;
  if (settings.mode === "time")
    return `${t.time} · ${settings.minutes} ${t.minutes}`;
  return `${t.breath} · ${settings.breathSeconds}`;
}
export function ModeSettings({
  settings: s,
  copy: t,
  update,
}: {
  settings: Settings;
  copy: Copy;
  update: (patch: Partial<Settings>) => void;
}) {
  return (
    <div className="mode-settings">
      {s.mode === "count" ? (
        <>
          <span>{t.target}</span>
          <OptionGroup
            label={t.target}
            value={s.target}
            onChange={(target) => update({ target })}
            options={[11, 27, 54, 108, 0].map((value) => ({
              value,
              label: value || t.open,
            }))}
          />
        </>
      ) : s.mode === "time" ? (
        <>
          <span>{t.time}</span>
          <OptionGroup
            label={t.minutes}
            value={s.minutes}
            onChange={(minutes) => update({ minutes })}
            options={[1, 5, 10, 15, 30].map((value) => ({
              value,
              label: `${value} ${t.minutes}`,
            }))}
          />
        </>
      ) : (
        <>
          <span>{t.pace}</span>
          <OptionGroup
            label={t.pace}
            value={s.breathSeconds}
            onChange={(breathSeconds) => update({ breathSeconds })}
            options={[3, 4, 5, 6].map((value) => ({ value, label: value }))}
          />
        </>
      )}
    </div>
  );
}