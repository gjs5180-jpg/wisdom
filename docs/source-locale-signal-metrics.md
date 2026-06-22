# Source Locale Signal Metrics

Wisdom tracks source-locale interest signals from collected autocomplete/search phrase candidates.

These metrics are **not population counts**. They do not mean a specific number of people have a worry. They mean the worry produced repeated source-language search expressions across one or more language zones.

## Generated Files

- `data/source_locale_signal_summary.json`: route-level aggregate signal data.
- `scripts/build-source-locale-signals.mjs`: builds the aggregate file from raw source-locale collection outputs.
- `scripts/check-source-locale-signals.mjs`: validates the aggregate file against current content entries.
- `lib/source-locale-signals.js`: runtime helpers for homepage and detail pages.
- `components/SourceLocaleSignalSummary.jsx`: detail-page signal summary.

## Commands

```bash
npm run source-signals:build
npm run source-signals:check
```

Run `source-signals:build` after refreshing any source-locale phrase raw file.

## Current Totals

Generated on 2026-06-22 from Japanese, Chinese, Spanish, French, and German source files.

- canonical routes with signals: 38
- source-locale route rows: 190
- candidate phrases: 3,364
- usable candidate phrases: 2,981
- review candidate phrases: 262
- low-signal candidate phrases: 121

## What The Metrics Mean

- `localeCoverage`: how many source locales produced usable phrases for the route.
- `totalCandidate`: all collected phrases for the route.
- `totalUsable`: phrases classified as usable source-locale worry/debate/topic signals.
- `strongestLocales`: the source locales with the most usable phrases for that route.
- `strength`: an early qualitative label derived from locale coverage and usable phrase count.

## Current Strong Cross-Locale Signals

- `/debate/remote-work`
- `/family/parent-conflict`
- `/breakup/ghosting`
- `/study/exam-anxiety`
- `/debate/childfree`
- `/meaning/meaningless`
- `/thought/good-life`
- `/money/future-anxiety`

## Product Use

Use these metrics to:

1. Prioritize which cards to improve first.
2. Show users that a concern appears across several language zones.
3. Find language-specific phrasing worth turning into Korean and English user doors.
4. Avoid claiming exact user counts before real analytics exist.

## Safety

- Never display these numbers as actual people counts.
- Do not infer stereotypes from one language region.
- Use the metric as a prioritization signal, then rewrite page copy in Wisdom's voice.
- Medical, legal, institutional, and labor-policy claims still need source verification.
