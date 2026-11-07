/** App-wide timezone used for "today" and date display (target audience: Vietnam). */
export const APP_TIMEZONE = "Asia/Ho_Chi_Minh";

const dayKeyFmt = new Intl.DateTimeFormat("en-CA", { timeZone: APP_TIMEZONE, year: "numeric", month: "2-digit", day: "2-digit" });

/** YYYY-MM-DD in the app timezone. */
export function dayKey(date: Date | string): string {
  return dayKeyFmt.format(typeof date === "string" ? new Date(date) : date);
}

export function isToday(date: Date | string, now = new Date()): boolean {
  return dayKey(date) === dayKey(now);
}

export function formatDuration(totalSeconds: number): string {
  const s = Math.max(0, Math.round(totalSeconds));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  if (h > 0) return `${h} giờ ${m} phút`;
  if (m > 0) return `${m} phút`;
  return `${s} giây`;
}

export function formatClock(totalSeconds: number): string {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("vi-VN", { timeZone: APP_TIMEZONE, dateStyle: "medium", timeStyle: "short" }).format(new Date(date));
}
