import { STRING_NUMBERS_HIGH_TO_LOW, STRING_NUMBERS_LOW_TO_HIGH, type StringNumber } from "@/lib/music/guitar";
import {
  highestFret,
  sequenceFromSteps,
  stepsFromNotes,
  type FingerNote,
  type Sequence,
  type Step,
  type Tempo,
} from "@/lib/practice/sequence";

/**
 * Finger drills. Each one is data for the practice engine: what it trains, how to do it (shown
 * while previewing), what the hands will feel, and a tempo that rises from slow to fast.
 * Writing rules: the same as lessons (checked by drills.test.ts).
 */
export type DrillGroup = "independence" | "strength" | "movement" | "picking";

export type Drill = {
  id: string;
  kind: "finger";
  group: DrillGroup;
  title: string;
  /** One sentence: what this trains. */
  goal: string;
  /** 2–4 short steps shown before and during the preview. */
  howTo: string[];
  /** What is normal to feel, and when to stop (WRITING_GUIDE §5). */
  body: string;
  tempo: Tempo;
  /** Lesson that must be completed first. */
  unlockAfter: string;
  sequence: Sequence;
  /** Frets to draw. */
  frets: number;
};

export const DRILL_GROUPS: Record<DrillGroup, string> = {
  independence: "Tách ngón",
  strength: "Sức ngón",
  movement: "Di chuyển tay",
  picking: "Tay gảy",
};

type Finger4 = 1 | 2 | 3 | 4;

const onEachString = (strings: readonly StringNumber[], order: Finger4[], startFret = 1): FingerNote[] =>
  strings.flatMap((s) => order.map((finger) => ({ string: s, finger, startFret })));

const BODY_LITTLE_FINGER =
  "Ngón út mỏi và chậm hơn các ngón khác là bình thường. Nghỉ 1 phút khi tay mỏi. Dừng ngay nếu đau nhói ở cổ tay hoặc tê ngón.";
const BODY_FINGERTIPS =
  "Đầu ngón đau nhẹ là bình thường với dây sắt. Ấn vừa đủ để nốt không rè, không ấn hết sức. Dừng ngay nếu đau nhói ở cổ tay hoặc tê ngón.";
const BODY_PICKING =
  "Cổ tay gảy hơi mỏi là bình thường. Giữ vai thả lỏng, chuyển động nhỏ từ cổ tay. Dừng ngay nếu đau nhói ở cổ tay hoặc khuỷu tay.";

function drill(
  d: Omit<Drill, "kind" | "sequence" | "frets"> & { steps: Step[]; minFrets?: number },
): Drill {
  const { steps, minFrets = 5, ...rest } = d;
  const sequence = sequenceFromSteps(steps);
  return { ...rest, kind: "finger", sequence, frets: Math.max(minFrets, highestFret(sequence) + 1) };
}

const tempo = (start: number, target: number, step = 5, roundsPerStep = 2): Tempo => ({ start, target, step, roundsPerStep });

/** Diagonal: finger n on the n-th string down from `top`, then back up with 4-3-2-1. */
function diagonalNotes(): FingerNote[] {
  const down: FingerNote[] = [6, 5, 4].flatMap((top) =>
    ([1, 2, 3, 4] as Finger4[]).map((finger) => ({ string: (top - (finger - 1)) as StringNumber, finger })),
  );
  const up: FingerNote[] = [4, 5, 6].flatMap((top) =>
    ([4, 3, 2, 1] as Finger4[]).map((finger) => ({ string: (top - (finger - 1)) as StringNumber, finger })),
  );
  return [...down, ...up];
}

/** Shift: 1-2-3-4 on string 6 with the hand starting at fret 1, 2, 3, 4, 5, then back down. */
function shiftNotes(): FingerNote[] {
  const windows = [1, 2, 3, 4, 5, 4, 3, 2];
  return windows.flatMap((startFret) => ([1, 2, 3, 4] as Finger4[]).map((finger) => ({ string: 6 as StringNumber, finger, startFret })));
}

/** Burst: four quick notes on one string, a beat of rest, next string. */
function burstSteps(): Step[] {
  return STRING_NUMBERS_LOW_TO_HIGH.flatMap((s, i) =>
    stepsFromNotes(
      ([1, 2, 3, 4] as Finger4[]).map((finger) => ({ string: s, finger })),
      { noteBeats: 0.25, startAt: i * 2 },
    ),
  );
}

/** String skip: finger 1 at fret 1, jumping strings 6 4 5 3 4 2 3 1 and back. */
function stringSkipNotes(): FingerNote[] {
  const order: StringNumber[] = [6, 4, 5, 3, 4, 2, 3, 1];
  return [...order, ...[...order].reverse()].map((s) => ({ string: s, finger: 1 }));
}

export const FINGER_DRILLS: Drill[] = [
  drill({
    id: "spider-1234",
    group: "independence",
    title: "Spider 1-2-3-4",
    goal: "Mỗi ngón một phím, để cả 4 ngón quen làm việc.",
    howTo: [
      "Đặt tay bấm sao cho ngón 1 ở phím 1, ngón 4 ở phím 4.",
      "Trên dây 6, bấm lần lượt ngón 1, 2, 3, 4, mỗi nốt một lần gảy.",
      "Sang dây 5 và làm lại, cứ thế tới dây 1.",
      "Ngón chưa dùng thì để sẵn ngay trên phím của nó, cách dây khoảng 1 cm.",
    ],
    body: BODY_LITTLE_FINGER,
    tempo: tempo(40, 90),
    unlockAfter: "hand-position",
    steps: stepsFromNotes(onEachString(STRING_NUMBERS_LOW_TO_HIGH, [1, 2, 3, 4])),
  }),
  drill({
    id: "spider-4321",
    group: "independence",
    title: "Spider ngược 4-3-2-1",
    goal: "Ngón út đi trước, để ngón yếu nhất được tập nhiều nhất.",
    howTo: [
      "Đặt ngón 4 ở phím 4 trên dây 6, rồi lần lượt ngón 3, 2, 1.",
      "Sang dây 5 và làm lại, cứ thế tới dây 1.",
      "Nhấc ngón vừa bấm lên ngay khi ngón kế tiếp đặt xuống.",
    ],
    body: BODY_LITTLE_FINGER,
    tempo: tempo(40, 80),
    unlockAfter: "hand-position",
    steps: stepsFromNotes(onEachString(STRING_NUMBERS_LOW_TO_HIGH, [4, 3, 2, 1])),
  }),
  drill({
    id: "spider-updown",
    group: "movement",
    title: "Lên rồi xuống",
    goal: "Đổi hướng ở dây 1 mà không ngắt nhịp.",
    howTo: [
      "Đi 1-2-3-4 từ dây 6 xuống dây 1.",
      "Ở dây 1, quay lại bằng 4-3-2-1 và đi ngược lên dây 6.",
      "Chỗ đổi hướng giữ đều nhịp như mọi nốt khác.",
    ],
    body: BODY_LITTLE_FINGER,
    tempo: tempo(40, 90),
    unlockAfter: "fretboard-basics",
    steps: stepsFromNotes([
      ...onEachString(STRING_NUMBERS_LOW_TO_HIGH, [1, 2, 3, 4]),
      ...onEachString(STRING_NUMBERS_HIGH_TO_LOW, [4, 3, 2, 1]),
    ]),
  }),
  drill({
    id: "spider-hold",
    group: "strength",
    title: "Giữ ngón",
    goal: "Ngón đã đặt thì giữ nguyên, để ngón khỏe và không nhấc thừa.",
    howTo: [
      "Đặt ngón 1 ở phím 1 dây 6 và gảy.",
      "Giữ nguyên ngón 1, đặt thêm ngón 2 ở phím 2 và gảy. Tiếp tục với ngón 3, ngón 4.",
      "Chỉ nhấc cả 4 ngón khi sang dây mới.",
      "Chấm nhạt trên hình là ngón đang phải giữ.",
    ],
    body: BODY_FINGERTIPS,
    tempo: tempo(30, 70),
    unlockAfter: "fretboard-basics",
    steps: stepsFromNotes(onEachString(STRING_NUMBERS_LOW_TO_HIGH, [1, 2, 3, 4]), { holdOnString: true }),
  }),
  drill({
    id: "perm-1324",
    group: "independence",
    title: "Tách ngón 1-3-2-4",
    goal: "Các ngón làm việc riêng, không kéo nhau theo.",
    howTo: [
      "Trên mỗi dây, bấm theo thứ tự ngón 1, 3, 2, 4 (phím 1, 3, 2, 4).",
      "Đi từ dây 6 xuống dây 1.",
      "Nếu ngón 3 kéo theo ngón 4, giảm tốc độ và để ngón 4 nằm yên trên phím của nó.",
    ],
    body: BODY_LITTLE_FINGER,
    tempo: tempo(40, 80),
    unlockAfter: "fretboard-basics",
    steps: stepsFromNotes(onEachString(STRING_NUMBERS_LOW_TO_HIGH, [1, 3, 2, 4])),
  }),
  drill({
    id: "perm-1423",
    group: "independence",
    title: "Tách ngón 1-4-2-3",
    goal: "Tập riêng ngón 3 và ngón 4, cặp ngón yếu nhất.",
    howTo: [
      "Trên mỗi dây, bấm theo thứ tự ngón 1, 4, 2, 3 (phím 1, 4, 2, 3).",
      "Đi từ dây 6 xuống dây 1.",
      "Ngón 4 nhảy xa nhất: mở bàn tay từ trước khi gảy nốt đầu.",
    ],
    body: BODY_LITTLE_FINGER,
    tempo: tempo(35, 75),
    unlockAfter: "fretboard-basics",
    steps: stepsFromNotes(onEachString(STRING_NUMBERS_LOW_TO_HIGH, [1, 4, 2, 3])),
  }),
  drill({
    id: "diagonal",
    group: "movement",
    title: "Đi chéo",
    goal: "Ngón và dây cùng đổi một lúc, như khi chuyển hợp âm.",
    howTo: [
      "Ngón 1 ở dây 6 phím 1, ngón 2 ở dây 5 phím 2, ngón 3 ở dây 4 phím 3, ngón 4 ở dây 3 phím 4.",
      "Dịch cả đường chéo xuống một dây và làm lại.",
      "Sau 3 lượt, đi ngược lại bằng 4-3-2-1.",
    ],
    body: BODY_LITTLE_FINGER,
    tempo: tempo(30, 70),
    unlockAfter: "musical-notes",
    steps: stepsFromNotes(diagonalNotes()),
  }),
  drill({
    id: "shift",
    group: "movement",
    title: "Dời thế tay",
    goal: "Dời cả bàn tay dọc cần đàn mà các ngón vẫn đúng phím.",
    howTo: [
      "Trên dây 6, chơi 1-2-3-4 với ngón 1 ở phím 1.",
      "Dời cả bàn tay một phím về phía thùng đàn: ngón 1 ở phím 2, chơi lại 1-2-3-4.",
      "Dời tiếp đến khi ngón 1 ở phím 5, rồi dời ngược về.",
      "Ngón cái sau cần đàn đi theo bàn tay.",
    ],
    body: BODY_FINGERTIPS,
    tempo: tempo(40, 80),
    unlockAfter: "musical-notes",
    steps: stepsFromNotes(shiftNotes()),
  }),
  drill({
    id: "pairs",
    group: "strength",
    title: "Cặp ngón",
    goal: "Lặp từng cặp ngón để ngón yếu được tập nhiều lần.",
    howTo: [
      "Trên mỗi dây: ngón 1, 2, 1, 2 rồi ngón 3, 4, 3, 4.",
      "Đi từ dây 6 xuống dây 1.",
      "Ngón 3 và ngón 4 phải ấn rõ như ngón 1 và ngón 2.",
    ],
    body: BODY_LITTLE_FINGER,
    tempo: tempo(50, 100),
    unlockAfter: "fretboard-basics",
    steps: stepsFromNotes(onEachString(STRING_NUMBERS_LOW_TO_HIGH, [1, 2, 1, 2, 3, 4, 3, 4])),
  }),
  drill({
    id: "string-skip",
    group: "picking",
    title: "Nhảy dây",
    goal: "Tay gảy trúng đúng dây khi phải nhảy qua một dây.",
    howTo: [
      "Ngón 1 bấm phím 1. Gảy theo thứ tự dây 6, 4, 5, 3, 4, 2, 3, 1.",
      "Rồi đi ngược lại từ dây 1 về dây 6.",
      "Nhìn dây kế tiếp trước khi gảy, phím gảy chỉ chạm đúng một dây.",
    ],
    body: BODY_PICKING,
    tempo: tempo(40, 80),
    unlockAfter: "open-strings",
    steps: stepsFromNotes(stringSkipNotes()),
  }),
  drill({
    id: "alternate",
    group: "picking",
    title: "Gảy xen kẽ",
    goal: "Gảy xuống và gảy lên đều tay trên cùng một chuỗi nốt.",
    howTo: [
      "Chơi spider 1-2-3-4 từ dây 6 xuống dây 1.",
      "Nốt thứ nhất gảy xuống (về phía sàn nhà), nốt thứ hai gảy lên (về phía mặt bạn), cứ thế xen kẽ.",
      "Mũi tên ↓ ↑ trên màn hình cho biết chiều gảy của nốt đang chơi.",
    ],
    body: BODY_PICKING,
    tempo: tempo(40, 90),
    unlockAfter: "pitch-and-rhythm",
    steps: stepsFromNotes(onEachString(STRING_NUMBERS_LOW_TO_HIGH, [1, 2, 3, 4]), { alternatePick: true }),
  }),
  drill({
    id: "burst",
    group: "strength",
    title: "Bốn nốt một phách",
    goal: "Chơi nhanh 4 nốt rồi nghỉ, để tay quen tốc độ mà không gồng.",
    howTo: [
      "Trên dây 6, chơi 1-2-3-4 thật đều trong đúng một tiếng tích.",
      "Nghỉ một tiếng tích, thả lỏng tay.",
      "Sang dây kế tiếp và làm lại.",
    ],
    body: BODY_FINGERTIPS,
    tempo: tempo(40, 70),
    unlockAfter: "clean-sounds",
    steps: burstSteps(),
  }),
];

export function getDrill(id: string): Drill | undefined {
  return FINGER_DRILLS.find((d) => d.id === id);
}
