# PRACTICE ENGINE — Bài tập ngón, thử thách hợp âm, fingerpicking

> **Big update** quyết định ngày 11/11/2026. File này ghi lại *vì sao*, *làm gì* và *làm thế nào* cho 4 phần:
> (1) cần đàn bấm được từng ô, (2) bộ máy chuỗi nốt và màn hình Bài tập ngón, (3) thử thách hợp âm,
> (4) gắn vào bài học, buổi tập và trang Tiến độ. Phần cuối ghi hướng xử lý fingerpicking sau này.
> Tiến độ từng việc: xem mục "PRACTICE ENGINE" trong [CHECKLIST.md](CHECKLIST.md).

---

## 0. Bối cảnh và các quyết định

**Vấn đề:** người mới gặp khó nhiều nhất ở chỗ bấm yếu, các ngón chưa quen, và đổi hợp âm không kịp. Đọc bài thôi thì không giải quyết được. Họ cần bài tập có hình diễn mẫu, có nhịp, và tăng tốc từ từ.

| Quyết định | Lý do |
|---|---|
| **Không dùng micro để chấm** dây nào, nốt nào đúng | Micro laptop yếu, tiếng nhiều dây lẫn nhau, chấm sai còn làm người học nản hơn là không chấm. Micro chỉ dùng cho việc dễ: máy lên dây và đếm tiếng gảy. |
| **Người học tự đánh giá** sau mỗi lượt | Bài tập được thiết kế để tự nhận ra lỗi: ô sáng mà tay chưa tới là biết mình không kịp. |
| **Diễn mẫu trên hình** trước khi tập | Người mới cần *thấy* động tác: ngón nào, ô nào, ngón nào phải giữ. |
| **Chậm lên nhanh** tự động | Tập nhanh khi chưa sạch chỉ tập thêm lỗi. Tốc độ chỉ tăng sau khi đã chơi đủ vòng ở tốc độ cũ. |
| **Một bộ máy chung** cho cả bài tập ngón, thử thách hợp âm và fingerpicking | Mỗi bài tập chỉ là dữ liệu. Thêm bài mới không cần code mới. |
| Theo đúng [GUITAR_VISUAL.md](GUITAR_VISUAL.md) và [WRITING_GUIDE.md](WRITING_GUIDE.md) | Hình đúng hướng nhìn của người chơi, lật gương cho người chơi tay trái. Chữ có thuật ngữ được giải thích, có khung "Cảm giác khi tập". |

---

## 1. Cần đàn bấm được từng ô

### Mục tiêu
Chạm vào bất kỳ ô nào (dây × phím) trên mọi hình cần đàn là nghe đúng nốt đó. Ô vừa chạm sáng lên và hiện tên nốt. Chạm vào vùng trước lược đàn là nghe dây buông.

### Thiết kế
- `Fretboard` (`src/components/guitar/fretboard.tsx`) thêm:
  - `onCellPress?: (string, fret) => void`, với `fret = 0` là vùng dây buông, nằm giữa nhãn dây và lược đàn.
  - `pressedCell?: { string; fret }`: vẽ vòng sáng và tên nốt trong 400 ms.
  - Lớp vùng chạm: mỗi ô là một `<rect>` trong suốt phủ đúng ô phím. Toạ độ tính bằng chính `fretLineX`, `rowY` và `X()` (lật gương), nên đổi tay thuận hay đổi hướng nhìn vẫn đúng ô.
- Hàm thuần `cellAt(layout, x, y, view, handedness)` trả về `{string, fret} | null`. Unit test với cả hai tay thuận và hai hướng nhìn.
- `InteractiveFretboard`: chạm dây không còn phát cả dây nữa, chuyển thành `onCellPress → playString(s, fret)`.
- **Bàn phím:** nhóm ô có `role="grid"`. Phím mũi tên đổi dây hoặc đổi phím, Enter hoặc phím cách để phát. Chỉ có một điểm tab, không phải 78 nút.
- **Ô nhỏ trên điện thoại:** hình 12 phím chỉ còn khoảng 18 px mỗi phím. Vùng chạm phủ kín cả ô, và trang Cây đàn có nút "Phóng to phím 1–5" để bấm cho chính xác.

### Tiêu chí xong
- Chạm ô dây 6 phím 3 nghe G. Ô sáng và hiện chữ "G".
- Ở chế độ đàn tay trái, chạm ô bên phải lược đàn vẫn đúng phím 1.
- Dùng được bằng bàn phím.
- Test E2E: chạm một ô thì `data-pressed` đúng dây và phím.

---

## 2. Bộ máy chuỗi nốt và màn hình Bài tập ngón

### 2.1 Mô hình dữ liệu (`src/lib/practice/sequence.ts`)

```ts
type Finger = 1 | 2 | 3 | 4 | "T";          // tay bấm
type PickFinger = "p" | "i" | "m" | "a";     // tay gảy (dùng cho fingerpicking, mục 5)

type Hit = { string: StringNumber; fret: number; finger?: Finger; pick?: PickFinger };

type Step = {
  at: number;            // vị trí tính bằng phách, ví dụ 0, 0.5, 1…
  hits: Hit[];           // 1 phần tử = một nốt; nhiều phần tử = các dây cùng lúc (pinch, hợp âm)
  hold?: Hit[];          // các ngón vẫn đang giữ trên dây (vẽ mờ), dùng cho bài "giữ ngón"
  action?: "pick-down" | "pick-up" | "pluck" | "pinch" | "strum-down" | "strum-up" | "slap";
  chord?: ChordId;       // thử thách hợp âm: bước này là một hợp âm
  caption?: string;      // chữ hiện ở chế độ Xem mẫu
};

type Sequence = { beats: number; subdivision: 1 | 2 | 4; steps: Step[] };

type Tempo = { start: number; target: number; step: number; roundsPerStep: number };

type Drill = {
  id: string;                      // "spider-1234", "challenge-open-chords"…
  kind: "finger" | "chord-challenge" | "picking";
  title: string;
  goal: string;                    // một câu: tập cái gì
  howTo: string[];                 // các bước hiện ở chế độ Xem mẫu
  body: string;                    // khung "Cảm giác khi tập" (WRITING_GUIDE §5)
  tempo: Tempo;
  unlockAfter: string;             // slug bài học cần xong trước
  build: (opts: DrillOptions) => Sequence; // hàm thuần, có unit test
};
```

- Dữ liệu bài tập nằm ở `src/content/drills/*.ts`. Bộ dựng chuỗi nốt dùng chung: `spider(order, strings, startFret, direction)`, `shiftPositions(...)`, `stringSkip(...)`.
- **Ràng buộc có test:**
  - Mỗi nốt của tay bấm nằm trong khung 4 phím và đúng quy tắc "ngón n ở phím `startFret + n − 1`".
  - Mỗi step có ít nhất một hit, hoặc có `chord`.
  - `at` tăng dần và nhỏ hơn `beats`.

### 2.2 Bộ phát (`src/lib/practice/player.ts` và hook `usePatternPlayer`)
- Dùng **Tone.Transport** và `Tone.Part` để lập lịch các step trên đồng hồ Web Audio. Hình được cập nhật qua `Tone.Draw`, nên hình và tiếng không lệch nhau.
- Tiếng tích của máy đếm nhịp được lập lịch trong cùng Transport. Phách 1 nhấn mạnh hơn.
- **Tăng tốc** bằng hàm thuần `tempoForRound(tempo, round, held)`: sau mỗi `roundsPerStep` vòng thì `bpm += step`, tối đa `target`. Nút "Giữ tốc độ này" khoá BPM lại.
- **Các trạng thái:**
  1. `preview`: Xem mẫu ở 30 BPM, dừng 1 nhịp giữa các bước, hiện `caption`.
  2. `countin`: đếm vào 1 ô nhịp (4 tiếng tích).
  3. `running`.
  4. `done`.
- Chỉ một nguồn phát được chạy cùng lúc. Bộ phát dừng `Metronome` nếu đang chạy, và ngược lại (dùng chung `src/lib/audio/transport-owner.ts`).
- Có nút tắt tiếng mẫu ("Chỉ nghe tiếng tích"), để người học chơi theo mà không nghe tiếng đàn tổng hợp.
- Màn hình luôn sáng trong lúc tập (`useWakeLock`, đã có sẵn).

### 2.3 Màn hình `ExercisePlayer`

```
┌──────────────────────────────────────────────┐
│ Spider 1-2-3-4            60 → 90 BPM · vòng 3/8 │
│ "Mỗi ngón một phím, đi từ dây 6 xuống dây 1"  │
│ ┌──────────── cần đàn (FittedFretboard) ─────┐ │
│ │  ● ô cần bấm: cam đậm + số ngón            │ │
│ │  ○ ô kế tiếp: viền nét đứt                 │ │
│ │  ◐ ngón đang giữ: cam nhạt                 │ │
│ └────────────────────────────────────────────┘ │
│ ● ● ○ ○  (phách)        "Ngón 1 giữ, đặt ngón 2" │
│ [Xem mẫu] [Bắt đầu]  [Giữ tốc độ]  [Dừng]      │
└──────────────────────────────────────────────┘
```

- Hình đúng góc "Nhìn xuống", lật gương cho người chơi tay trái. Có khung "Đối chiếu với đàn của bạn" như các hình khác.
- **Kết thúc lượt:** người học chọn một trong ba mức: *Sạch hết* / *Có vài nốt rè* / *Không theo kịp*. Máy lưu lại và gợi ý lần sau:
  - "Sạch hết": lần sau bắt đầu nhanh hơn 5 BPM.
  - "Không theo kịp": lần sau giảm 10 BPM.
- **Trang:**
  - `/drills`: danh sách bài, nhóm theo mục tiêu. Bài nào chưa mở hiện "Mở sau bài …".
  - `/drills/[id]`: màn hình tập.
  - Thêm vào menu: mục "Luyện tập" có thẻ "Bài tập ngón".

### 2.4 Mười hai bài tập ngón (đợt đầu)

Ký hiệu: dây đi từ 6 → 1. "Khung phím 1–4" nghĩa là ngón 1 ở phím 1 … ngón 4 ở phím 4. Tốc độ tính theo nốt móc đơn (2 nốt mỗi phách), trừ khi ghi khác.

| # | id | Tên | Chuỗi nốt | Tập cái gì | Tốc độ (bắt đầu → mục tiêu, bước) | Mở sau bài |
|---|---|---|---|---|---|---|
| 1 | `spider-1234` | Spider 1-2-3-4 | 1-2-3-4 trên từng dây, 6 → 1 | Mỗi ngón một phím | 40 → 90, +5 mỗi 2 vòng | hand-position |
| 2 | `spider-4321` | Spider ngược | 4-3-2-1 trên từng dây, 6 → 1 | Ngón út dẫn đầu | 40 → 80, +5 | hand-position |
| 3 | `spider-updown` | Lên rồi xuống | 1-2-3-4 từ dây 6 → 1, rồi 4-3-2-1 từ dây 1 → 6 | Đổi hướng không ngắt nhịp | 40 → 90, +5 | fretboard-basics |
| 4 | `spider-hold` | Giữ ngón | 1-2-3-4, ngón trước giữ nguyên tới khi sang dây mới | Sức ngón, không nhấc thừa | 30 → 70, +5 | fretboard-basics |
| 5 | `perm-1324` | Tách ngón 1-3-2-4 | 1-3-2-4 trên từng dây | Ngón làm việc độc lập | 40 → 80, +5 | fretboard-basics |
| 6 | `perm-1423` | Tách ngón 1-4-2-3 | 1-4-2-3 trên từng dây | Cặp ngón 3–4, cặp yếu nhất | 35 → 75, +5 | fretboard-basics |
| 7 | `diagonal` | Đi chéo | Ngón 1 dây 6, ngón 2 dây 5, ngón 3 dây 4, ngón 4 dây 3; rồi dịch xuống một dây | Ngón và dây cùng đổi | 30 → 70, +5 | musical-notes |
| 8 | `shift` | Dời thế tay | Spider 1-2-3-4 trên dây 6 ở khung 1–4, rồi 2–5, 3–6… tới 5–8, rồi quay về | Di chuyển cả bàn tay | 40 → 80, +5 | musical-notes |
| 9 | `pairs` | Cặp ngón | 1-2-1-2 rồi 3-4-3-4 trên từng dây | Ngón yếu tập riêng | 50 → 100, +5 | fretboard-basics |
| 10 | `string-skip` | Nhảy dây | Dây 6 → 4 → 5 → 3 → 4 → 2 → 3 → 1, mỗi dây ngón 1 phím 1 | Tay gảy chính xác | 40 → 80, +5 | open-strings |
| 11 | `alternate` | Gảy xen kẽ | Spider 1-2-3-4, nốt chẵn gảy xuống, nốt lẻ gảy lên (mũi tên ↓↑ hiện trên ô) | Gảy xuống và lên đều tay | 40 → 90, +5 | pitch-and-rhythm |
| 12 | `burst` | Bốn nốt một phách | 1-2-3-4 trên một dây, 4 nốt mỗi phách, nghỉ 1 phách, rồi sang dây kế tiếp | Sức bền, tốc độ ngắn | 40 → 70 (tính theo phách), +5 | clean-sounds |

Mỗi bài có thêm:
- `howTo`: 2–4 câu cho chế độ Xem mẫu. Ví dụ bài 4: "Đặt ngón 1 ở phím 1. Giữ nguyên ngón 1 và đặt ngón 2 ở phím 2. Chỉ nhấc cả 4 ngón khi sang dây mới."
- `body`: khung "Cảm giác khi tập". Ví dụ: "Ngón út mỏi và chậm hơn các ngón khác là bình thường. Dừng ngay nếu đau nhói ở cổ tay."

### 2.5 Lưu kết quả
Migration mới `drill_results` (dùng chung cho bài tập ngón và thử thách hợp âm):

```sql
create table public.drill_results (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  drill_id text not null check (drill_id ~ '^[a-z0-9:-]{1,80}$'),
  kind text not null check (kind in ('finger', 'chord-challenge', 'picking')),
  bpm_reached smallint not null check (bpm_reached between 20 and 300),
  rating text not null check (rating in ('clean', 'some-buzz', 'lost')),
  seconds smallint not null check (seconds between 5 and 1800),
  created_at timestamptz not null default now()
);
-- index (user_id, drill_id, created_at desc); RLS: chỉ đọc và thêm dòng của chính mình
```

- Hai số được hiển thị:
  - **Tốc độ sạch cao nhất** = `max(bpm_reached)` trong các lượt có `rating = 'clean'`.
  - **Lần gần nhất.**
- Server actions đặt ở `src/features/drills/actions.ts`, làm theo cùng kiểu với `chord-changes/actions.ts`.

### 2.6 Test
- **Unit:**
  - các bộ dựng chuỗi nốt (đúng ngón, đúng phím, trong khung);
  - `tempoForRound`;
  - tất cả 12 bài đều dựng được và không vi phạm ràng buộc;
  - chữ của bài tập qua được `writing.test.ts` (thuật ngữ, giọng văn).
- **E2E** dùng `page.clock`:
  - mở `/drills/spider-1234`, bấm Xem mẫu thì thấy caption;
  - bấm Bắt đầu thì ô sáng di chuyển đúng thứ tự;
  - hết lượt, chọn "Sạch hết" thì kết quả được lưu và vẫn còn sau khi tải lại trang.
- **RLS:** thêm `drill_results` vào `rls.spec.ts`.

---

## 3. Thử thách hợp âm

### Cách chạy
- Người học chọn:
  - **nhóm hợp âm**: mặc định là những hợp âm thuộc bài đã học;
  - **độ dài**: 1, 3 hoặc 5 phút;
  - **mức bắt đầu**: chậm, vừa hoặc nhanh.
- Máy tạo chuỗi hợp âm ngẫu nhiên (có seed để test được), không lặp lại hợp âm ngay trước nó.
- **Mỗi hợp âm giữ 4 phách:**
  - phách 1: gảy xuống một cái. Có tuỳ chọn "nghe mẫu", máy gảy hợp âm đúng lúc đó;
  - phách 3–4: hợp âm kế tiếp hiện mờ bên cạnh, có vòng đếm ngược.
- **Chậm lên nhanh theo chặng.** Ví dụ thử thách 3 phút: 50 → 60 → 70 → 80 BPM, mỗi chặng khoảng 45 giây. Đổi chặng thì có báo "Nhanh hơn: 60 BPM".
- **Kết thúc:** người học tự chọn "Tôi theo kịp tới chặng …" và một trong ba mức đánh giá như ở bài tập ngón. Lưu vào `drill_results` với:
  - `kind = 'chord-challenge'`;
  - `drill_id = 'challenge:' + các hợp âm sắp xếp`, ví dụ `challenge:a-am-d-e-em`;
  - `bpm_reached` = BPM của chặng cuối cùng còn theo kịp.

### Màn hình

```
┌─────────────────────────────────────────┐
│ Thử thách 3 phút · chặng 2/4 · 60 BPM · 1:52 │
│   ┌────────┐            tiếp theo          │
│   │ sơ đồ  │   Am       ┌────┐  E           │
│   │  lớn   │            │nhỏ │  (3, 4)     │
│   └────────┘            └────┘             │
│   ● ○ ○ ○   phách                          │
└─────────────────────────────────────────┘
```

- Sơ đồ hợp âm vẽ theo `ChordDiagram` (lật gương cho tay trái). Có nút chuyển sang hình cần đàn nhìn từ trên xuống, dành cho người chưa quen đọc sơ đồ.
- Bộ dựng `buildChallenge(chords, minutes, stages, seed)` là hàm thuần, chạy trên cùng `usePatternPlayer` (mỗi step có `chord`).

### Test
- **Unit:** không có hai hợp âm giống nhau liền nhau; tổng thời lượng đúng; các chặng tăng dần.
- **E2E** với `page.clock`: hợp âm đổi sau 4 phách; chặng đổi đúng thời điểm; kết quả được lưu.

---

## 4. Gắn vào app

| Chỗ | Thay đổi |
|---|---|
| Bài 4 (đặt tay) | Thêm visual `{ kind: "drill", id: "spider-1234", strings: [4] }`: spider chỉ trên dây 4, đúng bài tập đang có trong bài. |
| Bài 9 (cần đàn) | Spider trên dây 6 và bài "Giữ ngón". |
| Bài 12 (cao độ và nhịp) | Bài "Gảy xen kẽ" (mục 2.4, bài 11). |
| Bài A, D | Thử thách hợp âm 1 phút với các hợp âm đã học. |
| Buổi tập hằng ngày | Phần "Kỹ thuật" gợi ý bài tập ngón: ưu tiên bài lâu chưa tập hoặc có tốc độ sạch thấp nhất. Thêm công cụ "Bài tập ngón" vào thanh công cụ của buổi tập. |
| Trang Luyện tập | Ba thẻ lối vào: Bài tập ngón · Thử thách hợp âm · Đổi hợp âm 1 phút. |
| Trang Tiến độ | Bảng "Tốc độ sạch cao nhất" cho từng bài tập, kỷ lục thử thách, kỷ lục đổi hợp âm 1 phút. |
| `types.ts` | Thêm `Visual = { kind: "drill"; id; strings?; minutes? }`. `practiceVisuals` ưu tiên giữ visual này trong phần luyện. |
| Test | `curriculum.test.ts`: mọi `drill` được tham chiếu đều tồn tại và đã mở ở bài đó (`unlockAfter` không nằm sau bài đó). |

---

## 5. Fingerpicking sau này

Dùng lại nguyên bộ máy ở mục 2. Phần thêm:

1. **Ngón tay gảy:** `pick: "p" | "i" | "m" | "a"`. Lần đầu xuất hiện ghi kèm tên Việt: p (ngón cái), i (ngón trỏ), m (ngón giữa), a (ngón áp út). Thêm 4 thuật ngữ này vào `TERMS` trong `writing.test.ts`.
2. **Mẫu gảy là dữ liệu.** Hàm `pattern(chord, "B-3-2-1")` tự chọn dây bass theo nốt gốc của hợp âm: dây 6 cho E/Em, dây 5 cho A/Am, dây 4 cho D.
   - `"B-3-2-1"`: p gảy bass, sau đó i, m, a gảy dây 3, 2, 1, mỗi nốt nửa phách.
   - `"B-(321)"`: p gảy bass, sau đó i, m, a cùng kéo dây 3, 2, 1. Đây là một step có 3 hits, `action: "pinch"`.
   - `"B-(321)-slap"`: thêm một step `action: "slap"`. Vỗ bằng phần nào của bàn tay và vỗ vào đâu được ghi trong `howTo`.
3. **Hình:**
   - **Cần đàn:** tay bấm giữ nguyên hợp âm. Các dây sắp được gảy sáng lên kèm chữ p, i, m, a.
   - **Dải nhịp** (component mới `PatternLane`) dưới cần đàn:
     - mỗi cột là một nửa phách, mỗi hàng là một dây (thứ tự hàng giống cần đàn: dây 6 ở trên trong góc "Nhìn xuống");
     - có thêm một hàng ✋ cho tiếng vỗ;
     - có vạch chạy theo Transport, giống máy đánh trống.
   - Pinch được vẽ thành ba ô cùng cột nối bằng ngoặc.
4. **Tiếng:**
   - nốt dây: dùng PluckSynth như hiện nay;
   - tiếng vỗ: `Tone.NoiseSynth` ngắn, có lọc thông thấp để nghe thành tiếng "bộp".
5. Vẫn có Xem mẫu, chậm lên nhanh, tự đánh giá và lưu vào `drill_results` với `kind = 'picking'`.
6. **Hướng nhìn:** hình bàn tay gảy (ngón nào ứng với dây nào) là hình mới. Phải lật gương theo `pickHand`, và ghi vào `GUITAR_VISUAL.md` khi làm.

---

## 6. Thứ tự làm và nhánh git

| Bước | Nhánh | Kết quả có thể dùng ngay |
|---|---|---|
| 1 | `feature/playable-fretboard` | Mọi hình cần đàn bấm được từng ô |
| 2a | `feature/drill-engine` | Kiểu dữ liệu, các bộ dựng chuỗi nốt, `tempoForRound`, bộ phát và test (chưa có giao diện) |
| 2b | `feature/finger-drills` | Trang `/drills` và 12 bài, Xem mẫu, chậm lên nhanh, lưu kết quả (migration `drill_results`) |
| 3 | `feature/chord-challenge` | Thử thách hợp âm |
| 4 | `feature/drills-integration` | Gắn vào bài học, buổi tập, trang Tiến độ |
| sau | `feature/fingerpicking` | Mục 5 (thuộc Phase 2: Level 2 strumming/arpeggio) |

Mỗi bước: unit test, E2E, lint, typecheck và build đều phải qua trước khi merge vào `develop`. Migration áp lên dev rồi prod trước khi merge vào `main`.

## 7. Rủi ro đã biết
- **Độ trễ âm thanh trên Bluetooth:** tiếng tổng hợp có thể chậm 100–200 ms so với hình. Có tuỳ chọn "Bù trễ" (−200 → 0 ms) để dời hình theo tiếng.
- **Tone.Transport dùng chung:** nếu Metronome và bộ phát cùng chạy thì sẽ loạn nhịp. Đã có cách xử lý ở mục 2.2 (`transport-owner`).
- **Ô nhỏ trên điện thoại:** đã xử lý ở mục 1 (vùng chạm phủ kín ô, nút phóng to phím 1–5).
- **Người học tự đánh giá quá dễ dãi:** chữ ở màn hình kết thúc mô tả từng mức bằng điều nghe được. Ví dụ "Sạch hết: không nốt nào rè hoặc tắt, không lỡ ô nào".
