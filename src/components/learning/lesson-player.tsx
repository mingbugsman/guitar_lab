"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import type { Block, Lesson, Visual } from "@/content/types";
import { cn } from "@/lib/utils";
import { HandText } from "./hand-text";
import { LessonBlocks } from "./lesson-blocks";
import { LessonProgressPanel, type LessonProgressInitial } from "./lesson-progress-panel";
import { LessonVisual } from "./lesson-visual";

type StageId = "learn" | "practice" | "mistakes" | "evaluate";
const STAGES: { id: StageId; label: string }[] = [
  { id: "learn", label: "Hiểu" },
  { id: "practice", label: "Luyện" },
  { id: "mistakes", label: "Sửa lỗi" },
  { id: "evaluate", label: "Tự đánh giá" },
];

type Scene = { visual?: { visual: Visual; caption?: string }; blocks: Block[] };
type Screen = { stage: "learn"; scene: Scene; index: number } | { stage: Exclude<StageId, "learn"> };

/**
 * Group lesson blocks into scenes that hold at most one picture, so the picture and the
 * words about it are always on screen together.
 */
export function toScenes(blocks: Block[]): Scene[] {
  const scenes: Scene[] = [];
  let current: Scene = { blocks: [] };
  for (const b of blocks) {
    if (b.type === "visual") {
      if (current.visual) {
        scenes.push(current);
        current = { blocks: [] };
      }
      current.visual = { visual: b.visual, caption: b.caption };
    } else current.blocks.push(b);
  }
  if (current.visual || current.blocks.length) scenes.push(current);
  return scenes;
}

/** Pictures worth keeping in view while practising: the last fretboard/chord, plus a tool. */
export function practiceVisuals(blocks: Block[]): Visual[] {
  const visuals = blocks.flatMap((b) => (b.type === "visual" ? [b.visual] : []));
  const board = [...visuals].reverse().find((v) => v.kind === "chord" || v.kind === "fretboard") ?? visuals[0];
  const tool = visuals.find((v) => v.kind === "chordChange" || v.kind === "tuner" || v.kind === "metronome");
  return [board, tool].filter((v, i, arr): v is Visual => Boolean(v) && arr.indexOf(v) === i);
}

/**
 * Picture + words side by side on wide screens. On phones the words come first when
 * `wordsFirst` is set (practice steps must be visible without scrolling past the picture).
 */
function Split({ pinned, children, wordsFirst = false }: { pinned?: React.ReactNode; children: React.ReactNode; wordsFirst?: boolean }) {
  if (!pinned) return <div className="max-w-2xl">{children}</div>;
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] lg:gap-10">
      <div className={cn("min-w-0 lg:sticky lg:top-8 lg:order-1 lg:max-h-[calc(100dvh-9rem)] lg:self-start lg:overflow-y-auto", wordsFirst && "order-2")}>
        {pinned}
      </div>
      <div className={cn("min-w-0 lg:order-2", wordsFirst && "order-1")}>{children}</div>
    </div>
  );
}

export type LessonPlayerProps = {
  lesson: Lesson;
  levelLabel: string;
  initialProgress: LessonProgressInitial | null;
  prerequisites: { slug: string; title: string }[];
  next: { slug: string; title: string } | null;
  typeNote: { title: string; points: string[] } | null;
};

export function LessonPlayer({ lesson, levelLabel, initialProgress, prerequisites, next, typeNote }: LessonPlayerProps) {
  const screens = useMemo<Screen[]>(() => {
    const learn = toScenes(lesson.blocks).map((scene, index) => ({ stage: "learn" as const, scene, index }));
    return [...learn, { stage: "practice" }, { stage: "mistakes" }, { stage: "evaluate" }];
  }, [lesson.blocks]);
  const learnCount = screens.filter((s) => s.stage === "learn").length;
  const pinnedForPractice = useMemo(() => practiceVisuals(lesson.blocks), [lesson.blocks]);

  const [index, setIndex] = useState(0);
  const [step, setStep] = useState(0);
  const top = useRef<HTMLDivElement>(null);
  const screen = screens[index];
  const steps = lesson.practice.steps;

  const firstRender = useRef(true);
  useEffect(() => {
    // Moving between screens brings the learner back to the stage rail; not on first load.
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    top.current?.scrollIntoView({ block: "start" });
  }, [index]);

  const goStage = (id: StageId) => setIndex(screens.findIndex((s) => s.stage === id));
  const isLast = index === screens.length - 1;

  function forward() {
    if (screen.stage === "practice" && step < steps.length - 1) setStep(step + 1);
    else if (!isLast) setIndex(index + 1);
  }
  function back() {
    if (screen.stage === "practice" && step > 0) setStep(step - 1);
    else if (index > 0) setIndex(index - 1);
  }

  const forwardLabel =
    screen.stage === "learn"
      ? screen.index < learnCount - 1
        ? "Tiếp"
        : "Sang phần luyện"
      : screen.stage === "practice"
        ? step < steps.length - 1
          ? "Bước tiếp"
          : "Xong phần luyện"
        : "Tự đánh giá";

  return (
    <div ref={top} className="scroll-mt-16">
      <header className="space-y-2">
        <Link href="/academy" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> {levelLabel}
        </Link>
        <h1 className="gl-title text-2xl sm:text-3xl">
          <span className="gl-num mr-2 font-normal text-muted-foreground">{String(lesson.order).padStart(2, "0")}</span>
          {lesson.title}
        </h1>
      </header>

      {/* stage rail */}
      <nav aria-label="Các chặng của bài học" className="mt-5 border-b">
        <ol className="flex gap-1 overflow-x-auto">
          {STAGES.map((s, i) => {
            const active = screen.stage === s.id;
            const passed = STAGES.findIndex((x) => x.id === screen.stage) > i;
            return (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => goStage(s.id)}
                  aria-current={active ? "step" : undefined}
                  data-testid={`lesson-stage-${s.id}`}
                  className={cn(
                    "-mb-px flex min-h-11 items-center gap-1.5 border-b-2 px-3 text-sm whitespace-nowrap",
                    active ? "border-foreground font-semibold" : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className="gl-num text-xs">{i + 1}</span>
                  {s.label}
                  {passed && <Check className="size-3.5 text-[oklch(0.5_0.15_150)]" aria-label="đã xem" />}
                  {active && s.id === "learn" && learnCount > 1 && screen.stage === "learn" && (
                    <span className="gl-num text-xs font-normal text-muted-foreground">
                      {screen.index + 1}/{learnCount}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ol>
      </nav>

      <div className="py-6 sm:py-8" data-screen={screen.stage}>
        {screen.stage === "learn" && (
          <Split
            pinned={
              screen.scene.visual ? (
                <figure className="space-y-2">
                  <LessonVisual visual={screen.scene.visual.visual} />
                  {screen.scene.visual.caption && (
                    <figcaption className="text-sm text-muted-foreground">
                      <HandText text={screen.scene.visual.caption} />
                    </figcaption>
                  )}
                </figure>
              ) : undefined
            }
          >
            <div className="space-y-6">
              {screen.index === 0 && (
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed">{lesson.summary}</p>
                  {typeNote && (
                    <aside className="rounded-lg border-l-2 border-foreground/40 bg-muted px-4 py-3 text-sm" data-testid="guitar-type-note">
                      <p className="font-semibold">{typeNote.title}</p>
                      <ul className="mt-2 list-disc space-y-1 pl-5">
                        {typeNote.points.map((p) => (
                          <li key={p}>{p}</li>
                        ))}
                      </ul>
                    </aside>
                  )}
                  <div>
                    <p className="gl-label">Học xong bài này, bạn sẽ</p>
                    <ul className="mt-1.5 space-y-1">
                      {lesson.objectives.map((o) => (
                        <li key={o} className="flex gap-2">
                          <span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-foreground/50" />
                          <span>
                            <HandText text={o} />
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  {prerequisites.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      Nên học trước:{" "}
                      {prerequisites.map((p, i) => (
                        <span key={p.slug}>
                          {i > 0 && ", "}
                          <Link href={`/academy/${p.slug}`} className="underline underline-offset-4 hover:text-foreground">
                            {p.title}
                          </Link>
                        </span>
                      ))}
                      {" · "}
                      <span className="gl-num">~{lesson.minutes}</span> phút
                    </p>
                  )}
                </div>
              )}
              <LessonBlocks blocks={screen.scene.blocks} />
            </div>
          </Split>
        )}

        {screen.stage === "practice" && (
          <Split
            wordsFirst
            pinned={
              pinnedForPractice.length ? (
                <div className="space-y-4">
                  {pinnedForPractice.map((v, i) => (
                    <LessonVisual key={i} visual={v} />
                  ))}
                </div>
              ) : undefined
            }
          >
            <div data-testid="practice-step">
              <p className="gl-label">
                Luyện trên đàn thật · khoảng <span className="gl-num">{lesson.practice.minutes}</span> phút
              </p>
              <p className="gl-num mt-4 text-sm text-muted-foreground">
                Bước {step + 1}/{steps.length}
              </p>
              <p className="mt-1 text-xl leading-snug font-medium sm:text-2xl" aria-live="polite">
                <HandText text={steps[step]} />
              </p>
              <ol className="mt-6 flex gap-1.5" aria-label="Tiến độ các bước luyện">
                {steps.map((_, i) => (
                  <li key={i}>
                    <button
                      type="button"
                      onClick={() => setStep(i)}
                      aria-label={`Bước ${i + 1}`}
                      aria-current={i === step ? "step" : undefined}
                      className="flex h-11 w-8 items-center"
                    >
                      <span className={cn("h-1.5 w-full rounded-[2px]", i === step ? "bg-foreground" : i < step ? "bg-[var(--gl-highlight)]" : "bg-foreground/15")} />
                    </button>
                  </li>
                ))}
              </ol>
            </div>
          </Split>
        )}

        {screen.stage === "mistakes" && (
          <div className="max-w-2xl">
            <p className="gl-label">Nếu tiếng đàn chưa ổn, thường là do một trong các lỗi này</p>
            <dl className="mt-3 divide-y border-y">
              {lesson.mistakes.map((m) => (
                <div key={m.mistake} className="py-4">
                  <dt className="font-medium">
                    <HandText text={m.mistake} />
                  </dt>
                  <dd className="mt-1.5 flex gap-2 text-muted-foreground">
                    <span className="shrink-0 text-sm font-semibold text-foreground">Sửa:</span>
                    <span>
                      <HandText text={m.fix} />
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        )}

        {screen.stage === "evaluate" && (
          <div className="max-w-2xl space-y-8">
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="gl-label">Đạt khi</p>
                <ul className="mt-1.5 space-y-1.5">
                  {lesson.assessment.map((a) => (
                    <li key={a}>
                      <HandText text={a} />
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="gl-label">Thành thạo khi</p>
                <ul className="mt-1.5 space-y-1.5 text-muted-foreground">
                  {lesson.mastery.map((a) => (
                    <li key={a}>
                      <HandText text={a} />
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <LessonProgressPanel lesson={lesson} initial={initialProgress} />
            {next && (
              <Link href={`/academy/${next.slug}`} className={buttonVariants({ variant: "outline", className: "h-12 w-full justify-between px-4 text-base sm:w-auto" })}>
                <span>
                  <span className="text-muted-foreground">Bài tiếp: </span>
                  {next.title}
                </span>
                <ArrowRight />
              </Link>
            )}
          </div>
        )}
      </div>

      {/* step bar: the one big button the learner can hit without looking */}
      <div className="sticky bottom-0 z-20 -mx-4 border-t bg-background px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] sm:-mx-8 sm:px-8">
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="h-12 px-4 text-base"
            onClick={back}
            disabled={index === 0 && step === 0}
            aria-label="Quay lại"
            data-testid="lesson-back"
          >
            <ArrowLeft />
          </Button>
          {!isLast && (
            <Button className="h-12 flex-1 text-base sm:flex-none sm:px-8" onClick={forward} data-testid="lesson-forward">
              {forwardLabel} <ArrowRight />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
