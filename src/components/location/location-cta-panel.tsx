"use client";

import {
  Clock3,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  type LucideIcon,
} from "lucide-react";
import { InstagramIcon } from "@/components/ui/instagram-icon";
import { centerStaticInfo } from "@/data/center";
import { KakaoMap } from "@/components/location/kakao-map";
import { useCenterInfoStore } from "@/stores/centerInfoStore";
import {
  formatOperatingHours,
  formatPhoneNumber,
  getFullAddress,
  toTelHref,
} from "@/utils/operatingHours";

const ICON_STROKE = 1.8;

type LocationCtaPanelProps = {
  variant?: "home" | "page";
};

export function LocationCtaPanel({ variant = "home" }: LocationCtaPanelProps) {
  const isPage = variant === "page";
  const centerInfo = useCenterInfoStore((state) => state.centerInfo);
  const fullAddress = getFullAddress(centerInfo);
  const operatingHours = formatOperatingHours(centerInfo?.operating_hours);
  const centerPhone = formatPhoneNumber(centerInfo?.center_phone);
  const mobilePhone = formatPhoneNumber(centerInfo?.mobile_phone);
  const phoneLabel = [centerPhone, mobilePhone].filter(Boolean).join(" / ");
  const mobileHref = toTelHref(centerInfo?.mobile_phone);
  const mapSearchLink = centerInfo?.address
    ? `https://map.kakao.com/link/search/${encodeURIComponent(centerInfo.address)}`
    : "";
  const directionsLink = centerInfo
    ? `https://map.kakao.com/link/to/${encodeURIComponent(centerInfo.center_name)},${
        centerStaticInfo.coordinate.lat
      },${centerStaticInfo.coordinate.lng}`
    : "";

  return (
    <div
      className={`grid gap-6 ${isPage ? "lg:grid-cols-[1.05fr_0.9fr]" : "lg:grid-cols-[1fr_1fr]"}`}
    >
      <KakaoMap className="min-h-[280px] lg:min-h-[360px]" />
      <div className="flex flex-col justify-center rounded-lg border border-stone-200 bg-white p-5 shadow-sm md:p-6">
        <p className="text-xs font-bold uppercase tracking-wide text-teal-700">
          Visit & Contact
        </p>
        <h2 className="mt-2 text-2xl font-bold text-stone-950">
          센터 방문 안내
        </h2>
        <dl className="mt-5 grid gap-3 text-sm">
          {fullAddress ? <InfoRow icon={MapPin} title="주소" content={fullAddress} /> : null}
          {operatingHours.length > 0 ? (
            <InfoRow icon={Clock3} title="운영시간" content={operatingHours.join(" · ")} />
          ) : null}
          {phoneLabel ? <InfoRow icon={Phone} title="전화번호" content={phoneLabel} /> : null}
          <InfoRow
            icon={MessageCircle}
            title="카카오 상담"
            content="카카오 오픈채팅으로 상담 문의"
          />
        </dl>
        <div className="mt-6 grid gap-2.5 md:grid-cols-3">
          {mobileHref ? (
            <a
              href={mobileHref}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-bold text-white shadow-sm hover:bg-teal-800 active:bg-teal-900"
            >
              <Phone aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
              전화 문의
            </a>
          ) : null}
          <a
            href={centerStaticInfo.kakaoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 text-sm font-bold text-stone-800 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-800 active:bg-teal-100"
          >
            <MessageCircle aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
            카카오 상담
          </a>
          <a
            href={centerStaticInfo.instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 text-sm font-bold text-stone-800 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-800 active:bg-teal-100"
          >
            <InstagramIcon aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
            인스타그램
          </a>
        </div>
        <div className="mt-2.5 grid gap-2.5 sm:grid-cols-2">
          {directionsLink ? (
            <a
              href={directionsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 text-sm font-bold text-stone-800 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-800 active:bg-teal-100"
            >
              <Navigation aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
              길찾기
            </a>
          ) : null}
          {mapSearchLink ? (
            <a
              href={mapSearchLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 text-sm font-bold text-stone-800 hover:border-teal-500 hover:bg-teal-50 hover:text-teal-800 active:bg-teal-100"
            >
              <MapPin aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
              오시는 길
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
}

type InfoRowProps = {
  icon: LucideIcon;
  title: string;
  content: string;
};

function InfoRow({ icon: Icon, title, content }: InfoRowProps) {
  return (
    <div className="grid grid-cols-[32px_1fr] gap-3 rounded-md border border-stone-100 bg-stone-50 p-3.5">
      <div className="flex size-8 items-center justify-center rounded-md bg-teal-50 text-teal-800">
        <Icon aria-hidden="true" size={16} strokeWidth={ICON_STROKE} />
      </div>
      <div>
        <dt className="font-bold text-stone-950">{title}</dt>
        <dd className="mt-1 leading-6 text-stone-600">{content}</dd>
      </div>
    </div>
  );
}
