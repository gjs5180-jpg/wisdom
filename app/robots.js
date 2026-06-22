const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3005";

export const dynamic = "force-static";

function absolute(path) {
  const base = SITE_URL.endsWith("/") ? SITE_URL : `${SITE_URL}/`;
  return new URL(path.replace(/^\//, ""), base).toString();
}

export default function robots() {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/saved", "/collected"],
    },
    sitemap: absolute("/sitemap.xml"),
  };
}
