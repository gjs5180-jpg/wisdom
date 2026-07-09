import Link from "next/link";
import {
  allDebateEntries,
  debatePositionSummary,
  debatePositionSections,
  getDebateContent,
  groupedDebates,
  isPublishableContent,
  verifiedCardCount,
} from "@/lib/content";

export const metadata = {
  title: "논쟁 - 마인드루트",
  description: "AI, 결혼, 자유, 처벌처럼 가치가 충돌하는 질문을 입장과 근거로 나눠 봅니다.",
};

function statusMeta(ready, hasDraft, verifiedCount) {
  if (ready) return { label: `검증 ${verifiedCount}`, className: "bg-clay-soft text-clay" };
  if (hasDraft) return { label: "검증 중", className: "border border-line text-ink-soft" };
  return { label: "준비 중", className: "border border-dashed border-line text-ink-faint" };
}

function topTags(entries, limit = 14) {
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

function debatePositionMeta(slug) {
  const summary = debatePositionSummary(slug);
  const labels = [...new Set(summary.map((item) => item.positionTitle))];

  return {
    count: labels.length,
    labels,
  };
}

export default function DebateListPage() {
  const entries = allDebateEntries();
  const readyEntries = entries.filter((entry) => entry.publishable);
  const featuredEntries = [...readyEntries]
    .sort((a, b) => b.verifiedCount - a.verifiedCount)
    .slice(0, 4);
  const balancedEntries = [...readyEntries]
    .map((entry) => ({
      entry,
      positionMeta: debatePositionMeta(entry.key.replace("debate/", "")),
    }))
    .filter(({ entry, positionMeta }) => entry.verifiedCount >= 3 && positionMeta.count >= 3)
    .sort(
      (a, b) =>
        b.positionMeta.count - a.positionMeta.count ||
        b.entry.verifiedCount - a.entry.verifiedCount ||
        a.entry.title.localeCompare(b.entry.title, "ko")
    )
    .slice(0, 6);
  const positionSections = debatePositionSections();
  const tags = topTags(entries);
  const groups = groupedDebates();

  return (
    <div className="fade-rise">
      <nav className="mb-5 text-sm text-ink-soft">
        <Link href="/" className="transition-colors hover:text-clay">
          홈
        </Link>
        <span className="mx-1.5 text-ink-faint">/</span>
        <span className="text-ink">논쟁</span>
      </nav>

      <header className="mb-6">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
          가치 충돌
        </p>
        <h1 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">논쟁</h1>
        <p className="mt-2 leading-relaxed text-ink-soft">
          찬반을 빨리 고르기보다 어떤 가치가 충돌하는지, 각 입장이 무엇을
          지키고 무엇을 감수하는지 먼저 나눠 봅니다.
        </p>
        <div className="mt-4 flex flex-wrap gap-1.5 text-xs">
          <span className="rounded-full bg-clay-soft px-2.5 py-1 font-medium text-clay">
            공개 {readyEntries.length}
          </span>
          <span className="rounded-full border border-line px-2.5 py-1 text-ink-soft">
            주제 묶음 {groups.length}
          </span>
          <span className="rounded-full border border-line px-2.5 py-1 text-ink-soft">
            입장 축 {positionSections.length}
          </span>
        </div>
      </header>

      {featuredEntries.length > 0 && (
        <section className="mb-8">
          <div className="mb-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              먼저 보기
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">대표 논쟁</h2>
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

      {balancedEntries.length > 0 && (
        <section className="mb-8">
          <div className="mb-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              균형 잡힌 읽기
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">세 관점 이상으로 보는 논쟁</h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {balancedEntries.map(({ entry, positionMeta }) => (
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
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {positionMeta.labels.slice(0, 3).map((label) => (
                        <span
                          key={`${entry.key}-${label}`}
                          className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-soft"
                        >
                          {label}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                    관점 {positionMeta.count}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <div className="mb-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            입장별 보기
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold">논쟁을 나누는 축</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {positionSections.map((section) => (
            <a
              key={section.slug}
              href={`#position-${section.slug}`}
              className="rounded-lg border border-line bg-paper px-4 py-4 transition-colors hover:border-clay/40"
            >
              <span className="flex items-start justify-between gap-3">
                <span>
                  <span className="font-serif text-base font-bold">{section.title}</span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                    {section.blurb}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                  {section.hits.length}
                </span>
              </span>
            </a>
          ))}
        </div>
      </section>

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
            전체 논쟁
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold">주제 묶음</h2>
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
                {group.debates.map((debate) => {
                  const content = getDebateContent(debate.slug);
                  const ready = isPublishableContent(content);
                  const hasDraft = !content.placeholder && !ready;
                  const verifiedCount = verifiedCardCount(content);
                  const status = statusMeta(ready, hasDraft, verifiedCount);
                  const positionMeta = debatePositionMeta(debate.slug);

                  return (
                    <li key={debate.slug}>
                      <Link
                        href={`/debate/${debate.slug}`}
                        className="group block py-4 transition-colors hover:text-clay"
                      >
                        <span className="flex items-start justify-between gap-3">
                          <span className="min-w-0">
                            <span className="flex flex-wrap items-center gap-2.5">
                              <span className="font-serif text-base font-bold">
                                {debate.question}
                              </span>
                              <span
                                className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${status.className}`}
                              >
                                {status.label}
                              </span>
                              {positionMeta.count > 1 && (
                                <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-soft">
                                  관점 {positionMeta.count}
                                </span>
                              )}
                            </span>
                            <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                              {debate.blurb}
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

      <section className="mt-10 border-t border-line pt-7">
        <h2 className="mb-4 text-xs font-medium uppercase tracking-wider text-ink-faint">
          입장 카드 모음
        </h2>
        <div className="space-y-7">
          {positionSections.map((section) => (
            <section key={section.slug} id={`position-${section.slug}`}>
              <div className="mb-2">
                <h3 className="font-serif text-lg font-bold">{section.title}</h3>
                <p className="mt-0.5 text-sm leading-relaxed text-ink-soft">
                  {section.blurb}
                </p>
              </div>
              <ul className="divide-y divide-line border-y border-line">
                {section.hits.slice(0, 8).map(({ entry, card }) => (
                  <li key={`${entry.key}-${card.name}-${card.stance}`}>
                    <Link
                      href={entry.href}
                      className="group block py-4 transition-colors hover:text-clay"
                    >
                      <span className="flex items-start justify-between gap-3">
                        <span className="min-w-0">
                          <span className="block text-xs text-ink-faint">
                            {entry.title}
                          </span>
                          <span className="mt-1 flex flex-wrap items-center gap-2.5">
                            <span className="font-serif text-base font-bold">
                              {card.name}
                            </span>
                            {card.stance && (
                              <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-soft">
                                {card.stance}
                              </span>
                            )}
                          </span>
                          <span className="mt-1.5 block text-sm leading-relaxed text-ink-soft">
                            {card.view}
                          </span>
                        </span>
                        <span className="shrink-0 text-ink-faint transition-colors group-hover:text-clay">
                          -&gt;
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </section>
    </div>
  );
}
