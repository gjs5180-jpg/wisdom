import Link from "next/link";
import {
  getEntryByKey,
  peopleForEntryKey,
  relatedEntriesForKey,
} from "@/lib/content";
import {
  formatSignalLocales,
  sourceLocaleSignalStrengthLabel,
} from "@/lib/source-locale-signals";

const axisLabels = {
  worry: "고민",
  thought: "생각",
  debate: "논쟁",
};

const relatedGroupCopy = {
  worry: {
    title: "비슷한 고민",
    body: "감정과 상황이 가까운 카드입니다.",
  },
  debate: {
    title: "연결된 논쟁",
    body: "같은 문제를 사회적 가치 충돌로 넓혀봅니다.",
  },
  thought: {
    title: "큰 질문으로 보기",
    body: "개별 상황 뒤에 있는 기준과 삶의 질문으로 이어집니다.",
  },
};

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

function relatedGroupsFor(entries) {
  return ["worry", "debate", "thought"]
    .map((axis) => ({
      axis,
      ...relatedGroupCopy[axis],
      entries: entries.filter((entry) => entry.axis === axis).slice(0, 3),
    }))
    .filter((group) => group.entries.length > 0);
}

function CompactLink({ href, eyebrow, title, body }) {
  return (
    <Link
      href={href}
      className="group block rounded-lg border border-line bg-paper px-4 py-3 transition-colors hover:border-clay/40"
    >
      <span className="block text-[11px] font-medium uppercase tracking-wider text-ink-faint">
        {eyebrow}
      </span>
      <span className="mt-1 block font-serif text-base font-bold group-hover:text-clay">
        {title}
      </span>
      {body && (
        <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
          {body}
        </span>
      )}
    </Link>
  );
}

export default function RelatedExplore({ currentKey }) {
  const entry = getEntryByKey(currentKey);
  if (!entry) return null;

  const people = peopleForEntryKey(currentKey).slice(0, 4);
  const relatedEntries = relatedEntriesForKey(currentKey, 9);
  const relatedGroups = relatedGroupsFor(relatedEntries);
  const tags = tagGroupsFor(entry);
  const closer = closingCopy[entry.axis] || closingCopy.worry;
  const signal = entry.content?.sourceLocaleSignal;

  const firstRelated = relatedEntries[0];
  const firstEmotion = tags.emotion[0];
  const firstSituation = tags.situation[0];
  const firstPerson = people[0];
  const quickPaths = [
    firstRelated && {
      href: firstRelated.href,
      eyebrow: "다음 카드",
      title: firstRelated.title,
      body: firstRelated.summary,
    },
    firstEmotion && {
      href: `/tags/${firstEmotion.slug}`,
      eyebrow: "같은 감정",
      title: firstEmotion.title,
      body: firstEmotion.blurb,
    },
    firstSituation && {
      href: `/tags/${firstSituation.slug}`,
      eyebrow: "같은 상황",
      title: firstSituation.title,
      body: firstSituation.blurb,
    },
    firstPerson && {
      href: `/people/${firstPerson.slug}`,
      eyebrow: "관련 인물",
      title: firstPerson.name,
      body: firstPerson.summary,
    },
  ].filter(Boolean);

  if (
    quickPaths.length === 0 &&
    tags.emotion.length === 0 &&
    tags.situation.length === 0 &&
    people.length === 0 &&
    relatedEntries.length === 0 &&
    !signal
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

      <div className="rounded-lg border border-line bg-cream px-4 py-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-serif text-base font-bold">{closer.title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
              {closer.body}
            </p>
          </div>
          <span className="shrink-0 rounded-full bg-paper px-2 py-0.5 text-[11px] font-medium text-ink-soft ring-1 ring-line">
            {axisLabels[entry.axis] || "카드"}
          </span>
        </div>
        {signal && (
          <p className="mt-3 border-t border-line pt-3 text-sm leading-relaxed text-ink-soft">
            이 주제는 {signal.localeCoverage}개 언어권에서 반복 신호가 있습니다.
            {signal.strongestLocales?.length > 0
              ? ` 특히 ${formatSignalLocales(signal.strongestLocales)}에서 두드러집니다.`
              : ""}{" "}
            <span className="text-clay">
              {sourceLocaleSignalStrengthLabel(signal.strength)}
            </span>
          </p>
        )}
      </div>

      {quickPaths.length > 0 && (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {quickPaths.slice(0, 4).map((path) => (
            <CompactLink key={`${path.eyebrow}-${path.href}`} {...path} />
          ))}
        </div>
      )}

      {relatedGroups.length > 0 && (
        <div className="mt-7 space-y-6">
          {relatedGroups.map((group) => (
            <div key={group.axis}>
              <div className="mb-2 flex items-end justify-between gap-3">
                <div>
                  <h3 className="font-serif text-base font-bold">{group.title}</h3>
                  <p className="mt-0.5 text-xs leading-relaxed text-ink-faint">
                    {group.body}
                  </p>
                </div>
                <span className="text-xs text-ink-faint">{group.entries.length}</span>
              </div>
              <ul className="divide-y divide-line border-y border-line">
                {group.entries.map((related) => (
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
          ))}
        </div>
      )}

      {(tags.emotion.length > 0 || tags.situation.length > 0) && (
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {tags.emotion.length > 0 && (
            <div>
              <h3 className="mb-2 font-serif text-base font-bold">같은 감정</h3>
              <div className="flex flex-wrap gap-2">
                {tags.emotion.map((tag) => (
                  <Link
                    key={tag.slug}
                    href={`/tags/${tag.slug}`}
                    className="rounded-lg border border-line bg-paper px-3 py-1 text-sm text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
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
                    className="rounded-lg border border-line bg-paper px-3 py-1 text-sm text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
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
        <div className="mt-7">
          <h3 className="mb-2 font-serif text-base font-bold">관련 인물</h3>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {people.map((person) => (
              <Link
                key={person.slug}
                href={`/people/${person.slug}`}
                className="group rounded-lg border border-line bg-paper px-3 py-3 transition-colors hover:border-clay/40"
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
