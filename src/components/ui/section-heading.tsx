type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-wide text-teal-700">
        {eyebrow}
      </p>
      <h2 className="mt-3 text-3xl font-bold text-stone-950 md:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-4 text-base leading-7 text-stone-600">
          {description}
        </p>
      ) : null}
    </div>
  );
}
