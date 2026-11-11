"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronDown, Play, Sparkles, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getLastDrillResult, saveDrillResult } from "@/features/drills/actions";
import type { DrillRating } from "@/features/drills/stats";
import { CHORD_CATEGORIES, CHORDS, CHORDS_WITH_LESSON, type ChordId } from "@/lib/music/chords";
import {
  buildChallenge,
  CHALLENGE_PRESETS,
  challengeId,
  LIMITS,
  normalizeSettings,
  suggestChallenge,
  type BeatsPerChord,
  type ChallengeHistory,
  type ChallengeSettings,
} from "@/lib/practice/challenge";
import { cn } from "@/lib/utils";
import { ChallengeRunner, type ChallengeOutcome } from "./challenge-runner";

const RATINGS: { value: DrillRating; title: string; detail: string }[] = [
  { value: "clean", title: "Sạch hết", detail: "Đổi kịp mọi hợp âm, không dây nào rè." },
  { value: "some-buzz", title: "Kịp nhưng vài chỗ rè", detail: "Theo kịp thẻ nhưng vài hợp âm chưa sạch." },
  { value: "lost", title: "Không theo kịp", detail: "Nhiều thẻ qua vạch mà tay chưa đặt xong." },
];

/** Chord challenge: pick chords (by group or preset), take the suggestion or set it yourself, then play. */
export function ChordChallenge({ signedIn }: { signedIn: boolean }) {
  const [chords, setChords] = useState<ChordId[]>(["em", "am", "d", "g"]);
  const [mode, setMode] = useState<"suggest" | "custom">("suggest");
  // last result, remembered per chord set so switching chords never shows another set's result
  const [lastFor, setLastFor] = useState<{ key: string; value: ChallengeHistory }>({ key: "", value: null });
  const [custom, setCustom] = useState<ChallengeSettings | null>(null);
  const [openGroups, setOpenGroups] = useState<string[]>(["beginner"]);
  const [run, setRun] = useState<{ settings: ChallengeSettings; seed: number } | null>(null);
  const [outcome, setOutcome] = useState<ChallengeOutcome | null>(null);
  const [stagePick, setStagePick] = useState(0);
  const [saved, setSaved] = useState<string | null>(null);

  const key = challengeId(chords);
  const last = lastFor.key === key ? lastFor.value : null;
  useEffect(() => {
    if (!signedIn || chords.length < LIMITS.minChords) return;
    let alive = true;
    void getLastDrillResult(key).then((r) => {
      if (alive) setLastFor({ key, value: r });
    });
    return () => {
      alive = false;
    };
  }, [key, signedIn, chords.length]);

  const suggestion = useMemo(() => (chords.length >= LIMITS.minChords ? suggestChallenge(chords, last) : null), [chords, last]);
  const settings = mode === "custom" && custom ? normalizeSettings({ ...custom, chords }) : suggestion?.settings ?? null;
  const plan = useMemo(() => (run ? buildChallenge(run.settings, run.seed) : null), [run]);

  const toggle = (id: ChordId) =>
    setChords((cur) => (cur.includes(id) ? cur.filter((c) => c !== id) : cur.length >= LIMITS.maxChords ? cur : [...cur, id]));
  const setGroup = (ids: ChordId[], on: boolean) =>
    setChords((cur) => (on ? [...new Set([...cur, ...ids])].slice(0, LIMITS.maxChords) : cur.filter((c) => !ids.includes(c))));

  async function rate(r: DrillRating) {
    if (!plan || !outcome || !run) return;
    const bpm = plan.stages[stagePick].bpm;
    if (!signedIn) {
      setSaved("Bạn chưa đăng nhập nên kết quả không được lưu.");
    } else {
      const res = await saveDrillResult({ drillId: challengeId(run.settings.chords), kind: "chord-challenge", bpmReached: bpm, rating: r, seconds: outcome.seconds });
      setSaved(res.ok ? `Đã lưu: theo kịp tới ${bpm} BPM. Lần sau máy đề xuất dựa trên kết quả này.` : res.error);
      if (res.ok) setLastFor({ key: challengeId(run.settings.chords), value: { bpm, rating: r } });
    }
    setRun(null);
    setOutcome(null);
  }

  // ---- running
  if (run && plan && !outcome) {
    return (
      <ChallengeRunner
        plan={plan}
        onDone={(o) => {
          setOutcome(o);
          setStagePick(o.reachedStage);
        }}
      />
    );
  }

  // ---- self-assessment
  if (run && plan && outcome) {
    return (
      <section className="space-y-5" data-testid="challenge-rating">
        <h2 className="text-xl font-semibold">{outcome.stopped ? "Bạn đã dừng." : "Hết giờ!"} Bạn theo kịp tới chặng nào?</h2>
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Chặng theo kịp">
          {plan.stages.map((s) => (
            <button
              key={s.index}
              type="button"
              role="radio"
              aria-checked={stagePick === s.index}
              onClick={() => setStagePick(s.index)}
              className={cn("min-h-11 rounded-md border px-4 text-sm", stagePick === s.index ? "border-foreground bg-muted font-semibold" : "hover:bg-muted")}
              data-testid={`stage-${s.index}`}
            >
              Chặng {s.index + 1} · <span className="gl-num">{s.bpm}</span> BPM
            </button>
          ))}
        </div>
        <p className="font-medium">Ở chặng đó bạn chơi thế nào?</p>
        <div className="grid gap-2 sm:grid-cols-3">
          {RATINGS.map((r) => (
            <button
              key={r.value}
              type="button"
              onClick={() => void rate(r.value)}
              className="min-h-16 rounded-md border px-4 py-3 text-left hover:bg-muted"
              data-testid={`challenge-rate-${r.value}`}
            >
              <span className="block font-medium">{r.title}</span>
              <span className="block text-sm text-muted-foreground">{r.detail}</span>
            </button>
          ))}
        </div>
      </section>
    );
  }

  // ---- setup
  return (
    <div className="space-y-8" data-testid="challenge-setup">
      {saved && (
        <p className="border-l-2 border-[oklch(0.5_0.15_150)] pl-3 text-sm" data-testid="challenge-saved">
          {saved}
        </p>
      )}

      <section aria-labelledby="pick" className="space-y-3">
        <div className="flex items-baseline justify-between gap-2">
          <h2 id="pick" className="text-lg font-semibold">
            1. Chọn hợp âm
          </h2>
          <p className="text-sm text-muted-foreground">
            Đã chọn <span className="gl-num font-semibold text-foreground" data-testid="challenge-count">{chords.length}</span> (2–{LIMITS.maxChords})
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {CHALLENGE_PRESETS.map((p) => (
            <Button key={p.id} size="sm" variant="outline" onClick={() => setChords(p.chords)} data-testid={`preset-${p.id}`}>
              {p.title}
            </Button>
          ))}
        </div>
        <p className="min-h-6 text-sm" data-testid="challenge-selected">
          {chords.length ? chords.map((c) => CHORDS[c].symbol).join(" · ") : <span className="text-muted-foreground">Chưa chọn hợp âm nào.</span>}
        </p>

        <div className="divide-y border-y">
          {CHORD_CATEGORIES.map((g) => {
            const open = openGroups.includes(g.id);
            const all = g.chords.every((c) => chords.includes(c));
            return (
              <section key={g.id} className="py-2" data-testid={`group-${g.id}`}>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setOpenGroups((o) => (open ? o.filter((x) => x !== g.id) : [...o, g.id]))}
                    aria-expanded={open}
                    className="flex min-h-11 flex-1 items-center gap-2 text-left"
                  >
                    <ChevronDown className={cn("size-4 transition-transform", !open && "-rotate-90")} />
                    <span className="font-medium">
                      {g.id === "beginner" && <Sparkles className="mr-1 inline size-4 text-[var(--gl-finger)]" aria-hidden />}
                      {g.title}
                    </span>
                    <span className="hidden text-sm text-muted-foreground sm:inline">· {g.hint}</span>
                  </button>
                  <Button size="sm" variant="ghost" onClick={() => setGroup(g.chords, !all)} data-testid={`group-all-${g.id}`}>
                    {all ? "Bỏ chọn cả nhóm" : "Chọn cả nhóm"}
                  </Button>
                </div>
                {open && (
                  <div className="flex flex-wrap gap-2 pt-1 pb-2 pl-6">
                    {g.chords.map((c) => {
                      const on = chords.includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          aria-pressed={on}
                          onClick={() => toggle(c)}
                          className={cn(
                            "min-h-11 min-w-14 rounded-md border px-3 text-base",
                            on ? "border-[var(--gl-finger)] bg-[var(--gl-finger)] font-semibold text-[var(--gl-finger-text)]" : "hover:bg-muted",
                          )}
                          title={CHORDS_WITH_LESSON.includes(c) ? CHORDS[c].nameVi : `${CHORDS[c].nameVi} · chưa có bài học`}
                          data-testid={`chord-${c}`}
                        >
                          <span className="gl-num">{CHORDS[c].symbol}</span>
                          {!CHORDS_WITH_LESSON.includes(c) && <span className="ml-1 align-top text-[10px] opacity-70">•</span>}
                        </button>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
        <p className="text-xs text-muted-foreground">Dấu • là hợp âm chưa có bài học. Vẫn chọn được, máy sẽ hiện sơ đồ để bạn bấm theo.</p>
      </section>

      <section aria-labelledby="how" className="space-y-3">
        <h2 id="how" className="text-lg font-semibold">
          2. Thời gian và tốc độ
        </h2>
        <div role="radiogroup" aria-label="Cách đặt thời gian và tốc độ" className="inline-flex rounded-lg border bg-muted p-0.5">
          {(
            [
              ["suggest", "Máy đề xuất", Sparkles],
              ["custom", "Tự chỉnh", SlidersHorizontal],
            ] as const
          ).map(([m, label, Icon]) => (
            <button
              key={m}
              type="button"
              role="radio"
              aria-checked={mode === m}
              onClick={() => {
                setMode(m);
                if (m === "custom" && !custom && suggestion) setCustom(suggestion.settings);
              }}
              className={cn("flex min-h-10 items-center gap-1.5 rounded-md px-3 text-sm font-medium", mode === m ? "bg-card shadow-sm" : "text-muted-foreground")}
              data-testid={`mode-${m}`}
            >
              <Icon className="size-4" /> {label}
            </button>
          ))}
        </div>

        {mode === "suggest" && suggestion && (
          <p className="text-sm leading-relaxed" data-testid="challenge-suggestion">
            {suggestion.reason}
          </p>
        )}
        {mode === "custom" && custom && <CustomSettings value={custom} onChange={setCustom} />}
        {settings && (
          <p className="text-sm text-muted-foreground">
            <span className="gl-num">{settings.minutes}</span> phút · <span className="gl-num">{settings.startBpm}</span> →{" "}
            <span className="gl-num">{settings.endBpm}</span> BPM · <span className="gl-num">{settings.stages}</span> chặng · mỗi hợp âm{" "}
            <span className="gl-num">{settings.beatsPerChord}</span> phách
          </p>
        )}
      </section>

      <Button
        className="h-12 px-6 text-base"
        disabled={!settings || chords.length < LIMITS.minChords}
        onClick={() => {
          if (!settings) return;
          setSaved(null);
          setRun({ settings, seed: Date.now() % 2147483647 });
        }}
        data-testid="challenge-open"
      >
        <Play /> Vào thử thách
      </Button>
    </div>
  );
}

function CustomSettings({ value, onChange }: { value: ChallengeSettings; onChange: (s: ChallengeSettings) => void }) {
  const set = (patch: Partial<ChallengeSettings>) => onChange({ ...value, ...patch });
  const num = (label: string, v: number, min: number, max: number, onv: (n: number) => void, testid: string, step = 1) => (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        step={step}
        value={v}
        onChange={(e) => onv(Number(e.target.value))}
        className="h-11 w-28 rounded-md border bg-background px-3 text-base"
        data-testid={testid}
      />
    </label>
  );
  return (
    <div className="space-y-4" data-testid="challenge-custom">
      <div className="flex flex-wrap items-end gap-2">
        {[1, 3, 5].map((m) => (
          <Button key={m} size="sm" variant={value.minutes === m ? "default" : "outline"} onClick={() => set({ minutes: m })}>
            {m} phút
          </Button>
        ))}
        {num("Hoặc tự nhập (phút)", value.minutes, LIMITS.minMinutes, LIMITS.maxMinutes, (n) => set({ minutes: n }), "custom-minutes")}
      </div>
      <div className="flex flex-wrap gap-4">
        {num("Tốc độ bắt đầu (BPM)", value.startBpm, LIMITS.minBpm, LIMITS.maxBpm, (n) => set({ startBpm: n }), "custom-start", 5)}
        {num("Tốc độ kết thúc (BPM)", value.endBpm, LIMITS.minBpm, LIMITS.maxBpm, (n) => set({ endBpm: n }), "custom-end", 5)}
        {num("Số chặng", value.stages, 1, LIMITS.maxStages, (n) => set({ stages: n }), "custom-stages")}
      </div>
      <div className="space-y-1 text-sm">
        <p className="text-muted-foreground">Mỗi hợp âm giữ trong</p>
        <div className="flex gap-2">
          {([8, 4, 2] as BeatsPerChord[]).map((b) => (
            <Button key={b} size="sm" variant={value.beatsPerChord === b ? "default" : "outline"} onClick={() => set({ beatsPerChord: b })}>
              {b} phách
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
