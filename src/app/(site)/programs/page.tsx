import { ProgramDetail } from "@/components/programs/program-detail";

export const metadata = {
  title: "치료 프로그램",
  description:
    "언어치료, 구강운동치료, 작업인지 및 시지각, 연하재활치료, 사회성 그룹, 플로어타임, 학교대비반 안내",
};

export default function ProgramsPage() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-14 md:py-20">
        <div className="max-w-3xl" data-aos="fade-up">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Programs</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-stone-950 md:text-5xl">
            치료 프로그램
          </h1>
          <p className="mt-5 text-lg leading-8 text-stone-600"></p>
        </div>
        <ProgramDetail />
      </div>
    </section>
  );
}
