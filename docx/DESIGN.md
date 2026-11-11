# DESIGN — Hướng giao diện Guitar Lab

> Quy ước cho mọi màn hình mới. Đi cùng [GUITAR_VISUAL.md](GUITAR_VISUAL.md) (hướng đàn) và [WRITING_GUIDE.md](WRITING_GUIDE.md) (lời văn).
> Lý do có file này: bản giao diện đầu (11/2026) bị công cụ `ui_lint` chấm 8/10 điểm "trông như AI làm" — 33 khối bo góc lớn, lưới thẻ lặp lại, emoji làm biểu tượng.

## 1. Bối cảnh

- **Sản phẩm:** web học guitar cho người mới, do một người làm.
- **Người dùng:** đang ôm đàn acoustic, hai tay bận, nhìn qua lại giữa màn hình và cần đàn. Phần lớn dùng điện thoại đặt trước mặt.
- **Việc chính:** làm theo một bước trên đàn thật, rồi sang bước kế.
- **Mật độ thông tin:** thấp. Mỗi màn hình một việc.

## 2. Hướng: "Sổ tập đàn"

Giống một cuốn sổ tập đặt trên giá nhạc: **giấy, mực, và một cây đàn**. Cây đàn là vật duy nhất có màu gỗ và có khung nổi. Mọi thứ khác là chữ trên giấy, chia bằng đường kẻ mảnh.

Không phải: bảng điều khiển SaaS, lưới thẻ bo tròn, trang bán khóa học.

## 3. Token

| Nhóm | Giá trị | Quy tắc |
|---|---|---|
| Nền giấy | `--background` oklch(0.975 0.01 85) | Nền của mọi trang. Không dùng thẻ trắng nổi trên nền. |
| Mực | `--foreground` oklch(0.2 0.02 50) | Chữ chính. Chữ phụ: `--muted-foreground`. |
| Đường kẻ | `--border` mực 14% | Chia phần bằng đường kẻ 1px, không bằng hộp. |
| Cam "ngón tay" | `--primary` oklch(0.56 0.15 45) | **Chỉ** dùng cho: chấm ngón tay trên hình, và một nút hành động chính mỗi màn hình. Không dùng cho nhãn, biểu tượng, trang trí. |
| Xanh "chuẩn" | `--gl-highlight` | Chỉ dùng cho trạng thái đúng / đã xong / lên dây chuẩn. |
| Đỏ | `--destructive` | Chỉ dùng cho lỗi và dấu X (dây không gảy). |
| Gỗ | `--gl-wood-*` | Chỉ có trên hình cây đàn. |

**Chữ**
- Giao diện và nội dung: **Be Vietnam Pro** — chọn vì hiển thị dấu tiếng Việt tốt, không phải vì mặc định.
- Số liệu (đồng hồ, BPM, số phím, số dây, tiến độ): **JetBrains Mono**, `tabular-nums`. Số luôn khác chữ để liếc là thấy.
- Tiêu đề trang: 28–36px, đậm 700, dãn chữ âm nhẹ. Nhãn mục nhỏ: 12px, chữ thường, màu phụ — không in hoa cam.

**Góc bo theo vai trò** (`--radius` = 8px)
- 4px: ô nhập, nhãn trạng thái.
- 8px: nút, khung ghi chú.
- 12px: **khung nhạc cụ** (`.gl-stage`) — hình đàn, Tuner, Metronome. Là khung nổi duy nhất.
- Không dùng `rounded-2xl`, `rounded-3xl`. Bo tròn hẳn chỉ cho chấm ngón tay và đèn phách.

**Độ nổi:** không đổ bóng. Không kính mờ.

**Biểu tượng:** lucide, nét 1.5–2. Không emoji trong giao diện.

**Chuyển động — chỉ khi báo trạng thái:** dây rung khi chạm, đèn phách metronome, kim Tuner, đổi bước bài học. Không hiệu ứng khi rê chuột, không hiện dần khi cuộn. Luôn tôn trọng `prefers-reduced-motion`.

## 4. Bố cục theo màn hình

| Màn hình | Kiểu bố cục | Mô tả |
|---|---|---|
| Bài học | Một vật lớn + từng bước | Thanh 4 chặng **Hiểu · Luyện · Sửa lỗi · Tự đánh giá**. Mỗi lần một màn; hình đàn đi kèm đúng đoạn chữ nói về nó (máy tính: hình ghim bên trái). Phần Luyện hiện từng bước một, chữ to, nút "Bước tiếp" lớn. Ẩn thanh điều hướng dưới để không bấm nhầm. |
| Buổi tập | Dòng thời gian | Thanh 30 phút chia đoạn theo tỉ lệ thật (4·5·8·8·3·2). Đồng hồ lớn kiểu số. Một việc đang làm. Metronome / Tuner mở ngay bên dưới. |
| Hôm nay (tổng quan) | Một cột | Một việc chính: bài hôm nay. Dưới là thanh buổi tập. Số liệu là một dòng chữ, không phải ba thẻ. |
| Trang chủ | Một vật lớn + kể bằng sản phẩm | Cần đàn bấm được ngay đầu trang (chạm dây nghe tiếng, đổi góc nhìn). Bên dưới là 3 bước của một bài thật, đánh số, không phải thẻ tính năng. |
| Danh sách bài | Mục lục sổ | Dòng kẻ, số thứ tự kiểu số, trạng thái bằng dấu nhỏ. |

## 5. Tên mục (tiếng Việt)

Hôm nay · Bài học · Luyện tập · Cây đàn · Công cụ · Tiến độ · Hồ sơ.

## 6. Cổng kiểm trước khi đưa lên

- [ ] Màu cam chỉ xuất hiện ở chấm ngón tay và một nút chính.
- [ ] Không có lưới thẻ ngang hàng; mỗi màn hình có một thứ nổi nhất.
- [ ] Không emoji, không `rounded-2xl/3xl`, không kính mờ, không đổ bóng.
- [ ] Số liệu dùng chữ kiểu số.
- [ ] Vùng chạm ≥ 44px; dùng được bằng bàn phím; có viền focus.
- [ ] Không tràn ngang ở 360px (test tự động).
- [ ] Chạy `ui_lint` — mục tiêu ≤ 4/10.

## 7. Kết quả lần làm lại (11/11/2026)

| | Trước | Sau |
|---|---|---|
| `ui_lint` (rủi ro "trông như AI làm") | 8.0/10 | 1.5/10 (3 cảnh báo còn lại là báo nhầm: dòng 3 con số ở trang Tiến độ, hiệu ứng nhấn nút, lưới lựa chọn ở form) |
| Khối bo góc lớn | 47 | 0 |
| Emoji trong giao diện | 2 | 0 |
| Bài học | 1 trang dài 5 phần | 4 chặng, luyện từng bước, nút "Bước tiếp" lớn, ẩn thanh điều hướng dưới |
| Trang chủ | tiêu đề + 4 thẻ tính năng | cần đàn bấm được + 3 bước của một bài thật |

Đã bỏ các component không dùng: `card`, `badge`, `radio-group`, `progress`, `separator`.
