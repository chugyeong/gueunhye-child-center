import { ProgramCarousel } from "@/components/home/program-carousel";
import { MoreLink } from "@/components/ui/more-link";
import { SectionHeading } from "@/components/ui/section-heading";

export function ProgramPreview() {
  return (
    <section className="bg-[#f7f2ea]">
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div data-aos="fade-up">
            <SectionHeading
              eyebrow="Programs"
              title="아이에게 필요한 치료 프로그램을 안내합니다"
              description="대표 이미지와 한 줄 설명으로 프로그램을 살펴보고, 필요한 항목을 바로 확인할 수 있습니다."
            />
          </div>
          <MoreLink href="/programs">더보기</MoreLink>
        </div>
        <ProgramCarousel />
      </div>
    </section>
  );
}
