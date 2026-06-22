import Link from "next/link";
import { notFound } from "next/navigation";
import {
  allWorryParams,
  getCategory,
  getWorry,
  getContent,
  getWorryGroup,
  isPublishableContent,
} from "@/lib/content";
import PersonCard from "@/components/PersonCard";
import SaveButton from "@/components/SaveButton";
import ShareButton from "@/components/ShareButton";
import TagChips from "@/components/TagChips";
import RelatedExplore from "@/components/RelatedExplore";
import CollectedContent from "@/components/CollectedContent";
import ContentStatusNotice from "@/components/ContentStatusNotice";
import PerspectiveSummary from "@/components/PerspectiveSummary";
import SourceLocaleSignalSummary from "@/components/SourceLocaleSignalSummary";
import SourceLocaleInsights from "@/components/SourceLocaleInsights";
import { collectedContentForKey, seoDescriptionForCollection } from "@/lib/collected";

export function generateStaticParams() {
  return allWorryParams();
}

export async function generateMetadata({ params }) {
  const { category, worry } = await params;
  const w = getWorry(category, worry);
  if (!w) return { title: "위즈덤" };

  const content = getContent(category, worry);
  const collection = collectedContentForKey(`${category}/${worry}`);
  const baseDescription = content.placeholder
    ? `${w.title}에 대한 위즈덤 카드 준비 중입니다.`
    : `${w.title}: ${content.emotion}`;
  const description = seoDescriptionForCollection(collection, baseDescription);

  return {
    title: `${w.title} — 위즈덤`,
    description,
    openGraph: {
      title: `${w.title} — 위즈덤`,
      description,
      type: "article",
      url: `/${category}/${worry}`,
    },
    twitter: {
      card: "summary",
      title: `${w.title} — 위즈덤`,
      description,
    },
    robots: {
      index: isPublishableContent(content),
      follow: true,
    },
  };
}

export default async function WorryPage({ params }) {
  const { category, worry } = await params;
  const cat = getCategory(category);
  const w = getWorry(category, worry);
  if (!cat || !w) notFound();
  const group = getWorryGroup(cat.slug);

  const content = getContent(category, worry);
  const stances = [...new Set(content.cards.map((c) => c.stance).filter(Boolean))];
  const hasConflict = stances.length > 1;
  const collection = collectedContentForKey(`${category}/${worry}`);

  const saveItem = {
    key: `${category}/${worry}`,
    title: w.title,
    categoryTitle: cat.title,
    href: `/${category}/${worry}`,
  };

  return (
    <div className="fade-rise">
      {/* 빵부스러기 */}
      <nav className="text-sm text-ink-soft mb-5">
        <Link href="/" className="hover:text-clay transition-colors">
          홈
        </Link>
        <span className="mx-1.5 text-ink-faint">›</span>
        {group && (
          <>
            <span className="text-ink-soft">{group.title}</span>
            <span className="mx-1.5 text-ink-faint">›</span>
          </>
        )}
        <Link href={`/${cat.slug}`} className="hover:text-clay transition-colors">
          {cat.title}
        </Link>
        <span className="mx-1.5 text-ink-faint">›</span>
        <span className="text-ink">{w.title}</span>
      </nav>

      {/* 헤더 + 저장 */}
      <header className="flex items-start justify-between gap-4 mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold leading-snug">
          {w.title}
        </h1>
        <SaveButton item={saveItem} />
      </header>

      <TagChips tags={content.tags} label="감정 / 상황 태그" />
      <ContentStatusNotice content={content} entryKey={`${category}/${worry}`} />

      {content.placeholder ? (
        <PlaceholderBody />
      ) : (
        <>
          {/* ① 감정 한 줄 정의 */}
          <section className="mb-8 rounded-2xl bg-clay-soft/60 px-5 py-5">
            <p className="text-[11px] font-medium tracking-wider text-clay uppercase mb-1.5">
              감정 한 줄 정의
            </p>
            <p className="font-serif text-lg leading-relaxed">{content.emotion}</p>
          </section>

          <PerspectiveSummary
            cards={content.cards}
            title={content.cards.length > 3 ? "이 고민의 관점들" : "이 고민의 세 관점"}
          />

          <SourceLocaleSignalSummary signal={content.sourceLocaleSignal} />

          {/* 상황 입구 (유저 언어) */}
          {content.doors?.length > 0 && (
            <section className="mb-6">
              <p className="text-[11px] font-medium tracking-wider text-ink-faint uppercase mb-2">
                이럴 때 찾게 돼요
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

          {/* 충돌 시각 안내 */}
          {hasConflict && (
            <div className="mb-5 flex items-start gap-2 text-sm text-ink-soft">
              <span aria-hidden className="mt-0.5 text-clay">⚖</span>
              <p>
                이 고민엔 <span className="text-ink font-medium">서로 다른 시각</span>이
                있어요. 정답이 아니라, 골라 쓰라고 나란히 둡니다.
              </p>
            </div>
          )}

          {/* ② 인물별 시각 카드 */}
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-3">
              <h2 className="font-serif text-lg font-bold">관점 카드</h2>
              <span className="text-xs text-ink-faint">{content.cards.length}개</span>
            </div>
            {content.cards.map((card, i) => (
              <PersonCard key={i} card={card} />
            ))}
          </section>

          {/* ③ 지금 당장 해볼 것 */}
          {content.actions?.length > 0 && (
            <section className="mt-8">
              <h2 className="font-serif text-lg font-bold mb-3">지금 당장 해볼 것</h2>
              <ul className="space-y-2.5">
                {content.actions.map((a, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                    <span className="text-[15px] leading-relaxed">{a}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <CollectedContent collection={collection} />

          <RelatedExplore currentKey={`${category}/${worry}`} />

          {/* 공유 */}
          <div className="mt-10 pt-6 border-t border-line flex items-center justify-between gap-3">
            <p className="text-sm text-ink-soft">
              비슷한 고민을 지나는 사람에게 건네보세요.
            </p>
            <ShareButton title={`${w.title} — 위즈덤`} href={saveItem.href} />
          </div>
        </>
      )}
    </div>
  );
}

function PlaceholderBody() {
  return (
    <div className="rounded-2xl border border-dashed border-line bg-paper/60 p-6 text-center">
      <p className="font-serif text-lg">이 고민의 카드는 준비 중이에요</p>
      <p className="mt-2 text-sm text-ink-soft leading-relaxed">
        위즈덤은 인용을 함부로 채우지 않습니다. 각 카드는{" "}
        <span className="text-ink">실제 출처를 확인한 뒤에만</span> 공개돼요.
      </p>
      <Link
        href="/"
        className="mt-4 inline-block rounded-full bg-clay px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        완성된 카드 모아보기 →
      </Link>
    </div>
  );
}
