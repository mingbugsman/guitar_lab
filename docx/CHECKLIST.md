# GUITAR LAB — CHECKLIST TIẾN ĐỘ

> File này là "bản đồ" để mỗi lần quay lại biết ngay **đang ở đâu** và **làm gì tiếp theo**.
> Quy ước: `[x]` xong & đã kiểm chứng · `[~]` làm một phần / cần xác minh thêm · `[ ]` chưa làm · 🔑 cần chủ dự án cung cấp (tài khoản, credentials).
> Roadmap gốc: [roadmap.md](roadmap.md) · Quy ước hướng đàn: [GUITAR_VISUAL.md](GUITAR_VISUAL.md) · Cách chạy: [../README.md](../README.md)

## ▶ ĐANG Ở ĐÂU / LÀM GÌ TIẾP

- **Cập nhật lần cuối:** 2026-11-07
- **Trạng thái:** Phase 0 + Phase 1 (MVP 0.1) **đã code xong và đã kiểm thử trên local** (Supabase local + Playwright). **Chưa deploy** — thiếu tài khoản Vercel/Supabase Cloud.
- **Việc kế tiếp (theo thứ tự):**
  1. 🔑 Tạo Supabase Cloud project (dev + prod) → `npx supabase link` → `npx supabase db push`.
  2. 🔑 Import repo vào Vercel, đặt 3 biến môi trường (xem README → Deploy).
  3. Smoke test Preview: chạy `PLAYWRIGHT_BASE_URL=<preview-url> npm run test:e2e` (trỏ env tới Supabase **dev**, không phải prod).
  4. Merge `develop` → `main` → Production → kiểm tra production URL.
  5. Bắt đầu Phase 2 (mục bên dưới), nhánh `feature/level-1-complete`.

## Kết quả kiểm thử gần nhất (2026-11-07, local)

| Kiểm tra | Kết quả |
|---|---|
| `npm run lint` | ✅ sạch |
| `npm run typecheck` | ✅ sạch |
| `npm test` (Vitest) | ✅ 59 tests |
| `npm run build` | ✅ |
| `npm run test:e2e` (Playwright, desktop + mobile, Supabase local) | ✅ 14 passed (4 skipped theo thiết kế: test chỉ chạy 1 project) |

## Quy trình Git

- `main`: production-ready · `develop`: tích hợp · `feature/*`, `fix/*`: phát triển.
- Làm tới đâu commit tới đó. Commit message không chèn dòng tác giả AI.
- Merge `feature/*` → `develop` khi `npm run check` pass; `develop` → `main` khi đạt tiêu chí phase.
- CI: `.github/workflows/ci.yml` chạy lint, typecheck, test, build trên mọi push/PR.

---

## PHASE 0 — PROJECT FOUNDATION

### Chức năng
- [x] 1. Next.js 15 + TypeScript strict, App Router, `src/`
- [x] 2. Tailwind CSS 4 + shadcn/ui (base-nova / Base UI)
- [x] 3. Supabase: `@supabase/ssr` client server + middleware refresh session
- [x] 4. Authentication foundation (email/password)
- [x] 5. Migrations: `supabase/migrations/20261107000000_phase1_core.sql` (+ `seed.sql`)
- [x] 6. Design system: token màu ấm (gỗ/đồng), token riêng cho hình đàn `--gl-*`, font Be Vietnam Pro (hỗ trợ tiếng Việt)
- [x] 7. Responsive app shell (sidebar desktop, header + bottom nav mobile)
- [x] 8. Navigation (chỉ hiện tính năng đã chạy thật)
- [x] 9. GitHub: `origin` → github.com/mingbugsman/guitar_lab (nhánh `main`, `develop`, `feature/foundation`)
- [ ] 10. 🔑 Cấu hình Vercel
- [x] 11. `.env.example`
- [x] 12. README + hướng dẫn cài đặt
- [x] 13. Lint, typecheck, Vitest, Playwright, production build, CI workflow

### Trang tối thiểu
- [x] Landing · [x] Login · [x] Register · [x] Dashboard · [x] Academy · [x] Practice

### Exit criteria
- [x] Chạy local thành công
- [ ] 🔑 Preview deployment thành công
- [x] Database kết nối thành công (Supabase local; cloud chờ 🔑)
- [x] Authentication foundation hoạt động (E2E đăng ký/đăng nhập/đăng xuất)
- [x] Không có secret trong repository (`.env.local` bị ignore)

---

## PHASE 1 — MVP 0.1: FIRST USABLE RELEASE

### ★ Guitar Visual (yêu cầu bổ sung — đối chiếu với đàn thật)
- [x] `GuitarAnatomy`: đàn acoustic dựng đứng, 11 bộ phận có nhãn, chạm để xem giải thích
- [x] `Fretboard`: góc "Nhìn xuống (người chơi)" (mặc định) và "Kiểu Tab", chế độ tay trái (lật gương), chạm dây để nghe
- [x] Nhãn luôn hiện: Dây 1–6 + tên nốt, "phía mặt bạn / phía sàn nhà", "đầu đàn / thùng đàn", Phím 1…n
- [x] `ChordCompare`: sơ đồ hợp âm ↔ cần đàn song song, cùng một dữ liệu
- [x] Lời hướng dẫn bấm hợp âm sinh tự động từ dữ liệu (`describeChord`) → không lệch hình
- [x] Mọi bài có hình cần đàn/hợp âm đều có khung "Đối chiếu với đàn của bạn" (test bắt buộc)
- [x] Tay thuận lấy từ onboarding/hồ sơ, đổi nhanh bằng nút ⇄
- [x] `FingerNumberDiagram`, `PostureDiagram`
- [x] Trang `/guitar` (Guitar Visual Lab)
- [x] Tài liệu quy ước: `docx/GUITAR_VISUAL.md`

### A. Authentication
- [x] Register · [x] Login · [x] Logout · [x] Basic profile · [x] Session persistence · [x] Protected routes
- [x] Xử lý email confirmation (`/auth/confirm`) khi bật xác nhận email trên Supabase Cloud

### B. Onboarding
- [x] Experience · [x] Guitar type · [x] Practice goal (mặc định 30') · [x] Learning target · [x] Tay thuận (cho Guitar Visual)

### C. Learning Dashboard (dữ liệu thật từ DB)
- [x] Welcome · [x] Current level · [x] Today's lesson · [x] Daily routine · [x] Progress · [x] Continue · [x] Recently completed

### D. Academy — Level 0 (12 bài, `src/content/level-0.ts`)
- [x] 1 Introduction · [x] 2 Anatomy · [x] 3 Posture · [x] 4 Hand position · [x] 5 Six strings · [x] 6 Standard tuning
- [x] 7 Tuner · [x] 8 Open strings · [x] 9 Fretboard · [x] 10 Notes · [x] 11 Pitch & rhythm · [x] 12 Clean sounds
- [x] Mỗi bài: mục tiêu, điều kiện, giải thích, hình, luyện tập, lỗi thường gặp, checklist, trạng thái, tiêu chí đạt & thành thạo

### E. Academy — First Chords (`src/content/level-1.ts`)
- [x] Bài "Đọc sơ đồ hợp âm" (bổ sung để nối góc nhìn dựng đứng ↔ nhìn xuống)
- [x] Em · [x] Am · [x] E · [x] A · [x] D (sơ đồ chính xác — test kiểm tra nốt — âm thanh mẫu, bài tập)

### F. Chord Diagram component
- [x] 6 dây · [x] phím · [x] vị trí ngón · [x] số ngón · [x] O · [x] X · [x] tên hợp âm · [x] responsive (SVG viewBox)

### G. Daily Practice Engine
- [x] 6 hoạt động 4/5/8/8/3/2 phút, tự co giãn theo mục tiêu 15/30/45/60'
- [x] Mở buổi (hoặc tiếp tục buổi dở) · [x] Đánh dấu hoàn thành · [x] Đếm thời lượng · [x] Ghi chú + mức tập trung · [x] Lưu DB
- [x] Metronome + Tuner ngay trong buổi tập

### H. Tools
- [x] Metronome: start/stop, BPM 30–240, chỉ báo phách, nhấn phách 1, click thật, lập lịch trên Web Audio clock (Tone.Transport)
- [x] Tuner: xin quyền mic, YIN realtime, nhận nốt + quãng tám, cent, E A D G B E, khóa dây mục tiêu, nghe nốt chuẩn, báo lỗi mic bị chặn/không hỗ trợ
- [~] Tuner đã test thuật toán bằng tín hiệu tổng hợp (unit test, sai số < 1 cent); **cần thử với đàn thật qua micro**

### I. Progress tracking
- [x] Completed lessons · [x] Learning status · [x] Practice sessions · [x] Tổng thời gian · [x] 7 milestones · [x] Tồn tại sau reload/đăng nhập lại

### J. Audio demonstrations
- [x] Dây buông, hợp âm (gảy xuống / từng dây), nốt chuẩn — tổng hợp Karplus-Strong (Tone.PluckSynth)

### Acceptance criteria (14)
- [x] 1 Đăng ký · [x] 2 Login/Logout · [x] 3 Level 0 · [x] 4 Nội dung đầy đủ · [x] 5 Chord diagram đúng
- [x] 6 Metronome có tiếng · [~] 7 Tuner nhận cao độ (cần thử với đàn thật) · [x] 8 Thực hành + đánh dấu · [x] 9 Buổi tập lưu DB
- [x] 10 Tiến độ sau reload · [x] 11 Dashboard dữ liệu thật · [x] 12 Dùng được trên mobile (test không tràn ngang)
- [x] 13 Không có UI giả · [x] 14 Không lỗi auth/RLS (E2E RLS)

### Public deployment
- [x] lint · [x] typecheck · [x] tests · [x] build · [x] migrations (local) · [x] RLS (local)
- [ ] 🔑 Deploy Preview · [ ] 🔑 Smoke test Preview · [ ] 🔑 Deploy Production · [ ] 🔑 Kiểm tra production URL

---

## PHASE 2 — MVP 0.2: CORE LEARNING EXPERIENCE
- [ ] Level 1 đầy đủ: Dm, C, G, A7, D7, E7 (thêm vào `CHORDS` + test nốt), cấu tạo hợp âm, trưởng/thứ, bài chuyển hợp âm
- [ ] Level 2: down/up stroke, 4/4, 3/4, 6/8, strumming patterns, arpeggio, trường độ, dấu lặng, phách mạnh/nhẹ, capo
- [ ] Strumming pattern visual: mũi tên ↓↑ khớp hướng thật (↓ = về phía sàn nhà, dây 6 → 1), có âm thanh theo metronome
- [ ] Metronome hỗ trợ 6/8
- [ ] Ear training beginner: cao/thấp, pitch matching, tiết tấu, trưởng vs thứ (âm thanh thật)
- [ ] Song library cơ bản (tự soạn / public domain): difficulty, key, BPM, time signature, chords, objectives, related lessons
- [ ] Practice: lịch sử theo ngày, tổng kết tuần, nhắc trong app, ôn bài, kỹ năng yếu, spaced repetition cơ bản
- [ ] Acceptance + deploy MVP 0.2

## PHASE 3 — MVP 1.0: BEGINNER CURRICULUM COMPLETE
- [ ] Level 3: F, Bm, barre (sơ đồ cần `baseFret` > 1 + ký hiệu chặn), power, sus2, sus4, 7th, intervals, triads, major scale, progressions
- [ ] Music theory foundation (+ fretboard tương tác)
- [ ] Ear training beginner đầy đủ (interval, chord quality, rhythm, melody, dictation)
- [ ] Skill assessment engine (tách self-assessment vs verified; ghi `verified_at` phía server)
- [ ] Learning path đề xuất
- [ ] Song library mở rộng theo thể loại
- [ ] Audio recording (MediaRecorder + Supabase Storage, người dùng tự xóa)
- [ ] Tab viewer (dùng góc nhìn "Kiểu Tab" đã có)
- [ ] Acceptance + deploy MVP 1.0

## PHASE 4 — GROWTH 1.5
- [ ] Track A Acoustic Rhythm · [ ] Track B Fingerstyle · [ ] Track C Lead
- [ ] Advanced theory · [ ] Advanced fretboard visualization (scale/CAGED) · [ ] Arrangement workspace

## PHASE 5 — INTELLIGENT 2.0
- [ ] AI audio analysis · [ ] Personalized feedback · [ ] AI learning assistant (giới hạn rõ ràng)

---

## Nhật ký phiên làm việc
- **2026-11-07** — Khởi tạo repo, Phase 0 + Phase 1 code hoàn chỉnh, Guitar Visual, 59 unit tests + 14 E2E pass trên local. Chờ 🔑 Vercel/Supabase Cloud để deploy.
