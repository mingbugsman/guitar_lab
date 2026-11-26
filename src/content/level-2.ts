import { STRUM_PRESETS } from "@/lib/practice/strum-pattern";
import { AT_60 } from "./chord-lesson";
import type { Lesson } from "./types";

/**
 * LEVEL 2 — RHYTHM & STRUMMING (MVP 0.2): 4/4, then 3/4.
 * Level 0 taught down/up on one string and counting "1 và 2 và". Here the pick crosses a whole
 * chord, the hand learns to keep moving when it does not touch the strings, and the learner
 * ends by changing chords every bar under one strumming pattern: enough to accompany a song.
 * Arrows: ↓ = toward the floor (string 6 → 1), ↑ = toward the face, as on the fretboard picture.
 */
const { quarters, eighths, downDownUp, folk, waltzDowns, waltz } = STRUM_PRESETS;

export const LEVEL_2_LESSONS: Lesson[] = [
  {
    slug: "strum-down-up",
    levelId: "level-2",
    order: 1,
    title: "Gảy xuống và gảy lên cả hợp âm",
    summary: "Gảy bằng cổ tay: xuống đủ dây và chắc tiếng, lên nhẹ trên mấy dây mảnh.",
    minutes: 12,
    objectives: [
      "Gảy xuống cả hợp âm (nhiều nốt vang cùng lúc) bằng cổ tay, không vung cả cánh tay.",
      "Gảy lên nhẹ hơn, chỉ chạm 3 đến 4 dây mảnh.",
      `Gảy xuống mỗi phách (nhịp đập đều của bài nhạc) một lần, rồi xuống lên đều, ${AT_60}.`,
    ],
    prerequisites: ["chord-e7"],
    blocks: [
      {
        type: "text",
        heading: "Gảy cả hợp âm",
        paragraphs: [
          "Ở Level 0 bạn đã gảy xuống, lên trên từng dây. Giờ phím gảy (miếng nhựa nhỏ để gảy, hoặc đầu ngón cái) quét qua nhiều dây trong một cú.",
          "Gảy xuống: tay đi về phía sàn nhà, bắt đầu từ dây trầm nhất của hợp âm (dây 6 với Em và G) và đi hết đến dây 1. Đây là cú chính, chắc tiếng.",
          "Gảy lên: tay đi về phía mặt bạn, nhẹ hơn, chỉ chạm 3 đến 4 dây mảnh (dây 1, 2, 3, có khi dây 4). Không cần gảy lên đủ 6 dây.",
          "Chuyển động đến từ cổ tay, giống như vẩy nước khỏi tay. Cánh tay chỉ đưa nhẹ theo.",
        ],
      },
      {
        type: "visual",
        visual: { kind: "strumPattern", strokes: quarters.strokes, chords: ["em"], bpm: 60 },
        caption: "Bốn cú xuống trên Em: mỗi tiếng tích một cú. Giữa hai cú, tay đi lên trong không khí (mũi tên mờ). Bấm 'Bắt đầu', nghe 4 tiếng tích chuẩn bị rồi gảy cùng.",
      },
      {
        type: "visual",
        visual: { kind: "strumPattern", strokes: eighths.strokes, chords: ["em"], bpm: 60 },
        caption: "Xuống lên đều: xuống ở số, lên ở chữ 'và'. Khi đã theo kịp, bấm 'Tiếng đàn mẫu: bật' để tắt tiếng mẫu và tự gảy theo tiếng tích.",
      },
      {
        type: "callout",
        tone: "compare",
        text: "Trên hình cần đàn, dây 6 ở hàng trên cùng, gần mặt bạn. Mũi tên ↓ là đi từ hàng trên cùng xuống hàng dưới cùng; trên đàn thật đó là tay bạn đi về phía sàn nhà.",
      },
      {
        type: "callout",
        tone: "body",
        text: "{PickHand} gồng cứng và cổ tay mỏi sau vài phút là bình thường lúc đầu. Thường mất 3 đến 5 buổi tập để cú gảy nhẹ và đều. Dừng lại nếu đau ở cổ tay hoặc cẳng tay: thả lỏng, lắc nhẹ tay rồi mới tập tiếp, hoặc để mai.",
      },
    ],
    practice: {
      minutes: 8,
      steps: [
        "Bấm Em và gảy xuống mỗi tiếng tích một lần, trong 4 ô nhịp (mỗi ô nhịp là một nhóm 4 phách).",
        "Vẫn Em: gảy xuống ở số, lên ở chữ 'và', trong 4 ô nhịp. Đếm to '1 và 2 và 3 và 4 và'.",
        "Tắt tiếng đàn mẫu, chỉ gảy theo tiếng tích. Làm lại với G.",
      ],
    },
    mistakes: [
      {
        mistake: "Gảy lên to và đục như gảy xuống.",
        fix: "Gảy lên chỉ cần chạm mấy dây mảnh. Cho phím gảy lướt nhẹ, đừng cố kéo qua đủ 6 dây.",
      },
      {
        mistake: "Cả cánh tay vung lên xuống, nhanh mỏi.",
        fix: "Giữ khuỷu tay gần như yên, để cổ tay làm việc như khi vẩy nước khỏi tay.",
      },
      {
        mistake: "Phím gảy văng khỏi tay hoặc xoay lệch.",
        fix: "Kẹp phím gảy giữa ngón cái và cạnh ngón trỏ, chỉ để lộ đầu nhọn khoảng 2 đến 3 mm, và cho nó chạm dây nông.",
      },
    ],
    stuck: {
      smaller: "Chưa cần tiếng tích. Gảy xuống chậm trên Em theo ý bạn, 8 lần, chỉ để ý cổ tay mềm. Khi tay nhẹ rồi mới bật máy ở 50 BPM.",
      back: [{ slug: "pitch-and-rhythm", why: "ôn đếm '1 và 2 và' theo máy đếm nhịp" }],
    },
    checklist: [
      { id: "down", label: "Tôi gảy xuống Em mỗi tiếng tích một lần, 4 ô nhịp liền ở 60 BPM." },
      { id: "eighths", label: "Tôi gảy xuống, lên đều trên Em, cú gảy xuống trùng tiếng tích, 4 ô nhịp liền." },
      { id: "light", label: "Tôi gảy lên chỉ chạm mấy dây mảnh, tiếng nhẹ hơn cú gảy xuống." },
    ],
    assessment: ["Gảy xuống, lên đều trên G ở 60 BPM, 8 ô nhịp không lệch tiếng tích."],
    mastery: ["Gảy xuống, lên đều ở 80 BPM, tay thả lỏng suốt 2 phút."],
  },
  {
    slug: "strum-steady-hand",
    levelId: "level-2",
    order: 2,
    title: "Tay gảy đi đều như con lắc",
    summary: "Tay không bao giờ dừng: lúc chạm dây, lúc lướt qua phía trên mà không chạm.",
    minutes: 12,
    objectives: [
      "Giữ tay gảy đi xuống ở mỗi số, đi lên ở mỗi chữ 'và', cả khi không chạm dây.",
      `Chơi mẫu ↓ ↓↑ ↓ ↓↑ trên G ${AT_60}.`,
      "Nhận ra mũi tên mờ trên hình là lúc tay đi mà không chạm dây.",
    ],
    prerequisites: ["strum-down-up"],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Bí quyết của mọi mẫu gảy: tay gảy đi xuống ở mỗi số và đi lên ở mỗi chữ 'và', đều như con lắc, không bao giờ dừng. Mẫu gảy chỉ quyết định lúc nào phím gảy (miếng nhựa nhỏ để gảy) chạm dây, lúc nào lướt qua phía trên dây.",
          "Nhờ tay không dừng, bạn không bị lệch khỏi tiếng tích khi mẫu có chỗ nghỉ.",
          "Mẫu hôm nay đếm '1 và 2 và 3 và 4 và', có cú gảy ở: 1, 2, và, 3, 4, và. Ở chữ 'và' ngay sau số 1 và số 3, tay vẫn đi lên nhưng không chạm dây.",
        ],
      },
      {
        type: "visual",
        visual: { kind: "strumPattern", strokes: downDownUp.strokes, chords: ["g"], bpm: 60 },
        caption: "Mũi tên mờ, viền đứt: tay vẫn đi lên, chỉ là không chạm dây. Bấm 'Bắt đầu' và làm theo bằng tay không trước, chưa cần đàn.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Lần đầu, làm động tác không cần đàn: tay đung đưa trước bụng theo tiếng tích, nói to 'xuống' ở số, 'lên' ở chữ 'và'. Khi động tác đều mới cầm đàn.",
      },
      {
        type: "callout",
        tone: "body",
        text: "Cổ tay mỏi sau vài phút là bình thường khi {pickHand} chạy liên tục. Thường mất 3 đến 6 buổi tập để tay đi đều mà không cần nghĩ. Dừng lại khi cổ tay hoặc cẳng tay đau: lắc nhẹ tay và nghỉ vài phút.",
      },
    ],
    practice: {
      minutes: 8,
      steps: [
        "Chưa cầm đàn: đung đưa tay theo hình ở trên 2 ô nhịp (mỗi ô nhịp là một nhóm 4 phách), nói 'xuống, lên' theo tay.",
        "Bấm G, chơi mẫu ↓ ↓↑ ↓ ↓↑ cùng tiếng đàn mẫu, 4 ô nhịp.",
        "Tắt tiếng đàn mẫu, chơi 4 ô nhịp chỉ với tiếng tích.",
        "Đổi sang C, chơi thêm 4 ô nhịp.",
      ],
    },
    mistakes: [
      {
        mistake: "Tay dừng lại chờ ở chỗ mũi tên mờ, rồi bị lệch tiếng tích.",
        fix: "Tay vẫn phải đi lên ở chữ 'và' đó, chỉ nhấc phím gảy cao hơn dây một chút. Đừng để tay đứng yên.",
      },
      {
        mistake: "Gảy trúng dây ở chỗ không được chạm.",
        fix: "Lúc đi lên không chạm, đưa tay ra xa mặt đàn hơn khoảng một đốt ngón tay.",
      },
    ],
    stuck: {
      smaller: "Chỉ chơi phần đầu ↓ ↓↑ (1, 2, và), rồi để tay đi không chạm dây cho hết ô nhịp. Lặp 4 lần. Khi đều tay mới chơi cả mẫu.",
      back: [{ slug: "strum-down-up", why: "ôn gảy xuống, lên đều trên Em" }],
    },
    checklist: [
      { id: "air", label: "Tôi đung đưa tay theo tiếng tích, xuống ở số, lên ở chữ 'và', 2 ô nhịp không dừng." },
      { id: "pattern", label: "Tôi chơi ↓ ↓↑ ↓ ↓↑ trên G 4 ô nhịp, không có tiếng đàn mẫu." },
      { id: "miss", label: "Tôi lướt qua dây mà không chạm ở chữ 'và' sau số 1 và số 3." },
    ],
    assessment: ["Chơi ↓ ↓↑ ↓ ↓↑ trên G 4 ô nhịp rồi trên C 4 ô nhịp, ở 60 BPM không lệch."],
    mastery: ["Chơi mẫu này ở 80 BPM, vừa chơi vừa đếm to."],
  },
  {
    slug: "strum-first-pattern",
    levelId: "level-2",
    order: 3,
    title: "Mẫu gảy đầu tiên: ↓ ↓↑ ↑↓↑",
    summary: "Mẫu gảy có mặt trong rất nhiều bài hát: xuống, xuống lên, lên, xuống lên.",
    minutes: 15,
    objectives: [
      "Chơi mẫu ↓ ↓↑ ↑↓↑ trên một hợp âm (nhiều nốt vang cùng lúc), tay đi đều không dừng.",
      `Giữ mẫu đều 4 ô nhịp (mỗi ô nhịp là một nhóm 4 phách) ${AT_60}.`,
      "Chỉ ra được chỗ tay đi xuống mà không chạm dây.",
    ],
    prerequisites: ["strum-steady-hand"],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Mẫu này rất hay gặp khi đệm guitar cho bài hát. Đếm '1 và 2 và 3 và 4 và', cú gảy ở: 1, 2, và, và, 4, và.",
          "Chỗ khó là số 3: tay đi xuống ở số 3 nhưng không chạm dây, rồi gảy lên ngay ở chữ 'và' sau đó. Vì vậy có hai cú gảy lên gần nhau, ở giữa là một cú xuống lướt qua.",
          "Đọc mẫu theo tay: xuống, xuống lên, hụt lên, xuống lên.",
        ],
      },
      {
        type: "visual",
        visual: { kind: "strumPattern", strokes: folk.strokes, chords: ["g"], bpm: 60 },
        caption: "Để ý số 3: ô có mũi tên mờ, tay đi xuống nhưng không chạm dây. Bắt đầu ở 60 BPM, quen rồi bấm + để tăng dần.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Nói nhỏ theo tay khi chơi: 'xuống, xuống lên, hụt lên, xuống lên'. Miệng giữ nhịp giúp tay.",
      },
      {
        type: "callout",
        tone: "body",
        text: "Mẫu này lúc đầu hay làm tay rối ở số 3; chơi được vài ô nhịp rồi lệch là bình thường. Thường mất 4 đến 7 buổi tập để chơi đều không cần nghĩ. Dừng lại khi cổ tay mỏi hoặc đau, nghỉ vài phút rồi tập tiếp ở tốc độ chậm hơn.",
      },
    ],
    practice: {
      minutes: 10,
      steps: [
        "Chưa cầm đàn: đung đưa tay theo mẫu 2 ô nhịp, nói 'xuống, xuống lên, hụt lên, xuống lên'.",
        "Bấm G, chơi mẫu cùng tiếng đàn mẫu ở 60 BPM, 4 ô nhịp.",
        "Tắt tiếng đàn mẫu, chơi 4 ô nhịp chỉ với tiếng tích.",
        "Làm lại với C, rồi với Em.",
      ],
    },
    mistakes: [
      {
        mistake: "Đến số 3 tay dừng lại hoặc gảy trúng dây.",
        fix: "Ở số 3, tay vẫn đi xuống nhưng nhấc phím gảy (miếng nhựa nhỏ để gảy) ra khỏi dây. Tập riêng đoạn '2 và 3 và' thật chậm.",
      },
      {
        mistake: "Mẫu nhanh dần, đuổi kịp tiếng tích rồi vượt lên.",
        fix: "Giảm về 50 BPM. Để tiếng tích dẫn: cú gảy xuống ở số 1 phải rơi đúng tiếng tích to.",
      },
    ],
    stuck: {
      smaller: "Chơi nửa đầu ↓ ↓↑ (1, 2, và), rồi để tay đi không chạm dây cho hết ô nhịp. Khi nửa đầu đều, thêm nửa sau ↑↓↑.",
      back: [{ slug: "strum-steady-hand", why: "ôn giữ tay đi đều khi không chạm dây" }],
    },
    checklist: [
      { id: "say", label: "Tôi đung đưa tay theo mẫu và nói to từng cú, 2 ô nhịp không vấp." },
      { id: "guided", label: "Tôi chơi ↓ ↓↑ ↑↓↑ trên G cùng tiếng đàn mẫu, 4 ô nhịp không lệch." },
      { id: "alone", label: "Tôi chơi mẫu 4 ô nhịp chỉ với tiếng tích, ở 60 BPM." },
    ],
    assessment: ["Chơi ↓ ↓↑ ↑↓↑ trên G, C và Em, mỗi hợp âm 4 ô nhịp, ở 60 BPM không dừng."],
    mastery: ["Chơi mẫu ở 90 BPM trong 2 phút, tay thả lỏng."],
  },
  {
    slug: "strum-first-progression",
    levelId: "level-2",
    order: 4,
    title: "Vòng hợp âm đầu tiên: G – Em – C – D",
    summary: "Bốn hợp âm, mỗi cái một ô nhịp, cùng một mẫu gảy: đủ để đệm nhiều bài hát.",
    minutes: 15,
    objectives: [
      "Đổi hợp âm (nhiều nốt vang cùng lúc) mỗi ô nhịp (một nhóm 4 phách, mỗi phách một tiếng tích) mà tay gảy không dừng.",
      `Chơi vòng G, Em, C, D với mẫu ↓ ↓↑ ↑↓↑ ${AT_60}.`,
      "Nhấc tay bấm sớm ở chữ 'và' cuối ô nhịp để kịp hợp âm mới.",
    ],
    prerequisites: ["strum-first-pattern"],
    blocks: [
      {
        type: "text",
        paragraphs: [
          "Một vòng hợp âm (vài hợp âm nối nhau rồi lặp lại) là phần đệm của bài hát. G, Em, C, D là một vòng rất hay gặp trong nhạc pop và ballad.",
          "Mỗi hợp âm giữ một ô nhịp, đổi sang hợp âm mới đúng số 1. Tay gảy vẫn chạy mẫu không dừng; chỉ tay bấm đổi chỗ.",
          "Mẹo đổi kịp: ở chữ 'và' cuối cùng của ô nhịp, nhấc tay bấm khỏi dây và đi sang hợp âm mới. Cú gảy lên lúc đó vang các dây không bấm, nghe vẫn tự nhiên.",
        ],
      },
      {
        type: "visual",
        visual: { kind: "strumPattern", strokes: quarters.strokes, chords: ["g", "em", "c", "d"], bpm: 60 },
        caption: "Bước dễ trước: bốn cú xuống mỗi ô nhịp. Giữa hai cú còn nhiều thời gian để đổi tay.",
      },
      {
        type: "visual",
        visual: { kind: "strumPattern", strokes: folk.strokes, chords: ["g", "em", "c", "d"], bpm: 60 },
        caption: "Mẫu đầy đủ trên cả vòng. Nhìn chữ 'tiếp theo' để chuẩn bị tay bấm trước khi tới số 1.",
      },
      {
        type: "callout",
        tone: "body",
        text: "Hợp âm mới chưa sạch ở cú gảy đầu tiên là bình thường khi mới tập đổi theo nhịp. Thường mất 5 đến 10 buổi tập để cả vòng trôi chảy. Dừng lại khi đầu ngón tay bấm rát hoặc cổ tay mỏi: tay cần nghỉ để nhớ động tác.",
      },
    ],
    practice: {
      minutes: 10,
      steps: [
        "Chơi vòng với bốn cú xuống, cùng tiếng đàn mẫu, 2 vòng.",
        "Chuyển sang mẫu ↓ ↓↑ ↑↓↑, chơi 2 vòng cùng tiếng đàn mẫu.",
        "Tắt tiếng đàn mẫu, chơi 2 vòng chỉ với tiếng tích. Tay gảy không dừng kể cả khi tay bấm chưa kịp.",
        "Cặp hợp âm nào hay vấp, tập riêng cặp đó bằng 'Đổi hợp âm 1 phút' ở trang Công cụ.",
      ],
    },
    mistakes: [
      {
        mistake: "Tay gảy dừng lại chờ tay bấm đặt xong.",
        fix: "Cứ gảy tiếp, kể cả khi hợp âm mới chưa đủ ngón. Giữ nhịp quan trọng hơn hợp âm sạch; sạch sẽ đến sau.",
      },
      {
        mistake: "Đổi hợp âm trễ, cú gảy ở số 1 vẫn là hợp âm cũ.",
        fix: "Nhấc tay bấm sớm hơn, ở chữ 'và' cuối ô nhịp. Nhìn chữ 'tiếp theo' trên hình để biết trước hợp âm sắp tới.",
      },
    ],
    stuck: {
      smaller: "Chỉ dùng hai hợp âm G và C, mỗi cái một ô nhịp, với bốn cú xuống. Khi đổi kịp 4 lần liền, thêm Em, rồi thêm D.",
      back: [
        { slug: "strum-first-pattern", why: "ôn mẫu ↓ ↓↑ ↑↓↑ trên một hợp âm" },
        { slug: "chord-g", why: "đo 1 phút đổi C – G" },
      ],
    },
    checklist: [
      { id: "quarters", label: "Tôi chơi vòng G, Em, C, D với bốn cú xuống, 2 vòng không dừng." },
      { id: "pattern", label: "Tôi chơi vòng với mẫu ↓ ↓↑ ↑↓↑ cùng tiếng đàn mẫu, 2 vòng." },
      { id: "alone", label: "Tôi chơi vòng với mẫu đầy đủ chỉ với tiếng tích, tay gảy không dừng." },
    ],
    assessment: ["Chơi vòng G, Em, C, D với mẫu ↓ ↓↑ ↑↓↑ 4 vòng liền ở 60 BPM, đổi hợp âm đúng số 1."],
    mastery: ["Chơi vòng này ở 80 BPM và hát nhẩm theo một bài quen dùng cùng vòng hợp âm."],
  },
  {
    slug: "strum-three-four",
    levelId: "level-2",
    order: 5,
    title: "Nhịp 3/4: đếm 1 2 3",
    summary: "Mỗi ô nhịp ba phách, phách 1 mạnh: nhịp của điệu valse và nhiều bài hát ru.",
    minutes: 12,
    objectives: [
      `Đếm đều '1 2 3' ${AT_60}, gảy mạnh hơn ở phách (nhịp đập đều của bài nhạc) thứ nhất.`,
      "Chơi ba cú xuống ↓ ↓ ↓, rồi mẫu ↓ ↓↑ ↓↑, trong nhịp 3/4.",
      "Đổi hợp âm (nhiều nốt vang cùng lúc) mỗi ô nhịp (một nhóm 3 phách) trên vòng G, C, D, G.",
    ],
    prerequisites: ["strum-first-progression"],
    blocks: [
      {
        type: "text",
        heading: "Ba phách một ô nhịp",
        paragraphs: [
          "Nhịp 4/4 bạn đã chơi có 4 phách mỗi ô nhịp. Nhịp 3/4 chỉ có 3: đếm '1 2 3, 1 2 3'. Đây là nhịp của điệu valse (nhạc khiêu vũ xoay vòng) và của nhiều bài hát ru.",
          "Phách 1 là phách mạnh: gảy chắc tay hơn một chút. Phách 2 và 3 là phách nhẹ. Máy đếm nhịp cũng gõ phách 1 to hơn để bạn nghe ra đầu ô nhịp.",
          "Tay gảy vẫn như con lắc: xuống ở số, lên ở chữ 'và'. Chỉ khác là cứ sau số 3 lại quay về số 1.",
        ],
      },
      {
        type: "visual",
        visual: { kind: "strumPattern", strokes: waltzDowns.strokes, chords: ["g"], bpm: 60 },
        caption: "Ba cú xuống: cú ở số 1 to hơn. Nghe 3 tiếng tích chuẩn bị rồi gảy cùng.",
      },
      {
        type: "visual",
        visual: { kind: "strumPattern", strokes: waltz.strokes, chords: ["g", "c", "d", "g"], bpm: 60 },
        caption: "Mẫu ↓ ↓↑ ↓↑ trên vòng G, C, D, G: mỗi hợp âm một ô nhịp 3 phách.",
      },
      {
        type: "callout",
        tone: "tip",
        text: "Đếm to '1 2 3' và nhún nhẹ đầu gối ở số 1. Cơ thể cảm được phách mạnh thì tay gảy tự nhấn theo.",
      },
      {
        type: "callout",
        tone: "body",
        text: "Lúc đầu tay quen 4 phách nên hay gảy thừa một phách; chơi lệch vài ô nhịp là bình thường. Thường mất 2 đến 4 buổi tập để cảm nhịp 3/4 tự nhiên. Dừng lại khi cổ tay mỏi, nghỉ vài phút rồi tập tiếp chậm hơn.",
      },
    ],
    practice: {
      minutes: 8,
      steps: [
        "Vỗ tay theo máy đếm nhịp, vỗ mạnh ở số 1, đếm to '1 2 3' trong 4 ô nhịp.",
        "Bấm G, chơi ba cú xuống, cú ở số 1 mạnh hơn, 4 ô nhịp.",
        "Chơi mẫu ↓ ↓↑ ↓↑ trên vòng G, C, D, G cùng tiếng đàn mẫu, 2 vòng.",
        "Tắt tiếng đàn mẫu, chơi 2 vòng chỉ với tiếng tích.",
      ],
    },
    mistakes: [
      {
        mistake: "Gảy thêm một phách như nhịp 4/4, bị lệch ô nhịp.",
        fix: "Đếm to '1 2 3' khi chơi. Số 1 luôn trùng tiếng tích to của máy; cú gảy mạnh không rơi vào tiếng tích to là đã thừa phách.",
      },
      {
        mistake: "Phách nào cũng to như nhau.",
        fix: "Ở số 1 cho phím gảy (miếng nhựa nhỏ để gảy) đi sâu hơn một chút; ở số 2 và 3 gảy nông và nhẹ.",
      },
    ],
    stuck: {
      smaller: "Chưa cần đổi hợp âm. Giữ G, chỉ gảy một cú ở số 1 rồi để đàn ngân hết số 2 và 3. Khi cảm được vòng '1 2 3' rồi mới gảy đủ ba cú.",
      back: [{ slug: "strum-first-progression", why: "ôn đổi hợp âm mỗi ô nhịp khi tay gảy không dừng" }],
    },
    checklist: [
      { id: "clap", label: "Tôi vỗ tay theo máy đếm nhịp, vỗ mạnh ở số 1, 4 ô nhịp 3 phách không lệch." },
      { id: "downs", label: "Tôi chơi ba cú xuống trên G, cú ở số 1 to hơn, 4 ô nhịp liền." },
      { id: "waltz", label: "Tôi chơi ↓ ↓↑ ↓↑ trên vòng G, C, D, G chỉ với tiếng tích, 2 vòng." },
    ],
    assessment: ["Chơi ↓ ↓↑ ↓↑ trên vòng G, C, D, G 4 vòng liền ở 60 BPM, cú gảy mạnh luôn rơi vào số 1."],
    mastery: ["Chơi vòng này ở 90 BPM, nghe rõ phách mạnh, không thừa không thiếu phách."],
  },
];
