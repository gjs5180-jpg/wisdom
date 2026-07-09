"use client";

import { useSyncExternalStore } from "react";
import {
  parseStoredArray,
  progressStorageKeys,
  readActiveRoutines,
  readFirstStorageValue,
  storageEvents,
  touchActiveRoutine,
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

function snapshotFor(routine) {
  if (typeof window === "undefined") return "{}";

  const active = readActiveRoutines().some((item) => item.slug === routine.slug);
  const completed = parseStoredArray(
    readFirstStorageValue(progressStorageKeys(routine.slug), EMPTY_PROGRESS)
  );

  return JSON.stringify({
    active,
    doneCount: completed.filter((item) => Number.isInteger(item)).length,
  });
}

export default function RoutineStartButton({ routine }) {
  const snapshot = useSyncExternalStore(
    subscribeRoutines,
    () => snapshotFor(routine),
    () => "{}"
  );
  const status = JSON.parse(snapshot || "{}");
  const started = status.active || status.doneCount > 0;

  function startRoutine() {
    touchActiveRoutine(routine);
    window.requestAnimationFrame(() => {
      document
        .getElementById("routine-progress")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  return (
    <button
      type="button"
      onClick={startRoutine}
      className="shrink-0 rounded-lg bg-clay px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-clay/90"
    >
      {started ? "이어하기" : "루틴 시작"}
    </button>
  );
}
