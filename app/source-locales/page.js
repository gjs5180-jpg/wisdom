import Link from "next/link";
import {
  sharedSourceLocaleSignals,
  sourceLocaleMapTotals,
  sourceLocaleMaps,
} from "@/lib/source-locale-map";
import { sourceLocaleSignalStrengthLabel } from "@/lib/source-locale-signals";

export const metadata = {
  title: "언어권 지도 - 마인드루트",
  description:
    "일본어, 중국어, 스페인어, 프랑스어, 독일어권에서 반복되는 고민과 논쟁 표현을 하나의 지도로 봅니다.",
};

export default function SourceLocalesPage() {
  const locales = sourceLocaleMaps();
  const totals = sourceLocaleMapTotals();
  const sharedSignals = sharedSourceLocaleSignals(8);
  const statRows = [
    { label: "소스 언어권", value: totals.sourceLocaleCount },
    { label: "연결 카드", value: totals.mappedRouteCount },
    { label: "수집 표현", value: totals.candidatePhrases },
    { label: "사용 신호", value: totals.usableCandidatePhrases },
  ];

  return (
    <div className="fade-rise">
      <nav className="mb-5 text-sm text-ink-soft">
        <Link href="/" className="transition-colors hover:text-clay">
          홈
        </Link>
        <span className="mx-1.5 text-ink-faint">/</span>
        <span className="text-ink">언어권 지도</span>
      </nav>

      <header className="mb-6">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
          source locale map
        </p>
        <h1 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
          여러 언어권의 고민을 하나의 지도로 보기
        </h1>
        <p className="mt-3 leading-relaxed text-ink-soft">
          번역 결과가 아니라 각 언어권에서 실제로 반복되는 검색 표현을 모아
          같은 고민 카드에 연결합니다. 어디서 비슷하게 묻고, 어디서 다르게
          표현하는지 먼저 볼 수 있습니다.
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
            언어권별 입구
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold">
            어디에서 어떤 고민이 강하게 잡히나
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {locales.map((locale) => (
            <Link
              key={locale.locale}
              href={locale.href}
              className="group block rounded-lg border border-line bg-paper px-4 py-4 transition-colors hover:border-clay/40"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-serif text-lg font-bold group-hover:text-clay">
                    {locale.nativeLabel}
                  </h3>
                  <p className="mt-0.5 text-xs text-ink-faint">{locale.region}</p>
                </div>
                <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                  {locale.totalUsable.toLocaleString("ko-KR")}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-3 gap-2 border-y border-line py-2 text-xs">
                <div>
                  <span className="block text-ink-faint">카드</span>
                  <span className="mt-0.5 block font-medium text-ink">
                    {locale.routeCount}
                  </span>
                </div>
                <div>
                  <span className="block text-ink-faint">표현</span>
                  <span className="mt-0.5 block font-medium text-ink">
                    {locale.totalCandidate}
                  </span>
                </div>
                <div>
                  <span className="block text-ink-faint">검토</span>
                  <span className="mt-0.5 block font-medium text-ink">
                    {locale.totalReview}
                  </span>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {locale.topPhrases.slice(0, 5).map((phrase) => (
                  <span
                    key={phrase}
                    lang={locale.locale}
                    className="rounded-full border border-line bg-cream px-2 py-0.5 text-[11px] text-ink-soft"
                  >
                    {phrase}
                  </span>
                ))}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            공통 신호
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold">
            여러 언어권에서 동시에 반복되는 주제
          </h2>
        </div>
        <ul className="divide-y divide-line border-y border-line">
          {sharedSignals.map(({ signal, entry }) => (
            <li key={signal.key}>
              <Link
                href={entry.href}
                className="group grid grid-cols-[1fr_auto] gap-3 py-4 transition-colors hover:text-clay"
              >
                <span className="min-w-0">
                  <span className="block font-serif text-base font-bold group-hover:text-clay">
                    {entry.title}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                    {entry.summary}
                  </span>
                  <span className="mt-1.5 block text-xs text-ink-faint">
                    {signal.localeCoverage}개 언어권 · 사용 신호{" "}
                    {signal.totalUsable.toLocaleString("ko-KR")}
                  </span>
                </span>
                <span className="self-start rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                  {sourceLocaleSignalStrengthLabel(signal.strength)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
