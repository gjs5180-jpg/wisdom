export const defaultLocale = "ko";

export const supportedLocales = [
  {
    locale: "ko",
    hreflang: "ko-KR",
    label: "한국어",
    routePrefix: "",
    status: "primary",
  },
  {
    locale: "en",
    hreflang: "en-US",
    label: "English",
    routePrefix: "/en",
    status: "seed",
  },
  {
    locale: "ja",
    hreflang: "ja-JP",
    label: "日本語",
    routePrefix: "/ja",
    status: "planned",
  },
];

export function localizedPath(pathname, locale = defaultLocale) {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const target = supportedLocales.find((item) => item.locale === locale);
  if (!target || target.locale === defaultLocale) return path;
  return `${target.routePrefix}${path === "/" ? "" : path}`;
}

export function alternateLanguageLinks(pathname) {
  return Object.fromEntries(
    supportedLocales.map((item) => [item.hreflang, localizedPath(pathname, item.locale)])
  );
}
