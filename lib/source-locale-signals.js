import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { allSourceLocales } from "./source-locales.js";

const here = dirname(fileURLToPath(import.meta.url));
const signalSummary = JSON.parse(
  readFileSync(join(here, "../data/source_locale_signal_summary.json"), "utf8")
);
const localeByCode = new Map(allSourceLocales().map((locale) => [locale.locale, locale]));
const signalByKey = new Map(signalSummary.routes.map((signal) => [signal.key, signal]));

export function sourceLocaleSignalSummary() {
  return signalSummary;
}

export function sourceLocaleSignalForKey(key) {
  return signalByKey.get(String(key || "").replace(/^\//, "")) || null;
}

export function sourceLocaleDisplayName(code) {
  return localeByCode.get(code)?.nativeLabel || code;
}

export function sourceLocaleSignalStrengthLabel(strength) {
  const labels = {
    "very-strong": "매우 강함",
    strong: "강함",
    moderate: "보통",
    emerging: "관찰됨",
  };
  return labels[strength] || strength || "관찰됨";
}

export function formatSignalLocales(locales = []) {
  return locales
    .map((locale) => sourceLocaleDisplayName(locale.locale))
    .filter(Boolean)
    .join(" · ");
}

export function strongestSourceLocaleSignals(limit = 8) {
  return signalSummary.strongestSignals
    .map((key) => signalByKey.get(key))
    .filter(Boolean)
    .slice(0, limit);
}

export function commonSourceLocaleSignals(limit = 8) {
  return signalSummary.commonSignals
    .map((key) => signalByKey.get(key))
    .filter(Boolean)
    .slice(0, limit);
}

export function sourceLocaleHighlights(locale, limit = 4) {
  return (signalSummary.localeHighlights?.[locale] || [])
    .map((row) => ({
      ...row,
      signal: signalByKey.get(row.key) || null,
    }))
    .filter((row) => row.signal)
    .slice(0, limit);
}
