"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import RoutineResumePanel from "@/components/RoutineResumePanel";
import {
  dispatchStorageEvents,
  parseStoredArray,
  readFirstStorageValue,
  savedStorageKeys,
  storageEvents,
  writeStorageMirrors,
} from "@/lib/client-storage";

export default function SavedClient({ routines }) {
  const [items, setItems] = useState(null);
  const [activeCategory, setActiveCategory] = useState("전체");

  useEffect(() => {
    const load = () => {
      setItems(parseStoredArray(readFirstStorageValue(savedStorageKeys())));
    };
    load();
    for (const eventName of storageEvents.saved) {
      window.addEventListener(eventName, load);
    }
    window.addEventListener("storage", load);
    return () => {
      for (const eventName of storageEvents.saved) {
        window.removeEventListener(eventName, load);
      }
      window.removeEventListener("storage", load);
    };
  }, []);

  function remove(key) {
    const next = (items || []).filter((x) => x.key !== key);
    writeStorageMirrors(savedStorageKeys(), JSON.stringify(next));
    dispatchStorageEvents(storageEvents.saved);
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
      <header className="mb-6">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
          My route
        </p>
        <h1 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
          저장함
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          다시 읽을 카드와 진행 중인 루틴을 한곳에 모아둡니다.
        </p>
      </header>

      <div className="mb-8">
        <RoutineResumePanel routines={routines} />
      </div>

      {items === null ? null : items.length === 0 ? (
        <div className="rounded-lg border border-dashed border-line bg-paper/60 p-8 text-center">
          <p className="font-serif text-lg">아직 저장한 항목이 없어요</p>
          <p className="mt-2 text-sm text-ink-soft">
            마음에 닿는 카드나 루틴을 만나면 저장해 두세요.
          </p>
          <Link
            href="/"
            className="mt-4 inline-block rounded-lg bg-clay px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            문제 둘러보기
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
