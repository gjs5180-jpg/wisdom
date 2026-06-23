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
  const entry = localizedEntryByRoute("ja", route);
  if (!entry) return { title: "Wisdom 日本語プレビュー" };

  return {
    title: `${entry.localizedTitle} | Wisdom 日本語`,
    description: `${entry.localizedTitle} / ${entry.canonicalTitle}`,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function JapaneseSeedPage({ params }) {
  const { path } = await params;
  return <LocalizedSeedPage locale="ja" route={`/${path.join("/")}`} />;
}
