import Link from "next/link";
import { LogOut } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { BottomNav, BottomNavSpacer, SidebarNav } from "@/components/layout/app-nav";
import { Logo } from "@/components/layout/logo";
import { ScrollToTop } from "@/components/layout/scroll-to-top";
import { SiteFooter } from "@/components/layout/site-footer";
import { GuitarViewProvider } from "@/components/guitar/view-context";
import { getProfile, getUser } from "@/lib/auth";
import { signOut } from "@/features/authentication/actions";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  const profile = user ? await getProfile() : null;

  return (
    <GuitarViewProvider handedness={profile?.handedness ?? "right"}>
      <ScrollToTop />
      <div className="min-h-dvh md:grid md:grid-cols-[208px_1fr]">
        <aside className="sticky top-0 hidden h-dvh flex-col gap-8 border-r px-5 py-6 md:flex">
          <Logo href={user ? "/dashboard" : "/"} />
          <SidebarNav />
          <div className="mt-auto space-y-2 text-sm">
            {user ? (
              <>
                <p className="truncate text-muted-foreground" title={user.email ?? ""}>
                  {profile?.display_name ?? user.email}
                </p>
                <form action={signOut}>
                  <Button type="submit" variant="ghost" className="-ml-2.5 justify-start text-muted-foreground">
                    <LogOut /> Đăng xuất
                  </Button>
                </form>
              </>
            ) : (
              <Link href="/login" className={buttonVariants({ variant: "outline", className: "w-full" })}>
                Đăng nhập
              </Link>
            )}
          </div>
        </aside>

        <div className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b bg-background px-4 md:hidden">
            <Logo href={user ? "/dashboard" : "/"} />
            {user ? (
              <Link href="/profile" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                {profile?.display_name ?? "Hồ sơ"}
              </Link>
            ) : (
              <Link href="/login" className={buttonVariants({ variant: "outline", size: "sm" })}>
                Đăng nhập
              </Link>
            )}
          </header>
          <main className="mx-auto w-full max-w-4xl flex-1 px-4 pt-6 pb-10 sm:px-8 md:pt-10">{children}</main>
          <SiteFooter />
          <BottomNavSpacer />
        </div>
      </div>
      <BottomNav />
    </GuitarViewProvider>
  );
}
