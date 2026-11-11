"use client";

import { useEffect, useRef, useState } from "react";
import { Fretboard, type FretboardProps } from "./fretboard";

/**
 * A fretboard that lays itself out for the width it actually has. Phones get narrower frets
 * and tucked-away labels instead of a picture you have to scroll sideways.
 */
export function FittedFretboard(props: Omit<FretboardProps, "fitWidth">) {
  const ref = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => setWidth(Math.floor(el.clientWidth) || undefined);
    measure();
    if (typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={ref} className="w-full min-w-0">
      <Fretboard {...props} fitWidth={width} />
    </div>
  );
}
