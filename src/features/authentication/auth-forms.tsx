"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signInSchema, signUpSchema, type SignInInput, type SignUpInput } from "@/lib/validation/schemas";
import { signIn, signUp } from "./actions";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-sm text-destructive">{message}</p>;
}

export function LoginForm({ next, initialError }: { next?: string; initialError?: string }) {
  const [serverError, setServerError] = useState<string | null>(initialError ?? null);
  const [pending, startTransition] = useTransition();
  const form = useForm<SignInInput>({ resolver: zodResolver(signInSchema), defaultValues: { email: "", password: "" } });

  const onSubmit = form.handleSubmit((values) => {
    setServerError(null);
    startTransition(async () => {
      const result = await signIn(values, next);
      if (result && !result.ok) setServerError(result.error);
    });
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" className="h-11" {...form.register("email")} />
        <FieldError message={form.formState.errors.email?.message} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Mật khẩu</Label>
        <Input id="password" type="password" autoComplete="current-password" className="h-11" {...form.register("password")} />
        <FieldError message={form.formState.errors.password?.message} />
      </div>
      {serverError && (
        <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {serverError}
        </p>
      )}
      <Button type="submit" className="h-11 w-full text-base" disabled={pending}>
        {pending ? "Đang đăng nhập…" : "Đăng nhập"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Chưa có tài khoản?{" "}
        <Link href="/register" className="font-medium text-foreground underline underline-offset-4">
          Đăng ký
        </Link>
      </p>
    </form>
  );
}

export function RegisterForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [pending, startTransition] = useTransition();
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { displayName: "", email: "", password: "" },
  });

  const onSubmit = form.handleSubmit((values) => {
    setServerError(null);
    startTransition(async () => {
      const result = await signUp(values);
      if (!result) return;
      if (!result.ok) setServerError(result.error);
      else if (result.data?.needsConfirmation) setNeedsConfirmation(true);
    });
  });

  if (needsConfirmation) {
    return (
      <div role="status" className="space-y-2 border-l-2 border-foreground/40 pl-4 text-sm">
        <p className="font-semibold">Kiểm tra hộp thư của bạn</p>
        <p className="text-muted-foreground">
          Chúng tôi đã gửi email xác nhận tới <strong>{form.getValues("email")}</strong>. Mở liên kết trong email để kích hoạt
          tài khoản, sau đó bạn sẽ được đưa tới phần thiết lập ban đầu.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="displayName">Tên hiển thị</Label>
        <Input id="displayName" autoComplete="nickname" className="h-11" {...form.register("displayName")} />
        <FieldError message={form.formState.errors.displayName?.message} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" className="h-11" {...form.register("email")} />
        <FieldError message={form.formState.errors.email?.message} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="password">Mật khẩu</Label>
        <Input id="password" type="password" autoComplete="new-password" className="h-11" {...form.register("password")} />
        <FieldError message={form.formState.errors.password?.message} />
        <p className="text-xs text-muted-foreground">Ít nhất 8 ký tự.</p>
      </div>
      {serverError && (
        <p role="alert" className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {serverError}
        </p>
      )}
      <Button type="submit" className="h-11 w-full text-base" disabled={pending}>
        {pending ? "Đang tạo tài khoản…" : "Tạo tài khoản"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Đã có tài khoản?{" "}
        <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
          Đăng nhập
        </Link>
      </p>
    </form>
  );
}
