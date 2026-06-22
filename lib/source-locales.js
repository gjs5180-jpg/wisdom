import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const registry = JSON.parse(
  readFileSync(join(here, "../data/source_locale_registry.json"), "utf8")
);

export function sourceLocaleRegistry() {
  return registry;
}

export function allSourceLocales() {
  return [...registry.locales].sort((a, b) => a.priority - b.priority);
}

export function prioritySourceLocales(limit = 4) {
  return allSourceLocales().slice(0, limit);
}

export function sourceLocaleStats() {
  const locales = allSourceLocales();
  const active = locales.filter((locale) => locale.status === "active").length;
  const sourceReady = locales.filter((locale) => locale.status === "source-ready").length;
  const planned = locales.filter((locale) => locale.status === "planned").length;

  return {
    total: locales.length,
    active,
    sourceReady,
    planned,
    methods: locales.reduce(
      (sum, locale) => sum + (locale.collectionMethods?.length || 0),
      0
    ),
  };
}
