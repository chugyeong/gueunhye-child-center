type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="text-xs font-bold uppercase tracking-wide text-teal-700">{eyebrow}</p>
      <h2 className="mt-2 text-2xl font-bold leading-tight text-stone-950 md:text-3xl">{title}</h2>
      {description ? (
        <p className="mt-3 text-sm leading-6 text-stone-600 md:text-base md:leading-7">
          {description}
        </p>
      ) : null}
    </div>
  );
}
