"use client";

import { Bell, Home, LayoutDashboard, LogOut, Menu, Users, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { centerStaticInfo } from "@/data/center";
import { signOutAdmin } from "@/services/auth";

const ICON_STROKE = 1.8;

type AdminNavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
};

const adminNavItems: AdminNavItem[] = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/notices", label: "공지사항", icon: Bell },
  { href: "/admin/teachers", label: "선생님 관리", icon: Users },
  { href: "/admin/center-info", label: "센터 정보", icon: Home },
];

const pageTitles: Record<string, string> = {
  "/admin": "대시보드",
  "/admin/notices": "공지사항",
  "/admin/teachers": "선생님 관리",
  "/admin/center-info": "센터 정보",
};

type AdminShellProps = {
  children: React.ReactNode;
};

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const pageTitle = pageTitles[pathname] ?? "관리자";

  useEffect(() => {
    if (!isDrawerOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isDrawerOpen]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (isDrawerOpen && drawerRef.current && !drawerRef.current.contains(event.target as Node)) {
        setIsDrawerOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsDrawerOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen]);

  const handleSignOut = async () => {
    if (isSigningOut) {
      return;
    }

    setIsSigningOut(true);

    try {
      await signOutAdmin();
      router.replace("/admin/login");
      router.refresh();
    } finally {
      setIsSigningOut(false);
    }
  };

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950 lg:grid lg:grid-cols-[232px_minmax(0,1fr)]">
      <aside className="hidden border-r border-slate-200 bg-white lg:sticky lg:top-0 lg:block lg:h-screen">
        <AdminSidebar pathname={pathname} />
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur md:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <button
              type="button"
              aria-label="관리자 메뉴 열기"
              onClick={() => setIsDrawerOpen(true)}
              className="inline-flex size-10 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:border-teal-300 hover:text-teal-700 lg:hidden">
              <Menu aria-hidden="true" size={20} strokeWidth={ICON_STROKE} />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold text-slate-950">{pageTitle}</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="inline-flex h-10 items-center gap-2 rounded-md border border-slate-200 px-3 text-sm font-semibold text-slate-700 hover:border-teal-300 hover:text-teal-700">
              <LogOut aria-hidden="true" size={16} strokeWidth={ICON_STROKE} />
              {isSigningOut ? "로그아웃 중" : "로그아웃"}
            </button>
          </div>
        </header>

        <main className="h-[calc(100vh-4rem)] overflow-y-auto px-4 py-5 md:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">{children}</div>
        </main>
      </div>

      {isDrawerOpen ? (
        <div className="fixed inset-0 z-50 bg-slate-950/40 lg:hidden">
          <div
            ref={drawerRef}
            className="flex h-full w-[min(86vw,280px)] flex-col border-r border-slate-200 bg-white shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-slate-200 px-4">
              <p className="text-sm font-bold text-slate-950">관리자 메뉴</p>
              <button
                type="button"
                aria-label="관리자 메뉴 닫기"
                onClick={() => setIsDrawerOpen(false)}
                className="inline-flex size-9 items-center justify-center rounded-md border border-slate-200 text-slate-700 hover:border-teal-300 hover:text-teal-700">
                <X aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
              </button>
            </div>
            <AdminSidebar pathname={pathname} onNavigate={() => setIsDrawerOpen(false)} />
          </div>
        </div>
      ) : null}
    </div>
  );
}

type AdminSidebarProps = {
  pathname: string;
  onNavigate?: () => void;
};

function AdminSidebar({ pathname, onNavigate }: AdminSidebarProps) {
  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-slate-200 px-5 py-5">
        <Link href="/admin" onClick={onNavigate} className="flex items-center gap-3">
          <Image
            src={centerStaticInfo.logo}
            alt="센터 로고"
            width={36}
            height={36}
            className="size-9 rounded-md object-contain"
          />
          <span>
            <span className="block text-sm font-bold text-slate-950">센터 관리자</span>
          </span>
        </Link>
      </div>

      <nav aria-label="관리자 사이드바" className="flex-1 overflow-y-auto px-3 py-4">
        <ul className="grid gap-1">
          {adminNavItems.map((item) => (
            <AdminNavLink
              key={item.href}
              item={item}
              active={isAdminPathActive(pathname, item.href)}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      </nav>
    </div>
  );
}

type AdminNavLinkProps = {
  item: AdminNavItem;
  active: boolean;
  onNavigate?: () => void;
};

function AdminNavLink({ item, active, onNavigate }: AdminNavLinkProps) {
  const Icon = item.icon;

  return (
    <li>
      <Link
        href={item.href}
        onClick={onNavigate}
        className={`flex h-10 items-center gap-3 rounded-md px-3 text-sm font-semibold transition ${
          active
            ? "bg-teal-50 text-teal-800"
            : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
        }`}>
        <Icon aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
        {item.label}
      </Link>
    </li>
  );
}

function isAdminPathActive(pathname: string, href: string) {
  if (href === "/admin") {
    return pathname === href;
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
