"use client";

import { usePathname, useRouter } from "next/navigation";
import seedData from "@/data/global_phrase_seeds.json";
import {
  localeByPathname,
  localizedPath,
  stripLocalePrefix,
  supportedLocales,
} from "@/lib/locales";

const localizedRoutes = new Set(["/", ...seedData.nodes.map((node) => node.route)]);

function hrefForLocale(pathname, locale) {
  const basePath = stripLocalePrefix(pathname);
  if (locale === "ko") return basePath;
  if (!localizedRoutes.has(basePath)) return localizedPath("/", locale);
  return localizedPath(basePath, locale);
}

export default function LanguageSwitch() {
  const pathname = usePathname() || "/";
  const router = useRouter();
  const currentLocale = localeByPathname(pathname).locale;

  return (
    <label
      className="flex shrink-0 items-center rounded-full border border-line bg-paper px-2 py-1 text-[11px] text-ink-soft"
      aria-label="Language switch"
    >
      <span className="sr-only">Language</span>
      <select
        value={currentLocale}
        onChange={(event) => router.push(hrefForLocale(pathname, event.target.value))}
        className="bg-transparent text-[11px] font-medium outline-none"
      >
        {supportedLocales.map((locale) => (
          <option key={locale.locale} value={locale.locale}>
            {locale.shortLabel}
          </option>
        ))}
      </select>
    </label>
  );
}
