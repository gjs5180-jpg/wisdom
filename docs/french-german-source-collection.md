# French and German Source Collection

French and German are now active source locales for Wisdom.

The goal is not to publish French or German pages yet. The goal is to collect source-language worry, thought, and debate expressions, map them to existing canonical routes, and identify repeated unmatched clusters.

## Files

- `data/source_locale_phrase_seeds.json`: French and German seed queries mapped to canonical Wisdom routes.
- `data/source_locale_phrase_raw.fr-FR.json`: collected French autocomplete results and classification data.
- `data/source_locale_phrase_candidates.fr-FR.md`: human-readable French review report.
- `data/source_locale_phrase_raw.de-DE.json`: collected German autocomplete results and classification data.
- `data/source_locale_phrase_candidates.de-DE.md`: human-readable German review report.

## Commands

```bash
npm run french:check
npm run french:collect
npm run german:check
npm run german:collect
```

Use `npm run source-phrases:check` when changing multiple locale seed sets.

## First French Collection Result

Collected on 2026-06-22.

- source locale: `fr-FR`
- canonical routes seeded: 38
- candidate phrases: 850
- usable candidates: 750
- review candidates: 63
- low-signal candidates: 37
- fetch errors: 0

Potential new cluster hints:

- `family/family-of-origin`: 13 signals
- `meaning/existential-vacuum`: 12 signals
- `work/remote-work-culture`: 12 signals
- `money/precarity`: 10 signals
- `study/exam-pressure`: 4 signals
- `debate/childfree-identity`: 2 signals
- `relationships/ghosting`: 1 signal

French produced especially strong signals around existential emptiness, toxic-family language, precarity, and telework.

## First German Collection Result

Collected on 2026-06-22.

- source locale: `de-DE`
- canonical routes seeded: 38
- candidate phrases: 761
- usable candidates: 690
- review candidates: 45
- low-signal candidates: 26
- fetch errors: 0

Potential new cluster hints:

- `work/remote-work-culture`: 28 signals
- `debate/childfree-identity`: 12 signals
- `family/family-of-origin`: 11 signals
- `study/exam-pressure`: 10 signals
- `relationships/ghosting`: 9 signals
- `money/precarity`: 3 signals
- `meaning/existential-vacuum`: 2 signals

German produced especially strong signals around Homeoffice, childfree identity, exam anxiety, family-of-origin pressure, and ghosting.

## Current Priority

1. Convert the strongest French and German source patterns into reviewed Korean user doors and search aliases.
2. Start with `/debate/remote-work`, `/debate/childfree`, `/family/parent-conflict`, `/meaning/meaningless`, `/study/exam-anxiety`, and `/breakup/ghosting`.
3. Compare French/German signals with the already reviewed Spanish/Chinese/Japanese signals before adding new nodes.
4. Use these source signals to improve Korean and English output quality before creating French or German output pages.

## Safety

- Do not store personal posts or identifiable community stories.
- Do not copy forum titles into page copy.
- Treat language-region patterns as signals, not stereotypes.
- Philosophy/reference searches should be separated from lived worry searches before publication.
- Medical, legal, institutional, and labor-policy claims still need source verification before publication.
