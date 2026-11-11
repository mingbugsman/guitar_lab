import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ChordChallenge } from "@/components/practice/chord-challenge";
import { requireOnboardedProfile } from "@/lib/auth";

export const metadata: Metadata = { title: "Thử thách hợp âm" };

export default async function ChallengePage() {
  await requireOnboardedProfile("/practice/challenge");
  return (
    <div className="max-w-3xl">
      <Link href="/practice" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" /> Luyện tập
      </Link>
      <h1 className="gl-title mt-2 text-2xl sm:text-3xl">Thử thách hợp âm</h1>
      <p className="mt-1 max-w-2xl text-muted-foreground">
        Hợp âm hiện ngẫu nhiên và trôi từ phải sang trái. Thẻ chạm vạch cam thì gảy xuống một cái, rồi đổi sang hợp âm kế tiếp. Tốc độ nhanh
        dần theo từng chặng. Không kịp hay sai thì bạn tự nhận ra, cuối lượt tự đánh giá.
      </p>
      <div className="mt-8">
        <ChordChallenge signedIn />
      </div>
    </div>
  );
}
