import LocalizedHomePage from "@/components/LocalizedHomePage";

export const metadata = {
  title: "MindRoute en Français",
  description: "Aperçu multilingue reliant les recherches en français à la carte vérifiée de questions de MindRoute.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function FrenchPage() {
  return <LocalizedHomePage locale="fr" />;
}
