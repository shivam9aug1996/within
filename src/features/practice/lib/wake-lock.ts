type ScreenLock = {
  request: (type: "screen") => Promise<{
    released: boolean;
    release: () => Promise<void>;
    addEventListener: (type: "release", listener: () => void) => void;
  }>;
};
type Page = Pick<Document, "hidden" | "addEventListener" | "removeEventListener">;
export function attachWakeLock({
  wakeLock = typeof navigator !== "undefined" ? navigator.wakeLock : undefined,
  document: page = typeof document !== "undefined" ? document : undefined,
}: {
  wakeLock?: ScreenLock;
  document?: Page;
} = {}) {
  let lock: Awaited<ReturnType<ScreenLock["request"]>> | null = null;
  let wanted = false;
  let closed = false;
  const request = async () => {
    if (closed || !wanted || !wakeLock || !page || page.hidden) return;
    if (lock && !lock.released) return;
    const doc = page;
    try {
      const next = await wakeLock.request("screen");
      if (closed || !wanted || doc.hidden) {
        void next.release();
        return;
      }
      lock = next;
      lock.addEventListener("release", () => {
        lock = null;
      });
    } catch {
      lock = null;
    }
  };
  const onVisible = () => {
    if (page && !page.hidden) void request();
  };
  const onGesture = () => {
    void request();
  };
  page?.addEventListener("visibilitychange", onVisible);
  page?.addEventListener("pointerdown", onGesture);
  return {
    setActive(active: boolean) {
      wanted = active;
      if (!active) {
        const current = lock;
        lock = null;
        void current?.release();
        return;
      }
      void request();
    },
    stop() {
      closed = true;
      wanted = false;
      page?.removeEventListener("visibilitychange", onVisible);
      page?.removeEventListener("pointerdown", onGesture);
      const current = lock;
      lock = null;
      void current?.release();
    },
  };
}
let shared: ReturnType<typeof attachWakeLock> | null = null;
export function setWakeLock(active: boolean) {
  if (typeof window === "undefined") return;
  if (!shared) shared = attachWakeLock();
  shared.setActive(active);
}
