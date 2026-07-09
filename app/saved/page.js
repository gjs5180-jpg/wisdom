import SavedClient from "./SavedClient";

export const metadata = {
  title: "저장함 — 마인드루트",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SavedPage() {
  return <SavedClient />;
}
