import { sourceLocaleDisplayName, sourceLocaleSignalForKey } from "./source-locale-signals.js";

const GENERATED_INSIGHT_LIMIT = 2;

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
  "love/impatient": [
    {
      locale: "en-US",
      signal: "English source phrases frame impatience as romantic urgency, waiting for replies, and the question of whether to act or wait.",
      userDoors: [
        "답장이 늦어질 때마다 관계가 끝난 것처럼 급해져요",
        "고백하거나 기다리거나 포기해야 하는지 빨리 결론내고 싶어요",
      ],
      sourcePhrases: [
        "why do i feel impatient",
        "impatient in dating",
        "waiting for a reply anxiety",
        "should I confess or wait",
      ],
      searchAliases: ["impatient in dating", "reply anxiety", "연애 조급함", "고백 기다림"],
      cluster: "relationships/romantic-urgency",
    },
    {
      locale: "ja-JP",
      signal: "Japanese source phrases often make the same urgency concrete through waiting for messages and worrying about the timing of confession.",
      userDoors: [
        "연락이 늦어지면 바로 확인받고 싶어서 마음이 급해져요",
      ],
      sourcePhrases: ["LINE 返信 待てない", "好きな人 返信 遅い 不安", "告白 するべきか 待つべきか", "恋愛 焦る"],
      searchAliases: ["返信 待てない", "恋愛 焦る", "연락 기다림", "짝사랑 조급함"],
      cluster: "relationships/romantic-urgency",
    },
  ],
  "love/should-give-up": [
    {
      locale: "en-US",
      signal: "English source phrases ask whether persistence is love, hope, self-respect, or an inability to move on.",
      userDoors: [
        "계속 노력하는 게 사랑인지 내 자존감을 잃는 건지 모르겠어요",
        "포기하면 후회할까 봐 놓지도 못하고 있어요",
      ],
      sourcePhrases: [
        "should I give up on them",
        "should I keep trying or move on",
        "when to stop trying in a relationship",
        "fear of regretting giving up",
      ],
      searchAliases: ["give up on love", "move on", "holding on", "포기해야 할 때"],
      cluster: "relationships/letting-go",
    },
    {
      locale: "es-ES",
      signal: "Spanish source phrases often contrast seguir intentando with dejar ir, which is useful for cards about hope, regret, and dignity.",
      userDoors: [
        "붙잡는 게 희망인지 놓아주는 게 존중인지 헷갈려요",
      ],
      sourcePhrases: ["seguir intentando o dejar ir", "cuándo dejar de luchar por una relación", "debería rendirme con alguien", "miedo a arrepentirme de dejarlo"],
      searchAliases: ["dejar ir", "seguir intentando", "rendirme", "놓아주기"],
      cluster: "relationships/letting-go",
    },
  ],
  "debate/white-lie": [
    {
      locale: "es-ES",
      signal: "Spanish source phrases use mentiras piadosas, making the issue less abstract by tying it to kindness, harm, and relationships.",
      userDoors: [
        "상처를 줄까 봐 사실을 숨기는 게 배려인지 조작인지 모르겠어요",
        "좋은 의도라면 작은 거짓말은 괜찮은지 알고 싶어요",
      ],
      sourcePhrases: ["mentiras piadosas", "mentiras piadosas en pareja", "mentir para no hacer daño", "mentiras buenas debate"],
      searchAliases: ["mentiras piadosas", "white lies", "선의의 거짓말", "관계 거짓말"],
      cluster: "debate/white-lies",
    },
    {
      locale: "de-DE",
      signal: "German source phrases often center on Notlüge, a compact doorway into whether lying can be justified to protect someone.",
      userDoors: [
        "누군가를 보호하려는 거짓말도 원칙적으로 틀린 건지 궁금해요",
      ],
      sourcePhrases: ["notlüge erlaubt", "notlüge beziehung", "lügen um jemanden zu schützen", "notlüge moralisch"],
      searchAliases: ["Notlüge", "white lie", "거짓말 윤리", "진실 말하기"],
      cluster: "debate/white-lies",
    },
  ],
  "debate/retirement-age": [
    {
      locale: "fr-FR",
      signal: "French source phrases around retirement age strongly surface the public-policy conflict between longer work, pensions, and social fairness.",
      userDoors: [
        "정년연장이 고령층 생계 보호인지 다음 세대 기회 축소인지 알고 싶어요",
        "연금과 노동시장 현실을 같이 놓고 찬반을 보고 싶어요",
      ],
      sourcePhrases: ["reculer l'âge de la retraite", "âge légal de départ à la retraite débat", "travailler plus longtemps retraite", "réforme des retraites pour ou contre"],
      searchAliases: ["âge de la retraite", "réforme des retraites", "정년연장", "연금개혁"],
      cluster: "debate/retirement-age",
    },
    {
      locale: "de-DE",
      signal: "German source phrases often frame the debate through Renteneintrittsalter, pension sustainability, and whether longer working life is fair.",
      userDoors: [
        "더 오래 일하는 제도가 공정한지, 누가 비용을 지는지 궁금해요",
      ],
      sourcePhrases: ["renteneintrittsalter erhöhen", "rente mit 67 debatte", "länger arbeiten rente", "renteneintrittsalter pro contra"],
      searchAliases: ["Renteneintrittsalter", "Rente mit 67", "정년", "고령 노동"],
      cluster: "debate/retirement-age",
    },
  ],
  "debate/employment-contract": [
    {
      locale: "es-ES",
      signal: "Spanish source phrases connect contract status to precarity, temporary contracts, and the difference between temporary and permanent work.",
      userDoors: [
        "계약직 차별이 계약의 결과인지 구조적 불안정인지 구분하고 싶어요",
        "같은 일을 하는데 처우가 다른 게 어디까지 정당한지 알고 싶어요",
      ],
      sourcePhrases: ["contrato temporal o indefinido", "trabajador temporal derechos", "precariedad laboral contrato temporal", "contrato fijo o temporal debate"],
      searchAliases: ["contrato temporal", "precariedad laboral", "정규직 계약직", "동일노동"],
      cluster: "work/contract-precarity",
    },
    {
      locale: "de-DE",
      signal: "German source phrases emphasize fixed-term contracts, equal pay, and the border between labor flexibility and insecure work.",
      userDoors: [
        "고용 유연성이 필요하다는 말과 불안정 노동을 정당화한다는 말 사이를 보고 싶어요",
      ],
      sourcePhrases: ["befristeter arbeitsvertrag nachteile", "befristung oder festanstellung", "gleicher lohn für gleiche arbeit", "leiharbeit werkvertrag unterschied"],
      searchAliases: ["befristeter Vertrag", "Festanstellung", "equal pay", "고용 불안정"],
      cluster: "work/contract-precarity",
    },
  ],
  "debate/school-corporal-punishment": [
    {
      locale: "en-US",
      signal: "English source phrases usually enter through school discipline, effectiveness, and the ethics of corporal punishment in classrooms.",
      userDoors: [
        "학교 체벌이 실제로 교육 효과가 있는지, 아니면 폭력인지 근거로 보고 싶어요",
        "교실 질서와 학생 권리를 동시에 다루는 관점이 필요해요",
      ],
      sourcePhrases: [
        "school corporal punishment debate",
        "corporal punishment in schools pros and cons",
        "is school corporal punishment effective",
        "student discipline without punishment",
      ],
      searchAliases: ["school corporal punishment", "student discipline", "학교 체벌", "교육적 훈육"],
      cluster: "debate/school-discipline",
    },
    {
      locale: "zh-CN",
      signal: "Chinese source phrases often use student corporal punishment language together with debate and teacher-discipline concerns.",
      userDoors: [
        "체벌 금지와 교권 회복을 같은 문제로 봐도 되는지 궁금해요",
      ],
      sourcePhrases: ["体罚学生 争议", "学校体罚 是否应该", "教师惩戒权 体罚", "学生纪律 不体罚"],
      searchAliases: ["体罚学生", "教师惩戒权", "학생 징계", "체벌 찬반"],
      cluster: "debate/school-discipline",
    },
  ],
  "thought/good-life": [
    {
      locale: "ja-JP",
      signal: "Japanese source phrases ask how one should live and what to value in life, which maps well to the good-life node beyond simple happiness.",
      userDoors: [
        "어떻게 살아야 할지, 무엇을 중요하게 둬야 할지 기준이 흐릿해요",
        "좋은 삶이 행복만을 뜻하는 건지 알고 싶어요",
      ],
      sourcePhrases: ["どう生きるべきか", "人生 何を大切にする", "どう生きるべきか 哲学", "人生 どう生きるべきか"],
      searchAliases: ["どう生きるべきか", "良い人生", "좋은 삶", "삶의 기준"],
      cluster: "thought/good-life",
    },
    {
      locale: "de-DE",
      signal: "German source phrases use gutes Leben and wie soll man leben, making this node useful for philosophy-heavy search entry points.",
      userDoors: [
        "좋은 삶을 성취, 평온, 덕, 의미 중 무엇으로 봐야 할지 궁금해요",
      ],
      sourcePhrases: ["was ist ein gutes leben", "wie soll man leben", "was ist wichtig im leben", "sinn des lebens"],
      searchAliases: ["gutes Leben", "wie soll man leben", "삶의 의미", "좋은 삶"],
      cluster: "thought/good-life",
    },
  ],
  "thought/happiness": [
    {
      locale: "es-ES",
      signal: "Spanish source phrases move between definition, how to be happy, money, and the feeling of not being happy.",
      userDoors: [
        "행복이 감정인지 삶의 상태인지, 돈과 어떤 관계인지 알고 싶어요",
        "남들은 괜찮아 보이는데 나는 왜 행복하지 않은지 묻게 돼요",
      ],
      sourcePhrases: ["qué es la felicidad", "cómo ser feliz", "el dinero da la felicidad", "no me siento feliz"],
      searchAliases: ["felicidad", "ser feliz", "행복이란", "행복하지 않음"],
      cluster: "thought/happiness",
    },
    {
      locale: "fr-FR",
      signal: "French source phrases often pair bonheur with philosophy and money, keeping the card connected to both everyday worry and abstract thought.",
      userDoors: [
        "행복을 철학적으로도, 현실적으로도 같이 정리해보고 싶어요",
      ],
      sourcePhrases: ["qu'est-ce que le bonheur", "comment être heureux", "l'argent fait-il le bonheur", "qu'est-ce que le bonheur en philosophie"],
      searchAliases: ["bonheur", "être heureux", "행복 철학", "돈과 행복"],
      cluster: "thought/happiness",
    },
  ],
  "thought/success": [
    {
      locale: "zh-CN",
      signal: "Chinese source phrases ask what counts as success and whether success is required, which keeps social pressure visible in this thought node.",
      userDoors: [
        "성공해야 한다는 압박이 큰데, 무엇을 성공으로 봐야 하는지 모르겠어요",
        "성공과 행복이 다른 기준인지 정리하고 싶어요",
      ],
      sourcePhrases: ["成功是什么", "怎样才算成功", "成功和幸福的区别", "人生一定要成功吗"],
      searchAliases: ["成功是什么", "成功和幸福", "성공 기준", "성취 압박"],
      cluster: "thought/success",
    },
    {
      locale: "fr-FR",
      signal: "French source phrases use réussir sa vie, which shifts success from status alone to whether one has succeeded at life.",
      userDoors: [
        "남들이 말하는 성공이 아니라 내 삶을 잘 산다는 기준이 궁금해요",
      ],
      sourcePhrases: ["qu'est-ce que réussir sa vie", "peur de ne pas réussir", "réussite et bonheur différence", "faut-il réussir sa vie"],
      searchAliases: ["réussir sa vie", "réussite", "성공과 행복", "인생 성공"],
      cluster: "thought/success",
    },
  ],
  "debate/marriage": [
    {
      locale: "ja-JP",
      signal: "Japanese source phrases often connect marriage to regret, necessity, remaining single, and the pressure of timing.",
      userDoors: [
        "결혼하지 않으면 후회할까 봐 불안하지만, 꼭 해야 한다는 말도 답답해요",
        "혼자 사는 선택과 제도적 책임을 같이 비교하고 싶어요",
      ],
      sourcePhrases: ["結婚 しない 後悔", "結婚 必要ない", "結婚 するべきか", "独身 不安"],
      searchAliases: ["結婚 後悔", "独身 不安", "비혼 후회", "결혼 필요"],
      cluster: "debate/marriage",
    },
    {
      locale: "es-ES",
      signal: "Spanish source phrases ask whether marriage is necessary, whether one will regret not marrying, and what marriage means today.",
      userDoors: [
        "결혼이 아직 필요한 제도인지, 아니면 선택지 중 하나인지 알고 싶어요",
      ],
      sourcePhrases: ["es necesario casarse", "no quiero casarme", "me arrepentiré de no casarme", "matrimonio hoy en día"],
      searchAliases: ["casarse", "matrimonio", "no quiero casarme", "결혼 제도"],
      cluster: "debate/marriage",
    },
  ],
};

function normalizeKey(key) {
  return String(key || "").replace(/^\//, "");
}

function unique(values) {
  return [...new Set(values.filter(Boolean).map((value) => String(value).trim()).filter(Boolean))];
}

function manualSourceLocaleInsightsForKey(key) {
  return sourceLocaleInsights[normalizeKey(key)] || [];
}

function strongestLocaleRows(signal) {
  return [...(signal?.locales || [])]
    .filter((locale) => locale.usableCount > 0 && locale.topPhrases?.length > 0)
    .sort(
      (a, b) =>
        b.usableCount - a.usableCount ||
        b.candidateCount - a.candidateCount ||
        String(a.locale).localeCompare(String(b.locale))
    );
}

function phraseListText(phrases) {
  const hits = unique(phrases).slice(0, 3);
  if (hits.length <= 1) return hits[0] || "";
  if (hits.length === 2) return `"${hits[0]}" and "${hits[1]}"`;
  return `"${hits[0]}", "${hits[1]}", and "${hits[2]}"`;
}

function generatedSourceLocaleInsightsForKey(key) {
  const signal = sourceLocaleSignalForKey(key);
  if (!signal) return [];

  return strongestLocaleRows(signal)
    .slice(0, GENERATED_INSIGHT_LIMIT)
    .map((locale) => {
      const sourcePhrases = unique(locale.topPhrases).slice(0, 5);
      const localeName = sourceLocaleDisplayName(locale.locale);
      const phraseText = phraseListText(sourcePhrases);

      return {
        locale: locale.locale,
        signal: `${localeName} source phrases repeatedly enter this topic through ${phraseText}.`,
        userDoors: [
          `${localeName}권에서는 "${sourcePhrases[0]}" 같은 표현으로 이 고민을 찾는 흐름이 보입니다.`,
        ],
        sourcePhrases,
        searchAliases: sourcePhrases.slice(0, 4),
        cluster: `source-signal/${signal.key}`,
        generated: true,
      };
    });
}

export function sourceLocaleInsightsForKey(key) {
  const manual = manualSourceLocaleInsightsForKey(key);
  if (manual.length > 0) return manual;
  return generatedSourceLocaleInsightsForKey(key);
}

export function sourceLocaleUserDoorsForKey(key) {
  return unique(manualSourceLocaleInsightsForKey(key).flatMap((insight) => insight.userDoors || []));
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
