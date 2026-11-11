"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { resolveHandedness } from "@/content/handedness";
import type { Handedness } from "./orientation";

/**
 * Upright front view of an acoustic guitar (the same orientation as chord diagrams):
 * headstock at the top, string 6 on the LEFT for a right-handed guitar.
 */

export type PartId =
  | "headstock"
  | "tuners"
  | "nut"
  | "neck"
  | "frets"
  | "inlays"
  | "body"
  | "soundhole"
  | "strings"
  | "bridge"
  | "saddle";

type Part = {
  id: PartId;
  name: string;
  en: string;
  description: string;
  anchor: [number, number];
  side: "left" | "right";
  labelY: number;
};

const SCALE = 520; // nut (y=100) → saddle (y=620)
const NUT_Y = 100;
const fretY = (n: number) => NUT_Y + SCALE * (1 - 2 ** (-n / 12));
const VISIBLE_FRETS = Array.from({ length: 14 }, (_, i) => i + 1).filter((n) => fretY(n) < 390);
const fretCenter = (n: number) => (fretY(n - 1) + fretY(n)) / 2;

export const ANATOMY_PARTS: Part[] = [
  {
    id: "headstock",
    name: "Đầu đàn",
    en: "Headstock",
    description:
      "Phần trên cùng của cây đàn, nơi gắn các khóa lên dây. Khi bạn ôm đàn đúng tư thế, đầu đàn chĩa sang bên {FRETSIDE} của bạn.",
    anchor: [160, 42],
    side: "left",
    labelY: 42,
  },
  {
    id: "tuners",
    name: "Khóa đàn",
    en: "Tuning pegs",
    description:
      "Mỗi dây quấn vào một khóa. Vặn khóa làm dây căng hơn (nốt cao lên) hoặc chùng hơn (nốt thấp xuống). Muốn biết khóa nào của dây nào: dùng ngón tay lần theo dây đó từ lược đàn lên tới khóa.",
    anchor: [226, 54],
    side: "right",
    labelY: 54,
  },
  {
    id: "nut",
    name: "Lược đàn",
    en: "Nut",
    description:
      "Thanh nhỏ màu trắng/ngà có 6 rãnh giữ dây, nằm giữa đầu đàn và cần đàn. Đây là điểm bắt đầu của phần dây rung khi bạn gảy dây buông.",
    anchor: [160, NUT_Y],
    side: "left",
    labelY: 104,
  },
  {
    id: "frets",
    name: "Phím đàn",
    en: "Frets",
    description:
      "Các thanh kim loại nằm ngang trên cần đàn. 'Phím 1' là khoảng trống giữa lược đàn và thanh kim loại đầu tiên. Bấm ngón tay NGAY SÁT phía sau thanh kim loại (phía lược đàn) để tiếng rõ nhất.",
    anchor: [130, fretY(3)],
    side: "left",
    labelY: 190,
  },
  {
    id: "neck",
    name: "Cần đàn & mặt phím",
    en: "Neck & fretboard",
    description:
      "Phần dài nối đầu đàn với thùng đàn. Mặt phía trước (mặt phím) là nơi tay bấm ({fretHand}) đặt các ngón. Ngón cái tay bấm đặt ở mặt sau cần đàn.",
    anchor: [190, 205],
    side: "right",
    labelY: 160,
  },
  {
    id: "inlays",
    name: "Chấm định vị",
    en: "Position markers",
    description:
      "Các chấm tròn ở phím 3, 5, 7, 9 và hai chấm ở phím 12 (vị trí tròn một quãng tám). Chúng giúp bạn đếm phím nhanh mà không phải đếm từ đầu. Nhiều đàn còn có chấm nhỏ ở cạnh trên cần đàn để bạn nhìn khi chơi.",
    anchor: [160, fretCenter(5)],
    side: "right",
    labelY: 240,
  },
  {
    id: "body",
    name: "Thùng đàn",
    en: "Body",
    description:
      "Phần lớn nhất, rỗng bên trong ở đàn acoustic/classic để khuếch đại âm thanh. Khi ngồi, chỗ thắt eo của thùng đàn đặt trên đùi. Đàn điện có thân đặc và dùng pickup thay cho thùng cộng hưởng.",
    anchor: [58, 600],
    side: "left",
    labelY: 600,
  },
  {
    id: "soundhole",
    name: "Lỗ thoát âm",
    en: "Sound hole",
    description:
      "Lỗ tròn trên mặt đàn acoustic. Tay gảy thường gảy dây ở khoảng giữa lỗ thoát âm và cuối cần đàn. Đàn điện không có lỗ này — bạn gảy phía trên các pickup.",
    anchor: [196, 455],
    side: "right",
    labelY: 440,
  },
  {
    id: "strings",
    name: "Dây đàn",
    en: "Strings",
    description:
      "6 dây, đánh số từ dây 1 (mảnh nhất, nốt Mi cao) đến dây 6 (to nhất, nốt Mi trầm). Nhìn đàn dựng đứng từ phía trước như hình này: dây 6 ở bên {FRETSIDE}. Khi bạn ôm đàn và nhìn xuống: dây 6 ở TRÊN CÙNG, gần mặt bạn nhất.",
    anchor: [150, 530],
    side: "left",
    labelY: 500,
  },
  {
    id: "bridge",
    name: "Ngựa đàn",
    en: "Bridge",
    description:
      "Miếng gỗ dán trên mặt thùng đàn, giữ đầu dưới của dây. Không tì cổ tay quá mạnh lên ngựa đàn vì sẽ làm tắt tiếng dây.",
    anchor: [212, 622],
    side: "right",
    labelY: 640,
  },
  {
    id: "saddle",
    name: "Yên ngựa",
    en: "Saddle",
    description:
      "Thanh nhỏ màu trắng trên ngựa đàn, điểm kết thúc của phần dây rung. Khoảng cách từ lược đàn đến yên ngựa là chiều dài dây rung (scale length).",
    anchor: [160, 620],
    side: "left",
    labelY: 668,
  },
];

const STRING_ORDER_RIGHT = [6, 5, 4, 3, 2, 1] as const;

export function GuitarAnatomy({
  handedness = "right",
  initialPart,
  className,
}: {
  handedness?: Handedness;
  initialPart?: PartId;
  className?: string;
}) {
  const [selected, setSelected] = useState<PartId | null>(initialPart ?? null);
  const part = ANATOMY_PARTS.find((p) => p.id === selected);
  const OFFSET = 150; // guitar drawn in 0..320, centered in a 620-wide canvas
  const W = 620;
  const left = handedness === "left";
  const gx = (x: number) => (left ? W - (x + OFFSET) : x + OFFSET);

  const nutX = (i: number) => 133 + i * 10.8;
  const saddleX = (i: number) => 128 + i * 12.8;
  // posts: bass side (strings 6,5,4) on one side, treble (3,2,1) on the other; nearest-to-nut first.
  const postFor = (s: number): [number, number] => {
    const bass = s >= 4;
    const idx = bass ? 6 - s : s - 1; // 0 = nearest nut
    const y = 78 - idx * 24;
    return [bass ? 132 : 188, y];
  };

  return (
    <div className={cn("grid gap-4", className)}>
      <svg
        viewBox={`0 0 ${W} 720`}
        role="img"
        aria-label="Cấu tạo cây đàn guitar acoustic, nhìn thẳng từ phía trước, đàn dựng đứng"
        className="mx-auto h-auto w-full max-w-[560px]"
        data-handedness={handedness}
      >
        <g transform={left ? `translate(${W},0) scale(-1,1) translate(${OFFSET},0)` : `translate(${OFFSET},0)`}>
          {/* body */}
          <path
            d="M160,358 C230,358 268,390 268,445 C268,490 245,505 245,520 C245,535 295,555 295,600 C295,670 235,705 160,705 C85,705 25,670 25,600 C25,555 75,535 75,520 C75,505 52,490 52,445 C52,390 90,358 160,358 Z"
            fill="var(--gl-wood-body)"
            stroke="var(--gl-wood-body-edge)"
            strokeWidth={5}
            className={cn(selected === "body" && "gl-pulse")}
          />
          <circle cx={160} cy={455} r={47} fill="none" stroke="var(--gl-wood-body-edge)" strokeWidth={3} />
          <circle cx={160} cy={455} r={38} fill="oklch(0.22 0.03 50)" className={cn(selected === "soundhole" && "gl-pulse")} />
          {/* bridge + saddle */}
          <rect x={100} y={608} width={120} height={26} rx={8} fill="var(--gl-wood-neck)" />
          <rect x={122} y={617} width={76} height={5} rx={2} fill="var(--gl-nut)" />
          {/* headstock */}
          <path d="M126,100 L118,18 Q160,4 202,18 L194,100 Z" fill="var(--gl-wood-headstock)" />
          {[0, 1, 2].map((i) => (
            <g key={i}>
              <rect x={96} y={70 - i * 24} width={18} height={14} rx={4} fill="var(--gl-fret)" />
              <rect x={206} y={70 - i * 24} width={18} height={14} rx={4} fill="var(--gl-fret)" />
              <circle cx={132} cy={78 - i * 24} r={4} fill="var(--gl-fret)" />
              <circle cx={188} cy={78 - i * 24} r={4} fill="var(--gl-fret)" />
            </g>
          ))}
          {/* fretboard */}
          <path d={`M128,${NUT_Y} L192,${NUT_Y} L198,390 L122,390 Z`} fill="var(--gl-wood-neck)" />
          {VISIBLE_FRETS.map((n) => {
            const y = fretY(n);
            const t = (y - NUT_Y) / 290;
            return <line key={n} x1={128 - 6 * t} x2={192 + 6 * t} y1={y} y2={y} stroke="var(--gl-fret)" strokeWidth={2.2} />;
          })}
          {[3, 5, 7, 9].map((n) => (
            <circle key={n} cx={160} cy={fretCenter(n)} r={4} fill="var(--gl-inlay)" />
          ))}
          <circle cx={150} cy={fretCenter(12)} r={4} fill="var(--gl-inlay)" />
          <circle cx={170} cy={fretCenter(12)} r={4} fill="var(--gl-inlay)" />
          <rect x={126} y={NUT_Y - 4} width={68} height={6} rx={1.5} fill="var(--gl-nut)" />
          {/* strings: index 0 = string 6 on the left of a right-handed guitar */}
          {STRING_ORDER_RIGHT.map((s, i) => {
            const [px, py] = postFor(s);
            return (
              <g key={s}>
                <line x1={px} y1={py} x2={nutX(i)} y2={NUT_Y} stroke="var(--gl-string)" strokeWidth={0.6 + s * 0.22} />
                <line
                  x1={nutX(i)}
                  y1={NUT_Y}
                  x2={saddleX(i)}
                  y2={620}
                  stroke={s >= 4 ? "var(--gl-string)" : "var(--gl-string-plain)"}
                  strokeWidth={0.6 + s * 0.22}
                />
              </g>
            );
          })}
        </g>

        {/* string numbers under the saddle, not mirrored text */}
        {STRING_ORDER_RIGHT.map((s, i) => (
          <text key={s} x={gx(saddleX(i))} y={652} textAnchor="middle" className="fill-foreground text-[10px] font-bold">
            {s}
          </text>
        ))}

        {/* labels with leader lines */}
        {ANATOMY_PARTS.map((p) => {
          const [ax, ay] = p.anchor;
          const side = left ? (p.side === "left" ? "right" : "left") : p.side;
          const lx = side === "left" ? 140 : W - 140;
          const active = selected === p.id;
          return (
            <g
              key={p.id}
              role="button"
              tabIndex={0}
              aria-pressed={active}
              aria-label={`${p.name} (${p.en})`}
              className="cursor-pointer focus:outline-none"
              onClick={() => setSelected(active ? null : p.id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelected(active ? null : p.id);
                }
              }}
            >
              <line
                x1={lx}
                y1={p.labelY}
                x2={gx(ax)}
                y2={ay}
                stroke={active ? "var(--primary)" : "var(--muted-foreground)"}
                strokeWidth={active ? 2 : 1}
                strokeDasharray={active ? undefined : "3 3"}
              />
              <circle cx={gx(ax)} cy={ay} r={active ? 7 : 5} fill={active ? "var(--primary)" : "var(--card)"} stroke="var(--primary)" strokeWidth={2} />
              <rect
                x={side === "left" ? 4 : W - 140}
                y={p.labelY - 15}
                width={136}
                height={30}
                rx={8}
                fill={active ? "var(--primary)" : "var(--card)"}
                stroke="var(--border)"
              />
              <text
                x={side === "left" ? 72 : W - 72}
                y={p.labelY + 5}
                textAnchor="middle"
                className="text-[13px] font-semibold"
                fill={active ? "var(--primary-foreground)" : "var(--foreground)"}
              >
                {p.name}
              </text>
            </g>
          );
        })}
      </svg>

      <div aria-live="polite" className="min-h-24 border-l-2 border-foreground/40 pl-4 text-sm">
        {part ? (
          <>
            <p className="font-semibold">
              {part.name} <span className="font-normal text-muted-foreground">({part.en})</span>
            </p>
            <p className="mt-1 leading-relaxed">{resolveHandedness(part.description, handedness)}</p>
          </>
        ) : (
          <p className="text-muted-foreground">
            Chạm vào một nhãn để xem giải thích. Cầm cây đàn thật của bạn dựng đứng, mặt đàn hướng về phía bạn — đàn của bạn
            lúc này trông giống hệt hình vẽ.
          </p>
        )}
      </div>
    </div>
  );
}
