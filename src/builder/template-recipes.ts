import { createNode, type Node, type Project } from "./model";
import type { Prop } from "./catalog";
import { THEME_PRESETS } from "./theme";

export type TemplateInfo = {
  id: string;
  name: string;
  description: string;
  tag: string;
  color: string;
  category: "브랜드·소개" | "앱·데이터" | "스토어·콘텐츠" | "빈 화면";
  trends: string[];
};
type Block = {
  component: string;
  props?: Record<string, Prop>;
  children?: Block[];
  layout?: Partial<Node["layout"]>;
  responsive?: Node["responsive"];
};
const block = (component: string, props: Record<string, Prop> = {}): Block => ({
  component,
  props,
});
const section = (...children: Block[]): Block => ({
  component: "section",
  children,
  layout: { padding: 24, gap: 28 },
  responsive: { desktop: { padding: 56 } },
});
const grid = (...children: Block[]): Block => ({ component: "grid", children });
const heading = (text: string): Block =>
  block("heading", { text, level: "h2" });
const nav = (brand: string): Block =>
  block("navbar", {
    brand,
    items: "소개\n서비스\n이야기",
    label: "함께 시작하기",
  });
const footer = (brand: string): Block => block("footer", { brand });
const spotlight = (
  title: string,
  treatment: string,
  body: string,
  eyebrow = "A NEW PERSPECTIVE",
): Block => block("spotlight", { title, treatment, body, eyebrow });
const feature = (title: string, body: string, icon = "layers"): Block =>
  block("feature", { title, body, icon });
const team = (name: string, role: string): Block =>
  block("team", { name, initials: name.slice(-2), role });
const cards = (title: string, value: string): Block =>
  block("stat", { label: title, value });
const shell = (...children: Block[]): Block => ({
  component: "stack",
  layout: { gap: 0 },
  responsive: { desktop: { direction: "row" } },
  children: [block("sidebar"), section(...children)],
});

const recipes: { info: TemplateInfo; theme: string; blocks: Block[] }[] = [
  {
    info: {
      id: "vivid",
      name: "컬러 팝 랜딩",
      description: "선명한 코랄과 커다란 메시지",
      tag: "VIVID COLOR",
      color: "#ffdbce",
      category: "브랜드·소개",
      trends: ["선명한 컬러", "대형 타이포"],
    },
    theme: "코랄 팝",
    blocks: [
      nav("POP!"),
      spotlight(
        "작은 아이디어,\n커다란 가능성.",
        "gradient",
        "일상을 바꾸는 새로운 발견. 당신의 다음 이야기는 여기에서 시작됩니다.",
        "GOOD IDEAS DESERVE TO GROW",
      ),
      block("logos"),
      section(
        heading("좋아하는 일에 더 가까이."),
        grid(
          feature("가볍게 시작", "생각을 모으고 첫걸음을 내디뎌요."),
          feature(
            "함께 발견",
            "서로 다른 시선이 더 좋은 답을 만듭니다.",
            "globe",
          ),
          feature(
            "꾸준한 변화",
            "작은 성공을 모아 큰 변화를 만들어가요.",
            "bolt",
          ),
        ),
        block("testimonial"),
      ),
      section(block("newsletter")),
      footer("POP!"),
    ],
  },
  {
    info: {
      id: "brutal",
      name: "볼드 스튜디오",
      description: "노란 포인트, 굵은 선, 자신 있는 표현",
      tag: "NEOBRUTALISM",
      color: "#fae34e",
      category: "브랜드·소개",
      trends: ["네오브루탈리즘", "대형 타이포"],
    },
    theme: "볼드 옐로",
    blocks: [
      nav("OFFBEAT®"),
      spotlight(
        "THINK BIG.\nMAKE BOLD.",
        "brutal",
        "평범한 답에 머물지 않는 독립 디자인 스튜디오.",
        "INDEPENDENT DESIGN / SEOUL",
      ),
      block("marquee", { items: "STRATEGY\nDESIGN\nDIGITAL" }),
      block("gallery", { title: "우리가 만드는 변화" }),
      section(
        heading("작지만 강한 팀."),
        grid(
          team("김하나", "Art Director"),
          team("이준", "Digital Designer"),
          team("박수민", "Creative Developer"),
        ),
      ),
      section(block("contact")),
      footer("OFFBEAT®"),
    ],
  },
  {
    info: {
      id: "midnight",
      name: "다크 테크",
      description: "시안빛 인터페이스와 데이터 카드",
      tag: "DARK & IMMERSIVE",
      color: "#111e30",
      category: "브랜드·소개",
      trends: ["다크 모드", "입체 그래픽"],
    },
    theme: "미드나잇 시안",
    blocks: [
      nav("NOVA"),
      spotlight(
        "BEYOND\nTHE ORDINARY.",
        "gradient",
        "복잡한 흐름을 연결하는 하나의 작업 공간.",
        "BUILT FOR WHAT COMES NEXT",
      ),
      section(
        heading("작업의 흐름을 읽다."),
        grid(
          cards("연결된 팀", "2,480"),
          cards("절약한 시간", "32.6h"),
          cards("목표 달성", "98.2%"),
        ),
        {
          component: "grid",
          children: [
            { ...block("bar-chart"), responsive: { tablet: { span: 2 } } },
            block("donut-chart"),
          ],
          responsive: { tablet: { columns: 3 } },
        },
      ),
      block("logos"),
      section(block("accordion")),
      footer("NOVA"),
    ],
  },
  {
    info: {
      id: "editorial",
      name: "에디토리얼 포트폴리오",
      description: "종이 같은 여백과 차분한 세리프",
      tag: "SLOW EDITORIAL",
      color: "#f3e1d5",
      category: "스토어·콘텐츠",
      trends: ["타이포 중심", "여백"],
    },
    theme: "웜 에디토리얼",
    blocks: [
      nav("atélier / 26"),
      block("hero", {
        title: "오래 바라보는 것들.\n그 안의 작은 이야기.",
        eyebrow: "A JOURNAL OF EVERYDAY OBJECTS",
        body: "독립 디자이너 서윤의 사물과 공간에 관한 기록.",
        visual: false,
        label: "작업 둘러보기",
        secondary: "소개 읽기",
      }),
      block("gallery", {
        title: "Selected works — 2024 / 2026",
        items: "부드러운 경계|Objects\n고요한 오후|Space\n시간의 조각|Print",
      }),
      section(
        heading("시간이 쌓이는 작업."),
        block("timeline"),
        block("testimonial"),
      ),
      section(block("contact", { title: "새로운 이야기를 기다립니다" })),
      footer("atélier"),
    ],
  },
  {
    info: {
      id: "collage",
      name: "콜라주 크리에이터",
      description: "비대칭 그래픽과 자유로운 보라색",
      tag: "PLAYFUL COLLAGE",
      color: "#e9d5fa",
      category: "스토어·콘텐츠",
      trends: ["콜라주", "자유로운 구성"],
    },
    theme: "라일락 콜라주",
    blocks: [
      nav("MIXED FEELINGS"),
      spotlight(
        "조금 다르게.\n훨씬 나답게.",
        "collage",
        "아이디어와 이미지를 섞고 연결하는 크리에이티브 놀이터.",
        "A LITTLE BIT OF EVERYTHING",
      ),
      block("marquee", { items: "IMAGINE\nCUT & PASTE\nPLAY" }),
      block("gallery", {
        title: "이번 달의 영감",
        items:
          "Purple Monday|Visual Diary\nUnexpected Shapes|Experiments\nHappy Accidents|Collage",
      }),
      section(
        grid(
          team("이소라", "Visual Artist"),
          team("정연우", "Motion Designer"),
          team("김다온", "Illustrator"),
        ),
      ),
      section(block("newsletter", { title: "새로운 영감을 나눠요" })),
      footer("MIXED FEELINGS"),
    ],
  },
  {
    info: {
      id: "retro",
      name: "레트로 퓨처",
      description: "민트빛 터미널과 격자 그래픽",
      tag: "RETRO FUTURE",
      color: "#314a3b",
      category: "브랜드·소개",
      trends: ["레트로 퓨처리즘", "다크 모드"],
    },
    theme: "레트로 민트",
    blocks: [
      nav("CTRL / FUTURE"),
      spotlight(
        "HELLO,\nNEXT WORLD_",
        "retro",
        "익숙한 감각으로 시작하는 새로운 시대의 도구.",
        "SYSTEM READY · VERSION 2.6",
      ),
      block("marquee", { items: "BUILD\nREMIX\nREPEAT" }),
      section(
        heading("CHOOSE YOUR PATH"),
        grid(
          block("pricing", {
            title: "EXPLORER",
            price: "무료",
            featured: false,
          }),
          block("pricing", {
            title: "MAKER",
            price: "₩19,000",
            featured: true,
          }),
          block("pricing", {
            title: "TEAM",
            price: "₩49,000",
            featured: false,
          }),
        ),
      ),
      section(block("accordion")),
      footer("CTRL / FUTURE"),
    ],
  },
  {
    info: {
      id: "commerce",
      name: "라이프스타일 스토어",
      description: "자연스러운 색과 정돈된 상품 진열",
      tag: "CONSIDERED LIVING",
      color: "#dce8d6",
      category: "스토어·콘텐츠",
      trends: ["자연스러운 컬러", "절제된 구성"],
    },
    theme: "포레스트 리빙",
    blocks: [
      nav("morrow"),
      block("hero", {
        title: "매일의 공간에,\n오래가는 아름다움.",
        eyebrow: "OBJECTS FOR A SLOWER LIFE",
        body: "좋은 소재와 정직한 디자인으로 채우는 일상.",
        visual: false,
        label: "컬렉션 보기",
        secondary: "브랜드 이야기",
      }),
      section(
        heading("The everyday collection"),
        grid(
          block("product", {
            title: "Everyday Chair",
            price: "₩129,000",
            badge: "BEST",
          }),
          block("product", {
            title: "Slow Dining Chair",
            price: "₩189,000",
            badge: "NEW",
          }),
          block("product", {
            title: "Sunday Lounge Chair",
            price: "₩249,000",
            badge: "LIMITED",
          }),
        ),
      ),
      section(
        block("testimonial"),
        block("newsletter", { title: "좋은 물건의 이야기를 전해요" }),
      ),
      footer("morrow"),
    ],
  },
  {
    info: {
      id: "workspace",
      name: "팀 워크스페이스",
      description: "검색, 일정, 대화를 한 화면에",
      tag: "TEAM SPACE",
      color: "#eeecff",
      category: "앱·데이터",
      trends: ["카드형 구성", "명확한 정보 계층"],
    },
    theme: "인디고 클라우드",
    blocks: [
      shell(
        block("breadcrumbs", { items: "워크스페이스\n팀 홈" }),
        block("heading", {
          text: "오늘의 연결, 내일의 아이디어.",
          level: "h1",
        }),
        block("avatar-group"),
        grid(
          cards("진행 중", "12"),
          cards("이번 주 완료", "8"),
          cards("팀원", "16"),
        ),
        {
          component: "grid",
          responsive: { desktop: { columns: 2 } },
          children: [block("search"), block("calendar")],
        },
        block("progress"),
        block("chat"),
      ),
    ],
  },
  {
    info: {
      id: "analytics",
      name: "애널리틱스 보드",
      description: "차트, 비율, 표로 데이터 읽기",
      tag: "DATA & INSIGHTS",
      color: "#d7f3fa",
      category: "앱·데이터",
      trends: ["데이터 시각화", "다크 모드"],
    },
    theme: "미드나잇 시안",
    blocks: [
      shell(
        block("heading", { text: "숫자에서 다음 기회를.", level: "h1" }),
        block("text", {
          text: "서비스의 움직임을 한눈에 확인하세요. 표시된 수치는 예시입니다.",
        }),
        grid(
          cards("월간 방문", "128,420"),
          cards("전환율", "4.8%"),
          cards("평균 체류", "3m 24s"),
        ),
        {
          component: "grid",
          responsive: { desktop: { columns: 2 } },
          children: [
            block("bar-chart", {
              title: "채널별 방문",
              items: "검색|84\n직접|61\n소셜|42\n추천|29",
              unit: "K",
            }),
            block("donut-chart", { title: "분기 목표", value: 82 }),
          ],
        },
        block("table"),
        block("pagination"),
      ),
    ],
  },
  {
    info: {
      id: "launch",
      name: "프로덕트 런칭",
      description: "기능 소개부터 요금제와 FAQ까지",
      tag: "PRODUCT LAUNCH",
      color: "#ddf2fa",
      category: "브랜드·소개",
      trends: ["부드러운 그래픽", "읽기 쉬운 구성"],
    },
    theme: "오션 블루",
    blocks: [
      nav("flowly"),
      block("hero", {
        title: "흩어진 일을 모으고,\n오늘의 흐름을 만들어요.",
        eyebrow: "YOUR DAY, IN FLOW",
        label: "무료로 시작",
        secondary: "기능 살펴보기",
      }),
      block("logos"),
      section(
        heading("처음부터 끝까지 매끄럽게."),
        grid(
          feature("한곳에서 정리", "아이디어, 메모, 작업을 연결하세요."),
          feature(
            "진행 상황 확인",
            "다음에 할 일을 바로 알 수 있어요.",
            "bolt",
          ),
          feature("팀과 함께", "같은 목표를 보며 나아가세요.", "globe"),
        ),
      ),
      section(
        heading("내게 맞는 시작"),
        grid(
          block("pricing", { title: "개인", price: "무료", featured: false }),
          block("pricing", { title: "프로", price: "₩12,000", featured: true }),
          block("pricing", { title: "팀", price: "₩29,000", featured: false }),
        ),
      ),
      section(block("accordion")),
      footer("flowly"),
    ],
  },
  {
    info: {
      id: "learning",
      name: "러닝 대시보드",
      description: "학습 단계와 성취도를 친절하게",
      tag: "LEARN & GROW",
      color: "#fce5ed",
      category: "앱·데이터",
      trends: ["성취 피드백", "친근한 인터페이스"],
    },
    theme: "로즈 페이퍼",
    blocks: [
      shell(
        block("badge", { text: "매일 조금씩 성장하기" }),
        block("heading", { text: "다음 챕터를 열어볼까요?", level: "h1" }),
        block("progress", {
          label: "UI 디자인 입문",
          value: 60,
          body: "전체 10개 수업 중 6개를 완료했어요.",
        }),
        block("steps", {
          items: "기초 다지기\n직접 만들어보기\n프로젝트 완성",
          current: 2,
        }),
        grid(
          feature("컬러와 분위기", "색으로 전달하는 첫인상."),
          feature("배치와 여백", "내용을 편안하게 읽도록 정리해요."),
          feature("인터랙션", "작은 피드백이 만드는 좋은 경험.", "bolt"),
        ),
        block("tabs", {
          items:
            "학습 소개|매일 20분, 작은 실습으로 시작해요.\n커리큘럼|컬러, 타이포, 레이아웃, 상호작용을 차례대로 배웁니다.",
        }),
        block("calendar", { title: "다음 학습 일정" }),
      ),
    ],
  },
  {
    info: {
      id: "support",
      name: "고객 도움 센터",
      description: "검색과 도움말, 문의를 가까이",
      tag: "HELPFUL BY DESIGN",
      color: "#eaf0e5",
      category: "앱·데이터",
      trends: ["쉬운 탐색", "명확한 피드백"],
    },
    theme: "올리브 스튜디오",
    blocks: [
      nav("help / studio"),
      section(
        block("heading", { text: "어떤 도움이 필요하세요?", level: "h1" }),
        block("search", {
          label: "도움말 검색",
          placeholder: "궁금한 내용을 입력하세요",
          items:
            "처음 시작하는 방법\n내 작업 저장하기\n팀과 공유하기\n테마 변경하기\n파일 내보내기",
        }),
        grid(
          feature("시작 가이드", "처음 사용하는 분들을 위한 안내."),
          feature("활용 팁", "일상을 더 편하게 만드는 작은 방법.", "bolt"),
          feature(
            "자주 묻는 질문",
            "많이 궁금해하는 내용을 모았어요.",
            "globe",
          ),
        ),
        block("accordion"),
        block("contact", { title: "아직 궁금한 점이 있나요?" }),
      ),
      footer("help / studio"),
    ],
  },
];

export const EXTRA_TEMPLATES = recipes.map((r) => r.info);
export function applyRecipe(project: Project, id: string): boolean {
  const recipe = recipes.find((r) => r.info.id === id);
  if (!recipe) return false;
  project.theme = structuredClone(
    THEME_PRESETS.find((t) => t.name === recipe.theme)!,
  );
  const add = (parent: Node, item: Block) => {
    const n = createNode(item.component);
    n.props = { ...n.props, ...item.props };
    n.layout = { ...n.layout, ...item.layout };
    n.responsive = { ...n.responsive, ...item.responsive };
    project.nodes[n.id] = n;
    parent.children.push(n.id);
    item.children?.forEach((child) => add(n, child));
  };
  recipe.blocks.forEach((item) =>
    add(project.nodes[project.pages[0].rootId], item),
  );
  return true;
}
