import LocalizedHomePage from "@/components/LocalizedHomePage";

export const metadata = {
  title: "MindRoute 中文预览",
  description: "从中文搜索表达进入 MindRoute 已验证问题地图的多语言预览。",
  robots: {
    index: false,
    follow: true,
  },
};

export default function ChinesePage() {
  return <LocalizedHomePage locale="zh" />;
}
