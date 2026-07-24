"use client";

import { LockKeyhole } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { centerStaticInfo } from "@/data/center";
import { signInAdmin } from "@/services/auth";

const ICON_STROKE = 1.8;

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await signInAdmin(password);
      router.replace("/admin");
      router.refresh();
    } catch (loginError) {
      const message =
        loginError instanceof Error ? loginError.message : "로그인에 실패했습니다.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-5 py-10">
      <section className="w-full max-w-sm rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <Image
            src={centerStaticInfo.logo}
            alt="센터 로고"
            width={44}
            height={44}
            className="size-11 rounded-md object-contain"
            priority
          />
          <div>
            <p className="text-base font-bold text-stone-950">센터 관리자</p>
            <p className="text-xs font-medium text-stone-500">로그인</p>
          </div>
        </div>

        <div className="mt-7">
          <div className="mb-4 flex size-10 items-center justify-center rounded-md bg-teal-50 text-teal-800">
            <LockKeyhole aria-hidden="true" size={20} strokeWidth={ICON_STROKE} />
          </div>
          <h1 className="text-2xl font-bold text-stone-950">관리자 로그인</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">
            등록된 관리자 계정으로 로그인합니다.
          </p>
        </div>

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-bold text-stone-800">
            비밀번호
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
              required
              className="h-11 rounded-md border border-stone-300 bg-white px-3 text-sm text-stone-950 transition focus:border-teal-700 focus:outline-none disabled:bg-stone-50 disabled:text-stone-400"
              placeholder="비밀번호 입력"
            />
          </label>

          {error ? (
            <p className="rounded-md bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex h-11 items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:bg-stone-300 active:bg-teal-900">
            {isSubmitting ? "로그인 중" : "로그인"}
          </button>
        </form>
      </section>
    </main>
  );
}
