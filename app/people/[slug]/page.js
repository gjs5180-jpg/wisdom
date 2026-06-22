import Link from "next/link";
import { notFound } from "next/navigation";
import { allPersonParams, getPerson } from "@/lib/content";
import PersonCard from "@/components/PersonCard";

export function generateStaticParams() {
  return allPersonParams();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const person = getPerson(slug);
  if (!person) return { title: "위즈덤" };

  return {
    title: `${person.name} — 위즈덤 인물`,
    description: person.summary,
    robots: {
      index: person.cardCount >= 2,
      follow: true,
    },
  };
}

export default async function PersonPage({ params }) {
  const { slug } = await params;
  const person = getPerson(slug);
  if (!person) notFound();

  return (
    <div className="fade-rise">
      <nav className="text-sm text-ink-soft mb-5">
        <Link href="/" className="hover:text-clay transition-colors">
          홈
        </Link>
        <span className="mx-1.5 text-ink-faint">›</span>
        <Link href="/people" className="hover:text-clay transition-colors">
          인물
        </Link>
        <span className="mx-1.5 text-ink-faint">›</span>
        <span className="text-ink">{person.name}</span>
      </nav>

      <header className="mb-6">
        <p className="text-xs font-medium tracking-wider text-ink-faint uppercase">
          {person.role}
        </p>
        <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold">
          {person.name}
        </h1>
        <p className="mt-3 text-ink-soft leading-relaxed">{person.intro}</p>
        <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
          <span className="rounded-full bg-clay-soft px-2.5 py-1 font-medium text-clay">
            카드 {person.cardCount}
          </span>
          <span className="rounded-full border border-line px-2.5 py-1 text-ink-soft">
            관련 페이지 {person.entryCount}
          </span>
          <span className="rounded-full border border-line px-2.5 py-1 text-ink-soft">
            {person.culture.country}
          </span>
          <span className="rounded-full border border-line px-2.5 py-1 text-ink-soft">
            {person.culture.tradition}
          </span>
          <span className="rounded-full border border-line px-2.5 py-1 text-ink-soft">
            {person.culture.era}
          </span>
        </div>
      </header>

      {person.tags.length > 0 && (
        <section className="mb-6">
          <h2 className="text-xs font-medium tracking-wider text-ink-faint uppercase mb-2">
            자주 연결되는 태그
          </h2>
          <div className="flex flex-wrap gap-2">
            {person.tags.map((tag) => (
              <Link
                key={tag.slug}
                href={`/tags/${tag.slug}`}
                className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
              >
                {tag.title}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <h2 className="text-xs font-medium tracking-wider text-ink-faint uppercase mb-3">
          등장하는 페이지
        </h2>
        <ul className="divide-y divide-line border-y border-line">
          {person.entries.map((entry) => (
            <li key={entry.key}>
              <Link
                href={entry.href}
                className="group block py-4 transition-colors hover:text-clay"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="font-serif text-base font-bold">{entry.title}</span>
                    <span className="mt-1 block text-sm text-ink-soft">
                      {entry.summary}
                    </span>
                    <span className="mt-1.5 block text-xs text-ink-faint">
                      {entry.categoryTitle}
                      {entry.groupTitle ? ` · ${entry.groupTitle}` : ""}
                    </span>
                  </span>
                  <span className="shrink-0 text-ink-faint transition-colors group-hover:text-clay">
                    ›
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xs font-medium tracking-wider text-ink-faint uppercase mb-3">
          관점 카드
        </h2>
        <div className="space-y-4">
          {person.cards.map(({ entry, card }, index) => (
            <div key={`${entry.key}-${index}`}>
              <Link
                href={entry.href}
                className="mb-2 inline-block text-xs text-ink-faint transition-colors hover:text-clay"
              >
                {entry.title}에서 보기 →
              </Link>
              <PersonCard card={card} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
