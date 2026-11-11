import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Metronome } from "@/components/audio/metronome";
import { Tuner } from "@/components/audio/tuner";
import { ChordChangeTimer } from "@/components/audio/chord-change-timer";

export const metadata: Metadata = { title: "Công cụ" };

export default function ToolsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Công cụ"
        title="Lên dây, đếm nhịp, đổi hợp âm"
        description="Máy lên dây (Tuner) nghe tiếng đàn qua micro của bạn. Âm thanh được xử lý ngay trên trình duyệt, không gửi đi đâu. Máy đếm nhịp (Metronome) phát tiếng tích tắc đều để bạn gảy theo. Đổi hợp âm 1 phút đếm số lần bạn đổi hợp âm, để thấy mình nhanh lên qua từng ngày."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Tuner />
        <Metronome />
        <div className="lg:col-span-2">
          <ChordChangeTimer chords={["em", "am"]} allowPick />
        </div>
      </div>
    </>
  );
}
