import { DEFINITIONS } from "./catalog";

const behavior: Record<string, string[]> = {
  "scroll-chapters": ["content.chapters의 target은 같은 페이지의 표시된 node ID다. 클릭하면 대상에 스크롤하고 포커스를 옮긴다. 숨김·삭제·다른 페이지·탐색을 포함하는 조상 연결은 이동하지 않는다. 읽는 위치와 진행을 스크롤에 맞춰 갱신한다. 움직임 감소에서는 즉시 이동하고 이벤트·관찰자를 해제한다.", "sticky는 자동 배치 부모에서만 적용한다. 조상 overflow/transform에 따라 고정 범위가 제한된다. 복제·붙여넣기는 같이 복사한 target ID를 새 ID로 치환한다."],
  "multi-step-form": ["content.steps와 content.fields는 안정적인 항목 ID로 연결한다. 삭제되거나 미지정된 단계의 질문은 첫 단계에 보존한다. 현재 단계의 필수·이메일·숫자·선택값을 검사하고 오류 입력에 포커스를 옮긴다. 이전/다음 이동은 런타임 입력을 보존하며 마지막 완료 전에 전체 질문을 검사한다.", "폼 값은 문서에 저장하거나 외부 전송하지 않는 미리보기 상태다. 완료 화면에 입력값을 검토하고 다시 작성할 수 있다. initialStep 변경은 폼 상태를 재설정한다."],
  "rich-text": ["content.blocks의 ID로 문단·h2/h3/h4·연속 ul/ol 항목·인용을 구성한다. **굵게**, *기울임*, `코드`, [문구](안전한 주소)를 단순 인라인 서식으로 해석하며 중첩 문법은 지원하지 않는다. HTML은 텍스트이며 임의 HTML을 실행하지 않는다.", "내부 run 문구 수정은 data-rich-start/end의 원본 범위만 이스케이프하여 치환한다. 블록 순서 변경은 ID와 부분 스타일을 보존한다. 인라인 조각의 스타일은 같은 블록의 조각 순서에 연결되므로 서식 조각을 새로 삽입하면 확인이 필요하다."],
  "video-player": ["자산 또는 HTTPS 영상을 재생한다. editableControls=true이면 내부 역할별 재생/정지·구간 진행 막대·시간·음량·속도·자막·전체 화면 컨트롤을 렌더링한다. 막대는 키보드 방향키/Home/End와 포인터로 조작한다. false 또는 누락이면 이전 native video controls를 유지한다. 시작·종료 구간은 초, end=0은 끝까지. 화면 밖·백그라운드에서 정지한다. 자동 재생은 음소거하고 한 번 시도하며 움직임 감소에서는 실행하지 않는다.", "편집·PNG는 대표 이미지와 정지 컨트롤. slot.media-* 내부 스타일은 편집·미리보기·공유에 공통 적용하며 시간과 속도 숫자는 실행 상태에서 계산한다. VTT 자막과 대본, 원본 누락·코덱 오류를 지원한다. 전체 화면은 소유 문서의 API 허용 여부에 따른다."],
  "audio-player": ["editableControls=true이면 내부 역할별 재생/정지·구간 진행·시간·음량·속도 컨트롤을 제공한다. false 또는 누락은 native audio controls다. 시작·종료 구간, 반복, 대본을 지원하며 화면 밖·백그라운드에서 정지한다. 자동 재생하지 않는다. 편집·PNG는 표지와 정지 컨트롤이며 slot.media-* 외형을 유지한다."],
  "image-lightbox": ["사진 버튼으로 모달을 열고 좌우 키·이전·다음으로 순환한다. Escape/닫기로 닫으면 원래 버튼에 포커스를 복원한다. 편집·PNG에서는 사진 그리드로 표시한다."],
  "image-compare": ["range 입력을 드래그하거나 화살표·Home·End 키로 두 사진의 분할 비율을 조절한다. 두 사진 대체 설명을 유지하며 시작 위치를 PNG에 사용한다."],
  "image-hotspot": ["백분율 위치의 설명 지점 버튼과 사진 아래 목록이 같은 펼침 상태를 사용한다. 키보드·터치로 열고 닫으며 원본 실패 시에도 설명을 읽을 수 있다."],
  combobox: [
    "Popover 안의 Command 검색과 단일 선택. 키보드 화살표·Enter·Escape를 지원하고 선택 후 닫는다.",
  ],
  "multi-select": [
    "검색 목록에서 항목을 여러 개 선택·해제한다. 선택한 문구를 트리거에 표시한다.",
  ],
  "input-otp": [
    "숫자 6자리 입력, 붙여넣기와 포커스 이동을 지원한다. 인증 서버 연결은 별도다.",
  ],
  "input-group": [
    "label, prefix, suffix, placeholder를 입력창 앞뒤에 표시한다.",
  ],
  "date-range-picker": [
    "Popover의 달력에서 시작일과 종료일을 선택하고 트리거에 범위를 표시한다.",
  ],
  "password-input": ["비밀번호 보기·숨기기 버튼으로 입력 형식을 전환한다."],
  "color-swatch": [
    "HEX 색상 목록을 버튼으로 표시하며 현재 선택에 aria-pressed를 제공한다.",
  ],
  "toggle-group": ["여러 버튼의 선택 상태를 독립적으로 전환한다."],
  "command-palette": [
    "입력으로 명령 목록을 검색하고 선택한 명령을 상태 문구에 표시한다.",
  ],
  "context-menu": ["대상 영역 우클릭으로 메뉴를 열고 선택 항목을 표시한다."],
  menubar: ["각 메뉴의 작업 목록을 열고 키보드로 이동·선택한다."],
  "mega-menu": [
    "메뉴별 큰 패널에 links의 이름|설명을 표시하고 선택 항목을 알린다.",
  ],
  popover: ["버튼을 눌러 제목과 설명을 열고 Escape 또는 외부 클릭으로 닫는다."],
  "hover-card": ["트리거 호버 또는 포커스 시 정보 카드를 표시한다."],
  sheet: [
    "측면 대화상자를 열고 닫는다. 포커스를 가두고 닫을 때 트리거로 복원한다.",
  ],
  drawer: ["하단 서랍을 열고 닫는다. 실제 저장·서버 작업은 별도다."],
  "alert-dialog": [
    "취소·확인 대화상자. 확인 시 상태 문구를 표시하며 데이터 삭제 등의 서버 동작은 없다.",
  ],
  carousel: ["이전·다음 버튼과 좌우 키로 슬라이드를 이동한다."],
  "tree-view": ["folder/file 경로를 폴더별로 묶고 펼침·파일 선택을 지원한다."],
  "file-manager": [
    "파일 이름|크기 목록을 검색하고 격자/목록 표시와 선택을 바꾼다. 실제 파일 업로드나 삭제는 없다.",
  ],
  "code-block": [
    "코드를 일반 텍스트로 표시하고 복사한다. 내용을 실행하지 않는다.",
  ],
  terminal: [
    "명령과 출력을 일반 텍스트 예시로 표시하고 복사한다. 셸에 연결되어 있지 않다.",
  ],
  "line-chart": [
    "항목|값을 선 그래프로 표시하고 수치를 텍스트로 함께 제공한다.",
  ],
  "area-chart": ["항목|값을 영역 그래프로 표시한다. 데이터 연결은 별도다."],
  "radar-chart": [
    "항목별 값을 최댓값으로 정규화한 방사형 다각형으로 표시한다.",
  ],
  heatmap: ["항목별 값을 색상 강도와 숫자로 함께 표시한다."],
  "resizable-panels": ["손잡이 드래그 또는 키보드로 두 패널 너비를 조절한다."],
  "scroll-area": ["고정된 높이 안에서 긴 목록을 스크롤한다."],
  "toggle-button": [
    "초기 pressed 값에서 선택을 전환하고 aria-pressed로 알린다.",
  ],
  "copy-button": [
    "정의된 text를 복사하고 성공·실패 상태를 알린다. 복사 권한이 없으면 선택 가능한 텍스트를 제공한다.",
  ],
  icon: [
    "name에서 등록된 아이콘을 선택한다. label은 접근성 이름이며 개별 색상과 크기를 적용한다.",
  ],
  spacer: ["지정된 높이의 비어 있는 장식용 여백. 접근성 트리에서 숨긴다."],
  quantity: [
    "초기 value를 min/max 범위로 제한한다. 증감 버튼과 output을 제공하며 양끝에서 버튼을 비활성화한다.",
  ],
  rating: [
    "1~5점 native radio 그룹. 선택 별점을 시각적으로 표시하며 방향키로 조절할 수 있다.",
  ],
  segmented: [
    "items의 각 줄을 버튼으로 표시하고 current가 0부터 시작하는 선택 항목이다. aria-pressed를 제공한다.",
  ],
  "tag-input": [
    "Enter로 태그 추가, 개별 삭제 버튼. 한글 조합 중 Enter를 처리하지 않는다. 최대 30개, 태그당 80자. 외부 저장은 미정이다.",
  ],
  "date-input": [
    "연결된 label과 native date 입력. YYYY-MM-DD 초기값을 사용한다.",
  ],
  "color-input": ["native color 입력으로 HEX 색상을 고르고 output에 표시한다."],
  "file-upload": [
    "로컬 파일을 선택하고 파일 이름만 보여준다. 업로드·내용 읽기·서버 전송을 하지 않는다.",
  ],
  meter: [
    "value와 max를 이용한 native meter. 현재 수치와 전체 용량 및 백분율을 표시한다.",
  ],
  frame: [
    "높이가 있는 자유 배치 또는 자동 배치 영역. children을 그대로 유지하고 화면별 layout.mode와 좌표·크기를 적용한다.",
  ],
  group: [
    "자식 노드를 묶은 컨테이너. 부모와 그룹 내부의 배치 방식은 각각 적용하며 자식 순서는 겹침 순서다.",
  ],
  shape: [
    "kind가 rectangle이면 사각형, ellipse이면 원/타원, line이면 영역 중앙의 가로선. 개별 채우기·테두리·회전을 적용한다.",
  ],
  decoration: [
    "kind에 따라 CSS 히어로 예시 그래픽, 아이콘, 짧은 강조 문구, 지표 변화 설명을 표시한다. 히어로 그래픽의 수치는 예시다.",
  ],
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
    "src는 HTTPS URL 또는 asset:<id> 자산 참조다. ZIP의 assets/manifest.json과 원본을 연결하고 alt와 ratio를 보존한다. 실패 시 누락을 표시한다.",
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
    behavior:
      behavior[id] ??
      (definition.recipe
        ? [
            "내부 요소가 독립적인 자식 노드인 조립 블록. 저장된 children을 순회하여 각 요소의 콘텐츠·스타일·반응형 설정을 적용한다. 로그인·가입·구매·전송 등 비즈니스 동작은 별도 연결 요구사항이며 화면만으로 서버 기능을 제공하지 않는다.",
          ]
        : [
            "정의된 콘텐츠를 표시하고 reference.css의 해당 UI 클래스 및 테마 토큰을 적용한다.",
          ]),
    contentEncoding:
      "문자열은 HTML이 아닌 일반 텍스트다. node.content가 있는 목록은 고유 id와 values를 가진 구조화 항목을 우선한다. slot.item-<id>.<field>는 순서 변경과 무관한 고정 내부 역할이다. 기존 목록은 줄바꿈, 탭·표·아코디언의 항목 내부는 | 구분자를 사용한다.",
    styling:
      "theme.css와 reference.css를 참고한다. resolvedLayouts의 간격에는 density가 반영되어 있다. node.parts의 p.0.1 같은 경로는 해당 ui-node에서부터 element children 인덱스를 따라가는 내부 부분이다. 부분 문구는 직접 텍스트 노드만 대체한다. 부분 layout은 개별 CSS 크기·translate·회전·외형이며 화면별 responsive를 상속한다. 내부 수정은 PNG·공유·미리보기에도 동일하게 적용한다.",
  };
}
