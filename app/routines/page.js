import Link from "next/link";
import { allRoutines } from "@/lib/routines";

export const metadata = {
  title: "성장 루틴 - 위즈덤",
  description:
    "고민을 읽고 끝내지 않도록 관계, 이별, 자기이해, 목표분해 루틴으로 이어갑니다.",
};

export default function RoutinesPage() {
  const routines = allRoutines();

  return (
    <div className="fade-rise">
      <nav className="mb-5 text-sm text-ink-soft">
        <Link href="/" className="transition-colors hover:text-clay">
          홈
        </Link>
        <span className="mx-1.5 text-ink-faint">/</span>
        <span className="text-ink">루틴</span>
      </nav>

      <header className="mb-7">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
          성장 루틴
        </p>
        <h1 className="mt-1 font-serif text-2xl font-bold sm:text-3xl">
          읽은 내용을 오늘의 행동으로 바꾸기
        </h1>
        <p className="mt-3 leading-relaxed text-ink-soft">
          루틴은 정답을 강요하지 않습니다. 지금 상태에 맞는 경로를 하나 고르고,
          작게 체크하면서 내 문제를 조금씩 다루는 구조입니다.
        </p>
      </header>

      <section className="mb-8 border-y border-line py-5">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              title: "문제에서 출발",
              body: "연애, 이별, 자존감, 목표처럼 실제로 막힌 장면에서 시작합니다.",
            },
            {
              title: "단계로 낮추기",
              body: "3일, 7일, 14일, 4주 단위로 부담을 작게 나눕니다.",
            },
            {
              title: "진행률 저장",
              body: "로그인 없이도 이 브라우저에 완료한 행동이 남습니다.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h2 className="font-serif text-base font-bold">{item.title}</h2>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              선택 가능한 경로
            </p>
            <h2 className="mt-1 font-serif text-xl font-bold">지금 시작할 루틴</h2>
          </div>
          <span className="shrink-0 text-xs text-ink-faint">{routines.length}개</span>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {routines.map((routine) => (
            <Link
              key={routine.slug}
              href={`/routines/${routine.slug}`}
              className="group block rounded-lg border border-line bg-paper px-4 py-4 transition-colors hover:border-clay/40"
            >
              <span className="flex items-start justify-between gap-3">
                <span className="min-w-0">
                  <span className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                    {routine.categoryTitle} · {routine.level}
                  </span>
                  <span className="mt-1 block font-serif text-lg font-bold group-hover:text-clay">
                    {routine.title}
                  </span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-ink-soft">
                    {routine.summary}
                  </span>
                </span>
                <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                  {routine.duration}
                </span>
              </span>
              <span className="mt-3 flex flex-wrap gap-1.5">
                {routine.steps.slice(0, 3).map((step) => (
                  <span
                    key={`${routine.slug}-${step.title}`}
                    className="rounded-full border border-line bg-cream px-2 py-0.5 text-[11px] text-ink-soft"
                  >
                    {step.title}
                  </span>
                ))}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
