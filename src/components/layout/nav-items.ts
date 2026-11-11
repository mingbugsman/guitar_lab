import { BookOpen, Gauge, Guitar, LineChart, Sun, Timer, User } from "lucide-react";

/** Only features that actually work in this release appear in navigation. Labels: docx/DESIGN.md §5. */
export const NAV_ITEMS = [
  { href: "/dashboard", label: "Hôm nay", icon: Sun },
  { href: "/academy", label: "Bài học", icon: BookOpen },
  { href: "/practice", label: "Luyện tập", icon: Timer },
  { href: "/guitar", label: "Cây đàn", icon: Guitar },
  { href: "/tools", label: "Công cụ", icon: Gauge },
  { href: "/progress", label: "Tiến độ", icon: LineChart },
  { href: "/profile", label: "Hồ sơ", icon: User },
] as const;

/** Items shown in the mobile bottom bar (max 5 for touch targets). */
export const MOBILE_NAV = NAV_ITEMS.filter((i) =>
  ["/dashboard", "/academy", "/practice", "/guitar", "/tools"].includes(i.href),
);

/**
 * "Hands on the guitar" screens: a lesson or a running practice session. The bottom bar is
 * hidden there so the big step button owns the bottom of the screen.
 */
export function isFocusRoute(pathname: string): boolean {
  if (pathname === "/practice/drills") return false;
  return (
    /^\/academy\/[^/]+$/.test(pathname) ||
    /^\/practice\/[^/]+$/.test(pathname) ||
    /^\/practice\/drills\/[^/]+$/.test(pathname)
  );
}
