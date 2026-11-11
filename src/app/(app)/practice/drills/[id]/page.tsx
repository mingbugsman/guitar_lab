import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Hand } from "lucide-react";
import { ExercisePlayer } from "@/components/practice/exercise-player";
import { getLesson } from "@/content/curriculum";
import { getDrill } from "@/content/drills";
import { getDrillStats } from "@/features/drills/queries";
import { getLessonProgressFor } from "@/features/progress/queries";
import { requireOnboardedProfile } from "@/lib/auth";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  return { title: getDrill((await params).id)?.title ?? "Bài tập ngón" };
}

export default async function DrillPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const drill = getDrill(id);
  if (!drill) notFound();
  await requireOnboardedProfile(`/practice/drills/${id}`);
  const [stats, unlock] = await Promise.all([getDrillStats([id]), getLessonProgressFor(drill.unlockAfter)]);
  const before = getLesson(drill.unlockAfter);

  return (
    <div className="max-w-3xl">
      <Link href="/practice/drills" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Bài tập ngón
      </Link>
      <h1 className="gl-title mt-2 text-2xl sm:text-3xl">{drill.title}</h1>
      <p className="mt-1 text-lg">{drill.goal}</p>

      {!unlock?.completed_at && before && (
        <p className="mt-3 text-sm text-muted-foreground">
          Bài này dùng kỹ năng của bài{" "}
          <Link href={`/academy/${before.slug}`} className="underline underline-offset-4">
            {before.title}
          </Link>
          . Bạn vẫn tập thử được.
        </p>
      )}

      <div className="mt-6 grid gap-6 md:grid-cols-[minmax(0,1fr)_16rem]">
        <ol className="space-y-2">
          {drill.howTo.map((h, i) => (
            <li key={h} className="flex gap-3">
              <span className="gl-num w-5 shrink-0 pt-0.5 text-sm text-muted-foreground">{i + 1}</span>
              <span className="leading-relaxed">{h}</span>
            </li>
          ))}
        </ol>
        <aside className="flex gap-3 border-l-2 border-[var(--gl-finger)] py-1 pl-4 text-sm" data-callout="body">
          <Hand className="mt-0.5 size-4 shrink-0 text-muted-foreground" strokeWidth={1.75} aria-hidden />
          <div>
            <p className="font-semibold">Cảm giác khi tập</p>
            <p className="mt-1 leading-relaxed">{drill.body}</p>
          </div>
        </aside>
      </div>

      <div className="mt-8">
        <ExercisePlayer drill={drill} stats={stats[id]} signedIn />
      </div>
    </div>
  );
}
