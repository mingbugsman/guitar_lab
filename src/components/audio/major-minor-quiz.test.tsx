import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

const played: string[] = [];
vi.mock("@/lib/audio/guitar-synth", () => ({
  strumChord: (chord: { id: string }) => {
    played.push(chord.id);
    return Promise.resolve();
  },
}));

import { CHORDS, type ChordId } from "@/lib/music/chords";
import { MajorMinorQuiz } from "./major-minor-quiz";

const quality = (id: string) => CHORDS[id as ChordId].quality;

describe("Trưởng hay thứ? quiz", () => {
  afterEach(() => {
    cleanup();
    played.length = 0;
  });

  it("answers stay locked until the chord has been heard", () => {
    render(<MajorMinorQuiz />);
    expect(screen.getByTestId("quiz-major")).toBeDisabled();
    fireEvent.click(screen.getByTestId("quiz-next"));
    expect(played).toHaveLength(1);
    expect(screen.getByTestId("quiz-major")).toBeEnabled();
  });

  it("scores ten questions and shows what each chord was", () => {
    render(<MajorMinorQuiz />);
    for (let i = 0; i < 10; i++) {
      fireEvent.click(screen.getByTestId("quiz-next"));
      const asked = played.at(-1)!;
      // answer the first five right, the rest wrong
      const right = quality(asked) === "major" ? "major" : "minor";
      const wrong = right === "major" ? "minor" : "major";
      fireEvent.click(screen.getByTestId(`quiz-${i < 5 ? right : wrong}`));
      expect(screen.getByTestId("quiz-feedback").textContent).toContain(CHORDS[asked as ChordId].symbol);
      expect(screen.getByTestId("quiz-feedback").textContent).toMatch(i < 5 ? /^Đúng/ : /^Chưa đúng/);
      if (i < 9) expect(screen.getByTestId("quiz-next")).toBeInTheDocument();
    }
    expect(screen.getByTestId("quiz-result").textContent).toContain("5 trên 10");
    fireEvent.click(screen.getByRole("button", { name: /Làm lại/ }));
    expect(screen.getByTestId("quiz-score").textContent).toContain("0/10");
  });
});
