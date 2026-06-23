import Link from "next/link";
import { notFound } from "next/navigation";
import {
  cardNameLabelEn,
  englishTranslationStatusLabel,
  localizedCardBody,
  localizedCardMeta,
  localizedCopy,
  localizedEntryByRoute,
  localizedReliability,
  perspectiveLensLabelEn,
} from "@/lib/multilingual-content";

function compact(text, limit = 150) {
  if (!text) return "";
  return text.length > limit ? `${text.slice(0, limit).trim()}...` : text;
}

function sourceSignalLine(entry) {
  const signal = entry.localeSignal;
  if (!signal) return `${entry.canonicalTitle} / ${entry.verifiedCount} checked cards`;
  return `${signal.usableCount} usable phrases / ${signal.candidateCount} collected phrases`;
}

export default function LocalizedSeedPage({ locale, route }) {
  const copy = localizedCopy(locale);
  const entry = localizedEntryByRoute(locale, route);
  if (!entry) notFound();

  const cards = entry.content?.cards || [];
  const phrases = entry.localizedPhrases || [];
  const briefRows = [
    {
      label: copy.localPhrases,
      body: phrases.slice(0, 4).join(" / ") || entry.localizedTitle,
    },
    {
      label: copy.canonical,
      body: entry.canonicalTitle,
    },
    {
      label: copy.sourceSignal,
      body: sourceSignalLine(entry),
    },
    {
      label: copy.perspectives,
      body: cards
        .slice(0, 4)
        .map((card) => `${cardNameLabelEn(card.name)} (${perspectiveLensLabelEn(card.perspectiveLens)})`)
        .join(", "),
    },
  ].filter((row) => row.body);

  return (
    <div className="fade-rise">
      <nav className="mb-5 text-sm text-ink-soft">
        <Link href={`/${locale}`} className="transition-colors hover:text-clay">
          {entry.localeInfo.label}
        </Link>
        <span className="mx-1.5 text-ink-faint">/</span>
        <span className="text-ink">{entry.localizedTitle}</span>
      </nav>

      <header className="mb-6">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
          {copy.previewBadge}
        </p>
        <h1 className="mt-1 font-serif text-2xl font-bold leading-snug sm:text-3xl">
          {entry.localizedTitle}
        </h1>
        <p className="mt-3 leading-relaxed text-ink-soft">
          {copy.canonical}: {entry.canonicalTitle}
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-clay-soft px-2.5 py-1 font-medium text-clay">
            {englishTranslationStatusLabel(entry.translationStatus)}
          </span>
          <span className="rounded-full border border-line px-2.5 py-1 text-ink-soft">
            {entry.verifiedCount}/{cards.length} {copy.checkedSuffix}
          </span>
          <Link
            href={entry.canonicalHref}
            className="rounded-full border border-line px-2.5 py-1 text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
          >
            English
          </Link>
          <Link
            href={entry.koreanHref}
            className="rounded-full border border-line px-2.5 py-1 text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
          >
            한국어
          </Link>
        </div>
      </header>

      <section className="mb-7 border-y border-line py-5">
        <div className="mb-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            {copy.coreBrief}
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold">{copy.readFirst}</h2>
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
        <p className="mt-3 text-xs leading-relaxed text-ink-faint">
          {copy.canonicalNotice}
        </p>
      </section>

      {phrases.length > 0 && (
        <section className="mb-7">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            {copy.localPhrases}
          </p>
          <div className="flex flex-wrap gap-2">
            {phrases.slice(0, 12).map((phrase) => (
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

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              {copy.perspectives}
            </p>
            <h2 className="mt-1 font-serif text-lg font-bold">{copy.questionNodes}</h2>
          </div>
          <span className="shrink-0 text-xs text-ink-faint">{cards.length}</span>
        </div>
        <div className="space-y-3">
          {cards.map((card, index) => {
            const meta = localizedCardMeta(card);

            return (
              <article
                key={`${card.name}-${card.stance || card.source}`}
                className="rounded-xl border border-line bg-paper px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-serif text-base font-bold">
                      {cardNameLabelEn(card.name)}
                    </h3>
                    <p className="mt-0.5 text-xs text-ink-faint">
                      {perspectiveLensLabelEn(card.perspectiveLens)}
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="mt-3 rounded-lg border border-line bg-cream px-4 py-2.5">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-medium text-clay">{copy.reliability}</span>
                    <span className="text-ink-soft">{localizedReliability(card, copy)}</span>
                  </div>
                </div>

                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  {compact(localizedCardBody(card, entry), 220)}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  {meta && (
                    <span className="rounded-full border border-line px-2 py-0.5 text-ink-faint">
                      {meta}
                    </span>
                  )}
                  {card.sourceUrl && (
                    <a
                      href={card.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-ink-faint underline decoration-line underline-offset-2 transition-colors hover:text-clay"
                    >
                      {copy.openSource}
                    </a>
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
