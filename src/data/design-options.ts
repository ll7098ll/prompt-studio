export interface VisualStyleOption {
  id: string;
  name: string;
  koreanName: string;
  category: 'High-Tech' | 'Clean' | 'Tactile' | 'Pop' | 'Editorial';
  description: string;
  defaultBorderRadius: string;
  shadowType: 'soft-elevation' | 'frosted-glass' | 'hard-shadow' | 'ambient-glow' | 'minimal-flat' | 'clay-3d' | 'editorial-hairline' | 'skeuomorphic' | 'hologram';
  aiKeywords: string;
  antiPatterns: string[];
}

export interface ColorThemeOption {
  id: string;
  name: string;
  koreanName: string;
  mood: string;
  harmonyMode?: string;
  tokens: {
    bg: string;
    cardBg: string;
    cardBorder: string;
    accent: string;
    accentSecondary: string;
    textPrimary: string;
    textSecondary: string;
    badgeBg: string;
    badgeText: string;
  };
}

export interface DesignElementOption {
  id: string;
  name: string;
  koreanName: string;
  category: 'Glow' | 'Glass' | 'Border' | 'Chart' | 'Badge' | 'Layout' | 'Typo' | 'Tag';
  description: string;
  defaultActive: boolean;
  promptDirective: string;
}

/* =========================================================================
   1. 24대 비주얼 디자인 스타일 (24 Distinctive Visual Styles across 5 Categories)
   ========================================================================= */
export const VISUAL_STYLES: VisualStyleOption[] = [
  // ── A. High-Tech & Futuristic (미래지향·첨단 기술) ──────────────────────
  {
    id: 'dark-oled',
    name: 'Dark Mode (OLED)',
    koreanName: '🌌 OLED 딥블랙 & 레이저',
    category: 'High-Tech',
    description: '눈의 피로를 최소화하는 트루블랙(#000000) 배경과 0.5px 미세 레이저 보더, 네온 에메랄드 발광',
    defaultBorderRadius: '16px',
    shadowType: 'ambient-glow',
    aiKeywords: 'Deep OLED dark theme (#000000 background), 0.5px subtle laser hairline border (#232F48), glowing neon mint green (#22C55E) accents, high-contrast crisp text (WCAG 7:1), futuristic professional look',
    antiPatterns: ['본문 텍스트에 형광색 남발 금지', '가독성 떨어지는 어두운 회색 글씨 금지', '촌스러운 보라/분홍 인공 그라데이션 금지'],
  },
  {
    id: 'cyberpunk-hud',
    name: 'Cyberpunk Terminal HUD',
    koreanName: '🔮 사이버펑크 터미널 HUD',
    category: 'High-Tech',
    description: 'CRT 스캔라인, 모노스페이스 터미널 폰트, 형광 시안/마젠타 네온 발광, [SYS::ONLINE] 텔레메트리 태그',
    defaultBorderRadius: '4px',
    shadowType: 'ambient-glow',
    aiKeywords: 'Cyberpunk terminal HUD, scanline CRT texture, vivid electric neon glow (cyan #00F0FF & hot magenta #FF007F), monospace telemetry tags [SYS.ACTIVE], futuristic wireframe grid lines, angled HUD corners',
    antiPatterns: ['너무 난잡한 글리치 효과로 텍스트 가독성 훼손 금지', '명암비 무너짐 금지'],
  },
  {
    id: 'holographic-prism',
    name: 'Holographic Prism & Opal',
    koreanName: '🌈 홀로그래픽 프리즘',
    category: 'High-Tech',
    description: '빛의 굴절 오팔 무지개빛 그라데이션, 반사광 하이라이트, 퓨처리스틱 반투명 프리즘 스펙트럼',
    defaultBorderRadius: '20px',
    shadowType: 'hologram',
    aiKeywords: 'Holographic chromatic aberration, iridescent prism gradients, translucent glass with rainbow sheen, futuristic crystalline refraction, floating luminous layers, soft spectrum highlights',
    antiPatterns: ['너무 강한 무지개색으로 텍스트 판독성 저해 금지', '난잡한 원색 충돌 금지'],
  },
  {
    id: 'biotech-clean',
    name: 'Biotech & Lab Glass',
    koreanName: '🧬 바이오테크 & 랩 글래스',
    category: 'High-Tech',
    description: '극도로 정제된 프로스티드 화이트 글래스, 멸균 민트/사이언 무드, 정밀 계측 차트와 클린 룸 미학',
    defaultBorderRadius: '18px',
    shadowType: 'frosted-glass',
    aiKeywords: 'Biotech clean aesthetic, sterile frosted glass panels with backdrop blur, surgical teal and mint accents (#10B981, #06B6D4), ultra-precise clinical data readouts, micro-grid dividers, clean room atmosphere',
    antiPatterns: ['더럽거나 어두운 텍스처 사용 금지', '유치한 만화풍 일러스트 금지'],
  },
  {
    id: 'space-aerospace',
    name: 'Aerospace Telemetry HUD',
    koreanName: '🛰️ 에어로스페이스 텔레메트리',
    category: 'High-Tech',
    description: '우주선 조종석 UI, 원형 레이다 그리드, 앰버 오렌지/사이언 벡터 라인, 각진 폴리곤 컨테이너',
    defaultBorderRadius: '6px',
    shadowType: 'ambient-glow',
    aiKeywords: 'Aerospace cockpit HUD telemetry, radar circular coordinate grids, tactical amber orange (#F59E0B) and deep navy, chamfered corner containers, vector wireframes, military aerospace telemetry',
    antiPatterns: ['배경 대비가 무너져 전경 텍스트가 묻히는 디자인 금지'],
  },

  // ── B. Modern Clean & Grid (정돈된 모던 미학) ──────────────────────────
  {
    id: 'bento-apple',
    name: 'Bento Grid (Apple Modern)',
    koreanName: '🍱 애플 벤토 그리드',
    category: 'Clean',
    description: '비대칭 모듈러 박스(2x2, 1x2, 2x1)와 미니 차트/게이지 위젯이 조화된 초고밀도 대시보드',
    defaultBorderRadius: '22px',
    shadowType: 'soft-elevation',
    aiKeywords: 'Apple-style Bento Grid layout, modular rounded rectangular containers (border-radius 22px), asymmetric hierarchical boxes (2x2 hero card, compact sparkline pills), dark slate atmosphere (#0F172A), clean micro-interactions',
    antiPatterns: ['모든 카드의 크기를 똑같이 만들어 벤토 그리드 고유의 리듬감 없애기 금지', '한 박스 안에 텍스트 과밀 채우기 금지'],
  },
  {
    id: 'swiss-international',
    name: 'Minimalism & Swiss Style',
    koreanName: '⚪️ 스위스 인터내셔널 그리드',
    category: 'Clean',
    description: '극대화된 여백(40%), 거대한 숫자 인덱스(01, 02), 엄격한 헤어라인과 절제된 흑백 타이포그래피',
    defaultBorderRadius: '0px',
    shadowType: 'minimal-flat',
    aiKeywords: 'Swiss International Typographic Style, radical minimalism, generous negative space (40%), strict dividing hairline rules, oversized bold numeric indexes (01, 02), monochromatic stark contrast, zero drop shadow, functional grid',
    antiPatterns: ['여백 없이 빽빽하게 텍스트 채우기 금지', '불필요한 3D 효과나 그라데이션 금지', '단 하나의 포인트 컬러 외에 다채로운 색상 혼용 금지'],
  },
  {
    id: 'nordic-frost',
    name: 'Nordic Frost & Minimal',
    koreanName: '❄️ 노르딕 프로스트 & 미니멀',
    category: 'Clean',
    description: '쿨그레이(#F1F5F9) 배경, 아이스 블루 악센트, 정갈하고 차분한 호흡의 북유럽 스칸디 미학',
    defaultBorderRadius: '16px',
    shadowType: 'soft-elevation',
    aiKeywords: 'Nordic Scandinavian minimal design, calm cool grey background (#F8FAFC), pale ice blue accents (#38BDF8), delicate soft shadows, spacious typography, serene breathable aesthetic',
    antiPatterns: ['원색적인 빨강/노랑 난사 금지', '복잡하고 산만한 레이아웃 금지'],
  },
  {
    id: 'monochrome-wireframe',
    name: 'Monochrome Blueprint Wireframe',
    koreanName: '📐 모노크롬 와이어프레임',
    category: 'Clean',
    description: '1px 정밀 라인 드로잉, 블루프린트 격자 배경, 미니멀한 설계도 감성과 구조적 투명성',
    defaultBorderRadius: '0px',
    shadowType: 'minimal-flat',
    aiKeywords: 'Architectural blueprint wireframe UI, 1px hairline vector boxes, technical drafting grid lines, stark monochrome black and white with technical cyan guide lines, engineering schematics look',
    antiPatterns: ['두꺼운 3D 볼륨감 금지', '흐릿한 블러 그림자 금지'],
  },
  {
    id: 'japanese-zen',
    name: 'Japanese Zen & Negative Space',
    koreanName: '🍵 재패니즈 젠 (여백과 정적)',
    category: 'Clean',
    description: '자연스러운 한지 미색(#FAF8F5), 깊은 여백, 먹물 잉크 블랙 타이포와 단아한 선의 조화',
    defaultBorderRadius: '6px',
    shadowType: 'minimal-flat',
    aiKeywords: 'Japanese Zen aesthetic, wabi-sabi minimalism, warm washi paper background (#FAF8F5), sumi ink typography (#1F1F1F), asymmetric poetic whitespace, tranquil meditative layout balance',
    antiPatterns: ['인공적인 네온 컬러 금지', '화려한 입체 버튼 금지'],
  },

  // ── C. Bold & Expressive Pop (강렬한 개성과 주목도) ───────────────────
  {
    id: 'neo-brutalism',
    name: 'Neo-Brutalism & Bold Block',
    koreanName: '⚡️ 네오 브루탈리즘 (볼드 블록)',
    category: 'Pop',
    description: '3px 두꺼운 블랙 테두리, 하드 오프셋 그림자(5px 5px 0 #000), 각진 스티커와 강렬한 주목도',
    defaultBorderRadius: '0px',
    shadowType: 'hard-shadow',
    aiKeywords: 'Neo-brutalism aesthetic, aggressive 3px solid black outlines, hard offset drop shadows without blur (5px 5px 0px #000), vibrant pastel and electric yellow palette, rotated sticker badges, raw brutalist typography',
    antiPatterns: ['부드러운 블러 그림자 금지', '흐릿한 파스텔 단독 사용 금지', '얇고 작은 폰트 금지'],
  },
  {
    id: 'y2k-retro-chrome',
    name: 'Y2K Cyber Millennium Chrome',
    koreanName: '💿 Y2K 레트로 크롬 & 글로스',
    category: 'Pop',
    description: '크롬 그라데이션, 세기말 밀레니엄 사이버 팝, 반짝이는 4포인트 스파클 스타와 키치한 퓨처리즘',
    defaultBorderRadius: '18px',
    shadowType: 'ambient-glow',
    aiKeywords: 'Y2K millennium cyber aesthetic, chrome metallic text bevel effects, 4-point sparkle stars, glossy liquid plastic highlights, bubble gum pink (#FF1493) and cyan, nostalgic late-90s internet optimism',
    antiPatterns: ['지나치게 딱딱한 기업용 B2B 폰트 금지', '무채색 단색 단조로움 금지'],
  },
  {
    id: 'acid-streetwear',
    name: 'Acid Graphic & Grunge',
    koreanName: '🛹 애시드 그래픽 & 스트릿',
    category: 'Pop',
    description: '하이퍼 네온 라임/퍼플, 그런지 하프톤 노이즈, 파괴적인 타이포그래피와 스트릿웨어 무드',
    defaultBorderRadius: '2px',
    shadowType: 'hard-shadow',
    aiKeywords: 'Acid streetwear graphics, toxic electric lime (#A3E635) and violent violet, distressed halftone noise texture, oversized kinetic brutalist typography, raw underground flyer layout',
    antiPatterns: ['너무 단정한 격식 위주 레이아웃 금지'],
  },
  {
    id: 'memphis-graphic',
    name: 'Memphis Pop Art Pattern',
    koreanName: '🍬 멤피스 그래픽 팝',
    category: 'Pop',
    description: '지그재그 패턴, 도트 무늬 배경, 비비드 원색 블록과 유쾌한 포스트모던 지오메트릭 감성',
    defaultBorderRadius: '12px',
    shadowType: 'hard-shadow',
    aiKeywords: 'Memphis group design, playful geometric squiggles and zigzag patterns, bright contrasting primary color blocks, polka dot overlays, energetic quirky 80s postmodernism',
    antiPatterns: ['너무 차분하고 우울한 단색 톤 금지'],
  },
  {
    id: 'bold-heavy-type',
    name: 'Giant Bold Typography',
    koreanName: '🔤 자이언트 볼드 타이포그래피',
    category: 'Pop',
    description: '화면 전체를 가득 채우는 80pt+ 초대형 볼드 타이포, 텍스트 자체가 시각적 비주얼이 되는 구조',
    defaultBorderRadius: '0px',
    shadowType: 'hard-shadow',
    aiKeywords: 'Giant display typography, ultra-heavy 900 weight sans-serif letters filling viewport, dynamic text scaling (clamp 3rem to 8rem), stark graphic contrast, editorial poster impact',
    antiPatterns: ['작은 장식용 아이콘 남발 금지', '제목을 작게 축소하는 행위 금지'],
  },

  // ── D. High-End & Editorial (우아한 품격과 권위) ────────────────────────
  {
    id: 'luxury-editorial',
    name: 'Luxury & Editorial Serif',
    koreanName: '🏛️ 럭셔리 에디토리얼 (세리프 & 골드)',
    category: 'Editorial',
    description: '클래식 세리프 타이포그래피, 샴페인 골드(#D4AF37), 딥 차콜 벨벳 배경과 품격 있는 매거진 감성',
    defaultBorderRadius: '2px',
    shadowType: 'editorial-hairline',
    aiKeywords: 'Luxury editorial aesthetic, sophisticated serif typography (Playfair Display), champagne gold accents (#D4AF37), deep charcoal black velvet background (#141416), refined minimalism, magazine cover layout ratio, delicate 0.5px hairlines',
    antiPatterns: ['싸구려 형광 노란색을 골드 대신 사용하지 말 것', '아이콘을 과도하게 많이 넣어 품격을 떨어뜨리지 말 것'],
  },
  {
    id: 'vogue-fashion-mag',
    name: 'Vogue Fashion Editorial',
    koreanName: '📸 보그 매거진 화보 룩북',
    category: 'Editorial',
    description: '풀블리드 고화질 패션 화보, 비대칭 2열 에디토리얼 칼럼, 얇은 0.5px 헤어라인과 감각적인 레터링',
    defaultBorderRadius: '0px',
    shadowType: 'editorial-hairline',
    aiKeywords: 'High-fashion magazine lookbook, full-bleed model photography, asymmetric two-column text layout, ultra-thin 0.5px hairline divider rules, elegant high-contrast fashion masthead, generous letter-spacing',
    antiPatterns: ['두꺼운 3D 플라스틱 버튼 금지', '캐주얼한 폰트 금지'],
  },
  {
    id: 'architectural-concrete',
    name: 'Architectural Brutalist Concrete',
    koreanName: '🏢 아키텍처럴 콘크리트',
    category: 'Editorial',
    description: '노출 콘크리트 그레이, 웅장한 모놀리식 사각 매스, 건축 도면 황금비율과 중후한 권위감',
    defaultBorderRadius: '0px',
    shadowType: 'minimal-flat',
    aiKeywords: 'Architectural concrete brutalism, exposed raw cement texture, monolithic rectangular massing, golden ratio layout grid, monumental quiet prestige, stark disciplined elegance',
    antiPatterns: ['유치한 둥근 젤리 모서리 금지'],
  },
  {
    id: 'vintage-broadsheet',
    name: 'Vintage Broadsheet Newspaper',
    koreanName: '📰 빈티지 영자 신문 브로드시트',
    category: 'Editorial',
    description: '영자 신문 조판, 펜 잉크 해칭 텍스처, 클래식 활자체, 격조 높은 보더 프레임과 다단 칼럼',
    defaultBorderRadius: '0px',
    shadowType: 'minimal-flat',
    aiKeywords: 'Vintage newspaper broadsheet layout, traditional multi-column editorial grid, pen-and-ink engraving aesthetic, classic masthead typography, sepia newsprint background tone',
    antiPatterns: ['화려한 형광 네온 컬러 금지', '디지털 플랫 버튼 금지'],
  },

  // ── E. Tactile & Warm Wellness (포근한 촉감과 온기) ─────────────────────
  {
    id: 'soft-ui-evolution',
    name: 'Soft UI 2.0 (Clean Neumorphism)',
    koreanName: '🌸 소프트 UI 2.0 (클린 뉴모피즘)',
    category: 'Tactile',
    description: '가독성을 혁신한 다층 소프트 엠보스 그림자, 포근한 파스텔 웜톤과 웰빙 프리미엄 무드',
    defaultBorderRadius: '20px',
    shadowType: 'soft-elevation',
    aiKeywords: 'Soft UI Evolution 2.0, accessible neumorphic contrast, delicate dual light-and-dark soft shadows (0 10px 30px rgba(0,0,0,0.06)), warm cream backdrop (#FDFBF7), smooth 20px rounded surfaces, terracotta & sage accents',
    antiPatterns: ['텍스트가 배경에 묻혀 보이지 않는 구형 뉴모피즘 저대비 결함 절대 금지', '차가운 네온 금지'],
  },
  {
    id: 'claymorphism-3d',
    name: 'Claymorphism 3D Clay',
    koreanName: '🧸 3D 클레이모피즘 (통통한 점토)',
    category: 'Tactile',
    description: '쫀득쫀득하고 폭신한 점토 질감의 3D 볼륨감, 이중 엠보싱 내부/외부 그림자, 캡슐형 라운딩',
    defaultBorderRadius: '28px',
    shadowType: 'clay-3d',
    aiKeywords: 'Claymorphism 3D effect, chunky inflated rounded pill shapes (border-radius 28px), dual inset and outset soft shadows for tactile depth, friendly playful toy-like volume, warm marshmallow surfaces',
    antiPatterns: ['날카로운 직각 모서리 금지', '평면적인 납작한 2D 플랫 처리 금지'],
  },
  {
    id: 'organic-botanical',
    name: 'Organic Botanical & Earth',
    koreanName: '🌿 오가닉 보태니컬 & 어스톤',
    category: 'Tactile',
    description: '테라코타(#E07A5F), 세이지 그린(#81B29A), 흙과 숲의 편안한 어스톤과 친환경 라이프스타일',
    defaultBorderRadius: '16px',
    shadowType: 'soft-elevation',
    aiKeywords: 'Botanical organic aesthetic, textured recycled kraft paper feel, muted sage green (#81B29A) and warm terracotta (#E07A5F) earth tones, gentle leafy accents, mindful wellness branding',
    antiPatterns: ['날카로운 인공 형광색 금지', '기계적인 차가운 메탈릭 금지'],
  },
  {
    id: 'craft-paper-textured',
    name: 'Craft Paper & Handmade',
    koreanName: '📜 크래프트 페이퍼 & 핸드메이드',
    category: 'Tactile',
    description: '질감이 살아있는 크래프트지, 스탬프/도장 엠블럼 뱃지, 장인정신이 깃든 아날로그 수제 감성',
    defaultBorderRadius: '6px',
    shadowType: 'soft-elevation',
    aiKeywords: 'Handmade craft paper texture, tactile organic card surface, ink stamp verification badge, warm sepia tones, artisan craftsman branding, subtle fibrous paper overlay',
    antiPatterns: ['인위적인 디지털 광택 금지'],
  },
  {
    id: 'skeuomorphic-luxe',
    name: 'Skeuomorphic Luxe Gear',
    koreanName: '🎙️ 스큐어모픽 하이엔드 기어',
    category: 'Tactile',
    description: '브러시드 알루미늄 메탈 베젤, 정밀 기계식 다이얼 노브, 하드웨어 물리 토글 스위치',
    defaultBorderRadius: '12px',
    shadowType: 'skeuomorphic',
    aiKeywords: 'Modern Skeuomorphism 2.0, brushed metallic bezels, tactile hardware knobs, physical toggle switches, high-fidelity tactile realism, CNC milled aluminum finishes',
    antiPatterns: ['과거의 촌스러운 그라디언트 난사 금지 (세련된 정밀 텍스처 필수)'],
  },
];

/* =========================================================================
   2. 12대 디자이너 큐레이션 컬러 테마
   ========================================================================= */
export const COLOR_THEMES: ColorThemeOption[] = [
  {
    id: 'emerald-tech',
    name: 'Emerald Fintech & Green',
    koreanName: '🌲 에메랄드 핀테크 (네온 그린)',
    mood: '신뢰, 성장, 미래지향적 테크, 핀테크',
    tokens: {
      bg: '#090D16',
      cardBg: '#131B2E',
      cardBorder: '#232F48',
      accent: '#22C55E',
      accentSecondary: '#38BDF8',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      badgeBg: 'rgba(34, 197, 94, 0.15)',
      badgeText: '#4ADE80',
    },
  },
  {
    id: 'ocean-cyan',
    name: 'Ocean Cyan & Electric Blue',
    koreanName: '🌊 오션 사이언 (일렉트릭 블루)',
    mood: '청량함, 혁신, 클라우드, 글로벌 SaaS',
    tokens: {
      bg: '#0A0F1D',
      cardBg: '#11192C',
      cardBorder: '#1E293B',
      accent: '#38BDF8',
      accentSecondary: '#818CF8',
      textPrimary: '#FFFFFF',
      textSecondary: '#94A3B8',
      badgeBg: 'rgba(56, 189, 248, 0.15)',
      badgeText: '#38BDF8',
    },
  },
  {
    id: 'champagne-gold',
    name: 'Champagne Gold & Charcoal',
    koreanName: '👑 샴페인 골드 (럭셔리 차콜)',
    mood: '품격, 프리미엄, 하이엔드, 자산관리',
    tokens: {
      bg: '#141416',
      cardBg: '#1C1C1E',
      cardBorder: '#2C2C2E',
      accent: '#D4AF37',
      accentSecondary: '#E5C07B',
      textPrimary: '#F5F5F7',
      textSecondary: '#A1A1A6',
      badgeBg: 'rgba(212, 175, 55, 0.15)',
      badgeText: '#E5C07B',
    },
  },
  {
    id: 'sunset-coral',
    name: 'Sunset Coral & Amber',
    koreanName: '🌅 선셋 코랄 (웜 앰버)',
    mood: '열정, 에너지, 마케팅, 전환율 극대화',
    tokens: {
      bg: '#181216',
      cardBg: '#261B23',
      cardBorder: '#3D2A38',
      accent: '#F43F5E',
      accentSecondary: '#FB923C',
      textPrimary: '#FFF1F2',
      textSecondary: '#FDA4AF',
      badgeBg: 'rgba(244, 63, 94, 0.18)',
      badgeText: '#FB7185',
    },
  },
  {
    id: 'violet-neon',
    name: 'Violet Glow & Electric Purple',
    koreanName: '🔮 바이올렛 글로우 (AI 퍼플)',
    mood: '신비로움, 크리에이티브, 차세대 AI',
    tokens: {
      bg: '#0B0813',
      cardBg: '#171126',
      cardBorder: '#2E2248',
      accent: '#C084FC',
      accentSecondary: '#F472B6',
      textPrimary: '#FAF5FF',
      textSecondary: '#D8B4FE',
      badgeBg: 'rgba(192, 132, 252, 0.18)',
      badgeText: '#E9D5FF',
    },
  },
  {
    id: 'swiss-monochrome',
    name: 'Swiss Monochrome (Jet Black & White)',
    koreanName: '⚪️ 스위스 모노크롬 (클린 화이트)',
    mood: '극도의 절제미, 가독성, 클래식, 정직함',
    tokens: {
      bg: '#F8FAFC',
      cardBg: '#FFFFFF',
      cardBorder: '#E2E8F0',
      accent: '#0F172A',
      accentSecondary: '#2563EB',
      textPrimary: '#0F172A',
      textSecondary: '#64748B',
      badgeBg: '#F1F5F9',
      badgeText: '#0F172A',
    },
  },
  {
    id: 'warm-earth',
    name: 'Warm Earth (Sage & Terracotta)',
    koreanName: '🌿 웜 어스 (세이지 & 테라코타)',
    mood: '자연, 친환경, 웰빙, 라이프스타일',
    tokens: {
      bg: '#FAF8F5',
      cardBg: '#FFFFFF',
      cardBorder: '#EFE9E0',
      accent: '#E07A5F',
      accentSecondary: '#81B29A',
      textPrimary: '#2D3142',
      textSecondary: '#6C757D',
      badgeBg: '#FCEFE9',
      badgeText: '#E07A5F',
    },
  },
  {
    id: 'vivid-yellow',
    name: 'Vivid Pop Yellow & Black',
    koreanName: '⚡️ 비비드 팝 옐로우 (스트리트)',
    mood: '강렬한 주목도, 팝아트, 경쾌함, Z세대',
    tokens: {
      bg: '#FEF08A',
      cardBg: '#FFFFFF',
      cardBorder: '#000000',
      accent: '#000000',
      accentSecondary: '#F43F5E',
      textPrimary: '#000000',
      textSecondary: '#27272A',
      badgeBg: '#F43F5E',
      badgeText: '#FFFFFF',
    },
  },
  {
    id: 'cyber-cyan-magenta',
    name: 'Cyber Neon (Cyan & Hot Magenta)',
    koreanName: '👾 사이버 네온 (시안 & 마젠타)',
    mood: '미래지향, 신스웨이브, 게이밍, 메타버스',
    tokens: {
      bg: '#05050A',
      cardBg: '#0E0D1B',
      cardBorder: '#262243',
      accent: '#00F0FF',
      accentSecondary: '#FF007F',
      textPrimary: '#FFFFFF',
      textSecondary: '#A5B4FC',
      badgeBg: 'rgba(0, 240, 255, 0.15)',
      badgeText: '#00F0FF',
    },
  },
  {
    id: 'tokyo-midnight',
    name: 'Tokyo Midnight (Indigo & Rose)',
    koreanName: '🌃 도쿄 미드나잇 (인디고 & 로즈)',
    mood: '도시의 야경, 현대적 감성, 미디어 엔터',
    tokens: {
      bg: '#0C0A1D',
      cardBg: '#161331',
      cardBorder: '#2B2556',
      accent: '#F43F5E',
      accentSecondary: '#6366F1',
      textPrimary: '#F8FAFC',
      textSecondary: '#CBD5E1',
      badgeBg: 'rgba(244, 63, 94, 0.15)',
      badgeText: '#FB7185',
    },
  },
  {
    id: 'nordic-frost',
    name: 'Nordic Frost (Clean Ice & Slate)',
    koreanName: '❄️ 노르딕 프로스트 (아이스 슬레이트)',
    mood: '북유럽 미니멀, 청결함, 헬스케어, 의료',
    tokens: {
      bg: '#F0F9FF',
      cardBg: '#FFFFFF',
      cardBorder: '#BAE6FD',
      accent: '#0284C7',
      accentSecondary: '#0D9488',
      textPrimary: '#0C4A6E',
      textSecondary: '#475569',
      badgeBg: '#E0F2FE',
      badgeText: '#0369A1',
    },
  },
  {
    id: 'espresso-luxe',
    name: 'Espresso & Warm Cream',
    koreanName: '☕️ 에스프레소 & 웜 크림',
    mood: '아늑함, 브런치 카페, 장인정신, 프리미엄 F&B',
    tokens: {
      bg: '#251E19',
      cardBg: '#342B24',
      cardBorder: '#4F4238',
      accent: '#D4A373',
      accentSecondary: '#FAEDCD',
      textPrimary: '#FEFAE0',
      textSecondary: '#DDBEA9',
      badgeBg: 'rgba(212, 163, 115, 0.2)',
      badgeText: '#FAEDCD',
    },
  },
  {
    id: 'aerospace-amber',
    name: 'Aerospace Amber & Tactical Navy',
    koreanName: '🛰️ 에어로스페이스 앰버 (전술 오렌지)',
    mood: '방산, 항공우주, 텔레메트리, 극대비 HUD',
    tokens: {
      bg: '#080C14',
      cardBg: '#0F172A',
      cardBorder: '#1E293B',
      accent: '#F59E0B',
      accentSecondary: '#38BDF8',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      badgeBg: 'rgba(245, 158, 11, 0.18)',
      badgeText: '#FBBF24',
    },
  },
  {
    id: 'biotech-mint',
    name: 'Biotech Sterile Mint & Deep Slate',
    koreanName: '🧬 바이오테크 민트 (클린 룸)',
    mood: '의료, 제약 바이오, 헬스케어, 임상시험',
    tokens: {
      bg: '#0A1118',
      cardBg: '#111E2E',
      cardBorder: '#1F344D',
      accent: '#10B981',
      accentSecondary: '#06B6D4',
      textPrimary: '#F0FDFA',
      textSecondary: '#99F6E4',
      badgeBg: 'rgba(16, 185, 129, 0.16)',
      badgeText: '#34D399',
    },
  },
  {
    id: 'zen-paper-charcoal',
    name: 'Zen Washi & Sumi Charcoal',
    koreanName: '🍵 재패니즈 젠 (한지 & 먹색)',
    mood: '정적, 자연주의, 명상, 프리미엄 라이프스타일',
    tokens: {
      bg: '#FBF9F5',
      cardBg: '#FFFFFF',
      cardBorder: '#EFEBE2',
      accent: '#1F2421',
      accentSecondary: '#5C677D',
      textPrimary: '#1F2421',
      textSecondary: '#6B7280',
      badgeBg: '#F3EFE6',
      badgeText: '#1F2421',
    },
  },
  {
    id: 'y2k-chrome-silver',
    name: 'Y2K Metallic Silver & Cyber Pink',
    koreanName: '💿 Y2K 크롬 실버 & 핫핑크',
    mood: '밀레니엄 팝, 메탈릭, K-POP, 세기말 감성',
    tokens: {
      bg: '#0E0B16',
      cardBg: '#1B1429',
      cardBorder: '#362B54',
      accent: '#FF007F',
      accentSecondary: '#00F0FF',
      textPrimary: '#FFFFFF',
      textSecondary: '#D1C4E9',
      badgeBg: 'rgba(255, 0, 127, 0.2)',
      badgeText: '#FF4081',
    },
  },
];

/* =========================================================================
   3. 8대 세부 디자인 시각 요소
   ========================================================================= */
export const DESIGN_ELEMENTS: DesignElementOption[] = [
  {
    id: 'elem-glass-blur',
    name: 'Backdrop Glass Blur',
    koreanName: '반투명 유리 블러 (Backdrop Blur)',
    category: 'Glass',
    description: '배경을 은은하게 투과시키는 반투명 유리 질감과 섬세한 1px 반사광',
    defaultActive: true,
    promptDirective: 'Apply backdrop-filter blur(20px) with semi-transparent surfaces (rgba) to give organic floating depth.',
  },
  {
    id: 'elem-ambient-glow',
    name: 'Ambient Neon Glow',
    koreanName: '앰비언트 발광 효과 (Radial Glow)',
    category: 'Glow',
    description: '포인트 컬러 기반의 부드러운 방사형 조명 광원 효과',
    defaultActive: true,
    promptDirective: 'Incorporate soft ambient radial glows behind primary highlight cards to create luminous visual depth.',
  },
  {
    id: 'elem-sparkline-chart',
    name: 'Sparkline Mini Chart',
    koreanName: '스파크라인 트렌드 미니 차트',
    category: 'Chart',
    description: '핵심 지표 카드 하단에 우상향 성장 곡선 및 미니 바 차트 배치',
    defaultActive: true,
    promptDirective: 'Include mini sparkline growth vector curves or trend bars beneath primary KPI metric numbers.',
  },
  {
    id: 'elem-pulse-badge',
    name: 'Live Pulse State Badge',
    koreanName: '실시간 깜빡이는 라이브 펄스 뱃지',
    category: 'Badge',
    description: '살아있는 서비스 느낌을 주는 펄스 애니메이션 도트 인디케이터',
    defaultActive: true,
    promptDirective: 'Use pill-shaped status badges with glowing pulse indicators (e.g. green active dot) for live metrics.',
  },
  {
    id: 'elem-surface-border',
    name: '1px Crisp Surface Border',
    koreanName: '1px 섬세한 서피스 테두리',
    category: 'Border',
    description: '배경과 카드를 칼같이 정밀하게 분리해주는 1px 경계선',
    defaultActive: true,
    promptDirective: 'Enforce crisp 1px solid borders on all cards to maintain modern precision and card boundaries.',
  },
  {
    id: 'elem-spacious-margin',
    name: 'Spacious Breathing Margin',
    koreanName: '여유로운 호흡의 세이프 여백 (40%)',
    category: 'Layout',
    description: '시각적 피로도를 극적으로 낮추는 넉넉한 네거티브 스페이스',
    defaultActive: true,
    promptDirective: 'Preserve 35-40% breathing negative whitespace so the entire composition feels premium, calm, and uncluttered.',
  },
  {
    id: 'elem-gradient-text',
    name: 'Dynamic Gradient Text Headline',
    koreanName: '다이내믹 그라데이션 타이포 쉐이더',
    category: 'Typo',
    description: '헤드라인 텍스트에 엑센트1과 엑센트2의 자연스러운 그라데이션 적용',
    defaultActive: true,
    promptDirective: 'Apply dynamic linear-gradient text clip shaders (accent to secondary accent) on primary hero headlines.',
  },
  {
    id: 'elem-micro-tags',
    name: 'Micro Telemetry Status Chips',
    koreanName: '인터랙티브 마이크로 상태 칩스',
    category: 'Tag',
    description: '버전, 상태, 카테고리를 직관적으로 보여주는 정밀 캡슐 칩',
    defaultActive: true,
    promptDirective: 'Include rounded micro-capsule telemetry chips (e.g. [Q4 VERIFIED], [GROWTH +42%]) across data cards.',
  },
];

/* =========================================================================
   4. 6대 버튼 디자인 스타일 (Button Styles)
   ========================================================================= */
export interface ButtonStyleOption {
  id: string;
  name: string;
  koreanName: string;
  description: string;
  category: 'Pill' | 'Brutalist' | 'Glass' | 'Clay' | 'Neon' | 'Sharp';
  borderRadius: string;
  borderWidth: string;
  shadowType: 'soft-elevation' | 'frosted-glass' | 'hard-shadow' | 'ambient-glow' | 'clay-3d' | 'minimal-flat';
  letterSpacing?: string;
  fontWeight: string;
  textTransform?: 'uppercase' | 'none';
  promptDirective: string;
}

export const BUTTON_STYLES: ButtonStyleOption[] = [
  {
    id: 'btn-pill',
    name: 'Pill Rounded (Modern Capsule)',
    koreanName: '💊 캡슐형 둥근 필 (Pill)',
    description: '완전 둥근 모서리(9999px)와 부드러운 소프트 엘리베이션 그림자의 모던 모바일 감성',
    category: 'Pill',
    borderRadius: '9999px',
    borderWidth: '0px',
    shadowType: 'soft-elevation',
    fontWeight: '700',
    promptDirective: 'Buttons: Fully rounded pill shape (border-radius: 9999px), soft organic drop shadow, smooth hover scale.',
  },
  {
    id: 'btn-brutalist',
    name: 'Neo-Brutalist Hard Shadow',
    koreanName: '⚡️ 네오 브루탈리스트 (하드 쉐도우)',
    description: '직각 0px 모서리, 2.5px 굵은 솔리드 테두리와 4px 4px 각진 무블러 하드 그림자',
    category: 'Brutalist',
    borderRadius: '0px',
    borderWidth: '2.5px',
    shadowType: 'hard-shadow',
    fontWeight: '900',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    promptDirective: 'Buttons: Sharp 0px corners, bold 2.5px black outlines, hard offset shadow (4px 4px 0 #000), uppercase bold typography.',
  },
  {
    id: 'btn-glass',
    name: 'Frosted Glass (Backdrop Blur)',
    koreanName: '🪟 반투명 프로스티드 글래스',
    description: '반투명 유리 질감(blur 16px), 1px 화이트 반사광 테두리와 고급스러운 다층 깊이감',
    category: 'Glass',
    borderRadius: '14px',
    borderWidth: '1px',
    shadowType: 'frosted-glass',
    fontWeight: '600',
    letterSpacing: '0.02em',
    promptDirective: 'Buttons: Translucent glassmorphism button with backdrop-blur(16px), 1px subtle white reflective outline, and soft ambient glow.',
  },
  {
    id: 'btn-clay',
    name: 'Soft 3D Clay (Claymorphism)',
    koreanName: '🧸 폭신한 3D 클레이 (점토 볼륨)',
    description: '통통하고 쫀득한 3D 점토 볼륨감, 이중 내부/외부 엠보싱 하이라이트 그림자',
    category: 'Clay',
    borderRadius: '24px',
    borderWidth: '0px',
    shadowType: 'clay-3d',
    fontWeight: '800',
    promptDirective: 'Buttons: Volumetric 3D claymorphic button with dual inset light and outset drop shadows, 24px rounded corners, and tactile pillow feel.',
  },
  {
    id: 'btn-neon',
    name: 'Cyberpunk Neon Glow (HUD)',
    koreanName: '🔮 사이버 네온 림라이트 (HUD)',
    description: '형광 네온 발광 림라이트, 6px 미세 라운드, 모노스페이스 터미널 폰트와 텍티컬 감성',
    category: 'Neon',
    borderRadius: '6px',
    borderWidth: '1.5px',
    shadowType: 'ambient-glow',
    fontWeight: '800',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    promptDirective: 'Buttons: Cyberpunk tactical button with neon outer glow (box-shadow: 0 0 16px accent), 1.5px border, and monospace tracking.',
  },
  {
    id: 'btn-editorial',
    name: 'Editorial Sharp (Hairline Frame)',
    koreanName: '🏛️ 에디토리얼 샵 (헤어라인)',
    description: '2px 미세 모서리, 1px 섬세한 골드/모노 헤어라인, 자간 0.15em의 럭셔리 매거진 버튼',
    category: 'Sharp',
    borderRadius: '2px',
    borderWidth: '1px',
    shadowType: 'minimal-flat',
    fontWeight: '600',
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    promptDirective: 'Buttons: Ultra-refined hairline border (1px), subtle 2px corners, generous letter-spacing (0.15em), quiet luxury feel.',
  },
];

export function getMatchingButtonStyle(styleId: string): ButtonStyleOption {
  if (styleId === 'neo-brutalism' || styleId === 'acid-streetwear') {
    return BUTTON_STYLES[1]; // btn-brutalist
  }
  if (styleId === 'claymorphism-3d') {
    return BUTTON_STYLES[3]; // btn-clay
  }
  if (styleId === 'cyberpunk-hud' || styleId === 'space-aerospace' || styleId === 'dark-oled') {
    return BUTTON_STYLES[4]; // btn-neon
  }
  if (styleId === 'biotech-clean' || styleId === 'holographic-prism') {
    return BUTTON_STYLES[2]; // btn-glass
  }
  if (
    styleId === 'luxury-editorial' ||
    styleId === 'vogue-fashion-mag' ||
    styleId === 'vintage-broadsheet' ||
    styleId === 'architectural-concrete' ||
    styleId === 'swiss-international'
  ) {
    return BUTTON_STYLES[5]; // btn-editorial
  }
  return BUTTON_STYLES[0]; // btn-pill (기본 모던 캡슐)
}

/* =========================================================================
   5. 16대 프리미엄 타이포그래피 테마 (Typography Themes)
   ========================================================================= */
export interface TypographyOption {
  id: string;
  name: string;
  koreanName: string;
  category: 'Sans' | 'Serif' | 'Mono' | 'Display';
  fontFamily: string;
  headlineFont: string;
  bodyFont: string;
  description: string;
  sampleLetter: string;
  previewText?: string;
  promptDirective: string;
}

export const TYPOGRAPHY_OPTIONS: TypographyOption[] = [
  // ── A. Modern Sans-Serif (고딕 / 산세리프) ──────────────────────────
  {
    id: 'typo-modern-sans',
    name: 'Modern International Sans (Inter / Pretendard)',
    koreanName: '🔤 모던 인터내셔널 (Inter/Pretendard)',
    category: 'Sans',
    fontFamily: "'Pretendard', 'Inter', -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
    headlineFont: "'Pretendard', 'Inter', system-ui, sans-serif",
    bodyFont: "'Pretendard', 'Inter', system-ui, sans-serif",
    description: '최상의 가독성과 세련된 자간, 애플·토스·피그마 스타일의 글로벌 표준 산세리프',
    sampleLetter: 'Aa 2026',
    previewText: '최상의 가독성과 정교한 글자 비례',
    promptDirective: 'Typography: Clean high-legibility geometric sans-serif (Inter / Pretendard), tight tracking on large display headers.',
  },
  {
    id: 'typo-trendy-geometric',
    name: 'Plus Jakarta Sans (Fintech & SaaS)',
    koreanName: '⚡️ 트렌디 테크 (Plus Jakarta Sans)',
    category: 'Sans',
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    headlineFont: "'Plus Jakarta Sans', sans-serif",
    bodyFont: "'Plus Jakarta Sans', sans-serif",
    description: '현대적인 핀테크, Web3, 글로벌 SaaS에서 가장 사랑받는 감각적 기하학 곡선',
    sampleLetter: 'Qk 2026',
    previewText: '트렌디한 테크 스타트업 & 핀테크 감성',
    promptDirective: 'Typography: Contemporary geometric sans-serif (Plus Jakarta Sans / Outfit), modern rounded curves and dynamic startup feel.',
  },
  {
    id: 'typo-vivid-poppins',
    name: 'Montserrat & Poppins (Vivid Geometric)',
    koreanName: '🎨 비비드 팝 지오메트릭 (Montserrat)',
    category: 'Sans',
    fontFamily: "'Montserrat', sans-serif",
    headlineFont: "'Montserrat', sans-serif",
    bodyFont: "'Montserrat', sans-serif",
    description: '또렷한 원형 비율과 경쾌한 리듬감, 소비자 마케팅 및 밝고 에너지 넘치는 브랜드',
    sampleLetter: 'Go 2026',
    previewText: '경쾌하고 또렷한 원형 지오메트릭 리듬',
    promptDirective: 'Typography: Energetic bold geometric sans (Montserrat / Poppins), rounded punchy display headings.',
  },
  {
    id: 'typo-swiss-grotesk',
    name: 'Space Grotesk (Swiss Modernism)',
    koreanName: '⚪️ 스위스 그로테스크 (Space Grotesk)',
    category: 'Sans',
    fontFamily: "'Space Grotesk', 'Helvetica Neue', Arial, sans-serif",
    headlineFont: "'Space Grotesk', sans-serif",
    bodyFont: "'Helvetica Neue', Arial, sans-serif",
    description: '엄격한 그리드 시스템과 정통 바우하우스 미학, 건축 및 미니멀 디자인',
    sampleLetter: 'Ch 2026',
    previewText: '엄격한 그리드와 바우하우스 조형미',
    promptDirective: 'Typography: Swiss International typographic style (Space Grotesk / Neue Haas), disciplined architectural grid precision.',
  },
  {
    id: 'typo-clean-enterprise',
    name: 'Public Sans & Roboto (Enterprise B2B)',
    koreanName: '🏢 클린 엔터프라이즈 (Public Sans)',
    category: 'Sans',
    fontFamily: "'Public Sans', Roboto, system-ui, sans-serif",
    headlineFont: "'Public Sans', sans-serif",
    bodyFont: "'Public Sans', sans-serif",
    description: '방대한 정보와 데이터 대시보드, 공공 행정 및 B2B에 최적화된 신뢰와 정직함',
    sampleLetter: 'En 2026',
    previewText: '방대한 데이터와 신뢰감 있는 구조',
    promptDirective: 'Typography: Neutral high-clarity enterprise sans-serif (Public Sans / Roboto), optimized for complex data dashboards.',
  },

  // ── B. Elegant Serif (명조 / 세리프) ──────────────────────────────
  {
    id: 'typo-luxury-serif',
    name: 'Editorial Luxury Serif (Playfair Display)',
    koreanName: '🏛️ 럭셔리 에디토리얼 (Playfair)',
    category: 'Serif',
    fontFamily: "'Playfair Display', Georgia, serif",
    headlineFont: "'Playfair Display', serif",
    bodyFont: "Georgia, serif",
    description: '극적인 굵기 대비와 유려한 곡선, 보그·샤넬 감성의 럭셔리 하이패션 세리프',
    sampleLetter: 'Ag 2026',
    previewText: '보그 매거진과 럭셔리 하이엔드 품격',
    promptDirective: 'Typography: Classic editorial high-fashion serif (Playfair Display / Didot), elegant high-contrast strokes with generous tracking.',
  },
  {
    id: 'typo-classic-garamond',
    name: 'Cormorant Garamond (Academic & Literary)',
    koreanName: '📖 클래식 가라몬드 (Cormorant)',
    category: 'Serif',
    fontFamily: "'Cormorant Garamond', Garamond, serif",
    headlineFont: "'Cormorant Garamond', serif",
    bodyFont: "'Cormorant Garamond', Georgia, serif",
    description: '르네상스 활자의 지적인 품격과 서정적인 호흡, 학술 및 브런치 감성 에세이',
    sampleLetter: 'Lx 2026',
    previewText: '르네상스 활자의 지적 품격과 서정적 호흡',
    promptDirective: 'Typography: Traditional French Renaissance serif (Cormorant Garamond / EB Garamond), poetic academic elegance with warm organic serifs.',
  },
  {
    id: 'typo-cinematic-cinzel',
    name: 'Cinzel (Cinematic Imperial Serif)',
    koreanName: '👑 시네마틱 엠파이어 (Cinzel)',
    category: 'Serif',
    fontFamily: "'Cinzel', 'Times New Roman', serif",
    headlineFont: "'Cinzel', serif",
    bodyFont: "'Georgia', serif",
    description: '로마 고대 석비 비문의 장엄한 위엄, 블록버스터 타이틀 및 헤리티지 럭셔리',
    sampleLetter: 'IV 2026',
    previewText: '고대 로마 비문의 웅장한 대문자 조형미',
    promptDirective: 'Typography: Monumental inscriptional Roman serif (Cinzel / Trajan), commanding uppercase prestige with classical proportions.',
  },
  {
    id: 'typo-oriental-myeongjo',
    name: 'Noto Serif KR (Zen Korean Myeongjo)',
    koreanName: '🍵 동양 미학 단아 명조 (Noto Serif KR)',
    category: 'Serif',
    fontFamily: "'Noto Serif KR', 'Nanum Myeongjo', serif",
    headlineFont: "'Noto Serif KR', serif",
    bodyFont: "'Noto Serif KR', serif",
    description: '먹물의 결이 깃든 한국적 정취와 단아한 여백, 티하우스·한옥·웰빙 라이프스타일',
    sampleLetter: '韓 2026',
    previewText: '먹물의 결이 깃든 단아한 한글 명조의 미학',
    promptDirective: 'Typography: Meditative East-Asian calligraphic serif (Noto Serif KR / Nanum Myeongjo), serene rhythm and wabi-sabi whitespace.',
  },
  {
    id: 'typo-vintage-press',
    name: 'Merriweather (Vintage Press Broadsheet)',
    koreanName: '📰 빈티지 프레스 (Merriweather)',
    category: 'Serif',
    fontFamily: "'Merriweather', 'Libre Baskerville', serif",
    headlineFont: "'Merriweather', serif",
    bodyFont: "'Merriweather', serif",
    description: '따뜻한 잉크 인쇄 활자의 온기와 뛰어난 장문 판독성, 킨포크 라이프스타일',
    sampleLetter: 'Bk 2026',
    previewText: '아날로그 잉크 프레스의 따스한 신문 조판',
    promptDirective: 'Typography: Warm editorial press serif (Merriweather / Baskerville), tactile newsprint feel with robust x-height for readability.',
  },

  // ── C. Technical Monospace (모노스페이스 / 개발자) ──────────────────
  {
    id: 'typo-cyber-mono',
    name: 'JetBrains Mono (Developer HUD)',
    koreanName: '💻 사이버 텔레메트리 (JetBrains Mono)',
    category: 'Mono',
    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
    headlineFont: "'JetBrains Mono', monospace",
    bodyFont: "'JetBrains Mono', monospace",
    description: '개발자 코딩 리가처와 완벽한 정렬, 터미널 HUD 및 엔지니어링 대시보드',
    sampleLetter: '0x 2026',
    previewText: '정밀한 모노스페이스 코드 & 텔레메트리',
    promptDirective: 'Typography: Monospace technical telemetry font (JetBrains Mono / Fira Code), precise tabular figures and futuristic code aesthetic.',
  },
  {
    id: 'typo-space-mono',
    name: 'Space Mono (NASA Retro Cyber)',
    koreanName: '🛰️ 스페이스 모노 (Space Mono)',
    category: 'Mono',
    fontFamily: "'Space Mono', monospace",
    headlineFont: "'Space Mono', monospace",
    bodyFont: "'Space Mono', monospace",
    description: '1960년대 우주 개발 시대의 레트로 퓨처리즘과 아날로그 컴퓨터 계측 감성',
    sampleLetter: 'SP 2026',
    previewText: '아폴로 계획의 레트로 미래주의 계측기',
    promptDirective: 'Typography: Brutalist geometric monospace (Space Mono / IBM Plex Mono), retro-futuristic aerospace telemetry vibes.',
  },

  // ── D. Bold Display & Expressive (디스플레이 / 개성 / 팝) ────────────
  {
    id: 'typo-bold-display',
    name: 'Archivo Black (Neo-Brutal Heavy Display)',
    koreanName: '💥 네오 브루탈 헤비 (Archivo Black)',
    category: 'Display',
    fontFamily: "'Archivo Black', Impact, sans-serif",
    headlineFont: "'Archivo Black', sans-serif",
    bodyFont: "'Inter', sans-serif",
    description: '화면을 장악하는 900+ 극강의 두께감, 강렬한 스트리트 포스터와 파괴적 임팩트',
    sampleLetter: 'BO 2026',
    previewText: '화면을 압도하는 극강의 헤비 볼드 펀치',
    promptDirective: 'Typography: Ultra-heavy bold display typeface (Archivo Black / Impact), commanding massive visual punch with tight tracking.',
  },
  {
    id: 'typo-futuristic-orbitron',
    name: 'Orbitron (Futuristic Sci-Fi HUD)',
    koreanName: '🚀 퓨처리스틱 콕핏 (Orbitron)',
    category: 'Display',
    fontFamily: "'Orbitron', sans-serif",
    headlineFont: "'Orbitron', sans-serif",
    bodyFont: "'Inter', sans-serif",
    description: 'SF 영화 조종석 홀로그램과 사이버네틱스, e스포츠 및 차세대 테크놀로지',
    sampleLetter: 'AI 2026',
    previewText: 'SF 영화 조종석 홀로그램 HUD 인터페이스',
    promptDirective: 'Typography: Futuristic geometric display font (Orbitron / Audiowide), angled cyberpunk sci-fi interface look.',
  },
  {
    id: 'typo-soft-rounded',
    name: 'Nunito (Soft Friendly Rounded)',
    koreanName: '🧸 폭신한 라운드 (Nunito)',
    category: 'Display',
    fontFamily: "'Nunito', sans-serif",
    headlineFont: "'Nunito', sans-serif",
    bodyFont: "'Nunito', sans-serif",
    description: '모든 획 끝이 둥글게 굴려진 귀엽고 다정한 인상, 에듀테크·키즈·소셜 커뮤니티',
    sampleLetter: 'Hi 2026',
    previewText: '모든 모서리가 둥글고 다정한 소프트 인상',
    promptDirective: 'Typography: Soft pill-rounded display sans (Nunito / Dosis), warm approachable friendly demeanor with pillowy shapes.',
  },
  {
    id: 'typo-handwriting-caveat',
    name: 'Caveat (Creative Artist Signature)',
    koreanName: '✍️ 아티스트 핸드라이팅 (Caveat)',
    category: 'Display',
    fontFamily: "'Caveat', cursive",
    headlineFont: "'Caveat', cursive",
    bodyFont: "'Inter', sans-serif",
    description: '자유롭고 유려한 손글씨의 인간미와 아날로그 온기, 크리에이티브 시그니처 & 메모',
    sampleLetter: 'Art 2026',
    previewText: '따뜻한 감성과 아날로그 펜 손글씨 시그니처',
    promptDirective: 'Typography: Expressive organic handwriting script (Caveat / Kalam) for warm human touches, annotations, and creative signature accents.',
  },
];
