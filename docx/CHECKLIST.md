# GUITAR LAB — CHECKLIST TIẾN ĐỘ

> File này là "bản đồ" để mỗi lần quay lại biết ngay **đang ở đâu** và **làm gì tiếp theo**.
> Quy ước: `[x]` xong · `[~]` làm một phần / cần xác minh thêm · `[ ]` chưa làm · 🔑 cần người dùng cung cấp (credentials, tài khoản…).
> Roadmap gốc: [roadmap.md](roadmap.md). Quy ước hướng đàn: [GUITAR_VISUAL.md](GUITAR_VISUAL.md).

## ▶ ĐANG Ở ĐÂU / LÀM GÌ TIẾP

- **Phase hiện tại:** Phase 1 — MVP 0.1 (code xong, chờ deploy)
- **Việc kế tiếp:** xem mục "NEXT" ở cuối file.

---

## Quy trình Git

- `main`: production-ready · `develop`: tích hợp · `feature/*`, `fix/*`: phát triển.
- Làm tới đâu commit tới đó. Commit message không chèn dòng tác giả AI.
- Merge `feature/*` → `develop` khi lint + typecheck + test + build pass; `develop` → `main` khi đạt tiêu chí phase.

---

## PHASE 0 — PROJECT FOUNDATION

### Chức năng
- [ ] 1. Khởi tạo Next.js + TypeScript (strict, App Router, `src/`)
- [ ] 2. Tailwind CSS + shadcn/ui
- [ ] 3. Tích hợp Supabase (`@supabase/ssr`, client/server/middleware)
- [ ] 4. Authentication foundation
- [ ] 5. Database migrations (`supabase/migrations`)
- [ ] 6. Design system (tokens màu, typography, component cơ bản)
- [ ] 7. Responsive application shell
- [ ] 8. Navigation (desktop sidebar + mobile bottom nav)
- [ ] 9. GitHub repository (`origin` → github.com/mingbugsman/guitar_lab)
- [ ] 10. 🔑 Cấu hình Vercel (import repo, set env vars)
- [ ] 11. Environment variables (`.env.example`)
- [ ] 12. README + hướng dẫn cài đặt
- [ ] 13. Lint, typecheck, tests, production build

### Trang tối thiểu
- [ ] Landing · [ ] Login · [ ] Register · [ ] Dashboard · [ ] Academy · [ ] Practice

### Exit criteria
- [ ] Chạy local thành công
- [ ] 🔑 Preview deployment thành công
- [ ] Database kết nối thành công (local Supabase)
- [ ] Authentication foundation hoạt động
- [ ] Không có secret trong repository

---

## PHASE 1 — MVP 0.1: FIRST USABLE RELEASE

### ★ Guitar Visual (yêu cầu bổ sung — đối chiếu với đàn thật)
- [ ] Component cây đàn đầy đủ (headstock, khóa, nut, phím, thùng đàn, lỗ thoát âm, ngựa đàn) có nhãn, chạm để xem
- [ ] Fretboard có 2 góc nhìn: "Nhìn xuống (người chơi)" và "Kiểu Tab", + chế độ tay trái
- [ ] Nhãn dây luôn hiện: số dây + tên nốt + độ dày
- [ ] Chord diagram ↔ Fretboard đối chiếu song song cùng một thế bấm
- [ ] Nội dung bài học mô tả vị trí theo đúng hướng visual (dây số + tên, "trên/dưới" theo góc nhìn đang chọn)
- [ ] Tài liệu quy ước: `docx/GUITAR_VISUAL.md`

### A. Authentication
- [ ] Register · [ ] Login · [ ] Logout · [ ] Basic profile · [ ] Session persistence · [ ] Protected routes

### B. Onboarding
- [ ] Experience · [ ] Guitar type · [ ] Practice goal (mặc định 30') · [ ] Learning target

### C. Learning Dashboard (dữ liệu thật từ DB)
- [ ] Welcome · [ ] Current level · [ ] Today's lesson · [ ] Daily routine · [ ] Progress · [ ] Continue · [ ] Recently completed

### D. Academy — Level 0 (12 bài)
- [ ] 1 Introduction · [ ] 2 Anatomy · [ ] 3 Posture · [ ] 4 Hand position · [ ] 5 Six strings · [ ] 6 Standard tuning
- [ ] 7 Tuner · [ ] 8 Open strings · [ ] 9 Fretboard · [ ] 10 Notes · [ ] 11 Pitch & rhythm · [ ] 12 Clean sounds
- [ ] Mỗi bài: explanation, diagram, practice instruction, completion checklist, learning status

### E. Academy — First Chords
- [ ] Em · [ ] Am · [ ] E · [ ] A · [ ] D (sơ đồ chính xác + âm thanh mẫu + bài tập)

### F. Chord Diagram component
- [ ] 6 dây · [ ] phím · [ ] vị trí ngón · [ ] số ngón · [ ] dây buông (O) · [ ] dây chặn (X) · [ ] tên hợp âm · [ ] responsive

### G. Daily Practice Engine (30')
- [ ] 6 hoạt động (Recall 4, Theory 5, Technical 8, Application 8, Free play 3, Reflection 2)
- [ ] Mở buổi · [ ] Đánh dấu hoàn thành · [ ] Đếm thời lượng · [ ] Ghi chú · [ ] Lưu DB

### H. Tools
- [ ] Metronome: start/stop, BPM, beat indicator, click thật, timing ổn định (lookahead scheduler)
- [ ] Tuner: quyền mic, pitch detection realtime, nhận nốt, cent, E A D G B E, xử lý lỗi mic

### I. Progress tracking
- [ ] Completed lessons · [ ] Learning status · [ ] Practice sessions · [ ] Tổng thời gian · [ ] Milestones · [ ] Tồn tại sau reload

### J. Audio demonstrations
- [ ] Phát âm thanh dây buông & hợp âm (tổng hợp Web Audio / Tone.js)

### Acceptance criteria (14)
- [ ] 1 Đăng ký · [ ] 2 Login/Logout · [ ] 3 Level 0 · [ ] 4 Nội dung đầy đủ · [ ] 5 Chord diagram đúng
- [ ] 6 Metronome có tiếng · [ ] 7 Tuner nhận cao độ · [ ] 8 Thực hành + đánh dấu · [ ] 9 Buổi tập lưu DB
- [ ] 10 Tiến độ sau reload · [ ] 11 Dashboard dữ liệu thật · [ ] 12 Dùng được trên mobile
- [ ] 13 Không có UI giả · [ ] 14 Không lỗi auth/RLS

### Public deployment
- [ ] lint · [ ] typecheck · [ ] tests · [ ] build · [ ] migrations · [ ] RLS
- [ ] 🔑 Deploy Preview · [ ] 🔑 Smoke test Preview · [ ] 🔑 Deploy Production · [ ] 🔑 Kiểm tra production URL

---

## PHASE 2 — MVP 0.2: CORE LEARNING EXPERIENCE
- [ ] Level 1 đầy đủ: Dm, C, G, A7, D7, E7, cấu tạo hợp âm, trưởng/thứ, bài chuyển hợp âm
- [ ] Level 2: down/up stroke, 4/4, 3/4, 6/8, strumming patterns, arpeggio, trường độ, dấu lặng, phách mạnh/nhẹ, capo
- [ ] Ear training beginner: cao/thấp, pitch matching, nhận diện tiết tấu, trưởng vs thứ (có âm thanh thật)
- [ ] Song library cơ bản (nội dung tự soạn / public domain): difficulty, key, BPM, time signature, chords, objectives, related lessons
- [ ] Practice: lịch sử ngày, tổng kết tuần, nhắc trong app, ôn bài, kỹ năng yếu, spaced repetition cơ bản
- [ ] Strumming pattern visual (mũi tên ↓↑ khớp với hướng gảy trên Guitar Visual)
- [ ] Acceptance + deploy MVP 0.2

## PHASE 3 — MVP 1.0: BEGINNER CURRICULUM COMPLETE
- [ ] Level 3: F, Bm, barre, power, sus2, sus4, 7th, intervals, triads, major scale, progressions
- [ ] Music theory foundation đầy đủ (+ fretboard tương tác)
- [ ] Ear training beginner đầy đủ (interval, chord quality, rhythm, melody, dictation)
- [ ] Skill assessment engine (tách self-assessment vs verified)
- [ ] Learning path đề xuất
- [ ] Song library mở rộng theo thể loại
- [ ] Audio recording (MediaRecorder + Supabase Storage, xóa theo ý người dùng)
- [ ] Acceptance + deploy MVP 1.0

## PHASE 4 — GROWTH 1.5
- [ ] Track A Acoustic Rhythm · [ ] Track B Fingerstyle · [ ] Track C Lead
- [ ] Advanced theory · [ ] Advanced fretboard visualization (scale/CAGED) · [ ] Arrangement workspace

## PHASE 5 — INTELLIGENT 2.0
- [ ] AI audio analysis · [ ] Personalized feedback · [ ] AI learning assistant (giới hạn rõ ràng)

---

## NEXT
(cập nhật cuối mỗi buổi làm việc)
