"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, Sparkles, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LATEST_UPDATE_AT, UPDATES, unseenUpdates, type UpdateEntry } from "@/content/changelog";
import { markUpdatesSeen } from "@/features/profile/updates-actions";
import { isFocusRoute } from "./nav-items";

const STORAGE_KEY = "gl.updates-seen-at";

function readLocal(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

/**
 * "Có gì mới": a notice at the top of the page listing updates the visitor has not seen yet.
 * Signed-in learners: the server passes when they last dismissed it (synced across devices).
 * Visitors: remembered in this browser. Hidden on lesson/drill screens (hands on the guitar).
 */
export function WhatsNew({
  signedIn,
  seenAt,
  accountCreatedAt,
}: {
  signedIn: boolean;
  seenAt: string | null;
  accountCreatedAt: string | null;
}) {
  const pathname = usePathname();
  const [entries, setEntries] = useState<UpdateEntry[] | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // the newest of the server value and this browser's value wins
    const local = readLocal();
    const times = [seenAt, local].filter((t): t is string => Boolean(t) && !Number.isNaN(Date.parse(t!)));
    const seen = times.length ? new Date(Math.max(...times.map((t) => Date.parse(t)))).toISOString() : null;
    setEntries(unseenUpdates(UPDATES, { seenAt: seen, accountCreatedAt }));
  }, [seenAt, accountCreatedAt]);

  if (!entries || entries.length === 0 || isFocusRoute(pathname) || pathname === "/updates") return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, new Date(Math.max(Date.now(), Date.parse(LATEST_UPDATE_AT))).toISOString());
    } catch {
      /* storage unavailable: the notice comes back next visit, nothing breaks */
    }
    setEntries([]);
    if (signedIn) void markUpdatesSeen();
  };

  const [newest, ...rest] = entries;
  return (
    <aside aria-label="Có gì mới" className="mb-6 rounded-lg border border-foreground/20 bg-card px-4 py-3" data-testid="whats-new">
      <div className="flex items-start gap-3">
        <Sparkles className="mt-0.5 size-4 shrink-0 text-[var(--gl-finger)]" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="text-sm">
            <span className="font-semibold">Có gì mới:</span> {newest.title}
            {rest.length > 0 && <span className="text-muted-foreground"> và {rest.length} cập nhật khác</span>}
          </p>
          {open && (
            <div className="mt-3 space-y-4" data-testid="whats-new-list">
              {entries.map((e) => (
                <section key={e.id}>
                  <p className="text-sm font-semibold">{e.title}</p>
                  <ul className="mt-1 space-y-1 text-sm text-muted-foreground">
                    {e.items.map((it) => (
                      <li key={it} className="flex gap-2">
                        <span aria-hidden className="mt-2 h-px w-2.5 shrink-0 bg-foreground/40" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                  {e.href && (
                    <Link href={e.href} onClick={dismiss} className="mt-1.5 inline-flex items-center gap-1 text-sm underline underline-offset-4">
                      Thử ngay <ArrowRight className="size-3.5" />
                    </Link>
                  )}
                </section>
              ))}
              <Link href="/updates" className="inline-block text-xs text-muted-foreground underline underline-offset-4">
                Xem mọi cập nhật
              </Link>
            </div>
          )}
          <div className="mt-2 flex flex-wrap gap-2">
            {!open && (
              <Button size="sm" variant="outline" onClick={() => setOpen(true)} data-testid="whats-new-open">
                <ChevronDown /> Xem chi tiết
              </Button>
            )}
            <Button size="sm" variant="ghost" onClick={dismiss} data-testid="whats-new-dismiss">
              Đã xem
            </Button>
          </div>
        </div>
        <button type="button" onClick={dismiss} aria-label="Đóng thông báo" className="-mr-1 rounded p-1 text-muted-foreground hover:bg-muted">
          <X className="size-4" />
        </button>
      </div>
    </aside>
  );
}
