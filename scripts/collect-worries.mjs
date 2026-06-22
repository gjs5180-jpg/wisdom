// ============================================================================
// collect-worries.mjs — 사람들이 실제로 검색하는 '고민·논쟁 입구' 수집기
// ----------------------------------------------------------------------------
// 구글 + 네이버 자동완성 엔드포인트(브라우저가 치는 공개 API)를 씨앗어에 대고
// BFS 로 펼쳐, 사람들이 실제로 붙여 검색하는 말을 모은다.
//   - 의존성 0 (Node 18+ 의 global fetch 사용)
//   - 예의: 요청마다 딜레이, 모더레이트한 양, User-Agent 명시
//   - 결과: data/worries_raw.json (전체) + data/worries_by_category.md (사람용)
//
// 실행:  node scripts/collect-worries.mjs
// ============================================================================

import { writeFileSync, mkdirSync } from "node:fs";

const UA = "Mozilla/5.0 (compatible; wisdom-research/0.1; worry-taxonomy)";
const DELAY_MS = Number(process.env.COLLECT_DELAY_MS ?? 120); // 예의상 요청 간 간격
const EXPAND_TOP = Number(process.env.COLLECT_EXPAND_TOP ?? 1); // 각 씨앗 결과 상위 N개를 한 번 더 펼침
const MAX_TERMS_PER_CATEGORY = Number(process.env.COLLECT_MAX_TERMS_PER_CATEGORY ?? 45);
const REQUEST_TIMEOUT_MS = Number(process.env.COLLECT_TIMEOUT_MS ?? 7000);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ── 씨앗어 ───────────────────────────────────────────────────────────────────
// 고민 카테고리(감정 상황) + 논쟁/딜레마 축(가치 충돌). 둘 다 같은 카드 포맷에 쓰임.
const BASE_SEEDS = {
  "연애/짝사랑": [
    "짝사랑", "썸", "고백", "연애 불안", "상대 마음", "연애 조급",
    "권태기", "연애 현타", "연애 가치관", "회피형 연애", "불안형 연애",
    "나를 좋아하는지", "연락 텀", "읽씹", "잠수",
  ],
  "이별/실연": [
    "이별", "이별 후", "헤어진 후", "재회", "미련", "집착", "전 애인",
    "전남친", "전여친", "이별 후 연락", "이별 후유증", "마음정리",
    "환승이별", "잠수이별", "붙잡고 싶다",
  ],
  자존감: [
    "자존감", "자존감 낮을 때", "열등감", "비교", "자기혐오", "나를 싫어",
    "자격지심", "인정욕구", "칭찬 부담", "자기비하", "자존감 연애",
    "남과 비교", "SNS 비교", "나만 뒤처짐",
  ],
  인간관계: [
    "인간관계", "친구 멀어짐", "거절 못", "외로움", "상처되는 말", "손절",
    "친구 손절", "관계 정리", "착한 사람", "눈치 보는 성격", "사람 만나는 게 힘들",
    "말실수", "친구 없음", "혼자가 편한데 외로움", "인간관계 현타",
  ],
  "직장/커리어": [
    "번아웃", "이직", "퇴사 고민", "직장 스트레스", "일 하기 싫", "인정 못받",
    "상사 스트레스", "직장 인간관계", "회사 가기 싫", "커리어 고민",
    "성과 압박", "회의감", "워라밸", "직장 우울", "일 못하는 것 같",
  ],
  "삶의 의미": [
    "삶의 의미", "공허함", "무기력", "현타", "인생 허무", "죽음 두려움",
    "아무것도 하기 싫", "뭘 원하는지", "사는 이유", "인생 노잼",
    "실존적 불안", "허무주의", "목표 없음", "방황", "내가 뭘 하고 싶은지",
  ],
  가족: [
    "부모님 갈등", "가족 스트레스", "독립하고 싶", "형제 비교", "부모님 잔소리",
    "부모님 기대", "부모님 간섭", "가족 손절", "효도 부담", "명절 스트레스",
    "엄마랑 안 맞", "아빠랑 갈등",
  ],
  "돈/미래": [
    "돈 걱정", "미래 불안", "노후 불안", "월급", "비교 소비",
    "돈 모으기 힘들", "집 살 수 있을까", "가난 불안", "취업 불안",
    "경제적 자유", "돈 때문에 연애", "돈 때문에 결혼", "미래가 막막",
  ],
  "진로/결정": [
    "진로 고민", "적성 모를", "뭐하고 살지", "결혼 고민", "비혼", "이직 결정",
    "전공 후회", "대학원 고민", "창업 고민", "꿈 포기", "선택장애",
    "후회 없는 선택",
  ],
  "건강/몸": [
    "불면증", "건강 염려", "외모 콤플렉스", "다이어트 강박", "몸이 안 좋",
    "나이 드는 것", "노화 불안", "몸매 스트레스", "탈모 스트레스",
    "피부 스트레스", "운동 강박", "아픈데 불안",
  ],
  "공부/시험": [
    "시험 불안", "공부 안되", "수험생 슬럼프", "집중 안되", "성적 스트레스",
    "공부 하기 싫", "시험 망함", "재수 고민", "수능 불안", "면접 불안",
    "자격증 공부", "공부 현타",
  ],
  "디지털/SNS": [
    "SNS 비교", "인스타 현타", "카톡 답장", "읽씹", "알림 불안",
    "스마트폰 중독", "유튜브 중독", "도파민 중독", "온라인 인간관계",
    "댓글 상처",
  ],
  "논쟁/딜레마": [
    "결혼 꼭 해야", "비혼 후회", "꿈 포기", "돈 때문에 꿈", "착하게 살면 안",
    "선의의 거짓말", "복수", "손절 인간관계", "효도 강요", "참는 게 이기는",
    "정규직 계약직", "내집마련 전세", "혼전동거", "아이 꼭 낳아야",
    "사랑과 돈", "친구에게 솔직히 말하기", "회사에 충성", "퇴사 책임감",
    "안락사", "사형제", "낙태", "동물실험", "노키즈존", "촉법소년",
    "능력주의", "기본소득", "정년연장", "재택근무", "AI 대체",
    "AI 그림", "채식", "비건", "환경 보호", "캔슬 컬처", "학교 체벌",
    "정직해야 하나", "용서해야 하나", "부모 부양", "돈이 행복",
  ],
};

const WORRY_SUFFIXES = [
  " 고민",
  " 어떡해",
  " 어떻게",
  " 이유",
  " 극복",
  " 해결",
  " 하는 법",
  " 대처법",
];

const DEBATE_SUFFIXES = [
  " 찬반",
  " 토론",
  " 해야 하나",
  " 해도 되나",
  " 맞나요",
  " 문제",
  " 윤리",
  " 딜레마",
];

const PLATFORM_SUFFIXES = [" 디시", " 더쿠", " 블라인드"];

function seedTerms(category, seeds) {
  const isDebate = category.includes("논쟁") || category.includes("딜레마");
  const suffixes = isDebate ? DEBATE_SUFFIXES : WORRY_SUFFIXES;
  const limit = isDebate ? Math.max(MAX_TERMS_PER_CATEGORY, 90) : MAX_TERMS_PER_CATEGORY;
  const terms = [];

  // 모든 씨앗어의 기본형을 먼저 넣어야 뒤쪽 주제가 상한 때문에 잘리지 않는다.
  for (const seed of seeds) {
    terms.push(seed);
  }
  for (const suffix of suffixes) {
    for (const seed of seeds) terms.push(`${seed}${suffix}`);
  }
  for (const suffix of PLATFORM_SUFFIXES) {
    for (const seed of seeds) terms.push(`${seed}${suffix}`);
  }

  return [...new Set(terms)].slice(0, limit);
}

const stripTags = (s) => String(s).replace(/<[^>]*>/g, "").trim();

async function googleSuggest(q) {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=ko&q=${encodeURIComponent(
    q
  )}`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const text = await res.text();
    const data = JSON.parse(text); // [query, [suggestions], ...]
    return Array.isArray(data?.[1]) ? data[1].map(stripTags) : [];
  } catch {
    return [];
  }
}

async function naverSuggest(q) {
  const url = `https://ac.search.naver.com/nx/ac?q=${encodeURIComponent(
    q
  )}&st=100&r_format=json&r_enc=UTF-8&q_enc=UTF-8&frm=nv&ans=2`;
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    const text = await res.text();
    const data = JSON.parse(text);
    const out = [];
    for (const group of data?.items ?? []) {
      for (const item of group ?? []) {
        if (Array.isArray(item) && typeof item[0] === "string")
          out.push(stripTags(item[0]));
        else if (typeof item === "string") out.push(stripTags(item));
      }
    }
    return out;
  } catch {
    return [];
  }
}

// phrase -> { category, sources:Set, seeds:Set }
const collected = new Map();
function add(phrase, category, source, seed) {
  const p = phrase.trim();
  if (!p || p.length < 2) return;
  if (!collected.has(p))
    collected.set(p, { category, sources: new Set(), seeds: new Set() });
  const rec = collected.get(p);
  rec.sources.add(source);
  rec.seeds.add(seed);
}

async function harvest(term, category, seed) {
  const [g, n] = await Promise.all([googleSuggest(term), naverSuggest(term)]);
  g.forEach((s) => add(s, category, "google", seed));
  n.forEach((s) => add(s, category, "naver", seed));
  await sleep(DELAY_MS);
  return [...new Set([...g, ...n])];
}

async function main() {
  let reqCount = 0;
  for (const [category, baseSeeds] of Object.entries(BASE_SEEDS)) {
    const terms = seedTerms(category, baseSeeds);
    process.stdout.write(
      `\n[${category}] 씨앗 ${baseSeeds.length}개 → 검색 변형 ${terms.length}개\n`
    );
    for (const term of terms) {
      const sourceSeed = baseSeeds.find((seed) => term.startsWith(seed)) || term;
      const first = await harvest(term, category, sourceSeed);
      reqCount++;
      process.stdout.write(
        `  "${term}" → ${first.length}건 (누적 ${collected.size})\n`
      );
      for (const child of first.slice(0, EXPAND_TOP)) {
        if (child === term) continue;
        await harvest(child, category, sourceSeed);
        reqCount++;
      }
    }
  }

  mkdirSync("data", { recursive: true });

  const byCat = {};
  const rows = [];
  for (const [phrase, rec] of collected) {
    (byCat[rec.category] ??= []).push(phrase);
    rows.push({
      phrase,
      category: rec.category,
      sources: [...rec.sources],
      seeds: [...rec.seeds],
    });
  }
  for (const k of Object.keys(byCat)) byCat[k].sort((a, b) => a.localeCompare(b, "ko"));

  writeFileSync(
    "data/worries_raw.json",
    JSON.stringify({ collectedAt: new Date().toISOString(), total: rows.length, rows }, null, 2)
  );

  let md = `# 수집된 고민·논쟁 입구 (자동완성 BFS)\n\n총 ${rows.length}개 · 요청 ${reqCount}회 · 구글+네이버\n\n`;
  md += `- 카테고리별 검색 변형 상한: ${MAX_TERMS_PER_CATEGORY}개\n`;
  md += `- 2차 확장: 자동완성 상위 ${EXPAND_TOP}개\n`;
  md += `- 요청 간 딜레이: ${DELAY_MS}ms\n\n`;
  for (const [cat, list] of Object.entries(byCat)) {
    md += `## ${cat} (${list.length})\n\n`;
    md += list.map((p) => `- ${p}`).join("\n");
    md += "\n\n";
  }
  writeFileSync("data/worries_by_category.md", md);

  console.log("\n===== 수집 완료 =====");
  console.log(`총 고유 입구: ${rows.length}개 (요청 ${reqCount}회)`);
  for (const [cat, list] of Object.entries(byCat))
    console.log(`  ${cat}: ${list.length}개`);
  console.log("\n파일: data/worries_raw.json, data/worries_by_category.md");
}

main();
