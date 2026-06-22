import { readFileSync } from "node:fs";

const args = new Map(
  process.argv
    .slice(2)
    .filter((arg) => arg.startsWith("--"))
    .map((arg) => {
      const [key, value = "true"] = arg.slice(2).split("=");
      return [key, value];
    })
);

const targetLocale = args.get("locale");
const seedPath = "data/source_locale_phrase_seeds.json";
const registryPath = "data/source_locale_registry.json";
const globalSeedPath = "data/global_phrase_seeds.json";

const seeds = JSON.parse(readFileSync(seedPath, "utf8"));
const registry = JSON.parse(readFileSync(registryPath, "utf8"));
const globalSeeds = JSON.parse(readFileSync(globalSeedPath, "utf8"));

const registryLocales = new Set(registry.locales.map((locale) => locale.locale));
const canonicalRoutes = new Set(globalSeeds.nodes.map((node) => node.route));
const canonicalByRoute = new Map(globalSeeds.nodes.map((node) => [node.route, node]));
const failures = [];

function fail(message) {
  failures.push(message);
}

if (!seeds.version) fail("Seed file is missing version.");
if (!seeds.locales || typeof seeds.locales !== "object") {
  fail("Seed file must have locales object.");
}

const locales = Object.entries(seeds.locales || {}).filter(
  ([locale]) => !targetLocale || locale === targetLocale
);

if (targetLocale && locales.length === 0) {
  fail(`No seed locale found for ${targetLocale}.`);
}

for (const [locale, config] of locales) {
  if (!registryLocales.has(locale)) fail(`${locale} is not present in source locale registry.`);
  if (!Array.isArray(config.nodes) || config.nodes.length === 0) {
    fail(`${locale} must include at least one node.`);
    continue;
  }

  const seenRoutes = new Set();
  for (const node of config.nodes) {
    if (!node.route || !node.slot || !node.axis) {
      fail(`${locale} has a node missing route, slot, or axis.`);
      continue;
    }

    if (seenRoutes.has(node.route)) fail(`${locale} has duplicate route: ${node.route}`);
    seenRoutes.add(node.route);

    if (!canonicalRoutes.has(node.route)) {
      fail(`${locale} route is not in canonical map: ${node.route}`);
    } else {
      const canonical = canonicalByRoute.get(node.route);
      if (canonical.axis !== node.axis) {
        fail(`${locale} ${node.route} axis mismatch: ${node.axis} !== ${canonical.axis}`);
      }
      if (canonical.slot !== node.slot) {
        fail(`${locale} ${node.route} slot mismatch: ${node.slot} !== ${canonical.slot}`);
      }
    }

    if (!Array.isArray(node.sourceQueries) || node.sourceQueries.length < 2) {
      fail(`${locale} ${node.route} must include at least two sourceQueries.`);
    }

    for (const query of node.sourceQueries || []) {
      if (typeof query !== "string" || query.trim().length < 2) {
        fail(`${locale} ${node.route} has an invalid source query.`);
      }
    }
  }
}

if (failures.length > 0) {
  console.error("Source locale phrase seed check failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  `Source locale phrase seeds OK: ${locales
    .map(([locale, config]) => `${locale} ${config.nodes.length}`)
    .join(", ")}`
);
