"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitch from "./LanguageSwitch";

const koreanLinks = [
  { href: "/", label: "질문지도" },
  { href: "/people", label: "인물" },
  { href: "/tags", label: "태그" },
  { href: "/source-locales", label: "언어권", className: "hidden sm:inline" },
  { href: "/collected", label: "수집", className: "hidden sm:inline" },
  { href: "/saved", label: "저장함", className: "hidden sm:inline" },
];

const englishLinks = [
  { href: "/en", label: "Question map" },
  { href: "/en#english-nodes", label: "Nodes", className: "hidden sm:inline" },
  { href: "/source-locales", label: "Source languages", className: "hidden sm:inline" },
  { href: "/", label: "Korean map" },
];

export default function HeaderNav() {
  const pathname = usePathname() || "/";
  const isEnglish = pathname === "/en" || pathname.startsWith("/en/");
  const links = isEnglish ? englishLinks : koreanLinks;

  return (
    <nav className="flex items-center gap-3 text-xs text-ink-soft sm:gap-4 sm:text-sm">
      {links.map((link) => (
        <Link
          key={`${link.href}-${link.label}`}
          href={link.href}
          className={`${link.className || ""} transition-colors hover:text-clay`}
        >
          {link.label}
        </Link>
      ))}
      <LanguageSwitch />
    </nav>
  );
}
