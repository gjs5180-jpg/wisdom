import { readFileSync } from "node:fs";
import { allContentEntries } from "../lib/content.js";

const summaryPath = "data/source_locale_signal_summary.json";
const summary = JSON.parse(readFileSync(summaryPath, "utf8"));
const entriesByKey = new Map(allContentEntries().map((entry) => [entry.key, entry]));
const failures = [];

function fail(message) {
  failures.push(message);
}

if (!summary.generatedAt) fail("Signal summary is missing generatedAt.");
if (!Array.isArray(summary.sourceLocales) || summary.sourceLocales.length === 0) {
  fail("Signal summary must include sourceLocales.");
}
if (!Array.isArray(summary.routes) || summary.routes.length === 0) {
  fail("Signal summary must include routes.");
}

for (const route of summary.routes || []) {
  if (!route.key || !entriesByKey.has(route.key)) {
    fail(`Signal route has no matching content entry: ${route.key}`);
  }
  if (!Number.isInteger(route.localeCoverage) || route.localeCoverage < 1) {
    fail(`${route.key} has invalid localeCoverage.`);
  }
  if (!Number.isInteger(route.totalUsable) || route.totalUsable < 0) {
    fail(`${route.key} has invalid totalUsable.`);
  }
  if (!Array.isArray(route.strongestLocales) || route.strongestLocales.length === 0) {
    fail(`${route.key} must include strongestLocales.`);
  }
}

for (const key of summary.commonSignals || []) {
  if (!entriesByKey.has(key)) fail(`commonSignals has no matching entry: ${key}`);
}

for (const key of summary.strongestSignals || []) {
  if (!entriesByKey.has(key)) fail(`strongestSignals has no matching entry: ${key}`);
}

if (failures.length > 0) {
  console.error("Source locale signal check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Source locale signals OK: ${summary.routes.length} routes, ${summary.totals.usableCandidatePhrases} usable phrases`
);
