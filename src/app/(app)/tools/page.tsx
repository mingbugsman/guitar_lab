import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Metronome } from "@/components/audio/metronome";
import { Tuner } from "@/components/audio/tuner";

export const metadata: Metadata = { title: "Tuner & Metronome" };

export default function ToolsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Essential tools"
        title="Tuner & Metronome"
        description="Tuner nghe tiếng đàn qua micro của bạn (âm thanh được xử lý ngay trên trình duyệt, không gửi đi đâu). Metronome phát tiếng click thật với nhịp ổn định."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Tuner />
        <Metronome />
      </div>
    </>
  );
}
