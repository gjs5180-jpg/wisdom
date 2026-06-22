import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allTagParams,
  cardsForTag,
  entriesForTag,
  getTag,
} from "@/lib/content";
import PersonCard from "@/components/PersonCard";

export function generateStaticParams() {
  return allTagParams();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tag = getTag(slug);
  if (!tag) return { title: "위즈덤" };
  const readyEntries = entriesForTag(slug).filter((entry) => entry.publishable);

  return {
    title: `${tag.title} — 위즈덤 태그`,
    description: tag.intro || `${tag.title} 태그로 묶은 위즈덤 콘텐츠입니다.`,
    robots: {
      index: readyEntries.length >= 2,
      follow: true,
    },
  };
}

export default async function TagPage({ params }) {
  const { slug } = await params;
  const tag = getTag(slug);
  if (!tag) notFound();

  const entries = entriesForTag(slug);
  const readyEntries = entries.filter((entry) => entry.publishable);
  const plannedEntries = entries.filter((entry) => !entry.publishable);
  const cardHits = cardsForTag(slug).slice(0, 8);

  return (
    <div className="fade-rise">
      <nav className="text-sm text-ink-soft mb-5">
        <Link href="/" className="hover:text-clay transition-colors">
          홈
        </Link>
        <span className="mx-1.5 text-ink-faint">›</span>
        <Link href="/tags" className="hover:text-clay transition-colors">
          태그
        </Link>
        <span className="mx-1.5 text-ink-faint">›</span>
        <span className="text-ink">{tag.title}</span>
      </nav>

      <header className="mb-6">
        <p className="text-xs font-medium tracking-wider text-ink-faint uppercase">
          {tag.groupTitle}
        </p>
        <h1 className="mt-1 font-serif text-2xl sm:text-3xl font-bold">
          {tag.title}
        </h1>
        <p className="mt-2 text-ink-soft leading-relaxed">{tag.intro || tag.blurb}</p>
        <div className="mt-3 flex flex-wrap gap-1.5 text-xs">
          <span className="rounded-full bg-clay-soft px-2.5 py-1 font-medium text-clay">
            공개 {readyEntries.length}
          </span>
          {plannedEntries.length > 0 && (
            <span className="rounded-full border border-dashed border-line px-2.5 py-1 text-ink-faint">
              준비 중 {plannedEntries.length}
            </span>
          )}
          <span className="rounded-full border border-line px-2.5 py-1 text-ink-soft">
            카드 {cardHits.length}
          </span>
        </div>
      </header>

      <section>
        <h2 className="text-xs font-medium tracking-wider text-ink-faint uppercase mb-3">
          관련 페이지
        </h2>
        <ul className="divide-y divide-line border-y border-line">
          {entries.map((entry) => (
            <li key={entry.key}>
              <Link
                href={entry.href}
                className="group block py-4 transition-colors hover:text-clay"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2.5">
                      <span className="font-serif text-base font-bold">
                        {entry.title}
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          entry.publishable
                            ? "bg-clay-soft text-clay"
                            : "border border-dashed border-line text-ink-faint"
                        }`}
                      >
                        {entry.publishable ? `검증 ${entry.verifiedCount}` : "준비 중"}
                      </span>
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-ink-soft">
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

      {cardHits.length > 0 && (
        <section className="mt-8">
          <h2 className="text-xs font-medium tracking-wider text-ink-faint uppercase mb-3">
            관련 카드
          </h2>
          <div className="space-y-4">
            {cardHits.map(({ entry, card }, index) => (
              <div key={`${entry.key}-${card.name}-${index}`}>
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
      )}
    </div>
  );
}
