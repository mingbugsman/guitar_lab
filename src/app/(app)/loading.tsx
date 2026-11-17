/**
 * Shown the instant a learner taps a link, while the server checks the session and loads the
 * page's data. Without it the old page just sits there until everything arrives, which feels
 * like the app froze. It also lets Next prefetch only this cheap shell for links on screen,
 * not a full render of every page they point to.
 */
export default function Loading() {
  return (
    <div role="status" aria-label="Đang tải trang" className="animate-pulse space-y-6 motion-reduce:animate-none">
      <div className="h-8 w-2/3 max-w-sm rounded-md bg-muted" />
      <div className="space-y-3">
        <div className="h-4 w-full rounded bg-muted" />
        <div className="h-4 w-5/6 rounded bg-muted" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-28 rounded-lg bg-muted" />
        <div className="h-28 rounded-lg bg-muted" />
      </div>
      <span className="sr-only">Đang tải…</span>
    </div>
  );
}
