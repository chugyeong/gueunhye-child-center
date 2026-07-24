"use client";

import { MessageCircle, Phone } from "lucide-react";
import Image from "next/image";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { centerStaticInfo } from "@/data/center";
import { useCenterInfoStore } from "@/stores/centerInfoStore";
import { formatPhoneNumber, getFullAddress, toTelHref } from "@/utils/operatingHours";

const ICON_STROKE = 1.8;

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const centerInfo = useCenterInfoStore((state) => state.centerInfo);
  const centerName = centerInfo?.center_name ?? "";
  const businessRegistrationNumber = centerInfo?.business_number ?? "정보 준비 중";
  const fullAddress = getFullAddress(centerInfo);
  const mobileHref = toTelHref(centerInfo?.mobile_phone);

  return (
    <footer className="border-t border-stone-200 bg-white text-stone-700">
      <div className="mx-auto max-w-7xl px-5 py-7 md:py-8">
        <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <Image
                src={centerStaticInfo.logo}
                alt="센터 로고"
                width={44}
                height={44}
                className="size-11 shrink-0 rounded-md object-contain"
              />
              <p className="text-lg font-bold text-stone-950">{centerName}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-3 gap-y-2 text-sm text-stone-600">
              <p>사업자등록번호: {businessRegistrationNumber}</p>
            </div>
            {fullAddress ? (
              <address className="mt-2 break-keep text-sm not-italic leading-6 text-stone-600">
                주소: {fullAddress}
              </address>
            ) : null}
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

            <div className="grid grid-cols-3 gap-2 sm:flex">
              {mobileHref ? (
                <a
                  href={mobileHref}
                  aria-label={`전화 문의 ${formatPhoneNumber(centerInfo?.mobile_phone)}`}
                  title="전화 문의"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:bg-teal-900 max-sm:px-0 sm:size-11 sm:px-0">
                  <Phone aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
                  <span className="sr-only">전화 문의</span>
                </a>
              ) : null}
              <a
                href={centerStaticInfo.kakaoUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="카카오 상담"
                title="카카오 상담"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-bold text-stone-800 transition hover:border-teal-500 hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:bg-teal-100 max-sm:px-0 sm:size-11 sm:px-0">
                <MessageCircle aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
                <span className="sr-only">카카오 상담</span>
              </a>
              <a
                href={centerStaticInfo.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="인스타그램"
                title="인스타그램"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-bold text-stone-800 transition hover:border-teal-500 hover:bg-teal-50 hover:text-teal-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal-700 active:bg-teal-100 max-sm:px-0 sm:size-11 sm:px-0">
                <InstagramIcon aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
                <span className="sr-only">인스타그램</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 border-t border-stone-200 pt-4">
          <p className="text-xs text-stone-500">
            © {currentYear} {centerName}. All rights reserved.
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
