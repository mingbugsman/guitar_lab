"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { safeNextPath } from "@/lib/safe-redirect";
import { signInSchema, signUpSchema, type ActionResult, type SignInInput, type SignUpInput } from "@/lib/validation/schemas";

function friendlyAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Email hoặc mật khẩu không đúng.";
  if (m.includes("already registered") || m.includes("already been registered")) return "Email này đã được đăng ký. Hãy đăng nhập.";
  if (m.includes("email not confirmed")) return "Bạn chưa xác nhận email. Hãy mở email xác nhận rồi thử lại.";
  if (m.includes("rate limit")) return "Bạn thử quá nhiều lần. Đợi một chút rồi thử lại.";
  if (m.includes("password")) return "Mật khẩu chưa đạt yêu cầu bảo mật.";
  return "Không thực hiện được. Vui lòng thử lại.";
}

async function siteUrl(): Promise<string> {
  if (process.env.NEXT_PUBLIC_APP_URL) return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? "http";
  return `${proto}://${host}`;
}

export async function signUp(input: SignUpInput): Promise<ActionResult<{ needsConfirmation: boolean }>> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { display_name: parsed.data.displayName },
      emailRedirectTo: `${await siteUrl()}/auth/confirm?next=/onboarding`,
    },
  });
  if (error) return { ok: false, error: friendlyAuthError(error.message) };
  // Supabase returns a user with no identities when the email already exists (anti-enumeration).
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return { ok: false, error: "Email này đã được đăng ký. Hãy đăng nhập." };
  }
  if (!data.session) return { ok: true, data: { needsConfirmation: true } };
  redirect("/onboarding");
}

export async function signIn(input: SignInInput, next?: string): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Dữ liệu không hợp lệ" };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error) return { ok: false, error: friendlyAuthError(error.message) };
  redirect(safeNextPath(next));
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
