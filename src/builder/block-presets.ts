import type { Definition } from "./catalog";
import type { Recipe } from "./more-catalog";

const families = [
  ["hero", "히어로", ["heading", "text", "button", "decoration"]],
  ["navigation", "헤더·탐색", ["navbar", "breadcrumbs", "mega-menu"]],
  ["features", "기능 소개", ["feature", "feature", "feature"]],
  ["pricing", "요금제", ["pricing", "pricing", "pricing"]],
  ["reviews", "고객 후기", ["testimonial", "testimonial", "testimonial"]],
  ["faq", "자주 묻는 질문", ["heading", "accordion", "button"]],
  ["cta", "행동 유도", ["heading", "text", "input", "button"]],
  [
    "auth",
    "회원가입·로그인",
    ["heading", "input", "password-input", "checkbox", "button"],
  ],
  ["dashboard", "대시보드", ["stat", "line-chart", "area-chart", "table"]],
  [
    "settings",
    "설정·프로필",
    ["avatar", "input", "switch", "select", "button"],
  ],
  ["commerce", "쇼핑", ["product", "product", "product", "button"]],
  ["content", "콘텐츠·푸터", ["heading", "text", "card", "footer"]],
] as const;
const structures = [
  "세로 스토리",
  "균형 그리드",
  "좌우 분할",
  "역순 분할",
  "넓은 포커스",
  "컴팩트 패널",
];
function recipe(ids: readonly string[], variant: number): Recipe[] {
  const children: Recipe[] = ids.map((component, i):Recipe => ({
    component,
    ...(component === "pricing"
      ? {
          props: {
            title: ["Starter", "Pro", "Team"][i],
            price: ["무료", "₩19,000", "₩49,000"][i],
            featured: i === 1,
          },
        }
      : {}),
    ...(component === "feature"
      ? {
          props: {
            title: ["빠른 시작", "유연한 편집", "팀과 함께"][i],
            body: [
              "아이디어를 바로 화면으로 옮기세요.",
              "배치와 디자인을 원하는 만큼 조정하세요.",
              "완성한 화면과 설계 자료를 공유하세요.",
            ][i],
          },
        }
      : {}),
    ...(component === "testimonial"
      ? {
          props: {
            name: ["김서윤", "이도현", "박지우"][i],
            role: ["프로덕트 디자이너", "프론트엔드 개발자", "프로젝트 매니저"][
              i
            ],
          },
        }
      : {}),
    ...(component === "product"
      ? {
          props: {
            title: ["Everyday Chair", "Studio Lamp", "Quiet Desk"][i],
            price: ["₩129,000", "₩79,000", "₩249,000"][i],
          },
        }
      : {}),
    layout: {
      widthMode: "fill",
      ...(component === "card" ? { padding: 24 } : {}),
      ...(variant === 4 && i === 0 ? { span: 2 } : {}),
    },
    ...(component === "card"
      ? {
          children: [
            {
              component: "heading",
              props: { text: "이야기를 시작하세요", level: "h3" },
            },
            { component: "text" },
          ],
        }
      : {}),
  }));
  if (variant === 3) children.reverse();
  if (variant === 0 || variant === 5)
    return [
      {
        component: "stack",
        layout: {
          direction: "column",
          gap: variant === 5 ? 12 : 28,
          padding: variant === 5 ? 24 : 8,
          ...(variant === 5
            ? { fillColor: "theme:soft", cornerRadius: 20, maxWidth: 640 }
            : {}),
        },
        children,
      },
    ];
  if (variant === 2 || variant === 3)
    return [
      {
        component: "grid",
        layout: { columns: 2, gap: 32 },
        children: [
          { component: "stack", children: children.slice(0, 1) },
          { component: "stack", children: children.slice(1) },
        ],
      },
    ];
  return [
    {
      component: "grid",
      layout: { columns: variant === 4 ? 2 : 3, gap: 24 },
      children,
    },
  ];
}
export const BLOCK_PRESETS: Definition[] = families.flatMap(([id, name, ids]) =>
  structures.map((structure, i) => ({
    id: `block-${id}-${i + 1}`,
    name: `${name} · ${structure}`,
    category: "블록",
    source: "블록",
    description: `${name}에 맞춘 ${structure}. 내부 요소를 각각 편집할 수 있습니다.`,
    container: true,
    defaults: {},
    fields: [],
    initialLayout: { padding: 32, gap: 24, widthMode: "fill" },
    recipe: recipe(ids, i),
  })),
);
export const BLOCK_FAMILIES = families.map(([id, name]) => ({ id, name }));
