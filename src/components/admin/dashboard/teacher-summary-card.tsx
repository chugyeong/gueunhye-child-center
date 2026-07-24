import { UserRound } from "lucide-react";
import type { Teacher } from "@/types/teacher";

const ICON_STROKE = 1.8;

type TeacherSummaryCardProps = {
  teacher: Teacher;
};

export function TeacherSummaryCard({ teacher }: TeacherSummaryCardProps) {
  return (
    <article className="min-w-0 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <p className="mb-4 inline-flex rounded bg-white px-2 py-1 text-xs font-bold text-teal-700 ring-1 ring-teal-100">
        {teacher.group_name}
      </p>
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-800 ring-1 ring-teal-100">
          <UserRound aria-hidden="true" size={20} strokeWidth={ICON_STROKE} />
        </span>
        <div className="min-w-0">
          <h3 className="truncate text-base font-bold text-slate-950">{teacher.name}</h3>
          <p className="mt-1 truncate text-sm text-slate-600">{teacher.position}</p>
        </div>
      </div>
    </article>
  );
}
