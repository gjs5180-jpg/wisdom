import { allSourceLocales } from "@/lib/source-locales";

const localeByCode = new Map(allSourceLocales().map((locale) => [locale.locale, locale]));

const copyByAxis = {
  worry: {
    eyebrow: "읽는 순서",
    title: "이 고민을 이렇게 읽어보세요",
    core: "감정",
    source: "언어권 신호",
    perspectives: "관점",
    next: "다음 행동",
  },
  debate: {
    eyebrow: "비교 순서",
    title: "이 논쟁을 이렇게 비교해보세요",
    core: "쟁점",
    source: "언어권 신호",
    perspectives: "입장",
    next: "판단 질문",
  },
  thought: {
    eyebrow: "생각 순서",
    title: "이 질문을 이렇게 펼쳐보세요",
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
    <section className="mb-6 rounded-lg border border-line bg-cream px-4 py-4">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            {copy.eyebrow}
          </p>
          <h2 className="mt-1 font-serif text-lg font-bold">{copy.title}</h2>
        </div>
        <span className="shrink-0 text-xs text-ink-faint">{rows.length}단계</span>
      </div>

      <div className="divide-y divide-line">
        {rows.map((row) => (
          <div key={row.label} className="py-3 first:pt-0 last:pb-0">
            <div className="grid gap-2 sm:grid-cols-[86px_1fr] sm:gap-4">
              <span className="text-[11px] font-medium uppercase tracking-wider text-clay">
                {row.label}
              </span>
              <div className="min-w-0">
                <p className="text-sm leading-relaxed text-ink-soft">{row.body}</p>
                {row.phrases?.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {row.phrases.map((item) => (
                      <span
                        key={`${item.locale}-${item.phrase}`}
                        lang={item.locale}
                        title={localeLabel(item.locale)}
                        className="rounded-full border border-line bg-paper px-2.5 py-1 text-xs text-ink-soft"
                      >
                        {item.phrase}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
