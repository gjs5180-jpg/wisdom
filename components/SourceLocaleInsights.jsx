import { allSourceLocales } from "@/lib/source-locales";

const localeByCode = new Map(allSourceLocales().map((locale) => [locale.locale, locale]));

function localeLabel(code) {
  const locale = localeByCode.get(code);
  if (!locale) return code;
  return `${locale.nativeLabel} · ${locale.region}`;
}

export default function SourceLocaleInsights({ insights }) {
  const rows = insights || [];
  if (rows.length === 0) return null;

  return (
    <section className="mb-6 rounded-lg border border-line bg-paper px-4 py-4">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            언어권 표현
          </p>
          <h2 className="mt-1 font-serif text-lg font-bold">
            다른 곳에서는 이렇게 말해요
          </h2>
        </div>
        <span className="shrink-0 text-xs text-ink-faint">{rows.length}개 소스</span>
      </div>

      <div className="divide-y divide-line">
        {rows.map((insight) => (
          <div key={`${insight.locale}-${insight.cluster}`} className="py-3 first:pt-0 last:pb-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                {localeLabel(insight.locale)}
              </span>
              {insight.cluster && (
                <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-soft">
                  {insight.cluster}
                </span>
              )}
            </div>

            {insight.sourcePhrases?.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-1.5">
                {insight.sourcePhrases.slice(0, 5).map((phrase) => (
                  <span
                    key={phrase}
                    lang={insight.locale}
                    className="rounded-full border border-line bg-cream px-2.5 py-1 text-xs text-ink-soft"
                  >
                    {phrase}
                  </span>
                ))}
              </div>
            )}

            {insight.userDoors?.length > 0 && (
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {insight.userDoors[0]}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
