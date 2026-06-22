import Link from "next/link";
import {
  getEntryByKey,
  peopleForEntryKey,
  relatedEntriesForKey,
} from "@/lib/content";

const closingCopy = {
  worry: {
    title: "읽고 끝내지 않기",
    body:
      "이 카드는 결정을 대신하지 않습니다. 지금 상황에 맞는 관점을 하나 고르고, 오늘 할 수 있는 가장 작은 행동으로 내려보세요.",
  },
  thought: {
    title: "하나의 정의로 닫지 않기",
    body:
      "큰 질문은 한 문장으로 끝나지 않습니다. 서로 다른 기준을 비교하면서 내 삶에서 실제로 작동하는 정의를 찾아보세요.",
  },
  debate: {
    title: "편을 고르기 전에 구조 보기",
    body:
      "논쟁은 찬반보다 먼저 충돌하는 가치가 있습니다. 어느 쪽이 무엇을 지키고 무엇을 감수하는지 분리해보세요.",
  },
};

function tagGroupsFor(entry) {
  const tags = entry.tags || [];
  return {
    emotion: tags.filter((tag) => tag.groupSlug === "emotion").slice(0, 5),
    situation: tags.filter((tag) => tag.groupSlug === "situation").slice(0, 5),
    rest: tags.filter(
      (tag) => tag.groupSlug !== "emotion" && tag.groupSlug !== "situation"
    ),
  };
}

export default function RelatedExplore({ currentKey }) {
  const entry = getEntryByKey(currentKey);
  if (!entry) return null;

  const people = peopleForEntryKey(currentKey).slice(0, 4);
  const relatedEntries = relatedEntriesForKey(currentKey, 6);
  const tags = tagGroupsFor(entry);
  const closer = closingCopy[entry.axis] || closingCopy.worry;

  if (
    tags.emotion.length === 0 &&
    tags.situation.length === 0 &&
    people.length === 0 &&
    relatedEntries.length === 0
  ) {
    return null;
  }

  return (
    <section className="mt-10 border-t border-line pt-6">
      <div className="mb-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
          다음 흐름
        </p>
        <h2 className="mt-1 font-serif text-xl font-bold">이어서 보면 좋은 것</h2>
      </div>

      <div className="rounded-xl border border-line bg-paper px-4 py-4">
        <h3 className="font-serif text-base font-bold">{closer.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{closer.body}</p>
      </div>

      {relatedEntries.length > 0 && (
        <div className="mt-6">
          <div className="mb-2 flex items-end justify-between gap-3">
            <h3 className="font-serif text-base font-bold">다음에 볼 카드</h3>
            <span className="text-xs text-ink-faint">{relatedEntries.length}</span>
          </div>
          <ul className="divide-y divide-line border-y border-line">
            {relatedEntries.map((related) => (
              <li key={related.key}>
                <Link
                  href={related.href}
                  className="group block py-3 transition-colors hover:text-clay"
                >
                  <span className="flex items-start justify-between gap-3">
                    <span className="min-w-0">
                      <span className="font-serif text-[15px] font-bold">
                        {related.title}
                      </span>
                      <span className="mt-1 block text-xs text-ink-faint">
                        {related.categoryTitle}
                        {related.groupTitle ? ` · ${related.groupTitle}` : ""}
                      </span>
                      <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                        {related.summary}
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
        </div>
      )}

      {(tags.emotion.length > 0 || tags.situation.length > 0) && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {tags.emotion.length > 0 && (
            <div>
              <h3 className="mb-2 font-serif text-base font-bold">같은 감정</h3>
              <div className="flex flex-wrap gap-2">
                {tags.emotion.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/tags/${tag.slug}`}
                    className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
                  >
                    {tag.title}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {tags.situation.length > 0 && (
            <div>
              <h3 className="mb-2 font-serif text-base font-bold">같은 상황</h3>
              <div className="flex flex-wrap gap-2">
                {tags.situation.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/tags/${tag.slug}`}
                    className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
                  >
                    {tag.title}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {people.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 font-serif text-base font-bold">관련 인물</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {people.map((person) => (
              <Link
                key={person.slug}
                href={`/people/${person.slug}`}
                className="group rounded-xl border border-line bg-paper px-3 py-3 transition-colors hover:border-clay/40"
              >
                <span className="block font-serif text-sm font-bold group-hover:text-clay">
                  {person.name}
                </span>
                <span className="mt-0.5 block text-xs leading-relaxed text-ink-faint">
                  {person.culture.country} · {person.culture.tradition}
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
