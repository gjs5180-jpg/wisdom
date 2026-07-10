import Link from "next/link";
import EnglishHomeSearch from "@/components/EnglishHomeSearch";
import {
  highSignalScore,
  localizedCopy,
  localizedHomeEntries,
  localizedSearchEntry,
} from "@/lib/multilingual-content";

function axisCount(entries, axis) {
  return entries.filter((entry) => entry.axis === axis).length;
}

function phraseCount(entries) {
  return entries.reduce((sum, entry) => sum + (entry.localizedPhrases?.length || 0), 0);
}

function searchQuickQueries(entries) {
  const phrases = entries.flatMap((entry) => entry.localizedPhrases || []).filter(Boolean);
  const picked = [...new Set(phrases)].slice(0, 7);
  return picked.length > 0 ? picked : ["breakup", "burnout", "people pleasing"];
}

export default function LocalizedHomePage({ locale }) {
  const copy = localizedCopy(locale);
  const entries = localizedHomeEntries(locale).filter((entry) => entry.axis !== "debate");
  const highSignalEntries = [...entries]
    .sort((a, b) => highSignalScore(b) - highSignalScore(a) || a.priority - b.priority)
    .slice(0, 6);

  const pathCards = [
    {
      title: copy.choosePath,
      href: "#localized-nodes",
      count: entries.length,
      blurb: copy.homeLead,
    },
    {
      title: copy.sourceLanguages,
      href: "/source-locales",
      count: phraseCount(entries),
      blurb: copy.sourceBridge,
    },
    {
      title: copy.koreanMap,
      href: "/",
      count: entries.length,
      blurb: copy.canonicalNotice,
    },
  ];

  const searchEntries = entries.map((entry) => localizedSearchEntry(entry, copy));
  const suggestedEntries = highSignalEntries
    .slice(0, 5)
    .map((entry) => localizedSearchEntry(entry, copy));
  const exploreEntries = pathCards.map((card) => ({
    key: `path/${card.href}`,
    href: card.href,
    title: card.title,
    summary: card.blurb,
    categoryTitle: "Path",
    groupTitle: copy.previewBadge,
    typeLabel: "Path",
    badgeLabel: String(card.count),
    verifiedCount: card.count,
    aliases: `${card.title} ${card.blurb}`,
  }));

  return (
    <div className="fade-rise">
      <section className="pb-7 pt-2">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
          {copy.homeEyebrow}
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold leading-snug sm:text-4xl">
          {copy.homeTitle}
        </h1>
        <p className="mt-4 leading-relaxed text-ink-soft">{copy.homeLead}</p>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link
            href="#localized-nodes"
            className="rounded-lg bg-clay px-3 py-2 font-medium text-white transition-colors hover:bg-clay-dark"
          >
            {copy.browse}
          </Link>
          <Link
            href="/source-locales"
            className="rounded-lg border border-line px-3 py-2 text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
          >
            {copy.sourceLanguages}
          </Link>
          <Link
            href="/"
            className="rounded-lg border border-line px-3 py-2 text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
          >
            {copy.koreanMap}
          </Link>
        </div>
      </section>

      <div className="mb-8">
        <EnglishHomeSearch
          entries={searchEntries}
          suggestedEntries={suggestedEntries}
          exploreEntries={exploreEntries}
          quickQueries={searchQuickQueries(entries)}
          fallbackLinks={[
            { label: copy.questionNodes, href: "#localized-nodes" },
            { label: copy.sourceLanguages, href: "/source-locales" },
            { label: copy.koreanMap, href: "/" },
          ]}
          copy={{
            suggestedLabel: copy.suggested,
            placeholder: copy.searchPlaceholder,
            ariaLabel: copy.searchAria,
            noResults: copy.noResults,
            checkedSuffix: copy.checkedSuffix,
          }}
          typeOrder={["Question", "Path"]}
        />
      </div>

      <section className="mb-8 border-y border-line py-4">
        <dl className="grid grid-cols-3 gap-4">
          <div>
            <dt className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              {copy.nodes}
            </dt>
            <dd className="mt-1 font-serif text-2xl font-bold">{entries.length}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              {copy.phrases}
            </dt>
            <dd className="mt-1 font-serif text-2xl font-bold">{phraseCount(entries)}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              {copy.checked}
            </dt>
            <dd className="mt-1 font-serif text-2xl font-bold">
              {entries.reduce((sum, entry) => sum + entry.verifiedCount, 0)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mb-9">
        <div className="mb-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            {copy.choosePath}
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold">{copy.highSignal}</h2>
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
                    {entry.localizedTitle}
                  </span>
                  <span className="mt-1 block text-xs text-ink-faint">
                    {copy.canonical}: {entry.canonicalTitle}
                  </span>
                  <span className="mt-2 flex flex-wrap gap-1.5">
                    {(entry.localizedPhrases || []).slice(0, 3).map((phrase) => (
                      <span
                        key={`${entry.route}-${phrase}`}
                        className="rounded-full border border-line bg-paper px-2 py-0.5 text-[11px] text-ink-soft"
                      >
                        {phrase}
                      </span>
                    ))}
                  </span>
                </span>
                <span className="col-start-2 self-start rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay sm:col-start-auto">
                  {highSignalScore(entry)}
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </section>

      <section id="localized-nodes" className="scroll-mt-20">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              {copy.previewBadge}
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">{copy.questionNodes}</h2>
          </div>
          <span className="shrink-0 text-xs text-ink-faint">{entries.length}</span>
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
                  <span className="block font-serif text-base font-bold group-hover:text-clay">
                    {entry.localizedTitle}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-faint">
                    {entry.canonicalTitle}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                  {entry.verifiedCount}
                </span>
              </span>
              <span className="mt-2 line-clamp-2 block text-sm leading-relaxed text-ink-soft">
                {(entry.localizedPhrases || []).slice(1, 4).join(" / ") || entry.pageLead}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
