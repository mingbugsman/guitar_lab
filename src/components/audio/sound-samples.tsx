"use client";

import { useState } from "react";
import { Volume2 } from "lucide-react";
import { playSample, SAMPLE_KINDS, neighbourString, type SampleKind } from "@/lib/audio/sound-samples";
import type { StringNumber } from "@/lib/music/guitar";
import { cn } from "@/lib/utils";

const SAMPLES: Record<SampleKind, { title: string; listen: (s: StringNumber) => string; cause: string }> = {
  clean: {
    title: "Sạch",
    listen: () => "Nốt ngân đều rồi nhỏ dần, nghe rõ ít nhất 2 giây.",
    cause: "Đầu ngón sát thanh kim loại, ấn vừa đủ.",
  },
  buzz: {
    title: "Rè",
    listen: () => "Nốt vẫn ngân nhưng có tiếng rè rè như giấy rung lẫn vào, nhất là ngay sau khi gảy.",
    cause: "Ngón xa thanh kim loại hoặc ấn quá nhẹ.",
  },
  muted: {
    title: "Tắt",
    listen: () => "Chỉ nghe tiếng 'bụp' rồi im ngay, gần như không ngân.",
    cause: "Ngón đè lên thanh kim loại, hoặc phần thịt ngón chạm vào dây.",
  },
  extra: {
    title: "Chạm dây bên cạnh",
    listen: (s) => `Nghe thành hai nốt: dây ${s} và thêm dây ${neighbourString(s)} vang theo.`,
    cause: "Tay gảy vung quá rộng.",
  },
};

/**
 * What clean, buzzing and muted notes sound like, so the learner can tell which one their own
 * note is. One button per sound, each with what to listen for and the usual cause.
 */
export function SoundSamples({ string = 2, fret = 1 }: { string?: StringNumber; fret?: number }) {
  const [last, setLast] = useState<SampleKind | null>(null);
  return (
    <div data-testid="sound-samples">
      <ul className="grid gap-2 sm:grid-cols-2">
        {SAMPLE_KINDS.map((k) => {
          const s = SAMPLES[k];
          return (
            <li key={k}>
              <button
                type="button"
                onClick={() => {
                  setLast(k);
                  void playSample(k, string, fret);
                }}
                className={cn(
                  "flex h-full w-full gap-3 rounded-lg border p-3 text-left hover:bg-muted",
                  last === k && "border-foreground",
                )}
                data-testid={`sample-${k}`}
                data-played={last === k || undefined}
              >
                <Volume2 className="mt-0.5 size-5 shrink-0" />
                <span>
                  <span className="block font-semibold">{s.title}</span>
                  <span className="block text-sm">{s.listen(string)}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">Thường do: {s.cause}</span>
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 text-xs text-muted-foreground">
        Đây là âm máy tạo ra, màu tiếng khác đàn thật. Khi so, nghe nốt có ngân lâu không và có tiếng rè không, đừng so màu tiếng.
      </p>
    </div>
  );
}
