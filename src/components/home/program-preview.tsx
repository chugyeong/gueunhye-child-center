import { ProgramCarousel } from "@/components/home/program-carousel";
import { MoreLink } from "@/components/ui/more-link";
import { SectionHeading } from "@/components/ui/section-heading";

export function ProgramPreview() {
  return (
    <section className="bg-background">
      <div className="mx-auto max-w-7xl px-5 py-12 md:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div data-aos="fade-up">
            <SectionHeading
              eyebrow="Programs"
              title="치료 프로그램"
              description="주요 프로그램을 간결하게 확인할 수 있습니다."
            />
          </div>
          <MoreLink href="/programs">더보기</MoreLink>
        </div>
        <ProgramCarousel />
      </div>
    </section>
  );
}
