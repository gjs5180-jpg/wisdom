import Link from "next/link";
import { notFound } from "next/navigation";
import SaveButton from "@/components/SaveButton";
import RoutineProgress from "@/components/RoutineProgress";
import { allRoutineParams, getRoutine } from "@/lib/routines";

export function generateStaticParams() {
  return allRoutineParams();
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const routine = getRoutine(slug);
  if (!routine) return { title: "위즈덤" };

  return {
    title: `${routine.title} - 위즈덤`,
    description: routine.summary,
  };
}

export default async function RoutinePage({ params }) {
  const { slug } = await params;
  const routine = getRoutine(slug);
  if (!routine) notFound();

  const saveItem = {
    key: `routine/${routine.slug}`,
    title: routine.title,
    categoryTitle: "루틴",
    href: `/routines/${routine.slug}`,
  };

  return (
    <div className="fade-rise">
      <nav className="mb-5 text-sm text-ink-soft">
        <Link href="/" className="transition-colors hover:text-clay">
          홈
        </Link>
        <span className="mx-1.5 text-ink-faint">/</span>
        <Link href="/routines" className="transition-colors hover:text-clay">
          루틴
        </Link>
        <span className="mx-1.5 text-ink-faint">/</span>
        <span className="text-ink">{routine.title}</span>
      </nav>

      <header className="mb-6">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              {routine.categoryTitle} · {routine.level}
            </p>
            <h1 className="mt-1 font-serif text-2xl font-bold leading-snug sm:text-3xl">
              {routine.title}
            </h1>
          </div>
          <SaveButton item={saveItem} />
        </div>
        <p className="leading-relaxed text-ink-soft">{routine.summary}</p>
        <div className="mt-4 flex flex-wrap gap-1.5 text-xs">
          <span className="rounded-full bg-clay-soft px-2.5 py-1 font-medium text-clay">
            {routine.duration}
          </span>
          <span className="rounded-full border border-line px-2.5 py-1 text-ink-soft">
            행동 {routine.steps.length}개
          </span>
          <span className="rounded-full border border-line px-2.5 py-1 text-ink-soft">
            {routine.categoryTitle}
          </span>
        </div>
      </header>

      <section className="mb-7 rounded-lg border border-line bg-paper px-4 py-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
          이 루틴의 방향
        </p>
        <p className="mt-2 text-[15px] leading-relaxed">{routine.promise}</p>
      </section>

      {routine.audience.length > 0 && (
        <section className="mb-7">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            이런 사람에게 맞아요
          </p>
          <div className="grid grid-cols-1 gap-2">
            {routine.audience.map((item) => (
              <div
                key={item}
                className="rounded-lg border border-line bg-cream px-3 py-2.5 text-sm leading-relaxed text-ink-soft"
              >
                {item}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mb-8">
        <div className="mb-3">
          <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
            진행 단계
          </p>
          <h2 className="mt-1 font-serif text-xl font-bold">어떻게 이어지나요?</h2>
        </div>
        <div className="grid grid-cols-1 gap-3">
          {routine.stages.map((stage, index) => (
            <div
              key={stage.title}
              className="grid grid-cols-[2rem_1fr] gap-3 rounded-lg border border-line bg-paper px-4 py-4"
            >
              <span className="font-serif text-xl font-bold text-ink-faint">
                {index + 1}
              </span>
              <div>
                <h3 className="font-serif text-base font-bold">{stage.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                  {stage.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <RoutineProgress routine={routine} />

      {routine.related.length > 0 && (
        <section className="mt-8">
          <div className="mb-3">
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              관련 질문
            </p>
            <h2 className="mt-1 font-serif text-lg font-bold">
              이 루틴과 같이 보면 좋은 카드
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-2">
            {routine.related.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group rounded-lg border border-line bg-paper px-4 py-3 transition-colors hover:border-clay/40"
              >
                <span className="font-serif text-base font-bold group-hover:text-clay">
                  {item.title}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
