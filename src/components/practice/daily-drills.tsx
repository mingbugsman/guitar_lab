import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type DailyDrillItem = { id: string; title: string; goal: string; reason: string; doneToday: boolean; locked: boolean };

/** Today's three hand drills: a short checklist that links straight into each drill. */
export function DailyDrills({ items, compact = false }: { items: DailyDrillItem[]; compact?: boolean }) {
  if (items.length === 0) return null;
  const done = items.filter((i) => i.doneToday).length;
  return (
    <div data-testid="daily-drills">
      <div className="flex items-baseline justify-between gap-3">
        <p className={cn(compact ? "gl-label" : "text-lg font-semibold")}>3 bài tập tay hôm nay</p>
        <p className="text-sm text-muted-foreground" data-testid="daily-drills-count">
          <span className="gl-num text-foreground">{done}</span>/<span className="gl-num">{items.length}</span> bài
        </p>
      </div>
      <ol className="mt-3 divide-y border-y">
        {items.map((d, i) => (
          <li key={d.id}>
            <Link
              href={`/practice/drills/${d.id}`}
              className="flex items-center gap-4 py-3 hover:bg-muted/50"
              data-testid={`daily-${d.id}`}
              data-done={d.doneToday || undefined}
            >
              <span
                className={cn(
                  "gl-num flex size-7 shrink-0 items-center justify-center rounded-full border text-sm",
                  d.doneToday && "border-[oklch(0.5_0.15_150)] bg-[oklch(0.5_0.15_150)] text-white",
                )}
                aria-label={d.doneToday ? "Đã tập hôm nay" : undefined}
              >
                {d.doneToday ? <Check className="size-4" /> : i + 1}
              </span>
              <span className="min-w-0 flex-1">
                <span className={cn("block font-medium", d.doneToday && "text-muted-foreground line-through decoration-1")}>{d.title}</span>
                <span className="block text-sm text-muted-foreground">
                  {d.reason}
                  {d.locked && " · bài học liên quan chưa xong, cứ tập thử"}
                </span>
              </span>
              <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
            </Link>
          </li>
        ))}
      </ol>
      {!compact && (
        <p className="mt-2 text-xs text-muted-foreground">
          Mỗi bài khoảng 2 đến 3 phút. Hôm nay tập 3 bài này, mai Guitar Lab chọn 3 bài khác theo kết quả của bạn.
        </p>
      )}
    </div>
  );
}

export function toDailyItems(
  picks: { drill: { id: string; title: string; goal: string }; reason: string; doneToday: boolean; locked: boolean }[],
): DailyDrillItem[] {
  return picks.map((p) => ({ id: p.drill.id, title: p.drill.title, goal: p.drill.goal, reason: p.reason, doneToday: p.doneToday, locked: p.locked }));
}
