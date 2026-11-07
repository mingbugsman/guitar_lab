import type { Metadata } from "next";
import Link from "next/link";
import { Award, CheckCircle2, Lock } from "lucide-react";
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

  return (
    <>
      <PageHeader eyebrow="My Progress" title="Tiến độ của tôi" description="Mọi số liệu ở đây được tính từ dữ liệu luyện tập thật của bạn." />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Bài đã hoàn thành</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">
            {state.completedCount}/{state.totalCount}
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Buổi tập</p>
          <p className="mt-1 text-2xl font-bold tabular-nums">{totals.completedSessions}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <p className="text-sm text-muted-foreground">Tổng thời gian luyện</p>
          <p className="mt-1 text-2xl font-bold">{formatDuration(totals.totalSeconds)}</p>
        </div>
      </div>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">Theo level</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {LEVELS.map((lv) => {
            const c = state.completedByLevel[lv.id];
            const pct = c.total ? Math.round((c.completed / c.total) * 100) : 0;
            return (
              <div key={lv.id} className="rounded-2xl border bg-card p-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Level {lv.number} · {lv.title}</span>
                  <span className="tabular-nums">{c.completed}/{c.total}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">Cột mốc</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {MILESTONES.map((m) => {
            const at = achieved.get(m.key);
            return (
              <li key={m.key} className={`flex gap-3 rounded-2xl border p-4 ${at ? "bg-card" : "bg-muted/50 text-muted-foreground"}`} data-milestone={m.key} data-achieved={Boolean(at)}>
                {at ? <Award className="size-6 shrink-0 text-primary" aria-hidden /> : <Lock className="size-6 shrink-0" aria-hidden />}
                <div>
                  <p className="font-medium">{m.title}</p>
                  <p className="text-sm">{at ? `Đạt ${formatDate(at)}` : m.description}</p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">Bài học</h2>
        {started.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Chưa bắt đầu bài nào. <Link href="/academy" className="text-primary hover:underline">Mở Academy →</Link>
          </p>
        ) : (
          <ul className="divide-y rounded-2xl border bg-card">
            {started.map((l) => {
              const p = progress.find((x) => x.lesson_slug === l.slug)!;
              return (
                <li key={l.slug} className="flex items-center justify-between gap-3 px-4 py-3 text-sm">
                  <Link href={`/academy/${l.slug}`} className="flex items-center gap-2 font-medium hover:underline">
                    {p.completed_at && <CheckCircle2 className="size-4 text-[oklch(0.55_0.15_150)]" aria-hidden />}
                    {l.title}
                  </Link>
                  <span className="shrink-0 text-muted-foreground">
                    {p.completed_at ? "Hoàn thành" : STATUS_LABEL[p.status]}
                    {p.self_rating ? ` · tự đánh giá ${p.self_rating}/5` : ""}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="mt-6 space-y-3">
        <h2 className="text-lg font-semibold">Nhật ký luyện tập gần đây</h2>
        {sessions.filter((s) => s.status === "completed").length === 0 ? (
          <p className="text-sm text-muted-foreground">Chưa có buổi tập nào được lưu.</p>
        ) : (
          <ul className="divide-y rounded-2xl border bg-card">
            {sessions
              .filter((s) => s.status === "completed")
              .map((s) => (
                <li key={s.id} className="px-4 py-3 text-sm">
                  <div className="flex justify-between">
                    <span>{formatDate(s.started_at)}</span>
                    <span className="tabular-nums">{formatDuration(s.duration_seconds)}</span>
                  </div>
                  {s.notes && <p className="mt-1 text-muted-foreground">“{s.notes}”</p>}
                </li>
              ))}
          </ul>
        )}
      </section>
    </>
  );
}
