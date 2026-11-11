"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  AVAILABLE_VIEWS,
  type FretboardView,
  type Handedness,
} from "./orientation";

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
      // a view saved earlier is ignored if it is not offered any more (e.g. Tab before it is taught)
      if (saved && (AVAILABLE_VIEWS as string[]).includes(saved))
        setViewState(saved as FretboardView);
    } catch {
      /* storage unavailable: keep default */
    }
  }, []);

  const setView = (v: FretboardView) => {
    if (!AVAILABLE_VIEWS.includes(v)) return;
    setViewState(v);
    try {
      localStorage.setItem(STORAGE_KEY, v);
    } catch {
      /* ignore */
    }
  };

  return (
    <GuitarViewContext.Provider
      value={{ view, setView, handedness, setHandedness }}
    >
      {children}
    </GuitarViewContext.Provider>
  );
}

export function useGuitarView(): Ctx {
  const ctx = useContext(GuitarViewContext);
  if (ctx) return ctx;
  // Fallback when rendered outside the provider (e.g. tests).
  return {
    view: "player",
    setView: () => {},
    handedness: "right",
    setHandedness: () => {},
  };
}
