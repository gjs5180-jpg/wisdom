# 위즈덤

위즈덤은 사람들이 실제로 검색하고 고민하는 주제를 모아, 철학, 연구, 제도, 실천 관점으로 다시 정리하는 관점 지도입니다.

공개 사이트: https://gjs5180-jpg.github.io/wisdom/

## 지금 목표

- 고민, 생각, 논쟁을 하나의 카드 단위로 정리한다.
- 한국어, 영어, 일본어, 중국어, 스페인어, 프랑스어, 독일어권의 검색 표현을 수집 신호로 사용한다.
- 원문 언어와 출력 언어를 분리한다. 여러 언어권에서 모은 재료를 하나의 canonical node에 합치고, 페이지는 언어별로 다시 작성한다.
- 출처가 불확실한 인용이나 그럴듯한 말을 채우지 않는다.

## 빠른 실행

```bash
git clone https://github.com/gjs5180-jpg/wisdom.git
cd wisdom
npm install
npm run dev
```

브라우저에서 `http://localhost:3000`을 열면 됩니다.

## 자주 쓰는 명령

```bash
npm run dev
npm run lint
npm run build:clean
npm run english:check
npm run source-signals:check
npm run source-insights:check
```

GitHub Pages 정적 배포 검증:

```bash
$env:GITHUB_PAGES='true'
$env:NEXT_PUBLIC_BASE_PATH='/wisdom'
$env:NEXT_PUBLIC_SITE_URL='https://gjs5180-jpg.github.io/wisdom/'
npm run build:clean
```

## 프로젝트 구조

- `app/`: 페이지 라우트. 홈, 카테고리, 상세, 태그, 인물, 영어 페이지가 있습니다.
- `components/`: 검색, 저장, 공유, 관련 탐색, 출처 신호 등 화면 컴포넌트입니다.
- `lib/content.js`: 현재 가장 중요한 콘텐츠 데이터 모델입니다.
- `lib/nodes-generated.js`, `lib/nodes-expanded.js`: 생성/확장된 카드 데이터입니다.
- `lib/source-*`: 언어권 수집 신호, 인사이트, 출처 메타데이터입니다.
- `data/`: 수집 원본, 후보, 분류 결과, 언어권별 phrase seed입니다.
- `docs/`: 작업 방식, 검증 기준, 수집 전략 문서입니다.
- `.github/workflows/deploy-pages.yml`: GitHub Pages 자동 배포입니다.

## 같이 작업하는 법

1. 항상 작업 전 최신 코드를 받습니다.

```bash
git pull
```

2. 기능별 브랜치를 만듭니다.

```bash
git checkout -b feature/card-detail-flow
```

3. 수정 후 검증합니다.

```bash
npm run lint
npm run build:clean
```

4. 커밋하고 푸시합니다.

```bash
git add .
git commit -m "Improve card detail flow"
git push -u origin feature/card-detail-flow
```

5. GitHub에서 Pull Request를 만들고 합칩니다.

자세한 협업 규칙은 [docs/collaboration-guide.md](docs/collaboration-guide.md)를 보세요.

## 콘텐츠 추가 원칙

좋은 카드는 단순 요약이 아니라 사용자가 자기 상황을 다시 볼 수 있게 돕는 구조여야 합니다.

- 실제로 검색할 만한 문장으로 시작한다.
- 감정, 상황, 핵심 질문을 분리한다.
- 여러 관점을 나란히 놓되, 억지 결론을 내리지 않는다.
- 출처 확인이 끝난 것과 확인 중인 것을 구분한다.
- 한국어 카드를 추가하면 영어 출력도 함께 고려한다.
- 새로운 소스 언어에서 들어온 표현은 바로 번역하지 않고 canonical node에 먼저 연결한다.

콘텐츠 작성 기준은 [docs/content-authoring-guide.md](docs/content-authoring-guide.md)를 보세요.

## 배포

`master` 또는 `main` 브랜치에 푸시하면 GitHub Actions가 자동으로 빌드하고 GitHub Pages에 배포합니다.

배포 주소:

```text
https://gjs5180-jpg.github.io/wisdom/
```

Actions 상태는 GitHub 저장소의 `Actions` 탭에서 확인합니다.
