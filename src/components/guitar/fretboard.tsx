import { STANDARD_TUNING, INLAY_FRETS, noteAt, type StringNumber } from "@/lib/music/guitar";
import type { Finger, FretValue } from "@/lib/music/chords";
import { cn } from "@/lib/utils";
import {
  stringRowsTopToBottom,
  viewEdgeLabels,
  PHYSICAL,
  type FretboardView as View,
  type Handedness,
} from "./orientation";

export type FretMarker = {
  string: StringNumber;
  fret: FretValue;
  finger?: Finger;
  label?: string;
  tone?: "default" | "root" | "highlight";
};

/** A cell is one string at one fret; fret 0 is the open string (the zone before the nut). */
export type FretCell = { string: StringNumber; fret: number };

/**
 * Temporary marks drawn on top of everything (practice drills, taps):
 * - active: play this now (filled, finger number inside)
 * - next: coming up (dashed ring)
 * - held: a finger that stays down (pale fill)
 * - pressed: the cell the learner just tapped (ring + note name)
 */
export type FretOverlay = FretCell & { kind: "active" | "next" | "held" | "pressed"; label?: string };

export type FretboardProps = {
  view?: View;
  handedness?: Handedness;
  /** Number of frets drawn after the nut. */
  frets?: number;
  markers?: FretMarker[];
  highlightStrings?: StringNumber[];
  /** Show the natural note name at every fret position (for note-learning lessons). */
  showAllNotes?: boolean;
  showOrientation?: boolean;
  onStringClick?: (string: StringNumber) => void;
  /** Makes every cell tappable: open strings (fret 0) and every fret on every string. */
  onCellPress?: (cell: FretCell) => void;
  /** Keyboard focus position, drawn as an outline. */
  focusCell?: FretCell | null;
  overlays?: FretOverlay[];
  className?: string;
  title?: string;
  /**
   * Real pixel width available. When the roomy layout would not fit, the board is laid out
   * for exactly this width (narrower frets, labels moved) so text stays readable and the
   * picture never needs sideways scrolling.
   */
  fitWidth?: number;
};

const NUT_W = 8;
const STRING_GAP = 30;
const TOP = 40;
const BOTTOM = 46;
const ROOMY = { labelW: 96, fretW: 66, side: 92 };
const COMPACT = { labelW: 84, side: 20 };

/** Geometry of the board; exported for tests. */
export function fretboardLayout(frets: number, fitWidth?: number) {
  const roomyWidth = ROOMY.labelW + NUT_W + frets * ROOMY.fretW + ROOMY.side;
  if (!fitWidth || fitWidth >= roomyWidth) {
    return { compact: false, labelW: ROOMY.labelW, fretW: ROOMY.fretW, side: ROOMY.side, width: roomyWidth };
  }
  const width = Math.max(fitWidth, 240);
  const fretW = (width - COMPACT.labelW - NUT_W - COMPACT.side) / frets;
  return { compact: true, labelW: COMPACT.labelW, fretW, side: COMPACT.side, width };
}

export function Fretboard({
  view = "player",
  handedness = "right",
  frets = 5,
  markers = [],
  highlightStrings = [],
  showAllNotes = false,
  showOrientation = true,
  onStringClick,
  onCellPress,
  focusCell,
  overlays = [],
  className,
  title,
  fitWidth,
}: FretboardProps) {
  const rows = stringRowsTopToBottom(view);
  const { compact, labelW: LABEL_W, fretW: FRET_W, width } = fretboardLayout(frets, fitWidth);
  const boardW = NUT_W + frets * FRET_W;
  // Finger dots and note bubbles shrink with narrow frets so neighbours never touch.
  const dotR = Math.min(12, FRET_W * 0.4);
  const noteR = Math.min(10, FRET_W * 0.36);
  const shortFretNumbers = FRET_W < 46;
  const boardH = STRING_GAP * 5;
  const height = TOP + boardH + BOTTOM;
  const left = handedness === "left";

  // x in "right-handed" space → mirrored for left-handed players.
  const X = (x: number) => (left ? width - x : x);
  const boardX0 = LABEL_W;
  const fretLineX = (f: number) => boardX0 + NUT_W + f * FRET_W; // f = 0 → nut edge
  const fretCenterX = (f: number) => boardX0 + NUT_W + (f - 0.5) * FRET_W;
  const rowY = (s: StringNumber) => TOP + rows.indexOf(s) * STRING_GAP;
  const OPEN_X = boardX0 - 12; // where open-string marks sit, just before the nut
  const cellX = (f: number) => (f === 0 ? OPEN_X : fretCenterX(f));
  /** Hit box of a cell in right-handed space: [x0, x1). Fret 0 spans the labels too. */
  const cellSpan = (f: number): [number, number] => (f === 0 ? [4, boardX0 + NUT_W] : [fretLineX(f - 1), fretLineX(f)]);
  const edges = viewEdgeLabels(view);
  const anchor = (a: "start" | "end") => (left ? (a === "start" ? "end" : "start") : a);

  const describe =
    title ??
    `Cần đàn, góc nhìn ${view === "player" ? "người chơi nhìn xuống" : "kiểu Tab"}, ${
      left ? "đàn tay trái" : "đàn tay phải"
    }`;

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={describe}
      className={cn("h-auto w-full select-none", className)}
      data-view={view}
      data-handedness={handedness}
    >
      <title>{describe}</title>

      {/* neck wood */}
      <rect
        x={Math.min(X(boardX0), X(boardX0 + boardW + 20))}
        y={TOP - 14}
        width={boardW + 20}
        height={boardH + 28}
        rx={4}
        fill="var(--gl-wood-neck)"
      />
      {/* nut */}
      <rect
        x={Math.min(X(boardX0), X(boardX0 + NUT_W))}
        y={TOP - 14}
        width={NUT_W}
        height={boardH + 28}
        fill="var(--gl-nut)"
      />

      {/* inlays */}
      {INLAY_FRETS.filter((f) => f <= frets).map((f) =>
        f === 12 ? (
          <g key={f}>
            <circle cx={X(fretCenterX(f))} cy={TOP + STRING_GAP * 1.5} r={6} fill="var(--gl-inlay)" opacity={0.75} />
            <circle cx={X(fretCenterX(f))} cy={TOP + STRING_GAP * 3.5} r={6} fill="var(--gl-inlay)" opacity={0.75} />
          </g>
        ) : (
          <circle key={f} cx={X(fretCenterX(f))} cy={TOP + boardH / 2} r={6} fill="var(--gl-inlay)" opacity={0.75} />
        ),
      )}

      {/* frets */}
      {Array.from({ length: frets }, (_, i) => i + 1).map((f) => (
        <line
          key={f}
          x1={X(fretLineX(f))}
          x2={X(fretLineX(f))}
          y1={TOP - 14}
          y2={TOP + boardH + 14}
          stroke="var(--gl-fret)"
          strokeWidth={3}
        />
      ))}

      {/* strings + labels */}
      {rows.map((s) => {
        const info = STANDARD_TUNING[s];
        const y = rowY(s);
        const highlighted = highlightStrings.includes(s);
        const wound = s >= 4;
        return (
          <g
            key={s}
            data-string={s}
            className={onStringClick ? "cursor-pointer" : undefined}
            onClick={onStringClick ? () => onStringClick(s) : undefined}
            role={onStringClick ? "button" : undefined}
            tabIndex={onStringClick ? 0 : undefined}
            aria-label={onStringClick ? `Phát âm dây ${s} (${info.note})` : undefined}
            onKeyDown={
              onStringClick
                ? (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      onStringClick(s);
                    }
                  }
                : undefined
            }
          >
            {/* generous invisible hit area for touch */}
            {onStringClick && (
              <rect
                x={Math.min(X(4), X(width - 4))}
                y={y - STRING_GAP / 2}
                width={width - 8}
                height={STRING_GAP}
                fill="transparent"
              />
            )}
            {highlighted && (
              <rect
                x={Math.min(X(boardX0), X(boardX0 + boardW))}
                y={y - 9}
                width={boardW}
                height={18}
                rx={9}
                fill="var(--gl-highlight)"
                opacity={0.35}
              />
            )}
            <line
              x1={X(boardX0)}
              x2={X(boardX0 + boardW + 20)}
              y1={y}
              y2={y}
              stroke={wound ? "var(--gl-string)" : "var(--gl-string-plain)"}
              strokeWidth={info.gauge}
            />
            <text
              x={X(8)}
              y={y + 4}
              textAnchor={anchor("start")}
              className="fill-foreground text-[12px] font-semibold"
            >
              {`Dây ${s}`}
            </text>
            <text
              x={X(LABEL_W - (compact ? 27 : 30))}
              y={y + 4}
              textAnchor={anchor("end")}
              className="fill-muted-foreground font-mono text-[12px]"
            >
              {info.note}
            </text>
          </g>
        );
      })}

      {/* note names everywhere (learning mode) */}
      {showAllNotes &&
        rows.flatMap((s) =>
          Array.from({ length: frets }, (_, i) => i + 1).map((f) => {
            const n = noteAt(s, f);
            if (n.includes("#")) return null;
            return (
              <g key={`${s}-${f}`}>
                <circle cx={X(fretCenterX(f))} cy={rowY(s)} r={noteR} fill="var(--card)" stroke="var(--gl-fret)" />
                <text
                  x={X(fretCenterX(f))}
                  y={rowY(s) + 4}
                  textAnchor="middle"
                  className={cn("fill-foreground font-semibold", noteR < 9 ? "text-[10px]" : "text-[11px]")}
                >
                  {n}
                </text>
              </g>
            );
          }),
        )}

      {/* markers */}
      {markers.map((m, i) => {
        const y = rowY(m.string);
        if (m.fret === "x") {
          const cx = X(boardX0 - 12);
          return (
            <g key={i} data-marker="muted" data-string={m.string}>
              <line x1={cx - 6} x2={cx + 6} y1={y - 6} y2={y + 6} stroke="var(--destructive)" strokeWidth={2.5} />
              <line x1={cx - 6} x2={cx + 6} y1={y + 6} y2={y - 6} stroke="var(--destructive)" strokeWidth={2.5} />
            </g>
          );
        }
        if (m.fret === 0) {
          return (
            <circle
              key={i}
              data-marker="open"
              data-string={m.string}
              cx={X(boardX0 - 12)}
              cy={y}
              r={7}
              fill="var(--card)"
              stroke="var(--gl-finger)"
              strokeWidth={2.5}
            />
          );
        }
        const fill =
          m.tone === "root" ? "var(--gl-root)" : m.tone === "highlight" ? "var(--gl-highlight)" : "var(--gl-finger)";
        return (
          <g key={i} data-marker="fretted" data-string={m.string} data-fret={m.fret}>
            <circle cx={X(fretCenterX(m.fret))} cy={y} r={dotR} fill={fill} stroke="var(--card)" strokeWidth={2} />
            <text
              x={X(fretCenterX(m.fret))}
              y={y + 4.5}
              textAnchor="middle"
              className="text-[12px] font-bold"
              fill="var(--gl-finger-text)"
            >
              {m.label ?? m.finger ?? ""}
            </text>
          </g>
        );
      })}

      {/* fret numbers */}
      {Array.from({ length: frets }, (_, i) => i + 1).map((f) => (
        <text
          key={f}
          x={X(fretCenterX(f))}
          y={TOP + boardH + 32}
          textAnchor="middle"
          className="fill-muted-foreground text-[11px]"
          data-fret-number={f}
        >
          {shortFretNumbers ? `${f}` : `Phím ${f}`}
        </text>
      ))}
      {shortFretNumbers && (
        <text
          x={X(boardX0)}
          y={TOP + boardH + 32}
          textAnchor={anchor("end")}
          dx={left ? 10 : -10}
          className="fill-muted-foreground text-[11px]"
        >
          Phím
        </text>
      )}

      {/* orientation anchors that match the real guitar */}
      {showOrientation && (
        <g className="fill-muted-foreground text-[10.5px]">
          <text x={X(boardX0 + boardW / 2)} y={14} textAnchor="middle" data-edge="top">
            {edges.top}
          </text>
          {compact ? (
            <>
              {/* narrow screens: headstock / body move to the top and bottom corners */}
              <text x={X(4)} y={14} textAnchor={anchor("start")} data-edge="headstock">
                {left ? `${PHYSICAL.headstock} ▶` : `◀ ${PHYSICAL.headstock}`}
              </text>
              <text x={X(width - 4)} y={height - 2} textAnchor={anchor("end")} data-edge="body">
                {left ? `◀ ${PHYSICAL.body}` : `${PHYSICAL.body} ▶`}
              </text>
            </>
          ) : (
            <>
              <text
                x={X(boardX0)}
                y={TOP + boardH + 32}
                textAnchor={anchor("end")}
                dx={left ? 10 : -10}
                data-edge="headstock"
              >
                {left ? `${PHYSICAL.headstock} ▶` : `◀ ${PHYSICAL.headstock}`}
              </text>
              <text x={X(width - 4)} y={TOP + boardH / 2 + 4} textAnchor={anchor("end")} data-edge="body">
                {left ? `◀ ${PHYSICAL.body}` : `${PHYSICAL.body} ▶`}
              </text>
            </>
          )}
          <text x={X(boardX0 + boardW / 2)} y={height - 2} textAnchor="middle" data-edge="bottom">
            {edges.bottom}
          </text>
        </g>
      )}

      {/* overlays: drills and taps, above the static markers */}
      {overlays.map((o, i) => {
        const cx = X(cellX(o.fret));
        const cy = rowY(o.string);
        const r = o.fret === 0 ? 8 : dotR;
        const common = { "data-overlay": o.kind, "data-string": o.string, "data-fret": o.fret } as const;
        if (o.kind === "next")
          return (
            <circle key={i} {...common} cx={cx} cy={cy} r={r} fill="none" stroke="var(--gl-finger)" strokeWidth={2} strokeDasharray="3 3" />
          );
        if (o.kind === "held") return <circle key={i} {...common} cx={cx} cy={cy} r={r} fill="var(--gl-finger)" opacity={0.35} />;
        if (o.kind === "pressed")
          return (
            <g key={i} {...common} className="pointer-events-none">
              <circle cx={cx} cy={cy} r={r + 3} fill="none" stroke="var(--gl-highlight)" strokeWidth={3} />
              <text x={cx} y={cy - r - 6} textAnchor="middle" className="fill-foreground text-[12px] font-bold">
                {o.label ?? noteAt(o.string, o.fret)}
              </text>
            </g>
          );
        return (
          <g key={i} {...common}>
            <circle cx={cx} cy={cy} r={r + 1} fill="var(--gl-finger)" stroke="var(--card)" strokeWidth={2} />
            {o.label && (
              <text x={cx} y={cy + 4.5} textAnchor="middle" className="text-[12px] font-bold" fill="var(--gl-finger-text)">
                {o.label}
              </text>
            )}
          </g>
        );
      })}

      {focusCell && (
        <rect
          data-focus-cell={`${focusCell.string}-${focusCell.fret}`}
          x={Math.min(X(cellSpan(focusCell.fret)[0]), X(cellSpan(focusCell.fret)[1])) + 1}
          y={rowY(focusCell.string) - STRING_GAP / 2 + 1}
          width={cellSpan(focusCell.fret)[1] - cellSpan(focusCell.fret)[0] - 2}
          height={STRING_GAP - 2}
          rx={4}
          fill="none"
          stroke="var(--foreground)"
          strokeWidth={2}
          className="pointer-events-none"
        />
      )}

      {/* tap layer: one transparent box per cell, topmost so every cell is reachable */}
      {onCellPress &&
        rows.flatMap((s) =>
          Array.from({ length: frets + 1 }, (_, f) => {
            const [x0, x1] = cellSpan(f);
            return (
              <rect
                key={`${s}-${f}`}
                data-cell={`${s}-${f}`}
                x={Math.min(X(x0), X(x1))}
                y={rowY(s) - STRING_GAP / 2}
                width={x1 - x0}
                height={STRING_GAP}
                fill="transparent"
                className="cursor-pointer"
                onPointerDown={(e) => {
                  e.preventDefault();
                  onCellPress({ string: s, fret: f });
                }}
              />
            );
          }),
        )}
    </svg>
  );
}
