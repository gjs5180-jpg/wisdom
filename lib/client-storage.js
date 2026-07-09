export const storageKeys = {
  saved: "mindroute:saved",
  legacySaved: "wisdom:saved",
  activeRoutines: "mindroute:active-routines",
  legacyActiveRoutines: "wisdom:active-routines",
  routineProgress: (slug) => `mindroute:routine-progress:${slug}`,
  legacyRoutineProgress: (slug) => `wisdom:routine-progress:${slug}`,
};

export const storageEvents = {
  saved: ["mindroute:saved-changed", "wisdom:saved-changed"],
  routines: [
    "mindroute:routines-changed",
    "mindroute:routine-progress-changed",
    "wisdom:routine-progress-changed",
  ],
};

export function parseStoredArray(snapshot) {
  try {
    const parsed = JSON.parse(snapshot || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function readFirstStorageValue(keys, fallback = "[]") {
  if (typeof window === "undefined") return fallback;

  try {
    for (const key of keys) {
      const value = localStorage.getItem(key);
      if (value) return value;
    }
  } catch {
    return fallback;
  }

  return fallback;
}

export function writeStorageMirrors(keys, value) {
  if (typeof window === "undefined") return;

  for (const key of keys) {
    localStorage.setItem(key, value);
  }
}

export function removeStorageMirrors(keys) {
  if (typeof window === "undefined") return;

  for (const key of keys) {
    localStorage.removeItem(key);
  }
}

export function dispatchStorageEvents(events) {
  if (typeof window === "undefined") return;

  for (const eventName of events) {
    window.dispatchEvent(new Event(eventName));
  }
}

export function savedStorageKeys() {
  return [storageKeys.saved, storageKeys.legacySaved];
}

export function activeRoutineStorageKeys() {
  return [storageKeys.activeRoutines, storageKeys.legacyActiveRoutines];
}

export function progressStorageKeys(slug) {
  return [storageKeys.routineProgress(slug), storageKeys.legacyRoutineProgress(slug)];
}

export function readActiveRoutines() {
  return parseStoredArray(readFirstStorageValue(activeRoutineStorageKeys()));
}

export function writeActiveRoutines(items) {
  writeStorageMirrors(activeRoutineStorageKeys(), JSON.stringify(items));
  dispatchStorageEvents(storageEvents.routines);
}

export function routineActiveItem(routine) {
  return {
    slug: routine.slug,
    title: routine.title,
    href: `/routines/${routine.slug}`,
    categoryTitle: routine.categoryTitle,
    duration: routine.duration,
    stepCount: routine.steps?.length || routine.stepCount || 0,
    updatedAt: new Date().toISOString(),
  };
}

export function touchActiveRoutine(routine) {
  const item = routineActiveItem(routine);
  const current = readActiveRoutines();
  const next = [item, ...current.filter((x) => x.slug !== item.slug)].slice(0, 12);
  writeActiveRoutines(next);
}

export function removeActiveRoutine(slug) {
  const current = readActiveRoutines();
  writeActiveRoutines(current.filter((item) => item.slug !== slug));
}
