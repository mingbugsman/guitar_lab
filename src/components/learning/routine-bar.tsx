import { cn } from "@/lib/utils";

export type RoutineSegment = {
  key: string;
  title: string;
  minutes: number;
  state?: "todo" | "current" | "done";
};

/**
 * The practice session drawn as a timeline: each segment is as wide as its share of the
 * session, so the learner sees where they are in the 30 minutes at a glance.
 */
export function RoutineBar({
  segments,
  className,
  minutesOnly = false,
}: {
  segments: RoutineSegment[];
  className?: string;
  /** Hide segment titles (for narrow columns); the screen-reader text keeps them. */
  minutesOnly?: boolean;
}) {
  const total = segments.reduce((s, a) => s + a.minutes, 0);
  return (
    <ol
      className={cn("flex w-full gap-1", className)}
      aria-label={`Buổi tập ${total} phút gồm ${segments.length} phần`}
      data-testid="routine-bar"
    >
      {segments.map((s) => (
        <li key={s.key} style={{ flexGrow: s.minutes, flexBasis: 0 }} className="min-w-0" data-state={s.state ?? "todo"}>
          <div
            className={cn(
              "h-2 rounded-[2px]",
              s.state === "done" && "bg-[var(--gl-highlight)]",
              s.state === "current" && "bg-foreground",
              (!s.state || s.state === "todo") && "bg-foreground/15",
            )}
          />
          <p className={cn("mt-1.5 truncate text-xs", s.state === "current" ? "font-semibold" : "text-muted-foreground")}>
            {!minutesOnly && <span className="hidden sm:inline">{s.title} </span>}
            <span className="gl-num">{s.minutes}′</span>
          </p>
          <span className="sr-only">
            {s.title}, {s.minutes} phút
            {s.state === "done" ? ", đã xong" : s.state === "current" ? ", đang làm" : ""}
          </span>
        </li>
      ))}
    </ol>
  );
}
