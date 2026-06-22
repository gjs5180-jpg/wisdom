import phraseMap from "@/data/phrase_map.json";
import classificationReview from "@/data/classification_review.json";
import candidateQueue from "@/data/content_candidate_queue.json";
import contentInventory from "@/data/content_inventory.json";
import { allContentEntries, getEntryByKey } from "@/lib/content";

const PLATFORM_PATTERN =
  /디시|더쿠|블라인드|블라|인스티즈|오르비|클리앙|네이트판|82cook/i;

const LOW_SIGNAL_PATTERN =
  /가사|歌詞|영어\s*로|영어로|비슷한\s*말|대체어|키캡|팝업|티셔츠|아이스티|베이커리|화장품|쿠키|젤리|만두|빵|뷔페|레더|가죽|문답|100가지|실업급여|이직확인서|이직로그|고민중독|25년째|방황하는 칼날|대표님과 결혼했습니다|리바이|애니|ova|다시\s*보기|번역|풀\s*컬러|랜덤|브랜뉴|mbti|직업\s*추천|가능한\s*직업|알바|채용/i;

const INTENT_RULES = [
  {
    slug: "position",
    title: "찬반과 근거",
    description: "논쟁에서 어느 쪽을 택할지, 근거를 어떻게 세울지 찾는 표현입니다.",
    pattern: /찬반|찬성|반대|근거|토론|논쟁|정당화|권리|의무|차별|허용|금지/i,
  },
  {
    slug: "method",
    title: "방법과 극복",
    description: "당장 어떻게 다루고 벗어날 수 있는지 찾는 표현입니다.",
    pattern: /극복|방법|법|하는\s*법|하는법|대처|해결|고치는|안\s*받는|안받는|줄이는|끊는|이겨내/i,
  },
  {
    slug: "decision",
    title: "선택과 판단",
    description: "해야 할지 말아야 할지, 언제 움직여야 할지 판단하려는 표현입니다.",
    pattern: /고민|해야|할까|될까|접을까|포기|선택|결정|타이밍|버텨야|그만|연락해야|낳아야/i,
  },
  {
    slug: "symptom",
    title: "증상과 원인",
    description: "지금 상태가 무엇인지, 왜 반복되는지 확인하려는 표현입니다.",
    pattern: /증상|원인|특징|테스트|자가진단|검사|중독|장애|우울증|불안증|병|척도/i,
  },
  {
    slug: "emotion",
    title: "감정 이름 붙이기",
    description: "불안, 공허, 후회, 외로움처럼 감정의 정체를 붙잡으려는 표현입니다.",
    pattern: /불안|두려|무서|걱정|공허|허무|외로|후회|미련|현타|스트레스|우울|분노|질투|열등감/i,
  },
  {
    slug: "communication",
    title: "말과 연락",
    description: "카톡, 답장, 고백, 거절처럼 관계 안에서 무슨 말을 해야 할지 찾는 표현입니다.",
    pattern: /카톡|답장|연락|읽씹|안읽씹|잠수|고백|멘트|거절|말실수|칭찬|대화/i,
  },
  {
    slug: "community",
    title: "실제 사례와 후기",
    description: "커뮤니티의 사례, 후기, 비슷한 경험을 확인하려는 표현입니다.",
    pattern: PLATFORM_PATTERN,
  },
  {
    slug: "reference",
    title: "자료와 관점",
    description: "책, 명언, 논문, 철학처럼 판단의 언어를 빌리려는 표현입니다.",
    pattern: /명언|책|도서|철학|논문|상담|정신과|약|지문|연구|개발|타당도/i,
  },
];

function keyForMappedPhrase(row) {
  if (row.axis === "debate") return `debate/${row.slot}`;
  if (row.axis === "thought") return `thought/${row.slot}`;
  return row.slot;
}

function uniqueRows(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = `${row.phrase}|${row.sourceCategory}|${row.slot}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

const rowsByEntryKey = phraseMap.mapped.reduce((map, row) => {
  const key = keyForMappedPhrase(row);
  const rows = map.get(key) || [];
  rows.push(row);
  map.set(key, rows);
  return map;
}, new Map());

function rowSignal(row) {
  const phrase = row.phrase || "";
  for (const rule of INTENT_RULES) {
    if (rule.pattern.test(phrase)) return rule;
  }
  return {
    slug: "situation",
    title: "상황 표현",
    description: "구체적인 상황이나 말투가 그대로 들어온 표현입니다.",
  };
}

function isHighSignalRow(row) {
  if (!row?.phrase) return false;
  if (row.needsReview) return false;
  if (LOW_SIGNAL_PATTERN.test(row.phrase)) return false;
  if (row.matchType === "category-fallback") return false;
  if (Number(row.matchScore || 0) < 30) return false;
  return true;
}

function phraseList(rows, limit = 3) {
  return rows
    .slice(0, limit)
    .map((row) => `"${row.phrase}"`)
    .join(", ");
}

function faqForIntent(intent, group) {
  const title = group.entry.title;
  const samples = phraseList(intent.rows);
  const samplePrefix = samples ? `수집어 ${samples}처럼 들어온 질문은 ` : "이 질문은 ";

  const templates = {
    position: {
      question: `${title}의 찬반 근거는 어떻게 나눠 봐야 하나요?`,
      answer: `${samplePrefix}한쪽 결론보다 근거의 층위를 나눠야 합니다. 권리, 피해, 제도 비용, 예외 상황을 분리하면 이 카드의 관점들을 비교하기 쉬워집니다.`,
    },
    method: {
      question: `${title}를 당장 어떻게 다뤄야 하나요?`,
      answer: `${samplePrefix}즉시 해결책을 찾는 흐름입니다. 먼저 지금 통제 가능한 행동을 하나로 줄이고, 카드의 행동 지침을 작은 실험으로 바꿔 보는 편이 좋습니다.`,
    },
    decision: {
      question: `${title}에서 무엇을 기준으로 판단해야 하나요?`,
      answer: `${samplePrefix}선택의 압박이 큰 흐름입니다. 감정, 책임, 되돌릴 수 있는 선택, 오래 남을 비용을 나눠 보면 단순한 찬반보다 선명해집니다.`,
    },
    symptom: {
      question: `${title}가 반복되는 이유를 어떻게 봐야 하나요?`,
      answer: `${samplePrefix}상태의 이름과 원인을 확인하려는 흐름입니다. 단정하기보다 반복되는 상황, 몸의 반응, 실제 행동 변화를 나눠 기록하는 것이 먼저입니다.`,
    },
    emotion: {
      question: `${title}에서 먼저 붙잡아야 할 감정은 무엇인가요?`,
      answer: `${samplePrefix}불안, 후회, 공허, 압박처럼 감정 이름을 찾는 흐름입니다. 감정 자체를 없애려 하기보다 무엇을 지키려는 신호인지 보는 데서 시작합니다.`,
    },
    communication: {
      question: `${title}에서 어떤 말을 먼저 정리해야 하나요?`,
      answer: `${samplePrefix}관계 안에서 말과 연락을 어떻게 할지 묻는 흐름입니다. 상대 반응을 통제하려는 말과 내 기준을 전하는 말을 구분해야 합니다.`,
    },
    community: {
      question: `커뮤니티 사례는 ${title}를 어떻게 보완하나요?`,
      answer: `${samplePrefix}비슷한 사례를 확인하려는 흐름입니다. 사례는 공감을 주지만 결론은 개인 상황에 맞춰 다시 판단해야 하므로, 카드의 기준과 함께 보는 편이 좋습니다.`,
    },
    reference: {
      question: `${title}에 책이나 명언을 붙일 때 조심할 점은 무엇인가요?`,
      answer: `${samplePrefix}판단의 언어를 빌리려는 흐름입니다. 멋진 문장보다 출처가 확인된 관점인지, 지금 상황에 과장 없이 적용되는지를 먼저 봐야 합니다.`,
    },
    situation: {
      question: `${title}와 비슷한 상황 표현은 어떻게 묶이나요?`,
      answer: `${samplePrefix}사용자의 말투가 그대로 들어온 흐름입니다. 표현은 달라도 같은 감정, 선택, 관계 문제로 모이면 하나의 대표 카드에서 함께 다룹니다.`,
    },
  };

  return templates[intent.slug] || templates.situation;
}

const REVIEW_NOTE_RULES = [
  {
    reason: "검색 잡음 가능성",
    title: "검색 잡음 / 자료형 표현",
    description:
      "가사, 상품, 번역, 행정서류, 작품명처럼 고민 자체가 아닐 수 있는 표현입니다. 별도 얇은 페이지를 만들지 않고 관련 카드의 전체 수집 표현으로만 남깁니다.",
  },
  {
    reason: "수면 꿈/해몽 표현 가능성",
    title: "꿈 / 해몽형 표현",
    description:
      "꿈 해석 의도가 섞인 표현입니다. 해몽 콘텐츠로 확장하기보다, 실제 고민과 연결되는 경우에만 대표 카드의 주변 표현으로 둡니다.",
  },
  {
    reason: "신규 논쟁 후보",
    title: "새 논쟁 후보",
    description:
      "기존 논쟁과 겹치지만 독립 주제로 커질 수 있는 표현입니다. 반복 수요가 더 쌓이면 별도 논쟁 카드로 분리할 후보입니다.",
  },
  {
    reason: "커뮤니티 사례 맥락 확인",
    title: "커뮤니티 사례 표현",
    description:
      "디시, 더쿠, 블라인드처럼 실제 사례를 보려는 표현입니다. 사례성은 살리되, 검증된 조언과 구분해 읽도록 처리합니다.",
  },
  {
    reason: "약한 매칭",
    title: "약한 매칭 표현",
    description:
      "현재 대표 카드와 완전히 같지는 않지만 가까운 표현입니다. 새 카드로 분리할 만큼 반복되기 전까지는 보조 유입으로만 유지합니다.",
  },
];

function reviewNoteGroups(rows) {
  const reviewRows = rows.filter((row) => row.needsReview);
  if (reviewRows.length === 0) return [];

  return REVIEW_NOTE_RULES.map((rule) => {
    const matches = reviewRows.filter((row) =>
      (row.reviewReasons || []).includes(rule.reason)
    );
    if (matches.length === 0) return null;

    return {
      slug: rule.reason,
      title: rule.title,
      description: rule.description,
      count: matches.length,
      samples: matches.slice(0, 5).map((row) => row.phrase),
    };
  }).filter(Boolean);
}

function rowsByIntent(rows) {
  const map = new Map();
  for (const row of rows) {
    const signal = rowSignal(row);
    if (!map.has(signal.slug)) {
      map.set(signal.slug, {
        slug: signal.slug,
        title: signal.title,
        description: signal.description,
        rows: [],
      });
    }
    map.get(signal.slug).rows.push(row);
  }

  return [...map.values()]
    .map((group) => ({
      ...group,
      count: group.rows.length,
      samples: group.rows.slice(0, 6).map((row) => row.phrase),
    }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count;
      return a.title.localeCompare(b.title, "ko");
    });
}

function representativeRows(rows, limit = 8) {
  const seenIntents = new Set();
  const picked = [];

  for (const row of rows) {
    const intent = rowSignal(row).slug;
    if (seenIntents.has(intent)) continue;
    picked.push(row);
    seenIntents.add(intent);
    if (picked.length >= limit) return picked;
  }

  for (const row of rows) {
    if (picked.some((item) => item.phrase === row.phrase)) continue;
    picked.push(row);
    if (picked.length >= limit) return picked;
  }

  return picked;
}

function contentizeGroup(group) {
  const highSignalRows = group.rows.filter(isHighSignalRow);
  const contentRows = highSignalRows.length >= 3 ? highSignalRows : group.rows;
  const intentGroups = rowsByIntent(contentRows);
  const allIntentGroups = rowsByIntent(group.rows);
  const reviewNotes = reviewNoteGroups(group.rows);
  const topIntents = intentGroups.slice(0, 3).map((intent) => intent.title);
  const sourceText = group.sourceCategories.slice(0, 3).join(" · ");
  const axisText =
    group.entry.axis === "debate" ? "논쟁" : group.entry.axis === "thought" ? "생각" : "고민";
  const reviewCount = group.rows.filter((row) => row.needsReview).length;

  const lead =
    topIntents.length > 0
      ? `${group.phrases.length.toLocaleString("ko-KR")}개의 수집 표현은 주로 ${topIntents.join(", ")}의 결로 모입니다.`
      : `${group.phrases.length.toLocaleString("ko-KR")}개의 수집 표현을 이 ${axisText} 카드로 묶었습니다.`;

  const summary = [
    sourceText
      ? `${sourceText}에서 들어온 말투를 하나의 대표 ${axisText}으로 정리했습니다.`
      : `흩어진 표현을 하나의 대표 ${axisText}으로 정리했습니다.`,
    intentGroups[0]
      ? `가장 큰 의도는 "${intentGroups[0].title}"이며, ${intentGroups[0].description}`
      : "반복되는 표현을 기준으로 사용자의 질문을 다시 묶었습니다.",
    highSignalRows.length !== group.rows.length
      ? `검색 잡음은 낮게 두고, 의미가 분명한 ${highSignalRows.length.toLocaleString(
          "ko-KR"
        )}개 표현을 요약의 중심에 두었습니다.`
      : "수집어 대부분이 현재 대표 카드와 직접 연결됩니다.",
    reviewCount > 0
      ? `검토가 필요한 ${reviewCount.toLocaleString(
          "ko-KR"
        )}개 표현은 검색 의도 노트로 따로 분리했습니다.`
      : "검토 대기 표현 없이 바로 콘텐츠 요약에 반영할 수 있는 묶음입니다.",
  ];

  return {
    lead,
    summary,
    phraseCount: group.phrases.length,
    contentPhraseCount: contentRows.length,
    rawPhraseCount: group.rows.length,
    reviewPhraseCount: reviewCount,
    intentGroups,
    allIntentGroups,
    reviewNotes,
    faqs: intentGroups.slice(0, 5).map((intent) => faqForIntent(intent, group)),
    questions: representativeRows(contentRows).map((row) => ({
      phrase: row.phrase,
      intent: rowSignal(row).title,
      sourceCategory: row.sourceCategory,
    })),
  };
}

export function collectedPhrasesForKey(key) {
  return uniqueRows(rowsByEntryKey.get(key) || []).map((row) => row.phrase);
}

export function collectedRowsForKey(key) {
  return uniqueRows(rowsByEntryKey.get(key) || []);
}

export function collectedPhraseGroups() {
  const entriesByKey = new Map(allContentEntries().map((entry) => [entry.key, entry]));

  return [...rowsByEntryKey.entries()]
    .map(([key, rows]) => {
      const entry = entriesByKey.get(key) || getEntryByKey(key);
      const unique = uniqueRows(rows);

      return {
        key,
        entry,
        rows: unique,
        phrases: unique.map((row) => row.phrase),
        sourceCategories: [
          ...new Set(unique.map((row) => row.sourceCategory).filter(Boolean)),
        ],
      };
    })
    .filter((group) => group.entry)
    .map((group) => ({
      ...group,
      contentized: contentizeGroup(group),
    }))
    .sort((a, b) => {
      if (b.phrases.length !== a.phrases.length) {
        return b.phrases.length - a.phrases.length;
      }
      return a.entry.title.localeCompare(b.entry.title, "ko");
    });
}

export function collectedContentForKey(key) {
  return collectedPhraseGroups().find((group) => group.key === key) || null;
}

export function collectedReviewGroups(limit = 12) {
  return (classificationReview.buckets || []).slice(0, limit);
}

export function collectedReviewReasonCounts() {
  const counts = new Map();
  for (const row of phraseMap.review || []) {
    for (const reason of row.reviewReasons || ["검토 필요"]) {
      counts.set(reason, (counts.get(reason) || 0) + 1);
    }
  }

  return [...counts.entries()]
    .map(([reason, count]) => ({ reason, count }))
    .sort((a, b) => b.count - a.count || a.reason.localeCompare(b.reason, "ko"));
}

export function collectedCandidateQueue() {
  return candidateQueue;
}

export function seoDescriptionForCollection(collection, fallback) {
  if (!collection) return fallback;

  const intents = collection.contentized.intentGroups
    .slice(0, 2)
    .map((intent) => intent.title)
    .join(", ");

  const suffix = intents
    ? `수집 표현 ${collection.phrases.length.toLocaleString("ko-KR")}개를 ${intents}로 정리했습니다.`
    : `수집 표현 ${collection.phrases.length.toLocaleString("ko-KR")}개를 함께 정리했습니다.`;

  return `${fallback} ${suffix}`;
}

export function collectedStats() {
  const groups = collectedPhraseGroups();

  return {
    total: phraseMap.mapped.length,
    canonicalCount: groups.length,
    reviewCount: phraseMap.review?.length || 0,
    unmappedCount: phraseMap.unmapped?.length || 0,
    contentization: contentInventory.contentization || null,
    generatedAt: phraseMap.generatedAt,
  };
}
