"use client";

import { ChevronDown, Menu, MessageCircle, Phone, X, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { centerInfo } from "@/data/center";

const ICON_STROKE = 1.8;

type MenuItem = {
  label: string;
  href: string;
  children?: Array<{
    label: string;
    href: string;
  }>;
};

type ContactLink = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
  external?: boolean;
};

const menuItems: MenuItem[] = [
  {
    label: "센터소개",
    href: "/about",
    children: [
      { label: "센터 소개", href: "/about" },
      { label: "선생님 소개", href: "/teachers" },
      { label: "치료 프로그램", href: "/programs" },
      { label: "오시는 길", href: "/location" },
    ],
  },
  { label: "공지사항", href: "/notices" },
];

const contactLinks: ContactLink[] = [
  {
    label: "전화 문의",
    description: centerInfo.mobile.display,
    href: centerInfo.mobile.href,
    icon: Phone,
  },
  {
    label: "카카오 상담",
    description: "오픈채팅으로 문의",
    href: centerInfo.kakaoUrl,
    icon: MessageCircle,
    external: true,
  },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);
  const contactButtonRef = useRef<HTMLButtonElement>(null);
  const firstContactItemRef = useRef<HTMLAnchorElement>(null);
  const contactPopoverRef = useRef<HTMLDivElement>(null);
  const mobileDrawerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!isContactOpen) {
      return;
    }

    firstContactItemRef.current?.focus();
  }, [isContactOpen]);

  useEffect(() => {
    if (!isMobileOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMobileOpen]);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;

      if (
        isContactOpen &&
        contactPopoverRef.current &&
        contactButtonRef.current &&
        !contactPopoverRef.current.contains(target) &&
        !contactButtonRef.current.contains(target)
      ) {
        setIsContactOpen(false);
      }

      if (isMobileOpen && mobileDrawerRef.current && !mobileDrawerRef.current.contains(target)) {
        setIsMobileOpen(false);
      }
    };

    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") {
        return;
      }

      if (isContactOpen) {
        setIsContactOpen(false);
        contactButtonRef.current?.focus();
      }

      if (isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isContactOpen, isMobileOpen]);

  const closeDesktopMenus = () => setOpenDesktopMenu(null);
  const closeContact = () => setIsContactOpen(false);
  const closeMobile = () => {
    setIsMobileOpen(false);
    setOpenMobileMenu(null);
  };
  const toggleContact = () => {
    closeDesktopMenus();
    setIsContactOpen((current) => !current);
  };
  const openDesktopSubmenu = (label: string) => {
    closeContact();
    setOpenDesktopMenu(label);
  };

  const handleParentKeyDown = (event: React.KeyboardEvent<HTMLAnchorElement>, item: MenuItem) => {
    if (!item.children?.length) {
      return;
    }

    if (event.key === " " || event.key === "Enter") {
      event.preventDefault();
      openDesktopSubmenu(item.label);
    }
  };

  return (
    <header
      className={`sticky top-0 z-50 border-b bg-white/95 backdrop-blur transition-all duration-300 ${
        isScrolled ? "border-stone-200 shadow-sm" : "border-stone-200/80 shadow-none"
      }`}>
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 transition-all duration-300 ${
          isScrolled ? "py-2.5" : "py-4"
        }`}>
        <Link
          href="/"
          onClick={() => {
            closeDesktopMenus();
            closeContact();
            closeMobile();
          }}
          className="inline-flex min-w-0 items-center gap-3"
          aria-label="구은혜아동발달센터 메인으로 이동">
          <Image
            src={centerInfo.logo}
            alt="구은혜아동발달센터 로고"
            width={48}
            height={48}
            className={`shrink-0 rounded-md object-contain transition-all duration-300 ${
              isScrolled ? "size-10" : "size-12"
            }`}
            priority
          />
          <span className="min-w-0">
            <span className="block truncate text-lg font-bold text-stone-950">
              {centerInfo.name}
            </span>
            <span className="block truncate text-xs font-medium text-stone-500">
              {centerInfo.englishName}
            </span>
          </span>
        </Link>

        <nav
          aria-label="주요 메뉴"
          className="hidden flex-1 justify-center lg:flex"
          onMouseLeave={closeDesktopMenus}>
          <ul className="flex items-center gap-1">
            {menuItems.map((item) => {
              const hasSubmenu = Boolean(item.children?.length);
              const isOpen = openDesktopMenu === item.label;
              const isActive = isMenuActive(pathname, item);

              return (
                <li
                  key={item.label}
                  className="relative px-1 py-2"
                  onMouseEnter={() =>
                    hasSubmenu ? openDesktopSubmenu(item.label) : closeDesktopMenus()
                  }
                  onFocus={() =>
                    hasSubmenu ? openDesktopSubmenu(item.label) : closeDesktopMenus()
                  }>
                  <Link
                    href={item.href}
                    aria-haspopup={hasSubmenu ? "menu" : undefined}
                    aria-expanded={hasSubmenu ? isOpen : undefined}
                    aria-controls={hasSubmenu ? `${item.label}-submenu` : undefined}
                    onClick={closeContact}
                    onKeyDown={(event) => handleParentKeyDown(event, item)}
                    className={`inline-flex h-10 items-center gap-1.5 rounded-md px-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-teal-50 text-teal-800"
                        : "text-stone-700 hover:bg-teal-50 hover:text-teal-800"
                    }`}>
                    {item.label}
                    {hasSubmenu ? (
                      <ChevronDown
                        aria-hidden="true"
                        size={16}
                        strokeWidth={ICON_STROKE}
                        className={`transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    ) : null}
                  </Link>

                  {hasSubmenu ? (
                    <div
                      className={`absolute left-1/2 top-full w-72 -translate-x-1/2 pt-3 transition duration-200 ${
                        isOpen
                          ? "visible translate-y-0 opacity-100"
                          : "invisible -translate-y-2 opacity-0"
                      }`}>
                      <div
                        id={`${item.label}-submenu`}
                        role="menu"
                        aria-label={`${item.label} 하위 메뉴`}
                        className="rounded-lg border border-stone-200 bg-white p-2 shadow-lg">
                        {item.children?.map((child) => {
                          const isChildActive = isHrefActive(pathname, child.href);

                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              role="menuitem"
                              onClick={closeDesktopMenus}
                              className={`block rounded-md px-3 py-2.5 text-sm font-medium transition ${
                                isChildActive
                                  ? "bg-teal-50 text-teal-800"
                                  : "text-stone-700 hover:bg-stone-50 hover:text-teal-800"
                              }`}>
                              {child.label}
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="relative hidden lg:block">
          <button
            ref={contactButtonRef}
            type="button"
            aria-haspopup="menu"
            aria-expanded={isContactOpen}
            aria-controls="contact-popover"
            onClick={toggleContact}
            className="inline-flex h-11 items-center justify-center rounded-md bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800">
            문의하기
          </button>
          <ContactPopover
            isOpen={isContactOpen}
            popoverRef={contactPopoverRef}
            firstItemRef={firstContactItemRef}
            onClose={() => {
              setIsContactOpen(false);
              contactButtonRef.current?.focus();
            }}
          />
        </div>

        <button
          type="button"
          aria-label={isMobileOpen ? "모바일 메뉴 닫기" : "모바일 메뉴 열기"}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-menu-drawer"
          onClick={() => {
            closeContact();
            setIsMobileOpen((current) => !current);
          }}
          className="inline-flex size-11 items-center justify-center rounded-md border border-stone-200 text-stone-800 transition hover:border-teal-300 hover:text-teal-800 lg:hidden">
          {isMobileOpen ? (
            <X aria-hidden="true" size={20} strokeWidth={ICON_STROKE} />
          ) : (
            <Menu aria-hidden="true" size={20} strokeWidth={ICON_STROKE} />
          )}
        </button>
      </div>

      {isMobileOpen ? (
        <div className="fixed inset-0 top-full z-40 bg-stone-950/35 lg:hidden">
          <div
            ref={mobileDrawerRef}
            id="mobile-menu-drawer"
            className="ml-auto flex h-[calc(100vh-100%)] w-full max-w-sm flex-col border-l border-stone-200 bg-white shadow-xl"
            role="dialog"
            aria-modal="true"
            aria-label="모바일 메뉴">
            <MobileMenu
              pathname={pathname}
              openMobileMenu={openMobileMenu}
              setOpenMobileMenu={setOpenMobileMenu}
              onNavigate={closeMobile}
            />
          </div>
        </div>
      ) : null}
    </header>
  );
}

type ContactPopoverProps = {
  isOpen: boolean;
  popoverRef: React.RefObject<HTMLDivElement | null>;
  firstItemRef: React.RefObject<HTMLAnchorElement | null>;
  onClose: () => void;
};

function ContactPopover({ isOpen, popoverRef, firstItemRef, onClose }: ContactPopoverProps) {
  return (
    <div
      id="contact-popover"
      ref={popoverRef}
      role="menu"
      aria-label="문의 방법 선택"
      className={`absolute right-0 top-full z-50 mt-3 w-64 rounded-lg border border-stone-200 bg-white p-2 shadow-lg transition duration-200 ${
        isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
      }`}>
      {contactLinks.map((item, index) => {
        const Icon = item.icon;
        const commonClass =
          "flex w-full items-center gap-3 rounded-md px-3 py-3 text-left transition hover:bg-teal-50 focus:bg-teal-50";
        const isKakao = item.label === "카카오 상담";
        const content = (
          <>
            <span
              className={`flex size-9 items-center justify-center rounded-md ${
                isKakao ? "bg-[#FEE500] text-[#191919]" : "bg-teal-50 text-teal-800"
              }`}>
              <Icon aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
            </span>
            <span>
              <span className="block text-sm font-bold text-stone-950">{item.label}</span>
              <span className="mt-0.5 block text-xs text-stone-500">{item.description}</span>
            </span>
          </>
        );

        if (item.external) {
          return (
            <a
              key={item.href}
              ref={index === 0 ? firstItemRef : undefined}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              className={commonClass}
              onClick={onClose}>
              {content}
            </a>
          );
        }

        return (
          <a
            key={item.href}
            ref={index === 0 ? firstItemRef : undefined}
            href={item.href}
            role="menuitem"
            className={commonClass}
            onClick={onClose}>
            {content}
          </a>
        );
      })}
    </div>
  );
}

type MobileMenuProps = {
  pathname: string;
  openMobileMenu: string | null;
  setOpenMobileMenu: (label: string | null) => void;
  onNavigate: () => void;
};

function MobileMenu({ pathname, openMobileMenu, setOpenMobileMenu, onNavigate }: MobileMenuProps) {
  const handleAccordionClick = (item: MenuItem) => {
    setOpenMobileMenu(openMobileMenu === item.label ? null : item.label);
  };

  return (
    <>
      <nav aria-label="모바일 주요 메뉴" className="flex-1 overflow-y-auto p-5">
        <ul className="grid gap-2">
          {menuItems.map((item) => {
            const hasSubmenu = Boolean(item.children?.length);
            const isOpen = openMobileMenu === item.label;
            const isActive = isMenuActive(pathname, item);

            return (
              <li key={item.label} className="rounded-lg border border-stone-200">
                {hasSubmenu ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      className={`flex w-full items-center justify-between rounded-lg px-4 py-4 text-left text-base font-bold transition ${
                        isActive ? "bg-teal-50 text-teal-800" : "text-stone-900 hover:bg-stone-50"
                      }`}
                      onClick={() => handleAccordionClick(item)}>
                      {item.label}
                      <ChevronDown
                        aria-hidden="true"
                        size={18}
                        strokeWidth={ICON_STROKE}
                        className={`transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`grid transition-all duration-200 ${
                        isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}>
                      <div className="overflow-hidden">
                        <div className="grid gap-1 border-t border-stone-100 p-2">
                          {item.children?.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={onNavigate}
                              className={`rounded-md px-3 py-3 text-sm font-medium transition ${
                                isHrefActive(pathname, child.href)
                                  ? "bg-teal-50 text-teal-800"
                                  : "text-stone-600 hover:bg-stone-50 hover:text-teal-800"
                              }`}>
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    className={`block rounded-lg px-4 py-4 text-base font-bold transition ${
                      isActive ? "bg-teal-50 text-teal-800" : "text-stone-900 hover:bg-stone-50"
                    }`}>
                    {item.label}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-stone-200 p-5">
        <p className="text-sm font-bold text-stone-950">문의하기</p>
        <div className="mt-3 grid gap-2">
          {contactLinks.map((item) => {
            const Icon = item.icon;
            const className =
              "inline-flex h-12 items-center justify-center gap-2 rounded-md text-sm font-bold transition";

            if (item.external) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${className} bg-[#FEE500] text-[#191919] hover:bg-[#f5dc00]`}
                  onClick={onNavigate}>
                  <Icon aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
                  {item.label}
                </a>
              );
            }

            return (
              <a
                key={item.href}
                href={item.href}
                className={`${className} bg-teal-700 text-white hover:bg-teal-800`}
                onClick={onNavigate}>
                <Icon aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
                {item.label}
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
}

function isMenuActive(pathname: string, item: MenuItem) {
  if (pathname === item.href) {
    return true;
  }

  return item.children?.some((child) => isHrefActive(pathname, child.href)) ?? false;
}

function isHrefActive(pathname: string, href: string) {
  const [path] = href.split("#");

  return pathname === path;
}
