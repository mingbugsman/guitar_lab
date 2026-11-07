import { cn } from "@/lib/utils";
import type { Handedness } from "./orientation";

/**
 * Fretting hand seen from the BACK (the way you see your own hand when you hold it
 * up in front of the fretboard). Right-handed players fret with the LEFT hand.
 */
export function FingerNumberDiagram({ handedness = "right", className }: { handedness?: Handedness; className?: string }) {
  // Drawn as a left hand seen from the back: thumb on the RIGHT side of the picture.
  const fingers = [
    { n: "4", name: "Út", x: 58, len: 70, angle: -10 },
    { n: "3", name: "Áp út", x: 92, len: 92, angle: -4 },
    { n: "2", name: "Giữa", x: 126, len: 100, angle: 0 },
    { n: "1", name: "Trỏ", x: 160, len: 90, angle: 5 },
  ];
  const mirror = handedness === "left";
  const handName = handedness === "right" ? "tay trái" : "tay phải";
  return (
    <svg
      viewBox="0 0 280 300"
      role="img"
      aria-label={`Số ngón tay của ${handName} (tay bấm): 1 trỏ, 2 giữa, 3 áp út, 4 út, T ngón cái`}
      className={cn("mx-auto h-auto w-full max-w-[260px]", className)}
    >
      <g transform={mirror ? "translate(280,0) scale(-1,1)" : undefined}>
        <rect x={42} y={150} width={140} height={120} rx={40} fill="var(--accent)" stroke="var(--gl-wood-body-edge)" strokeWidth={2} />
        {fingers.map((f) => (
          <g key={f.n} transform={`rotate(${f.angle} ${f.x} 160)`}>
            <rect x={f.x - 15} y={160 - f.len} width={30} height={f.len + 10} rx={15} fill="var(--accent)" stroke="var(--gl-wood-body-edge)" strokeWidth={2} />
            <circle cx={f.x} cy={160 - f.len + 18} r={14} fill="var(--gl-finger)" />
          </g>
        ))}
        <g transform="rotate(50 190 220)">
          <rect x={175} y={150} width={32} height={86} rx={16} fill="var(--accent)" stroke="var(--gl-wood-body-edge)" strokeWidth={2} />
          <circle cx={191} cy={168} r={14} fill="var(--muted-foreground)" />
        </g>
      </g>
      {/* labels are drawn un-mirrored so the text stays readable */}
      {fingers.map((f) => {
        const rad = (f.angle * Math.PI) / 180;
        const cx0 = f.x + Math.sin(rad) * (f.len - 18) * 1;
        const cy0 = 160 - Math.cos(rad) * (f.len - 18);
        const cx = mirror ? 280 - cx0 : cx0;
        return (
          <g key={f.n}>
            <text x={cx} y={cy0 + 5} textAnchor="middle" className="text-[15px] font-bold" fill="var(--gl-finger-text)">
              {f.n}
            </text>
          </g>
        );
      })}
      <text x={mirror ? 280 - 231 : 231} y={192} textAnchor="middle" className="text-[15px] font-bold" fill="var(--gl-finger-text)">
        T
      </text>
      <text x={140} y={292} textAnchor="middle" className="fill-muted-foreground text-[12px]">
        {`Mu bàn ${handName} (tay bấm)`}
      </text>
    </svg>
  );
}

/** Seated posture, seen from the front (as if a friend were watching you play). */
export function PostureDiagram({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 360 300"
      role="img"
      aria-label="Tư thế ngồi: lưng thẳng, thùng đàn đặt trên đùi phải, cần đàn hơi chếch lên về bên trái của người chơi"
      className={cn("mx-auto h-auto w-full max-w-[420px]", className)}
    >
      {/* chair */}
      <rect x={110} y={196} width={140} height={10} rx={3} fill="var(--muted-foreground)" opacity={0.5} />
      <rect x={118} y={206} width={8} height={80} fill="var(--muted-foreground)" opacity={0.5} />
      <rect x={234} y={206} width={8} height={80} fill="var(--muted-foreground)" opacity={0.5} />
      {/* person (facing us: their right side is on OUR left) */}
      <circle cx={180} cy={46} r={24} fill="var(--accent)" stroke="var(--gl-diagram-ink)" strokeWidth={2} />
      <path d="M150,78 L210,78 L216,194 L144,194 Z" fill="var(--accent)" stroke="var(--gl-diagram-ink)" strokeWidth={2} />
      {/* legs */}
      <path d="M146,194 L146,206 L130,206 L130,286" stroke="var(--gl-diagram-ink)" strokeWidth={14} fill="none" strokeLinecap="round" />
      <path d="M214,194 L214,206 L230,206 L230,286" stroke="var(--gl-diagram-ink)" strokeWidth={14} fill="none" strokeLinecap="round" />
      {/* guitar: body on player's right thigh (our left), neck rising toward player's left (our right) */}
      <g transform="rotate(-14 150 170)">
        <ellipse cx={128} cy={170} rx={44} ry={36} fill="var(--gl-wood-body)" stroke="var(--gl-wood-body-edge)" strokeWidth={3} />
        <ellipse cx={168} cy={170} rx={30} ry={28} fill="var(--gl-wood-body)" stroke="var(--gl-wood-body-edge)" strokeWidth={3} />
        <circle cx={160} cy={170} r={11} fill="oklch(0.22 0.03 50)" />
        <rect x={192} y={163} width={120} height={14} rx={3} fill="var(--gl-wood-neck)" />
        <rect x={310} y={158} width={30} height={24} rx={5} fill="var(--gl-wood-headstock)" />
      </g>
      {/* arms */}
      <path d="M152,86 Q118,120 140,160" stroke="var(--gl-diagram-ink)" strokeWidth={10} fill="none" strokeLinecap="round" />
      <path d="M208,86 Q260,110 280,128" stroke="var(--gl-diagram-ink)" strokeWidth={10} fill="none" strokeLinecap="round" />
      {/* annotations */}
      <g className="fill-foreground text-[11px]">
        <text x={8} y={20}>Lưng thẳng, vai thả lỏng</text>
        <text x={8} y={250}>Thùng đàn trên</text>
        <text x={8} y={264}>đùi PHẢI</text>
        <text x={262} y={110}>Cần đàn hơi</text>
        <text x={262} y={124}>chếch lên</text>
        <text x={262} y={234}>Hai bàn chân</text>
        <text x={262} y={248}>đặt phẳng</text>
      </g>
      <text x={180} y={298} textAnchor="middle" className="fill-muted-foreground text-[10px]">
        Nhìn từ phía trước (người đối diện) — người chơi thuận tay phải
      </text>
    </svg>
  );
}
