"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitch from "./LanguageSwitch";

const koreanLinks = [
  { href: "/#worry-start", label: "고민" },
  { href: "/thought", label: "생각", className: "hidden sm:inline" },
  { href: "/debate", label: "논쟁" },
  { href: "/people", label: "인물" },
  { href: "/tags", label: "태그" },
  { href: "/collected", label: "수집", className: "hidden sm:inline" },
  { href: "/saved", label: "저장함", className: "hidden sm:inline" },
];

const englishLinks = [
  { href: "/en", label: "Home" },
  { href: "/en/thought/good-life", label: "Good life", className: "hidden sm:inline" },
  { href: "/en/thought/happiness", label: "Happiness", className: "hidden sm:inline" },
  { href: "/en/debate/ai-replacement", label: "AI" },
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
