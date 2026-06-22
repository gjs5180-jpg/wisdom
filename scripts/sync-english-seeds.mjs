import { readFileSync, writeFileSync } from "node:fs";
import { allContentEntries } from "../lib/content.js";

const seedPath = "data/global_phrase_seeds.json";
const seedData = JSON.parse(readFileSync(seedPath, "utf8"));

const titleOverrides = {
  "love/cant-confess": "When I cannot confess my feelings",
  "love/impatient": "When I feel impatient",
  "love/should-give-up": "When I do not know whether to give up",
  "love/cant-read-them": "When I cannot read someone's feelings",
  "love/attachment-anxiety": "When I date with anxious attachment",
  "love/relationship-boredom": "When a relationship feels stale",
  "love/reply-anxiety": "When a late text reply makes me anxious",
  "love/relationship-values": "When relationship values clash",
  "breakup/right-after": "Right after a breakup, when I fall apart",
  "breakup/lingering": "When I cannot let go",
  "breakup/obsession": "When I want to stop obsessing",
  "breakup/should-contact": "When I wonder whether to contact them again",
  "breakup/ghosting": "When I have been ghosted or left on read",
  "breakup/reunion": "When I wonder whether to get back together",
  "breakup/ex-contact": "When a message from an ex shakes me",
  "self-esteem/self-hate": "When I dislike myself",
  "self-esteem/comparing": "When I keep comparing myself",
  "self-esteem/cant-accept-praise": "When I cannot accept compliments",
  "self-esteem/falling-behind": "When I feel behind in life",
  "self-esteem/low-self-esteem": "When my self-esteem is low",
  "self-esteem/dating-self-esteem": "When low self-esteem shapes my dating life",
  "relationships/hurtful-words": "When hurtful words will not leave me",
  "relationships/cant-say-no": "When I cannot say no",
  "relationships/lonely-but-prefer-alone": "When I prefer being alone but still feel lonely",
  "relationships/drifting-friends": "When friendships drift apart",
  "relationships/people-pleasing": "When I keep people-pleasing",
  "relationships/relationship-burnout": "When relationships feel exhausting",
  "relationships/regret-words": "When I regret what I said",
  "work/dont-want-to": "When I do not want to do what I have to do",
  "work/burnout": "When I am burned out",
  "work/job-change": "When I am considering a career move",
  "work/quit-or-stay": "When I wonder whether to quit or stay",
  "work/unrecognized": "When I feel unrecognized",
  "work/work-depression": "When work makes me feel depressed",
  "work/boss-stress": "When my boss is stressing me out",
  "work/not-good-enough": "When I feel bad at my job",
  "work/workplace-relationships": "When workplace relationships are hard",
  "work/work-skepticism": "When work feels pointless",
  "meaning/no-motivation": "When I have no motivation",
  "meaning/dont-know-want": "When I do not know what I want",
  "meaning/fear-death": "When I am afraid of death",
  "meaning/meaningless": "When life feels meaningless",
  "meaning/emptiness": "When I feel empty",
  "meaning/no-goal": "When I have no goal",
  "meaning/wandering": "When I feel lost",
  "family/parent-conflict": "When conflict with my parents is intense",
  "family/independence": "When I want independence but hesitate",
  "family/holiday-stress": "When family holidays are stressful",
  "family/family-cutoff": "When I am considering cutting off family",
  "family/mother-conflict": "When I do not get along with my mother",
  "money/future-anxiety": "When money and the future make me anxious",
  "study/cant-study": "When I cannot study",
  "study/exam-anxiety": "When exam anxiety is high",
  "digital/dopamine-addiction": "When I want to break phone and dopamine loops",
  "body/body-anxiety": "When I dislike my body or appearance",
  "body/health-anxiety": "When health anxiety is strong",
  "body/insomnia": "When insomnia is painful",
  "body/aging-anxiety": "When aging makes me anxious",
  "body/hair-loss-stress": "When hair loss stress is heavy",
  "career/dream-reality": "When I wonder whether to give up my dream",
  "career/regret-free-choice": "When I want to choose without regret",
  "career/decision-paralysis": "When decision paralysis is severe",
  "thought/good-life": "What is a good life?",
  "thought/happiness": "What is happiness?",
  "thought/success": "What is success?",
  "thought/freedom": "What is freedom?",
  "debate/white-lie": "Are white lies acceptable?",
  "debate/marriage": "Do we have to get married?",
  "debate/euthanasia": "Should euthanasia be allowed?",
  "debate/death-penalty": "Should the death penalty remain?",
  "debate/abortion": "How far should abortion be allowed?",
  "debate/animal-testing": "Can animal testing be justified?",
  "debate/no-kids-zone": "Are no-kids zones discrimination or a right?",
  "debate/juvenile-offenders": "Should punishment for juvenile offenders be strengthened?",
  "debate/meritocracy": "Is meritocracy fair?",
  "debate/basic-income": "Is basic income necessary?",
  "debate/ai-replacement": "Will AI replace human jobs?",
  "debate/ai-art": "Is AI-generated art real art?",
  "debate/cohabitation": "Is premarital cohabitation acceptable?",
  "debate/vegetarianism": "Is veganism an ethical duty?",
  "debate/parent-support": "Is supporting parents a child's duty?",
  "debate/childfree": "Do we have to have children?",
  "debate/pet-euthanasia": "Is pet euthanasia acceptable?",
  "debate/remote-work": "Should remote work keep expanding?",
  "debate/retirement-age": "Should the retirement age be raised?",
  "debate/employment-contract": "How fair is the gap between regular and contract workers?",
  "debate/cancel-culture": "Is cancel culture accountability or mob punishment?",
  "debate/school-corporal-punishment": "Is school corporal punishment education or violence?",
  "debate/nice-people-finish-last": "Do nice people finish last?",
};

function slotForEntry(entry) {
  if (entry.axis === "thought") return entry.key.replace(/^thought\//, "");
  return entry.key;
}

function topicFromTitle(title) {
  return title
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
}

function generatedSearchPhrases(entry, title) {
  const topic = topicFromTitle(title);
  if (entry.axis === "debate") {
    return [
      title.toLowerCase(),
      `${topic} debate`,
      `${topic} pros and cons`,
      `arguments about ${topic}`,
    ];
  }
  if (entry.axis === "thought") {
    return [
      title.toLowerCase(),
      `${topic} meaning`,
      `${topic} philosophy`,
      `how to think about ${topic}`,
    ];
  }
  return [
    title.toLowerCase(),
    `how to deal with ${topic}`,
    `why ${topic}`,
    `${topic} advice`,
  ];
}

function generatedUserDoors(entry, title) {
  const topic = topicFromTitle(title);
  if (entry.axis === "debate") {
    return [
      "I want to compare the strongest arguments before taking a side.",
      "I need the ethical, social, and institutional layers separated.",
      `This question keeps coming back as a real debate about ${topic}.`,
    ];
  }
  if (entry.axis === "thought") {
    return [
      "I want to compare definitions rather than settle for one slogan.",
      "I need several durable ways to frame this question.",
      `This question keeps returning whenever I ask about ${topic}.`,
    ];
  }
  return [
    `I keep returning to this situation: ${topic}.`,
    "I want a clearer frame before reacting from anxiety or habit.",
    "I need source-backed perspectives, not a quick slogan.",
  ];
}

function generatedLenses(entry) {
  if (entry.axis === "debate") return ["philosophy", "institution", "practice"];
  if (entry.axis === "thought") return ["philosophy", "practice"];
  return ["philosophy", "research", "practice"];
}

function generatedSeed(entry, priority) {
  const canonicalTitle = titleOverrides[entry.key] || entry.title;
  return {
    locale: "en-US",
    slot: slotForEntry(entry),
    axis: entry.axis,
    route: entry.href,
    canonicalTitle,
    searchPhrases: generatedSearchPhrases(entry, canonicalTitle),
    userDoors: generatedUserDoors(entry, canonicalTitle),
    priority,
    lenses: generatedLenses(entry),
    translationStatus: "draft",
  };
}

const existingByRoute = new Map(seedData.nodes.map((node) => [node.route, node]));
const entries = allContentEntries();
let maxPriority = seedData.nodes.reduce((max, node) => Math.max(max, node.priority || 0), 0);

const syncedNodes = entries.map((entry) => {
  const base = generatedSeed(entry, ++maxPriority);
  const existing = existingByRoute.get(entry.href);
  if (!existing) return base;

  return {
    ...base,
    ...existing,
    locale: "en-US",
    slot: existing.slot || base.slot,
    axis: entry.axis,
    route: entry.href,
    priority: existing.priority || base.priority,
    translationStatus: existing.translationStatus || "curated-seed",
  };
});

const nextData = {
  ...seedData,
  locales: ["en-US"],
  nodes: syncedNodes.sort((a, b) => a.priority - b.priority || a.route.localeCompare(b.route)),
};

writeFileSync(seedPath, `${JSON.stringify(nextData, null, 2)}\n`, "utf8");

const curated = nextData.nodes.filter((node) => node.translationStatus !== "draft").length;
const draft = nextData.nodes.length - curated;
console.log(`English seeds synced: ${nextData.nodes.length} total (${curated} curated, ${draft} draft)`);
