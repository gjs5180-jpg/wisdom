import { allContentEntries } from "./content.js";
import { allSourceLocales } from "./source-locales.js";
import { sourceLocaleSignalSummary } from "./source-locale-signals.js";

const axisLabels = {
  worry: "고민",
  debate: "논쟁",
  thought: "생각",
};

function unique(values) {
  return [...new Set(values.filter(Boolean).map((value) => String(value).trim()))];
}

function contentEntriesByKey() {
  return new Map(
    allContentEntries()
      .filter((entry) => entry.publishable)
      .map((entry) => [entry.key, entry])
  );
}

function localeMetaByCode() {
  return new Map(allSourceLocales().map((locale) => [locale.locale, locale]));
}

function sourceLocalesInSummary() {
  const summary = sourceLocaleSignalSummary();
  const metaByCode = localeMetaByCode();

  return summary.sourceLocales
    .map((code) => metaByCode.get(code))
    .filter(Boolean)
    .sort((a, b) => a.priority - b.priority);
}

function rowForLocale(signal, localeCode) {
  return signal.locales.find((row) => row.locale === localeCode) || null;
}

function topTagCounts(hits, limit = 8) {
  const counts = new Map();

  for (const hit of hits) {
    for (const tag of hit.entry.tags || []) {
      const current = counts.get(tag.slug) || { ...tag, count: 0 };
      current.count += 1;
      counts.set(tag.slug, current);
    }
  }

  return [...counts.values()]
    .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title, "ko"))
    .slice(0, limit);
}

function axisCounts(hits) {
  const counts = new Map();

  for (const hit of hits) {
    const key = hit.entry.axis;
    counts.set(key, (counts.get(key) || 0) + 1);
  }

  return ["worry", "debate", "thought"].map((axis) => ({
    axis,
    label: axisLabels[axis],
    count: counts.get(axis) || 0,
  }));
}

function localeHits(localeCode) {
  const summary = sourceLocaleSignalSummary();
  const entriesByKey = contentEntriesByKey();

  return summary.routes
    .map((signal) => {
      const entry = entriesByKey.get(signal.key);
      const locale = rowForLocale(signal, localeCode);
      if (!entry || !locale || locale.usableCount <= 0) return null;

      return {
        key: signal.key,
        route: signal.route,
        entry,
        signal,
        locale,
        topPhrases: locale.topPhrases || [],
      };
    })
    .filter(Boolean);
}

function buildLocaleMap(locale) {
  const hits = localeHits(locale.locale);
  const topHits = [...hits].sort(
    (a, b) =>
      b.locale.usableCount - a.locale.usableCount ||
      b.locale.candidateCount - a.locale.candidateCount ||
      a.entry.title.localeCompare(b.entry.title, "ko")
  );
  const commonHits = topHits.filter((hit) => hit.signal.localeCoverage >= 5);
  const topPhrases = unique(topHits.flatMap((hit) => hit.topPhrases)).slice(0, 18);

  return {
    ...locale,
    code: locale.locale,
    href: `/source-locales/${locale.locale}`,
    routeCount: hits.length,
    totalCandidate: hits.reduce((sum, hit) => sum + hit.locale.candidateCount, 0),
    totalUsable: hits.reduce((sum, hit) => sum + hit.locale.usableCount, 0),
    totalReview: hits.reduce((sum, hit) => sum + hit.locale.reviewCount, 0),
    totalLowSignal: hits.reduce((sum, hit) => sum + hit.locale.lowSignalCount, 0),
    topPhrases,
    topHits,
    commonHits,
    axisCounts: axisCounts(hits),
    topTags: topTagCounts(hits),
  };
}

export function sourceLocaleMapParams() {
  return sourceLocaleSignalSummary().sourceLocales.map((locale) => ({ locale }));
}

export function sourceLocaleMaps() {
  return sourceLocalesInSummary().map(buildLocaleMap);
}

export function sourceLocaleMapForCode(localeCode) {
  return sourceLocaleMaps().find((locale) => locale.locale === localeCode) || null;
}

export function sourceLocaleMapTotals() {
  const summary = sourceLocaleSignalSummary();
  const maps = sourceLocaleMaps();

  return {
    ...summary.totals,
    sourceLocaleCount: maps.length,
    mappedRouteCount: new Set(maps.flatMap((locale) => locale.topHits.map((hit) => hit.key)))
      .size,
  };
}

export function sharedSourceLocaleSignals(limit = 10) {
  const entriesByKey = contentEntriesByKey();

  return sourceLocaleSignalSummary()
    .routes.filter((signal) => signal.localeCoverage >= 5)
    .map((signal) => ({
      signal,
      entry: entriesByKey.get(signal.key) || null,
    }))
    .filter((row) => row.entry)
    .sort(
      (a, b) =>
        b.signal.totalUsable - a.signal.totalUsable ||
        a.entry.title.localeCompare(b.entry.title, "ko")
    )
    .slice(0, limit);
}
