import { isPublishableContent } from "@/lib/content";

const HEALTH_KEYS = new Set([
  "body/health-anxiety",
  "body/insomnia",
  "body/aging-anxiety",
  "body/hair-loss-stress",
  "body/body-anxiety",
  "work/work-depression",
]);

export default function ContentStatusNotice({ content, entryKey }) {
  const isDraft = content && !content.placeholder && !isPublishableContent(content);
  const isHealth = HEALTH_KEYS.has(entryKey);
  const unverifiedCards = (content?.cards || []).filter((card) => !card.verified);

  if (!isDraft && !isHealth) return null;

  return (
    <section className="mb-6 border-y border-line py-4">
      {isDraft && (
        <div>
          <p className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
            검증 중 초안
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            이 카드는 수집어를 바탕으로 만든 초안입니다. 출처 문구와 맥락 확인이 끝나기
            전까지는 공개 색인 대상이 아니며, 관점 카드도 검증 전 요지로 표시됩니다.
          </p>
          {unverifiedCards.length > 0 && (
            <details className="mt-3 rounded-xl border border-line bg-paper p-4">
              <summary className="cursor-pointer font-serif text-sm font-bold">
                공개 전 검증 체크리스트
              </summary>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink-soft">
                <li>원전 또는 신뢰 가능한 2차 출처에서 관점이 실제로 확인되는지 본다.</li>
                <li>직접 인용처럼 보이는 문장은 원문 문구와 번역 맥락을 대조한다.</li>
                <li>행동 지침이 출처의 주장보다 과장되어 있지 않은지 줄인다.</li>
                <li>최소 2개 카드가 검증되기 전까지는 검색 색인 대상에서 제외한다.</li>
              </ul>
              <div className="mt-3 divide-y divide-line border-y border-line">
                {unverifiedCards.map((card) => (
                  <div key={card.name} className="grid grid-cols-[6rem_1fr] gap-3 py-2.5 text-sm">
                    <span className="font-serif font-bold text-ink">{card.name}</span>
                    <span className="min-w-0 text-ink-faint">
                      {card.source || "출처 확인 필요"}
                    </span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}
      {isHealth && (
        <div className={isDraft ? "mt-4 border-t border-line pt-4" : ""}>
          <p className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
            건강 관련 안내
          </p>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            이 내용은 진단이나 치료 지침이 아닙니다. 증상이 심하거나 일상 기능이
            무너질 정도라면 의료진이나 정신건강 전문가에게 상담하세요. 급박한 위험이
            있으면 거주 지역의 응급 도움을 먼저 이용해야 합니다.
          </p>
        </div>
      )}
    </section>
  );
}
