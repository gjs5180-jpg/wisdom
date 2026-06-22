import Link from "next/link";
import { groupedTagsWithCounts } from "@/lib/content";

export const metadata = { title: "태그 — 위즈덤" };

export default function TagsPage() {
  const groups = groupedTagsWithCounts();

  return (
    <div className="fade-rise">
      <nav className="text-sm text-ink-soft mb-5">
        <Link href="/" className="hover:text-clay transition-colors">
          홈
        </Link>
        <span className="mx-1.5 text-ink-faint">›</span>
        <span className="text-ink">태그</span>
      </nav>

      <header className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold">태그</h1>
        <p className="mt-2 text-ink-soft leading-relaxed">
          대분류로는 흩어져 보이는 카드들을 감정과 상황으로 다시 묶었습니다.
          같은 관점이 여러 고민과 논쟁에서 어떻게 반복되는지 볼 수 있어요.
        </p>
      </header>

      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group.slug}>
            <div className="mb-3">
              <h2 className="font-serif text-lg font-bold">{group.title}</h2>
              <p className="mt-0.5 text-sm text-ink-soft">{group.blurb}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.tags.map((tag) => (
                <Link
                  key={tag.slug}
                  href={`/tags/${tag.slug}`}
                  className="rounded-full border border-line bg-paper px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
                >
                  <span className="text-ink">{tag.title}</span>
                  <span className="ml-1.5 text-xs text-ink-faint">
                    {tag.entryCount} / {tag.cardCount}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
