import Link from "next/link";
import { cn } from "@/lib/utils";

/** "Giới thiệu" link that is visible but disabled until the About page is written. */
export function AboutLinkDisabled({ className }: { className?: string }) {
  return (
    <span
      role="link"
      aria-disabled="true"
      title="Sắp có"
      className={cn("cursor-not-allowed text-muted-foreground/60 select-none", className)}
      data-testid="about-link"
    >
      Giới thiệu <span className="text-[10px]">(sắp có)</span>
    </span>
  );
}

export function SiteFooter({ className }: { className?: string }) {
  return (
    <footer className={cn("border-t py-6 text-center text-xs text-muted-foreground", className)} data-testid="site-footer">
      <p>
        Guitar Lab · Made by <span className="font-medium text-foreground">Tran Tuan Minh</span>
      </p>
      <p className="mt-1">Bắt đầu phát triển từ 6/8/2026</p>
      <p className="mt-2 flex justify-center gap-4">
        <Link href="/updates" className="underline-offset-4 hover:text-foreground hover:underline" data-testid="updates-link">
          Có gì mới
        </Link>
        <AboutLinkDisabled />
      </p>
    </footer>
  );
}
