import Link from "next/link";
import HomeSearch from "@/components/HomeSearch";
import RoutineResumePanel from "@/components/RoutineResumePanel";
import {
  allDebateEntries,
  allThoughtEntries,
  allWorryEntries,
  groupedTagsWithCounts,
  groupedWorryCategories,
} from "@/lib/content";
import { allRoutines } from "@/lib/routines";
import { sourceLocaleSearchTextForInsights } from "@/lib/source-locale-insights";

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

export default function HomePage() {
  const featuredOrder = [
    "love/reply-anxiety",
    "love/attachment-anxiety",
    "breakup/ghosting",
    "relationships/people-pleasing",
    "self-esteem/low-self-esteem",
    "work/burnout",
  ];

  const worryEntries = allWorryEntries();
  const thoughtEntries = allThoughtEntries();
  const debateEntries = allDebateEntries();
  const readyEntries = [...worryEntries, ...thoughtEntries, ...debateEntries].filter(
    (entry) => entry.publishable
  );
  const routines = allRoutines();
  const worryCategoryGroups = groupedWorryCategories();
  const crossTagGroups = groupedTagsWithCounts();

  const entryByKey = new Map(readyEntries.map((entry) => [entry.key, entry]));
  const featuredEntries = featuredOrder
    .map((key) => entryByKey.get(key))
    .filter(Boolean);

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
      blurb: "답장, 애착, 고백, 관계 기준을 작은 행동으로 낮춥니다.",
      count: readyCountForPrefixes(["love", "relationships"]),
    },
    {
      title: "이별 회복",
      href: "/breakup",
      blurb: "미련과 재연락 충동을 감정 정리와 생활 복구로 나눕니다.",
      count: readyCountForPrefixes(["breakup"]),
    },
    {
      title: "자기이해",
      href: "/self-esteem",
      blurb: "자존감, 비교, 자기비난을 점검 질문과 회복 행동으로 바꿉니다.",
      count: readyCountForPrefixes(["self-esteem", "meaning", "body"]),
    },
    {
      title: "일상 실행",
      href: "/work",
      blurb: "번아웃, 공부, 진로, 디지털 습관을 지속 가능한 단위로 쪼갭니다.",
      count: readyCountForPrefixes(["work", "study", "career", "digital"]),
    },
  ];

  const journeySteps = [
    {
      step: "1",
      title: "고민",
      body: "지금 막힌 장면을 있는 그대로 고릅니다.",
    },
    {
      step: "2",
      title: "생각",
      body: "반복 패턴과 점검 질문으로 정리합니다.",
    },
    {
      step: "3",
      title: "행동",
      body: "오늘 할 수 있는 작은 루틴으로 옮깁니다.",
    },
  ];

  const routineCards = routines.map((routine) => ({
    key: routine.slug,
    title: routine.title,
    href: `/routines/${routine.slug}`,
    blurb: routine.summary,
    duration: routine.duration,
    steps: routine.steps.slice(0, 2).map((step) => step.title),
    aliases: [
      routine.title,
      routine.summary,
      routine.promise,
      routine.categoryTitle,
      routine.audience.join(" "),
      routine.steps.map((step) => step.title).join(" "),
    ].join(" "),
  }));

  const categoryEntrances = ["love", "breakup", "relationships", "work", "meaning", "study"]
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

  const topTags = crossTagGroups.flatMap((group) => group.tags.slice(0, 6)).slice(0, 12);
  const searchEntries = readyEntries.map(serializeEntry);
  const suggestedEntries = featuredEntries.slice(0, 5).map(serializeEntry);
  const exploreEntries = [
    ...routineCards.map((routine) => ({
      key: `routine/${routine.key}`,
      href: routine.href,
      title: routine.title,
      summary: routine.blurb,
      categoryTitle: "루틴",
      groupTitle: "행동 경로",
      typeLabel: "루틴",
      badgeLabel: routine.duration,
      verifiedCount: routine.steps.length,
      tags: routine.steps.join(" "),
      aliases: routine.aliases,
    })),
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
  ];

  return (
    <div className="fade-rise">
      <section className="pb-5 pt-2">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
          MindRoute
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold leading-snug sm:text-4xl">
          고민을 생각으로,
          <br />
          생각을 행동으로.
        </h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          막힌 문제를 검색하면 패턴, 관점, 작은 루틴으로 이어집니다.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center text-xs">
          {["고민", "생각", "행동"].map((label) => (
            <span
              key={label}
              className="rounded-lg border border-line bg-paper px-2 py-2 font-medium text-ink-soft"
            >
              {label}
            </span>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="#worry-start"
            className="rounded-lg bg-clay px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-clay/90"
          >
            고민 고르기
          </Link>
          <Link
            href="/routines"
            className="rounded-lg border border-line bg-paper px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
          >
            루틴 보기
          </Link>
          <Link
            href="/saved"
            className="rounded-lg border border-line bg-paper px-3 py-2 text-sm font-medium text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
          >
            내 루트
          </Link>
        </div>
      </section>

      <HomeSearch
        entries={searchEntries}
        suggestedEntries={suggestedEntries}
        exploreEntries={exploreEntries}
      />

      <div className="mt-4">
        <RoutineResumePanel routines={routines} />
      </div>

      <section className="mt-8">
        <div className="mb-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            Flow
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold">해결 흐름</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {journeySteps.map((item) => (
            <div
              key={item.step}
              className="grid grid-cols-[2rem_1fr] gap-3 rounded-lg border border-line bg-paper px-4 py-4"
            >
              <span className="font-serif text-xl font-bold text-ink-faint">
                {item.step}
              </span>
              <span>
                <span className="block font-serif text-base font-bold">
                  {item.title}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                  {item.body}
                </span>
              </span>
            </div>
          ))}
        </div>
      </section>

      <section id="worry-start" className="mt-8 scroll-mt-20">
        <div className="mb-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            Start
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold">지금 막힌 장면</h2>
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

      <section className="mt-8">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              Routine
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">바로 시작할 루틴</h2>
          </div>
          <Link
            href="/routines"
            className="shrink-0 text-sm text-ink-soft transition-colors hover:text-clay"
          >
            전체 보기
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {routineCards.slice(0, 4).map((routine) => (
            <Link
              key={routine.key}
              href={routine.href}
              className="group block rounded-lg border border-line bg-cream px-4 py-4 transition-colors hover:border-clay/40"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="block font-serif text-base font-bold group-hover:text-clay">
                    {routine.title}
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-ink-soft">
                    {routine.blurb}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-paper px-2 py-0.5 text-[11px] font-medium text-clay ring-1 ring-line">
                  {routine.duration}
                </span>
              </span>
              <span className="mt-3 flex flex-wrap gap-1.5">
                {routine.steps.map((step) => (
                  <span
                    key={`${routine.key}-${step}`}
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
              Read
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">처음 읽기 좋은 카드</h2>
          </div>
          <Link
            href="/tags"
            className="shrink-0 text-sm text-ink-soft transition-colors hover:text-clay"
          >
            탐색
          </Link>
        </div>
        <ul className="divide-y divide-line border-y border-line">
          {featuredEntries.slice(0, 5).map((entry) => (
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
                    <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-ink-soft">
                      {entry.summary}
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

      <section className="mt-8">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              Tag
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">감정과 상황으로 찾기</h2>
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
    </div>
  );
}
