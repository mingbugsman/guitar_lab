import { STANDARD_TUNING } from "@/lib/music/guitar";
import type { ChordShape } from "@/lib/music/chords";
import { cn } from "@/lib/utils";
import { chordColumnsLeftToRight, type Handedness } from "./orientation";

export type ChordDiagramProps = {
  chord: ChordShape;
  handedness?: Handedness;
  /** Minimum number of frets drawn. */
  frets?: number;
  showStringLabels?: boolean;
  className?: string;
};

const COL = 34;
const ROW = 42;
const PAD_X = 34;
const TOP = 74;

export function ChordDiagram({
  chord,
  handedness = "right",
  frets = 4,
  showStringLabels = true,
  className,
}: ChordDiagramProps) {
  const columns = chordColumnsLeftToRight(handedness);
  const maxFret = Math.max(
    0,
    ...Object.values(chord.frets).map((f) => (typeof f === "number" ? f - chord.baseFret + 1 : 0)),
  );
  const rows = Math.max(frets, maxFret);
  const gridW = COL * 5;
  const gridH = ROW * rows;
  const width = gridW + PAD_X * 2;
  const height = TOP + gridH + (showStringLabels ? 52 : 16);
  const colX = (i: number) => PAD_X + i * COL;
  const label = `Hợp âm ${chord.symbol} (${chord.nameVi}). ${describeChordShort(chord)}`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={label}
      className={cn("h-auto w-full max-w-[240px] select-none", className)}
      data-chord={chord.id}
      data-handedness={handedness}
    >
      <title>{label}</title>
      <text x={width / 2} y={26} textAnchor="middle" className="fill-foreground text-[22px] font-bold">
        {chord.symbol}
      </text>

      {/* nut or position label */}
      {chord.baseFret === 1 ? (
        <rect x={colX(0) - 2} y={TOP - 6} width={gridW + 4} height={7} rx={2} fill="var(--gl-diagram-ink)" />
      ) : (
        <text x={colX(0) - 12} y={TOP + ROW / 2 + 4} textAnchor="end" className="fill-foreground text-[12px]">
          {`${chord.baseFret}fr`}
        </text>
      )}

      {/* fret lines */}
      {Array.from({ length: rows + 1 }, (_, r) => (
        <line
          key={`f${r}`}
          x1={colX(0)}
          x2={colX(5)}
          y1={TOP + r * ROW}
          y2={TOP + r * ROW}
          stroke="var(--gl-diagram-ink)"
          strokeWidth={r === 0 ? 1.5 : 1.2}
          opacity={0.7}
        />
      ))}

      {/* strings */}
      {columns.map((s, i) => (
        <line
          key={`s${s}`}
          x1={colX(i)}
          x2={colX(i)}
          y1={TOP}
          y2={TOP + gridH}
          stroke="var(--gl-diagram-ink)"
          strokeWidth={0.8 + STANDARD_TUNING[s].gauge * 0.45}
        />
      ))}

      {/* open / muted markers above the nut */}
      {columns.map((s, i) => {
        const fret = chord.frets[s];
        const cx = colX(i);
        const cy = TOP - 22;
        if (fret === "x")
          return (
            <g key={`m${s}`} data-marker="muted" data-string={s}>
              <line x1={cx - 6} x2={cx + 6} y1={cy - 6} y2={cy + 6} stroke="var(--destructive)" strokeWidth={2.4} />
              <line x1={cx - 6} x2={cx + 6} y1={cy + 6} y2={cy - 6} stroke="var(--destructive)" strokeWidth={2.4} />
            </g>
          );
        if (fret === 0)
          return (
            <circle
              key={`o${s}`}
              data-marker="open"
              data-string={s}
              cx={cx}
              cy={cy}
              r={7}
              fill="none"
              stroke="var(--gl-diagram-ink)"
              strokeWidth={2}
            />
          );
        return null;
      })}

      {/* finger dots */}
      {columns.map((s, i) => {
        const fret = chord.frets[s];
        if (typeof fret !== "number" || fret === 0) return null;
        const r = fret - chord.baseFret;
        const cy = TOP + r * ROW + ROW / 2;
        const finger = chord.fingers[s];
        return (
          <g key={`d${s}`} data-marker="fretted" data-string={s} data-fret={fret}>
            <circle cx={colX(i)} cy={cy} r={13} fill="var(--gl-finger)" />
            <text
              x={colX(i)}
              y={cy + 5}
              textAnchor="middle"
              className="text-[14px] font-bold"
              fill="var(--gl-finger-text)"
            >
              {finger ?? ""}
            </text>
          </g>
        );
      })}

      {showStringLabels &&
        columns.map((s, i) => (
          <g key={`l${s}`}>
            <text
              x={colX(i)}
              y={TOP + gridH + 20}
              textAnchor="middle"
              className="fill-foreground font-mono text-[13px] font-semibold"
            >
              {STANDARD_TUNING[s].note}
            </text>
            <text x={colX(i)} y={TOP + gridH + 38} textAnchor="middle" className="fill-muted-foreground text-[11px]">
              {s}
            </text>
          </g>
        ))}
    </svg>
  );
}

const FINGER_NAMES: Record<string, string> = {
  "1": "ngón trỏ",
  "2": "ngón giữa",
  "3": "ngón áp út",
  "4": "ngón út",
  T: "ngón cái",
};

export function fingerName(finger: string | number): string {
  return FINGER_NAMES[String(finger)] ?? `ngón ${finger}`;
}

export type ChordInstruction = { string: number; text: string; kind: "fretted" | "open" | "muted" };

/**
 * Step-by-step instructions generated FROM THE SAME DATA as the diagram,
 * so the text can never disagree with the picture.
 * Ordered from string 6 (thickest, toward your face) to string 1.
 */
export function describeChord(chord: ChordShape): ChordInstruction[] {
  return ([6, 5, 4, 3, 2, 1] as const).map((s) => {
    const fret = chord.frets[s];
    const name = `Dây ${s} (${STANDARD_TUNING[s].note})`;
    if (fret === "x") return { string: s, kind: "muted", text: `${name}: không gảy — dấu X.` };
    if (fret === 0) return { string: s, kind: "open", text: `${name}: gảy buông — dấu O, không bấm.` };
    const finger = chord.fingers[s];
    return {
      string: s,
      kind: "fretted",
      text: `${name}: ngón ${finger} (${fingerName(finger ?? "")}) bấm phím ${fret}.`,
    };
  });
}

function describeChordShort(chord: ChordShape): string {
  return describeChord(chord)
    .map((i) => i.text)
    .join(" ");
}
