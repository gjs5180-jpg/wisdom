# 수집 확장 기록

생성일: 2026-06-19

## 요약

고민/논쟁 콘텐츠를 먼저 많이 모으기 위해 자동완성 수집기를 확장했다. 원문 게시글은 긁지 않고, 구글/네이버 자동완성에 노출되는 검색 입구 표현만 저장한다.

| 항목 | 이전 | 현재 |
| --- | ---: | ---: |
| raw 검색 입구 | 1,398 | 2,604 |
| 정제 검색 입구 | 705 | 1,676 |
| mapped phrases | 258 | 749 |
| unmapped phrases | 447 | 927 |
| planned nodes | 0 | 20 |

## 추가된 수집 축

- 기존 고민 축: 연애, 이별, 자존감, 인간관계, 직장, 삶의 의미.
- 확장 고민 축: 가족, 돈/미래, 공부/시험, 디지털/SNS.
- 확장 논쟁 축: 안락사, 사형제, 낙태, 동물실험, 노키즈존, 촉법소년, 능력주의, 기본소득, AI 대체, AI 그림, 혼전동거, 채식/비건, 부모 부양.
- 각 씨앗어에 `고민`, `어떡해`, `극복`, `하는 법`, `디시`, `더쿠`, `블라인드` 같은 검색 변형을 붙여 실제 입구 표현을 넓혔다.

## 새 planned 후보

우선순위는 검색 매칭 수와 evergreen성을 함께 본다.

1. `study/cant-study` — 공부가 안 될 때: 75개 매칭
2. `family/parent-conflict` — 부모님과 갈등이 심할 때: 37개 매칭
3. `juvenile-offenders` — 촉법소년 처벌 강화 논쟁: 36개 매칭
4. `money/future-anxiety` — 돈과 미래가 불안할 때: 32개 매칭
5. `love/attachment-anxiety` — 불안형 연애를 할 때: 30개 매칭
6. `death-penalty` — 사형제 유지/폐지 논쟁: 28개 매칭
7. `breakup/ghosting` — 잠수이별과 읽씹: 26개 매칭
8. `animal-testing` — 동물실험 논쟁: 26개 매칭
9. `family/independence` — 독립하고 싶은데 망설여질 때: 21개 매칭
10. `no-kids-zone` — 노키즈존 논쟁: 20개 매칭

## 운영 원칙

- `data/worries_raw.json`: 원본 자동완성 입구 저장소.
- `data/worries_clean.md`: 사람이 볼 정제 목록.
- `data/node-seeds.json`: canonical node 원장. 반복성이 충분한 군집만 planned node로 승격한다.
- `data/content_backlog.md`: 다음 작업 순서. `planned`는 아직 공개 페이지가 아니라 콘텐츠 후보 상태다.
- 게시글 본문, 닉네임, 사연 원문은 저장하지 않는다.

## 다음 작업

1. planned 상위 후보 중 고민형 3개, 논쟁형 3개를 골라 콘텐츠 초안을 만든다.
2. 새 카테고리(`family`, `money`, `study`, `digital`)를 앱 내비게이션에 노출할지 결정한다.
3. `unmapped_candidates.md`에서 10개 이상 반복되는 군집을 추가 planned node로 승격한다.
