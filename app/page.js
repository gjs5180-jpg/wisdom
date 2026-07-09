import Link from "next/link";
import HomeSearch from "@/components/HomeSearch";
import {
  allDebateEntries,
  allPeople,
  allThoughtEntries,
  allWorryEntries,
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
  worry: "질문",
  debate: "질문",
  thought: "질문",
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

function serializeEnglishEntry(entry) {
  const sourceLocaleAliases = sourceLocaleSearchTextForInsights(
    entry.content?.sourceLocaleInsights || []
  );
  return {
    key: `en/${entry.route}`,
    href: entry.href,
    title: entry.canonicalTitle,
    summary: entry.pageLead || entry.userDoors?.[0] || "English question node.",
    categoryTitle: "English",
    groupTitle: "Question map",
    typeLabel: "영어 질문",
    badgeLabel: `EN · 검증 ${entry.verifiedCount}`,
    verifiedCount: entry.verifiedCount,
    tags: entry.lenses?.join(" ") || "",
    aliases: [
      entry.canonicalTitle,
      entry.searchPhrases?.join(" "),
      entry.userDoors?.join(" "),
      entry.metaDescription,
      sourceLocaleAliases,
    ]
      .filter(Boolean)
      .join(" "),
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

export default function HomePage() {
  const featuredOrder = [
    "love/reply-anxiety",
    "love/attachment-anxiety",
    "breakup/ghosting",
    "relationships/people-pleasing",
    "self-esteem/low-self-esteem",
    "work/burnout",
    "study/exam-anxiety",
    "meaning/emptiness",
    "family/parent-conflict",
    "meaning/meaningless",
    "work/work-depression",
    "digital/dopamine-addiction",
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

  const readyCountForPrefixes = (prefixes) =>
    worryEntries.filter(
      (entry) =>
        entry.publishable &&
        prefixes.some((prefix) => entry.key.startsWith(`${prefix}/`))
    ).length;

  const primaryEntrances = [
    {
      title: "관계와 연애",
      href: "/love",
      blurb: "좋아하는 마음, 대화, 애착, 관계 기준을 작은 행동으로 내려봅니다.",
      count: readyCountForPrefixes(["love", "relationships"]),
    },
    {
      title: "이별 회복",
      href: "/breakup",
      blurb: "미련, 재연락, 생활 붕괴를 감정 정리와 회복 루틴으로 나눕니다.",
      count: readyCountForPrefixes(["breakup"]),
    },
    {
      title: "자기이해",
      href: "/self-esteem",
      blurb: "자존감, 비교, 자기비난을 나를 미워하는 결론이 아니라 점검 질문으로 바꿉니다.",
      count: readyCountForPrefixes(["self-esteem", "meaning", "body"]),
    },
    {
      title: "일상 실행",
      href: "/work",
      blurb: "번아웃, 공부, 진로, 디지털 습관을 지속 가능한 행동 단위로 쪼갭니다.",
      count: readyCountForPrefixes(["work", "study", "career", "digital"]),
    },
  ];

  const journeySteps = [
    {
      step: "1",
      title: "문제로 들어오기",
      body: "사용자가 실제로 검색하는 말에서 시작합니다. 연애, 이별, 자존감, 무기력처럼 날것의 문장을 입구로 둡니다.",
    },
    {
      step: "2",
      title: "패턴 이해하기",
      body: "원인 하나로 단정하지 않고, 반복되는 감정과 상황을 가능한 패턴 가설로 정리합니다.",
    },
    {
      step: "3",
      title: "관점 고르기",
      body: "철학자, 연구, 실전 관점을 정답이 아니라 렌즈로 두고 지금 상황에 맞는 기준을 고릅니다.",
    },
    {
      step: "4",
      title: "루틴으로 내리기",
      body: "읽고 끝내지 않도록 3일, 7일, 14일 단위의 작은 행동 경로로 이어갑니다.",
    },
  ];

  const routineCards = [
    {
      title: "관계 자신감 7일",
      href: "/relationships/people-pleasing",
      blurb: "거절, 눈치, 대화 부담을 작은 경계 문장과 대화 복기로 낮춥니다.",
      steps: ["내가 피하는 장면 기록", "짧은 경계 문장 만들기", "대화 후 잘한 점 남기기"],
    },
    {
      title: "이별 후 생활 복구 7일",
      href: "/breakup/right-after",
      blurb: "감정 해결보다 수면, 식사, 일정, 접점 정리부터 회복합니다.",
      steps: ["오늘 무너진 생활 하나 복구", "재자극 접점 하나 줄이기", "미련과 필요 분리"],
    },
    {
      title: "자기비난 줄이기 14일",
      href: "/self-esteem/self-hate",
      blurb: "나 전체를 판결하는 말을 행동과 사실의 언어로 다시 씁니다.",
      steps: ["비난 문장 포착", "사실 문장으로 번역", "작은 성공 증거 기록"],
    },
    {
      title: "목표분해 4주",
      href: "/career/dream-reality",
      blurb: "큰 목표를 바로 실행 가능한 행동 단위로 쪼개고 매주 조정합니다.",
      steps: ["핵심 목표 하나 정하기", "하위 행동 3개만 고르기", "실패 조건 조정하기"],
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
    { label: "문제 카드", value: worryEntries.filter((entry) => entry.publishable).length },
    { label: "수집 표현", value: collection.total },
    { label: "인물 관점", value: peopleEntries.length },
    { label: "루틴 후보", value: routineCards.length },
  ];

  const topTags = crossTagGroups.flatMap((group) => group.tags.slice(0, 8)).slice(0, 16);
  const people = peopleEntries.slice(0, 6);
  const exploreEntries = [
    ...englishEntries.map(serializeEnglishEntry),
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
          내 문제를 검색하면,
          <br />
          이해와 행동 루틴으로 이어갑니다.
        </h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          위즈덤은 흩어진 고민 표현을 모아 가능한 패턴을 정리하고, 철학자와
          연구자의 관점을 거쳐 오늘 해볼 수 있는 작은 행동 경로로 바꿉니다.
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
        <div className="mb-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            성장 흐름
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold">
            문제를 읽고 끝내지 않는 구조
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          {journeySteps.map((item) => (
            <div key={item.step} className="rounded-lg border border-line bg-paper px-4 py-4">
              <span className="font-serif text-2xl font-bold text-ink-faint">
                {item.step}
              </span>
              <h3 className="mt-2 font-serif text-base font-bold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              루틴 후보
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">
              지금 바로 고를 수 있는 성장 경로
            </h2>
          </div>
          <span className="shrink-0 text-xs text-ink-faint">초안</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {routineCards.map((routine) => (
            <Link
              key={routine.title}
              href={routine.href}
              className="group block rounded-lg border border-line bg-cream px-4 py-4 transition-colors hover:border-clay/40"
            >
              <span className="block font-serif text-base font-bold group-hover:text-clay">
                {routine.title}
              </span>
              <span className="mt-1.5 block text-sm leading-relaxed text-ink-soft">
                {routine.blurb}
              </span>
              <span className="mt-3 flex flex-wrap gap-1.5">
                {routine.steps.map((step) => (
                  <span
                    key={`${routine.title}-${step}`}
                    className="rounded-full border border-line bg-paper px-2 py-0.5 text-[11px] text-ink-soft"
                  >
                    {step}
                  </span>
                ))}
              </span>
            </Link>
          ))}
        </div>
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
            문제 입구
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold">지금 막힌 장면부터 고르기</h2>
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
                4관점으로 정리한 질문
              </h2>
            </div>
            <span className="shrink-0 text-xs text-ink-faint">
              질문 {worryEntries.filter((entry) => entry.publishable && (entry.content.cards?.length || 0) >= 4).length}개
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

      <section id="worry-start" className="mt-10 scroll-mt-20">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              질문 입구
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">자주 들어오는 삶의 장면</h2>
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
