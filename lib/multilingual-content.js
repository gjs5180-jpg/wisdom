import {
  cardNameLabelEn,
  enrichedEnglishSeeds,
  englishSeedEntryByRoute,
  englishStaticParams,
  englishTranslationStatusLabel,
  perspectiveLensLabelEn,
  sourceTypeLabelEn,
  sourceYearLabelEn,
} from "./global-content.js";
import { localeByCode, localizedPreviewLocales } from "./locales.js";

export const localizedHomeParams = localizedPreviewLocales.map((locale) => ({
  locale: locale.locale,
}));

const copyByLocale = {
  ja: {
    homeEyebrow: "多言語プレビュー",
    homeTitle: "同じ問いを、別の言語の検索表現から読む。",
    homeLead:
      "このページは完全翻訳版ではなく、各言語で集めた検索表現を入口にして、検証済みの MindRoute 質問地図へつなぐプレビューです。",
    browse: "ノードを見る",
    sourceLanguages: "言語圏ソース",
    koreanMap: "韓国語の基準地図",
    searchPlaceholder: "人間関係、幸せ、AI、別れ、燃え尽き...",
    searchAria: "日本語プレビューを検索",
    suggested: "おすすめ",
    noResults: "近い結果がまだありません。下の入口から始めてください。",
    checkedSuffix: "確認済み",
    nodes: "ノード",
    phrases: "表現",
    checked: "確認",
    choosePath: "問いの形から選ぶ",
    highSignal: "複数の言語で強く出る問い",
    sourceBridge: "同じ問い、別の検索語",
    questionNodes: "質問ノード",
    previewBadge: "プレビュー",
    canonical: "基準タイトル",
    localPhrases: "現地の検索表現",
    coreBrief: "要点",
    readFirst: "まずここから読む",
    sourceSignal: "言語圏シグナル",
    perspectives: "観点",
    reliability: "信頼の手がかり",
    openSource: "ソースを開く",
    canonicalNotice: "詳細な本文は英語/韓国語の基準カードをもとに表示されます。",
  },
  zh: {
    homeEyebrow: "多语言预览",
    homeTitle: "用不同语言的搜索表达，阅读同一个问题。",
    homeLead:
      "这里不是完整翻译版，而是把各语言中收集到的搜索表达作为入口，连接到已验证的 MindRoute 问题地图。",
    browse: "浏览节点",
    sourceLanguages: "语言来源",
    koreanMap: "韩语基准地图",
    searchPlaceholder: "讨好型人格、幸福、AI、分手、倦怠...",
    searchAria: "搜索中文预览",
    suggested: "推荐",
    noResults: "暂时没有非常接近的结果。可以先从下面的入口开始。",
    checkedSuffix: "已核验",
    nodes: "节点",
    phrases: "表达",
    checked: "核验",
    choosePath: "按问题形态开始",
    highSignal: "多种语言里反复出现的问题",
    sourceBridge: "同一个问题，不同的搜索语",
    questionNodes: "问题节点",
    previewBadge: "预览",
    canonical: "基准标题",
    localPhrases: "本地搜索表达",
    coreBrief: "核心摘要",
    readFirst: "先读这里",
    sourceSignal: "语言信号",
    perspectives: "视角",
    reliability: "可信线索",
    openSource: "打开来源",
    canonicalNotice: "详细内容仍基于英语/韩语的基准卡片显示。",
  },
  es: {
    homeEyebrow: "Vista multilingüe",
    homeTitle: "La misma pregunta, leída desde búsquedas de otros idiomas.",
    homeLead:
      "Esta no es una traducción completa todavía. Usa frases reales recopiladas en cada idioma para entrar al mapa verificado de preguntas de MindRoute.",
    browse: "Ver nodos",
    sourceLanguages: "Idiomas fuente",
    koreanMap: "Mapa base coreano",
    searchPlaceholder: "complacer a los demás, felicidad, IA, ruptura, burnout...",
    searchAria: "Buscar en la vista española",
    suggested: "Sugeridos",
    noResults: "Aún no hay una coincidencia clara. Empieza por una de estas rutas.",
    checkedSuffix: "verificados",
    nodes: "Nodos",
    phrases: "Frases",
    checked: "Verificados",
    choosePath: "Elegir por forma de pregunta",
    highSignal: "Preguntas fuertes en varios idiomas",
    sourceBridge: "La misma pregunta, otra búsqueda",
    questionNodes: "Nodos de preguntas",
    previewBadge: "Vista previa",
    canonical: "Título base",
    localPhrases: "Búsquedas locales",
    coreBrief: "Resumen",
    readFirst: "Leer primero",
    sourceSignal: "Señal de idioma",
    perspectives: "Perspectivas",
    reliability: "Señal de fiabilidad",
    openSource: "Abrir fuente",
    canonicalNotice: "El contenido detallado todavía se apoya en las tarjetas base en inglés/coreano.",
  },
  fr: {
    homeEyebrow: "Aperçu multilingue",
    homeTitle: "La même question, lue depuis les recherches d'autres langues.",
    homeLead:
      "Ce n'est pas encore une traduction complète. Cette vue utilise les expressions collectées dans chaque langue pour ouvrir la carte vérifiée de MindRoute.",
    browse: "Voir les nœuds",
    sourceLanguages: "Langues sources",
    koreanMap: "Carte coréenne de référence",
    searchPlaceholder: "faire plaisir aux autres, bonheur, IA, rupture, burnout...",
    searchAria: "Rechercher dans l'aperçu français",
    suggested: "Suggestions",
    noResults: "Aucune correspondance nette pour l'instant. Commencez par l'un de ces chemins.",
    checkedSuffix: "vérifiés",
    nodes: "Nœuds",
    phrases: "Expressions",
    checked: "Vérifiés",
    choosePath: "Choisir par forme de question",
    highSignal: "Questions fortes dans plusieurs langues",
    sourceBridge: "Même question, autre recherche",
    questionNodes: "Nœuds de questions",
    previewBadge: "Aperçu",
    canonical: "Titre de référence",
    localPhrases: "Recherches locales",
    coreBrief: "Résumé",
    readFirst: "Lire d'abord",
    sourceSignal: "Signal linguistique",
    perspectives: "Perspectives",
    reliability: "Indice de fiabilité",
    openSource: "Ouvrir la source",
    canonicalNotice: "Le contenu détaillé reste basé sur les cartes de référence anglaises/coréennes.",
  },
  de: {
    homeEyebrow: "Mehrsprachige Vorschau",
    homeTitle: "Dieselbe Frage, gelesen durch Suchbegriffe anderer Sprachen.",
    homeLead:
      "Dies ist noch keine vollständige Übersetzung. Die Ansicht nutzt gesammelte Suchausdrücke je Sprache als Eingang zur geprüften MindRoute-Fragenkarte.",
    browse: "Knoten ansehen",
    sourceLanguages: "Quellsprachen",
    koreanMap: "Koreanische Basiskarte",
    searchPlaceholder: "people pleasing, Glück, KI, Trennung, Burnout...",
    searchAria: "Deutsche Vorschau durchsuchen",
    suggested: "Vorschläge",
    noResults: "Noch kein genauer Treffer. Beginne mit einem dieser Wege.",
    checkedSuffix: "geprüft",
    nodes: "Knoten",
    phrases: "Ausdrücke",
    checked: "Geprüft",
    choosePath: "Nach Form der Frage wählen",
    highSignal: "Fragen mit starkem Signal in mehreren Sprachen",
    sourceBridge: "Dieselbe Frage, andere Suche",
    questionNodes: "Fragenknoten",
    previewBadge: "Vorschau",
    canonical: "Basistitel",
    localPhrases: "Lokale Suchausdrücke",
    coreBrief: "Kurzfassung",
    readFirst: "Zuerst lesen",
    sourceSignal: "Sprachsignal",
    perspectives: "Perspektiven",
    reliability: "Vertrauenshinweis",
    openSource: "Quelle öffnen",
    canonicalNotice: "Die Detailinhalte beruhen weiterhin auf den englisch/koreanischen Basiskarten.",
  },
};

export function localizedCopy(locale) {
  return copyByLocale[locale] || copyByLocale.es;
}

export function localizedStaticParams() {
  return englishStaticParams();
}

export function localizedPathForRoute(locale, route) {
  const info = localeByCode(locale);
  if (!info.routePrefix) return route;
  return route === "/" ? info.routePrefix : `${info.routePrefix}${route}`;
}

export function localizedHomeEntries(locale) {
  return enrichedEnglishSeeds()
    .filter((entry) => entry.publishable)
    .map((entry) => localizeEntry(entry, locale));
}

export function localizedEntryByRoute(locale, route) {
  const entry = englishSeedEntryByRoute(route);
  return entry ? localizeEntry(entry, locale) : null;
}

export function localizeEntry(entry, locale) {
  const info = localeByCode(locale);
  const sourceLocale = info.sourceLocale;
  const sourceSignal = entry.content?.sourceLocaleSignal;
  const localeSignal = sourceSignal?.locales?.find((row) => row.locale === sourceLocale) || null;
  const phrases = locale === "en" ? entry.searchPhrases || [] : localeSignal?.topPhrases || [];
  const title = phrases[0] || entry.canonicalTitle;

  return {
    ...entry,
    locale,
    href: localizedPathForRoute(locale, entry.route),
    localizedTitle: title,
    localizedPhrases: phrases,
    localeSignal,
    localeInfo: info,
    canonicalHref: entry.href,
  };
}

export function highSignalScore(entry) {
  return entry.localeSignal?.usableCount || entry.content?.sourceLocaleSignal?.totalUsable || 0;
}

export function localizedSearchEntry(entry, copy) {
  return {
    key: `${entry.locale}/${entry.route}`,
    href: entry.href,
    title: entry.localizedTitle,
    summary: entry.pageLead || entry.userDoors?.[0] || entry.canonicalTitle,
    categoryTitle: copy.questionNodes,
    groupTitle: entry.canonicalTitle,
    typeLabel: "Question",
    badgeLabel: `${entry.verifiedCount} ${copy.checkedSuffix}`,
    verifiedCount: entry.verifiedCount,
    aliases: [
      entry.localizedTitle,
      entry.canonicalTitle,
      entry.localizedPhrases?.join(" "),
      entry.searchPhrases?.join(" "),
      entry.userDoors?.join(" "),
      entry.metaDescription,
    ]
      .filter(Boolean)
      .join(" "),
  };
}

export function localizedCardMeta(card) {
  return [sourceTypeLabelEn(card.sourceType), sourceYearLabelEn(card.sourceYear)]
    .filter(Boolean)
    .join(" / ");
}

export function localizedReliability(card, copy) {
  return [
    card.verified ? copy.checked : "Checking",
    sourceTypeLabelEn(card.sourceType),
    sourceYearLabelEn(card.sourceYear),
  ]
    .filter(Boolean)
    .join(" / ");
}

export function localizedCardBody(card, entry) {
  const name = cardNameLabelEn(card.name);
  const lens = perspectiveLensLabelEn(card.perspectiveLens).toLowerCase();
  return `${name} gives this question a ${lens} anchor. Read it as one verified perspective connected to the canonical MindRoute card: ${entry.canonicalTitle}.`;
}

export { cardNameLabelEn, englishTranslationStatusLabel, perspectiveLensLabelEn };
