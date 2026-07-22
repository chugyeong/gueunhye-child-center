import Image from "next/image";
import { centerImages } from "@/data/center";
import { SectionHeading } from "@/components/ui/section-heading";

const strengths = [
  "언어와 의사소통 발달을 위한 세밀한 접근",
  "작업인지, 시지각, 구강운동을 함께 고려하는 통합 지원",
  "취학 전 준비와 또래 상호작용을 돕는 그룹 프로그램",
];

export function HomeIntro() {
  return (
    <section className="bg-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-16 md:py-20 lg:grid-cols-[0.85fr_1fr]">
        <div data-aos="fade-up">
          <SectionHeading
            eyebrow="Center"
            title="아동발달 전문 공간"
            description="구은혜아동발달센터는 아이의 발달 단계와 일상 적응을 살피며 필요한 치료 프로그램을 연결합니다."
          />
          <div className="mt-8 grid grid-cols-2 gap-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={centerImages.reception}
                alt="구은혜아동발달센터 안내 데스크"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 24vw, 50vw"
              />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg">
              <Image
                src={centerImages.hallway}
                alt="구은혜아동발달센터 복도"
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 24vw, 50vw"
              />
            </div>
          </div>
        </div>
        <div className="grid gap-4">
          {strengths.map((strength, index) => (
            <article
              key={strength}
              data-aos="fade-up"
              data-aos-delay={index * 80}
              className="rounded-lg border border-stone-200 bg-stone-50 p-6">
              <p className="text-sm font-semibold text-teal-700">0{index + 1}</p>
              <h3 className="mt-2 text-xl font-bold text-stone-950">{strength}</h3>
              <p className="mt-3 text-sm leading-6 text-stone-600">
                보호자 상담과 치료실 환경을 바탕으로 아이에게 맞는 발달 지원을 차분히 이어갑니다.
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
