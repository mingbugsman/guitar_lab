import type { Metadata } from "next";
import { LoginForm } from "@/features/authentication/auth-forms";
import { SupabaseMissing } from "@/components/layout/supabase-missing";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = { title: "Đăng nhập" };

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string; error?: string }> }) {
  const { next, error } = await searchParams;
  if (!isSupabaseConfigured()) return <SupabaseMissing />;
  return (
    <div className="space-y-6">
      <div className="space-y-1 text-center">
        <h1 className="text-2xl font-bold">Chào mừng trở lại</h1>
        <p className="text-sm text-muted-foreground">Tiếp tục hành trình học guitar của bạn.</p>
      </div>
      <LoginForm next={next} initialError={error === "confirm" ? "Liên kết xác nhận không hợp lệ hoặc đã hết hạn." : undefined} />
    </div>
  );
}
