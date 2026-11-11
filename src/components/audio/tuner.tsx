"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, MicOff, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { detectPitchYin, median, rms } from "@/lib/audio/pitch";
import { playReference } from "@/lib/audio/guitar-synth";
import { nearestString, STANDARD_TUNING, STRING_NUMBERS_LOW_TO_HIGH, type StringNumber } from "@/lib/music/guitar";
import { centsBetween, frequencyToNote } from "@/lib/music/notes";
import { cn } from "@/lib/utils";

type Status = "idle" | "requesting" | "listening" | "denied" | "unsupported" | "error";
type Reading = { frequency: number; target: StringNumber; cents: number; note: string };

const IN_TUNE_CENTS = 5;
const SILENCE_RMS = 0.01;

export function Tuner() {
  const [status, setStatus] = useState<Status>("idle");
  const [reading, setReading] = useState<Reading | null>(null);
  const [manualString, setManualString] = useState<StringNumber | null>(null);
  const manualRef = useRef<StringNumber | null>(null);
  manualRef.current = manualString;
  const stopRef = useRef<(() => void) | null>(null);

  const stop = useCallback(() => {
    stopRef.current?.();
    stopRef.current = null;
    setStatus("idle");
    setReading(null);
  }, []);

  useEffect(() => () => stopRef.current?.(), []);

  const start = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia || !window.AudioContext) {
      setStatus("unsupported");
      return;
    }
    setStatus("requesting");
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
    } catch (e) {
      const name = e instanceof DOMException ? e.name : "";
      setStatus(name === "NotAllowedError" || name === "SecurityError" ? "denied" : "error");
      return;
    }

    const ctx = new AudioContext();
    const source = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 4096;
    source.connect(analyser);
    const buffer = new Float32Array(analyser.fftSize);
    const recent: number[] = [];
    let raf = 0;
    let last = 0;
    let silentFrames = 0;

    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      if (t - last < 50) return; // ~20 readings per second
      last = t;
      analyser.getFloatTimeDomainData(buffer);
      if (rms(buffer) < SILENCE_RMS) {
        if (++silentFrames > 20) {
          recent.length = 0;
          setReading(null);
        }
        return;
      }
      const result = detectPitchYin(buffer, ctx.sampleRate, { minFrequency: 65, maxFrequency: 700 });
      if (!result || result.probability < 0.85) return;
      silentFrames = 0;
      recent.push(result.frequency);
      if (recent.length > 5) recent.shift();
      const frequency = median(recent);
      const target = manualRef.current ?? nearestString(frequency).number;
      const note = frequencyToNote(frequency);
      setReading({
        frequency,
        target,
        cents: centsBetween(frequency, STANDARD_TUNING[target].frequency),
        note: `${note.name}${note.octave}`,
      });
    };
    raf = requestAnimationFrame(tick);
    stopRef.current = () => {
      cancelAnimationFrame(raf);
      stream.getTracks().forEach((tr) => tr.stop());
      void ctx.close();
    };
    setStatus("listening");
  }, []);

  const target = reading ? STANDARD_TUNING[reading.target] : manualString ? STANDARD_TUNING[manualString] : null;
  const cents = reading?.cents ?? 0;
  const clamped = Math.max(-50, Math.min(50, cents));
  const inTune = reading !== null && Math.abs(cents) <= IN_TUNE_CENTS;
  const advice = !reading
    ? status === "listening"
      ? "Gảy một dây và để nó ngân…"
      : ""
    : inTune
      ? "Chuẩn rồi! Chuyển sang dây tiếp theo."
      : cents < 0
        ? cents < -50
          ? "Thấp hơn nhiều — vặn khóa để CĂNG dây (nốt sẽ cao lên)."
          : "Hơi thấp — vặn khóa để căng dây thêm một chút."
        : cents > 50
          ? "Cao hơn nhiều — vặn khóa để NỚI dây (nốt sẽ thấp xuống)."
          : "Hơi cao — nới dây một chút.";

  return (
    <div className="gl-stage p-4 sm:p-6" data-testid="tuner">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Guitar Tuner</h3>
        <span className="text-xs text-muted-foreground">Standard: E A D G B E</span>
      </div>

      {/* gauge */}
      <div className="mt-5">
        <div className="relative mx-auto h-24 max-w-sm">
          <div className="absolute inset-x-0 top-10 h-2 rounded-[2px] bg-foreground/15" />
          <div className="absolute top-10 left-[45%] h-2 w-[10%] bg-[var(--gl-highlight)]" title="Vùng chuẩn: lệch không quá 5 cent" />
          {[-50, -25, 0, 25, 50].map((c) => (
            <div key={c} className="gl-num absolute top-6 -translate-x-1/2 text-[10px] text-muted-foreground" style={{ left: `${50 + c}%` }}>
              {c > 0 ? `+${c}` : c}
            </div>
          ))}
          <div
            className={cn(
              "absolute top-4 h-14 w-1 -translate-x-1/2 rounded-full transition-[left] duration-100",
              reading ? (inTune ? "bg-[oklch(0.5_0.15_150)]" : "bg-foreground") : "bg-foreground/25",
            )}
            style={{ left: `${50 + clamped}%` }}
            data-testid="tuner-needle"
          />
        </div>
        <div className="text-center">
          <div className={cn("gl-num text-6xl font-semibold", inTune && "text-[oklch(0.45_0.13_150)]")} data-testid="tuner-note">
            {reading ? reading.note : "—"}
          </div>
          <div className="gl-num mt-1 text-sm text-muted-foreground">
            {reading
              ? `${reading.frequency.toFixed(1)} Hz · ${cents > 0 ? "+" : ""}${cents.toFixed(0)} cent so với dây ${reading.target} (${target?.label})`
              : target
                ? `Mục tiêu: dây ${target.number} — ${target.label} (${target.frequency.toFixed(2)} Hz)`
                : "Tự nhận dây gần nhất"}
          </div>
          <p className="mt-2 min-h-6 text-sm font-medium" aria-live="polite">
            {advice}
          </p>
        </div>
      </div>

      {/* strings: listed from string 6 (thickest) to 1 */}
      <div className="mt-4 grid grid-cols-6 gap-1.5" role="group" aria-label="Chọn dây cần lên">
        {STRING_NUMBERS_LOW_TO_HIGH.map((s) => {
          const st = STANDARD_TUNING[s];
          const active = (manualString ?? reading?.target) === s;
          return (
            <button
              key={s}
              type="button"
              onClick={() => setManualString((m) => (m === s ? null : s))}
              aria-pressed={manualString === s}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center rounded-lg border text-xs transition-colors",
                active ? "border-foreground bg-muted" : "hover:bg-muted",
                manualString === s && "ring-2 ring-foreground",
              )}
            >
              <span className="gl-num text-base font-semibold">{st.note}</span>
              <span className="text-muted-foreground">dây {s}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Mặc định Tuner tự nhận dây gần nhất. Chạm vào một dây để khóa mục tiêu (chạm lần nữa để bỏ khóa).
      </p>

      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        {status === "listening" ? (
          <Button variant="outline" className="h-11 flex-1" onClick={stop}>
            <MicOff /> Tắt micro
          </Button>
        ) : (
          <Button className="h-11 flex-1" onClick={start} disabled={status === "requesting"} data-testid="tuner-start">
            <Mic /> {status === "requesting" ? "Đang xin quyền micro…" : "Bật micro & bắt đầu"}
          </Button>
        )}
        <Button
          variant="secondary"
          className="h-11"
          onClick={() => target && playReference(target.frequency)}
          disabled={!target}
        >
          <Volume2 /> Nghe nốt chuẩn
        </Button>
      </div>

      {status === "denied" && (
        <p role="alert" className="mt-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          Bạn đã chặn quyền micro. Hãy mở biểu tượng ổ khóa cạnh thanh địa chỉ → cho phép Micro, rồi tải lại trang.
        </p>
      )}
      {status === "unsupported" && (
        <p role="alert" className="mt-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          Trình duyệt này không hỗ trợ thu âm từ micro (cần HTTPS và trình duyệt hiện đại như Chrome, Edge, Firefox, Safari).
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="mt-3 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          Không mở được micro (có thể không có micro hoặc ứng dụng khác đang dùng). Kiểm tra thiết bị rồi thử lại.
        </p>
      )}
    </div>
  );
}
