// ============================================================================
// build-content-backlog.mjs — collected phrases -> canonical nodes -> quality queue
// ----------------------------------------------------------------------------
// 네트워크 없이 수집/정제된 검색어를 canonical node에 매핑하고, 현재 앱 콘텐츠의
// 수요/검증/구조 점수를 계산한다.
//
// 입력:
//   - data/node-seeds.json
//   - data/worries_raw.json
//   - data/worries_clean.md
//   - lib/content.js
//
// 출력:
//   - data/content_backlog.md
//   - data/content_inventory.json
//   - data/phrase_map.json
//   - data/unmapped_candidates.md
// ============================================================================

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import {
  getDebateGroup,
  getThoughtContent,
  getThoughtGroup,
  getWorryGroup,
  getContent,
  getDebateContent,
  isPublishableContent,
  verifiedCardCount,
} from "../lib/content.js";

const seeds = JSON.parse(readFileSync("data/node-seeds.json", "utf8"));
const raw = existsSync("data/worries_raw.json")
  ? JSON.parse(readFileSync("data/worries_raw.json", "utf8"))
  : { rows: [] };

const norm = (value) => String(value || "").toLowerCase().replace(/\s+/g, "");

function parseCleanRows() {
  if (!existsSync("data/worries_clean.md")) return null;

  const rows = [];
  let category = null;
  for (const line of readFileSync("data/worries_clean.md", "utf8").split("\n")) {
    const heading = line.match(/^##\s+(.+?)\s+\(\d+\)/);
    if (heading) {
      category = heading[1];
      continue;
    }
    if (line.startsWith("- ") && category) {
      rows.push({ phrase: line.slice(2).trim(), category });
    }
  }
  return rows;
}

const cleanRows = parseCleanRows();
const rawByPhrase = new Map(raw.rows.map((row) => [row.phrase, row]));
const rows = cleanRows
  ? cleanRows.map((row) => ({ ...rawByPhrase.get(row.phrase), ...row }))
  : raw.rows;

const PLATFORM_TOKENS = [
  "디시",
  "더쿠",
  "블라인드",
  "인스티즈",
  "82cook",
  "오르비",
  "클리앙",
  "네이트판",
];

const PLATFORM_PATTERN = new RegExp(PLATFORM_TOKENS.join("|"), "i");
const LOW_SIGNAL_PATTERN =
  /가사|歌詞|영어\s*로|영어로|비슷한\s*말|대체어|키캡|팝업|티셔츠|아이스티|베이커리|화장품|쿠키|젤리|만두|빵|뷔페|레더|가죽|문답|100가지|실업급여|이직확인서|이직로그|고민중독|25년째|방황하는 칼날|대표님과 결혼했습니다|리바이|애니|ova|다시\s*보기|번역|풀\s*컬러|랜덤|브랜뉴|mbti|직업\s*추천|가능한\s*직업|알바|채용/i;

function isSleepDreamPhrase(phrase) {
  return /꿈/.test(phrase) && !/(꿈.*포기|포기.*꿈|꿈.*현실|현실.*꿈|꿈을.*잃|꿈이.*없)/.test(phrase);
}

function getNodeContent(seed) {
  if (seed.axis === "debate") return getDebateContent(seed.slot);
  if (seed.axis === "thought") return getThoughtContent(seed.slot);
  const [category, worry] = seed.slot.split("/");
  return getContent(category, worry);
}

function groupFor(seed) {
  if (seed.axis === "debate") return getDebateGroup(seed.slot)?.title || null;
  if (seed.axis === "thought") return getThoughtGroup(seed.slot)?.title || null;
  const [category] = seed.slot.split("/");
  return getWorryGroup(category)?.title || null;
}

function allMatchedRows(seed) {
  const intents = (seed.intents || []).map(norm).filter(Boolean);
  const needles = intents.filter((needle) => needle.length >= 2);

  return rows.filter((row) => {
    const phrase = norm(row.phrase);
    return needles.some((needle) => phrase.includes(needle));
  });
}

function statusFor(content) {
  if (isPublishableContent(content)) return "ready";
  if (!content.placeholder && content.cards?.length > 0) return "draft";
  return "planned";
}

function uniquePhrases(matches) {
  return [...new Map(matches.map((row) => [row.phrase, row])).values()];
}

function scoreNode(node) {
  const content = node.content;
  const cards = content.cards || [];
  const verified = node.verified;
  const stances = new Set(cards.map((card) => card.stance).filter(Boolean));
  const actionCount = (content.actions || content.reflect || []).length;
  const demandScore = Math.min(30, node.allMatches.length * 2);
  const verificationScore =
    verified >= 3 ? 30 : verified >= 2 ? 24 : verified === 1 ? 10 : 0;
  const structureScore =
    (content.placeholder ? 0 : 6) +
    ((content.emotion || content.question) ? 6 : 0) +
    ((content.doors || []).length >= 4 ? 8 : 0) +
    (cards.length >= 3 ? 8 : cards.length >= 2 ? 5 : 0) +
    (stances.size >= 2 ? 6 : 0) +
    (actionCount >= 3 ? 6 : actionCount > 0 ? 3 : 0);

  return {
    total: demandScore + verificationScore + structureScore,
    demand: demandScore,
    verification: verificationScore,
    structure: structureScore,
  };
}

function qualityFlags(node) {
  const flags = [];
  const content = node.content;
  const cards = content.cards || [];
  const actionCount = (content.actions || content.reflect || []).length;
  const stances = new Set(cards.map((card) => card.stance).filter(Boolean));

  if (node.allMatches.length === 0) flags.push("검색어 매칭 보강");
  if (node.verified < 2) flags.push("검증 카드 부족");
  if ((content.doors || []).length < 4) flags.push("사용자 입구 문장 부족");
  if (cards.length < 3) flags.push("관점 카드 부족");
  if (stances.size < 2) flags.push("관점 충돌 약함");
  if (actionCount < 3) flags.push("행동/성찰 지침 부족");
  if (cards.some((card) => !card.verified)) flags.push("출처 확인 중 카드 있음");

  return flags;
}

function nextAction(node) {
  const flags = qualityFlags(node);
  if (node.status === "ready" && flags.length === 0) {
    return "공개 가능: 내부링크/요약/OG를 다듬기";
  }
  if (node.totalCards === 0) {
    return "콘텐츠 초안 생성: 감정 정의, doors, 카드 후보 작성";
  }
  if (node.verified < 2) {
    return `검증 보강: verified 카드 ${node.verified}/${node.totalCards} -> 최소 2개 이상`;
  }
  return `품질 보강: ${flags.slice(0, 2).join(", ")}`;
}

const seedBySlot = new Map(seeds.nodes.map((seed) => [seed.slot, seed]));

const SOURCE_CATEGORY_FALLBACK = {
  "연애/짝사랑": "love/cant-read-them",
  "이별/실연": "breakup/right-after",
  자존감: "self-esteem/comparing",
  인간관계: "relationships/relationship-burnout",
  "직장/커리어": "work/work-depression",
  "삶의 의미": "meaning/emptiness",
  가족: "family/parent-conflict",
  "돈/미래": "money/future-anxiety",
  "진로/결정": "career/dream-reality",
  "건강/몸": "body/body-anxiety",
  "공부/시험": "study/exam-anxiety",
  "디지털/SNS": "digital/dopamine-addiction",
  "논쟁/딜레마": "white-lie",
};

const SOURCE_CATEGORY_TO_SLUG = {
  "연애/짝사랑": "love",
  "이별/실연": "breakup",
  자존감: "self-esteem",
  인간관계: "relationships",
  "직장/커리어": "work",
  "삶의 의미": "meaning",
  가족: "family",
  "돈/미래": "money",
  "진로/결정": "career",
  "건강/몸": "body",
  "공부/시험": "study",
  "디지털/SNS": "digital",
};

const CLASSIFICATION_RULES = [
  [/캔슬\s*컬처|cancel\s*culture/i, "cancel-culture"],
  [/학교.*체벌|체벌.*학교/, "school-corporal-punishment"],
  [/착하게.*(손해|안되는|안\s*되는)|착하면.*손해|nice\s*(people|guys)\s*finish\s*last/i, "nice-people-finish-last"],
  [/재택근무/, "remote-work"],
  [/정년연장|65세정년/, "retirement-age"],
  [/정규직.*계약직|계약직.*정규직|비정규직/, "employment-contract"],
  [/강아지.*안락사|고양이.*안락사|반려동물.*안락사|동물.*안락사/, "pet-euthanasia"],
  [/아이.*낳|아이꼭|출산|무자녀|비혼출산/, "childfree"],
  [/혼전동거|동거/, "cohabitation"],
  [/비혼|결혼.*해야|결혼은|결혼\s*꼭/, "marriage"],
  [/효도|부모부양|부모.*부양/, "parent-support"],
  [/낙태|임신중지|임신.*중지/, "abortion"],
  [/사형/, "death-penalty"],
  [/촉법|소년법/, "juvenile-offenders"],
  [/동물실험/, "animal-testing"],
  [/노키즈존|노키즈/, "no-kids-zone"],
  [/능력주의/, "meritocracy"],
  [/기본소득/, "basic-income"],
  [/채식|비건|동물권/, "vegetarianism"],
  [/ai.*그림|ai.*예술|인공지능.*예술|인공지능.*그림/, "ai-art"],
  [/ai|인공지능|자동화/, "ai-replacement"],
  [/선택장애|결정장애/, "career/decision-paralysis"],
  [/후회없는선택|후회.*없는.*선택/, "career/regret-free-choice"],
  [/대학원|전공|취업.*불안|진로/, "career/dream-reality"],
  [/연애.*가치관|가치관.*연애/, "love/relationship-values"],
  [/권태기|연애현타|사랑.*식|마음.*식/, "love/relationship-boredom"],
  [/전남친.*연락|전여친.*연락|전애인.*연락|전\s*애인.*연락/, "breakup/ex-contact"],
  [/카톡|답장|연락텀|연락.*늦|읽씹.*심리/, "love/reply-anxiety"],
  [/불안형|회피형|애착/, "love/attachment-anxiety"],
  [/고백/, "love/cant-confess"],
  [/짝사랑.*포기|사랑.*포기|마음.*접/, "love/should-give-up"],
  [/재회/, "breakup/reunion"],
  [/잠수이별|잠수|읽씹|안읽씹|연락무시/, "breakup/ghosting"],
  [/환승이별/, "breakup/right-after"],
  [/미련|마음정리|잊는법|잊는 법/, "breakup/lingering"],
  [/거절.*못|거절\s*을\s*못|거절\s*을\s*잘\s*못/, "relationships/cant-say-no"],
  [/눈치|착한사람|착한 사람/, "relationships/people-pleasing"],
  [/인간관계.*현타|인간관계.*손절|다손절|전부손절|관계.*리셋/, "relationships/relationship-burnout"],
  [/친구.*멀|친구.*손절|친구.*관계/, "relationships/drifting-friends"],
  [/말실수/, "relationships/regret-words"],
  [/상처.*말|말.*상처/, "relationships/hurtful-words"],
  [/혼자.*외로|고독|외로움/, "relationships/lonely-but-prefer-alone"],
  [/직장.*인간관계|회사.*인간관계/, "work/workplace-relationships"],
  [/직장.*우울|출근.*우울|회사.*우울/, "work/work-depression"],
  [/일.*못|일머리|부족.*회사|회사.*부족/, "work/not-good-enough"],
  [/회의감/, "work/work-skepticism"],
  [/상사/, "work/boss-stress"],
  [/퇴사|회사.*그만|버텨야/, "work/quit-or-stay"],
  [/이직|전직|신입.*퇴사/, "work/job-change"],
  [/번아웃|소진/, "work/burnout"],
  [/회사.*가기.*싫|일.*하기.*싫/, "work/dont-want-to"],
  [/공허|노잼|허함|허한/, "meaning/emptiness"],
  [/무기력|아무것도.*싫/, "meaning/no-motivation"],
  [/목표.*없|목표없|인생.*목표/, "meaning/no-goal"],
  [/방황(?!하는칼날)/, "meaning/wandering"],
  [/삶의\s*의미를\s*찾는\s*방법/, "good-life"],
  [/사는.*이유|삶.*무의미|무의미/, "meaning/meaningless"],
  [/죽음|죽는.*두려|죽을까/, "meaning/fear-death"],
  [/뭘.*원하|하고.*싶은지/, "meaning/dont-know-want"],
  [/명절/, "family/holiday-stress"],
  [/가족.*손절|부모.*손절/, "family/family-cutoff"],
  [/엄마랑.*안맞|엄마랑.*안\s*맞|엄마.*안맞|엄마.*갈등/, "family/mother-conflict"],
  [/부모.*갈등|부모님.*갈등|형제.*비교/, "family/parent-conflict"],
  [/독립/, "family/independence"],
  [/돈.*행복|행복.*돈/, "happiness"],
  [/돈|가난|노후|미래.*불안/, "money/future-anxiety"],
  [/칭찬/, "self-esteem/cant-accept-praise"],
  [/자존감.*연애|연애.*자존감/, "self-esteem/dating-self-esteem"],
  [/자존감.*낮|자존감.*높|자존감\s*책|자존감\s*수업|자존심.*자존감/, "self-esteem/low-self-esteem"],
  [/면접|수능|시험|자격증/, "study/exam-anxiety"],
  [/공부|집중/, "study/cant-study"],
  [/남과\s*비교.*우울|남과\s*비교될때|sns.*비교.*(스트레스|우울)/i, "self-esteem/falling-behind"],
  [/스마트폰|도파민|유튜브|쇼츠|릴스|sns|인스타|댓글/, "digital/dopamine-addiction"],
  [/건강염려|건강\s*염려/, "body/health-anxiety"],
  [/불면/, "body/insomnia"],
  [/노화/, "body/aging-anxiety"],
  [/탈모/, "body/hair-loss-stress"],
  [/외모|콤플렉스|다이어트|피부|몸|눈\s*비교|코\s*비교|얼굴\s*비교/, "body/body-anxiety"],
  [/꿈.*포기|포기.*꿈|꿈.*현실|현실.*꿈/, "career/dream-reality"],
  [/행복/, "happiness"],
  [/성공/, "success"],
  [/자유/, "freedom"],
  [/좋은삶|어떻게살|나답게/, "good-life"],
];

const NEW_NODE_CANDIDATES = [
  ["love/relationship-values", "worry", "연애 가치관 차이가 클 때", /연애.*가치관|가치관.*연애/],
  ["breakup/ex-contact", "worry", "전 애인 연락이 흔들릴 때", /전남친.*연락|전여친.*연락|전애인.*연락|전\s*애인.*연락/],
  ["self-esteem/low-self-esteem", "worry", "자존감이 낮을 때", /자존감.*낮|자존감.*높|자존감\s*책|자존감\s*수업|자존심.*자존감/],
  ["self-esteem/dating-self-esteem", "worry", "자존감 낮은 연애를 할 때", /자존감.*연애|연애.*자존감/],
  ["relationships/regret-words", "worry", "말실수 후회가 클 때", /말실수/],
  ["work/not-good-enough", "worry", "일 못하는 것 같을 때", /일.*못|일머리|부족.*회사|회사.*부족/],
  ["work/workplace-relationships", "worry", "직장 인간관계가 힘들 때", /직장.*인간관계|회사.*인간관계/],
  ["work/work-skepticism", "worry", "일에 회의감이 들 때", /회의감/],
  ["meaning/no-goal", "worry", "목표가 없을 때", /목표.*없|목표없|인생.*목표/],
  ["meaning/wandering", "worry", "방황하고 있을 때", /방황(?!하는칼날)/],
  ["family/mother-conflict", "worry", "엄마랑 안 맞을 때", /엄마랑.*안맞|엄마랑.*안\s*맞|엄마.*안맞|엄마.*갈등/],
  ["career/regret-free-choice", "worry", "후회 없는 선택을 하고 싶을 때", /후회없는선택|후회.*없는.*선택/],
  ["career/decision-paralysis", "worry", "결정장애가 심할 때", /선택장애|결정장애/],
  ["body/health-anxiety", "worry", "건강염려증이 심할 때", /건강염려|건강\s*염려/],
  ["body/insomnia", "worry", "불면증이 괴로울 때", /불면/],
  ["body/aging-anxiety", "worry", "노화가 불안할 때", /노화/],
  ["body/hair-loss-stress", "worry", "탈모 스트레스가 심할 때", /탈모/],
  ["remote-work", "debate", "재택근무, 계속 확대해도 괜찮은가?", /재택근무/],
  ["retirement-age", "debate", "정년연장, 해야 하나?", /정년연장|65세정년/],
  [
    "employment-contract",
    "debate",
    "정규직과 계약직 차이, 어디까지 정당한가?",
    /정규직.*계약직|계약직.*정규직|비정규직/,
  ],
];

function seedForSlot(slot) {
  return seedBySlot.get(slot) || seedBySlot.get(SOURCE_CATEGORY_FALLBACK["논쟁/딜레마"]);
}

function seedTokenScore(row, seed) {
  const phrase = norm(row.phrase);
  let score = 0;

  for (const intent of seed.intents || []) {
    const needle = norm(intent);
    if (needle.length < 2) continue;
    if (phrase.includes(needle)) score += 100 + Math.min(needle.length, 20);
    else if (needle.includes(phrase) && phrase.length >= 2) score += 70;
  }

  for (const tag of seed.tags || []) {
    const needle = norm(tag);
    if (needle.length >= 2 && phrase.includes(needle)) score += 24;
  }

  for (const token of String(seed.title || "").split(/[\s/·,?]+/).filter(Boolean)) {
    const needle = norm(token);
    if (needle.length >= 2 && phrase.includes(needle)) score += 16;
  }

  const sourceSlug = SOURCE_CATEGORY_TO_SLUG[row.category];
  if (sourceSlug && seed.category === sourceSlug) score += 10;
  if (row.category === "논쟁/딜레마" && seed.axis === "debate") score += 10;
  if (seed.slot === SOURCE_CATEGORY_FALLBACK[row.category]) score += 4;

  return score;
}

function classifyRow(row) {
  const phrase = norm(row.phrase);
  for (const [pattern, slot] of CLASSIFICATION_RULES) {
    if (pattern.test(phrase)) {
      return { row, seed: seedForSlot(slot), score: 200, matchType: "rule" };
    }
  }

  let best = null;
  for (const seed of seeds.nodes) {
    const score = seedTokenScore(row, seed);
    if (!best || score > best.score) best = { row, seed, score, matchType: "intent" };
  }
  if (best && best.score > 0) return best;

  const fallback = seedForSlot(SOURCE_CATEGORY_FALLBACK[row.category] || "meaning/emptiness");
  return { row, seed: fallback, score: 0, matchType: "category-fallback" };
}

const classifications = rows.map(classifyRow);
const mappedPhraseKeys = new Set(classifications.map((item) => item.row.phrase));
const matchesBySlot = new Map();
for (const item of classifications) {
  if (!matchesBySlot.has(item.seed.slot)) matchesBySlot.set(item.seed.slot, []);
  matchesBySlot.get(item.seed.slot).push({
    ...item.row,
    matchType: item.matchType,
    matchScore: item.score,
  });
}

const enriched = seeds.nodes
  .map((seed) => {
    const content = getNodeContent(seed);
    const allMatches = uniquePhrases(matchesBySlot.get(seed.slot) || []);

    const node = {
      ...seed,
      content,
      groupTitle: groupFor(seed),
      status: statusFor(content),
      verified: verifiedCardCount(content),
      totalCards: content.cards?.length || 0,
      allMatches,
      matches: allMatches.slice(0, 20),
    };

    node.score = scoreNode(node);
    node.flags = qualityFlags(node);
    return node;
  })
  .sort((a, b) => {
    const statusRank = { draft: 0, planned: 1, ready: 2 };
    return (
      statusRank[a.status] - statusRank[b.status] ||
      b.score.total - a.score.total ||
      a.priority - b.priority
    );
  });

const unmappedRows = [];

function reviewReasonsFor(item) {
  const reasons = [];
  const phrase = item.row.phrase || "";

  if (item.matchType === "category-fallback") reasons.push("카테고리 fallback");
  if (item.score < 30) reasons.push("약한 매칭");
  if (LOW_SIGNAL_PATTERN.test(phrase)) reasons.push("검색 잡음 가능성");
  if (isSleepDreamPhrase(phrase)) reasons.push("수면 꿈/해몽 표현 가능성");
  if (
    item.row.category === "논쟁/딜레마" &&
    item.seed.slot === "white-lie" &&
    !/선의의\s*거짓말|거짓말/.test(phrase)
  ) {
    reasons.push("신규 논쟁 후보");
  }
  if (PLATFORM_PATTERN.test(phrase) && item.score < 80) {
    reasons.push("커뮤니티 사례 맥락 확인");
  }

  return [...new Set(reasons)];
}

const reviewRows = classifications
  .map((item) => ({
    ...item.row,
    assignedSlot: item.seed.slot,
    nodeTitle: item.seed.title,
    matchType: item.matchType,
    matchScore: item.score,
    reviewReasons: reviewReasonsFor(item),
  }))
  .filter((row) => row.reviewReasons.length > 0);

const reviewKeyMap = new Map(
  reviewRows.map((row) => [`${row.phrase}|${row.assignedSlot}`, row.reviewReasons])
);

function rowsForCandidate(candidate) {
  const [slot, axis, title, pattern] = candidate;
  const matches = classifications
    .filter((item) => pattern.test(norm(item.row.phrase)))
    .map((item) => ({
      phrase: item.row.phrase,
      sourceCategory: item.row.category,
      previousSlot: item.seed.slot,
      assignedSlot: slot,
      axis,
      title,
      lowSignal: LOW_SIGNAL_PATTERN.test(item.row.phrase) || isSleepDreamPhrase(item.row.phrase),
    }));

  const unique = [...new Map(matches.map((row) => [row.phrase, row])).values()];
  return unique;
}

const promotedCandidates = NEW_NODE_CANDIDATES.map((candidate) => {
  const [slot, axis, title] = candidate;
  const matches = rowsForCandidate(candidate);
  const seed = seedForSlot(slot);
  const content = getNodeContent(seed);

  return {
    slot,
    axis,
    title,
    status: statusFor(content),
    matchedPhrases: matches.length,
    samplePhrases: matches.slice(0, 12).map((row) => row.phrase),
    lowSignalPhrases: matches.filter((row) => row.lowSignal).map((row) => row.phrase),
  };
}).sort((a, b) => b.matchedPhrases - a.matchedPhrases || a.title.localeCompare(b.title, "ko"));

const promotedSlots = new Set(promotedCandidates.map((candidate) => candidate.slot));
const lowSignalRows = reviewRows.filter(
  (row) =>
    LOW_SIGNAL_PATTERN.test(row.phrase) ||
    isSleepDreamPhrase(row.phrase) ||
    row.reviewReasons.includes("검색 잡음 가능성") ||
    row.reviewReasons.includes("수면 꿈/해몽 표현 가능성")
);
const lowSignalKeys = new Set(lowSignalRows.map((row) => row.phrase));
const keepWithExistingRows = reviewRows.filter(
  (row) => !lowSignalKeys.has(row.phrase) && !promotedSlots.has(row.assignedSlot)
);

const candidateQueue = {
  generatedAt: new Date().toISOString(),
  promoted: promotedCandidates,
  keepWithExisting: keepWithExistingRows.map((row) => ({
    phrase: row.phrase,
    sourceCategory: row.category,
    assignedSlot: row.assignedSlot,
    nodeTitle: row.nodeTitle,
    reasons: row.reviewReasons,
  })),
  lowSignal: lowSignalRows.map((row) => ({
    phrase: row.phrase,
    sourceCategory: row.category,
    assignedSlot: row.assignedSlot,
    nodeTitle: row.nodeTitle,
    reasons: row.reviewReasons,
  })),
};

const GROUP_PATTERNS = [
  [/불안형|회피형|애착/, "연애 애착 불안/회피형"],
  [/마음정리|후유증|잊는법|잊는 법|공허/, "이별 회복과 마음정리"],
  [/읽씹|잠수|연락무시|연락 무시/, "읽씹·잠수·무시당함"],
  [/손절|관계정리|관계 정리|리셋/, "인간관계 손절/정리"],
  [/sns|인스타|카톡|알림|도파민|스마트폰|유튜브|댓글/, "디지털/SNS 불안"],
  [/외모|콤플렉스|다이어트|몸/, "몸·외모 불안"],
  [/돈걱정|돈 걱정|노후|미래불안|미래 불안/, "돈과 미래 불안"],
  [/안락사|사형|낙태|동물실험|노키즈존|촉법소년|능력주의|기본소득|재택근무|ai|인공지능|채식|비건|환경|체벌|캔슬/, "사회/윤리 논쟁"],
  [/부모|가족|독립|형제(?!도)/, "가족 갈등과 독립"],
  [/시험|공부|집중|수험/, "공부/시험 불안"],
  [/효도/, "효도는 의무인가"],
  [/복수/, "복수는 정당한가"],
  [/참는 게|참는게/, "참는 게 이기는 건가"],
  [/꿈|현실/, "꿈과 현실"],
  [/혼전동거|비혼|결혼|아이꼭|부모부양|아이낳/, "결혼/가족 가치 논쟁"],
];

function candidateBucket(row) {
  const phrase = norm(row.phrase);
  for (const [pattern, label] of GROUP_PATTERNS) {
    if (pattern.test(phrase)) return label;
  }
  const cleaned = row.phrase
    .replace(new RegExp(PLATFORM_TOKENS.join("|"), "gi"), "")
    .replace(/(극복|방법|하는 법|하는법|대처법|이유|후회|고민|디시|더쿠|블라인드)/g, "")
    .trim();
  return cleaned.slice(0, 12) || row.category;
}

const candidateMap = new Map();
for (const row of reviewRows) {
  const bucket = `${row.category} · ${candidateBucket(row)}`;
  if (!candidateMap.has(bucket)) {
    candidateMap.set(bucket, { bucket, category: row.category, phrases: [] });
  }
  candidateMap.get(bucket).phrases.push(`${row.phrase} → ${row.nodeTitle}`);
}

const candidates = [...candidateMap.values()]
  .map((candidate) => ({
    ...candidate,
    phrases: [...new Set(candidate.phrases)].slice(0, 12),
    count: new Set(candidate.phrases).size,
  }))
  .filter((candidate) => candidate.count >= 2)
  .sort((a, b) => b.count - a.count || a.bucket.localeCompare(b.bucket, "ko"));

const counts = enriched.reduce(
  (acc, node) => {
    acc[node.status] += 1;
    return acc;
  },
  { ready: 0, draft: 0, planned: 0 }
);

const allSourceCards = enriched.flatMap((node) =>
  (node.content.cards || []).map((card) => ({
    node,
    card,
  }))
);
const structuredSourceCards = allSourceCards.filter(
  ({ card }) => card.sourceUrl && card.sourceType && card.sourceYear
);
const linkedSourceCards = allSourceCards.filter(({ card }) => card.sourceUrl);
const sourceTypeCounts = structuredSourceCards.reduce((acc, { card }) => {
  const key = card.sourceType || "unknown";
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});
const missingStructuredSourceCards = allSourceCards.filter(
  ({ card }) => card.source && (!card.sourceUrl || !card.sourceType || !card.sourceYear)
);

const inventory = {
  generatedAt: new Date().toISOString(),
  counts,
  mappedPhrases: mappedPhraseKeys.size,
  unmappedPhrases: unmappedRows.length,
  reviewPhrases: reviewRows.length,
  sourceMetadata: {
    totalCards: allSourceCards.length,
    linkedCards: linkedSourceCards.length,
    structuredCards: structuredSourceCards.length,
    missingStructuredCards: missingStructuredSourceCards.length,
    byType: sourceTypeCounts,
  },
  contentization: {
    canonicalNodes: enriched.length,
    readyNodes: counts.ready,
    mappedToCanonical: mappedPhraseKeys.size,
    unmapped: unmappedRows.length,
    reviewNotes: reviewRows.length,
    lowSignalRows: lowSignalRows.length,
    summaryCoreRows: mappedPhraseKeys.size - lowSignalRows.length,
  },
  nodes: enriched.map((node) => ({
    slot: node.slot,
    axis: node.axis,
    title: node.title,
    status: node.status,
    groupTitle: node.groupTitle,
    priority: node.priority,
    score: node.score,
    flags: node.flags,
    verified: node.verified,
    totalCards: node.totalCards,
    tags: (node.content.tags || []).map((tag) => tag.title),
    matchedPhrases: node.allMatches.length,
    samplePhrases: node.allMatches.slice(0, 8).map((row) => row.phrase),
  })),
};

const phraseMap = {
  generatedAt: inventory.generatedAt,
  mapped: classifications.map((item) => ({
    phrase: item.row.phrase,
    sourceCategory: item.row.category,
    slot: item.seed.slot,
    nodeTitle: item.seed.title,
    axis: item.seed.axis,
    matchType: item.matchType,
    matchScore: item.score,
    needsReview: reviewKeyMap.has(`${item.row.phrase}|${item.seed.slot}`),
    reviewReasons: reviewKeyMap.get(`${item.row.phrase}|${item.seed.slot}`) || [],
  })),
  unmapped: [],
  review: reviewRows,
};

function nodeUrl(node) {
  if (node.axis === "debate") return `/debate/${node.slot}`;
  if (node.axis === "thought") return `/thought/${node.slot}`;
  return `/${node.slot}`;
}

function axisLabel(axis) {
  if (axis === "debate") return "논쟁";
  if (axis === "thought") return "생각";
  return "고민";
}

let md = `# Wisdom 콘텐츠 백로그\n\n`;
md += `생성일: ${inventory.generatedAt}\n\n`;
md += `- ready: ${counts.ready}\n`;
md += `- draft: ${counts.draft}\n`;
md += `- planned: ${counts.planned}\n`;
md += `- mapped phrases: ${mappedPhraseKeys.size}\n`;
md += `- unmapped phrases: ${unmappedRows.length}\n\n`;
md += `> 원칙: 검색어마다 페이지를 만들지 않는다. 반복되는 검색어는 하나의 canonical node에 묶고, 검증 카드가 충분한 노드만 index한다.\n\n`;

for (const status of ["draft", "planned", "ready"]) {
  const title =
    status === "draft" ? "검증/품질 보강 필요" : status === "planned" ? "초안 생성 필요" : "공개 가능";
  md += `## ${title}\n\n`;
  for (const node of enriched.filter((item) => item.status === status)) {
    md += `### ${node.priority}. ${node.title} \`${node.slot}\`\n\n`;
    md += `- 축: ${axisLabel(node.axis)}\n`;
    if (node.groupTitle) md += `- 중분류: ${node.groupTitle}\n`;
    if (node.content.tags?.length > 0) {
      md += `- 태그: ${node.content.tags.map((tag) => tag.title).join(" / ")}\n`;
    }
    md += `- URL: ${nodeUrl(node)}\n`;
    md += `- 점수: ${node.score.total}/100 (수요 ${node.score.demand}, 검증 ${node.score.verification}, 구조 ${node.score.structure})\n`;
    md += `- 카드 검증: ${node.verified}/${node.totalCards}\n`;
    md += `- 검색 매칭: ${node.allMatches.length}개\n`;
    md += `- 다음 행동: ${nextAction(node)}\n`;
    if (node.flags.length > 0) md += `- 품질 플래그: ${node.flags.join(" / ")}\n`;
    if (node.matches.length > 0) {
      md += `- 대표 입구: ${node.matches
        .slice(0, 8)
        .map((row) => row.phrase)
        .join(" / ")}\n`;
    } else {
      md += `- 대표 입구: ${node.intents.join(" / ")}\n`;
    }
    md += `- 카드 후보: ${(node.thinkers || []).join(" / ")}\n\n`;
  }
}

let unmappedMd = `# 분류 검토 후보\n\n`;
unmappedMd += `생성일: ${inventory.generatedAt}\n\n`;
unmappedMd += `정제 검색어 ${mappedPhraseKeys.size}개는 모두 canonical node에 분류됐다. 아래는 category fallback 등으로 붙어 사람이 한 번 더 검토하면 좋은 후보 ${reviewRows.length}개다.\n\n`;
for (const candidate of candidates.slice(0, 40)) {
  unmappedMd += `## ${candidate.bucket} (${candidate.count})\n\n`;
  unmappedMd += candidate.phrases.map((phrase) => `- ${phrase}`).join("\n");
  unmappedMd += "\n\n";
}

const draftNodes = enriched.filter((node) => node.status === "draft");
let verificationMd = `# 검증 큐\n\n`;
verificationMd += `생성일: ${inventory.generatedAt}\n\n`;
verificationMd += `현재 검증 중 초안 ${draftNodes.length}개. 공개 전환 기준은 verified 카드 최소 2개, 사용자 입구 문장, 행동/성찰 지침, 출처 확인이다.\n\n`;
verificationMd += `## 우선순위\n\n`;
for (const node of draftNodes.slice(0, 30)) {
  const unverifiedCards = (node.content.cards || []).filter((card) => !card.verified);
  verificationMd += `### ${node.title} \`${node.slot}\`\n\n`;
  verificationMd += `- URL: ${nodeUrl(node)}\n`;
  verificationMd += `- 축: ${axisLabel(node.axis)}${node.groupTitle ? ` · ${node.groupTitle}` : ""}\n`;
  verificationMd += `- 수집어: ${node.allMatches.length}개\n`;
  verificationMd += `- 검증 카드: ${node.verified}/${node.totalCards}\n`;
  verificationMd += `- 다음 행동: ${nextAction(node)}\n`;
  if (node.flags.length > 0) verificationMd += `- 플래그: ${node.flags.join(" / ")}\n`;
  if (node.matches.length > 0) {
    verificationMd += `- 대표 수집어: ${node.matches
      .slice(0, 8)
      .map((row) => row.phrase)
      .join(" / ")}\n`;
  }
  verificationMd += `- 확인할 카드:\n`;
  for (const card of unverifiedCards.slice(0, 5)) {
    verificationMd += `  - ${card.name} — ${card.source || "출처 확인 필요"}\n`;
  }
  verificationMd += `\n`;
}

let candidateQueueMd = `# 신규 콘텐츠 후보 큐\n\n`;
candidateQueueMd += `생성일: ${candidateQueue.generatedAt}\n\n`;
candidateQueueMd += `수집/검토 후보에서 승격한 확장 카드 ${candidateQueue.promoted.length}개, 기존 카드 유지 ${candidateQueue.keepWithExisting.length}개, 저신호 ${candidateQueue.lowSignal.length}개.\n\n`;
candidateQueueMd += `## 수집 기반 확장 카드\n\n`;
for (const candidate of candidateQueue.promoted) {
  const href =
    candidate.axis === "debate" ? `/debate/${candidate.slot}` : `/${candidate.slot}`;
  candidateQueueMd += `### ${candidate.title} \`${candidate.slot}\`\n\n`;
  candidateQueueMd += `- URL: ${href}\n`;
  candidateQueueMd += `- 상태: ${candidate.status}\n`;
  candidateQueueMd += `- 수집어: ${candidate.matchedPhrases}개\n`;
  candidateQueueMd += `- 저신호 별도 관리: ${candidate.lowSignalPhrases.length}개\n`;
  candidateQueueMd += `- 샘플: ${candidate.samplePhrases.slice(0, 8).join(" / ")}\n\n`;
}
candidateQueueMd += `## 기존 카드 유지\n\n`;
for (const row of candidateQueue.keepWithExisting.slice(0, 80)) {
  candidateQueueMd += `- ${row.phrase} → ${row.nodeTitle} \`${row.assignedSlot}\` (${row.reasons.join(
    ", "
  )})\n`;
}

let lowSignalMd = `# 저신호 표현 검토\n\n`;
lowSignalMd += `생성일: ${inventory.generatedAt}\n\n`;
lowSignalMd += `상품명, 작품명, 검색 보조어, 해몽성 표현처럼 대표 콘텐츠의 중심 문장으로 쓰기 어려운 표현 ${lowSignalRows.length}개.\n\n`;
const lowSignalByReason = new Map();
for (const row of candidateQueue.lowSignal) {
  const reason = row.reasons[0] || "저신호";
  if (!lowSignalByReason.has(reason)) lowSignalByReason.set(reason, []);
  lowSignalByReason.get(reason).push(row);
}
for (const [reason, rowsForReason] of lowSignalByReason.entries()) {
  lowSignalMd += `## ${reason} (${rowsForReason.length})\n\n`;
  for (const row of rowsForReason.slice(0, 60)) {
    lowSignalMd += `- ${row.phrase} → ${row.nodeTitle}\n`;
  }
  lowSignalMd += `\n`;
}

const reviewBySlot = new Map();
for (const row of reviewRows) {
  const current = reviewBySlot.get(row.assignedSlot) || {
    slot: row.assignedSlot,
    title: row.nodeTitle,
    count: 0,
    samples: [],
  };
  current.count += 1;
  if (current.samples.length < 5) current.samples.push(row.phrase);
  reviewBySlot.set(row.assignedSlot, current);
}

let coverageMd = `# 수집어 콘텐츠화 커버리지\n\n`;
coverageMd += `생성일: ${inventory.generatedAt}\n\n`;
coverageMd += `수집된 표현을 얇은 개별 페이지로 흩뿌리지 않고, 대표 고민/논쟁/생각 카드로 묶어 본문에 반영하는 현황이다.\n\n`;
coverageMd += `## 전체 상태\n\n`;
coverageMd += `- 정제 수집어: ${mappedPhraseKeys.size.toLocaleString("ko-KR")}개\n`;
coverageMd += `- canonical node 매핑: ${mappedPhraseKeys.size.toLocaleString("ko-KR")}개\n`;
coverageMd += `- 미분류 수집어: ${unmappedRows.length.toLocaleString("ko-KR")}개\n`;
coverageMd += `- 공개 가능한 콘텐츠 노드: ${counts.ready.toLocaleString("ko-KR")}개\n`;
coverageMd += `- 검증 중 초안 노드: ${counts.draft.toLocaleString("ko-KR")}개\n`;
coverageMd += `- 본문 요약 중심 표현: ${(mappedPhraseKeys.size - lowSignalRows.length).toLocaleString("ko-KR")}개\n`;
coverageMd += `- 검색 의도/검토 노트 처리 표현: ${reviewRows.length.toLocaleString("ko-KR")}개\n`;
coverageMd += `- 저신호로 중심 본문에서 제외한 표현: ${lowSignalRows.length.toLocaleString("ko-KR")}개\n\n`;
coverageMd += `## 처리 원칙\n\n`;
coverageMd += `1. 의미가 분명한 표현은 상세 페이지의 질문 구조, 대표 질문, 검색 의도별 답변에 반영한다.\n`;
coverageMd += `2. 커뮤니티 사례 표현은 실제 사례 욕구로 보되, 출처 검증 카드와 분리해 읽게 한다.\n`;
coverageMd += `3. 가사, 작품명, 상품명, 행정서류, 꿈/해몽 표현은 별도 얇은 페이지로 만들지 않고 검토 노트와 전체 수집 표현에만 남긴다.\n`;
coverageMd += `4. 같은 의도의 표현이 충분히 반복되면 새 canonical node 후보로 승격한다.\n\n`;
coverageMd += `## 검토 표현이 많은 노드\n\n`;
for (const item of [...reviewBySlot.values()].sort((a, b) => b.count - a.count).slice(0, 25)) {
  coverageMd += `### ${item.title} \`${item.slot}\` (${item.count})\n\n`;
  coverageMd += item.samples.map((sample) => `- ${sample}`).join("\n");
  coverageMd += `\n\n`;
}

let sourceCoverageMd = `# 출처 메타데이터 커버리지\n\n`;
sourceCoverageMd += `생성일: ${inventory.generatedAt}\n\n`;
sourceCoverageMd += `카드의 자유 서술형 출처를 \`sourceUrl/sourceType/sourceYear\`로 구조화한 현황이다.\n\n`;
sourceCoverageMd += `## 전체 상태\n\n`;
sourceCoverageMd += `- 전체 카드: ${allSourceCards.length.toLocaleString("ko-KR")}개\n`;
sourceCoverageMd += `- 링크 연결 카드: ${linkedSourceCards.length.toLocaleString("ko-KR")}개\n`;
sourceCoverageMd += `- 구조화 완료 카드: ${structuredSourceCards.length.toLocaleString("ko-KR")}개\n`;
sourceCoverageMd += `- 구조화 필요 카드: ${missingStructuredSourceCards.length.toLocaleString("ko-KR")}개\n\n`;
sourceCoverageMd += `## 유형별 구조화 카드\n\n`;
for (const [type, count] of Object.entries(sourceTypeCounts).sort((a, b) => b[1] - a[1])) {
  sourceCoverageMd += `- ${type}: ${count.toLocaleString("ko-KR")}개\n`;
}
sourceCoverageMd += `\n## 구조화 필요 샘플\n\n`;
if (missingStructuredSourceCards.length === 0) {
  sourceCoverageMd += `- 없음\n`;
} else {
  for (const { node, card } of missingStructuredSourceCards.slice(0, 80)) {
    sourceCoverageMd += `- ${node.title} \`${node.slot}\` / ${card.name}: ${card.source}\n`;
  }
}
sourceCoverageMd += `\n## 운영 원칙\n\n`;
sourceCoverageMd += `1. 화면에는 읽기 쉬운 \`source\` 문장을 유지한다.\n`;
sourceCoverageMd += `2. 링크, 유형, 기준연도는 \`sourceUrl/sourceType/sourceYear\`로 관리한다.\n`;
sourceCoverageMd += `3. 공식/정책/의료 출처는 기준 시점이 바뀔 수 있으므로 주기적으로 재확인한다.\n`;
sourceCoverageMd += `4. 출처 문자열이 길거나 여러 자료를 합친 경우, 우선 대표 기준 출처 하나를 링크하고 다음 단계에서 다중 출처 배열로 확장한다.\n`;

let indexingMd = `# 색인 정책\n\n`;
indexingMd += `생성일: ${inventory.generatedAt}\n\n`;
indexingMd += `Wisdom은 검색어마다 얇은 페이지를 만들지 않고, 반복 표현을 canonical node에 묶는다. sitemap에는 검증 기준을 통과한 공개 콘텐츠와 기본 탐색 페이지만 포함한다.\n\n`;
indexingMd += `## 현재 상태\n\n`;
indexingMd += `- 공개 ready: ${counts.ready}\n`;
indexingMd += `- 검증 중 draft: ${counts.draft}\n`;
indexingMd += `- 준비 planned: ${counts.planned}\n`;
indexingMd += `- 매핑 수집어: ${mappedPhraseKeys.size}\n`;
indexingMd += `- 미분류 수집어: ${unmappedRows.length}\n`;
indexingMd += `- 검토 후보: ${reviewRows.length}\n\n`;
indexingMd += `## 색인 포함\n\n`;
indexingMd += `- 홈, 대분류/중분류 탐색 페이지\n`;
indexingMd += `- verified 카드가 2개 이상인 고민/논쟁/생각 상세 페이지\n`;
indexingMd += `- 공개 콘텐츠가 2개 이상 연결된 태그 페이지\n`;
indexingMd += `- 카드가 2개 이상 연결된 인물 페이지\n\n`;
indexingMd += `## 색인 제외\n\n`;
indexingMd += `- /collected: 수집/검토 운영 지도이므로 noindex\n`;
indexingMd += `- /saved: 개인 저장함 UI이므로 robots disallow\n`;
indexingMd += `- 검증 중 초안 상세: 접근은 허용하지만 page metadata robots.index=false\n`;
indexingMd += `- 저신호 표현: canonical content의 중심 문장으로 쓰지 않음\n\n`;
indexingMd += `## 공개 전환 조건\n\n`;
indexingMd += `1. 최소 2개 카드의 출처와 관점이 확인된다.\n`;
indexingMd += `2. 직접 인용처럼 보이는 문구는 원문과 번역 맥락을 대조한다.\n`;
indexingMd += `3. 행동 지침이 출처의 주장보다 과장되지 않는다.\n`;
indexingMd += `4. 수집어 기반 대표 질문과 사용자 입구 문장이 실제 검색 의도와 맞는다.\n`;

mkdirSync("docs", { recursive: true });
writeFileSync("data/content_backlog.md", md);
writeFileSync("data/content_inventory.json", JSON.stringify(inventory, null, 2));
writeFileSync("data/phrase_map.json", JSON.stringify(phraseMap, null, 2));
writeFileSync(
  "data/classification_review.json",
  JSON.stringify(
    {
      generatedAt: inventory.generatedAt,
      total: reviewRows.length,
      buckets: candidates,
      rows: reviewRows,
    },
    null,
    2
  )
);
writeFileSync("data/content_candidate_queue.json", JSON.stringify(candidateQueue, null, 2));
writeFileSync(
  "data/low_signal_phrases.json",
  JSON.stringify(
    {
      generatedAt: inventory.generatedAt,
      total: lowSignalRows.length,
      rows: candidateQueue.lowSignal,
    },
    null,
    2
  )
);
writeFileSync("data/unmapped_candidates.md", unmappedMd);
writeFileSync("docs/verification_queue.md", verificationMd);
writeFileSync("docs/content_candidate_queue.md", candidateQueueMd);
writeFileSync("docs/low_signal_review.md", lowSignalMd);
writeFileSync("docs/contentization_coverage.md", coverageMd);
writeFileSync("docs/source_metadata_coverage.md", sourceCoverageMd);
writeFileSync("docs/indexing_policy.md", indexingMd);

console.log("===== 콘텐츠 백로그 생성 완료 =====");
console.log(`ready ${counts.ready} | draft ${counts.draft} | planned ${counts.planned}`);
console.log(
  `mapped ${mappedPhraseKeys.size} | unmapped ${unmappedRows.length} | review ${reviewRows.length}`
);
console.log(
  "파일: data/content_backlog.md, data/content_inventory.json, data/phrase_map.json, data/classification_review.json, data/content_candidate_queue.json, data/low_signal_phrases.json, data/unmapped_candidates.md"
);
