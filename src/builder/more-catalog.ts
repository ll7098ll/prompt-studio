import type { Definition, Field } from "./catalog";
import type { Layout, Node } from "./model";
export type Recipe = {
  key?: string;
  component: string;
  props?: Record<string, string | number | boolean>;
  layout?: Partial<Layout>;
  responsive?: Node["responsive"];
  appearance?: Node["appearance"];
  parts?: Node["parts"];
  content?: Record<string, Record<string, string | number | boolean>[]>;
  children?: Recipe[];
};
const t = (key: string, label: string): Field => ({ key, label, type: "text" });
const n = (key: string, label: string, min: number, max: number): Field => ({
  key,
  label,
  type: "number",
  min,
  max,
});
const list = (key: string, label: string): Field => ({
  key,
  label,
  type: "textarea",
});
const block = (
  component: string,
  props?: Recipe["props"],
  children?: Recipe[],
  layout?: Partial<Layout>,
): Recipe => ({ component, props, children, layout });
const heading = (text: string, level = "h2") =>
  block("heading", { text, level });
const text = (text: string) => block("text", { text });
const button = (label: string, variant = "primary") =>
  block("button", { label, variant });
const input = (label: string, type = "text", placeholder = "입력하세요") =>
  block("input", { label, type, placeholder });
const row = (...children: Recipe[]) =>
  block("stack", {}, children, {
    direction: "row",
    wrap: true,
    align: "center",
    gap: 16,
  });
const stack = (...children: Recipe[]) =>
  block("stack", {}, children, { gap: 16 });
const grid = (...children: Recipe[]) =>
  block("grid", {}, children, { gap: 24 });
const card = (...children: Recipe[]) =>
  block("card", {}, children, { padding: 24, gap: 16 });
const tag = (text: string) => block("badge", { text });
const image = (alt: string, ratio = "16/9") => block("image", { alt, ratio });
const icon = (name = "sparkles") =>
  block("icon", { name }, undefined, {
    widthMode: "fixed",
    width: 36,
    heightMode: "fixed",
    height: 36,
  });
const quote = (name: string, body: string) =>
  card(
    block("rating", { value: 5, label: "추천 점수" }),
    text(body),
    block("avatar", { name, role: "서비스 이용자", initials: name.slice(1) }),
  );
function recipe(
  id: string,
  name: string,
  category: string,
  description: string,
  children: Recipe[],
  initialLayout: Partial<Layout> = {},
): Definition {
  return {
    id,
    name,
    category,
    description,
    container: true,
    defaults: {},
    fields: [],
    recipe: children,
    initialLayout: { padding: 24, gap: 24, ...initialLayout },
  };
}
export const MORE_CATALOG: Definition[] = [
  {
    id: "icon",
    name: "아이콘",
    category: "기본 요소",
    description: "크기·색상을 직접 편집하는 아이콘",
    defaults: { name: "sparkles", label: "아이콘" },
    fields: [
      {
        key: "name",
        label: "아이콘 종류",
        type: "select",
        options: [
          "sparkles",
          "heart",
          "star",
          "search",
          "mail",
          "user",
          "check",
          "arrow",
          "cart",
          "bell",
          "calendar",
          "globe",
        ],
      },
      t("label", "접근성 설명"),
    ],
    initialLayout: {
      widthMode: "fixed",
      width: 32,
      heightMode: "fixed",
      height: 32,
    },
  },
  {
    id: "spacer",
    name: "빈 여백",
    category: "구조",
    description: "요소 사이에 원하는 크기의 여백",
    defaults: {},
    fields: [],
    initialLayout: { heightMode: "fixed", height: 32 },
  },
  {
    id: "quantity",
    name: "수량 조절",
    category: "입력·폼",
    description: "더하기·빼기로 수량 선택",
    defaults: { label: "수량", value: 1, min: 1, max: 99 },
    fields: [
      t("label", "제목"),
      n("value", "초기 수량", 0, 999),
      n("min", "최소 수량", 0, 999),
      n("max", "최대 수량", 1, 999),
    ],
  },
  {
    id: "rating",
    name: "별점 선택",
    category: "입력·폼",
    description: "별 다섯 개로 평가 선택",
    defaults: { label: "만족도", value: 4 },
    fields: [t("label", "제목"), n("value", "기본 별점", 0, 5)],
  },
  {
    id: "segmented",
    name: "선택 버튼 묶음",
    category: "탐색",
    description: "한 줄의 버튼으로 보기 방식 전환",
    defaults: { label: "보기 방식", items: "전체\n진행 중\n완료", current: 0 },
    fields: [
      t("label", "제목"),
      list("items", "선택지 · 한 줄에 하나"),
      n("current", "선택 항목 번호 · 0부터", 0, 20),
    ],
  },
  {
    id: "tag-input",
    name: "태그 입력",
    category: "입력·폼",
    description: "Enter로 태그 추가·개별 삭제",
    defaults: {
      label: "관심 분야",
      placeholder: "태그를 입력하고 Enter",
      items: "디자인\n개발",
    },
    fields: [
      t("label", "제목"),
      t("placeholder", "입력 안내"),
      list("items", "기본 태그 · 한 줄에 하나"),
    ],
  },
  {
    id: "date-input",
    name: "날짜 입력",
    category: "입력·폼",
    description: "기본 달력으로 날짜 선택",
    defaults: { label: "시작 날짜", value: "2026-10-06" },
    fields: [t("label", "제목"), t("value", "기본 날짜 · YYYY-MM-DD")],
  },
  {
    id: "color-input",
    name: "색상 선택",
    category: "입력·폼",
    description: "색상 팔레트와 HEX 값",
    defaults: { label: "브랜드 색상", value: "#7060cf" },
    fields: [t("label", "제목"), t("value", "기본 HEX 색상")],
  },
  {
    id: "file-upload",
    name: "파일 선택 영역",
    category: "입력·폼",
    description: "로컬 파일을 선택하고 이름 확인",
    defaults: {
      label: "파일 첨부",
      body: "파일을 선택해 이름을 확인하세요",
      multiple: true,
    },
    fields: [
      t("label", "제목"),
      t("body", "설명"),
      { key: "multiple", label: "여러 파일 선택", type: "toggle" },
    ],
  },
  {
    id: "meter",
    name: "목표 게이지",
    category: "데이터",
    description: "수치와 목표를 가로 게이지로 표시",
    defaults: { title: "저장 공간", value: 65, max: 100, unit: "GB" },
    fields: [
      t("title", "제목"),
      n("value", "사용량", 0, 10000),
      n("max", "전체 용량", 1, 10000),
      t("unit", "단위"),
    ],
  },

  recipe(
    "login-form",
    "로그인 카드",
    "입력·폼",
    "이메일·비밀번호·로그인 버튼을 각각 편집",
    [
      heading("다시 만나 반가워요"),
      text("계정에 로그인하고 작업을 이어가세요."),
      input("이메일", "email", "you@example.com"),
      input("비밀번호", "password", "비밀번호"),
      block("checkbox", { label: "로그인 상태 유지" }),
      button("로그인"),
      button("Google로 계속하기", "secondary"),
    ],
    { maxWidth: 480 },
  ),
  recipe(
    "signup-form",
    "회원가입 카드",
    "입력·폼",
    "이름·계정·약관을 조립한 가입 화면",
    [
      heading("새로운 시작"),
      input("이름"),
      input("이메일", "email"),
      input("비밀번호", "password"),
      block("checkbox", { label: "이용약관과 개인정보 처리방침에 동의합니다" }),
      button("계정 만들기"),
    ],
  ),
  recipe(
    "password-reset",
    "비밀번호 찾기",
    "입력·폼",
    "안내 문구와 이메일 재설정 요청",
    [
      icon("mail"),
      heading("비밀번호를 잊으셨나요?"),
      text("가입한 이메일로 재설정 안내를 보내드립니다."),
      input("가입 이메일", "email"),
      button("재설정 링크 요청"),
    ],
  ),
  recipe(
    "profile-settings",
    "프로필 설정",
    "입력·폼",
    "프로필 사진·소개·연락처 편집 화면",
    [
      row(
        block("avatar", { name: "김민지", role: "프로덕트 디자이너" }),
        button("사진 변경", "secondary"),
      ),
      heading("프로필 정보"),
      row(input("이름"), input("이메일", "email")),
      block("textarea", { label: "자기소개", rows: 4 }),
      row(button("저장하기"), button("취소", "ghost")),
    ],
  ),
  recipe(
    "notification-settings",
    "알림 설정",
    "입력·폼",
    "종류별 알림과 저장 버튼",
    [
      heading("알림 설정"),
      text("받고 싶은 소식을 직접 선택하세요."),
      block("switch", { label: "이메일 알림", checked: true }),
      block("switch", { label: "프로젝트 업데이트", checked: true }),
      block("switch", { label: "마케팅 소식", checked: false }),
      button("설정 저장"),
    ],
  ),
  recipe(
    "search-filters",
    "검색 필터",
    "탐색",
    "검색·분류·가격을 조합한 필터 영역",
    [
      heading("원하는 항목 찾기", "h3"),
      input("검색어", "text", "검색어 입력"),
      row(
        block("select", { label: "분류", items: "전체\n디자인\n개발\n마케팅" }),
        block("select", { label: "정렬", items: "최신순\n인기순\n가격순" }),
      ),
      block("range", { label: "최대 가격", value: 70, unit: "만원" }),
      button("검색하기"),
    ],
  ),
  recipe(
    "app-header",
    "앱 도구 모음",
    "탐색",
    "브랜드·검색·알림·프로필 헤더",
    [
      row(
        heading("Workspace", "h3"),
        input("검색", "text", "프로젝트 검색"),
        icon("bell"),
        block("avatar", { name: "김민지", role: "관리자" }),
      ),
    ],
    { padding: 16 },
  ),
  recipe(
    "bottom-navigation",
    "하단 탐색 바",
    "탐색",
    "아이콘과 메뉴를 각각 편집하는 하단 바",
    [
      row(
        stack(icon("globe"), button("홈", "ghost")),
        stack(icon("search"), button("탐색", "ghost")),
        stack(icon("heart"), button("즐겨찾기", "ghost")),
        stack(icon("user"), button("내 정보", "ghost")),
      ),
    ],
    { fillColor: "theme:surface", strokeColor: "theme:border", strokeWidth: 1 },
  ),
  recipe(
    "announcement-bar",
    "공지 띠",
    "탐색",
    "상단 공지·배지·이동 버튼",
    [
      row(
        tag("NEW"),
        text("새로운 기능을 만나보세요."),
        button("자세히 보기", "ghost"),
      ),
    ],
    { fillColor: "theme:soft", padding: 16 },
  ),
  recipe(
    "link-directory",
    "링크 모음",
    "탐색",
    "프로필과 주요 링크를 모은 페이지",
    [
      block("avatar", {
        name: "Creative Studio",
        role: "작은 아이디어를 큰 경험으로",
      }),
      button("포트폴리오", "secondary"),
      button("블로그", "secondary"),
      button("프로젝트 문의", "secondary"),
      row(icon("mail"), icon("globe")),
    ],
  ),
  recipe(
    "stats-overview",
    "지표 대시보드",
    "데이터",
    "네 개의 지표와 기간 필터",
    [
      row(
        heading("이번 달 현황"),
        block("segmented", { items: "주간\n월간\n연간", current: 1 }),
      ),
      grid(
        block("stat", {
          label: "총 매출",
          value: "₩12,480,000",
          change: "+18.2%",
        }),
        block("stat", { label: "주문", value: "1,284", change: "+8.4%" }),
        block("stat", { label: "신규 고객", value: "392", change: "+12.1%" }),
        block("stat", { label: "전환율", value: "4.8%", change: "+0.6%" }),
      ),
    ],
  ),
  recipe(
    "analytics-panel",
    "분석 패널",
    "데이터",
    "활동 차트·목표·설명을 함께 배치",
    [
      heading("활동 분석"),
      grid(
        block("bar-chart", { title: "주간 방문" }),
        block("donut-chart", { title: "목표 진행률", value: 76 }),
        block("meter", {
          title: "이번 달 작업",
          value: 42,
          max: 60,
          unit: "건",
        }),
      ),
    ],
  ),
  recipe(
    "kanban-board",
    "칸반 보드",
    "데이터",
    "카드를 개별 이동할 수 있는 세 열 작업 보드",
    [
      heading("프로젝트 보드"),
      grid(
        stack(
          tag("할 일"),
          card(
            heading("화면 구조 정리", "h3"),
            text("핵심 화면의 흐름을 정리합니다."),
            block("avatar", { name: "김민지", role: "오늘" }),
          ),
          card(text("고객 인터뷰 준비"), tag("중요")),
        ),
        stack(
          tag("진행 중"),
          card(
            heading("첫 화면 디자인", "h3"),
            text("브랜드 톤을 반영합니다."),
            block("progress", { value: 60, label: "진행률" }),
          ),
        ),
        stack(
          tag("완료"),
          card(
            heading("요구사항 정리", "h3"),
            text("주요 범위를 확정했습니다."),
            tag("완료"),
          ),
        ),
      ),
    ],
  ),
  recipe(
    "task-checklist",
    "할 일 목록",
    "데이터",
    "진행률과 체크 가능한 작업 항목",
    [
      heading("오늘의 할 일"),
      block("progress", { label: "완료율", value: 40 }),
      block("checkbox", { label: "디자인 시안 검토", checked: true }),
      block("checkbox", { label: "컴포넌트 정리", checked: false }),
      block("checkbox", { label: "사용성 검사", checked: false }),
      row(input("새 할 일"), button("추가", "secondary")),
    ],
  ),
  recipe(
    "activity-panel",
    "활동 기록 패널",
    "데이터",
    "최근 활동과 팀원 목록",
    [
      heading("최근 활동"),
      block("timeline", {
        title: "오늘",
        items:
          "방금|김민지|새 시안을 올렸습니다.\n10분 전|이준호|검토를 완료했습니다.\n1시간 전|박서연|댓글을 남겼습니다.",
      }),
      block("avatar-group"),
    ],
  ),
  recipe(
    "team-directory",
    "팀원 목록 표",
    "데이터",
    "이름·역할·상태를 편집하는 팀 목록",
    [
      row(heading("우리 팀"), button("멤버 초대")),
      block("table", {
        title: "팀 구성원",
        columns: "이름|역할|상태|가입일",
        rows: "김민지|디자이너|활성|2026-09-01\n이준호|개발자|활성|2026-09-12\n박서연|기획자|초대 중|2026-10-01",
      }),
    ],
  ),
  recipe(
    "invoice-list",
    "청구서 목록",
    "데이터",
    "기간별 결제와 상태를 보여주는 표",
    [
      heading("청구 내역"),
      block("table", {
        title: "최근 청구서",
        columns: "번호|날짜|금액|상태",
        rows: "INV-1003|2026-10-01|₩49,000|결제 완료\nINV-1002|2026-09-01|₩49,000|결제 완료\nINV-1001|2026-08-01|₩29,000|결제 완료",
      }),
      button("내역 다운로드", "secondary"),
    ],
  ),
  recipe(
    "pricing-comparison",
    "요금제 비교",
    "커머스",
    "세 요금제의 가격·기능·버튼을 비교",
    [
      heading("필요에 맞는 플랜"),
      text("작게 시작하고 함께 성장하세요."),
      grid(
        block("pricing", {
          title: "Starter",
          price: "₩0",
          body: "가볍게 시작",
          featured: false,
          items: "프로젝트 3개\n기본 테마\n파일 내보내기",
        }),
        block("pricing", { title: "Pro", price: "₩19,000", featured: true }),
        block("pricing", {
          title: "Team",
          price: "₩49,000",
          body: "함께 만드는 팀",
          featured: false,
          items: "팀 워크스페이스\n권한 관리\n우선 지원",
        }),
      ),
    ],
  ),
  recipe(
    "product-detail",
    "상품 상세",
    "커머스",
    "이미지·가격·옵션·수량을 따로 조정",
    [
      grid(
        image("상품 이미지", "1/1"),
        stack(
          tag("NEW COLLECTION"),
          heading("Everyday Chair"),
          text("오래 머물고 싶은 공간을 위한 디자인"),
          heading("₩129,000", "h3"),
          block("rating", { value: 5, label: "구매 후기" }),
          block("select", { label: "색상", items: "내추럴\n월넛\n블랙" }),
          block("quantity"),
          row(button("장바구니 담기"), button("바로 구매", "secondary")),
        ),
      ),
    ],
  ),
  recipe(
    "cart-summary",
    "장바구니 요약",
    "커머스",
    "상품·수량·배송비·합계 편집",
    [
      heading("장바구니"),
      row(
        image("선택한 상품", "1/1"),
        stack(
          heading("Everyday Chair", "h3"),
          text("내추럴 · 1개"),
          block("quantity"),
        ),
      ),
      block("divider"),
      row(text("상품 금액"), text("₩129,000")),
      row(text("배송비"), text("무료")),
      row(heading("합계", "h3"), heading("₩129,000", "h3")),
      button("주문하기"),
    ],
  ),
  recipe(
    "checkout-form",
    "주문 입력",
    "커머스",
    "배송지와 결제 안내를 조립한 화면",
    [
      heading("배송 정보"),
      row(input("받는 분"), input("연락처")),
      input("주소"),
      input("상세 주소"),
      block("textarea", { label: "배송 요청사항", rows: 2 }),
      block("radio", {
        label: "결제 수단",
        items: "신용카드\n계좌이체\n간편결제",
      }),
      button("결제 요청"),
    ],
  ),
  recipe("order-confirmation", "주문 완료", "커머스", "완료 안내와 주문 정보", [
    icon("check"),
    heading("주문을 접수했어요"),
    text("주문 번호 ORD-20261006"),
    block("timeline", {
      title: "배송 과정",
      items:
        "오늘|주문 접수|주문 내용을 확인하고 있어요.\n내일|상품 준비|정성껏 포장합니다.\n곧|배송 시작|도착 소식을 알려드릴게요.",
    }),
    button("주문 내역 보기", "secondary"),
  ]),
  recipe(
    "coupon-card",
    "쿠폰 카드",
    "커머스",
    "혜택·코드·기간·버튼으로 구성",
    [
      tag("WELCOME"),
      heading("첫 구매 15% 할인"),
      text("코드 WELCOME15 · 2026년 12월 31일까지"),
      button("쿠폰 받기"),
    ],
    { fillColor: "theme:soft", cornerRadius: 20 },
  ),
  recipe(
    "article-card",
    "아티클 카드",
    "콘텐츠",
    "사진·분류·제목·저자를 따로 편집",
    [
      image("아티클 대표 이미지"),
      tag("DESIGN"),
      heading("좋은 경험을 만드는 작은 차이", "h3"),
      text("사용자의 하루를 더 편리하게 만드는 디자인 이야기를 만나보세요."),
      block("avatar", { name: "김서윤", role: "2026.10.06 · 5분 읽기" }),
      button("계속 읽기", "ghost"),
    ],
  ),
  recipe("blog-feed", "블로그 피드", "콘텐츠", "카드 세 개로 구성된 글 목록", [
    row(heading("새로운 이야기"), button("전체 보기", "ghost")),
    grid(
      card(
        image("디자인 이야기"),
        tag("디자인"),
        heading("명확한 화면의 비밀", "h3"),
        text("읽기 쉬운 인터페이스를 위한 원칙"),
      ),
      card(
        image("팀 이야기"),
        tag("팀"),
        heading("함께 만드는 과정", "h3"),
        text("더 나은 협업을 만드는 습관"),
      ),
      card(
        image("제품 이야기"),
        tag("제품"),
        heading("작은 실험의 힘", "h3"),
        text("아이디어를 빠르게 확인하는 방법"),
      ),
    ),
  ]),
  recipe(
    "split-hero",
    "분할 소개 영역",
    "콘텐츠",
    "문구·버튼·이미지가 독립된 히어로",
    [
      grid(
        stack(
          tag("YOUR NEXT IDEA"),
          heading("아이디어를\n새로운 경험으로."),
          text("필요한 요소를 고르고, 원하는 모습으로 자유롭게 바꿔보세요."),
          row(button("지금 시작하기"), button("예시 둘러보기", "secondary")),
        ),
        image("브랜드 비주얼", "4/3"),
      ),
    ],
    { padding: 48 },
  ),
  recipe(
    "feature-overview",
    "기능 소개 그리드",
    "콘텐츠",
    "아이콘·제목·설명이 독립된 기능 카드",
    [
      heading("좋은 작업을 위한 모든 것"),
      grid(
        card(
          icon("sparkles"),
          heading("빠르게 시작", "h3"),
          text("준비된 요소로 바로 시작하세요."),
        ),
        card(
          icon("globe"),
          heading("어디서나 확인", "h3"),
          text("화면 크기에 맞게 조정하세요."),
        ),
        card(
          icon("check"),
          heading("확실하게 전달", "h3"),
          text("작업한 설계를 그대로 공유하세요."),
        ),
      ),
    ],
  ),
  recipe(
    "faq-section",
    "자주 묻는 질문 구역",
    "콘텐츠",
    "소개·질문 목록·추가 문의 버튼",
    [
      heading("궁금한 점이 있나요?"),
      text("자주 묻는 질문을 모았습니다."),
      block("accordion"),
      button("더 문의하기", "secondary"),
    ],
  ),
  recipe(
    "reviews-section",
    "고객 후기 모음",
    "콘텐츠",
    "별점·후기·프로필을 각각 편집",
    [
      heading("함께 만든 좋은 변화"),
      grid(
        quote("김민지", "생각하던 화면을 빠르게 만들 수 있었어요."),
        quote("이준호", "팀과 이야기하는 시간이 훨씬 명확해졌습니다."),
        quote("박서연", "작은 부분까지 직접 바꾸는 것이 좋아요."),
      ),
    ],
  ),
  recipe("event-card", "이벤트 카드", "콘텐츠", "일시·소개·장소·신청 버튼", [
    image("이벤트 포스터"),
    tag("ONLINE EVENT"),
    heading("디자인과 개발이 만나는 시간", "h3"),
    text("2026년 10월 20일 · 오후 7시"),
    text("온라인 라이브 · 사전 신청 무료"),
    button("참가 신청"),
  ]),
  recipe(
    "profile-card",
    "개인 소개 카드",
    "콘텐츠",
    "프로필·소개·태그·연락 버튼",
    [
      block("avatar", {
        name: "김서윤",
        role: "Product Designer",
        initials: "서윤",
      }),
      text("사람과 기술을 연결하는 경험을 만듭니다."),
      row(tag("UI/UX"), tag("브랜딩"), tag("프로토타입")),
      row(button("프로젝트 문의"), button("포트폴리오", "secondary")),
    ],
  ),
  recipe(
    "footer-columns",
    "다단 푸터",
    "탐색",
    "브랜드·서비스·회사·지원 링크",
    [
      grid(
        stack(heading("Forma", "h3"), text("당신의 다음 아이디어를 위해.")),
        stack(
          heading("서비스", "h3"),
          button("기능", "ghost"),
          button("요금제", "ghost"),
        ),
        stack(
          heading("회사", "h3"),
          button("소개", "ghost"),
          button("채용", "ghost"),
        ),
        stack(
          heading("지원", "h3"),
          button("도움말", "ghost"),
          button("문의", "ghost"),
        ),
      ),
      block("divider"),
      text("© 2026 Forma. All rights reserved."),
    ],
  ),
];
