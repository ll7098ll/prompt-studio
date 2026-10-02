import { DEFINITIONS } from "./catalog";

const behavior: Record<string, string[]> = {
  search: [
    "label과 연결된 search 입력. items 각 줄을 대소문자 구분 없이 포함 검색하며 결과가 없으면 role=status로 알린다. 외부 검색 엔진은 연결되어 있지 않다.",
  ],
  textarea: ["label과 연결된 native textarea. rows와 placeholder를 반영한다."],
  radio: [
    "fieldset/legend 안에서 items의 각 줄을 하나의 radio로 표시한다. node ID를 공통 name으로 사용하고 첫 선택지가 기본값이다. native 키보드 탐색을 지원한다.",
  ],
  range: [
    "label과 연결된 native range. 범위 0~100, value 초기값, output에 현재 값과 unit을 표시한다. 키보드 화살표 입력을 지원한다.",
  ],
  progress: [
    "label과 연결된 native progress. 최대 100, value 비율과 설명을 텍스트로도 표시한다.",
  ],
  steps: [
    "items는 순서 있는 단계 목록, current는 1부터 시작한다. 마지막 항목을 넘으면 마지막 단계를 현재 단계로 표시한다. aria-current=step을 사용한다.",
  ],
  pagination: [
    "pages는 1~20. current를 1~pages로 제한하고 aria-current=page로 선택을 알린다. 이전·다음 버튼은 양끝에서 비활성화한다. 실제 데이터 페이지 연결은 미정이다.",
  ],
  skeleton: [
    "로딩 자리 표시. role=status로 불러오는 중임을 알린다. lines 개수만큼 줄을 표시하며 실제 로딩 완료는 데이터 연결 후 구현한다.",
  ],
  tooltip: [
    "버튼의 hover 또는 focus 동안 연결된 role=tooltip 설명을 표시한다. Escape로 숨기고 다시 접근하면 표시한다. aria-describedby는 node ID 기반으로 고유하게 연결한다.",
  ],
  dropdown: [
    "details/summary로 작업 목록을 펼친다. 항목을 선택하면 선택 결과만 알리고 목록을 닫는다. Escape로 닫고 summary로 초점을 돌린다. 실제 복사·삭제 작업은 연결하지 않는다.",
  ],
  dialog: [
    "처음에는 닫힌 native dialog. 열기 버튼으로 showModal(), 닫기 버튼 또는 Escape로 종료한다. 모달 중 배경을 비활성화하고 닫힌 후 열기 버튼으로 초점을 돌린다.",
  ],
  toast: [
    "버튼을 누르면 role=status 영역에 안내를 표시하고 닫기 버튼으로 제거한다. 샘플 알림이며 실제 저장 성공으로 간주하지 않는다.",
  ],
  calendar: [
    "month는 1900-01~2100-12의 YYYY-MM. 월을 앞뒤로 이동하며 일요일부터 시작하는 월 달력을 표시한다. 날짜 버튼의 aria-pressed와 status에 선택을 반영한다. 입력 오류는 안내를 표시한다.",
  ],
  chat: [
    "greeting을 먼저 표시한다. 공백뿐인 메시지는 전송할 수 없다. 제출 후 사용자 메시지와 reply의 고정 샘플 응답을 role=log에 추가하며 최근 20개 메시지를 유지한다. 실제 AI·서버 연결은 별도 요구사항이다.",
  ],
  newsletter: [
    "필수 이메일 입력을 native HTML 유효성 검사한다. 제출 시 완료 예시를 표시하고 실제 전송이 아님을 알린다. 서버 구독 처리와 개인정보 정책은 미정이다.",
  ],
  contact: [
    "이름·이메일·문의 내용이 필수인 native form. 이메일 형식을 검증한다. 제출 완료는 미리보기이며 서버 전송·저장을 하지 않는다.",
  ],
  "bar-chart": [
    "items의 각 줄은 항목|숫자. 음수와 유효하지 않은 숫자는 0으로 표시한다. 가장 큰 수에 맞춰 막대 높이를 정하고 항목, 수치와 unit을 텍스트로 제공한다.",
  ],
  "donut-chart": [
    "0~100 value를 SVG 원호와 텍스트 퍼센트로 표시한다. 중복 SVG는 aria-hidden이고 title·label은 읽을 수 있는 텍스트다.",
  ],
  timeline: ["items는 한 줄에 시간|제목|설명. 순서 있는 기록으로 표시한다."],
  marquee: [
    "items를 가로로 반복 표시한다. animate가 true일 때만 움직이며 prefers-reduced-motion에서는 정지한다. PNG 캡처에서는 움직임을 정지한다.",
  ],
  spotlight: [
    "큰 제목과 eyebrow·body·버튼. treatment는 gradient/brutal/retro/collage 중 하나다. CSS 장식은 aria-hidden이며 모바일 글자 크기와 배치를 조정한다. 실제 WebGL/3D 모델이 아니다.",
  ],
  gallery: [
    "items는 제목|분류. CSS 추상 그래픽은 이미지 자리 예시다. 실제 작업 이미지는 별도로 제공해야 한다. 데스크톱 3열, 모바일 1열.",
  ],
  product: [
    "상품명·가격·설명·badge와 CSS 의자 이미지 자리를 표시한다. 실제 상품 이미지·상세 경로·결제는 미정이다.",
  ],
  avatar: [
    "initials의 처음 3글자와 name·role을 표시한다. 사진 업로드는 별도 요구사항이다.",
  ],
  "avatar-group": [
    "items의 최대 5명 이니셜과 나머지 인원수를 표시한다. label은 인원 설명이다.",
  ],
  breadcrumbs: [
    "items를 경로 순서대로 표시하고 마지막에 aria-current=page를 설정한다. 실제 이동 경로는 미정이다.",
  ],
  logos: [
    "items의 브랜드명 텍스트 목록과 title을 표시한다. 실제 로고 이미지가 아닌 예시다.",
  ],
  team: ["name·role·body와 initials를 표시하는 팀 소개 카드."],
  page: [
    "페이지의 유일한 루트. children을 순서대로 렌더링하고 최소 viewport 높이를 유지한다.",
  ],
  section: [
    "가운데 정렬된 최대 너비 영역. resolvedLayouts의 maxWidth, padding, gap을 사용한다.",
  ],
  stack: ["resolvedLayouts의 direction에 따라 Flex로 배치한다."],
  grid: [
    "동일한 너비의 Grid 열. columns와 gap은 각 breakpoint의 resolvedLayouts를 사용한다.",
  ],
  card: ["자식 요소를 담는 표면. surface, border, radius 토큰을 사용한다."],
  heading: [
    "level 속성은 실제 h1/h2/h3 의미 구조에 반영한다. 줄바꿈을 보존한다.",
  ],
  text: [
    "본문 문단. 줄바꿈을 보존하고 긴 단어와 한국어가 넘치지 않게 처리한다.",
  ],
  button: [
    "default·loading·disabled 상태. loading과 disabled에서는 동작을 막는다.",
    "href가 HTTPS 또는 #요소ID이면 링크. 비어 있으면 실행할 비즈니스 동작은 미정이다.",
  ],
  input: [
    "보이는 label을 입력과 연결한다. type, placeholder, required를 적용한다. 서버 제출은 미정이다.",
  ],
  checkbox: [
    "checked가 초기값이다. 사용자 입력으로 선택을 전환하며 label 클릭과 Space를 지원한다.",
  ],
  switch: [
    "role=switch와 aria-checked를 사용한다. checked 초기값, 클릭·Space·Enter 전환을 지원한다.",
  ],
  select: [
    "items의 각 줄이 한 option이다. native select와 연결된 label을 사용한다.",
  ],
  image: [
    "src는 HTTPS 이미지 URL이다. alt와 ratio를 보존하고 실패 시 대체 영역을 표시한다.",
  ],
  tabs: [
    "items는 한 줄에 탭 이름|내용 형식이다. 첫 탭이 기본 선택이다.",
    "tablist/tab/tabpanel 연결, 선택 탭만 tabIndex=0, 좌우 화살표·Home·End를 지원한다.",
  ],
  accordion: [
    "items는 한 줄에 질문|답변 형식이다. 초기에는 닫힌 details/summary이며 키보드로 각각 열고 닫는다.",
  ],
  table: [
    "columns는 |로 구분한 열 제목, rows는 한 줄에 |로 구분한 셀이다.",
    "기본 정렬은 입력 순서. 열 제목을 누르면 해당 열을 오름차순·내림차순으로 전환한다. 숫자 정렬과 aria-sort를 지원한다.",
    "state가 loading·empty·error이면 지정 상태를 표시한다. 좁은 화면에서 표 내부만 가로 스크롤한다.",
  ],
  navbar: [
    "brand와 메뉴 목록을 표시한다. 모바일에서는 메뉴 열기 버튼과 aria-expanded를 제공한다. 목적지가 없는 메뉴의 연결은 미정이다.",
  ],
  sidebar: [
    "첫 메뉴가 기본 선택이다. 클릭하면 선택 표시가 바뀌지만 페이지 이동 목적지는 미정이다. 좁은 화면에서는 가로 메뉴로 전환한다.",
  ],
  hero: [
    "eyebrow·title·body·두 버튼과 선택적 장식 그래픽을 배치한다. 모바일은 한 열이다. 그래픽의 지표 숫자는 샘플이며 실제 데이터 연결이 아니다.",
  ],
  pricing: [
    "items의 각 줄을 혜택 목록으로 표시한다. featured는 추천 강조이며 실제 결제 기능이 아니다.",
  ],
  footer: [
    "brand·body·items를 표시한다. 좁은 화면에서 세로 배치하며 메뉴 연결은 미정이다.",
  ],
};

export function componentSpec(id: string) {
  const definition = DEFINITIONS[id];
  return {
    ...definition,
    version: 1,
    behavior: behavior[id] ?? [
      "정의된 콘텐츠를 표시하고 reference.css의 해당 UI 클래스 및 테마 토큰을 적용한다.",
    ],
    contentEncoding:
      "문자열은 HTML이 아닌 일반 텍스트다. 목록은 줄바꿈, 탭·표·아코디언의 항목 내부는 | 구분자를 사용한다.",
    styling:
      "theme.css와 reference.css를 참고한다. resolvedLayouts는 이미 density가 반영된 값이므로 다시 곱하지 않는다.",
  };
}
