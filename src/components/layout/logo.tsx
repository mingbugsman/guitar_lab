import Link from "next/link";

export function Logo({ href = "/" }: { href?: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-2 font-semibold tracking-tight">
      <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
        <rect x="2" y="2" width="28" height="28" rx="8" fill="var(--primary)" />
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={i} x1="8" x2="24" y1={9 + i * 2.8} y2={9 + i * 2.8} stroke="var(--primary-foreground)" strokeWidth={0.6 + (5 - i) * 0.25} />
        ))}
        <circle cx="17" cy="14.6" r="2.6" fill="var(--primary-foreground)" />
      </svg>
      <span>
        Guitar <span className="text-primary">Lab</span>
      </span>
    </Link>
  );
}
