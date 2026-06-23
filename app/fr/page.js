import LocalizedHomePage from "@/components/LocalizedHomePage";

export const metadata = {
  title: "Wisdom en Français",
  description: "Aperçu multilingue reliant les recherches en français à la carte vérifiée de questions de Wisdom.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function FrenchPage() {
  return <LocalizedHomePage locale="fr" />;
}
