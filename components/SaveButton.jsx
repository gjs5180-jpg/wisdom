"use client";

import { useSyncExternalStore } from "react";

const KEY = "wisdom:saved";
const EMPTY_SAVED = "[]";

function readSavedSnapshot() {
  if (typeof window === "undefined") return EMPTY_SAVED;
  try {
    return localStorage.getItem(KEY) || EMPTY_SAVED;
  } catch {
    return EMPTY_SAVED;
  }
}

function parseSaved(snapshot) {
  try {
    const parsed = JSON.parse(snapshot);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function subscribeSaved(callback) {
  if (typeof window === "undefined") return () => {};

  window.addEventListener("wisdom:saved-changed", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("wisdom:saved-changed", callback);
    window.removeEventListener("storage", callback);
  };
}

export default function SaveButton({ item }) {
  const snapshot = useSyncExternalStore(
    subscribeSaved,
    readSavedSnapshot,
    () => EMPTY_SAVED
  );
  const list = parseSaved(snapshot);
  const saved = list.some((x) => x.key === item.key);

  function toggle() {
    let next;
    if (saved) {
      next = list.filter((x) => x.key !== item.key);
    } else {
      next = [item, ...list];
    }
    localStorage.setItem(KEY, JSON.stringify(next));
    window.dispatchEvent(new Event("wisdom:saved-changed"));
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
      {saved ? "저장됨 ✓" : "♡ 저장"}
    </button>
  );
}
