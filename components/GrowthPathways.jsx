import Link from "next/link";
import { routinesForCategory } from "@/lib/routines";

const defaultProfile = {
  patternTitle: "가능한 패턴 가설",
  patterns: [
    "문제 자체보다 그 문제를 해석하는 방식이 고통을 키울 수 있습니다.",
    "지금 바꿀 수 없는 결과와 오늘 조정할 수 있는 행동이 섞여 있을 수 있습니다.",
    "큰 결심보다 작게 반복되는 행동 단위가 먼저 필요할 수 있습니다.",
  ],
  checkQuestions: [
    "이 문제가 가장 심해지는 장면은 언제인가요?",
    "내가 계속 피하고 있는 작은 행동은 무엇인가요?",
    "오늘 통제할 수 있는 한 가지는 무엇인가요?",
  ],
  paths: [
    {
      title: "상황 기록 루트",
      duration: "3일",
      fit: "감정이 너무 커서 무엇부터 봐야 할지 모를 때",
      first: "같은 문제가 반복된 장면을 하루 한 줄로 적습니다.",
      last: "반복되는 시간, 사람, 생각을 하나만 표시합니다.",
    },
    {
      title: "관점 선택 루트",
      duration: "7일",
      fit: "답은 많은데 내 기준이 흔들릴 때",
      first: "오늘은 관점 카드 하나만 골라 그 기준으로 상황을 봅니다.",
      last: "그 관점이 나를 덜 미워하게 만드는지 확인합니다.",
    },
    {
      title: "작은 행동 루트",
      duration: "7일",
      fit: "이해는 했지만 움직임이 멈춰 있을 때",
      first: "부담 없는 행동 하나를 정하고 같은 시간에 반복합니다.",
      last: "성공/실패보다 반복을 방해한 조건을 조정합니다.",
    },
  ],
};

const profileByCategory = {
  love: {
    patternTitle: "연애 불안에서 자주 보이는 패턴",
    patterns: [
      "상대의 반응을 내 가치 평가처럼 받아들이면 불안이 커집니다.",
      "경험 부족은 매력 부족이 아니라 대화와 표현의 연습량 문제일 수 있습니다.",
      "확신을 얻으려는 행동이 오히려 관계의 리듬을 흔들 수 있습니다.",
    ],
    checkQuestions: [
      "나는 상대의 마음을 알아내려는 데 에너지를 다 쓰고 있나요?",
      "거절 가능성을 내 전체 가치와 연결하고 있나요?",
      "오늘 내가 정직하게 표현할 수 있는 한 문장은 무엇인가요?",
    ],
    paths: [
      {
        title: "불안 낮추기 루트",
        duration: "3일",
        fit: "답장, 고백, 애착 때문에 계속 확인하고 싶을 때",
        first: "상대 반응과 내 행동을 두 칸으로 나눠 적습니다.",
        last: "확인하고 싶은 질문을 하나의 짧은 문장으로 줄입니다.",
      },
      {
        title: "대화 연습 루트",
        duration: "7일",
        fit: "말을 꺼내는 것 자체가 어색할 때",
        first: "오늘 쓸 수 있는 질문 하나와 내 답변 하나를 준비합니다.",
        last: "대화 후 잘한 점 하나만 기록합니다.",
      },
      {
        title: "관계 기준 루트",
        duration: "14일",
        fit: "좋아하는 마음과 불안이 섞여 판단이 흔들릴 때",
        first: "내가 원하는 관계의 최소 기준 세 가지를 적습니다.",
        last: "상대의 반응보다 내 기준을 지켰는지 확인합니다.",
      },
    ],
  },
  breakup: {
    patternTitle: "이별 회복에서 자주 보이는 패턴",
    patterns: [
      "상실감은 감정뿐 아니라 일상 루틴이 무너진 데서도 커집니다.",
      "SNS, 사진, 대화 기록은 회복을 반복해서 처음으로 되돌릴 수 있습니다.",
      "그 사람을 잃은 고통과 내 가치가 사라진 느낌은 분리해서 봐야 합니다.",
    ],
    checkQuestions: [
      "지금 가장 무너진 것은 감정, 생활, 자존감 중 어디인가요?",
      "나를 다시 자극하는 물건이나 행동은 무엇인가요?",
      "오늘 회복시켜야 할 가장 기본적인 생활 단위는 무엇인가요?",
    ],
    paths: [
      {
        title: "감정 정리 루트",
        duration: "3일",
        fit: "눈물, 미련, 후회가 계속 올라올 때",
        first: "연락하고 싶은 이유와 실제로 필요한 것을 분리해 적습니다.",
        last: "감정 이름을 하나 붙이고 바로 해결하려 하지 않습니다.",
      },
      {
        title: "생활 복구 루트",
        duration: "7일",
        fit: "잠, 식사, 방 정리, 일정이 같이 무너졌을 때",
        first: "오늘 복구할 생활 행동 하나만 정합니다.",
        last: "감정 회복보다 생활 복구를 먼저 체크합니다.",
      },
      {
        title: "거리두기 루트",
        duration: "14일",
        fit: "SNS 확인과 재연락 충동이 반복될 때",
        first: "나를 흔드는 접점을 하나 줄입니다.",
        last: "다시 보고 싶은 마음이 줄어드는 시간을 관찰합니다.",
      },
    ],
  },
  "self-esteem": {
    patternTitle: "자기비난에서 자주 보이는 패턴",
    patterns: [
      "실패한 행동 하나가 곧 나라는 사람 전체의 결론이 되면 고통이 커집니다.",
      "비교는 정보가 아니라 자기 공격의 재료가 될 때가 많습니다.",
      "자존감은 좋은 말보다 작은 성공의 증거가 쌓일 때 회복되기 쉽습니다.",
    ],
    checkQuestions: [
      "나는 지금 행동을 평가하나요, 나 전체를 판결하나요?",
      "비교한 뒤 실제로 나아진 행동이 있었나요?",
      "오늘 나를 덜 미워하게 만들 작은 증거는 무엇인가요?",
    ],
    paths: [
      {
        title: "자기비난 줄이기 루트",
        duration: "3일",
        fit: "실수 뒤에 바로 나를 깎아내릴 때",
        first: "자기비난 문장을 사실 문장으로 다시 씁니다.",
        last: "내가 통제한 행동과 못 한 행동을 분리합니다.",
      },
      {
        title: "비교 줄이기 루트",
        duration: "7일",
        fit: "남의 성취를 보면 내 삶이 작아질 때",
        first: "비교가 올라온 앱, 사람, 상황을 기록합니다.",
        last: "비교 대신 오늘 할 수 있는 개선 행동 하나로 바꿉니다.",
      },
      {
        title: "작은 증거 쌓기 루트",
        duration: "14일",
        fit: "좋은 말을 들어도 믿기지 않을 때",
        first: "매일 끝낸 행동 하나를 증거로 남깁니다.",
        last: "감정보다 기록된 행동을 기준으로 나를 봅니다.",
      },
    ],
  },
  relationships: {
    patternTitle: "관계 문제에서 자주 보이는 패턴",
    patterns: [
      "갈등을 피하려는 친절이 경계 없는 관계를 만들 수 있습니다.",
      "거절하지 못하는 습관은 상대보다 내 불안을 달래는 행동일 수 있습니다.",
      "좋은 관계는 항상 맞춰주는 것이 아니라 서로의 한계를 조정하는 과정입니다.",
    ],
    checkQuestions: [
      "나는 싫다는 말을 못 해서 나중에 더 큰 불만을 만들고 있나요?",
      "상대가 실망하는 것과 내가 나쁜 사람이 되는 것을 섞고 있나요?",
      "오늘 지킬 수 있는 작은 경계는 무엇인가요?",
    ],
    paths: [
      {
        title: "경계 세우기 루트",
        duration: "7일",
        fit: "거절과 부탁이 모두 어렵게 느껴질 때",
        first: "부담스러운 요청 하나를 작게 조정해 말합니다.",
        last: "상대 반응보다 내 한계를 말했는지 확인합니다.",
      },
      {
        title: "대화 복구 루트",
        duration: "7일",
        fit: "상처받은 말이나 말실수가 계속 남을 때",
        first: "사실, 감정, 요청을 세 줄로 나눠 적습니다.",
        last: "비난 대신 다음에 필요한 행동을 말합니다.",
      },
      {
        title: "관계 정리 루트",
        duration: "14일",
        fit: "계속 맞춰주는데 지치고 멀어지고 싶을 때",
        first: "회복할 관계와 거리를 둘 관계를 구분합니다.",
        last: "관계를 끊기 전에 줄일 수 있는 접점을 먼저 조정합니다.",
      },
    ],
  },
  work: {
    patternTitle: "일과 번아웃에서 자주 보이는 패턴",
    patterns: [
      "문제는 의지 부족이 아니라 회복 없는 지속과 통제감 상실일 수 있습니다.",
      "일의 의미, 인정, 생계가 한꺼번에 묶이면 판단이 흐려집니다.",
      "퇴사나 이직 같은 큰 결정 전에 몸과 일정의 손상을 먼저 봐야 합니다.",
    ],
    checkQuestions: [
      "내가 힘든 것은 일의 양, 관계, 의미, 건강 중 무엇에 가장 가깝나요?",
      "쉬어도 회복되지 않는 신호가 있나요?",
      "이번 주에 줄일 수 있는 부담 하나는 무엇인가요?",
    ],
    paths: [
      {
        title: "회복 루트",
        duration: "7일",
        fit: "번아웃과 직장 우울감이 올라올 때",
        first: "수면, 식사, 이동 시간을 먼저 고정합니다.",
        last: "성과보다 에너지 회복 여부를 기록합니다.",
      },
      {
        title: "판단 기준 루트",
        duration: "14일",
        fit: "퇴사, 이직, 버티기 사이에서 흔들릴 때",
        first: "남을 설득할 이유가 아니라 내가 감당할 조건을 적습니다.",
        last: "바꿀 수 있는 조건과 떠나야 할 조건을 분리합니다.",
      },
      {
        title: "작업 축소 루트",
        duration: "3일",
        fit: "할 일이 너무 많아 시작이 안 될 때",
        first: "오늘 반드시 끝낼 일을 하나만 남깁니다.",
        last: "끝내지 못한 이유를 의지가 아니라 구조로 봅니다.",
      },
    ],
  },
  study: {
    patternTitle: "공부와 시험 불안에서 자주 보이는 패턴",
    patterns: [
      "공부가 안 되는 것은 동기 부족보다 시작 단위가 너무 큰 문제일 수 있습니다.",
      "시험 불안은 결과를 예측하려는 생각이 현재 행동을 빼앗을 때 커집니다.",
      "성적보다 반복 가능한 환경을 먼저 만드는 편이 오래 갑니다.",
    ],
    checkQuestions: [
      "나는 공부를 못 하는 건가요, 시작 조건이 너무 무거운 건가요?",
      "결과 걱정 때문에 오늘 할 행동이 사라지고 있나요?",
      "10분 안에 시작할 수 있는 가장 작은 단위는 무엇인가요?",
    ],
    paths: [
      {
        title: "10분 시작 루트",
        duration: "3일",
        fit: "책상에 앉기 전부터 막힐 때",
        first: "공부가 아니라 10분 확인할 한 페이지만 정합니다.",
        last: "시작 성공 여부만 체크합니다.",
      },
      {
        title: "불안 분리 루트",
        duration: "7일",
        fit: "시험 결과 생각이 반복될 때",
        first: "걱정 문장과 오늘 행동 문장을 따로 씁니다.",
        last: "결과 예측 시간을 줄이고 풀이 시간을 늘립니다.",
      },
      {
        title: "환경 고정 루트",
        duration: "14일",
        fit: "집중이 매일 흔들릴 때",
        first: "공부 장소와 시작 시간을 하나로 고정합니다.",
        last: "집중력보다 방해 요인을 줄인 횟수를 봅니다.",
      },
    ],
  },
  meaning: {
    patternTitle: "무기력과 의미 문제에서 자주 보이는 패턴",
    patterns: [
      "의미는 머리로 찾기보다 반복되는 활동 안에서 다시 생길 때가 많습니다.",
      "아무것도 하고 싶지 않다는 감정은 에너지 고갈의 신호일 수 있습니다.",
      "큰 목표가 없을수록 오늘의 아주 작은 접촉면이 중요해집니다.",
    ],
    checkQuestions: [
      "나는 의미가 없는 건가요, 에너지가 너무 낮은 건가요?",
      "최근 조금이라도 덜 공허했던 순간은 언제였나요?",
      "오늘 몸을 움직이게 할 최소 행동은 무엇인가요?",
    ],
    paths: [
      {
        title: "감각 회복 루트",
        duration: "3일",
        fit: "아무것도 하고 싶지 않을 때",
        first: "의미를 찾기보다 몸을 움직이는 행동 하나를 합니다.",
        last: "조금 덜 무거웠던 순간을 기록합니다.",
      },
      {
        title: "가치 탐색 루트",
        duration: "7일",
        fit: "무엇을 원하는지 모르겠을 때",
        first: "싫은 것, 부러운 것, 계속 떠오르는 것을 각각 적습니다.",
        last: "그 안에서 반복되는 가치 단어를 찾습니다.",
      },
      {
        title: "작은 기여 루트",
        duration: "14일",
        fit: "내 삶이 쓸모없게 느껴질 때",
        first: "누군가에게 작게 도움이 되는 행동 하나를 정합니다.",
        last: "느낌보다 실제로 만든 변화를 기록합니다.",
      },
    ],
  },
  family: {
    patternTitle: "가족 갈등에서 자주 보이는 패턴",
    patterns: [
      "가까운 관계일수록 사랑, 의무, 통제가 쉽게 섞입니다.",
      "상대가 바뀌어야만 해결된다고 보면 내가 할 수 있는 행동이 사라집니다.",
      "대화보다 먼저 거리를 조정해야 감정이 덜 폭발할 때가 있습니다.",
    ],
    checkQuestions: [
      "이 문제는 사랑의 문제인가요, 경계의 문제인가요?",
      "내가 반복해서 참다가 폭발하는 지점은 어디인가요?",
      "오늘 줄일 수 있는 접촉 또는 말의 길이는 무엇인가요?",
    ],
    paths: [
      {
        title: "경계 문장 루트",
        duration: "7일",
        fit: "가족에게 싫다는 말을 못 할 때",
        first: "설명보다 짧은 경계 문장을 먼저 만듭니다.",
        last: "죄책감보다 반복 가능성을 기준으로 봅니다.",
      },
      {
        title: "거리 조정 루트",
        duration: "14일",
        fit: "말할 때마다 감정이 폭발할 때",
        first: "통화, 방문, 메시지 빈도 중 하나를 조정합니다.",
        last: "관계 단절이 아니라 감정 과열을 낮추는 거리로 봅니다.",
      },
      {
        title: "대화 준비 루트",
        duration: "3일",
        fit: "해야 할 말은 있는데 어떻게 시작할지 모를 때",
        first: "사실, 감정, 요청을 세 문장으로 정리합니다.",
        last: "상대를 이기기보다 내 입장을 전달했는지 확인합니다.",
      },
    ],
  },
  body: {
    patternTitle: "몸과 외모 불안에서 자주 보이는 패턴",
    patterns: [
      "몸에 대한 걱정은 정보 검색을 많이 할수록 더 커질 수 있습니다.",
      "외모 문제는 실제 변화와 자기평가의 고통을 분리해서 봐야 합니다.",
      "몸을 돌보는 행동이 자기비난의 방식이 되면 지속하기 어렵습니다.",
    ],
    checkQuestions: [
      "나는 정보를 찾고 있나요, 불안을 확인하고 있나요?",
      "몸을 바꾸려는 마음 뒤에 나를 미워하는 말이 있나요?",
      "오늘 몸을 덜 괴롭히는 행동은 무엇인가요?",
    ],
    paths: [
      {
        title: "정보 위생 루트",
        duration: "3일",
        fit: "검색할수록 건강과 외모 불안이 커질 때",
        first: "불안 검색 시간을 정해진 한 번으로 줄입니다.",
        last: "확인보다 회복 행동을 먼저 기록합니다.",
      },
      {
        title: "몸 돌봄 루트",
        duration: "7일",
        fit: "몸이 마음 전체를 흔들 때",
        first: "수면, 물, 산책 중 하나를 고정합니다.",
        last: "외모 평가보다 돌봄 행동의 반복을 봅니다.",
      },
      {
        title: "자기평가 분리 루트",
        duration: "14일",
        fit: "몸의 상태가 내 가치처럼 느껴질 때",
        first: "몸에 대한 사실과 나에 대한 판결을 분리합니다.",
        last: "나를 비난하지 않는 관리 기준을 만듭니다.",
      },
    ],
  },
  digital: {
    patternTitle: "디지털 습관에서 자주 보이는 패턴",
    patterns: [
      "의지 부족보다 자극이 너무 가까운 환경이 문제일 수 있습니다.",
      "짧은 보상은 피곤하거나 공허할 때 더 강하게 작동합니다.",
      "끊는 것보다 대체 행동과 마찰 설계가 먼저 필요합니다.",
    ],
    checkQuestions: [
      "나는 언제 가장 자동으로 앱을 열고 있나요?",
      "그 순간 피하고 싶은 감정이나 일이 있나요?",
      "앱을 열기 전에 넣을 수 있는 작은 마찰은 무엇인가요?",
    ],
    paths: [
      {
        title: "마찰 설계 루트",
        duration: "3일",
        fit: "무의식적으로 앱을 열 때",
        first: "가장 많이 여는 앱을 홈 화면에서 한 칸 멀리 둡니다.",
        last: "앱을 열기 전 한 번 멈춘 횟수를 셉니다.",
      },
      {
        title: "대체 행동 루트",
        duration: "7일",
        fit: "끊고 싶지만 빈 시간이 너무 클 때",
        first: "앱 대신 할 2분 행동을 하나 정합니다.",
        last: "완전 차단보다 전환 성공을 기록합니다.",
      },
      {
        title: "자극 정리 루트",
        duration: "14일",
        fit: "릴스, 쇼츠, SNS가 하루 리듬을 빼앗을 때",
        first: "알림, 자동재생, 추천 피드를 하나씩 줄입니다.",
        last: "자극을 줄인 뒤 생긴 시간을 어디에 썼는지 봅니다.",
      },
    ],
  },
};

const sharedProfiles = {
  career: "work",
  money: "work",
};

function compact(text, limit = 112) {
  const normalized = String(text || "").replace(/\s+/g, " ").trim();
  if (normalized.length <= limit) return normalized;
  return `${normalized.slice(0, limit).trim()}...`;
}

function uniqueStrings(values) {
  return [
    ...new Set(
      values
        .filter(Boolean)
        .map((value) => String(value).replace(/\s+/g, " ").trim())
        .filter(Boolean)
    ),
  ];
}

function profileFor(categorySlug) {
  const mapped = sharedProfiles[categorySlug] || categorySlug;
  return profileByCategory[mapped] || defaultProfile;
}

function actionPool(content) {
  return uniqueStrings([
    ...(content?.actions || []),
    ...((content?.cards || []).map((card) => card.action)),
  ]);
}

function stepsForPath(path, actions, index) {
  const borrowedAction = actions[index] || actions[index % actions.length];
  return uniqueStrings([
    path.first,
    borrowedAction && compact(borrowedAction, 120),
    path.last,
  ]).slice(0, 3);
}

export default function GrowthPathways({ categorySlug, content }) {
  const profile = profileFor(categorySlug);
  const actions = actionPool(content);
  const recommendedRoutines = routinesForCategory(categorySlug, 2);

  return (
    <section className="mt-8 border-y border-line py-6">
      <div className="mb-4">
        <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
          문제 이해
        </p>
        <h2 className="mt-1 font-serif text-xl font-bold">
          내 상태에 맞는 경로 고르기
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-lg border border-line bg-paper px-4 py-4">
          <h3 className="font-serif text-base font-bold">{profile.patternTitle}</h3>
          <ul className="mt-3 space-y-2.5">
            {profile.patterns.map((pattern) => (
              <li key={pattern} className="flex gap-2.5 text-sm leading-relaxed text-ink-soft">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-clay" />
                <span>{pattern}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-line bg-cream px-4 py-4">
          <h3 className="font-serif text-base font-bold">내 상황 점검</h3>
          <ol className="mt-3 space-y-2.5">
            {profile.checkQuestions.map((question, index) => (
              <li
                key={question}
                className="grid grid-cols-[1.5rem_1fr] gap-2 text-sm leading-relaxed text-ink-soft"
              >
                <span className="font-serif text-base font-bold text-ink-faint">
                  {index + 1}
                </span>
                <span>{question}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
              행동 루틴
            </p>
            <h3 className="mt-1 font-serif text-lg font-bold">
              하나를 골라 작게 시작하기
            </h3>
          </div>
          <span className="shrink-0 text-xs text-ink-faint">
            {profile.paths.length}개 경로
          </span>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {profile.paths.map((path, index) => {
            const steps = stepsForPath(path, actions, index);

            return (
              <article
                key={path.title}
                className="rounded-lg border border-line bg-paper px-4 py-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="font-serif text-base font-bold">{path.title}</h4>
                  <span className="shrink-0 rounded-full bg-clay-soft px-2 py-0.5 text-[11px] font-medium text-clay">
                    {path.duration}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{path.fit}</p>
                <ol className="mt-3 space-y-2 border-t border-line pt-3">
                  {steps.map((step, stepIndex) => (
                    <li
                      key={`${path.title}-${step}`}
                      className="grid grid-cols-[1.25rem_1fr] gap-2 text-sm leading-relaxed"
                    >
                      <span className="font-serif text-sm font-bold text-ink-faint">
                        {stepIndex + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
                {actions.length > 0 && (
                  <a
                    href="#actions"
                    className="mt-4 inline-flex rounded-lg border border-line px-3 py-1.5 text-sm font-medium text-ink-soft transition-colors hover:border-clay/40 hover:text-clay"
                  >
                    행동 목록으로 내려가기
                  </a>
                )}
              </article>
            );
          })}
        </div>
      </div>

      {recommendedRoutines.length > 0 && (
        <div className="mt-7">
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wider text-ink-faint">
                이어서 할 루틴
              </p>
              <h3 className="mt-1 font-serif text-lg font-bold">
                체크하면서 따라가기
              </h3>
            </div>
            <Link
              href="/routines"
              className="shrink-0 text-sm text-ink-soft transition-colors hover:text-clay"
            >
              전체 루틴
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {recommendedRoutines.map((routine) => (
              <Link
                key={routine.slug}
                href={`/routines/${routine.slug}`}
                className="group block rounded-lg border border-line bg-cream px-4 py-4 transition-colors hover:border-clay/40"
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="min-w-0">
                    <span className="block font-serif text-base font-bold group-hover:text-clay">
                      {routine.title}
                    </span>
                    <span className="mt-1.5 block text-sm leading-relaxed text-ink-soft">
                      {routine.summary}
                    </span>
                  </span>
                  <span className="shrink-0 rounded-full bg-paper px-2 py-0.5 text-[11px] font-medium text-clay ring-1 ring-line">
                    {routine.duration}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
