import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allThoughtParams,
  getThought,
  getThoughtContent,
  getThoughtGroup,
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
import PerspectiveSummary from "@/components/PerspectiveSummary";
import SourceLocaleSignalSummary from "@/components/SourceLocaleSignalSummary";
import SourceLocaleInsights from "@/components/SourceLocaleInsights";
import { collectedContentForKey, seoDescriptionForCollection } from "@/lib/collected";

export function generateStaticParams() {
  return allThoughtParams();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const thought = getThought(slug);
  if (!thought) return { title: "마인드루트" };

  const content = getThoughtContent(slug);
  const collection = collectedContentForKey(`thought/${slug}`);
  const baseDescription = content.placeholder
    ? `${thought.question}에 대한 마인드루트 생각 카드 준비 중입니다.`
    : `${thought.question}: ${thought.blurb}`;
  const description = seoDescriptionForCollection(collection, baseDescription);

  return {
    title: `${thought.question} — 마인드루트`,
    description,
    openGraph: {
      title: `${thought.question} — 마인드루트`,
      description,
      type: "article",
      url: `/thought/${slug}`,
    },
    twitter: {
      card: "summary",
      title: `${thought.question} — 마인드루트`,
      description,
    },
    robots: {
      index: isPublishableContent(content),
      follow: true,
    },
  };
}

export default async function ThoughtPage({ params }) {
  const { slug } = await params;
  const thought = getThought(slug);
  if (!thought) notFound();
  const group = getThoughtGroup(slug);
  const content = getThoughtContent(slug);
  const collection = collectedContentForKey(`thought/${slug}`);

  const saveItem = {
    key: `thought/${slug}`,
    title: thought.question,
    categoryTitle: "생각",
    href: `/thought/${slug}`,
  };

  return (
    <div className="fade-rise">
      <nav className="text-sm text-ink-soft mb-5">
        <Link href="/" className="hover:text-clay transition-colors">
          홈
        </Link>
        <span className="mx-1.5 text-ink-faint">›</span>
        <Link href="/thought" className="hover:text-clay transition-colors">
          생각
        </Link>
        <span className="mx-1.5 text-ink-faint">›</span>
        {group && (
          <>
            <span className="text-ink-soft">{group.title}</span>
            <span className="mx-1.5 text-ink-faint">›</span>
          </>
        )}
        <span className="text-ink">{thought.question}</span>
      </nav>

      <header className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold leading-snug">
            {thought.question}
          </h1>
          <p className="mt-2 text-ink-soft leading-relaxed">{thought.blurb}</p>
        </div>
        <SaveButton item={saveItem} />
      </header>

      <TagChips tags={content.tags} label="감정 / 상황 태그" />
      <ContentStatusNotice content={content} entryKey={`thought/${slug}`} />

      {content.placeholder ? (
        <div className="rounded-2xl border border-dashed border-line bg-paper/60 p-6 text-center">
          <p className="font-serif text-lg">이 생각의 카드는 준비 중이에요</p>
          <p className="mt-2 text-sm text-ink-soft leading-relaxed">
            마인드루트는 큰 질문도 가볍게 단정하지 않습니다. 원전과 맥락을 확인한 뒤에만
            공개돼요.
          </p>
        </div>
      ) : (
        <>
          <ContentBrief
            axis="thought"
            summary={thought.blurb}
            cards={content.cards}
            sourceLocaleInsights={content.sourceLocaleInsights}
            sourceLocaleSignal={content.sourceLocaleSignal}
            reflect={content.reflect}
          />

          <PerspectiveSummary
            cards={content.cards}
            title={content.cards.length > 3 ? "이 질문의 기준들" : "이 질문의 세 기준"}
          />

          <SourceLocaleSignalSummary signal={content.sourceLocaleSignal} />

          {content.doors?.length > 0 && (
            <section className="mb-6">
              <p className="text-[11px] font-medium tracking-wider text-ink-faint uppercase mb-2">
                이런 질문에서 이어져요
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
              하나의 정의로 닫지 않고, 서로 다른 기준을{" "}
              <span className="text-ink font-medium">비교 가능한 관점</span>으로
              놓습니다.
            </p>
          </div>

          <section className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <h2 className="font-serif text-lg font-bold">기준 카드</h2>
              <span className="text-xs text-ink-faint">{content.cards.length}개</span>
            </div>
            {content.cards.map((card, i) => (
              <PersonCard
                key={i}
                card={card}
                axis="thought"
                actionLabel="이 기준으로 살아본다면"
              />
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

          <RelatedExplore currentKey={`thought/${slug}`} />

          <div className="mt-10 pt-6 border-t border-line flex items-center justify-between gap-3">
            <p className="text-sm text-ink-soft">다음에 다시 꺼내 볼 질문으로 남겨두세요.</p>
            <ShareButton title={`${thought.question} — 마인드루트`} href={saveItem.href} />
          </div>
        </>
      )}
    </div>
  );
}
