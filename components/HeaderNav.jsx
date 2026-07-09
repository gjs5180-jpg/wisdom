"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitch from "./LanguageSwitch";
import { localeByPathname, localizedPath } from "@/lib/locales";

const koreanLinks = [
  { href: "/", label: "지도", className: "hidden sm:inline" },
  { href: "/routines", label: "루틴", className: "hidden sm:inline" },
  { href: "/people", label: "인물", className: "hidden sm:inline" },
  { href: "/tags", label: "태그", className: "hidden sm:inline" },
  { href: "/source-locales", label: "언어권", className: "hidden sm:inline" },
  { href: "/saved", label: "저장", className: "hidden sm:inline" },
];

const englishLinks = [
  { href: "/en", label: "Question map" },
  { href: "/en#english-nodes", label: "Nodes", className: "hidden sm:inline" },
  { href: "/source-locales", label: "Source languages", className: "hidden sm:inline" },
  { href: "/", label: "Korean map" },
];

function localizedLinks(locale) {
  if (locale === "ko") return koreanLinks;
  if (locale === "en") return englishLinks;

  const home = localizedPath("/", locale);
  return [
    { href: home, label: "Question map" },
    { href: `${home}#localized-nodes`, label: "Nodes", className: "hidden sm:inline" },
    { href: "/source-locales", label: "Source languages", className: "hidden sm:inline" },
    { href: "/", label: "Korean map" },
  ];
}

export default function HeaderNav() {
  const pathname = usePathname() || "/";
  const currentLocale = localeByPathname(pathname).locale;
  const links = localizedLinks(currentLocale);

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
