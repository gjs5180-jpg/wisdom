"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import LanguageSwitch from "./LanguageSwitch";
import { localeByPathname, localizedPath } from "@/lib/locales";

const koreanLinks = [
  { href: "/", label: "홈", className: "hidden md:inline" },
  { href: "/routines", label: "루틴", className: "hidden sm:inline" },
  { href: "/tags", label: "탐색", className: "hidden sm:inline" },
  { href: "/saved", label: "내 루트", className: "hidden sm:inline" },
];

const englishLinks = [
  { href: "/en", label: "Home", className: "hidden md:inline" },
  { href: "/routines", label: "Routines", className: "hidden sm:inline" },
  { href: "/saved", label: "My route", className: "hidden sm:inline" },
];

function localizedLinks(locale) {
  if (locale === "ko") return koreanLinks;
  if (locale === "en") return englishLinks;

  const home = localizedPath("/", locale);
  return [
    { href: home, label: "Home", className: "hidden md:inline" },
    { href: "/routines", label: "Routines", className: "hidden sm:inline" },
    { href: "/saved", label: "My route", className: "hidden sm:inline" },
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
