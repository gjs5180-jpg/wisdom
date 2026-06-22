import Link from "next/link";
import { notFound } from "next/navigation";
import {
  categories,
  getCategory,
  getContent,
  getWorryGroup,
  isPublishableContent,
  verifiedCardCount,
} from "@/lib/content";

export function generateStaticParams() {
  return categories.map((category) => ({ category: category.slug }));
}

export async function generateMetadata({ params }) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return { title: "위즈덤" };

  return {
    title: `${cat.title} - 위즈덤`,
    description: cat.blurb,
  };
}

function statusMeta(entry) {
  if (entry.publishable) {
    return {
      label: `검증 ${entry.verifiedCount}`,
      className: "bg-clay-soft text-clay",
    };
  }

  if (entry.hasDraft) {
    return {
      label: "검증 중",
      className: "border border-line text-ink-soft",
    };
  }

  return {
    label: "준비 중",
    className: "border border-dashed border-line text-ink-faint",
  };
}

function topTags(entries, groupSlug, limit = 8) {
  const counts = new Map();

  for (const entry of entries) {
    for (const tag of entry.content.tags || []) {
      if (tag.groupSlug !== groupSlug) continue;
      const current = counts.get(tag.slug) || { ...tag, count: 0 };
      current.count += 1;
      counts.set(tag.slug, current);
    }
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title, "ko"))
    .slice(0, limit);
}

function firstDoors(entries) {
  return entries
    .flatMap((entry) => entry.content.doors || [])
    .filter(Boolean)
    .slice(0, 8);
}

export default async function CategoryPage({ params }) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  const group = getWorryGroup(cat.slug);
  const entries = cat.worries.map((worry) => {
    const content = getContent(cat.slug, worry.slug);
    const verifiedCount = verifiedCardCount(content);
    const publishable = isPublishableContent(content);
    const hasDraft = !content.placeholder && !publishable;

    return {
      ...worry,
      href: `/${cat.slug}/${worry.slug}`,
      content,
      verifiedCount,
      publishable,
      hasDraft,
      summary: content.emotion || cat.blurb,
    };
  });

  const readyEntries = entries.filter((entry) => entry.publishable);
  const draftEntries = entries.filter((entry) => entry.hasDraft);
  const plannedEntries = entries.filter(
    (entry) => !entry.publishable && !entry.hasDraft
  );
  const featuredEntries = [...readyEntries]
    .sort((a, b) => b.verifiedCount - a.verifiedCount)
    .slice(0, 3);
  const emotionTags = topTags(entries, "emotion", 7);
  const situationTags = topTags(entries, "situation", 7);
  const doors = firstDoors(readyEntries);

  return (
    <div className="fade-rise">
      <nav className="mb-5 text-sm text-ink-soft">
        <Link href="/" className="transition-colors hover:text-clay">
          홈
        </Link>
        <span className="mx-1.5 text-ink-faint">/</span>
        {group && (
          <>
            <span className="text-ink-soft">{group.title}</span>
            <span className="mx-1.5 text-ink-faint">/</span>
          </>
        )}
        <span className="text-ink">{cat.title}</span>
      </nav>

      <header className="mb-6">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
          고민 카테고리
        </p>
        <h1 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
          {cat.title}
        </h1>
        <p className="mt-2 leading-relaxed text-ink-soft">{cat.blurb}</p>
        <div className="mt-4 flex flex-wrap gap-1.5 text-xs">
          <span className="rounded-full bg-clay-soft px-2.5 py-1 font-medium text-clay">
            공개 {readyEntries.length}
          </span>
          {draftEntries.length > 0 && (
            <span className="rounded-full border border-line px-2.5 py-1 text-ink-soft">
              검증 중 {draftEntries.length}
            </span>
          )}
          {plannedEntries.length > 0 && (
            <span className="rounded-full border border-dashed border-line px-2.5 py-1 text-ink-faint">
              준비 중 {plannedEntries.length}
            </span>
          )}
        </div>
      </header>

      {featuredEntries.length > 0 && (
        <section className="mb-8">
          <div className="mb-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              먼저 보기
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">대표 카드</h2>
          </div>
          <div className="grid grid-cols-1 gap-3">
            {featuredEntries.map((entry) => (
              <Link
                key={entry.slug}
                href={entry.href}
                className="group block rounded-lg border border-line bg-paper px-4 py-4 transition-colors hover:border-clay/40"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="font-serif text-base font-bold group-hover:text-clay">
                      {entry.title}
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-ink-soft">
                      {entry.summary}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                    검증 {entry.verifiedCount}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {(emotionTags.length > 0 || situationTags.length > 0) && (
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {emotionTags.length > 0 && (
            <div>
              <h2 className="mb-2 font-serif text-base font-bold">자주 나오는 감정</h2>
              <div className="flex flex-wrap gap-2">
                {emotionTags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/tags/${tag.slug}`}
                    className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
                  >
                    <span className="text-ink">{tag.title}</span>
                    <span className="ml-1.5 text-xs text-ink-faint">{tag.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {situationTags.length > 0 && (
            <div>
              <h2 className="mb-2 font-serif text-base font-bold">자주 나오는 상황</h2>
              <div className="flex flex-wrap gap-2">
                {situationTags.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/tags/${tag.slug}`}
                    className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
                  >
                    <span className="text-ink">{tag.title}</span>
                    <span className="ml-1.5 text-xs text-ink-faint">{tag.count}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {doors.length > 0 && (
        <section className="mb-8 rounded-lg border border-line bg-paper px-4 py-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            실제로는 이런 말로 시작합니다
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {doors.map((door) => (
              <span
                key={door}
                className="rounded-full border border-line bg-cream px-3 py-1 text-sm text-ink-soft"
              >
                {door}
              </span>
            ))}
          </div>
        </section>
      )}

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              전체 카드
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">{cat.title}</h2>
          </div>
          <span className="shrink-0 text-xs text-ink-faint">
            {entries.length}개
          </span>
        </div>
        <ul className="divide-y divide-line border-y border-line">
          {entries.map((entry) => {
            const status = statusMeta(entry);

            return (
              <li key={entry.slug}>
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
                          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </span>
                      <span className="mt-1.5 block text-sm leading-relaxed text-ink-soft">
                        {entry.summary}
                      </span>
                    </span>
                    <span className="shrink-0 text-ink-faint transition-colors group-hover:text-clay">
                      -&gt;
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
