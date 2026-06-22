import {
  allContentEntries,
  allPeople,
  allTags,
  categories,
  entriesForTag,
} from "@/lib/content";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://127.0.0.1:3005";
const now = new Date();

export const dynamic = "force-static";

function absolute(path) {
  const base = SITE_URL.endsWith("/") ? SITE_URL : `${SITE_URL}/`;
  return new URL(path.replace(/^\//, ""), base).toString();
}

function item(path, priority, changeFrequency = "weekly") {
  return {
    url: absolute(path),
    lastModified: now,
    changeFrequency,
    priority,
  };
}

export default function sitemap() {
  const staticRoutes = [
    item("/", 1, "daily"),
    item("/thought", 0.7, "weekly"),
    item("/debate", 0.7, "weekly"),
    item("/tags", 0.5, "monthly"),
    item("/people", 0.5, "monthly"),
  ];

  const categoryRoutes = categories.map((category) => item(`/${category.slug}`, 0.65));

  const contentRoutes = allContentEntries()
    .filter((entry) => entry.publishable)
    .map((entry) => item(entry.href, entry.axis === "worry" ? 0.9 : 0.8));

  const tagRoutes = allTags()
    .filter((tag) => entriesForTag(tag.slug).filter((entry) => entry.publishable).length >= 2)
    .map((tag) => item(`/tags/${tag.slug}`, 0.55, "weekly"));

  const peopleRoutes = allPeople()
    .filter((person) => person.cardCount >= 2)
    .map((person) => item(`/people/${person.slug}`, 0.55, "monthly"));

  return [
    ...staticRoutes,
    ...categoryRoutes,
    ...contentRoutes,
    ...tagRoutes,
    ...peopleRoutes,
  ];
}
