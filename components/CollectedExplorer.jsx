"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

const FILTERS = [
  { id: "all", label: "전체" },
  { id: "review", label: "검토 큐" },
  { id: "draft", label: "검증 중" },
  { id: "ready", label: "공개" },
];

const CATEGORY_LABELS = {
  love: "연애 / 짝사랑",
  breakup: "이별 / 실연",
  "self-esteem": "자존감",
  relationships: "인간관계",
  work: "직장 / 커리어",
  meaning: "삶의 의미",
  family: "가족 / 독립",
  money: "돈 / 미래",
  study: "공부 / 시험",
  digital: "디지털 / SNS",
  body: "건강 / 몸",
  career: "진로 / 결정",
  debate: "논쟁",
  thought: "생각",
  "연애/짝사랑": "연애 / 짝사랑",
  "이별/실연": "이별 / 실연",
  자존감: "자존감",
  인간관계: "인간관계",
  "직장/커리어": "직장 / 커리어",
  "삶의 의미": "삶의 의미",
  가족: "가족 / 독립",
  "돈/미래": "돈 / 미래",
  "진로/결정": "진로 / 결정",
  "건강/몸": "건강 / 몸",
  "공부/시험": "공부 / 시험",
  "디지털/SNS": "디지털 / SNS",
  "논쟁/딜레마": "논쟁",
};

function matchesQuery(text, query) {
  if (!query) return true;
  return text.toLowerCase().includes(query.toLowerCase());
}

function categoryForCandidate(candidate) {
  if (candidate.axis === "debate") return "논쟁";
  return CATEGORY_LABELS[candidate.slot.split("/")[0]] || candidate.axis;
}

function normalizeCategory(value) {
  return CATEGORY_LABELS[value] || value || "";
}

export default function CollectedExplorer({
  groups,
  reviewGroups,
  reviewReasons,
  reviewCount,
  candidateQueue,
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [category, setCategory] = useState("all");
  const hydratedRef = useRef(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const nextQuery = params.get("q") || "";
      const nextFilter = params.get("status") || "all";
      const nextCategory = params.get("category") || "all";

      setQuery(nextQuery);
      if (FILTERS.some((item) => item.id === nextFilter)) setFilter(nextFilter);
      setCategory(nextCategory);
      hydratedRef.current = true;
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (filter !== "all") params.set("status", filter);
    if (category !== "all") params.set("category", category);

    const nextUrl = params.toString()
      ? `${window.location.pathname}?${params.toString()}`
      : window.location.pathname;
    window.history.replaceState(null, "", nextUrl);
  }, [category, filter, query]);

  const categoryOptions = useMemo(() => {
    const labels = new Set();
    for (const group of groups) labels.add(normalizeCategory(group.categoryTitle));
    for (const group of reviewGroups) labels.add(normalizeCategory(group.category));
    for (const candidate of candidateQueue.promoted) labels.add(categoryForCandidate(candidate));
    return [...labels].filter(Boolean).sort((a, b) => a.localeCompare(b, "ko"));
  }, [candidateQueue.promoted, groups, reviewGroups]);

  const filteredGroups = useMemo(() => {
    if (filter === "review") return [];

    return groups.filter((group) => {
      if (filter === "draft" && group.publishable) return false;
      if (filter === "ready" && !group.publishable) return false;
      if (category !== "all" && normalizeCategory(group.categoryTitle) !== category) {
        return false;
      }

      const haystack = [
        group.title,
        group.categoryTitle,
        group.groupTitle,
        group.sourceCategories.join(" "),
        group.phrases.join(" "),
        group.contentized.lead,
      ].join(" ");
      return matchesQuery(haystack, query);
    });
  }, [category, filter, groups, query]);

  const filteredReviews = useMemo(() => {
    if (filter !== "all" && filter !== "review") return [];

    return reviewGroups.filter((group) => {
      if (category !== "all" && normalizeCategory(group.category) !== category) {
        return false;
      }
      const haystack = [group.bucket, group.category, group.phrases.join(" ")].join(" ");
      return matchesQuery(haystack, query);
    });
  }, [category, filter, query, reviewGroups]);

  const filteredCandidates = useMemo(() => {
    if (filter === "ready" || filter === "review") return [];

    return candidateQueue.promoted.filter((candidate) => {
      if (category !== "all" && categoryForCandidate(candidate) !== category) {
        return false;
      }
      const haystack = [
        candidate.title,
        candidate.slot,
        candidate.axis,
        candidate.samplePhrases.join(" "),
        candidate.lowSignalPhrases.join(" "),
      ].join(" ");
      return matchesQuery(haystack, query);
    });
  }, [candidateQueue.promoted, category, filter, query]);

  const resultCount = filteredGroups.length + filteredReviews.length + filteredCandidates.length;

  return (
    <>
      <section className="mb-8 border-y border-line py-4">
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid min-w-0 flex-1 grid-cols-1 gap-2 sm:grid-cols-[1fr_10rem]">
            <label className="min-w-0">
              <span className="sr-only">수집 지도 검색</span>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="카드, 수집어, 카테고리 검색"
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm outline-none transition-colors placeholder:text-ink-faint focus:border-clay/50"
              />
            </label>
            <label>
              <span className="sr-only">카테고리 필터</span>
              <select
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                className="w-full rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink-soft outline-none transition-colors focus:border-clay/50"
              >
                <option value="all">모든 카테고리</option>
                {categoryOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex shrink-0 rounded-lg border border-line bg-paper p-0.5">
            {FILTERS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setFilter(item.id)}
                className={`rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  filter === item.id
                    ? "bg-clay text-white"
                    : "text-ink-soft hover:text-clay"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-xs text-ink-faint">
          {resultCount.toLocaleString("ko-KR")}개 묶음 표시
          {query ? ` · "${query}" 검색 중` : ""}
          {category !== "all" ? ` · ${category}` : ""}
        </p>
        {(query || filter !== "all" || category !== "all") && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
              setCategory("all");
            }}
            className="mt-2 text-xs text-ink-soft transition-colors hover:text-clay"
          >
            필터 초기화
          </button>
        )}
      </section>

      {filteredReviews.length > 0 && (
        <section className="mb-10 border-y border-line py-5">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
                review queue
              </p>
              <h2 className="mt-1 font-serif text-xl font-bold">분류 검토 큐</h2>
            </div>
            <span className="shrink-0 text-xs text-ink-faint">
              {reviewCount.toLocaleString("ko-KR")}개
            </span>
          </div>
          <p className="mb-4 text-sm leading-relaxed text-ink-soft">
            새 대표 카드로 분리할 만한 표현, 검색 잡음, 기존 카드에 남겨둘 표현을
            따로 모았습니다.
          </p>

          {reviewReasons.length > 0 && (
            <div className="mb-5 flex flex-wrap gap-2">
              {reviewReasons.map((item) => (
                <span
                  key={item.reason}
                  className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink-soft"
                >
                  {item.reason}
                  <span className="ml-1.5 text-xs text-ink-faint">
                    {item.count.toLocaleString("ko-KR")}
                  </span>
                </span>
              ))}
            </div>
          )}

          <div className="space-y-4">
            {filteredReviews.map((group) => (
              <article key={group.bucket} className="border-t border-line pt-4">
                <div className="mb-2 flex items-baseline justify-between gap-3">
                  <h3 className="font-serif text-base font-bold">{group.bucket}</h3>
                  <span className="shrink-0 text-xs text-ink-faint">
                    {group.count.toLocaleString("ko-KR")}
                  </span>
                </div>
                <ul className="space-y-1.5">
                  {group.phrases.slice(0, 8).map((phrase) => (
                    <li key={phrase} className="text-sm leading-relaxed text-ink-soft">
                      {phrase}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>
      )}

      {filteredCandidates.length > 0 && (
        <section className="mb-10 border-y border-line py-5">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
                collected cards
              </p>
              <h2 className="mt-1 font-serif text-xl font-bold">수집 기반 확장 카드</h2>
            </div>
            <span className="shrink-0 text-xs text-ink-faint">
              {candidateQueue.promoted.length.toLocaleString("ko-KR")}개
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {filteredCandidates.map((candidate) => (
              <Link
                key={candidate.slot}
                href={
                  candidate.axis === "debate"
                    ? `/debate/${candidate.slot}`
                    : `/${candidate.slot}`
                }
                className="group block rounded-xl border border-line bg-paper p-4 transition-colors hover:border-clay/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-serif text-base font-bold group-hover:text-clay">
                      {candidate.title}
                    </h3>
                    <p className="mt-1 text-xs text-ink-faint">{candidate.slot}</p>
                  </div>
                  <span className="shrink-0 rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-soft">
                    {candidate.status === "ready" ? "공개" : candidate.status}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {candidate.samplePhrases.slice(0, 4).join(" / ")}
                </p>
                <p className="mt-2 text-xs leading-relaxed text-ink-faint">
                  수집어 {candidate.matchedPhrases.toLocaleString("ko-KR")}개 반영
                </p>
                {candidate.lowSignalPhrases.length > 0 && (
                  <p className="mt-2 text-xs leading-relaxed text-ink-faint">
                    저신호 {candidate.lowSignalPhrases.length}개 별도 관리
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      {filteredGroups.length > 0 && (
        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <h2 className="text-xs font-medium tracking-wider text-ink-faint uppercase">
              대표 콘텐츠별 수집어
            </h2>
            <span className="text-xs text-ink-faint">
              {filteredGroups.length.toLocaleString("ko-KR")}개 묶음
            </span>
          </div>
          <div className="space-y-6">
            {filteredGroups.map((group) => (
              <article key={group.key} className="border-t border-line pt-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={group.href}
                      className="font-serif text-lg font-bold transition-colors hover:text-clay"
                    >
                      {group.title}
                    </Link>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                      {group.categoryTitle}
                      {group.groupTitle ? ` · ${group.groupTitle}` : ""}
                      <span className="ml-2 text-xs text-ink-faint">
                        {group.publishable ? "공개" : "검증 중"}
                      </span>
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                    {group.phrases.length.toLocaleString("ko-KR")}
                  </span>
                </div>
                {group.sourceCategories.length > 0 && (
                  <p className="mb-2 text-xs text-ink-faint">
                    {group.sourceCategories.join(" · ")}
                  </p>
                )}
                <p className="mb-3 text-sm leading-relaxed text-ink-soft">
                  {group.contentized.lead}
                </p>
                <div className="mb-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {group.contentized.intentGroups.slice(0, 4).map((intent) => (
                    <div key={intent.slug} className="border-l border-line pl-3">
                      <div className="flex items-baseline justify-between gap-2">
                        <span className="font-serif text-sm font-bold">{intent.title}</span>
                        <span className="text-xs text-ink-faint">{intent.count}</span>
                      </div>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-faint">
                        {intent.samples.slice(0, 3).join(" / ")}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.phrases.slice(0, 80).map((phrase, index) => (
                    <span
                      key={`${group.key}-${phrase}-${index}`}
                      className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink-soft"
                    >
                      {phrase}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
