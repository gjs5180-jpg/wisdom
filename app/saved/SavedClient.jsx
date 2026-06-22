"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

const KEY = "wisdom:saved";

export default function SavedClient() {
  const [items, setItems] = useState(null);
  const [activeCategory, setActiveCategory] = useState("전체");

  useEffect(() => {
    const load = () => {
      try {
        setItems(JSON.parse(localStorage.getItem(KEY) || "[]"));
      } catch {
        setItems([]);
      }
    };
    load();
    window.addEventListener("wisdom:saved-changed", load);
    window.addEventListener("storage", load);
    return () => {
      window.removeEventListener("wisdom:saved-changed", load);
      window.removeEventListener("storage", load);
    };
  }, []);

  function remove(key) {
    const next = (items || []).filter((x) => x.key !== key);
    localStorage.setItem(KEY, JSON.stringify(next));
    setItems(next);
  }

  const categories = useMemo(() => {
    if (!items) return ["전체"];
    return ["전체", ...new Set(items.map((item) => item.categoryTitle).filter(Boolean))];
  }, [items]);

  const selectedCategory = categories.includes(activeCategory) ? activeCategory : "전체";

  const visibleItems =
    selectedCategory === "전체"
      ? items || []
      : (items || []).filter((item) => item.categoryTitle === selectedCategory);

  return (
    <div className="fade-rise">
      <h1 className="font-serif text-2xl sm:text-3xl font-bold mb-6">저장함</h1>

      {items === null ? null : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line bg-paper/60 p-8 text-center">
          <p className="font-serif text-lg">아직 저장한 고민이 없어요</p>
          <p className="mt-2 text-sm text-ink-soft">
            마음에 닿는 고민을 만나면 ♡ 저장해 두세요.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-full bg-clay px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            고민 둘러보기 →
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                  selectedCategory === category
                    ? "bg-clay text-white"
                    : "border border-line text-ink-soft hover:border-clay/40 hover:text-clay"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <ul className="divide-y divide-line border-y border-line">
            {visibleItems.map((it) => (
              <li key={it.key} className="flex items-center justify-between gap-3 py-4">
                <Link
                  href={it.href}
                  className="group min-w-0 transition-colors hover:text-clay"
                >
                  <span className="block text-base truncate">{it.title}</span>
                  <span className="block text-xs text-ink-faint mt-0.5">
                    {it.categoryTitle}
                  </span>
                </Link>
                <button
                  onClick={() => remove(it.key)}
                  className="shrink-0 text-xs text-ink-faint hover:text-clay transition-colors"
                  aria-label={`${it.title} 저장 해제`}
                >
                  해제
                </button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
