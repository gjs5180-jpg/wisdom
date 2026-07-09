import LocalizedHomePage from "@/components/LocalizedHomePage";

export const metadata = {
  title: "MindRoute en Español",
  description: "Vista previa multilingüe que conecta búsquedas en español con el mapa verificado de preguntas de MindRoute.",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SpanishPage() {
  return <LocalizedHomePage locale="es" />;
}
