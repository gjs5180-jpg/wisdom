import { mkdirSync, writeFileSync } from "node:fs";
import {
  allContentEntries,
  peopleForEntryKey,
  relatedEntriesForKey,
} from "../lib/content.js";

const REPORT_PATH = "docs/content-quality-report.md";
const JSON_PATH = "data/content_quality_report.json";

const axisLabels = {
  worry: "고민",
  debate: "논쟁",
  thought: "생각",
};

const criterionWeights = {
  published: 15,
  summary: 10,
  doors: 10,
  cards: 15,
  verified: 15,
  tags: 10,
  actionOrReflect: 10,
  related: 10,
  people: 5,
  sourceSignal: 8,
  sourceInsights: 12,
};

const maxScore = Object.values(criterionWeights).reduce((sum, value) => sum + value, 0);

function minTagsFor(entry) {
  return entry.axis === "debate" ? 2 : 3;
}

function minSummaryLengthFor(entry) {
  return entry.axis === "debate" ? 24 : 36;
}

function minPerspectiveCountFor(entry) {
  return entry.axis === "debate" ? 3 : 2;
}

function perspectiveCountFor(entry, cards, peopleCount) {
  if (entry.axis === "debate") return cards.filter((card) => card.name).length;
  return peopleCount;
}

function actionOrReflectCount(entry) {
  const content = entry.content || {};
  return (content.actions?.length || 0) + (content.reflect?.length || 0);
}

function gradeFor(score) {
  if (score >= 90) return "A";
  if (score >= 75) return "B";
  if (score >= 60) return "C";
  return "D";
}

function statusFor(grade) {
  return {
    A: "강함",
    B: "공개 안정",
    C: "보강 필요",
    D: "우선 보강",
  }[grade];
}

function addCriterion(results, key, label, passed, weight, action) {
  results.criteria[key] = { label, passed, weight, action };
  if (passed) results.score += weight;
  else results.issues.push(action);
}

function evaluateEntry(entry) {
  const content = entry.content || {};
  const cards = content.cards || [];
  const verifiedCount = entry.verifiedCount || 0;
  const tags = entry.tags || [];
  const doors = content.doors || [];
  const sourceInsights = content.sourceLocaleInsights || [];
  const sourceSignal = content.sourceLocaleSignal;
  const relatedCount = relatedEntriesForKey(entry.key, 6).length;
  const peopleCount = peopleForEntryKey(entry.key).length;
  const perspectiveCount = perspectiveCountFor(entry, cards, peopleCount);
  const minPerspectiveCount = minPerspectiveCountFor(entry);
  const actionCount = actionOrReflectCount(entry);

  const result = {
    key: entry.key,
    href: entry.href,
    axis: entry.axis,
    axisLabel: axisLabels[entry.axis] || entry.axis,
    title: entry.title,
    summary: entry.summary,
    categoryTitle: entry.categoryTitle,
    groupTitle: entry.groupTitle,
    score: 0,
    grade: "D",
    status: "우선 보강",
    issues: [],
    metrics: {
      cards: cards.length,
      verifiedCount,
      tags: tags.length,
      doors: doors.length,
      actionOrReflect: actionCount,
      related: relatedCount,
      people: peopleCount,
      perspectives: perspectiveCount,
      sourceSignal: Boolean(sourceSignal),
      sourceInsights: sourceInsights.length,
      summaryLength: String(entry.summary || "").length,
      placeholder: Boolean(content.placeholder),
    },
    criteria: {},
  };

  addCriterion(
    result,
    "published",
    "공개 가능한 본문",
    entry.publishable && !content.placeholder,
    criterionWeights.published,
    "placeholder 상태를 해소하고 공개 가능한 본문으로 정리"
  );
  addCriterion(
    result,
    "summary",
    "요약 문장",
    String(entry.summary || "").length >= minSummaryLengthFor(entry),
    criterionWeights.summary,
    "검색 결과와 카드 상단에서 바로 이해되는 요약 문장 보강"
  );
  addCriterion(
    result,
    "doors",
    "사용자 문장",
    doors.length >= 4,
    criterionWeights.doors,
    "사용자가 실제로 검색할 만한 문장 4개 이상 보강"
  );
  addCriterion(
    result,
    "cards",
    "관점 카드",
    cards.length >= 3,
    criterionWeights.cards,
    "서로 다른 관점 카드 3개 이상 유지"
  );
  addCriterion(
    result,
    "verified",
    "검증 출처",
    verifiedCount >= 3,
    criterionWeights.verified,
    "검증된 출처 카드 3개 이상 확보"
  );
  addCriterion(
    result,
    "tags",
    "태그 연결",
    tags.length >= minTagsFor(entry),
    criterionWeights.tags,
    `${entry.axis === "debate" ? "논쟁" : "고민/생각"} 태그 ${minTagsFor(
      entry
    )}개 이상 연결`
  );
  addCriterion(
    result,
    "actionOrReflect",
    "행동/질문",
    actionCount >= 3,
    criterionWeights.actionOrReflect,
    "읽은 뒤 이어갈 행동 또는 성찰 질문 3개 이상 보강"
  );
  addCriterion(
    result,
    "related",
    "관련 흐름",
    relatedCount >= 6,
    criterionWeights.related,
    "관련 카드 6개 이상 연결되도록 태그/인물/그룹 보강"
  );
  addCriterion(
    result,
    "people",
    "인물/논쟁 관점",
    perspectiveCount >= minPerspectiveCount,
    criterionWeights.people,
    entry.axis === "debate"
      ? `논쟁 관점 ${minPerspectiveCount}개 이상 확보`
      : `관련 인물 관점 ${minPerspectiveCount}명 이상 확보`
  );
  addCriterion(
    result,
    "sourceSignal",
    "언어권 관심 신호",
    Boolean(sourceSignal),
    criterionWeights.sourceSignal,
    "언어권별 수집 표현을 canonical node에 연결"
  );
  addCriterion(
    result,
    "sourceInsights",
    "언어권 표현 인사이트",
    sourceInsights.length > 0,
    criterionWeights.sourceInsights,
    "언어권별 표현 차이와 공통점을 인사이트로 정리"
  );

  result.score = Math.round((result.score / maxScore) * 100);
  result.grade = gradeFor(result.score);
  result.status = statusFor(result.grade);

  return result;
}

function average(rows) {
  if (rows.length === 0) return 0;
  return Math.round(rows.reduce((sum, row) => sum + row.score, 0) / rows.length);
}

function countBy(rows, getKey) {
  return rows.reduce((map, row) => {
    const key = getKey(row);
    map[key] = (map[key] || 0) + 1;
    return map;
  }, {});
}

function coverage(rows, getValue) {
  return rows.filter(getValue).length;
}

function topIssues(rows, limit = 8) {
  const counts = new Map();
  for (const row of rows) {
    for (const issue of row.issues) counts.set(issue, (counts.get(issue) || 0) + 1);
  }
  return [...counts.entries()]
    .map(([issue, count]) => ({ issue, count }))
    .sort((a, b) => b.count - a.count || a.issue.localeCompare(b.issue, "ko"))
    .slice(0, limit);
}

function axisSummary(rows) {
  return ["worry", "debate", "thought"].map((axis) => {
    const axisRows = rows.filter((row) => row.axis === axis);
    return {
      axis,
      label: axisLabels[axis],
      count: axisRows.length,
      averageScore: average(axisRows),
      grades: countBy(axisRows, (row) => row.grade),
    };
  });
}

function criterionSummary(rows) {
  return Object.keys(criterionWeights).map((key) => {
    const label = rows[0]?.criteria[key]?.label || key;
    const passed = rows.filter((row) => row.criteria[key]?.passed).length;
    return {
      key,
      label,
      passed,
      total: rows.length,
      coverage: rows.length ? Math.round((passed / rows.length) * 100) : 0,
    };
  });
}

function markdownTable(rows, columns) {
  const header = `| ${columns.map((column) => column.label).join(" | ")} |`;
  const divider = `| ${columns.map(() => "---").join(" | ")} |`;
  const body = rows.map(
    (row) =>
      `| ${columns
        .map((column) => String(column.value(row)).replace(/\|/g, "\\|"))
        .join(" | ")} |`
  );
  return [header, divider, ...body].join("\n");
}

function makeMarkdown(report) {
  const priorityRows = report.entries.slice(0, 20);
  const sourceBacklog = report.entries
    .filter((entry) => !entry.metrics.sourceSignal || entry.metrics.sourceInsights === 0)
    .sort(
      (a, b) =>
        Number(a.metrics.sourceSignal) - Number(b.metrics.sourceSignal) ||
        a.metrics.sourceInsights - b.metrics.sourceInsights ||
        b.score - a.score
    )
    .slice(0, 20);

  const generatedAt = new Date(report.generatedAt).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
  });

  return `# 콘텐츠 품질 리포트

생성 시각: ${generatedAt}

이 리포트는 공개 카드 전체를 같은 기준으로 점검합니다. 점수는 완성도 절대값이라기보다 다음 보강 순서를 정하기 위한 운영 지표입니다.

## 요약

- 공개 카드: ${report.summary.total}개
- 평균 점수: ${report.summary.averageScore}/100
- A 등급: ${report.summary.grades.A || 0}개
- B 등급: ${report.summary.grades.B || 0}개
- C 등급: ${report.summary.grades.C || 0}개
- D 등급: ${report.summary.grades.D || 0}개
- 언어권 관심 신호 연결: ${report.summary.coverage.sourceSignal}/${report.summary.total}
- 언어권 표현 인사이트 연결: ${report.summary.coverage.sourceInsights}/${report.summary.total}

## 축별 상태

${markdownTable(report.axisSummary, [
  { label: "축", value: (row) => row.label },
  { label: "카드", value: (row) => row.count },
  { label: "평균", value: (row) => row.averageScore },
  {
    label: "등급",
    value: (row) =>
      `A ${row.grades.A || 0} / B ${row.grades.B || 0} / C ${row.grades.C || 0} / D ${
        row.grades.D || 0
      }`,
  },
])}

## 기준별 통과율

${markdownTable(report.criteria, [
  { label: "기준", value: (row) => row.label },
  { label: "통과", value: (row) => `${row.passed}/${row.total}` },
  { label: "비율", value: (row) => `${row.coverage}%` },
])}

## 가장 많이 걸린 보강 항목

${markdownTable(report.topIssues, [
  { label: "보강 항목", value: (row) => row.issue },
  { label: "카드 수", value: (row) => row.count },
])}

## 우선 보강 카드

최저점 카드 20개입니다. C/D 등급이 없더라도 여기부터 보강하면 전체 품질 편차를 줄일 수 있습니다.

${markdownTable(priorityRows, [
  { label: "점수", value: (row) => `${row.score} ${row.grade}` },
  { label: "축", value: (row) => row.axisLabel },
  { label: "카드", value: (row) => `[${row.title}](${row.href})` },
  { label: "주요 보강", value: (row) => row.issues.slice(0, 2).join("; ") },
])}

## 언어권 레이어 보강 후보

${markdownTable(sourceBacklog, [
  { label: "점수", value: (row) => `${row.score} ${row.grade}` },
  { label: "축", value: (row) => row.axisLabel },
  { label: "카드", value: (row) => `[${row.title}](${row.href})` },
  {
    label: "상태",
    value: (row) =>
      `신호 ${row.metrics.sourceSignal ? "있음" : "없음"} / 인사이트 ${
        row.metrics.sourceInsights
      }`,
  },
])}

## 다음 작업 추천

1. C/D 등급 카드부터 태그와 언어권 신호를 보강합니다.
2. 논쟁 카드는 태그 수가 적은 항목을 먼저 정리합니다.
3. 언어권 신호는 있으나 인사이트가 없는 카드를 우선 10개 골라 상세 페이지 표현을 보강합니다.
4. 이 리포트를 PR마다 확인해서 새 카드가 전체 평균을 크게 낮추지 않게 합니다.
`;
}

const entries = allContentEntries().filter((entry) => entry.publishable);
const evaluated = entries.map(evaluateEntry).sort((a, b) => a.score - b.score);

const report = {
  generatedAt: new Date().toISOString(),
  thresholds: {
    grades: {
      A: "90+",
      B: "75-89",
      C: "60-74",
      D: "0-59",
    },
    note: "언어권 관심 신호와 인사이트는 확장 우선순위를 보여주는 품질 레이어입니다.",
  },
  summary: {
    total: evaluated.length,
    averageScore: average(evaluated),
    grades: countBy(evaluated, (row) => row.grade),
    coverage: {
      sourceSignal: coverage(evaluated, (row) => row.metrics.sourceSignal),
      sourceInsights: coverage(evaluated, (row) => row.metrics.sourceInsights > 0),
      related: coverage(evaluated, (row) => row.metrics.related >= 6),
      verified: coverage(evaluated, (row) => row.metrics.verifiedCount >= 3),
    },
  },
  axisSummary: axisSummary(evaluated),
  criteria: criterionSummary(evaluated),
  topIssues: topIssues(evaluated),
  entries: evaluated,
};

mkdirSync("docs", { recursive: true });
mkdirSync("data", { recursive: true });
writeFileSync(JSON_PATH, `${JSON.stringify(report, null, 2)}\n`, "utf8");
writeFileSync(REPORT_PATH, makeMarkdown(report), "utf8");

const gradeText = ["A", "B", "C", "D"]
  .map((grade) => `${grade}:${report.summary.grades[grade] || 0}`)
  .join(" ");

console.log(
  `Content quality OK: ${report.summary.total} cards, average ${report.summary.averageScore}/100 (${gradeText})`
);
console.log(`Wrote ${REPORT_PATH} and ${JSON_PATH}`);
