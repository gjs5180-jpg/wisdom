import SavedClient from "./SavedClient";

export const metadata = {
  title: "저장함 — 위즈덤",
  robots: {
    index: false,
    follow: true,
  },
};

export default function SavedPage() {
  return <SavedClient />;
}
