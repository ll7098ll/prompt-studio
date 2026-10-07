import { EXTENDED_CATALOG } from "./extended-catalog";
import { MORE_CATALOG, type Recipe } from "./more-catalog";
import { ADVANCED_CATALOG } from "./advanced-catalog";
import { BLOCK_PRESETS } from "./block-presets";
import { MEDIA_CATALOG } from "./media-catalog";
import { STORY_CATALOG } from "./story-catalog";
import { SCENE_CATALOG } from "./scene-catalog";
import type { Asset } from "./asset-model";
import type { Layout } from "./model";

export type Field = {
  key: string;
  label: string;
  type: "text" | "textarea" | "number" | "toggle" | "select" | "asset" | "node-ref" | "item-ref" | "rich";
  refCollection?: string;
  assetKinds?: Asset["kind"][];
  options?: string[];
  min?: number;
  max?: number;
};
export type Prop = string | number | boolean;
export type Collection = {
  label: string;
  fields: Field[];
  defaults: Record<string, Prop>;
  initial?: Record<string, Prop>[];
  legacy?: { prop: string; keys: string[] };
};
export type Definition = {
  id: string;
  name: string;
  category: string;
  description: string;
  container?: boolean;
  defaults: Record<string, Prop>;
  fields: Field[];
  /** Fields introduced after existing documents; omission preserves old behavior. */
  optionalProps?: string[];
  initialLayout?: Partial<Layout>;
  recipe?: Recipe[];
  source?: string;
  collections?: Record<string, Collection>;
};
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
const choice = (key: string, label: string, options: string[]): Field => ({
  key,
  label,
  type: "select",
  options,
});
const titleBody = [text("title", "제목"), lines("body", "설명")];

export const CATALOG: Definition[] = [
  {
    id: "decoration",
    name: "장식 요소",
    category: "기본 요소",
    description: "히어로 그래픽과 아이콘 장식",
    defaults: {
      kind: "hero",
      icon: "layers",
      text: "작은 시작, 큰 변화",
      detail: "+128% ↗",
    },
    fields: [
      choice("kind", "장식 종류", ["hero", "icon", "eyebrow", "stat-detail"]),
      text("icon", "아이콘"),
      text("text", "문구"),
      text("detail", "보조 문구"),
    ],
  },
  {
    id: "frame",
    name: "자유 배치 영역",
    category: "구조",
    description: "PPT처럼 요소를 원하는 위치에 놓는 영역",
    container: true,
    defaults: {},
    fields: [],
  },
  {
    id: "group",
    name: "그룹",
    category: "구조",
    description: "여러 요소를 함께 이동하고 편집",
    container: true,
    defaults: {},
    fields: [],
  },
  {
    id: "shape",
    name: "도형",
    category: "기본 요소",
    description: "사각형·원·선으로 화면을 꾸미기",
    defaults: { kind: "rectangle" },
    fields: [choice("kind", "도형 종류", ["rectangle", "ellipse", "line"])],
  },
  {
    id: "page",
    name: "페이지",
    category: "구조",
    description: "페이지 전체",
    container: true,
    defaults: {},
    fields: [],
  },
  {
    id: "section",
    name: "섹션",
    category: "구조",
    description: "넓은 화면 구역",
    container: true,
    defaults: {},
    fields: [],
  },
  {
    id: "stack",
    name: "스택",
    category: "구조",
    description: "가로 또는 세로로 요소 배치",
    container: true,
    defaults: {},
    fields: [],
  },
  {
    id: "grid",
    name: "그리드",
    category: "구조",
    description: "반응형 다중 열 레이아웃",
    container: true,
    defaults: {},
    fields: [],
  },
  {
    id: "heading",
    name: "제목",
    category: "기본 요소",
    description: "명확한 시각적 계층",
    defaults: { text: "새로운 가능성을 만드세요", level: "h2" },
    fields: [
      text("text", "텍스트"),
      choice("level", "제목 단계", ["h1", "h2", "h3"]),
    ],
  },
  {
    id: "text",
    name: "본문",
    category: "기본 요소",
    description: "읽기 편한 본문 텍스트",
    defaults: {
      text: "아이디어를 화면으로 옮기는 가장 자연스러운 방법입니다.",
    },
    fields: [lines("text", "텍스트")],
  },
  {
    id: "button",
    name: "버튼",
    category: "기본 요소",
    description: "기본 · 보조 · 텍스트 버튼",
    defaults: {
      label: "시작하기",
      variant: "primary",
      state: "default",
      href: "",
    },
    fields: [
      text("label", "버튼 문구"),
      choice("variant", "스타일", ["primary", "secondary", "ghost"]),
      choice("state", "상태", ["default", "loading", "disabled"]),
      text("href", "링크 또는 #요소ID"),
    ],
  },
  {
    id: "badge",
    name: "배지",
    category: "기본 요소",
    description: "작은 라벨과 상태 표시",
    defaults: { text: "새로운 소식", tone: "brand" },
    fields: [
      text("text", "문구"),
      choice("tone", "색상", ["brand", "neutral", "success"]),
    ],
  },
  {
    id: "input",
    name: "입력 필드",
    category: "기본 요소",
    description: "레이블이 있는 입력창",
    defaults: {
      label: "이메일",
      placeholder: "you@example.com",
      type: "email",
      required: false,
    },
    fields: [
      text("label", "레이블"),
      text("placeholder", "플레이스홀더"),
      choice("type", "입력 형식", ["text", "email", "password"]),
      { key: "required", label: "필수 입력", type: "toggle" },
    ],
  },
  {
    id: "checkbox",
    name: "체크박스",
    category: "기본 요소",
    description: "다중 선택과 동의",
    defaults: { label: "업데이트 소식을 받겠습니다", checked: false },
    fields: [
      text("label", "레이블"),
      { key: "checked", label: "기본 선택", type: "toggle" },
    ],
  },
  {
    id: "switch",
    name: "스위치",
    category: "기본 요소",
    description: "설정 켜고 끄기",
    defaults: { label: "이메일 알림", checked: true },
    fields: [
      text("label", "레이블"),
      { key: "checked", label: "기본 선택", type: "toggle" },
    ],
  },
  {
    id: "select",
    name: "선택 메뉴",
    category: "기본 요소",
    description: "목록에서 하나 선택",
    defaults: { label: "작업 유형", items: "디자인\n개발\n기획" },
    fields: [text("label", "레이블"), lines("items", "항목 · 한 줄에 하나")],
  },
  {
    id: "divider",
    name: "구분선",
    category: "기본 요소",
    description: "콘텐츠 사이 구분",
    defaults: {},
    fields: [],
  },
  {
    id: "image",
    name: "이미지",
    category: "기본 요소",
    description: "비율을 유지하는 이미지",
    defaults: { src: "", alt: "이미지 설명", ratio: "16/9" },
    fields: [
      { key: "src", label: "이미지", type: "asset", assetKinds: ["image"] },
      text("alt", "대체 텍스트"),
      choice("ratio", "비율", ["16/9", "4/3", "1/1", "3/4"]),
    ],
  },
  {
    id: "card",
    name: "카드",
    category: "패턴",
    description: "자유롭게 조립하는 콘텐츠 카드",
    container: true,
    defaults: {},
    fields: [],
  },
  {
    id: "feature",
    name: "기능 카드",
    category: "패턴",
    description: "아이콘과 짧은 설명",
    defaults: {
      title: "생각이 곧 시작입니다",
      body: "복잡한 과정은 줄이고 중요한 일에 집중하세요.",
      icon: "sparkles",
    },
    fields: [
      ...titleBody,
      choice("icon", "아이콘", [
        "sparkles",
        "layers",
        "bolt",
        "globe",
        "shield",
        "chart",
      ]),
    ],
  },
  {
    id: "stat",
    name: "지표 카드",
    category: "패턴",
    description: "숫자와 변화 추이",
    defaults: {
      label: "활성 사용자",
      value: "24,892",
      change: "+12.8%",
      body: "지난달 대비",
    },
    fields: [
      text("label", "지표명"),
      text("value", "값"),
      text("change", "변화"),
      text("body", "설명"),
    ],
  },
  {
    id: "tabs",
    name: "탭",
    category: "패턴",
    description: "키보드로 전환하는 콘텐츠",
    defaults: {
      items:
        "개요|모든 정보를 한곳에서 확인하세요.\n분석|핵심 지표를 살펴보세요.\n설정|내게 맞게 조정하세요.",
    },
    fields: [lines("items", "제목|내용 · 한 줄에 하나")],
  },
  {
    id: "accordion",
    name: "아코디언",
    category: "패턴",
    description: "접고 펼치는 질문과 답변",
    defaults: {
      items:
        "어떻게 시작하나요?|템플릿을 선택하고 자유롭게 수정하세요.\n모바일에서도 볼 수 있나요?|화면 크기에 맞춰 자연스럽게 배치됩니다.\n내용을 변경할 수 있나요?|모든 텍스트와 디자인을 편집할 수 있습니다.",
    },
    fields: [lines("items", "질문|답변 · 한 줄에 하나")],
  },
  {
    id: "alert",
    name: "알림",
    category: "패턴",
    description: "안내 · 성공 · 오류 메시지",
    defaults: {
      title: "변경 사항을 저장했습니다",
      body: "언제든 다시 수정할 수 있습니다.",
      tone: "success",
    },
    fields: [
      ...titleBody,
      choice("tone", "종류", ["info", "success", "error"]),
    ],
  },
  {
    id: "table",
    name: "데이터 표",
    category: "패턴",
    description: "정렬 가능한 데이터 목록",
    defaults: {
      title: "최근 프로젝트",
      columns: "프로젝트|상태|담당자|업데이트",
      rows: "브랜드 웹사이트|진행 중|김민지|오늘\n모바일 대시보드|검토 중|이준호|어제\n디자인 시스템|완료|박서연|10월 1일",
      state: "default",
    },
    fields: [
      text("title", "제목"),
      text("columns", "열 제목 · |로 구분"),
      lines("rows", "행 · |로 열 구분"),
      choice("state", "상태", ["default", "loading", "empty", "error"]),
    ],
  },
  {
    id: "pricing",
    name: "요금제 카드",
    category: "패턴",
    description: "가격과 제공 기능",
    defaults: {
      title: "Pro",
      price: "₩19,000",
      period: "/ 월",
      body: "더 큰 아이디어를 위한 모든 것",
      items: "무제한 프로젝트\n맞춤 테마\n팀 공유",
      label: "플랜 선택",
      featured: true,
    },
    fields: [
      ...titleBody,
      text("price", "가격"),
      text("period", "기간"),
      lines("items", "제공 기능"),
      text("label", "버튼 문구"),
      { key: "featured", label: "추천 플랜", type: "toggle" },
    ],
  },
  {
    id: "testimonial",
    name: "후기",
    category: "패턴",
    description: "고객의 경험을 담는 카드",
    defaults: {
      quote: "머릿속에 있던 아이디어를 팀과 바로 공유할 수 있게 됐어요.",
      name: "김서윤",
      role: "프로덕트 디자이너",
    },
    fields: [
      lines("quote", "후기"),
      text("name", "이름"),
      text("role", "직함"),
    ],
  },
  {
    id: "empty",
    name: "빈 상태",
    category: "패턴",
    description: "첫 행동을 안내하는 화면",
    defaults: {
      title: "아직 프로젝트가 없어요",
      body: "첫 프로젝트를 만들고 아이디어를 시작하세요.",
    },
    fields: titleBody,
  },
  {
    id: "navbar",
    name: "내비게이션",
    category: "화면 구역",
    description: "브랜드와 반응형 메뉴",
    defaults: {
      brand: "Forma",
      items: "기능\n활용 방법\n가격",
      label: "시작하기",
    },
    fields: [
      text("brand", "브랜드"),
      lines("items", "메뉴 항목"),
      text("label", "버튼 문구"),
    ],
  },
  {
    id: "hero",
    name: "히어로",
    category: "화면 구역",
    description: "첫 화면의 메시지와 시각 요소",
    defaults: {
      eyebrow: "YOUR NEXT CHAPTER",
      title: "좋은 아이디어가\n멋진 시작이 되도록.",
      body: "복잡한 도구는 내려놓고, 당신의 다음 가능성에 집중하세요. 생각을 연결하고 함께 더 나은 결과를 만듭니다.",
      label: "무료로 시작하기",
      secondary: "자세히 알아보기",
      visual: true,
    },
    fields: [
      text("eyebrow", "상단 문구"),
      ...titleBody,
      text("label", "주 버튼"),
      text("secondary", "보조 버튼"),
      { key: "visual", label: "시각 요소 표시", type: "toggle" },
    ],
  },
  {
    id: "sidebar",
    name: "사이드바",
    category: "화면 구역",
    description: "앱 탐색과 작업 공간",
    defaults: { brand: "Forma", items: "대시보드\n프로젝트\n분석\n팀\n설정" },
    fields: [text("brand", "브랜드"), lines("items", "메뉴 항목")],
  },
  {
    id: "cta",
    name: "행동 유도",
    category: "화면 구역",
    description: "분명한 다음 단계",
    defaults: {
      title: "당신의 다음 아이디어를 기다립니다.",
      body: "작은 시작이 큰 변화를 만듭니다.",
      label: "지금 시작하기",
    },
    fields: [...titleBody, text("label", "버튼 문구")],
  },
  {
    id: "footer",
    name: "푸터",
    category: "화면 구역",
    description: "브랜드와 하단 링크",
    defaults: {
      brand: "Forma",
      body: "Built for your next idea.",
      items: "소개\n문의\n개인정보 처리방침",
    },
    fields: [
      text("brand", "브랜드"),
      text("body", "설명"),
      lines("items", "링크 문구"),
    ],
  },
  ...EXTENDED_CATALOG,
  ...MORE_CATALOG,
  ...ADVANCED_CATALOG,
  ...BLOCK_PRESETS,
  ...MEDIA_CATALOG,
  ...STORY_CATALOG,
  ...SCENE_CATALOG,
];
export const DEFINITIONS = Object.fromEntries(
  CATALOG.map((item) => [item.id, item]),
);
export const CATEGORIES = [
  "전체",
  "기본 요소",
  "패턴",
  "화면 구역",
  "구조",
  "입력·폼",
  "탐색",
  "데이터",
  "커머스",
  "콘텐츠",
  "미디어",
  "장면",
];
