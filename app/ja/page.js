import LocalizedHomePage from "@/components/LocalizedHomePage";

export const metadata = {
  title: "Wisdom 日本語プレビュー",
  description: "日本語の検索表現から Wisdom の検証済み質問地図へ入る多言語プレビューです。",
  robots: {
    index: false,
    follow: true,
  },
};

export default function JapanesePage() {
  return <LocalizedHomePage locale="ja" />;
}
