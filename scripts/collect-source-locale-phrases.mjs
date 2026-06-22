import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const args = new Map(
  process.argv
    .slice(2)
    .filter((arg) => arg.startsWith("--"))
    .map((arg) => {
      const [key, value = "true"] = arg.slice(2).split("=");
      return [key, value];
    })
);

const locale = args.get("locale") || process.env.SOURCE_LOCALE || "ja-JP";
const maxNodes = Number(args.get("maxNodes") || process.env.SOURCE_COLLECT_MAX_NODES || 9999);
const phrasesPerNode = Number(
  args.get("phrasesPerNode") || process.env.SOURCE_COLLECT_PHRASES_PER_NODE || 4
);
const delayMs = Number(args.get("delayMs") || process.env.SOURCE_COLLECT_DELAY_MS || 180);
const timeoutMs = Number(
  args.get("timeoutMs") || process.env.SOURCE_COLLECT_TIMEOUT_MS || 8000
);

const seedPath = "data/source_locale_phrase_seeds.json";
const rawPath = `data/source_locale_phrase_raw.${locale}.json`;
const markdownPath = `data/source_locale_phrase_candidates.${locale}.md`;
const UA = `wisdom-research/0.1 (${locale} source-locale phrase collection; local prototype)`;

const seedData = JSON.parse(readFileSync(seedPath, "utf8"));
const localeConfig = seedData.locales?.[locale];
if (!localeConfig) {
  console.error(`No source phrase seed config for locale: ${locale}`);
  process.exit(1);
}

const suggestConfigByLocale = {
  "ja-JP": { hl: "ja", gl: "jp" },
  "zh-CN": { hl: "zh-CN", gl: "cn" },
  "es-ES": { hl: "es", gl: "es" },
  "fr-FR": { hl: "fr", gl: "fr" },
  "de-DE": { hl: "de", gl: "de" },
};

const suggestConfig = suggestConfigByLocale[locale] || { hl: locale, gl: "us" };
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const lowSignalRules = [
  [
    /歌詞|曲名|ドラマ|映画|アニメ|漫画|ゲーム|ネタバレ|結末|ジブリ|backnumber|マサムネ|内田有紀|登場人物/,
    "entertainment lookup",
  ],
  [/歌词|电视剧|电影|动漫|漫画|游戏|剧透|结局|小说|演员|绘本/, "entertainment lookup"],
  [
    /\b(?:letra|canción|película|serie|anime|manga|spoiler)\b|final explicado/i,
    "entertainment lookup",
  ],
  [
    /\b(?:paroles|chanson|film|série|anime|manga|spoiler)\b|fin expliquée/i,
    "entertainment lookup",
  ],
  [
    /\b(?:songtext|liedtext|film|serie|anime|manga|spoiler)\b|ende erklärt/i,
    "entertainment lookup",
  ],
  [/英語|韓国語|中国語|翻訳|読み方|発音/, "translation or language lookup"],
  [/英语|英文|日语|韩语|翻译|怎么读|发音/, "translation or language lookup"],
  [/\b(?:traducir|inglés|japonés|coreano|pronunciación)\b/i, "translation or language lookup"],
  [/\b(?:traduire|anglais|japonais|coréen|prononciation)\b/i, "translation or language lookup"],
  [/\b(?:übersetzen|englisch|japanisch|koreanisch|aussprache)\b/i, "translation or language lookup"],
  [/占い|診断|スピリチュアル|夢占い/, "fortune-telling / diagnosis drift"],
  [/星座|塔罗|算命|测试/, "fortune-telling / diagnosis drift"],
  [/\b(?:tarot|horóscopo|test|quiz)\b/i, "fortune-telling / diagnosis drift"],
  [/\b(?:tarot|horoscope|test|quiz)\b/i, "fortune-telling / diagnosis drift"],
  [/\b(?:tarot|horoskop|test|quiz)\b/i, "fortune-telling / diagnosis drift"],
  [/求人|転職サイト|ランキング|おすすめ|商品|アプリ/, "commercial or ranking intent"],
  [/招聘|排名|推荐|商品|软件|app下载/, "commercial or ranking intent"],
  [/ofertas de trabajo|ranking|mejores|producto|descargar app/i, "commercial or ranking intent"],
  [/\b(?:offre d'emploi|classement|meilleur|produit|application)\b/i, "commercial or ranking intent"],
  [/\b(?:stellenangebot|ranking|beste|produkt|app herunterladen)\b/i, "commercial or ranking intent"],
];

const reviewRules = [
  [/知恵袋|発言小町|2ch|5ch|reddit|掲示板/, "platform-specific query"],
  [/知乎|豆瓣|贴吧|小红书|微博|reddit|论坛/i, "platform-specific query"],
  [/reddit|foro|forocoches|tiktok|twitter|x\.com/i, "platform-specific query"],
  [/本|名言|論文|pdf|意味|とは/, "reference or concept query"],
  [/论文|pdf|名言|是什么意思|定义|书籍|词语|单词|是什么词/, "reference or concept query"],
  [/libro|frase|cita|pdf|significado|qué significa/i, "reference or concept query"],
  [/\b(?:livre|citation|pdf|définition|que signifie)\b/i, "reference or concept query"],
  [/\b(?:buch|zitat|pdf|bedeutung|definition)\b/i, "reference or concept query"],
  [/症状|病院|治療|薬|うつ病|診断/, "medical review needed"],
  [/症状|医院|治疗|药|抑郁症|诊断/, "medical review needed"],
  [/síntomas|médico|tratamiento|medicamento|depresión|diagnóstico/i, "medical review needed"],
  [/symptômes|médecin|traitement|médicament|dépression|diagnostic/i, "medical review needed"],
  [/symptome|arzt|behandlung|medikament|depression|diagnose/i, "medical review needed"],
  [/法律|違法|判例|制度/, "legal/institutional review needed"],
  [/法律|违法|判例|制度/, "legal/institutional review needed"],
  [/legal|ley|delito|sentencia/i, "legal/institutional review needed"],
  [/juridique|loi|illégal|jugement/i, "legal/institutional review needed"],
  [/gesetz|illegal|urteil|rechtlich/i, "legal/institutional review needed"],
];

const userIntentRules = [
  /悩|不安|怖い|つらい|しんどい|寂しい|苦しい/,
  /できない|したくない|行きたくない|やめたい|忘れられない/,
  /どうすれば|どうしたら|なぜ|わからない|迷う/,
  /べき|必要|後悔|限界|疲れた/,
  /論争|賛成|反対|メリット|デメリット|必要か/,
  /焦虑|不安|害怕|恐惧|痛苦|孤独|难受|压力/,
  /怎么办|为什么|应该|要不要|不想|不能|不敢|忘不掉|迷茫|后悔/,
  /争议|支持|反对|优缺点|有必要吗/,
  /ansiedad|miedo|triste|solo|soledad|dolor|estrés/i,
  /qué hacer|por qué|debería|no quiero|no puedo|no sé|olvidar|superar|arrepent/i,
  /debate|a favor|en contra|ventajas|desventajas|necesario/i,
  /angoisse|anxiété|peur|triste|seul|solitude|stress|épuisé/i,
  /que faire|pourquoi|devrais-je|je ne veux|je n'arrive pas|je ne sais pas|regret/i,
  /débat|pour ou contre|avantages|inconvénients|nécessaire/i,
  /angst|sorge|traurig|einsam|stress|erschöpft/i,
  /was tun|warum|soll ich|ich will nicht|ich kann nicht|ich weiß nicht|bereue/i,
  /debatte|dafür|dagegen|vorteile|nachteile|notwendig/i,
];

const clusterRules = [
  [/学校.*行きたくない|不登校/, "study/school-refusal"],
  [/生きがい/, "meaning/ikigai"],
  [/ひきこもり|引きこもり/, "relationships/social-withdrawal"],
  [/孤独死/, "body-aging/lonely-death-anxiety"],
  [/介護/, "family/caregiving-burden"],
  [/婚活/, "relationships/marriage-market-pressure"],
  [/ブラック企業/, "work/black-company"],
  [/推し活/, "digital/fandom-attachment"],
  [/空気を読む|同調圧力/, "relationships/social-harmony-pressure"],
  [/内卷/, "work-study/status-anxiety"],
  [/躺平/, "work/disengagement"],
  [/孝顺|赡养/, "family/filial-duty"],
  [/原生家庭/, "family/family-of-origin"],
  [/高考/, "study/exam-pressure"],
  [/丁克/, "debate/childfree-identity"],
  [/社恐/, "relationships/social-anxiety"],
  [/precariedad|llegar a fin de mes/i, "money/precarity"],
  [/independizarme/i, "family/late-independence"],
  [/familia tóxica/i, "family/family-of-origin"],
  [/selectividad|oposiciones/i, "study/exam-pressure"],
  [/childfree/i, "debate/childfree-identity"],
  [/ghosting/i, "relationships/ghosting"],
  [/teletrabajo/i, "work/remote-work-culture"],
  [/vacío existencial/i, "meaning/existential-vacuum"],
  [/télétravail/i, "work/remote-work-culture"],
  [/vide existentiel|à quoi bon vivre/i, "meaning/existential-vacuum"],
  [/précarité|fin de mois/i, "money/precarity"],
  [/parents toxiques|famille toxique/i, "family/family-of-origin"],
  [/peur de rater|examens|révisions/i, "study/exam-pressure"],
  [/homeoffice/i, "work/remote-work-culture"],
  [/sinnkrise|existenzielle leere/i, "meaning/existential-vacuum"],
  [/zukunftsangst|geldsorgen/i, "money/precarity"],
  [/toxische eltern|herkunftsfamilie/i, "family/family-of-origin"],
  [/prüfungsangst|leistungsdruck/i, "study/exam-pressure"],
  [/childfree/i, "debate/childfree-identity"],
];

function normalizePhrase(value) {
  return String(value || "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function addUnique(target, values) {
  for (const value of values.map(normalizePhrase).filter(Boolean)) {
    const key = value.toLocaleLowerCase();
    if (!target.some((item) => item.toLocaleLowerCase() === key)) target.push(value);
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
  if (hasUserIntent && reasons.length === 0) {
    return { status: "usable", reasons: ["source-locale worry/debate phrasing"] };
  }
  if (hasUserIntent && reasons.length > 0) {
    return { status: "review", reasons };
  }
  if (reasons.length > 0) return { status: "review", reasons };

  return { status: "usable", reasons: ["general source-locale topic phrasing"] };
}

function clusterHintsFor(phrase) {
  return clusterRules
    .filter(([pattern]) => pattern.test(phrase))
    .map(([, cluster]) => cluster);
}

function annotateCandidates(phrases) {
  return phrases.map((phrase) => ({
    phrase,
    ...classifyPhrase(phrase),
    clusterHints: clusterHintsFor(phrase),
  }));
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { "User-Agent": UA },
    signal: AbortSignal.timeout(timeoutMs),
  });
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
  const contentType = response.headers.get("content-type") || "";
  const charset = contentType.match(/charset=([^;]+)/i)?.[1]?.trim().toLowerCase();
  const buffer = await response.arrayBuffer();
  const decoder = new TextDecoder(charset || "utf-8", { fatal: false });
  return JSON.parse(decoder.decode(buffer));
}

async function googleSuggest(query) {
  const params = new URLSearchParams({
    client: "firefox",
    hl: suggestConfig.hl,
    gl: suggestConfig.gl,
    q: query,
  });
  const url = `https://suggestqueries.google.com/complete/search?${params.toString()}`;
  try {
    const data = await fetchJson(url);
    return Array.isArray(data?.[1]) ? data[1].map(normalizePhrase) : [];
  } catch (error) {
    return { error: error.message, rows: [] };
  }
}

async function collectNode(node) {
  const baseQueries = node.sourceQueries.slice(0, phrasesPerNode);
  const suggestions = [];
  const errors = [];

  for (const query of baseQueries) {
    const result = await googleSuggest(query);
    if (Array.isArray(result)) addUnique(suggestions, result);
    else errors.push({ source: "google-suggest", query, error: result.error });
    await sleep(delayMs);
  }

  const candidatePhrases = [];
  addUnique(candidatePhrases, node.sourceQueries);
  addUnique(candidatePhrases, suggestions);
  const candidateReview = annotateCandidates(candidatePhrases);
  const clusterHints = {};

  for (const candidate of candidateReview) {
    for (const cluster of candidate.clusterHints) {
      clusterHints[cluster] = (clusterHints[cluster] || 0) + 1;
    }
  }

  return {
    locale,
    route: node.route,
    slot: node.slot,
    axis: node.axis,
    sourceQueries: node.sourceQueries,
    baseQueries,
    googleSuggestions: suggestions,
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
    clusterHints,
    errors,
  };
}

function writeMarkdown(payload) {
  let md = `# ${locale} Source-Locale Phrase Candidates\n\n`;
  md += "These are source-language phrase signals mapped to existing Wisdom canonical nodes.\n\n";
  md += "- Autocomplete suggestions are stored as generalized search phrases.\n";
  md += "- Personal posts, community bodies, and identifiable stories are not collected.\n";
  md += "- Cluster hints are review prompts, not automatically published nodes.\n\n";
  md += "## Summary\n\n";
  md += `- collectedAt: ${payload.collectedAt}\n`;
  md += `- nodes scanned: ${payload.nodesScanned}\n`;
  md += `- candidate phrases: ${payload.totalCandidatePhrases}\n`;
  md += `- usable: ${payload.totalUsableCandidatePhrases}\n`;
  md += `- review: ${payload.totalReviewCandidatePhrases}\n`;
  md += `- low-signal: ${payload.totalLowSignalCandidatePhrases}\n\n`;

  if (Object.keys(payload.clusterHints).length > 0) {
    md += "## Potential New Cluster Hints\n\n";
    for (const [cluster, count] of Object.entries(payload.clusterHints).sort(
      (a, b) => b[1] - a[1] || a[0].localeCompare(b[0])
    )) {
      md += `- \`${cluster}\`: ${count}\n`;
    }
    md += "\n";
  }

  for (const row of payload.rows) {
    md += `## ${row.route}\n\n`;
    md += `- axis: ${row.axis}\n`;
    md += `- base queries: ${row.baseQueries.join(", ")}\n`;
    md += `- google suggestions: ${row.googleSuggestions.length}\n`;
    md += `- usable candidates: ${row.usableCandidatePhrases.length}\n`;
    md += `- review candidates: ${row.reviewCandidatePhrases.length}\n`;
    md += `- low-signal candidates: ${row.lowSignalCandidatePhrases.length}\n`;
    if (Object.keys(row.clusterHints).length > 0) {
      md += `- cluster hints: ${Object.entries(row.clusterHints)
        .map(([cluster, count]) => `${cluster} ${count}`)
        .join(", ")}\n`;
    }
    if (row.errors.length > 0) md += `- fetch errors: ${row.errors.length}\n`;

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

  writeFileSync(markdownPath, md, "utf8");
}

async function main() {
  mkdirSync("data", { recursive: true });
  const nodes = localeConfig.nodes.slice(0, maxNodes);
  const rows = [];

  for (const [index, node] of nodes.entries()) {
    console.log(`[${index + 1}/${nodes.length}] ${node.route}`);
    rows.push(await collectNode(node));
  }

  const clusterHints = {};
  for (const row of rows) {
    for (const [cluster, count] of Object.entries(row.clusterHints)) {
      clusterHints[cluster] = (clusterHints[cluster] || 0) + count;
    }
  }

  const payload = {
    collectedAt: new Date().toISOString(),
    locale,
    sourceStatus: localeConfig.status,
    nodesScanned: rows.length,
    totalCandidatePhrases: rows.reduce((sum, row) => sum + row.candidatePhrases.length, 0),
    totalUsableCandidatePhrases: rows.reduce(
      (sum, row) => sum + row.usableCandidatePhrases.length,
      0
    ),
    totalReviewCandidatePhrases: rows.reduce(
      (sum, row) => sum + row.reviewCandidatePhrases.length,
      0
    ),
    totalLowSignalCandidatePhrases: rows.reduce(
      (sum, row) => sum + row.lowSignalCandidatePhrases.length,
      0
    ),
    clusterHints,
    rows,
  };

  writeFileSync(rawPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  writeMarkdown(payload);

  console.log(`${locale} source phrase collection complete`);
  console.log(`nodes: ${payload.nodesScanned}`);
  console.log(`candidate phrases: ${payload.totalCandidatePhrases}`);
  console.log(`usable: ${payload.totalUsableCandidatePhrases}`);
  console.log(`review: ${payload.totalReviewCandidatePhrases}`);
  console.log(`low-signal: ${payload.totalLowSignalCandidatePhrases}`);
  console.log(`files: ${rawPath}, ${markdownPath}`);
}

main();
