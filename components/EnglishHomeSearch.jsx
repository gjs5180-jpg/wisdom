"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const quickQueries = [
  "people pleasing",
  "happiness",
  "meaning of life",
  "AI jobs",
  "breakup",
  "burnout",
  "death penalty",
];

const fallbackLinks = [
  { label: "High-signal topics", href: "#high-signal" },
  { label: "Question nodes", href: "#english-nodes" },
  { label: "Source languages", href: "/source-locales" },
  { label: "Korean map", href: "/" },
];

const typeOrder = ["Question", "Source language", "Path", "Korean map"];

const synonymGroups = [
  ["people pleasing", "approval", "boundaries", "say no", "fear of disappointing"],
  ["happiness", "meaning", "good life", "life worth living", "purpose"],
  ["ai", "artificial intelligence", "jobs", "replacement", "automation"],
  ["breakup", "ex", "ghosting", "reunion", "contact"],
  ["burnout", "work", "career", "boss", "unrecognized"],
  ["death penalty", "punishment", "justice", "crime"],
];

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
  const aliases = normalize(entry.aliases);
  const summary = normalize(entry.summary);
  const query = normalize(originalQuery);

  let score = 0;
  if (query && title.includes(query)) score += 20;
  if (query && aliases.includes(query)) score += 14;
  if (query && category.includes(query)) score += 6;
  if (query && summary.includes(query)) score += 5;

  for (const token of tokens) {
    if (title.includes(token)) score += 10;
    if (aliases.includes(token)) score += 8;
    if (category.includes(token)) score += 4;
    if (summary.includes(token)) score += 2;
  }

  return score;
}

function groupResults(results, isSuggested) {
  if (isSuggested) return [{ label: "Suggested", entries: results }];

  const groups = new Map();
  for (const entry of results) {
    const label = entry.typeLabel || "Question";
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(entry);
  }

  return [...groups.entries()]
    .map(([label, entries]) => ({ label, entries }))
    .sort(
      (a, b) =>
        typeOrder.indexOf(a.label) - typeOrder.indexOf(b.label) ||
        a.label.localeCompare(b.label, "en")
    );
}

export default function EnglishHomeSearch({
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
          a.entry.title.localeCompare(b.entry.title, "en")
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
      <div className="flex items-center gap-2 border-b border-line pb-3">
        <span className="text-lg" aria-hidden>
          ⌕
        </span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search people pleasing, happiness, AI jobs, breakup..."
          className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-ink-faint"
          type="search"
          aria-label="Search English question map"
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
                          {entry.groupTitle ? ` / ${entry.groupTitle}` : ""}
                        </span>
                      </span>
                      <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                        {entry.badgeLabel || `${entry.verifiedCount} checked`}
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
            <p>No close match yet. Start from one of these paths instead.</p>
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
