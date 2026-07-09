import Link from "next/link";
import { allPeople } from "@/lib/content";

export const metadata = { title: "인물 — 마인드루트" };

export default function PeoplePage() {
  const people = allPeople();

  return (
    <div className="fade-rise">
      <nav className="text-sm text-ink-soft mb-5">
        <Link href="/" className="hover:text-clay transition-colors">
          홈
        </Link>
        <span className="mx-1.5 text-ink-faint">›</span>
        <span className="text-ink">인물</span>
      </nav>

      <header className="mb-6">
        <h1 className="font-serif text-2xl sm:text-3xl font-bold">인물</h1>
        <p className="mt-2 text-ink-soft leading-relaxed">
          같은 사상가의 관점이 여러 고민, 생각, 논쟁에서 어떻게 반복되는지 묶어
          봅니다.
        </p>
      </header>

      <ul className="divide-y divide-line border-y border-line">
        {people.map((person) => (
          <li key={person.slug}>
            <Link
              href={`/people/${person.slug}`}
              className="group block py-4 transition-colors hover:text-clay"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="block font-serif text-base font-bold">
                    {person.name}
                  </span>
                  <span className="mt-0.5 block text-xs text-ink-faint">
                    {person.role}
                  </span>
                  <span className="mt-1.5 flex flex-wrap gap-1.5 text-[11px] text-ink-faint">
                    <span className="rounded-full border border-line px-2 py-0.5">
                      {person.culture.country}
                    </span>
                    <span className="rounded-full border border-line px-2 py-0.5">
                      {person.culture.tradition}
                    </span>
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-ink-soft">
                    {person.summary}
                  </span>
                  {person.tags.length > 0 && (
                    <span className="mt-2 flex flex-wrap gap-1.5">
                      {person.tags.slice(0, 5).map((tag) => (
                        <span
                          key={tag.slug}
                          className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-soft"
                        >
                          {tag.title}
                        </span>
                      ))}
                    </span>
                  )}
                </span>
                <span className="shrink-0 text-right text-xs text-ink-faint">
                  <span className="block">카드 {person.cardCount}</span>
                  <span className="block">페이지 {person.entryCount}</span>
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
