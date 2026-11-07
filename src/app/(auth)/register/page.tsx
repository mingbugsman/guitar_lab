import type { Metadata } from "next";
import { RegisterForm } from "@/features/authentication/auth-forms";
import { SupabaseMissing } from "@/components/layout/supabase-missing";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Đăng ký" };

export default function RegisterPage() {
  if (!isSupabaseConfigured()) return <SupabaseMissing />;
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Bắt đầu học guitar</h1>
        <p className="text-sm text-muted-foreground">Miễn phí. Tiến độ của bạn được lưu lại để học tiếp mỗi ngày.</p>
      </div>
      <RegisterForm />
    </div>
  );
}
