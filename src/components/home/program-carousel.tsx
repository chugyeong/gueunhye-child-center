"use client";

import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Autoplay, Keyboard } from "swiper/modules";
import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { programs } from "@/data/center";

const ICON_STROKE = 1.8;

export function ProgramCarousel() {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null);
  const swiperData =
    programs.length < 6
      ? [...programs, ...programs].map((program, index) => ({
          ...program,
          renderId: `${program.id}-${index}`,
          originalId: program.id,
        }))
      : programs.map((program) => ({
          ...program,
          renderId: program.id,
          originalId: program.id,
        }));

  const pauseAutoplay = () => swiper?.autoplay?.stop();
  const resumeAutoplay = () => swiper?.autoplay?.start();

  return (
    <div
      className="relative mt-10"
      data-aos="fade-up"
      data-aos-delay="90"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={resumeAutoplay}
      onFocus={pauseAutoplay}
      onBlur={resumeAutoplay}>
      <div className="mb-4 flex justify-end gap-2">
        <button
          type="button"
          aria-label="이전 프로그램 보기"
          onClick={() => swiper?.slidePrev()}
          className="inline-flex size-9 items-center justify-center rounded-md border border-stone-300 bg-white text-teal-800 shadow-sm transition hover:border-teal-400 hover:bg-teal-50 md:size-10">
          <ChevronLeft aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
        </button>
        <button
          type="button"
          aria-label="다음 프로그램 보기"
          onClick={() => swiper?.slideNext()}
          className="inline-flex size-9 items-center justify-center rounded-md border border-stone-300 bg-white text-teal-800 shadow-sm transition hover:border-teal-400 hover:bg-teal-50 md:size-10">
          <ChevronRight aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
        </button>
      </div>
      <Swiper
        modules={[Autoplay, Keyboard]}
        onSwiper={setSwiper}
        autoplay={{
          delay: 4200,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        keyboard={{ enabled: true }}
        loop
        loopAdditionalSlides={swiperData.length}
        watchOverflow
        spaceBetween={18}
        slidesPerView={1.15}
        breakpoints={{
          640: { slidesPerView: 2.1 },
          1024: { slidesPerView: 3.1 },
          1280: { slidesPerView: 4 },
        }}
        className="program-swiper !pb-3">
        {swiperData.map((program) => (
          <SwiperSlide key={program.renderId} className="!h-auto">
            <Link
              href={`/programs#${program.originalId}`}
              className="group flex h-full flex-col overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-teal-300 hover:shadow-md">
              <div className="relative aspect-[4/3]">
                <Image
                  src={program.image}
                  alt={`${program.title} 공간 이미지`}
                  fill
                  className="object-cover"
                  sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="text-xl font-bold text-stone-950">{program.title}</h3>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-stone-600">
                  {program.description}
                </p>
                <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-teal-800 group-hover:text-teal-950">
                  자세히 보기
                  <ArrowRight
                    aria-hidden="true"
                    size={18}
                    strokeWidth={ICON_STROKE}
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  />
                </span>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
