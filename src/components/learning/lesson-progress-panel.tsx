"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { saveLessonProgress } from "@/features/academy/actions";
import type { Lesson } from "@/content/types";
import { cn } from "@/lib/utils";

type Initial = {
  checklist: string[];
  status: "learning" | "practicing" | "mastered";
  selfRating: number | null;
  completedAt: string | null;
};

const RATING_LABELS = ["", "Chưa làm được", "Làm được nhưng rất chậm", "Làm được, còn lỗi", "Làm tốt", "Rất chắc chắn"];

export function LessonProgressPanel({ lesson, initial }: { lesson: Lesson; initial: Initial | null }) {
  const [checked, setChecked] = useState<string[]>(initial?.checklist ?? []);
  const [status, setStatus] = useState<"learning" | "practicing">(
    initial?.status === "practicing" ? "practicing" : "learning",
  );
  const [rating, setRating] = useState<number | null>(initial?.selfRating ?? null);
  const [completedAt, setCompletedAt] = useState<string | null>(initial?.completedAt ?? null);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();

  const allChecked = lesson.checklist.every((c) => checked.includes(c.id));

  function save(next: { checklist?: string[]; status?: "learning" | "practicing"; rating?: number | null; complete?: boolean }) {
    const payload = {
      slug: lesson.slug,
      checklist: next.checklist ?? checked,
      status: next.status ?? status,
      selfRating: next.rating !== undefined ? next.rating : rating,
      complete: next.complete ?? Boolean(completedAt),
    };
    startTransition(async () => {
      const r = await saveLessonProgress(payload);
      if (!r.ok) {
        setMessage({ ok: false, text: r.error });
        return;
      }
      if (next.complete) {
        setCompletedAt(new Date().toISOString());
        setStatus("practicing");
        setMessage({ ok: true, text: "Đã hoàn thành bài học! Tiến độ đã được lưu." });
      } else setMessage(null);
    });
  }

  function toggle(id: string, on: boolean) {
    const next = on ? [...new Set([...checked, id])] : checked.filter((c) => c !== id);
    setChecked(next);
    // Unticking an item on a completed lesson re-opens it.
    const reopen = !on && completedAt;
    if (reopen) setCompletedAt(null);
    save({ checklist: next, complete: reopen ? false : undefined });
  }

  return (
    <section className="space-y-5 rounded-2xl border bg-card p-4 sm:p-6" aria-labelledby="progress-heading" data-testid="lesson-progress">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="progress-heading" className="text-lg font-semibold">
          Tự đánh giá & hoàn thành
        </h2>
        <span
          className={cn(
            "rounded-full px-3 py-1 text-xs font-semibold",
            completedAt ? "bg-[var(--gl-highlight)]/20 text-foreground" : "bg-muted text-muted-foreground",
          )}
          data-testid="lesson-status"
        >
          {completedAt ? "Đã hoàn thành · Đang luyện" : status === "practicing" ? "Đang luyện" : "Đang học"}
        </span>
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Checklist hoàn thành</p>
        {lesson.checklist.map((c) => (
          <label key={c.id} className="flex min-h-11 cursor-pointer items-start gap-3 rounded-lg px-2 py-2 hover:bg-muted">
            <Checkbox
              checked={checked.includes(c.id)}
              onCheckedChange={(v) => toggle(c.id, Boolean(v))}
              className="mt-0.5 size-5"
              disabled={pending}
              data-checklist-id={c.id}
            />
            <span className="text-sm leading-relaxed">{c.label}</span>
          </label>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium">Bạn tự đánh giá thế nào? (tự đánh giá — không phải kiểm tra xác minh)</p>
        <div className="flex flex-wrap items-center gap-1" role="radiogroup" aria-label="Tự đánh giá từ 1 đến 5">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              role="radio"
              aria-checked={rating === n}
              aria-label={`${n} — ${RATING_LABELS[n]}`}
              onClick={() => {
                setRating(n);
                save({ rating: n });
              }}
              className="rounded-md p-1.5 hover:bg-muted"
            >
              <Star className={cn("size-6", rating !== null && n <= rating ? "fill-primary text-primary" : "text-muted-foreground")} />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">{rating ? RATING_LABELS[rating] : "Chưa đánh giá"}</span>
        </div>
      </div>

      {!completedAt && (
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={status === "practicing" ? "secondary" : "outline"}
            onClick={() => {
              const s = status === "practicing" ? "learning" : "practicing";
              setStatus(s);
              save({ status: s });
            }}
          >
            {status === "practicing" ? "Đang luyện ✓" : "Chuyển sang: Đang luyện"}
          </Button>
        </div>
      )}

      <div className="space-y-2 border-t pt-4">
        {completedAt ? (
          <p className="flex items-center gap-2 text-sm font-medium">
            <CheckCircle2 className="size-5 text-[oklch(0.55_0.15_150)]" /> Bạn đã hoàn thành nội dung bài này. Tiếp tục luyện để thành thạo.
          </p>
        ) : (
          <Button className="h-11 w-full text-base sm:w-auto" disabled={!allChecked || pending} onClick={() => save({ complete: true })} data-testid="complete-lesson">
            <CheckCircle2 /> Hoàn thành bài học
          </Button>
        )}
        {!allChecked && !completedAt && (
          <p className="text-xs text-muted-foreground">Đánh dấu đủ checklist để hoàn thành bài.</p>
        )}
        <p className="text-xs text-muted-foreground">
          “Thành thạo” (Mastered) chỉ được ghi nhận qua bài kiểm tra thực hành có tiêu chí — tính năng này chưa có trong bản
          0.1, nên Guitar Lab không tự đánh dấu Mastered.
        </p>
        {message && (
          <p role="status" className={cn("text-sm", message.ok ? "text-foreground" : "text-destructive")}>
            {message.text}
          </p>
        )}
      </div>
    </section>
  );
}
