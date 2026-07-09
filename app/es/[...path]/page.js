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
  const entry = localizedEntryByRoute("es", route);
  if (!entry) return { title: "MindRoute en Español" };

  return {
    title: `${entry.localizedTitle} | MindRoute Español`,
    description: `${entry.localizedTitle} / ${entry.canonicalTitle}`,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function SpanishSeedPage({ params }) {
  const { path } = await params;
  return <LocalizedSeedPage locale="es" route={`/${path.join("/")}`} />;
}
