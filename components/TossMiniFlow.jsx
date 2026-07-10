"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

const STORAGE_KEY = "mindroute:toss-mini-flow";

function readStoredState() {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function progressText(doneCount, total) {
  if (total === 0) return "0%";
  return `${Math.round((doneCount / total) * 100)}%`;
}

export default function TossMiniFlow({ nodes }) {
  const firstKey = nodes[0]?.key || "";
  const hydratedRef = useRef(false);
  const [selectedKey, setSelectedKey] = useState(firstKey);
  const [selectedCause, setSelectedCause] = useState(0);
  const [selectedMethod, setSelectedMethod] = useState(0);
  const [completedByKey, setCompletedByKey] = useState({});
  const [notesByKey, setNotesByKey] = useState({});

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const stored = readStoredState();
      if (stored?.selectedKey) setSelectedKey(stored.selectedKey);
      if (Number.isInteger(stored?.selectedCause)) setSelectedCause(stored.selectedCause);
      if (Number.isInteger(stored?.selectedMethod)) setSelectedMethod(stored.selectedMethod);
      if (stored?.completedByKey) setCompletedByKey(stored.completedByKey);
      if (stored?.notesByKey) setNotesByKey(stored.notesByKey);
      hydratedRef.current = true;
    }, 0);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!hydratedRef.current || typeof window === "undefined") return;

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        selectedKey,
        selectedCause,
        selectedMethod,
        completedByKey,
        notesByKey,
      })
    );
  }, [completedByKey, notesByKey, selectedCause, selectedKey, selectedMethod]);

  const selectedNode = nodes.find((node) => node.key === selectedKey) || nodes[0];
  const method = selectedNode?.methods[selectedMethod] || selectedNode?.methods[0];
  const cause = selectedNode?.causes[selectedCause] || selectedNode?.causes[0];
  const actionItems = useMemo(() => {
    if (!selectedNode) return [];
    return [...new Set([method?.action, ...selectedNode.actions].filter(Boolean))].slice(0, 4);
  }, [method, selectedNode]);

  const completed = completedByKey[selectedNode?.key] || [];
  const completedSet = new Set(completed);
  const note = notesByKey[selectedNode?.key] || "";
  const doneCount = completed.length;

  function chooseNode(key) {
    setSelectedKey(key);
    setSelectedCause(0);
    setSelectedMethod(0);
  }

  function toggleAction(index) {
    if (!selectedNode) return;

    setCompletedByKey((current) => {
      const currentItems = current[selectedNode.key] || [];
      const nextItems = currentItems.includes(index)
        ? currentItems.filter((item) => item !== index)
        : [...currentItems, index].sort((a, b) => a - b);

      return {
        ...current,
        [selectedNode.key]: nextItems,
      };
    });
  }

  function updateNote(value) {
    if (!selectedNode) return;

    setNotesByKey((current) => ({
      ...current,
      [selectedNode.key]: value.slice(0, 220),
    }));
  }

  if (!selectedNode) return null;

  return (
    <div className="space-y-5">
      <section className="rounded-lg border border-line bg-paper px-4 py-4">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              Problem
            </p>
            <h2 className="mt-1 font-serif text-lg font-bold">고민 선택</h2>
          </div>
          <span className="shrink-0 text-xs text-ink-faint">{nodes.length}개</span>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {nodes.map((node) => {
            const active = node.key === selectedNode.key;

            return (
              <button
                key={node.key}
                type="button"
                onClick={() => chooseNode(node.key)}
                className={`rounded-lg border px-3 py-3 text-left transition-colors ${
                  active
                    ? "border-clay/40 bg-clay-soft"
                    : "border-line bg-cream hover:border-clay/30"
                }`}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block font-serif text-base font-bold">
                      {node.title}
                    </span>
                    <span className="mt-1 line-clamp-2 block text-sm leading-relaxed text-ink-soft">
                      {node.summary}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-paper px-2 py-0.5 text-[11px] text-clay ring-1 ring-line">
                    {node.categoryTitle}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-line bg-paper px-4 py-4">
        <div className="mb-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            Cause
          </p>
          <h2 className="mt-1 font-serif text-lg font-bold">원인 후보</h2>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {selectedNode.causes.map((item, index) => {
            const active = index === selectedCause;

            return (
              <button
                key={`${selectedNode.key}-${item.title}`}
                type="button"
                onClick={() => setSelectedCause(index)}
                className={`rounded-lg border px-3 py-3 text-left transition-colors ${
                  active
                    ? "border-clay/40 bg-clay-soft"
                    : "border-line bg-cream hover:border-clay/30"
                }`}
              >
                <span className="block font-serif text-base font-bold">{item.title}</span>
                <span className="mt-1 block text-sm leading-relaxed text-ink-soft">
                  {item.body}
                </span>
              </button>
            );
          })}
        </div>
        {cause && (
          <div className="mt-3 rounded-lg border border-line bg-cream px-3 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-clay">
              오늘의 기준
            </p>
            <p className="mt-1 text-sm leading-relaxed">{cause.check}</p>
          </div>
        )}
      </section>

      <section className="rounded-lg border border-line bg-paper px-4 py-4">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              Method
            </p>
            <h2 className="mt-1 font-serif text-lg font-bold">근거 있는 방법</h2>
          </div>
          <Link
            href={selectedNode.href}
            className="shrink-0 text-xs text-ink-soft underline decoration-line underline-offset-2 transition-colors hover:text-clay"
          >
            상세
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {selectedNode.methods.map((item, index) => {
            const active = index === selectedMethod;

            return (
              <button
                key={`${selectedNode.key}-${item.name}`}
                type="button"
                onClick={() => setSelectedMethod(index)}
                className={`rounded-lg border px-3 py-3 text-left transition-colors ${
                  active
                    ? "border-clay/40 bg-clay-soft"
                    : "border-line bg-cream hover:border-clay/30"
                }`}
              >
                <span className="flex flex-wrap items-center gap-1.5">
                  <span className="font-serif text-base font-bold">{item.name}</span>
                  <span className="rounded-full bg-paper px-2 py-0.5 text-[11px] text-clay ring-1 ring-line">
                    {item.sourceLabel}
                  </span>
                </span>
                <span className="mt-1.5 line-clamp-3 block text-sm leading-relaxed text-ink-soft">
                  {item.view}
                </span>
              </button>
            );
          })}
        </div>
        {method && (
          <div className="mt-3 rounded-lg border border-line bg-cream px-3 py-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-clay">
              선택한 방법
            </p>
            <p className="mt-1 text-sm leading-relaxed">{method.action}</p>
          </div>
        )}
      </section>

      <section className="rounded-lg border border-line bg-paper px-4 py-4">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              Tracker
            </p>
            <h2 className="mt-1 font-serif text-lg font-bold">오늘 행동 기록</h2>
          </div>
          <span className="shrink-0 font-serif text-xl font-bold text-clay">
            {progressText(doneCount, actionItems.length)}
          </span>
        </div>

        <div className="space-y-2">
          {actionItems.map((action, index) => {
            const checked = completedSet.has(index);

            return (
              <button
                key={`${selectedNode.key}-${action}`}
                type="button"
                onClick={() => toggleAction(index)}
                className={`grid w-full grid-cols-[1.75rem_1fr] gap-2 rounded-lg border px-3 py-3 text-left transition-colors ${
                  checked
                    ? "border-clay/40 bg-clay-soft"
                    : "border-line bg-cream hover:border-clay/30"
                }`}
              >
                <span
                  className={`mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border text-sm font-bold ${
                    checked
                      ? "border-clay bg-clay text-white"
                      : "border-line bg-paper text-ink-faint"
                  }`}
                >
                  {checked ? "✓" : index + 1}
                </span>
                <span className="text-sm leading-relaxed">{action}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-3">
          <textarea
            value={note}
            onChange={(event) => updateNote(event.target.value)}
            placeholder="오늘 막힌 이유, 해본 행동, 내일 바꿀 조건"
            className="min-h-24 w-full resize-none rounded-lg border border-line bg-cream px-3 py-3 text-sm leading-relaxed outline-none transition-colors placeholder:text-ink-faint focus:border-clay/50"
            aria-label="오늘 행동 기록"
          />
          <div className="mt-1 flex items-center justify-between gap-3 text-xs text-ink-faint">
            <span>이 기기에 저장됨</span>
            <span>{note.length}/220</span>
          </div>
        </div>
      </section>
    </div>
  );
}
