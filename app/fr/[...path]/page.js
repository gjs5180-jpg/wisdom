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
  const entry = localizedEntryByRoute("fr", route);
  if (!entry) return { title: "MindRoute en Français" };

  return {
    title: `${entry.localizedTitle} | MindRoute Français`,
    description: `${entry.localizedTitle} / ${entry.canonicalTitle}`,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function FrenchSeedPage({ params }) {
  const { path } = await params;
  return <LocalizedSeedPage locale="fr" route={`/${path.join("/")}`} />;
}
