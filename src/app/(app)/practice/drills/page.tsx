import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Lock } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { getLesson } from "@/content/curriculum";
import { DRILL_GROUPS, FINGER_DRILLS, type DrillGroup } from "@/content/drills";
import { getDrillStats } from "@/features/drills/queries";
import { getLessonProgress } from "@/features/progress/queries";
import { requireOnboardedProfile } from "@/lib/auth";

export const metadata: Metadata = { title: "Bài tập ngón" };

export default async function DrillsPage() {
  await requireOnboardedProfile("/practice/drills");
  const [progress, stats] = await Promise.all([getLessonProgress(), getDrillStats()]);
  const done = new Set(progress.filter((p) => p.completed_at).map((p) => p.lesson_slug));
  const groups = Object.keys(DRILL_GROUPS) as DrillGroup[];

  return (
    <div className="max-w-2xl">
      <Link href="/practice" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Luyện tập
      </Link>
      <PageHeader
        title="Bài tập ngón"
        description="Mỗi bài có phần xem mẫu thật chậm, rồi chạy theo nhịp và nhanh dần. Bạn tự đánh giá sau mỗi lượt, máy nhớ tốc độ sạch nhanh nhất của bạn."
      />
      <div className="space-y-10">
        {groups.map((g) => (
          <section key={g} aria-labelledby={`g-${g}`}>
            <h2 id={`g-${g}`} className="border-b border-foreground pb-2 text-lg font-semibold">
              {DRILL_GROUPS[g]}
            </h2>
            <ul className="divide-y">
              {FINGER_DRILLS.filter((d) => d.group === g).map((d) => {
                const locked = !done.has(d.unlockAfter);
                const best = stats[d.id]?.bestClean;
                return (
                  <li key={d.id}>
                    <Link
                      href={`/practice/drills/${d.id}`}
                      className="flex items-center gap-4 py-3 hover:bg-muted/50"
                      data-testid={`drill-${d.id}`}
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-medium">{d.title}</p>
                        <p className="text-sm text-muted-foreground">{d.goal}</p>
                        {locked && (
                          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                            <Lock className="size-3" /> Nên học xong bài “{getLesson(d.unlockAfter)?.title}” trước
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 text-right text-sm text-muted-foreground">
                        {best != null ? (
                          <>
                            <span className="gl-num text-base font-semibold text-foreground">{best}</span> BPM
                          </>
                        ) : (
                          <span className="gl-num">
                            {d.tempo.start}→{d.tempo.target}
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  );
}
