"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { programs } from "@/data/center";

export function ProgramDetail() {
  const [activeProgramId, setActiveProgramId] = useState(programs[0]?.id ?? "");

  useEffect(() => {
    const initialProgramId = window.location.hash.replace("#", "");
    let frameId: number | undefined;

    if (programs.some((program) => program.id === initialProgramId)) {
      frameId = window.requestAnimationFrame(() => {
        setActiveProgramId(initialProgramId);
      });
    }

    const sections = programs
      .map((program) => document.getElementById(program.id))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target.id) {
          setActiveProgramId(visibleEntry.target.id);
        }
      },
      {
        rootMargin: "-30% 0px -55% 0px",
        threshold: [0.15, 0.35, 0.6],
      },
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      observer.disconnect();

      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <>
      <nav
        aria-label="치료 프로그램 바로가기"
        className="sticky top-[82px] z-10 -mx-5 mt-10 border-y border-stone-200 bg-white/95 px-5 py-3 backdrop-blur lg:hidden"
      >
        <div className="flex gap-2 overflow-x-auto">
          {programs.map((program) => (
              <ProgramNavLink
                key={program.id}
                programId={program.id}
                label={program.title}
                activeProgramId={activeProgramId}
                onSelect={setActiveProgramId}
              />
          ))}
        </div>
      </nav>

      <div className="mt-10 grid gap-10 lg:grid-cols-[240px_1fr] lg:items-start">
        <aside className="sticky top-28 hidden rounded-lg border border-stone-200 bg-white p-4 lg:block">
          <p className="px-2 text-sm font-bold text-stone-950">프로그램 목록</p>
          <nav aria-label="치료 프로그램 사이드 메뉴" className="mt-3 grid gap-1">
            {programs.map((program) => (
              <ProgramNavLink
                key={program.id}
                programId={program.id}
                label={program.title}
                activeProgramId={activeProgramId}
                onSelect={setActiveProgramId}
                desktop
              />
            ))}
          </nav>
        </aside>

        <div className="grid gap-12">
          {programs.map((program, index) => {
            const imageFirst = index % 2 === 1;

            return (
              <article
                id={program.id}
                key={program.id}
                data-aos="fade-up"
                className="scroll-mt-36 overflow-hidden rounded-lg border border-stone-200 bg-white shadow-sm"
              >
                <div className="grid gap-0 lg:grid-cols-2">
                  <div
                    className={`relative min-h-[260px] md:min-h-[360px] ${
                      imageFirst ? "lg:order-2" : ""
                    }`}
                  >
                    <Image
                      src={program.image}
                      alt={program.imageAlt ?? `${program.title} 관련 센터 공간`}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 40vw, 100vw"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-6 md:p-10">
                    <p className="text-xs font-semibold uppercase tracking-wide text-rose-700">
                      {program.tag}
                    </p>
                    <h2 className="mt-4 text-3xl font-bold text-stone-950">
                      {program.title}
                    </h2>
                    <p className="mt-5 text-base leading-8 text-stone-600">
                      {program.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </>
  );
}

type ProgramNavLinkProps = {
  programId: string;
  label: string;
  activeProgramId: string;
  onSelect: (programId: string) => void;
  desktop?: boolean;
};

function ProgramNavLink({
  programId,
  label,
  activeProgramId,
  onSelect,
  desktop = false,
}: ProgramNavLinkProps) {
  const isActive = activeProgramId === programId;

  return (
    <Link
      href={`#${programId}`}
      aria-current={isActive ? "true" : undefined}
      onClick={() => onSelect(programId)}
      className={
        desktop
          ? `rounded-md px-3 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-teal-50 text-teal-800"
                : "text-stone-600 hover:bg-stone-50 hover:text-teal-800"
            }`
          : `shrink-0 rounded-md border px-3 py-2 text-sm font-semibold transition ${
              isActive
                ? "border-teal-400 bg-teal-50 text-teal-800"
                : "border-stone-200 bg-white text-stone-700 hover:border-teal-300 hover:text-teal-800"
            }`
      }
    >
      {label}
    </Link>
  );
}
