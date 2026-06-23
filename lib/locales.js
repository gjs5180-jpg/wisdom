export const defaultLocale = "ko";

export const supportedLocales = [
  {
    locale: "ko",
    hreflang: "ko-KR",
    label: "한국어",
    shortLabel: "KO",
    routePrefix: "",
    status: "primary",
  },
  {
    locale: "en",
    hreflang: "en-US",
    label: "English",
    shortLabel: "EN",
    routePrefix: "/en",
    sourceLocale: "en-US",
    status: "seed",
  },
  {
    locale: "ja",
    hreflang: "ja-JP",
    label: "日本語",
    shortLabel: "JA",
    routePrefix: "/ja",
    sourceLocale: "ja-JP",
    status: "preview",
  },
  {
    locale: "zh",
    hreflang: "zh-CN",
    label: "中文",
    shortLabel: "ZH",
    routePrefix: "/zh",
    sourceLocale: "zh-CN",
    status: "preview",
  },
  {
    locale: "es",
    hreflang: "es-ES",
    label: "Español",
    shortLabel: "ES",
    routePrefix: "/es",
    sourceLocale: "es-ES",
    status: "preview",
  },
  {
    locale: "fr",
    hreflang: "fr-FR",
    label: "Français",
    shortLabel: "FR",
    routePrefix: "/fr",
    sourceLocale: "fr-FR",
    status: "preview",
  },
  {
    locale: "de",
    hreflang: "de-DE",
    label: "Deutsch",
    shortLabel: "DE",
    routePrefix: "/de",
    sourceLocale: "de-DE",
    status: "preview",
  },
];

export const localizedPreviewLocales = supportedLocales.filter(
  (locale) => locale.status === "preview"
);

export function localeByCode(locale) {
  return supportedLocales.find((item) => item.locale === locale) || supportedLocales[0];
}

export function localeByPathname(pathname = "/") {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return (
    supportedLocales
      .filter((locale) => locale.routePrefix)
      .sort((a, b) => b.routePrefix.length - a.routePrefix.length)
      .find(
        (locale) => path === locale.routePrefix || path.startsWith(`${locale.routePrefix}/`)
      ) || supportedLocales[0]
  );
}

export function stripLocalePrefix(pathname = "/") {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const locale = localeByPathname(path);
  if (!locale.routePrefix) return path;
  if (path === locale.routePrefix) return "/";
  return path.replace(locale.routePrefix, "") || "/";
}

export function localizedPath(pathname, locale = defaultLocale) {
  const basePath = stripLocalePrefix(pathname);
  const target = localeByCode(locale);
  if (!target.routePrefix) return basePath;
  return basePath === "/" ? target.routePrefix : `${target.routePrefix}${basePath}`;
}

export function alternateLanguageLinks(pathname) {
  return Object.fromEntries(
    supportedLocales.map((item) => [item.hreflang, localizedPath(pathname, item.locale)])
  );
}
