export const perspectiveLenses = [
  {
    slug: "philosophy",
    title: "철학 / 사상",
    shortTitle: "철학",
    blurb: "고전 원전과 사상가의 질문으로 고민의 기준을 세운다.",
  },
  {
    slug: "research",
    title: "연구 / 임상",
    shortTitle: "연구",
    blurb: "심리·건강·행동 주제는 연구와 전문기관의 기준을 함께 본다.",
  },
  {
    slug: "institution",
    title: "제도 / 정책",
    shortTitle: "제도",
    blurb: "논쟁 주제는 법, 제도, 공적 자료를 분리해 사실 층위를 잡는다.",
  },
  {
    slug: "practice",
    title: "실천 / 적용",
    shortTitle: "실천",
    blurb: "독자가 오늘 해볼 수 있는 작은 질문과 행동으로 연결한다.",
  },
];

const sourceTypeLensMap = {
  primary: "philosophy",
  interpretation: "philosophy",
  publisher: "philosophy",
  research: "research",
  medical: "research",
  official: "institution",
  law: "institution",
  policy: "institution",
};

export function lensForSlug(slug) {
  return perspectiveLenses.find((lens) => lens.slug === slug) || null;
}

export function lensForSourceType(sourceType) {
  return lensForSlug(sourceTypeLensMap[sourceType]);
}
