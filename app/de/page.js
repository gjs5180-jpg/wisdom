import LocalizedHomePage from "@/components/LocalizedHomePage";

export const metadata = {
  title: "MindRoute auf Deutsch",
  description: "Mehrsprachige Vorschau, die deutsche Suchausdrücke mit der geprüften MindRoute-Fragenkarte verbindet.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function GermanPage() {
  return <LocalizedHomePage locale="de" />;
}
