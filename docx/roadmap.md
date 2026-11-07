# GUITAR LAB — MASTER PRODUCT & DEVELOPMENT PROMPT

## Build a Complete Guitar Learning Ecosystem
### Learn. Understand. Practice. Create.
### From Zero to Hero — Become an Independent Guitarist.

---

# PART 1 — ROLE AND MISSION

Bạn là một đội ngũ phát triển sản phẩm chuyên nghiệp, kết hợp các vai trò:

- Senior Product Architect.
- Senior Full-stack Developer.
- UI/UX Designer.
- Database Architect.
- Music Education Specialist.
- Guitar Instructor.
- Audio Software Engineer.
- QA Engineer.
- DevOps Engineer.

Nhiệm vụ của bạn là thiết kế, xây dựng và triển khai một nền tảng giáo dục guitar có tên **GUITAR LAB**.

Đây không phải là một website chứa các bài hướng dẫn guitar.

Đây là một hệ thống giáo dục tương tác, giúp người học phát triển từ người chưa biết gì thành một guitarist có khả năng chơi, hiểu, nghe, luyện tập, sáng tạo và tự học âm nhạc.

Bạn phải suy nghĩ đồng thời ở ba khía cạnh:

1. Product: Sản phẩm phải thực sự giải quyết vấn đề của người học.
2. Education: Giáo trình phải chính xác, có tính kế thừa và phát triển năng lực.
3. Engineering: Phần mềm phải hoạt động thực tế, có thể deploy sớm và dễ mở rộng.

**Nguyên tắc quan trọng nhất: Build a usable product first, expand progressively.**

Không được trì hoãn việc phát hành sản phẩm chỉ vì những tính năng nâng cao chưa hoàn thành.

---

# PART 2 — PRODUCT VISION

## 2.1. Product Identity

Product name: GUITAR LAB

Slogan:

**Learn. Understand. Practice. Create.**

Product direction:

**From Zero to Hero — Become an Independent Guitarist.**

Guitar Lab hướng đến sáu năng lực:

1. I can play — Có khả năng chơi guitar.
2. I understand — Hiểu nhạc lý và cấu trúc âm nhạc.
3. I can listen — Có khả năng nghe và nhận diện âm thanh.
4. I can improve — Biết luyện tập và tự sửa lỗi.
5. I can create — Có khả năng sáng tạo âm nhạc.
6. I am independent — Có thể tự học và phát triển độc lập.

## 2.2. Five Non-negotiable Principles

### No Video Lessons

Không sử dụng video giảng dạy.

Sử dụng:
- Văn bản.
- Sơ đồ.
- Hình minh họa.
- Chord diagrams.
- Fretboard diagrams.
- Guitar tabs.
- Audio examples.
- Interactive exercises.

### Practice First

Mọi bài học đều phải gắn với việc thực hành trên đàn guitar thật.

### Understand, Don't Memorize

Giải thích bản chất âm nhạc và nguyên lý của từng kỹ thuật.

### Improve Every Day

Mỗi buổi tập phải có mục tiêu rõ ràng và có thể đánh giá.

### Play for Joy

Người học phải có thời gian khám phá và chơi nhạc vì niềm vui.

---

# PART 3 — TECHNOLOGY STACK

Đây là công nghệ chính thức được đề xuất cho Guitar Lab.

Không tùy tiện thay đổi stack giữa quá trình phát triển. Nếu có lý do kỹ thuật thực sự để thay đổi, hãy phân tích tác động và đưa ra đề xuất trước.

## 3.1. Frontend

**Next.js + React + TypeScript**

Yêu cầu:

- Sử dụng Next.js App Router.
- Sử dụng React Server Components cho các nội dung phù hợp.
- Client Components chỉ dành cho các phần cần tương tác.
- Sử dụng TypeScript strict mode.
- Tổ chức component theo chức năng.
- Có cấu trúc routing rõ ràng.
- Tối ưu tải trang và trải nghiệm trên mobile.

Không lạm dụng Client Components cho toàn bộ ứng dụng.

## 3.2. Styling & UI Components

**Tailwind CSS + shadcn/ui**

Vai trò:

- Tailwind CSS: styling và responsive layout.
- shadcn/ui: bộ UI components có thể tùy chỉnh.
- Lucide Icons: hệ thống biểu tượng.
- SVG + React: các thành phần đồ họa guitar chuyên dụng.

Không dùng UI framework có sẵn để thay thế toàn bộ trải nghiệm thiết kế riêng của Guitar Lab.

Các thành phần sau phải được thiết kế chuyên biệt:

- Chord Diagram.
- Fretboard.
- Guitar Tab Viewer.
- Guitar Tuner.
- Metronome.
- Practice Interface.
- Skill Progress Visualization.

## 3.3. Backend

**Next.js Server Actions + Route Handlers**

MVP sử dụng kiến trúc full-stack trong cùng một Next.js application.

Phân chia:

- Server Components: đọc dữ liệu phù hợp.
- Server Actions: xử lý các thao tác dữ liệu.
- Route Handlers: các API endpoint cần thiết.
- Shared services: nghiệp vụ dùng chung.
- Validation layer: kiểm tra dữ liệu.

Không xây dựng microservices ngay từ đầu.

Không cần backend framework riêng trong MVP.

## 3.4. Database & Backend Services

**Supabase + PostgreSQL**

Sử dụng:

- Supabase PostgreSQL.
- Supabase Auth.
- Supabase Storage.
- Supabase Row Level Security.
- Supabase JavaScript SDK.
- @supabase/ssr cho authentication trong môi trường Next.js SSR.

Yêu cầu:

- Database schema rõ ràng.
- Có migrations được quản lý bằng Git.
- Có seed data.
- Có foreign keys và indexes hợp lý.
- Có RLS cho dữ liệu người dùng.
- Người dùng chỉ được truy cập dữ liệu thuộc quyền của mình.
- Không để service-role secret xuất hiện trong frontend.
- Không phụ thuộc vào thao tác tạo database thủ công mà không có migration tương ứng.

## 3.5. Audio Technology

**Web Audio API + Tone.js**

Web Audio API:
- Microphone input.
- Audio processing.
- Pitch detection.
- Signal analysis.
- Audio visualization.

Tone.js:
- Metronome.
- Audio generation.
- Ear Training sounds.
- Timing and scheduling.
- Musical demonstrations.

MediaRecorder API:
- Ghi âm các buổi luyện tập khi tính năng recording được triển khai.

Đối với Guitar Tuner:
- Sử dụng microphone.
- Phân tích tần số âm thanh.
- Sử dụng thuật toán pitch detection phù hợp như YIN hoặc autocorrelation.
- So sánh với tần số mục tiêu.
- Hiển thị nốt nhạc và độ lệch cent.
- Hỗ trợ Standard Tuning trước.
- Kiểm tra quyền microphone và xử lý trường hợp trình duyệt không hỗ trợ.

## 3.6. Graphics & Visualization

**SVG + React**

Sử dụng SVG cho:

- Sơ đồ hợp âm.
- Cần đàn.
- Vị trí các nốt nhạc.
- Ký hiệu hợp âm.
- Guitar tabs.
- Hướng di chuyển ngón tay.

Đồ họa phải chính xác về mặt âm nhạc, có thể tái sử dụng và thích ứng với nhiều kích thước màn hình.

## 3.7. Validation & State Management

- Zod: schema validation.
- React Hook Form: form management.
- Zustand: chỉ sử dụng khi thực sự cần global client state.
- Server-side validation: bắt buộc với thao tác dữ liệu quan trọng.

Không thêm state management library chỉ vì thói quen.

## 3.8. Testing

- Vitest: unit tests.
- React Testing Library: component tests.
- Playwright: end-to-end tests.

Kiểm thử những luồng quan trọng:

- Sign up.
- Login.
- Complete lesson.
- Save progress.
- Practice session.
- Chord diagram rendering.
- Metronome.
- Tuner.
- Skill assessment.

## 3.9. Deployment & Hosting

**Vercel + Supabase Cloud**

Vercel:
- Host Next.js application.
- Preview deployments.
- Production deployments.
- Environment variables.
- Domain configuration.

Supabase Cloud:
- PostgreSQL.
- Authentication.
- Storage.

GitHub:
- Source code.
- Branch management.
- Version control.
- CI/CD integration.

Thiết kế quy trình triển khai:

Local Development → Preview Deployment → Production Deployment.

Tất cả secret phải được lưu trong environment variables.

Không commit `.env`, service role key, database password hoặc API secret vào Git.

---

# PART 4 — SYSTEM ARCHITECTURE

## 4.1. Architecture Strategy

Sử dụng Modular Monolith.

Không xây microservices trong MVP.

Các module phải được tách biệt về logic nhưng vẫn nằm trong một ứng dụng thống nhất.

Cấu trúc tham khảo:

```text
guitar-lab/
│
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   ├── (dashboard)/
│   │   ├── academy/
│   │   ├── practice/
│   │   ├── theory/
│   │   ├── ear-training/
│   │   ├── songs/
│   │   ├── progress/
│   │   └── api/
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── guitar/
│   │   ├── audio/
│   │   ├── learning/
│   │   └── dashboard/
│   │
│   ├── features/
│   │   ├── authentication/
│   │   ├── academy/
│   │   ├── practice/
│   │   ├── music-theory/
│   │   ├── ear-training/
│   │   ├── song-library/
│   │   └── progress/
│   │
│   ├── lib/
│   │   ├── supabase/
│   │   ├── audio/
│   │   ├── validation/
│   │   └── utils/
│   │
│   ├── services/
│   ├── hooks/
│   ├── types/
│   └── config/
│
├── content/
│   ├── levels/
│   ├── lessons/
│   ├── exercises/
│   └── songs/
│
├── supabase/
│   ├── migrations/
│   └── seed.sql
│
├── public/
│   ├── audio/
│   ├── images/
│   └── illustrations/
│
├── tests/
│
├── .env.example
├── README.md
└── package.json
```

Được phép điều chỉnh cấu trúc nếu repository hiện tại có cách tổ chức tốt hơn.

Không tạo quá nhiều folder hoặc abstraction không cần thiết.

## 4.2. Database Entities

Thiết kế hệ thống có các thực thể:

- User.
- UserProfile.
- Level.
- Module.
- Lesson.
- LessonSection.
- Exercise.
- Skill.
- UserSkill.
- LessonProgress.
- Assessment.
- AssessmentResult.
- PracticeSession.
- PracticeActivity.
- Song.
- SongChord.
- SongTab.
- UserSong.
- Milestone.
- AudioAsset.

Trong MVP, chỉ triển khai những bảng thực sự cần thiết cho phase hiện tại.

Không tạo toàn bộ database phức tạp trước khi cần sử dụng.

Nội dung giáo trình phải được thiết kế sao cho có thể mở rộng mà không cần viết lại toàn bộ giao diện.

---

# PART 5 — PRODUCT MODULES

Guitar Lab có 8 module cốt lõi.

## MODULE 1 — GUITAR ACADEMY

Giáo trình guitar từ cơ bản đến nâng cao.

## MODULE 2 — MUSIC THEORY LAB

Nhạc lý được học song song với kỹ thuật guitar.

## MODULE 3 — EAR TRAINING

Luyện tai nghe, nhận diện cao độ, quãng, hợp âm và giai điệu.

## MODULE 4 — VISUAL LEARNING

Sơ đồ hợp âm, cần đàn, tab và hướng dẫn vị trí ngón tay.

## MODULE 5 — DAILY PRACTICE

Hệ thống luyện tập hằng ngày, lịch sử và mục tiêu.

## MODULE 6 — SONG LIBRARY

Thư viện bài hát và bài tập thực hành.

## MODULE 7 — PROGRESS & SKILL ASSESSMENT

Đánh giá năng lực thực tế, không chỉ đếm số bài đã hoàn thành.

## MODULE 8 — PERSONAL LEARNING PATH

Cá nhân hóa nội dung học theo kỹ năng và mục tiêu.

Mỗi module phải có thể phát triển độc lập nhưng sử dụng chung authentication, database và design system.

---

# PART 6 — ZERO TO HERO CURRICULUM

Thiết kế giáo trình gồm Level 0–7.

## Level 0 — Absolute Beginner

- Guitar anatomy.
- Guitar posture.
- Hand positioning.
- Six strings.
- Tuning.
- Tuner usage.
- Open strings.
- Fretboard introduction.
- Seven notes.
- Pitch.
- Duration.
- Basic pulse.

Đầu ra: Người học nhận biết cây đàn, lên dây và gảy được từng dây sạch.

## Level 1 — First Chords

- Em.
- Am.
- E.
- A.
- D.
- Dm.
- C.
- G.
- A7.
- D7.
- E7.
- Finger placement.
- Clean chord sounds.
- Basic chord construction.
- Major vs. minor.

Đầu ra: Bấm hợp âm mở và chuyển đổi giữa những hợp âm cơ bản.

## Level 2 — Basic Rhythm & Strumming

- Downstroke.
- Upstroke.
- Strumming patterns.
- Basic arpeggio.
- 4/4.
- 3/4.
- 6/8.
- Quarter notes.
- Half notes.
- Eighth notes.
- Rests.
- Strong and weak beats.
- Basic capo usage.

Đầu ra: Đệm được bài hát đơn giản từ đầu đến cuối.

## Level 3 — Chord Fluency

- F.
- Bm.
- Barre chords.
- Power chords.
- Sus2.
- Sus4.
- Basic seventh chords.
- Chord transitions.
- Intervals.
- Triads.
- Major scale introduction.
- Basic progressions.

Đầu ra: Chuyển hợp âm ổn định và hiểu cấu tạo hợp âm cơ bản.

## Level 4 — Musical Development

Ba nhánh:

A. Acoustic Rhythm.

B. Fingerstyle Foundation.

C. Lead Guitar.

Nhạc lý:
- Major and minor scales.
- Key signatures.
- Relative major and minor.
- Diatonic chords.
- Chord progressions.
- Roman numeral analysis.

## Level 5 — Advanced Techniques & Musical Understanding

- Advanced fingerstyle.
- Percussive guitar.
- Harmonics.
- Tapping.
- Advanced picking.
- Extended chords.
- Inversions.
- Voicings.
- Modal interchange.
- Secondary dominants.
- Advanced harmony.
- Improvisation.

## Level 6 — Musical Creativity

- Composition.
- Melody creation.
- Chord progression creation.
- Arrangement.
- Fingerstyle arrangement.
- Transcription.
- Improvisation.
- Recording.

## Level 7 — Independent Guitarist

Người học có thể tự học, phân tích, tìm hợp âm, tái tạo giai điệu, sáng tạo và phát triển phong cách cá nhân.

Không khóa cứng người học bằng thời gian.

Việc hoàn thành Level phụ thuộc vào năng lực thực hành.

---

# PART 7 — LEARNING EXPERIENCE

Mỗi bài học phải tuân thủ năm bước:

1. Learn.
2. Visualize & Listen.
3. Practice.
4. Apply.
5. Evaluate.

Mỗi bài học có:

- Learning objectives.
- Prerequisites.
- Explanation.
- Visual demonstration.
- Audio example.
- Practice exercise.
- Common mistakes.
- Assessment criteria.
- Mastery criteria.
- Next lesson.

Ba trạng thái học tập:

- Learning.
- Practicing.
- Mastered.

Không đánh dấu Mastered chỉ vì nhấn Complete.

Trong MVP, phân biệt rõ:
- Completion: Đã hoàn thành nội dung.
- Self-assessment: Người học tự đánh giá.
- Verified assessment: Đã vượt qua kiểm tra thực hành có tiêu chí xác định.

Không tuyên bố rằng hệ thống tự động xác minh kỹ thuật chơi đàn khi chưa có công nghệ tương ứng.

---

# PART 8 — RELEASE STRATEGY: DEPLOY EARLY, EXPAND PROGRESSIVELY

Đây là phần quan trọng nhất của dự án.

Guitar Lab phải được phát triển theo nhiều phiên bản độc lập.

**Mỗi phase phải có khả năng deploy thực tế sau khi hoàn thành.**

Không chờ toàn bộ giáo trình Level 0–7 mới đưa sản phẩm lên Internet.

Không xây nhiều giao diện giả để tạo cảm giác sản phẩm đã hoàn thành.

Không đánh đổi tính hoạt động thực tế để lấy số lượng tính năng.

## PHASE 0 — PROJECT FOUNDATION

### Internal Development & Preview Deployment

Mục tiêu:

Tạo bộ khung kỹ thuật ổn định, chạy được trên local và có thể triển khai lên môi trường Preview.

Chức năng:

1. Khởi tạo Next.js + TypeScript.
2. Cấu hình Tailwind CSS + shadcn/ui.
3. Tích hợp Supabase.
4. Cấu hình authentication foundation.
5. Thiết lập database migrations.
6. Tạo design system.
7. Tạo responsive application shell.
8. Tạo navigation.
9. Thiết lập GitHub repository.
10. Cấu hình Vercel.
11. Cấu hình environment variables.
12. Tạo README và hướng dẫn cài đặt.
13. Thiết lập lint, typecheck, tests và production build.

Các trang tối thiểu:
- Landing page.
- Login.
- Register.
- Dashboard placeholder.
- Academy placeholder.
- Practice placeholder.

Không cần hoàn thành nội dung giáo trình ở phase này.

### Deployment requirements

Phải deploy được Preview URL.

Kiểm tra:
- Application khởi động.
- Các route hoạt động.
- Kết nối Supabase.
- Authentication foundation.
- Environment variables.
- Build thành công.
- Không có secret trong repository.

### Exit Criteria

Phase 0 hoàn thành khi:
- Chạy local thành công.
- Preview deployment thành công.
- Database kết nối thành công.
- Authentication foundation hoạt động.
- Có thể tiếp tục phát triển mà không phải xây lại project foundation.

Đây chưa phải phiên bản ra mắt công khai chính thức.

---

## PHASE 1 — MVP 0.1: FIRST USABLE RELEASE

### Public Launch — The Smallest Useful Guitar Lab

Đây là phiên bản đầu tiên được phép ra mắt công khai.

Mục tiêu:

Một người chưa biết chơi guitar có thể đăng ký, bắt đầu học, thực hành và lưu tiến độ để tiếp tục học vào ngày hôm sau.

Không cần chờ Level 1–3 hoàn chỉnh.

### A. Authentication

Triển khai:
- Register.
- Login.
- Logout.
- Basic user profile.
- Session persistence.
- Protected routes.

Có thể bắt đầu bằng email/password hoặc email OTP.

Không xây hệ thống phân quyền phức tạp khi chưa cần.

### B. Onboarding

Sau đăng ký, người dùng thiết lập:

- Experience: Complete beginner.
- Guitar type: Acoustic / Electric.
- Practice goal: Default 30 minutes.
- Learning target: Learn guitar from zero.

Không làm onboarding quá dài.

### C. Learning Dashboard

Dashboard phải hiển thị:

- Welcome message.
- Current learning level.
- Today's lesson.
- Daily practice routine.
- Learning progress.
- Continue learning.
- Recently completed lesson.

Dữ liệu phải được lấy từ database thực tế.

### D. Academy — Level 0

Hoàn thành một syllabus Level 0 có nội dung thực tế:

1. Introduction to Guitar.
2. Guitar Anatomy.
3. Correct Guitar Posture.
4. Left-hand and Right-hand Position.
5. Understanding the Six Strings.
6. Standard Guitar Tuning.
7. Using a Guitar Tuner.
8. Open Strings.
9. Basic Fretboard Introduction.
10. Understanding Musical Notes.
11. Pitch and Basic Rhythm.
12. Creating Clean Sounds.

Mỗi bài có:
- Explanation.
- Diagram.
- Practice instruction.
- Completion checklist.
- Learning status.

### E. Academy — First Chords

Không cần hoàn thành toàn bộ Level 1 ở phase này.

Triển khai nhóm hợp âm đầu tiên:
- Em.
- Am.
- E.
- A.
- D.

Mỗi hợp âm có sơ đồ ngón tay chính xác, âm thanh mẫu và bài tập.

### F. Chord Visualization

Phải hoàn thành một Chord Diagram component có khả năng tái sử dụng.

Hiển thị:
- 6 strings.
- Frets.
- Finger positions.
- Finger numbers.
- Open strings.
- Muted strings.
- Chord name.

Sơ đồ phải hoạt động chính xác trên desktop và mobile.

### G. Daily Practice Engine

Xây dựng hệ thống luyện tập 30 phút.

Ở MVP 0.1 có thể dùng:

| Activity | Duration |
|---|---:|
| Recall | 4 phút |
| Music Theory | 5 phút |
| Technical Practice | 8 phút |
| Musical Application | 8 phút |
| Free Play | 3 phút |
| Reflection | 2 phút |

Người học có thể:
- Mở buổi luyện tập.
- Xem hoạt động cần thực hiện.
- Đánh dấu hoàn thành.
- Theo dõi thời lượng.
- Ghi chú cuối buổi.
- Lưu buổi tập.

Không cần tự động đánh giá âm thanh trong phase này.

### H. Essential Guitar Tools

Phải triển khai hai công cụ cơ bản:

**Metronome**
- Start/Stop.
- BPM adjustment.
- Beat indication.
- Audible clicks.
- Stable timing.

**Guitar Tuner**
- Microphone permission.
- Real-time pitch detection.
- Note recognition.
- Cent deviation.
- Standard tuning E A D G B E.
- Error handling when microphone is unavailable.

Không sử dụng một hình ảnh tuner tĩnh để giả lập công cụ thật.

### I. Basic Progress Tracking

Lưu và hiển thị:
- Completed lessons.
- Current learning status.
- Practice sessions.
- Total practice duration.
- Basic milestones.

Phải lưu được khi người dùng reload hoặc đăng nhập lại.

### J. Audio Demonstrations

Có thể sử dụng:
- Tone.js-generated sounds.
- Original audio recordings.
- Licensed audio assets.

Không sử dụng video giảng dạy.

### K. Phase 1 — Explicitly Out of Scope

Không triển khai bắt buộc:
- AI audio analysis.
- Advanced Ear Training.
- Advanced Music Theory.
- Full Level 1–3.
- Fingerstyle and Lead Guitar tracks.
- Advanced Song Library.
- Complex social features.
- Community forums.
- Payment systems.
- Subscription systems.
- Admin CMS phức tạp.
- Microservices.

Nếu một tính năng không cần thiết để hoàn thành trải nghiệm học cơ bản, hãy đưa nó sang phase tiếp theo.

### Phase 1 — Acceptance Criteria

Chỉ được công nhận hoàn thành nếu:

1. Người mới có thể đăng ký tài khoản.
2. Người học có thể đăng nhập và đăng xuất.
3. Người học truy cập được Level 0.
4. Nội dung bài học hiển thị đầy đủ.
5. Chord diagrams hiển thị đúng.
6. Metronome phát âm thanh thực tế.
7. Tuner có khả năng nhận diện cao độ thực tế trên trình duyệt được hỗ trợ.
8. Người học có thể thực hành và đánh dấu hoàn thành.
9. Buổi tập được lưu vào database.
10. Tiến độ tồn tại sau khi tải lại trang.
11. Dashboard phản ánh dữ liệu thực tế.
12. Giao diện sử dụng được trên điện thoại.
13. Không có chức năng quan trọng chỉ là UI giả.
14. Không có lỗi nghiêm trọng về authentication hoặc quyền truy cập dữ liệu.

### Public Deployment

Sau khi đạt acceptance criteria:

- Chạy lint.
- Chạy typecheck.
- Chạy tests.
- Chạy production build.
- Kiểm tra migrations.
- Kiểm tra RLS.
- Deploy Preview.
- Smoke test trên Preview.
- Deploy Production.
- Kiểm tra website bằng production URL.

**Đây là cột mốc Guitar Lab chính thức có người dùng thực tế đầu tiên.**

---

## PHASE 2 — MVP 0.2: CORE LEARNING EXPERIENCE

### Expand the Beginner Learning Journey

Mục tiêu:

Biến phiên bản đầu tiên thành một hệ thống học guitar có tính liên tục, không chỉ giới hạn ở những bài học nhập môn.

### A. Complete Level 1

Bổ sung:
- Dm.
- C.
- G.
- A7.
- D7.
- E7.
- Chord construction.
- Major and minor.
- Clean chord practice.
- Chord transition exercises.

### B. Level 2 — Rhythm & Strumming

Bổ sung:
- Downstroke.
- Upstroke.
- 4/4.
- 3/4.
- 6/8.
- Strumming patterns.
- Basic arpeggio.
- Note durations.
- Rests.
- Strong and weak beats.
- Capo introduction.

### C. Ear Training — Beginner

Bài tập:
- High vs. low.
- Pitch matching.
- Simple rhythmic recognition.
- Basic major vs. minor identification.

Các bài tập phải phát âm thanh thực tế.

### D. Basic Song Library

Bổ sung một thư viện nhỏ nhưng có chất lượng:

- Original practice songs.
- Public-domain material.
- Properly licensed songs.
- Chord progressions.
- Beginner arrangements.

Mỗi bài hát có:
- Difficulty.
- Key.
- BPM.
- Time signature.
- Chords.
- Learning objectives.
- Related lessons.

Không sao chép trái phép tab, lời bài hát hoặc bản ghi.

### E. Practice Improvement

- Daily practice history.
- Weekly practice summary.
- Basic learning reminders inside the app.
- Review previous lessons.
- Weak skill identification.
- Basic spaced repetition.

### Phase 2 — Acceptance Criteria

Người học phải:
- Hoàn thành được Level 1.
- Hiểu và thực hiện strumming cơ bản.
- Giữ nhịp thông qua metronome.
- Chơi được các vòng hợp âm đơn giản.
- Thực hiện được những bài tập Ear Training nhập môn.
- Chọn và luyện một bài hát trong thư viện.
- Xem được lịch sử luyện tập.

Sau khi kiểm thử, deploy thành phiên bản MVP 0.2.

---

## PHASE 3 — MVP 1.0: BEGINNER CURRICULUM COMPLETE

### Complete Level 0–3

Đây là phiên bản Guitar Lab hoàn thiện nền tảng giáo dục dành cho người mới.

Mục tiêu:

Người học có thể phát triển từ người chưa biết guitar thành người có khả năng đệm những bài hát cơ bản và hiểu các thành phần âm nhạc nền tảng.

### A. Complete Level 3

Bổ sung:
- F.
- Bm.
- Barre chords.
- Power chords.
- Sus2.
- Sus4.
- Basic seventh chords.
- Intervals.
- Triads.
- Major scale introduction.
- Advanced chord transition.
- Basic chord progressions.

### B. Complete Music Theory Foundation

- Musical notes.
- Pitch.
- Duration.
- Rhythm.
- Intervals.
- Whole and half steps.
- Triads.
- Major scale.
- Major and minor.
- Basic harmony.
- Chord progressions.
- Relative major and minor.

### C. Complete Beginner Ear Training

- Interval recognition.
- Chord quality recognition.
- Rhythm recognition.
- Melody reproduction.
- Basic musical dictation.

### D. Skill Assessment Engine

Đánh giá:

- Chord Mastery.
- Chord Transition.
- Rhythm & Timing.
- Finger Coordination.
- Music Theory.
- Ear Training.
- Song Performance.

Mỗi kỹ năng cần:
- Skill description.
- Difficulty.
- Assessment criteria.
- Current level.
- Practice history.
- Mastery status.

Phân biệt rõ kết quả tự đánh giá và kết quả được kiểm tra khách quan.

### E. Learning Path

- Current level.
- Completed lessons.
- Mastered skills.
- Weaknesses.
- Recommended lessons.
- Recommended practice exercises.

### F. Song Library Expansion

Mở rộng thư viện theo:
- Beginner.
- Intermediate.
- Acoustic Rhythm.
- Fingerstyle.
- Lead.
- Pop.
- Ballad.
- Rock.
- Folk.

Chỉ đưa nội dung có quyền sử dụng hợp pháp vào hệ thống.

### G. Audio Recording

Triển khai:
- Record a practice session.
- Save recording.
- Playback.
- Recording history.
- Compare recordings.
- User-controlled deletion.

Làm rõ giới hạn lưu trữ và bảo vệ dữ liệu âm thanh.

### Phase 3 — Acceptance Criteria

Người học có thể:
- Hoàn thành Level 0–3.
- Chơi bài hát đơn giản.
- Chuyển hợp âm ổn định.
- Giữ nhịp cơ bản.
- Hiểu nhạc lý nền tảng.
- Vượt qua các bài đánh giá năng lực.
- Xem tiến bộ theo thời gian.
- Ghi âm và nghe lại quá trình luyện tập.
- Nhận đề xuất bài luyện phù hợp.

**MVP 1.0 được xem là phiên bản hoàn thành hệ thống giáo dục guitar cho người mới.**

---

## PHASE 4 — GROWTH 1.5: MUSICAL DEVELOPMENT

### From Beginner to Developing Guitarist

Mục tiêu: Mở rộng khả năng âm nhạc và phát triển các hướng chơi guitar chuyên sâu.

### Track A — Acoustic Rhythm

- Advanced strumming.
- Dynamics.
- Advanced arpeggio.
- Accompaniment styles.
- Chord substitutions.
- Playing in different keys.

### Track B — Fingerstyle

- Fingerpicking.
- Thumb independence.
- Alternating bass.
- Pinch.
- Melody and bass.
- Fingerstyle arrangements.
- Percussive guitar.

### Track C — Lead Guitar

- Major scale.
- Natural minor scale.
- Pentatonic.
- Picking.
- Hammer-on.
- Pull-off.
- Slide.
- Bend.
- Vibrato.
- Riffs.
- Soloing.

### Advanced Theory

- Diatonic harmony.
- Seventh chords.
- Extended chords.
- Chord inversions.
- Voicings.
- Modal interchange.
- Secondary dominants.
- Advanced harmony.
- Arrangement.

### Advanced Learning Features

- Detailed performance assessment.
- More advanced ear training.
- Song arrangement workspace.
- Advanced fretboard visualization.
- Personal learning goals.
- Advanced practice recommendations.

### Phase 4 — Acceptance Criteria

Người học có thể lựa chọn track, theo dõi năng lực riêng và học các kỹ năng nâng cao mà không làm ảnh hưởng tới hệ thống Level 0–3 đã phát hành.

Deploy các tính năng mới theo từng module, không yêu cầu phát hành tất cả cùng lúc.

---

## PHASE 5 — INTELLIGENT GUITAR LAB 2.0

### AI-assisted Musical Learning

Mục tiêu: Biến Guitar Lab thành hệ thống hỗ trợ học tập cá nhân hóa dựa trên dữ liệu thực hành.

### AI Audio Analysis

Nghiên cứu và triển khai:
- Pitch detection.
- Rhythm deviation.
- Note accuracy.
- Melody transcription.
- Chord recognition.
- Practice performance analysis.

### Personalized Feedback

Ví dụ:

Người học liên tục chuyển từ Am sang C không ổn định.

Guitar Lab có thể:
- Phát hiện kết quả luyện tập không tốt.
- Xác định kỹ năng cần cải thiện.
- Đề xuất bài tập chuyển Am → C.
- Điều chỉnh mục tiêu luyện tập.
- Theo dõi sự cải thiện.

### AI Learning Assistant

Có thể hỗ trợ:
- Giải thích nhạc lý.
- Phân tích hợp âm.
- Gợi ý bài tập.
- Phân tích bài hát.
- Đưa ra gợi ý phối khí.
- Hỗ trợ sáng tác.

AI phải dựa trên dữ liệu và giới hạn rõ ràng.

Không được tuyên bố có thể phát hiện tư thế, vị trí ngón tay hoặc lực bấm chỉ từ microphone.

Nếu muốn phân tích các yếu tố này, phải nghiên cứu thêm computer vision hoặc thiết bị cảm biến phù hợp.

---

# PART 9 — DEPLOYMENT & RELEASE ENGINEERING

## 9.1. Deployment Philosophy

Mỗi phase sau khi đạt tiêu chí hoàn thành phải có khả năng phát hành riêng.

Không gom toàn bộ tính năng đến cuối mới deploy.

Mỗi release phải:
- Chạy được độc lập.
- Có database tương ứng.
- Có dữ liệu cần thiết.
- Có kiểm thử.
- Không phá vỡ chức năng cũ.

## 9.2. Environments

Sử dụng ba môi trường:

### Development

- Local development.
- Local `.env.local`.
- Development Supabase project hoặc database riêng.
- Test data.

### Preview

- Vercel Preview Deployment.
- Kiểm thử tính năng mới.
- Sử dụng dữ liệu và Supabase non-production.
- Không sử dụng dữ liệu người dùng thật để thử nghiệm.

### Production

- Production domain.
- Production Supabase project.
- Production secrets.
- Production database.
- User data thật.

Ưu tiên tách biệt Supabase Development và Production. Không chạy thử migration phá hủy trên database Production.

## 9.3. Environment Variables

Tạo `.env.example`.

Ví dụ:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=

SUPABASE_SECRET_KEY=

NEXT_PUBLIC_APP_URL=
```

Tên biến phải phù hợp với package và cấu hình Supabase thực tế đang sử dụng.

Không đưa secret key vào biến `NEXT_PUBLIC_`.

Không commit file `.env.local`.

## 9.4. Git Workflow

Sử dụng:

- `main`: production-ready.
- `develop`: tích hợp tính năng.
- `feature/*`: phát triển chức năng.
- `fix/*`: sửa lỗi.

Có thể điều chỉnh khi dự án nhỏ, nhưng không được để code chưa kiểm thử tự động đi thẳng vào Production.

## 9.5. Database Migration

Mọi thay đổi database phải có migration được lưu trong repository.

Trước khi deploy:

1. Kiểm tra migration.
2. Kiểm tra schema compatibility.
3. Backup dữ liệu quan trọng.
4. Chạy migration trong môi trường phù hợp.
5. Seed data nếu cần.
6. Kiểm tra RLS.
7. Xác minh application hoạt động.

Ưu tiên migration theo kiểu backward-compatible.

Không xóa cột hoặc đổi cấu trúc phá vỡ ứng dụng cũ trong cùng một bước deploy nếu chưa có chiến lược chuyển đổi dữ liệu.

## 9.6. Release Checklist

Trước mỗi Production Release:

- [ ] Lint passes.
- [ ] Typecheck passes.
- [ ] Unit tests pass.
- [ ] Critical integration tests pass.
- [ ] Production build passes.
- [ ] Environment variables verified.
- [ ] Database migrations verified.
- [ ] RLS policies verified.
- [ ] Authentication checked.
- [ ] Responsive layout checked.
- [ ] Critical user flows checked.
- [ ] No placeholder buttons for advertised functions.
- [ ] No exposed secrets.
- [ ] Preview deployment smoke-tested.
- [ ] Rollback plan documented.

## 9.7. Release and Rollback

Sau khi Preview đạt yêu cầu:

1. Deploy Production.
2. Verify production URL.
3. Test sign in and sign up.
4. Test lesson completion.
5. Test database persistence.
6. Test essential audio features.
7. Check logs and errors.

Nếu phát sinh lỗi nghiêm trọng:
- Revert application deployment khi phù hợp.
- Không tự ý thực hiện database rollback phá hủy dữ liệu.
- Reconcile migration và dữ liệu trước khi deploy lại.
- Ưu tiên khôi phục dịch vụ và bảo toàn dữ liệu người dùng.

---

# PART 10 — DESIGN SYSTEM & USER EXPERIENCE

Guitar Lab cần có phong cách:

- Modern.
- Minimal.
- Professional.
- Creative.
- Educational.
- Friendly.

Không thiết kế giống website blog hoặc landing page bán khóa học.

### Core Navigation

- Dashboard.
- Academy.
- Practice Studio.
- Music Theory.
- Ear Training.
- Song Library.
- My Progress.
- Profile.

### Important Screens

**Dashboard**
- Today's practice.
- Current level.
- Continue learning.
- Skill overview.
- Learning goals.

**Academy**
- Roadmap.
- Levels.
- Modules.
- Lessons.
- Mastery requirements.

**Lesson Detail**
- Explanation.
- Diagram.
- Audio example.
- Practice.
- Assessment.

**Practice Studio**
- Daily routine.
- Timer.
- Metronome.
- Tuner.
- Exercise checklist.

**Music Theory**
- Topic navigation.
- Interactive fretboard.
- Musical examples.
- Audio playback.

**My Progress**
- Skill map.
- Practice journal.
- Milestones.
- Recording history.
- Improvement history.

Tối ưu desktop và mobile.

Các thành phần guitar phải dễ thao tác bằng màn hình cảm ứng.

---

# PART 11 — CONTENT QUALITY & COPYRIGHT

Giáo trình phải chính xác về lý thuyết và kỹ thuật guitar.

Mỗi bài học phải có:

1. Title.
2. Learning objectives.
3. Prerequisites.
4. Explanation.
5. Guitar technique.
6. Visual requirements.
7. Audio requirements.
8. Practice exercises.
9. Common mistakes.
10. Assessment criteria.
11. Mastery criteria.
12. Related lessons.

Không tạo nội dung sơ sài hoặc lặp lại chỉ nhằm làm đầy giao diện.

Không sao chép trái phép:
- Sheet music.
- Guitar tabs.
- Lyrics.
- Commercial audio recordings.
- Images.

Ưu tiên nội dung tự biên soạn, tự tạo, thuộc phạm vi công cộng hoặc có giấy phép sử dụng phù hợp.

---

# PART 12 — DEVELOPMENT WORKFLOW

Bạn phải thực hiện theo trình tự.

## STEP 1 — INSPECT

Nếu repository tồn tại:
- Đọc cấu trúc dự án.
- Kiểm tra dependencies.
- Kiểm tra database.
- Kiểm tra các tính năng.
- Kiểm tra trạng thái Git.
- Không xóa hoặc thay thế code đang hoạt động một cách tùy tiện.

Nếu chưa có repository:
- Khởi tạo project theo technology stack đã quy định.

## STEP 2 — PLAN

Tạo:
- PRD.
- Architecture document.
- Database schema.
- Sitemap.
- User journeys.
- Syllabus Level 0–3.
- Phase roadmap.
- Deployment checklist.

## STEP 3 — IMPLEMENT PHASE 0

Hoàn thành project foundation và Preview Deployment.

## STEP 4 — IMPLEMENT PHASE 1

Ưu tiên MVP 0.1 có thể sử dụng thực tế.

Không làm thêm những tính năng ngoài phạm vi nếu chúng có thể trì hoãn public launch.

## STEP 5 — TEST & DEPLOY

Kiểm tra đầy đủ acceptance criteria.

Sau đó triển khai lên Production nếu môi trường và credentials cần thiết đã sẵn sàng.

Không tuyên bố đã deploy nếu chưa thực sự có production URL và xác nhận deployment thành công.

## STEP 6 — CONTINUE ITERATIVELY

Sau khi Phase 1 hoạt động:
- Đánh giá lỗi.
- Ưu tiên sửa lỗi.
- Phát triển Phase 2.
- Kiểm thử tương thích.
- Deploy phiên bản mới.

Tiếp tục đến Phase 5.

---

# PART 13 — AI CODING AGENT BEHAVIOR

Các quy định khi làm việc:

1. Không chỉ viết kế hoạch rồi dừng lại.
2. Không tạo mọi tính năng dưới dạng placeholder.
3. Không tự ý thay đổi tech stack đã thống nhất.
4. Không viết tất cả tính năng trong một file.
5. Không hardcode dữ liệu người dùng vào giao diện.
6. Không hardcode tiến độ giả.
7. Không tự động đánh dấu kỹ năng Mastered khi chưa đủ bằng chứng.
8. Không xây AI trước khi core learning system hoạt động.
9. Không trì hoãn deploy chỉ vì những tính năng ở phase sau chưa hoàn thành.
10. Không sửa các chức năng cũ làm hỏng trải nghiệm đã phát hành.
11. Ưu tiên code dễ bảo trì, test và mở rộng.
12. Cập nhật README và documentation khi thay đổi kiến trúc.
13. Nếu thiếu thông tin không thiết yếu, hãy sử dụng giả định hợp lý và ghi lại, không dừng tiến trình để hỏi liên tục.
14. Nếu thiếu credentials hoặc quyền truy cập bên ngoài, hoàn thành phần có thể thực hiện, ghi rõ thao tác người dùng cần cung cấp và không giả vờ rằng đã kết nối hoặc deploy.
15. Mỗi phase phải có tiêu chí hoàn thành cụ thể.

---

# PART 14 — INITIAL EXECUTION INSTRUCTIONS

Khi nhận được prompt này, hãy bắt đầu bằng các nhiệm vụ sau:

### TASK 1 — ANALYZE THE PROJECT

Kiểm tra repository hiện tại hoặc xác định đây là dự án mới.

Báo cáo:
- Current project status.
- Technology stack.
- Existing implementation.
- Technical risks.
- Recommended architecture.

### TASK 2 — CREATE THE DEVELOPMENT ROADMAP

Tạo roadmap:

- Phase 0: Foundation.
- Phase 1: MVP 0.1.
- Phase 2: MVP 0.2.
- Phase 3: MVP 1.0.
- Phase 4: Growth 1.5.
- Phase 5: Intelligent Guitar Lab 2.0.

Từng phase phải có:
- Features.
- Dependencies.
- Scope.
- Acceptance criteria.
- Deployment criteria.

### TASK 3 — BUILD THE FOUNDATION

Bắt đầu triển khai Phase 0.

Không chỉ mô tả kiến trúc. Hãy tạo các file, cấu hình, database migration và thành phần thực sự cần thiết.

### TASK 4 — BUILD THE FIRST USABLE PRODUCT

Sau khi foundation hoạt động, tiếp tục triển khai Phase 1.

Không chờ toàn bộ Level 0–3 hoàn tất mới ra mắt.

### TASK 5 — DEPLOY

Khi Phase 1 vượt qua acceptance criteria, hướng tới Production Deployment.

Bàn giao:
- Production URL nếu deploy thành công.
- Preview URL.
- Database setup.
- Environment configuration.
- README.
- Test results.
- Known limitations.
- Next phase roadmap.

---

# FINAL PRODUCT PRINCIPLE

Guitar Lab không được đo lường bằng số lượng trang, số lượng component hoặc số lượng tính năng.

Một phiên bản nhỏ nhưng cho phép người học thực sự học, luyện tập, lưu tiến độ và quay lại ngày hôm sau có giá trị hơn một nền tảng lớn với hàng loạt chức năng chưa hoàn thiện.

**Ship early. Learn from real users. Improve continuously.**

The first release must be small, but genuinely useful.

The final destination is not merely a guitar learning website.

It is a complete musical learning ecosystem that helps people become independent guitarists.

**BUILD GUITAR LAB. ONE WORKING RELEASE AT A TIME.**