"use client";

import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  parseStoredArray,
  progressStorageKeys,
  readActiveRoutines,
  readFirstStorageValue,
  storageEvents,
} from "@/lib/client-storage";

const EMPTY_PROGRESS = "[]";

function subscribeRoutines(callback) {
  if (typeof window === "undefined") return () => {};

  for (const eventName of storageEvents.routines) {
    window.addEventListener(eventName, callback);
  }
  window.addEventListener("storage", callback);
  return () => {
    for (const eventName of storageEvents.routines) {
      window.removeEventListener(eventName, callback);
    }
    window.removeEventListener("storage", callback);
  };
}

function snapshotFor(routines) {
  if (typeof window === "undefined") return "{}";

  const progress = Object.fromEntries(
    routines.map((routine) => [
      routine.slug,
      parseStoredArray(
        readFirstStorageValue(progressStorageKeys(routine.slug), EMPTY_PROGRESS)
      ).filter((item) => Number.isInteger(item)),
    ])
  );

  return JSON.stringify({
    active: readActiveRoutines(),
    progress,
  });
}

function updatedTime(item) {
  const time = Date.parse(item?.updatedAt || "");
  return Number.isFinite(time) ? time : 0;
}

export default function RoutineResumePanel({
  routines,
  showEmpty = false,
  title = "진행 중인 루틴",
}) {
  const snapshot = useSyncExternalStore(
    subscribeRoutines,
    () => snapshotFor(routines),
    () => "{}"
  );
  const state = JSON.parse(snapshot || "{}");

  const rows = useMemo(() => {
    const active = Array.isArray(state.active) ? state.active : [];
    const progress = state.progress || {};
    const activeBySlug = new Map(active.map((item) => [item.slug, item]));

    return routines
      .map((routine) => {
        const completed = Array.isArray(progress[routine.slug])
          ? progress[routine.slug]
          : [];
        const activeItem = activeBySlug.get(routine.slug);
        const total = routine.steps?.length || activeItem?.stepCount || 0;
        const doneCount = completed.length;
        if (!activeItem && doneCount === 0) return null;

        return {
          slug: routine.slug,
          title: routine.title,
          href: `/routines/${routine.slug}#routine-progress`,
          categoryTitle: routine.categoryTitle,
          duration: routine.duration,
          total,
          doneCount,
          percent: total > 0 ? Math.round((doneCount / total) * 100) : 0,
          updatedAt: activeItem?.updatedAt,
        };
      })
      .filter(Boolean)
      .sort(
        (a, b) =>
          updatedTime(b) - updatedTime(a) ||
          b.percent - a.percent ||
          a.title.localeCompare(b.title, "ko")
      )
      .slice(0, 3);
  }, [routines, state]);

  if (rows.length === 0 && !showEmpty) return null;

  return (
    <section className="rounded-lg border border-line bg-paper px-4 py-4">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            My route
          </p>
          <h2 className="mt-1 font-serif text-lg font-bold">{title}</h2>
        </div>
        <Link
          href="/routines"
          className="shrink-0 text-sm text-ink-soft transition-colors hover:text-clay"
        >
          전체
        </Link>
      </div>

      {rows.length > 0 ? (
        <div className="space-y-2.5">
          {rows.map((row) => (
            <Link
              key={row.slug}
              href={row.href}
              className="group block rounded-lg border border-line bg-cream px-3 py-3 transition-colors hover:border-clay/40"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="block text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                    {row.categoryTitle} · {row.duration}
                  </span>
                  <span className="mt-1 block font-serif text-base font-bold group-hover:text-clay">
                    {row.title}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-paper px-2 py-0.5 text-[11px] font-medium text-clay ring-1 ring-line">
                  {row.percent}%
                </span>
              </span>
              <span className="mt-3 block h-2 overflow-hidden rounded-full bg-paper">
                <span
                  className="block h-full rounded-full bg-clay"
                  style={{ width: `${row.percent}%` }}
                />
              </span>
              <span className="mt-1.5 block text-xs text-ink-faint">
                {row.doneCount}/{row.total}개 행동 완료
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-line bg-cream px-4 py-4">
          <p className="font-serif text-base font-bold">아직 시작한 루틴이 없어요</p>
          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
            문제 카드를 읽고 맞는 루틴을 하나 고르면 이곳에서 바로 이어갈 수 있습니다.
          </p>
          <Link
            href="/routines"
            className="mt-3 inline-flex rounded-lg bg-clay px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-clay/90"
          >
            루틴 고르기
          </Link>
        </div>
      )}
    </section>
  );
}
