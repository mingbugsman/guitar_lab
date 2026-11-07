# Guitar Lab

**Learn. Understand. Practice. Create.** — Nền tảng học guitar từ con số 0, có hình cây đàn để đối chiếu với đàn thật.

- Roadmap gốc: [`docx/roadmap.md`](docx/roadmap.md)
- **Checklist tiến độ từng phase (xem đầu tiên mỗi lần quay lại):** [`docx/CHECKLIST.md`](docx/CHECKLIST.md)
- Quy ước hướng đàn cho hình & nội dung: [`docx/GUITAR_VISUAL.md`](docx/GUITAR_VISUAL.md)

## Stack

Next.js 15 (App Router, RSC) · React 19 · TypeScript strict · Tailwind CSS 4 + shadcn/ui (Base UI) · Supabase (Postgres, Auth, RLS, `@supabase/ssr`) · Tone.js + Web Audio API · Zod · React Hook Form · Vitest + Testing Library · Playwright · Vercel.

## Chạy local

Yêu cầu: Node 20+ (đã thử với Node 24), Docker Desktop (cho Supabase local).

```bash
npm install
npx supabase start            # khởi động Postgres + Auth local, tự áp dụng migrations
npx supabase status -o env    # lấy API_URL và PUBLISHABLE_KEY
cp .env.example .env.local    # điền NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
npm run dev                   # http://localhost:3000
```

Mẹo: chỉ cần các service tối thiểu:
`npx supabase start -x studio,imgproxy,edge-runtime,logflare,vector,realtime,storage-api,postgres-meta,supavisor`

## Scripts

| Lệnh | Việc |
|---|---|
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest (unit + component) |
| `npm run build` | Production build |
| `npm run test:e2e` | Playwright (cần `npm run build` + Supabase local; tự chạy `npm start`) |
| `npm run check` | lint + typecheck + test + build |
| `npm run db:reset` | Reset DB local và chạy lại migrations + seed |

## Cấu trúc

```text
src/
  app/                 routes: (auth)/login|register, onboarding, (app)/dashboard|academy|practice|guitar|tools|progress|profile
  components/
    guitar/            Fretboard, ChordDiagram, ChordCompare, GuitarAnatomy, hand diagrams, view context  ← Guitar Visual
    audio/             Metronome (Tone.Transport), Tuner (getUserMedia + YIN)
    learning/          lesson renderer, progress panel
    layout/ ui/        shell, navigation, shadcn components
  content/             giáo trình (TypeScript, version theo git): Level 0 + First Chords
  features/            authentication, academy, practice, profile, progress — server actions + logic thuần
  lib/                 music (nốt, dây, hợp âm), audio (pitch detection, synth), supabase, validation
supabase/migrations/   schema + RLS
tests/e2e/             Playwright
```

**Quyết định kiến trúc:** nội dung giáo trình nằm trong code (`src/content`) để được review, test và version cùng UI; database chỉ lưu dữ liệu của người dùng (profile, tiến độ bài, buổi tập, cột mốc) và tham chiếu bài học bằng slug ổn định.

## Bảo mật dữ liệu

- Mọi bảng bật RLS: người dùng chỉ đọc/ghi dữ liệu của mình (`tests/e2e/rls.spec.ts`).
- `lesson_progress.verified_at` không thể ghi từ client (column grants) và `mastered` bắt buộc có `verified_at` (CHECK constraint) — hệ thống không cho tự đánh dấu "thành thạo".
- App chỉ dùng publishable key. Không commit `.env*` (trừ `.env.example`).

## Deploy (Vercel + Supabase Cloud)

1. Tạo project Supabase (nên có 2: dev/preview và production). Áp dụng migrations: `npx supabase link --project-ref <ref>` rồi `npx supabase db push`.
2. Supabase → Authentication → URL Configuration: đặt Site URL = domain production, thêm `https://<preview-domain>/**` vào Redirect URLs.
3. Vercel → Import repo `mingbugsman/guitar_lab` → Environment Variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_APP_URL` (mỗi môi trường Preview/Production trỏ tới Supabase tương ứng).
4. Push nhánh → Preview URL; merge vào `main` → Production.

## Giới hạn đã biết (MVP 0.1)

- Tuner cần HTTPS (hoặc localhost) và trình duyệt cho phép micro; chỉ hỗ trợ Standard Tuning.
- Âm thanh mẫu là âm tổng hợp (Karplus-Strong qua Tone.js), không phải bản ghi đàn thật.
- "Hôm nay" tính theo múi giờ Asia/Ho_Chi_Minh.
- Chưa có kiểm tra thực hành xác minh → chưa có trạng thái Mastered.
- Giao diện chỉ có chế độ sáng.
