"use client";

import { UserRound } from "lucide-react";
import { useTeachersStore } from "@/stores/teachersStore";
import { groupTeachersByGroupName } from "@/utils/teachers";

const ICON_STROKE = 1.8;

const groupDescriptions: Record<string, string> = {
  언어재활사: "언어치료와 의사소통 발달 지원을 담당합니다.",
  작업치료사: "작업인지, 시지각, 감각 및 일상 적응 지원을 담당합니다.",
  운영진: "센터 운영과 이용 안내를 담당합니다.",
};

export function TeachersList() {
  const teachers = useTeachersStore((state) => state.teachers);
  const isLoading = useTeachersStore((state) => state.isLoading);
  const groups = groupTeachersByGroupName(teachers);

  return (
    <div className="mt-10 grid gap-5">
      {groups.map((group, index) => (
        <section
          key={group.title}
          data-aos="fade-up"
          data-aos-delay={index * 70}
          className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm md:p-6">
          <div className="flex flex-col gap-2 border-b border-stone-200 pb-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-stone-950">{group.title}</h2>
              <p className="mt-1 text-sm leading-6 text-stone-600">
                {groupDescriptions[group.title] ?? "센터 이용 과정을 함께 지원합니다."}
              </p>
            </div>
            <p className="text-sm font-semibold text-teal-700">{group.teachers.length}명</p>
          </div>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {group.teachers.map((teacher) => (
              <li
                key={teacher.id}
                className="flex min-h-24 items-center gap-3 rounded-md border border-stone-200 bg-stone-50 px-4 py-4">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-800 ring-1 ring-teal-100">
                  <UserRound aria-hidden="true" size={22} strokeWidth={ICON_STROKE} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-base font-bold text-stone-950">
                    {teacher.name}
                  </span>
                  <span className="mt-1 block truncate text-sm text-stone-600">
                    {teacher.position}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {groups.length === 0 && isLoading ? (
        <div className="rounded-lg border border-stone-200 bg-white p-8 text-sm text-stone-600 shadow-sm">
          선생님 정보를 불러오는 중입니다.
        </div>
      ) : null}
    </div>
  );
}
