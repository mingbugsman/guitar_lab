"use client";

import { cn } from "@/lib/utils";
import { VIEW_LABELS, type FretboardView } from "./orientation";
import { useGuitarView } from "./view-context";

export function ViewToggle({ className, showHint = true }: { className?: string; showHint?: boolean }) {
  const { view, setView, handedness, setHandedness } = useGuitarView();
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <div role="radiogroup" aria-label="Góc nhìn cần đàn" className="inline-flex rounded-lg border bg-muted p-0.5">
          {(Object.keys(VIEW_LABELS) as FretboardView[]).map((v) => (
            <button
              key={v}
              type="button"
              role="radio"
              aria-checked={view === v}
              onClick={() => setView(v)}
              className={cn(
                "min-h-9 rounded-md px-3 text-xs font-medium transition-colors sm:text-sm",
                view === v ? "bg-card shadow-sm" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {VIEW_LABELS[v].title}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setHandedness(handedness === "right" ? "left" : "right")}
          aria-pressed={handedness === "left"}
          className="min-h-9 rounded-lg border px-3 text-xs font-medium hover:bg-muted sm:text-sm"
        >
          {handedness === "right" ? "Đàn tay phải" : "Đàn tay trái"} ⇄
        </button>
      </div>
      {showHint && <p className="text-xs text-muted-foreground">{VIEW_LABELS[view].hint}</p>}
    </div>
  );
}
