import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { LessonBlocks } from "@/components/learning/lesson-blocks";
import { LessonProgressPanel } from "@/components/learning/lesson-progress-panel";
import { getLesson, getLevel, nextLesson, previousLesson } from "@/content/curriculum";
import { requireOnboardedProfile } from "@/lib/auth";
import { getLessonProgressFor } from "@/features/progress/queries";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const lesson = getLesson((await params).slug);
  return { title: lesson?.title ?? "Bài học" };
}

export default async function LessonPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();
  await requireOnboardedProfile(`/academy/${slug}`);
  const progress = await getLessonProgressFor(slug);
  const level = getLevel(lesson.levelId);
  const next = nextLesson(slug);
  const prev = previousLesson(slug);
  const prereqs = lesson.prerequisites.map((p) => getLesson(p)!).filter(Boolean);

  return (
    <article className="space-y-8">
      <header className="space-y-3">
        <Link href="/academy" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Level {level.number} · {level.title}
        </Link>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          <span className="text-muted-foreground">{lesson.order}. </span>
          {lesson.title}
        </h1>
        <p className="text-muted-foreground">{lesson.summary}</p>
        <p className="inline-flex items-center gap-1 text-sm text-muted-foreground">
          <Clock className="size-4" /> Khoảng {lesson.minutes} phút
        </p>
      </header>

      <section className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border bg-card p-4">
          <h2 className="text-sm font-semibold">Mục tiêu</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm">
            {lesson.objectives.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border bg-card p-4">
          <h2 className="text-sm font-semibold">Cần biết trước</h2>
          {prereqs.length ? (
            <ul className="mt-2 space-y-1 text-sm">
              {prereqs.map((p) => (
                <li key={p.slug}>
                  <Link href={`/academy/${p.slug}`} className="text-primary underline-offset-4 hover:underline">
                    {p.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-sm text-muted-foreground">Không cần — đây là điểm bắt đầu.</p>
          )}
        </div>
      </section>

      <section aria-labelledby="learn" className="space-y-4">
        <h2 id="learn" className="text-xl font-bold">
          1 · Hiểu & 2 · Nhìn, nghe
        </h2>
        <LessonBlocks blocks={lesson.blocks} />
      </section>

      <section aria-labelledby="practice" className="space-y-3 rounded-2xl border bg-card p-4 sm:p-6">
        <h2 id="practice" className="text-xl font-bold">
          3 · Luyện tập <span className="text-base font-normal text-muted-foreground">(~{lesson.practice.minutes} phút, trên đàn thật)</span>
        </h2>
        <ol className="list-decimal space-y-2 pl-5">
          {lesson.practice.steps.map((s) => (
            <li key={s} className="leading-relaxed">
              {s}
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="mistakes" className="space-y-3">
        <h2 id="mistakes" className="text-xl font-bold">
          4 · Lỗi thường gặp
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {lesson.mistakes.map((m) => (
            <div key={m.mistake} className="rounded-xl border bg-card p-4 text-sm">
              <p className="font-medium text-destructive">✗ {m.mistake}</p>
              <p className="mt-1">✓ {m.fix}</p>
            </div>
          ))}
        </div>
      </section>

      <section aria-labelledby="evaluate" className="space-y-3">
        <h2 id="evaluate" className="text-xl font-bold">
          5 · Đánh giá
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border bg-card p-4 text-sm">
            <p className="font-semibold">Tiêu chí đạt</p>
            <ul className="mt-1 list-disc pl-5">
              {lesson.assessment.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border bg-card p-4 text-sm">
            <p className="font-semibold">Tiêu chí thành thạo</p>
            <ul className="mt-1 list-disc pl-5">
              {lesson.mastery.map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>
        </div>
        <LessonProgressPanel
          lesson={lesson}
          initial={
            progress
              ? {
                  checklist: progress.checklist,
                  status: progress.status,
                  selfRating: progress.self_rating,
                  completedAt: progress.completed_at,
                }
              : null
          }
        />
      </section>

      <nav className="flex flex-col gap-2 border-t pt-6 sm:flex-row sm:justify-between" aria-label="Chuyển bài">
        {prev ? (
          <Link href={`/academy/${prev.slug}`} className={buttonVariants({ variant: "outline", className: "h-11" })}>
            <ArrowLeft /> {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next && (
          <Link href={`/academy/${next.slug}`} className={buttonVariants({ className: "h-11" })}>
            Bài tiếp: {next.title} <ArrowRight />
          </Link>
        )}
      </nav>
    </article>
  );
}
