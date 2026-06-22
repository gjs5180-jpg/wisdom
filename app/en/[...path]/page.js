import Link from "next/link";
import { notFound } from "next/navigation";
import {
  cardNameLabelEn,
  cardRoleLabelEn,
  englishSeedEntryByRoute,
  englishStaticParams,
  englishTranslationStatusLabel,
  perspectiveLensLabelEn,
  sourceTypeLabelEn,
} from "@/lib/global-content";
import { debatePositionSummary } from "@/lib/content";

const debatePositionLabelsEn = {
  support: "Support / allow",
  oppose: "Oppose / restrict",
  conditional: "Conditional / trade-off",
  context: "Context / evidence",
};

function debatePositionLabelEn(position) {
  return debatePositionLabelsEn[position] || "Conditional / trade-off";
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
    title: `${entry.canonicalTitle} — Wisdom`,
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
      title: `${entry.canonicalTitle} — Wisdom`,
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
  const isCurated = entry.translationStatus === "curated-seed";
  const positionRows =
    entry.axis === "debate" ? debatePositionSummary(entry.slot.replace(/^debate\//, "")) : [];
  const positionByName = new Map(positionRows.map((row) => [row.name, row]));

  return (
    <div className="fade-rise">
      <nav className="mb-5 text-sm text-ink-soft">
        <Link href="/en" className="transition-colors hover:text-clay">
          English
        </Link>
        <span className="mx-1.5 text-ink-faint">›</span>
        <span className="text-ink">{entry.canonicalTitle}</span>
      </nav>

      <header className="mb-6">
        <p className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
          {entry.axis}
        </p>
        <h1 className="mt-1 font-serif text-2xl font-bold leading-snug sm:text-3xl">
          {entry.canonicalTitle}
        </h1>
        <p className="mt-3 leading-relaxed text-ink-soft">
          {entry.pageLead || entry.userDoors[0]}
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
            {entry.verifiedCount} source-checked cards
          </span>
          <Link
            href={entry.koreanHref}
            className="rounded-full border border-line px-2.5 py-1 text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
          >
            Korean canonical page
          </Link>
        </div>
      </header>

      <section className="mb-7">
        <p className="mb-2 text-[11px] font-medium tracking-wider text-ink-faint uppercase">
          Search phrases
        </p>
        <div className="flex flex-wrap gap-2">
          {entry.searchPhrases.map((phrase) => (
            <span
              key={phrase}
              className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink-soft"
            >
              {phrase}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-8 rounded-xl border border-line bg-paper px-4 py-4">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
              User doors
            </p>
            <h2 className="mt-1 font-serif text-lg font-bold">
              How this worry usually enters
            </h2>
          </div>
          <span className="shrink-0 text-xs text-ink-faint">
            {entry.userDoors.length}
          </span>
        </div>
        <ul className="space-y-2.5">
          {entry.userDoors.map((door) => (
            <li key={door} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
              <span className="text-[15px] leading-relaxed">{door}</span>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
              Source-backed anchors
            </p>
            <h2 className="mt-1 font-serif text-lg font-bold">Perspective cards</h2>
          </div>
          <span className="shrink-0 text-xs text-ink-faint">{cards.length}</span>
        </div>
        <div className="space-y-3">
          {cards.map((card, index) => {
            const cardSummary = entry.englishCardSummaries?.[index];
            const position = positionByName.get(card.name);

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
                    {cardSummary ? cardNameLabelEn(card.name) : cardRoleLabelEn(card)}
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
                {card.sourceType && (
                  <span className="rounded-full border border-line px-2 py-0.5 text-ink-faint">
                    {sourceTypeLabelEn(card.sourceType)}
                    {card.sourceYear ? ` · ${card.sourceYear}` : ""}
                  </span>
                )}
                {card.sourceUrl ? (
                  <a
                    href={card.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-ink-faint underline decoration-line underline-offset-2 transition-colors hover:text-clay"
                  >
                    {card.source}
                  </a>
                ) : (
                  card.source && <span className="text-ink-faint">{card.source}</span>
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
