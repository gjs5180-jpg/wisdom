// 고민·논쟁 상세에서 공용으로 쓰는 인물 시각 카드.
// 서버 컴포넌트(상호작용 없음). 출처/검증 배지가 이 앱의 핵심 신뢰 장치.

import Link from "next/link";
import PerspectiveLensBadge from "./PerspectiveLensBadge";

const axisCopy = {
  worry: {
    stanceLabel: "관점",
    viewLabel: "핵심 관점",
    defaultActionLabel: "이 상황에서의 행동 지침",
  },
  debate: {
    stanceLabel: "세부 입장",
    viewLabel: "핵심 논리",
    defaultActionLabel: "이 입장이 말하는 것",
  },
  thought: {
    stanceLabel: "기준",
    viewLabel: "핵심 기준",
    defaultActionLabel: "이 기준으로 살아본다면",
  },
};

const positionCopy = {
  support: {
    label: "찬성 / 허용",
    className: "border-clay/30 bg-clay-soft text-clay",
    note: "이 질문에 긍정하거나 제도·행위의 유지 가능성을 봅니다.",
  },
  oppose: {
    label: "반대 / 금지",
    className: "border-ink/10 bg-ink/5 text-ink",
    note: "제도·행위의 폐지, 금지, 강한 제한 쪽에 무게를 둡니다.",
  },
  conditional: {
    label: "조건부 / 절충",
    className: "border-line bg-cream text-ink-soft",
    note: "상황, 결과, 기준, 대체 제도에 따라 다르게 판단합니다.",
  },
  context: {
    label: "사실 / 제도 정리",
    className: "border-line bg-paper text-ink-soft",
    note: "찬반 이전에 개념, 현행 기준, 판단 구조를 정리합니다.",
  },
};

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

function PositionBadge({ position }) {
  if (!position) return null;

  const meta = positionCopy[position.position] || {
    label: position.positionTitle,
    className: "border-line bg-paper text-ink-soft",
    note: "",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${meta.className}`}
    >
      {position.positionTitle || meta.label}
    </span>
  );
}

function DetailSection({ label, children, className = "" }) {
  return (
    <div className={`mt-3 ${className}`}>
      <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-ink-faint">
        {label}
      </p>
      <div className="text-[15px] leading-relaxed">{children}</div>
    </div>
  );
}

function sourceReliabilityText(card) {
  const parts = [];
  if (card.verified) parts.push("검증됨");
  if (card.sourceTypeLabel) parts.push(card.sourceTypeLabel);
  if (card.sourceYear) parts.push(card.sourceYear);
  return parts.join(" · ");
}

export default function PersonCard({
  card,
  axis = "worry",
  position,
  actionLabel,
}) {
  const copy = axisCopy[axis] || axisCopy.worry;
  const sourceLabel = [card.sourceTypeLabel, card.sourceYear].filter(Boolean).join(" · ");
  const resolvedActionLabel = actionLabel || copy.defaultActionLabel;
  const positionMeta = position ? positionCopy[position.position] : null;
  const sourceReliability = sourceReliabilityText(card);

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
          <PositionBadge position={position} />
          <PerspectiveLensBadge card={card} />
          {card.stance && !position && (
            <span className="rounded-full border border-line px-2.5 py-0.5 text-[11px] text-ink-soft">
              {card.stance}
            </span>
          )}
        </div>
      </div>

      {sourceReliability && (
        <div className="mt-3 rounded-lg border border-line bg-cream px-4 py-2.5">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-medium text-clay">신뢰 단서</span>
            <span className="text-ink-soft">{sourceReliability}</span>
          </div>
        </div>
      )}

      {(position || card.stance) && (
        <div className="mt-3 rounded-lg bg-cream px-4 py-3">
          <div className="grid gap-2 sm:grid-cols-[78px_1fr]">
            <p className="text-[11px] font-medium uppercase tracking-wide text-clay">
              {position ? "입장" : copy.stanceLabel}
            </p>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5">
                {position ? <PositionBadge position={position} /> : null}
                {card.stance && (
                  <span className="rounded-full border border-line bg-paper px-2.5 py-0.5 text-[11px] text-ink-soft">
                    {card.stance}
                  </span>
                )}
              </div>
              {positionMeta?.note && (
                <p className="mt-1 text-xs leading-relaxed text-ink-faint">
                  {positionMeta.note}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <DetailSection label={copy.viewLabel}>
        <p>{card.view}</p>
      </DetailSection>

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
        <DetailSection label={resolvedActionLabel} className="rounded-lg bg-cream px-4 py-3">
          <p>{card.action}</p>
        </DetailSection>
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
