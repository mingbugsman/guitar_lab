import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LessonPlayer } from "@/components/learning/lesson-player";
import { getLesson, getLevel, nextLesson } from "@/content/curriculum";
import { GUITAR_TYPE_NOTES } from "@/content/guitar-type";
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
  const profile = await requireOnboardedProfile(`/academy/${slug}`);
  const progress = await getLessonProgressFor(slug);
  const level = getLevel(lesson.levelId);
  const next = nextLesson(slug);
  const typeNote =
    profile.guitar_type && profile.guitar_type !== "acoustic" ? GUITAR_TYPE_NOTES[profile.guitar_type] : null;

  return (
    <LessonPlayer
      key={lesson.slug}
      lesson={lesson}
      levelLabel={`Level ${level.number} · ${level.subtitle}`}
      initialProgress={
        progress
          ? {
              checklist: progress.checklist,
              status: progress.status,
              selfRating: progress.self_rating,
              completedAt: progress.completed_at,
            }
          : null
      }
      prerequisites={lesson.prerequisites.flatMap((p) => {
        const pre = getLesson(p);
        return pre ? [{ slug: pre.slug, title: pre.title }] : [];
      })}
      next={next ? { slug: next.slug, title: next.title } : null}
      typeNote={typeNote}
    />
  );
}
