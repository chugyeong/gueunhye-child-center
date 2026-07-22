import { UserRound } from "lucide-react";
import { teachers, type Teacher } from "@/data/center";

const ICON_STROKE = 1.8;

export const metadata = {
  title: "선생님 소개",
  description: "구은혜아동발달센터 선생님 소개",
};

const teacherGroups: Array<{
  title: Teacher["group"];
  description: string;
}> = [
  {
    title: "언어재활사",
    description: "언어치료와 의사소통 발달 지원을 담당합니다.",
  },
  {
    title: "작업치료사",
    description: "작업인지, 시지각, 감각 및 일상 적응 지원을 담당합니다.",
  },
  {
    title: "운영진",
    description: "센터 운영과 이용 안내를 담당합니다.",
  },
];

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

        <div className="mt-10 grid gap-5">
          {teacherGroups.map((group, index) => {
            const groupTeachers = teachers.filter((teacher) => teacher.group === group.title);

            return (
              <section
                key={group.title}
                data-aos="fade-up"
                data-aos-delay={index * 70}
                className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm md:p-6">
                <div className="flex flex-col gap-2 border-b border-stone-200 pb-4 md:flex-row md:items-end md:justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-stone-950">{group.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-stone-600">{group.description}</p>
                  </div>
                  <p className="text-sm font-semibold text-teal-700">{groupTeachers.length}명</p>
                </div>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {groupTeachers.map((teacher) => (
                    <li
                      key={teacher.id}
                      className="flex min-h-20 items-center gap-3 rounded-md border border-stone-200 bg-stone-50 px-4 py-3">
                      <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-teal-50 text-sm font-bold text-teal-800">
                        {teacher.name.slice(0, 1) || (
                          <UserRound aria-hidden="true" size={18} strokeWidth={ICON_STROKE} />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-base font-bold text-stone-950">
                          {teacher.name}
                        </span>
                        <span className="mt-1 block truncate text-sm text-stone-600">
                          {teacher.role}
                        </span>
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
