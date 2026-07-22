import {
  Clock3,
  ExternalLink,
  MapPin,
  MessageCircle,
  Navigation,
  Phone,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { centerInfo, centerMapLinks } from "@/data/center";
import { KakaoMap } from "@/components/location/kakao-map";

const ICON_STROKE = 1.8;

type LocationCtaPanelProps = {
  variant?: "home" | "page";
};

export function LocationCtaPanel({ variant = "home" }: LocationCtaPanelProps) {
  const isPage = variant === "page";

  return (
    <div
      className={`grid gap-8 ${isPage ? "lg:grid-cols-[1.1fr_0.9fr]" : "lg:grid-cols-[1fr_1fr]"}`}
    >
      <KakaoMap className="min-h-[320px] lg:min-h-[430px]" />
      <div className="flex flex-col justify-center rounded-lg border border-stone-200 bg-white p-6 shadow-sm md:p-8">
        <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
          Visit & Contact
        </p>
        <h2 className="mt-3 text-3xl font-bold text-stone-950">
          센터 방문 안내
        </h2>
        <dl className="mt-6 grid gap-4 text-sm">
          <InfoRow icon={MapPin} title="주소" content={centerInfo.address} />
          <InfoRow
            icon={Clock3}
            title="운영시간"
            content={centerInfo.hours.join(" · ")}
          />
          <InfoRow
            icon={Phone}
            title="전화번호"
            content={`${centerInfo.phone.display} / ${centerInfo.mobile.display}`}
          />
          <InfoRow
            icon={MessageCircle}
            title="카카오 상담"
            content="카카오 오픈채팅으로 상담 문의"
          />
        </dl>
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <a
            href={centerInfo.mobile.href}
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md bg-teal-700 px-4 text-sm font-bold text-white hover:bg-teal-800"
          >
            <Phone aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
            전화 문의
          </a>
          <a
            href={centerInfo.kakaoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-teal-700 px-4 text-sm font-bold text-teal-800 hover:bg-teal-50"
          >
            <MessageCircle aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
            카카오 상담
          </a>
          <Link
            href="/location"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-bold text-stone-800 hover:border-teal-500 hover:text-teal-800"
          >
            <MapPin aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
            오시는 길
          </Link>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <a
            href={centerMapLinks.directions}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-stone-950 px-4 text-sm font-bold text-white hover:bg-stone-800"
          >
            <Navigation aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
            길찾기
          </a>
          <a
            href={centerMapLinks.view}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-md border border-stone-300 px-4 text-sm font-bold text-stone-800 hover:border-teal-500 hover:text-teal-800"
          >
            <ExternalLink aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
            카카오맵에서 보기
          </a>
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
    <div className="grid grid-cols-[32px_1fr] gap-3 rounded-md bg-stone-50 p-4">
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
