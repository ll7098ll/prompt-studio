import { DEFINITIONS } from "./catalog";
import { blankProject, createNode, type Project } from "./model";

const explanations: Record<string, [string, string]> = {
  section: ["페이지 구역", "화면을 여러 구역으로 나누기"],
  stack: ["한 줄로 배치", "요소를 가로나 세로로 나란히"],
  grid: ["여러 칸에 배치", "카드 등을 바둑판처럼 정리"],
  heading: ["제목", "크게 강조하는 문구"],
  text: ["본문", "소개와 자세한 설명"],
  button: ["버튼", "눌러서 다음 행동으로"],
  badge: ["상태 라벨", "신규·완료 같은 짧은 표시"],
  input: ["입력창", "이름·이메일 등을 입력받기"],
  checkbox: ["체크박스", "여러 항목 선택이나 동의"],
  switch: ["켜기·끄기", "알림 같은 설정을 전환"],
  select: ["선택 메뉴", "목록에서 한 가지 고르기"],
  divider: ["구분선", "내용 사이에 선으로 구분"],
  image: ["이미지", "사진·그림을 넣는 자리"],
  card: ["카드", "관련 내용을 한 상자에 담기"],
  feature: ["기능 소개", "아이콘과 설명으로 장점 소개"],
  stat: ["숫자 요약", "방문 수·매출 등 핵심 숫자"],
  tabs: ["탭 메뉴", "같은 자리에서 내용을 전환"],
  accordion: ["접고 펼치기", "자주 묻는 질문과 답변"],
  alert: ["안내 메시지", "완료·주의·오류를 알려주기"],
  table: ["데이터 표", "여러 정보를 행과 열로 정리"],
  pricing: ["요금제 카드", "가격과 제공 기능을 소개"],
  testimonial: ["후기", "고객의 말과 평가를 소개"],
  empty: ["내용이 없을 때", "첫 행동을 안내하는 화면"],
  navbar: ["상단 메뉴", "로고와 주요 메뉴를 배치"],
  hero: ["첫 화면 소개", "큰 제목과 이미지로 첫인상"],
  sidebar: ["옆쪽 메뉴", "화면 옆에서 메뉴를 탐색"],
  cta: ["시작 유도 영역", "소개를 마치고 버튼으로 안내"],
  footer: ["페이지 하단", "소개·문의·정책 링크를 모으기"],
};

export function componentHelp(id: string) {
  const definition = DEFINITIONS[id];
  const [label, summary] = explanations[id] ?? [
    definition.name,
    definition.description,
  ];
  return { label, summary, term: definition.name };
}

export function componentExample(id: string, theme: Project["theme"]): Project {
  const project = blankProject();
  project.name = componentHelp(id).label;
  project.theme = structuredClone(theme);
  const root = project.nodes[project.pages[0].rootId];
  root.layout.padding = ["navbar", "hero", "sidebar", "cta", "footer"].includes(
    id,
  )
    ? 0
    : 24;
  const node = createNode(id);
  root.children.push(node.id);
  project.nodes[node.id] = node;
  if (DEFINITIONS[id].container) {
    const children =
      id === "grid"
        ? ["feature", "feature", "feature"]
        : ["heading", "text", "button"];
    for (const kind of children) {
      const child = createNode(kind);
      node.children.push(child.id);
      project.nodes[child.id] = child;
    }
  }
  return project;
}
