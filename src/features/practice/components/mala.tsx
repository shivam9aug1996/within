export function Mala({
  filled,
  total,
}: {
  filled: number;
  total: number;
}) {
  const gap = 0.22;
  const span = Math.PI * 2 - gap;
  const start = -Math.PI / 2 + gap / 2;
  const radius = 47;
  const bead = total <= 27 ? 2.2 : total <= 54 ? 1.55 : 1.2;
  const beads = Array.from({ length: total }, (_, index) => {
    const angle = start + (index / total) * span;
    const on = index < filled;
    return (
      <circle
        key={index}
        className={on ? "is-filled" : undefined}
        cx={50 + radius * Math.cos(angle)}
        cy={50 + radius * Math.sin(angle)}
        r={on ? bead : bead * 0.7}
      />
    );
  });
  return (
    <svg className="mala-ring" viewBox="0 0 100 100" aria-hidden="true">
      {beads}
    </svg>
  );
}
