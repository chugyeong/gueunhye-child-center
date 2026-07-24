"use client";

import { UserRound } from "lucide-react";
import { MoreLink } from "@/components/ui/more-link";
import { SectionHeading } from "@/components/ui/section-heading";
import { useTeachersStore } from "@/stores/teachersStore";

const ICON_STROKE = 1.8;

export function TeacherPreview() {
  const teachers = useTeachersStore((state) => state.teachers);
  const isLoading = useTeachersStore((state) => state.isLoading);
  const previewTeachers = teachers.slice(0, 8);

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 md:py-16">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div data-aos="fade-up">
            <SectionHeading
              eyebrow="Teachers"
              title="선생님 소개"
              description="전문 선생님들이 아이와 보호자의 이용 과정을 지원합니다."
            />
          </div>
          <MoreLink href="/teachers">더보기</MoreLink>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {previewTeachers.map((teacher, index) => (
            <article
              key={teacher.id}
              data-aos="fade-up"
              data-aos-delay={(index % 4) * 60}
              className="flex min-h-24 items-center rounded-lg border border-stone-200 bg-white p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-800 ring-1 ring-teal-100">
                  <UserRound aria-hidden="true" size={21} strokeWidth={ICON_STROKE} />
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-xl font-bold text-stone-950">{teacher.name}</h3>
                  <p className="mt-1 truncate text-sm font-semibold text-teal-700">
                    {teacher.position}
                  </p>
                </div>
              </div>
            </article>
          ))}
          {previewTeachers.length === 0 && isLoading ? (
            <div className="col-span-full rounded-lg border border-stone-200 bg-white p-6 text-sm text-stone-600 shadow-sm">
              선생님 정보를 불러오는 중입니다.
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
