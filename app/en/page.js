import Link from "next/link";
import {
  enrichedEnglishSeeds,
  englishTranslationStatusLabel,
} from "@/lib/global-content";

export const metadata = {
  title: "Wisdom in English | Perspective map prototype",
  description:
    "An English prototype of Wisdom: real worries and debates organized through philosophy, research, institutions, and practical reflection.",
  robots: {
    index: false,
    follow: true,
  },
  alternates: {
    canonical: "/en",
    languages: {
      "ko-KR": "/",
      "en-US": "/en",
    },
  },
};

const axisLabels = {
  worry: "Worries",
  debate: "Debates",
  thought: "Big questions",
};

const sourceLocaleLabels = {
  "ja-JP": "Japanese",
  "zh-CN": "Chinese",
  "es-ES": "Spanish",
  "fr-FR": "French",
  "de-DE": "German",
};

function axisCount(entries, axis) {
  return entries.filter((entry) => entry.axis === axis).length;
}

function sourceLocaleName(locale) {
  return sourceLocaleLabels[locale] || locale;
}

function sourceLocaleRows(entries) {
  const rows = new Map();

  for (const entry of entries) {
    const signal = entry.content?.sourceLocaleSignal;
    for (const locale of signal?.locales || []) {
      if (!rows.has(locale.locale)) {
        rows.set(locale.locale, {
          locale: locale.locale,
          usable: 0,
          candidate: 0,
          topics: [],
        });
      }

      const row = rows.get(locale.locale);
      row.usable += locale.usableCount || 0;
      row.candidate += locale.candidateCount || 0;
      if (row.topics.length < 4) {
        row.topics.push({
          title: entry.canonicalTitle,
          href: entry.href,
          usable: locale.usableCount || 0,
        });
      }
    }
  }

  return [...rows.values()].sort((a, b) => b.usable - a.usable).slice(0, 5);
}

function highSignalScore(entry) {
  return entry.content?.sourceLocaleSignal?.totalUsable || 0;
}

export default function EnglishHomePage() {
  const entries = enrichedEnglishSeeds().filter((entry) => entry.publishable);
  const totalPhrases = entries.reduce((sum, entry) => sum + entry.searchPhrases.length, 0);
  const draftCount = entries.filter((entry) => entry.translationStatus === "draft").length;
  const curatedCount = entries.filter((entry) => entry.translationStatus === "curated-seed").length;
  const readableCount = entries.filter(
    (entry) => entry.translationStatus === "readable-seed"
  ).length;
  const enrichedCount = entries.filter(
    (entry) => entry.translationStatus === "phrase-enriched"
  ).length;
  const checkedCards = entries.reduce((sum, entry) => sum + entry.verifiedCount, 0);

  const highSignalEntries = [...entries]
    .sort((a, b) => highSignalScore(b) - highSignalScore(a) || a.priority - b.priority)
    .slice(0, 6);
  const debateEntries = entries
    .filter((entry) => entry.axis === "debate")
    .sort((a, b) => highSignalScore(b) - highSignalScore(a) || a.priority - b.priority)
    .slice(0, 4);
  const localeRows = sourceLocaleRows(entries);

  const pathCards = [
    {
      title: "Worries",
      href: "#english-nodes",
      count: axisCount(entries, "worry"),
      blurb: "Everyday problems like relationships, work, self-esteem, body, family, and meaning.",
    },
    {
      title: "Debates",
      href: "#english-debates",
      count: axisCount(entries, "debate"),
      blurb: "Value conflicts where support, opposition, evidence, and trade-offs need to be compared.",
    },
    {
      title: "Big Questions",
      href: "#english-nodes",
      count: axisCount(entries, "thought"),
      blurb: "Durable questions about happiness, success, freedom, and a good life.",
    },
    {
      title: "Korean Map",
      href: "/",
      count: entries.length,
      blurb: "The Korean canonical map remains the source of record for every English node.",
    },
  ];

  return (
    <div className="fade-rise">
      <section className="pb-7 pt-2">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
          English prototype
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold leading-snug sm:text-4xl">
          Real worries,
          <br />
          mapped through verified perspectives.
        </h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          Wisdom connects English search phrases to a Korean canonical knowledge map,
          then compares source-backed perspectives from philosophy, research, institutions,
          and practice.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link
            href="#english-nodes"
            className="rounded-lg bg-clay px-3 py-2 font-medium text-white transition-colors hover:bg-clay-dark"
          >
            Browse nodes
          </Link>
          <Link
            href="/source-locales"
            className="rounded-lg border border-line px-3 py-2 text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
          >
            Source languages
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-line px-3 py-2 text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
          >
            Korean home
          </Link>
        </div>
      </section>

      <section className="mb-8 border-y border-line py-4">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-6">
          <div>
            <dt className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              Nodes
            </dt>
            <dd className="mt-1 font-serif text-2xl font-bold">{entries.length}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              Phrases
            </dt>
            <dd className="mt-1 font-serif text-2xl font-bold">{totalPhrases}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              Checked
            </dt>
            <dd className="mt-1 font-serif text-2xl font-bold">{checkedCards}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              Curated
            </dt>
            <dd className="mt-1 font-serif text-2xl font-bold">{curatedCount}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              Enriched
            </dt>
            <dd className="mt-1 font-serif text-2xl font-bold">{enrichedCount}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              Readable
            </dt>
            <dd className="mt-1 font-serif text-2xl font-bold">{readableCount + draftCount}</dd>
          </div>
        </dl>
      </section>

      <section className="mb-9">
        <div className="mb-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            Choose a path
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold">Start from the shape of the question</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-4">
          {pathCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="group block rounded-lg border border-line bg-paper px-4 py-4 transition-colors hover:border-clay/40"
            >
              <span className="flex items-baseline justify-between gap-3">
                <span className="font-serif text-base font-bold group-hover:text-clay">
                  {card.title}
                </span>
                <span className="text-xs text-ink-faint">{card.count}</span>
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-ink-soft">
                {card.blurb}
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-9">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              High-signal topics
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">
              Where many languages point to the same concern
            </h2>
          </div>
          <span className="shrink-0 text-xs text-ink-faint">Cross-locale phrases</span>
        </div>
        <ol className="divide-y divide-line border-y border-line">
          {highSignalEntries.map((entry, index) => (
            <li key={entry.route}>
              <Link
                href={entry.href}
                className="group grid grid-cols-[2rem_1fr] gap-3 py-4 transition-colors hover:text-clay sm:grid-cols-[2.5rem_1fr_auto]"
              >
                <span className="font-serif text-xl font-bold text-ink-faint">
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block font-serif text-base font-bold group-hover:text-clay">
                    {entry.canonicalTitle}
                  </span>
                  <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-ink-soft">
                    {entry.pageLead || entry.userDoors[0]}
                  </span>
                  <span className="mt-1.5 block text-xs text-ink-faint">
                    {axisLabels[entry.axis]} / {entry.content?.sourceLocaleSignal?.localeCoverage || 0} source locales
                  </span>
                </span>
                <span className="col-start-2 self-start rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay sm:col-start-auto">
                  {highSignalScore(entry).toLocaleString("en-US")}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {localeRows.length > 0 && (
        <section className="mb-9">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                Source-language bridge
              </p>
              <h2 className="mt-1 font-serif text-xl font-bold">
                The same problem, different search language
              </h2>
            </div>
            <Link
              href="/source-locales"
              className="shrink-0 text-sm text-ink-soft transition-colors hover:text-clay"
            >
              View map
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {localeRows.map((row) => (
              <div key={row.locale} className="rounded-lg border border-line bg-paper px-4 py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-base font-bold">
                      {sourceLocaleName(row.locale)}
                    </h3>
                    <p className="mt-0.5 text-xs text-ink-faint">
                      {row.usable.toLocaleString("en-US")} usable phrases
                    </p>
                  </div>
                  <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                    {row.candidate.toLocaleString("en-US")} collected
                  </span>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {row.topics.map((topic) => (
                    <Link
                      key={`${row.locale}-${topic.href}`}
                      href={topic.href}
                      className="rounded-lg border border-line bg-cream px-3 py-1 text-sm text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
                    >
                      {topic.title}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {debateEntries.length > 0 && (
        <section id="english-debates" className="mb-9 scroll-mt-20">
          <div className="mb-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              Debate entry
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">
              Compare positions before taking a side
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {debateEntries.map((entry) => (
              <Link
                key={entry.route}
                href={entry.href}
                className="group block rounded-lg border border-line bg-paper px-4 py-4 transition-colors hover:border-clay/40"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block font-serif text-base font-bold group-hover:text-clay">
                      {entry.canonicalTitle}
                    </span>
                    <span className="mt-1.5 line-clamp-2 block text-sm leading-relaxed text-ink-soft">
                      {entry.pageLead || entry.userDoors[0]}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                    {entry.verifiedCount} checked
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section id="english-nodes" className="scroll-mt-20">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              Start here
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">English entry nodes</h2>
          </div>
          <span className="shrink-0 text-xs text-ink-faint">{entries.length} nodes</span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {entries.map((entry) => (
            <Link
              key={entry.route}
              href={entry.href}
              className="group block rounded-lg border border-line bg-paper px-4 py-4 transition-colors hover:border-clay/40"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                    {axisLabels[entry.axis] || entry.axis}
                  </span>
                  <span className="mt-1 block font-serif text-base font-bold group-hover:text-clay">
                    {entry.canonicalTitle}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                  {entry.verifiedCount} checked
                </span>
              </span>
              <span className="mt-2 inline-flex rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-faint">
                {englishTranslationStatusLabel(entry.translationStatus)}
              </span>
              <span className="mt-2 block text-sm leading-relaxed text-ink-soft">
                {entry.userDoors[0]}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
