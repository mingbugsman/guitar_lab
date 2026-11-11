import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { AboutLinkDisabled, SiteFooter } from "@/components/layout/site-footer";
import { ChordDiagram, describeChord } from "@/components/guitar/chord-diagram";
import { LandingStage } from "@/components/guitar/landing-stage";
import { RoutineBar } from "@/components/learning/routine-bar";
import { DAILY_30 } from "@/features/practice/routine";
import { CHORDS } from "@/lib/music/chords";
import { getUser } from "@/lib/auth";

export default async function LandingPage() {
  const user = await getUser();
  const am = CHORDS.am;

  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-2 px-4 py-4 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-2 text-sm">
          <AboutLinkDisabled className="mr-2 hidden sm:inline" />
          {user ? (
            <Link href="/dashboard" className={buttonVariants({ variant: "outline" })}>
              Vào học
            </Link>
          ) : (
            <>
              <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
                Đăng nhập
              </Link>
              <Link href="/register" className={buttonVariants({ variant: "outline" })}>
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 pb-16 sm:px-8">
        {/* promise on the left edge, not a centered hero */}
        <section className="grid gap-x-12 gap-y-6 pt-8 pb-10 md:grid-cols-[1.25fr_1fr] md:pt-14">
          <h1 className="gl-title text-4xl text-balance sm:text-5xl">
            Học guitar từ con số 0, có cây đàn vẽ sẵn để so với đàn thật
          </h1>
          <div className="space-y-4 md:pt-2">
            <p className="text-muted-foreground">
              Mới tập đàn thì rất dễ rối. Sơ đồ hợp âm vẽ một kiểu, lúc cúi xuống nhìn cần đàn lại thấy một kiểu khác, nên chẳng
              biết dây nào là dây nào.
            </p>
            <p className="text-muted-foreground">
              Mình làm Guitar Lab để gỡ đúng chỗ đó. Không có video, cứ để đàn cạnh màn hình rồi tập theo.
            </p>
            <Link href={user ? "/dashboard" : "/register"} className={buttonVariants({ className: "h-12 px-6 text-base" })}>
              {user ? "Học tiếp" : "Vào học thử"} <ArrowRight />
            </Link>
          </div>
        </section>

        {/* the one big object */}
        <section aria-label="Thử cần đàn">
          <p className="gl-label mb-2">Thử luôn: đây là hình cần đàn dùng trong mọi bài. Chạm vào ô nào cũng nghe đúng nốt ở đó.</p>
          <LandingStage />
        </section>

        {/* a real lesson, told in three steps — not feature cards */}
        <section className="mt-16" aria-labelledby="how">
          <h2 id="how" className="border-b border-foreground pb-2 text-lg font-semibold">
            Một bài học diễn ra thế nào
          </h2>
          <ol>
            <li className="grid gap-x-8 gap-y-4 border-b py-8 sm:grid-cols-[3rem_1fr_220px]">
              <span className="gl-num text-3xl text-muted-foreground">01</span>
              <div>
                <h3 className="text-xl font-semibold">Nhìn hình đúng hướng mình đang nhìn</h3>
                <p className="mt-2 text-muted-foreground">
                  Sơ đồ hợp âm vẽ cây đàn dựng đứng. Ngay cạnh nó là cần đàn vẽ như lúc bạn ôm đàn cúi nhìn xuống: dây 6 to nhất
                  nằm trên cùng, gần mặt bạn. Thuận tay trái thì bấm một nút, cả hình lẫn chữ đổi theo.
                </p>
              </div>
              <ChordDiagram chord={am} className="max-w-[150px] justify-self-start sm:justify-self-end" />
            </li>
            <li className="grid gap-x-8 gap-y-4 border-b py-8 sm:grid-cols-[3rem_1fr_220px]">
              <span className="gl-num text-3xl text-muted-foreground">02</span>
              <div>
                <h3 className="text-xl font-semibold">Bấm theo từng dây, nghe thử tiếng mẫu</h3>
                <p className="mt-2 text-muted-foreground">
                  Mỗi hợp âm có lời chỉ cho từng dây một, ghi rõ ngón nào, phím nào, dây nào bỏ. Bên phải là lời hướng dẫn thật của
                  hợp âm Am.
                </p>
              </div>
              <ul className="space-y-1 text-sm">
                {describeChord(am).map((s) => (
                  <li key={s.string} className={s.kind === "fretted" ? "font-medium" : "text-muted-foreground"}>
                    {s.text}
                  </li>
                ))}
              </ul>
            </li>
            <li className="grid gap-x-8 gap-y-4 border-b py-8 sm:grid-cols-[3rem_1fr_220px]">
              <span className="gl-num text-3xl text-muted-foreground">03</span>
              <div>
                <h3 className="text-xl font-semibold">Tập 30 phút mỗi ngày, có đồng hồ</h3>
                <p className="mt-2 text-muted-foreground">
                  Buổi tập chia sẵn thành sáu phần. Lên dây bằng micro điện thoại, giữ nhịp bằng metronome có sẵn. Tập xong thì
                  lưu lại để hôm sau biết mình đã đi tới đâu.
                </p>
              </div>
              <RoutineBar minutesOnly className="self-center" segments={DAILY_30.map((a) => ({ key: a.kind, title: a.title, minutes: a.minutes }))} />
            </li>
          </ol>
        </section>

        <section className="mt-12 grid gap-x-12 gap-y-3 md:grid-cols-[1fr_1.6fr]" aria-labelledby="status">
          <h2 id="status" className="text-lg font-semibold">
            Vẫn đang làm tiếp
          </h2>
          <p className="text-muted-foreground">
            Hiện tại có 13 bài nhập môn (bài 10 đã là hợp âm đầu tiên, Em) và thêm 4 hợp âm: Am, E, A, D. Mình đang làm tiếp các hợp âm còn lại, phần tập
            gảy theo nhịp, luyện tai và vài bài hát để tập. Phần nào làm xong và chạy ổn thì mình mới đưa lên.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
