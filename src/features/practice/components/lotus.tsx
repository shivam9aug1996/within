export function Lotus({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 64 64"
      fill="none"
      aria-hidden="true"
    >
      <path d="M32 49C17 40 22 24 32 12c10 12 15 28 0 37Z" />
      <path d="M32 49C17 49 9 37 9 25c13 1 23 10 23 24ZM32 49c15 0 23-12 23-24-13 1-23 10-23 24Z" />
      <path d="M32 49C18 55 6 48 3 38c9-3 20 0 29 11Zm0 0c14 6 26-1 29-11-9-3-20 0-29 11Z" />
    </svg>
  );
}
