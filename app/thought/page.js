import Link from "next/link";
import {
  allThoughtEntries,
  getThoughtContent,
  groupedThoughts,
  isPublishableContent,
  verifiedCardCount,
} from "@/lib/content";

export const metadata = {
  title: "생각 - 마인드루트",
  description: "행복, 성공, 자유, 좋은 삶처럼 오래 남는 질문을 여러 관점으로 정리합니다.",
};

function statusMeta(ready, hasDraft, verifiedCount) {
  if (ready) return { label: `검증 ${verifiedCount}`, className: "bg-clay-soft text-clay" };
  if (hasDraft) return { label: "검증 중", className: "border border-line text-ink-soft" };
  return { label: "준비 중", className: "border border-dashed border-line text-ink-faint" };
}

function topTags(entries, limit = 12) {
  const counts = new Map();

  for (const entry of entries) {
    for (const tag of entry.tags || []) {
      const current = counts.get(tag.slug) || { ...tag, count: 0 };
      current.count += 1;
      counts.set(tag.slug, current);
    }
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title, "ko"))
    .slice(0, limit);
}

export default function ThoughtListPage() {
  const entries = allThoughtEntries();
  const readyEntries = entries.filter((entry) => entry.publishable);
  const featuredEntries = [...readyEntries]
    .sort((a, b) => b.verifiedCount - a.verifiedCount)
    .slice(0, 4);
  const tags = topTags(entries);
  const groups = groupedThoughts();

  return (
    <div className="fade-rise">
      <nav className="mb-5 text-sm text-ink-soft">
        <Link href="/" className="transition-colors hover:text-clay">
          홈
        </Link>
        <span className="mx-1.5 text-ink-faint">/</span>
        <span className="text-ink">생각</span>
      </nav>

      <header className="mb-6">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
          큰 질문
        </p>
        <h1 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">생각</h1>
        <p className="mt-2 leading-relaxed text-ink-soft">
          행복, 성공, 자유, 좋은 삶처럼 오래 남는 질문을 하나의 답으로 닫지
          않고 여러 기준으로 비교합니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5 text-xs">
          <span className="rounded-full bg-clay-soft px-2.5 py-1 font-medium text-clay">
            공개 {readyEntries.length}
          </span>
          <span className="rounded-full border border-line px-2.5 py-1 text-ink-soft">
            그룹 {groups.length}
          </span>
        </div>
      </header>

      {featuredEntries.length > 0 && (
        <section className="mb-8">
          <div className="mb-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              먼저 보기
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">대표 질문</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {featuredEntries.map((entry) => (
              <Link
                key={entry.key}
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
                    <span className="mt-1.5 block text-xs text-ink-faint">
                      {entry.groupTitle}
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

      {tags.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-2 font-serif text-base font-bold">자주 연결되는 태그</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
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
        </section>
      )}

      <section>
        <div className="mb-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            전체 질문
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold">질문 묶음</h2>
        </div>
        <div className="space-y-7">
          {groups.map((group) => (
            <section key={group.slug}>
              <div className="mb-2">
                <h3 className="font-serif text-lg font-bold">{group.title}</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">
                  {group.blurb}
                </p>
              </div>
              <ul className="divide-y divide-line border-y border-line">
                {group.thoughts.map((thought) => {
                  const content = getThoughtContent(thought.slug);
                  const ready = isPublishableContent(content);
                  const hasDraft = !content.placeholder && !ready;
                  const verifiedCount = verifiedCardCount(content);
                  const status = statusMeta(ready, hasDraft, verifiedCount);

                  return (
                    <li key={thought.slug}>
                      <Link
                        href={`/thought/${thought.slug}`}
                        className="group block py-4 transition-colors hover:text-clay"
                      >
                        <span className="flex items-start justify-between gap-3">
                          <span className="min-w-0">
                            <span className="flex flex-wrap items-center gap-2.5">
                              <span className="font-serif text-base font-bold">
                                {thought.question}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${status.className}`}
                              >
                                {status.label}
                              </span>
                            </span>
                            <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                              {thought.blurb}
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
          ))}
        </div>
      </section>
    </div>
  );
}
