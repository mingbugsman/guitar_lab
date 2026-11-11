# WRITING GUIDE — Cách Guitar Lab nói với người mới chơi

> `roadmap.md` quy định **dạy cái gì**. `GUITAR_VISUAL.md` quy định **cái gì nằm ở đâu trên đàn**.
> File này quy định **nói thế nào**: giọng văn, từ ngữ, liều lượng. Bắt buộc cho mọi bài học và mọi dòng chữ trên giao diện.

## 1. Người đang đọc là ai

- Chưa từng học nhạc, chưa biết thuật ngữ nào.
- Đang **ôm một cây đàn acoustic**, hai tay bận, mắt nhìn qua lại giữa màn hình và cần đàn.
- Dễ nản: đầu ngón tay đau, tiếng đàn rè, và không biết mình sai ở đâu.

Mỗi câu viết ra phải qua được câu hỏi: *người này đọc xong có biết đặt tay vào đâu và làm gì tiếp không?*

## 2. Giọng văn và xưng hô

| Chỗ | Cách viết |
|---|---|
| Bài học, checklist, thông báo trong app | Gọi người học là **"bạn"**. Hệ thống không xưng gì cả. |
| Trang chủ, trang Giới thiệu | Người làm web xưng **"mình"**, gọi người đọc là "bạn". |
| Checklist tự đánh giá | Người học tự nói, bắt đầu bằng **"Tôi…"**. |

- Câu ngắn, mỗi câu **một việc**. Bước hướng dẫn bắt đầu bằng động từ: "Đặt…", "Gảy…", "Nhấc…".
- Con số cụ thể thay cho tính từ: "8 lần", "60 BPM", "20 giây", không viết "vài lần", "chậm thôi".
- Báo lỗi theo công thức **triệu chứng → nguyên nhân → cách sửa**. Không dùng lời trách ("sai rồi", "bạn chưa…").
- Khen đúng một việc vừa làm được ("Cả 6 dây đã chuẩn"), không khen chung chung.
- Không dùng chữ IN HOA để nhấn, trừ các từ chỉ bên (TRÁI / PHẢI) và ký hiệu X, O.

## 3. Tay thuận: chữ phải đổi theo, giống hình

Hình được lật gương cho người dùng đàn tay trái, nên **chữ cũng phải đổi**. Không bao giờ viết cứng "tay trái", "tay phải", "bên trái", "đùi phải" cho những thứ đổi bên khi đổi tay. Dùng token:

| Token | Tay phải gảy | Tay trái gảy | Dùng cho |
|---|---|---|---|
| `{fretHand}` `{FretHand}` | tay trái / Tay trái | tay phải / Tay phải | tay bấm |
| `{pickHand}` `{PickHand}` | tay phải / Tay phải | tay trái / Tay trái | tay gảy |
| `{fretSide}` `{FRETSIDE}` | trái / TRÁI | phải / PHẢI | phía đầu đàn chĩa tới; phía dây 6 trên sơ đồ hợp âm |
| `{pickSide}` `{PICKSIDE}` | phải / PHẢI | trái / TRÁI | đùi đặt đàn; phía dây 1 trên sơ đồ hợp âm |

- Ưu tiên gọi theo **vai trò**: "tay bấm", "tay gảy". Chỉ dùng token khi cần nói rõ là tay nào, bên nào.
- Token dùng được trong mọi chữ của bài học, **trừ tiêu đề và tóm tắt** (hai chỗ này hiện ở danh sách bài, không được đổi).
- Hình nhìn từ phía người đối diện (hình tư thế ngồi) phải ghi rõ "như soi gương".
- Mã nguồn: `src/content/handedness.ts`. Test `src/content/handedness.test.tsx` chặn mọi chỗ viết cứng.

## 4. Thuật ngữ

**Quy tắc lần đầu:** lần đầu một thuật ngữ xuất hiện *trong một bài*, giải thích nó bằng một cụm ngắn ngay trong câu. Từ lần hai trở đi dùng trơn.

> ✗ "Kim lệch −20 cent."
> ✓ "Kim lệch −20 cent (cent là đơn vị đo độ lệch rất nhỏ: 100 cent bằng một phím đàn)."

**Tên nốt:** dùng chữ cái (C D E F G A B) làm chính, vì sơ đồ hợp âm và Tuner đều dùng chữ cái. Lần đầu trong bài kèm tên Việt: "E (Mi)". Số quãng tám (E2, E4) chỉ dùng ở bài lên dây và Tuner, và phải giải thích.

**Việt hay Anh:** tên tiếng Việt là chính. Từ tiếng Anh quen dùng thì ghi trong ngoặc ở lần đầu: "phím gảy (pick)". Bảng từ chuẩn, không dùng từ khác cho cùng một thứ:

| Dùng | Nghĩa ngắn để giải thích lần đầu | Không dùng |
|---|---|---|
| dây buông | dây gảy mà không bấm | dây mở, dây không |
| phím (ô phím) | khoảng giữa hai thanh kim loại trên cần đàn | ngăn |
| thanh phím | thanh kim loại nằm ngang trên cần đàn | phím (khi nói về thanh kim loại) |
| lược đàn (nut) | thanh trắng có 6 rãnh ở đầu cần đàn | |
| ngựa đàn (bridge) | miếng gỗ giữ dây trên thùng đàn | |
| khóa đàn | trục vặn để căng hoặc nới dây | trục lên dây |
| hợp âm | nhiều nốt vang cùng lúc | |
| nốt gốc | nốt mà hợp âm mang tên, thường là nốt trầm nhất | |
| nửa cung / một cung | 1 phím / 2 phím | |
| quãng tám | cùng tên nốt nhưng cao hơn, cách nhau 12 phím | |
| phách | nhịp đập đều của bài nhạc | beat |
| BPM | số phách trong một phút | |
| gảy xuống / gảy lên | về phía sàn nhà / về phía mặt bạn | quạt, strum (chưa dạy) |
| phím gảy (pick) | miếng nhựa nhỏ để gảy dây | móng gảy |
| máy lên dây (Tuner) | công cụ nghe tiếng đàn và báo lệch bao nhiêu | |
| máy đếm nhịp (Metronome) | công cụ phát tiếng tích tắc đều | |

- Không đưa khái niệm lên giao diện trước khi dạy nó. Ví dụ: nút "Kiểu Tab" phải có một dòng giải thích Tab là gì, hoặc chỉ hiện sau bài dạy đọc Tab.
- Thuật ngữ trong bài được test tự kiểm: thêm thuật ngữ mới vào danh sách `TERMS` trong `src/content/writing.test.ts`.

## 5. Nói trước về cơ thể và kỳ vọng

Người mới bỏ cuộc nhiều nhất vì nghĩ mình làm sai, trong khi họ chỉ đang gặp chuyện bình thường. Phải nói trước:

- **Đau đầu ngón tay bấm** trong 1 đến 2 tuần đầu là bình thường với dây sắt. Da sẽ dày lên. Tập nhiều buổi ngắn tốt hơn một buổi dài.
- **Tiếng rè, tiếng tắt** ở tuần đầu là bình thường. Có cách sửa cụ thể (bài "Tạo âm thanh sạch").
- **Dừng ngay** khi đau nhói ở cổ tay, khuỷu tay hoặc vai, hoặc tê ngón. Đó là sai tư thế, không phải "tập chưa đủ".
- Mỗi bài nói rõ **mất khoảng bao lâu** mới làm được, tính bằng số buổi tập, không chỉ số phút đọc bài.

Không hứa điều không chắc ("chỉ 7 ngày là đàn được"). Không dọa.

## 6. Khi người học bị kẹt

Mỗi bài, ngoài "Lỗi thường gặp", phải có lối đi khi **thử nhiều lần vẫn chưa được**:

1. Một bước nhỏ hơn để làm trước (chậm hơn, ít dây hơn, một ngón trước).
2. Bài cũ nên quay lại nếu bước nhỏ vẫn khó.
3. Lời cho phép nghỉ: "Nếu tay đã mỏi, dừng ở đây. Mai tập lại sẽ dễ hơn."

## 7. Viết cho đàn acoustic trước

- Mọi hướng dẫn, hình và ví dụ mặc định là **đàn acoustic dây sắt** (quyết định ngày 11/11/2026).
- Không viết kiểu "nếu đàn điện thì…" rải rác trong bài. Chỗ khác biệt cho đàn classic và đàn điện nằm ở **một ghi chú riêng** đầu bài, chỉ hiện với người chọn loại đàn đó (`src/content/guitar-type.ts`).
- Khi thêm bài mới: nếu bài có chỗ nào không áp dụng được cho classic hoặc đàn điện, bổ sung vào ghi chú đó.

## 8. Giúp người học tự biết mình đúng hay sai

- Tiêu chí phải **quan sát hoặc nghe được**: "gảy từng dây, cả 6 dây đều ngân ít nhất 2 giây", không viết "bấm cho chuẩn".
- Âm thanh mẫu hiện là **âm tổng hợp**. Chỗ nào người học so tiếng đàn mình với âm mẫu phải nói rõ: so **cao độ**, không so **màu tiếng**.
- Không viết như thể hệ thống đã kiểm tra tay hay tư thế của người học. Hệ thống chỉ nghe được cao độ qua micro.

## 9. Trình bày cho người đang ôm đàn

- Một bước một việc; bước nào cần nhìn hình thì hình nằm **ngay trên** bước đó.
- Phần luyện tập không dài quá 4 bước. Dài hơn thì tách thành hai bài tập.
- Việc cần làm bằng tay trên màn hình (bấm nút, tick checklist) dồn về **cuối** bài tập, không xen giữa lúc đang bấm đàn.

## 10. Nói "vì sao" và cho thấy thành quả sớm

- Mỗi bài mở đầu bằng **một câu** trả lời: học xong bài này bạn làm được gì trên đàn.
- Giải thích nguyên lý bằng thứ người học tự thử được ngay trên đàn, không chỉ nêu quy tắc.
- Mỗi bài có ít nhất một thứ **nghe ra nhạc** để chơi, dù chỉ 4 nốt.

## 11. Danh sách kiểm trước khi đưa một bài lên

- [ ] Không còn "trái / phải" viết cứng (test tự động).
- [ ] Mọi thuật ngữ được giải thích ở lần đầu, đúng bảng từ ở mục 4 (test tự động cho các từ trong `TERMS`).
- [ ] Bài có bấm dây nhiều thì có khung "Cảm giác khi tập" (`tone: "body"`).
- [ ] Bài có hình cần đàn thì có khung "Đối chiếu với đàn của bạn" (test tự động, xem `GUITAR_VISUAL.md`).
- [ ] Có câu mở đầu "học xong làm được gì".
- [ ] Có lối đi khi kẹt (mục 6).
- [ ] Tiêu chí đạt là thứ nghe hoặc nhìn được.
- [ ] Đọc to từng bước trong lúc ôm đàn: không bước nào bắt làm hai việc.

## Việc còn lại

| Quy tắc | Trạng thái |
|---|---|
| §3 Tay thuận | ✅ Đã áp dụng cho 18 bài, hình cấu tạo đàn và hình tư thế. Có test chặn. |
| §7 Acoustic trước | ✅ Đã có ghi chú riêng cho classic và đàn điện. |
| §2 Giọng văn | ✅ Đã rà 18 bài. Test chặn "ta/chúng ta", chữ in hoa, checklist không bắt đầu bằng "Tôi". |
| §4 Thuật ngữ | ✅ 18 bài giải thích thuật ngữ ở lần đầu (test `src/content/writing.test.ts`). Menu và tên công cụ tiếng Việt. Nút "Kiểu Tab" ẩn cho tới khi có bài dạy Tab. |
| §5 Cơ thể và kỳ vọng | ✅ Khung "Cảm giác khi tập" (callout `tone: "body"`) trong bài 3, 4, 9 và mọi bài hợp âm. Test bắt buộc. |
| §6 Khi kẹt | ⏳ Mẫu bài học chưa có mục này. |
| §8 Tự biết đúng sai | ⏳ Chưa có âm mẫu tiếng rè / tiếng tắt; checklist còn chung chung. |
| §9 Trình bày khi ôm đàn | ✅ Bài học chia 4 chặng, luyện từng bước một màn hình. |
| §10 "Vì sao" và thành quả sớm | ⏳ Mẫu bài học chưa có câu mở đầu. ✅ Hợp âm đầu tiên (Em) đã lên bài 10. |
| Hình vẽ chuyển động (hướng gảy, chuyển hợp âm) | ⏳ Bổ sung vào `GUITAR_VISUAL.md` khi làm Level 2. |
