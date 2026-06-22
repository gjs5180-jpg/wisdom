// 고민·논쟁 상세에서 공용으로 쓰는 인물 시각 카드.
// 서버 컴포넌트(상호작용 없음). 출처/검증 배지가 이 앱의 핵심 신뢰 장치.

import Link from "next/link";
import PerspectiveLensBadge from "./PerspectiveLensBadge";

export function VerifiedBadge({ verified }) {
  if (verified) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-clay-soft px-2 py-0.5 font-medium text-clay">
        <span aria-hidden>✓</span> 출처 확인됨
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-ink-faint">
      출처 확인 중
    </span>
  );
}

export default function PersonCard({ card, actionLabel = "이 상황에서의 행동 지침" }) {
  const sourceLabel = [card.sourceTypeLabel, card.sourceYear].filter(Boolean).join(" · ");

  return (
    <article className="rounded-2xl border border-line bg-paper p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="font-serif text-lg font-bold">{card.name}</h3>
          <p className="text-xs text-ink-faint mt-0.5">{card.role}</p>
          {card.personCulture && (
            <p className="mt-1 text-xs text-ink-faint">
              {card.personCulture.country} · {card.personCulture.tradition}
            </p>
          )}
        </div>
        <div className="flex max-w-[54%] flex-wrap justify-end gap-1.5 sm:max-w-none">
          <PerspectiveLensBadge card={card} />
          {card.stance && (
            <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-ink-soft">
              {card.stance}
            </span>
          )}
        </div>
      </div>

      <p className="mt-3 text-[15px] leading-relaxed">{card.view}</p>

      {card.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {card.tags.slice(0, 6).map((tag) => (
            <Link
              key={tag.slug}
              href={`/tags/${tag.slug}`}
              className="rounded-full border border-line bg-cream px-2.5 py-0.5 text-[11px] text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
            >
              {tag.title}
            </Link>
          ))}
        </div>
      )}

      {card.action && (
        <div className="mt-3 rounded-xl bg-cream px-4 py-3">
          <p className="text-[11px] font-medium tracking-wide text-ink-faint mb-1">
            {actionLabel}
          </p>
          <p className="text-[15px] leading-relaxed">{card.action}</p>
        </div>
      )}

      {card.quote && (
        <blockquote className="mt-3 border-l-2 border-clay/40 pl-3.5 text-ink-soft">
          <p className="mb-1 text-[11px] font-medium tracking-wide text-ink-faint">
            {card.verified ? "출처 기반 요지" : "초안 요지"}
          </p>
          <p className="font-serif italic leading-relaxed">{card.quote}</p>
        </blockquote>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <VerifiedBadge verified={card.verified} />
        {sourceLabel && (
          <span className="rounded-full border border-line px-2 py-0.5 text-ink-faint">
            {sourceLabel}
          </span>
        )}
        {card.sourceUrl ? (
          <a
            href={card.sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="text-ink-faint underline decoration-line underline-offset-2 transition-colors hover:text-clay"
          >
            {card.source}
          </a>
        ) : (
          card.source && <span className="text-ink-faint">{card.source}</span>
        )}
      </div>
    </article>
  );
}
