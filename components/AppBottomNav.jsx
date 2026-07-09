"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeByPathname, localizedPath } from "@/lib/locales";

const koTabs = [
  {
    href: "/",
    label: "홈",
    icon: "⌂",
    match: (path) =>
      path === "/" ||
      (!path.startsWith("/routines") && !path.startsWith("/saved") && !path.startsWith("/tags")),
  },
  { href: "/routines", label: "루틴", icon: "✓", match: (path) => path.startsWith("/routines") },
  { href: "/saved", label: "내 루트", icon: "♡", match: (path) => path.startsWith("/saved") },
  { href: "/tags", label: "탐색", icon: "#", match: (path) => path.startsWith("/tags") },
];

function tabsForLocale(locale) {
  if (locale === "ko") return koTabs;

  const home = localizedPath("/", locale);
  return [
    {
      href: home,
      label: "Home",
      icon: "⌂",
      match: (path) =>
        path === home ||
        (!path.startsWith("/routines") && !path.startsWith("/saved") && !path.startsWith("/tags")),
    },
    { href: "/routines", label: "Routine", icon: "✓", match: (path) => path.startsWith("/routines") },
    { href: "/saved", label: "Saved", icon: "♡", match: (path) => path.startsWith("/saved") },
    { href: "/tags", label: "Explore", icon: "#", match: (path) => path.startsWith("/tags") },
  ];
}

export default function AppBottomNav() {
  const pathname = usePathname() || "/";
  const currentLocale = localeByPathname(pathname).locale;
  const tabs = tabsForLocale(currentLocale);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-paper/95 px-3 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 shadow-[0_-8px_24px_rgba(44,39,34,0.08)] backdrop-blur sm:hidden">
      <div className="mx-auto grid max-w-2xl grid-cols-4 gap-1">
        {tabs.map((tab) => {
          const active = tab.match(pathname);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`flex min-h-12 flex-col items-center justify-center rounded-lg text-xs transition-colors ${
                active
                  ? "bg-clay-soft font-medium text-clay"
                  : "text-ink-soft hover:bg-cream hover:text-clay"
              }`}
            >
              <span className="text-base leading-none" aria-hidden>
                {tab.icon}
              </span>
              <span className="mt-1 leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
