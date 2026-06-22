"use client";

import { useState } from "react";

export default function ShareButton({ title, href }) {
  const [copied, setCopied] = useState(false);

  async function onShare() {
    const url =
      typeof window !== "undefined" ? window.location.origin + href : href;

    // 모바일 등 네이티브 공유 지원 시 그걸로
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // 사용자가 취소한 경우 등 — 조용히 무시
      }
    }
    // 아니면 링크 복사
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard 권한 없을 때 — 무시
    }
  }

  return (
    <button
      onClick={onShare}
      className="shrink-0 rounded-full bg-clay px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
    >
      {copied ? "링크 복사됨 ✓" : "친구에게 보내기"}
    </button>
  );
}
