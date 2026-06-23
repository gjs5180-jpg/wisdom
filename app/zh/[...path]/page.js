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
  const entry = localizedEntryByRoute("zh", route);
  if (!entry) return { title: "Wisdom 中文预览" };

  return {
    title: `${entry.localizedTitle} | Wisdom 中文`,
    description: `${entry.localizedTitle} / ${entry.canonicalTitle}`,
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function ChineseSeedPage({ params }) {
  const { path } = await params;
  return <LocalizedSeedPage locale="zh" route={`/${path.join("/")}`} />;
}
