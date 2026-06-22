# Chinese and Spanish Source Collection

Chinese and Spanish are now active source locales for Wisdom.

The goal is not to publish Chinese or Spanish pages yet. The goal is to collect source-language worry, thought, and debate expressions, map them to existing canonical routes, and identify repeated unmatched clusters.

## Files

- `data/source_locale_phrase_seeds.json`: Chinese and Spanish seed queries mapped to canonical Wisdom routes.
- `data/source_locale_phrase_raw.zh-CN.json`: collected Simplified Chinese autocomplete results and classification data.
- `data/source_locale_phrase_candidates.zh-CN.md`: human-readable Chinese review report.
- `data/source_locale_phrase_raw.es-ES.json`: collected Spanish autocomplete results and classification data.
- `data/source_locale_phrase_candidates.es-ES.md`: human-readable Spanish review report.

## Commands

```bash
npm run chinese:check
npm run chinese:collect
npm run spanish:check
npm run spanish:collect
```

Use `npm run source-phrases:check` when changing multiple locale seed sets.

## First Chinese Collection Result

Collected on 2026-06-21.

- source locale: `zh-CN`
- canonical routes seeded: 38
- candidate phrases: 225
- usable candidates: 207
- review candidates: 9
- low-signal candidates: 9
- fetch errors: 0

Potential new cluster hints:

- `family/family-of-origin`: 1 signal
- `study/exam-pressure`: 1 signal
- `debate/childfree-identity`: 1 signal

Chinese autocomplete produced fewer candidates than Japanese or Spanish, but the signal is clean enough to start route enrichment.

## First Spanish Collection Result

Collected on 2026-06-21.

- source locale: `es-ES`
- canonical routes seeded: 38
- candidate phrases: 746
- usable candidates: 691
- review candidates: 41
- low-signal candidates: 14
- fetch errors: 0

Potential new cluster hints:

- `relationships/ghosting`: 15 signals
- `work/remote-work-culture`: 12 signals
- `family/late-independence`: 10 signals
- `debate/childfree-identity`: 2 signals
- `study/exam-pressure`: 2 signals
- `family/family-of-origin`: 1 signal
- `meaning/existential-vacuum`: 1 signal
- `money/precarity`: 1 signal

Spanish produced especially strong route-enrichment signals around ghosting, remote work, late independence, money precarity, and existential emptiness.

## Current Priority

1. Convert the strongest Chinese and Spanish source patterns into Korean and English user-door copy for existing routes.
2. Start with `/breakup/ghosting`, `/debate/remote-work`, `/family/independence`, `/money/future-anxiety`, `/meaning/meaningless`, and `/study/exam-anxiety`.
3. Treat `childfree`, `family of origin`, and `exam pressure` as cross-locale clusters before creating any new route.
4. Keep country-specific context separate when needed, especially for Spanish-speaking regions.

## First Route Enrichment

The first reviewed insight pass lives in `lib/source-locale-insights.js`.

It currently enriches:

- `/breakup/ghosting`
- `/debate/remote-work`
- `/family/independence`
- `/family/parent-conflict`
- `/money/future-anxiety`
- `/meaning/meaningless`
- `/study/exam-anxiety`
- `/study/cant-study`
- `/debate/childfree`

These insights add rewritten Korean user doors and multilingual search aliases. They do not expose raw posts or personal stories.

`components/SourceLocaleInsights.jsx` renders reviewed source-language phrases on detail pages when a node has insight data. This makes the multilingual-source layer visible without turning raw community text into page copy.

## Safety

- Do not store personal posts or identifiable community stories.
- Do not copy forum titles into page copy.
- Avoid political personal-story collection.
- Treat cultural patterns as signals, not stereotypes.
- Medical, legal, institutional, and labor-policy claims still need source verification before publication.
