import Link from "next/link";

type DashboardCardProps = {
  title: string;
  href: string;
  children: React.ReactNode;
};

export function DashboardCard({ title, href, children }: DashboardCardProps) {
  return (
    <section className="min-w-0 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-950">{title}</h2>
        <Link
          href={href}
          className="shrink-0 rounded-md px-2 py-1 text-sm font-bold text-teal-700 hover:bg-teal-50 hover:text-teal-900">
          전체보기
        </Link>
      </div>
      {children}
    </section>
  );
}
