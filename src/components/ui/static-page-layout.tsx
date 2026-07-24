type StaticPageLayoutItem = {
  title: string;
  description: string;
};

type StaticPageLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  items?: StaticPageLayoutItem[];
};

export function StaticPageLayout({
  eyebrow,
  title,
  description,
  items = [],
}: StaticPageLayoutProps) {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-5 py-16 md:py-24">
        <p
          data-aos="fade-up"
          className="text-sm font-semibold uppercase tracking-wide text-teal-700">
          {eyebrow}
        </p>
        <h1
          data-aos="fade-up"
          data-aos-delay="70"
          className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-stone-950 md:text-5xl">
          {title}
        </h1>
        <p
          data-aos="fade-up"
          data-aos-delay="120"
          className="mt-5 max-w-2xl text-lg leading-8 text-stone-600">
          {description}
        </p>
        {items.length > 0 ? (
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {items.map((item) => (
              <article
                key={item.title}
                data-aos="fade-up"
                className="rounded-lg border border-stone-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-stone-950">{item.title}</h2>
                <p className="mt-3 text-sm leading-6 text-stone-600">{item.description}</p>
              </article>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
