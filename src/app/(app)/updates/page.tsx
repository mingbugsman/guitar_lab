import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { UPDATES } from "@/content/changelog";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Có gì mới" };

export default function UpdatesPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader title="Có gì mới" description="Những thay đổi của Guitar Lab, mới nhất ở trên." />
      <ol className="divide-y border-y" data-testid="updates-list">
        {UPDATES.map((u) => (
          <li key={u.id} className="py-5">
            <p className="gl-label">{formatDate(u.publishedAt)}</p>
            <h2 className="mt-1 text-lg font-semibold">{u.title}</h2>
            <ul className="mt-2 space-y-1.5">
              {u.items.map((it) => (
                <li key={it} className="flex gap-2 leading-relaxed">
                  <span aria-hidden className="mt-3 h-px w-3 shrink-0 bg-foreground/50" />
                  <span>{it}</span>
                </li>
              ))}
            </ul>
            {u.href && (
              <Link href={u.href} className="mt-2 inline-flex items-center gap-1 text-sm underline underline-offset-4">
                Thử ngay <ArrowRight className="size-3.5" />
              </Link>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
