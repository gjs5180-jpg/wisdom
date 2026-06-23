import LocalizedHomePage from "@/components/LocalizedHomePage";

export const metadata = {
  title: "Wisdom auf Deutsch",
  description: "Mehrsprachige Vorschau, die deutsche Suchausdrücke mit der geprüften Wisdom-Fragenkarte verbindet.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function GermanPage() {
  return <LocalizedHomePage locale="de" />;
}
