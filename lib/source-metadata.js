import { lensForSlug, lensForSourceType } from "./perspective-lenses.js";

export const sourceTypeLabels = {
  primary: "원전",
  official: "공식",
  law: "법령",
  policy: "정책",
  medical: "의료",
  research: "연구",
  interpretation: "해설",
  publisher: "출판",
};

const sourceRules = [
  {
    includes: ["에픽테토스", "엥케이리디온"],
    sourceUrl: "https://classics.mit.edu/Epictetus/epicench.html",
    sourceType: "primary",
    sourceYear: "2세기",
  },
  {
    includes: ["아리스토텔레스", "니코마코스 윤리학"],
    sourceUrl: "https://classics.mit.edu/Aristotle/nicomachaen.html",
    sourceType: "primary",
    sourceYear: "기원전 4세기",
  },
  {
    includes: ["세네카", "루킬리우스"],
    sourceUrl: "https://en.wikisource.org/wiki/Moral_letters_to_Lucilius",
    sourceType: "primary",
    sourceYear: "1세기",
  },
  {
    includes: ["세네카", "인생의 짧음"],
    sourceUrl: "https://en.wikisource.org/wiki/On_the_shortness_of_life",
    sourceType: "primary",
    sourceYear: "1세기",
  },
  {
    includes: ["세네카", "분노"],
    sourceUrl: "https://en.wikisource.org/wiki/Of_Anger",
    sourceType: "primary",
    sourceYear: "1세기",
  },
  {
    includes: ["마르쿠스 아우렐리우스", "명상록"],
    sourceUrl: "https://classics.mit.edu/Antoninus/meditations.html",
    sourceType: "primary",
    sourceYear: "2세기",
  },
  {
    includes: ["스피노자", "에티카"],
    sourceUrl: "https://en.wikisource.org/wiki/Ethics_(Spinoza)",
    sourceType: "primary",
    sourceYear: "1677",
  },
  {
    includes: ["칸트", "윤리형이상학 정초"],
    sourceUrl: "https://www.gutenberg.org/files/5682/5682-h/5682-h.htm",
    sourceType: "primary",
    sourceYear: "1785",
  },
  {
    includes: ["칸트", "계몽"],
    sourceUrl: "https://en.wikisource.org/wiki/What_is_Enlightenment%3F",
    sourceType: "primary",
    sourceYear: "1784",
  },
  {
    includes: ["공자", "논어"],
    sourceUrl: "https://sacred-texts.com/cfu/conf1.htm",
    sourceType: "primary",
    sourceYear: "전국시대",
  },
  {
    includes: ["논어"],
    sourceUrl: "https://sacred-texts.com/cfu/conf1.htm",
    sourceType: "primary",
    sourceYear: "전국시대",
  },
  {
    includes: ["노자", "도덕경"],
    sourceUrl: "https://sacred-texts.com/tao/taote.htm",
    sourceType: "primary",
    sourceYear: "고대 중국",
  },
  {
    includes: ["장자"],
    sourceUrl: "https://ctext.org/zhuangzi",
    sourceType: "primary",
    sourceYear: "고대 중국",
  },
  {
    includes: ["밀", "자유론"],
    sourceUrl: "https://www.gutenberg.org/files/34901/34901-h/34901-h.htm",
    sourceType: "primary",
    sourceYear: "1859",
  },
  {
    includes: ["밀", "공리주의"],
    sourceUrl: "https://www.gutenberg.org/files/11224/11224-h/11224-h.htm",
    sourceType: "primary",
    sourceYear: "1863",
  },
  {
    includes: ["J. S. Mill", "자유론"],
    sourceUrl: "https://www.gutenberg.org/files/34901/34901-h/34901-h.htm",
    sourceType: "primary",
    sourceYear: "1859",
  },
  {
    includes: ["J. S. Mill", "1868년 사형제"],
    sourceUrl: "https://oll.libertyfund.org/title/mill-the-collected-works-of-john-stuart-mill-volume-xxviii-public-and-parliamentary-speeches-part-i",
    sourceType: "primary",
    sourceYear: "1868",
  },
  {
    includes: ["칸트", "인간애에서 거짓말"],
    sourceUrl: "https://en.wikisource.org/wiki/On_a_Supposed_Right_to_Tell_Lies_from_Benevolent_Motives",
    sourceType: "primary",
    sourceYear: "1797",
  },
  {
    includes: ["칸트", "윤리학 강의"],
    sourceUrl: "https://pages.uoregon.edu/koopman/courses_readings/phil123-net/animal_rights/kant.html",
    sourceType: "primary",
    sourceYear: "1775-1781",
  },
  {
    includes: ["칸트", "판단력 비판"],
    sourceUrl: "https://www.gutenberg.org/files/48433/48433-h/48433-h.htm",
    sourceType: "primary",
    sourceYear: "1790",
  },
  {
    includes: ["벤담", "도덕과 입법"],
    sourceUrl: "https://www.earlymoderntexts.com/assets/pdfs/bentham1780.pdf",
    sourceType: "primary",
    sourceYear: "1780",
  },
  {
    includes: ["에피쿠로스", "메노이케우스"],
    sourceUrl: "https://en.wikisource.org/wiki/Letter_to_Menoeceus",
    sourceType: "primary",
    sourceYear: "기원전 3세기",
  },
  {
    includes: ["키르케고르", "이것이냐 저것이냐"],
    sourceUrl: "https://archive.org/details/eitherorvolumefi0000sren",
    sourceType: "primary",
    sourceYear: "1843",
  },
  {
    includes: ["키르케고르", "불안의 개념"],
    sourceUrl: "https://archive.org/details/conceptofanxiety0000kier",
    sourceType: "primary",
    sourceYear: "1844",
  },
  {
    includes: ["사르트르", "실존주의는 휴머니즘"],
    sourceUrl: "https://www.marxists.org/reference/archive/sartre/works/exist/sartre.htm",
    sourceType: "primary",
    sourceYear: "1946",
  },
  {
    includes: ["카뮈", "시시포스"],
    sourceUrl: "https://archive.org/details/mythofsisyphus00camu",
    sourceType: "primary",
    sourceYear: "1942",
  },
  {
    includes: ["카뮈", "시지프"],
    sourceUrl: "https://archive.org/details/mythofsisyphus00camu",
    sourceType: "primary",
    sourceYear: "1942",
  },
  {
    includes: ["니체", "즐거운 학문"],
    sourceUrl: "https://www.gutenberg.org/files/52881/52881-h/52881-h.htm",
    sourceType: "primary",
    sourceYear: "1882",
  },
  {
    includes: ["니체", "차라투스트라"],
    sourceUrl: "https://www.gutenberg.org/files/1998/1998-h/1998-h.htm",
    sourceType: "primary",
    sourceYear: "1883-1885",
  },
  {
    includes: ["니체", "도덕의 계보"],
    sourceUrl: "https://www.gutenberg.org/files/52319/52319-h/52319-h.htm",
    sourceType: "primary",
    sourceYear: "1887",
  },
  {
    includes: ["니체", "이 사람을 보라"],
    sourceUrl: "https://www.gutenberg.org/files/52190/52190-h/52190-h.htm",
    sourceType: "primary",
    sourceYear: "1888",
  },
  {
    includes: ["칼릴 지브란", "예언자"],
    sourceUrl: "https://www.gutenberg.org/files/58585/58585-h/58585-h.htm",
    sourceType: "primary",
    sourceYear: "1923",
  },
  {
    includes: ["쇼펜하우어", "아포리즘"],
    sourceUrl: "https://www.gutenberg.org/files/10715/10715-h/10715-h.htm",
    sourceType: "primary",
    sourceYear: "1851",
  },
  {
    includes: ["쇼펜하우어", "소품과 부록"],
    sourceUrl: "https://www.gutenberg.org/files/10741/10741-h/10741-h.htm",
    sourceType: "primary",
    sourceYear: "1851",
  },
  {
    includes: ["아리스토텔레스", "정치학"],
    sourceUrl: "https://classics.mit.edu/Aristotle/politics.html",
    sourceType: "primary",
    sourceYear: "기원전 4세기",
  },
  {
    includes: ["에피쿠로스", "주요 교설"],
    sourceUrl: "https://en.wikisource.org/wiki/Principal_Doctrines",
    sourceType: "primary",
    sourceYear: "기원전 3세기",
  },
  {
    includes: ["베카리아", "범죄와 형벌"],
    sourceUrl: "https://www.gutenberg.org/files/58700/58700-h/58700-h.htm",
    sourceType: "primary",
    sourceYear: "1764",
  },
  {
    includes: ["롤스", "정의론"],
    sourceUrl: "https://plato.stanford.edu/entries/original-position/difference-principle.html",
    sourceType: "interpretation",
    sourceYear: "1971",
  },
  {
    includes: ["노직", "아나키"],
    sourceUrl: "https://iep.utm.edu/noz-poli/",
    sourceType: "interpretation",
    sourceYear: "1974",
  },
  {
    includes: ["토머스 페인", "Agrarian Justice"],
    sourceUrl: "https://en.wikisource.org/wiki/Agrarian_Justice",
    sourceType: "primary",
    sourceYear: "1797",
  },
  {
    includes: ["피터 싱어", "All Animals Are Equal"],
    sourceUrl: "https://www.utilitarian.net/singer/by/1979----.htm",
    sourceType: "research",
    sourceYear: "1974",
  },
  {
    includes: ["Judith Jarvis Thomson"],
    sourceUrl: "https://spot.colorado.edu/~heathwoo/Phil160,Fall02/thomson.htm",
    sourceType: "research",
    sourceYear: "1971",
  },
  {
    includes: ["Don Marquis"],
    sourceUrl: "https://rintintin.colorado.edu/~vancecd/phil215/Marquis.pdf",
    sourceType: "research",
    sourceYear: "1989",
  },
  {
    includes: ["Mary Anne Warren"],
    sourceUrl: "https://www.jstor.org/stable/27902294",
    sourceType: "research",
    sourceYear: "1973",
  },
  {
    includes: ["ILO", "Generative AI"],
    sourceUrl: "https://www.ilo.org/publications/generative-ai-and-jobs-global-analysis-potential-effects",
    sourceType: "policy",
    sourceYear: "2023",
  },
  {
    includes: ["J. M. Keynes", "Economic Possibilities"],
    sourceUrl: "https://www.econ.yale.edu/smith/econ116a/keynes1.pdf",
    sourceType: "primary",
    sourceYear: "1930",
  },
  {
    includes: ["Walter Benjamin", "Work of Art"],
    sourceUrl: "https://www.marxists.org/reference/subject/philosophy/works/ge/benjamin.htm",
    sourceType: "primary",
    sourceYear: "1935-1936",
  },
  {
    includes: ["헤겔", "정신현상학"],
    sourceUrl: "https://www.gutenberg.org/files/1698/1698-h/1698-h.htm",
    sourceType: "primary",
    sourceYear: "1807",
  },
  {
    includes: ["ILO", "Teleworking"],
    sourceUrl:
      "https://www.ilo.org/sites/default/files/wcmsp5/groups/public/%40ed_protect/%40protrav/%40travail/documents/instructionalmaterial/wcms_751232.pdf",
    sourceType: "policy",
    sourceYear: "2020",
  },
  {
    includes: ["Does Working from Home Work", "Bloom"],
    sourceUrl: "https://www.nber.org/papers/w18871",
    sourceType: "research",
    sourceYear: "2015",
  },
  {
    includes: ["ILO/Eurofound", "Working anytime"],
    sourceUrl: "https://www.ilo.org/publications/working-anytime-anywhere-effects-world-work",
    sourceType: "policy",
    sourceYear: "2017",
  },
  {
    includes: ["Copyright Office", "Artificial Intelligence"],
    sourceUrl: "https://www.copyright.gov/ai/",
    sourceType: "official",
    sourceYear: "2025",
  },
  {
    includes: ["UN Convention on the Rights of the Child"],
    sourceUrl: "https://www.ohchr.org/en/instruments-mechanisms/instruments/convention-rights-child",
    sourceType: "official",
    sourceYear: "1989",
  },
  {
    includes: ["UNFPA"],
    sourceUrl: "https://www.unfpa.org/bodyright",
    sourceType: "official",
    sourceYear: "2021",
  },
  {
    includes: ["World Medical Association"],
    sourceUrl:
      "https://www.wma.net/policies-post/declaration-on-euthanasia-and-physician-assisted-suicide/",
    sourceType: "official",
    sourceYear: "2019",
  },
  {
    includes: ["AVMA"],
    sourceUrl: "https://www.avma.org/resources-tools/avma-policies/avma-guidelines-euthanasia-animals",
    sourceType: "official",
    sourceYear: "2020",
  },
  {
    includes: ["National Institute of Mental Health", "Depression"],
    sourceUrl: "https://www.nimh.nih.gov/health/topics/depression",
    sourceType: "medical",
    sourceYear: "2026",
  },
  {
    includes: ["NHS", "Health anxiety"],
    sourceUrl: "https://www.nhs.uk/mental-health/conditions/health-anxiety/",
    sourceType: "medical",
    sourceYear: "2026",
  },
  {
    includes: ["Mayo Clinic", "Illness anxiety"],
    sourceUrl:
      "https://www.mayoclinic.org/diseases-conditions/illness-anxiety-disorder/diagnosis-treatment/drc-20373787",
    sourceType: "medical",
    sourceYear: "2026",
  },
  {
    includes: ["NHS inform", "Insomnia"],
    sourceUrl: "https://www.nhsinform.scot/illnesses-and-conditions/mental-health/insomnia/",
    sourceType: "medical",
    sourceYear: "2025",
  },
  {
    includes: ["Mayo Clinic", "CBT for insomnia"],
    sourceUrl:
      "https://www.mayoclinic.org/diseases-conditions/insomnia/in-depth/insomnia-treatment/art-20046677",
    sourceType: "medical",
    sourceYear: "2026",
  },
  {
    includes: ["American Academy of Dermatology"],
    sourceUrl: "https://www.aad.org/public/diseases/hair-loss",
    sourceType: "medical",
    sourceYear: "2026",
  },
  {
    includes: ["Mayo Clinic", "Hair loss"],
    sourceUrl:
      "https://www.mayoclinic.org/diseases-conditions/hair-loss/diagnosis-treatment/drc-20372932",
    sourceType: "medical",
    sourceYear: "2026",
  },
  {
    includes: ["WHO", "Mental health of older adults"],
    sourceUrl: "https://www.who.int/news-room/fact-sheets/detail/mental-health-of-older-adults",
    sourceType: "medical",
    sourceYear: "2025",
  },
  {
    includes: ["National Institute on Aging", "Healthy aging"],
    sourceUrl: "https://www.nia.nih.gov/health/healthy-aging",
    sourceType: "medical",
    sourceYear: "2026",
  },
  {
    includes: ["NIMH", "Older Adults and Mental Health"],
    sourceUrl: "https://www.nimh.nih.gov/health/topics/older-adults-and-mental-health",
    sourceType: "medical",
    sourceYear: "2026",
  },
  {
    includes: ["고령자고용법"],
    sourceUrl:
      "https://www.law.go.kr/LSW/lsSc.do?query=%EA%B3%A0%EC%9A%A9%EC%83%81%20%EC%97%B0%EB%A0%B9%EC%B0%A8%EB%B3%84%EA%B8%88%EC%A7%80%20%EB%B0%8F%20%EA%B3%A0%EB%A0%B9%EC%9E%90%EA%B3%A0%EC%9A%A9%EC%B4%89%EC%A7%84%EC%97%90%20%EA%B4%80%ED%95%9C%20%EB%B2%95%EB%A5%A0",
    sourceType: "law",
    sourceYear: "2026",
  },
  {
    includes: ["고용노동부", "계속고용장려금"],
    sourceUrl: "https://www.moel.go.kr/policy/policydata/view.do?bbs_seq=20260201081",
    sourceType: "policy",
    sourceYear: "2026",
  },
  {
    includes: ["국가데이터처", "장래인구추계"],
    sourceUrl: "https://mods.go.kr/board.es?act=view&bid=207&list_no=428476&mid=a10301020600",
    sourceType: "official",
    sourceYear: "2023",
  },
  {
    includes: ["OECD", "Working Better with Age"],
    sourceUrl:
      "https://www.oecd.org/content/dam/oecd/en/publications/reports/2018/10/working-better-with-age-korea_g1g96de2/9789264208261-en.pdf",
    sourceType: "policy",
    sourceYear: "2018",
  },
  {
    includes: ["기간제 및 단시간근로자"],
    sourceUrl: "https://www.law.go.kr/LSW/lsInfoP.do?lsId=010356&urlMode=lsInfoP",
    sourceType: "law",
    sourceYear: "2026",
  },
  {
    includes: ["국가데이터처", "근로형태별"],
    sourceUrl: "https://www.kostat.go.kr/board.es?act=view&bid=210&list_no=438874&mid=a10301010000",
    sourceType: "official",
    sourceYear: "2025",
  },
  {
    includes: ["OECD", "labour market dualism"],
    sourceUrl:
      "https://www.oecd.org/en/publications/oecd-economic-surveys-korea-2024_c243e16a-en/full-report/responding-to-population-decline_7f6620e6.html",
    sourceType: "policy",
    sourceYear: "2024",
  },
  {
    includes: ["벵자맹 콩스탕", "Des réactions politiques"],
    sourceUrl: "https://gallica.bnf.fr/ark:/12148/bpt6k6267088v.texteImage",
    sourceType: "primary",
    sourceYear: "1796",
  },
  {
    includes: ["빅터 프랭클", "죽음의 수용소"],
    sourceUrl: "https://archive.org/details/viktor-emil-frankl-mans-search-for-meaning",
    sourceType: "primary",
    sourceYear: "1946",
  },
  {
    includes: ["빅터 프랭클", "관련 저작"],
    sourceUrl: "https://archive.org/details/viktor-emil-frankl-mans-search-for-meaning",
    sourceType: "interpretation",
    sourceYear: "1946",
  },
  {
    includes: ["에리히 프롬", "사랑의 기술"],
    sourceUrl: "https://archive.org/details/artofloving0000from",
    sourceType: "primary",
    sourceYear: "1956",
  },
  {
    includes: ["에리히 프롬", "관련 저작"],
    sourceUrl: "https://archive.org/details/artofloving0000from",
    sourceType: "interpretation",
    sourceYear: "1956",
  },
  {
    includes: ["마르틴 하이데거", "존재와 시간"],
    sourceUrl: "https://archive.org/details/beingtime0000heid",
    sourceType: "primary",
    sourceYear: "1927",
  },
  {
    includes: ["알프레드 아들러", "관련 저작"],
    sourceUrl: "https://archive.org/details/understandinghum00adlerich",
    sourceType: "interpretation",
    sourceYear: "1927",
  },
  {
    includes: ["알프레트 아들러", "인간 본성의 이해"],
    sourceUrl: "https://archive.org/details/understandinghum00adlerich",
    sourceType: "primary",
    sourceYear: "1927",
  },
  {
    includes: ["알프레드 아들러", "인간 본성의 이해"],
    sourceUrl: "https://archive.org/details/understandinghum00adlerich",
    sourceType: "primary",
    sourceYear: "1927",
  },
  {
    includes: ["아들러", "인간 본성의 이해"],
    sourceUrl: "https://archive.org/details/understandinghum00adlerich",
    sourceType: "primary",
    sourceYear: "1927",
  },
  {
    includes: ["알프레트 아들러", "미움받을 용기"],
    sourceUrl:
      "https://www.simonandschuster.com/books/The-Courage-to-Be-Disliked/Ichiro-Kishimi/9781668065969",
    sourceType: "publisher",
    sourceYear: "2013",
  },
  {
    includes: ["아들러", "미움받을 용기"],
    sourceUrl:
      "https://www.simonandschuster.com/books/The-Courage-to-Be-Disliked/Ichiro-Kishimi/9781668065969",
    sourceType: "publisher",
    sourceYear: "2013",
  },
  {
    includes: ["아들러", "관련 저작"],
    sourceUrl: "https://archive.org/details/understandinghum00adlerich",
    sourceType: "interpretation",
    sourceYear: "1927",
  },
  {
    includes: ["버트런드 러셀", "What I Believe"],
    sourceUrl: "https://www.gutenberg.org/ebooks/73782",
    sourceType: "primary",
    sourceYear: "1925",
  },
  {
    includes: ["버트런드 러셀", "행복의 정복"],
    sourceUrl: "https://archive.org/details/conquestofhappin0000bert_s7t7",
    sourceType: "primary",
    sourceYear: "1930",
  },
  {
    includes: ["틱낫한", "화(Anger)"],
    sourceUrl: "https://plumvillage.org/books/anger",
    sourceType: "publisher",
    sourceYear: "2001",
  },
  {
    includes: ["틱낫한", "관련 저작"],
    sourceUrl: "https://plumvillage.org/books/anger",
    sourceType: "interpretation",
    sourceYear: "2001",
  },
  {
    includes: ["틱낫한", "불교", "관련 저작"],
    sourceUrl: "https://plumvillage.app/mindful-anger/",
    sourceType: "interpretation",
    sourceYear: "2023",
  },
  {
    includes: ["마르쿠스 아우렐리우스", "관련 저작"],
    sourceUrl: "https://classics.mit.edu/Antoninus/meditations.html",
    sourceType: "interpretation",
    sourceYear: "2세기",
  },
  {
    includes: ["바뤼흐 스피노자", "관련 저작"],
    sourceUrl: "https://en.wikisource.org/wiki/Ethics_(Spinoza)",
    sourceType: "interpretation",
    sourceYear: "1677",
  },
  {
    includes: ["세네카", "마르키아"],
    sourceUrl: "https://en.wikisource.org/wiki/Of_Consolation:_To_Marcia",
    sourceType: "primary",
    sourceYear: "1세기",
  },
  {
    includes: ["세네카", "화에 대하여"],
    sourceUrl: "https://en.wikisource.org/wiki/Of_Anger",
    sourceType: "primary",
    sourceYear: "1세기",
  },
  {
    includes: ["세네카", "관련 저작"],
    sourceUrl: "https://en.wikisource.org/wiki/Author:Seneca",
    sourceType: "interpretation",
    sourceYear: "1세기",
  },
  {
    includes: ["쇼펜하우어", "관련 저작"],
    sourceUrl: "https://www.gutenberg.org/files/10715/10715-h/10715-h.htm",
    sourceType: "interpretation",
    sourceYear: "1851",
  },
  {
    includes: ["알랭 드 보통", "왜 나는 너를 사랑하는가"],
    sourceUrl: "https://www.alaindebotton.com/essays-in-love/",
    sourceType: "publisher",
    sourceYear: "1993",
  },
  {
    includes: ["알랭 드 보통", "관련 저작"],
    sourceUrl: "https://www.alaindebotton.com/essays-in-love/",
    sourceType: "interpretation",
    sourceYear: "1993",
  },
  {
    includes: ["카뮈", "관련 저작"],
    sourceUrl: "https://archive.org/details/mythofsisyphus00camu",
    sourceType: "interpretation",
    sourceYear: "1942",
  },
  {
    includes: ["알베르 카뮈", "관련 저작"],
    sourceUrl: "https://archive.org/details/mythofsisyphus00camu",
    sourceType: "interpretation",
    sourceYear: "1942",
  },
  {
    includes: ["키르케고르", "관련 저작"],
    sourceUrl: "https://archive.org/details/eitherorvolumefi0000sren",
    sourceType: "interpretation",
    sourceYear: "1843",
  },
  {
    includes: ["칸트", "윤리형이상학", "법론"],
    sourceUrl: "https://iep.utm.edu/death-penalty-capital-punishment/",
    sourceType: "interpretation",
    sourceYear: "1797",
  },
  {
    includes: ["칸트", "관련 저작"],
    sourceUrl: "https://www.gutenberg.org/files/5682/5682-h/5682-h.htm",
    sourceType: "interpretation",
    sourceYear: "1785",
  },
  {
    includes: ["필리프 판 파레이스", "Real Freedom for All"],
    sourceUrl: "https://philpapers.org/rec/VANRFF",
    sourceType: "research",
    sourceYear: "1995",
  },
  {
    includes: ["밀턴 프리드먼", "Capitalism and Freedom"],
    sourceUrl: "https://archive.org/details/capitalismfreedo0000frie",
    sourceType: "primary",
    sourceYear: "1962",
  },
  {
    includes: ["한나 아렌트", "인간의 조건"],
    sourceUrl: "https://archive.org/details/humancondition0000aren",
    sourceType: "primary",
    sourceYear: "1958",
  },
  {
    includes: ["한나 아렌트", "Labor, Work, Action"],
    sourceUrl: "https://plato.stanford.edu/entries/arendt/",
    sourceType: "interpretation",
    sourceYear: "1958",
  },
  {
    includes: ["한나 아렌트", "관련 저작"],
    sourceUrl: "https://plato.stanford.edu/entries/arendt/",
    sourceType: "interpretation",
    sourceYear: "1958",
  },
  {
    includes: ["Pew Research Center", "Cancel Culture"],
    sourceUrl:
      "https://www.pewresearch.org/internet/2021/05/19/americans-and-cancel-culture-where-some-see-calls-for-accountability-others-see-censorship-punishment/",
    sourceType: "research",
    sourceYear: "2021",
  },
  {
    includes: ["칼 포퍼", "열린사회와 그 적들"],
    sourceUrl: "https://archive.org/details/opensocietyitsen0000karl_p9x8",
    sourceType: "primary",
    sourceYear: "1945",
  },
  {
    includes: ["마사 누스바움", "Hiding from Humanity"],
    sourceUrl: "https://chicagounbound.uchicago.edu/books/118/",
    sourceType: "publisher",
    sourceYear: "2004",
  },
  {
    includes: ["마키아벨리", "군주론"],
    sourceUrl: "https://www.gutenberg.org/files/1232/1232-h/1232-h.htm",
    sourceType: "primary",
    sourceYear: "1532",
  },
  {
    includes: ["Adam Grant", "Give and Take"],
    sourceUrl: "https://adamgrant.net/book/give-and-take/",
    sourceType: "publisher",
    sourceYear: "2013",
  },
  {
    includes: ["마이클 샌델", "공정하다는 착각"],
    sourceUrl: "https://us.macmillan.com/books/9781250800060/thetyrannyofmerit/",
    sourceType: "publisher",
    sourceYear: "2020",
  },
  {
    includes: ["한병철", "피로사회"],
    sourceUrl: "https://www.sup.org/books/theory-and-philosophy/burnout-society",
    sourceType: "publisher",
    sourceYear: "2010",
  },
  {
    includes: ["현행 법제", "형법 제9조"],
    sourceUrl:
      "https://www.law.go.kr/LSW/lsInfoP.do?efYd=20260618&lsiSeq=270121#0000",
    sourceType: "law",
    sourceYear: "2026",
  },
  {
    includes: ["유엔 아동권리위원회", "General Comment No. 24"],
    sourceUrl:
      "https://www.ohchr.org/en/documents/general-comments-and-recommendations/general-comment-no-24-2019-childrens-rights-child",
    sourceType: "official",
    sourceYear: "2019",
  },
  {
    includes: ["초·중등교육법 시행령", "제31조"],
    sourceUrl: "https://www.law.go.kr/LSW/lsInfoP.do?lsId=005238",
    sourceType: "law",
    sourceYear: "2026",
  },
  {
    includes: ["유엔 아동권리위원회", "General Comment No. 8"],
    sourceUrl: "https://digitallibrary.un.org/record/583961?ln=en",
    sourceType: "official",
    sourceYear: "2006",
  },
  {
    includes: ["Gershoff & Grogan-Kaylor", "Spanking and Child Outcomes"],
    sourceUrl: "https://pubmed.ncbi.nlm.nih.gov/27055181/",
    sourceType: "research",
    sourceYear: "2016",
  },
  {
    includes: ["아리스토텔레스", "관련 저작"],
    sourceUrl: "https://classics.mit.edu/Aristotle/politics.html",
    sourceType: "interpretation",
    sourceYear: "기원전 4세기",
  },
];

function normalized(value) {
  return String(value || "").toLowerCase();
}

export function inferSourceMetadata(source, context = "") {
  const text = normalized(`${context} ${source}`);
  const rule = sourceRules.find((item) =>
    item.includes.every((token) => text.includes(normalized(token)))
  );

  if (!rule) return null;

  return {
    sourceUrl: rule.sourceUrl,
    sourceType: rule.sourceType,
    sourceTypeLabel: sourceTypeLabels[rule.sourceType] || rule.sourceType,
    sourceYear: rule.sourceYear,
  };
}

export function withSourceMetadata(card) {
  if (!card) return card;

  const inferred = card.source ? inferSourceMetadata(card.source, card.name) : null;
  const sourceType = card.sourceType || inferred?.sourceType;
  const lens = card.perspectiveLens
    ? lensForSlug(card.perspectiveLens)
    : lensForSourceType(sourceType);

  return {
    ...card,
    sourceUrl: card.sourceUrl || inferred?.sourceUrl,
    sourceType,
    sourceTypeLabel:
      card.sourceTypeLabel ||
      inferred?.sourceTypeLabel ||
      (sourceType ? sourceTypeLabels[sourceType] || sourceType : undefined),
    sourceYear: card.sourceYear || inferred?.sourceYear,
    perspectiveLens: card.perspectiveLens || lens?.slug,
    perspectiveLensLabel: card.perspectiveLensLabel || lens?.title,
    perspectiveLensShortLabel: card.perspectiveLensShortLabel || lens?.shortTitle,
  };
}
