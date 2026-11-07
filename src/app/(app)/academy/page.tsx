import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Circle, CircleDot } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { LEVELS, lessonsForLevel } from "@/content/curriculum";
import { requireOnboardedProfile } from "@/lib/auth";
import { getLessonProgress } from "@/features/progress/queries";
import { buildLearningState } from "@/features/progress/learning-state";

export const metadata: Metadata = { title: "Academy" };

export default async function AcademyPage() {
  await requireOnboardedProfile("/academy");
  const progress = await getLessonProgress();
  const state = buildLearningState(progress);
  const bySlug = new Map(progress.map((p) => [p.lesson_slug, p]));

  return (
    <>
      <PageHeader
        eyebrow="Guitar Academy"
        title="Lộ trình học"
        description="Học theo thứ tự. Mỗi bài: hiểu → nhìn & nghe → luyện → áp dụng → tự đánh giá. Bạn có thể mở bất kỳ bài nào, nhưng nên hoàn thành bài trước."
      />
      <div className="space-y-8">
        {LEVELS.map((level) => {
          const lessons = lessonsForLevel(level.id);
          const done = state.completedByLevel[level.id];
          return (
            <section key={level.id} aria-labelledby={`${level.id}-title`} className="space-y-3">
              <div className="flex flex-wrap items-end justify-between gap-2">
                <div>
                  <p className="text-xs font-semibold text-primary uppercase">Level {level.number}</p>
                  <h2 id={`${level.id}-title`} className="text-xl font-bold">
                    {level.title} — {level.subtitle}
                  </h2>
                  <p className="text-sm text-muted-foreground">Đầu ra: {level.outcome}</p>
                  {level.note && <p className="mt-1 text-xs text-muted-foreground">{level.note}</p>}
                </div>
                <span className="text-sm font-medium tabular-nums">
                  {done.completed}/{done.total} bài
                </span>
              </div>
              <ol className="divide-y overflow-hidden rounded-2xl border bg-card">
                {lessons.map((lesson) => {
                  const p = bySlug.get(lesson.slug);
                  const isNext = state.nextLesson?.slug === lesson.slug;
                  const Icon = p?.completed_at ? CheckCircle2 : p ? CircleDot : Circle;
                  return (
                    <li key={lesson.slug}>
                      <Link
                        href={`/academy/${lesson.slug}`}
                        className="flex min-h-16 items-center gap-3 px-4 py-3 transition-colors hover:bg-muted"
                      >
                        <Icon
                          className={
                            p?.completed_at
                              ? "size-5 shrink-0 text-[oklch(0.55_0.15_150)]"
                              : p
                                ? "size-5 shrink-0 text-primary"
                                : "size-5 shrink-0 text-muted-foreground"
                          }
                          aria-hidden
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">
                            <span className="mr-1 text-muted-foreground tabular-nums">{lesson.order}.</span>
                            {lesson.title}
                          </p>
                          <p className="truncate text-sm text-muted-foreground">{lesson.summary}</p>
                        </div>
                        <div className="hidden shrink-0 text-right text-xs text-muted-foreground sm:block">
                          {isNext && <span className="mb-1 block rounded-full bg-primary px-2 py-0.5 text-primary-foreground">Bài tiếp theo</span>}
                          {lesson.minutes} phút
                        </div>
                        <span className="sr-only">
                          {p?.completed_at ? "Đã hoàn thành" : p ? "Đang học" : "Chưa bắt đầu"}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ol>
            </section>
          );
        })}
      </div>
    </>
  );
}
