export default function CollectedPhrases({ phrases, rows, title = "수집된 표현" }) {
  const items = rows?.length
    ? rows.map((row) => ({ phrase: row.phrase, sourceCategory: row.sourceCategory }))
    : phrases?.map((phrase) => ({ phrase })) || [];

  if (items.length === 0) return null;

  return (
    <section className="mb-7 border-y border-line py-4">
      <div className="mb-3 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
            수집 → 분류
          </p>
          <h2 className="mt-1 font-serif text-lg font-bold">{title}</h2>
        </div>
        <span className="shrink-0 text-xs text-ink-faint">{items.length}개</span>
      </div>
      <div className="max-h-64 overflow-y-auto pr-1">
        <div className="flex flex-wrap gap-2">
          {items.map((item, index) => (
            <span
              key={`${item.phrase}-${index}`}
              className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink-soft"
              title={item.sourceCategory || undefined}
            >
              {item.phrase}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
