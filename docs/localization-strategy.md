# Wisdom 다국어 확장 전략

Wisdom의 다국어화는 원문 번역이 아니라 언어권별 고민 지도를 만드는 방식으로 진행한다.

## Source Locale vs Output Locale

- `source locale`은 고민, 논쟁, 검색어, 표현 패턴이 발견된 언어권이다.
- `output locale`은 사용자가 실제로 읽는 페이지 언어다.
- 일본어권에서 발견한 고민도 먼저 canonical node에 매핑한 뒤 한국어/영어 페이지에 반영할 수 있다.
- 언어권별 소스 상태는 `data/source_locale_registry.json`에서 관리하고 `npm run source-locales:check`로 검증한다.
- 자세한 전략은 `docs/multilingual-source-strategy.md`를 기준으로 본다.

## 원칙

- 한국어 페이지를 그대로 번역하지 않는다.
- 각 언어권의 검색어, 커뮤니티 표현, 문화적 쟁점을 별도로 수집한다.
- 언어권별 표현은 기존 canonical node에 먼저 붙이고, 설명이 안 되는 반복 묶음만 새 노드로 승격한다.
- 출처는 언어권과 무관하게 원전, 공식 기관, 연구 자료를 우선한다.
- 민감한 논쟁은 결론을 현지화하지 않고 쟁점 구조, 법·제도 맥락, 피해 가능성을 다시 정리한다.

## 라우팅

장기 라우팅은 다음 구조를 기준으로 한다.

| Locale | Prefix | 상태 | 예시 |
| --- | --- | --- | --- |
| `ko-KR` | 없음 | primary | `/thought/good-life` |
| `en-US` | `/en` | seed | `/en/thought/good-life` |
| `ja-JP` | `/ja` | planned | `/ja/thought/good-life` |

초기에는 `/en`을 `noindex` 프로토타입으로 연다. 모든 canonical node는 영어 route를 가지되, 검색 노출은 영어 번역 품질이 충분해진 뒤에 켠다. 공개 전까지는 영어권 seed를 sitemap에 넣지 않는다.

## SEO

- 공개 locale마다 `hreflang`을 제공한다.
- canonical URL은 해당 언어 페이지 자신을 가리킨다.
- 같은 노드라도 title, description, user door 문장은 언어권별로 새로 작성한다.
- 검색어 하나마다 얇은 페이지를 만들지 않는 원칙은 모든 locale에 동일하게 적용한다.

## 데이터

- `data/global_phrase_seeds.json`: 영어권 등 해외권 검색 의도 seed.
- `lib/locales.js`: 지원 locale, prefix, hreflang 기본값.
- 기존 `data/node-seeds.json`: 한국어 canonical node의 기준 원장.
- `npm run english:sync`: 새 canonical node에 대한 영어 seed를 자동 생성한다.
- `npm run english:check`: 한국어 canonical node와 영어 seed의 1:1 route coverage를 검사한다.
- `npm run english:collect`: 영어권 자동완성 검색어와 Reddit 반복 패턴을 수집해 `data/english_phrase_raw.json`, `data/english_phrase_candidates.md`에 저장한다.
- `npm run english:promote`: 수집된 영어 후보 중 노이즈를 거른 표현을 `global_phrase_seeds.json`의 search phrase와 user door로 승격한다.
- `npm run english:curate-priority`: 공개 우선순위가 높은 영어 노드에 사람이 읽을 수 있는 page lead와 카드 요약을 붙이고 `curated-seed`로 올린다.
- `npm run english:curate-remaining`: 남은 영어 노드에 템플릿 기반 page lead, user door, 카드 요약을 붙이고 `readable-seed`로 올린다.

## 영어 원문 수집

영어권 수집은 한국어 번역을 보강하는 일이 아니라, 영어권에서 원래 쓰이는 고민·논쟁 표현을 찾는 일이다.

- Google autocomplete는 영어 검색 표현 후보로 저장한다.
- Reddit은 개인 글 제목이나 본문을 저장하지 않는다. `how do I`, `should I`, `is it normal`, `does anyone else` 같은 반복 질문 패턴 카운트만 저장한다.
- 수집 결과는 바로 공개 콘텐츠가 아니다. 먼저 `global_phrase_seeds.json`의 search phrase와 user door를 다듬는 후보로만 쓴다.
- 특정 개인, 사건, 사적인 맥락이 강한 표현은 일반화하거나 버린다.
- 영어권 seed가 충분히 축적되면 `translationStatus`를 `draft`에서 `phrase-enriched`로 올린다.
- 모든 상세 페이지가 읽을 수 있는 최소 본문을 갖추면 `readable-seed`로 둔다.
- 사람이 제목, user door, 출처 맥락까지 직접 다듬은 핵심 묶음은 `curated-seed`로 둔다.

## 새 콘텐츠 규칙

앞으로 새 고민, 생각, 논쟁을 추가하면 영어 seed도 반드시 같이 있어야 한다.

1. 한국어 콘텐츠를 추가한다.
2. `npm run content:organize`를 실행한다. 이 과정에서 `english:sync`와 `english:check`가 함께 돈다.
3. 자동 생성된 영어 seed는 `translationStatus: "draft"`로 시작한다.
4. `npm run english:collect`로 영어권 원문 검색 표현을 수집한다.
5. `npm run english:promote`로 search phrase와 user door 후보를 승격한다.
6. 우선 공개할 묶음은 `npm run english:curate-priority`로 page lead와 카드별 영어 요약을 붙인다.
7. 나머지 묶음은 `npm run english:curate-remaining`으로 최소 읽기 가능한 본문을 만든다.
8. 사람이 제목, 설명, 출처 맥락을 최종 검토한 묶음만 `curated-seed`로 올린다.
9. 영어 페이지가 충분히 읽을 만해지기 전까지는 `noindex`를 유지한다.

## 영어권 1차 타겟

영어권은 철학적 질문과 실생활 고민이 검색어로 강하게 연결되는 영역부터 시작한다.

- `good-life`: what is a good life, how should I live
- `happiness`: what is happiness, does money buy happiness
- `relationships/people-pleasing`: people pleasing, approval seeking
- `relationships/cant-say-no`: how to say no, setting boundaries
- `self-esteem/comparing`: comparing myself to others, social comparison anxiety
- `self-esteem/falling-behind`: feeling behind in life, life timeline anxiety
- `meaning/meaningless`: existential crisis, life feels meaningless
- `debate/ai-replacement`: will AI replace jobs, future of work with AI

## 공개 기준

영어 페이지를 열기 전 최소 기준은 다음과 같다.

- locale seed가 30개 이상이어야 한다.
- 공개할 첫 묶음은 10개 이하로 좁힌다.
- 각 페이지는 영어 제목, 영어 user doors, 영어 meta description을 별도 작성한다.
- 카드의 핵심 관점은 기존 검증 출처를 유지하되, 인용문은 영어 원문 출처와 충돌하지 않게 다시 확인한다.
