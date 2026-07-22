import Image from "next/image";
import { centerImages, centerInfo } from "@/data/center";

export function HeroSection() {
  return (
    <section className="bg-stone-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 md:py-20 lg:grid-cols-[1fr_0.9fr] lg:items-center">
        <div data-aos="fade-up">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
            {centerInfo.englishName}
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-stone-950 md:text-6xl">
            {centerInfo.name}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-600">
            {centerInfo.description}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={centerInfo.phone.href}
              className="inline-flex h-12 items-center justify-center rounded-md bg-teal-700 px-5 text-sm font-semibold text-white hover:bg-teal-800">
              전화 문의
            </a>
            <a
              href={centerInfo.kakaoUrl}
              className="inline-flex h-12 items-center justify-center rounded-md border border-stone-300 bg-white px-5 text-sm font-semibold text-stone-800 hover:border-teal-400 hover:text-teal-800">
              카카오톡 문의
            </a>
          </div>
          <div className="mt-8 grid gap-3 text-sm text-stone-600 sm:grid-cols-3">
            {["언어치료", "작업인지", "사회성 프로그램"].map((item) => (
              <div key={item} className="rounded-lg border border-stone-200 bg-white px-4 py-3">
                {item}
              </div>
            ))}
          </div>
        </div>
        <div
          data-aos="fade-up"
          data-aos-delay="120"
          className="relative min-h-[360px] overflow-hidden rounded-lg bg-teal-900">
          <Image
            src={centerImages.hero}
            alt="구은혜아동발달센터 로비와 대기 공간"
            fill
            priority
            className="object-cover"
            sizes="(min-width: 1024px) 45vw, 100vw"
          />
          <div className="absolute inset-x-0 bottom-0 bg-white/92 p-5">
            <p className="text-sm font-semibold text-teal-800">{centerInfo.name}</p>
            <p className="mt-1 text-sm leading-6 text-stone-700">{centerInfo.tagline}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
