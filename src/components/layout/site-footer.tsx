import { MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import { centerInfo } from "@/data/center";

const ICON_STROKE = 1.8;

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const representative = centerInfo.representative ?? "정보 준비 중";
  const businessRegistrationNumber = centerInfo.businessRegistrationNumber ?? "정보 준비 중";

  return (
    <footer className="border-t border-stone-200 bg-white text-stone-700">
      <div className="mx-auto max-w-7xl px-5 py-8 md:py-10">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <Image
                src={centerInfo.logo}
                alt="구은혜아동발달센터 로고"
                width={44}
                height={44}
                className="size-11 shrink-0 rounded-md object-contain"
              />
              <p className="text-lg font-bold text-stone-950">{centerInfo.name}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-sm text-stone-600">
              <p>대표: {representative}</p>
              <span aria-hidden="true" className="hidden text-stone-300 sm:inline">
                |
              </span>
              <p>사업자등록번호: {businessRegistrationNumber}</p>
            </div>
            <address className="mt-2 break-keep text-sm not-italic leading-6 text-stone-600">
              주소: {centerInfo.address}
            </address>
          </div>

          <div className="flex flex-col gap-3 lg:items-end">
            <nav
              aria-label="푸터 정책 메뉴"
              className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium">
              <PolicyText label="이용약관" />
              <span aria-hidden="true" className="text-stone-300">
                |
              </span>
              <PolicyText label="개인정보처리방침" />
            </nav>

            <div className="grid grid-cols-2 gap-2 sm:flex">
              <a
                href={centerInfo.mobile.href}
                aria-label="전화 문의"
                title="전화 문의"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-bold text-white transition hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:bg-teal-900 sm:size-11 sm:px-0">
                <Phone aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
                <span className="sm:sr-only">전화 문의</span>
              </a>
              <a
                href={centerInfo.kakaoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="카카오 상담"
                title="카카오 상담"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-bold text-stone-800 transition hover:border-teal-500 hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:bg-teal-100 sm:size-11 sm:px-0">
                <MessageCircle aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
                <span className="sm:sr-only">카카오 상담</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-200 pt-5">
          <p className="text-xs text-stone-500">
            © {currentYear} {centerInfo.name}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

type PolicyTextProps = {
  label: string;
};

function PolicyText({ label }: PolicyTextProps) {
  return (
    <span
      role="link"
      aria-disabled="true"
      title={`${label} 페이지 준비 중`}
      className="text-stone-700 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700">
      {label}
    </span>
  );
}
