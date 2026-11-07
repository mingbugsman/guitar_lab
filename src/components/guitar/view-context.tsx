"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { FretboardView, Handedness } from "./orientation";

type Ctx = {
  view: FretboardView;
  setView: (v: FretboardView) => void;
  handedness: Handedness;
  setHandedness: (h: Handedness) => void;
};

const GuitarViewContext = createContext<Ctx | null>(null);
const STORAGE_KEY = "gl.fretboard-view";

export function GuitarViewProvider({
  children,
  handedness: initialHandedness = "right",
}: {
  children: ReactNode;
  handedness?: Handedness;
}) {
  const [view, setViewState] = useState<FretboardView>("player");
  const [handedness, setHandedness] = useState<Handedness>(initialHandedness);

  useEffect(() => setHandedness(initialHandedness), [initialHandedness]);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "player" || saved === "tab") setViewState(saved);
    } catch {
      /* storage unavailable: keep default */
    }
  }, []);

  const setView = (v: FretboardView) => {
    setViewState(v);
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch {
      /* ignore */
    }
  };

  return (
    <GuitarViewContext.Provider value={{ view, setView, handedness, setHandedness }}>{children}</GuitarViewContext.Provider>
  );
}

export function useGuitarView(): Ctx {
  const ctx = useContext(GuitarViewContext);
  if (ctx) return ctx;
  // Fallback when rendered outside the provider (e.g. tests).
  return { view: "player", setView: () => {}, handedness: "right", setHandedness: () => {} };
}
