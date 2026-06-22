// ============================================================================
// integrate-nodes.mjs — 검증 워크플로 결과(여러 배치) → 앱 콘텐츠 구조로 변환
// ----------------------------------------------------------------------------
// 여러 워크플로 산출 JSON(.result)을 슬롯 기준으로 머지해:
//   - lib/nodes-generated.js  (generatedWorry / generatedDebate)
//   - docs/node-verification.md (카드별 검증 기록 + fix-list)
// content.js 가 generated 를 머지해 화면에 뿌린다.  실행: node scripts/integrate-nodes.mjs
// ============================================================================

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";

const TASKS =
  "C:/Users/HeonHa/AppData/Local/Temp/claude/c--Users-HeonHa-Documents-GitHub-camprice/6f20b08e-5ff1-49bf-a6e6-250aafbd3cfc/tasks";

// 배치 워크플로 산출 파일들 (나중 것이 같은 슬롯을 덮어씀)
const SOURCES = [
  `${TASKS}/wyf41j8jm.output`, // batch1: 6 노드 (4 고민 + 2 논쟁)
  `${TASKS}/w2r3lb7p3.output`, // batch2: 18 고민 노드 (세션한도로 일부 검증 누락)
  `${TASKS}/wixqeekkp.output`, // batch2 resume: 실패 검증 재실행 (같은 슬롯 덮어씀)
];

const bySlot = new Map();
for (const src of SOURCES) {
  if (!existsSync(src)) {
    console.log(`(skip, 없음) ${src}`);
    continue;
  }
  const data = JSON.parse(readFileSync(src, "utf8"));
  for (const n of data.result || []) bySlot.set(n.slot, n);
}
const nodes = [...bySlot.values()];

// 미검증 카드 출처는 정직하게 축약
function condenseSource(src, verified, name) {
  if (verified) return src;
  // 생성 단계의 깔끔한 출처(짧음)는 그대로 두고 '확인 중'만 붙임
  if (src && src.length <= 60) return `${src} · 확인 중`;
  // 검증 설명이 길게 붙은 출처는 책 제목만 추려서 축약
  const book = (src.match(/《[^》]+》/) || [])[0];
  return book
    ? `${book} · 정확한 문구 확인 중`
    : `${name} 관련 저작 · 정확한 문구 확인 중`;
}

const mapCard = (c) => ({
  name: c.name,
  role: c.role,
  view: c.view,
  action: c.action,
  quote: c.quote,
  source: condenseSource(c.source, c.verified, c.name),
  stance: c.stance,
  verified: !!c.verified,
});

// 생성기가 가끔 3번째 카드를 실제 인물이 아니라 'A vs B 충돌 지점' 메타카드로 채움 → 제거
const isMetaCard = (c) => / vs |충돌 지점|⟂/.test(c?.name || "");

const generatedWorry = {};
const generatedDebate = {};

for (const n of nodes) {
  const cards = (n.cards || []).filter((c) => !isMetaCard(c)).map(mapCard);
  if (n.axis === "논쟁") {
    generatedDebate[n.slot] = {
      question: n.headline,
      doors: n.doors || [],
      cards,
      reflect: n.practice || [],
    };
  } else {
    generatedWorry[n.slot] = {
      emotion: n.headline,
      doors: n.doors || [],
      cards,
      actions: n.practice || [],
    };
  }
}

const header = `// AUTO-GENERATED — 검증 워크플로 결과 머지. 직접 편집 금지(재생성됨).\n// 각 카드 verified: 회의적 검증자 2명이 웹 대조 통과 시에만 true.\n\n`;
writeFileSync(
  "lib/nodes-generated.js",
  header +
    `export const generatedWorry = ${JSON.stringify(generatedWorry, null, 2)};\n\n` +
    `export const generatedDebate = ${JSON.stringify(generatedDebate, null, 2)};\n`
);

// ── 검증 기록 ────────────────────────────────────────────────────────────────
mkdirSync("docs", { recursive: true });
let tot = 0, ver = 0;
const fixlist = [];
let body = "";
for (const n of nodes) {
  body += `## ${n.title} \`${n.slot}\` (${n.axis})\n\n`;
  for (const c of n.cards) {
    tot++;
    if (c.verified) ver++;
    else fixlist.push(`- **${n.title} · ${c.name}** — 문구 verbatim 확인 필요`);
    body += `### ${c.name} ${c.verified ? "✅ 출처 확인됨" : "⚠️ 출처 확인 중"} (사상 진본=${c.idea_authentic})\n`;
    body += `> ${c.quote}\n\n출처(원문): ${c.source}\n\n`;
    for (const note of c.verdict_notes || []) body += `- ${note}\n`;
    body += `\n`;
  }
}
const md = `# 노드 검증 기록\n\n총 ${tot}개 카드 · 검증 통과 ${ver} · 확인 중 ${tot - ver}\n\n## 문구 verbatim 확인 필요 (fix-list)\n\n${fixlist.join("\n")}\n\n---\n\n${body}`;
writeFileSync("docs/node-verification.md", md);

console.log("===== 통합 완료 =====");
console.log(`고민 노드: ${Object.keys(generatedWorry).length} | 논쟁 노드: ${Object.keys(generatedDebate).length}`);
console.log(`카드 총 ${tot} · ✅검증 ${ver} · ⚠️확인중 ${tot - ver}`);
