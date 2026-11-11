"use client";

import { useEffect } from "react";

/**
 * Keep the screen on while `active` (both hands are on the guitar, nobody can tap the screen
 * awake). Silently does nothing where the Screen Wake Lock API is missing.
 */
export function useWakeLock(active: boolean) {
  useEffect(() => {
    if (!active || typeof navigator === "undefined" || !("wakeLock" in navigator)) return;
    let lock: WakeLockSentinel | null = null;
    let cancelled = false;
    const request = async () => {
      try {
        lock = await navigator.wakeLock.request("screen");
        if (cancelled) void lock.release();
      } catch {
        /* denied or page hidden: the screen may dim, nothing else breaks */
      }
    };
    // the lock is dropped when the tab is hidden; take it again when the learner comes back
    const onVisible = () => {
      if (document.visibilityState === "visible" && !cancelled) void request();
    };
    void request();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      cancelled = true;
      document.removeEventListener("visibilitychange", onVisible);
      void lock?.release();
    };
  }, [active]);
}
