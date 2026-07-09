import Link from "next/link";
import { notFound } from "next/navigation";
import {
  sourceLocaleMapForCode,
  sourceLocaleMapParams,
  sourceLocaleMaps,
} from "@/lib/source-locale-map";
import { sourceLocaleSignalStrengthLabel } from "@/lib/source-locale-signals";

export function generateStaticParams() {
  return sourceLocaleMapParams();
}

export async function generateMetadata({ params }) {
  const { locale: localeCode } = await params;
  const locale = sourceLocaleMapForCode(localeCode);
  if (!locale) return { title: "언어권 지도 - 마인드루트" };

  return {
    title: `${locale.nativeLabel} 고민 지도 - 마인드루트`,
    description: `${locale.region}에서 반복되는 고민, 논쟁, 검색 표현을 마인드루트 카드와 연결해 봅니다.`,
  };
}

export default async function SourceLocaleDetailPage({ params }) {
  const { locale: localeCode } = await params;
  const locale = sourceLocaleMapForCode(localeCode);
  if (!locale) notFound();

  const otherLocales = sourceLocaleMaps().filter((item) => item.locale !== locale.locale);
  const topHits = locale.topHits.slice(0, 18);
  const commonHits = locale.commonHits.slice(0, 8);
  const statRows = [
    { label: "연결 카드", value: locale.routeCount },
    { label: "수집 표현", value: locale.totalCandidate },
    { label: "사용 신호", value: locale.totalUsable },
    { label: "검토 후보", value: locale.totalReview },
  ];

  return (
    <div className="fade-rise">
      <nav className="mb-5 text-sm text-ink-soft">
        <Link href="/" className="transition-colors hover:text-clay">
          홈
        </Link>
        <span className="mx-1.5 text-ink-faint">/</span>
        <Link href="/source-locales" className="transition-colors hover:text-clay">
          언어권 지도
        </Link>
        <span className="mx-1.5 text-ink-faint">/</span>
        <span className="text-ink">{locale.nativeLabel}</span>
      </nav>

      <header className="mb-6">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
          {locale.label}
        </p>
        <h1 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
          {locale.nativeLabel} 고민 지도
        </h1>
        <p className="mt-2 leading-relaxed text-ink-soft">{locale.region}</p>
        <p className="mt-3 leading-relaxed text-ink-soft">
          이 언어권에서 반복되는 검색 표현을 개인 사연이 아니라 일반화된
          패턴으로 모아, 마인드루트의 고민과 논쟁 카드에 연결했습니다.
        </p>
      </header>

      <section className="mb-8 border-y border-line py-4">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {statRows.map((row) => (
            <div key={row.label}>
              <dt className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                {row.label}
              </dt>
              <dd className="mt-1 font-serif text-2xl font-bold">
                {row.value.toLocaleString("ko-KR")}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mb-9">
        <div className="mb-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            대표 표현
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold">
            이 언어권에서 자주 잡힌 검색어
          </h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {locale.topPhrases.slice(0, 14).map((phrase) => (
            <span
              key={phrase}
              lang={locale.locale}
              className="rounded-full border border-line bg-paper px-3 py-1.5 text-sm text-ink-soft"
            >
              {phrase}
            </span>
          ))}
        </div>
      </section>

      <section className="mb-9">
        <div className="mb-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            강한 신호
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold">
            이 언어권에서 많이 연결된 카드
          </h2>
        </div>
        <ul className="divide-y divide-line border-y border-line">
          {topHits.map((hit) => (
            <li key={hit.key}>
              <Link
                href={hit.entry.href}
                className="group block py-4 transition-colors hover:text-clay"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-serif text-base font-bold group-hover:text-clay">
                        {hit.entry.title}
                      </span>
                      <span className="rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                        {hit.locale.usableCount}
                      </span>
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-ink-soft">
                      {hit.entry.summary}
                    </span>
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {hit.topPhrases.slice(0, 4).map((phrase) => (
                        <span
                          key={phrase}
                          lang={locale.locale}
                          className="rounded-full border border-line bg-cream px-2 py-0.5 text-[11px] text-ink-soft"
                        >
                          {phrase}
                        </span>
                      ))}
                    </span>
                  </span>
                  <span className="shrink-0 text-xs text-ink-faint">
                    {sourceLocaleSignalStrengthLabel(hit.signal.strength)}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-9">
        <div className="mb-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            분포
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold">
            어떤 종류의 질문이 많은가
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-[0.8fr_1.2fr]">
          <div>
            <h3 className="mb-2 font-serif text-base font-bold">축별 분포</h3>
            <div className="space-y-2">
              {locale.axisCounts.map((row) => (
                <div key={row.axis} className="border-t border-line py-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-ink-soft">{row.label}</span>
                    <span className="font-medium text-ink">{row.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="mb-2 font-serif text-base font-bold">자주 연결된 태그</h3>
            <div className="flex flex-wrap gap-2">
              {locale.topTags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
                >
                  <span className="text-ink">{tag.title}</span>
                  <span className="ml-1.5 text-xs text-ink-faint">{tag.count}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {commonHits.length > 0 && (
        <section className="mb-9">
          <div className="mb-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              공통 고민
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">
              다른 언어권과 함께 반복된 주제
            </h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {commonHits.map((hit) => (
              <Link
                key={hit.key}
                href={hit.entry.href}
                className="rounded-lg border border-line bg-paper px-3 py-2 text-sm text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
              >
                <span className="text-ink">{hit.entry.title}</span>
                <span className="ml-1.5 text-xs text-ink-faint">
                  {hit.signal.localeCoverage}개 언어권
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-line pt-5">
        <h2 className="mb-2 font-serif text-base font-bold">다른 언어권 보기</h2>
        <div className="flex flex-wrap gap-2">
          {otherLocales.map((item) => (
            <Link
              key={item.locale}
              href={item.href}
              className="rounded-full border border-line bg-paper px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
            >
              {item.nativeLabel}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
