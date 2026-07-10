import TossMiniFlow from "@/components/TossMiniFlow";
import { allWorryEntries } from "@/lib/content";

export const metadata = {
  title: "앱인토스 MVP 프리뷰 - 마인드루트",
  description:
    "고민 선택, 원인 후보, 근거 있는 방법, 행동 기록으로 이어지는 마인드루트 미니앱 프리뷰입니다.",
  robots: {
    index: false,
    follow: false,
  },
};

const miniKeys = [
  "love/reply-anxiety",
  "breakup/ghosting",
  "self-esteem/low-self-esteem",
  "meaning/no-motivation",
  "work/burnout",
  "study/cant-study",
  "relationships/people-pleasing",
  "digital/dopamine-addiction",
];

const causesByKey = {
  "love/reply-anxiety": [
    {
      title: "답장이 내 가치처럼 느껴짐",
      body: "상대의 연락 속도를 애정, 거절, 내 매력의 증거로 읽을 때 불안이 커집니다.",
      check: "사실은 아직 답장이 없다는 것, 해석은 식었다는 추측으로 나눕니다.",
    },
    {
      title: "즉시성에 끌리는 환경",
      body: "알림과 읽음 표시는 관계 문제와 앱의 즉시성 압박을 섞어 버립니다.",
      check: "답장을 보기 전 15분 동안 끝낼 수 있는 행동 하나를 정합니다.",
    },
    {
      title: "관계 기준이 흐림",
      body: "연락 빈도보다 내가 원하는 관계의 최소 기준이 없을 때 확인 욕구가 반복됩니다.",
      check: "연락, 갈등 대화, 혼자 있는 시간 기준을 한 문장씩 적습니다.",
    },
  ],
  "breakup/ghosting": [
    {
      title: "빈칸을 상상으로 채움",
      body: "설명을 듣지 못하면 마음은 가능한 이유를 계속 만들며 고통을 키웁니다.",
      check: "사실 세 개만 적고, 나머지는 아직 확인되지 않은 해석으로 둡니다.",
    },
    {
      title: "재자극 접점이 많음",
      body: "SNS, 사진, 대화방은 회복을 다시 처음으로 돌리는 접점이 될 수 있습니다.",
      check: "오늘 가장 자주 확인하는 접점 하나만 숨기거나 멀리 둡니다.",
    },
    {
      title: "내 가치와 상대 행동이 섞임",
      body: "무응답은 상대의 행동이지 내 가치에 대한 최종 판결은 아닙니다.",
      check: "상대의 행동과 내가 다음 관계에서 지킬 기준을 분리합니다.",
    },
  ],
  "self-esteem/low-self-esteem": [
    {
      title: "행동 하나를 나 전체로 판결함",
      body: "실수나 실패가 곧 나라는 사람의 결론이 되면 회복이 어려워집니다.",
      check: "오늘 평가할 것은 내 전체가 아니라 한 행동인지 확인합니다.",
    },
    {
      title: "비교가 자기공격 재료가 됨",
      body: "남의 성취를 정보로 쓰지 못하고 내 삶을 깎는 증거로 쓰고 있을 수 있습니다.",
      check: "비교가 올라온 앱, 사람, 상황을 하나만 기록합니다.",
    },
    {
      title: "작은 증거가 부족함",
      body: "좋은 말보다 내가 실제로 끝낸 행동의 증거가 쌓일 때 믿음이 생깁니다.",
      check: "오늘 해낸 일 세 가지를 감정 평가 없이 적습니다.",
    },
  ],
  "meaning/no-motivation": [
    {
      title: "에너지가 너무 낮음",
      body: "게으름이 아니라 몸과 마음의 연료가 부족해 시작 자체가 무거운 상태일 수 있습니다.",
      check: "의미를 찾기보다 물, 산책, 샤워처럼 몸을 움직이는 행동 하나를 고릅니다.",
    },
    {
      title: "목표가 너무 큼",
      body: "큰 결심은 멈춘 상태에서 더 무겁게 느껴집니다. 아주 작은 단위가 필요합니다.",
      check: "운동하기 대신 운동화 신기처럼 1분 안에 끝나는 행동으로 바꿉니다.",
    },
    {
      title: "압박 목록이 많음",
      body: "해야 한다는 생각이 너무 많으면 어떤 것도 시작하지 못할 수 있습니다.",
      check: "오늘 안 해도 되는 일 하나를 일부러 내려놓습니다.",
    },
  ],
  "work/burnout": [
    {
      title: "회복 없는 지속",
      body: "쉬어도 회복되지 않는다면 의지보다 수면, 식사, 일정 손상을 먼저 봐야 합니다.",
      check: "이번 주 회복시킬 생활 단위 하나를 먼저 고정합니다.",
    },
    {
      title: "통제감 상실",
      body: "할 일이 많아서만이 아니라 내가 조정할 수 없다는 감각이 번아웃을 키웁니다.",
      check: "줄일 수 있는 업무, 요청할 조건, 내려놓을 기준을 나눕니다.",
    },
    {
      title: "성과로만 나를 봄",
      body: "회복마저 생산성으로 만들면 자기착취의 회로가 계속될 수 있습니다.",
      check: "생산성 없는 30분을 오늘 일정 안에 넣습니다.",
    },
  ],
  "study/cant-study": [
    {
      title: "시작 단위가 너무 큼",
      body: "공부 의지가 없는 게 아니라 처음 펼칠 단위가 커서 밀릴 수 있습니다.",
      check: "오늘 목표를 문제 3개, 문단 2개, 단어 10개로 줄입니다.",
    },
    {
      title: "결과 불안이 현재 행동을 빼앗음",
      body: "점수, 등수, 후회가 머릿속을 차지하면 오늘 할 행동이 사라집니다.",
      check: "통제 가능한 오늘 10분과 통제 불가능한 결과를 분리합니다.",
    },
    {
      title: "환경 마찰이 낮음",
      body: "휴대폰과 침대가 가까우면 결심보다 환경이 먼저 이깁니다.",
      check: "공부 전 휴대폰을 다른 방에 두고 타이머 10분만 켭니다.",
    },
  ],
  "relationships/people-pleasing": [
    {
      title: "거절을 나쁜 사람 되는 일로 느낌",
      body: "상대가 실망하는 것과 내가 나쁜 사람이 되는 것을 섞으면 경계가 무너집니다.",
      check: "부탁을 받으면 바로 답하지 않고 확인해보고 말하겠다고 답합니다.",
    },
    {
      title: "상대 기분을 먼저 추측함",
      body: "내 기준을 확인하기 전에 상대 반응을 예상하면 선택권이 사라집니다.",
      check: "상대 기분을 추측하기 전 내 기준을 한 줄로 적습니다.",
    },
    {
      title: "작은 취향 표현 연습이 부족함",
      body: "큰 거절 전에 메뉴, 시간, 장소처럼 낮은 위험의 표현부터 연습해야 합니다.",
      check: "오늘 한 번만 내가 더 편한 선택을 말합니다.",
    },
  ],
  "digital/dopamine-addiction": [
    {
      title: "자극이 너무 가까움",
      body: "의지 부족보다 앱이 손에 너무 쉽게 닿는 환경이 문제일 수 있습니다.",
      check: "가장 자주 여는 앱을 홈 화면에서 한 칸 멀리 둡니다.",
    },
    {
      title: "피하고 싶은 감정이 있음",
      body: "지루함, 불안, 피로를 피하려고 짧은 보상으로 이동할 수 있습니다.",
      check: "앱을 열기 전 내가 피하려는 감정을 하나 고릅니다.",
    },
    {
      title: "대체 행동이 없음",
      body: "끊기만 하면 빈 시간이 커져 다시 돌아가기 쉽습니다.",
      check: "앱 대신 할 2분 행동 하나를 미리 정합니다.",
    },
  ],
};

function compact(text, limit = 156) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit).trim()}...`;
}

function sourceLabel(card) {
  return [card.sourceTypeLabel, card.sourceYear].filter(Boolean).join(" · ");
}

function uniqueStrings(values) {
  return [...new Set(values.filter(Boolean).map((value) => value.trim()))];
}

function toMiniNode(entry) {
  const cards = (entry.content?.cards || [])
    .filter((card) => card.verified && card.action)
    .slice(0, 3);

  return {
    key: entry.key,
    title: entry.title,
    href: entry.href,
    categoryTitle: entry.categoryTitle,
    summary: compact(entry.summary, 148),
    causes: causesByKey[entry.key] || [
      {
        title: "반복 패턴 확인",
        body: "같은 문제가 반복되는 시간, 사람, 생각을 하나씩 분리합니다.",
        check: "오늘 통제할 수 있는 행동 하나만 고릅니다.",
      },
    ],
    methods: cards.map((card) => ({
      name: card.name,
      sourceLabel: sourceLabel(card) || "출처 확인",
      view: compact(card.view, 168),
      action: compact(card.action, 176),
    })),
    actions: uniqueStrings([
      ...(entry.content?.actions || []),
      ...cards.map((card) => card.action),
    ]).map((action) => compact(action, 176)),
  };
}

export default function TossPreviewPage() {
  const entries = allWorryEntries()
    .filter((entry) => miniKeys.includes(entry.key) && entry.publishable)
    .sort((a, b) => miniKeys.indexOf(a.key) - miniKeys.indexOf(b.key));
  const nodes = entries.map(toMiniNode).filter((node) => node.methods.length > 0);

  return (
    <div className="fade-rise">
      <section className="pb-5 pt-1">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
          Apps in Toss MVP
        </p>
        <h1 className="mt-1 font-serif text-3xl font-bold leading-snug sm:text-4xl">
          고민 하나를
          <br />
          오늘 행동 하나로.
        </h1>
        <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
          {["고민", "원인", "방법", "기록"].map((label) => (
            <span
              key={label}
              className="rounded-lg border border-line bg-paper px-2 py-2 font-medium text-ink-soft"
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      <TossMiniFlow nodes={nodes} />
    </div>
  );
}
