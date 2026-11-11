export function SupabaseMissing() {
  return (
    <div role="alert" className="space-y-2 border-l-2 border-destructive pl-4 text-sm">
      <p className="font-semibold">Chưa cấu hình cơ sở dữ liệu</p>
      <p className="text-muted-foreground">
        Máy chủ chưa có <code>NEXT_PUBLIC_SUPABASE_URL</code> và <code>NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY</code>. Xem README để
        thiết lập Supabase.
      </p>
    </div>
  );
}
