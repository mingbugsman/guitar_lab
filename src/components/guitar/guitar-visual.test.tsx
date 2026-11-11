import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { CHORDS } from "@/lib/music/chords";
import { ChordDiagram, describeChord } from "./chord-diagram";
import { Fretboard, fretboardLayout } from "./fretboard";

function stringY(container: HTMLElement, s: number): number {
  const line = container.querySelector(`g[data-string="${s}"] line`)!;
  return Number(line.getAttribute("y1"));
}

describe("Fretboard orientation", () => {
  it("player view puts string 6 on top (toward your face) and string 1 at the bottom", () => {
    const { container } = render(<Fretboard view="player" />);
    expect(stringY(container, 6)).toBeLessThan(stringY(container, 1));
    expect(container.querySelector('[data-edge="top"]')?.textContent).toContain("phía mặt bạn");
  });

  it("tab view puts string 1 on top", () => {
    const { container } = render(<Fretboard view="tab" />);
    expect(stringY(container, 1)).toBeLessThan(stringY(container, 6));
    expect(container.querySelector('[data-edge="top"]')?.textContent).toContain("phía sàn nhà");
  });

  it("left-handed view mirrors the board: higher frets move toward the left", () => {
    const markers = [
      { string: 6 as const, fret: 1 },
      { string: 6 as const, fret: 3 },
    ];
    const right = render(<Fretboard markers={markers} />).container;
    const left = render(<Fretboard markers={markers} handedness="left" />).container;
    const x = (c: HTMLElement, f: number) =>
      Number(c.querySelector(`[data-marker="fretted"][data-fret="${f}"] circle`)!.getAttribute("cx"));
    expect(x(right, 3)).toBeGreaterThan(x(right, 1));
    expect(x(left, 3)).toBeLessThan(x(left, 1));
  });
});

describe("ChordDiagram", () => {
  it("renders Em: two fretted dots and four open strings", () => {
    const { container } = render(<ChordDiagram chord={CHORDS.em} />);
    expect(container.querySelectorAll('[data-marker="fretted"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-marker="open"]')).toHaveLength(4);
    expect(container.querySelectorAll('[data-marker="muted"]')).toHaveLength(0);
    expect(container.textContent).toContain("Em");
  });

  it("renders D with strings 6 and 5 muted", () => {
    const { container } = render(<ChordDiagram chord={CHORDS.d} />);
    const muted = [...container.querySelectorAll('[data-marker="muted"]')].map((n) => n.getAttribute("data-string"));
    expect(muted.sort()).toEqual(["5", "6"]);
  });

  it("draws string 6 on the LEFT for right-handed players and on the RIGHT for left-handed", () => {
    const xOf = (c: HTMLElement, s: string) =>
      Number(c.querySelector(`[data-marker="open"][data-string="${s}"]`)!.getAttribute("cx"));
    const r = render(<ChordDiagram chord={CHORDS.em} />).container;
    const l = render(<ChordDiagram chord={CHORDS.em} handedness="left" />).container;
    expect(xOf(r, "6")).toBeLessThan(xOf(r, "1"));
    expect(xOf(l, "6")).toBeGreaterThan(xOf(l, "1"));
  });

  it("shows finger numbers that match the chord data", () => {
    const { container } = render(<ChordDiagram chord={CHORDS.am} />);
    const dot = container.querySelector('[data-marker="fretted"][data-string="2"]')!;
    expect(dot.getAttribute("data-fret")).toBe("1");
    expect(dot.textContent).toBe("1");
  });
});

describe("describeChord (text generated from the same data as the picture)", () => {
  it("describes Am correctly from string 6 to 1", () => {
    expect(describeChord(CHORDS.am).map((s) => s.text)).toEqual([
      "Dây 6 (E): không gảy — dấu X.",
      "Dây 5 (A): gảy buông — dấu O, không bấm.",
      "Dây 4 (D): ngón 2 (ngón giữa) bấm phím 2.",
      "Dây 3 (G): ngón 3 (ngón áp út) bấm phím 2.",
      "Dây 2 (B): ngón 1 (ngón trỏ) bấm phím 1.",
      "Dây 1 (E): gảy buông — dấu O, không bấm.",
    ]);
  });
});

describe("Fretboard fits narrow screens", () => {
  it("keeps the roomy layout when there is space, and lays out for the exact width on a phone", () => {
    expect(fretboardLayout(5, 1200).compact).toBe(false);
    const phone = fretboardLayout(12, 320);
    expect(phone.compact).toBe(true);
    expect(phone.width).toBe(320);
    expect(phone.fretW).toBeGreaterThan(17);
  });

  it("on a phone, orientation labels stay and still mirror for left-handed players", () => {
    const right = render(<Fretboard frets={12} fitWidth={320} />).container;
    const svg = right.querySelector("svg")!;
    expect(svg.getAttribute("viewBox")).toBe("0 0 320 236");
    const head = right.querySelector('[data-edge="headstock"]')!;
    expect(head.textContent).toContain("◀ đầu đàn");
    expect(Number(head.getAttribute("x"))).toBeLessThan(160);
    expect(right.querySelector('[data-fret-number="12"]')?.textContent).toBe("12");

    const left = render(<Fretboard frets={12} fitWidth={320} handedness="left" />).container;
    const headL = left.querySelector('[data-edge="headstock"]')!;
    expect(headL.textContent).toContain("đầu đàn ▶");
    expect(Number(headL.getAttribute("x"))).toBeGreaterThan(160);
  });
});

describe("Fretboard cells can be played", () => {
  it("reports the string and fret of the cell that was pressed, including the open string", async () => {
    const { fireEvent } = await import("@testing-library/react");
    const pressed: string[] = [];
    const { container } = render(<Fretboard frets={5} onCellPress={(c) => pressed.push(`${c.string}-${c.fret}`)} />);
    expect(container.querySelectorAll("[data-cell]")).toHaveLength(6 * 6);
    fireEvent.pointerDown(container.querySelector('[data-cell="6-3"]')!);
    fireEvent.pointerDown(container.querySelector('[data-cell="1-0"]')!);
    expect(pressed).toEqual(["6-3", "1-0"]);
  });

  it("puts fret 1 next to the nut on both sides when mirrored for left-handed players", () => {
    const x = (handedness: "right" | "left", cell: string) => {
      const { container } = render(<Fretboard frets={5} handedness={handedness} onCellPress={() => {}} />);
      const r = container.querySelector(`[data-cell="${cell}"]`)!;
      return Number(r.getAttribute("x"));
    };
    expect(x("right", "6-1")).toBeLessThan(x("right", "6-5"));
    expect(x("left", "6-1")).toBeGreaterThan(x("left", "6-5"));
    // the open-string zone is on the headstock side
    expect(x("right", "6-0")).toBeLessThan(x("right", "6-1"));
    expect(x("left", "6-0")).toBeGreaterThan(x("left", "6-1"));
  });

  it("draws drill overlays on the right cell", () => {
    const { container } = render(
      <Fretboard frets={5} overlays={[{ string: 4, fret: 2, kind: "active", label: "2" }, { string: 4, fret: 3, kind: "next" }]} />,
    );
    expect(container.querySelector('[data-overlay="active"]')?.getAttribute("data-fret")).toBe("2");
    expect(container.querySelector('[data-overlay="active"]')?.textContent).toBe("2");
    expect(container.querySelector('[data-overlay="next"]')?.getAttribute("data-string")).toBe("4");
  });
});

describe("barre chords", () => {
  it("draws one bar for the barre instead of a dot per string, mirrored for left-handed players", () => {
    const right = render(<ChordDiagram chord={CHORDS.f} />).container;
    const bar = right.querySelector('[data-marker="barre"]')!;
    expect(bar).not.toBeNull();
    expect(bar.textContent).toBe("1");
    // strings 2 and 1 are only covered by the bar; strings 5, 4, 3 have their own fingers
    expect(right.querySelectorAll('[data-marker="fretted"]')).toHaveLength(3);
    const leftX = Number(render(<ChordDiagram chord={CHORDS.f} handedness="left" />).container.querySelector('[data-marker="barre"] rect')!.getAttribute("x"));
    expect(leftX).toBe(Number(bar.querySelector("rect")!.getAttribute("x"))); // the bar spans all 6 strings either way
  });

  it("says where the barre goes in words", () => {
    const lines = describeChord(CHORDS.bm).map((l) => l.text);
    expect(lines[1]).toBe("Dây 5 (A): ngón 1 (ngón trỏ) chặn phím 2, nằm ngang từ dây 5 đến dây 1.");
    expect(lines[0]).toBe("Dây 6 (E): không gảy — dấu X.");
  });

  it("labels the starting fret when the shape is up the neck", () => {
    const { container } = render(<ChordDiagram chord={CHORDS.bm} />);
    expect(container.textContent).toContain("2fr");
  });
});
