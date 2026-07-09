"use client";

import { useMemo, useSyncExternalStore } from "react";

const EMPTY_PROGRESS = "[]";

function storageKey(slug) {
  return `wisdom:routine-progress:${slug}`;
}

function readProgressSnapshot(slug) {
  if (typeof window === "undefined") return EMPTY_PROGRESS;

  try {
    return localStorage.getItem(storageKey(slug)) || EMPTY_PROGRESS;
  } catch {
    return EMPTY_PROGRESS;
  }
}

function parseProgress(snapshot) {
  try {
    const parsed = JSON.parse(snapshot);
    return Array.isArray(parsed)
      ? parsed.filter((item) => Number.isInteger(item))
      : [];
  } catch {
    return [];
  }
}

function subscribeProgress(callback) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("wisdom:routine-progress-changed", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("wisdom:routine-progress-changed", callback);
    window.removeEventListener("storage", callback);
  };
}

export default function RoutineProgress({ routine }) {
  const total = routine.steps.length;
  const snapshot = useSyncExternalStore(
    subscribeProgress,
    () => readProgressSnapshot(routine.slug),
    () => EMPTY_PROGRESS
  );
  const completed = parseProgress(snapshot);

  const completedSet = useMemo(() => new Set(completed || []), [completed]);
  const doneCount = completed.length;
  const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;

  function persist(next) {
    const sorted = [...new Set(next)].sort((a, b) => a - b);
    localStorage.setItem(storageKey(routine.slug), JSON.stringify(sorted));
    window.dispatchEvent(new Event("wisdom:routine-progress-changed"));
  }

  function toggle(index) {
    if (completedSet.has(index)) {
      persist(completed.filter((item) => item !== index));
      return;
    }
    persist([...completed, index]);
  }

  function reset() {
    localStorage.removeItem(storageKey(routine.slug));
    window.dispatchEvent(new Event("wisdom:routine-progress-changed"));
  }

  return (
    <section className="mt-8 border-y border-line py-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            진행 체크
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold">
            오늘 한 만큼 표시하기
          </h2>
        </div>
        <button
          type="button"
          onClick={reset}
          className="shrink-0 rounded-lg border border-line px-3 py-1.5 text-sm text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
        >
          초기화
        </button>
      </div>

      <div className="rounded-lg border border-line bg-cream px-4 py-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <p className="font-serif text-2xl font-bold">{percent}%</p>
            <p className="mt-1 text-sm text-ink-soft">
              {doneCount}/{total}개 행동 완료
            </p>
          </div>
          <p className="max-w-[12rem] text-right text-xs leading-relaxed text-ink-faint">
            이 진행률은 이 브라우저에만 저장됩니다.
          </p>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-paper">
          <div
            className="h-full rounded-full bg-clay transition-[width]"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      <ol className="mt-5 space-y-3">
        {routine.steps.map((step, index) => {
          const checked = completedSet.has(index);

          return (
            <li
              key={`${routine.slug}-${step.title}`}
              className={`rounded-lg border px-4 py-4 transition-colors ${
                checked
                  ? "border-clay/30 bg-clay-soft"
                  : "border-line bg-paper"
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  aria-pressed={checked}
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-sm font-bold transition-colors ${
                    checked
                      ? "border-clay bg-clay text-white"
                      : "border-line bg-cream text-ink-faint hover:border-clay/40 hover:text-clay"
                  }`}
                >
                  {checked ? "✓" : index + 1}
                </button>
                <div className="min-w-0">
                  <h3 className="font-serif text-base font-bold">{step.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                    {step.idea}
                  </p>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <div className="rounded-lg border border-line bg-cream px-3 py-2.5">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-clay">
                        오늘의 미션
                      </p>
                      <p className="mt-1 text-sm leading-relaxed">{step.mission}</p>
                    </div>
                    <div className="rounded-lg border border-line bg-cream px-3 py-2.5">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-clay">
                        완료 기준
                      </p>
                      <p className="mt-1 text-sm leading-relaxed">{step.check}</p>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
