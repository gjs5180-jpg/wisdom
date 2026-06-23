import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  getContent,
  getDebateContent,
  getThoughtContent,
  isPublishableContent,
  verifiedCardCount,
} from "./content.js";

const here = dirname(fileURLToPath(import.meta.url));
const seedData = JSON.parse(
  readFileSync(join(here, "../data/global_phrase_seeds.json"), "utf8")
);

export const englishLocale = "en-US";

export function englishSeeds() {
  return [...seedData.nodes]
    .filter((node) => node.locale === englishLocale)
    .sort((a, b) => a.priority - b.priority);
}

export function englishSeedByRoute(route) {
  const normalized = route.startsWith("/") ? route : `/${route}`;
  return englishSeeds().find((node) => node.route === normalized) || null;
}

export function englishStaticParams() {
  return englishSeeds().map((node) => ({
    path: node.route.replace(/^\//, "").split("/"),
  }));
}

export function englishPathForRoute(route) {
  if (route === "/") return "/en";
  return `/en${route}`;
}

export function koreanPathForEnglishPath(pathname) {
  if (pathname === "/en") return "/";
  return pathname.replace(/^\/en/, "") || "/";
}

export function contentForEnglishSeed(seed) {
  if (!seed) return null;

  if (seed.axis === "thought") {
    return getThoughtContent(seed.slot);
  }

  if (seed.axis === "debate") {
    return getDebateContent(seed.slot.replace(/^debate\//, ""));
  }

  const [category, worry] = seed.slot.split("/");
  return getContent(category, worry);
}

export function enrichedEnglishSeeds() {
  return englishSeeds().map((seed) => {
    const content = contentForEnglishSeed(seed);
    return {
      ...seed,
      href: englishPathForRoute(seed.route),
      koreanHref: seed.route,
      content,
      publishable: isPublishableContent(content),
      verifiedCount: verifiedCardCount(content),
      cardCount: content?.cards?.length || 0,
    };
  });
}

export function englishSeedEntryByRoute(route) {
  const seed = englishSeedByRoute(route);
  if (!seed) return null;
  const content = contentForEnglishSeed(seed);
  return {
    ...seed,
    href: englishPathForRoute(seed.route),
    koreanHref: seed.route,
    content,
    publishable: isPublishableContent(content),
    verifiedCount: verifiedCardCount(content),
    cardCount: content?.cards?.length || 0,
  };
}

export function sourceTypeLabelEn(type) {
  const labels = {
    primary: "Primary text",
    official: "Official",
    law: "Law",
    policy: "Policy",
    medical: "Medical",
    research: "Research",
    interpretation: "Commentary",
    publisher: "Publisher",
  };
  return labels[type] || type || "Source";
}

export function perspectiveLensLabelEn(slug) {
  const labels = {
    philosophy: "Philosophy",
    research: "Research",
    institution: "Institution",
    practice: "Practice",
  };
  return labels[slug] || "Perspective";
}

export function englishTranslationStatusLabel(status) {
  const labels = {
    "curated-seed": "Curated seed",
    "readable-seed": "Readable seed",
    "phrase-enriched": "Phrase-enriched",
    draft: "Draft English",
  };
  return labels[status] || "English seed";
}

const cardNameLabelsEn = {
  "게오르크 W. F. 헤겔": "G. W. F. Hegel",
  "경제 제도 관점": "Economic institutions",
  "공자": "Confucius",
  "국가인권위원회": "National Human Rights Commission of Korea",
  "국제노동기구": "International Labour Organization",
  "노동권 관점": "Labor rights perspective",
  "노자": "Laozi",
  "노자 (老子)": "Laozi",
  "니체": "Friedrich Nietzsche",
  "대런 아세모글루": "Daron Acemoglu",
  "돈 매키스": "Don Marquis",
  "로널드 드워킨": "Ronald Dworkin",
  "로절린드 허스트하우스": "Rosalind Hursthouse",
  "로버트 노직": "Robert Nozick",
  "루키우스 세네카": "Seneca",
  "레온 페스팅거": "Leon Festinger",
  "마거릿 보든": "Margaret Boden",
  "마르쿠스 아우렐리우스": "Marcus Aurelius",
  "마르틴 하이데거": "Martin Heidegger",
  "마사 누스바움": "Martha Nussbaum",
  "마이클 샌델": "Michael Sandel",
  "마키아벨리": "Machiavelli",
  "마샤 리네한": "Marsha M. Linehan",
  "메리 앤 워런": "Mary Anne Warren",
  "미국 국립정신건강연구소": "U.S. National Institute of Mental Health",
  "미국 저작권청": "U.S. Copyright Office",
  "미국수의사회": "American Veterinary Medical Association",
  "밀턴 프리드먼": "Milton Friedman",
  "버나드 롤린": "Bernard Rollin",
  "바뤼흐 스피노자": "Baruch Spinoza",
  "버트런드 러셀": "Bertrand Russell",
  "벵자맹 콩스탕": "Benjamin Constant",
  "빅터 프랭클": "Viktor Frankl",
  "사르트르": "Jean-Paul Sartre",
  "세계의사회": "World Medical Association",
  "세네카": "Seneca",
  "세네카 (Seneca)": "Seneca",
  "쇠렌 키르케고르": "Soren Kierkegaard",
  "쇼펜하우어": "Arthur Schopenhauer",
  "스피노자": "Baruch Spinoza",
  "시몬 드 보부아르": "Simone de Beauvoir",
  "시셀라 복": "Sissela Bok",
  "셰리 터클": "Sherry Turkle",
  "아들러": "Alfred Adler",
  "아마르티아 센": "Amartya Sen",
  "아르투어 쇼펜하우어": "Arthur Schopenhauer",
  "아리스토텔레스": "Aristotle",
  "알랭 드 보통": "Alain de Botton",
  "알베르 카뮈": "Albert Camus",
  "알프레드 아들러": "Alfred Adler",
  "알프레드 아들러 (기시미 이치로 해설)": "Alfred Adler",
  "알프레트 아들러": "Alfred Adler",
  "애덤 그랜트": "Adam Grant",
  "앤서니 기든스": "Anthony Giddens",
  "에바 페더 키테이": "Eva Feder Kittay",
  "엘리자베스 앤더슨": "Elizabeth Anderson",
  "엘리자베스 브레이크": "Elizabeth Brake",
  "에리히 프롬": "Erich Fromm",
  "에피쿠로스": "Epicurus",
  "에픽테토스": "Epictetus",
  "월터 벤야민": "Walter Benjamin",
  "유엔 아동권리위원회": "UN Committee on the Rights of the Child",
  "유엔아동권리협약": "UN Convention on the Rights of the Child",
  "유엔인구기금": "UNFPA",
  "임마누엘 칸트": "Immanuel Kant",
  "이사야 벌린": "Isaiah Berlin",
  "장자": "Zhuangzi",
  "장폴 사르트르": "Jean-Paul Sartre",
  "제러미 벤담": "Jeremy Bentham",
  "조지 보난노": "George A. Bonanno",
  "존 롤스": "John Rawls",
  "존 가트맨": "John Gottman",
  "존 볼비": "John Bowlby",
  "존 메이너드 케인스": "John Maynard Keynes",
  "존 스튜어트 밀": "John Stuart Mill",
  "주디스 자비스 톰슨": "Judith Jarvis Thomson",
  "체사레 베카리아": "Cesare Beccaria",
  "카뮈": "Albert Camus",
  "칸트": "Immanuel Kant",
  "칼 포퍼": "Karl Popper",
  "칼릴 지브란": "Kahlil Gibran",
  "키르케고르": "Soren Kierkegaard",
  "토머스 페인": "Thomas Paine",
  "틱낫한": "Thich Nhat Hanh",
  "틱낫한 / 불교": "Thich Nhat Hanh / Buddhist practice",
  "폴린 보스": "Pauline Boss",
  "프리드리히 니체": "Friedrich Nietzsche",
  "피부과 진료 관점": "Dermatology care perspective",
  "피터 싱어": "Peter Singer",
  "피에르 부르디외": "Pierre Bourdieu",
  "필리프 판 파레이스": "Philippe Van Parijs",
  "한나 아렌트": "Hannah Arendt",
  "한병철 (Byung-Chul Han)": "Byung-Chul Han",
  "현대 노년 정신건강 관점": "Modern older-adult mental health perspective",
  "현대 수면위생": "Modern sleep hygiene",
  "현대 임상 기준": "Modern clinical criteria",
  "현행 법제": "Current legal framework",
  "미국 국가연구위원회": "National Research Council",
  "크리스틴 네프": "Kristin Neff",
  "크리스티나 마슬라크": "Christina Maslach",
  "수전 울프": "Susan Wolf",
  "어빈 얄롬": "Irvin D. Yalom",
  "Nuffield Council on Bioethics": "Nuffield Council on Bioethics",
  OECD: "OECD",
  "WHO/ILO": "WHO/ILO",
};

export function cardNameLabelEn(name) {
  return cardNameLabelsEn[name] || name;
}

export function cardRoleLabelEn(card) {
  const lens = perspectiveLensLabelEn(card.perspectiveLens);
  const source = sourceTypeLabelEn(card.sourceType);
  if (lens && source) return `${lens} perspective · ${source}`;
  return `${lens || "Perspective"} anchor`;
}
