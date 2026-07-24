"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";

type AdminGuardProps = {
  children: React.ReactNode;
};

export function AdminGuard({ children }: AdminGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { session, isLoading } = useAdminAuth();
  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (!session && !isLoginPage) {
      router.replace("/admin/login");
      return;
    }

    if (session && isLoginPage) {
      router.replace("/admin");
    }
  }, [isLoading, isLoginPage, router, session]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <p className="text-sm font-medium text-slate-500">로그인 상태를 확인하는 중입니다.</p>
      </div>
    );
  }

  if ((!session && !isLoginPage) || (session && isLoginPage)) {
    return null;
  }

  return <>{children}</>;
}
