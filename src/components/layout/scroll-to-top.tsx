"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Start every new screen at the top. Without this, arriving from a long page (e.g. the
 * onboarding form, submitted from its bottom) can leave the next page scrolled past its title.
 * Browser back/forward keeps its own restored position.
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const popped = useRef(false);

  useEffect(() => {
    const onPop = () => {
      popped.current = true;
    };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useEffect(() => {
    if (popped.current) {
      popped.current = false;
      return;
    }
    if (!window.location.hash) window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
