# GUITAR VISUAL — Quy ước hướng đàn

> Yêu cầu bổ sung (ngoài roadmap): Guitar Lab phải có **hình cây đàn để đối chiếu** với đàn thật, và **mọi lời hướng dẫn phải đúng theo hướng của hình**.
> File này là quy ước bắt buộc cho mọi nội dung và component mới. Cách dùng từ, giọng văn: xem [WRITING_GUIDE.md](WRITING_GUIDE.md).

## 1. Ba góc nhìn

| Góc nhìn | Khi nào dùng | Đầu đàn | Dây trên cùng | Dây dưới cùng |
|---|---|---|---|---|
| **Nhìn xuống (người chơi)** — *mặc định* | Cần đàn ngang (`Fretboard view="player"`) | Bên trái | Dây 6 (to nhất, **gần mặt bạn**) | Dây 1 (mảnh nhất, **gần sàn nhà**) |
| **Kiểu Tab** | Cần đàn ngang (`view="tab"`), sau này cho Tab viewer | Bên trái | Dây 1 | Dây 6 |
| **Dựng đứng (sơ đồ hợp âm)** | `ChordDiagram`, `GuitarAnatomy` | Ở trên | — dây 6 **bên trái**, dây 1 **bên phải** | — |

**Đàn tay trái** (`handedness="left"`, lấy từ hồ sơ): mọi hình được **lật gương ngang** — đầu đàn sang phải, sơ đồ hợp âm có dây 6 bên phải. Chữ trong hình không bị lật.

**Chữ trong bài cũng đổi theo tay thuận.** Không viết cứng "tay trái / bên phải"; dùng token `{fretHand}`, `{pickHand}`, `{fretSide}`, `{pickSide}` — xem [WRITING_GUIDE.md](WRITING_GUIDE.md) §3.

Mã nguồn: `src/components/guitar/orientation.ts` (một nguồn duy nhất cho thứ tự dây theo góc nhìn).

## 2. Quy tắc viết hướng dẫn

1. **Luôn gọi dây bằng số + tên nốt**: "dây 5 (A)", không chỉ "dây thứ hai".
2. **Dùng mốc vật lý đúng trên đàn thật**, không phụ thuộc hình: *gần mặt bạn / gần sàn nhà / phía đầu đàn / phía thùng đàn / phía lược đàn*.
3. Khi nói "trên/dưới/trái/phải" **phải ghi rõ góc nhìn**: "Ở góc 'Nhìn xuống', hàng trên cùng là dây 6".
4. **Gảy xuống** = phím gảy đi về phía sàn nhà (dây 6 → dây 1). **Gảy lên** = về phía mặt bạn.
5. **Bấm phím N** = đặt đầu ngón trong ô phím N, sát thanh kim loại phía **thùng đàn**.
6. Không đoán vị trí khóa đàn theo kiểu đầu đàn — hướng dẫn "lần theo dây lên tới khóa".
7. Hướng dẫn bấm hợp âm **được sinh tự động** từ dữ liệu hợp âm (`describeChord` trong `chord-diagram.tsx`) — cùng dữ liệu vẽ sơ đồ, nên chữ không thể lệch hình.
8. Bài nào có hình cần đàn/hợp âm **phải có callout `compare`** ("Đối chiếu với đàn của bạn"). Test `curriculum.test.ts` bắt buộc điều này.

## 3. Nhãn luôn hiện trên hình

- Cần đàn: "Dây 6 … Dây 1" + tên nốt, "↑ phía mặt bạn / ↓ phía sàn nhà" (đảo theo góc nhìn), "◀ đầu đàn", "thùng đàn ▶", "Phím 1…".
- Sơ đồ hợp âm: tên nốt và số dây dưới mỗi cột, O = buông, X = không gảy, số trong chấm = ngón (1 trỏ, 2 giữa, 3 áp út, 4 út, T cái).

## 4. Kiểm thử

- `src/components/guitar/guitar-visual.test.tsx`: thứ tự dây theo góc nhìn, lật gương tay trái, ký hiệu O/X, số ngón, nội dung `describeChord`.
- `src/lib/music/music.test.ts`: mỗi thế bấm hợp âm chỉ phát nốt thuộc hợp âm, nốt trầm nhất là nốt gốc.
- `tests/e2e/smoke.spec.ts`: đổi góc nhìn trên trình duyệt thật.
