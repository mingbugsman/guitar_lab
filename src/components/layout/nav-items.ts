import { BookOpen, Gauge, Guitar, LayoutDashboard, LineChart, Timer, User } from "lucide-react";

/** Only features that actually work in this release appear in navigation. */
export const NAV_ITEMS = [
  { href: "/dashboard", label: "Tổng quan", short: "Tổng quan", icon: LayoutDashboard },
  { href: "/academy", label: "Academy", short: "Học", icon: BookOpen },
  { href: "/practice", label: "Practice Studio", short: "Luyện tập", icon: Timer },
  { href: "/guitar", label: "Guitar Visual", short: "Cây đàn", icon: Guitar },
  { href: "/tools", label: "Tuner & Metronome", short: "Công cụ", icon: Gauge },
  { href: "/progress", label: "Tiến độ", short: "Tiến độ", icon: LineChart },
  { href: "/profile", label: "Hồ sơ", short: "Hồ sơ", icon: User },
] as const;

/** Items shown in the mobile bottom bar (max 5 for touch targets). */
export const MOBILE_NAV = NAV_ITEMS.filter((i) =>
  ["/dashboard", "/academy", "/practice", "/guitar", "/tools"].includes(i.href),
);
