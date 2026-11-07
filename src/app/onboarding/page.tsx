import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Logo } from "@/components/layout/logo";
import { getProfile, requireUser } from "@/lib/auth";
import { OnboardingForm } from "@/features/profile/profile-form";

export const metadata: Metadata = { title: "Thiết lập ban đầu" };

export default async function OnboardingPage() {
  await requireUser("/onboarding");
  const profile = await getProfile();
  if (profile?.onboarded_at) redirect("/dashboard");

  return (
    <div className="mx-auto flex min-h-dvh max-w-xl flex-col gap-8 px-4 py-10">
      <Logo />
      <div className="space-y-1">
        <h1 className="text-2xl font-bold">{profile?.display_name ? `Chào ${profile.display_name}!` : "Chào bạn!"}</h1>
        <p className="text-muted-foreground">Năm câu hỏi ngắn để Guitar Lab hướng dẫn đúng với bạn và cây đàn của bạn.</p>
      </div>
      <OnboardingForm />
    </div>
  );
}
