import type { Metadata } from "next";
import { PageHeader } from "@/components/layout/page-header";
import { GuitarVisualLab } from "@/components/guitar/visual-lab";

export const metadata: Metadata = { title: "Guitar Visual" };

export default function GuitarPage() {
  return (
    <>
      <PageHeader
        eyebrow="Visual Learning"
        title="Guitar Visual"
        description="Đặt cây đàn thật cạnh màn hình và đối chiếu. Mọi hướng dẫn trong Guitar Lab đều dùng đúng các quy ước hiển thị ở đây."
      />
      <GuitarVisualLab />
    </>
  );
}
