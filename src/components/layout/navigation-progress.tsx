"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

/** Gives up after this long, so a navigation that never lands cannot leave the bar stuck. */
const GIVE_UP_MS = 15_000;
/** A page that is already prefetched lands faster than this: no bar, no flash. */
const SHOW_AFTER_MS = 80;

/**
 * A thin bar along the top edge from the moment a learner taps an internal link until the new
 * page arrives, so a slow server never looks like a frozen app.
 *
 * Not a loading.tsx: a Suspense boundary there leaves a server action that calls
 * revalidatePath (ticking a lesson checklist) stuck pending now and then in Next 15.
 * This only listens to clicks and to the path; it never touches how pages render.
 */
export function NavigationProgress() {
  const pathname = usePathname();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const timers = useRef<number[]>([]);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest?.("a");
      if (!a || !a.href || a.target === "_blank" || a.hasAttribute("download")) return;
      const to = new URL(a.href, window.location.href);
      if (to.origin !== window.location.origin) return;
      // same page, or a jump to a heading on it: nothing to wait for
      if (to.pathname === window.location.pathname && to.search === window.location.search) return;
      clear();
      timers.current.push(
        window.setTimeout(() => setState("loading"), SHOW_AFTER_MS),
        window.setTimeout(() => setState("idle"), GIVE_UP_MS),
      );
    };
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
      clear();
    };
  }, []);

  // the new page is here: fill the bar for a moment, then remove it
  useEffect(() => {
    clear();
    setState((s) => (s === "loading" ? "done" : "idle"));
    timers.current.push(window.setTimeout(() => setState("idle"), 300));
  }, [pathname]);

  if (state === "idle") return null;
  return (
    <div
      role="progressbar"
      aria-label="Đang chuyển trang"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-[3px]"
      data-testid="navigation-progress"
    >
      <div
        className={
          state === "loading"
            ? "h-full w-[85%] origin-left animate-[nav-progress_8s_cubic-bezier(0.1,0.7,0.2,1)_both] bg-primary motion-reduce:animate-none"
            : "h-full w-full bg-primary"
        }
      />
    </div>
  );
}
