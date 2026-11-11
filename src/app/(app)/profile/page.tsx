import type { Metadata } from "next";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { getUser, requireOnboardedProfile } from "@/lib/auth";
import { signOut } from "@/features/authentication/actions";
import { ProfileForm } from "@/features/profile/profile-form";

export const metadata: Metadata = { title: "Hồ sơ" };

export default async function ProfilePage() {
  const profile = await requireOnboardedProfile("/profile");
  const user = await getUser();

  return (
    <>
      <PageHeader title="Hồ sơ" description={user?.email ?? undefined}>
        <form action={signOut}>
          <Button type="submit" variant="outline" data-testid="logout">
            <LogOut /> Đăng xuất
          </Button>
        </form>
      </PageHeader>
      <div className="max-w-2xl border-t pt-6">
        <ProfileForm
          defaults={{
            displayName: profile.display_name ?? "",
            experience: profile.experience,
            guitarType: profile.guitar_type ?? "acoustic",
            handedness: profile.handedness,
            practiceGoalMinutes: profile.practice_goal_minutes,
            learningTarget: profile.learning_target === "accompany_songs" ? "accompany_songs" : "learn_from_zero",
          }}
        />
      </div>
    </>
  );
}
