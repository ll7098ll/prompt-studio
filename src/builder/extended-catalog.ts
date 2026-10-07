import type { Definition, Field } from "./catalog";
import { GALLERY_ITEMS } from "./image-collections";

const text = (key: string, label: string): Field => ({
  key,
  label,
  type: "text",
});
const lines = (key: string, label: string): Field => ({
  key,
  label,
  type: "textarea",
});
const number = (
  key: string,
  label: string,
  min: number,
  max: number,
): Field => ({ key, label, type: "number", min, max });
const titleBody = [text("title", "제목"), lines("body", "설명")];
const items = lines("items", "항목 · 한 줄에 하나");

export const EXTENDED_CATALOG: Definition[] = [
  {
    id: "avatar",
    name: "프로필 사진",
    category: "기본 요소",
    description: "이니셜과 이름으로 사람 표시",
    defaults: { name: "김민지", role: "프로덕트 디자이너", initials: "민지" },
    fields: [
      text("name", "이름"),
      text("role", "소개"),
      text("initials", "이니셜"),
    ],
  },
  {
    id: "avatar-group",
    name: "참여자 모음",
    category: "기본 요소",
    description: "함께하는 팀 구성원 표시",
    defaults: {
      items: "김민지\n이준호\n박서연\n최도윤",
      label: "4명이 함께하고 있어요",
    },
    fields: [items, text("label", "안내 문구")],
  },
  {
    id: "breadcrumbs",
    name: "현재 위치",
    category: "기본 요소",
    description: "홈부터 현재 페이지까지 경로",
    defaults: { items: "홈\n프로젝트\n디자인 시스템" },
    fields: [items],
  },
  {
    id: "search",
    name: "검색창",
    category: "기본 요소",
    description: "입력한 말로 샘플 목록 검색",
    defaults: {
      label: "프로젝트 검색",
      placeholder: "찾고 싶은 내용을 입력하세요",
      items: "브랜드 디자인\n웹사이트 리뉴얼\n모바일 앱\n디자인 시스템",
    },
    fields: [
      text("label", "검색 제목"),
      text("placeholder", "입력 안내"),
      items,
    ],
  },
  {
    id: "textarea",
    name: "긴 글 입력",
    category: "기본 요소",
    description: "문의나 설명을 여러 줄로 입력",
    defaults: {
      label: "메시지",
      placeholder: "어떤 이야기를 나누고 싶으신가요?",
      rows: 4,
    },
    fields: [
      text("label", "제목"),
      text("placeholder", "입력 안내"),
      number("rows", "입력 줄 수", 2, 12),
    ],
  },
  {
    id: "radio",
    name: "하나 선택",
    category: "기본 요소",
    description: "여러 선택지 중 하나만 선택",
    defaults: { label: "어떤 작업을 하시나요?", items: "디자인\n개발\n기획" },
    fields: [text("label", "질문"), items],
  },
  {
    id: "range",
    name: "값 조절",
    category: "기본 요소",
    description: "슬라이더를 움직여 숫자 조절",
    defaults: { label: "볼륨", value: 60, unit: "%" },
    fields: [
      text("label", "제목"),
      number("value", "초기 값", 0, 100),
      text("unit", "단위"),
    ],
  },
  {
    id: "progress",
    name: "진행률",
    category: "기본 요소",
    description: "완료한 정도를 막대로 표시",
    defaults: {
      label: "이번 주 목표",
      value: 72,
      body: "차근차근 목표에 가까워지고 있어요",
    },
    fields: [
      text("label", "제목"),
      number("value", "진행률", 0, 100),
      text("body", "설명"),
    ],
  },
  {
    id: "steps",
    name: "단계 안내",
    category: "패턴",
    description: "현재 단계와 다음 순서를 표시",
    defaults: { items: "정보 입력\n내용 확인\n완료", current: 2 },
    fields: [items, number("current", "현재 단계", 1, 12)],
  },
  {
    id: "pagination",
    name: "목록 페이지",
    category: "패턴",
    description: "긴 목록의 페이지를 선택",
    defaults: { pages: 5, current: 1 },
    fields: [
      number("pages", "전체 페이지 수", 1, 20),
      number("current", "시작 페이지", 1, 20),
    ],
  },
  {
    id: "skeleton",
    name: "로딩 자리",
    category: "기본 요소",
    description: "내용이 도착하기 전 자리 표시",
    defaults: { lines: 3 },
    fields: [number("lines", "본문 줄 수", 1, 8)],
  },
  {
    id: "tooltip",
    name: "짧은 도움말",
    category: "패턴",
    description: "마우스나 키보드로 설명 확인",
    defaults: {
      label: "공유 범위 안내",
      body: "링크를 받은 사람만 이 화면을 확인할 수 있습니다.",
    },
    fields: [text("label", "도움말 버튼"), lines("body", "도움말 내용")],
  },
  {
    id: "dropdown",
    name: "펼침 메뉴",
    category: "패턴",
    description: "버튼을 눌러 작업 목록 펼치기",
    defaults: { label: "작업 선택", items: "복사하기\n이름 바꾸기\n보관하기" },
    fields: [text("label", "버튼 문구"), items],
  },
  {
    id: "dialog",
    name: "팝업 창",
    category: "패턴",
    description: "버튼으로 열고 닫는 안내 창",
    defaults: {
      label: "자세히 보기",
      title: "새로운 소식을 전합니다",
      body: "중요한 안내나 확인할 내용을 이곳에 담으세요.",
      confirm: "확인했어요",
    },
    fields: [
      text("label", "열기 버튼"),
      ...titleBody,
      text("confirm", "닫기 버튼"),
    ],
  },
  {
    id: "toast",
    name: "잠깐 알림",
    category: "패턴",
    description: "작업 뒤 알림을 띄우고 닫기",
    defaults: {
      label: "알림 확인하기",
      title: "변경 사항을 저장했어요",
      body: "미리보기용 알림입니다.",
    },
    fields: [text("label", "버튼 문구"), ...titleBody],
  },
  {
    id: "timeline",
    name: "시간순 기록",
    category: "패턴",
    description: "과정과 소식을 시간순으로 정리",
    defaults: {
      title: "우리가 걸어온 길",
      items:
        "2024|첫 아이디어|작은 팀으로 시작했어요.\n2025|첫 번째 출시|고객과 함께 방향을 찾았어요.\n2026|새로운 도전|더 큰 가능성을 만들어가요.",
    },
    fields: [
      text("title", "제목"),
      lines("items", "시간|제목|설명 · 한 줄에 하나"),
    ],
  },
  {
    id: "bar-chart",
    name: "막대 그래프",
    category: "패턴",
    description: "항목별 숫자를 비교하는 차트",
    defaults: {
      title: "주간 활동",
      items: "월|35\n화|68\n수|52\n목|89\n금|74",
      unit: "건",
    },
    fields: [
      text("title", "제목"),
      lines("items", "항목|숫자 · 한 줄에 하나"),
      text("unit", "단위"),
    ],
  },
  {
    id: "donut-chart",
    name: "비율 그래프",
    category: "패턴",
    description: "목표 달성 비율을 원으로 표시",
    defaults: { title: "목표 달성", value: 76, label: "이번 달" },
    fields: [
      text("title", "제목"),
      number("value", "비율", 0, 100),
      text("label", "설명"),
    ],
  },
  {
    id: "logos",
    name: "파트너 로고",
    category: "화면 구역",
    description: "함께하는 브랜드 이름을 모으기",
    defaults: {
      title: "좋은 팀들과 함께합니다",
      items: "FORMA\nOrbit\nLUMEN\nAcme\nMonday",
    },
    fields: [text("title", "안내 문구"), items],
  },
  {
    id: "team",
    name: "팀원 소개",
    category: "패턴",
    description: "이름과 역할로 팀을 소개",
    defaults: {
      name: "김서윤",
      role: "Creative Director",
      body: "복잡한 문제를 단순하고 아름다운 경험으로 만듭니다.",
      initials: "서윤",
    },
    fields: [
      text("name", "이름"),
      text("role", "역할"),
      lines("body", "소개"),
      text("initials", "이니셜"),
    ],
  },
  {
    id: "product",
    name: "상품 카드",
    category: "패턴",
    description: "상품과 가격을 소개하는 카드",
    defaults: {
      title: "Everyday Chair",
      body: "일상에 편안함을 더하는 디자인",
      price: "₩129,000",
      badge: "NEW",
      label: "상품 살펴보기",
    },
    fields: [
      ...titleBody,
      text("price", "가격"),
      text("badge", "상태 문구"),
      text("label", "버튼 문구"),
    ],
  },
  {
    id: "newsletter",
    name: "구독 신청",
    category: "화면 구역",
    description: "이메일을 입력받는 구독 화면",
    defaults: {
      title: "좋은 소식을 가장 먼저",
      body: "한 달에 한 번, 꼭 필요한 이야기만 전할게요.",
      label: "구독하기",
    },
    fields: [...titleBody, text("label", "버튼 문구")],
  },
  {
    id: "contact",
    name: "문의 양식",
    category: "화면 구역",
    description: "이름·이메일·문의 내용 입력",
    defaults: {
      title: "함께 이야기해요",
      body: "프로젝트나 궁금한 점을 남겨주세요.",
      label: "문의 보내기",
    },
    fields: [...titleBody, text("label", "버튼 문구")],
  },
  {
    id: "marquee",
    name: "흐르는 문구",
    category: "화면 구역",
    description: "브랜드 메시지를 가로로 반복",
    defaults: { items: "CREATE\nEXPLORE\nMAKE IT YOURS", animate: false },
    fields: [items, { key: "animate", label: "움직임 켜기", type: "toggle" }],
  },
  {
    id: "spotlight",
    name: "대형 타이포",
    category: "화면 구역",
    description: "큰 글자와 그래픽으로 강렬한 소개",
    defaults: {
      eyebrow: "IDEAS WITHOUT LIMITS",
      title: "MAKE\nSOMETHING\nMATTER.",
      body: "당신만의 관점으로 새로운 가능성을 만드세요.",
      label: "프로젝트 시작하기",
      treatment: "gradient",
    },
    fields: [
      text("eyebrow", "상단 문구"),
      ...titleBody,
      text("label", "버튼 문구"),
      {
        key: "treatment",
        label: "그래픽 분위기",
        type: "select",
        options: ["gradient", "brutal", "retro", "collage"],
      },
    ],
  },
  {
    id: "gallery",
    collections: { items: { ...GALLERY_ITEMS, legacy: { prop: "items", keys: ["title", "category"] } } },
    name: "작업 갤러리",
    category: "화면 구역",
    description: "이미지 자리와 제목으로 작품 소개",
    defaults: {
      title: "선택한 작업들",
      items:
        "브랜드 아이덴티티|Branding\n새로운 시선|Digital\n일상의 발견|Editorial",
    },
    fields: [text("title", "제목"), lines("items", "제목|분류 · 한 줄에 하나")],
  },
  {
    id: "chat",
    name: "대화 화면",
    category: "패턴",
    description: "메시지를 보내보는 대화 예시",
    defaults: {
      title: "무엇을 도와드릴까요?",
      greeting: "안녕하세요! 궁금한 점을 남겨주세요.",
      reply: "메시지를 확인했어요. 이것은 샘플 응답입니다.",
    },
    fields: [
      text("title", "제목"),
      lines("greeting", "첫 메시지"),
      lines("reply", "샘플 응답"),
    ],
  },
  {
    id: "calendar",
    name: "날짜 선택",
    category: "패턴",
    description: "월을 넘기고 날짜를 고르는 달력",
    defaults: { title: "일정 선택", month: "2026-10" },
    fields: [text("title", "제목"), text("month", "시작 월 · YYYY-MM")],
  },
];
