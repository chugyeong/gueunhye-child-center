import { teachers } from "@/data/center";
import { MoreLink } from "@/components/ui/more-link";
import { SectionHeading } from "@/components/ui/section-heading";

export function TeacherPreview() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-20">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div data-aos="fade-up">
            <SectionHeading
              eyebrow="Teachers"
              title="전문 선생님들이 함께합니다"
              description="언어재활사, 작업치료사, 운영 담당자가 아이와 보호자의 이용 과정을 지원합니다."
            />
          </div>
          <MoreLink href="/teachers">더보기</MoreLink>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {teachers.slice(0, 8).map((teacher, index) => (
            <article
              key={`${teacher.name}-${teacher.role}`}
              data-aos="fade-up"
              data-aos-delay={(index % 4) * 60}
              className="rounded-lg border border-stone-200 bg-stone-50 p-5">
              <p className="text-sm font-semibold text-teal-700">{teacher.role}</p>
              <h3 className="mt-2 text-xl font-bold text-stone-950">{teacher.name}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
