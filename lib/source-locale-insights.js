import { sourceLocaleDisplayName, sourceLocaleSignalForKey } from "./source-locale-signals.js";

const GENERATED_INSIGHT_LIMIT = 2;
const sourceLocaleKoreanLabels = {
  "ja-JP": "일본어권",
  "zh-CN": "중국어권",
  "es-ES": "스페인어권",
  "fr-FR": "프랑스어권",
  "de-DE": "독일어권",
};

const curatedSourceLocaleInsights = {
  "work/dont-want-to": [
    {
      locale: "ja-JP",
      signal: "Japanese searches frame the problem as not wanting to go to work or not being able to act even though one must.",
      userDoors: [
        "일이 싫다는 감정이 게으름인지 한계 신호인지 구분하고 싶을 때 들어오는 표현입니다.",
        "아침마다 회사에 가기 싫고, 해야 하는데 몸이 움직이지 않는 상태를 찾고 있습니다.",
      ],
      sourcePhrases: [
        "仕事 行きたくない",
        "仕事 やる気が出ない",
        "会社 行きたくない",
        "やらなきゃいけないのにできない",
      ],
      searchAliases: ["일 가기 싫음", "하기 싫은데 해야 함", "무기력", "仕事 行きたくない"],
      cluster: "work/avoidance-vs-burnout",
    },
    {
      locale: "fr-FR",
      signal: "French source phrases lean toward loss of will, saturation with work, and asking what to do when motivation disappears.",
      userDoors: [
        "프랑스어권에서는 일 자체보다 '더는 일하러 가고 싶지 않다'는 탈진감으로 이 주제를 찾습니다.",
      ],
      sourcePhrases: [
        "je n'ai pas envie de travailler",
        "je ne veux plus aller au travail",
        "marre de travailler",
        "travailler sans motivation",
      ],
      searchAliases: ["업무 의욕 없음", "marre de travailler", "no motivation work", "일 권태"],
      cluster: "work/motivation-collapse",
    },
  ],
  "body/insomnia": [
    {
      locale: "es-ES",
      signal: "Spanish phrases connect insomnia with anxiety and the helpless loop of wanting to sleep but being unable to.",
      userDoors: [
        "잠을 자고 싶은데 못 자는 답답함과 불안이 서로 키워질 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "no puedo dormir",
        "insomnio por ansiedad",
        "quiero dormir y no puedo",
        "me despierto con ansiedad",
      ],
      searchAliases: ["불면증", "불안해서 잠 안 옴", "no puedo dormir", "insomnio por ansiedad"],
      cluster: "body/sleep-anxiety-loop",
    },
    {
      locale: "ja-JP",
      signal: "Japanese source phrases describe sleeplessness as painful worry, especially at night when anxiety becomes louder.",
      userDoors: [
        "밤에 걱정이 커지고, 자려고 할수록 잠이 더 멀어지는 상태를 찾고 있습니다.",
      ],
      sourcePhrases: [
        "眠れない 悩み",
        "不眠 つらい",
        "寝たいのに眠れない",
        "夜 不安 眠れない",
      ],
      searchAliases: ["잠 못 잠", "밤 불안", "眠れない", "不眠 つらい"],
      cluster: "body/night-worry",
    },
  ],
  "meaning/no-motivation": [
    {
      locale: "ja-JP",
      signal: "Japanese searches phrase this as wanting to do nothing, being unable to try, and feeling painfully drained.",
      userDoors: [
        "아무것도 하기 싫은 마음이 단순 휴식 욕구인지 무기력인지 구분하고 싶을 때 들어옵니다.",
      ],
      sourcePhrases: [
        "何もしたくない",
        "やる気が出ない",
        "無気力 つらい",
        "頑張れない",
      ],
      searchAliases: ["아무것도 하기 싫음", "무기력", "何もしたくない", "やる気が出ない"],
      cluster: "meaning/apathy-fatigue",
    },
    {
      locale: "fr-FR",
      signal: "French source phrases emphasize having desire for nothing, loss of motivation, and no energy to act.",
      userDoors: [
        "하고 싶은 게 사라지고 무엇에도 흥미가 붙지 않는 상태를 찾는 흐름입니다.",
      ],
      sourcePhrases: [
        "je n'ai envie de rien",
        "perte de motivation",
        "rien ne m'intéresse",
        "pas d'énergie pour agir",
      ],
      searchAliases: ["의욕 없음", "흥미 없음", "je n'ai envie de rien", "perte de motivation"],
      cluster: "meaning/loss-of-desire",
    },
  ],
  "self-esteem/low-self-esteem": [
    {
      locale: "es-ES",
      signal: "Spanish phrases directly name low self-esteem, insufficiency, dislike of oneself, and the search for confidence.",
      userDoors: [
        "내가 부족하고 마음에 들지 않는다는 감각을 자신감 회복의 질문으로 바꾸려는 입구입니다.",
      ],
      sourcePhrases: [
        "tengo baja autoestima",
        "me siento insuficiente",
        "no me gusto a mí mismo",
        "cómo tener más confianza",
      ],
      searchAliases: ["자존감 낮음", "자신감", "baja autoestima", "me siento insuficiente"],
      cluster: "self-esteem/insufficiency",
    },
    {
      locale: "fr-FR",
      signal: "French source phrases move between lack of self-esteem, feeling worthless, and not being able to like oneself.",
      userDoors: [
        "가치 없음과 자기혐오가 섞일 때, 이 카드가 감정을 분리해 읽는 입구가 됩니다.",
      ],
      sourcePhrases: [
        "manque d'estime de soi",
        "je ne vaux rien",
        "je ne m'aime pas",
        "comment avoir confiance en soi",
      ],
      searchAliases: ["자존감", "나를 싫어함", "manque d'estime de soi", "je ne vaux rien"],
      cluster: "self-esteem/worth-and-confidence",
    },
  ],
  "breakup/lingering": [
    {
      locale: "fr-FR",
      signal: "French searches frame lingering attachment as not being able to forget an ex or turn the page after a breakup.",
      userDoors: [
        "끝난 관계를 머리로는 아는데 마음이 아직 페이지를 넘기지 못할 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "je n'arrive pas à oublier mon ex",
        "surmonter une rupture",
        "penser encore à son ex",
        "comment tourner la page",
      ],
      searchAliases: ["전 애인 못 잊음", "미련", "oublier mon ex", "tourner la page"],
      cluster: "breakup/not-turning-page",
    },
    {
      locale: "es-ES",
      signal: "Spanish phrases combine not forgetting an ex, not being able to let go, and asking how to get over a breakup.",
      userDoors: [
        "잊어야 한다는 압박보다, 아직 놓지 못하는 마음을 다루고 싶을 때 들어옵니다.",
      ],
      sourcePhrases: [
        "no puedo olvidar a mi ex",
        "cómo superar una ruptura",
        "sigo pensando en mi ex",
        "no puedo soltar a mi ex",
      ],
      searchAliases: ["미련 못 버림", "no puedo olvidar a mi ex", "superar ruptura", "전 애인 생각"],
      cluster: "breakup/letting-go",
    },
  ],
  "meaning/dont-know-want": [
    {
      locale: "fr-FR",
      signal: "French source phrases ask what one wants and what to do with life, often alongside loss of desire.",
      userDoors: [
        "원하는 게 없는 것인지, 원하는 것을 아직 발견하지 못한 것인지 헷갈릴 때 들어오는 질문입니다.",
      ],
      sourcePhrases: [
        "je ne sais pas ce que je veux",
        "je ne sais pas quoi faire de ma vie",
        "je n'ai envie de rien",
        "comment savoir ce que je veux",
      ],
      searchAliases: ["내가 뭘 원하는지 모름", "ce que je veux", "quoi faire de ma vie", "삶 방향"],
      cluster: "meaning/desire-clarity",
    },
    {
      locale: "es-ES",
      signal: "Spanish phrases connect not knowing what one wants with life direction and the practical question of what to do next.",
      userDoors: [
        "인생 전체가 막막할 때, 당장 정답보다 다음 선택의 단서를 찾으려는 입구입니다.",
      ],
      sourcePhrases: [
        "no sé qué quiero en la vida",
        "no sé qué hacer con mi vida",
        "no tengo ganas de nada",
        "cómo saber lo que quiero",
      ],
      searchAliases: ["인생에서 원하는 것", "no sé qué quiero", "qué hacer con mi vida", "진로 막막"],
      cluster: "meaning/life-direction",
    },
  ],
  "thought/freedom": [
    {
      locale: "es-ES",
      signal: "Spanish phrases place freedom beside responsibility, self-expression, and the wish to live freely.",
      userDoors: [
        "자유를 단순히 마음대로 하는 것인지, 책임과 함께 사는 것인지 묻는 생각 입구입니다.",
      ],
      sourcePhrases: [
        "qué es la libertad",
        "quiero vivir libre",
        "libertad y responsabilidad",
        "cómo ser yo mismo",
      ],
      searchAliases: ["자유란 무엇인가", "libertad", "자기답게 살기", "responsibility"],
      cluster: "thought/freedom-and-responsibility",
    },
    {
      locale: "de-DE",
      signal: "German source phrases ask what freedom is while tying it to living freely, responsibility, and being oneself.",
      userDoors: [
        "내가 나답게 사는 자유와 관계 속 책임이 어디서 만나는지 궁금할 때 들어옵니다.",
      ],
      sourcePhrases: [
        "was ist freiheit",
        "frei leben wollen",
        "freiheit und verantwortung",
        "ich selbst sein",
      ],
      searchAliases: ["자유", "was ist freiheit", "frei leben", "ich selbst sein"],
      cluster: "thought/autonomy",
    },
  ],
  "meaning/fear-death": [
    {
      locale: "fr-FR",
      signal: "French searches name fear of death, death anxiety, and repetitive thoughts about death.",
      userDoors: [
        "죽음 생각이 자꾸 떠오르고 멈추지 않을 때, 공포를 철학적 질문과 불안 관리로 나누는 입구입니다.",
      ],
      sourcePhrases: [
        "peur de la mort",
        "angoisse de mort",
        "penser à la mort tout le temps",
        "peur de perdre ses parents",
      ],
      searchAliases: ["죽음 공포", "죽음 불안", "peur de la mort", "angoisse de mort"],
      cluster: "meaning/death-anxiety",
    },
    {
      locale: "es-ES",
      signal: "Spanish phrases combine fear of death with anxiety, thoughts of dying, and fear of losing parents.",
      userDoors: [
        "나의 죽음뿐 아니라 가까운 사람을 잃을 수 있다는 불안까지 함께 묶이는 주제입니다.",
      ],
      sourcePhrases: [
        "miedo a la muerte",
        "ansiedad por la muerte",
        "pienso mucho en morir",
        "miedo a perder a mis padres",
      ],
      searchAliases: ["죽음이 두려움", "miedo a la muerte", "ansiedad por la muerte", "상실 불안"],
      cluster: "meaning/mortality-and-loss",
    },
  ],
  "debate/abortion": [
    {
      locale: "de-DE",
      signal: "German debate phrases explicitly set abortion as pro/con conflict between the right to abortion, unborn life, and self-determination.",
      userDoors: [
        "권리와 생명, 자기결정권이 어디서 충돌하는지 찬반 구조로 보고 싶을 때 들어오는 논쟁입니다.",
      ],
      sourcePhrases: [
        "abtreibung debatte",
        "abtreibung pro contra",
        "recht auf abtreibung",
        "ungeborenes leben selbstbestimmung",
      ],
      searchAliases: ["낙태 논쟁", "abtreibung", "pro contra", "자기결정권"],
      cluster: "debate/abortion-rights-vs-life",
    },
    {
      locale: "es-ES",
      signal: "Spanish phrases frame abortion through debate, support and opposition, rights, fetal life, and women's autonomy.",
      userDoors: [
        "여성의 자율성과 태아 생명이라는 기준이 어떻게 부딪히는지 정리하려는 입구입니다.",
      ],
      sourcePhrases: [
        "aborto debate",
        "aborto a favor y en contra",
        "derecho al aborto",
        "vida fetal autonomía mujer",
      ],
      searchAliases: ["aborto debate", "derecho al aborto", "낙태 허용", "생명권"],
      cluster: "debate/autonomy-and-fetal-life",
    },
  ],
  "work/workplace-relationships": [
    {
      locale: "de-DE",
      signal: "German phrases focus on difficult coworkers, toxic workplace climate, conflicts at work, and social anxiety at work.",
      userDoors: [
        "일 자체보다 사람 때문에 소진되는 상황을 직장 환경 문제로 정리하고 싶을 때 들어옵니다.",
      ],
      sourcePhrases: [
        "schwierige kollegen",
        "toxisches arbeitsklima",
        "konflikte am arbeitsplatz",
        "soziale angst bei der arbeit",
      ],
      searchAliases: ["직장 인간관계", "toxisches arbeitsklima", "동료 갈등", "직장 분위기"],
      cluster: "work/toxic-climate",
    },
    {
      locale: "fr-FR",
      signal: "French source phrases describe difficult work relationships, toxic colleagues, toxic atmosphere, and coworker conflicts.",
      userDoors: [
        "직장 관계가 힘든 이유를 성격 탓만이 아니라 구조와 분위기까지 같이 보려는 흐름입니다.",
      ],
      sourcePhrases: [
        "relations difficiles au travail",
        "collègues toxiques",
        "ambiance de travail toxique",
        "conflits avec collègues",
      ],
      searchAliases: ["relations difficiles au travail", "collègues toxiques", "직장 동료", "갈등"],
      cluster: "work/coworker-conflict",
    },
  ],
  "meaning/emptiness": [
    {
      locale: "es-ES",
      signal: "Spanish phrases describe inner emptiness, existential emptiness, and the feeling that nothing fills the person.",
      userDoors: [
        "삶에 아무것도 없는 것 같기보다, 무엇을 해도 채워지지 않는 느낌을 찾는 입구입니다.",
      ],
      sourcePhrases: [
        "siento vacío por dentro",
        "vacío existencial",
        "nada me llena",
        "me siento vacío sin razón",
      ],
      searchAliases: ["공허함", "vacío existencial", "nada me llena", "허무"],
      cluster: "meaning/existential-emptiness",
    },
    {
      locale: "fr-FR",
      signal: "French searches name feeling empty, existential emptiness, and a lack of inner fulfillment.",
      userDoors: [
        "감정이 사라진 듯한 빈자리와 삶의 의미 질문이 겹칠 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "je me sens vide",
        "vide existentiel",
        "rien ne me remplit",
        "sentiment de vide intérieur",
      ],
      searchAliases: ["je me sens vide", "vide existentiel", "내면 공허", "삶 허무"],
      cluster: "meaning/inner-void",
    },
  ],
  "self-esteem/self-hate": [
    {
      locale: "ja-JP",
      signal: "Japanese phrases directly express self-dislike, painful self-hatred, self-blame, and not being able to like oneself.",
      userDoors: [
        "나를 싫어하는 마음이 너무 커져서 스스로를 계속 탓할 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "自分が嫌い",
        "自己嫌悪 つらい",
        "自分を責めてしまう",
        "自分を好きになれない",
      ],
      searchAliases: ["나를 싫어함", "자기혐오", "自分が嫌い", "自己嫌悪"],
      cluster: "self-esteem/self-dislike",
    },
    {
      locale: "es-ES",
      signal: "Spanish phrases turn self-hate into a practical question about how to stop hating oneself.",
      userDoors: [
        "자기혐오를 그냥 견디는 데서 멈추지 않고, 멈추는 방법을 찾고 싶을 때 들어옵니다.",
      ],
      sourcePhrases: [
        "me odio a mí mismo",
        "no puedo quererme",
        "me culpo por todo",
        "cómo dejar de odiarme",
      ],
      searchAliases: ["me odio a mí mismo", "자기비난", "나를 사랑하지 못함", "자기혐오 멈추기"],
      cluster: "self-esteem/stop-self-hate",
    },
  ],
  "debate/death-penalty": [
    {
      locale: "fr-FR",
      signal: "French debate phrases emphasize pro/con arguments, abolition, and the risk of judicial error.",
      userDoors: [
        "사형제가 응보인지, 오판 가능성을 감수할 수 없는 제도인지 정리하려는 입구입니다.",
      ],
      sourcePhrases: [
        "peine de mort débat",
        "peine de mort pour ou contre",
        "abolition peine de mort",
        "erreur judiciaire peine de mort",
      ],
      searchAliases: ["사형제 논쟁", "peine de mort", "오판", "abolition"],
      cluster: "debate/death-penalty-abolition",
    },
    {
      locale: "es-ES",
      signal: "Spanish phrases set the death penalty debate around support, opposition, abolition, and wrongful convictions.",
      userDoors: [
        "강한 처벌 요구와 국가가 되돌릴 수 없는 실수를 할 위험을 같이 보려는 논쟁입니다.",
      ],
      sourcePhrases: [
        "pena de muerte debate",
        "pena de muerte a favor y en contra",
        "abolir la pena de muerte",
        "pena de muerte errores judiciales",
      ],
      searchAliases: ["pena de muerte", "사형제 찬반", "오판 위험", "abolir"],
      cluster: "debate/punishment-vs-error",
    },
  ],
  "work/burnout": [
    {
      locale: "fr-FR",
      signal: "French phrases ask what to do about burnout and describe professional exhaustion and no energy left for work.",
      userDoors: [
        "일을 더 잘하는 법보다, 이미 소진된 상태에서 어떻게 멈추고 회복할지 찾는 입구입니다.",
      ],
      sourcePhrases: [
        "burn out que faire",
        "épuisement professionnel",
        "je suis épuisé par le travail",
        "plus d'énergie au travail",
      ],
      searchAliases: ["번아웃", "burn out que faire", "épuisement professionnel", "업무 소진"],
      cluster: "work/professional-exhaustion",
    },
    {
      locale: "ja-JP",
      signal: "Japanese searches link burnout to work limits, exhaustion, and not being able to try anymore.",
      userDoors: [
        "노력 부족이 아니라 한계에 도달한 것인지 확인하고 싶을 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "燃え尽き症候群 仕事",
        "仕事 疲れた 限界",
        "何もしたくない 仕事",
        "頑張れない 仕事",
      ],
      searchAliases: ["번아웃", "仕事 疲れた 限界", "燃え尽き症候群", "일 한계"],
      cluster: "work/limit-and-collapse",
    },
  ],
  "meaning/no-goal": [
    {
      locale: "es-ES",
      signal: "Spanish phrases frame the issue as having no goals, no dreams, and needing a way to find a goal.",
      userDoors: [
        "목표가 없다는 사실을 실패가 아니라 다음 기준을 찾는 질문으로 바꾸려는 입구입니다.",
      ],
      sourcePhrases: [
        "no tengo metas en la vida",
        "no sé cuál es mi objetivo",
        "no tengo sueños",
        "cómo encontrar una meta",
      ],
      searchAliases: ["목표 없음", "no tengo metas", "no tengo sueños", "삶의 목표"],
      cluster: "meaning/goallessness",
    },
    {
      locale: "fr-FR",
      signal: "French searches ask how to find a purpose when there is no objective, dream, or target.",
      userDoors: [
        "무언가를 향해 가야 한다는 압박과 아직 겨냥할 것이 없다는 현실 사이에서 들어옵니다.",
      ],
      sourcePhrases: [
        "je n'ai pas d'objectif dans la vie",
        "comment trouver un but",
        "je n'ai pas de rêve",
        "je ne sais pas quoi viser",
      ],
      searchAliases: ["but dans la vie", "목적 없음", "꿈 없음", "comment trouver un but"],
      cluster: "meaning/purpose-search",
    },
  ],
  "debate/euthanasia": [
    {
      locale: "es-ES",
      signal: "Spanish debate phrases organize euthanasia around pro/con arguments and the right to die with dignity.",
      userDoors: [
        "고통 완화와 생명 보호가 충돌할 때, 존엄하게 죽을 권리라는 언어로 들어오는 논쟁입니다.",
      ],
      sourcePhrases: [
        "eutanasia debate",
        "eutanasia a favor y en contra",
        "derecho a morir dignamente",
        "eutanasia debate a favor",
      ],
      searchAliases: ["안락사 논쟁", "eutanasia", "morir dignamente", "존엄사"],
      cluster: "debate/dignified-death",
    },
    {
      locale: "fr-FR",
      signal: "French phrases connect euthanasia debate with legalization and the right to die in dignity.",
      userDoors: [
        "법제화 여부와 개인의 고통, 의료 윤리를 함께 정리하려는 입구입니다.",
      ],
      sourcePhrases: [
        "euthanasie débat",
        "euthanasie pour ou contre",
        "droit de mourir dans la dignité",
        "légalisation de l'euthanasie",
      ],
      searchAliases: ["euthanasie", "안락사 허용", "droit de mourir", "의료 윤리"],
      cluster: "debate/legalization-and-dignity",
    },
  ],
  "relationships/cant-say-no": [
    {
      locale: "de-DE",
      signal: "German phrases connect not saying no with fear of disappointing others, boundary setting, and people pleasing.",
      userDoors: [
        "거절을 못하는 문제가 착함이 아니라 경계 설정의 어려움인지 확인하려는 입구입니다.",
      ],
      sourcePhrases: [
        "ich kann nicht nein sagen",
        "angst andere zu enttäuschen",
        "grenzen setzen lernen",
        "people pleasing deutsch",
      ],
      searchAliases: ["거절 못함", "ich kann nicht nein sagen", "grenzen setzen", "people pleasing"],
      cluster: "relationships/boundaries",
    },
    {
      locale: "fr-FR",
      signal: "French searches emphasize not managing to say no, fear of disappointing others, and learning to set limits.",
      userDoors: [
        "상대를 실망시키기 싫어서 내 한계를 계속 미루는 상태를 찾고 있습니다.",
      ],
      sourcePhrases: [
        "je n'arrive pas à dire non",
        "peur de décevoir les autres",
        "poser des limites",
        "trop gentil avec les autres",
      ],
      searchAliases: ["je n'arrive pas à dire non", "한계 설정", "착해서 손해", "실망시키기 두려움"],
      cluster: "relationships/fear-of-disappointing",
    },
  ],
  "love/relationship-boredom": [
    {
      locale: "ja-JP",
      signal: "Japanese phrases frame relationship boredom as a stagnant phase, fading feelings, and wondering how to get through it.",
      userDoors: [
        "사랑이 끝난 것인지, 권태기를 지나가는 과정인지 구분하고 싶을 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "倦怠期 乗り越え方",
        "恋愛 冷めたかも",
        "彼氏 ときめかない",
        "関係 マンネリ",
      ],
      searchAliases: ["권태기", "연애 식음", "倦怠期", "恋愛 冷めたかも"],
      cluster: "love/stagnation",
    },
    {
      locale: "fr-FR",
      signal: "French source phrases describe couple routine, emotional numbness, couple crisis, and boredom inside the relationship.",
      userDoors: [
        "관계의 루틴이 편안함인지, 감정이 사라지는 신호인지 묻는 입구입니다.",
      ],
      sourcePhrases: [
        "routine dans le couple",
        "je ne ressens plus rien couple",
        "crise de couple que faire",
        "ennui dans la relation",
      ],
      searchAliases: ["routine dans le couple", "연애 현타", "관계 권태", "couple crisis"],
      cluster: "love/routine-and-numbness",
    },
  ],
  "body/body-anxiety": [
    {
      locale: "fr-FR",
      signal: "French phrases describe hating one's body, physical complexes, appearance anxiety, and not liking one's appearance.",
      userDoors: [
        "몸 자체보다 내 몸을 보는 시선이 너무 가혹해졌을 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "je déteste mon corps",
        "complexe physique",
        "anxiété liée à l'apparence",
        "je n'aime pas mon apparence",
      ],
      searchAliases: ["외모 콤플렉스", "몸이 싫음", "je déteste mon corps", "complexe physique"],
      cluster: "body/appearance-anxiety",
    },
    {
      locale: "es-ES",
      signal: "Spanish searches connect hating one's body with insecurity, physical complexes, and anxiety about appearance.",
      userDoors: [
        "외모 불안을 단순 미용 고민이 아니라 자기평가의 고통으로 정리하려는 입구입니다.",
      ],
      sourcePhrases: [
        "odio mi cuerpo",
        "inseguridad con mi cuerpo",
        "complejo físico",
        "ansiedad por mi apariencia",
      ],
      searchAliases: ["odio mi cuerpo", "몸 불안", "complejo físico", "외모 불안"],
      cluster: "body/body-image",
    },
  ],
  "body/health-anxiety": [
    {
      locale: "ja-JP",
      signal: "Japanese phrases describe illness anxiety, health worry, checking bodily condition too much, and fear that one may be sick.",
      userDoors: [
        "작은 증상이 큰 병의 증거처럼 느껴지고 계속 확인하게 될 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "病気 不安",
        "健康 不安",
        "体調 気にしすぎ",
        "病気かも 不安",
      ],
      searchAliases: ["건강염려증", "病気 不安", "体調 気にしすぎ", "질병 불안"],
      cluster: "body/illness-worry",
    },
    {
      locale: "es-ES",
      signal: "Spanish phrases explicitly name health anxiety, fear of illness, hypochondria, and symptoms of health anxiety.",
      userDoors: [
        "건강 정보를 더 볼수록 안심보다 불안이 커지는 사람에게 맞는 입구입니다.",
      ],
      sourcePhrases: [
        "ansiedad por la salud",
        "miedo a tener una enfermedad",
        "hipocondría qué hacer",
        "ansiedad por la salud sintomas",
      ],
      searchAliases: ["ansiedad por la salud", "hipocondría", "건강 불안", "질병 공포"],
      cluster: "body/health-anxiety",
    },
  ],
};

const expandedCuratedSourceLocaleInsights = {
  "breakup/reunion": [
    {
      locale: "es-ES",
      signal: "Spanish phrases ask whether to return to an ex while naming the fear of repeating the same relationship pattern.",
      userDoors: [
        "다시 만나고 싶은 마음과 같은 실수를 반복할까 봐 두려운 마음이 같이 있을 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "volver con mi ex o no",
        "debería volver con mi ex",
        "miedo a repetir lo mismo con mi ex",
        "reconciliación con ex",
      ],
      searchAliases: ["재회 고민", "volver con mi ex", "전 애인 다시 만나기", "반복 두려움"],
      cluster: "breakup/reunion-risk",
    },
    {
      locale: "fr-FR",
      signal: "French source phrases frame reunion as a practical question of whether returning is a good idea after the same mistakes.",
      userDoors: [
        "재회가 사랑의 회복인지, 익숙한 상처로 돌아가는 것인지 따져보고 싶을 때 들어옵니다.",
      ],
      sourcePhrases: [
        "dois-je retourner avec mon ex",
        "reprendre avec son ex bonne idée",
        "peur de refaire les mêmes erreurs",
        "se remettre avec son ex",
      ],
      searchAliases: ["dois-je retourner avec mon ex", "재회해야 하나", "same mistakes", "ex reunion"],
      cluster: "breakup/return-or-repeat",
    },
  ],
  "love/attachment-anxiety": [
    {
      locale: "fr-FR",
      signal: "French phrases tie anxious attachment to abandonment fear, emotional dependency, and needing reassurance in a couple.",
      userDoors: [
        "사랑보다 버려질까 봐 확인받고 싶은 마음이 더 커질 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "peur de l'abandon en couple",
        "dépendance affective",
        "anxiété relationnelle",
        "besoin d'être rassuré couple",
      ],
      searchAliases: ["불안형 애착", "peur de l'abandon", "dépendance affective", "확인 욕구"],
      cluster: "love/abandonment-fear",
    },
    {
      locale: "ja-JP",
      signal: "Japanese searches express relationship anxiety through fear when a partner does not contact back and a wish to stop dependency.",
      userDoors: [
        "연락이 없으면 곧 버려지는 것처럼 느껴지고, 의존을 줄이고 싶을 때 들어옵니다.",
      ],
      sourcePhrases: [
        "恋愛 不安になる",
        "見捨てられ不安 恋愛",
        "恋人 連絡ない 不安",
        "恋愛 依存 やめたい",
      ],
      searchAliases: ["연애 불안", "見捨てられ不安", "연락 불안", "恋愛 依存"],
      cluster: "love/contact-and-dependency",
    },
  ],
  "breakup/ex-contact": [
    {
      locale: "es-ES",
      signal: "Spanish phrases describe contact from an ex as destabilizing and ask what to do when the ex writes again.",
      userDoors: [
        "전 애인의 연락 하나에 마음이 흔들리고, 답장해야 할지 멈춰야 할지 모를 때 들어옵니다.",
      ],
      sourcePhrases: [
        "mi ex me escribió qué hago",
        "contacto de mi ex me desestabiliza",
        "ex vuelve a escribir",
        "qué hacer si mi ex me busca",
      ],
      searchAliases: ["전 애인 연락", "mi ex me escribió", "ex contact", "답장 고민"],
      cluster: "breakup/ex-contact-destabilizes",
    },
    {
      locale: "de-DE",
      signal: "German searches ask what to do when an ex gets in touch and the message throws the person off balance.",
      userDoors: [
        "이미 정리했다고 생각했는데 연락 한 번으로 다시 무너질 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "ex meldet sich was tun",
        "nachricht vom ex bringt mich durcheinander",
        "ex schreibt wieder",
        "was tun wenn ex kontakt sucht",
      ],
      searchAliases: ["ex meldet sich", "전 애인 연락 대처", "마음 흔들림", "ex writes again"],
      cluster: "breakup/ex-message",
    },
  ],
  "work/job-change": [
    {
      locale: "fr-FR",
      signal: "French phrases put job change between staying, resigning, fear, and career conversion doubt.",
      userDoors: [
        "이직이 도망인지 필요한 전환인지 구분하고 싶을 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "changer de travail ou rester",
        "peur de changer de travail",
        "démissionner ou pas",
        "reconversion professionnelle doute",
      ],
      searchAliases: ["이직 고민", "changer de travail", "démissionner ou pas", "커리어 전환"],
      cluster: "work/stay-or-change",
    },
    {
      locale: "ja-JP",
      signal: "Japanese searches frame job change as hesitation, anxiety, fear of changing work, and doubt about staying as is.",
      userDoors: [
        "지금 일을 계속해도 되는지, 바꾸기엔 무서운지 사이에서 들어오는 질문입니다.",
      ],
      sourcePhrases: [
        "転職 迷う",
        "転職 不安",
        "仕事 変えたい 怖い",
        "このままの仕事でいいのか",
      ],
      searchAliases: ["転職 迷う", "이직 불안", "仕事 変えたい", "지금 일 계속"],
      cluster: "work/career-hesitation",
    },
  ],
  "work/work-skepticism": [
    {
      locale: "fr-FR",
      signal: "French source phrases ask why work, name loss of meaning, and describe work as no longer meaningful.",
      userDoors: [
        "일이 힘든 것을 넘어 왜 이 일을 해야 하는지 설득되지 않을 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "mon travail n'a pas de sens",
        "pourquoi travailler",
        "je ne trouve plus de sens au travail",
        "perte de sens professionnel",
      ],
      searchAliases: ["일에 회의감", "sens au travail", "pourquoi travailler", "업무 의미"],
      cluster: "work/loss-of-meaning",
    },
    {
      locale: "es-ES",
      signal: "Spanish phrases connect work skepticism to a lack of purpose and the blunt question of why to work.",
      userDoors: [
        "노동의 의미와 내 일의 목적이 동시에 흔들릴 때 들어오는 주제입니다.",
      ],
      sourcePhrases: [
        "mi trabajo no tiene sentido",
        "para qué trabajar",
        "no encuentro sentido en mi trabajo",
        "falta de propósito laboral",
      ],
      searchAliases: ["일 의미 없음", "para qué trabajar", "propósito laboral", "직업 회의감"],
      cluster: "work/purpose-gap",
    },
  ],
  "meaning/wandering": [
    {
      locale: "es-ES",
      signal: "Spanish phrases describe being lost in life, not knowing where one is going, and feeling adrift.",
      userDoors: [
        "방향 없이 떠도는 느낌이 크고, 어디로 가야 할지 모를 때 들어옵니다.",
      ],
      sourcePhrases: [
        "estoy perdido en la vida",
        "no sé hacia dónde voy",
        "me siento perdido",
        "estoy a la deriva",
      ],
      searchAliases: ["방황", "estoy perdido", "a la deriva", "삶 방향"],
      cluster: "meaning/lost-in-life",
    },
    {
      locale: "ja-JP",
      signal: "Japanese searches phrase wandering as being lost in life, not knowing what one is doing, and uncertainty about the future.",
      userDoors: [
        "움직이고는 있지만 내가 무엇을 하는지 모르겠을 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "人生 迷子",
        "何をしているかわからない",
        "将来 迷っている",
        "生き方に迷う",
      ],
      searchAliases: ["人生 迷子", "방향 잃음", "将来 迷っている", "삶의 방식"],
      cluster: "meaning/life-lost",
    },
  ],
  "breakup/should-contact": [
    {
      locale: "de-DE",
      signal: "German phrases ask whether to write to an ex, contact after breakup, and what to do when the desire to return appears.",
      userDoors: [
        "연락하고 싶은 충동이 관계 회복인지 상실 불안을 달래려는 것인지 구분하고 싶을 때 들어옵니다.",
      ],
      sourcePhrases: [
        "soll ich meinem ex schreiben",
        "ex kontaktieren nach trennung",
        "ich will meinen ex zurück",
        "ex meldet sich was tun",
      ],
      searchAliases: ["전 애인 연락할까", "soll ich meinem ex schreiben", "ex kontaktieren", "재회 충동"],
      cluster: "breakup/contact-urge",
    },
    {
      locale: "fr-FR",
      signal: "French source phrases ask whether to recontact an ex and how to handle the urge to write after a breakup.",
      userDoors: [
        "연락을 보내기 전, 내가 원하는 것이 답장인지 관계 회복인지 확인하려는 입구입니다.",
      ],
      sourcePhrases: [
        "dois-je recontacter mon ex",
        "envie d'écrire à mon ex",
        "reprendre contact après rupture",
        "mon ex m'a écrit que faire",
      ],
      searchAliases: ["dois-je recontacter mon ex", "다시 연락", "envie d'écrire", "이별 후 연락"],
      cluster: "breakup/recontact",
    },
  ],
  "self-esteem/comparing": [
    {
      locale: "fr-FR",
      signal: "French phrases connect comparison with social networks, jealousy of others' success, and wanting to stop comparing.",
      userDoors: [
        "남의 성공과 SNS를 볼수록 내 가치가 작아지는 느낌이 들 때 들어옵니다.",
      ],
      sourcePhrases: [
        "je me compare aux autres",
        "réseaux sociaux et estime de soi",
        "jalousie réussite des autres",
        "arrêter de se comparer",
      ],
      searchAliases: ["비교", "je me compare", "SNS 자존감", "arrêter de se comparer"],
      cluster: "self-esteem/social-comparison",
    },
    {
      locale: "es-ES",
      signal: "Spanish searches describe comparing oneself to others, feeling bad from social media, and anxiety at others' success.",
      userDoors: [
        "비교를 멈추고 싶은데 타인의 성취가 계속 나를 압박할 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "me comparo con los demás",
        "redes sociales me hacen sentir mal",
        "me da ansiedad ver el éxito de otros",
        "cómo dejar de compararme",
      ],
      searchAliases: ["me comparo", "남과 비교", "SNS 불안", "타인 성공"],
      cluster: "self-esteem/comparison-anxiety",
    },
  ],
  "love/cant-read-them": [
    {
      locale: "ja-JP",
      signal: "Japanese phrases ask about not understanding the other person's feelings and whether there are romantic signs.",
      userDoors: [
        "상대 마음을 모르는 빈칸을 내 불안이 계속 해석하려 할 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "相手の気持ちがわからない",
        "好きな人 気持ち わからない",
        "脈あり わからない",
        "相手の気持ちがわからない人",
      ],
      searchAliases: ["상대 마음 모름", "相手の気持ち", "脈あり", "짝사랑 신호"],
      cluster: "love/reading-signals",
    },
    {
      locale: "de-DE",
      signal: "German phrases focus on not knowing what the other person feels, mixed signals, and how to tell whether they like you.",
      userDoors: [
        "모호한 신호가 많아질수록 확신보다 추측이 커질 때 들어옵니다.",
      ],
      sourcePhrases: [
        "ich weiß nicht was er fühlt",
        "gemischte signale liebe",
        "woran erkenne ich ob er mich mag",
        "seine gefühle nicht verstehen",
      ],
      searchAliases: ["gemischte signale", "상대 감정", "호감 신호", "mixed signals"],
      cluster: "love/mixed-signals",
    },
  ],
  "career/decision-paralysis": [
    {
      locale: "es-ES",
      signal: "Spanish phrases combine not knowing what to do with life, career choice, fear of decisions, and future blockage.",
      userDoors: [
        "결정 하나가 인생 전체를 정해버릴 것 같아 움직이지 못할 때 들어옵니다.",
      ],
      sourcePhrases: [
        "no sé qué hacer con mi vida",
        "no sé qué carrera elegir",
        "miedo a tomar decisiones",
        "bloqueo al decidir mi futuro",
      ],
      searchAliases: ["결정장애", "no sé qué hacer", "career choice", "미래 결정"],
      cluster: "career/future-block",
    },
    {
      locale: "fr-FR",
      signal: "French searches frame decision paralysis as not knowing what to do with life and fear of choosing a professional path.",
      userDoors: [
        "선택지가 많아서 자유롭기보다 더 막막하게 느껴질 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "je ne sais pas quoi faire de ma vie",
        "choisir sa voie professionnelle",
        "peur de prendre une décision",
        "orientation avenir perdu",
      ],
      searchAliases: ["진로 결정", "voie professionnelle", "peur de décision", "미래 막막"],
      cluster: "career/path-choice",
    },
  ],
  "love/reply-anxiety": [
    {
      locale: "es-ES",
      signal: "Spanish phrases tie message anxiety to being left on read, delayed replies, and WhatsApp message anxiety.",
      userDoors: [
        "답장 속도가 곧 애정의 증거처럼 느껴질 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "no me contesta y me da ansiedad",
        "me dejó en visto",
        "tarda en responder mensajes",
        "ansiedad por mensajes de whatsapp",
      ],
      searchAliases: ["카톡 답장 불안", "me dejó en visto", "whatsapp anxiety", "읽씹"],
      cluster: "love/message-anxiety",
    },
    {
      locale: "ja-JP",
      signal: "Japanese searches describe anxiety when replies do not come, read receipts are ignored, or LINE replies are slow.",
      userDoors: [
        "읽었는데 답이 없거나 답장이 늦을 때 마음이 과하게 흔들리는 상태입니다.",
      ],
      sourcePhrases: [
        "返信が来ない 不安",
        "既読無視 不安",
        "LINE 返信 遅い 不安",
        "好きな人 返信 遅い",
      ],
      searchAliases: ["返信が来ない", "既読無視", "LINE 답장", "답장 늦음"],
      cluster: "love/read-receipt-anxiety",
    },
  ],
  "relationships/relationship-burnout": [
    {
      locale: "ja-JP",
      signal: "Japanese phrases describe exhaustion from relationships, socializing feeling hard, and not wanting to meet anyone.",
      userDoors: [
        "사람이 싫다기보다 관계를 유지하는 에너지가 바닥났을 때 들어옵니다.",
      ],
      sourcePhrases: [
        "人間関係 疲れた",
        "人付き合い しんどい",
        "友達関係 疲れる",
        "誰にも会いたくない",
      ],
      searchAliases: ["인간관계 현타", "人間関係 疲れた", "사회적 소진", "혼자 있고 싶음"],
      cluster: "relationships/social-exhaustion",
    },
    {
      locale: "de-DE",
      signal: "German searches frame relationships as exhausting and people as too much, naming social exhaustion directly.",
      userDoors: [
        "사람을 만나는 일이 계속 과부하처럼 느껴질 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "beziehungen erschöpfen mich",
        "menschen sind mir zu viel",
        "keine lust auf soziale kontakte",
        "soziale erschöpfung",
      ],
      searchAliases: ["soziale erschöpfung", "관계 소진", "people are too much", "사회적 피로"],
      cluster: "relationships/people-overload",
    },
  ],
  "digital/dopamine-addiction": [
    {
      locale: "es-ES",
      signal: "Spanish phrases describe not being able to stop using the phone, social media addiction, videos, and dopamine.",
      userDoors: [
        "핸드폰을 그만 봐야 하는 걸 아는데 영상과 SNS를 멈추지 못할 때 들어옵니다.",
      ],
      sourcePhrases: [
        "no puedo dejar el móvil",
        "adicción a redes sociales",
        "no puedo parar de ver vídeos",
        "dopamina y redes sociales",
      ],
      searchAliases: ["도파민 중독", "no puedo dejar el móvil", "SNS 중독", "short videos"],
      cluster: "digital/phone-compulsion",
    },
    {
      locale: "ja-JP",
      signal: "Japanese searches focus on not being able to stop smartphone or SNS use and wanting to quit dependence.",
      userDoors: [
        "스마트폰을 보는 시간이 내 의지 밖으로 밀려났다고 느낄 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "スマホ やめられない",
        "SNS やめられない",
        "スマホ依存 やめたい",
        "だらだらスマホ やめたい",
      ],
      searchAliases: ["スマホ依存", "SNS やめられない", "스마트폰 중독", "폰 끊기"],
      cluster: "digital/smartphone-dependence",
    },
  ],
  "debate/animal-testing": [
    {
      locale: "de-DE",
      signal: "German debate phrases organize animal testing around pro/con arguments, ethics, and cosmetics testing.",
      userDoors: [
        "과학적 필요와 동물 윤리, 특히 화장품 실험 문제를 함께 보려는 논쟁입니다.",
      ],
      sourcePhrases: [
        "tierversuche debatte",
        "tierversuche pro contra",
        "ethik tierversuche",
        "tierversuche kosmetik",
      ],
      searchAliases: ["동물실험", "tierversuche", "pro contra", "화장품 실험"],
      cluster: "debate/animal-testing-ethics",
    },
    {
      locale: "ja-JP",
      signal: "Japanese phrases ask whether animal testing is necessary and place the issue beside ethics and cosmetics.",
      userDoors: [
        "필요성의 언어와 윤리의 언어가 어디서 충돌하는지 보고 싶을 때 들어옵니다.",
      ],
      sourcePhrases: [
        "動物実験 賛成 反対",
        "動物実験 必要か",
        "動物実験 倫理",
        "化粧品 動物実験",
      ],
      searchAliases: ["動物実験", "동물실험 찬반", "필요성", "윤리"],
      cluster: "debate/necessity-vs-ethics",
    },
  ],
  "relationships/people-pleasing": [
    {
      locale: "de-DE",
      signal: "German searches describe stopping the habit of pleasing everyone, fear of not being liked, and trouble saying no.",
      userDoors: [
        "모두에게 맞추려다 내 기준이 사라지는 느낌이 들 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "es allen recht machen aufhören",
        "angst nicht gemocht zu werden",
        "ich kann nicht nein sagen",
        "people pleasing deutsch",
      ],
      searchAliases: ["눈치 보는 성격", "people pleasing", "인정 욕구", "거절 못함"],
      cluster: "relationships/approval-seeking",
    },
    {
      locale: "es-ES",
      signal: "Spanish phrases ask how to stop pleasing others and name fear of being disliked or not knowing how to say no.",
      userDoors: [
        "미움받기 싫어서 계속 맞춰주는 패턴을 끊고 싶을 때 들어옵니다.",
      ],
      sourcePhrases: [
        "dejar de complacer a los demás",
        "miedo a caer mal",
        "no sé decir que no",
        "personalidad complaciente",
      ],
      searchAliases: ["dejar de complacer", "미움받기 두려움", "착한 사람", "complaciente"],
      cluster: "relationships/fear-of-dislike",
    },
  ],
  "work/boss-stress": [
    {
      locale: "ja-JP",
      signal: "Japanese phrases describe boss stress through fear, mismatch, painful workplace experience, and wanting to quit.",
      userDoors: [
        "상사가 무섭고 맞지 않아 출근 자체가 힘들어질 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "上司 ストレス",
        "上司が怖い",
        "上司 合わない",
        "職場 上司 つらい",
      ],
      searchAliases: ["상사 스트레스", "上司 ストレス", "상사가 무서움", "직장 상사"],
      cluster: "work/boss-fear",
    },
    {
      locale: "de-DE",
      signal: "German searches describe a boss who breaks the person down, toxic boss situations, and psychological stress.",
      userDoors: [
        "개인의 예민함이 아니라 권력관계와 심리적 압박으로 상사를 보고 싶을 때 들어옵니다.",
      ],
      sourcePhrases: [
        "chef macht mich fertig",
        "toxischer chef was tun",
        "stress mit chef",
        "chef macht mich psychisch fertig",
      ],
      searchAliases: ["toxischer chef", "상사 압박", "chef macht mich fertig", "심리적 스트레스"],
      cluster: "work/toxic-boss",
    },
  ],
  "work/work-depression": [
    {
      locale: "fr-FR",
      signal: "French phrases describe not being able to go to work, work making one depressed, and suffering at work.",
      userDoors: [
        "출근 자체가 무너질 만큼 일이 우울감을 키울 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "je n'arrive plus à aller travailler",
        "travail me déprime",
        "souffrance au travail",
        "je n arrive plus à me lever pour aller travailler",
      ],
      searchAliases: ["직장 우울", "travail me déprime", "souffrance au travail", "출근 못하겠음"],
      cluster: "work/depressive-work-strain",
    },
    {
      locale: "zh-CN",
      signal: "Chinese phrases ask what to do about work depression and describe painful work pressure and not wanting to go to the company.",
      userDoors: [
        "일 스트레스가 생활 전체를 무너뜨리는 느낌으로 번질 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "工作抑郁怎么办",
        "上班很痛苦",
        "工作压力让我崩溃",
        "不想去公司",
      ],
      searchAliases: ["工作抑郁", "上班很痛苦", "직장 우울감", "회사 가기 싫음"],
      cluster: "work/work-depression",
    },
  ],
  "body/aging-anxiety": [
    {
      locale: "fr-FR",
      signal: "French phrases connect fear of aging with anxiety about age, loss of youth, and fear of aging and dying.",
      userDoors: [
        "나이 듦 자체보다 젊음과 가능성을 잃는 느낌이 두려울 때 들어옵니다.",
      ],
      sourcePhrases: [
        "peur de vieillir",
        "anxiété liée à l'âge",
        "peur de perdre sa jeunesse",
        "crise de l'âge",
      ],
      searchAliases: ["노화 불안", "peur de vieillir", "나이 불안", "젊음 상실"],
      cluster: "body/aging-and-youth",
    },
    {
      locale: "es-ES",
      signal: "Spanish searches describe fear of aging, age anxiety, losing youth, and crisis around getting older.",
      userDoors: [
        "늙는다는 사실이 외모, 건강, 시간의 문제로 한꺼번에 밀려올 때 들어옵니다.",
      ],
      sourcePhrases: [
        "miedo a envejecer",
        "ansiedad por la edad",
        "me da miedo perder la juventud",
        "crisis por hacerse mayor",
      ],
      searchAliases: ["miedo a envejecer", "노화 공포", "age anxiety", "젊음"],
      cluster: "body/getting-older",
    },
  ],
  "debate/juvenile-offenders": [
    {
      locale: "fr-FR",
      signal: "French debate phrases frame juvenile crime through criminal responsibility of minors and punishment versus rehabilitation.",
      userDoors: [
        "미성년자의 책임을 어디까지 물을지, 처벌과 교화 사이를 정리하려는 논쟁입니다.",
      ],
      sourcePhrases: [
        "délinquance juvénile débat",
        "responsabilité pénale des mineurs",
        "punir ou réhabiliter les mineurs",
        "justice des mineurs",
      ],
      searchAliases: ["촉법소년", "mineurs", "punir ou réhabiliter", "소년범"],
      cluster: "debate/minors-responsibility",
    },
    {
      locale: "ja-JP",
      signal: "Japanese searches emphasize harsher punishment, juvenile law age changes, and responsibility for underage crime.",
      userDoors: [
        "소년범 처벌 강화가 정의인지, 성숙과 재사회화를 고려해야 하는지 보는 입구입니다.",
      ],
      sourcePhrases: [
        "少年犯罪 厳罰化",
        "触法少年 処罰",
        "少年法 引き下げ",
        "未成年 犯罪 責任",
      ],
      searchAliases: ["소년범 처벌", "少年犯罪 厳罰化", "触法少年", "소년법"],
      cluster: "debate/juvenile-punishment",
    },
  ],
  "work/unrecognized": [
    {
      locale: "ja-JP",
      signal: "Japanese phrases describe not being recognized at work, not being evaluated despite effort, and work not paying off.",
      userDoors: [
        "열심히 했는데도 평가받지 못하고 보상받지 못한다고 느낄 때 들어옵니다.",
      ],
      sourcePhrases: [
        "仕事 認められない",
        "頑張っても評価されない",
        "職場 評価されない",
        "仕事 報われない",
      ],
      searchAliases: ["인정받지 못함", "仕事 認められない", "評価されない", "노력 보상"],
      cluster: "work/unrecognized-effort",
    },
    {
      locale: "fr-FR",
      signal: "French searches name lack of recognition at work, invisible effort, and professional recognition gaps.",
      userDoors: [
        "내 노력이 조직 안에서 보이지 않는 것처럼 느껴질 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "pas reconnu au travail",
        "mes efforts ne sont pas reconnus",
        "je me sens invisible au travail",
        "manque de reconnaissance professionnelle",
      ],
      searchAliases: ["pas reconnu au travail", "직장 인정", "invisible at work", "노력 인정"],
      cluster: "work/recognition-gap",
    },
  ],
};

const completeCuratedSourceLocaleInsights = {
  "relationships/drifting-friends": [
    {
      locale: "de-DE",
      signal: "German phrases describe friendships drifting apart, losing friends in adulthood, and ending up with no friends.",
      userDoors: [
        "친구가 멀어지는 일이 내 잘못인지, 어른이 되며 관계가 변하는 과정인지 보고 싶을 때 들어옵니다.",
      ],
      sourcePhrases: [
        "freunde entfernen sich",
        "freundschaften gehen auseinander",
        "im erwachsenenalter freunde verlieren",
        "keine freunde mehr",
      ],
      searchAliases: ["친구 멀어짐", "freunde entfernen sich", "adult friendships", "관계 변화"],
      cluster: "relationships/adult-friendship-drift",
    },
  ],
  "self-esteem/dating-self-esteem": [
    {
      locale: "es-ES",
      signal: "Spanish phrases connect low self-esteem in relationships with feeling undeserving of love and insecurity in love.",
      userDoors: [
        "연애 안에서 내가 사랑받을 자격이 없다고 느낄 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "baja autoestima en una relación",
        "siento que no merezco amor",
        "mi pareja afecta mi autoestima",
        "inseguridad en el amor",
      ],
      searchAliases: ["자존감 낮은 연애", "baja autoestima", "merecer amor", "연애 불안"],
      cluster: "self-esteem/love-worth",
    },
  ],
  "body/hair-loss-stress": [
    {
      locale: "fr-FR",
      signal: "French phrases tie hair loss anxiety to fear of baldness, self-esteem, stress, and alopecia.",
      userDoors: [
        "탈모가 외모 문제를 넘어 자존감과 미래 불안까지 흔들 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "anxiété perte de cheveux",
        "peur de devenir chauve",
        "perte de cheveux estime de soi",
        "stress alopécie",
      ],
      searchAliases: ["탈모 스트레스", "perte de cheveux", "peur de devenir chauve", "외모 불안"],
      cluster: "body/hair-loss-self-esteem",
    },
  ],
  "breakup/obsession": [
    {
      locale: "de-DE",
      signal: "German phrases describe obsession with an ex, not being able to stop thinking, and the urge to write.",
      userDoors: [
        "전 애인 생각이 멈추지 않고 연락 충동으로 이어질 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "besessen von ex",
        "wie höre ich auf an ihn zu denken",
        "ex nicht loslassen können",
        "drang ex zu schreiben",
      ],
      searchAliases: ["집착 끊기", "besessen von ex", "전 애인 생각", "연락 충동"],
      cluster: "breakup/obsessive-loop",
    },
  ],
  "family/mother-conflict": [
    {
      locale: "fr-FR",
      signal: "French phrases describe not getting along with one's mother, being exhausted by her, conflict, and setting limits.",
      userDoors: [
        "엄마를 미워하고 싶진 않지만 계속 소진되고 경계를 세우고 싶을 때 들어옵니다.",
      ],
      sourcePhrases: [
        "je ne m'entends pas avec ma mère",
        "ma mère m'épuise",
        "je me dispute avec ma mère",
        "mettre des limites à ma mère",
      ],
      searchAliases: ["엄마 갈등", "ma mère m'épuise", "limites mère", "가족 경계"],
      cluster: "family/mother-boundaries",
    },
  ],
  "debate/ai-replacement": [
    {
      locale: "de-DE",
      signal: "German debate phrases focus on AI replacing jobs, unemployment, fear of AI at work, and the future of work.",
      userDoors: [
        "AI가 편리한 도구인지, 내 일자리를 흔드는 구조 변화인지 보려는 논쟁입니다.",
      ],
      sourcePhrases: [
        "ki ersetzt jobs",
        "künstliche intelligenz arbeitslosigkeit",
        "angst vor ki im job",
        "zukunft der arbeit ki",
      ],
      searchAliases: ["AI 일자리 대체", "ki ersetzt jobs", "AI unemployment", "미래 노동"],
      cluster: "debate/ai-and-work",
    },
  ],
  "family/family-cutoff": [
    {
      locale: "fr-FR",
      signal: "French phrases frame family cutoff as breaking ties, not speaking to parents, guilt, and protection from toxic family.",
      userDoors: [
        "가족과 거리를 두는 일이 배신인지 자기보호인지 구분하고 싶을 때 들어옵니다.",
      ],
      sourcePhrases: [
        "couper les ponts avec sa famille",
        "ne plus parler à ses parents",
        "culpabilité de couper avec sa famille",
        "couper les ponts avec sa famille toxique",
      ],
      searchAliases: ["가족 손절", "couper les ponts", "toxic family", "죄책감"],
      cluster: "family/cutoff-and-guilt",
    },
  ],
  "work/not-good-enough": [
    {
      locale: "ja-JP",
      signal: "Japanese phrases describe feeling unable to work well, being slow, being the only incapable one, and hating oneself for it.",
      userDoors: [
        "일을 못하는 사람처럼 느껴져 자기비난으로 번질 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "仕事 できない 自分",
        "仕事が遅い つらい",
        "自分だけ仕事できない",
        "無能感 職場",
      ],
      searchAliases: ["일 못하는 것 같음", "仕事 できない", "무능감", "업무 자신감"],
      cluster: "work/incompetence-feeling",
    },
  ],
  "love/cant-confess": [
    {
      locale: "ja-JP",
      signal: "Japanese phrases describe not being able to confess, fear of confessing, friendship breaking, and not expressing feelings.",
      userDoors: [
        "고백이 마음 전달이 아니라 관계를 잃을 위험처럼 느껴질 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "告白できない",
        "好きな人 告白 怖い",
        "告白 友達 壊れる",
        "気持ちを伝えられない 恋愛",
      ],
      searchAliases: ["고백 못함", "告白できない", "짝사랑 고백", "관계 깨질까 봐"],
      cluster: "love/confession-fear",
    },
  ],
  "work/quit-or-stay": [
    {
      locale: "ja-JP",
      signal: "Japanese phrases ask whether to quit or continue, name resignation hesitation, and fear after wanting to quit.",
      userDoors: [
        "퇴사하고 싶은 마음과 버텨야 한다는 불안이 부딪힐 때 들어옵니다.",
      ],
      sourcePhrases: [
        "仕事 辞めるか続けるか",
        "退職 迷う",
        "仕事 辞めたい でも不安",
        "会社 続けるべきか",
      ],
      searchAliases: ["퇴사 고민", "仕事 辞めるか続けるか", "退職 迷う", "버텨야 하나"],
      cluster: "work/quit-or-stay",
    },
  ],
  "career/dream-reality": [
    {
      locale: "de-DE",
      signal: "German phrases ask whether to give up or continue a dream and contrast passion with realism.",
      userDoors: [
        "꿈을 좇는 게 용기인지 현실 회피인지 고민될 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "traum aufgeben oder weitermachen",
        "traum und realität",
        "leidenschaft zum beruf machen oder realistisch sein",
        "angst dem traum zu folgen",
      ],
      searchAliases: ["꿈과 현실", "traum und realität", "꿈 포기", "현실적인 선택"],
      cluster: "career/dream-vs-reality",
    },
  ],
  "debate/basic-income": [
    {
      locale: "de-DE",
      signal: "German debate phrases organize basic income around unconditional income, pro/con arguments, funding, and work incentives.",
      userDoors: [
        "기본소득이 안전망인지 노동 의욕을 흔드는 제도인지 정리하려는 논쟁입니다.",
      ],
      sourcePhrases: [
        "bedingungsloses grundeinkommen debatte",
        "grundeinkommen pro contra",
        "finanzierung grundeinkommen",
        "grundeinkommen arbeiten",
      ],
      searchAliases: ["기본소득", "grundeinkommen", "pro contra", "재원"],
      cluster: "debate/basic-income-funding",
    },
  ],
  "debate/cohabitation": [
    {
      locale: "fr-FR",
      signal: "French phrases discuss living together before marriage, pro/con cohabitation, couple responsibility, and living without marriage.",
      userDoors: [
        "동거가 관계의 준비인지 결혼 제도의 우회인지 보고 싶을 때 들어오는 논쟁입니다.",
      ],
      sourcePhrases: [
        "vivre ensemble avant le mariage",
        "cohabitation avant mariage pour ou contre",
        "concubinage responsabilité couple",
        "vivre en couple sans se marier",
      ],
      searchAliases: ["혼전동거", "cohabitation", "vivre ensemble", "결혼 전 동거"],
      cluster: "debate/cohabitation-before-marriage",
    },
  ],
  "breakup/right-after": [
    {
      locale: "ja-JP",
      signal: "Japanese phrases describe the immediate aftermath of breakup as painful, lonely, and impossible to recover from.",
      userDoors: [
        "이별 직후 아무것도 못 하고 무너지는 시간을 지나고 있을 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "別れた直後 つらい",
        "失恋 直後 立ち直れない",
        "別れた後 寂しい",
        "失恋 何もできない",
      ],
      searchAliases: ["이별 직후", "別れた直後", "失恋 立ち直れない", "이별 후 공허"],
      cluster: "breakup/acute-grief",
    },
  ],
  "debate/vegetarianism": [
    {
      locale: "de-DE",
      signal: "German debate phrases place veganism and vegetarianism beside ethics, moral duty, meat eating, and the environment.",
      userDoors: [
        "채식이 개인 취향인지 동물과 환경에 대한 윤리적 의무인지 보려는 논쟁입니다.",
      ],
      sourcePhrases: [
        "veganismus ethik debatte",
        "vegetarismus moralische pflicht",
        "fleisch essen ethik",
        "veganismus umwelt",
      ],
      searchAliases: ["채식 논쟁", "veganismus", "moralische pflicht", "고기 윤리"],
      cluster: "debate/vegan-ethics",
    },
  ],
  "family/holiday-stress": [
    {
      locale: "ja-JP",
      signal: "Japanese phrases connect family holiday stress with returning home, relatives, and finding one's parents' home painful.",
      userDoors: [
        "명절이나 귀성 때 가족과 친척 관계가 부담으로 몰려올 때 들어옵니다.",
      ],
      sourcePhrases: [
        "年末年始 家族 ストレス",
        "帰省 ストレス",
        "親戚付き合い 疲れる",
        "実家に帰るのがつらい",
      ],
      searchAliases: ["명절 스트레스", "帰省 ストレス", "친척 피로", "가족 모임"],
      cluster: "family/holiday-family-load",
    },
  ],
  "career/regret-free-choice": [
    {
      locale: "ja-JP",
      signal: "Japanese phrases ask about regret-free choices and fear that either option will lead to regret.",
      userDoors: [
        "어느 쪽을 골라도 후회할 것 같아 선택 자체가 무거울 때 들어옵니다.",
      ],
      sourcePhrases: [
        "後悔しない選択",
        "選択 後悔 怖い",
        "どっちを選んでも後悔しそう",
        "人生 選択 迷う",
      ],
      searchAliases: ["후회 없는 선택", "後悔しない選択", "선택 불안", "결정 후회"],
      cluster: "career/regret-and-choice",
    },
  ],
  "love/relationship-values": [
    {
      locale: "ja-JP",
      signal: "Japanese phrases describe mismatched values in love and marriage, including still liking someone despite incompatible values.",
      userDoors: [
        "좋아하는 마음은 남아 있지만 생활 기준과 미래 기준이 맞지 않을 때 들어옵니다.",
      ],
      sourcePhrases: [
        "恋愛 価値観 合わない",
        "結婚 価値観 違い",
        "恋人 価値観 違う",
        "好きだけど価値観が合わない",
      ],
      searchAliases: ["연애 가치관", "価値観 合わない", "결혼 가치관", "좋아하지만 안 맞음"],
      cluster: "love/value-mismatch",
    },
  ],
  "relationships/regret-words": [
    {
      locale: "ja-JP",
      signal: "Japanese phrases describe regretting slips of the tongue, saying too much, worrying about odd remarks, and one haunting sentence.",
      userDoors: [
        "한마디를 잘못한 것 같아 계속 되감기하며 후회할 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "失言 後悔",
        "言い過ぎた 後悔",
        "変なこと言ったかも 不安",
        "あの一言 後悔",
      ],
      searchAliases: ["말실수 후회", "失言 後悔", "말 많이 함", "관계 불안"],
      cluster: "relationships/word-regret",
    },
  ],
  "debate/cancel-culture": [
    {
      locale: "fr-FR",
      signal: "French debate phrases connect cancel culture with freedom of expression, responsibility, online lynching, and boycott.",
      userDoors: [
        "책임을 묻는 문화인지 온라인 집단 처벌인지 구분하려는 논쟁입니다.",
      ],
      sourcePhrases: [
        "cancel culture débat",
        "culture de l'annulation liberté d'expression",
        "responsabilité ou lynchage",
        "boycott réseaux sociaux",
      ],
      searchAliases: ["캔슬 컬처", "cancel culture", "liberté d'expression", "온라인 처벌"],
      cluster: "debate/accountability-vs-lynching",
    },
  ],
  "relationships/lonely-but-prefer-alone": [
    {
      locale: "de-DE",
      signal: "German phrases describe liking being alone but feeling lonely, avoiding people while lonely, and social contact being tiring.",
      userDoors: [
        "혼자가 편한 건 맞지만 외로움까지 사라지는 건 아닐 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "ich bin gerne allein aber einsam",
        "allein sein und einsamkeit",
        "ich will nicht unter menschen aber bin einsam",
        "soziale kontakte strengen an",
      ],
      searchAliases: ["혼자가 편한데 외로움", "gerne allein aber einsam", "사회적 피로", "고독"],
      cluster: "relationships/alone-but-lonely",
    },
  ],
  "self-esteem/cant-accept-praise": [
    {
      locale: "fr-FR",
      signal: "French phrases describe not accepting compliments, not believing them, feeling uncomfortable, and rejecting praise.",
      userDoors: [
        "칭찬을 들어도 믿기 어렵고 오히려 불편해질 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "je n'accepte pas les compliments",
        "je ne crois pas les compliments",
        "les compliments me mettent mal à l'aise",
        "pourquoi je refuse les compliments",
      ],
      searchAliases: ["칭찬 못 받아들임", "compliments", "칭찬 불편", "자기평가"],
      cluster: "self-esteem/praise-discomfort",
    },
  ],
  "self-esteem/falling-behind": [
    {
      locale: "fr-FR",
      signal: "French phrases describe feeling late in life, comparing age with others, and everyone moving forward except oneself.",
      userDoors: [
        "나만 제자리이고 모두가 앞서가는 것처럼 느껴질 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "j'ai l'impression d'être en retard dans la vie",
        "me comparer aux autres âge",
        "tout le monde avance sauf moi",
        "peur d'être en retard",
      ],
      searchAliases: ["나만 뒤처짐", "en retard dans la vie", "인생 늦음", "비교 불안"],
      cluster: "self-esteem/life-timeline",
    },
  ],
  "debate/parent-support": [
    {
      locale: "es-ES",
      signal: "Spanish phrases frame parent support as an obligation to maintain or care for elderly parents and ask how far help should go.",
      userDoors: [
        "부모 부양이 사랑의 책임인지 자식에게 과도한 의무인지 정리하려는 논쟁입니다.",
      ],
      sourcePhrases: [
        "obligación de mantener a los padres",
        "cuidar padres ancianos responsabilidad hijos",
        "hasta dónde ayudar a los padres",
        "deber filial debate",
      ],
      searchAliases: ["부모 부양", "obligación padres", "deber filial", "자식 의무"],
      cluster: "debate/filial-duty",
    },
  ],
  "debate/nice-people-finish-last": [
    {
      locale: "ja-JP",
      signal: "Japanese phrases describe kind people losing out, good people being used, and kindness becoming painful.",
      userDoors: [
        "착함이 미덕인지, 이용당하는 패턴인지 구분하고 싶을 때 들어오는 논쟁입니다.",
      ],
      sourcePhrases: [
        "優しい人 損をする",
        "いい人は利用される",
        "優しすぎる つらい",
        "善人 損 議論",
      ],
      searchAliases: ["착하게 살면 손해", "優しい人 損", "いい人", "호구"],
      cluster: "debate/kindness-and-exploitation",
    },
  ],
  "debate/ai-art": [
    {
      locale: "es-ES",
      signal: "Spanish debate phrases ask whether AI can make art and connect generated art with copyright and artists.",
      userDoors: [
        "AI 그림이 예술 창작인지 데이터와 저작권 문제인지 함께 보려는 논쟁입니다.",
      ],
      sourcePhrases: [
        "arte generado por IA debate",
        "la IA puede hacer arte",
        "derechos de autor arte IA",
        "artistas y inteligencia artificial",
      ],
      searchAliases: ["AI 그림", "arte IA", "저작권", "AI art debate"],
      cluster: "debate/ai-art-authorship",
    },
  ],
  "debate/no-kids-zone": [
    {
      locale: "es-ES",
      signal: "Spanish phrases discuss child-free zones, restaurants without children, banning children, and public space debates.",
      userDoors: [
        "영업의 자유와 아동 동반 가족의 접근권이 어디서 충돌하는지 보려는 논쟁입니다.",
      ],
      sourcePhrases: [
        "zonas sin niños debate",
        "restaurantes sin niños",
        "prohibir niños en restaurantes",
        "niños en espacios públicos debate",
      ],
      searchAliases: ["노키즈존", "zonas sin niños", "restaurantes sin niños", "공공공간"],
      cluster: "debate/children-in-public",
    },
  ],
  "debate/pet-euthanasia": [
    {
      locale: "de-DE",
      signal: "German phrases frame pet euthanasia as a decision around suffering, ethics, and knowing when to euthanize.",
      userDoors: [
        "반려동물의 고통을 줄이는 선택과 생명을 끝내는 책임이 만날 때 들어오는 논쟁입니다.",
      ],
      sourcePhrases: [
        "haustier einschläfern entscheidung",
        "hund einschläfern leid",
        "tier euthanasie ethik",
        "wann haustier einschläfern",
      ],
      searchAliases: ["반려동물 안락사", "haustier einschläfern", "pet euthanasia", "고통 완화"],
      cluster: "debate/pet-suffering-decision",
    },
  ],
  "debate/meritocracy": [
    {
      locale: "es-ES",
      signal: "Spanish phrases ask whether meritocracy is just and connect criticism of meritocracy with inequality and effort.",
      userDoors: [
        "노력하면 보상받는다는 믿음이 공정한지, 출발선의 불평등을 가리는지 묻는 논쟁입니다.",
      ],
      sourcePhrases: [
        "meritocracia es justa",
        "crítica a la meritocracia",
        "el esfuerzo siempre se recompensa",
        "desigualdad y meritocracia",
      ],
      searchAliases: ["능력주의", "meritocracia", "노력 보상", "불평등"],
      cluster: "debate/merit-and-inequality",
    },
  ],
  "relationships/hurtful-words": [
    {
      locale: "ja-JP",
      signal: "Japanese phrases describe not forgetting hurtful words, being pained by what was said, and wounds from language not healing.",
      userDoors: [
        "이미 지나간 말인데도 계속 떠올라 마음이 다시 다칠 때 들어오는 표현입니다.",
      ],
      sourcePhrases: [
        "傷つく言葉 忘れられない",
        "言われたこと 思い出してつらい",
        "ひどい言葉 引きずる",
        "言葉の傷 癒えない",
      ],
      searchAliases: ["상처받은 말", "傷つく言葉", "말의 상처", "잊히지 않음"],
      cluster: "relationships/verbal-wounds",
    },
  ],
};

export const sourceLocaleInsights = {
  ...curatedSourceLocaleInsights,
  ...expandedCuratedSourceLocaleInsights,
  ...completeCuratedSourceLocaleInsights,
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

function sourceLocaleKoreanLabel(code) {
  return sourceLocaleKoreanLabels[code] || `${sourceLocaleDisplayName(code)}권`;
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
          `${sourceLocaleKoreanLabel(locale.locale)}에서는 "${sourcePhrases[0]}" 같은 표현으로 이 고민을 찾는 흐름이 보입니다.`,
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
  const generated = generatedSourceLocaleInsightsForKey(key);
  if (manual.length === 0) return generated;

  const manualLocales = new Set(manual.map((insight) => insight.locale));
  const fallback = generated
    .filter((insight) => !manualLocales.has(insight.locale))
    .slice(0, Math.max(0, GENERATED_INSIGHT_LIMIT - manual.length));
  return [...manual, ...fallback];
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
