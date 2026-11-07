const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function isSupabaseConfigured(): boolean {
  return Boolean(url && key);
}

export function getSupabaseEnv(): { url: string; key: string } {
  if (!url || !key) {
    throw new Error(
      "Supabase chưa được cấu hình: đặt NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY trong .env.local",
    );
  }
  return { url, key };
}
