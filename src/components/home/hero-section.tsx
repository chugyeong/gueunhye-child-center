"use client";

import Image from "next/image";
import { centerImages, centerStaticInfo } from "@/data/center";
import { useCenterInfoStore } from "@/stores/centerInfoStore";
import { toTelHref } from "@/utils/operatingHours";

export function HeroSection() {
  const centerInfo = useCenterInfoStore((state) => state.centerInfo);
  const centerName = centerInfo?.center_name ?? "";
  const phoneHref = toTelHref(centerInfo?.center_phone);

  return (
    <section className="border-b border-stone-100 bg-background">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-10 md:py-14 lg:grid-cols-[0.95fr_0.9fr] lg:items-center lg:gap-12">
        <div data-aos="fade-up">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-teal-700">
            Child Development Center
          </p>
          <h1 className="max-w-2xl text-4xl font-bold leading-[1.12] text-stone-950 md:text-5xl">
            {centerName}
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-stone-600">
            언어치료, 작업인지, 사회성 프로그램을 아이의 속도에 맞춰 연결합니다.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2.5 sm:flex sm:flex-row">
            {phoneHref ? (
              <a
                href={phoneHref}
                className="inline-flex h-11 min-w-32 items-center justify-center rounded-md bg-teal-700 px-5 text-sm font-bold text-white shadow-sm transition hover:bg-teal-800 active:bg-teal-900">
                상담문의
              </a>
            ) : null}
            <a
              href="/programs#nonverbal-language"
              className="inline-flex h-11 min-w-32 items-center justify-center rounded-md border border-stone-300 bg-white px-5 text-sm font-bold text-stone-800 transition hover:border-teal-500 hover:bg-teal-50 hover:text-teal-800 active:bg-teal-100">
              치료프로그램
            </a>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-2 text-sm sm:grid-cols-3">
            <a
              href="/programs#nonverbal-language"
              className="col-span-2 rounded-md bg-teal-700 px-3 py-2.5 text-center font-bold text-white transition hover:bg-teal-800 sm:col-span-1">
              무발화 언어치료
            </a>
            {["언어치료", "작업인지"].map((item) => (
              <div
                key={item}
                className="rounded-md border border-stone-200 bg-white px-3 py-2.5 text-center text-stone-700">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div
          data-aos="fade-up"
          data-aos-delay="120"
          className="relative min-h-[280px] overflow-hidden rounded-md border border-stone-200 bg-stone-100 shadow-[0_18px_46px_rgba(29,56,123,0.12)] md:min-h-[340px]">
          <Image
            src={centerImages.hero}
            alt="센터 로비와 대기 공간"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
          <div className="absolute inset-x-0 bottom-0 bg-white/90 p-4 backdrop-blur">
            <p className="text-sm font-semibold text-teal-800">{centerName}</p>
            <p className="mt-1 text-sm leading-6 text-stone-600">{centerStaticInfo.tagline}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
