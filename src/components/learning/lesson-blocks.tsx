import { AlertTriangle, Eye, Lightbulb } from "lucide-react";
import type { Block } from "@/content/types";
import { cn } from "@/lib/utils";
import { HandText } from "./hand-text";
import { LessonVisual } from "./lesson-visual";

const CALLOUT = {
  tip: { icon: Lightbulb, title: "Mẹo", className: "border-[var(--gl-highlight)]" },
  warning: { icon: AlertTriangle, title: "Lưu ý", className: "border-destructive" },
  compare: { icon: Eye, title: "Đối chiếu với đàn của bạn", className: "border-foreground" },
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
                      <span className="gl-num w-5 shrink-0 pt-0.5 text-sm text-muted-foreground">
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
              <aside key={i} className={cn("flex gap-3 border-l-2 py-1 pl-4", c.className)} data-callout={b.tone}>
                <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} aria-hidden />
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
