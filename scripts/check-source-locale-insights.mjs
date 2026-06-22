import { sourceLocaleInsights } from "../lib/source-locale-insights.js";
import { allContentEntries } from "../lib/content.js";
import { sourceLocaleRegistry } from "../lib/source-locales.js";

const entriesByKey = new Map(allContentEntries().map((entry) => [entry.key, entry]));
const localeSet = new Set(sourceLocaleRegistry().locales.map((locale) => locale.locale));
const failures = [];

function fail(message) {
  failures.push(message);
}

for (const [key, insights] of Object.entries(sourceLocaleInsights)) {
  if (!entriesByKey.has(key)) {
    fail(`Insight key has no matching content entry: ${key}`);
    continue;
  }

  if (!Array.isArray(insights) || insights.length === 0) {
    fail(`${key} must include at least one locale insight.`);
    continue;
  }

  for (const insight of insights) {
    if (!localeSet.has(insight.locale)) {
      fail(`${key} has unknown locale: ${insight.locale}`);
    }
    if (!insight.signal || typeof insight.signal !== "string") {
      fail(`${key} ${insight.locale} is missing signal.`);
    }
    if (!Array.isArray(insight.userDoors) || insight.userDoors.length === 0) {
      fail(`${key} ${insight.locale} must include userDoors.`);
    }
    if (!Array.isArray(insight.sourcePhrases) || insight.sourcePhrases.length < 2) {
      fail(`${key} ${insight.locale} must include at least two sourcePhrases.`);
    }
    if (!Array.isArray(insight.searchAliases) || insight.searchAliases.length === 0) {
      fail(`${key} ${insight.locale} must include searchAliases.`);
    }
  }
}

if (failures.length > 0) {
  console.error("Source locale insight check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Source locale insights OK: ${Object.keys(sourceLocaleInsights).length} content entries`
);
