import type { ReactNode } from "react";
interface Props<T extends string | number> {
  label: string;
  value: T;
  options: { value: T; label: ReactNode }[];
  onChange: (value: T) => void;
  className?: string;
}
export function OptionGroup<T extends string | number>({
  label,
  value,
  options,
  onChange,
  className = "",
}: Props<T>) {
  return (
    <div
      role="group"
      aria-label={label}
      className={`option-group ${className}`}
    >
      {options.map((option) => (
        <button
          type="button"
          key={option.value}
          aria-pressed={value === option.value}
          className={value === option.value ? "selected" : ""}
          onClick={() => onChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
