# GUITAR LAB — CHECKLIST TIẾN ĐỘ

> File này là "bản đồ" để mỗi lần quay lại biết ngay **đang ở đâu** và **làm gì tiếp theo**.
> Quy ước: `[x]` xong & đã kiểm chứng · `[~]` làm một phần / cần xác minh thêm · `[ ]` chưa làm · 🔑 cần chủ dự án cung cấp (tài khoản, credentials).
> Roadmap gốc: [roadmap.md](roadmap.md) · Quy ước hướng đàn: [GUITAR_VISUAL.md](GUITAR_VISUAL.md) · Cách viết cho người mới: [WRITING_GUIDE.md](WRITING_GUIDE.md) · Giao diện: [DESIGN.md](DESIGN.md) · Cách chạy: [../README.md](../README.md)

## ▶ ĐANG Ở ĐÂU / LÀM GÌ TIẾP

- **Cập nhật lần cuối:** 2026-11-11
- **Trạng thái:** ✅ **MVP 0.1 đã lên Production** — https://guitar-lab-eight.vercel.app
  - Vercel project `guitar-lab` (region sin1, Node 24) · `main` → Production, nhánh khác → Preview (có Vercel Deployment Protection)
  - Supabase `guitar-lab-prod` (Singapore) cho Production · `guitar-lab-dev` (Sydney) cho Preview/local test · xác nhận email đang TẮT
- **Việc kế tiếp (theo thứ tự):**
  1. 🔑 Xóa 12 tài khoản test `@example.com` (6 prod + 6 dev): Supabase → Authentication → Users → lọc "example.com" → Delete. Dữ liệu liên quan tự xóa theo (cascade).
  2. 🔑 Thu hồi 2 token đã dùng để deploy (Supabase Access Token, Vercel Token).
  3. 🔑 Thử Tuner với đàn thật trên production (`/tools`) — mục duy nhất của Phase 1 chưa kiểm chứng bằng đàn thật.
  4. Trước khi mời nhiều người dùng: cài SMTP riêng rồi bật lại "Confirm email" (xem [DEPLOY.md](DEPLOY.md) Bước 3.2).
  5. Phần còn lại của WRITING_GUIDE (mục "Diễn đạt cho người mới" bên dưới): lối đi khi kẹt (§6), checklist nghe/nhìn được + âm mẫu rè/tắt (§8), câu mở đầu "học xong làm được gì" (§10). Giọng văn, thuật ngữ, cơ thể đã xong.
  6. Thử "Đổi hợp âm 1 phút" với đàn thật: máy đếm có thiếu/thừa không (chỉnh `createStrumDetector` trong `src/lib/audio/strum-detector.ts`).
  7. **BIG UPDATE — Practice Engine** (mục bên dưới, thiết kế: [PRACTICE_ENGINE.md](PRACTICE_ENGINE.md)): làm trước Phase 2.
  8. Bắt đầu Phase 2, nhánh `feature/level-1-complete` từ `develop`.

## Kết quả kiểm thử gần nhất (2026-11-11, local)

| Kiểm tra | Kết quả |
|---|---|
| `npm run lint` | ✅ sạch |
| `npm run typecheck` | ✅ sạch |
| `npm test` (Vitest) | ✅ 119 tests (có `src/content/writing.test.ts` kiểm quy tắc viết) |
| `npm run build` | ✅ |
| `npm run test:e2e` (Playwright, desktop + mobile, Supabase local) | ✅ 18 passed (6 skipped theo thiết kế: test chỉ chạy 1 project) |

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
- [x] 10. Cấu hình Vercel (env Production/Preview tách riêng, region sin1)
- [x] 11. `.env.example`
- [x] 12. README + hướng dẫn cài đặt
- [x] 13. Lint, typecheck, Vitest, Playwright, production build, CI workflow

### Trang tối thiểu
- [x] Landing · [x] Login · [x] Register · [x] Dashboard · [x] Academy · [x] Practice

### Exit criteria
- [x] Chạy local thành công
- [x] Preview deployment thành công
- [x] Database kết nối thành công (local + Supabase Cloud dev/prod)
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

### E. Academy — First Chords (`src/content/level-1.ts`; Em nằm ở Level 0 bài 10, dựng bằng `src/content/chord-lesson.ts`)
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
- [x] lint · [x] typecheck · [x] tests · [x] build · [x] migrations (dev + prod) · [x] RLS (dev + prod: 5 bảng đều bật RLS)
- [x] Deploy Preview · [~] Smoke test Preview (Preview được Vercel bảo vệ → E2E chạy trên production) · [x] Deploy Production · [x] Kiểm tra production URL (E2E 14/14)

---

## DIỄN ĐẠT CHO NGƯỜI MỚI (rà soát 11/11/2026 — chi tiết: [WRITING_GUIDE.md](WRITING_GUIDE.md))

- [x] 1. Chữ đổi theo tay thuận: token `{fretHand}`… trong 18 bài, hình cấu tạo đàn, hình tư thế lật gương; test chặn viết cứng
- [x] 2. Giọng văn & xưng hô: rà xong 18 bài (gọi "bạn", checklist bắt đầu "Tôi", bỏ chữ in hoa, lỗi viết theo triệu chứng → nguyên nhân → cách sửa, con số thay tính từ). Test chặn "ta/chúng ta", chữ in hoa, checklist không bắt đầu bằng "Tôi".
- [x] 3. Thuật ngữ: 18 bài giải thích thuật ngữ ở lần đầu trong mỗi bài (test tự kiểm 23 thuật ngữ) · [x] menu tiếng Việt · [x] công cụ đổi tên "Máy lên dây (Tuner)", "Máy đếm nhịp (Metronome)" · [x] nút "Kiểu Tab" ẩn cho tới khi có bài dạy Tab (`TAB_LESSON_SLUG` trong `orientation.ts`)
- [x] 4. Cơ thể & kỳ vọng: khung "Cảm giác khi tập" trong bài 3, 4, 9 và 5 bài hợp âm (bình thường là gì, mất mấy buổi, khi nào dừng). Test bắt buộc.
- [ ] 5. Hình vẽ chuyển động (hướng gảy, chuyển hợp âm) · [x] hình tư thế ghi rõ "như soi gương"
- [~] 6. Tự biết đúng/sai: đã có quy ước (§8) · [ ] âm mẫu tiếng rè / tiếng tắt · [ ] viết lại checklist thành thứ nghe/nhìn được
- [~] 7. Lối đi khi kẹt: đã có quy ước (§6) · [ ] thêm trường `stuck` vào mẫu bài học + viết cho 18 bài
- [x] 8. Trình bày khi đang ôm đàn: bài học chia 4 chặng, luyện từng bước một màn hình, nút "Bước tiếp" lớn ở đáy, ẩn thanh điều hướng dưới (xem DESIGN.md)
- [~] 9. "Vì sao" & thành quả sớm: đã có quy ước (§10) · [ ] câu mở đầu "học xong làm được gì" cho 18 bài · [x] Em thành bài 10 của Level 0 (trước là bài 14); bài 12, 13 và bài Đọc sơ đồ dùng lại Em
- [x] 10. Ưu tiên acoustic: bài viết cho acoustic; classic và đàn điện có ghi chú riêng đầu bài

---

## BIG UPDATE — PRACTICE ENGINE (quyết định 11/11/2026 — thiết kế: [PRACTICE_ENGINE.md](PRACTICE_ENGINE.md))

Không chấm bằng micro (micro laptop yếu): người học tự đánh giá. Mọi bài tập đều có Xem mẫu trên hình, tốc độ tăng từ chậm lên nhanh.

### Bước 1 — Cần đàn bấm được từng ô (`feature/playable-fretboard`)
- [ ] `cellAt()` + unit test (2 tay thuận × 2 hướng nhìn)
- [ ] `Fretboard` có `onCellPress`, `pressedCell`; vùng dây buông trước lược đàn
- [ ] Bàn phím: `role="grid"`, phím mũi tên + Enter
- [ ] Nút "Phóng to phím 1–5" trên trang Cây đàn
- [ ] E2E: chạm ô → đúng dây/phím, cả khi đàn tay trái

### Bước 2a — Bộ máy chuỗi nốt (`feature/drill-engine`)
- [ ] Kiểu dữ liệu `Step / Sequence / Drill / Tempo` (`src/lib/practice/sequence.ts`)
- [ ] Bộ dựng `spider`, `shiftPositions`, `stringSkip`… + ràng buộc có test
- [ ] `tempoForRound()` + test
- [ ] `usePatternPlayer` trên Tone.Transport + Tone.Draw; `transport-owner` (không chạy cùng Metronome)

### Bước 2b — Màn hình Bài tập ngón (`feature/finger-drills`)
- [ ] `ExercisePlayer`: ô cần bấm / ô kế tiếp / ngón đang giữ, phách, caption
- [ ] Xem mẫu (30 BPM, có caption) → đếm vào → chạy → tự đánh giá 3 mức
- [ ] Chậm lên nhanh + "Giữ tốc độ này" + "Chỉ nghe tiếng tích"
- [ ] 12 bài: spider-1234, spider-4321, spider-updown, spider-hold, perm-1324, perm-1423, diagonal, shift, pairs, string-skip, alternate, burst
- [ ] Trang `/drills`, `/drills/[id]`; khóa bài theo `unlockAfter`
- [ ] Migration `drill_results` (local → dev → prod) + RLS test
- [ ] E2E với `page.clock`

### Bước 3 — Thử thách hợp âm (`feature/chord-challenge`)
- [ ] `buildChallenge()` có seed, không lặp hợp âm liền nhau, các chặng tăng dần + test
- [ ] Màn hình: sơ đồ lớn + hợp âm kế tiếp + phách + chặng/BPM/thời gian còn lại
- [ ] 1 / 3 / 5 phút; chọn nhóm hợp âm (mặc định: đã học); tùy chọn nghe mẫu
- [ ] Tự đánh giá "theo kịp tới chặng …" → lưu `drill_results`
- [ ] E2E

### Bước 4 — Gắn vào app (`feature/drills-integration`)
- [ ] Visual `{ kind: "drill" }` trong bài 4, 9, 12 và các bài A, D
- [ ] Buổi tập: phần Kỹ thuật gợi ý bài tập ngón; công cụ "Bài tập ngón"
- [ ] Trang Luyện tập: 3 lối vào; trang Tiến độ: tốc độ sạch cao nhất + kỷ lục
- [ ] Test: drill được tham chiếu tồn tại và đã mở ở bài đó

### Sau này — Fingerpicking (thuộc Phase 2, Level 2)
- [ ] `pick: p/i/m/a`, mẫu `B-3-2-1`, `B-(321)`, `B-(321)-slap`; `PatternLane`; tiếng vỗ đàn; hình tay gảy lật gương

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
- **2026-11-11** — Chốt BIG UPDATE Practice Engine (cần đàn bấm từng ô, 12 bài tập ngón có Xem mẫu và tăng tốc, thử thách hợp âm, hướng fingerpicking). Thiết kế: `docx/PRACTICE_ENGINE.md`.
- **2026-11-11** — Công cụ "Đổi hợp âm 1 phút": micro tự đếm tiếng gảy (`src/lib/audio/strum-detector.ts`), có chế độ tự đếm bằng tay, giữ màn hình sáng khi đang đo, lưu kết quả theo hợp âm/cặp hợp âm (bảng `chord_change_runs`, RLS). Có trong mọi bài hợp âm (Em: 1 hợp âm; Am: Em–Am; E: E–Am; A: A–E; D: D–A), trang Công cụ và buổi tập. Migration `20261111000000_chord_change_runs.sql` đã áp local, dev, prod.
- **2026-11-11** — Đưa Em lên làm bài 10 của Level 0 (hợp âm đầu tiên sớm hơn 4 bài). Bài Em đọc từ hình cần đàn, không cần sơ đồ; bài Đọc sơ đồ dùng Em làm ví dụ.
- **2026-11-11** — Cần đàn tự co theo bề ngang màn hình (hết cuộn ngang trên điện thoại). Rà 18 bài theo WRITING_GUIDE §2, §4, §5; ẩn "Kiểu Tab"; thêm `writing.test.ts`.
- **2026-11-11** — Làm lại giao diện theo hướng "sổ tập đàn" (DESIGN.md): bài học từng bước, buổi tập dạng dòng thời gian, trang Hôm nay một cột, trang chủ có cần đàn bấm được, menu tiếng Việt. ui_lint 8.0 → 1.5.
- **2026-11-11** — Rà soát cách diễn đạt cho người mới: thêm `WRITING_GUIDE.md`, chữ đổi theo tay thuận, ưu tiên acoustic.
- **2026-11-07** — Khởi tạo repo, Phase 0 + Phase 1 code hoàn chỉnh, Guitar Visual, 59 unit tests + 14 E2E pass trên local.
- **2026-11-07** — Deploy: migrations lên Supabase dev/prod, cấu hình Auth, Vercel env + region sin1. E2E production phát hiện & sửa 2 vấn đề (độ trễ do server ở Mỹ; màn hình "đã lưu buổi tập" bị thay sau khi lưu). Production 14/14 pass.
