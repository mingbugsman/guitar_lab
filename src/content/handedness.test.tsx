import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { PostureDiagram } from "@/components/guitar/hand-diagrams";
import { ANATOMY_PARTS } from "@/components/guitar/guitar-anatomy";
import { LESSONS } from "./curriculum";
import { hardcodedSides, resolveHandedness, unknownTokens } from "./handedness";

/** Every string a learner can read in a lesson (titles, steps, captions, checklists…). */
function allStrings(value: unknown, out: string[] = []): string[] {
  if (typeof value === "string") out.push(value);
  else if (Array.isArray(value)) value.forEach((v) => allStrings(v, out));
  else if (value && typeof value === "object") Object.values(value).forEach((v) => allStrings(v, out));
  return out;
}

describe("resolveHandedness", () => {
  it("writes the fretting hand as the left hand for right-handed players and flips it for left-handed", () => {
    const text = "Buông {fretHand}. Đàn nằm trên đùi {PICKSIDE}, đầu đàn chĩa sang bên {FRETSIDE}.";
    expect(resolveHandedness(text, "right")).toBe("Buông tay trái. Đàn nằm trên đùi PHẢI, đầu đàn chĩa sang bên TRÁI.");
    expect(resolveHandedness(text, "left")).toBe("Buông tay phải. Đàn nằm trên đùi TRÁI, đầu đàn chĩa sang bên PHẢI.");
  });

  it("leaves unknown braces alone and reports them", () => {
    expect(resolveHandedness("{oops}", "left")).toBe("{oops}");
    expect(unknownTokens("{oops} {fretHand}")).toEqual(["oops"]);
  });

  it("detects wording that assumes a right-handed player", () => {
    expect(hardcodedSides("Đặt đàn lên đùi phải, buông tay trái.")).toEqual(["đùi phải", "tay trái"]);
    expect(hardcodedSides("Đàn phải đứng yên. Chọn đàn tay trái trong hồ sơ.")).toEqual([]);
  });
});

describe("lesson text follows the learner's handedness", () => {
  it.each(LESSONS.map((l) => [l.slug, l] as const))("%s has no hard-coded left/right and no broken tokens", (_slug, lesson) => {
    for (const text of allStrings(lesson)) {
      expect(unknownTokens(text), text).toEqual([]);
      expect(hardcodedSides(text), text).toEqual([]);
    }
  });

  it("keeps tokens out of titles and summaries (they are shown in lists without resolving)", () => {
    for (const l of LESSONS) expect(`${l.title} ${l.summary}`).not.toMatch(/\{\w+\}/);
  });

  it("anatomy descriptions use tokens too", () => {
    for (const part of ANATOMY_PARTS) {
      expect(unknownTokens(part.description), part.id).toEqual([]);
      expect(hardcodedSides(part.description), part.id).toEqual([]);
    }
  });
});

describe("PostureDiagram", () => {
  it("rests the guitar on the right thigh for right-handed players and the left thigh for left-handed", () => {
    const right = render(<PostureDiagram />);
    expect(right.getByTestId("posture-thigh").textContent).toBe("đùi PHẢI");
    right.unmount();
    const left = render(<PostureDiagram handedness="left" />);
    expect(left.getByTestId("posture-thigh").textContent).toBe("đùi TRÁI");
    expect(left.container.querySelector("svg")?.getAttribute("data-handedness")).toBe("left");
  });
});
