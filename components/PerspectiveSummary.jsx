import PerspectiveLensBadge from "./PerspectiveLensBadge";

function compact(text, limit = 104) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit).trim()}...`;
}

export default function PerspectiveSummary({
  cards,
  eyebrow = "먼저 보는 핵심",
  title = "관점 비교",
}) {
  const items = cards || [];
  if (items.length === 0) return null;

  return (
    <section className="mb-6 rounded-xl border border-line bg-paper px-4 py-4">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
            {eyebrow}
          </p>
          <h2 className="mt-1 font-serif text-lg font-bold">{title}</h2>
        </div>
        <span className="shrink-0 text-xs text-ink-faint">
          {items.length}개 관점
        </span>
      </div>
      <div className="divide-y divide-line">
        {items.map((card, index) => (
          <div
            key={`${card.name}-${card.stance || card.role}`}
            className="grid grid-cols-[2rem_1fr] gap-3 py-3 first:pt-0 last:pb-0"
          >
            <span className="font-serif text-lg font-bold text-ink-faint">
              {String(index + 1).padStart(2, "0")}
            </span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-serif font-bold">{card.name}</span>
                <PerspectiveLensBadge card={card} compact />
                {card.stance && (
                  <span className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-soft">
                    {card.stance}
                  </span>
                )}
                {card.sourceTypeLabel && (
                  <span className="rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                    {card.sourceTypeLabel}
                    {card.sourceYear ? ` · ${card.sourceYear}` : ""}
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {compact(card.view)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
