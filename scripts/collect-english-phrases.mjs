import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const UA = "wisdom-research/0.1 (english worry taxonomy; contact: local)";
const REQUEST_TIMEOUT_MS = Number(process.env.EN_COLLECT_TIMEOUT_MS ?? 8000);
const DELAY_MS = Number(process.env.EN_COLLECT_DELAY_MS ?? 180);
const MAX_NODES = Number(process.env.EN_COLLECT_MAX_NODES ?? 9999);
const PHRASES_PER_NODE = Number(process.env.EN_COLLECT_PHRASES_PER_NODE ?? 4);
const REDDIT_LIMIT = Number(process.env.EN_COLLECT_REDDIT_LIMIT ?? 8);

const seedData = JSON.parse(readFileSync("data/global_phrase_seeds.json", "utf8"));
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const languageNames =
  "korean|japanese|chinese|spanish|german|french|italian|arabic|hindi|tagalog|urdu|tamil|marathi|telugu|bengali|latin";

const signalPatterns = [
  [/how (do|can) i\b/i, "how do I"],
  [/how to\b/i, "how to"],
  [/why (do|am|can't|cant|cannot) i\b/i, "why do I"],
  [/\bshould i\b/i, "should I"],
  [/\bwhat should i\b/i, "what should I"],
  [/\bis it normal\b/i, "is it normal"],
  [/\bam i wrong\b|\baita\b/i, "am I wrong / AITA"],
  [/\bdoes anyone else\b/i, "does anyone else"],
  [/\bi feel\b/i, "I feel"],
  [/\bi can't\b|\bi cannot\b|\bi cant\b/i, "I cannot"],
  [/\bdebate\b|\bpros and cons\b/i, "debate / pros and cons"],
];

const lowSignalRules = [
  [/\blife insurance\b|\binsurance policy\b|\binsurance company\b|\binsurance amount\b/i, "commercial insurance intent"],
  [new RegExp(`\\bmeaning in (${languageNames})\\b`, "i"), "translation lookup"],
  [new RegExp(`^how to say .+\\bin (${languageNames})\\b`, "i"), "language-learning lookup"],
  [new RegExp(`\\bin (${languageNames})\\b`, "i"), "language-specific translation noise"],
  [/\blyrics?\b|\bsong\b|\balbum\b|\btaylor swift\b|\bwarm gun\b/i, "entertainment lookup"],
  [/\bhuge biceps\b|\bpharmacology\b|\bamen\b/i, "off-topic autocomplete drift"],
  [/\bfor seniors\b|\bamount\b|\bcompany\b|\bpolicy\b/i, "commercial modifier"],
];

const reviewRules = [
  [/\breddit\b/i, "platform-specific query"],
  [/\bbooks?\b|\bpdf\b|\bworksheet\b|\bquotes?\b|\bsynonym\b|\bdefinition\b|\bessay\b/i, "reference/resource query"],
  [/\bbible\b|\bbiblically\b|\bchristian\b|\bchrist\b|\bislam\b/i, "faith-specific angle"],
  [/\bmeaning\b|\bphilosophy\b|\bpsychology\b|\btheory\b/i, "concept/reference angle"],
  [/\bjonathan fields\b|\bstiegler\b/i, "specific author/work drift"],
];

const userIntentRules = [
  /\bhow (do|can|should) i\b/i,
  /\bhow to\b/i,
  /\bwhy (do|am|can't|cant|cannot) i\b/i,
  /\bshould i\b/i,
  /\bwhat should i\b/i,
  /\bis it normal\b/i,
  /\bi feel\b/i,
  /\bi can't\b|\bi cannot\b|\bi cant\b/i,
  /\bfeeling\b/i,
  /\banxiety\b/i,
  /\bdebate\b|\bpros and cons\b|\barguments for and against\b|\bethical\b/i,
];

function normalizePhrase(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function addUnique(target, values) {
  for (const value of values.map(normalizePhrase).filter(Boolean)) {
    const key = value.toLowerCase();
    if (!target.some((item) => item.toLowerCase() === key)) target.push(value);
  }
}

function classifyPhrase(phrase) {
  const reasons = [];

  for (const [pattern, reason] of lowSignalRules) {
    if (pattern.test(phrase)) reasons.push(reason);
  }
  if (reasons.length > 0) return { status: "low-signal", reasons };

  for (const [pattern, reason] of reviewRules) {
    if (pattern.test(phrase)) reasons.push(reason);
  }

  const hasUserIntent = userIntentRules.some((pattern) => pattern.test(phrase));
  if (hasUserIntent && reasons.length === 0) return { status: "usable", reasons: ["user-intent phrasing"] };
  if (reasons.length > 0) return { status: "review", reasons };

  return { status: "usable", reasons: ["general topic phrasing"] };
}

function annotateCandidates(phrases) {
  return phrases.map((phrase) => ({
    phrase,
    ...classifyPhrase(phrase),
  }));
}

async function fetchJson(url) {
  const res = await fetch(url, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
  return res.json();
}

async function googleSuggest(query) {
  const url = `https://suggestqueries.google.com/complete/search?client=firefox&hl=en&gl=us&q=${encodeURIComponent(
    query
  )}`;
  try {
    const data = await fetchJson(url);
    return Array.isArray(data?.[1]) ? data[1].map(normalizePhrase) : [];
  } catch (error) {
    return { error: error.message, rows: [] };
  }
}

async function redditSignals(query) {
  const url = `https://www.reddit.com/search.json?q=${encodeURIComponent(
    query
  )}&limit=${REDDIT_LIMIT}&sort=relevance&type=link`;
  try {
    const data = await fetchJson(url);
    const counts = {};
    const posts = data?.data?.children || [];
    for (const post of posts) {
      const title = post?.data?.title || "";
      for (const [pattern, label] of signalPatterns) {
        if (pattern.test(title)) counts[label] = (counts[label] || 0) + 1;
      }
    }
    return {
      scanned: posts.length,
      patternCounts: counts,
    };
  } catch (error) {
    return {
      scanned: 0,
      patternCounts: {},
      error: error.message,
    };
  }
}

function candidateTemplates(node) {
  const title = node.canonicalTitle.trim();
  let topic = title
    .replace(/[?]/g, "")
    .replace(/^When I /i, "")
    .replace(/^When /i, "")
    .replace(/^What is /i, "")
    .replace(/^Are /i, "")
    .replace(/^Is /i, "")
    .replace(/^Do /i, "")
    .replace(/^Should /i, "")
    .replace(/^Can /i, "")
    .replace(/^Will /i, "")
    .trim()
    .toLowerCase();

  if (/^When I keep /i.test(title)) {
    topic = title.replace(/^When I keep /i, "").replace(/[?]/g, "").trim().toLowerCase();
  } else if (/^When I cannot /i.test(title)) {
    topic = `not being able to ${title
      .replace(/^When I cannot /i, "")
      .replace(/[?]/g, "")
      .trim()
      .toLowerCase()}`;
  } else if (/^When I can't /i.test(title)) {
    topic = `not being able to ${title
      .replace(/^When I can't /i, "")
      .replace(/[?]/g, "")
      .trim()
      .toLowerCase()}`;
  } else if (/^When I feel /i.test(title)) {
    topic = `feeling ${title.replace(/^When I feel /i, "").replace(/[?]/g, "").trim().toLowerCase()}`;
  } else if (/^When life feels /i.test(title)) {
    topic = `life feeling ${title
      .replace(/^When life feels /i, "")
      .replace(/[?]/g, "")
      .trim()
      .toLowerCase()}`;
  }

  if (node.axis === "debate") {
    return [
      `${topic} debate`,
      `${topic} pros and cons`,
      `arguments for and against ${topic}`,
      `is ${topic} ethical`,
    ];
  }

  if (node.axis === "thought") {
    return [
      `${topic} meaning`,
      `${topic} philosophy`,
      `how to think about ${topic}`,
      `different views on ${topic}`,
    ];
  }

  return [
    `how to deal with ${topic}`,
    `why do I struggle with ${topic}`,
    `${topic} advice`,
    `is it normal to struggle with ${topic}`,
  ];
}

async function collectNode(node) {
  const baseQueries = [...node.searchPhrases.slice(0, PHRASES_PER_NODE)];
  const suggestions = [];
  const errors = [];

  for (const query of baseQueries) {
    const result = await googleSuggest(query);
    if (Array.isArray(result)) addUnique(suggestions, result);
    else errors.push({ source: "google", query, error: result.error });
    await sleep(DELAY_MS);
  }

  const reddit = await redditSignals(node.searchPhrases[0] || node.canonicalTitle);
  await sleep(DELAY_MS);

  const candidatePhrases = [];
  addUnique(candidatePhrases, node.searchPhrases);
  addUnique(candidatePhrases, suggestions);
  addUnique(candidatePhrases, candidateTemplates(node));
  const candidateReview = annotateCandidates(candidatePhrases);

  return {
    route: node.route,
    axis: node.axis,
    canonicalTitle: node.canonicalTitle,
    translationStatus: node.translationStatus || "unknown",
    baseQueries,
    googleSuggestions: suggestions,
    redditSignals: reddit,
    candidatePhrases,
    candidateReview,
    usableCandidatePhrases: candidateReview
      .filter((candidate) => candidate.status === "usable")
      .map((candidate) => candidate.phrase),
    reviewCandidatePhrases: candidateReview
      .filter((candidate) => candidate.status === "review")
      .map((candidate) => candidate.phrase),
    lowSignalCandidatePhrases: candidateReview
      .filter((candidate) => candidate.status === "low-signal")
      .map((candidate) => candidate.phrase),
    errors,
  };
}

function writeMarkdown(rows) {
  let md = "# English-Origin Phrase Candidates\n\n";
  md += "These are English search phrases and public-pattern signals for existing Wisdom canonical nodes.\n\n";
  md += "- Google autocomplete suggestions are stored as phrases.\n";
  md += "- Reddit is used only for repeated pattern counts. Raw post titles are not stored.\n";
  md += "- Candidate phrases should be reviewed before becoming curated English copy.\n\n";

  for (const row of rows) {
    md += `## ${row.canonicalTitle} \`${row.route}\`\n\n`;
    md += `- axis: ${row.axis}\n`;
    md += `- status: ${row.translationStatus}\n`;
    md += `- google suggestions: ${row.googleSuggestions.length}\n`;
    md += `- usable candidates: ${row.usableCandidatePhrases.length}\n`;
    md += `- review candidates: ${row.reviewCandidatePhrases.length}\n`;
    md += `- low-signal candidates: ${row.lowSignalCandidatePhrases.length}\n`;
    md += `- reddit scanned: ${row.redditSignals.scanned}\n`;
    const signals = Object.entries(row.redditSignals.patternCounts || {});
    if (signals.length > 0) {
      md += `- reddit pattern signals: ${signals.map(([k, v]) => `${k} ${v}`).join(", ")}\n`;
    }
    if (row.redditSignals.error) {
      md += `- reddit error: ${row.redditSignals.error}\n`;
    }
    if (row.errors.length > 0) {
      md += `- fetch errors: ${row.errors.length}\n`;
    }

    md += "\n### Usable candidates\n\n";
    for (const phrase of row.usableCandidatePhrases.slice(0, 24)) {
      md += `- ${phrase}\n`;
    }

    if (row.reviewCandidatePhrases.length > 0) {
      md += "\n### Review candidates\n\n";
      for (const phrase of row.reviewCandidatePhrases.slice(0, 16)) {
        md += `- ${phrase}\n`;
      }
    }

    if (row.lowSignalCandidatePhrases.length > 0) {
      md += "\n### Low-signal candidates\n\n";
      for (const phrase of row.lowSignalCandidatePhrases.slice(0, 12)) {
        md += `- ${phrase}\n`;
      }
    }

    md += "\n";
  }

  writeFileSync("data/english_phrase_candidates.md", md, "utf8");
}

async function main() {
  mkdirSync("data", { recursive: true });
  const nodes = seedData.nodes
    .filter((node) => node.locale === "en-US")
    .slice(0, MAX_NODES);

  const rows = [];
  for (const [index, node] of nodes.entries()) {
    console.log(`[${index + 1}/${nodes.length}] ${node.route} - ${node.canonicalTitle}`);
    rows.push(await collectNode(node));
  }

  const payload = {
    collectedAt: new Date().toISOString(),
    locale: "en-US",
    nodesScanned: rows.length,
    totalCandidatePhrases: rows.reduce((sum, row) => sum + row.candidatePhrases.length, 0),
    totalUsableCandidatePhrases: rows.reduce((sum, row) => sum + row.usableCandidatePhrases.length, 0),
    totalReviewCandidatePhrases: rows.reduce((sum, row) => sum + row.reviewCandidatePhrases.length, 0),
    totalLowSignalCandidatePhrases: rows.reduce((sum, row) => sum + row.lowSignalCandidatePhrases.length, 0),
    rows,
  };

  writeFileSync("data/english_phrase_raw.json", `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  writeMarkdown(rows);

  console.log("English phrase collection complete");
  console.log(`nodes: ${payload.nodesScanned}`);
  console.log(`candidate phrases: ${payload.totalCandidatePhrases}`);
  console.log(`usable: ${payload.totalUsableCandidatePhrases}`);
  console.log(`review: ${payload.totalReviewCandidatePhrases}`);
  console.log(`low-signal: ${payload.totalLowSignalCandidatePhrases}`);
  console.log("files: data/english_phrase_raw.json, data/english_phrase_candidates.md");
}

main();
