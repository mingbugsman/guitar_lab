import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="gl-num text-6xl font-semibold text-muted-foreground">404</p>
      <h1 className="text-xl font-semibold">Không tìm thấy trang</h1>
      <p className="text-muted-foreground">Trang này không tồn tại hoặc bạn không có quyền xem.</p>
      <Link href="/" className={buttonVariants()}>Về trang chủ</Link>
    </div>
  );
}
