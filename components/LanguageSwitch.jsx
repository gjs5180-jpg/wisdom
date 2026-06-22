"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import seedData from "@/data/global_phrase_seeds.json";

const englishRoutes = new Set(["/", ...seedData.nodes.map((node) => node.route)]);

function stripEnglishPrefix(pathname) {
  if (pathname === "/en") return "/";
  if (pathname.startsWith("/en/")) return pathname.replace(/^\/en/, "") || "/";
  return pathname || "/";
}

function englishHrefFor(pathname) {
  const koreanPath = stripEnglishPrefix(pathname);
  if (!englishRoutes.has(koreanPath)) return "/en";
  return koreanPath === "/" ? "/en" : `/en${koreanPath}`;
}

export default function LanguageSwitch() {
  const pathname = usePathname() || "/";
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const koreanHref = stripEnglishPrefix(pathname);
  const englishHref = englishHrefFor(pathname);

  return (
    <div
      className="flex shrink-0 items-center rounded-full border border-line bg-paper p-0.5 text-[11px]"
      aria-label="Language switch"
    >
      <Link
        href={koreanHref}
        className={`rounded-full px-2 py-0.5 transition-colors ${
          isEnglish ? "text-ink-soft hover:text-clay" : "bg-clay-soft font-medium text-clay"
        }`}
      >
        KO
      </Link>
      <Link
        href={englishHref}
        className={`rounded-full px-2 py-0.5 transition-colors ${
          isEnglish ? "bg-clay-soft font-medium text-clay" : "text-ink-soft hover:text-clay"
        }`}
      >
        EN
      </Link>
    </div>
  );
}
