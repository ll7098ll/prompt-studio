import type { Definition, Field } from "./catalog";
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
const item = (
  id: string,
  name: string,
  category: string,
  description: string,
  defaults: Definition["defaults"],
  fields: Field[],
): Definition => ({
  id,
  name,
  category,
  description,
  defaults,
  fields,
  source: ["color-swatch", "tree-view"].includes(id)
    ? "Prompt Studio"
    : "shadcn/ui 기반",
});
const choices = {
  label: "선택하세요",
  placeholder: "검색하거나 선택하세요",
  items: "디자인\n개발\n마케팅\n운영",
};
const choiceFields = [
  text("label", "제목"),
  text("placeholder", "입력 안내"),
  lines("items", "선택지 · 한 줄에 하나"),
];
const overlay = (id: string, name: string) =>
  item(
    id,
    name,
    "탐색",
    "열어서 내용을 살펴보는 대화형 UI",
    {
      label: `${name} 열기`,
      title: "팀을 위한 새로운 공간",
      body: "필요한 정보와 설정을 한곳에서 확인하세요.",
      action: "확인",
    },
    [
      text("label", "버튼 문구"),
      text("title", "제목"),
      lines("body", "내용"),
      text("action", "확인 문구"),
    ],
  );
export const ADVANCED_CATALOG: Definition[] = [
  item(
    "combobox",
    "검색형 선택",
    "입력·폼",
    "검색 후 하나의 항목 선택",
    choices,
    choiceFields,
  ),
  item(
    "multi-select",
    "다중 선택",
    "입력·폼",
    "검색하고 여러 항목 함께 선택",
    choices,
    choiceFields,
  ),
  item(
    "input-otp",
    "인증번호 입력",
    "입력·폼",
    "여섯 자리 코드 입력과 붙여넣기",
    { label: "인증 코드", body: "이메일로 받은 6자리 코드를 입력하세요." },
    [text("label", "제목"), text("body", "설명")],
  ),
  item(
    "input-group",
    "접두·접미 입력",
    "입력·폼",
    "입력창 앞뒤에 단위와 설명 표시",
    {
      label: "개인 주소",
      prefix: "https://",
      suffix: ".studio",
      placeholder: "my-name",
    },
    [
      text("label", "제목"),
      text("prefix", "앞 문구"),
      text("suffix", "뒤 문구"),
      text("placeholder", "입력 안내"),
    ],
  ),
  item(
    "date-range-picker",
    "날짜 범위 선택",
    "입력·폼",
    "달력에서 시작일과 종료일 선택",
    { label: "일정 선택" },
    [text("label", "제목")],
  ),
  item(
    "password-input",
    "비밀번호 입력",
    "입력·폼",
    "비밀번호 표시·숨김 전환",
    { label: "비밀번호", placeholder: "8자 이상 입력하세요" },
    [text("label", "제목"), text("placeholder", "입력 안내")],
  ),
  item(
    "color-swatch",
    "색상 견본 선택",
    "입력·폼",
    "브랜드 색상을 견본에서 선택",
    {
      label: "컬러 선택",
      items: "#6366f1\n#ec4899\n#14b8a6\n#f59e0b\n#18181b",
    },
    [text("label", "제목"), lines("items", "색상 · 한 줄에 #RRGGBB")],
  ),
  item(
    "toggle-group",
    "다중 토글 묶음",
    "입력·폼",
    "여러 옵션을 독립적으로 켜고 끄기",
    { label: "표시 항목", items: "제목\n이미지\n설명" },
    [text("label", "제목"), lines("items", "항목")],
  ),
  item(
    "command-palette",
    "명령 검색창",
    "탐색",
    "키보드로 검색하고 명령 선택",
    {
      title: "무엇을 찾으세요?",
      items: "대시보드 열기\n새 프로젝트\n팀원 초대\n설정 열기",
    },
    [text("title", "제목"), lines("items", "명령")],
  ),
  item(
    "context-menu",
    "우클릭 메뉴",
    "탐색",
    "영역 위에서 우클릭으로 메뉴 열기",
    {
      label: "여기를 마우스 오른쪽 버튼으로 클릭하세요",
      items: "열기\n복사\n이름 바꾸기\n즐겨찾기",
    },
    [text("label", "안내"), lines("items", "메뉴")],
  ),
  item(
    "menubar",
    "메뉴바",
    "탐색",
    "키보드로 이동하는 상단 메뉴",
    { items: "파일\n편집\n보기", actions: "새로 만들기\n열기\n저장" },
    [lines("items", "상위 메뉴"), lines("actions", "하위 메뉴")],
  ),
  item(
    "mega-menu",
    "메가 메뉴",
    "탐색",
    "넓게 펼쳐지는 탐색 메뉴",
    {
      brand: "STUDIO",
      items: "제품\n솔루션\n리소스",
      links:
        "디자인 시스템|일관된 화면을 만드는 도구\n컴포넌트|빠르게 조립하는 시작점\n템플릿|완성된 구조에서 시작하세요",
    },
    [
      text("brand", "브랜드"),
      lines("items", "상위 메뉴"),
      lines("links", "링크 · 제목|설명"),
    ],
  ),
  ...["popover", "hover-card", "sheet", "drawer", "alert-dialog"].map((id, i) =>
    overlay(
      id,
      ["팝오버", "호버 카드", "사이드 시트", "하단 드로어", "확인 대화상자"][i],
    ),
  ),
  item(
    "carousel",
    "캐러셀",
    "콘텐츠",
    "버튼과 드래그로 카드를 넘기기",
    {
      title: "새로운 아이디어",
      items:
        "01|작은 시작이 만드는 변화\n02|당신의 팀을 위한 공간\n03|함께 만드는 다음 장면",
    },
    [text("title", "제목"), lines("items", "카드 · 번호|문구")],
  ),
  item(
    "tree-view",
    "트리 탐색",
    "탐색",
    "폴더를 펼치고 항목 선택",
    {
      title: "프로젝트 구조",
      items: "디자인/홈 화면\n디자인/컴포넌트\n개발/API 명세\n문서/시작 가이드",
    },
    [text("title", "제목"), lines("items", "폴더/파일 · 한 줄에 하나")],
  ),
  item(
    "file-manager",
    "파일 탐색기",
    "데이터",
    "샘플 파일 검색·선택·보기 전환",
    {
      title: "팀 파일",
      items:
        "브랜드 가이드.pdf|2.4 MB\n메인 화면.fig|12 MB\n프로젝트 소개.docx|840 KB\n로고.svg|24 KB",
    },
    [text("title", "제목"), lines("items", "파일명|크기")],
  ),
  item(
    "code-block",
    "코드 블록",
    "콘텐츠",
    "코드 표시와 복사",
    {
      title: "hello.ts",
      code: 'const idea = "새로운 가능성";\nconsole.log(idea);',
    },
    [text("title", "파일 이름"), lines("code", "코드 · 실행되지 않음")],
  ),
  item(
    "terminal",
    "터미널 표시",
    "콘텐츠",
    "명령 예시와 출력 표시",
    {
      title: "Terminal",
      code: "$ npm run create\n✓ Ready to build something great\n→ Your next idea starts here",
    },
    [text("title", "제목"), lines("code", "표시할 내용 · 실행되지 않음")],
  ),
  ...["line-chart", "area-chart", "radar-chart", "heatmap"].map((id, i) => ({
    ...item(
      id,
      ["선 차트", "영역 차트", "레이더 차트", "히트맵"][i],
      "데이터",
      "직접 입력한 데이터를 시각화",
      {
        title: ["주간 방문 추이", "누적 성장", "분야별 역량", "주간 활동"][i],
        items: "월|24\n화|48\n수|36\n목|72\n금|58\n토|92\n일|80",
      },
      [text("title", "제목"), lines("items", "항목|값 · 한 줄에 하나")],
    ),
    source: "Prompt Studio",
  })),
  item(
    "resizable-panels",
    "크기 조절 분할 패널",
    "구조",
    "손잡이로 두 패널 너비 조절",
    { title: "작업 공간", left: "탐색 패널", right: "내용을 넓게 살펴보세요." },
    [
      text("title", "제목"),
      lines("left", "왼쪽 내용"),
      lines("right", "오른쪽 내용"),
    ],
  ),
  item(
    "scroll-area",
    "스크롤 영역",
    "구조",
    "고정 높이 안에서 긴 목록 탐색",
    {
      title: "최근 활동",
      items: Array.from(
        { length: 15 },
        (_, i) => `업데이트 ${i + 1} · 함께 만드는 더 나은 화면`,
      ).join("\n"),
    },
    [text("title", "제목"), lines("items", "목록")],
  ),
  item(
    "toggle-button",
    "토글 버튼",
    "입력·폼",
    "버튼을 눌러 상태 전환",
    { label: "즐겨찾기", pressed: false },
    [
      text("label", "문구"),
      { key: "pressed", label: "초기 선택", type: "toggle" },
    ],
  ),
  item(
    "copy-button",
    "복사 버튼",
    "기본 요소",
    "지정한 내용을 클립보드에 복사",
    { label: "링크 복사", text: "https://example.com/my-project" },
    [text("label", "문구"), text("text", "복사할 내용")],
  ),
];
