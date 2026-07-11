import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const outputDir = path.join(process.cwd(), "public", "apps-in-toss");

const brand = {
  name: "나를키우기",
  appName: "nareulkiugi",
  tagline: "문제를 오늘의 미션으로",
  value: "막막한 문제를 이해하고 오늘 바로 실천해요",
  description:
    "문제상황을 고르고 원인을 이해한 뒤, 오늘의 미션으로 나를 성장시키는 자기개발 앱",
};

const colors = {
  cream: "#faf6ee",
  paper: "#fffdfa",
  ink: "#2c2722",
  inkSoft: "#6f665b",
  inkFaint: "#a89e90",
  line: "#e8dfd0",
  clay: "#9c5b3e",
  clayDark: "#7e452f",
  claySoft: "#f0e6df",
  green: "#5e7c58",
  blue: "#4d6d8f",
  amber: "#c28f42",
  dark: "#191614",
  darkPanel: "#27221f",
};

const font = "Malgun Gothic, Apple SD Gothic Neo, Noto Sans KR, Arial, sans-serif";
const serif = "Malgun Gothic, Noto Serif KR, serif";

const exposureText = {
  category: "생활 / 자기개발 / 마음관리",
  keywords: [
    "자기개발",
    "성장",
    "미션",
    "챌린지",
    "루틴",
    "습관",
    "고민",
    "마음관리",
    "자존감",
    "무기력",
    "번아웃",
    "연애고민",
    "인간관계",
    "공부",
    "기록",
  ],
};

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function textLines(text, maxChars) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines;
}

function multiline(lines, x, y, options = {}) {
  const {
    size = 32,
    lineHeight = Math.round(size * 1.45),
    fill = colors.ink,
    weight = 500,
    anchor = "start",
    family = font,
  } = options;

  return lines
    .map(
      (line, index) => `
      <text x="${x}" y="${y + index * lineHeight}" fill="${fill}" font-size="${size}" font-weight="${weight}" font-family="${family}" text-anchor="${anchor}">${escapeXml(line)}</text>`
    )
    .join("");
}

function logoMark({ x, y, size, dark = false }) {
  const bg = dark ? colors.darkPanel : colors.paper;
  const step = dark ? "#f6d7c7" : colors.clay;
  const stepSoft = dark ? "#5b4035" : colors.claySoft;
  const text = dark ? "#fff7ef" : colors.ink;
  const shadow = dark ? "rgba(0,0,0,.4)" : "rgba(76,55,38,.18)";
  const r = Math.round(size * 0.23);
  const s = size / 600;

  return `
    <g transform="translate(${x} ${y})">
      <rect width="${size}" height="${size}" rx="${r}" fill="${bg}" filter="url(#softShadow)"/>
      <circle cx="${size * 0.5}" cy="${size * 0.5}" r="${size * 0.35}" fill="${stepSoft}"/>
      <path d="M ${170 * s} ${385 * s} H ${255 * s} V ${305 * s} H ${340 * s} V ${225 * s} H ${430 * s}"
        fill="none" stroke="${step}" stroke-width="${46 * s}" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M ${415 * s} ${225 * s} L ${415 * s} ${150 * s} L ${490 * s} ${150 * s}"
        fill="none" stroke="${step}" stroke-width="${46 * s}" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="${size * 0.5}" y="${size * 0.76}" fill="${text}" font-size="${122 * s}" font-family="${serif}" font-weight="800" text-anchor="middle" letter-spacing="0">${escapeXml("나")}</text>
      <ellipse cx="${size * 0.5}" cy="${size * 0.84}" rx="${size * 0.27}" ry="${size * 0.035}" fill="${shadow}" opacity=".35"/>
    </g>`;
}

function defs() {
  return `
    <defs>
      <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="16" stdDeviation="20" flood-color="#4c3726" flood-opacity=".16"/>
      </filter>
      <filter id="lightShadow" x="-30%" y="-30%" width="160%" height="160%">
        <feDropShadow dx="0" dy="10" stdDeviation="15" flood-color="#4c3726" flood-opacity=".13"/>
      </filter>
      <linearGradient id="warmBg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#fffdfa"/>
        <stop offset="58%" stop-color="#faf6ee"/>
        <stop offset="100%" stop-color="#f0e6df"/>
      </linearGradient>
      <linearGradient id="darkBg" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0%" stop-color="#332923"/>
        <stop offset="100%" stop-color="#191614"/>
      </linearGradient>
    </defs>`;
}

function frame(width, height, body, bg = colors.cream) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      ${defs()}
      <rect width="${width}" height="${height}" fill="${bg}"/>
      ${body}
    </svg>`;
}

function phoneShell(x, y, width, height, body, options = {}) {
  const { scale = 1, title = "나를키우기" } = options;
  const r = 46 * scale;
  const innerX = 18 * scale;
  const innerY = 24 * scale;
  const innerW = width - 36 * scale;
  const innerH = height - 48 * scale;

  return `
    <g transform="translate(${x} ${y})">
      <rect width="${width}" height="${height}" rx="${r}" fill="${colors.dark}" filter="url(#softShadow)"/>
      <rect x="${18 * scale}" y="${24 * scale}" width="${innerW}" height="${innerH}" rx="${32 * scale}" fill="${colors.cream}"/>
      <rect x="${width * 0.37}" y="${37 * scale}" width="${width * 0.26}" height="${10 * scale}" rx="${5 * scale}" fill="#2d2824"/>
      <text x="${44 * scale}" y="${88 * scale}" fill="${colors.inkFaint}" font-size="${18 * scale}" font-family="${font}" font-weight="700">${escapeXml(title)}</text>
      <g transform="translate(${innerX} ${innerY + 92 * scale}) scale(${scale})">
        ${body}
      </g>
    </g>`;
}

function chip(x, y, label, options = {}) {
  const {
    fill = colors.paper,
    stroke = colors.line,
    text = colors.inkSoft,
    width = Math.max(88, label.length * 15 + 30),
    height = 38,
    size = 18,
  } = options;

  return `
    <g>
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="19" fill="${fill}" stroke="${stroke}"/>
      <text x="${x + width / 2}" y="${y + height / 2 + size * 0.36}" fill="${text}" font-size="${size}" font-family="${font}" font-weight="700" text-anchor="middle">${escapeXml(label)}</text>
    </g>`;
}

function card(x, y, width, height, title, body, options = {}) {
  const { active = false, badge = "", accent = colors.clay, titleSize = 27, bodySize = 21 } = options;
  const fill = active ? colors.claySoft : colors.paper;
  const stroke = active ? "rgba(156,91,62,.45)" : colors.line;
  const lines = textLines(body, Math.max(14, Math.floor(width / (bodySize * 0.86))));

  return `
    <g>
      <rect x="${x}" y="${y}" width="${width}" height="${height}" rx="18" fill="${fill}" stroke="${stroke}" filter="url(#lightShadow)"/>
      <text x="${x + 26}" y="${y + 40}" fill="${colors.ink}" font-size="${titleSize}" font-family="${serif}" font-weight="800">${escapeXml(title)}</text>
      ${badge ? chip(x + width - 132, y + 18, badge, { width: 104, height: 32, size: 15, fill: colors.paper, text: accent }) : ""}
      ${multiline(lines.slice(0, 3), x + 26, y + 78, {
        size: bodySize,
        lineHeight: Math.round(bodySize * 1.45),
        fill: colors.inkSoft,
      })}
    </g>`;
}

function bottomNav(x, y, width, active = 0) {
  const labels = ["문제", "원인", "미션", "기록"];
  return `
    <g>
      <rect x="${x}" y="${y}" width="${width}" height="78" rx="24" fill="${colors.paper}" stroke="${colors.line}"/>
      ${labels
        .map((label, index) => {
          const cell = width / labels.length;
          const cx = x + cell * index + cell / 2;
          const isActive = index === active;
          return `
            <g>
              <circle cx="${cx}" cy="${y + 27}" r="11" fill="${isActive ? colors.clay : colors.line}"/>
              <text x="${cx}" y="${y + 58}" fill="${isActive ? colors.clay : colors.inkFaint}" font-size="16" font-family="${font}" font-weight="700" text-anchor="middle">${escapeXml(label)}</text>
            </g>`;
        })
        .join("")}
    </g>`;
}

function screenProblem() {
  return `
    <text x="28" y="12" fill="${colors.inkFaint}" font-size="18" font-family="${font}" font-weight="800">PROBLEM</text>
    <text x="28" y="58" fill="${colors.ink}" font-size="39" font-family="${serif}" font-weight="900">오늘 어떤 문제를</text>
    <text x="28" y="108" fill="${colors.ink}" font-size="39" font-family="${serif}" font-weight="900">바꿔볼까요?</text>
    ${chip(28, 140, "자기개발", { width: 118, fill: colors.claySoft, text: colors.clay })}
    ${chip(158, 140, "마음관리", { width: 118 })}
    ${chip(288, 140, "인간관계", { width: 118 })}
    ${card(28, 205, 520, 146, "자꾸 무기력해요", "게으름보다 에너지, 목표 크기, 압박 목록을 먼저 나눠봅니다.", { active: true, badge: "인기" })}
    ${card(28, 371, 520, 146, "연락 때문에 불안해요", "답장 속도와 내 가치를 분리하고 오늘 할 행동을 정합니다.", { badge: "연애" })}
    ${card(28, 537, 520, 146, "공부를 시작 못하겠어요", "결과 불안을 줄이고 10분 행동으로 시작 단위를 낮춥니다.", { badge: "공부" })}
    ${card(28, 703, 520, 116, "눈치를 너무 봐요", "상대 기분 추측보다 내 기준을 먼저 적어봅니다.", { badge: "관계" })}
    ${bottomNav(28, 850, 520, 0)}
  `;
}

function screenCause() {
  return `
    <text x="28" y="12" fill="${colors.inkFaint}" font-size="18" font-family="${font}" font-weight="800">CAUSE</text>
    <text x="28" y="58" fill="${colors.ink}" font-size="39" font-family="${serif}" font-weight="900">원인을 고르면</text>
    <text x="28" y="108" fill="${colors.ink}" font-size="39" font-family="${serif}" font-weight="900">방법이 더 정확해져요</text>
    ${card(28, 164, 520, 152, "에너지가 너무 낮음", "의지가 약한 게 아니라 몸과 마음의 연료가 부족한 상태일 수 있어요.", { active: true })}
    ${card(28, 338, 520, 152, "목표가 너무 큼", "큰 결심은 멈춘 상태에서 더 무겁게 느껴져요. 1분 단위로 줄입니다." )}
    ${card(28, 512, 520, 152, "압박 목록이 많음", "해야 한다는 생각이 많으면 시작점이 흐려질 수 있어요." )}
    <rect x="28" y="706" width="520" height="134" rx="18" fill="${colors.clayDark}"/>
    <text x="56" y="750" fill="#f6d7c7" font-size="18" font-family="${font}" font-weight="800">오늘의 기준</text>
    ${multiline(["의미를 찾기보다 물, 산책, 샤워처럼", "몸을 움직이는 행동 하나를 고릅니다."], 56, 789, {
      size: 23,
      lineHeight: 34,
      fill: "#fff8f2",
      weight: 700,
    })}
    ${bottomNav(28, 866, 520, 1)}
  `;
}

function screenMission() {
  return `
    <text x="28" y="12" fill="${colors.inkFaint}" font-size="18" font-family="${font}" font-weight="800">MISSION</text>
    <text x="28" y="58" fill="${colors.ink}" font-size="39" font-family="${serif}" font-weight="900">오늘은 이만큼만</text>
    <text x="28" y="108" fill="${colors.ink}" font-size="39" font-family="${serif}" font-weight="900">해보면 충분해요</text>
    <rect x="28" y="154" width="520" height="112" rx="20" fill="${colors.paper}" stroke="${colors.line}" filter="url(#lightShadow)"/>
    <text x="56" y="196" fill="${colors.inkFaint}" font-size="17" font-family="${font}" font-weight="800">근거 있는 방법</text>
    ${multiline(["운동화 신고 5분만 걷기", "끝나면 몸 상태를 한 줄로 기록하기"], 56, 230, {
      size: 23,
      lineHeight: 32,
      fill: colors.ink,
      weight: 800,
    })}
    ${["물 한 컵 마시기", "집 밖으로 5분 나가기", "오늘 안 할 일 하나 내려놓기", "끝난 뒤 기분 한 줄 적기"]
      .map((label, index) => {
        const y = 304 + index * 103;
        const checked = index < 2;
        return `
          <g>
            <rect x="28" y="${y}" width="520" height="78" rx="18" fill="${checked ? colors.claySoft : colors.paper}" stroke="${checked ? "rgba(156,91,62,.45)" : colors.line}"/>
            <circle cx="70" cy="${y + 39}" r="19" fill="${checked ? colors.clay : colors.paper}" stroke="${checked ? colors.clay : colors.line}"/>
            <text x="70" y="${y + 47}" fill="${checked ? "#fff" : colors.inkFaint}" font-size="21" font-family="${font}" font-weight="900" text-anchor="middle">${checked ? "✓" : index + 1}</text>
            <text x="106" y="${y + 48}" fill="${colors.ink}" font-size="24" font-family="${font}" font-weight="700">${escapeXml(label)}</text>
          </g>`;
      })
      .join("")}
    <rect x="28" y="735" width="520" height="95" rx="18" fill="${colors.paper}" stroke="${colors.line}"/>
    <text x="56" y="775" fill="${colors.inkFaint}" font-size="18" font-family="${font}" font-weight="700">오늘 기록</text>
    <text x="56" y="810" fill="${colors.inkSoft}" font-size="22" font-family="${font}">밖에 나가니 생각보다 덜 막막했다.</text>
    ${bottomNav(28, 866, 520, 2)}
  `;
}

function screenProgress() {
  return `
    <text x="28" y="12" fill="${colors.inkFaint}" font-size="18" font-family="${font}" font-weight="800">PROGRESS</text>
    <text x="28" y="58" fill="${colors.ink}" font-size="39" font-family="${serif}" font-weight="900">작은 행동이 쌓이면</text>
    <text x="28" y="108" fill="${colors.ink}" font-size="39" font-family="${serif}" font-weight="900">나를 믿게 돼요</text>
    <rect x="28" y="154" width="520" height="172" rx="24" fill="${colors.clayDark}"/>
    <text x="62" y="204" fill="#f6d7c7" font-size="20" font-family="${font}" font-weight="800">이번 주 성장</text>
    <text x="62" y="276" fill="#fff8f2" font-size="72" font-family="${serif}" font-weight="900">5일</text>
    <text x="226" y="276" fill="#fff8f2" font-size="30" font-family="${font}" font-weight="800">연속 실천</text>
    <g transform="translate(28 370)">
      ${[0, 1, 2, 3, 4, 5, 6]
        .map((day, index) => {
          const x = index * 75;
          const done = index < 5;
          return `
            <g>
              <circle cx="${x + 28}" cy="28" r="27" fill="${done ? colors.clay : colors.paper}" stroke="${done ? colors.clay : colors.line}"/>
              <text x="${x + 28}" y="36" fill="${done ? "#fff" : colors.inkFaint}" font-size="21" font-family="${font}" font-weight="900" text-anchor="middle">${done ? "✓" : day + 1}</text>
            </g>`;
        })
        .join("")}
    </g>
    ${card(28, 478, 520, 132, "내가 발견한 패턴", "아침에는 시작이 어렵고, 밖으로 나가면 불안이 줄어들었어요.", { active: false })}
    ${card(28, 632, 520, 132, "내일의 조정", "목표를 더 작게 만들고 첫 행동을 물 한 컵으로 시작합니다.", { active: true })}
    ${bottomNav(28, 866, 520, 3)}
  `;
}

async function pngFromSvg(fileName, svg) {
  await sharp(Buffer.from(svg)).png().toFile(path.join(outputDir, fileName));
}

async function writeTextFile(fileName, content) {
  await fs.writeFile(path.join(outputDir, fileName), content, "utf8");
}

async function generateLogo(fileName, dark = false) {
  const body = `
    <rect width="600" height="600" rx="132" fill="${dark ? "url(#darkBg)" : "url(#warmBg)"}"/>
    ${logoMark({ x: 84, y: 84, size: 432, dark })}
  `;
  await pngFromSvg(fileName, frame(600, 600, body, dark ? colors.dark : colors.cream));
}

async function generateThumbnail() {
  const w = 1932;
  const h = 828;
  const body = `
    <rect width="${w}" height="${h}" fill="url(#warmBg)"/>
    <circle cx="1640" cy="40" r="420" fill="${colors.claySoft}" opacity=".72"/>
    <circle cx="190" cy="800" r="360" fill="#f7eee4" opacity=".9"/>
    ${logoMark({ x: 126, y: 126, size: 168 })}
    <text x="126" y="378" fill="${colors.ink}" font-size="96" font-family="${serif}" font-weight="900">${escapeXml(brand.name)}</text>
    <text x="126" y="470" fill="${colors.clay}" font-size="55" font-family="${font}" font-weight="900">${escapeXml(brand.tagline)}</text>
    ${multiline(["문제상황을 고르고 원인을 이해한 뒤", "오늘 할 작은 미션으로 기록해요."], 126, 548, {
      size: 39,
      lineHeight: 58,
      fill: colors.inkSoft,
      weight: 700,
    })}
    ${["문제 선택", "원인 이해", "오늘 미션", "기록"]
      .map((label, index) =>
        chip(126 + index * 170, 692, label, {
          width: 142,
          height: 48,
          size: 22,
          fill: index === 2 ? colors.clayDark : colors.paper,
          text: index === 2 ? "#fff8f2" : colors.inkSoft,
          stroke: index === 2 ? colors.clayDark : colors.line,
        })
      )
      .join("")}
    ${phoneShell(1186, 72, 330, 662, screenProblem(), { scale: 0.54 })}
    ${phoneShell(1470, 118, 330, 662, screenMission(), { scale: 0.54 })}
  `;
  await pngFromSvg("thumbnail-1932x828.png", frame(w, h, body));
}

async function generateVertical(fileName, screen, headline, subline, navIndex) {
  const w = 636;
  const h = 1048;
  const body = `
    <rect width="${w}" height="${h}" fill="url(#warmBg)"/>
    <text x="40" y="74" fill="${colors.ink}" font-size="42" font-family="${serif}" font-weight="900">${escapeXml(headline)}</text>
    <text x="40" y="121" fill="${colors.inkSoft}" font-size="24" font-family="${font}" font-weight="700">${escapeXml(subline)}</text>
    <g transform="translate(0 22)">
      ${phoneShell(52, 126, 532, 854, screen, { scale: 0.76 })}
    </g>
    <text x="318" y="1020" fill="${colors.inkFaint}" font-size="18" font-family="${font}" font-weight="700" text-anchor="middle">${escapeXml(["문제 선택", "원인 이해", "미션 실천", "성장 기록"][navIndex])}</text>
  `;
  await pngFromSvg(fileName, frame(w, h, body));
}

async function generateHorizontal() {
  const w = 1504;
  const h = 741;
  const body = `
    <rect width="${w}" height="${h}" fill="url(#warmBg)"/>
    <text x="70" y="94" fill="${colors.ink}" font-size="62" font-family="${serif}" font-weight="900">${escapeXml("문제는 작게, 행동은 오늘")}</text>
    <text x="72" y="148" fill="${colors.inkSoft}" font-size="30" font-family="${font}" font-weight="800">${escapeXml("고민을 미션으로 바꾸는 자기개발 앱")}</text>
    ${["1 문제 선택", "2 원인 이해", "3 미션 실천", "4 기록"]
      .map((label, index) =>
        chip(72 + index * 163, 196, label, {
          width: 140,
          height: 45,
          size: 19,
          fill: index === 2 ? colors.clayDark : colors.paper,
          text: index === 2 ? "#fff8f2" : colors.inkSoft,
          stroke: index === 2 ? colors.clayDark : colors.line,
        })
      )
      .join("")}
    <g transform="translate(46 266)">
      ${phoneShell(0, 0, 265, 452, screenProblem(), { scale: 0.37 })}
      ${phoneShell(290, 0, 265, 452, screenCause(), { scale: 0.37 })}
      ${phoneShell(580, 0, 265, 452, screenMission(), { scale: 0.37 })}
      ${phoneShell(870, 0, 265, 452, screenProgress(), { scale: 0.37 })}
    </g>
    <rect x="1200" y="158" width="238" height="424" rx="40" fill="${colors.clayDark}" filter="url(#softShadow)"/>
    <text x="1319" y="246" fill="#f6d7c7" font-size="24" font-family="${font}" font-weight="900" text-anchor="middle">오늘의 가치</text>
    <text x="1319" y="336" fill="#fff8f2" font-size="50" font-family="${serif}" font-weight="900" text-anchor="middle">작은</text>
    <text x="1319" y="393" fill="#fff8f2" font-size="50" font-family="${serif}" font-weight="900" text-anchor="middle">실천</text>
    <text x="1319" y="468" fill="#f6d7c7" font-size="25" font-family="${font}" font-weight="800" text-anchor="middle">나를 키우는</text>
    <text x="1319" y="504" fill="#f6d7c7" font-size="25" font-family="${font}" font-weight="800" text-anchor="middle">하루 미션</text>
  `;
  await pngFromSvg("screenshot-horizontal-1504x741.png", frame(w, h, body));
}

async function generateDocs() {
  const keywordLine = exposureText.keywords.join(", ");
  const content = `# Apps in Toss 노출 정보

## 앱 기본값

- 앱 이름: ${brand.name}
- appName: ${brand.appName}
- 앱 유형: 비게임
- 카테고리 추천: ${exposureText.category}
- 사용자가 얻는 가치: ${brand.value}
- 앱 설명: ${brand.description}

## 업로드 파일

- 앱 로고: \`app-logo-600.png\`
- 다크모드 앱 로고: \`app-logo-dark-600.png\`
- 썸네일: \`thumbnail-1932x828.png\`
- 세로형 스크린샷 1: \`screenshot-vertical-1-636x1048.png\`
- 세로형 스크린샷 2: \`screenshot-vertical-2-636x1048.png\`
- 세로형 스크린샷 3: \`screenshot-vertical-3-636x1048.png\`
- 가로형 스크린샷: \`screenshot-horizontal-1504x741.png\`

## 앱 검색 키워드

${keywordLine}
`;

  await writeTextFile("exposure-copy.md", content);
  await writeTextFile("search-keywords.txt", keywordLine);
}

async function main() {
  await fs.mkdir(outputDir, { recursive: true });
  await generateLogo("app-logo-600.png", false);
  await generateLogo("app-logo-dark-600.png", true);
  await generateThumbnail();
  await generateVertical(
    "screenshot-vertical-1-636x1048.png",
    screenProblem(),
    "내 문제를 먼저 고르고",
    "막막한 상황을 작게 나눠요",
    0
  );
  await generateVertical(
    "screenshot-vertical-2-636x1048.png",
    screenCause(),
    "원인을 이해하면",
    "오늘 할 행동이 선명해져요",
    1
  );
  await generateVertical(
    "screenshot-vertical-3-636x1048.png",
    screenMission(),
    "작은 미션으로 실천",
    "완료와 기록이 이 기기에 저장돼요",
    2
  );
  await generateHorizontal();
  await generateDocs();

  console.log(`Generated Apps in Toss exposure assets in ${outputDir}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
