export interface DesignStyle {
  id: string;
  name: string;
  koreanName: string;
  category: string;
  description: string;
  visualKeywords: string[];
  bestFor: string;
  palette: {
    bg: string;
    cardBg: string;
    cardBorder: string;
    accent: string;
    accentSecondary: string;
    textPrimary: string;
    textSecondary: string;
    badgeBg: string;
    badgeText: string;
    shadow: string;
  };
  fontFamily: string;
  fontMood: string;
  aiPromptKeywords: string;
  antiPatterns: string[];
  layoutReasoningRule: string;
}

export const DESIGN_STYLES: DesignStyle[] = [
  {
    id: 'dark-oled',
    name: 'Dark Mode (OLED)',
    koreanName: '🌌 다크 모드 (OLED & 네온)',
    category: 'High-Tech & Future',
    description: '깊은 딥블랙(#000000 / #0F172A) 배경에 눈의 피로를 최소화하고 네온 에메랄드/사이언 발광이 돋보이는 모던 테크 스타일',
    visualKeywords: ['OLED 딥블랙', '네온 민트 글로우', '미세 서피스 보더', '고대비 가독성', '미래지향적'],
    bestFor: 'SaaS 대시보드, 개발자 도구, 금융/핀테크, 테크 기업 IR 피치덱',
    palette: {
      bg: '#090D16',
      cardBg: '#131B2E',
      cardBorder: '#232F48',
      accent: '#22C55E',
      accentSecondary: '#38BDF8',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      badgeBg: 'rgba(34, 197, 94, 0.15)',
      badgeText: '#4ADE80',
      shadow: '0 8px 30px rgba(0,0,0,0.5)',
    },
    fontFamily: 'Inter, system-ui, sans-serif',
    fontMood: '기하학적 산세리프, 날렵하고 신뢰감 있는 폰트',
    aiPromptKeywords: 'Deep OLED dark theme, #090D16 background, elevated dark slate cards with subtle 1px border (#232F48), glowing neon mint green (#22C55E) accents, high-contrast crisp typography (WCAG 7:1), futuristic professional look',
    antiPatterns: [
      '형광 네온 색상을 본문 텍스트에 남발하지 말 것 (오직 하이라이트 지표와 CTA에만 한정)',
      '저대비 회색 텍스트로 가독성을 해치지 말 것',
      '촌스러운 보라색/분홍색 인공 AI 그라데이션 금지',
    ],
    layoutReasoningRule: '데이터와 수치가 많을 때는 3~4열 대형 KPI 카드와 스파크라인 차트 레이아웃으로, 단계별 프로세스일 때는 발광 노드 타임라인으로 지능적 자동 배치',
  },
  {
    id: 'glassmorphism',
    name: 'Glassmorphism & Frosted Glass',
    koreanName: '🪟 글래스모피즘 (프로스티드 글래스)',
    category: 'Depth & Modern',
    description: '반투명 블러 유리 효과(backdrop-blur), 섬세한 화이트 반사광 보더와 다층 깊이감(Z-depth)의 프리미엄 스타일',
    visualKeywords: ['반투명 유리', '배경 블러 16px', '1px 화이트 반사광 테두리', '부드러운 조명', '고급스러운 깊이감'],
    bestFor: '핀테크 앱, 프리미엄 서비스 소개, 크리에이티브 포트폴리오, 세련된 웹 랜딩',
    palette: {
      bg: '#0F172A',
      cardBg: 'rgba(30, 41, 59, 0.65)',
      cardBorder: 'rgba(255, 255, 255, 0.15)',
      accent: '#38BDF8',
      accentSecondary: '#818CF8',
      textPrimary: '#FFFFFF',
      textSecondary: '#CBD5E1',
      badgeBg: 'rgba(56, 189, 248, 0.15)',
      badgeText: '#38BDF8',
      shadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
    },
    fontFamily: 'Inter, SF Pro Display, sans-serif',
    fontMood: '현대적이고 투명감 있는 미니멀 산세리프',
    aiPromptKeywords: 'Glassmorphism interface, frosted glass panels with backdrop-filter blur(16px), 1px subtle white reflective border (rgba(255,255,255,0.18)), floating layered depth, electric cyan (#38BDF8) accents on dark atmosphere',
    antiPatterns: [
      '배경과 카드 사이의 대비가 부족해 텍스트가 묻히는 현상 금지',
      '블러 효과를 과도하게 주어 레이아웃이 지저분해지는 것 방지',
      '버튼 클릭 영역이 불투명하지 않아 인지하기 어려운 디자인 금지',
    ],
    layoutReasoningRule: '메인 가치제안은 플로팅 글래스 카드로 강조하고, 세부 기능들은 입체적인 반투명 벤토 박스 그리드로 나누어 위계를 형성',
  },
  {
    id: 'swiss-minimal',
    name: 'Minimalism & Swiss Style',
    koreanName: '⚪️ 스위스 미니멀 (클린 화이트 & 여백)',
    category: 'Clean & Classic',
    description: '충분한 호흡의 여백, 12열 엄격한 그리드 시스템, 블랙 & 오프화이트의 절제된 타이포그래피 미학',
    visualKeywords: ['극대화된 여백', '스위스 그리드', '절제된 흑백 대비', '군더더기 없는 기능미', '고급 산세리프'],
    bestFor: '비즈니스 제안서, 엔터프라이즈 B2B, 건축/예술 포트폴리오, 테크 브로셔',
    palette: {
      bg: '#F8FAFC',
      cardBg: '#FFFFFF',
      cardBorder: '#E2E8F0',
      accent: '#0F172A',
      accentSecondary: '#2563EB',
      textPrimary: '#0F172A',
      textSecondary: '#64748B',
      badgeBg: '#F1F5F9',
      badgeText: '#0F172A',
      shadow: '0 2px 10px rgba(0,0,0,0.04)',
    },
    fontFamily: 'Helvetica Neue, Arial, sans-serif',
    fontMood: '클래식하고 완벽한 균형감의 스위스 인터내셔널 타이포그래피',
    aiPromptKeywords: 'Swiss Graphic Design style, absolute minimalism, generous whitespace, 12-column grid structure, stark monochromatic contrast with single royal blue accent, ultra-clean sans-serif typography, no unnecessary decoration',
    antiPatterns: [
      '불필요한 그라데이션이나 3D 그림자 사용 금지',
      '여백 없이 텍스트를 빽빽하게 채워 넣는 행위 금지',
      '산만한 다채로운 색상 혼용 금지 (단 하나의 강렬한 포인트 컬러만 허용)',
    ],
    layoutReasoningRule: '핵심 텍스트는 좌측 정렬 대형 타이포로 단호하게 전달하고, 데이터는 비례가 완벽한 모듈러 그리드 테이블로 깔끔하게 정리',
  },
  {
    id: 'neo-brutalism',
    name: 'Neo-Brutalism & Bold Block',
    koreanName: '⚡️ 네오 브루탈리즘 (비비드 & 볼드)',
    category: 'Trendy & Punchy',
    description: '두꺼운 블랙 2~3px 외곽선, 하드 드롭 섀도우(No Blur), 팝한 비비드 옐로우/코랄 블록의 폭발적인 주목도',
    visualKeywords: ['2px 블랙 외곽선', '하드 드롭 섀도우 (0 blur)', '팝 옐로우/핑크', '스티커 뱃지', '경쾌한 키치 감성'],
    bestFor: '스타트업 런칭 배너, 유튜브 썸네일, Z세대 타겟 SNS 카드뉴스, 프로모션 이벤트',
    palette: {
      bg: '#FEF08A',
      cardBg: '#FFFFFF',
      cardBorder: '#000000',
      accent: '#000000',
      accentSecondary: '#F43F5E',
      textPrimary: '#000000',
      textSecondary: '#18181B',
      badgeBg: '#F43F5E',
      badgeText: '#FFFFFF',
      shadow: '4px 4px 0px #000000',
    },
    fontFamily: 'Public Sans, Montserrat, sans-serif',
    fontMood: '굵고 힘 있는 볼드 헤비 웨이트 타이포그래피',
    aiPromptKeywords: 'Neo-brutalism design, high-contrast bold 2-3px black borders, hard drop shadows without blur (4px 4px 0px #000), vibrant pastel/electric yellow palette, playful sticker badges, energetic punchy layout',
    antiPatterns: [
      '부드러운 블러 그림자나 그라데이션 사용 금지 (오직 하드 섀도우만 허용)',
      '흐릿한 파스텔 톤 금지',
      '너무 작고 얇은 폰트 금지 (최소 16pt 이상 볼드 폰트 권장)',
    ],
    layoutReasoningRule: '가장 시급하거나 파격적인 혜택은 대형 스티커 박스로 강조하고, 비교 항목은 선명한 컬러 블록의 대칭 박스로 눈에 띄게 구성',
  },
  {
    id: 'bento-grid',
    name: 'Bento Grid & Apple Modern',
    koreanName: '🍱 벤토 그리드 (애플 스타일)',
    category: 'SaaS & Tech',
    description: '크고 작은 사각형 박스들이 조화롭게 모인 모던 도시락(Bento) 형태의 직관적인 정보 구조화',
    visualKeywords: ['비대칭 모듈러 박스', '둥근 모서리 20px', '마이크로 인터랙션 목업', '스마트폰 앱 감성', '정돈된 다채로움'],
    bestFor: 'SaaS 프로덕트 소개, 기능 하이라이트 웹, 신제품 발표 슬라이드, 피치덱',
    palette: {
      bg: '#0F172A',
      cardBg: '#1E293B',
      cardBorder: '#334155',
      accent: '#38BDF8',
      accentSecondary: '#A855F7',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      badgeBg: 'rgba(56, 189, 248, 0.15)',
      badgeText: '#38BDF8',
      shadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
    },
    fontFamily: 'Inter, system-ui, sans-serif',
    fontMood: '세련되고 현대적인 글로벌 테크 산세리프',
    aiPromptKeywords: 'Apple-style Bento Grid layout, modular rounded rectangular containers (border-radius 20px), asymmetric hierarchical boxes, dark slate background (#0F172A), clean icons and mini interactive UI snippets inside cards',
    antiPatterns: [
      '모든 카드의 크기를 똑같이 만들어 벤토 그리드 고유의 리듬감을 없애지 말 것',
      '한 박스 안에 텍스트를 과도하게 채워 답답하게 만들지 말 것',
    ],
    layoutReasoningRule: '가장 중요한 킬러 기능이나 핵심 지표는 2열을 차지하는 메인 빅 카드에 배치하고, 부가적인 3개 특징은 작은 정사각형 카드에 압축 배치',
  },
  {
    id: 'soft-ui',
    name: 'Soft UI Evolution',
    koreanName: '🌸 소프트 UI (뉴모피즘 진화형)',
    category: 'Gentle & Wellness',
    description: '기존 뉴모피즘의 가독성 문제를 해결한 부드러운 다층 그림자, 포근한 파스텔 웜톤과 프리미엄 웰빙 감성',
    visualKeywords: ['부드러운 다층 그림자', '포근한 파스텔 웜톤', '둥근 모서리 18px', '자연스럽고 편안한 무드'],
    bestFor: '헬스케어, 웰빙/뷰티, 라이프스타일 앱, 감성 브랜드 뉴스레터 및 상세페이지',
    palette: {
      bg: '#FDFBF7',
      cardBg: '#FFFFFF',
      cardBorder: '#F5EFE6',
      accent: '#E07A5F',
      accentSecondary: '#81B29A',
      textPrimary: '#2D3142',
      textSecondary: '#6C757D',
      badgeBg: '#FCEFE9',
      badgeText: '#E07A5F',
      shadow: '0 10px 30px rgba(0,0,0,0.05)',
    },
    fontFamily: 'Pretendard, Inter, sans-serif',
    fontMood: '부드럽고 따뜻하며 가독성이 뛰어난 휴머니스트 폰트',
    aiPromptKeywords: 'Soft UI Evolution, warm cream background (#FDFBF7), delicate multi-layer soft drop shadows, terracotta accent (#E07A5F) and sage green (#81B29A), rounded smooth corners (18px), accessible high contrast, calm wellness aesthetic',
    antiPatterns: [
      '순수 뉴모피즘처럼 텍스트와 배경이 회색으로 묻혀 안 보이는 접근성 결함 금지',
      '차가운 형광색이나 거친 네온 사용 금지',
    ],
    layoutReasoningRule: '공감대 형성을 위한 스토리와 체크리스트는 여유로운 간격의 부드러운 화이트 카드로 묶고, CTA는 따뜻한 테라코타 포인트 컬러로 유도',
  },
  {
    id: 'aurora-mesh',
    name: 'Aurora UI & Mesh Gradient',
    koreanName: '🌌 오로라 UI (빛의 메쉬 그라데이션)',
    category: 'Atmospheric & Luminous',
    description: '북극광처럼 일렁이는 신비로운 메쉬 그라데이션과 빛의 스펙트럼이 몽환적으로 어우러지는 현대적 감성',
    visualKeywords: ['오로라 메쉬 그라데이션', '빛의 산란', '발광 네온 스펙트럼', '부드러운 색채 블렌딩', '시각적 황홀경'],
    bestFor: 'AI 서비스, 음악/미디어 플랫폼, 혁신적인 신제품 런칭 키노트 슬라이드',
    palette: {
      bg: '#0B0813',
      cardBg: 'rgba(23, 17, 38, 0.7)',
      cardBorder: 'rgba(192, 132, 252, 0.25)',
      accent: '#C084FC',
      accentSecondary: '#38BDF8',
      textPrimary: '#FAF5FF',
      textSecondary: '#D8B4FE',
      badgeBg: 'rgba(192, 132, 252, 0.2)',
      badgeText: '#E9D5FF',
      shadow: '0 8px 32px rgba(192, 132, 252, 0.15)',
    },
    fontFamily: 'Plus Jakarta Sans, Inter, sans-serif',
    fontMood: '유려하고 진보적인 미래지향적 타이포그래피',
    aiPromptKeywords: 'Aurora UI design, sweeping radial mesh gradients with violet (#C084FC) and electric cyan, deep cosmic dark backdrop (#0B0813), iridescent glow effects, sleek typography with generous tracking',
    antiPatterns: [
      '그라데이션 색상이 너무 탁하게 섞여 칙칙해지는 것 방지',
      '화려한 배경 때문에 전경 텍스트가 읽히지 않는 문제 방지',
    ],
    layoutReasoningRule: '배경의 빛의 흐름을 방해하지 않도록 중앙에 웅장한 가치제안 타이틀을 띄우고, 하단에 핵심 지표를 빛나는 반투명 캡슐로 묶어 연출',
  },
  {
    id: 'luxury-editorial',
    name: 'Luxury & Editorial Serif',
    koreanName: '🏛️ 럭셔리 에디토리얼 (세리프 & 골드)',
    category: 'High-End & Elegance',
    description: '우아한 세리프 타이포그래피, 골드(#D4AF37)와 딥 차콜(#1A1A1A)의 품격 있는 매거진 레이아웃',
    visualKeywords: ['우아한 세리프 폰트', '샴페인 골드 액센트', '매거진 에디토리얼', '프리미엄 럭셔리', '여백의 미학'],
    bestFor: '명품 커머스, 프라이빗 뱅킹/자산관리, 하이엔드 호텔/스파, 명품 브랜드 발표',
    palette: {
      bg: '#141416',
      cardBg: '#1C1C1E',
      cardBorder: '#2C2C2E',
      accent: '#D4AF37',
      accentSecondary: '#E5C07B',
      textPrimary: '#F5F5F7',
      textSecondary: '#A1A1A6',
      badgeBg: 'rgba(212, 175, 55, 0.15)',
      badgeText: '#E5C07B',
      shadow: '0 12px 40px rgba(0,0,0,0.6)',
    },
    fontFamily: 'Playfair Display, Cormorant Garamond, serif',
    fontMood: '클래식 명품 브랜드의 기품과 권위가 느껴지는 세리프',
    aiPromptKeywords: 'Luxury editorial aesthetic, sophisticated serif typography (Playfair Display), champagne gold accents (#D4AF37), deep charcoal black velvet background (#141416), refined minimalism, magazine cover layout ratio',
    antiPatterns: [
      '싸구려 느낌의 노란색을 골드 대신 사용하지 말 것',
      '아이콘을 과도하게 많이 넣어 품격을 떨어뜨리지 말 것 (사진과 타이포 중심)',
    ],
    layoutReasoningRule: '제목은 대형 세리프 폰트로 웅장하게 서두를 열고, 본문은 2열의 정갈한 서양식 에디토리얼 칼럼으로 배열하여 지적이고 고급스러운 무드 조성',
  },
];
