import Link from "next/link";
import HomeSearch from "@/components/HomeSearch";
import {
  allDebateEntries,
  allPeople,
  allThoughtEntries,
  allWorryEntries,
  debatePositionSummary,
  groupedTagsWithCounts,
  groupedWorryCategories,
  perspectiveLenses,
} from "@/lib/content";
import { collectedStats } from "@/lib/collected";
import { enrichedEnglishSeeds } from "@/lib/global-content";
import { prioritySourceLocales, sourceLocaleStats } from "@/lib/source-locales";
import { sourceLocaleSearchTextForInsights } from "@/lib/source-locale-insights";
import {
  commonSourceLocaleSignals,
  sourceLocaleHighlights,
  sourceLocaleSignalStrengthLabel,
  strongestSourceLocaleSignals,
} from "@/lib/source-locale-signals";

const searchAliasByPrefix = {
  love: "연애 사랑 짝사랑 고백 썸 답장 애착 불안형",
  breakup: "이별 헤어짐 전애인 전남친 전여친 미련 재회 잠수이별 연락",
  "self-esteem": "자존감 열등감 비교 칭찬 뒤처짐 자신감",
  relationships: "인간관계 친구 외로움 거절 관계 손절 상처 말실수",
  work: "직장 회사 일 퇴사 이직 상사 번아웃 인정 커리어",
  meaning: "의미 무기력 공허 죽음 목표 방황 삶의 이유",
  family: "가족 부모 엄마 아빠 명절 독립 갈등 절연",
  money: "돈 금전 재정 미래 불안 생계 저축",
  study: "공부 시험 자격증 집중 불합격 수험 성적",
  digital: "스마트폰 도파민 중독 SNS 유튜브 릴스 쇼츠",
  body: "몸 건강 외모 탈모 불면 노화 질병 불안",
  career: "진로 커리어 직업 선택 후회 전공",
  debate: "논쟁 토론 찬반 윤리 정의 자유 AI 결혼",
  thought: "생각 철학 행복 성공 자유 좋은 삶 의미",
};

const axisLabels = {
  worry: "고민",
  debate: "논쟁",
  thought: "생각",
};

function searchAliasesForEntry(entry) {
  const prefix = entry.key.split("/")[0];
  const axisAlias = searchAliasByPrefix[entry.axis] || "";
  const prefixAlias = searchAliasByPrefix[prefix] || "";
  const doorAliases = entry.content?.doors?.join(" ") || "";
  const sourceLocaleAliases = sourceLocaleSearchTextForInsights(
    entry.content?.sourceLocaleInsights || []
  );
  return `${axisAlias} ${prefixAlias} ${doorAliases} ${sourceLocaleAliases}`;
}

function serializeEntry(entry) {
  return {
    key: entry.key,
    href: entry.href,
    title: entry.title,
    summary: entry.summary,
    categoryTitle: entry.categoryTitle,
    groupTitle: entry.groupTitle,
    typeLabel: axisLabels[entry.axis] || "카드",
    badgeLabel: `검증 ${entry.verifiedCount}`,
    verifiedCount: entry.verifiedCount,
    tags: entry.tags?.map((tag) => tag.title).join(" ") || "",
    aliases: searchAliasesForEntry(entry),
  };
}

function statusLabel(status) {
  const labels = {
    active: "수집 중",
    "source-ready": "다음 수집",
    planned: "예정",
  };
  return labels[status] || status;
}

function debatePositionLabels(entry) {
  return [
    ...new Set(
      debatePositionSummary(entry.key.replace("debate/", "")).map(
        (position) => position.positionTitle
      )
    ),
  ];
}

export default function HomePage() {
  const featuredOrder = [
    "debate/remote-work",
    "family/parent-conflict",
    "breakup/ghosting",
    "study/exam-anxiety",
    "meaning/meaningless",
    "relationships/people-pleasing",
    "meaning/emptiness",
    "love/reply-anxiety",
    "work/work-depression",
    "digital/dopamine-addiction",
    "debate/childfree",
    "body/health-anxiety",
  ];
  const deepWorryOrder = [
    "love/reply-anxiety",
    "love/attachment-anxiety",
    "breakup/ghosting",
    "work/burnout",
    "self-esteem/low-self-esteem",
    "relationships/cant-say-no",
    "meaning/fear-death",
    "meaning/meaningless",
  ];

  const worryEntries = allWorryEntries();
  const thoughtEntries = allThoughtEntries();
  const debateEntries = allDebateEntries();
  const peopleEntries = allPeople();
  const allEntries = [...worryEntries, ...thoughtEntries, ...debateEntries];
  const readyEntries = allEntries.filter((entry) => entry.publishable);
  const worryCategoryGroups = groupedWorryCategories();
  const crossTagGroups = groupedTagsWithCounts();
  const collection = collectedStats();
  const sourceStats = sourceLocaleStats();
  const sourceLocales = prioritySourceLocales(7);
  const englishEntries = enrichedEnglishSeeds().filter((entry) => entry.publishable);
  const englishSpotlightEntries = englishEntries
    .filter((entry) => (entry.cardCount || 0) >= 4)
    .sort(
      (a, b) =>
        (b.content?.sourceLocaleSignal?.totalUsable || 0) -
          (a.content?.sourceLocaleSignal?.totalUsable || 0) ||
        a.priority - b.priority
    )
    .slice(0, 4);

  const entryByKey = new Map(readyEntries.map((entry) => [entry.key, entry]));
  const signalEntryFor = (signal) => entryByKey.get(signal.key);

  const featuredEntries = featuredOrder
    .map((key) => entryByKey.get(key))
    .filter(Boolean);
  const deepWorryEntries = deepWorryOrder
    .map((key) => entryByKey.get(key))
    .filter((entry) => entry?.axis === "worry" && (entry.content.cards?.length || 0) >= 4)
    .slice(0, 4);
  const balancedDebateEntries = debateEntries
    .filter((entry) => entry.publishable)
    .map((entry) => ({
      entry,
      positionLabels: debatePositionLabels(entry),
    }))
    .filter(({ positionLabels }) => positionLabels.length >= 3)
    .sort(
      (a, b) =>
        b.positionLabels.length - a.positionLabels.length ||
        b.entry.verifiedCount - a.entry.verifiedCount ||
        a.entry.title.localeCompare(b.entry.title, "ko")
    )
    .slice(0, 4);
  const strongestSignals = strongestSourceLocaleSignals(6);
  const topSignalCards = strongestSignals
    .map((signal) => ({ signal, entry: signalEntryFor(signal) }))
    .filter((item) => item.entry)
    .slice(0, 4);
  const commonSignalLinks = commonSourceLocaleSignals(6)
    .map((signal) => ({ signal, entry: signalEntryFor(signal) }))
    .filter((item) => item.entry);
  const localeSourceRows = sourceLocales.map((locale) => {
    const highlights = sourceLocaleHighlights(locale.locale, 2)
      .map((highlight) => ({
        highlight,
        entry: signalEntryFor(highlight.signal),
      }))
      .filter((item) => item.entry);

    return {
      locale,
      highlights,
      href: highlights.length > 0 ? `/source-locales/${locale.locale}` : null,
    };
  });
  const sourceLocaleByCode = new Map(sourceLocales.map((locale) => [locale.locale, locale]));
  const sourceLocaleLabel = (code) => sourceLocaleByCode.get(code)?.nativeLabel || code;
  const sourcePhraseSpotlights = readyEntries
    .map((entry) => {
      const insights = (entry.content?.sourceLocaleInsights || [])
        .filter((insight) => insight.sourcePhrases?.length > 0)
        .sort((a, b) => Number(a.generated) - Number(b.generated))
        .slice(0, 2);
      if (insights.length < 2) return null;

      return {
        entry,
        insights,
        totalUsable: entry.content?.sourceLocaleSignal?.totalUsable || 0,
      };
    })
    .filter(Boolean)
    .sort(
      (a, b) =>
        b.totalUsable - a.totalUsable ||
        a.entry.title.localeCompare(b.entry.title, "ko")
    )
    .slice(0, 4);
  const curatedSourceLocaleCount = readyEntries.filter((entry) =>
    (entry.content?.sourceLocaleInsights || []).some((insight) => !insight.generated)
  ).length;

  const searchEntries = readyEntries.map(serializeEntry);
  const suggestedEntries = featuredEntries.slice(0, 5).map(serializeEntry);

  const categoryBySlug = new Map(
    worryCategoryGroups.flatMap((group) =>
      group.categories.map((category) => [category.slug, category])
    )
  );
  const readyCountForCategory = (slug) =>
    worryEntries.filter(
      (entry) => entry.publishable && entry.key.startsWith(`${slug}/`)
    ).length;

  const primaryEntrances = [
    {
      title: "고민",
      href: "#worry-start",
      blurb: "연애, 이별, 일, 가족, 돈, 몸처럼 지금 삶에 걸린 문제.",
      count: worryEntries.filter((entry) => entry.publishable).length,
    },
    {
      title: "논쟁",
      href: "/debate",
      blurb: "AI, 결혼, 자유, 처벌처럼 가치가 충돌하는 질문.",
      count: debateEntries.filter((entry) => entry.publishable).length,
    },
    {
      title: "생각",
      href: "/thought",
      blurb: "행복, 성공, 좋은 삶처럼 오래 남는 큰 질문.",
      count: thoughtEntries.filter((entry) => entry.publishable).length,
    },
    {
      title: "인물",
      href: "/people",
      blurb: "철학자와 사상가의 관점이 고민에서 어떻게 반복되는지 보기.",
      count: peopleEntries.length,
    },
  ];

  const globalBridgeEntrances = [
    {
      title: "영어 버전",
      href: "/en",
      blurb: "한국어 원본 지도를 바탕으로 영어 검색어와 영어 상세 페이지를 연결합니다.",
      count: englishEntries.length,
    },
    {
      title: "언어권 소스",
      href: "/source-locales",
      blurb: "일본어, 중국어, 스페인어, 프랑스어, 독일어 표현에서 반복되는 고민 신호를 봅니다.",
      count: sourceStats.total,
    },
    {
      title: "수집 현황",
      href: "/collected",
      blurb: "긁어모은 표현이 어떤 카드와 주제로 정리됐는지 확인합니다.",
      count: collection.total,
    },
    {
      title: "인물 지도",
      href: "/people",
      blurb: "철학자, 연구자, 제도 관점이 여러 고민에서 어떻게 다시 등장하는지 봅니다.",
      count: peopleEntries.length,
    },
  ];

  const categoryEntrances = [
    "love",
    "breakup",
    "relationships",
    "work",
    "meaning",
    "family",
    "body",
    "study",
  ]
    .map((slug) => {
      const category = categoryBySlug.get(slug);
      if (!category) return null;
      return {
        title: category.title,
        blurb: category.blurb,
        href: `/${slug}`,
        count: readyCountForCategory(slug),
      };
    })
    .filter(Boolean);

  const statRows = [
    { label: "공개 카드", value: readyEntries.length },
    { label: "수집 표현", value: collection.total },
    { label: "인물 관점", value: peopleEntries.length },
    { label: "소스 언어", value: sourceStats.total },
  ];

  const topTags = crossTagGroups.flatMap((group) => group.tags.slice(0, 8)).slice(0, 16);
  const people = peopleEntries.slice(0, 6);
  const exploreEntries = [
    ...categoryEntrances.map((category) => ({
      key: `category/${category.href}`,
      href: category.href,
      title: category.title,
      summary: category.blurb,
      categoryTitle: "카테고리",
      groupTitle: "고민 입구",
      typeLabel: "카테고리",
      badgeLabel: `카드 ${category.count}`,
      verifiedCount: category.count,
      tags: "",
      aliases: `${category.title} ${category.blurb}`,
    })),
    ...topTags.map((tag) => ({
      key: `tag/${tag.slug}`,
      href: `/tags/${tag.slug}`,
      title: tag.title,
      summary: tag.blurb || `${tag.entryCount}개 카드가 이 태그로 묶여 있습니다.`,
      categoryTitle: "태그",
      groupTitle: "감정 / 상황",
      typeLabel: "태그",
      badgeLabel: `카드 ${tag.entryCount}`,
      verifiedCount: tag.entryCount,
      tags: tag.title,
      aliases: `${tag.title} ${tag.blurb || ""}`,
    })),
    ...peopleEntries.slice(0, 10).map((person) => ({
      key: `person/${person.slug}`,
      href: `/people/${person.slug}`,
      title: person.name,
      summary: person.summary,
      categoryTitle: "인물",
      groupTitle: person.culture?.tradition,
      typeLabel: "인물",
      badgeLabel: `카드 ${person.cardCount}`,
      verifiedCount: person.cardCount,
      tags: person.tags?.map((tag) => tag.title).join(" ") || "",
      aliases: `${person.name} ${person.culture?.country || ""} ${
        person.culture?.tradition || ""
      } ${person.summary}`,
    })),
    ...localeSourceRows
      .filter((row) => row.href)
      .map(({ locale, highlights, href }) => ({
        key: `source-locale/${locale.locale}`,
        href,
        title: `${locale.nativeLabel} 고민 지도`,
        summary: `${locale.region}에서 반복되는 고민 표현과 대표 카드를 봅니다.`,
        categoryTitle: "언어권 지도",
        groupTitle: locale.region,
        typeLabel: "언어권",
        badgeLabel: `카드 ${highlights.length}+`,
        verifiedCount: highlights.length,
        tags: locale.nativeLabel,
        aliases: `${locale.label} ${locale.nativeLabel} ${locale.region} ${
          locale.sourceSignals?.join(" ") || ""
        } ${highlights.map(({ entry }) => entry.title).join(" ")}`,
      })),
  ];

  return (
    <div className="fade-rise">
      <section className="pb-6 pt-2">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
          위즈덤
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold leading-snug sm:text-4xl">
          고민과 논쟁을 검색하면,
          <br />
          믿을 만한 관점으로 정리합니다.
        </h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          위즈덤은 답을 단정하기보다 흩어진 고민, 생각, 논쟁을 언어권별 관심
          신호로 모으고 철학, 연구, 제도, 실천 관점으로 다시 읽습니다.
        </p>
      </section>

      <HomeSearch
        entries={searchEntries}
        suggestedEntries={suggestedEntries}
        exploreEntries={exploreEntries}
      />

      <section className="mt-6 border-y border-line py-4">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {statRows.map((row) => (
            <div key={row.label}>
              <dt className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                {row.label}
              </dt>
              <dd className="mt-1 font-serif text-2xl font-bold">
                {row.value.toLocaleString("ko-KR")}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              글로벌 확장
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">
              같은 고민을 여러 언어에서 다시 읽기
            </h2>
          </div>
          <Link
            href="/en"
            className="shrink-0 text-sm text-ink-soft transition-colors hover:text-clay"
          >
            English
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          {globalBridgeEntrances.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className="group block rounded-lg border border-line bg-paper px-4 py-4 transition-colors hover:border-clay/40"
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-serif text-base font-bold group-hover:text-clay">
                  {entry.title}
                </span>
                <span className="text-xs text-ink-faint">
                  {entry.count.toLocaleString("ko-KR")}
                </span>
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-ink-soft">
                {entry.blurb}
              </span>
            </Link>
          ))}
        </div>

        {englishSpotlightEntries.length > 0 && (
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {englishSpotlightEntries.map((entry) => (
              <Link
                key={entry.route}
                href={entry.href}
                className="group block rounded-lg border border-line bg-cream px-4 py-4 transition-colors hover:border-clay/40"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                      EN · {entry.axis}
                    </span>
                    <span className="mt-1 block font-serif text-base font-bold group-hover:text-clay">
                      {entry.canonicalTitle}
                    </span>
                    <span className="mt-1.5 line-clamp-2 block text-sm leading-relaxed text-ink-soft">
                      {entry.pageLead || entry.userDoors[0]}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-paper px-2 py-0.5 text-[11px] font-medium text-clay">
                    검증 {entry.verifiedCount}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              오늘의 신호
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">
              여러 언어권에서 같이 올라온 고민
            </h2>
          </div>
          <span className="shrink-0 text-xs text-ink-faint">검색 표현 기반</span>
        </div>
        <p className="mb-3 text-sm leading-relaxed text-ink-soft">
          사람 수가 아니라 자동완성, 검색 표현, 언어권별 반복 패턴을 모은 관심
          신호입니다.
        </p>
        <ol className="divide-y divide-line border-y border-line">
          {topSignalCards.map(({ signal, entry }, index) => (
            <li key={signal.key}>
              <Link
                href={entry.href}
                className="group grid grid-cols-[2rem_1fr] gap-3 py-4 transition-colors hover:text-clay sm:grid-cols-[2.5rem_1fr_auto]"
              >
                <span className="font-serif text-xl font-bold text-ink-faint">
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-serif text-base font-bold group-hover:text-clay">
                    {entry.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                    {entry.summary}
                  </span>
                  <span className="mt-1.5 block text-xs text-ink-faint">
                    {signal.localeCoverage}개 언어권 · 수집 표현{" "}
                    {signal.totalCandidate.toLocaleString("ko-KR")}개
                  </span>
                </span>
                <span className="col-start-2 self-start rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay sm:col-start-auto">
                  {sourceLocaleSignalStrengthLabel(signal.strength)}
                </span>
              </Link>
            </li>
          ))}
        </ol>
        <div className="mt-3 flex flex-wrap gap-2">
          {commonSignalLinks.map(({ signal, entry }) => (
            <Link
              key={signal.key}
              href={entry.href}
              className="rounded-lg border border-line bg-paper px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
            >
              {entry.title}
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              언어권 표현
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">
              같은 고민, 다른 검색어
            </h2>
          </div>
          <span className="shrink-0 text-xs text-ink-faint">
            수동 큐레이션 {curatedSourceLocaleCount}/{readyEntries.length}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {sourcePhraseSpotlights.map(({ entry, insights, totalUsable }) => (
            <Link
              key={entry.key}
              href={entry.href}
              className="group block rounded-lg border border-line bg-paper px-4 py-4 transition-colors hover:border-clay/40"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="block font-serif text-base font-bold group-hover:text-clay">
                    {entry.title}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-ink-soft">
                    {entry.summary}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                  {totalUsable}
                </span>
              </span>
              <span className="mt-3 block divide-y divide-line border-y border-line">
                {insights.map((insight) => (
                  <span key={`${entry.key}-${insight.locale}`} className="block py-2.5">
                    <span className="flex flex-wrap items-center gap-1.5">
                      <span className="rounded-full border border-line bg-cream px-2 py-0.5 text-[11px] font-medium text-ink-soft">
                        {sourceLocaleLabel(insight.locale)}
                      </span>
                      {insight.sourcePhrases.slice(0, 2).map((phrase) => (
                        <span
                          key={phrase}
                          lang={insight.locale}
                          className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-soft"
                        >
                          {phrase}
                        </span>
                      ))}
                    </span>
                    <span className="mt-1.5 line-clamp-2 block text-xs leading-relaxed text-ink-faint">
                      {insight.userDoors?.[0]}
                    </span>
                  </span>
                ))}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            시작점
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold">무엇부터 볼까요?</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {primaryEntrances.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className="group block rounded-lg border border-line bg-paper px-4 py-4 transition-colors hover:border-clay/40"
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-serif text-lg font-bold group-hover:text-clay">
                  {entry.title}
                </span>
                <span className="text-xs text-ink-faint">{entry.count}</span>
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-ink-soft">
                {entry.blurb}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {deepWorryEntries.length > 0 && (
        <section className="mt-10">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                깊게 읽기
              </p>
              <h2 className="mt-1 font-serif text-xl font-bold">
                4관점으로 정리한 고민
              </h2>
            </div>
            <span className="shrink-0 text-xs text-ink-faint">
              고민 {worryEntries.filter((entry) => entry.publishable && (entry.content.cards?.length || 0) >= 4).length}개
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {deepWorryEntries.map((entry) => (
              <Link
                key={entry.key}
                href={entry.href}
                className="group block rounded-lg border border-line bg-paper px-4 py-4 transition-colors hover:border-clay/40"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block font-serif text-base font-bold group-hover:text-clay">
                      {entry.title}
                    </span>
                    <span className="mt-1.5 line-clamp-2 block text-sm leading-relaxed text-ink-soft">
                      {entry.summary}
                    </span>
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {entry.content.cards.slice(0, 4).map((card) => (
                        <span
                          key={`${entry.key}-${card.name}`}
                          className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-soft"
                        >
                          {card.name}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                    관점 {entry.content.cards.length}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {balancedDebateEntries.length > 0 && (
        <section className="mt-10">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                논쟁 지도
              </p>
              <h2 className="mt-1 font-serif text-xl font-bold">
                한쪽으로 닫지 않고 보는 질문
              </h2>
            </div>
            <Link
              href="/debate"
              className="shrink-0 text-sm text-ink-soft transition-colors hover:text-clay"
            >
              논쟁 전체
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {balancedDebateEntries.map(({ entry, positionLabels }) => (
              <Link
                key={entry.key}
                href={entry.href}
                className="group block rounded-lg border border-line bg-paper px-4 py-4 transition-colors hover:border-clay/40"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block font-serif text-base font-bold group-hover:text-clay">
                      {entry.title}
                    </span>
                    <span className="mt-1.5 line-clamp-2 block text-sm leading-relaxed text-ink-soft">
                      {entry.summary}
                    </span>
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {positionLabels.slice(0, 3).map((label) => (
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
                    관점 {positionLabels.length}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section id="worry-start" className="mt-10 scroll-mt-20">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              고민 카테고리
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">자주 들어오는 입구</h2>
          </div>
          <Link
            href="/tags"
            className="shrink-0 text-sm text-ink-soft transition-colors hover:text-clay"
          >
            태그 보기
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {categoryEntrances.map((entry) => (
            <Link
              key={entry.href}
              href={entry.href}
              className="group min-h-[7.25rem] rounded-lg border border-line bg-paper px-4 py-3 transition-colors hover:border-clay/40"
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="font-serif text-base font-bold group-hover:text-clay">
                  {entry.title}
                </span>
                <span className="shrink-0 text-xs text-ink-faint">{entry.count}</span>
              </span>
              <span className="mt-2 line-clamp-3 block text-sm leading-relaxed text-ink-soft">
                {entry.blurb}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              대표 카드
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">처음 읽기 좋은 흐름</h2>
          </div>
          <span className="shrink-0 text-xs text-ink-faint">
            {readyEntries.length}개 공개
          </span>
        </div>
        <ul className="divide-y divide-line border-y border-line">
          {featuredEntries.slice(0, 6).map((entry) => (
            <li key={entry.key}>
              <Link
                href={entry.href}
                className="group block py-4 transition-colors hover:text-clay"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block font-serif text-base font-bold">
                      {entry.title}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                      {entry.summary}
                    </span>
                    <span className="mt-1.5 block text-xs text-ink-faint">
                      {entry.categoryTitle}
                      {entry.groupTitle ? ` · ${entry.groupTitle}` : ""}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                    검증 {entry.verifiedCount}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              감정 / 상황
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">태그로 다시 보기</h2>
          </div>
          <Link
            href="/tags"
            className="shrink-0 text-sm text-ink-soft transition-colors hover:text-clay"
          >
            전체 보기
          </Link>
        </div>
        <div className="flex flex-wrap gap-2">
          {topTags.map((tag) => (
            <Link
              key={tag.slug}
              href={`/tags/${tag.slug}`}
              className="rounded-lg border border-line bg-paper px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
            >
              <span className="text-ink">{tag.title}</span>
              <span className="ml-1.5 text-xs text-ink-faint">{tag.entryCount}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              사람별 관점
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">인물로 찾아보기</h2>
          </div>
          <Link
            href="/people"
            className="shrink-0 text-sm text-ink-soft transition-colors hover:text-clay"
          >
            전체 보기
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {people.map((person) => (
            <Link
              key={person.slug}
              href={`/people/${person.slug}`}
              className="group block rounded-lg border border-line bg-paper px-4 py-4 transition-colors hover:border-clay/40"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="block font-serif text-base font-bold group-hover:text-clay">
                    {person.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-faint">
                    {person.culture.country} · {person.culture.tradition}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                  카드 {person.cardCount}
                </span>
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-ink-soft">
                {person.summary}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-10">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              수집 지도
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">
              여러 나라의 고민을 하나의 카드로 합치기
            </h2>
          </div>
          <div className="flex shrink-0 items-center gap-2 text-xs">
            <span className="text-ink-faint">
              활성 {sourceStats.active} · 준비 {sourceStats.sourceReady}
            </span>
            <Link
              href="/source-locales"
              className="text-ink-soft transition-colors hover:text-clay"
            >
              지도 보기
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {localeSourceRows.map(({ locale, highlights, href }) => {
            const content = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-base font-bold">
                      {locale.nativeLabel}
                    </h3>
                    <p className="mt-0.5 text-xs text-ink-faint">
                      {locale.region}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                    {statusLabel(locale.status)}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {locale.sourceSignals[0]}
                </p>
                {highlights.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {highlights.map(({ highlight, entry }) => (
                      <span
                        key={`${locale.locale}-${highlight.key}`}
                        className="rounded-lg border border-line bg-cream px-3 py-1 text-sm text-ink-soft"
                      >
                        {entry.title}
                        <span className="ml-1.5 text-xs text-ink-faint">
                          {highlight.usableCount}
                        </span>
                      </span>
                    ))}
                  </div>
                )}
              </>
            );

            if (href) {
              return (
                <Link
                  key={locale.locale}
                  href={href}
                  className="group block rounded-lg border border-line bg-paper px-4 py-4 transition-colors hover:border-clay/40"
                >
                  {content}
                </Link>
              );
            }

            return (
              <div
                key={locale.locale}
                className="rounded-lg border border-line bg-paper px-4 py-4"
              >
                {content}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-10 border-y border-line py-6">
        <div className="mb-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            정리 방식
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold">
            하나의 답보다 여러 관점
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {perspectiveLenses.map((lens) => (
            <div key={lens.slug} className="border-t border-line py-3">
              <h3 className="font-serif text-base font-bold">{lens.title}</h3>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {lens.blurb}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
