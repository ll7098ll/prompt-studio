import {
  blankProject,
  createNode,
  type Project,
  type Node,
  uid,
} from "./model";
import type { Prop } from "./catalog";
import { PACK_TEMPLATES, applyPackTemplate } from './pack-templates';
import {
  applyRecipe,
  EXTRA_TEMPLATES,
  type TemplateInfo,
} from "./template-recipes";

export const TEMPLATES: TemplateInfo[] = [
  {
    id: "free-canvas",
    name: "자유 캔버스",
    description: "PPT처럼 끌어서 원하는 위치에 배치",
    tag: "FREE CANVAS",
    color: "#eeecff",
    category: "빈 화면",
    trends: ["자유 배치"],
  },
  {
    id: "landing",
    name: "브랜드 랜딩",
    description: "첫인상부터 다음 행동까지",
    tag: "MARKETING",
    color: "#eaf0e5",
    category: "브랜드·소개",
    trends: ["차분한 브랜딩"],
  },
  {
    id: "dashboard",
    name: "앱 대시보드",
    description: "지표와 프로젝트를 한눈에",
    tag: "APPLICATION",
    color: "#eeecff",
    category: "앱·데이터",
    trends: ["지표 중심"],
  },
  {
    id: "settings",
    name: "설정 페이지",
    description: "프로필과 알림을 내 방식으로",
    tag: "PRODUCT",
    color: "#fce5ed",
    category: "앱·데이터",
    trends: ["입력과 설정"],
  },
  ...EXTRA_TEMPLATES,
  ...PACK_TEMPLATES,
  {
    id: "blank",
    name: "빈 페이지",
    description: "당신만의 구성을 시작하세요",
    tag: "BLANK CANVAS",
    color: "#f0f1f3",
    category: "빈 화면",
    trends: [],
  },
];

export function createTemplate(template: string, id?: string): Project {
  const p = blankProject(id);
  p.name = TEMPLATES.find((t) => t.id === template)?.name ?? "새 프로젝트";
  const root = p.nodes[p.pages[0].rootId];
  function add(
    parent: Node,
    component: string,
    props: Record<string, Prop> = {},
    configure?: (n: Node) => void,
  ): Node {
    const n = createNode(component);
    n.props = { ...n.props, ...props };
    configure?.(n);
    p.nodes[n.id] = n;
    parent.children.push(n.id);
    return n;
  }
  if (template === "blank") return p;
  if (template === "free-canvas") {
    Object.assign(root.layout, {
      mode: "free",
      heightMode: "fixed",
      height: 1200,
      padding: 0,
    });
    return p;
  }
  if (applyPackTemplate(p, template) || applyRecipe(p, template)) return p;
  if (template === "dashboard" || template === "settings") {
    p.theme = {
      ...p.theme,
      name: "인디고 클라우드",
      light: {
        ...p.theme.light,
        background: "#f6f7fb",
        primary: "#4f46e5",
        soft: "#eeecff",
      },
      radius: 12,
    };
    const shell = add(root, "stack", {}, (n) => {
      n.layout.gap = 0;
      n.responsive.desktop = { direction: "row" };
    });
    add(shell, "sidebar");
    const main = add(shell, "section", {}, (n) => {
      n.layout.padding = 24;
      n.responsive.desktop = { padding: 40 };
    });
    add(main, "badge", { text: "WORKSPACE", tone: "neutral" });
    add(main, "heading", {
      text:
        template === "dashboard"
          ? "좋은 아침이에요, 민지님."
          : "내게 맞는 작업 공간",
      level: "h1",
    });
    add(main, "text", {
      text:
        template === "dashboard"
          ? "오늘도 팀과 함께 멋진 일을 만들어보세요."
          : "프로필과 알림 설정을 관리하세요.",
    });
    if (template === "dashboard") {
      const grid = add(main, "grid");
      add(grid, "stat", {
        label: "전체 프로젝트",
        value: "128",
        change: "+18.6%",
      });
      add(grid, "stat", {
        label: "활성 사용자",
        value: "24,892",
        change: "+12.8%",
      });
      add(grid, "stat", { label: "완료율", value: "94.2%", change: "+4.1%" });
      add(main, "table");
      add(main, "alert", {
        title: "이번 주도 순조롭게 진행되고 있어요",
        body: "프로젝트 8개 중 6개가 목표를 달성했습니다.",
        tone: "info",
      });
    } else {
      const card = add(main, "card");
      add(card, "heading", { text: "프로필", level: "h2" });
      add(card, "input", {
        label: "이름",
        placeholder: "김민지",
        type: "text",
      });
      add(card, "input", { label: "이메일", placeholder: "minji@example.com" });
      add(card, "divider");
      add(card, "switch", { label: "프로젝트 업데이트 알림" });
      add(card, "switch", { label: "주간 요약 받기", checked: false });
      add(card, "button", { label: "프로필 저장" });
    }
    return p;
  }
  add(root, "navbar");
  add(root, "hero");
  const section = add(root, "section", {}, (n) => {
    n.layout.padding = 24;
    n.responsive.desktop = { padding: 64 };
  });
  add(section, "badge", { text: "MADE FOR YOUR FLOW", tone: "neutral" });
  add(section, "heading", { text: "중요한 일에 더 가까이.", level: "h2" });
  add(section, "text", {
    text: "당신의 일상에 자연스럽게 스며드는, 작지만 확실한 변화.",
  });
  const grid = add(section, "grid");
  add(grid, "feature", {
    title: "생각을 정리하는 공간",
    body: "흩어진 아이디어를 연결하고 다음 단계로 나아가세요.",
    icon: "layers",
  });
  add(grid, "feature", {
    title: "가벼워지는 워크플로",
    body: "반복하는 일은 줄이고 정말 중요한 일에 집중하세요.",
    icon: "bolt",
  });
  add(grid, "feature", {
    title: "함께 만드는 가능성",
    body: "팀의 생각을 나누고 더 좋은 답을 발견하세요.",
    icon: "globe",
  });
  add(root, "cta");
  add(root, "footer");
  return p;
}

export function appendPage(p: Project, template: string): Project {
  const source = createTemplate(template);
  const page = source.pages[0];
  let index = p.pages.length + 1;
  while (p.pages.some((item) => item.slug === `/page-${index}`)) index++;
  return {
    ...p,
    nodes: { ...p.nodes, ...source.nodes },
    assets: { ...p.assets, ...source.assets },
    pages: [
      ...p.pages,
      { ...page, id: uid("page"), name: source.name, slug: `/page-${index}` },
    ],
  };
}
