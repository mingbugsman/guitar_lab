import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { Metronome } from "@/components/audio/metronome";
import { Tuner } from "@/components/audio/tuner";

export const metadata: Metadata = { title: "Máy lên dây & máy đếm nhịp" };

export default function ToolsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Essential tools"
        title="Máy lên dây & máy đếm nhịp"
        description="Máy lên dây (Tuner) nghe tiếng đàn qua micro của bạn. Âm thanh được xử lý ngay trên trình duyệt, không gửi đi đâu. Máy đếm nhịp (Metronome) phát tiếng tích tắc đều để bạn gảy theo."
      />
      <div className="grid gap-6 lg:grid-cols-2">
        <Tuner />
        <Metronome />
      </div>
    </>
  );
}
