"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const quickQueries = [
  "연애 답장",
  "이별 회복",
  "요즘 왜 힘들까",
  "무기력",
  "게으름",
  "자기비난",
  "번아웃",
  "시험 불안",
  "외로움",
  "산책 루틴",
];

const fallbackLinks = [
  { label: "연애", href: "/love" },
  { label: "이별", href: "/breakup" },
  { label: "루틴", href: "/routines" },
  { label: "직장", href: "/work" },
  { label: "의미", href: "/meaning" },
  { label: "탐색", href: "/tags" },
];

const synonymGroups = [
  ["연애", "사랑", "짝사랑", "고백", "썸", "답장", "불안형", "애착"],
  ["이별", "헤어짐", "전애인", "전남친", "전여친", "미련", "재회", "잠수이별"],
  ["직장", "일", "회사", "퇴사", "이직", "상사", "번아웃", "인정"],
  ["공부", "시험", "자격증", "집중", "불합격", "수험", "성적"],
  ["돈", "금전", "재정", "미래", "불안", "생계", "저축"],
  ["외로움", "고독", "혼자", "친구", "관계", "인간관계"],
  ["가족", "부모", "엄마", "아빠", "명절", "독립"],
  ["몸", "건강", "노화", "탈모", "불면", "외모"],
  ["의미", "무기력", "공허", "죽음", "목표", "방황"],
  ["루틴", "챌린지", "미션", "습관", "목표", "자기개발", "체크"],
  ["자존감", "자기비난", "비교", "자기혐오", "칭찬", "열등감"],
  ["게으름", "무기력", "힘듦", "지루함", "산책", "운동", "루틴"],
];

const typeOrder = ["고민", "생각", "루틴", "카테고리", "태그", "언어권", "인물", "카드"];

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value) {
  return normalize(value)
    .split(/[ ,./!?'"()[\]{}:;|+-]+/)
    .map((token) => token.trim())
    .filter(Boolean);
}

function expandedTokens(query) {
  const tokens = new Set(tokenize(query));
  const queryText = normalize(query);

  for (const group of synonymGroups) {
    const normalizedGroup = group.map(normalize);
    if (normalizedGroup.some((word) => queryText.includes(word))) {
      for (const word of normalizedGroup) tokens.add(word);
    }
  }

  return [...tokens];
}

function scoreEntry(entry, tokens, originalQuery) {
  const title = normalize(entry.title);
  const category = normalize(`${entry.categoryTitle} ${entry.groupTitle}`);
  const tags = normalize(entry.tags);
  const aliases = normalize(entry.aliases);
  const summary = normalize(entry.summary);
  const query = normalize(originalQuery);

  let score = 0;
  if (query && title.includes(query)) score += 18;
  if (query && aliases.includes(query)) score += 12;
  if (query && tags.includes(query)) score += 9;
  if (query && category.includes(query)) score += 7;
  if (query && summary.includes(query)) score += 4;

  for (const token of tokens) {
    if (title.includes(token)) score += 10;
    if (aliases.includes(token)) score += 8;
    if (tags.includes(token)) score += 5;
    if (category.includes(token)) score += 4;
    if (summary.includes(token)) score += 2;
  }

  return score;
}

function groupResults(results, isSuggested) {
  if (isSuggested) return [{ label: "추천 카드", entries: results }];

  const groups = new Map();
  for (const entry of results) {
    const label = entry.typeLabel || "카드";
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(entry);
  }

  return [...groups.entries()]
    .map(([label, entries]) => ({ label, entries }))
    .sort(
      (a, b) =>
        typeOrder.indexOf(a.label) - typeOrder.indexOf(b.label) ||
        a.label.localeCompare(b.label, "ko")
    );
}

export default function HomeSearch({
  entries,
  suggestedEntries,
  exploreEntries = [],
}) {
  const [query, setQuery] = useState("");
  const normalizedQuery = normalize(query);

  const results = useMemo(() => {
    if (!normalizedQuery) return suggestedEntries.slice(0, 5);

    const tokens = expandedTokens(query);
    return [...entries, ...exploreEntries]
      .map((entry) => ({
        entry,
        score: scoreEntry(entry, tokens, query),
      }))
      .filter((item) => item.score > 0)
      .sort(
        (a, b) =>
          b.score - a.score ||
          b.entry.verifiedCount - a.entry.verifiedCount ||
          a.entry.title.localeCompare(b.entry.title, "ko")
      )
      .slice(0, 10)
      .map((item) => item.entry);
  }, [entries, exploreEntries, normalizedQuery, query, suggestedEntries]);

  const resultGroups = useMemo(
    () => groupResults(results, !normalizedQuery),
    [normalizedQuery, results]
  );

  return (
    <section className="rounded-lg border border-line bg-paper px-4 py-4">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            Search
          </p>
          <h2 className="mt-1 font-serif text-lg font-bold">
            지금 막힌 장면부터 찾기
          </h2>
        </div>
        <span className="shrink-0 text-xs text-ink-faint">문제 · 방법 · 기록</span>
      </div>
      <div className="flex items-center gap-2 border-b border-line pb-3">
        <span className="text-lg" aria-hidden>
          ⌕
        </span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="연애, 이별, 무기력, 게으름, 번아웃, 시험 불안..."
          className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-ink-faint"
          type="search"
          aria-label="고민 검색"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {quickQueries.map((quickQuery) => (
          <button
            key={quickQuery}
            type="button"
            onClick={() => setQuery(quickQuery)}
            className="rounded-lg border border-line bg-cream px-2.5 py-1 text-xs text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
          >
            {quickQuery}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-4">
        {results.length > 0 ? (
          resultGroups.map((group) => (
            <div key={group.label}>
              <div className="mb-1.5 flex items-center justify-between gap-3">
                <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                  {group.label}
                </p>
                <span className="text-xs text-ink-faint">{group.entries.length}</span>
              </div>
              <div className="space-y-2">
                {group.entries.map((entry) => (
                  <Link
                    key={entry.href}
                    href={entry.href}
                    className="group block rounded-lg px-2 py-2 transition-colors hover:bg-cream"
                  >
                    <span className="flex items-start justify-between gap-3">
                      <span className="min-w-0">
                        <span className="block font-serif text-base font-bold group-hover:text-clay">
                          {entry.title}
                        </span>
                        <span className="mt-0.5 block text-xs text-ink-faint">
                          {entry.categoryTitle}
                          {entry.groupTitle ? ` · ${entry.groupTitle}` : ""}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                        {entry.badgeLabel || `검증 ${entry.verifiedCount}`}
                      </span>
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                      {entry.summary}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg bg-cream px-3 py-3 text-sm leading-relaxed text-ink-soft">
            <p>
              아직 정확히 맞는 결과가 없습니다. 아래 입구에서 가까운 주제로
              시작해보세요.
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {fallbackLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg border border-line bg-paper px-2.5 py-1 text-xs transition-colors hover:border-clay/40 hover:text-clay"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
