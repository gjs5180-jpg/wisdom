import {
  collectedPhraseGroups,
  collectedCandidateQueue,
  collectedReviewGroups,
  collectedReviewReasonCounts,
  collectedStats,
} from "@/lib/collected";
import CollectedExplorer from "@/components/CollectedExplorer";

export const metadata = {
  title: "수집된 고민 지도 — 마인드루트",
  description:
    "인터넷에서 수집한 고민과 논쟁 표현을 대표 콘텐츠로 분류한 마인드루트의 수집 지도입니다.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function CollectedPage() {
  const groups = collectedPhraseGroups();
  const stats = collectedStats();
  const reviewGroups = collectedReviewGroups(40);
  const reviewReasons = collectedReviewReasonCounts();
  const candidateQueue = collectedCandidateQueue();
  const explorerGroups = groups.map((group) => ({
    key: group.key,
    href: group.entry.href,
    title: group.entry.title,
    categoryTitle: group.entry.categoryTitle,
    groupTitle: group.entry.groupTitle,
    publishable: group.entry.publishable,
    phrases: group.phrases,
    sourceCategories: group.sourceCategories,
    contentized: group.contentized,
  }));
  const statRows = [
    { label: "수집어", value: stats.total },
    { label: "대표 카드", value: stats.canonicalCount },
    { label: "본문 요약", value: stats.contentization?.summaryCoreRows || 0 },
    { label: "검토 노트", value: stats.contentization?.reviewNotes || 0 },
    { label: "미분류", value: stats.unmappedCount },
    { label: "저신호", value: stats.contentization?.lowSignalRows || 0 },
  ];

  return (
    <div className="fade-rise">
      <section className="pb-8">
        <p className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
          collected map
        </p>
        <h1 className="mt-2 font-serif text-3xl font-bold leading-snug">
          수집된 고민 지도
        </h1>
        <p className="mt-3 text-ink-soft leading-relaxed">
          흩어진 검색 표현을 대표 고민과 논쟁 카드로 묶었습니다. 같은 카드라도 여러
          말투와 상황에서 다시 발견될 수 있게 만드는 중입니다.
        </p>
      </section>

      <section className="mb-8 border-y border-line py-4">
        <dl className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {statRows.map((row) => (
            <div key={row.label}>
              <dt className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
                {row.label}
              </dt>
              <dd className="mt-1 font-serif text-2xl font-bold">
                {row.value.toLocaleString("ko-KR")}
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <CollectedExplorer
        groups={explorerGroups}
        reviewGroups={reviewGroups}
        reviewReasons={reviewReasons}
        reviewCount={stats.reviewCount}
        candidateQueue={candidateQueue}
      />
    </div>
  );
}
