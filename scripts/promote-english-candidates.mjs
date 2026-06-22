import { readFileSync, writeFileSync } from "node:fs";

const seedPath = "data/global_phrase_seeds.json";
const rawPath = "data/english_phrase_raw.json";
const reportPath = "data/english_phrase_promotion_report.md";
const SEARCH_LIMIT = Number(process.env.EN_PROMOTE_SEARCH_LIMIT ?? 10);
const USER_DOOR_LIMIT = Number(process.env.EN_PROMOTE_USER_DOOR_LIMIT ?? 4);

const seedData = JSON.parse(readFileSync(seedPath, "utf8"));
const rawData = JSON.parse(readFileSync(rawPath, "utf8"));
const rowsByRoute = new Map(rawData.rows.map((row) => [row.route, row]));

const obviousNoisePatterns = [
  /\bbioterrorist\b/i,
  /\bmiis?\b/i,
  /\bbaby shower\b/i,
  /\bpregnan(cy|t)\b/i,
  /\bpilot retirement\b/i,
  /\bwith women\b|\bwith girls\b/i,
  /\blegal in [a-z]+/i,
  /\blegal in (india|philippines|singapore|thailand|japan|canada|uk|australia)\b/i,
  /\bwill .* in 2025\b/i,
  /\bwith when\b/i,
  /\bnot know whether\b/i,
  /\bdate with anxious attachment\b/i,
  /\ba relationship feels stale\b/i,
  /\ba late text reply makes me anxious\b/i,
  /\brelationship values clash\b/i,
  /\bright after a breakup, when\b/i,
  /\bwant to stop obsessing\b/i,
  /\bwonder whether to\b/i,
  /\bhave been ghosted or left on read\b/i,
  /\ba message from an ex shakes me\b/i,
  /^[a-z\s-]+ be (allowed|justified|raised|strengthened)\b/i,
  /\bis justified debate\b/i,
  /\b(acceptable|necessary|fair|real art|ethical duty|a child's duty|discrimination or a right|keep expanding|finish last) (debate|pros and cons)\b/i,
  /\b(acceptable|necessary|fair|real art|ethical duty|a child's duty) ethical\b/i,
  /\bis .* (keep expanding|finish last|discrimination or a right) ethical\b/i,
  /\bhow to think about what is\b/i,
  /\bwhy can i\b/i,
  /^when i\b/i,
  /\?.+\b(meaning|philosophy|advice)\b/i,
  /\bhow to deal with (cannot|feel|date with|not know|right after|a late|relationship values clash)\b/i,
  /\bwhy (cannot|feel|not know|a late|right after|relationship values clash)\b/i,
  /\bis (we|how|the) .+ ethical\b/i,
  /\bethical ethical\b/i,
  /\barguments about (we|how fair|the retirement age)\b/i,
];

const resourcePatterns = /\breddit\b|\bbooks?\b|\bpdf\b|\bworksheet\b|\bquotes?\b|\bsynonym\b|\bdefinition\b/i;
const userIntentPatterns = [
  /\bhow (do|can|should) i\b/i,
  /\bhow to\b/i,
  /\bwhy (do|am|can't|cant|cannot) i\b/i,
  /\bshould i\b/i,
  /\bis it normal\b/i,
  /\bcan i\b/i,
  /\bwill .+\b/i,
  /\bfeeling\b/i,
  /\banxiety\b/i,
  /\bdebate\b|\bpros and cons\b|\barguments for and against\b|\bethical\b/i,
];

const wordStoplist = new Set([
  "a",
  "an",
  "and",
  "are",
  "be",
  "being",
  "between",
  "can",
  "cannot",
  "do",
  "does",
  "feel",
  "feels",
  "for",
  "get",
  "have",
  "how",
  "i",
  "is",
  "it",
  "keep",
  "me",
  "my",
  "of",
  "or",
  "real",
  "should",
  "the",
  "to",
  "we",
  "what",
  "when",
  "whether",
  "why",
  "will",
  "with",
]);

const topicOverrides = {
  "good-life": "a good life",
  happiness: "happiness",
  "relationships/people-pleasing": "people-pleasing",
  "relationships/cant-say-no": "saying no",
  "self-esteem/comparing": "comparing myself to others",
  "self-esteem/falling-behind": "feeling behind in life",
  "meaning/meaningless": "life feeling meaningless",
  "debate/ai-replacement": "AI replacing jobs",
  "love/cant-confess": "confessing my feelings",
  "love/impatient": "feeling impatient",
  "love/should-give-up": "giving up or holding on",
  "love/cant-read-them": "reading someone's feelings",
  "love/attachment-anxiety": "anxious attachment in dating",
  "love/relationship-boredom": "relationship boredom",
  "love/reply-anxiety": "text reply anxiety",
  "love/relationship-values": "relationship value conflicts",
  "breakup/right-after": "falling apart after a breakup",
  "breakup/lingering": "not being able to let go",
  "breakup/obsession": "obsessing after a breakup",
  "breakup/should-contact": "contacting an ex after a breakup",
  "breakup/ghosting": "being ghosted",
  "breakup/reunion": "getting back together after a breakup",
  "breakup/ex-contact": "hearing from an ex",
  "self-esteem/self-hate": "self-hatred",
  "self-esteem/cant-accept-praise": "not accepting compliments",
  "self-esteem/low-self-esteem": "low self-esteem",
  "self-esteem/dating-self-esteem": "low self-esteem in dating",
  "relationships/hurtful-words": "hurtful words",
  "relationships/lonely-but-prefer-alone": "feeling lonely but wanting to be alone",
  "relationships/drifting-friends": "friendships drifting apart",
  "relationships/relationship-burnout": "relationship burnout",
  "relationships/regret-words": "regretting what I said",
  "work/dont-want-to": "not wanting to do what I have to do",
  "work/burnout": "burnout",
  "work/job-change": "career change",
  "work/quit-or-stay": "quitting or staying at a job",
  "work/unrecognized": "feeling unrecognized at work",
  "work/work-depression": "work depression",
  "work/boss-stress": "boss stress",
  "work/not-good-enough": "feeling bad at my job",
  "work/workplace-relationships": "workplace relationships",
  "work/work-skepticism": "work feeling pointless",
  "meaning/no-motivation": "having no motivation",
  "meaning/dont-know-want": "not knowing what I want",
  "meaning/fear-death": "fear of death",
  "meaning/emptiness": "feeling empty",
  "meaning/no-goal": "having no goal",
  "meaning/wandering": "feeling lost in life",
  "family/parent-conflict": "conflict with parents",
  "family/independence": "wanting independence from family",
  "family/holiday-stress": "family holiday stress",
  "family/family-cutoff": "cutting off family",
  "family/mother-conflict": "conflict with mother",
  "money/future-anxiety": "money and future anxiety",
  "study/cant-study": "not being able to study",
  "study/exam-anxiety": "exam anxiety",
  "digital/dopamine-addiction": "phone and dopamine loops",
  "body/body-anxiety": "body image anxiety",
  "body/health-anxiety": "health anxiety",
  "body/insomnia": "insomnia",
  "body/aging-anxiety": "aging anxiety",
  "body/hair-loss-stress": "hair loss stress",
  "career/dream-reality": "giving up on a dream",
  "career/regret-free-choice": "choosing without regret",
  "career/decision-paralysis": "decision paralysis",
  success: "success",
  freedom: "freedom",
  "debate/white-lie": "white lies",
  "debate/marriage": "marriage",
  "debate/euthanasia": "euthanasia",
  "debate/death-penalty": "the death penalty",
  "debate/abortion": "abortion",
  "debate/animal-testing": "animal testing",
  "debate/no-kids-zone": "no-kids zones",
  "debate/juvenile-offenders": "juvenile offender punishment",
  "debate/meritocracy": "meritocracy",
  "debate/basic-income": "basic income",
  "debate/ai-art": "AI-generated art",
  "debate/cohabitation": "premarital cohabitation",
  "debate/vegetarianism": "veganism ethics",
  "debate/parent-support": "supporting parents",
  "debate/childfree": "having children",
  "debate/pet-euthanasia": "pet euthanasia",
  "debate/remote-work": "remote work",
  "debate/retirement-age": "raising the retirement age",
  "debate/employment-contract": "regular and contract worker inequality",
  "debate/cancel-culture": "cancel culture",
  "debate/school-corporal-punishment": "school corporal punishment",
  "debate/nice-people-finish-last": "nice people finishing last",
};

const phraseBoosts = {
  "good-life": [
    "what is a good life",
    "how to live a good life",
    "what makes life worth living",
    "how should I live my life",
    "living a meaningful life",
    "good life philosophy",
    "eudaimonia meaning",
    "what makes a life meaningful",
  ],
  happiness: [
    "what is happiness",
    "how to be happy",
    "why am I not happy",
    "happiness and money",
    "does money buy happiness",
    "meaning vs happiness",
    "what makes people happy",
    "happiness philosophy",
  ],
  "relationships/people-pleasing": [
    "people pleasing",
    "how to stop people pleasing",
    "people pleaser meaning",
    "why do I care what people think",
    "always trying to make everyone happy",
    "fear of disappointing people",
    "approval seeking",
    "people-pleasing advice",
  ],
  "relationships/cant-say-no": [
    "how to say no",
    "why can't I say no",
    "setting boundaries",
    "how to set boundaries without guilt",
    "can't say no to people",
    "fear of saying no",
    "boundary setting in relationships",
    "saying no without guilt",
  ],
  "self-esteem/comparing": [
    "comparing myself to others",
    "how to stop comparing yourself",
    "social comparison anxiety",
    "comparison is stealing my joy",
    "instagram comparison",
    "feeling inferior to others",
    "why do I compare myself to everyone",
    "social media comparison",
  ],
  "self-esteem/falling-behind": [
    "feeling behind in life",
    "I feel behind everyone else",
    "life timeline anxiety",
    "behind in career and life",
    "everyone is ahead of me",
    "too late to start over",
    "comparison anxiety",
    "feeling behind at my age",
  ],
  "meaning/meaningless": [
    "life feels meaningless",
    "what is the point of life",
    "why keep living",
    "existential crisis",
    "nihilism",
    "how to deal with meaninglessness",
    "nothing matters",
    "life feels empty and meaningless",
  ],
  "debate/ai-replacement": [
    "will ai replace jobs",
    "ai job replacement",
    "jobs safe from ai",
    "ai unemployment",
    "future of work with ai",
    "ai and work debate",
    "will my job be automated",
    "AI replacing jobs debate",
  ],
  "love/should-give-up": [
    "should I give up on them",
    "should I keep trying or move on",
    "when to stop trying in a relationship",
    "should I give up or keep fighting",
    "how to know when to give up",
  ],
  "love/reply-anxiety": [
    "late reply anxiety",
    "anxious when someone doesn't text back",
    "why do late replies make me anxious",
    "overthinking text replies",
    "anxiety waiting for a text back",
  ],
  "love/relationship-values": [
    "relationship values mismatch",
    "different values in a relationship",
    "when values don't align in a relationship",
    "incompatible values relationship",
    "core values conflict relationship",
  ],
  "breakup/right-after": [
    "how to cope right after a breakup",
    "what to do after a breakup",
    "can't function after breakup",
    "breakup pain feels unbearable",
    "falling apart after a breakup",
  ],
  "breakup/obsession": [
    "how to stop obsessing over an ex",
    "obsessive thoughts after breakup",
    "can't stop thinking about my ex",
    "rumination after breakup",
    "how to stop obsessing",
  ],
  "breakup/should-contact": [
    "should I contact my ex",
    "should I text my ex after breakup",
    "urge to contact ex",
    "no contact after breakup",
    "should I break no contact",
  ],
  "breakup/ghosting": [
    "what to do when ghosted",
    "why did they ghost me",
    "ghosted and left on read",
    "how to move on after being ghosted",
    "being left on read anxiety",
  ],
  "breakup/reunion": [
    "should I get back with my ex",
    "getting back together after breakup",
    "signs you should get back together",
    "should we try again after breakup",
    "is getting back with an ex a good idea",
  ],
  "breakup/ex-contact": [
    "ex texted me what should I do",
    "why did my ex text me",
    "hearing from an ex after breakup",
    "hearing from an ex after no contact",
    "ex contact after breakup",
    "ex reaching out after no contact",
    "what does it mean when an ex contacts you",
  ],
  "work/quit-or-stay": [
    "should I quit my job",
    "should I stay or leave my job",
    "when to quit a job",
    "job burnout quit or stay",
    "afraid to quit my job",
  ],
  "career/dream-reality": [
    "should I give up on my dream",
    "when to give up on a dream",
    "dream vs reality career",
    "should I keep chasing my dream",
    "fear of regretting giving up",
  ],
  "debate/abortion": [
    "abortion rights debate",
    "pro choice pro life arguments",
    "abortion ethics debate",
    "arguments for abortion rights",
    "arguments against abortion",
  ],
  "debate/animal-testing": [
    "is animal testing ethical",
    "animal testing ethics",
    "should animal testing be banned",
    "arguments against animal testing",
    "arguments for animal testing",
  ],
  "debate/juvenile-offenders": [
    "juvenile justice debate",
    "should juveniles be tried as adults",
    "juvenile punishment pros and cons",
    "youth crime punishment debate",
    "juvenile offenders rehabilitation vs punishment",
  ],
  "debate/retirement-age": [
    "should retirement age be raised",
    "retirement age debate",
    "raising retirement age arguments",
    "retirement age policy debate",
    "pros and cons of raising retirement age",
  ],
  "debate/childfree": [
    "childfree debate",
    "choosing not to have children",
    "is it okay to not have children",
    "not wanting children debate",
    "childfree by choice",
    "do I have to have children",
    "do we have to have children",
  ],
  "debate/pet-euthanasia": [
    "pet euthanasia debate",
    "pet euthanasia ethics",
    "pet euthanasia pros and cons",
    "is pet euthanasia ethical",
    "arguments for and against pet euthanasia",
    "is pet euthanasia acceptable",
  ],
  "debate/remote-work": [
    "remote work debate",
    "remote work pros and cons",
    "future of remote work",
    "arguments for and against remote work",
    "should remote work continue",
    "remote work productivity debate",
  ],
  "debate/nice-people-finish-last": [
    "do nice people finish last",
    "nice people finish last debate",
    "nice people finishing last",
    "kindness and success debate",
    "do nice guys finish last",
    "nice people success relationships",
  ],
};

function normalizePhrase(value) {
  return String(value || "")
    .replace(/\s+/g, " ")
    .trim();
}

function phraseKey(value) {
  return normalizePhrase(value).toLowerCase();
}

function addUnique(target, phrases) {
  for (const phrase of phrases.map(normalizePhrase).filter(Boolean)) {
    const key = phraseKey(phrase);
    if (!target.some((item) => phraseKey(item) === key)) target.push(phrase);
  }
}

function contentWords(value) {
  return normalizePhrase(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .map((word) => word.replace(/^-|-$/g, ""))
    .filter((word) => (word.length > 2 || word === "ex") && !wordStoplist.has(word));
}

function topicForNode(node) {
  return topicOverrides[node.slot] || topicOverrides[node.slot.replace(/^debate\//, "debate/")] || node.canonicalTitle;
}

function candidateMap(row) {
  return new Map((row?.candidateReview || []).map((candidate) => [phraseKey(candidate.phrase), candidate]));
}

function isUserIntentPhrase(phrase) {
  return userIntentPatterns.some((pattern) => pattern.test(phrase));
}

function keepReviewPhrase(phrase, node) {
  if (resourcePatterns.test(phrase)) return false;
  if (/\bbible\b|\bchristian\b|\bislam\b/i.test(phrase)) return false;
  if (node.axis === "thought") return /\bmeaning\b|\bphilosophy\b|\bpsychology\b|\btheory\b/i.test(phrase);
  if (node.axis === "debate") return /\bdebate\b|\bpros and cons\b|\barguments\b|\bethical\b/i.test(phrase);
  return false;
}

function hasEnoughTopicOverlap(phrase, node) {
  const phraseWords = new Set(contentWords(phrase));
  const topicWords = contentWords(`${node.canonicalTitle} ${topicForNode(node)} ${node.slot}`);
  return topicWords.some((word) => phraseWords.has(word) || phrase.includes(word));
}

function isPromotablePhrase(phrase, node, row, candidates) {
  const normalized = normalizePhrase(phrase);
  if (!normalized || normalized.length > 96) return false;
  if (obviousNoisePatterns.some((pattern) => pattern.test(normalized))) return false;

  const candidate = candidates.get(phraseKey(normalized));
  if (candidate?.status === "low-signal") return false;
  if (candidate?.status === "review" && !keepReviewPhrase(normalized, node)) return false;
  if (resourcePatterns.test(normalized) && !keepReviewPhrase(normalized, node)) return false;

  if (!hasEnoughTopicOverlap(normalized.toLowerCase(), node)) {
    return node.axis === "debate" && /\bdebate\b|\bpros and cons\b|\barguments\b/i.test(normalized);
  }

  return true;
}

function phraseScore(phrase, node, originalSearchPhrases) {
  let score = 0;
  const lower = phraseKey(phrase);
  const fallbackKeys = new Set(fallbackSearchPhrases(node).map(phraseKey));
  const boostKeys = new Set((phraseBoosts[node.slot] || []).map(phraseKey));

  if (boostKeys.has(lower)) score += 12;
  if (originalSearchPhrases.some((item) => phraseKey(item) === lower)) score += node.translationStatus === "curated-seed" ? 4 : 2;
  if (fallbackKeys.has(lower)) score += 7;
  if (isUserIntentPhrase(phrase)) score += 5;
  if (node.axis === "debate" && /\bdebate\b|\bpros and cons\b|\barguments for and against\b/i.test(phrase)) score += 4;
  if (node.axis === "thought" && /\bmeaning\b|\bphilosophy\b|\bdifferent views\b/i.test(phrase)) score += 3;
  if (lower.startsWith("when ")) score -= 1;
  if (/\bhow to deal with\b/i.test(phrase)) score -= 2;
  if (phrase.length > 70) score -= 2;
  if (phrase.length < 18) score += 1;

  return score;
}

function fallbackSearchPhrases(node) {
  const topic = topicForNode(node);
  if (node.axis === "debate") {
    return [
      node.canonicalTitle.toLowerCase(),
      `${topic} debate`,
      `${topic} pros and cons`,
      `arguments for and against ${topic}`,
    ];
  }
  if (node.axis === "thought") {
    return [
      node.canonicalTitle.toLowerCase(),
      `${topic} meaning`,
      `${topic} philosophy`,
      `different views on ${topic}`,
      `how to think about ${topic}`,
    ];
  }
  return [
    node.canonicalTitle.toLowerCase(),
    topic,
    `how to deal with ${topic}`,
    `${topic} advice`,
    `why do I struggle with ${topic}`,
  ];
}

function promotedSearchPhrases(node, row) {
  const candidates = candidateMap(row);
  const isCurated = node.translationStatus === "curated-seed";
  const pool = [];
  const sourcePhrases = [
    ...(row?.usableCandidatePhrases || []),
    ...(row?.reviewCandidatePhrases || []),
  ];

  if (isCurated) addUnique(pool, node.searchPhrases || []);
  addUnique(pool, phraseBoosts[node.slot] || []);
  addUnique(pool, fallbackSearchPhrases(node));
  addUnique(pool, sourcePhrases);
  if (!isCurated) addUnique(pool, node.searchPhrases || []);

  const filtered = pool.filter((phrase) => isPromotablePhrase(phrase, node, row, candidates));
  const ordered = filtered.sort(
    (a, b) => phraseScore(b, node, node.searchPhrases || []) - phraseScore(a, node, node.searchPhrases || [])
  );

  const selected = [];
  addUnique(selected, ordered);

  return selected.slice(0, SEARCH_LIMIT);
}

function userDoorTopic(node) {
  return topicForNode(node).replace(/\bI\b/g, "I");
}

function generatedUserDoors(node, searchPhrases) {
  const topic = userDoorTopic(node);
  const intentPhrase =
    searchPhrases.find((phrase) => /^why do i|^why am i|^how to|^should i|^is it normal/i.test(phrase)) ||
    searchPhrases[0];

  if (node.axis === "debate") {
    return [
      "I want to see the strongest arguments on both sides before taking a position.",
      `I need the ethical, social, and practical stakes around ${topic} separated clearly.`,
      "I want to know where reasonable people actually disagree.",
      intentPhrase ? `People often enter this debate through searches like: ${intentPhrase}.` : "",
    ].filter(Boolean);
  }

  if (node.axis === "thought") {
    return [
      "I want more than a slogan; I need the main ways people define this question.",
      `I want to compare philosophical, psychological, and practical answers about ${topic}.`,
      "I need a frame that helps me think without pretending there is one final answer.",
      intentPhrase ? `A common search doorway is: ${intentPhrase}.` : "",
    ].filter(Boolean);
  }

  return [
    `This shows up in my life as ${topic}.`,
    "I want to understand what is happening before I react from anxiety or habit.",
    "I need perspectives that make the situation clearer and give me a next step.",
    intentPhrase ? `A common search doorway is: ${intentPhrase}.` : "",
  ].filter(Boolean);
}

function promotedUserDoors(node, searchPhrases) {
  if (node.translationStatus === "curated-seed" && (node.userDoors || []).length >= 3) {
    return node.userDoors.slice(0, USER_DOOR_LIMIT);
  }
  return generatedUserDoors(node, searchPhrases).slice(0, USER_DOOR_LIMIT);
}

const reportRows = [];
const nextNodes = seedData.nodes.map((node) => {
  const row = rowsByRoute.get(node.route);
  if (!row) return node;

  const beforeSearch = node.searchPhrases?.length || 0;
  const searchPhrases = promotedSearchPhrases(node, row);
  const userDoors = promotedUserDoors(node, searchPhrases);
  const isCurated = node.translationStatus === "curated-seed";
  const nextStatus = isCurated
    ? node.translationStatus
    : searchPhrases.length >= 6
      ? "phrase-enriched"
      : "draft";

  reportRows.push({
    route: node.route,
    title: node.canonicalTitle,
    status: `${node.translationStatus} -> ${nextStatus}`,
    beforeSearch,
    afterSearch: searchPhrases.length,
    firstPhrases: searchPhrases.slice(0, 5),
  });

  return {
    ...node,
    searchPhrases,
    userDoors,
    translationStatus: nextStatus,
    englishCandidateStats: {
      collectedAt: rawData.collectedAt,
      total: row.candidatePhrases?.length || 0,
      usable: row.usableCandidatePhrases?.length || 0,
      review: row.reviewCandidatePhrases?.length || 0,
      lowSignal: row.lowSignalCandidatePhrases?.length || 0,
    },
  };
});

const nextData = {
  ...seedData,
  nodes: nextNodes,
};

let report = "# English Phrase Promotion Report\n\n";
report += `Collected at: ${rawData.collectedAt}\n\n`;
report += `Search phrase limit: ${SEARCH_LIMIT}\n\n`;
for (const row of reportRows) {
  report += `## ${row.title} \`${row.route}\`\n\n`;
  report += `- status: ${row.status}\n`;
  report += `- search phrases: ${row.beforeSearch} -> ${row.afterSearch}\n`;
  report += "\n";
  for (const phrase of row.firstPhrases) report += `- ${phrase}\n`;
  report += "\n";
}

writeFileSync(seedPath, `${JSON.stringify(nextData, null, 2)}\n`, "utf8");
writeFileSync(reportPath, report, "utf8");

const enriched = nextNodes.filter((node) => node.translationStatus === "phrase-enriched").length;
const draft = nextNodes.filter((node) => node.translationStatus === "draft").length;
const curated = nextNodes.filter((node) => node.translationStatus === "curated-seed").length;
const phraseCount = nextNodes.reduce((sum, node) => sum + node.searchPhrases.length, 0);

console.log("English candidates promoted");
console.log(`curated: ${curated}`);
console.log(`phrase-enriched: ${enriched}`);
console.log(`draft: ${draft}`);
console.log(`search phrases: ${phraseCount}`);
console.log(`report: ${reportPath}`);
