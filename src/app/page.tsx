import Link from "next/link";
import { BookOpen, Gauge, Guitar, Timer } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Logo } from "@/components/layout/logo";
import { ChordDiagram } from "@/components/guitar/chord-diagram";
import { Fretboard } from "@/components/guitar/fretboard";
import { chordMarkersStatic } from "@/components/guitar/chord-markers";
import { CHORDS } from "@/lib/music/chords";
import { getUser } from "@/lib/auth";

const FEATURES = [
  {
    icon: Guitar,
    title: "Hình đàn để đối chiếu",
    text: "Mọi bài có hình cần đàn ở góc nhìn của chính bạn khi ôm đàn — có cả chế độ tay trái. Lời hướng dẫn luôn khớp hướng với hình.",
  },
  {
    icon: BookOpen,
    title: "Level 0 + 5 hợp âm đầu tiên",
    text: "12 bài làm quen cây đàn, lên dây, tư thế, nốt nhạc, nhịp — rồi Em, Am, E, A, D với sơ đồ chính xác và âm thanh mẫu.",
  },
  {
    icon: Timer,
    title: "Buổi tập 30 phút có mục tiêu",
    text: "Ôn lại, nhạc lý, kỹ thuật, ứng dụng, chơi tự do, tự nhìn lại. Mọi buổi tập được lưu để bạn thấy mình tiến bộ.",
  },
  {
    icon: Gauge,
    title: "Tuner & Metronome thật",
    text: "Tuner nghe tiếng đàn qua micro và báo lệch bao nhiêu cent. Metronome phát nhịp ổn định ngay trên trình duyệt.",
  },
];

export default async function LandingPage() {
  const user = await getUser();
  return (
    <div className="min-h-dvh">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        <Logo />
        <nav className="flex items-center gap-2">
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

      <main className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <section className="grid items-center gap-10 py-10 lg:grid-cols-[1.1fr_1fr] lg:py-16">
          <div className="space-y-5">
            <p className="text-sm font-semibold tracking-wide text-primary uppercase">Learn. Understand. Practice. Create.</p>
            <h1 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl">
              Học guitar từ con số 0 — với cây đàn của bạn ngay cạnh màn hình.
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Không video. Giải thích ngắn, hình đàn đúng hướng bạn đang nhìn, âm thanh mẫu và bài tập trên đàn thật. Lưu tiến độ
              để mai học tiếp.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link href={user ? "/dashboard" : "/register"} className={buttonVariants({ className: "h-12 px-6 text-base" })}>
                {user ? "Tiếp tục học" : "Bắt đầu miễn phí"}
              </Link>
              <Link href="/guitar" className={buttonVariants({ variant: "outline", className: "h-12 px-6 text-base" })}>
                Xem Guitar Visual
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
              Cùng một hợp âm Am: sơ đồ (đàn dựng đứng) và cần đàn (bạn ôm đàn nhìn xuống — dây 6 ở trên, gần mặt bạn).
            </p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2" aria-label="Tính năng">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="rounded-2xl border bg-card p-5">
              <Icon className="size-6 text-primary" aria-hidden />
              <h2 className="mt-3 font-semibold">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{text}</p>
            </div>
          ))}
        </section>

        <section className="mt-12 rounded-3xl bg-secondary p-6 sm:p-10">
          <h2 className="text-2xl font-bold">From Zero to Hero</h2>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Bản 0.1 gồm Level 0 và nhóm hợp âm đầu tiên. Lộ trình tiếp theo: Level 1 đầy đủ, nhịp điệu & strumming, luyện tai,
            thư viện bài hát — mỗi phần chỉ ra mắt khi đã thực sự dùng được.
          </p>
        </section>
      </main>
      <footer className="border-t py-6 text-center text-xs text-muted-foreground">Guitar Lab · Learn. Understand. Practice. Create.</footer>
    </div>
  );
}
