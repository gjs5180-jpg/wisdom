import { allSourceLocales } from "@/lib/source-locales";

const localeByCode = new Map(allSourceLocales().map((locale) => [locale.locale, locale]));

const copyByAxis = {
  worry: {
    eyebrow: "핵심 정리",
    title: "문제 패턴부터 잡고 읽기",
    core: "가능한 패턴",
    source: "반복 신호",
    perspectives: "관점 렌즈",
    next: "첫 행동",
  },
  debate: {
    eyebrow: "핵심 정리",
    title: "찬반보다 먼저 볼 구조",
    core: "쟁점",
    source: "언어권 신호",
    perspectives: "입장",
    next: "판단 질문",
  },
  thought: {
    eyebrow: "핵심 정리",
    title: "질문을 여는 기준",
    core: "질문",
    source: "언어권 신호",
    perspectives: "기준",
    next: "생각 질문",
  },
};

function compact(text, limit = 118) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit).trim()}...`;
}

function localeLabel(code) {
  const locale = localeByCode.get(code);
  if (!locale) return code;
  return locale.nativeLabel;
}

function firstAction({ actions, reflect }) {
  if (actions?.length > 0) return actions[0];
  if (reflect?.length > 0) return reflect[0];
  return "";
}

function sourcePhrases(insights) {
  const phrases = [];

  for (const insight of insights || []) {
    for (const phrase of insight.sourcePhrases || []) {
      if (phrases.some((item) => item.phrase === phrase)) continue;
      phrases.push({ phrase, locale: insight.locale });
      if (phrases.length >= 4) return phrases;
    }
  }

  return phrases;
}

function sourceLine(signal, insights) {
  const insight = insights?.[0];
  if (insight?.userDoors?.[0]) return insight.userDoors[0];
  if (!signal) return "";

  const localeCount = signal.localeCoverage || signal.locales?.length;
  const usableCount = signal.totalUsable;
  if (!localeCount || !usableCount) return "";

  return `${localeCount}개 언어권에서 ${usableCount.toLocaleString("ko-KR")}개 활용 가능 표현이 잡힌 주제입니다.`;
}

function perspectiveText(cards, positionRows) {
  const rows = positionRows?.length > 0 ? positionRows : cards;
  return (rows || [])
    .slice(0, 3)
    .map((item) => {
      const label = item.positionTitle || item.stance || item.sourceTypeLabel || item.role;
      return label ? `${item.name}(${label})` : item.name;
    })
    .join(", ");
}

function sourceTypes(cards) {
  return [
    ...new Set(
      (cards || [])
        .map((card) => card.sourceTypeLabel)
        .filter(Boolean)
    ),
  ];
}

export default function ContentBrief({
  axis = "worry",
  summary,
  cards,
  sourceLocaleInsights,
  sourceLocaleSignal,
  actions,
  reflect,
  positionRows,
}) {
  const copy = copyByAxis[axis] || copyByAxis.worry;
  const phrases = sourcePhrases(sourceLocaleInsights);
  const source = sourceLine(sourceLocaleSignal, sourceLocaleInsights);
  const perspectives = perspectiveText(cards, positionRows);
  const next = firstAction({ actions, reflect });
  const verifiedCount = (cards || []).filter((card) => card.verified).length;
  const sourceTypeLabels = sourceTypes(cards);
  const localeCount = sourceLocaleSignal?.localeCoverage || sourceLocaleSignal?.locales?.length || 0;

  const rows = [
    summary && { label: copy.core, body: compact(summary, 132) },
    source && {
      label: copy.source,
      body: compact(source, 132),
      phrases,
    },
    perspectives && { label: copy.perspectives, body: compact(perspectives, 132) },
    next && { label: copy.next, body: compact(next, 132) },
  ].filter(Boolean);

  if (rows.length === 0) return null;

  return (
    <section className="mb-7 border-y border-line py-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            {copy.eyebrow}
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold">{copy.title}</h2>
        </div>
        <div className="flex shrink-0 flex-wrap justify-end gap-1.5 text-[11px]">
          <span className="rounded-full bg-clay-soft px-2 py-0.5 font-medium text-clay">
            검증 {verifiedCount}/{cards?.length || 0}
          </span>
          {sourceTypeLabels.length > 0 && (
            <span className="rounded-full border border-line px-2 py-0.5 text-ink-soft">
              출처 {sourceTypeLabels.length}종
            </span>
          )}
          {localeCount > 0 && (
            <span className="rounded-full border border-line px-2 py-0.5 text-ink-soft">
              언어권 {localeCount}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="rounded-lg border border-line bg-paper px-4 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-clay">
              {row.label}
            </p>
            <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{row.body}</p>
            {row.phrases?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {row.phrases.map((item) => (
                  <span
                    key={`${item.locale}-${item.phrase}`}
                    lang={item.locale}
                    title={localeLabel(item.locale)}
                    className="rounded-full border border-line bg-cream px-2.5 py-1 text-xs text-ink-soft"
                  >
                    {item.phrase}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {sourceTypeLabels.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-ink-faint">
          <span>출처 종류</span>
          {sourceTypeLabels.map((label) => (
            <span
              key={label}
              className="rounded-full border border-line px-2 py-0.5 text-ink-soft"
            >
              {label}
            </span>
          ))}
        </div>
      )}
    </section>
  );
}
