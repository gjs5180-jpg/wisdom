import { readFileSync } from "node:fs";

const registryPath = "data/source_locale_registry.json";
const registry = JSON.parse(readFileSync(registryPath, "utf8"));

const allowedStatuses = new Set(["active", "source-ready", "planned"]);
const requiredStringFields = ["locale", "label", "nativeLabel", "region", "status"];
const requiredArrayFields = [
  "collectionMethods",
  "sourceSignals",
  "canonicalUse",
  "safetyRules",
];

const failures = [];

function fail(message) {
  failures.push(message);
}

if (!registry.version) fail("Registry is missing version.");
if (!registry.updatedAt) fail("Registry is missing updatedAt.");
if (!Array.isArray(registry.locales) || registry.locales.length === 0) {
  fail("Registry must include at least one locale.");
}

const seenLocales = new Set();
const priorities = new Set();

for (const locale of registry.locales || []) {
  for (const field of requiredStringFields) {
    if (!locale[field] || typeof locale[field] !== "string") {
      fail(`${locale.locale || "unknown"} is missing string field: ${field}`);
    }
  }

  if (!/^[a-z]{2}-[A-Z]{2}$/.test(locale.locale || "")) {
    fail(`${locale.locale || "unknown"} must use BCP-47 style like ko-KR.`);
  }

  if (seenLocales.has(locale.locale)) {
    fail(`Duplicate locale: ${locale.locale}`);
  }
  seenLocales.add(locale.locale);

  if (!allowedStatuses.has(locale.status)) {
    fail(`${locale.locale} has unsupported status: ${locale.status}`);
  }

  if (!Number.isInteger(locale.priority) || locale.priority < 1) {
    fail(`${locale.locale} priority must be a positive integer.`);
  }
  if (priorities.has(locale.priority)) {
    fail(`Duplicate priority: ${locale.priority}`);
  }
  priorities.add(locale.priority);

  for (const field of requiredArrayFields) {
    if (!Array.isArray(locale[field]) || locale[field].length === 0) {
      fail(`${locale.locale} must include at least one ${field} item.`);
    }
  }
}

if (!seenLocales.has("ko-KR")) fail("ko-KR source locale is required.");
if (!seenLocales.has("en-US")) fail("en-US source locale is required.");
if (!seenLocales.has("ja-JP")) fail("ja-JP source locale is required.");

if (failures.length > 0) {
  console.error("Source locale registry check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Source locale registry OK: ${registry.locales.length} locales, ${[...seenLocales].join(", ")}`
);
