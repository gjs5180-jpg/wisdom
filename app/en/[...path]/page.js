import Link from "next/link";
import { notFound } from "next/navigation";
import {
  cardNameLabelEn,
  englishSeedEntryByRoute,
  englishStaticParams,
  englishTranslationStatusLabel,
  perspectiveLensLabelEn,
  sourceTypeLabelEn,
  sourceYearLabelEn,
} from "@/lib/global-content";
import { debatePositionSummary } from "@/lib/content";

const debatePositionLabelsEn = {
  support: "Support / allow",
  oppose: "Oppose / restrict",
  conditional: "Conditional / trade-off",
  context: "Context / evidence",
};

const axisCopyEn = {
  worry: {
    label: "Question map",
    briefTitle: "Read this first",
    core: "Core question",
    source: "Source signal",
    perspectives: "Perspectives",
    next: "Next move",
    doorsEyebrow: "User doors",
    doorsTitle: "How this worry usually enters",
    cardsEyebrow: "Source-backed anchors",
    cardsTitle: "Perspective cards",
  },
  debate: {
    label: "Contested question",
    briefTitle: "Before choosing a side",
    core: "Core issue",
    source: "Source signal",
    perspectives: "Positions",
    next: "Judgment question",
    doorsEyebrow: "Search doors",
    doorsTitle: "How this debate usually enters",
    cardsEyebrow: "Position anchors",
    cardsTitle: "Debate cards",
  },
  thought: {
    label: "Life question",
    briefTitle: "Open the question this way",
    core: "Question",
    source: "Source signal",
    perspectives: "Definitions",
    next: "Reflection",
    doorsEyebrow: "Question doors",
    doorsTitle: "How this thought usually enters",
    cardsEyebrow: "Source-backed anchors",
    cardsTitle: "Perspective cards",
  },
};

const sourceLocaleLabelsEn = {
  "ja-JP": "Japanese",
  "zh-CN": "Chinese",
  "es-ES": "Spanish",
  "fr-FR": "French",
  "de-DE": "German",
  "en-US": "English",
  "ko-KR": "Korean",
};

const signalStrengthLabelsEn = {
  "very-strong": "Very strong",
  strong: "Strong",
  moderate: "Moderate",
  emerging: "Emerging",
};

function axisCopy(axis) {
  return axisCopyEn[axis] || axisCopyEn.worry;
}

function debatePositionLabelEn(position) {
  return debatePositionLabelsEn[position] || "Conditional / trade-off";
}

function compact(text, limit = 132) {
  if (!text) return "";
  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

function sourceLocaleLabelEn(locale) {
  return sourceLocaleLabelsEn[locale] || locale;
}

function sourceTypes(cards) {
  return [
    ...new Set(
      (cards || [])
        .map((card) => sourceTypeLabelEn(card.sourceType))
        .filter(Boolean)
    ),
  ];
}

function sourceSignalLine(signal) {
  if (!signal) return "The Korean canonical page remains the source of record.";
  const strongest = (signal.strongestLocales || [])
    .slice(0, 3)
    .map((locale) => sourceLocaleLabelEn(locale.locale))
    .join(", ");
  const opening = `${signal.totalUsable.toLocaleString("en-US")} usable phrases across ${
    signal.localeCoverage
  } source locales`;
  return strongest ? `${opening}. Strongest signals: ${strongest}.` : `${opening}.`;
}

function collectionLine(entry) {
  const stats = entry.englishCandidateStats;
  if (!stats) return sourceSignalLine(entry.content?.sourceLocaleSignal);
  return `${stats.usable.toLocaleString("en-US")} usable English phrases from ${stats.total.toLocaleString(
    "en-US"
  )} collected phrases, plus cross-locale source signals.`;
}

function perspectiveLine(cards, positionRows) {
  if (positionRows.length > 0) {
    return positionRows
      .map((row) => `${row.name}: ${debatePositionLabelEn(row.position)}`)
      .join(", ");
  }

  return cards
    .slice(0, 4)
    .map((card) => {
      const name = cardNameLabelEn(card.name);
      const lens = perspectiveLensLabelEn(card.perspectiveLens).toLowerCase();
      return `${name} (${lens})`;
    })
    .join(", ");
}

function nextMove(entry) {
  const practice = entry.englishCardSummaries?.find((summary) => summary.practice)?.practice;
  if (practice) return practice;
  if (entry.axis === "debate") return "Compare the position anchors before deciding what trade-off you accept.";
  if (entry.axis === "thought") return "Pick the definition that would actually change one choice this week.";
  return "Turn the feeling into one action that belongs to you today.";
}

function reliabilityText(card) {
  const parts = [card.verified ? "Source checked" : "Checking source"];
  if (card.sourceType) parts.push(sourceTypeLabelEn(card.sourceType));
  if (card.sourceYear) parts.push(sourceYearLabelEn(card.sourceYear));
  return parts.filter(Boolean).join(" / ");
}

function sourceMetaText(card) {
  const parts = [];
  if (card.sourceType) parts.push(sourceTypeLabelEn(card.sourceType));
  if (card.sourceYear) parts.push(sourceYearLabelEn(card.sourceYear));
  return parts.join(" / ");
}

export function generateStaticParams() {
  return englishStaticParams();
}

export async function generateMetadata({ params }) {
  const { path } = await params;
  const route = `/${path.join("/")}`;
  const entry = englishSeedEntryByRoute(route);
  if (!entry) return { title: "Wisdom in English" };

  return {
    title: `${entry.canonicalTitle} | Wisdom`,
    description:
      entry.metaDescription || entry.pageLead || `${entry.canonicalTitle}: ${entry.userDoors[0]}`,
    robots: {
      index: false,
      follow: true,
    },
    alternates: {
      canonical: entry.href,
      languages: {
        "ko-KR": entry.koreanHref,
        "en-US": entry.href,
      },
    },
    openGraph: {
      title: `${entry.canonicalTitle} | Wisdom`,
      description: entry.metaDescription || entry.pageLead || entry.userDoors[0],
      type: "article",
      url: entry.href,
    },
  };
}

export default async function EnglishSeedPage({ params }) {
  const { path } = await params;
  const route = `/${path.join("/")}`;
  const entry = englishSeedEntryByRoute(route);
  if (!entry) notFound();

  const cards = entry.content?.cards || [];
  const copy = axisCopy(entry.axis);
  const isCurated = entry.translationStatus === "curated-seed";
  const positionRows =
    entry.axis === "debate" ? debatePositionSummary(entry.slot.replace(/^debate\//, "")) : [];
  const positionByName = new Map(positionRows.map((row) => [row.name, row]));
  const sourceTypeLabels = sourceTypes(cards);
  const signal = entry.content?.sourceLocaleSignal;
  const insights = entry.content?.sourceLocaleInsights || [];
  const searchPhrases = entry.searchPhrases || [];
  const userDoors = entry.userDoors || [];

  const briefRows = [
    { label: copy.core, body: compact(entry.pageLead || userDoors[0], 150) },
    { label: copy.source, body: sourceSignalLine(signal) },
    { label: copy.perspectives, body: compact(perspectiveLine(cards, positionRows), 150) },
    { label: copy.next, body: compact(nextMove(entry), 150) },
  ].filter((row) => row.body);

  return (
    <div className="fade-rise">
      <nav className="mb-5 text-sm text-ink-soft">
        <Link href="/en" className="transition-colors hover:text-clay">
          English
        </Link>
        <span className="mx-1.5 text-ink-faint">/</span>
        <span className="text-ink">{entry.canonicalTitle}</span>
      </nav>

      <header className="mb-6">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
          {copy.label}
        </p>
        <h1 className="mt-1 font-serif text-2xl font-bold leading-snug sm:text-3xl">
          {entry.canonicalTitle}
        </h1>
        <p className="mt-3 leading-relaxed text-ink-soft">
          {entry.pageLead || userDoors[0]}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span
            className={`rounded-full px-2.5 py-1 font-medium ${
              isCurated ? "bg-clay-soft text-clay" : "border border-line text-ink-soft"
            }`}
          >
            {englishTranslationStatusLabel(entry.translationStatus)}
          </span>
          <span className="rounded-full bg-clay-soft px-2.5 py-1 font-medium text-clay">
            {entry.verifiedCount}/{cards.length} source checked
          </span>
          {signal?.localeCoverage > 0 && (
            <span className="rounded-full border border-line px-2.5 py-1 text-ink-soft">
              {signal.localeCoverage} source locales
            </span>
          )}
          <Link
            href={entry.koreanHref}
            className="rounded-full border border-line px-2.5 py-1 text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
          >
            Korean canonical page
          </Link>
        </div>
      </header>

      <section className="mb-7 border-y border-line py-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              Core brief
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">{copy.briefTitle}</h2>
          </div>
          <div className="flex shrink-0 flex-wrap justify-end gap-1.5 text-[11px]">
            <span className="rounded-full bg-clay-soft px-2 py-0.5 font-medium text-clay">
              Checked {entry.verifiedCount}/{cards.length}
            </span>
            {sourceTypeLabels.length > 0 && (
              <span className="rounded-full border border-line px-2 py-0.5 text-ink-soft">
                {sourceTypeLabels.length} source types
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {briefRows.map((row) => (
            <div key={row.label} className="rounded-lg border border-line bg-paper px-4 py-3">
              <p className="text-[11px] font-medium uppercase tracking-wider text-clay">
                {row.label}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{row.body}</p>
            </div>
          ))}
        </div>

        {sourceTypeLabels.length > 0 && (
          <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-ink-faint">
            <span>Source types</span>
            {sourceTypeLabels.map((label) => (
              <span key={label} className="rounded-full border border-line px-2 py-0.5 text-ink-soft">
                {label}
              </span>
            ))}
          </div>
        )}
      </section>

      {searchPhrases.length > 0 && (
        <section className="mb-7">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            Search phrases
          </p>
          <div className="flex flex-wrap gap-2">
            {searchPhrases.map((phrase) => (
              <span
                key={phrase}
                className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink-soft"
              >
                {phrase}
              </span>
            ))}
          </div>
        </section>
      )}

      {userDoors.length > 0 && (
        <section className="mb-7 rounded-lg border border-line bg-paper px-4 py-4">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                {copy.doorsEyebrow}
              </p>
              <h2 className="mt-1 font-serif text-lg font-bold">{copy.doorsTitle}</h2>
            </div>
            <span className="shrink-0 text-xs text-ink-faint">{userDoors.length}</span>
          </div>
          <ul className="space-y-2.5">
            {userDoors.map((door) => (
              <li key={door} className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                <span className="text-[15px] leading-relaxed">{door}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {(entry.englishCandidateStats || signal || insights.length > 0) && (
        <section className="mb-7 rounded-lg border border-line bg-cream px-4 py-4">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                Collection signal
              </p>
              <h2 className="mt-1 font-serif text-lg font-bold">
                What the gathered phrases suggest
              </h2>
            </div>
            {signal?.strength && (
              <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                {signalStrengthLabelsEn[signal.strength] || signal.strength}
              </span>
            )}
          </div>

          <p className="text-sm leading-relaxed text-ink-soft">{collectionLine(entry)}</p>

          {entry.englishCandidateStats && (
            <dl className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-ink-faint">Collected</dt>
                <dd className="mt-1 font-serif text-xl font-bold">
                  {entry.englishCandidateStats.total.toLocaleString("en-US")}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-ink-faint">Usable</dt>
                <dd className="mt-1 font-serif text-xl font-bold">
                  {entry.englishCandidateStats.usable.toLocaleString("en-US")}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-ink-faint">Review</dt>
                <dd className="mt-1 font-serif text-xl font-bold">
                  {entry.englishCandidateStats.review.toLocaleString("en-US")}
                </dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-wider text-ink-faint">Low signal</dt>
                <dd className="mt-1 font-serif text-xl font-bold">
                  {entry.englishCandidateStats.lowSignal.toLocaleString("en-US")}
                </dd>
              </div>
            </dl>
          )}

          {insights.length > 0 && (
            <div className="mt-4 divide-y divide-line">
              {insights.slice(0, 3).map((insight) => (
                <div key={`${insight.locale}-${insight.cluster}`} className="py-3 first:pt-0 last:pb-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-paper px-2 py-0.5 text-[11px] font-medium text-clay">
                      {sourceLocaleLabelEn(insight.locale)}
                    </span>
                    {insight.cluster && (
                      <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-soft">
                        {insight.cluster}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{insight.signal}</p>
                  {insight.sourcePhrases?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {insight.sourcePhrases.slice(0, 4).map((phrase) => (
                        <span
                          key={phrase}
                          lang={insight.locale}
                          className="rounded-full border border-line bg-paper px-2.5 py-1 text-xs text-ink-soft"
                        >
                          {phrase}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      <section className="mb-7 rounded-lg border border-line bg-cream px-4 py-4">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              Perspective map
            </p>
            <h2 className="mt-1 font-serif text-lg font-bold">Compare the anchors</h2>
          </div>
          <span className="shrink-0 text-xs text-ink-faint">{cards.length} cards</span>
        </div>
        <div className="divide-y divide-line">
          {cards.map((card, index) => {
            const cardSummary = entry.englishCardSummaries?.[index];
            const position = positionByName.get(card.name);
            const sourceMeta = sourceMetaText(card);

            return (
              <div
                key={`${card.name}-${card.stance || card.source}`}
                className="grid grid-cols-[2rem_1fr] gap-3 py-3 first:pt-0 last:pb-0"
              >
                <span className="font-serif text-lg font-bold text-ink-faint">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-serif font-bold">
                      {cardSummary?.headline || cardNameLabelEn(card.name)}
                    </span>
                    {position && (
                      <span className="rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                        {debatePositionLabelEn(position.position)}
                      </span>
                    )}
                    {card.perspectiveLens && (
                      <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-soft">
                        {perspectiveLensLabelEn(card.perspectiveLens)}
                      </span>
                    )}
                    {sourceMeta && (
                      <span className="rounded-full bg-paper px-2 py-0.5 text-[11px] text-ink-soft">
                        {sourceMeta}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    {compact(cardSummary?.body, 150) ||
                      (card.verified
                        ? "This source anchor has been checked in the Korean canonical card."
                        : "This source anchor is still being checked.")}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              {copy.cardsEyebrow}
            </p>
            <h2 className="mt-1 font-serif text-lg font-bold">{copy.cardsTitle}</h2>
          </div>
          <span className="shrink-0 text-xs text-ink-faint">{cards.length}</span>
        </div>
        <div className="space-y-3">
          {cards.map((card, index) => {
            const cardSummary = entry.englishCardSummaries?.[index];
            const position = positionByName.get(card.name);
            const sourceMeta = sourceMetaText(card);

            return (
              <article
                key={`${card.name}-${card.stance || card.source}`}
                className="rounded-xl border border-line bg-paper px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-serif text-base font-bold">
                      {cardSummary?.headline || cardNameLabelEn(card.name)}
                    </h3>
                    <p className="mt-0.5 text-xs text-ink-faint">
                      {cardSummary ? cardNameLabelEn(card.name) : perspectiveLensLabelEn(card.perspectiveLens)}
                    </p>
                  </div>
                  <div className="flex shrink-0 flex-wrap justify-end gap-1.5">
                    {position && (
                      <span className="rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                        {debatePositionLabelEn(position.position)}
                      </span>
                    )}
                    {card.perspectiveLens && (
                      <span className="rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                        {perspectiveLensLabelEn(card.perspectiveLens)}
                      </span>
                    )}
                    {card.sourceType && (
                      <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-soft">
                        {sourceTypeLabelEn(card.sourceType)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 rounded-lg border border-line bg-cream px-4 py-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-medium text-clay">Reliability cue</span>
                    <span className="text-ink-soft">{reliabilityText(card)}</span>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {cardSummary?.body ||
                    (card.verified
                      ? "This source anchor has been checked in the Korean canonical card."
                      : "This source anchor is still being checked.")}
                </p>

                {cardSummary?.practice && (
                  <p className="mt-3 border-l-2 border-clay/40 pl-3 text-sm leading-relaxed text-ink">
                    <span className="font-medium text-clay">Try this: </span>
                    {cardSummary.practice}
                  </p>
                )}

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  {sourceMeta && (
                    <span className="rounded-full border border-line px-2 py-0.5 text-ink-faint">
                      {sourceMeta}
                    </span>
                  )}
                  {card.sourceUrl ? (
                    <a
                      href={card.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-ink-faint underline decoration-line underline-offset-2 transition-colors hover:text-clay"
                    >
                      Open source
                    </a>
                  ) : (
                    <span className="text-ink-faint">Source noted on the Korean canonical card</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
