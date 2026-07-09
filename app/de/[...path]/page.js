import LocalizedSeedPage from "@/components/LocalizedSeedPage";
import {
  localizedEntryByRoute,
  localizedStaticParams,
} from "@/lib/multilingual-content";

export function generateStaticParams() {
  return localizedStaticParams();
}

export async function generateMetadata({ params }) {
  const { path } = await params;
  const route = `/${path.join("/")}`;
  const entry = localizedEntryByRoute("de", route);
  if (!entry) return { title: "MindRoute auf Deutsch" };

  return {
    title: `${entry.localizedTitle} | MindRoute Deutsch`,
    description: `${entry.localizedTitle} / ${entry.canonicalTitle}`,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function GermanSeedPage({ params }) {
  const { path } = await params;
  return <LocalizedSeedPage locale="de" route={`/${path.join("/")}`} />;
}
