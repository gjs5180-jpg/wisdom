# 협업 가이드

이 문서는 친구가 저장소를 받아서 바로 같이 작업할 수 있게 하기 위한 최소 규칙입니다.

## 역할 나누기

초기에는 역할을 너무 복잡하게 나누지 않습니다. 대신 작업 단위를 작게 나눕니다.

- 콘텐츠 작성: 새 카드 초안, 관련 카드 연결, 태그 보강
- 출처 검증: 인용, 원문, 공식 자료, 연구 근거 확인
- UX 개선: 홈, 검색, 상세 페이지, 모바일 가독성
- 데이터 정리: 수집 표현, 언어권 신호, 후보 분류

## 작업 시작

```bash
git pull
npm install
npm run dev
```

작업 전에는 항상 `git pull`을 먼저 합니다.

## 브랜치 이름

브랜치는 작업 목적이 보이게 만듭니다.

```bash
git checkout -b content/exam-anxiety
git checkout -b ux/home-search
git checkout -b docs/content-guide
git checkout -b source/japanese-signals
```

## 커밋 기준

한 커밋에는 한 가지 목적만 담습니다.

좋은 예:

```bash
git commit -m "Add related cards to detail pages"
git commit -m "Document content card checklist"
git commit -m "Improve home search grouping"
```

피할 예:

```bash
git commit -m "fix"
git commit -m "update"
git commit -m "many things"
```

## Pull Request 체크

PR을 만들기 전에 아래를 확인합니다.

- `npm run lint` 통과
- `npm run content:quality` 실행 후 리포트 확인
- `npm run build:clean` 통과
- 새 카드라면 출처 상태가 명확함
- 사용자가 보는 문구가 너무 개발자 설명처럼 보이지 않음
- 모바일에서 긴 제목이나 버튼이 터지지 않음

## 충돌이 났을 때

콘텐츠 파일은 여러 사람이 동시에 만지면 충돌이 나기 쉽습니다.

- 같은 카드 파일 또는 같은 `lib/content.js` 영역을 동시에 만지지 않습니다.
- 큰 작업 전에는 어떤 영역을 맡을지 먼저 말합니다.
- 충돌이 나면 임의로 지우지 말고, 어떤 카드/섹션이 겹쳤는지 확인합니다.

## 배포 흐름

`master` 또는 `main`에 합쳐지면 GitHub Actions가 자동으로 배포합니다.

배포 주소:

```text
https://gjs5180-jpg.github.io/wisdom/
```

배포가 실패하면 GitHub `Actions` 탭에서 실패 로그를 봅니다. 대개는 lint, content quality, build, 정적 export 문제입니다.
