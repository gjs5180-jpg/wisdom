const lensClasses = {
  philosophy: "bg-clay-soft text-clay",
  research: "bg-ink/5 text-ink",
  institution: "bg-cream text-ink-soft ring-1 ring-line",
  practice: "border border-line text-ink-soft",
};

export default function PerspectiveLensBadge({ card, compact = false }) {
  if (!card?.perspectiveLensLabel) return null;

  return (
    <span
      className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
        lensClasses[card.perspectiveLens] || lensClasses.practice
      }`}
    >
      {compact && card.perspectiveLensShortLabel
        ? card.perspectiveLensShortLabel
        : card.perspectiveLensLabel}
    </span>
  );
}
