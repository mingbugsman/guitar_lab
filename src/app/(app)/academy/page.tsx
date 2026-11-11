import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { LEVELS, lessonsForLevel } from "@/content/curriculum";
import { requireOnboardedProfile } from "@/lib/auth";
import { getLessonProgress } from "@/features/progress/queries";
import { buildLearningState } from "@/features/progress/learning-state";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Bài học" };

export default async function AcademyPage() {
  await requireOnboardedProfile("/academy");
  const progress = await getLessonProgress();
  const state = buildLearningState(progress);
  const bySlug = new Map(progress.map((p) => [p.lesson_slug, p]));

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Bài học"
        description="Học lần lượt từ trên xuống. Bạn mở bài nào cũng được, nhưng bài sau dùng lại những gì bài trước đã dạy."
      />
      <div className="space-y-12">
        {LEVELS.map((level) => {
          const lessons = lessonsForLevel(level.id);
          const done = state.completedByLevel[level.id];
          return (
            <section key={level.id} aria-labelledby={`${level.id}-title`}>
              <div className="flex items-end justify-between gap-3 border-b border-foreground pb-2">
                <h2 id={`${level.id}-title`} className="text-lg font-semibold">
                  <span className="gl-num mr-2 text-muted-foreground">Level {level.number}</span>
                  {level.subtitle}
                </h2>
                <span className="gl-num text-sm text-muted-foreground">
                  {done.completed}/{done.total}
                </span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{level.outcome}</p>
              {level.note && <p className="mt-1 text-xs text-muted-foreground">{level.note}</p>}
              <ol className="mt-3 divide-y">
                {lessons.map((lesson) => {
                  const p = bySlug.get(lesson.slug);
                  const isNext = state.nextLesson?.slug === lesson.slug;
                  const status = p?.completed_at ? "Đã xong" : p ? "Đang học" : "Chưa học";
                  return (
                    <li key={lesson.slug}>
                      <Link href={`/academy/${lesson.slug}`} className="group flex min-h-14 items-baseline gap-3 py-3">
                        <span className="gl-num w-6 shrink-0 text-sm text-muted-foreground">{String(lesson.order).padStart(2, "0")}</span>
                        <span className="min-w-0 flex-1">
                          <span className={cn("underline-offset-4 group-hover:underline", isNext && "font-semibold")}>{lesson.title}</span>
                          {isNext && <span className="ml-2 text-xs text-muted-foreground">← học bài này tiếp</span>}
                        </span>
                        <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                          {p?.completed_at ? (
                            <Check className="size-4 text-[oklch(0.5_0.15_150)]" aria-hidden />
                          ) : p ? (
                            <span aria-hidden className="size-1.5 rounded-full bg-foreground" />
                          ) : null}
                          <span className={p ? undefined : "sr-only"}>{status}</span>
                          {!p && (
                            <span>
                              <span className="gl-num">{lesson.minutes}</span>′
                            </span>
                          )}
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
    </div>
  );
}
