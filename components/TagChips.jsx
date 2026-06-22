import Link from "next/link";

export default function TagChips({ tags, label = "태그" }) {
  if (!tags?.length) return null;

  return (
    <section className="mb-6">
      <p className="text-[11px] font-medium tracking-wider text-ink-faint uppercase mb-2">
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Link
            key={tag.slug}
            href={`/tags/${tag.slug}`}
            className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
          >
            {tag.title}
          </Link>
        ))}
      </div>
    </section>
  );
}
