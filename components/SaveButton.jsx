"use client";

import { useSyncExternalStore } from "react";
import {
  dispatchStorageEvents,
  parseStoredArray,
  readFirstStorageValue,
  savedStorageKeys,
  storageEvents,
  writeStorageMirrors,
} from "@/lib/client-storage";

const EMPTY_SAVED = "[]";

function readSavedSnapshot() {
  return readFirstStorageValue(savedStorageKeys(), EMPTY_SAVED);
}

function writeSaved(list) {
  writeStorageMirrors(savedStorageKeys(), JSON.stringify(list));
  dispatchStorageEvents(storageEvents.saved);
}

function subscribeSaved(callback) {
  if (typeof window === "undefined") return () => {};

  for (const eventName of storageEvents.saved) {
    window.addEventListener(eventName, callback);
  }
  window.addEventListener("storage", callback);
  return () => {
    for (const eventName of storageEvents.saved) {
      window.removeEventListener(eventName, callback);
    }
    window.removeEventListener("storage", callback);
  };
}

export default function SaveButton({ item }) {
  const snapshot = useSyncExternalStore(
    subscribeSaved,
    readSavedSnapshot,
    () => EMPTY_SAVED
  );
  const list = parseStoredArray(snapshot);
  const saved = list.some((x) => x.key === item.key);

  function toggle() {
    let next;
    if (saved) {
      next = list.filter((x) => x.key !== item.key);
    } else {
      next = [{ ...item, savedAt: new Date().toISOString() }, ...list];
    }
    writeSaved(next);
  }

  return (
    <button
      onClick={toggle}
      aria-pressed={saved}
      className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
        saved
          ? "bg-clay text-white"
          : "border border-line text-ink-soft hover:border-clay/40 hover:text-clay"
      }`}
    >
      {saved ? "저장됨" : "저장"}
    </button>
  );
}
