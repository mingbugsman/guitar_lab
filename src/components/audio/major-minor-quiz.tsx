"use client";

import { useState } from "react";
import { RotateCcw, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { strumChord } from "@/lib/audio/guitar-synth";
import { CHORDS, type ChordId } from "@/lib/music/chords";
import { nextQuizChord, PAIRS, QUIZ_LENGTH, qualityOf, type Quality } from "@/lib/music/major-minor";
import { cn } from "@/lib/utils";

const NAME: Record<Quality, string> = { major: "trưởng", minor: "thứ" };

/**
 * Ear training, first step: hear the three major/minor pairs side by side, then ten questions
 * "Trưởng hay thứ?" with the answer shown right after each guess.
 */
export function MajorMinorQuiz() {
  const [history, setHistory] = useState<ChordId[]>([]);
  const [heard, setHeard] = useState(false);
  const [answer, setAnswer] = useState<Quality | null>(null);
  const [score, setScore] = useState(0);

  const current = history.at(-1);
  const asked = history.length;
  const finished = asked === QUIZ_LENGTH && answer !== null;
  const play = (id: ChordId) => void strumChord(CHORDS[id], "down");

  const ask = () => {
    const next = nextQuizChord(history);
    setHistory((h) => [...h, next]);
    setHeard(true);
    setAnswer(null);
    play(next);
  };
  const guess = (q: Quality) => {
    if (!current || answer) return;
    setAnswer(q);
    if (qualityOf(current) === q) setScore((s) => s + 1);
  };
  const restart = () => {
    setHistory([]);
    setHeard(false);
    setAnswer(null);
    setScore(0);
  };

  return (
    <div className="space-y-5" data-testid="major-minor-quiz">
      <section className="space-y-2">
        <h3 className="text-sm font-semibold">Nghe từng cặp: trưởng trước, thứ sau</h3>
        <ul className="space-y-2">
          {PAIRS.map(([maj, min]) => (
            <li key={maj} className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" onClick={() => play(maj)}>
                <Volume2 /> {CHORDS[maj].symbol}: trưởng
              </Button>
              <Button size="sm" variant="secondary" onClick={() => play(min)}>
                <Volume2 /> {CHORDS[min].symbol}: thứ
              </Button>
            </li>
          ))}
        </ul>
      </section>

      <section className="gl-stage space-y-3 p-4" aria-live="polite">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-semibold">Trưởng hay thứ?</h3>
          <span className="gl-num text-sm text-muted-foreground" data-testid="quiz-score">
            {score}/{QUIZ_LENGTH} đúng
          </span>
        </div>

        {finished ? (
          <div className="space-y-3">
            <p data-testid="quiz-result">
              Bạn đúng <strong>{score}</strong> trên {QUIZ_LENGTH} câu.{" "}
              {score >= 8 ? "Tai bạn đã nghe ra trưởng và thứ." : "Nghe lại các cặp ở trên vài lần rồi làm lại. Ngày đầu đúng 6 câu là bình thường."}
            </p>
            <Button onClick={restart}>
              <RotateCcw /> Làm lại {QUIZ_LENGTH} câu
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              {!current || answer ? (
                <Button onClick={ask} data-testid="quiz-next">
                  <Volume2 /> {asked === 0 ? "Câu 1: nghe hợp âm" : `Câu ${asked + 1}: nghe hợp âm`}
                </Button>
              ) : (
                <Button variant="outline" onClick={() => play(current)}>
                  <Volume2 /> Nghe lại câu {asked}
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {(["major", "minor"] as const).map((q) => {
                const right = answer && current && qualityOf(current) === q;
                const wrongPick = answer === q && !right;
                return (
                  <Button
                    key={q}
                    variant="outline"
                    className={cn("h-14 text-base", right && "border-foreground bg-foreground text-background hover:bg-foreground disabled:opacity-100", wrongPick && "line-through opacity-60")}
                    disabled={!heard || !current || answer !== null}
                    onClick={() => guess(q)}
                    data-testid={`quiz-${q}`}
                  >
                    {q === "major" ? "Trưởng (sáng)" : "Thứ (buồn)"}
                  </Button>
                );
              })}
            </div>
          </>
        )}
        {/* also under the result, so the last answer is not hidden by the score */}
        {answer && current && (
          <p className="text-sm" data-testid="quiz-feedback">
            {qualityOf(current) === answer ? "Đúng. " : "Chưa đúng. "}
            Đó là {CHORDS[current].symbol} ({CHORDS[current].nameVi}): hợp âm {NAME[qualityOf(current)]}.{" "}
            <button type="button" className="underline underline-offset-2" onClick={() => play(current)}>
              Nghe lại
            </button>
          </p>
        )}
      </section>
    </div>
  );
}
