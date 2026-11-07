# DEPLOY GUITAR LAB — từng bước

Kiến trúc: **Vercel** (Next.js) + **Supabase Cloud** (Postgres + Auth). Code lấy từ GitHub `mingbugsman/guitar_lab`.

| Môi trường | Nhánh Git | Supabase project |
|---|---|---|
| Preview | mọi nhánh khác `main` | `guitar-lab-dev` |
| Production | `main` | `guitar-lab-prod` |

> Gói Free của Supabase cho 2 project — vừa đủ. Nếu muốn nhanh, có thể bắt đầu chỉ với `guitar-lab-prod` rồi bổ sung `dev` sau, nhưng khi đó **đừng thử nghiệm trên Preview bằng dữ liệu thật**.

---

## Bước 1 — Tạo Supabase project

Làm 2 lần: một lần cho `guitar-lab-prod`, một lần cho `guitar-lab-dev`.

1. Vào https://supabase.com/dashboard → **New project**.
2. Name: `guitar-lab-prod` · Database Password: bấm **Generate**, **lưu lại vào trình quản lý mật khẩu**. Bạn cần mật khẩu này ở Bước 2.
3. Region: **Southeast Asia (Singapore)** (gần Việt Nam nhất) → **Create new project**, đợi khoảng 2 phút.
4. Ghi lại 3 giá trị:
   - **Project ref**: chuỗi trong URL dashboard `supabase.com/dashboard/project/<project-ref>`.
   - **Project URL**: Project Settings → **Data API** (hoặc nút **Connect**) → `https://<project-ref>.supabase.co`.
   - **Publishable key**: Project Settings → **API Keys** → `sb_publishable_...`. Nếu project chỉ có key kiểu cũ thì dùng **anon public** key.
   - ⚠️ **Không** dùng `secret` / `service_role` key. App không cần key đó.

## Bước 2 — Đưa schema (migrations) lên Supabase

Chạy trong thư mục dự án. Trong Claude Code có thể gõ `! <lệnh>` để chạy trực tiếp.

```bash
npx supabase login                                # mở trình duyệt để đăng nhập (một lần duy nhất)
npx supabase link --project-ref <ref-của-dev>     # hỏi Database Password ở Bước 1
npx supabase db push                              # áp dụng supabase/migrations/*.sql
```

Kiểm tra: Dashboard → **Table Editor** phải có 5 bảng `profiles`, `lesson_progress`, `practice_sessions`, `practice_activities`, `user_milestones`, bảng nào cũng có nhãn RLS enabled.

Làm lại với project prod:

```bash
npx supabase link --project-ref <ref-của-prod>
npx supabase db push
```

> Mỗi lần có migration mới (các phase sau): push lên **dev trước**, kiểm tra xong mới push lên **prod**.

## Bước 3 — Cấu hình Auth trên Supabase

Làm cho cả 2 project.

### 3.1 URL Configuration
Authentication → **URL Configuration**:
- **Site URL**:
  - prod: `https://<domain-production>` (ở Bước 4 Vercel sẽ cấp, dạng `https://guitar-lab-xxx.vercel.app`; có thể quay lại sửa sau)
  - dev: cũng đặt URL production
- **Redirect URLs** → Add URL:
  - prod: `https://<domain-production>/**`
  - dev: `https://*-<vercel-team-slug>.vercel.app/**` (khớp mọi Preview URL) và `http://localhost:3000/**`

### 3.2 Email xác nhận
Authentication → **Sign In / Providers** → Email: mục **Confirm email** mặc định đang BẬT.

Nếu giữ bật (khuyến nghị cho prod), sửa email mẫu để link hoạt động cả khi người dùng mở ở trình duyệt khác:
Authentication → **Emails** → Templates → **Confirm signup** → thay link bằng:

```html
<a href="{{ .SiteURL }}/auth/confirm?token_hash={{ .TokenHash }}&type=email&next=/onboarding">Xác nhận email</a>
```

⚠️ Dịch vụ email mặc định của Supabase chỉ gửi vài email mỗi giờ, chỉ hợp để thử nghiệm. Trước khi ra mắt thật, chọn **một** trong hai cách:
- Cài SMTP riêng (Resend, Brevo, SendGrid…) ở Project Settings → Authentication → **SMTP Settings**; hoặc
- Tạm **tắt Confirm email** (app vẫn chạy: đăng ký xong vào thẳng onboarding).

Với project **dev**, có thể tắt Confirm email cho tiện test.

## Bước 4 — Tạo project trên Vercel

1. Vào https://vercel.com → đăng nhập bằng GitHub → **Add New… → Project**.
2. **Import** repo `mingbugsman/guitar_lab`. Nếu không thấy repo, bấm "Adjust GitHub App Permissions" và cấp quyền cho repo.
3. Framework Preset: **Next.js** (tự nhận). Build/Output: giữ mặc định. Root Directory: `./`.
4. Mở **Environment Variables** và thêm các biến cho môi trường **Production** (giá trị của project **prod**):

   | Key | Value |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | `https://<ref-prod>.supabase.co` |
   | `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | `sb_publishable_...` (prod) |
   | `NEXT_PUBLIC_APP_URL` | `https://<domain-production>` (biết sau lần deploy đầu, xem bước 6) |

5. Bấm **Deploy** và đợi khoảng 2 phút. Bạn sẽ nhận được domain dạng `guitar-lab-xxxx.vercel.app`.
6. Vào **Settings → Environment Variables**:
   - Sửa `NEXT_PUBLIC_APP_URL` thành domain production vừa có.
   - Thêm 2 biến cho môi trường **Preview** (chỉ tick Preview), dùng giá trị của project **dev**: `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`.
   - **Không** đặt `NEXT_PUBLIC_APP_URL` cho Preview: app tự lấy URL từ request, vì mỗi Preview có URL riêng.
7. Settings → **Git** → Production Branch: `main`.
8. Quay lại Supabase Bước 3.1: điền đúng Site URL và Redirect URLs bằng domain thật.
9. Vào **Deployments** → deployment mới nhất → **⋯ → Redeploy**. Biến `NEXT_PUBLIC_*` được nhúng lúc build nên phải build lại mới có hiệu lực.

> ⚠️ Biến `NEXT_PUBLIC_*` được gói vào code chạy trên trình duyệt. Chỉ đặt URL và publishable key ở đây, **không bao giờ đặt secret key**.

## Bước 5 — Deploy Preview và smoke test

```bash
git checkout develop
git push origin develop          # Vercel tự build Preview cho nhánh develop
```

Vercel → Deployments → mở Preview URL rồi kiểm tra bằng tay:

- [ ] Trang chủ hiện, hình hợp âm Am hiển thị đúng
- [ ] `/guitar`: đổi được "Nhìn xuống / Kiểu Tab / tay trái"
- [ ] Đăng ký tài khoản mới → (xác nhận email nếu bật) → onboarding → dashboard
- [ ] Mở bài 1, tick đủ checklist → Hoàn thành → tải lại trang vẫn giữ trạng thái
- [ ] Practice: bắt đầu buổi tập, chạy timer, lưu → Dashboard và Tiến độ cập nhật
- [ ] `/tools`: Metronome có tiếng; Tuner xin quyền micro và nhận nốt khi gảy đàn thật (HTTPS nên micro hoạt động)
- [ ] Đăng xuất → vào `/dashboard` bị chuyển về `/login`
- [ ] Thử trên điện thoại

Chạy E2E tự động lên Preview (tùy chọn). Cần trỏ test tới Supabase **dev**:

```bash
PLAYWRIGHT_BASE_URL=https://<preview-url> \
NEXT_PUBLIC_SUPABASE_URL=https://<ref-dev>.supabase.co \
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<key-dev> \
npx playwright test
```

> Test E2E đăng ký user `@example.com`. Nếu project dev **bật** Confirm email, test sẽ dừng ở bước xác nhận, vì vậy hãy tắt Confirm email cho dev.
> Nếu Preview bật **Vercel Deployment Protection**, cần đăng nhập Vercel trong trình duyệt khi xem; còn để chạy E2E thì tắt tạm ở Settings → Deployment Protection, hoặc dùng bypass token.

## Bước 6 — Deploy Production

Khi Preview đạt hết checklist:

```bash
git checkout main
git merge --ff-only develop
git push origin main             # Vercel build Production
```

Kiểm tra trên domain production:

- [ ] Đăng ký / đăng nhập
- [ ] Hoàn thành 1 bài → reload vẫn giữ
- [ ] Lưu 1 buổi tập
- [ ] Metronome + Tuner
- [ ] Vercel → project → **Logs**: không có lỗi 500
- [ ] Supabase prod → Table Editor: có dữ liệu của user test (có thể xóa ở Authentication → Users)

Sau đó cập nhật `docx/CHECKLIST.md`: đánh dấu mục 🔑 deploy là xong và ghi lại URL.

## Rollback khi có sự cố

- **Lỗi ứng dụng**: Vercel → Deployments → chọn bản trước đó đang tốt → **⋯ → Promote to Production** (hoặc Instant Rollback). Không cần build lại.
- **Database**: **không** tự ý xóa bảng/cột trên prod. Viết migration mới để sửa, áp dụng trên dev trước rồi mới lên prod. Gói Free không có Point-in-Time Recovery; trước các migration lớn, hãy xuất bản sao lưu bằng `npx supabase db dump -f backup.sql --linked`.

## Tên miền riêng (tùy chọn)

Vercel → Settings → **Domains** → Add `guitarlab.vn` (ví dụ) → làm theo hướng dẫn DNS. Sau đó cập nhật `NEXT_PUBLIC_APP_URL`, Supabase Site URL và Redirect URLs, rồi Redeploy.
