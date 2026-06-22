# Multilingual Source Strategy

Wisdom should treat language in two separate layers.

1. **Source locale**: the language and culture where a worry, search phrase, debate, or recurring question is observed.
2. **Output locale**: the language in which Wisdom writes a page for the user.

This means a Japanese worry pattern can enrich the same canonical node that later appears in Korean, English, or another output language. The site is not only translating Korean pages. It is building a shared map of human worries from multiple language zones.

## Why This Matters

- Different cultures phrase the same worry differently.
- Some worries are highly visible in one language and almost hidden in another.
- Search traffic becomes broader because each output page can include user doors shaped by multiple source cultures.
- The product becomes harder to copy: the value is the classified map, not just article text.

## Current Source Locale Order

1. `ko-KR`: primary canonical writing and first taxonomy.
2. `en-US`: active search phrase enrichment and English output prototype.
3. `ja-JP`: active source layer for worry/debate pattern discovery.
4. `zh-CN`: active source layer for family, study, work, duty, and meaning signals.
5. `es-ES`: active source layer for relationships, work, family independence, money, and debate signals.
6. `fr-FR`: active source layer for existential, family, precarity, telework, and philosophical-language signals.
7. `de-DE`: active source layer for work, duty, exam pressure, family, meaning, and modern-life critique signals.

The registry lives in `data/source_locale_registry.json`.

Japanese source collection is now active. The first pass is documented in `docs/japanese-source-collection.md`.

Chinese and Spanish source collection is now active. The first pass is documented in `docs/chinese-spanish-source-collection.md`.

French and German source collection is now active. The first pass is documented in `docs/french-german-source-collection.md`.

## Collection Rules

- Store generalized patterns, not personal posts.
- Do not copy community titles or bodies into page copy.
- Map every phrase to an existing canonical node before creating a new node.
- Promote a new node only when repeated patterns cannot fit the existing taxonomy.
- Keep cultural context as a signal, not a stereotype.
- Use official, research, primary, or publisher sources for claims about thinkers and public issues.

## Source Collection Commands

```bash
npm run source-locales:check
npm run source-phrases:check
npm run japanese:check
npm run japanese:collect
npm run chinese:check
npm run chinese:collect
npm run spanish:check
npm run spanish:collect
npm run french:check
npm run french:collect
npm run german:check
npm run german:collect
```

## Output Rules

- Korean remains the canonical writing language for now.
- English pages should be generated or curated whenever a new canonical node is added.
- Japanese can first be a source language before becoming an output language.
- A page may mention that a concern appears across several source cultures, but it should not expose raw personal text.

## Person Perspective Strategy

The thinker layer should also be global.

- Greek/Roman: Aristotle, Epictetus, Seneca, Marcus Aurelius.
- Chinese/East Asian: Confucius, Laozi, Zhuangzi, later Japanese and Korean thinkers where sources are strong.
- German/French/Danish: Kant, Hegel, Nietzsche, Heidegger, Arendt, Camus, Sartre, Kierkegaard.
- Indian/Buddhist/Vietnamese: Buddhist practice, Thich Nhat Hanh, and later Indian philosophical sources.
- Modern public thinkers: Sandel, Nussbaum, Rawls, Singer, Byung-Chul Han, Adam Grant, and others where the page needs modern framing.

The goal is not to decorate pages with famous names. Each person should clarify a recurring human situation.
