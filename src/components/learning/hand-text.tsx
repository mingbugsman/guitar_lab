"use client";

import { useGuitarView } from "@/components/guitar/view-context";
import { resolveHandedness } from "@/content/handedness";

/** Lesson text whose left/right words follow the learner's handedness, like the pictures do. */
export function HandText({ text }: { text: string }) {
  const { handedness } = useGuitarView();
  return <>{resolveHandedness(text, handedness)}</>;
}
