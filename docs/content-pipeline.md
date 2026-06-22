# Wisdom Content Pipeline

Wisdom의 콘텐츠 단위는 검색어가 아니라 canonical node다. 여러 검색어와 실제 고민 표현을 하나의 노드에 묶고, 노드 안에서 감정 정의와 검증된 관점 카드를 제공한다.

최상위 구조는 대·중·소 분류다.

- 대분류: `고민`, `생각`, `논쟁`
- 중분류: 관계, 자아/마음, 현실/미래, 디지털/습관, 삶/행복, 성공/인정, 자유/사회, 법/생명 윤리, 가족/문화, 기술/경제, 일상 윤리
- 소분류: 실제 canonical node

## Flow

1. `npm run collect:worries`
   - Google/Naver 자동완성에서 공개 검색어 패턴을 수집한다.
   - 원문 고민글 본문은 저장하지 않는다.

2. `npm run clean:worries`
   - 음악, 드라마, 상품, 해몽 등 노이즈를 제거한다.
   - 결과는 사람이 읽기 쉬운 `data/worries_clean.md`로 남긴다.

3. `data/node-seeds.json`
   - 검색어를 묶을 canonical node 원장이다.
   - `slot`, `axis`, `intents`, `thinkers`, `priority`를 관리한다.

4. `npm run content:backlog`
   - 현재 앱 콘텐츠와 수집 검색어를 합쳐 운영 파일 4개를 만든다.
   - `ready`, `draft`, `planned` 상태를 나눠 다음 작업을 정한다.
   - 각 노드에 수요/검증/구조 점수를 붙인다.

Generated files:

- `data/content_backlog.md`: 사람이 보는 다음 작업 목록.
- `data/content_inventory.json`: 노드별 점수, 플래그, 검색어 매칭 수.
- `data/phrase_map.json`: 정제 검색어가 어떤 canonical node에 들어갔는지.
- `data/unmapped_candidates.md`: 아직 노드에 붙지 않은 검색어 후보 군집.

Global seed files:

- `data/global_phrase_seeds.json`: 영어권 등 해외권 검색 의도와 기존 canonical node의 연결 원장. 한국어 수집 파이프라인에 바로 섞지 않고, locale별 수집/검증 단계에서 확장한다.
- `data/english_phrase_raw.json`: 영어권 자동완성 수집 원본과 후보 분류 결과.
- `data/english_phrase_candidates.md`: 사람이 검토하기 쉬운 영어권 후보 목록.
- `data/english_phrase_promotion_report.md`: 어떤 후보가 영어 seed로 승격됐는지 보는 리포트.
- `lib/locales.js`: locale prefix와 `hreflang` 기본값. `/en`, `/ja`를 실제 공개하기 전까지 sitemap에는 한국어 페이지만 둔다.

5. 공개
   - 상세 페이지는 카드가 최소 2개 이상 검증되어야 `index` 대상이다.
   - 초안은 로컬에서 볼 수 있지만 metadata robots가 `noindex, follow`로 나간다.
   - 자동 생성본(`lib/nodes-generated.js`)은 직접 편집하지 않는다. 출처를 사람이 다시 확인해 다듬은 카드는 `lib/content.js`의 큐레이션 오버라이드에 올린다.

## Publishing Rules

- 원문 복붙 금지.
- 개인 사연의 이름, 닉네임, 지역, 직장, 날짜 등 식별 가능 정보 저장 금지.
- 검색어와 제목 패턴은 수집하되, 페이지 본문은 새로 작성한다.
- 직접 인용은 출처가 확인된 경우에만 `verified: true`로 둔다.
- 출처가 불확실한 카드는 `verified: false`와 `출처 확인 중`을 유지한다.
- 검색어 하나마다 새 페이지를 만들지 않는다.
- 한 노드는 최소 5개 이상의 실제 검색 입구 또는 명확한 evergreen 논쟁성을 가져야 한다.
- 노드는 반드시 대분류와 중분류 안에서 위치가 설명되어야 한다.
- 노드와 카드는 감정·상황 태그를 함께 가져야 한다. 태그는 여러 섹션에서 같은 관점을 다시 발견하게 하는 보조 탐색축이다.
- 고민은 저명한 사람의 관점과 검증 가능한 행동 힌트를 함께 둔다.
- 생각은 큰 질문을 하나의 정의로 닫지 않고, 서로 다른 삶의 기준을 비교하게 한다.
- 논쟁은 찬반을 넘어서 무엇이 충돌하는지 먼저 밝힌다.
- 공개 상세 페이지 하단에는 관련 태그, 관련 인물, 관련 페이지를 보여준다. 새 콘텐츠는 단독 글이 아니라 탐색망 안에 들어가야 한다.

## Source Tiers

## Source Locale Layer

`data/source_locale_registry.json` tracks source languages separately from output languages.
This lets Wisdom use Japanese, Chinese, Spanish, French, German, English, and Korean worry patterns as source signals for the same canonical node.

- Run `npm run source-locales:check` after changing the registry.
- Run `npm run source-phrases:check` after changing source-locale phrase seeds.
- Run `npm run japanese:collect` to refresh Japanese autocomplete phrase candidates.
- Run `npm run chinese:collect` to refresh Chinese autocomplete phrase candidates.
- Run `npm run spanish:collect` to refresh Spanish autocomplete phrase candidates.
- Run `npm run french:collect` to refresh French autocomplete phrase candidates.
- Run `npm run german:collect` to refresh German autocomplete phrase candidates.
- Source phrases must be generalized before they become search phrases or user doors.
- A repeated source-locale pattern should be mapped to an existing node before a new node is created.
- Output pages can use source-locale insights, but they should not expose raw personal posts.
- `lib/source-locale-insights.js` stores reviewed source-locale signals that are safe to use as Korean user doors and search aliases.
- Run `npm run source-insights:check` after adding source-locale insights.
- `data/source_locale_signal_summary.json` aggregates route-level interest signals from source-locale raw files.
- Run `npm run source-signals:build` after refreshing source-locale raw files, then `npm run source-signals:check`.

Japanese source files:

- `data/source_locale_phrase_seeds.json`
- `data/source_locale_phrase_raw.ja-JP.json`
- `data/source_locale_phrase_candidates.ja-JP.md`

Chinese and Spanish source files:

- `data/source_locale_phrase_raw.zh-CN.json`
- `data/source_locale_phrase_candidates.zh-CN.md`
- `data/source_locale_phrase_raw.es-ES.json`
- `data/source_locale_phrase_candidates.es-ES.md`

French and German source files:

- `data/source_locale_phrase_raw.fr-FR.json`
- `data/source_locale_phrase_candidates.fr-FR.md`
- `data/source_locale_phrase_raw.de-DE.json`
- `data/source_locale_phrase_candidates.de-DE.md`

Reviewed source-locale insight files:

- `lib/source-locale-insights.js`
- `scripts/check-source-locale-insights.mjs`

Source-locale signal metric files:

- `data/source_locale_signal_summary.json`
- `lib/source-locale-signals.js`
- `components/SourceLocaleSignalSummary.jsx`
- `scripts/build-source-locale-signals.mjs`
- `scripts/check-source-locale-signals.mjs`

카드 출처는 세 층으로 관리한다.

- `원전 / 공식 기준`: 고전 원문, 법령, 공식 기관 문서. 직접 확인하면 `verified: true`.
- `전문가 / 연구`: 논문, 전문기관, 검증된 저작. 맥락 확인 후 `verified: true`.
- `해설 / 요지`: 현대적 적용, 2차 해설, 살아있는 저자의 요지. 직접 문구가 불확실하면 `verified: false`.

## Quality Score

`content:backlog`는 각 노드에 100점 만점 점수를 붙인다.

- 수요 30점: 정제 검색어 매칭 수.
- 검증 30점: `verified` 카드 수. 2개 이상부터 공개 가능, 3개면 안정권.
- 구조 40점: 감정 정의, 사용자 입구 문장, 카드 수, 관점 충돌, 행동/성찰 지침.

Draft에서 우선 볼 플래그:

- `검증 카드 부족`: 출처 확인 카드가 2개 미만.
- `검색어 매칭 보강`: 수집어와 node intent가 잘 연결되지 않음.
- `사용자 입구 문장 부족`: 실제 고민 언어가 부족함.
- `관점 충돌 약함`: 서로 다른 stance가 부족함.
- `행동/성찰 지침 부족`: 읽고 끝나는 페이지가 될 위험.

미분류 후보는 바로 페이지로 만들지 않는다. 먼저 기존 노드의 `intents`에 흡수할 수 있는지 보고, 반복성이 충분하면 `data/node-seeds.json`에 새 canonical node로 승격한다.

## Node Shape

```json
{
  "slot": "breakup/should-contact",
  "axis": "worry",
  "category": "breakup",
  "title": "다시 연락해야 할지 고민될 때",
  "priority": 1,
  "intents": ["이별 후 연락", "전 애인 연락", "재회 연락"],
  "tags": ["갈림길", "미련", "재회"],
  "thinkers": ["세네카", "키르케고르", "에픽테토스"]
}
```

중분류는 `lib/content.js`의 `worryGroups`, `thoughtGroups`, `debateGroups`에서 파생한다. `node-seeds.json`에는 중분류를 중복 저장하지 않는다.

태그는 `lib/content.js`의 `tagGroups`, `categoryTagMap`, `nodeTagMap`, `thinkerTagMap`에서 파생한다. 새 노드를 만들 때는 먼저 category 기본 태그를 받고, 필요하면 node 단위로 감정·상황 태그를 보강한다.

## Good Page Pattern

- H1은 사용자가 검색하는 상황 언어로 쓴다.
- 상단에 감정 한 줄 정의를 둔다.
- `이럴 때 찾게 돼요`에는 원문이 아니라 재작성한 사용자 언어를 둔다.
- 카드마다 관점, 행동 지침, 짧은 인용/요지, 출처 상태를 분리한다.
- 마지막에는 지금 당장 해볼 행동을 둔다.
