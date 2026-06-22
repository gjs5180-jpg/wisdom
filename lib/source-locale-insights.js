export const sourceLocaleInsights = {
  "breakup/ghosting": [
    {
      locale: "es-ES",
      signal: "Ghosting is a strong Spanish-language entry point, often phrased as sudden silence or being left on read.",
      userDoors: [
        "상대가 갑자기 사라진 걸 내 잘못으로 돌리게 돼요",
        "고스팅을 당한 뒤 다음 관계도 무서워졌어요",
      ],
      sourcePhrases: [
        "me hizo ghosting",
        "dejó de responder de repente",
        "ghosting en una relación",
        "por qué desaparece sin explicar",
      ],
      searchAliases: ["고스팅", "ghosting", "무응답 이별", "갑자기 사라짐"],
      cluster: "relationships/ghosting",
    },
    {
      locale: "zh-CN",
      signal: "Chinese source phrases often frame this as sudden non-reply, cold-violence breakup, or disappearing in an ambiguous relationship.",
      userDoors: [
        "갑자기 답이 끊긴 게 사실상 이별인지 모르겠어요",
        "설명 없는 침묵이 너무 무례하게 느껴져요",
      ],
      sourcePhrases: ["突然不回消息 恋爱", "被冷暴力分手", "感情里突然消失", "暧昧对象不回消息"],
      searchAliases: ["冷暴力", "잠수", "읽씹", "썸 무응답"],
      cluster: "relationships/ghosting",
    },
  ],
  "debate/remote-work": [
    {
      locale: "es-ES",
      signal: "Spanish source phrases strongly compare telework with in-office work through productivity, worker freedom, and practical tradeoffs.",
      userDoors: [
        "재택근무가 자유인지 상시 접속인지 헷갈려요",
        "출근과 원격근무 중 무엇이 더 공정한 기준인지 알고 싶어요",
      ],
      sourcePhrases: [
        "teletrabajo ventajas y desventajas",
        "trabajo remoto productividad",
        "volver a la oficina debate",
        "teletrabajo o presencial",
      ],
      searchAliases: ["teletrabajo", "trabajo remoto", "presencial", "사무실 복귀", "원격근무"],
      cluster: "work/remote-work-culture",
    },
    {
      locale: "zh-CN",
      signal: "Chinese source phrases tend to ask whether remote work is good, productive, or a reasonable alternative to office work.",
      userDoors: [
        "원격근무가 실제로 생산적인지, 회사가 출근을 강제해도 되는지 궁금해요",
      ],
      sourcePhrases: ["远程办公好不好", "居家办公效率", "是否应该回办公室", "远程办公优缺点"],
      searchAliases: ["远程办公", "居家办公", "回办公室", "재택 생산성"],
      cluster: "work/remote-work-culture",
    },
  ],
  "family/independence": [
    {
      locale: "es-ES",
      signal: "Spanish source phrases around independence often include fear of leaving home and the practical-emotional weight of late independence.",
      userDoors: [
        "성인이 됐는데도 집을 나가는 게 배신처럼 느껴져요",
        "독립하고 싶은데 가족에게 죄책감이 들어요",
      ],
      sourcePhrases: [
        "quiero independizarme",
        "miedo a irme de casa",
        "cómo poner distancia con mis padres",
        "vivir solo ansiedad",
      ],
      searchAliases: ["independizarme", "vivir solo", "irme de casa", "가족과 거리두기"],
      cluster: "family/late-independence",
    },
    {
      locale: "zh-CN",
      signal: "Chinese source phrases connect independence to leaving parents, living alone, economic independence, and keeping distance respectfully.",
      userDoors: [
        "부모에게서 떨어지고 싶은데 경제적으로도 마음으로도 겁이 나요",
      ],
      sourcePhrases: ["想离开父母", "想搬出去住但害怕", "经济独立焦虑", "怎么和父母保持距离"],
      searchAliases: ["想离开父母", "搬出去住", "经济独立", "부모와 거리"],
      cluster: "family/late-independence",
    },
  ],
  "family/parent-conflict": [
    {
      locale: "zh-CN",
      signal: "Chinese source phrases show a recurring family-of-origin frame: control, conflict, and whether the problem is the family system.",
      userDoors: [
        "원가족 문제인지 내가 예민한 건지 헷갈려요",
        "부모님 통제가 사랑인지 간섭인지 모르겠어요",
      ],
      sourcePhrases: ["和父母合不来", "父母总是控制我", "和父母吵架很累", "原生家庭矛盾"],
      searchAliases: ["原生家庭", "父母控制", "부모 통제", "원가족"],
      cluster: "family/family-of-origin",
    },
    {
      locale: "es-ES",
      signal: "Spanish source phrases often use toxic-family language, but the page should translate that into boundaries, safety, and distance without copying forum language.",
      userDoors: [
        "가족이 힘든데 죄책감 때문에 거리를 못 두겠어요",
      ],
      sourcePhrases: ["problemas con mis padres", "mis padres me controlan", "discuto mucho con mi familia", "familia tóxica qué hacer"],
      searchAliases: ["familia tóxica", "padres controlan", "가족 독성", "부모 갈등"],
      cluster: "family/family-of-origin",
    },
  ],
  "money/future-anxiety": [
    {
      locale: "es-ES",
      signal: "Spanish source phrases make money anxiety concrete through month-end pressure, saving difficulty, and economic precarity.",
      userDoors: [
        "월말마다 돈이 모자랄까 봐 미래 전체가 무서워요",
        "저축이 안 되는 게 내 미래 실패처럼 느껴져요",
      ],
      sourcePhrases: [
        "ansiedad por dinero",
        "miedo al futuro económico",
        "no puedo ahorrar dinero",
        "preocupación por no llegar a fin de mes",
      ],
      searchAliases: ["llegar a fin de mes", "precariedad", "ansiedad por dinero", "월말 불안"],
      cluster: "money/precarity",
    },
    {
      locale: "zh-CN",
      signal: "Chinese source phrases emphasize future money anxiety, inability to save, living-cost pressure, and financial anxiety.",
      userDoors: [
        "생활비와 저축이 불안해서 미래 계획을 세우기 어려워요",
      ],
      sourcePhrases: ["未来没钱很焦虑", "存不到钱怎么办", "生活费压力大", "财务焦虑"],
      searchAliases: ["财务焦虑", "存不到钱", "生活费压力", "돈 미래 불안"],
      cluster: "money/precarity",
    },
  ],
  "meaning/meaningless": [
    {
      locale: "es-ES",
      signal: "Spanish source phrases often name existential emptiness directly as a lack of meaning, purpose, or reason to live.",
      userDoors: [
        "삶의 의미가 안 잡혀서 하루가 그냥 비어 있는 느낌이에요",
        "왜 살아야 하는지 모르겠다는 질문이 반복돼요",
      ],
      sourcePhrases: ["mi vida no tiene sentido", "siento vacío existencial", "para qué vivir", "no encuentro propósito"],
      searchAliases: ["vacío existencial", "propósito", "sentido de la vida", "존재 공허"],
      cluster: "meaning/existential-vacuum",
    },
    {
      locale: "zh-CN",
      signal: "Chinese source phrases connect meaninglessness to emptiness, lack of interest, and the repeated question of why to live.",
      userDoors: [
        "딱히 큰일이 난 건 아닌데 사는 이유가 흐릿해요",
      ],
      sourcePhrases: ["人生没有意义怎么办", "活着没意思", "感觉人生很空虚", "为什么活着"],
      searchAliases: ["人生没有意义", "活着没意思", "空虚", "왜 살아야"],
      cluster: "meaning/existential-vacuum",
    },
  ],
  "study/exam-anxiety": [
    {
      locale: "zh-CN",
      signal: "Chinese source phrases around exam anxiety include high-stakes entrance exams, fear of failure, and pre-test bodily tension.",
      userDoors: [
        "시험 하나가 내 인생 전체를 결정할 것 같아요",
        "입시나 자격증 결과 때문에 몸이 먼저 긴장해요",
      ],
      sourcePhrases: ["考试焦虑怎么办", "高考焦虑", "考前紧张怎么办", "害怕考试失败"],
      searchAliases: ["高考", "考试焦虑", "考前紧张", "입시 압박"],
      cluster: "study/exam-pressure",
    },
    {
      locale: "es-ES",
      signal: "Spanish source phrases include exam anxiety, fear of failing, selectividad, and other competitive exam contexts.",
      userDoors: [
        "시험 전 긴장이 너무 커서 공부한 것까지 사라지는 느낌이에요",
      ],
      sourcePhrases: ["ansiedad ante los exámenes", "miedo a suspender", "nervios antes de un examen", "ansiedad por selectividad"],
      searchAliases: ["selectividad", "oposiciones", "ansiedad exámenes", "시험 공포"],
      cluster: "study/exam-pressure",
    },
  ],
  "study/cant-study": [
    {
      locale: "zh-CN",
      signal: "Chinese source phrases distinguish not studying from not being able to enter study mode, often with attention and motivation language.",
      userDoors: [
        "공부해야 하는 걸 아는데 몸이 책상 앞에서 멈춰요",
      ],
      sourcePhrases: ["学不进去怎么办", "学习没有动力", "学习注意力不集中", "明明该学习却学不进去"],
      searchAliases: ["学不进去", "学习没有动力", "집중 안 됨", "공부 시작 못함"],
      cluster: "study/study-initiation",
    },
  ],
  "debate/childfree": [
    {
      locale: "es-ES",
      signal: "Spanish source phrases use childfree and regret language, which makes the debate less abstract and more personal.",
      userDoors: [
        "아이를 낳지 않는 선택이 이기적인지 궁금해요",
        "나중에 후회할까 봐 두렵지만 강요받고 싶지는 않아요",
      ],
      sourcePhrases: ["no quiero tener hijos", "me arrepentiré de no tener hijos", "ser childfree", "tener hijos o no"],
      searchAliases: ["childfree", "no quiero tener hijos", "tener hijos o no", "무자녀 선택"],
      cluster: "debate/childfree-identity",
    },
    {
      locale: "zh-CN",
      signal: "Chinese source phrases connect the childfree debate to DINK identity, regret, and whether having children is required.",
      userDoors: [
        "가족 기대와 내 몸의 결정권이 부딪혀요",
      ],
      sourcePhrases: ["不想生孩子正常吗", "丁克会后悔吗", "不要孩子的人生", "要不要生孩子纠结"],
      searchAliases: ["丁克", "不想生孩子", "要不要生孩子", "비출산"],
      cluster: "debate/childfree-identity",
    },
  ],
};

function normalizeKey(key) {
  return String(key || "").replace(/^\//, "");
}

function unique(values) {
  return [...new Set(values.filter(Boolean).map((value) => String(value).trim()).filter(Boolean))];
}

export function sourceLocaleInsightsForKey(key) {
  return sourceLocaleInsights[normalizeKey(key)] || [];
}

export function sourceLocaleUserDoorsForKey(key) {
  return unique(sourceLocaleInsightsForKey(key).flatMap((insight) => insight.userDoors || []));
}

export function sourceLocaleSearchTextForInsights(insights = []) {
  return unique(
    insights.flatMap((insight) => [
      insight.locale,
      insight.cluster,
      ...(insight.userDoors || []),
      ...(insight.sourcePhrases || []),
      ...(insight.searchAliases || []),
    ])
  ).join(" ");
}

export function sourceLocaleSearchText(key) {
  return sourceLocaleSearchTextForInsights(sourceLocaleInsightsForKey(key));
}
