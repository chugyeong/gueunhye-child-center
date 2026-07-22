import { Clock3, MapPin, MessageCircle, Phone, type LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { centerImages, centerInfo } from "@/data/center";
import { SectionHeading } from "@/components/ui/section-heading";

const ICON_STROKE = 1.8;

export function NewsPreview() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
        <div data-aos="fade-up">
          <SectionHeading
            eyebrow="Contact"
            title="센터 방문 안내"
            description="방문 전 전화 또는 카카오 상담으로 문의해 주세요. 운영 시간과 위치를 함께 확인할 수 있습니다."
          />
        </div>
        <div className="mt-10 grid overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm lg:grid-cols-[0.95fr_1.05fr]">
          <div
            data-aos="fade-up"
            data-aos-delay="80"
            className="relative min-h-[280px] lg:min-h-[460px]"
          >
            <Image
              src={centerImages.lounge}
              alt="구은혜아동발달센터 상담 및 대기 공간"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 45vw, 100vw"
            />
          </div>
          <div
            data-aos="fade-up"
            data-aos-delay="140"
            className="flex flex-col justify-center p-6 md:p-10"
          >
            <dl className="grid gap-4 text-sm">
              <InfoItem icon={MapPin} label="주소" value={centerInfo.address} />
              <InfoItem
                icon={Clock3}
                label="운영시간"
                value={centerInfo.hours.join(" · ")}
              />
              <InfoItem
                icon={Phone}
                label="전화번호"
                value={`${centerInfo.phone.display} / ${centerInfo.mobile.display}`}
              />
              <InfoItem
                icon={MessageCircle}
                label="카카오 상담"
                value="카카오 오픈채팅으로 문의"
              />
            </dl>
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <a
                href={centerInfo.mobile.href}
                className="inline-flex h-12 items-center justify-center rounded-md bg-teal-700 px-4 text-sm font-bold text-white hover:bg-teal-800"
              >
                <Phone aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
                전화 문의
              </a>
              <a
                href={centerInfo.kakaoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center rounded-md border border-teal-700 px-4 text-sm font-bold text-teal-800 hover:bg-teal-50"
              >
                <MessageCircle
                  aria-hidden="true"
                  size={18}
                  strokeWidth={ICON_STROKE}
                />
                카카오 상담
              </a>
              <Link
                href="/location"
                className="inline-flex h-12 items-center justify-center rounded-md border border-stone-300 px-4 text-sm font-bold text-stone-800 hover:border-teal-500 hover:text-teal-800"
              >
                <MapPin aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
                오시는 길
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type InfoItemProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function InfoItem({ icon: Icon, label, value }: InfoItemProps) {
  return (
    <div className="grid grid-cols-[32px_1fr] gap-3 rounded-md bg-stone-50 p-4">
      <div className="flex size-8 items-center justify-center rounded-md bg-teal-50 text-teal-800">
        <Icon aria-hidden="true" size={16} strokeWidth={ICON_STROKE} />
      </div>
      <div>
        <dt className="font-bold text-teal-700">{label}</dt>
        <dd className="mt-1 leading-6 text-stone-700">{value}</dd>
      </div>
    </div>
  );
}
