import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getDebate,
  getDebateGroup,
  getDebateContent,
  allDebateParams,
  debatePositionSummary,
  isPublishableContent,
} from "@/lib/content";
import PersonCard from "@/components/PersonCard";
import SaveButton from "@/components/SaveButton";
import ShareButton from "@/components/ShareButton";
import TagChips from "@/components/TagChips";
import RelatedExplore from "@/components/RelatedExplore";
import CollectedContent from "@/components/CollectedContent";
import ContentStatusNotice from "@/components/ContentStatusNotice";
import ContentBrief from "@/components/ContentBrief";
import SourceLocaleSignalSummary from "@/components/SourceLocaleSignalSummary";
import SourceLocaleInsights from "@/components/SourceLocaleInsights";
import { collectedContentForKey, seoDescriptionForCollection } from "@/lib/collected";

export function generateStaticParams() {
  return allDebateParams();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const d = getDebate(slug);
  if (!d) return { title: "위즈덤" };

  const content = getDebateContent(slug);
  const collection = collectedContentForKey(`debate/${slug}`);
  const baseDescription = content.placeholder
    ? `${d.question}에 대한 위즈덤 논쟁 카드 준비 중입니다.`
    : `${d.question}: ${d.blurb}`;
  const description = seoDescriptionForCollection(collection, baseDescription);

  return {
    title: `${d.question} — 위즈덤`,
    description,
    openGraph: {
      title: `${d.question} — 위즈덤`,
      description,
      type: "article",
      url: `/debate/${slug}`,
    },
    twitter: {
      card: "summary",
      title: `${d.question} — 위즈덤`,
      description,
    },
    robots: {
      index: isPublishableContent(content),
      follow: true,
    },
  };
}

export default async function DebatePage({ params }) {
  const { slug } = await params;
  const d = getDebate(slug);
  if (!d) notFound();
  const group = getDebateGroup(slug);

  const content = getDebateContent(slug);
  const positionRows = debatePositionSummary(slug);
  const collection = collectedContentForKey(`debate/${slug}`);
  const saveItem = {
    key: `debate/${slug}`,
    title: d.question,
    categoryTitle: "논쟁",
    href: `/debate/${slug}`,
  };

  return (
    <div className="fade-rise">
      <nav className="text-sm text-ink-soft mb-5">
        <Link href="/" className="hover:text-clay transition-colors">
          홈
        </Link>
        <span className="mx-1.5 text-ink-faint">›</span>
        <Link href="/debate" className="hover:text-clay transition-colors">
          논쟁
        </Link>
        <span className="mx-1.5 text-ink-faint">›</span>
        {group && (
          <>
            <span className="text-ink-soft">{group.title}</span>
            <span className="mx-1.5 text-ink-faint">›</span>
          </>
        )}
        <span className="text-ink">{d.question}</span>
      </nav>

      <header className="flex items-start justify-between gap-4 mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold leading-snug">
          {d.question}
        </h1>
        <SaveButton item={saveItem} />
      </header>

      <TagChips tags={content.tags} label="감정 / 상황 태그" />
      <ContentStatusNotice content={content} entryKey={`debate/${slug}`} />

      {content.placeholder ? (
        <div className="rounded-2xl border border-dashed border-line bg-paper/60 p-6 text-center">
          <p className="font-serif text-lg">이 논쟁의 카드는 준비 중이에요</p>
          <p className="mt-2 text-sm text-ink-soft leading-relaxed">
            위즈덤은 인용을 함부로 채우지 않습니다. 양쪽 입장 모두{" "}
            <span className="text-ink">실제 출처를 확인한 뒤에만</span> 공개돼요.
          </p>
        </div>
      ) : (
        <>
          <ContentBrief
            axis="debate"
            summary={d.blurb}
            cards={content.cards}
            sourceLocaleInsights={content.sourceLocaleInsights}
            sourceLocaleSignal={content.sourceLocaleSignal}
            reflect={content.reflect}
            positionRows={positionRows}
          />

          {positionRows.length > 0 && (
            <section className="mb-6 rounded-xl border border-line bg-paper px-4 py-4">
              <div className="mb-3 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
                    먼저 보는 핵심
                  </p>
                  <h2 className="mt-1 font-serif text-lg font-bold">
                    입장 한눈에 보기
                  </h2>
                </div>
                <span className="shrink-0 text-xs text-ink-faint">
                  {positionRows.length}개 입장
                </span>
              </div>
              <div className="divide-y divide-line">
                {positionRows.map((row) => (
                  <div
                    key={`${row.name}-${row.position}`}
                    className="grid grid-cols-[88px_1fr] gap-3 py-3 text-sm first:pt-0 last:pb-0 sm:grid-cols-[112px_1fr]"
                  >
                    <span
                      className={`w-fit rounded-full px-2 py-0.5 text-[11px] font-medium ${
                        row.position === "support"
                          ? "bg-clay-soft text-clay"
                          : row.position === "oppose"
                            ? "bg-ink/5 text-ink"
                            : row.position === "context"
                              ? "bg-cream text-ink-soft ring-1 ring-line"
                              : "border border-line text-ink-soft"
                      }`}
                    >
                      {row.positionTitle}
                    </span>
                    <div className="min-w-0">
                      <p className="font-serif font-bold text-ink">{row.name}</p>
                      <p className="mt-0.5 leading-relaxed text-ink-soft">
                        {row.stance || row.role}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <SourceLocaleSignalSummary signal={content.sourceLocaleSignal} />

          {content.doors?.length > 0 && (
            <section className="mb-6">
              <p className="text-[11px] font-medium tracking-wider text-ink-faint uppercase mb-2">
                이런 고민에서 떠오르죠
              </p>
              <div className="flex flex-wrap gap-2">
                {content.doors.map((door, i) => (
                  <span
                    key={i}
                    className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink-soft"
                  >
                    {door}
                  </span>
                ))}
              </div>
            </section>
          )}

          <SourceLocaleInsights insights={content.sourceLocaleInsights} />

          <div className="mb-5 flex items-start gap-2 text-sm text-ink-soft">
            <span aria-hidden className="mt-0.5 text-clay">
              ⚖
            </span>
            <p>
              정답은 없어요. 서로 다른 관점들이{" "}
              <span className="text-ink font-medium">서로 반대편</span>에서 한 말을
              나란히 둡니다.
            </p>
          </div>

          <section className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <h2 className="font-serif text-lg font-bold">입장 카드</h2>
              <span className="text-xs text-ink-faint">{content.cards.length}개</span>
            </div>
            {content.cards.map((card, i) => (
              <PersonCard key={i} card={card} actionLabel="이 입장이 말하는 것" />
            ))}
          </section>

          {content.reflect?.length > 0 && (
            <section className="mt-8">
              <h2 className="font-serif text-lg font-bold mb-3">스스로 물어볼 것</h2>
              <ul className="space-y-2.5">
                {content.reflect.map((q, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                    <span className="text-[15px] leading-relaxed">{q}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <CollectedContent collection={collection} />

          <RelatedExplore currentKey={`debate/${slug}`} />

          <div className="mt-10 pt-6 border-t border-line flex items-center justify-between gap-3">
            <p className="text-sm text-ink-soft">친구는 어느 쪽일까. 물어보세요.</p>
            <ShareButton title={`${d.question} — 위즈덤`} href={saveItem.href} />
          </div>
        </>
      )}
    </div>
  );
}
