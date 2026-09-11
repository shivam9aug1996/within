import { useEffect } from "react";
import { setWakeLock } from "../lib/wake-lock";
export function useWakeLock(active: boolean) {
  useEffect(() => {
    setWakeLock(active);
    return () => setWakeLock(false);
  }, [active]);
}
