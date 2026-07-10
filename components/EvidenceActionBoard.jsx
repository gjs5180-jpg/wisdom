function compact(text, limit = 118) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit).trim()}...`;
}

function sourceLabel(card) {
  return [card.sourceTypeLabel, card.sourceYear].filter(Boolean).join(" · ");
}

export default function EvidenceActionBoard({ cards = [] }) {
  const candidates = cards.filter((card) => card.action);
  const verified = candidates.filter((card) => card.verified);
  const items = (verified.length > 0 ? verified : candidates).slice(0, 4);

  if (items.length === 0) return null;

  return (
    <section className="mb-7 rounded-lg border border-line bg-paper px-4 py-4">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            Evidence
          </p>
          <h2 className="mt-1 font-serif text-lg font-bold">
            근거 있는 방법에서 행동 고르기
          </h2>
        </div>
        <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
          검증 {verified.length}/{cards.length}
        </span>
      </div>

      <div className="divide-y divide-line">
        {items.map((card, index) => (
          <article
            key={`${card.name}-${card.source || index}`}
            className="grid grid-cols-[2rem_1fr] gap-3 py-3 first:pt-0 last:pb-0"
          >
            <span className="font-serif text-lg font-bold text-ink-faint">
              {index + 1}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="font-serif font-bold">{card.name}</span>
                {sourceLabel(card) && (
                  <span className="rounded-full border border-line bg-cream px-2 py-0.5 text-[11px] text-ink-soft">
                    {sourceLabel(card)}
                  </span>
                )}
                <span className="rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                  {card.verified ? "출처 확인" : "확인 중"}
                </span>
              </div>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                {compact(card.view, 136)}
              </p>
              <div className="mt-2 rounded-lg bg-cream px-3 py-2.5">
                <p className="text-[11px] font-medium uppercase tracking-wider text-clay">
                  제안 행동
                </p>
                <p className="mt-1 text-sm leading-relaxed">{compact(card.action, 152)}</p>
              </div>
              {card.sourceUrl ? (
                <a
                  href={card.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-block text-xs text-ink-faint underline decoration-line underline-offset-2 transition-colors hover:text-clay"
                >
                  {compact(card.source, 92)}
                </a>
              ) : (
                card.source && (
                  <p className="mt-2 text-xs leading-relaxed text-ink-faint">
                    {compact(card.source, 92)}
                  </p>
                )
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
