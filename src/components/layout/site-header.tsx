"use client";

import { ChevronDown, Menu, MessageCircle, Phone, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { centerStaticInfo } from "@/data/center";
import { useCenterInfoStore } from "@/stores/centerInfoStore";
import { formatPhoneNumber, toTelHref } from "@/utils/operatingHours";

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
  icon: ComponentType<{
    size?: number;
    strokeWidth?: number;
    "aria-hidden"?: boolean | "true" | "false";
  }>;
  external?: boolean;
};

const menuItems: MenuItem[] = [
  { label: "치료 프로그램", href: "/programs" },
  { label: "선생님 소개", href: "/teachers" },
  { label: "오시는 길", href: "/location" },
  { label: "공지사항", href: "/notices" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const centerInfo = useCenterInfoStore((state) => state.centerInfo);
  const [isScrolled, setIsScrolled] = useState(false);
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);
  const contactButtonRef = useRef<HTMLButtonElement>(null);
  const firstContactItemRef = useRef<HTMLAnchorElement>(null);
  const contactPopoverRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
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

      if (
        isMobileOpen &&
        mobileDrawerRef.current &&
        !mobileDrawerRef.current.contains(target) &&
        !mobileMenuButtonRef.current?.contains(target)
      ) {
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
  const centerName = centerInfo?.center_name ?? "";
  const mobileHref = toTelHref(centerInfo?.mobile_phone);
  const contactLinks: ContactLink[] = [
    ...(mobileHref
      ? [
          {
            label: "전화 문의",
            description: formatPhoneNumber(centerInfo?.mobile_phone),
            href: mobileHref,
            icon: Phone,
          },
        ]
      : []),
    {
      label: "카카오 상담",
      description: "오픈채팅으로 문의",
      href: centerStaticInfo.kakaoUrl,
      icon: MessageCircle,
      external: true,
    },
    {
      label: "인스타그램",
      description: "센터 소식 보기",
      href: centerStaticInfo.instagramUrl,
      icon: InstagramIcon,
      external: true,
    },
  ];

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
      className={`sticky top-0 z-50 border-b bg-white/90 backdrop-blur-xl transition-all duration-300 ${
        isScrolled
          ? "border-stone-200 shadow-[0_10px_30px_rgba(28,25,23,0.06)]"
          : "border-stone-200/70 shadow-none"
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
          aria-label="메인으로 이동">
          <Image
            src={centerStaticInfo.logo}
            alt="센터 로고"
            width={48}
            height={48}
            className="shrink-0 rounded-md object-contain transition-all duration-300 size-12"
            priority
          />
          <span className="min-w-0">
            <span className="block truncate text-lg font-bold text-stone-950">
              {centerName}
            </span>
            <span className="block truncate text-xs font-medium text-stone-500">
              {centerStaticInfo.englishName}
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

        <div className="hidden items-center gap-2 lg:flex">
          <div className="relative">
            <button
              ref={contactButtonRef}
              type="button"
              aria-haspopup="menu"
              aria-expanded={isContactOpen}
              aria-controls="contact-popover"
              onClick={toggleContact}
              className="inline-flex h-11 items-center justify-center rounded-md bg-teal-700 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-800 active:bg-teal-900">
              문의하기
            </button>
            <ContactPopover
              isOpen={isContactOpen}
              contactLinks={contactLinks}
              popoverRef={contactPopoverRef}
              firstItemRef={firstContactItemRef}
              onClose={() => {
                setIsContactOpen(false);
                contactButtonRef.current?.focus();
              }}
            />
          </div>
        </div>

        <button
          ref={mobileMenuButtonRef}
          type="button"
          aria-label={isMobileOpen ? "모바일 메뉴 닫기" : "모바일 메뉴 열기"}
          aria-expanded={isMobileOpen}
          aria-controls="mobile-menu-drawer"
          onClick={() => {
            closeContact();
            setIsMobileOpen((current) => !current);
          }}
          className={`inline-flex size-11 items-center justify-center rounded-md text-stone-800 transition hover:text-teal-800 lg:hidden ${
            isMobileOpen
              ? "border border-transparent hover:bg-stone-100"
              : "border border-stone-200 hover:border-teal-300"
          }`}>
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
              contactLinks={contactLinks}
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
  contactLinks: ContactLink[];
  popoverRef: React.RefObject<HTMLDivElement | null>;
  firstItemRef: React.RefObject<HTMLAnchorElement | null>;
  onClose: () => void;
};

function ContactPopover({
  isOpen,
  contactLinks,
  popoverRef,
  firstItemRef,
  onClose,
}: ContactPopoverProps) {
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
        const content = (
          <>
            <span className="flex size-9 items-center justify-center rounded-md bg-teal-50 text-teal-800">
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
  contactLinks: ContactLink[];
  onNavigate: () => void;
};

function MobileMenu({
  pathname,
  openMobileMenu,
  setOpenMobileMenu,
  contactLinks,
  onNavigate,
}: MobileMenuProps) {
  const handleAccordionClick = (item: MenuItem) => {
    setOpenMobileMenu(openMobileMenu === item.label ? null : item.label);
  };

  return (
    <>
      <nav aria-label="모바일 주요 메뉴" className="flex-1 overflow-y-auto p-5">
        <ul className="grid gap-1.5">
          {menuItems.map((item) => {
            const hasSubmenu = Boolean(item.children?.length);
            const isOpen = openMobileMenu === item.label;
            const isActive = isMenuActive(pathname, item);

            return (
              <li key={item.label}>
                {hasSubmenu ? (
                  <>
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      className={`flex w-full items-center justify-between rounded-md px-3 py-3 text-left text-sm font-bold transition ${
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
                    className={`block rounded-md px-3 py-3 text-sm font-bold transition ${
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
        <div className="grid grid-cols-3 gap-2">
          {contactLinks.map((item) => {
            const Icon = item.icon;
            const className =
              "inline-flex h-11 items-center justify-center rounded-md transition";

            if (item.external) {
              return (
                <a
                  key={item.href}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.label} 새 탭에서 열기`}
                  title={item.label}
                  className={`${className} border border-stone-300 bg-white text-stone-800 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-800`}
                  onClick={onNavigate}>
                  <Icon aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
                </a>
              );
            }

            return (
              <a
                key={item.href}
                href={item.href}
                aria-label={item.label}
                title={item.label}
                className={`${className} bg-teal-700 text-white hover:bg-teal-800`}
                onClick={onNavigate}>
                <Icon aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
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
