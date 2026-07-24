import Image from "next/image";
import { centerImages } from "@/data/center";
import { SectionHeading } from "@/components/ui/section-heading";

const strengths = [
  "언어 발달 집중 지원",
  "작업인지·시지각 통합 접근",
  "또래 상호작용 프로그램",
];

export function HomeIntro() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 md:py-16 lg:grid-cols-[0.85fr_1fr]">
        <div data-aos="fade-up">
          <SectionHeading
            eyebrow="Center"
            title="아동발달 전문 공간"
            description="상담부터 치료까지 필요한 과정을 차분하게 연결합니다."
          />
          <div className="mt-6 grid grid-cols-2 gap-3">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
              <Image
                src={centerImages.reception}
                alt="센터 안내 데스크"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 24vw, 50vw"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm">
              <Image
                src={centerImages.hallway}
                alt="센터 복도"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 24vw, 50vw"
              />
            </div>
          </div>
        </div>
        <div className="grid gap-3">
          {strengths.map((strength, index) => (
            <article
              key={strength}
              data-aos="fade-up"
              data-aos-delay={index * 80}
              className="rounded-lg border border-stone-200 bg-background p-5 shadow-sm">
              <p className="text-xs font-bold text-teal-700">0{index + 1}</p>
              <h3 className="mt-2 text-lg font-bold text-stone-950">{strength}</h3>
              <p className="mt-2 text-sm leading-6 text-stone-600">
                아이의 현재 단계에 맞춰 필요한 지원을 연결합니다.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
