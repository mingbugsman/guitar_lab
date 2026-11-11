import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { LEVELS, LESSONS } from "@/content/curriculum";
import { requireOnboardedProfile } from "@/lib/auth";
import { formatDate, formatDuration } from "@/lib/format";
import { getLessonProgress, getMilestones, getPracticeSessions, getPracticeTotals } from "@/features/progress/queries";
import { buildLearningState } from "@/features/progress/learning-state";
import { MILESTONES } from "@/features/progress/milestones";

export const metadata: Metadata = { title: "Tiến độ" };

const STATUS_LABEL = { learning: "Đang học", practicing: "Đang luyện", mastered: "Thành thạo" } as const;

export default async function ProgressPage() {
  await requireOnboardedProfile("/progress");
  const [progress, sessions, totals, milestones] = await Promise.all([
    getLessonProgress(),
    getPracticeSessions(10),
    getPracticeTotals(),
    getMilestones(),
  ]);
  const state = buildLearningState(progress);
  const achieved = new Map(milestones.map((m) => [m.milestone_key, m.achieved_at]));
  const started = LESSONS.filter((l) => progress.some((p) => p.lesson_slug === l.slug));
  const completedSessions = sessions.filter((s) => s.status === "completed");

  return (
    <div className="max-w-2xl">
      <PageHeader title="Tiến độ" description="Mọi con số ở đây đều tính từ những gì bạn đã thật sự học và tập." />

      {/* three numbers, read as one sentence of data rather than three cards */}
      <dl className="grid grid-cols-3 divide-x border-y">
        <div className="py-4 pr-4">
          <dt className="gl-label">Bài đã xong</dt>
          <dd className="gl-num mt-1 text-3xl font-semibold">
            {state.completedCount}
            <span className="text-lg font-normal text-muted-foreground">/{state.totalCount}</span>
          </dd>
        </div>
        <div className="px-4 py-4">
          <dt className="gl-label">Buổi tập</dt>
          <dd className="gl-num mt-1 text-3xl font-semibold">{totals.completedSessions}</dd>
        </div>
        <div className="py-4 pl-4">
          <dt className="gl-label">Đã tập</dt>
          <dd className="mt-1 text-xl leading-9 font-semibold">{formatDuration(totals.totalSeconds)}</dd>
        </div>
      </dl>

      <section className="mt-10" aria-labelledby="by-level">
        <h2 id="by-level" className="border-b border-foreground pb-2 text-lg font-semibold">
          Theo level
        </h2>
        <ul className="divide-y">
          {LEVELS.map((lv) => {
            const c = state.completedByLevel[lv.id];
            return (
              <li key={lv.id} className="py-3">
                <div className="flex justify-between gap-3 text-sm">
                  <span>
                    <span className="gl-num mr-2 text-muted-foreground">Level {lv.number}</span>
                    {lv.subtitle}
                  </span>
                  <span className="gl-num text-muted-foreground">
                    {c.completed}/{c.total}
                  </span>
                </div>
                <div className="mt-2 flex gap-0.5" aria-hidden>
                  {Array.from({ length: c.total }, (_, i) => (
                    <span key={i} className={i < c.completed ? "h-1.5 flex-1 rounded-[1px] bg-[var(--gl-highlight)]" : "h-1.5 flex-1 rounded-[1px] bg-foreground/15"} />
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="milestones">
        <h2 id="milestones" className="border-b border-foreground pb-2 text-lg font-semibold">
          Cột mốc
        </h2>
        <ul className="divide-y">
          {MILESTONES.map((m) => {
            const at = achieved.get(m.key);
            return (
              <li key={m.key} className="flex items-baseline gap-3 py-3" data-milestone={m.key} data-achieved={Boolean(at)}>
                <span className="flex w-5 shrink-0 justify-center">
                  {at ? (
                    <Check className="size-4 translate-y-0.5 text-[oklch(0.5_0.15_150)]" aria-label="Đã đạt" />
                  ) : (
                    <span className="size-1.5 rounded-full border border-foreground/40" aria-label="Chưa đạt" />
                  )}
                </span>
                <span className={at ? "flex-1 font-medium" : "flex-1 text-muted-foreground"}>
                  {m.title}
                  {!at && <span className="block text-sm">{m.description}</span>}
                </span>
                {at && <span className="shrink-0 text-xs text-muted-foreground">{formatDate(at)}</span>}
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-10" aria-labelledby="lessons">
        <h2 id="lessons" className="border-b border-foreground pb-2 text-lg font-semibold">
          Bài đã mở
        </h2>
        {started.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">
            Bạn chưa mở bài nào.{" "}
            <Link href="/academy" className="text-foreground underline underline-offset-4">
              Xem danh sách bài học
            </Link>
          </p>
        ) : (
          <ul className="divide-y">
            {started.map((l) => {
              const p = progress.find((x) => x.lesson_slug === l.slug)!;
              return (
                <li key={l.slug} className="flex items-baseline justify-between gap-3 py-3 text-sm">
                  <Link href={`/academy/${l.slug}`} className="font-medium underline-offset-4 hover:underline">
                    {l.title}
                  </Link>
                  <span className="shrink-0 text-muted-foreground">
                    {p.completed_at ? "Đã xong" : STATUS_LABEL[p.status]}
                    {p.self_rating ? (
                      <>
                        {" · tự chấm "}
                        <span className="gl-num">{p.self_rating}/5</span>
                      </>
                    ) : null}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-10" aria-labelledby="journal">
        <h2 id="journal" className="border-b border-foreground pb-2 text-lg font-semibold">
          Nhật ký tập gần đây
        </h2>
        {completedSessions.length === 0 ? (
          <p className="py-4 text-sm text-muted-foreground">Chưa có buổi tập nào được lưu.</p>
        ) : (
          <ul className="divide-y">
            {completedSessions.map((s) => (
              <li key={s.id} className="py-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span>{formatDate(s.started_at)}</span>
                  <span className="font-medium">{formatDuration(s.duration_seconds)}</span>
                </div>
                {s.notes && <p className="mt-1 text-muted-foreground">{s.notes}</p>}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
