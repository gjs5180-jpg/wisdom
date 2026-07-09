"use client";

import { useSyncExternalStore } from "react";
import {
  dispatchStorageEvents,
  readFirstStorageValue,
  routineNoteStorageKeys,
  storageEvents,
  touchActiveRoutine,
  writeStorageMirrors,
} from "@/lib/client-storage";

const MAX_LENGTH = 280;

function readNoteSnapshot(slug) {
  return readFirstStorageValue(routineNoteStorageKeys(slug), "");
}

function subscribeRoutineNote(callback) {
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

export default function RoutineReflection({ routine }) {
  const note = useSyncExternalStore(
    subscribeRoutineNote,
    () => readNoteSnapshot(routine.slug),
    () => ""
  );

  function saveNote(value) {
    const next = value.slice(0, MAX_LENGTH);
    writeStorageMirrors(routineNoteStorageKeys(routine.slug), next);

    if (next.trim()) {
      touchActiveRoutine(routine);
    } else {
      dispatchStorageEvents(storageEvents.routines);
    }
  }

  function clearNote() {
    saveNote("");
  }

  return (
    <section className="mt-5 rounded-lg border border-line bg-paper px-4 py-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            생각 기록
          </p>
          <h3 className="mt-1 font-serif text-lg font-bold">
            오늘 해보니 남은 것
          </h3>
        </div>
        {note && (
          <button
            type="button"
            onClick={clearNote}
            className="shrink-0 text-xs text-ink-faint transition-colors hover:text-clay"
          >
            비우기
          </button>
        )}
      </div>
      <textarea
        value={note}
        onChange={(event) => saveNote(event.target.value)}
        placeholder="오늘 행동하면서 떠오른 생각, 막힌 점, 다음에 조정할 점을 짧게 남겨보세요."
        className="min-h-28 w-full resize-none rounded-lg border border-line bg-cream px-3 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-ink-faint focus:border-clay/50"
        aria-label="루틴 생각 기록"
      />
      <div className="mt-2 flex items-center justify-between gap-3 text-xs text-ink-faint">
        <span>이 기록은 이 브라우저에만 저장됩니다.</span>
        <span>
          {note.length}/{MAX_LENGTH}
        </span>
      </div>
    </section>
  );
}
