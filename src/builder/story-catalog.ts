import type { Definition, Field } from "./catalog";
const text = (key: string, label: string): Field => ({
  key,
  label,
  type: "text",
});
const choice = (key: string, label: string, options: string[]): Field => ({
  key,
  label,
  type: "select",
  options,
});
export const STORY_CATALOG: Definition[] = [
  {
    id: "scroll-chapters",
    name: "챕터 탐색",
    category: "탐색",
    source: "Prompt Studio",
    description: "페이지의 요소로 이동하고 읽고 있는 챕터를 표시",
    defaults: {
      title: "이야기의 순서",
      sticky: true,
      offset: 24,
      progress: true,
    },
    fields: [
      text("title", "탐색 제목"),
      { key: "sticky", label: "스크롤 중 상단 고정", type: "toggle" },
      {
        key: "offset",
        label: "상단 여백 · px",
        type: "number",
        min: 0,
        max: 300,
      },
      { key: "progress", label: "읽기 진행 표시", type: "toggle" },
    ],
    collections: {
      chapters: {
        label: "챕터 연결",
        defaults: { label: "새 챕터", target: "" },
        fields: [
          text("label", "챕터 이름"),
          { key: "target", label: "이동할 요소", type: "node-ref" },
        ],
        initial: [
          { label: "시작" },
          { label: "디테일" },
          { label: "다음 이야기" },
        ],
      },
    },
  },
  {
    id: "multi-step-form",
    name: "여러 단계 폼",
    category: "입력·폼",
    source: "Prompt Studio",
    description: "단계·질문을 구성하고 필수값 검사와 이전·다음을 체험",
    defaults: {
      title: "함께 시작해요",
      description: "몇 가지 질문으로 필요한 내용을 정리하세요.",
      initialStep: 1,
      nextLabel: "다음",
      previousLabel: "이전",
      submitLabel: "완료",
      successTitle: "입력 내용을 확인했어요",
      successBody:
        "아래 내용을 확인하세요. 이 예시 폼은 외부로 전송하지 않습니다.",
    },
    fields: [
      text("title", "폼 제목"),
      text("description", "폼 설명"),
      {
        key: "initialStep",
        label: "처음 표시할 단계",
        type: "number",
        min: 1,
        max: 100,
      },
      text("nextLabel", "다음 버튼"),
      text("previousLabel", "이전 버튼"),
      text("submitLabel", "완료 버튼"),
      text("successTitle", "완료 제목"),
      { key: "successBody", label: "완료 설명", type: "textarea" },
    ],
    collections: {
      steps: {
        label: "폼 단계",
        defaults: { title: "새 단계", description: "" },
        fields: [text("title", "단계 이름"), text("description", "단계 설명")],
        initial: [
          { title: "소개", description: "연락받을 정보를 알려주세요." },
          { title: "관심사", description: "원하는 방향을 골라주세요." },
        ],
      },
      fields: {
        label: "폼 질문",
        defaults: {
          label: "새 질문",
          step: "",
          kind: "text",
          placeholder: "",
          help: "",
          required: false,
          options: "선택 1\n선택 2",
        },
        fields: [
          text("label", "질문"),
          {
            key: "step",
            label: "소속 단계",
            type: "item-ref",
            refCollection: "steps",
          },
          choice("kind", "입력 종류", [
            "text",
            "email",
            "tel",
            "number",
            "textarea",
            "select",
            "checkbox",
          ]),
          text("placeholder", "입력 힌트"),
          text("help", "도움말"),
          { key: "required", label: "필수 입력", type: "toggle" },
          {
            key: "options",
            label: "선택 목록 · 한 줄에 하나",
            type: "textarea",
          },
        ],
        initial: [
          { label: "이름", step: "@steps.1", required: true },
          { label: "이메일", step: "@steps.1", kind: "email", required: true },
          {
            label: "관심 분야",
            step: "@steps.2",
            kind: "select",
            options: "웹 디자인\n브랜딩\n모션 그래픽",
            required: true,
          },
          { label: "추가 이야기", step: "@steps.2", kind: "textarea" },
        ],
      },
    },
  },
  {
    id: "rich-text",
    name: "서식 본문",
    category: "콘텐츠",
    source: "Prompt Studio",
    description: "문단·제목·목록·인용과 굵게·기울임·링크를 블록별로 편집",
    defaults: { width: 720 },
    fields: [
      {
        key: "width",
        label: "본문 최대 너비 · px",
        type: "number",
        min: 200,
        max: 1600,
      },
    ],
    collections: {
      blocks: {
        label: "본문 블록",
        defaults: {
          title: "새 문단",
          kind: "paragraph",
          level: "h2",
          text: "문장을 입력하세요.",
        },
        fields: [
          text("title", "편집용 이름"),
          choice("kind", "블록 종류", [
            "paragraph",
            "heading",
            "bullet",
            "number",
            "quote",
          ]),
          choice("level", "제목 단계", ["h2", "h3", "h4"]),
          { key: "text", label: "본문", type: "rich" },
        ],
        initial: [
          {
            title: "제목",
            kind: "heading",
            text: "작은 디테일에서 시작하는 이야기",
          },
          {
            title: "소개",
            text: "**중요한 문장**과 *부드러운 강조*, `짧은 코드`를 함께 표현하세요.",
          },
          {
            title: "첫 번째 원칙",
            kind: "bullet",
            text: "내용을 짧고 명확하게 나눕니다.",
          },
          {
            title: "두 번째 원칙",
            kind: "bullet",
            text: "각 블록의 외형과 순서를 자유롭게 바꿉니다.",
          },
          {
            title: "인용",
            kind: "quote",
            text: "좋은 이야기는 읽는 사람의 속도를 존중합니다.",
          },
        ],
      },
    },
  },
];
