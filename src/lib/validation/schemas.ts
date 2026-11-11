import { z } from "zod";

export const signUpSchema = z.object({
  displayName: z.string().trim().min(1, "Hãy nhập tên hiển thị").max(60, "Tối đa 60 ký tự"),
  email: z.email("Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu cần ít nhất 8 ký tự").max(72, "Mật khẩu tối đa 72 ký tự"),
});
export type SignUpInput = z.infer<typeof signUpSchema>;

export const signInSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(1, "Hãy nhập mật khẩu"),
});
export type SignInInput = z.infer<typeof signInSchema>;

export const onboardingSchema = z.object({
  experience: z.enum(["complete_beginner", "some_experience"]),
  guitarType: z.enum(["acoustic", "electric", "classical"]),
  handedness: z.enum(["right", "left"]),
  practiceGoalMinutes: z.number().int().min(10).max(120),
  learningTarget: z.enum(["learn_from_zero", "accompany_songs"]),
});
export type OnboardingInput = z.infer<typeof onboardingSchema>;

export const profileSchema = onboardingSchema.extend({
  displayName: z.string().trim().min(1, "Hãy nhập tên hiển thị").max(60),
});
export type ProfileInput = z.infer<typeof profileSchema>;

export const lessonSlugSchema = z.string().regex(/^[a-z0-9-]{1,80}$/);

export const lessonProgressSchema = z.object({
  slug: lessonSlugSchema,
  checklist: z.array(z.string().max(40)).max(20),
  status: z.enum(["learning", "practicing"]),
  selfRating: z.number().int().min(1).max(5).nullable(),
  complete: z.boolean(),
});
export type LessonProgressInput = z.infer<typeof lessonProgressSchema>;

export const completeActivitySchema = z.object({
  sessionId: z.uuid(),
  activityId: z.uuid(),
  actualSeconds: z.number().int().min(0).max(4 * 3600),
});

export const finishSessionSchema = z.object({
  sessionId: z.uuid(),
  durationSeconds: z.number().int().min(0).max(6 * 3600),
  notes: z.string().max(2000),
  focusRating: z.number().int().min(1).max(5).nullable(),
});

export type ActionResult<T = undefined> = { ok: true; data?: T } | { ok: false; error: string };

export const chordChangeRunSchema = z.object({
  chords: z.array(z.string().regex(/^[a-z0-9]{1,8}$/)).min(1).max(2),
  changes: z.number().int().min(0).max(400),
  seconds: z.number().int().min(10).max(600),
  countedBy: z.enum(["mic", "manual"]),
});
export type ChordChangeRunInput = z.infer<typeof chordChangeRunSchema>;

export const drillResultSchema = z.object({
  drillId: z.string().regex(/^[a-z0-9:-]{1,80}$/),
  kind: z.enum(["finger", "chord-challenge", "picking"]),
  bpmReached: z.number().int().min(20).max(300),
  rating: z.enum(["clean", "some-buzz", "lost"]),
  seconds: z.number().int().min(5).max(1800),
});
export type DrillResultInput = z.infer<typeof drillResultSchema>;
