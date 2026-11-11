import { AlertTriangle, Eye, Lightbulb } from "lucide-react";
import type { Block } from "@/content/types";
import { cn } from "@/lib/utils";
import { HandText } from "./hand-text";
import { LessonVisual } from "./lesson-visual";

const CALLOUT = {
  tip: { icon: Lightbulb, title: "Mẹo", className: "border-[var(--gl-highlight)]/50 bg-[var(--gl-highlight)]/10" },
  warning: { icon: AlertTriangle, title: "Lưu ý", className: "border-destructive/30 bg-destructive/5" },
  compare: { icon: Eye, title: "Đối chiếu với đàn của bạn", className: "border-primary/40 bg-primary/5" },
} as const;

export function LessonBlocks({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((b, i) => {
        switch (b.type) {
          case "text":
            return (
              <section key={i} className="space-y-3">
                {b.heading && (
                  <h3 className="text-lg font-semibold">
                    <HandText text={b.heading} />
                  </h3>
                )}
                {b.paragraphs.map((p, j) => (
                  <p key={j} className="leading-relaxed">
                    <HandText text={p} />
                  </p>
                ))}
              </section>
            );
          case "visual":
            return (
              <figure key={i} className="space-y-2">
                <LessonVisual visual={b.visual} />
                {b.caption && (
                  <figcaption className="text-sm text-muted-foreground">
                    <HandText text={b.caption} />
                  </figcaption>
                )}
              </figure>
            );
          case "steps":
            return (
              <section key={i} className="space-y-2">
                <h3 className="text-lg font-semibold">
                  <HandText text={b.heading} />
                </h3>
                <ol className="space-y-2">
                  {b.items.map((item, j) => (
                    <li key={j} className="flex gap-3">
                      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                        {j + 1}
                      </span>
                      <span className="leading-relaxed">
                        <HandText text={item} />
                      </span>
                    </li>
                  ))}
                </ol>
              </section>
            );
          case "callout": {
            const c = CALLOUT[b.tone];
            const Icon = c.icon;
            return (
              <aside key={i} className={cn("flex gap-3 rounded-xl border p-4", c.className)} data-callout={b.tone}>
                <Icon className="mt-0.5 size-5 shrink-0" aria-hidden />
                <div>
                  <p className="text-sm font-semibold">{c.title}</p>
                  <p className="mt-1 text-sm leading-relaxed">
                    <HandText text={b.text} />
                  </p>
                </div>
              </aside>
            );
          }
        }
      })}
    </div>
  );
}
