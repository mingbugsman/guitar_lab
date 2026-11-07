import Link from "next/link";
import { BookOpen, Gauge, Guitar, Timer } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { AboutLinkDisabled, SiteFooter } from "@/components/layout/site-footer";
import { ChordDiagram } from "@/components/guitar/chord-diagram";
import { Fretboard } from "@/components/guitar/fretboard";
import { chordMarkersStatic } from "@/components/guitar/chord-markers";
import { CHORDS } from "@/lib/music/chords";
import { getUser } from "@/lib/auth";

const FEATURES = [
  {
    icon: Guitar,
    title: "Có hình cây đàn để so",
    text: "Bài nào cũng có hình cần đàn vẽ đúng như lúc bạn ôm đàn cúi nhìn xuống. Thuận tay trái thì bấm một nút là hình lật lại.",
  },
  {
    icon: BookOpen,
    title: "Học từ con số 0",
    text: "12 bài nhập môn: cầm đàn, lên dây, tên dây, nốt nhạc, giữ nhịp. Xong thì sang 5 hợp âm đầu tiên: Em, Am, E, A, D.",
  },
  {
    icon: Timer,
    title: "Mỗi ngày tập 30 phút",
    text: "Mỗi buổi tập được chia sẵn thành từng phần nhỏ, có đồng hồ bấm giờ. Tập xong thì lưu lại để hôm sau biết mình đã đi tới đâu.",
  },
  {
    icon: Gauge,
    title: "Tuner với metronome",
    text: "Lên dây bằng micro điện thoại hoặc laptop, không cần mua tuner. Có metronome để tập giữ nhịp.",
  },
];

export default async function LandingPage() {
  const user = await getUser();
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-2 text-sm">
          <AboutLinkDisabled className="mr-2 hidden sm:inline" />
          {user ? (
            <Link href="/dashboard" className={buttonVariants()}>
              Vào học
            </Link>
          ) : (
            <>
              <Link href="/login" className={buttonVariants({ variant: "ghost" })}>
                Đăng nhập
              </Link>
              <Link href="/register" className={buttonVariants()}>
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      </header>

      <main className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <section className="grid items-center gap-10 py-10 lg:grid-cols-[1.1fr_1fr] lg:py-16">
          <div className="space-y-5">
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">Learn. Understand. Practice. Create.</p>
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Học guitar từ con số 0, có cây đàn vẽ sẵn để so với đàn thật
            </h1>
            <div className="max-w-xl space-y-3 text-lg text-muted-foreground">
              <p>
                Mới tập đàn thì rất dễ rối. Sơ đồ hợp âm vẽ một kiểu, lúc cúi xuống nhìn cần đàn lại thấy một kiểu khác, nên
                chẳng biết dây nào là dây nào.
              </p>
              <p>
                Mình làm Guitar Lab để gỡ đúng chỗ đó. Bài nào cũng có hình đàn vẽ theo đúng hướng bạn đang nhìn, có âm thanh
                mẫu để nghe, và web lưu lại bạn học tới đâu. Không có video, cứ để đàn cạnh màn hình rồi tập theo.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={user ? "/dashboard" : "/register"} className={buttonVariants({ className: "h-12 px-6 text-base" })}>
                {user ? "Học tiếp" : "Vào học thử"}
              </Link>
              <Link href="/guitar" className={buttonVariants({ variant: "outline", className: "h-12 px-6 text-base" })}>
                Xem hình cây đàn
              </Link>
            </div>
          </div>
          <div className="space-y-3 rounded-3xl border bg-card p-4 shadow-sm">
            <div className="grid grid-cols-[110px_1fr] items-center gap-3">
              <ChordDiagram chord={CHORDS.am} className="max-w-[110px]" showStringLabels={false} />
              <div className="overflow-hidden">
                <Fretboard frets={4} markers={chordMarkersStatic(CHORDS.am)} />
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Cùng là hợp âm Am. Bên trái là sơ đồ (đàn dựng đứng), bên phải là lúc bạn ôm đàn nhìn xuống: dây 6 nằm trên
              cùng, gần mặt bạn nhất.
            </p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2" aria-label="Có gì trong Guitar Lab">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border bg-card p-5">
              <Icon className="size-6 text-primary" aria-hidden />
              <h2 className="mt-3 font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 rounded-3xl bg-secondary p-6 sm:p-10">
          <h2 className="text-2xl font-bold">Vẫn đang làm tiếp</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Hiện tại mới có phần nhập môn và 5 hợp âm đầu tiên. Mình đang làm tiếp các hợp âm còn lại, phần tập gảy theo nhịp,
            luyện tai và vài bài hát để tập. Phần nào làm xong và chạy ổn thì mình mới đưa lên.
          </p>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
