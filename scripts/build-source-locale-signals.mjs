import { readFileSync, writeFileSync } from "node:fs";

const rawLocales = ["ja-JP", "zh-CN", "es-ES", "fr-FR", "de-DE"];
const outputPath = "data/source_locale_signal_summary.json";

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function keyForRoute(route) {
  return String(route || "").replace(/^\//, "");
}

function strengthLabel(totalUsable, localeCoverage) {
  if (localeCoverage >= 5 && totalUsable >= 100) return "very-strong";
  if (localeCoverage >= 4 && totalUsable >= 70) return "strong";
  if (localeCoverage >= 3 && totalUsable >= 40) return "moderate";
  return "emerging";
}

function scoreFor({ totalUsable, localeCoverage, totalClusterHints }) {
  return totalUsable + localeCoverage * 30 + totalClusterHints * 6;
}

function sumClusterHints(rows) {
  const result = {};
  for (const row of rows) {
    for (const [cluster, count] of Object.entries(row.clusterHints || {})) {
      result[cluster] = (result[cluster] || 0) + count;
    }
  }
  return result;
}

const payloads = rawLocales.map((locale) => ({
  locale,
  raw: readJson(`data/source_locale_phrase_raw.${locale}.json`),
}));

const routeMap = new Map();

for (const { locale, raw } of payloads) {
  for (const row of raw.rows || []) {
    const key = keyForRoute(row.route);
    const current =
      routeMap.get(key) ||
      {
        key,
        route: row.route,
        slot: row.slot,
        axis: row.axis,
        locales: [],
      };

    current.locales.push({
      locale,
      candidateCount: row.candidatePhrases?.length || 0,
      usableCount: row.usableCandidatePhrases?.length || 0,
      reviewCount: row.reviewCandidatePhrases?.length || 0,
      lowSignalCount: row.lowSignalCandidatePhrases?.length || 0,
      clusterHints: row.clusterHints || {},
      topPhrases: (row.usableCandidatePhrases || []).slice(0, 6),
    });

    routeMap.set(key, current);
  }
}

const routes = [...routeMap.values()].map((route) => {
  const localesWithSignal = route.locales.filter((locale) => locale.usableCount > 0);
  const totalCandidate = route.locales.reduce((sum, locale) => sum + locale.candidateCount, 0);
  const totalUsable = route.locales.reduce((sum, locale) => sum + locale.usableCount, 0);
  const totalReview = route.locales.reduce((sum, locale) => sum + locale.reviewCount, 0);
  const totalLowSignal = route.locales.reduce((sum, locale) => sum + locale.lowSignalCount, 0);
  const clusterHints = sumClusterHints(route.locales);
  const totalClusterHints = Object.values(clusterHints).reduce((sum, count) => sum + count, 0);
  const sortedLocales = [...route.locales].sort(
    (a, b) => b.usableCount - a.usableCount || b.candidateCount - a.candidateCount
  );
  const strongestLocales = sortedLocales.slice(0, 3).map((locale) => ({
    locale: locale.locale,
    usableCount: locale.usableCount,
    candidateCount: locale.candidateCount,
  }));

  return {
    ...route,
    localeCoverage: localesWithSignal.length,
    totalCandidate,
    totalUsable,
    totalReview,
    totalLowSignal,
    clusterHints,
    totalClusterHints,
    strongestLocales,
    strength: strengthLabel(totalUsable, localesWithSignal.length),
    score: scoreFor({ totalUsable, localeCoverage: localesWithSignal.length, totalClusterHints }),
  };
});

const commonSignals = [...routes]
  .filter((route) => route.localeCoverage >= 5)
  .sort((a, b) => b.score - a.score || b.totalUsable - a.totalUsable)
  .slice(0, 12)
  .map((route) => route.key);

const strongestSignals = [...routes]
  .sort((a, b) => b.score - a.score || b.totalUsable - a.totalUsable)
  .slice(0, 12)
  .map((route) => route.key);

const localeHighlights = Object.fromEntries(
  rawLocales.map((locale) => [
    locale,
    [...routes]
      .map((route) => {
        const localeRow = route.locales.find((item) => item.locale === locale);
        return {
          key: route.key,
          route: route.route,
          usableCount: localeRow?.usableCount || 0,
          candidateCount: localeRow?.candidateCount || 0,
          clusterHintCount: Object.values(localeRow?.clusterHints || {}).reduce(
            (sum, count) => sum + count,
            0
          ),
        };
      })
      .filter((row) => row.usableCount > 0)
      .sort(
        (a, b) =>
          b.clusterHintCount - a.clusterHintCount ||
          b.usableCount - a.usableCount ||
          b.candidateCount - a.candidateCount
      )
      .slice(0, 6),
  ])
);

const summary = {
  generatedAt: new Date().toISOString(),
  sourceLocales: rawLocales,
  totals: {
    routes: routes.length,
    localeRows: routes.reduce((sum, route) => sum + route.locales.length, 0),
    candidatePhrases: routes.reduce((sum, route) => sum + route.totalCandidate, 0),
    usableCandidatePhrases: routes.reduce((sum, route) => sum + route.totalUsable, 0),
    reviewCandidatePhrases: routes.reduce((sum, route) => sum + route.totalReview, 0),
    lowSignalCandidatePhrases: routes.reduce((sum, route) => sum + route.totalLowSignal, 0),
  },
  commonSignals,
  strongestSignals,
  localeHighlights,
  routes: routes.sort((a, b) => a.key.localeCompare(b.key)),
};

writeFileSync(outputPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

console.log(`Source locale signal summary written: ${outputPath}`);
console.log(`routes: ${summary.totals.routes}`);
console.log(`candidate phrases: ${summary.totals.candidatePhrases}`);
console.log(`usable candidate phrases: ${summary.totals.usableCandidatePhrases}`);
