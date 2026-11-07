import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { SiteFooter } from "@/components/layout/site-footer";

export const metadata: Metadata = { title: "Giới thiệu" };

/** Placeholder — the navigation link stays disabled until this page is written. */
export default function AboutPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <header className="mx-auto w-full max-w-6xl px-4 py-4 sm:px-6">
        <Logo />
      </header>
      <main className="mx-auto flex w-full max-w-xl flex-1 flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-2xl font-bold">Giới thiệu</h1>
        <p className="text-muted-foreground">Trang này mình đang viết, quay lại sau nhé.</p>
        <Link href="/" className={buttonVariants({ variant: "outline" })}>
          Về trang chủ
        </Link>
      </main>
      <SiteFooter />
    </div>
  );
}
