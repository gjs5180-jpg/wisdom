# Japanese Source Collection

Japanese is now an active source locale for Wisdom.

The goal is not to publish Japanese pages yet. The goal is to collect Japanese-origin worry, thought, and debate expressions, map them to existing canonical routes, and identify repeated unmatched clusters.

## Files

- `data/source_locale_phrase_seeds.json`: Japanese seed queries mapped to canonical Wisdom routes.
- `data/source_locale_phrase_raw.ja-JP.json`: collected autocomplete results and classification data.
- `data/source_locale_phrase_candidates.ja-JP.md`: human-readable review report.

## Commands

```bash
npm run japanese:check
npm run japanese:collect
```

Use `npm run source-phrases:check` when adding more source locales or changing multiple locale seed sets.

## First Collection Result

Collected on 2026-06-21.

- source locale: `ja-JP`
- canonical routes seeded: 38
- candidate phrases: 782
- usable candidates: 643
- review candidates: 104
- low-signal candidates: 35

Potential new cluster hints:

- `meaning/ikigai`: 6 signals
- `study/school-refusal`: 1 signal

These hints are not automatically promoted. They should be reviewed against existing nodes first.

## Current Priority

1. Expand Japanese seeds around work, school, loneliness, family, and meaning.
2. Review `meaning/ikigai` as either an enrichment of `/thought/good-life` or a new meaning/thought candidate.
3. Watch for `school refusal` patterns before creating a separate node.
4. Only after repeated source-locale signals are stable, convert selected Japanese patterns into Korean/English user-door copy.

## Safety

- Do not store personal posts or identifiable community stories.
- Do not copy Q&A titles into page copy.
- Treat Japanese cultural patterns as signals, not stereotypes.
- Official, medical, legal, and institutional claims still need source verification before publication.
