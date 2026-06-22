import { readFileSync, writeFileSync } from "node:fs";
import {
  cardNameLabelEn,
  contentForEnglishSeed,
  perspectiveLensLabelEn,
  sourceTypeLabelEn,
} from "../lib/global-content.js";

const seedPath = "data/global_phrase_seeds.json";
const seedData = JSON.parse(readFileSync(seedPath, "utf8"));
const curatedAt = "2026-06-21";

const categoryFrames = {
  love: {
    domain: "love",
    tension: "desire, timing, fear, and another person's freedom",
    action: "expression, patience, and the boundary between honesty and control",
  },
  breakup: {
    domain: "breakup",
    tension: "loss, memory, dignity, and the urge to undo pain",
    action: "grief, distance, and one next choice that does not deepen the wound",
  },
  "self-esteem": {
    domain: "self-worth",
    tension: "self-judgment, comparison, shame, and evidence",
    action: "a smaller, fairer judgment and one behavior that rebuilds agency",
  },
  relationships: {
    domain: "relationships",
    tension: "closeness, boundaries, responsibility, and hurt",
    action: "what belongs to you, what belongs to the other person, and what needs to be said clearly",
  },
  work: {
    domain: "work",
    tension: "time, identity, money, recognition, and exhaustion",
    action: "what can be adjusted, endured, negotiated, or left",
  },
  meaning: {
    domain: "meaning",
    tension: "emptiness, freedom, death, direction, and the need for a reason",
    action: "one frame that makes the next step possible without pretending life is simple",
  },
  family: {
    domain: "family",
    tension: "love, duty, dependence, boundaries, and old roles",
    action: "where care ends, where self-protection begins, and what can be negotiated",
  },
  money: {
    domain: "money and the future",
    tension: "security, uncertainty, comparison, and survival pressure",
    action: "the next concrete choice that reduces confusion rather than feeding panic",
  },
  study: {
    domain: "study",
    tension: "pressure, attention, fear of failure, and delayed reward",
    action: "one repeatable study behavior instead of a total judgment about yourself",
  },
  digital: {
    domain: "digital habit",
    tension: "attention, reward loops, boredom, and control",
    action: "one environmental change that makes the desired behavior easier",
  },
  body: {
    domain: "body and health",
    tension: "control, fear, appearance, aging, symptoms, and self-respect",
    action: "what needs care, what needs medical attention, and what needs a kinder judgment",
  },
  career: {
    domain: "career decision",
    tension: "regret, identity, risk, timing, and responsibility",
    action: "a decision that can be tested rather than endlessly imagined",
  },
};

function normalize(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function titleAsTopic(title) {
  const value = normalize(title);

  if (/^When I feel /i.test(value)) {
    return `feeling ${value.replace(/^When I feel /i, "").replace(/[?]/g, "").toLowerCase()}`;
  }

  if (/^When I am afraid of /i.test(value)) {
    return `fear of ${value.replace(/^When I am afraid of /i, "").replace(/[?]/g, "").toLowerCase()}`;
  }

  if (/^When I have no /i.test(value)) {
    return `having no ${value.replace(/^When I have no /i, "").replace(/[?]/g, "").toLowerCase()}`;
  }

  if (/^When I cannot /i.test(value)) {
    return `not being able to ${value.replace(/^When I cannot /i, "").replace(/[?]/g, "").toLowerCase()}`;
  }

  return value
    .replace(/[?]/g, "")
    .replace(/^When I /i, "")
    .replace(/^When /i, "")
    .replace(/^What is /i, "")
    .replace(/^Is /i, "")
    .replace(/^Are /i, "")
    .replace(/^Do /i, "")
    .replace(/^Should /i, "")
    .replace(/^Can /i, "")
    .replace(/^Will /i, "")
    .trim()
    .toLowerCase();
}

function cleanTopicCandidate(value) {
  return normalize(value)
    .replace(/[?]/g, "")
    .replace(/^a common search doorway is:\s*/i, "")
    .replace(/^why do i struggle with\s+/i, "")
    .replace(/^how to deal with\s+/i, "")
    .replace(/^how to think about\s+/i, "")
    .replace(/^what to do when\s+/i, "")
    .replace(/^what is\s+/i, "")
    .replace(/^is it normal to\s+/i, "")
    .replace(/^should i\s+/i, "")
    .replace(/^can i\s+/i, "")
    .replace(/^do we have to\s+/i, "")
    .replace(/^will\s+/i, "")
    .replace(/^arguments for and against\s+/i, "")
    .replace(/\s+advice$/i, "")
    .replace(/\s+debate$/i, "")
    .replace(/\s+pros and cons$/i, "")
    .replace(/\s+meaning$/i, "")
    .replace(/\s+philosophy$/i, "")
    .replace(/\s+ethical$/i, "")
    .replace(/^have no motivation$/i, "no motivation")
    .replace(/^have no goal$/i, "having no goal")
    .replace(/^hurtful words will not leave me$/i, "hurtful words that will not leave me")
    .replace(/^conflict with my parents is intense$/i, "intense conflict with my parents")
    .replace(/^insomnia is painful$/i, "painful insomnia")
    .replace(/^health anxiety is strong$/i, "strong health anxiety")
    .replace(/^aging makes me anxious$/i, "anxiety about aging")
    .replace(/^hair loss stress is heavy$/i, "hair loss stress")
    .replace(/^work makes me feel depressed$/i, "work depression")
    .replace(/^workplace relationships are hard$/i, "difficult workplace relationships")
    .replace(/^work feels pointless$/i, "work feeling pointless")
    .replace(/^money and the future make me anxious$/i, "money and future anxiety")
    .replace(/^do i have to have children$/i, "having children")
    .replace(/^we have to have children$/i, "having children")
    .trim();
}

function routeCategory(node) {
  return node.route.split("/").filter(Boolean)[0] || node.axis;
}

function topicFor(node) {
  const firstPhrase = node.searchPhrases?.[0];
  if (firstPhrase && firstPhrase.length < 84) {
    const cleaned = cleanTopicCandidate(firstPhrase);
    if (cleaned && cleaned.length > 2 && cleaned.length < 64) return cleaned;
  }
  return cleanTopicCandidate(titleAsTopic(node.canonicalTitle));
}

function frameFor(node) {
  return categoryFrames[routeCategory(node)] || categoryFrames.meaning;
}

function pageLeadFor(node) {
  const topic = topicFor(node);
  const frame = frameFor(node);

  if (node.axis === "debate") {
    return `This debate is not only about answering yes or no. It asks which values collide around ${topic}, and what each side would cost in practice.`;
  }

  if (node.axis === "thought") {
    return `This question should not be closed with one slogan. It needs several durable definitions, then a way to choose which one can actually guide a life.`;
  }

  return `This page treats ${topic} as a real ${frame.domain} problem, not just a mood. The point is to separate ${frame.tension}, then find ${frame.action}.`;
}

function metaDescriptionFor(node) {
  const topic = topicFor(node);
  if (node.axis === "debate") {
    return `A structured guide to the ${topic} debate, with source-backed perspectives and practical stakes.`;
  }
  if (node.axis === "thought") {
    return `A source-backed map of ${topic}, comparing philosophical, practical, and social perspectives.`;
  }
  return `A source-backed guide for ${topic}, with clearer frames, perspective cards, and one practical next step.`;
}

function userDoorsFor(node) {
  const topic = topicFor(node);
  const frame = frameFor(node);
  const searchDoor = node.searchPhrases?.find((phrase) =>
    /^(how|why|should|is|what|can|do|will)\b/i.test(phrase)
  );

  if (node.axis === "debate") {
    return [
      `I want to understand the strongest arguments around ${topic} before choosing a side.`,
      "The issue feels simple until I notice the values pulling in different directions.",
      "I need the ethical, institutional, and practical stakes separated.",
      searchDoor ? `A common search doorway is: ${searchDoor}.` : "I want a map of the disagreement, not just a slogan.",
    ];
  }

  if (node.axis === "thought") {
    return [
      `I keep returning to the question of ${topic}, but one definition feels too thin.`,
      "I want to compare durable ways of thinking rather than settle for a quick answer.",
      "I need a frame that can guide choices, not just sound wise.",
      searchDoor ? `A common search doorway is: ${searchDoor}.` : "I want several perspectives held together clearly.",
    ];
  }

  return [
    `This shows up in my life as ${topic}.`,
    `I need to separate ${frame.tension} instead of reacting from one blurred feeling.`,
    "I want source-backed perspectives that make the situation clearer and give me a next step.",
    searchDoor ? `A common search doorway is: ${searchDoor}.` : `I need help choosing ${frame.action}.`,
  ];
}

function headlineFor(node, card, index) {
  const lens = card.perspectiveLens;

  if (node.axis === "debate") {
    if (lens === "institution") return "Check how the public rule changes the argument.";
    if (lens === "research") return "Let evidence constrain the easy story.";
    if (lens === "practice") return "Ask what this view would require in real life.";
    return index === 0 ? "Name the value doing the real work." : "Test the argument against its hidden cost.";
  }

  if (node.axis === "thought") {
    if (lens === "research") return "Bring the big question down to evidence.";
    if (lens === "institution") return "Notice the social frame behind the idea.";
    if (lens === "practice") return "Turn the definition into a way of living.";
    return index === 0 ? "Compare definitions before choosing one." : "Ask what kind of life this answer creates.";
  }

  if (lens === "research" || lens === "medical") return "Look for the pattern, not just the mood.";
  if (lens === "institution") return "Separate private pain from public structure.";
  if (lens === "practice") return "Choose one next action within your control.";
  return index === 0 ? "Turn the feeling into a question you can examine." : "Let this perspective loosen the first reaction.";
}

function bodyFor(node, card) {
  const name = cardNameLabelEn(card.name);
  const source = sourceTypeLabelEn(card.sourceType);
  const lens = perspectiveLensLabelEn(card.perspectiveLens).toLowerCase();
  const topic = topicFor(node);

  if (node.axis === "debate") {
    return `${name} gives this debate a ${lens} anchor. The point is to slow the argument down: what value is being protected, what harm is being prevented, and who carries the cost if this side wins?`;
  }

  if (node.axis === "thought") {
    return `${name} offers a ${lens} way to hold the question of ${topic}. Instead of treating the answer as a slogan, this anchor asks what kind of life, habit, or standard follows from it.`;
  }

  return `${name} gives this worry a ${lens} anchor rather than a quick slogan. Read it as a way to clarify what is happening, what belongs to you, and what kind of response would make the situation less confused.`;
}

function practiceFor(node, card) {
  const topic = topicFor(node);

  if (node.axis === "debate") {
    return `Before taking a side, write the strongest objection to your preferred view on ${topic}.`;
  }

  if (node.axis === "thought") {
    return `Write one sentence that starts with: if I believed this view, I would live differently by...`;
  }

  if (card.perspectiveLens === "research" || card.sourceType === "medical") {
    return "Write the recurring trigger, body reaction, and behavior as three separate facts.";
  }

  if (card.perspectiveLens === "institution" || card.sourceType === "law" || card.sourceType === "policy") {
    return "Separate what is personally painful from what is shaped by rules, roles, or institutions.";
  }

  return "Make two columns: what I can choose today, and what I cannot control right now.";
}

function cardSummariesFor(node) {
  const content = contentForEnglishSeed(node);
  const cards = content?.cards?.length ? content.cards : [];
  const usableCards = cards.slice(0, 4);

  if (usableCards.length === 0) {
    return [
      {
        headline: headlineFor(node, {}, 0),
        body: `This page frames ${topicFor(node)} as a question that deserves more than a quick answer.`,
        practice: practiceFor(node, {}),
      },
    ];
  }

  return usableCards.map((card, index) => ({
    headline: headlineFor(node, card, index),
    body: bodyFor(node, card),
    practice: practiceFor(node, card),
  }));
}

let generatedCount = 0;
const nextNodes = seedData.nodes.map((node) => {
  const shouldGenerate =
    !node.englishCardSummaries?.length ||
    node.englishCuration?.level === "template-readable-seed";
  if (!shouldGenerate) return node;

  generatedCount += 1;
  const nextStatus =
    node.translationStatus === "phrase-enriched" ? "readable-seed" : node.translationStatus;

  return {
    ...node,
    metaDescription: metaDescriptionFor(node),
    pageLead: pageLeadFor(node),
    userDoors: userDoorsFor(node),
    englishCardSummaries: cardSummariesFor(node),
    translationStatus: nextStatus,
    englishCuration: {
      ...(node.englishCuration || {}),
      level: node.englishCuration?.level || "template-readable-seed",
      curatedAt,
      note:
        node.englishCuration?.note ||
        "English page lead, user doors, and card summaries were generated from the canonical node and source-backed cards.",
    },
  };
});

writeFileSync(seedPath, `${JSON.stringify({ ...seedData, nodes: nextNodes }, null, 2)}\n`, "utf8");

console.log(`Readable English summaries generated: ${generatedCount}`);
