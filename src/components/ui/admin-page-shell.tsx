type AdminPageShellProps = {
  title: string;
  description: string;
  sections: string[];
};

export function AdminPageShell({ title, description, sections }: AdminPageShellProps) {
  return (
    <section>
      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {sections.map((section) => (
          <article
            key={section}
            className="min-h-28 rounded-lg border border-dashed border-slate-300 bg-white p-4">
            <h2 className="font-semibold text-slate-900">{section}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              데이터 연결과 입력 폼은 다음 단계에서 구현합니다.
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
