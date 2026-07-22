import Link from "next/link";

export default function AdminLoginPage() {
  return (
    <section className="mx-auto max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
        Admin Login
      </p>
      <h1 className="mt-3 text-2xl font-bold text-slate-950">관리자 로그인</h1>
      <p className="mt-3 text-sm leading-6 text-slate-600">
        인증 기능은 이번 범위에서 제외했습니다. 다음 단계에서 Supabase Auth와
        보호 라우팅을 연결합니다.
      </p>
      <div className="mt-6 grid gap-3">
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          이메일
          <input
            disabled
            className="h-11 rounded-md border border-slate-200 bg-slate-50 px-3 text-slate-500"
            placeholder="admin@example.com"
            type="email"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium text-slate-700">
          비밀번호
          <input
            disabled
            className="h-11 rounded-md border border-slate-200 bg-slate-50 px-3 text-slate-500"
            placeholder="추후 구현"
            type="password"
          />
        </label>
      </div>
      <Link
        href="/admin"
        className="mt-6 inline-flex h-11 items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
      >
        대시보드로 돌아가기
      </Link>
    </section>
  );
}
