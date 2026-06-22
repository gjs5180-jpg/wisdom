import {
  formatSignalLocales,
  sourceLocaleSignalStrengthLabel,
} from "@/lib/source-locale-signals";

export default function SourceLocaleSignalSummary({ signal }) {
  if (!signal) return null;

  return (
    <section className="mb-6 rounded-lg border border-line bg-cream px-4 py-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            관심 신호
          </p>
          <h2 className="mt-1 font-serif text-lg font-bold">
            수집 데이터에서 보이는 크기
          </h2>
        </div>
        <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
          {sourceLocaleSignalStrengthLabel(signal.strength)}
        </span>
      </div>

      <dl className="grid grid-cols-3 gap-3">
        <div>
          <dt className="text-[11px] text-ink-faint">언어권</dt>
          <dd className="mt-1 font-serif text-xl font-bold">{signal.localeCoverage}</dd>
        </div>
        <div>
          <dt className="text-[11px] text-ink-faint">수집 표현</dt>
          <dd className="mt-1 font-serif text-xl font-bold">
            {signal.totalCandidate.toLocaleString("ko-KR")}
          </dd>
        </div>
        <div>
          <dt className="text-[11px] text-ink-faint">활용 가능</dt>
          <dd className="mt-1 font-serif text-xl font-bold">
            {signal.totalUsable.toLocaleString("ko-KR")}
          </dd>
        </div>
      </dl>

      {signal.strongestLocales?.length > 0 && (
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          특히 {formatSignalLocales(signal.strongestLocales)}에서 강하게 잡혔어요.
        </p>
      )}
      <p className="mt-1 text-xs leading-relaxed text-ink-faint">
        정확한 사람 수가 아니라 자동완성·검색 표현 기반의 관심 신호입니다.
      </p>
    </section>
  );
}
