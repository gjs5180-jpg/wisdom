import Link from "next/link";
import {
  enrichedEnglishSeeds,
  englishTranslationStatusLabel,
} from "@/lib/global-content";

export const metadata = {
  title: "Wisdom in English — Perspective map prototype",
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

export default function EnglishHomePage() {
  const entries = enrichedEnglishSeeds();
  const totalPhrases = entries.reduce((sum, entry) => sum + entry.searchPhrases.length, 0);
  const draftCount = entries.filter((entry) => entry.translationStatus === "draft").length;
  const curatedCount = entries.filter((entry) => entry.translationStatus === "curated-seed").length;
  const readableCount = entries.filter(
    (entry) => entry.translationStatus === "readable-seed"
  ).length;
  const enrichedCount = entries.filter(
    (entry) => entry.translationStatus === "phrase-enriched"
  ).length;

  return (
    <div className="fade-rise">
      <section className="pt-2 pb-7">
        <p className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
          English prototype
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold leading-snug sm:text-4xl">
          Real worries,
          <br />
          mapped through verified perspectives.
        </h1>
        <p className="mt-4 leading-relaxed text-ink-soft">
          This is the first English shell for Wisdom. It connects English search
          phrases to the Korean canonical knowledge map before full localization.
        </p>
      </section>

      <section className="mb-8 border-y border-line py-4">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-6">
          <div>
            <dt className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
              Nodes
            </dt>
            <dd className="mt-1 font-serif text-2xl font-bold">{entries.length}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
              Phrases
            </dt>
            <dd className="mt-1 font-serif text-2xl font-bold">{totalPhrases}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
              Curated
            </dt>
            <dd className="mt-1 font-serif text-2xl font-bold">{curatedCount}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
              Enriched
            </dt>
            <dd className="mt-1 font-serif text-2xl font-bold">{enrichedCount}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
              Readable
            </dt>
            <dd className="mt-1 font-serif text-2xl font-bold">{readableCount}</dd>
          </div>
          <div>
            <dt className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
              Draft
            </dt>
            <dd className="mt-1 font-serif text-2xl font-bold">{draftCount}</dd>
          </div>
        </dl>
      </section>

      <section>
        <div className="mb-3">
          <p className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
            Start here
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold">English entry nodes</h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {entries.map((entry) => (
            <Link
              key={entry.route}
              href={entry.href}
              className="group block rounded-xl border border-line bg-paper px-4 py-4 transition-colors hover:border-clay/40"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
                    {entry.axis}
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
