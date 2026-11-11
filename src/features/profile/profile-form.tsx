"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { onboardingSchema, profileSchema, type OnboardingInput, type ProfileInput } from "@/lib/validation/schemas";
import { completeOnboarding, updateProfile } from "./actions";

type Option = { value: string | number; label: string; hint?: string };

function ChoiceGroup({
  legend,
  name,
  options,
  value,
  onChange,
  columns = 2,
}: {
  legend: string;
  name: string;
  options: Option[];
  value: unknown;
  onChange: (value: string | number) => void;
  columns?: 2 | 3 | 4;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-semibold">{legend}</legend>
      <div className={cn("grid gap-2", columns === 2 && "sm:grid-cols-2", columns === 3 && "sm:grid-cols-3", columns === 4 && "grid-cols-2 sm:grid-cols-4")}>
        {options.map((o) => {
          const checked = String(value) === String(o.value);
          return (
            <label
              key={String(o.value)}
              className={cn(
                "flex min-h-12 cursor-pointer flex-col justify-center rounded-lg border px-3 py-2 text-sm transition-colors",
                checked ? "border-foreground bg-muted ring-1 ring-foreground" : "hover:bg-muted",
              )}
            >
              <input
                type="radio"
                name={name}
                value={String(o.value)}
                checked={checked}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              <span className="font-medium">{o.label}</span>
              {o.hint && <span className="text-xs text-muted-foreground">{o.hint}</span>}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

const EXPERIENCE: Option[] = [
  { value: "complete_beginner", label: "Hoàn toàn mới", hint: "Chưa từng chơi guitar" },
  { value: "some_experience", label: "Đã thử một chút", hint: "Biết vài thứ nhưng chưa có nền tảng" },
];
const GUITAR: Option[] = [
  { value: "acoustic", label: "Acoustic", hint: "Dây sắt, có lỗ thoát âm. Bài học viết cho loại này" },
  { value: "classical", label: "Classic", hint: "Dây nylon. Học được, có ghi chú chỗ khác" },
  { value: "electric", label: "Đàn điện", hint: "Cắm amply. Học được, có ghi chú chỗ khác" },
];
const HANDEDNESS: Option[] = [
  { value: "right", label: "Tay phải gảy", hint: "Tay trái bấm hợp âm (phổ biến)" },
  { value: "left", label: "Tay trái gảy", hint: "Hình minh họa sẽ được lật gương" },
];
const GOALS: Option[] = [15, 30, 45, 60].map((m) => ({ value: m, label: `${m} phút`, hint: m === 30 ? "Khuyến nghị" : undefined }));
const TARGETS: Option[] = [
  { value: "learn_from_zero", label: "Học guitar từ con số 0" },
  { value: "accompany_songs", label: "Đệm hát được những bài đơn giản" },
];


export function OnboardingForm() {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const form = useForm<OnboardingInput>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      experience: "complete_beginner",
      guitarType: "acoustic",
      handedness: "right",
      practiceGoalMinutes: 30,
      learningTarget: "learn_from_zero",
    },
  });
  const v = form.watch();

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          setError(null);
          const r = await completeOnboarding(values);
          if (r && !r.ok) setError(r.error);
        }),
        (errors) => setError(`Hãy kiểm tra lại: ${Object.keys(errors).join(", ")}`),
      )}
    >
      <ChoiceGroup legend="Kinh nghiệm của bạn" name="experience" options={EXPERIENCE} value={v.experience} onChange={(x) => form.setValue("experience", x as never, { shouldDirty: true })} />
      <ChoiceGroup legend="Loại đàn bạn có" name="guitarType" options={GUITAR} value={v.guitarType} onChange={(x) => form.setValue("guitarType", x as never, { shouldDirty: true })} columns={3} />
      <ChoiceGroup legend="Bạn gảy bằng tay nào?" name="handedness" options={HANDEDNESS} value={v.handedness} onChange={(x) => form.setValue("handedness", x as never, { shouldDirty: true })} />
      <ChoiceGroup
        legend="Mục tiêu luyện tập mỗi ngày"
        name="practiceGoalMinutes"
        options={GOALS}
        value={v.practiceGoalMinutes} onChange={(x) => form.setValue("practiceGoalMinutes", x as never, { shouldDirty: true })}
        columns={4}
      />
      <ChoiceGroup legend="Bạn muốn đạt được gì?" name="learningTarget" options={TARGETS} value={v.learningTarget} onChange={(x) => form.setValue("learningTarget", x as never, { shouldDirty: true })} />
      {error && (
        <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" className="h-11 w-full text-base" disabled={pending}>
        {pending ? "Đang lưu…" : "Bắt đầu học"}
      </Button>
    </form>
  );
}

export function ProfileForm({ defaults }: { defaults: ProfileInput }) {
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const [pending, startTransition] = useTransition();
  const form = useForm<ProfileInput>({ resolver: zodResolver(profileSchema), defaultValues: defaults });
  const v = form.watch();

  return (
    <form
      className="space-y-6"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const r = await updateProfile(values);
          setMessage(r.ok ? { ok: true, text: "Đã lưu hồ sơ." } : { ok: false, text: r.error });
        }),
      )}
    >
      <div className="space-y-1.5">
        <Label htmlFor="displayName">Tên hiển thị</Label>
        <Input id="displayName" className="h-11" {...form.register("displayName")} />
        {form.formState.errors.displayName && (
          <p className="text-sm text-destructive">{form.formState.errors.displayName.message}</p>
        )}
      </div>
      <ChoiceGroup legend="Bạn gảy bằng tay nào?" name="handedness" options={HANDEDNESS} value={v.handedness} onChange={(x) => form.setValue("handedness", x as never, { shouldDirty: true })} />
      <ChoiceGroup legend="Loại đàn" name="guitarType" options={GUITAR} value={v.guitarType} onChange={(x) => form.setValue("guitarType", x as never, { shouldDirty: true })} columns={3} />
      <ChoiceGroup
        legend="Mục tiêu luyện tập mỗi ngày"
        name="practiceGoalMinutes"
        options={GOALS}
        value={v.practiceGoalMinutes} onChange={(x) => form.setValue("practiceGoalMinutes", x as never, { shouldDirty: true })}
        columns={4}
      />
      <ChoiceGroup legend="Kinh nghiệm" name="experience" options={EXPERIENCE} value={v.experience} onChange={(x) => form.setValue("experience", x as never, { shouldDirty: true })} />
      <ChoiceGroup legend="Mục tiêu học" name="learningTarget" options={TARGETS} value={v.learningTarget} onChange={(x) => form.setValue("learningTarget", x as never, { shouldDirty: true })} />
      {message && (
        <p role="status" className={cn("rounded-lg p-3 text-sm", message.ok ? "bg-accent" : "bg-destructive/10 text-destructive")}>
          {message.text}
        </p>
      )}
      <Button type="submit" className="h-11" disabled={pending}>
        {pending ? "Đang lưu…" : "Lưu thay đổi"}
      </Button>
    </form>
  );
}
