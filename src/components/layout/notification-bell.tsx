"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";
import { LATEST_UPDATE_AT, UPDATES, unseenUpdates } from "@/content/changelog";
import { markUpdatesSeen } from "@/features/profile/updates-actions";
import { formatDate } from "@/lib/format";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "gl.updates-seen-at";

function readLocal(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/** Newest valid timestamp of the server value (signed in) and this browser's value. */
function latest(...times: (string | null)[]): string | null {
  const ok = times.filter((t): t is string => Boolean(t) && !Number.isNaN(Date.parse(t!)));
  return ok.length ? new Date(Math.max(...ok.map((t) => Date.parse(t)))).toISOString() : null;
}

/**
 * "Có gì mới" as a bell, like a social app: a red badge counts updates not seen yet; opening the
 * panel lists them (new ones marked) and clears the badge. Signed-in learners: synced on the
 * profile. Visitors: remembered in this browser.
 */
export function NotificationBell({
  signedIn,
  seenAt,
  accountCreatedAt,
  placement = "sidebar",
}: {
  signedIn: boolean;
  seenAt: string | null;
  accountCreatedAt: string | null;
  /** sidebar: panel opens to the right; header: panel drops below, full width on phones. */
  placement?: "sidebar" | "header";
}) {
  const [unseenIds, setUnseenIds] = useState<string[]>([]);
  const [badge, setBadge] = useState(0);
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ids = unseenUpdates(UPDATES, { seenAt: latest(seenAt, readLocal()), accountCreatedAt }).map((u) => u.id);
    setUnseenIds(ids);
    setBadge(ids.length);
  }, [seenAt, accountCreatedAt]);

  // close on outside click or Escape
  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (root.current && !root.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const markSeen = () => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date(Math.max(Date.now(), Date.parse(LATEST_UPDATE_AT))).toISOString());
    } catch {
      /* storage unavailable: the badge comes back next visit, nothing breaks */
    }
    if (signedIn) void markUpdatesSeen();
  };

  const toggle = () => {
    const next = !open;
    setOpen(next);
    // opening = read: the badge clears, entries keep their "Mới" mark while the panel is open
    if (next && badge > 0) {
      setBadge(0);
      markSeen();
    }
    if (!next) setUnseenIds([]);
  };

  const now = Date.now();
  const published = UPDATES.filter((u) => Date.parse(u.publishedAt) <= now).slice(0, 6);

  return (
    <div ref={root} className="relative" data-testid={`bell-${placement}`}>
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={badge ? `Có gì mới, ${badge} cập nhật chưa xem` : "Có gì mới"}
        className="relative flex size-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
        data-testid="bell-button"
      >
        <Bell className="size-5" strokeWidth={1.75} />
        {badge > 0 && (
          <span
            className="gl-num absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-semibold text-white ring-2 ring-background"
            data-testid="bell-badge"
          >
            {badge > 9 ? "9+" : badge}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Có gì mới"
          className={cn(
            "z-50 max-h-[70dvh] overflow-y-auto rounded-lg border bg-card shadow-lg",
            placement === "sidebar"
              ? "absolute top-0 left-full ml-3 w-[22rem]"
              : "fixed inset-x-2 top-14 sm:absolute sm:inset-x-auto sm:top-full sm:right-0 sm:mt-2 sm:w-[22rem]",
          )}
          data-testid="bell-panel"
        >
          <div className="flex items-baseline justify-between border-b px-4 py-3">
            <p className="font-semibold">Có gì mới</p>
            <Link href="/updates" onClick={() => setOpen(false)} className="text-xs text-muted-foreground underline underline-offset-4">
              Xem tất cả
            </Link>
          </div>
          <ul className="divide-y">
            {published.map((u) => {
              const fresh = unseenIds.includes(u.id);
              return (
                <li key={u.id} className={cn("px-4 py-3", fresh && "bg-[color-mix(in_oklch,var(--gl-finger)_7%,transparent)]")} data-fresh={fresh || undefined}>
                  <div className="flex items-start gap-2">
                    <span
                      aria-hidden
                      className={cn("mt-1.5 size-2 shrink-0 rounded-full", fresh ? "bg-[var(--gl-finger)]" : "bg-transparent")}
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">
                        {u.title}
                        {fresh && <span className="ml-1.5 text-xs font-medium text-[var(--gl-finger)]">Mới</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDate(u.publishedAt)}</p>
                      <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{u.items[0]}</p>
                      {u.href && (
                        <Link
                          href={u.href}
                          onClick={() => setOpen(false)}
                          className="mt-1 inline-flex items-center gap-1 text-sm underline underline-offset-4"
                        >
                          Thử ngay <ArrowRight className="size-3.5" />
                        </Link>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
