export default function CollectedContent({ collection }) {
  if (!collection) return null;

  const { contentized, rows } = collection;

  return (
    <section className="mb-8 border-y border-line py-5">
      <div className="mb-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium tracking-wider text-ink-faint uppercase">
            수집 → 분류 → 콘텐츠화
          </p>
          <h2 className="mt-1 font-serif text-lg font-bold">
            수집어로 본 질문 구조
          </h2>
        </div>
        <span className="shrink-0 text-xs text-ink-faint">
          {contentized.phraseCount.toLocaleString("ko-KR")}개
        </span>
      </div>

      <p className="font-serif text-base leading-relaxed">{contentized.lead}</p>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-ink-faint">
        <span className="rounded-full border border-line px-2.5 py-0.5">
          요약 반영 {contentized.contentPhraseCount.toLocaleString("ko-KR")}개
        </span>
        {contentized.reviewPhraseCount > 0 && (
          <span className="rounded-full border border-line px-2.5 py-0.5">
            검토 노트 {contentized.reviewPhraseCount.toLocaleString("ko-KR")}개
          </span>
        )}
      </div>

      <ul className="mt-4 space-y-2.5">
        {contentized.summary.map((line) => (
          <li key={line} className="flex gap-3 text-sm leading-relaxed text-ink-soft">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
            <span>{line}</span>
          </li>
        ))}
      </ul>

      {contentized.intentGroups.length > 0 && (
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {contentized.intentGroups.slice(0, 4).map((intent) => (
            <div key={intent.slug} className="rounded-xl border border-line bg-paper p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-serif text-base font-bold">{intent.title}</h3>
                <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                  {intent.count}
                </span>
              </div>
              <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                {intent.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {intent.samples.slice(0, 4).map((sample) => (
                  <span
                    key={sample}
                    className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-soft"
                  >
                    {sample}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {contentized.faqs?.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-xs font-medium tracking-wider text-ink-faint uppercase">
            검색 의도별 답변
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {contentized.faqs.map((faq) => (
              <article key={faq.question} className="rounded-xl border border-line bg-paper p-4">
                <h4 className="font-serif text-base font-bold leading-snug">
                  {faq.question}
                </h4>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {faq.answer}
                </p>
              </article>
            ))}
          </div>
        </div>
      )}

      {contentized.questions.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-xs font-medium tracking-wider text-ink-faint uppercase">
            대표 질문
          </h3>
          <ul className="divide-y divide-line border-y border-line">
            {contentized.questions.map((question) => (
              <li
                key={`${question.phrase}-${question.intent}`}
                className="grid grid-cols-[5.5rem_1fr] gap-3 py-2.5 text-sm sm:grid-cols-[7rem_1fr]"
              >
                <span className="text-xs text-ink-faint">{question.intent}</span>
                <span className="leading-relaxed">{question.phrase}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {contentized.reviewNotes?.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-xs font-medium tracking-wider text-ink-faint uppercase">
            검토 표현 처리
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {contentized.reviewNotes.map((note) => (
              <article key={note.slug} className="rounded-xl border border-line bg-paper p-4">
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-serif text-base font-bold">{note.title}</h4>
                  <span className="shrink-0 rounded-full bg-cream px-2 py-0.5 text-[11px] text-ink-soft">
                    {note.count}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {note.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {note.samples.map((sample) => (
                    <span
                      key={sample}
                      className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-soft"
                    >
                      {sample}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5">
        <h3 className="mb-2 text-xs font-medium tracking-wider text-ink-faint uppercase">
          전체 수집 표현
        </h3>
        <div className="max-h-56 overflow-y-auto pr-1">
          <div className="flex flex-wrap gap-2">
            {rows.map((row, index) => (
              <span
                key={`${row.phrase}-${index}`}
                className="rounded-full border border-line bg-paper px-3 py-1 text-sm text-ink-soft"
                title={row.sourceCategory || undefined}
              >
                {row.phrase}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
