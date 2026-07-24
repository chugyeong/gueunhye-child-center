import { TeachersList } from "@/components/teachers/teachers-list";

export const metadata = {
  title: "선생님 소개",
  description: "아동발달센터 선생님 소개",
};

export default function TeachersPage() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-14 md:py-20">
        <div className="max-w-3xl" data-aos="fade-up">
          <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">Teachers</p>
          <h1 className="mt-4 text-4xl font-bold leading-tight text-stone-950 md:text-5xl">
            센터 선생님
          </h1>
          <p className="mt-5 text-lg leading-8 text-stone-600"></p>
        </div>

        <TeachersList />
      </div>
    </section>
  );
}
