// =========================================================================
// 🚀 368+ Comprehensive Design Layout References Architecture (2025~2026)
// =========================================================================
// 각 파트별 60개 이상의 구조적, 배치적, 그리드적 차별화를 지닌 글로벌 레퍼런스 모음집
// Figma Community, Mobbin, Godly, Awwwards 트렌드를 정밀 반영

export type ReferencePartKey = 'hero' | 'feature' | 'proof' | 'pricing' | 'cta' | 'nav_footer';

export type TrendCategory = 
  | 'Bento Grid 2.0'
  | 'GenUI & AI-Native'
  | 'Liquid Glass'
  | 'Swiss & Neo-Brutalist'
  | 'Linear HUD'
  | 'Spatial 3D & Clay'
  | 'Asymmetric Split'
  | 'Minimalist Editorial';

export type GridGeometry = 
  | '1col-center'
  | 'split-50-50'
  | 'split-60-40'
  | 'split-70-30'
  | 'bento-12col'
  | 'bento-3col'
  | 'bento-asymmetric'
  | 'masonry-3col'
  | 'masonry-4col'
  | 'fullbleed-cinematic'
  | 'diagonal-angle'
  | 'stacked-zindex'
  | 'interactive-tabs'
  | 'accordion-vertical'
  | 'timeline-vertical'
  | 'carousel-filmstrip'
  | 'terminal-window'
  | 'comparison-slider'
  | 'marquee-ticker'
  | 'floating-dock';

export type ReferenceFocalAnchor = 'all' | 'visual' | 'video' | 'typo' | 'data' | 'hybrid' | 'interactive';

export interface LayoutReference {
  id: string;
  part: ReferencePartKey;
  name: string;
  koreanName: string;
  trend: TrendCategory;
  gridGeometry: GridGeometry;
  focalAnchor: 'visual' | 'video' | 'typo' | 'data' | 'hybrid' | 'interactive';
  density: 'airy' | 'balanced' | 'compact' | 'ultra-dense';
  description: string;
  wireframeShape: string;
  keyFeatures: string[];
  tags: string[];
  promptDirectives: {
    figma: string;
    tailwind: string;
    aiImage: string;
  };
  customOptions?: {
    showBadge?: boolean;
    showSecondaryCta?: boolean;
    showLiveStatus?: boolean;
    showHotspots?: boolean;
    showGridLines?: boolean;
    showMarquee?: boolean;
    showSparkline?: boolean;
    splitRatio?: '50:50' | '60:40' | '70:30' | 'reversed';
  };
}

export const FOCAL_ANCHOR_METADATA: Record<ReferenceFocalAnchor, { label: string; icon: string; description: string }> = {
  all: { label: '전체 보기', icon: 'Sparkles', description: '모든 글로벌 디자인 레퍼런스' },
  visual: { label: '📸 사진·화보 중심', icon: 'Image', description: '고해상도 실사 룩북과 메이슨리 갤러리가 지배하는 아키텍처' },
  video: { label: '🎥 영상·모션 중심', icon: 'Film', description: '시네마틱 배경 비디오, 쇼릴 플레이어, 세로 릴스 중심의 동적 아키텍처' },
  typo: { label: '🔤 타이포·에디토리얼', icon: 'Type', description: '거대 디스플레이 서체, 스위스 그리드, 롤링 마키가 지배하는 레이아웃' },
  data: { label: '📊 데이터·HUD 지표', icon: 'BarChart3', description: '실시간 KPI, 스파크라인, 터미널 윈도우, 비교 매트릭스 중심' },
  interactive: { label: '🤖 GenUI·인터랙티브', icon: 'Wand2', description: 'AI 프롬프트 인풋, 전후 비교 슬라이더, 인터랙티브 3D 무대' },
  hybrid: { label: '⚖️ 하이브리드 복합형', icon: 'Layers', description: '비주얼과 데이터, 타이포그래피가 조화롭게 균형을 이루는 레이아웃' },
};

export const PART_METADATA: Record<ReferencePartKey, { label: string; count: number; icon: string; description: string }> = {
  hero: { label: '히어로 쇼케이스', count: 72, icon: 'Sparkles', description: '첫 3초 시선을 사로잡는 최상단 쇼케이스 및 핵심 제안' },
  feature: { label: '기능 & 벤토 그리드', count: 62, icon: 'LayoutGrid', description: '프로덕트 기능과 아키텍처를 증명하는 벤토 및 인터랙티브 모듈' },
  proof: { label: '소셜 프루프 & 지표', count: 62, icon: 'Award', description: '신뢰도를 입증하는 실시간 KPI, 고객 리뷰, 보안 인증서' },
  pricing: { label: '가격표 & 비교 매트릭스', count: 60, icon: 'CreditCard', description: '전환을 완성하는 3단 티어, 피처 비교표, 실시간 계산기' },
  cta: { label: '전환 유도 & CTA 배너', count: 60, icon: 'Zap', description: '이탈을 방지하고 즉각적인 실행을 유도하는 리드 폼과 배너' },
  nav_footer: { label: 'GNB & 메가 푸터', count: 60, icon: 'Compass', description: '페이지 상하단의 완성도를 책임지는 네비게이션 및 사이트맵' },
};

export const ALL_LAYOUT_REFERENCES: LayoutReference[] = [
  {
    "id": "hero-video-cinematic-ambient",
    "part": "hero",
    "name": "16:9 Ambient Cinematic Video Loop Hero",
    "koreanName": "🎬 16:9 시네마틱 앰비언트 비디오 루프 히어로",
    "trend": "Linear HUD",
    "gridGeometry": "fullbleed-cinematic",
    "focalAnchor": "video",
    "density": "airy",
    "description": "16:9 와이드 고화질 비디오 루프 배경, [LIVE 4K] 뱃지, 실시간 사운드 온오프 토글 및 03:45 타임코드 뱃지가 결합된 최고급 영상 히어로",
    "wireframeShape": "video-player",
    "keyFeatures": [
      "16:9 비디오 플레이어 인터페이스",
      "재생/일시정지 및 음소거 토글",
      "03:45 / 07:20 타임코드 인디케이터",
      "LIVE 4K 방송급 뱃지"
    ],
    "tags": [
      "Video",
      "Cinematic",
      "Motion",
      "Ambient"
    ],
    "promptDirectives": {
      "figma": "16:9 full-bleed video canvas with dark vignette overlay, floating HUD play bar, timecode tags, and audio waveform pill",
      "tailwind": "relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden bg-slate-950 flex flex-col justify-between p-6 md:p-10",
      "aiImage": "Cinematic 8K video hero interface, sleek dark transparent playback controls, glow play button, timecode [03:45/07:20], ambient luxury lighting"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showLiveStatus": true
    }
  },
  {
    "id": "hero-video-showreel-stage",
    "part": "hero",
    "name": "Interactive Brand Showreel Player Stage",
    "koreanName": "🎥 인터랙티브 브랜드 쇼릴 플레이어 스테이지",
    "trend": "Linear HUD",
    "gridGeometry": "1col-center",
    "focalAnchor": "video",
    "density": "balanced",
    "description": "중앙 대형 비디오 플레이어 스테이지 + 3단 챕터 마커(01 Intro, 02 Architecture, 03 Real-World) + 타임라인 스크러버 바",
    "wireframeShape": "video-player",
    "keyFeatures": [
      "중앙 원형 펄스 재생 버튼",
      "3단 챕터 마커 타임라인",
      "고해상도 비디오 쇼릴 프레임",
      "풀스크린 및 화질 선택 UI"
    ],
    "tags": [
      "Showreel",
      "Video",
      "Interactive",
      "Keynote"
    ],
    "promptDirectives": {
      "figma": "Centralized 16:9 video player card with glowing neon play button, chapter navigation markers below, and dark glass border",
      "tailwind": "w-full max-w-5xl mx-auto rounded-3xl overflow-hidden border border-slate-700 bg-slate-900/90 shadow-2xl p-4 md:p-8",
      "aiImage": "Ultra-sleek tech showreel video player stage with glowing cyan play button, interactive timeline scrub bar, 4K film frame preview"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showHotspots": true
    }
  },
  {
    "id": "hero-video-shorts-3col",
    "part": "hero",
    "name": "9:16 Vertical Video Reels 3-Column Grid",
    "koreanName": "📱 9:16 모바일 세로 숏폼 릴스 3단 그리드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "video",
    "density": "compact",
    "description": "모바일 세로 9:16 비율 비디오 카드 3열 배치 (호버 시 자동재생, 실시간 시청자 수 14.8M 뱃지, 사운드 이퀄라이저)",
    "wireframeShape": "video-player",
    "keyFeatures": [
      "9:16 세로형 비디오 카드 3열",
      "사운드 웨이브 애니메이션",
      "조회수/좋아요 소셜 반응 오버레이",
      "모바일 퍼스트 인터랙션"
    ],
    "tags": [
      "Shorts",
      "Reels",
      "Video",
      "Social"
    ],
    "promptDirectives": {
      "figma": "3-column grid of 9:16 vertical smartphone ratio video cards, rounded-2xl corners, overlay social metrics and audio wave indicator",
      "tailwind": "grid grid-cols-1 md:grid-cols-3 gap-6 w-full py-8",
      "aiImage": "Modern 3-column vertical smartphone video cards showcase, glowing neon accents, social video creator feed, 4K UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": false
    }
  },
  {
    "id": "hero-photo-vogue-lookbook",
    "part": "hero",
    "name": "High-Fashion Editorial Lookbook Strip",
    "koreanName": "📸 하이패션 세로 2:3 룩북 필름스트립",
    "trend": "Minimalist Editorial",
    "gridGeometry": "carousel-filmstrip",
    "focalAnchor": "visual",
    "density": "airy",
    "description": "세로 2:3 비율의 고화질 화보 컷들이 수평으로 흐르는 럭셔리 매거진 룩북 (세리프 타이포, [01/08 SS COLLECTION] 마이크로 태그)",
    "wireframeShape": "visual-photo-lookbook",
    "keyFeatures": [
      "2:3 세로 비율 명품 화보",
      "가로 롤링 필름스트립",
      "클래식 세리프 캡션",
      "마이크로 컬렉션 메타데이터"
    ],
    "tags": [
      "Fashion",
      "Lookbook",
      "Photo",
      "Editorial"
    ],
    "promptDirectives": {
      "figma": "Horizontal filmstrip carousel of 2:3 vertical luxury fashion photos, subtle warm beige palette, serif typography, 8px hairline borders",
      "tailwind": "flex gap-6 overflow-x-auto py-8 no-scrollbar w-full",
      "aiImage": "High-end luxury fashion brand website hero, horizontal 2:3 vertical photo strip, vogue aesthetic, minimalist serif captions"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true
    }
  },
  {
    "id": "hero-photo-asym-6040",
    "part": "hero",
    "name": "60:40 Asymmetric Architectural Photo Split",
    "koreanName": "🖼️ 60:40 비대칭 건축 화보 & 스토리 스플릿",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-60-40",
    "focalAnchor": "visual",
    "density": "airy",
    "description": "좌측 60%를 채우는 웅장한 건축/공간 실사 + 우측 40% 여백 넘치는 스토리텔링과 상담 예약 CTA",
    "wireframeShape": "visual-photo-split",
    "keyFeatures": [
      "좌측 60% 전면 사진 뷰포트",
      "우측 40% 럭셔리 텍스트 레이아웃",
      "핫스팟 스펙 핀 내장",
      "자연광 톤앤매너"
    ],
    "tags": [
      "Architecture",
      "Interior",
      "Photo",
      "Split"
    ],
    "promptDirectives": {
      "figma": "60:40 asymmetric layout, left column 60% high-contrast architectural photo, right column 40% airy editorial copy and CTA button",
      "tailwind": "grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full py-12",
      "aiImage": "Minimalist architectural firm landing page, 60:40 split, high-end daylight interior photo on left, refined typography on right"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showHotspots": true
    }
  },
  {
    "id": "hero-typo-giant-kinetic",
    "part": "hero",
    "name": "Giant Kinetic Display Typography Hero",
    "koreanName": "🔤 96pt 자이언트 키네틱 디스플레이 & 마키",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "1col-center",
    "focalAnchor": "typo",
    "density": "balanced",
    "description": "화면을 가로지르는 96pt 초대형 산세리프 타이포그래피 + 상하 무한 롤링 마키 티커 + 흑백 고대비 네오브루탈리즘",
    "wireframeShape": "typo-giant-display",
    "keyFeatures": [
      "96pt+ 초대형 서체",
      "무한 롤링 텍스트 마키 티커",
      "흑백 고대비 그리드 라인",
      "하드 섀도우 뱃지"
    ],
    "tags": [
      "Typography",
      "Brutalist",
      "Marquee",
      "Kinetic"
    ],
    "promptDirectives": {
      "figma": "Ultra-bold 96pt display typography hero, infinite horizontal ticker bar at top and bottom, strict gridlines, monospaced metadata",
      "tailwind": "w-full py-16 px-6 flex flex-col items-center justify-center border-y-2 border-slate-900 bg-white dark:bg-black",
      "aiImage": "Swiss modern graphic design poster website, giant ultra-bold typography, black and white extreme contrast, ticker tape banners"
    },
    "customOptions": {
      "showBadge": true,
      "showMarquee": true,
      "showGridLines": true
    }
  },
  {
    "id": "hero-typo-swiss-broadsheet",
    "part": "hero",
    "name": "Swiss Modernism 12-Column Editorial Broadsheet",
    "koreanName": "🏛️ 스위스 모더니즘 12-컬럼 브로드시트",
    "trend": "Minimalist Editorial",
    "gridGeometry": "bento-12col",
    "focalAnchor": "typo",
    "density": "balanced",
    "description": "12컬럼 엄격한 정렬 그리드, 얇은 1px 헤어라인 디바이더, 01/02/03 인덱스 번호, 절제된 타이포그래피 미학",
    "wireframeShape": "typo-swiss-grid",
    "keyFeatures": [
      "12-컬럼 수학적 정렬 그리드",
      "1px 헤어라인 구분선",
      "모노스페이스 인덱스 넘버링",
      "순수 텍스트의 구조미"
    ],
    "tags": [
      "Swiss",
      "Editorial",
      "Typography",
      "Minimal"
    ],
    "promptDirectives": {
      "figma": "Swiss international typographic style 12-column layout, 1px black divider borders, indexed chapters 01/02/03, stark contrast",
      "tailwind": "grid grid-cols-12 gap-4 border-t border-slate-800 pt-8 w-full",
      "aiImage": "Swiss international typography style broadsheet website, pure black and white, precision 12-column text alignment, museum archive look"
    },
    "customOptions": {
      "showBadge": true,
      "showGridLines": true
    }
  },
  {
    "id": "hero-genui-center-prompt",
    "part": "hero",
    "name": "Embedded GenUI Prompt Bar Hero",
    "koreanName": "🤖 중앙 생성형 AI 프롬프트 바 히어로",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "자연어 프롬프트 인풋 필드, 실시간 실행 추천 알약 태그, [⌘K로 생성하기] 버튼이 내장된 AI-Native 중앙 레이아웃",
    "wireframeShape": "center-prompt",
    "keyFeatures": [
      "자연어 인풋창 내장",
      "빠른 프롬프트 칩",
      "실시간 생성 결과 프리뷰 모달 트리거"
    ],
    "tags": [
      "GenUI",
      "AI-Native",
      "Search-first"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Embedded GenUI Prompt Bar Hero designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-genui-split-canvas",
    "part": "hero",
    "name": "Dual-Pane Prompt & Realtime Streaming Canvas",
    "koreanName": "⚡ 좌측 프롬프트 + 우측 실시간 캔버스 스플릿",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "split-50-50",
    "focalAnchor": "hybrid",
    "density": "compact",
    "description": "좌측 지시문 컨트롤 패널, 우측 실시간 렌더링 가상 브라우저가 배치된 50:50 분할형",
    "wireframeShape": "split-left-prompt",
    "keyFeatures": [
      "좌측 프롬프트 컨트롤",
      "우측 실시간 렌더러",
      "생성 토큰 카운터"
    ],
    "tags": [
      "GenUI",
      "Split-screen",
      "Copilot"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Dual-Pane Prompt & Realtime Streaming Canvas designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-genui-chat-copilot",
    "part": "hero",
    "name": "Floating Co-Pilot Dialogue Hero",
    "koreanName": "💬 부유형 AI 코파일럿 대화 카드 히어로",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "split-60-40",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "와이드 헤드라인 우측 하단으로 반투명 프로스티드 글래스 코파일럿 챗 카드 3단계 대화가 겹쳐진 레이어드",
    "wireframeShape": "split-floating-chat",
    "keyFeatures": [
      "부유형 글래스 챗",
      "멀티턴 메시지 스레드",
      "실시간 답변 배지"
    ],
    "tags": [
      "GenUI",
      "Agentic",
      "Conversational"
    ],
    "promptDirectives": {
      "figma": "split-60-40 structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Floating Co-Pilot Dialogue Hero designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-genui-agent-status",
    "part": "hero",
    "name": "Multi-Agent Autonomous Pipeline Hero",
    "koreanName": "🧭 멀티 에이전트 자율 파이프라인 진행 상태 히어로",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "1col-center",
    "focalAnchor": "data",
    "density": "compact",
    "description": "에이전트 3총사(Planner, Coder, Reviewer)가 연결된 노드 그래프와 실시간 상태 배지 시각화",
    "wireframeShape": "pipeline-nodes",
    "keyFeatures": [
      "노드 다이어그램",
      "실시간 에이전트 상태",
      "작업 소요 시간 텔레메트리"
    ],
    "tags": [
      "Agentic",
      "Pipeline",
      "High-Tech"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Multi-Agent Autonomous Pipeline Hero designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-genui-slash-command",
    "part": "hero",
    "name": "Slash-Command Terminal Palette Hero",
    "koreanName": "⌨️ 슬래시 커맨드 팔레트 히어로",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "ultra-dense",
    "description": "타이핑 시 드롭다운 커맨드 목록(/generate, /refactor)이 열리는 Raycast 스타일 커맨드 센터",
    "wireframeShape": "command-palette",
    "keyFeatures": [
      "Raycast 메타포",
      "단축키 뱃지",
      "커맨드 자동완성 리스트"
    ],
    "tags": [
      "GenUI",
      "Command-K",
      "Productivity"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Slash-Command Terminal Palette Hero designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-genui-multimodal-drop",
    "part": "hero",
    "name": "Multi-Modal File & Wireframe Ingestion Hero",
    "koreanName": "📁 멀티모달 파일 & 와이어프레임 드롭존 히어로",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "split-50-50",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "좌측 대형 파일 드롭존, 우측 즉시 생성된 인터랙티브 컴포넌트 뷰",
    "wireframeShape": "dropzone-split",
    "keyFeatures": [
      "드래그앤드롭 대시보드",
      "이미지 분석 시각화",
      "원클릭 변환 CTA"
    ],
    "tags": [
      "GenUI",
      "Dropzone",
      "Multi-modal"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Multi-Modal File & Wireframe Ingestion Hero designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-genui-streaming-tokens",
    "part": "hero",
    "name": "Realtime Token Streaming Terminal Hero",
    "koreanName": "📜 실시간 토큰 스트리밍 터미널 히어로",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "1col-center",
    "focalAnchor": "data",
    "density": "compact",
    "description": "중앙에 타이핑 애니메이션과 토큰 카운터, 레이턴시(12ms), 속도(180 t/s)가 표기된 터미널",
    "wireframeShape": "terminal-center",
    "keyFeatures": [
      "타이핑 스트리밍 효과",
      "지연시간 & TPS 메트릭",
      "모노스페이스 타이포"
    ],
    "tags": [
      "GenUI",
      "Terminal",
      "Developer"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Realtime Token Streaming Terminal Hero designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-genui-workflow-graph",
    "part": "hero",
    "name": "Visual Node Orchestration Flow Hero",
    "koreanName": "🕸️ 시각적 노드 오케스트레이션 플로우 히어로",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "split-70-30",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "좌측 70% 노드 그래프 캔버스, 우측 30% 선택 노드 인스펙터 패널의 전문가용 레이아웃",
    "wireframeShape": "node-canvas",
    "keyFeatures": [
      "캔버스 노드 연결선",
      "노드 설정 인스펙터",
      "드래그 인터랙션 큐"
    ],
    "tags": [
      "GenUI",
      "Node-based",
      "Orchestration"
    ],
    "promptDirectives": {
      "figma": "split-70-30 structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Visual Node Orchestration Flow Hero designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-bento-asymmetric-12col",
    "part": "hero",
    "name": "Asymmetric 12-Column Modular Bento Hero",
    "koreanName": "🍱 비대칭 12열 인터랙티브 벤토 히어로",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "8열 메인 가치 제안 카드 + 4열 세로 퀵 액션 카드, 하단 3개 마이크로 지표 위젯의 플래그십 구조",
    "wireframeShape": "bento-12col-layout",
    "keyFeatures": [
      "12열 비대칭 모듈",
      "실시간 스파크라인",
      "호버 뎁스 부상 효과"
    ],
    "tags": [
      "Bento 2.0",
      "Modular",
      "Dashboard"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Asymmetric 12-Column Modular Bento Hero designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-bento-3x2-widgets",
    "part": "hero",
    "name": "3x2 Equal Modular Widget Matrix Hero",
    "koreanName": "🔲 3x2 균등 위젯 매트릭스 벤토 히어로",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "data",
    "density": "compact",
    "description": "동일 규격 6개 카드가 3열 2행으로 정돈되어 각기 다른 마이크로 인터랙션을 품은 모듈형",
    "wireframeShape": "bento-3x2-grid",
    "keyFeatures": [
      "6개 균등 카드",
      "카드별 고유 인터랙션",
      "미니 위젯 메타포"
    ],
    "tags": [
      "Bento 2.0",
      "Matrix",
      "Clean"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 3x2 Equal Modular Widget Matrix Hero designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-bento-circular-radar",
    "part": "hero",
    "name": "Central Circular Radar & Satellite Bento Hero",
    "koreanName": "🎯 중앙 원형 레이더 & 위성 벤토 히어로",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-asymmetric",
    "focalAnchor": "visual",
    "density": "compact",
    "description": "중앙 원형 타겟 레이더 그래프를 중심으로 4개 모서리 위젯 카드가 방사형으로 둘러싼 구조",
    "wireframeShape": "bento-radial",
    "keyFeatures": [
      "중앙 원형 차트",
      "4개 위성 정보 카드",
      "회전 레이더 빔 효과"
    ],
    "tags": [
      "Bento 2.0",
      "Radar",
      "Cyber"
    ],
    "promptDirectives": {
      "figma": "bento-asymmetric structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Central Circular Radar & Satellite Bento Hero designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-bento-sparkline-kpi",
    "part": "hero",
    "name": "Live Sparkline & Kinetic Ticker Bento Hero",
    "koreanName": "📈 실시간 스파크라인 & 키네틱 티커 벤토 히어로",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "data",
    "density": "compact",
    "description": "애니메이션 SVG 스파크라인 곡선과 실시간 주식 스타일 키네틱 숫자 롤러가 장착된 벤토",
    "wireframeShape": "bento-sparkline",
    "keyFeatures": [
      "인터랙티브 스파크라인",
      "실시간 증감 롤러",
      "초록/빨강 상태 뱃지"
    ],
    "tags": [
      "Bento 2.0",
      "Fintech",
      "Analytics"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Live Sparkline & Kinetic Ticker Bento Hero designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-bento-video-preview",
    "part": "hero",
    "name": "Cinematic Micro-Video Loop Bento Hero",
    "koreanName": "🎬 시네마틱 마이크로 비디오 루프 벤토 히어로",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "가장 큰 메인 벤토 카드가 무한 비디오 루프로 작동하고 우측 서브 카드가 타임스탬프를 표시하는 구성",
    "wireframeShape": "bento-video-main",
    "keyFeatures": [
      "비디오 배경 카드",
      "음향 파형 비주얼라이저",
      "재생/일시정지 토글"
    ],
    "tags": [
      "Bento 2.0",
      "Video",
      "Multimedia"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Cinematic Micro-Video Loop Bento Hero designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-bento-nested-pills",
    "part": "hero",
    "name": "Multi-Tag Density Pill Bento Hero",
    "koreanName": "🏷️ 고밀도 태그 필 & 카테고리 벤토 히어로",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "compact",
    "description": "각 카드마다 8~12개의 컬러풀한 카테고리 알약 태그와 기능 체크리스트가 배열된 디자인 시스템형",
    "wireframeShape": "bento-tags",
    "keyFeatures": [
      "컬러 태그 클러스터",
      "원클릭 필터링 지원",
      "고밀도 정보 압축"
    ],
    "tags": [
      "Bento 2.0",
      "Design-System",
      "Tags"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Multi-Tag Density Pill Bento Hero designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-bento-interactive-toggle",
    "part": "hero",
    "name": "Live Switcher & Slider Micro-Sandbox Bento",
    "koreanName": "🎛️ 라이브 스위처 & 슬라이더 샌드박스 벤토",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "카드 위에서 직접 토글 스위치, 라디오 버튼, 슬라이더를 조작해 보는 미니 샌드박스 벤토",
    "wireframeShape": "bento-switches",
    "keyFeatures": [
      "조작 가능한 스위치 UI",
      "슬라이더 값 실시간 반영",
      "하드웨어 촉각 스타일"
    ],
    "tags": [
      "Bento 2.0",
      "Sandbox",
      "Interactive"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Live Switcher & Slider Micro-Sandbox Bento designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-bento-diagonal-slice",
    "part": "hero",
    "name": "Angled Diagonal Slice Bento Hero",
    "koreanName": "📐 사선 앵글 슬라이스 벤토 히어로",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "diagonal-angle",
    "focalAnchor": "visual",
    "density": "airy",
    "description": "-4도 비스듬히 기울어진 사선 분할선을 따라 카드가 계단식으로 엇갈리는 역동적 벤토",
    "wireframeShape": "bento-diagonal",
    "keyFeatures": [
      "-4도 사선 레이아웃",
      "시각적 텐션 극대화",
      "스크롤 시 입체 패럴랙스"
    ],
    "tags": [
      "Bento 2.0",
      "Diagonal",
      "Dynamic"
    ],
    "promptDirectives": {
      "figma": "diagonal-angle structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Angled Diagonal Slice Bento Hero designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-spatial-podium-stage",
    "part": "hero",
    "name": "3D Floating Hardware Podium Stage Hero",
    "koreanName": "🔮 3D 실물 플로팅 포디움 스테이지 히어로",
    "trend": "Spatial 3D & Clay",
    "gridGeometry": "1col-center",
    "focalAnchor": "visual",
    "density": "airy",
    "description": "스튜디오 원형 단상 위에 부유하는 3D 실물 기기와 사실적인 앰비언트 바닥 반사 그림자 무대",
    "wireframeShape": "center-podium-3d",
    "keyFeatures": [
      "3D 단상 포디움",
      "접촉 그림자(Contact Shadow)",
      "360도 회전 큐"
    ],
    "tags": [
      "Spatial 3D",
      "Podium",
      "Hardware"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Spatial 3D & Clay visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 3D Floating Hardware Podium Stage Hero designed in Spatial 3D & Clay aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-spatial-hotspot-pins",
    "part": "hero",
    "name": "Interactive Exploded Hotspot Pin Hero",
    "koreanName": "📍 인터랙티브 분해 핫스팟 핀 히어로",
    "trend": "Spatial 3D & Clay",
    "gridGeometry": "split-60-40",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "좌측 제품 단면도 위 4개 펄스 링 핫스팟 핀 점멸, 클릭 시 우측에 특허 소재와 사양 팝업",
    "wireframeShape": "hotspot-viewer",
    "keyFeatures": [
      "펄스 핫스팟 핀",
      "부품별 스펙 팝업",
      "정밀 엔지니어링 미학"
    ],
    "tags": [
      "Spatial 3D",
      "Hotspot",
      "Interactive"
    ],
    "promptDirectives": {
      "figma": "split-60-40 structure in Figma Auto-Layout, Spatial 3D & Clay visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Interactive Exploded Hotspot Pin Hero designed in Spatial 3D & Clay aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-spatial-clay-soft-pill",
    "part": "hero",
    "name": "Claymorphic Soft 3D Pill Hero",
    "koreanName": "🫧 클레이모피즘 소프트 3D 알약 히어로",
    "trend": "Spatial 3D & Clay",
    "gridGeometry": "1col-center",
    "focalAnchor": "visual",
    "density": "airy",
    "description": "부드러운 점토 질감의 3D 아이콘과 매끄러운 엠보싱 섀도우가 형성하는 따뜻한 공간감",
    "wireframeShape": "clay-pill-center",
    "keyFeatures": [
      "클레이 3D 질감",
      "소프트 이중 그림자",
      "친근한 브랜드 톤앤매너"
    ],
    "tags": [
      "Spatial 3D",
      "Claymorphism",
      "Soft"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Spatial 3D & Clay visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Claymorphic Soft 3D Pill Hero designed in Spatial 3D & Clay aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-spatial-isometric-cube",
    "part": "hero",
    "name": "Isometric Architecture Cube Matrix Hero",
    "koreanName": "🧊 아이소메트릭 입체 큐브 매트릭스 히어로",
    "trend": "Spatial 3D & Clay",
    "gridGeometry": "split-50-50",
    "focalAnchor": "visual",
    "density": "compact",
    "description": "30도 각도의 투명 유리 큐브들이 데이터 플로우를 형성하는 아이소메트릭 50:50 구조",
    "wireframeShape": "isometric-cube-split",
    "keyFeatures": [
      "30도 아이소메트릭 그리드",
      "투명 아크릴 큐브",
      "입체 데이터 흐름 시각화"
    ],
    "tags": [
      "Spatial 3D",
      "Isometric",
      "Architecture"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, Spatial 3D & Clay visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Isometric Architecture Cube Matrix Hero designed in Spatial 3D & Clay aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-spatial-acrylic-layers",
    "part": "hero",
    "name": "Multi-Tier Transparent Acrylic Sheets Hero",
    "koreanName": "📑 멀티 티어 투명 아크릴 시트 스택 히어로",
    "trend": "Spatial 3D & Clay",
    "gridGeometry": "split-60-40",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "반투명 아크릴 판 3장이 앞뒤 Z-축으로 겹쳐져 굴절광으로 상호작용하는 심도 있는 구성",
    "wireframeShape": "acrylic-stack",
    "keyFeatures": [
      "Z-축 3중 아크릴 중첩",
      "빛의 굴절 효과",
      "공간 깊이감(Depth) 연출"
    ],
    "tags": [
      "Spatial 3D",
      "Glassmorphism",
      "Depth"
    ],
    "promptDirectives": {
      "figma": "split-60-40 structure in Figma Auto-Layout, Spatial 3D & Clay visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Multi-Tier Transparent Acrylic Sheets Hero designed in Spatial 3D & Clay aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-spatial-orbit-wheel",
    "part": "hero",
    "name": "360° Circular Orbit Planetary Hero",
    "koreanName": "🪐 360° 원형 궤도 행성 회전 히어로",
    "trend": "Spatial 3D & Clay",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "airy",
    "description": "중앙 엠블럼을 중심으로 6개 파트너십/기능 아이콘이 점선 궤도를 따라 공전하는 레이아웃",
    "wireframeShape": "orbit-wheel",
    "keyFeatures": [
      "원형 궤도 점선",
      "회전 공전 메타포",
      "우주적 앰비언트 배경"
    ],
    "tags": [
      "Spatial 3D",
      "Orbit",
      "Ecosystem"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Spatial 3D & Clay visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 360° Circular Orbit Planetary Hero designed in Spatial 3D & Clay aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-spatial-floating-card-deck",
    "part": "hero",
    "name": "3D Tilted Card Deck Fan-Out Hero",
    "koreanName": "🃏 3D 부채꼴 카드 덱 전개 히어로",
    "trend": "Spatial 3D & Clay",
    "gridGeometry": "split-50-50",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "우측 영역에 3장의 카드가 부채꼴 형태로 비스듬히 펼쳐진 3D 팬아웃 인터랙티브 레이아웃",
    "wireframeShape": "card-fanout",
    "keyFeatures": [
      "부채꼴 3D 회전 카드",
      "마우스 호버 시 카드 전면 전개",
      "실제 질감의 카드 테두리"
    ],
    "tags": [
      "Spatial 3D",
      "Cards",
      "Fan-out"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, Spatial 3D & Clay visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 3D Tilted Card Deck Fan-Out Hero designed in Spatial 3D & Clay aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-spatial-exploded-hardware",
    "part": "hero",
    "name": "Exploded Layer Mechanical Blueprint Hero",
    "koreanName": "⚙️ 분해 청사진 레이어 하드웨어 히어로",
    "trend": "Spatial 3D & Clay",
    "gridGeometry": "split-70-30",
    "focalAnchor": "visual",
    "density": "compact",
    "description": "케이스, 메인보드, 렌즈 부품이 위아래 공중에 분해 정렬된 익스플로디드 뷰와 치수선 레이아웃",
    "wireframeShape": "exploded-layers",
    "keyFeatures": [
      "공중 분해 정렬 뷰",
      "치수선 & 마이크로미터 태그",
      "엔지니어링 테크 감성"
    ],
    "tags": [
      "Spatial 3D",
      "Exploded",
      "Hardware"
    ],
    "promptDirectives": {
      "figma": "split-70-30 structure in Figma Auto-Layout, Spatial 3D & Clay visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Exploded Layer Mechanical Blueprint Hero designed in Spatial 3D & Clay aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-swiss-oversized-display",
    "part": "hero",
    "name": "96pt Monumental Swiss Display Typography Hero",
    "koreanName": "📰 96pt 모뉴멘탈 스위스 자이언트 타이포 히어로",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "1col-center",
    "focalAnchor": "typo",
    "density": "airy",
    "description": "화면 가로폭을 가득 채우는 96pt 이상 볼드 세리프 헤드라인과 0.5px 엄격한 헤어라인 그리드",
    "wireframeShape": "giant-typo-center",
    "keyFeatures": [
      "화면 전폭 자이언트 텍스트",
      "스위스 인터내셔널 그리드",
      "0.5px 정밀 헤어라인"
    ],
    "tags": [
      "Swiss",
      "Editorial",
      "Typography-first"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 96pt Monumental Swiss Display Typography Hero designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-swiss-dual-marquee",
    "part": "hero",
    "name": "Dual Reverse Infinite Marquee Ticker Hero",
    "koreanName": "🔄 듀얼 역방향 무한 롤링 마퀴 티커 히어로",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "1col-center",
    "focalAnchor": "typo",
    "density": "compact",
    "description": "상단은 좌로, 하단은 우로 엇갈려 질주하는 2줄 무한 텍스트 티커 사이 플로팅 CTA가 얹혀진 구조",
    "wireframeShape": "dual-marquee-center",
    "keyFeatures": [
      "듀얼 역방향 마퀴",
      "시각적 무브먼트",
      "강렬한 텍스트 텐션"
    ],
    "tags": [
      "Swiss",
      "Neo-Brutalism",
      "Marquee"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Dual Reverse Infinite Marquee Ticker Hero designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-brutalist-stamp-collage",
    "part": "hero",
    "name": "Tactile Physical Stamp & Badge Collage Hero",
    "koreanName": "🏷️ 택타일 스탬프 & 배지 스티커 콜라주 히어로",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "split-50-50",
    "focalAnchor": "hybrid",
    "density": "compact",
    "description": "3px 블랙 스트로크 외곽선, 하드 드롭 섀도우, 회전된 승인 도장과 바코드가 중첩된 감성",
    "wireframeShape": "brutalist-stamp-split",
    "keyFeatures": [
      "3px 솔리드 외곽선",
      "하드 드롭 섀도우",
      "회전된 스탬프 & 바코드"
    ],
    "tags": [
      "Neo-Brutalism",
      "Stickers",
      "High-Contrast"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Tactile Physical Stamp & Badge Collage Hero designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-swiss-newspaper-columns",
    "part": "hero",
    "name": "Multi-Column Broadside Newspaper Editorial Hero",
    "koreanName": "📰 4단 브로드시트 신문 에디토리얼 히어로",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "1col-center",
    "focalAnchor": "typo",
    "density": "ultra-dense",
    "description": "전통 신문 톱기사처럼 굵은 특종 헤드라인 아래 세로선으로 나뉜 4단 텍스트 칼럼 레이아웃",
    "wireframeShape": "newspaper-4col",
    "keyFeatures": [
      "4단 칼럼 세로선",
      "발행일 & 에디션 메타데이터",
      "풀 쿼트 인용구"
    ],
    "tags": [
      "Swiss",
      "Journalism",
      "Columns"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Multi-Column Broadside Newspaper Editorial Hero designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-brutalist-diagonal-banner",
    "part": "hero",
    "name": "Caution Tape Diagonal Caution Ribbon Hero",
    "koreanName": "🚧 안전 테이프 대각선 리본 배너 히어로",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "diagonal-angle",
    "focalAnchor": "typo",
    "density": "balanced",
    "description": "화면 전체를 가로지르는 옐로우/블랙 사선 안전띠 리본 테이프와 과감한 언더라인 링크",
    "wireframeShape": "diagonal-ribbon",
    "keyFeatures": [
      "사선 안전띠 리본",
      "하이 비비드 옐로우 대비",
      "원초적 주목성"
    ],
    "tags": [
      "Neo-Brutalism",
      "Ribbon",
      "Vivid"
    ],
    "promptDirectives": {
      "figma": "diagonal-angle structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Caution Tape Diagonal Caution Ribbon Hero designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-swiss-monochrome-stark",
    "part": "hero",
    "name": "Stark 100% Monochrome Absolute Contrast Hero",
    "koreanName": "⚖️ 순수 100% 흑백 절대 명암비 히어로",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "split-50-50",
    "focalAnchor": "typo",
    "density": "airy",
    "description": "컬러를 배제하고 오직 #000과 #FFF의 극한 대비만으로 정보 위계를 세운 갤러리 도록 스타일",
    "wireframeShape": "monochrome-split",
    "keyFeatures": [
      "0% 무채색 명암비",
      "타이포그래피 굵기 위계",
      "완전한 시각적 노이즈 제거"
    ],
    "tags": [
      "Swiss",
      "Monochrome",
      "Minimalist"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Stark 100% Monochrome Absolute Contrast Hero designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-brutalist-wireframe-grid",
    "part": "hero",
    "name": "Blueprint Exposed Coordinate Grid Hero",
    "koreanName": "📐 청사진 노출 좌표 그리드 히어로",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "compact",
    "description": "모눈종이 좌표선(X:420, Y:890)과 십자선 마커가 그대로 노출된 엔지니어링 브루탈리즘",
    "wireframeShape": "grid-coordinates",
    "keyFeatures": [
      "배경 모눈 그리드 노출",
      "좌표 십자선 마커",
      "설계도 감성"
    ],
    "tags": [
      "Neo-Brutalism",
      "Blueprint",
      "Grid-lines"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Blueprint Exposed Coordinate Grid Hero designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-swiss-quote-callout",
    "part": "hero",
    "name": "Giant Manifesto Pull-Quote Hero",
    "koreanName": "💬 매니페스토 자이언트 풀 쿼트 선언 히어로",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "1col-center",
    "focalAnchor": "typo",
    "density": "airy",
    "description": "거대한 열린 따옴표 그래픽과 브랜드 철학 선언문이 큼직한 이탤릭 세리프로 공간을 압도",
    "wireframeShape": "manifesto-quote",
    "keyFeatures": [
      "거대 따옴표 심볼",
      "이탤릭 세리프 선언문",
      "창업자 서명 필기체"
    ],
    "tags": [
      "Swiss",
      "Manifesto",
      "Editorial"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Giant Manifesto Pull-Quote Hero designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-split-70-30-sticky",
    "part": "hero",
    "name": "70:30 Asymmetric Narrative & Sticky Preview Hero",
    "koreanName": "📐 70:30 비대칭 내러티브 & 스티키 프리뷰 히어로",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-70-30",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "좌측 70% 여유로운 공간 브랜드 스토리, 우측 30% 화면에 고정된 인터랙티브 프리뷰 위젯",
    "wireframeShape": "split-70-30-layout",
    "keyFeatures": [
      "70:30 황금비 비대칭",
      "좌측 심도 있는 스토리",
      "우측 스티키 위젯"
    ],
    "tags": [
      "Asymmetric Split",
      "Storytelling",
      "Balanced"
    ],
    "promptDirectives": {
      "figma": "split-70-30 structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 70:30 Asymmetric Narrative & Sticky Preview Hero designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-split-50-50-app-mock",
    "part": "hero",
    "name": "50:50 Balanced Split with Floating App Mockup",
    "koreanName": "⚖️ 50:50 클래식 대칭 & 플로팅 앱 목업 히어로",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-50-50",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "좌측 50% 간결한 헤드라인/CTA와 우측 50% 기울어진 다크 모드 SaaS 웹 대시보드 스크린샷",
    "wireframeShape": "split-50-50-classic",
    "keyFeatures": [
      "50:50 클래식 균형",
      "우측 기울어진 앱 목업",
      "빠른 전환 유도"
    ],
    "tags": [
      "Asymmetric Split",
      "SaaS",
      "Classic"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 50:50 Balanced Split with Floating App Mockup designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-split-reversed-visual-left",
    "part": "hero",
    "name": "Reversed Visual-Left Copy-Right Hero",
    "koreanName": "🔄 반전 비주얼 좌측 + 카피 우측 히어로",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-50-50",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "시선 출발점인 좌측에 거대한 시각 비주얼을 배치하고 우측에서 텍스트와 CTA를 만나는 반전 구조",
    "wireframeShape": "split-visual-left",
    "keyFeatures": [
      "좌측 비주얼 우선 노출",
      "우측 전환 카피",
      "시선 흐름의 신선함"
    ],
    "tags": [
      "Asymmetric Split",
      "Reversed",
      "Fresh"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Reversed Visual-Left Copy-Right Hero designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-split-diagonal-curved-cut",
    "part": "hero",
    "name": "Curved Organic Wave Split Hero",
    "koreanName": "🌊 유기적 곡선 웨이브 스플릿 히어로",
    "trend": "Asymmetric Split",
    "gridGeometry": "diagonal-angle",
    "focalAnchor": "visual",
    "density": "airy",
    "description": "두 영역 사이를 부드러운 SVG 베지어 곡선으로 유기적으로 갈라 우아한 흐름을 유도하는 히어로",
    "wireframeShape": "curved-split",
    "keyFeatures": [
      "유기적 SVG 곡선 분할",
      "자연스러운 공간 전이",
      "부드러운 브랜드 감성"
    ],
    "tags": [
      "Asymmetric Split",
      "Organic",
      "Curved"
    ],
    "promptDirectives": {
      "figma": "diagonal-angle structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Curved Organic Wave Split Hero designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-split-30-70-giant-stage",
    "part": "hero",
    "name": "30:70 Compact Sidebar & Giant Stage Hero",
    "koreanName": "🖥️ 30:70 컴팩트 사이드바 & 자이언트 스테이지 히어로",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-70-30",
    "focalAnchor": "visual",
    "density": "compact",
    "description": "좌측 30% 슬림 컨트롤 사이드바, 우측 70% 전폭에 압도적 비주얼/비디오 스테이지를 전개",
    "wireframeShape": "split-30-70-stage",
    "keyFeatures": [
      "70% 와이드 캔버스",
      "좌측 슬림 사이드바",
      "도구형 웹사이트 감성"
    ],
    "tags": [
      "Asymmetric Split",
      "Studio",
      "Wide-canvas"
    ],
    "promptDirectives": {
      "figma": "split-70-30 structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 30:70 Compact Sidebar & Giant Stage Hero designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-split-overlapping-cards",
    "part": "hero",
    "name": "Central Seam Overlapping Glass Cards Hero",
    "koreanName": "🎴 중앙 경계 중첩 글래스 카드 히어로",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-50-50",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "좌우 50:50 분할선 정중앙 경계선 위에 투명한 지표 카드가 정확히 반반 걸쳐진 입체 레이아웃",
    "wireframeShape": "overlapping-center-card",
    "keyFeatures": [
      "경계선 중앙 관통 카드",
      "좌우 영역의 결합감",
      "플로팅 글래스 효과"
    ],
    "tags": [
      "Asymmetric Split",
      "Overlap",
      "Glass"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Central Seam Overlapping Glass Cards Hero designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-split-staggered-columns",
    "part": "hero",
    "name": "Staggered Dual Column Offset Hero",
    "koreanName": "🪜 엇갈린 듀얼 칼럼 스태거드 히어로",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-50-50",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "좌측 칼럼은 위에서 시작하고 우측 칼럼은 120px 아래로 툭 떨어져 시작하는 단차 리듬감",
    "wireframeShape": "staggered-columns",
    "keyFeatures": [
      "120px 단차 스태거드 배치",
      "시각적 리듬과 율동감",
      "포트폴리오형 감성"
    ],
    "tags": [
      "Asymmetric Split",
      "Staggered",
      "Rhythm"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Staggered Dual Column Offset Hero designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-split-interactive-slider",
    "part": "hero",
    "name": "Drag-to-Resize Split Screen Slider Hero",
    "koreanName": "↔️ 드래그 분할 조절 스플릿 스크린 히어로",
    "trend": "Asymmetric Split",
    "gridGeometry": "comparison-slider",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "중앙 수직 핸들을 사용자가 좌우로 드래그하여 양쪽 화면 비율을 실시간 리사이징하는 인터랙티브",
    "wireframeShape": "drag-split-slider",
    "keyFeatures": [
      "드래그 가능한 중앙 핸들",
      "양쪽 화면 비율 실시간 조절",
      "비교 체험 극대화"
    ],
    "tags": [
      "Asymmetric Split",
      "Comparison",
      "Interactive"
    ],
    "promptDirectives": {
      "figma": "comparison-slider structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Drag-to-Resize Split Screen Slider Hero designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-glass-floating-island-dock",
    "part": "hero",
    "name": "VisionOS Floating Glass Island Dock Hero",
    "koreanName": "🏝️ VisionOS 플로팅 글래스 아일랜드 독 히어로",
    "trend": "Liquid Glass",
    "gridGeometry": "floating-dock",
    "focalAnchor": "hybrid",
    "density": "airy",
    "description": "광활한 앰비언트 그라디언트 배경 아래 굴절율과 반투명 블러를 머금은 글래스 독이 부유하는 구조",
    "wireframeShape": "floating-island-dock",
    "keyFeatures": [
      "하단 부유형 글래스 독",
      "VisionOS 공간 컴퓨팅 무드",
      "앰비언트 배경광"
    ],
    "tags": [
      "Liquid Glass",
      "VisionOS",
      "Floating"
    ],
    "promptDirectives": {
      "figma": "floating-dock structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: VisionOS Floating Glass Island Dock Hero designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-glass-refractive-prism-card",
    "part": "hero",
    "name": "Chromatic Aberration Refractive Glass Hero",
    "koreanName": "🌈 색수차 굴절 프리즘 글래스 히어로",
    "trend": "Liquid Glass",
    "gridGeometry": "1col-center",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "모서리를 지날 때 무지개빛 오팔 광채와 색수차가 아른거리는 최첨단 리퀴드 글래스",
    "wireframeShape": "refractive-prism-card",
    "keyFeatures": [
      "무지개빛 색수차 하이라이트",
      "오팔 프리즘 테두리",
      "초현실적 유리 질감"
    ],
    "tags": [
      "Liquid Glass",
      "Prism",
      "Chromatic"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Chromatic Aberration Refractive Glass Hero designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-glass-stacked-layers-3d",
    "part": "hero",
    "name": "Triple Layered Frosted Glass Cascade Hero",
    "koreanName": "📑 3중 중첩 프로스티드 글래스 캐스케이드 히어로",
    "trend": "Liquid Glass",
    "gridGeometry": "stacked-zindex",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "투명도가 서로 다른 3장의 유리 카드가 계단식으로 겹쳐져 뒷장 차트가 은은하게 비치는 깊이감",
    "wireframeShape": "stacked-glass-cascade",
    "keyFeatures": [
      "3중 계단식 유리 중첩",
      "투명도 투과 효과",
      "빛의 산란 깊이감"
    ],
    "tags": [
      "Liquid Glass",
      "Cascade",
      "Layered"
    ],
    "promptDirectives": {
      "figma": "stacked-zindex structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Triple Layered Frosted Glass Cascade Hero designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-glass-aurora-glow-pod",
    "part": "hero",
    "name": "Aurora Borealis Ambient Glow Pod Hero",
    "koreanName": "🌌 오로라 보레알리스 앰비언트 글로우 팟 히어로",
    "trend": "Liquid Glass",
    "gridGeometry": "1col-center",
    "focalAnchor": "visual",
    "density": "airy",
    "description": "유리 카드 바로 뒤편에서 회전하는 에메랄드/보라색 오로라 빛 구체가 유리 표면을 물들이는 조명",
    "wireframeShape": "aurora-glow-pod",
    "keyFeatures": [
      "회전 오로라 라이트 오브",
      "유리 표면 조명 반사",
      "환상적인 야간 모드 무드"
    ],
    "tags": [
      "Liquid Glass",
      "Aurora",
      "Ambient-Glow"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Aurora Borealis Ambient Glow Pod Hero designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-glass-morphing-blob",
    "part": "hero",
    "name": "Liquid Morphing Blob Glassmorphism Hero",
    "koreanName": "💧 리퀴드 몰핑 블롭 글래스모피즘 히어로",
    "trend": "Liquid Glass",
    "gridGeometry": "1col-center",
    "focalAnchor": "visual",
    "density": "airy",
    "description": "액체 방울처럼 유연하게 형태가 일렁이는 블롭 형태의 투명 유리 용기 안에 카피가 담긴 유기적 디자인",
    "wireframeShape": "morphing-blob-glass",
    "keyFeatures": [
      "유기적 액체 방울 블롭",
      "부드러운 테두리 왜곡",
      "살아 숨쉬는 생동감"
    ],
    "tags": [
      "Liquid Glass",
      "Blob",
      "Organic"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Liquid Morphing Blob Glassmorphism Hero designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-glass-cockpit-hud",
    "part": "hero",
    "name": "Aero Glass Pilot Cockpit Canopy Hero",
    "koreanName": "✈️ 에어로 글래스 조종석 캐노피 HUD 히어로",
    "trend": "Liquid Glass",
    "gridGeometry": "split-60-40",
    "focalAnchor": "hybrid",
    "density": "compact",
    "description": "전투기 조종석 전면 곡면 유리창에 녹색 텔레메트리 데이터가 프로젝션되는 형태의 모던 글래스",
    "wireframeShape": "cockpit-canopy-hud",
    "keyFeatures": [
      "곡면 캐노피 글래스",
      "그린 벡터 계측 HUD",
      "공기역학적 프레임"
    ],
    "tags": [
      "Liquid Glass",
      "Aerospace",
      "Cockpit"
    ],
    "promptDirectives": {
      "figma": "split-60-40 structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Aero Glass Pilot Cockpit Canopy Hero designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-glass-frosted-bento-dock",
    "part": "hero",
    "name": "Deep Matte Frosted Bento Glass Hero",
    "koreanName": "❄️ 딥 매트 프로스티드 벤토 글래스 히어로",
    "trend": "Liquid Glass",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "compact",
    "description": "얼음판을 연상시키는 강력한 60px 뎁스 매트 블러 처리와 은은한 미세 노이즈 텍스처 결합",
    "wireframeShape": "frosted-bento-dock",
    "keyFeatures": [
      "60px 딥 매트 블러",
      "미세 노이즈 텍스처",
      "순수한 백색 유리 테두리"
    ],
    "tags": [
      "Liquid Glass",
      "Frosted",
      "Matte"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Deep Matte Frosted Bento Glass Hero designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-glass-luminous-edge-card",
    "part": "hero",
    "name": "Neon Luminous Border Trace Hero",
    "koreanName": "⚡ 네온 루미너스 에지 트레이스 히어로",
    "trend": "Liquid Glass",
    "gridGeometry": "1col-center",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "투명한 글래스 카드 테두리를 따라 빛의 입자가 시계 방향으로 순환하며 흐르는 레이저 에지",
    "wireframeShape": "luminous-edge-card",
    "keyFeatures": [
      "테두리 순환 레이저 빛",
      "트레이싱 라이트 효과",
      "시선 흡인력 극대화"
    ],
    "tags": [
      "Liquid Glass",
      "Laser-edge",
      "Neon"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Neon Luminous Border Trace Hero designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-hud-linear-telemetry",
    "part": "hero",
    "name": "Linear Monospace Telemetry Cockpit Hero",
    "koreanName": "📟 Linear 스타일 모노스페이스 텔레메트리 콕핏 히어로",
    "trend": "Linear HUD",
    "gridGeometry": "1col-center",
    "focalAnchor": "data",
    "density": "ultra-dense",
    "description": "최소한의 여백, 11px 마이크로 폰트, 실시간 레이턴시(12ms), TPS, 서버 상태가 기록된 극단적 생산성 HUD",
    "wireframeShape": "linear-telemetry-hud",
    "keyFeatures": [
      "11px 모노스페이스 폰트",
      "실시간 TPS & 레이턴시 틱",
      "Linear 감성 헤어라인"
    ],
    "tags": [
      "Linear HUD",
      "Developer",
      "High-Density"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Linear Monospace Telemetry Cockpit Hero designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-hud-command-k-prompt",
    "part": "hero",
    "name": "Keyboard-First [⌘K] Command Center Hero",
    "koreanName": "⌨️ 키보드 퍼스트 [⌘K] 커맨드 센터 히어로",
    "trend": "Linear HUD",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "compact",
    "description": "방향키와 엔터키만으로 모든 작업이 실행되는 단축키 힌트 배지([G then P], [⌘K]) 중심 히어로",
    "wireframeShape": "command-k-center",
    "keyFeatures": [
      "키보드 단축키 힌트 배지",
      "키보드 네비게이션 가이드",
      "전문가용 스피드 워크플로우"
    ],
    "tags": [
      "Linear HUD",
      "Keyboard-first",
      "Shortcut"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Keyboard-First [⌘K] Command Center Hero designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-hud-bloomberg-ticker-tape",
    "part": "hero",
    "name": "Bloomberg Terminal Financial Data Ticker Hero",
    "koreanName": "📊 블룸버그 터미널 금융 데이터 티커 히어로",
    "trend": "Linear HUD",
    "gridGeometry": "1col-center",
    "focalAnchor": "data",
    "density": "ultra-dense",
    "description": "상단 3단 금융 지수 롤링 티커, 호가창 주문 장부 매트릭스, 앰버 오렌지 폰트가 어우러진 터미널",
    "wireframeShape": "bloomberg-terminal",
    "keyFeatures": [
      "실시간 호가 장부 매트릭스",
      "앰버 오렌지 고대비 폰트",
      "금융 티커 전광판"
    ],
    "tags": [
      "Linear HUD",
      "Bloomberg",
      "Fintech"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Bloomberg Terminal Financial Data Ticker Hero designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-hud-multi-region-latency-map",
    "part": "hero",
    "name": "Global Edge Cloud Multi-Region Ping Map Hero",
    "koreanName": "🌐 글로벌 에지 클라우드 멀티 리전 핑 맵 히어로",
    "trend": "Linear HUD",
    "gridGeometry": "split-60-40",
    "focalAnchor": "data",
    "density": "compact",
    "description": "세계 지도 위 서울(8ms), 도쿄(12ms), 프랑크푸르트(85ms) 실시간 핑이 점멸하는 에지 인프라",
    "wireframeShape": "global-ping-map",
    "keyFeatures": [
      "글로벌 지도 핑 시각화",
      "리전별 실시간 레이턴시",
      "인프라 신뢰성 어필"
    ],
    "tags": [
      "Linear HUD",
      "Cloud",
      "Infrastructure"
    ],
    "promptDirectives": {
      "figma": "split-60-40 structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Global Edge Cloud Multi-Region Ping Map Hero designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-hud-cyberpunk-status-matrix",
    "part": "hero",
    "name": "Cyberpunk Wireframe HUD Grid Hero",
    "koreanName": "🔮 사이버펑크 와이어프레임 HUD 그리드 히어로",
    "trend": "Linear HUD",
    "gridGeometry": "1col-center",
    "focalAnchor": "visual",
    "density": "ultra-dense",
    "description": "CRT 브라운관 스캔라인, 45도 각진 코너 컨테이너, 네온 시안과 핫핑크 레이저 라인의 HUD",
    "wireframeShape": "cyberpunk-hud-box",
    "keyFeatures": [
      "CRT 스캔라인 텍스처",
      "각진 코너 챔퍼(Chamfer)",
      "네온 시안/마젠타 발광"
    ],
    "tags": [
      "Linear HUD",
      "Cyberpunk",
      "Sci-fi"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Cyberpunk Wireframe HUD Grid Hero designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-hud-server-cluster-health",
    "part": "hero",
    "name": "128-Core Server Cluster Health Grid Hero",
    "koreanName": "🖥️ 128코어 서버 클러스터 헬스 그리드 히어로",
    "trend": "Linear HUD",
    "gridGeometry": "split-50-50",
    "focalAnchor": "data",
    "density": "ultra-dense",
    "description": "128개의 미세 사각 블록이 CPU 코어 부하율에 따라 녹색, 노란색, 주황색으로 점등되는 모니터링",
    "wireframeShape": "cluster-health-matrix",
    "keyFeatures": [
      "128코어 히트맵 블록",
      "분산 시스템 실시간 부하",
      "엔지니어링 신뢰성"
    ],
    "tags": [
      "Linear HUD",
      "Server",
      "DevOps"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 128-Core Server Cluster Health Grid Hero designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-hud-aerospace-telemetry-radar",
    "part": "hero",
    "name": "Aerospace Coordinate Telemetry Orbit Hero",
    "koreanName": "🛰️ 에어로스페이스 좌표 텔레메트리 궤도 히어로",
    "trend": "Linear HUD",
    "gridGeometry": "split-60-40",
    "focalAnchor": "data",
    "density": "compact",
    "description": "인공위성 고도(420km), 방위각(114°), 속도(7.8km/s)가 정밀 계측 다이얼로 표시되는 우주 항공 HUD",
    "wireframeShape": "satellite-telemetry",
    "keyFeatures": [
      "방위각 & 고도 계측기",
      "궤도 벡터선",
      "정밀 군사/항공 미학"
    ],
    "tags": [
      "Linear HUD",
      "Aerospace",
      "Satellite"
    ],
    "promptDirectives": {
      "figma": "split-60-40 structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Aerospace Coordinate Telemetry Orbit Hero designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-hud-git-branch-pipeline",
    "part": "hero",
    "name": "Live Git Branch & Commit Stream Hero",
    "koreanName": "🌿 라이브 Git 브랜치 & 커밋 스트림 히어로",
    "trend": "Linear HUD",
    "gridGeometry": "1col-center",
    "focalAnchor": "data",
    "density": "compact",
    "description": "main, feature 브랜치가 머지되는 시각적 Git 트리 선과 최신 커밋 해시가 실시간으로 흐르는 히어로",
    "wireframeShape": "git-branch-tree",
    "keyFeatures": [
      "시각적 Git 머지 트리",
      "커밋 해시 뱃지",
      "CI/CD 빌드 성공 체크"
    ],
    "tags": [
      "Linear HUD",
      "Git",
      "Open-Source"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Live Git Branch & Commit Stream Hero designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-cinema-fullbleed-vignette",
    "part": "hero",
    "name": "100vw Full-Bleed Cinematic Photography Hero",
    "koreanName": "🎬 100vw 풀블리드 시네마틱 화보 히어로",
    "trend": "Minimalist Editorial",
    "gridGeometry": "fullbleed-cinematic",
    "focalAnchor": "visual",
    "density": "airy",
    "description": "좌우 여백 없이 브라우저 전체를 채우는 8K 건축 사진과 하단 다크 비네팅 위에 은은히 뜬 카피",
    "wireframeShape": "fullbleed-vignette",
    "keyFeatures": [
      "100vw 전폭 사진",
      "다크 비네팅 그라디언트",
      "극단적 미니멀 카피"
    ],
    "tags": [
      "Cinematic",
      "Full-bleed",
      "Luxury"
    ],
    "promptDirectives": {
      "figma": "fullbleed-cinematic structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 100vw Full-Bleed Cinematic Photography Hero designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-cinema-horizontal-lookbook",
    "part": "hero",
    "name": "2:3 Vertical Editorial Fashion Filmstrip Hero",
    "koreanName": "🎞️ 2:3 세로 룩북 가로 필름스트립 히어로",
    "trend": "Minimalist Editorial",
    "gridGeometry": "carousel-filmstrip",
    "focalAnchor": "visual",
    "density": "airy",
    "description": "세로 2:3 비율의 파리 패션위크 런웨이 화보 컷들이 수평으로 매끄럽게 흐르는 룩북 필름스트립",
    "wireframeShape": "filmstrip-horizontal",
    "keyFeatures": [
      "2:3 세로 비율 화보",
      "가로 부드러운 스크롤",
      "컬렉션 메타데이터 태그"
    ],
    "tags": [
      "Cinematic",
      "Lookbook",
      "Fashion"
    ],
    "promptDirectives": {
      "figma": "carousel-filmstrip structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 2:3 Vertical Editorial Fashion Filmstrip Hero designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-cinema-layered-street-collage",
    "part": "hero",
    "name": "Tactile Polaroid & Street Sticker Collage Hero",
    "koreanName": "🎨 폴라로이드 & 스트릿 스티커 콜라주 히어로",
    "trend": "Minimalist Editorial",
    "gridGeometry": "stacked-zindex",
    "focalAnchor": "visual",
    "density": "compact",
    "description": "비스듬히 놓인 폴라로이드 사진, 찢겨진 종이 테이프 질감, 홀로그램 스티커가 레이어드된 무드",
    "wireframeShape": "polaroid-collage",
    "keyFeatures": [
      "폴라로이드 프레임",
      "찢어진 종이 테이프",
      "스트릿 스티커 레이어"
    ],
    "tags": [
      "Cinematic",
      "Streetwear",
      "Collage"
    ],
    "promptDirectives": {
      "figma": "stacked-zindex structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Tactile Polaroid & Street Sticker Collage Hero designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-cinema-monochrome-portrait",
    "part": "hero",
    "name": "High-Contrast Monochrome Emotional Portrait Hero",
    "koreanName": "👤 하이 콘트라스트 흑백 인물 클로즈업 히어로",
    "trend": "Minimalist Editorial",
    "gridGeometry": "split-50-50",
    "focalAnchor": "visual",
    "density": "airy",
    "description": "시선을 응시하는 깊이 있는 흑백 인물 클로즈업 사진과 우측 절제된 브랜드 카피의 휴머니즘",
    "wireframeShape": "portrait-split",
    "keyFeatures": [
      "깊이 있는 흑백 클로즈업",
      "시선 추적 아이콘택트",
      "정적인 브랜드 울림"
    ],
    "tags": [
      "Cinematic",
      "Monochrome",
      "Portrait"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: High-Contrast Monochrome Emotional Portrait Hero designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-cinema-architectural-white-room",
    "part": "hero",
    "name": "Ultra-Minimal Architectural White Space Hero",
    "koreanName": "🏛️ 울트라 미니멀 건축적 화이트 스페이스 히어로",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "typo",
    "density": "airy",
    "description": "화면의 70%를 순백의 여백으로 비워두고 미술관 조각상처럼 중앙에 배치된 한 문장의 울림",
    "wireframeShape": "white-room-space",
    "keyFeatures": [
      "70% 순백의 극단적 여백",
      "완벽한 시각 비례",
      "미술관 전시 도록 감성"
    ],
    "tags": [
      "Cinematic",
      "White-space",
      "Architectural"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Ultra-Minimal Architectural White Space Hero designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-cinema-split-screen-duo",
    "part": "hero",
    "name": "Dual Storytelling Split Lookbook Duo Hero",
    "koreanName": "👥 듀얼 스토리텔링 스플릿 룩북 듀오 히어로",
    "trend": "Minimalist Editorial",
    "gridGeometry": "split-50-50",
    "focalAnchor": "visual",
    "density": "airy",
    "description": "실내 스튜디오 컷과 야외 로케이션 컷의 상반된 두 화보가 마주보며 완성하는 매거진 펼침면 구도",
    "wireframeShape": "split-photo-duo",
    "keyFeatures": [
      "스튜디오 vs 야외 대조",
      "매거진 펼침면 구도",
      "듀얼 무드 연출"
    ],
    "tags": [
      "Cinematic",
      "Lookbook",
      "Duo"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Dual Storytelling Split Lookbook Duo Hero designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-cinema-fullscreen-ambient-video",
    "part": "hero",
    "name": "Ambient Looping Video with Sound Toggle Hero",
    "koreanName": "🔊 앰비언트 비디오 루프 & 사운드 토글 히어로",
    "trend": "Minimalist Editorial",
    "gridGeometry": "fullbleed-cinematic",
    "focalAnchor": "visual",
    "density": "airy",
    "description": "숨쉬듯 움직이는 자연 비디오 루프와 우측 상단 미세한 사운드 온/오프 오디오 바 스위처",
    "wireframeShape": "video-sound-toggle",
    "keyFeatures": [
      "무한 앰비언트 비디오 루프",
      "사운드 온/오프 인터랙션",
      "영화적 몰입감"
    ],
    "tags": [
      "Cinematic",
      "Video-loop",
      "Sound"
    ],
    "promptDirectives": {
      "figma": "fullbleed-cinematic structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Ambient Looping Video with Sound Toggle Hero designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-cinema-magazine-issue-cover",
    "part": "hero",
    "name": "Quarterly Issue Magazine Cover Hero",
    "koreanName": "📖 계간지 매거진 커버 프론트 히어로",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "상단 브랜드 마스트헤드, 중앙 메인 화보 컷, 모서리에 바코드와 이슈 번호가 인쇄된 정통 잡지 표지",
    "wireframeShape": "magazine-cover",
    "keyFeatures": [
      "잡지 마스트헤드 타이틀",
      "이슈 번호 & 바코드 스탬프",
      "헤드라인 기사 티저"
    ],
    "tags": [
      "Cinematic",
      "Magazine",
      "Masthead"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Quarterly Issue Magazine Cover Hero designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-special-radial-metric-halo",
    "part": "hero",
    "name": "Radial Metric Halo Luminescence Hero",
    "koreanName": "💫 방사형 메트릭 헤일로 루미넌스 히어로",
    "trend": "Liquid Glass",
    "gridGeometry": "1col-center",
    "focalAnchor": "data",
    "density": "airy",
    "description": "중앙의 거대한 99.9% 신뢰도 지표를 감싸는 3중 발광 원형 링과 입체 조명 연출 히어로",
    "wireframeShape": "radial-metric-halo",
    "keyFeatures": [
      "3중 발광 링",
      "중앙 거대 지표",
      "은은한 앰비언트 광원"
    ],
    "tags": [
      "Special",
      "Halo",
      "Radial"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Radial Metric Halo Luminescence Hero designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-special-matrix-rain-terminal",
    "part": "hero",
    "name": "Matrix Digital Rain Code Rain Hero",
    "koreanName": "🟢 매트릭스 디지털 레인 코드 비 히어로",
    "trend": "Linear HUD",
    "gridGeometry": "1col-center",
    "focalAnchor": "visual",
    "density": "ultra-dense",
    "description": "상단에서 초록색 바이너리 코드가 미세하게 흘러내리는 레트로 퓨처리즘 해커 터미널 히어로",
    "wireframeShape": "matrix-code-rain",
    "keyFeatures": [
      "바이너리 코드 비 텍스처",
      "해커 터미널 감성",
      "형광 그린 네온"
    ],
    "tags": [
      "Special",
      "Matrix",
      "Terminal"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Matrix Digital Rain Code Rain Hero designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-special-origami-folded-cards",
    "part": "hero",
    "name": "Origami Poly-Folded Angled Surface Hero",
    "koreanName": "📐 오리가미 입체 종이접기 폴딩 히어로",
    "trend": "Spatial 3D & Clay",
    "gridGeometry": "split-50-50",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "종이를 접은 듯 빛과 그림자가 꺾이는 다각형 면 분할로 기하학적 깊이감을 부여한 히어로",
    "wireframeShape": "origami-folded",
    "keyFeatures": [
      "다각형 폴리곤 셰이딩",
      "기하학적 면 분할",
      "입체 종이접기 미학"
    ],
    "tags": [
      "Special",
      "Origami",
      "Geometry"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, Spatial 3D & Clay visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Origami Poly-Folded Angled Surface Hero designed in Spatial 3D & Clay aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-special-typographic-ticker-wrap",
    "part": "hero",
    "name": "360° Circular Rotating Text Ticker Hero",
    "koreanName": "🔄 360° 원형 회전 텍스트 인장 씰 히어로",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "1col-center",
    "focalAnchor": "typo",
    "density": "balanced",
    "description": "시계 방향으로 회전하는 원형 타이포그래피 인장 씰 스탬프가 중앙 CTA를 감싸고 도는 레이아웃",
    "wireframeShape": "circular-stamp-wrap",
    "keyFeatures": [
      "회전 원형 타이포 텍스트",
      "중앙 CTA 버튼 포커스",
      "도장 인장 메타포"
    ],
    "tags": [
      "Special",
      "Circular",
      "Stamp"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 360° Circular Rotating Text Ticker Hero designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-special-floating-safari-browser",
    "part": "hero",
    "name": "MacOS Safari Window Floating Tilt Hero",
    "koreanName": "🖥️ 맥OS 사파리 윈도우 틸트 플로팅 히어로",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-50-50",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "실제 맥OS 창 상단 트래픽 라이트 버튼과 정밀 주소창이 달린 브라우저가 공중에 15도 틸트된 뷰",
    "wireframeShape": "safari-tilt-window",
    "keyFeatures": [
      "맥OS 사파리 크롬 바",
      "15도 입체 틸트 원근감",
      "웹앱 스크린샷 연출"
    ],
    "tags": [
      "Special",
      "MacOS",
      "Browser"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: MacOS Safari Window Floating Tilt Hero designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-special-particle-constellation",
    "part": "hero",
    "name": "Interactive Gravity Particle Constellation Hero",
    "koreanName": "✨ 인터랙티브 중력 파티클 별자리 히어로",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "airy",
    "description": "마우스 커서를 따라 수천 개의 빛나는 파티클이 인력을 받아 결집하며 형상을 만드는 캔버스",
    "wireframeShape": "gravity-particles",
    "keyFeatures": [
      "인터랙티브 파티클 반응",
      "중력 시뮬레이션",
      "신비로운 앰비언스"
    ],
    "tags": [
      "Special",
      "Particles",
      "Interactive"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Interactive Gravity Particle Constellation Hero designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-special-vertical-split-slider",
    "part": "hero",
    "name": "Vertical Horizon Top-Bottom Split Hero",
    "koreanName": "↕️ 상하 수평선 50:50 분할 스플릿 히어로",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-50-50",
    "focalAnchor": "hybrid",
    "density": "airy",
    "description": "좌우가 아닌 화면의 상단 50%와 하단 50%를 수평선으로 갈라 극적 대비를 주는 수평 분할",
    "wireframeShape": "top-bottom-split",
    "keyFeatures": [
      "상하 수평 분할선",
      "하늘과 대지 대비 구도",
      "시원한 파노라마 시야"
    ],
    "tags": [
      "Special",
      "Horizon",
      "Split"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Vertical Horizon Top-Bottom Split Hero designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "hero-special-brutalist-ticket-stub",
    "part": "hero",
    "name": "Concert Perforated Ticket Stub Pass Hero",
    "koreanName": "🎟️ 콘서트 티켓 절취선 패스 스텁 히어로",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "우측에 점선 절취선(Perforation)과 바코드 스캔 영역이 달린 한정판 VIP 콘퍼런스 티켓 메타포",
    "wireframeShape": "ticket-stub-pass",
    "keyFeatures": [
      "점선 절취선 그래픽",
      "바코드 및 입장 번호",
      "한정판 VIP 패스 감성"
    ],
    "tags": [
      "Special",
      "Ticket",
      "Brutalist"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Concert Perforated Ticket Stub Pass Hero designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-bento-classic-4card",
    "part": "feature",
    "name": "Classic 4-Card Balanced Bento",
    "koreanName": "🍱 클래식 4카드 균형 벤토",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "좌상단 메인 8열 카드와 우상단 4열 보조 카드, 하단 6열 2개 카드로 짜인 가장 안정적인 벤토",
    "wireframeShape": "bento-classic-4card",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Bento Grid 2.0",
      "bento-12col",
      "hybrid"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Classic 4-Card Balanced Bento designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-bento-sparkline-kpi",
    "part": "feature",
    "name": "Bento with Live Sparkline & Metric Counter",
    "koreanName": "📈 실시간 스파크라인 & 지표 벤토",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "data",
    "density": "compact",
    "description": "카드 내부에 SVG 실시간 선형 차트와 키네틱 숫자 롤러가 돌아가는 금융/성능형 벤토",
    "wireframeShape": "bento-sparkline-kpi",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Bento Grid 2.0",
      "bento-12col",
      "data"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Bento with Live Sparkline & Metric Counter designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-bento-1hero-3micro",
    "part": "feature",
    "name": "1-Hero Wide + 3 Micro Action Tiles",
    "koreanName": "🥇 1대형 와이드 + 3 마이크로 액션 타일",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "상단 전체를 가로지르는 와이드 12열 비주얼 카드 아래 아기자기한 3개의 마이크로 액션 타일",
    "wireframeShape": "bento-1hero-3micro",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Bento Grid 2.0",
      "bento-12col",
      "hybrid"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 1-Hero Wide + 3 Micro Action Tiles designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-bento-dense-6matrix",
    "part": "feature",
    "name": "High-Density 6-Matrix Modular Grid",
    "koreanName": "🔲 초고밀도 6-매트릭스 모듈러 벤토",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "data",
    "density": "ultra-dense",
    "description": "3열 2행의 촘촘한 사각 모듈 안에 API 응답값, 서버 부하, 단축키가 빼곡히 들어찬 벤토",
    "wireframeShape": "bento-dense-6matrix",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Bento Grid 2.0",
      "bento-3col",
      "data"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: High-Density 6-Matrix Modular Grid designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-bento-circular-progress",
    "part": "feature",
    "name": "Radial Donut & Progress Gauge Bento",
    "koreanName": "🍩 원형 도넛 & 프로그레스 게이지 벤토",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-asymmetric",
    "focalAnchor": "data",
    "density": "compact",
    "description": "가운데 92% 달성 원형 프로그레스 링이 자리잡고 좌우 카드가 세부 통계를 받쳐주는 구성",
    "wireframeShape": "bento-circular-progress",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Bento Grid 2.0",
      "bento-asymmetric",
      "data"
    ],
    "promptDirectives": {
      "figma": "bento-asymmetric structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Radial Donut & Progress Gauge Bento designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-bento-horizontal-timeline",
    "part": "feature",
    "name": "Horizontal Milestone Stepper Bento",
    "koreanName": "🛤️ 수평 마일스톤 스텝퍼 벤토",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "카드 상단에 4단계 로드맵 진행선(Step 1~4)이 관통하며 단계별 혜택을 보여주는 벤토",
    "wireframeShape": "bento-horizontal-timeline",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Bento Grid 2.0",
      "bento-12col",
      "hybrid"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Horizontal Milestone Stepper Bento designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-bento-neon-laser-glow",
    "part": "feature",
    "name": "Dark OLED Laser Border Glowing Bento",
    "koreanName": "🌌 OLED 레이저 보더 발광 벤토",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "visual",
    "density": "compact",
    "description": "트루블랙 배경 위에 네온 민트와 사이언 0.5px 미세 레이저 보더가 카드마다 빛나는 벤토",
    "wireframeShape": "bento-neon-laser-glow",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Bento Grid 2.0",
      "bento-12col",
      "visual"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Dark OLED Laser Border Glowing Bento designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-bento-interactive-pill-switch",
    "part": "feature",
    "name": "Live Segmented Tab Switcher Bento",
    "koreanName": "🎛️ 라이브 세그먼트 탭 스위처 벤토",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "카드 헤더의 3단 알약 탭(Basic / Pro / Max)을 누르면 카드 내부 콘텐츠가 실시간 스왑",
    "wireframeShape": "bento-interactive-pill-switch",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Bento Grid 2.0",
      "bento-3col",
      "interactive"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Live Segmented Tab Switcher Bento designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-bento-masonry-staggered",
    "part": "feature",
    "name": "Staggered Height Masonry Bento",
    "koreanName": "🧱 높낮이 단차 메이슨리 벤토",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "masonry-3col",
    "focalAnchor": "visual",
    "density": "airy",
    "description": "카드의 세로 높이가 300px, 420px, 240px로 엇갈리며 핀터레스트처럼 자연스러운 리듬감",
    "wireframeShape": "bento-masonry-staggered",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Bento Grid 2.0",
      "masonry-3col",
      "visual"
    ],
    "promptDirectives": {
      "figma": "masonry-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Staggered Height Masonry Bento designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-bento-audio-waveform",
    "part": "feature",
    "name": "Audio Visualizer & Waveform Bento",
    "koreanName": "🎙️ 오디오 비주얼라이저 & 음파 벤토",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "실제 사운드 주파수 막대 24개가 춤추는 이퀄라이저와 보이스 녹음 파형이 탑재된 벤토",
    "wireframeShape": "bento-audio-waveform",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Bento Grid 2.0",
      "bento-12col",
      "visual"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Audio Visualizer & Waveform Bento designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-bento-drag-reorder-tiles",
    "part": "feature",
    "name": "Customizable Drag-and-Drop Tile Bento",
    "koreanName": "🖐️ 드래그 앤 드롭 자유 배치 벤토",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "interactive",
    "density": "compact",
    "description": "사용자가 타일 우상단 핸들을 잡고 원하는 순서대로 위치를 바꿀 수 있는 대시보드 벤토",
    "wireframeShape": "bento-drag-reorder-tiles",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Bento Grid 2.0",
      "bento-3col",
      "interactive"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Customizable Drag-and-Drop Tile Bento designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-bento-health-status-board",
    "part": "feature",
    "name": "99.99% System Health Status Bento",
    "koreanName": "🟢 99.99% 시스템 헬스 상태판 벤토",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "data",
    "density": "compact",
    "description": "API, CDN, Database, Auth의 실시간 그린 체크 점등 라이트가 깜빡이는 신뢰도 벤토",
    "wireframeShape": "bento-health-status-board",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Bento Grid 2.0",
      "bento-12col",
      "data"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 99.99% System Health Status Bento designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-tabs-vertical-left-preview",
    "part": "feature",
    "name": "Vertical Left Sidebar Tabs with Big Canvas",
    "koreanName": "📑 좌측 세로 탭 + 우측 대형 캔버스",
    "trend": "Asymmetric Split",
    "gridGeometry": "interactive-tabs",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "좌측 4개 세로 탭 메뉴를 클릭하면 우측 75% 영역의 고해상도 기능 데모 스크린이 즉시 전환",
    "wireframeShape": "tabs-vertical-left-preview",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Asymmetric Split",
      "interactive-tabs",
      "interactive"
    ],
    "promptDirectives": {
      "figma": "interactive-tabs structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Vertical Left Sidebar Tabs with Big Canvas designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-tabs-top-pill-segments",
    "part": "feature",
    "name": "Top Pill Segment Switcher + Split Screen",
    "koreanName": "💊 상단 알약 세그먼트 스위처 + 분할 화면",
    "trend": "Asymmetric Split",
    "gridGeometry": "interactive-tabs",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "상단 중앙 3개 둥근 알약 버튼 전환에 따라 하단 50:50 분할 영역의 기능 설명과 일러스트 스왑",
    "wireframeShape": "tabs-top-pill-segments",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Asymmetric Split",
      "interactive-tabs",
      "interactive"
    ],
    "promptDirectives": {
      "figma": "interactive-tabs structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Top Pill Segment Switcher + Split Screen designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-tabs-4step-pipeline-flow",
    "part": "feature",
    "name": "4-Step Interactive Pipeline Flow",
    "koreanName": "🪜 4단계 인터랙티브 파이프라인 흐름",
    "trend": "Asymmetric Split",
    "gridGeometry": "timeline-vertical",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "기획 → 디자인 → 코드 → 배포의 4단계 횡스크롤 스텝퍼를 누를 때마다 진행 표시줄이 차오름",
    "wireframeShape": "tabs-4step-pipeline-flow",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Asymmetric Split",
      "timeline-vertical",
      "hybrid"
    ],
    "promptDirectives": {
      "figma": "timeline-vertical structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 4-Step Interactive Pipeline Flow designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-tabs-role-based-persona",
    "part": "feature",
    "name": "Role-Based Dual Persona Switcher (Dev vs PM)",
    "koreanName": "👥 직무별 맞춤 듀얼 페르소나 스위처",
    "trend": "Asymmetric Split",
    "gridGeometry": "interactive-tabs",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "“개발자 모드” vs “프로덕트 매니저 모드” 토글에 따라 완전히 다른 맞춤형 기능 명세 렌더",
    "wireframeShape": "tabs-role-based-persona",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Asymmetric Split",
      "interactive-tabs",
      "hybrid"
    ],
    "promptDirectives": {
      "figma": "interactive-tabs structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Role-Based Dual Persona Switcher (Dev vs PM) designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-tabs-ios-vs-android-preview",
    "part": "feature",
    "name": "Dual-Platform Cross-Device Toggle",
    "koreanName": "📱 iOS vs Android 크로스 플랫폼 토글",
    "trend": "Asymmetric Split",
    "gridGeometry": "interactive-tabs",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "아이폰 16 다이나믹 아일랜드 뷰와 갤럭시 S25 엣지 뷰를 1클릭으로 전환해보는 뷰포트",
    "wireframeShape": "tabs-ios-vs-android-preview",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Asymmetric Split",
      "interactive-tabs",
      "visual"
    ],
    "promptDirectives": {
      "figma": "interactive-tabs structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Dual-Platform Cross-Device Toggle designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-tabs-code-language-runner",
    "part": "feature",
    "name": "Multi-Language Code Snippet Runner (TS/Py/Go)",
    "koreanName": "💻 다국어 코드 스니펫 러너 (TS/Python/Go)",
    "trend": "Linear HUD",
    "gridGeometry": "interactive-tabs",
    "focalAnchor": "interactive",
    "density": "compact",
    "description": "TypeScript, Python, Go 탭 전환 및 [Run Code ▶] 버튼 클릭 시 터미널 출력 결과 시뮬레이션",
    "wireframeShape": "tabs-code-language-runner",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Linear HUD",
      "interactive-tabs",
      "interactive"
    ],
    "promptDirectives": {
      "figma": "interactive-tabs structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Multi-Language Code Snippet Runner (TS/Py/Go) designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-tabs-accordion-vertical-expand",
    "part": "feature",
    "name": "Smooth Vertical Accordion Expander",
    "koreanName": "📂 매끄러운 세로 아코디언 익스팬더",
    "trend": "Asymmetric Split",
    "gridGeometry": "accordion-vertical",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "클릭한 1개 항목만 아래로 부드럽게 펼쳐지며 내부 스크린샷과 서브 불릿을 드러내는 아코디언",
    "wireframeShape": "tabs-accordion-vertical-expand",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Asymmetric Split",
      "accordion-vertical",
      "hybrid"
    ],
    "promptDirectives": {
      "figma": "accordion-vertical structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Smooth Vertical Accordion Expander designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-tabs-radial-orbit-selector",
    "part": "feature",
    "name": "360° Circular Dial Wheel Feature Selector",
    "koreanName": "🎡 360° 원형 다이얼 휠 기능 선택기",
    "trend": "Spatial 3D & Clay",
    "gridGeometry": "interactive-tabs",
    "focalAnchor": "interactive",
    "density": "airy",
    "description": "마우스 휠을 돌리거나 드래그하여 원형 다이얼을 회전시키며 6개 핵심 기능을 탐색하는 구조",
    "wireframeShape": "tabs-radial-orbit-selector",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Spatial 3D & Clay",
      "interactive-tabs",
      "interactive"
    ],
    "promptDirectives": {
      "figma": "interactive-tabs structure in Figma Auto-Layout, Spatial 3D & Clay visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 360° Circular Dial Wheel Feature Selector designed in Spatial 3D & Clay aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-tabs-floating-bottom-dock-menu",
    "part": "feature",
    "name": "Floating Bottom Dock Feature Switcher",
    "koreanName": "🚢 하단 부유형 독(Dock) 기능 스위처",
    "trend": "Liquid Glass",
    "gridGeometry": "floating-dock",
    "focalAnchor": "interactive",
    "density": "airy",
    "description": "맥OS 독처럼 화면 하단에 둥둥 뜬 반투명 아이콘을 호버하면 돋보기처럼 확대되며 기능 선택",
    "wireframeShape": "tabs-floating-bottom-dock-menu",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Liquid Glass",
      "floating-dock",
      "interactive"
    ],
    "promptDirectives": {
      "figma": "floating-dock structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Floating Bottom Dock Feature Switcher designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-tabs-interactive-pricing-tier",
    "part": "feature",
    "name": "Interactive Tier Calculator within Feature",
    "koreanName": "🧮 기능 연동 비용 시뮬레이션 인터랙티브",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "interactive-tabs",
    "focalAnchor": "data",
    "density": "compact",
    "description": "기능 스펙 카드 안에서 직접 슬라이더를 당겨 월간 절감 시간과 ROI를 계산해보는 위젯",
    "wireframeShape": "tabs-interactive-pricing-tier",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Bento Grid 2.0",
      "interactive-tabs",
      "data"
    ],
    "promptDirectives": {
      "figma": "interactive-tabs structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Interactive Tier Calculator within Feature designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-compare-split-slider-drag",
    "part": "feature",
    "name": "Interactive Drag-to-Reveal Before/After",
    "koreanName": "↔️ 드래그 전후 비교 양방향 슬라이더",
    "trend": "Asymmetric Split",
    "gridGeometry": "comparison-slider",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "가운데 세로 바를 좌우로 드래그하여 수작업(Before)과 AI 자동화(After)의 차이를 눈으로 확인",
    "wireframeShape": "compare-split-slider-drag",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Asymmetric Split",
      "comparison-slider",
      "interactive"
    ],
    "promptDirectives": {
      "figma": "comparison-slider structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Interactive Drag-to-Reveal Before/After designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-compare-side-by-side-cards",
    "part": "feature",
    "name": "Side-by-Side Legacy vs Modern 2-Card Contrast",
    "koreanName": "⚖️ 레거시 vs 모던 2단 대조 카드",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "split-50-50",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "좌측의 붉은색 비효율 레거시 방식과 우측의 초록색 고효율 신기술 방식을 나란히 비교",
    "wireframeShape": "compare-side-by-side-cards",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Swiss & Neo-Brutalist",
      "split-50-50",
      "hybrid"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Side-by-Side Legacy vs Modern 2-Card Contrast designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-compare-xray-lens-reveal",
    "part": "feature",
    "name": "Circular X-Ray Lens Hover Reveal",
    "koreanName": "🔍 원형 엑스레이 렌즈 호버 투과 뷰",
    "trend": "Spatial 3D & Clay",
    "gridGeometry": "comparison-slider",
    "focalAnchor": "interactive",
    "density": "airy",
    "description": "마우스 커서 위치에 둥근 엑스레이 렌즈가 따라다니며 제품 겉면 속 내부 반도체 회로를 투시",
    "wireframeShape": "compare-xray-lens-reveal",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Spatial 3D & Clay",
      "comparison-slider",
      "interactive"
    ],
    "promptDirectives": {
      "figma": "comparison-slider structure in Figma Auto-Layout, Spatial 3D & Clay visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Circular X-Ray Lens Hover Reveal designed in Spatial 3D & Clay aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-compare-problem-solution-matrix",
    "part": "feature",
    "name": "Red-Cross vs Green-Check Feature Matrix",
    "koreanName": "❌ 문제점 빨간줄 vs 해결책 초록체크 매트릭스",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "split-50-50",
    "focalAnchor": "hybrid",
    "density": "compact",
    "description": "좌측 5개 고민거리에 사선 취소선이 그어지고 우측에 완벽한 해결 솔루션이 체크되는 구조",
    "wireframeShape": "compare-problem-solution-matrix",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Swiss & Neo-Brutalist",
      "split-50-50",
      "hybrid"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Red-Cross vs Green-Check Feature Matrix designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-compare-performance-race-bar",
    "part": "feature",
    "name": "Animated Benchmark Speed Race Bar",
    "koreanName": "🏎️ 애니메이션 벤치마크 속도 레이스 바",
    "trend": "Linear HUD",
    "gridGeometry": "1col-center",
    "focalAnchor": "data",
    "density": "compact",
    "description": "타사(2.4s) 대비 자사 솔루션(0.12s)이 20배 빠르게 치고 나가는 수평 로딩 바 대조",
    "wireframeShape": "compare-performance-race-bar",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Linear HUD",
      "1col-center",
      "data"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Animated Benchmark Speed Race Bar designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-compare-cost-saving-quadrant",
    "part": "feature",
    "name": "2x2 Cost vs Speed Quadrant Matrix",
    "koreanName": "📊 2x2 비용 vs 속도 4분면 매트릭스",
    "trend": "Linear HUD",
    "gridGeometry": "bento-asymmetric",
    "focalAnchor": "data",
    "density": "balanced",
    "description": "X축 속도, Y축 비용의 4분면 좌표계에서 우상단 최고 위치에 독보적으로 자리잡은 시각 차트",
    "wireframeShape": "compare-cost-saving-quadrant",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Linear HUD",
      "bento-asymmetric",
      "data"
    ],
    "promptDirectives": {
      "figma": "bento-asymmetric structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 2x2 Cost vs Speed Quadrant Matrix designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-compare-workflow-timeline-diff",
    "part": "feature",
    "name": "Linear Timeline Workflow Step Reduction",
    "koreanName": "📉 단계 단축 타임라인 워크플로우 비교",
    "trend": "Asymmetric Split",
    "gridGeometry": "timeline-vertical",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "기존 12단계에 걸친 복잡한 프로세스가 단 2단계로 압축되는 극적 워크플로우 시각화",
    "wireframeShape": "compare-workflow-timeline-diff",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Asymmetric Split",
      "timeline-vertical",
      "hybrid"
    ],
    "promptDirectives": {
      "figma": "timeline-vertical structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Linear Timeline Workflow Step Reduction designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-compare-dark-vs-light-mode",
    "part": "feature",
    "name": "Instant Dark/Light Theme Flip Preview",
    "koreanName": "🌓 다크 모드 vs 라이트 모드 즉시 플립 뷰",
    "trend": "Liquid Glass",
    "gridGeometry": "comparison-slider",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "가운데 반달 토글을 누르면 카드 좌우가 각각 다크와 라이트 톤으로 전환되는 디자인 시스템",
    "wireframeShape": "compare-dark-vs-light-mode",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Liquid Glass",
      "comparison-slider",
      "interactive"
    ],
    "promptDirectives": {
      "figma": "comparison-slider structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Instant Dark/Light Theme Flip Preview designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-compare-manual-vs-ai-clock",
    "part": "feature",
    "name": "Stopwatch Time Spent Counter Comparison",
    "koreanName": "⏱️ 스톱워치 소요 시간 대조 카운터",
    "trend": "Linear HUD",
    "gridGeometry": "split-50-50",
    "focalAnchor": "data",
    "density": "compact",
    "description": "“48시간 소요” 아날로그 시계 째깍거림 vs “3초 완성” 디지털 번개 아이콘의 직관적 대비",
    "wireframeShape": "compare-manual-vs-ai-clock",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Linear HUD",
      "split-50-50",
      "data"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Stopwatch Time Spent Counter Comparison designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-compare-before-after-gallery",
    "part": "feature",
    "name": "Carousel of 5 Real-World Case Comparisons",
    "koreanName": "🖼️ 5대 실전 도입 전후 갤러리 캐러셀",
    "trend": "Minimalist Editorial",
    "gridGeometry": "carousel-filmstrip",
    "focalAnchor": "visual",
    "density": "airy",
    "description": "스와이프하며 5개 실제 고객사의 도입 전 엉망인 코드와 도입 후 정제된 아키텍처를 비교",
    "wireframeShape": "compare-before-after-gallery",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Minimalist Editorial",
      "carousel-filmstrip",
      "visual"
    ],
    "promptDirectives": {
      "figma": "carousel-filmstrip structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Carousel of 5 Real-World Case Comparisons designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-tech-monaco-code-editor",
    "part": "feature",
    "name": "Embedded Monaco Code Editor with Syntax Glow",
    "koreanName": "💻 구문 발광 내장형 모나코 코드 에디터",
    "trend": "Linear HUD",
    "gridGeometry": "1col-center",
    "focalAnchor": "data",
    "density": "ultra-dense",
    "description": "실제 VS Code와 동일한 다크 테마, 줄 번호, 구문 강조, [Copy Snippet] 원클릭 버튼",
    "wireframeShape": "tech-monaco-code-editor",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Linear HUD",
      "1col-center",
      "data"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Embedded Monaco Code Editor with Syntax Glow designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-tech-api-curl-terminal",
    "part": "feature",
    "name": "Interactive cURL API Request Terminal",
    "koreanName": "📡 인터랙티브 cURL API 요청 터미널",
    "trend": "Linear HUD",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "compact",
    "description": "HTTP GET/POST 엔드포인트 URL, 헤더 토큰, JSON 요청 본문이 단정하게 정렬된 터미널",
    "wireframeShape": "tech-api-curl-terminal",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Linear HUD",
      "1col-center",
      "interactive"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Interactive cURL API Request Terminal designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-tech-realtime-json-tree",
    "part": "feature",
    "name": "Collapsible Realtime JSON Tree Inspector",
    "koreanName": "🌳 접이식 실시간 JSON 트리 인스펙터",
    "trend": "Linear HUD",
    "gridGeometry": "split-50-50",
    "focalAnchor": "data",
    "density": "compact",
    "description": "좌측 API 호출 버튼을 누르면 우측에 200 OK 상태코드와 함께 펼쳐지는 계층형 JSON",
    "wireframeShape": "tech-realtime-json-tree",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Linear HUD",
      "split-50-50",
      "data"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Collapsible Realtime JSON Tree Inspector designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-tech-webhook-event-simulator",
    "part": "feature",
    "name": "Live Webhook Event Trigger Simulator",
    "koreanName": "⚡ 실시간 웹훅 이벤트 트리거 시뮬레이터",
    "trend": "Linear HUD",
    "gridGeometry": "bento-12col",
    "focalAnchor": "interactive",
    "density": "compact",
    "description": "`order.created`, `payment.success` 이벤트를 클릭하면 0.05초 만에 페이로드가 수신되는 데모",
    "wireframeShape": "tech-webhook-event-simulator",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Linear HUD",
      "bento-12col",
      "interactive"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Live Webhook Event Trigger Simulator designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-tech-database-schema-er",
    "part": "feature",
    "name": "Visual Interactive Database Schema ER Diagram",
    "koreanName": "🗄️ 시각적 데이터베이스 스키마 ER 다이어그램",
    "trend": "Linear HUD",
    "gridGeometry": "split-70-30",
    "focalAnchor": "data",
    "density": "balanced",
    "description": "테이블 간 1:N 외래키 관계선이 반투명 선으로 이어지고 호버 시 필드 타입이 툴팁으로 표시",
    "wireframeShape": "tech-database-schema-er",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Linear HUD",
      "split-70-30",
      "data"
    ],
    "promptDirectives": {
      "figma": "split-70-30 structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Visual Interactive Database Schema ER Diagram designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-tech-docker-container-tiles",
    "part": "feature",
    "name": "Multi-Container Microservice Status Tiles",
    "koreanName": "🐳 멀티 컨테이너 마이크로서비스 상태 타일",
    "trend": "Linear HUD",
    "gridGeometry": "bento-3col",
    "focalAnchor": "data",
    "density": "compact",
    "description": "Auth, Payment, Analytics 도커 컨테이너의 CPU 점유율, 메모리 사용량, 포트 번호 모니터링",
    "wireframeShape": "tech-docker-container-tiles",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Linear HUD",
      "bento-3col",
      "data"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Multi-Container Microservice Status Tiles designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-tech-cicd-pipeline-steps",
    "part": "feature",
    "name": "CI/CD Pipeline Build & Deploy Stepper",
    "koreanName": "🚀 CI/CD 파이프라인 빌드 & 배포 스텝퍼",
    "trend": "Linear HUD",
    "gridGeometry": "timeline-vertical",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "Lint(통과 3s) → Test(통과 12s) → Build(통과 8s) → Global Deploy(배포 완료 2s) 파이프라인",
    "wireframeShape": "tech-cicd-pipeline-steps",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Linear HUD",
      "timeline-vertical",
      "hybrid"
    ],
    "promptDirectives": {
      "figma": "timeline-vertical structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: CI/CD Pipeline Build & Deploy Stepper designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-tech-edge-latency-ping-grid",
    "part": "feature",
    "name": "Global Edge Network 12-City Ping Grid",
    "koreanName": "🌐 글로벌 12개 도시 에지 핑 레이턴시 그리드",
    "trend": "Linear HUD",
    "gridGeometry": "bento-12col",
    "focalAnchor": "data",
    "density": "compact",
    "description": "도쿄, 런던, 싱가포르, 프랑크푸르트 등 12개 리전의 실시간 레이턴시가 초록색으로 펄스",
    "wireframeShape": "tech-edge-latency-ping-grid",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Linear HUD",
      "bento-12col",
      "data"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Global Edge Network 12-City Ping Grid designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-tech-sdk-quickstart-cards",
    "part": "feature",
    "name": "Multi-Language SDK Quickstart Cards (iOS/Web/Node)",
    "koreanName": "📦 멀티 언어 SDK 퀵스타트 카드 (iOS/React/Python)",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "각 언어 탭을 누르면 `npm i @core/sdk` 설치 한 줄 명령어와 3줄 초기화 코드가 즉시 복사",
    "wireframeShape": "tech-sdk-quickstart-cards",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Bento Grid 2.0",
      "bento-3col",
      "interactive"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Multi-Language SDK Quickstart Cards (iOS/Web/Node) designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-tech-micro-benchmark-graph",
    "part": "feature",
    "name": "Comparative Micro-Benchmark Latency Bar Graph",
    "koreanName": "📊 비교 마이크로 벤치마크 지연시간 바 그래프",
    "trend": "Linear HUD",
    "gridGeometry": "split-50-50",
    "focalAnchor": "data",
    "density": "compact",
    "description": "초당 트랜잭션(TPS)과 P99 지연시간을 타사 대비 10배 정밀하게 시각화한 테크 바 차트",
    "wireframeShape": "tech-micro-benchmark-graph",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Linear HUD",
      "split-50-50",
      "data"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Comparative Micro-Benchmark Latency Bar Graph designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-story-3col-magazine-grid",
    "part": "feature",
    "name": "3-Column Editorial Magazine Typography Grid",
    "koreanName": "📰 3단 에디토리얼 매거진 타이포 그리드",
    "trend": "Minimalist Editorial",
    "gridGeometry": "bento-3col",
    "focalAnchor": "typo",
    "density": "airy",
    "description": "정통 매거진의 3단 칼럼 구성, 상단 챕터 넘버 [CHAPTER 01], 세련된 이탤릭 세리프 본문",
    "wireframeShape": "story-3col-magazine-grid",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Minimalist Editorial",
      "bento-3col",
      "typo"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 3-Column Editorial Magazine Typography Grid designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-story-pullquote-manifesto",
    "part": "feature",
    "name": "Oversized Manifesto Pull-Quote with Pull-Bar",
    "koreanName": "💬 오버사이즈 매니페스토 풀 쿼트 & 인용 바",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "1col-center",
    "focalAnchor": "typo",
    "density": "airy",
    "description": "“우리는 본질에 집중합니다” 거대한 인용문과 좌측 6px 두꺼운 브랜드 컬러 액센트 바",
    "wireframeShape": "story-pullquote-manifesto",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Swiss & Neo-Brutalist",
      "1col-center",
      "typo"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Oversized Manifesto Pull-Quote with Pull-Bar designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-story-sticky-scroll-chapters",
    "part": "feature",
    "name": "Sticky Left Chapter Title + Scrolling Story Right",
    "koreanName": "📜 스티키 좌측 챕터 타이틀 + 스크롤링 우측 스토리",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-70-30",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "좌측 챕터 번호와 타이틀은 화면에 찰떡같이 고정되고 우측에서 긴 장문의 스토리가 스크롤",
    "wireframeShape": "story-sticky-scroll-chapters",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Asymmetric Split",
      "split-70-30",
      "hybrid"
    ],
    "promptDirectives": {
      "figma": "split-70-30 structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Sticky Left Chapter Title + Scrolling Story Right designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-story-fullbleed-photo-spread",
    "part": "feature",
    "name": "Full-Bleed Photographic Editorial Spread",
    "koreanName": "🖼️ 풀블리드 포토그래픽 에디토리얼 펼침면",
    "trend": "Minimalist Editorial",
    "gridGeometry": "fullbleed-cinematic",
    "focalAnchor": "visual",
    "density": "airy",
    "description": "잡지 양면을 꽉 채운 흑백 건축 사진 위에 얇은 흰색 고딕 서체로 각인된 프로덕트 철학",
    "wireframeShape": "story-fullbleed-photo-spread",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Minimalist Editorial",
      "fullbleed-cinematic",
      "visual"
    ],
    "promptDirectives": {
      "figma": "fullbleed-cinematic structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Full-Bleed Photographic Editorial Spread designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-story-numbered-step-chronicle",
    "part": "feature",
    "name": "Numbered Giant Chronological Step Progression",
    "koreanName": "🔢 넘버링 자이언트 연대기 스텝 연출",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "timeline-vertical",
    "focalAnchor": "typo",
    "density": "compact",
    "description": "01, 02, 03 숫자가 120pt 거대 크기로 배경에 은은히 깔리고 그 위로 각 단계의 도전과 극복",
    "wireframeShape": "story-numbered-step-chronicle",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Swiss & Neo-Brutalist",
      "timeline-vertical",
      "typo"
    ],
    "promptDirectives": {
      "figma": "timeline-vertical structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Numbered Giant Chronological Step Progression designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-story-asymmetric-photo-triplet",
    "part": "feature",
    "name": "Asymmetric Photo Triplet with Overlapping Captions",
    "koreanName": "📸 3단 비대칭 화보 컷 & 캡션 오버랩",
    "trend": "Minimalist Editorial",
    "gridGeometry": "masonry-3col",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "비율이 각기 다른 3장의 스튜디오 컷과 각 컷의 모서리에 겹쳐진 반투명 캡션 설명 카드",
    "wireframeShape": "story-asymmetric-photo-triplet",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Minimalist Editorial",
      "masonry-3col",
      "visual"
    ],
    "promptDirectives": {
      "figma": "masonry-3col structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Asymmetric Photo Triplet with Overlapping Captions designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-story-swiss-hairline-index",
    "part": "feature",
    "name": "Swiss Hairline Categorized Index Table",
    "koreanName": "🗂️ 스위스 헤어라인 카테고리 인덱스 테이블",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "1col-center",
    "focalAnchor": "typo",
    "density": "ultra-dense",
    "description": "0.5px 가로줄로만 구획된 미니멀한 인덱스 테이블에 기능명, 릴리즈 버전, 기여자가 정렬",
    "wireframeShape": "story-swiss-hairline-index",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Swiss & Neo-Brutalist",
      "1col-center",
      "typo"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Swiss Hairline Categorized Index Table designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-story-graphic-quote-trio",
    "part": "feature",
    "name": "Trio Cards with Giant Typography Watermark",
    "koreanName": "🎴 자이언트 타이포 워터마크 3연작 카드",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "bento-3col",
    "focalAnchor": "typo",
    "density": "balanced",
    "description": "SPEED, POWER, SCALE 세 단어가 각 카드의 배경에 초대형 워터마크로 깔린 3연작 카드",
    "wireframeShape": "story-graphic-quote-trio",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Swiss & Neo-Brutalist",
      "bento-3col",
      "typo"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Trio Cards with Giant Typography Watermark designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-story-newspaper-front-page",
    "part": "feature",
    "name": "Front-Page Broadside Column Feature Layout",
    "koreanName": "🗞️ 프론트 페이지 1면 특종 칼럼 레이아웃",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "1col-center",
    "focalAnchor": "typo",
    "density": "ultra-dense",
    "description": "신문 1면처럼 굵은 특종 헤드라인, 날짜 스탬프, 4개 칼럼으로 정교하게 나뉜 텍스트 블록",
    "wireframeShape": "story-newspaper-front-page",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Swiss & Neo-Brutalist",
      "1col-center",
      "typo"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Front-Page Broadside Column Feature Layout designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-story-raw-brutalist-grid-lines",
    "part": "feature",
    "name": "Raw Brutalist Visible Construction Grid Lines",
    "koreanName": "🏗️ 원초적 브루탈리스트 그리드 골조선 노출",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "compact",
    "description": "모든 컴포넌트의 경계선과 여백이 건축 설계도처럼 굵은 검은 선과 좌표로 노출된 구조",
    "wireframeShape": "story-raw-brutalist-grid-lines",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Swiss & Neo-Brutalist",
      "bento-12col",
      "hybrid"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Raw Brutalist Visible Construction Grid Lines designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-hw-tactile-knob-dial",
    "part": "feature",
    "name": "Rotatable Tactile Audio Knob & Decibel Dial",
    "koreanName": "🎚️ 회전형 아날로그 노브 & 데시벨 다이얼",
    "trend": "Spatial 3D & Clay",
    "gridGeometry": "bento-12col",
    "focalAnchor": "interactive",
    "density": "compact",
    "description": "금속 질감의 회전 볼륨 노브를 마우스로 돌리면 우측 LED 데시벨 미터가 실시간 점등",
    "wireframeShape": "hw-tactile-knob-dial",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Spatial 3D & Clay",
      "bento-12col",
      "interactive"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Spatial 3D & Clay visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Rotatable Tactile Audio Knob & Decibel Dial designed in Spatial 3D & Clay aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-hw-mechanical-key-switch",
    "part": "feature",
    "name": "Clickable Mechanical Keyboard Switch Simulator",
    "koreanName": "⌨️ 클릭 가능한 기계식 키보드 스위치 시뮬레이터",
    "trend": "Spatial 3D & Clay",
    "gridGeometry": "split-50-50",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "청축, 적축, 갈축 키캡을 직접 마우스로 눌러보며 타건감과 사운드 파형을 체험하는 위젯",
    "wireframeShape": "hw-mechanical-key-switch",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Spatial 3D & Clay",
      "split-50-50",
      "interactive"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, Spatial 3D & Clay visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Clickable Mechanical Keyboard Switch Simulator designed in Spatial 3D & Clay aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-hw-camera-lens-optics",
    "part": "feature",
    "name": "Multi-Element Camera Lens Optical Cross-Section",
    "koreanName": "📷 멀티 엘리먼트 카메라 렌즈 광학 단면도",
    "trend": "Spatial 3D & Clay",
    "gridGeometry": "split-60-40",
    "focalAnchor": "visual",
    "density": "compact",
    "description": "5중 광학 렌즈의 빛 굴절 경로와 조리개(f/1.4) 수치 변화가 시각화된 테크놀로지 카드",
    "wireframeShape": "hw-camera-lens-optics",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Spatial 3D & Clay",
      "split-60-40",
      "visual"
    ],
    "promptDirectives": {
      "figma": "split-60-40 structure in Figma Auto-Layout, Spatial 3D & Clay visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Multi-Element Camera Lens Optical Cross-Section designed in Spatial 3D & Clay aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-hw-haptic-slider-track",
    "part": "feature",
    "name": "Haptic Notched Step Slider with Resistance",
    "koreanName": "🎛️ 햅틱 눈금 저항 스텝 슬라이더 트랙",
    "trend": "Spatial 3D & Clay",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "10% 단위로 자석처럼 턱턱 걸리는 마그네틱 눈금 저항감을 시각적 바운스로 표현한 슬라이더",
    "wireframeShape": "hw-haptic-slider-track",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Spatial 3D & Clay",
      "1col-center",
      "interactive"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Spatial 3D & Clay visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Haptic Notched Step Slider with Resistance designed in Spatial 3D & Clay aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-hw-thermal-heatmap-distribution",
    "part": "feature",
    "name": "Realtime Thermal Heatmap Dissipation View",
    "koreanName": "🌡️ 실시간 서멀 히트맵 발열 분산 뷰",
    "trend": "Linear HUD",
    "gridGeometry": "split-50-50",
    "focalAnchor": "data",
    "density": "compact",
    "description": "기기 내부 칩셋의 열 분포가 파랑(28°C)에서 주황(42°C)으로 실시간 그라디언트 렌더링",
    "wireframeShape": "hw-thermal-heatmap-distribution",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Linear HUD",
      "split-50-50",
      "data"
    ],
    "promptDirectives": {
      "figma": "split-50-50 structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Realtime Thermal Heatmap Dissipation View designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-hw-magnetic-snap-modules",
    "part": "feature",
    "name": "Modular Magnetic Snapping Block Playground",
    "koreanName": "🧲 마그네틱 모듈 결합 스내핑 플레이그라운드",
    "trend": "Spatial 3D & Clay",
    "gridGeometry": "bento-asymmetric",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "배터리 팩, 스피커, 카메라 모듈을 자석처럼 가까이 가져가면 찰칵 붙는 애니메이션",
    "wireframeShape": "hw-magnetic-snap-modules",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Spatial 3D & Clay",
      "bento-asymmetric",
      "interactive"
    ],
    "promptDirectives": {
      "figma": "bento-asymmetric structure in Figma Auto-Layout, Spatial 3D & Clay visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Modular Magnetic Snapping Block Playground designed in Spatial 3D & Clay aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-hw-calibrated-gauge-meter",
    "part": "feature",
    "name": "Analog Needle Calibrated Gauge Meter",
    "koreanName": "⏱️ 아날로그 바늘 계측기 & 정밀 게이지",
    "trend": "Spatial 3D & Clay",
    "gridGeometry": "bento-3col",
    "focalAnchor": "data",
    "density": "compact",
    "description": "크롬 테두리와 눈금자 위에서 실제 바늘이 부드럽게 감속하며 토크/속도를 가리키는 미터",
    "wireframeShape": "hw-calibrated-gauge-meter",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Spatial 3D & Clay",
      "bento-3col",
      "data"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Spatial 3D & Clay visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Analog Needle Calibrated Gauge Meter designed in Spatial 3D & Clay aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-hw-micro-chip-pinout",
    "part": "feature",
    "name": "Nanometer Micro-Chip Architecture Pinout Map",
    "koreanName": "🔬 나노미터 마이크로칩 핀아웃 아키텍처 맵",
    "trend": "Linear HUD",
    "gridGeometry": "split-70-30",
    "focalAnchor": "data",
    "density": "ultra-dense",
    "description": "실리콘 다이 속 수백만 개의 트랜지스터 핀 배치와 버스 대역폭(128GB/s) 통신선 레이아웃",
    "wireframeShape": "hw-micro-chip-pinout",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Linear HUD",
      "split-70-30",
      "data"
    ],
    "promptDirectives": {
      "figma": "split-70-30 structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Nanometer Micro-Chip Architecture Pinout Map designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-hw-liquid-cooling-flow",
    "part": "feature",
    "name": "Interactive Liquid Cooling Loop Pipe Flow",
    "koreanName": "🧪 인터랙티브 수랭 쿨링 파이프 유류 흐름",
    "trend": "Liquid Glass",
    "gridGeometry": "bento-12col",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "투명한 냉각수 파이프 속으로 푸른색 냉매 입자가 흐르며 열을 식히는 생생한 동적 루프",
    "wireframeShape": "hw-liquid-cooling-flow",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Liquid Glass",
      "bento-12col",
      "visual"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Interactive Liquid Cooling Loop Pipe Flow designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "feature-hw-led-matrix-billboard",
    "part": "feature",
    "name": "Programmable LED Dot-Matrix Pixel Billboard",
    "koreanName": "💡 프로그래머블 LED 도트 매트릭스 전광판",
    "trend": "Linear HUD",
    "gridGeometry": "1col-center",
    "focalAnchor": "visual",
    "density": "compact",
    "description": "가로 64 x 세로 16개의 초록색 픽셀 LED 전광판에 원하는 텍스트가 도트 폰트로 흘러감",
    "wireframeShape": "hw-led-matrix-billboard",
    "keyFeatures": [
      "고유 모듈러 그리드",
      "인터랙션 피드백",
      "Figma 컴포넌트 변환"
    ],
    "tags": [
      "Linear HUD",
      "1col-center",
      "visual"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Programmable LED Dot-Matrix Pixel Billboard designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-kpi-bloomberg-4counter",
    "part": "proof",
    "name": "Bloomberg 4-Counter Financial Metric Tape",
    "koreanName": "📊 블룸버그 4단 금융 지표 티커 테이프",
    "trend": "Linear HUD",
    "gridGeometry": "bento-12col",
    "focalAnchor": "data",
    "density": "ultra-dense",
    "description": "4개의 거대 금융 지표가 24시간 실시간 롤링되는 고밀도 전광판",
    "wireframeShape": "kpi-bloomberg-4counter",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Bloomberg 4-Counter Financial Metric Tape designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-kpi-giant-stat-trend",
    "part": "proof",
    "name": "Giant Single KPI Hero Counter with Trend Arrow",
    "koreanName": "📈 자이언트 단일 KPI 카운터 & 상승 화살표",
    "trend": "Linear HUD",
    "gridGeometry": "bento-12col",
    "focalAnchor": "data",
    "density": "ultra-dense",
    "description": "120pt 초대형 볼드 숫자와 전월 대비 +320% 녹색 배지가 시선을 압도하는 레이아웃",
    "wireframeShape": "kpi-giant-stat-trend",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Giant Single KPI Hero Counter with Trend Arrow designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-kpi-multi-currency-spark",
    "part": "proof",
    "name": "Multi-Currency Revenue Sparkline Grid",
    "koreanName": "💱 다통화 매출 스파크라인 그리드 (USD/EUR/KRW)",
    "trend": "Linear HUD",
    "gridGeometry": "bento-12col",
    "focalAnchor": "data",
    "density": "ultra-dense",
    "description": "각 통화별 실시간 환율과 분기 매출 추이가 미세 꺾은선으로 배열된 카드",
    "wireframeShape": "kpi-multi-currency-spark",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Multi-Currency Revenue Sparkline Grid designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-kpi-uptime-sla-board",
    "part": "proof",
    "name": "99.999% Zero-Downtime SLA Status Monitor",
    "koreanName": "🟢 99.999% 무중단 SLA 가동률 모니터",
    "trend": "Linear HUD",
    "gridGeometry": "bento-12col",
    "focalAnchor": "data",
    "density": "ultra-dense",
    "description": "최근 90일간의 서비스 가동 상태가 녹색 사각 블록 막대로 완벽히 채워진 보드",
    "wireframeShape": "kpi-uptime-sla-board",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 99.999% Zero-Downtime SLA Status Monitor designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-kpi-active-pulse-counter",
    "part": "proof",
    "name": "Live Concurrent Active Users Glowing Pulse Dot",
    "koreanName": "👥 실시간 동시 접속자 수 발광 펄스 카운터",
    "trend": "Linear HUD",
    "gridGeometry": "bento-12col",
    "focalAnchor": "data",
    "density": "ultra-dense",
    "description": "초록색 실시간 점멸 라이트와 함께 38,492명이 1초마다 갱신되는 위젯",
    "wireframeShape": "kpi-active-pulse-counter",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Live Concurrent Active Users Glowing Pulse Dot designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-kpi-speed-multiplier-10x",
    "part": "proof",
    "name": "10x Speed Multiplier Benchmark Accelerator",
    "koreanName": "⚡ 10배 속도 가속 벤치마크 배지",
    "trend": "Linear HUD",
    "gridGeometry": "bento-12col",
    "focalAnchor": "data",
    "density": "ultra-dense",
    "description": "기존 솔루션 1배속 대비 10배 빠른 터보 게이지 바가 채워지는 가속도 지표",
    "wireframeShape": "kpi-speed-multiplier-10x",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 10x Speed Multiplier Benchmark Accelerator designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-kpi-roi-payback-clock",
    "part": "proof",
    "name": "3.2 Months Fast ROI Payback Milestone",
    "koreanName": "⏳ 3.2개월 초고속 ROI 투자 회수 마일스톤",
    "trend": "Linear HUD",
    "gridGeometry": "bento-12col",
    "focalAnchor": "data",
    "density": "ultra-dense",
    "description": "도입 후 투자금을 회수하는 데 걸린 평균 개월 수(3.2 Mo)를 시각화한 원형 게이지",
    "wireframeShape": "kpi-roi-payback-clock",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 3.2 Months Fast ROI Payback Milestone designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-kpi-security-audit-score",
    "part": "proof",
    "name": "100/100 Perfect Security Audit Ring",
    "koreanName": "🛡️ 100/100 만점 보안 감사 점수 링",
    "trend": "Linear HUD",
    "gridGeometry": "bento-12col",
    "focalAnchor": "data",
    "density": "ultra-dense",
    "description": "글로벌 보안 취약점 점검 100점 만점 원형 도넛 링과 무결성 인증 태그",
    "wireframeShape": "kpi-security-audit-score",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 100/100 Perfect Security Audit Ring designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-kpi-global-tps-odometer",
    "part": "proof",
    "name": "Global Daily Transactions Odometer Meter",
    "koreanName": "💳 일일 글로벌 트랜잭션 롤러 계기판",
    "trend": "Linear HUD",
    "gridGeometry": "bento-12col",
    "focalAnchor": "data",
    "density": "ultra-dense",
    "description": "누적 처리 건수가 자동차 주행거리계처럼 찰칵거리며 넘어가는 키네틱 롤러",
    "wireframeShape": "kpi-global-tps-odometer",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Global Daily Transactions Odometer Meter designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-kpi-carbon-offset-green",
    "part": "proof",
    "name": "Carbon Emission -84% Green Eco Metric",
    "koreanName": "🌱 탄소 배출 -84% 친환경 에코 메트릭",
    "trend": "Linear HUD",
    "gridGeometry": "bento-12col",
    "focalAnchor": "data",
    "density": "ultra-dense",
    "description": "에너지 절감량과 탄소 발자국 감축 통계를 자연의 올리브 그린 톤으로 표현",
    "wireframeShape": "kpi-carbon-offset-green",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Carbon Emission -84% Green Eco Metric designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-kpi-customer-retention-gauge",
    "part": "proof",
    "name": "98.4% Exceptional Customer Retention Gauge",
    "koreanName": "🧲 98.4% 경이적 고객 유지율(Retention) 게이지",
    "trend": "Linear HUD",
    "gridGeometry": "bento-12col",
    "focalAnchor": "data",
    "density": "ultra-dense",
    "description": "이탈률 1.6% 미만의 압도적인 고객 충성도를 보여주는 반원형 아날로그 게이지",
    "wireframeShape": "kpi-customer-retention-gauge",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 98.4% Exceptional Customer Retention Gauge designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-kpi-cloud-cost-cut-half",
    "part": "proof",
    "name": "52% Direct Cloud Cost Reduction Metric",
    "koreanName": "💰 52% 클라우드 비용 절감 실증 지표",
    "trend": "Linear HUD",
    "gridGeometry": "bento-12col",
    "focalAnchor": "data",
    "density": "ultra-dense",
    "description": "AWS/GCP 인프라 비용이 절반 이하로 급감한 전후 비교 바 차트 지표",
    "wireframeShape": "kpi-cloud-cost-cut-half",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 52% Direct Cloud Cost Reduction Metric designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-kpi-net-promoter-score",
    "part": "proof",
    "name": "NPS +78 World-Class Promoter Score",
    "koreanName": "⭐ NPS +78 월드클래스 추천 고객 지수",
    "trend": "Linear HUD",
    "gridGeometry": "bento-12col",
    "focalAnchor": "data",
    "density": "ultra-dense",
    "description": "애플, 테슬라급 고객 만족도를 나타내는 +78 NPS 추천 스코어 카드",
    "wireframeShape": "kpi-net-promoter-score",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: NPS +78 World-Class Promoter Score designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-review-twitter-verified-feed",
    "part": "proof",
    "name": "Twitter/X Verified Influencer Post Feed",
    "koreanName": "🐦 트위터/X 인증 인플루언서 포스트 피드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "masonry-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "파란색 공식 인증 배지, 좋아요 수, 리트윗 수가 달린 3단 소셜 카드",
    "wireframeShape": "review-twitter-verified-feed",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "masonry-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Twitter/X Verified Influencer Post Feed designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-review-3row-marquee-wall",
    "part": "proof",
    "name": "3-Row Infinite Smooth Testimonial Marquee",
    "koreanName": "🌊 3열 무한 스크롤 고객 찬사 마퀴 월",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "masonry-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "좌우로 엇갈려 끊임없이 흘러가는 수십 명 고객의 진솔한 한 줄 후기 마퀴",
    "wireframeShape": "review-3row-marquee-wall",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "masonry-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 3-Row Infinite Smooth Testimonial Marquee designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-review-video-shorts-reel",
    "part": "proof",
    "name": "Vertical 9:16 Video Shorts Testimonial Cards",
    "koreanName": "📱 9:16 세로 쇼츠 비디오 인터뷰 릴",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "masonry-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "실제 고객이 스마트폰으로 말하는 15초 인터뷰 영상 썸네일과 재생 버튼",
    "wireframeShape": "review-video-shorts-reel",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "masonry-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Vertical 9:16 Video Shorts Testimonial Cards designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-review-star-rating-summary",
    "part": "proof",
    "name": "4.9/5 Stars Aggregate Score with Breakdown Bar",
    "koreanName": "⭐ 4.9/5 총점 종합 & 5성급 비율 분포 바",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "masonry-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "총 리뷰 8,420개의 평점 4.9점과 5점 만점 비율(94%) 수평 분포도",
    "wireframeShape": "review-star-rating-summary",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "masonry-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 4.9/5 Stars Aggregate Score with Breakdown Bar designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-review-ceo-pullquote-portrait",
    "part": "proof",
    "name": "Enterprise CEO Pull-Quote with Studio Portrait",
    "koreanName": "👔 엔터프라이즈 대표 스튜디오 인물 인용구",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "masonry-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "포춘 500대 기업 대표의 흑백 스튜디오 프로필 사진과 굵직한 추천사",
    "wireframeShape": "review-ceo-pullquote-portrait",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "masonry-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Enterprise CEO Pull-Quote with Studio Portrait designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-review-g2-crowd-leader-grid",
    "part": "proof",
    "name": "G2 Crowd & Capterra Winter 2026 Leader Grid",
    "koreanName": "🏆 G2 크라우드 2026 윈터 리더 배지 그리드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "masonry-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "소프트웨어 리뷰 플랫폼 G2에서 최고 등급을 획득한 8개 공식 배지 클러스터",
    "wireframeShape": "review-g2-crowd-leader-grid",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "masonry-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: G2 Crowd & Capterra Winter 2026 Leader Grid designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-review-audio-snippet-player",
    "part": "proof",
    "name": "Voice of Customer 20-Sec Audio Snippet Player",
    "koreanName": "🎧 고객 육성 20초 오디오 스니펫 플레이어",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "masonry-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "생생한 육성 후기를 들어볼 수 있는 미니 파형 재생 바와 자막 동기화",
    "wireframeShape": "review-audio-snippet-player",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "masonry-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Voice of Customer 20-Sec Audio Snippet Player designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-review-trustpilot-5star-cards",
    "part": "proof",
    "name": "Trustpilot Verified 5-Star Transparent Cards",
    "koreanName": "🌟 트러스트파일럿 인증 5성급 투명 카드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "masonry-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "초록색 트러스트파일럿 별점과 실제 구매 영수증 인증 태그가 달린 카드",
    "wireframeShape": "review-trustpilot-5star-cards",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "masonry-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Trustpilot Verified 5-Star Transparent Cards designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-review-chat-bubble-dialogue",
    "part": "proof",
    "name": "Customer Success Slack Chat Dialogue Stream",
    "koreanName": "💬 고객 감동 슬랙 챗 대화 스트림",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "masonry-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "“정말 감사합니다, 업무 시간이 3시간 줄었어요!” 슬랙 대화창 캡처 메타포",
    "wireframeShape": "review-chat-bubble-dialogue",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "masonry-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Customer Success Slack Chat Dialogue Stream designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-review-masonry-story-cards",
    "part": "proof",
    "name": "Masonry Multi-Height Customer Experience Cards",
    "koreanName": "🧱 메이슨리 다단 고객 경험 스토리 카드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "masonry-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "사진이 포함된 장문 리뷰와 단문 리뷰가 핀터레스트처럼 유연하게 정렬",
    "wireframeShape": "review-masonry-story-cards",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "masonry-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Masonry Multi-Height Customer Experience Cards designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-review-before-after-interview",
    "part": "proof",
    "name": "Problem vs Transformation Customer Story",
    "koreanName": "🔄 도입 전 고통 vs 도입 후 환호 2단 스토리",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "masonry-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "야근에 시달리던 팀이 정시 퇴근하게 된 구체적 전후 일화 인터뷰",
    "wireframeShape": "review-before-after-interview",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "masonry-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Problem vs Transformation Customer Story designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-review-highlighted-yellow-quotes",
    "part": "proof",
    "name": "Neon Yellow Highlighted Key Phrase Quotes",
    "koreanName": "🖍️ 형광펜 하이라이트 핵심 문구 인용 카드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "masonry-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "“가장 완벽한 선택이었습니다” 핵심 문장에 노란 형광펜 밑줄이 그어진 카드",
    "wireframeShape": "review-highlighted-yellow-quotes",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "masonry-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Neon Yellow Highlighted Key Phrase Quotes designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-review-community-discord-wall",
    "part": "proof",
    "name": "Discord 50k Member Reaction Wall",
    "koreanName": "👾 디스코드 5만 커뮤니티 이모지 반응 월",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "masonry-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "디스코드 채널에서 개발자들이 🔥, 🚀, ❤️ 이모지를 폭발적으로 누른 반응",
    "wireframeShape": "review-community-discord-wall",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "masonry-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Discord 50k Member Reaction Wall designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-logo-monochrome-ticker",
    "part": "proof",
    "name": "Monochrome Grayscale Infinite Partner Marquee",
    "koreanName": "🏢 무채색 그레이스케일 무한 파트너 마퀴",
    "trend": "Minimalist Editorial",
    "gridGeometry": "marquee-ticker",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "로고 본연의 색을 정제된 그레이로 통일하여 고급스럽게 흐르는 1단 티커",
    "wireframeShape": "logo-monochrome-ticker",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "marquee-ticker structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Monochrome Grayscale Infinite Partner Marquee designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-logo-2x6-hover-color-pop",
    "part": "proof",
    "name": "2x6 Enterprise Grid with Hover Color Pop",
    "koreanName": "🎨 2x6 엔터프라이즈 그리드 (호버 시 컬러 전환)",
    "trend": "Minimalist Editorial",
    "gridGeometry": "marquee-ticker",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "평소엔 은은한 흑백 로고가 마우스 호버 시 본래 브랜드 컬러로 활성화",
    "wireframeShape": "logo-2x6-hover-color-pop",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "marquee-ticker structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 2x6 Enterprise Grid with Hover Color Pop designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-logo-category-tabs-fintech",
    "part": "proof",
    "name": "Industry Category Tabbed Logo Showcase",
    "koreanName": "📑 산업군별(핀테크/커머스/AI) 탭 구분 로고",
    "trend": "Minimalist Editorial",
    "gridGeometry": "marquee-ticker",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "금융, 제조, 이커머스 등 산업 분야별 탭을 눌러 해당 고객사 로고를 확인",
    "wireframeShape": "logo-category-tabs-fintech",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "marquee-ticker structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Industry Category Tabbed Logo Showcase designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-logo-press-featured-bar",
    "part": "proof",
    "name": "“Featured on TechCrunch, Forbes & Wired”",
    "koreanName": "📰 “TechCrunch, 포브스, 와이어드 보도” 프레스 바",
    "trend": "Minimalist Editorial",
    "gridGeometry": "marquee-ticker",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "공신력 있는 글로벌 6대 IT 미디어의 헤드라인 인용구와 매체 로고",
    "wireframeShape": "logo-press-featured-bar",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "marquee-ticker structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: “Featured on TechCrunch, Forbes & Wired” designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-logo-investor-backers-cluster",
    "part": "proof",
    "name": "Backed by Tier-1 Silicon Valley VCs",
    "koreanName": "🦄 실리콘밸리 톱티어 VC 투자사 클러스터",
    "trend": "Minimalist Editorial",
    "gridGeometry": "marquee-ticker",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "Y Combinator, a16z, 세콰이어 등 글로벌 최고의 투자사 로고 집합",
    "wireframeShape": "logo-investor-backers-cluster",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "marquee-ticker structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Backed by Tier-1 Silicon Valley VCs designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-logo-fortune-500-badge",
    "part": "proof",
    "name": "Trusted by 42% of Fortune 500 Companies",
    "koreanName": "🌐 포춘 500대 기업의 42%가 선택한 플랫폼",
    "trend": "Minimalist Editorial",
    "gridGeometry": "marquee-ticker",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "신뢰도를 숫자로 증명하는 통계 헤드라인과 대표 기업 8사 엠블럼",
    "wireframeShape": "logo-fortune-500-badge",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "marquee-ticker structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Trusted by 42% of Fortune 500 Companies designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-logo-open-source-contributors",
    "part": "proof",
    "name": "Over 1,200 Open-Source GitHub Contributors",
    "koreanName": "🐙 1,200명 오픈소스 기여자 아바타 모자이크",
    "trend": "Minimalist Editorial",
    "gridGeometry": "marquee-ticker",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "깃허브 스타 20k를 기록한 전 세계 개발자 기여자들의 미니 프로필 사진",
    "wireframeShape": "logo-open-source-contributors",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "marquee-ticker structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Over 1,200 Open-Source GitHub Contributors designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-logo-academic-research-labs",
    "part": "proof",
    "name": "Partnered with MIT, Stanford & KAIST Labs",
    "koreanName": "🏛️ MIT, 스탠퍼드, 카이스트 연구실 협력",
    "trend": "Minimalist Editorial",
    "gridGeometry": "marquee-ticker",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "세계 최고 연구 기관 및 대학 랩실과의 산학 협력 연구 증명 배지",
    "wireframeShape": "logo-academic-research-labs",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "marquee-ticker structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Partnered with MIT, Stanford & KAIST Labs designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-logo-cert-security-shield",
    "part": "proof",
    "name": "Global Official Security Certification Badges",
    "koreanName": "🛡️ 글로벌 공인 보안 인증 마크 실드",
    "trend": "Minimalist Editorial",
    "gridGeometry": "marquee-ticker",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "ISO 27001, SOC2, HIPAA, GDPR 공식 마크가 금속 뱃지처럼 진열",
    "wireframeShape": "logo-cert-security-shield",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "marquee-ticker structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Global Official Security Certification Badges designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-logo-hairline-divided-strip",
    "part": "proof",
    "name": "Swiss Hairline Divided 6-Logo Strip",
    "koreanName": "📏 스위스 헤어라인 6-로고 슬림 스트립",
    "trend": "Minimalist Editorial",
    "gridGeometry": "marquee-ticker",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "0.5px 얇은 세로선으로 정갈하게 나뉜 미니멀 1열 로고 스트립",
    "wireframeShape": "logo-hairline-divided-strip",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "marquee-ticker structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Swiss Hairline Divided 6-Logo Strip designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-logo-counter-case-links",
    "part": "proof",
    "name": "Logo Badges with One-Click Case Study Links",
    "koreanName": "🔗 성공 사례 바로가기 링크 일체형 로고",
    "trend": "Minimalist Editorial",
    "gridGeometry": "marquee-ticker",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "로고를 클릭하면 해당 고객사의 5분 심층 사례 PDF로 즉시 연결",
    "wireframeShape": "logo-counter-case-links",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "marquee-ticker structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Logo Badges with One-Click Case Study Links designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-logo-glowing-ambient-aurora",
    "part": "proof",
    "name": "Aurora Ambient Glow Behind Partner Logos",
    "koreanName": "🌌 파트너 로고 뒤 오로라 앰비언트 발광",
    "trend": "Minimalist Editorial",
    "gridGeometry": "marquee-ticker",
    "focalAnchor": "visual",
    "density": "balanced",
    "description": "로고 모음 뒷배경에 은은한 오로라 빛이 아른거리며 품격을 높여주는 연출",
    "wireframeShape": "logo-glowing-ambient-aurora",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "marquee-ticker structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Aurora Ambient Glow Behind Partner Logos designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-security-soc2-type2-card",
    "part": "proof",
    "name": "SOC2 Type II Certified Official Compliance Card",
    "koreanName": "🔒 SOC2 Type II 공식 보안 감사 인증 카드",
    "trend": "Liquid Glass",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "국제 회계법인의 엄격한 보안 통제 감사를 100% 통과했음을 증명하는 서류",
    "wireframeShape": "security-soc2-type2-card",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: SOC2 Type II Certified Official Compliance Card designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-security-iso-27001-badge",
    "part": "proof",
    "name": "ISO/IEC 27001 Information Security Standard",
    "koreanName": "📜 ISO 27001 정보보안 경영시스템 국제 표준",
    "trend": "Liquid Glass",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "글로벌 정보보호 관리체계 인증 번호와 유효 기간이 각인된 공식 인증서",
    "wireframeShape": "security-iso-27001-badge",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: ISO/IEC 27001 Information Security Standard designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-security-gdpr-hipaa-shield",
    "part": "proof",
    "name": "GDPR & HIPAA Medical Grade Privacy Shield",
    "koreanName": "🩺 GDPR & HIPAA 의료 등급 개인정보 보호 실드",
    "trend": "Liquid Glass",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "환자 의료 데이터 및 유럽 시민권자 데이터를 완벽히 보호하는 암호화 보증",
    "wireframeShape": "security-gdpr-hipaa-shield",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: GDPR & HIPAA Medical Grade Privacy Shield designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-security-bank-grade-aes256",
    "part": "proof",
    "name": "Bank-Grade AES-256 Bit End-to-End Encryption",
    "koreanName": "🏦 금융권 수준 AES-256비트 종단간 암호화",
    "trend": "Liquid Glass",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "전송 중 데이터와 저장 데이터 모두 군사 등급으로 암호화됨을 알리는 배너",
    "wireframeShape": "security-bank-grade-aes256",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Bank-Grade AES-256 Bit End-to-End Encryption designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-security-pentest-audit-report",
    "part": "proof",
    "name": "Quarterly Penetration Test Clean Report Card",
    "koreanName": "🕵️ 분기별 침투 모의해킹 취약점 무결점 리포트",
    "trend": "Liquid Glass",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "전문 화이트해커 집단의 최신 모의 침투 테스트 통과 요약 리포트",
    "wireframeShape": "security-pentest-audit-report",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Quarterly Penetration Test Clean Report Card designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-security-24-7-sla-guarantee",
    "part": "proof",
    "name": "24/7/365 Dedicated Enterprise Support SLA",
    "koreanName": "🚨 24/7/365 전담 엔터프라이즈 엔지니어 SLA",
    "trend": "Liquid Glass",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "장애 발생 시 15분 이내 응답을 보증하는 1:1 전담 서포트 채널 보증서",
    "wireframeShape": "security-24-7-sla-guarantee",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 24/7/365 Dedicated Enterprise Support SLA designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-security-zero-trust-architecture",
    "part": "proof",
    "name": "Zero-Trust Perimeter-Less Security Architecture",
    "koreanName": "🛡️ 제로 트러스트(Zero-Trust) 무경계 보안 아키텍처",
    "trend": "Liquid Glass",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "단 한 건의 비인가 접근도 허용하지 않는 현대적 제로 트러스트 흐름도",
    "wireframeShape": "security-zero-trust-architecture",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Zero-Trust Perimeter-Less Security Architecture designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-security-bug-bounty-hackerone",
    "part": "proof",
    "name": "HackerOne Official Bug Bounty Program",
    "koreanName": "🐞 해커원 공식 버그 바운티 포상 프로그램",
    "trend": "Liquid Glass",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "전 세계 보안 연구원들에게 취약점 제보 포상금을 지급하는 투명성 증명",
    "wireframeShape": "security-bug-bounty-hackerone",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: HackerOne Official Bug Bounty Program designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-security-data-residency-map",
    "part": "proof",
    "name": "Multi-Region Data Residency & Sovereignty",
    "koreanName": "🗺️ 멀티 리전 데이터 주권 및 현지 보관 보장",
    "trend": "Liquid Glass",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "한국, 미국, EU 등 고객이 원하는 국가의 서버에만 데이터를 보관",
    "wireframeShape": "security-data-residency-map",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Multi-Region Data Residency & Sovereignty designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-security-statuspage-incident",
    "part": "proof",
    "name": "Transparent StatusPage Live Incident History",
    "koreanName": "📊 투명한 실시간 장애 이력 스테이터스 페이지",
    "trend": "Liquid Glass",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "숨김없이 투명하게 공개되는 최근 1년간의 서버 장애 이력 및 복구 시간",
    "wireframeShape": "security-statuspage-incident",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Transparent StatusPage Live Incident History designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-security-nda-enterprise-contract",
    "part": "proof",
    "name": "Enterprise Grade Custom NDA & Contract Terms",
    "koreanName": "📝 맞춤형 비밀유지계약(NDA) 및 엔터프라이즈 계약",
    "trend": "Liquid Glass",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "대기업 법무팀의 까다로운 특약 조건을 100% 수용 가능한 유연한 계약 체계",
    "wireframeShape": "security-nda-enterprise-contract",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Enterprise Grade Custom NDA & Contract Terms designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-security-sbom-license-audit",
    "part": "proof",
    "name": "Software Bill of Materials (SBOM) Verified",
    "koreanName": "📦 소프트웨어 자재명세서(SBOM) 오픈소스 검증",
    "trend": "Liquid Glass",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "모든 종속성 패키지의 라이선스 위반 및 보안 취약점을 사전 검증 완료",
    "wireframeShape": "security-sbom-license-audit",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Software Bill of Materials (SBOM) Verified designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-casestudy-fintech-transformation",
    "part": "proof",
    "name": "Fintech Giant: 4.8x Efficiency Transformation",
    "koreanName": "🚀 글로벌 핀테크: 업무 효율 4.8배 폭발적 혁신",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-60-40",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "기존 수작업 대사 업무를 자동화하여 월 1,200시간을 절감한 대표 사례",
    "wireframeShape": "casestudy-fintech-transformation",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "split-60-40 structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Fintech Giant: 4.8x Efficiency Transformation designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-casestudy-ecommerce-scale",
    "part": "proof",
    "name": "E-Commerce: Black Friday 120,000 TPS Withstood",
    "koreanName": "🛍️ 이커머스: 블랙프라이데이 12만 TPS 무장애 달성",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-60-40",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "트래픽 폭주 상황에서도 지연시간 18ms를 유지하며 서버 다운 제로 기록",
    "wireframeShape": "casestudy-ecommerce-scale",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "split-60-40 structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: E-Commerce: Black Friday 120,000 TPS Withstood designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-casestudy-healthcare-ai",
    "part": "proof",
    "name": "University Hospital: 99.4% Diagnosis Assistance",
    "koreanName": "🏥 대학병원: 99.4% 정확도의 AI 진단 보조 시스템",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-60-40",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "의료진의 판독 피로도를 60% 낮춘 임상 실험 결과와 의사 인터뷰",
    "wireframeShape": "casestudy-healthcare-ai",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "split-60-40 structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: University Hospital: 99.4% Diagnosis Assistance designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-casestudy-edutech-growth",
    "part": "proof",
    "name": "EdTech Startup: From 10k to 1M Users in 6 Months",
    "koreanName": "📚 에듀테크: 6개월 만에 1만에서 100만 유저 급성장",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-60-40",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "서버 증설 비용 없이 클라우드 아키텍처 최적화로 일궈낸 급성장 일화",
    "wireframeShape": "casestudy-edutech-growth",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "split-60-40 structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: EdTech Startup: From 10k to 1M Users in 6 Months designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-casestudy-saas-churn-reduction",
    "part": "proof",
    "name": "B2B SaaS: Churn Dropped from 8.2% to 1.1%",
    "koreanName": "📉 B2B SaaS: 이탈률 8.2%에서 1.1%로 기적적 개선",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-60-40",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "온보딩 인터랙션 개선만으로 고객 유지율을 7배 끌어올린 심층 분석",
    "wireframeShape": "casestudy-saas-churn-reduction",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "split-60-40 structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: B2B SaaS: Churn Dropped from 8.2% to 1.1% designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-casestudy-global-logistics-iot",
    "part": "proof",
    "name": "Global Shipping: Realtime Tracking of 500k Vessels",
    "koreanName": "🚢 해운 물류: 전 세계 50만 척 선박 실시간 IoT 관제",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-60-40",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "위성 통신 레이턴시를 극복하고 글로벌 해상 물류를 시각화한 프로젝트",
    "wireframeShape": "casestudy-global-logistics-iot",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "split-60-40 structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Global Shipping: Realtime Tracking of 500k Vessels designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-casestudy-problem-solution-outcome",
    "part": "proof",
    "name": "3-Part Card: The Challenge, The Solution, The Impact",
    "koreanName": "🧩 3단계 완벽 구조: 난관, 솔루션, 정량적 성과",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-60-40",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "문제-해결-결과의 표준적이고 명쾌한 3단 스토리보드로 신뢰감 형성",
    "wireframeShape": "casestudy-problem-solution-outcome",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "split-60-40 structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 3-Part Card: The Challenge, The Solution, The Impact designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-casestudy-video-walkthrough-modal",
    "part": "proof",
    "name": "5-Minute Deep Dive Video Walkthrough Modal",
    "koreanName": "🎬 5분 고객사 현장 심층 인터뷰 영상 팝업",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-60-40",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "개발 총괄 이사가 직접 아키텍처 화면을 띄워놓고 설명하는 고화질 영상",
    "wireframeShape": "casestudy-video-walkthrough-modal",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "split-60-40 structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 5-Minute Deep Dive Video Walkthrough Modal designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-casestudy-milestone-growth-chart",
    "part": "proof",
    "name": "3-Year Milestone Journey Growth Line Chart",
    "koreanName": "📈 3개년 동반 성장 마일스톤 누적 그래프",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-60-40",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "시드 투자부터 시리즈 C까지 당사 솔루션과 함께 성장한 고객사의 여정",
    "wireframeShape": "casestudy-milestone-growth-chart",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "split-60-40 structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 3-Year Milestone Journey Growth Line Chart designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-casestudy-trophy-awards-showcase",
    "part": "proof",
    "name": "Global Innovation Design & Tech Trophy Showcase",
    "koreanName": "🏆 글로벌 혁신 테크 & 디자인 어워드 수상작",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-60-40",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "CES 혁신상, iF 디자인 어워드, Red Dot 본상을 수상한 기술력 입증",
    "wireframeShape": "casestudy-trophy-awards-showcase",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "split-60-40 structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Global Innovation Design & Tech Trophy Showcase designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-casestudy-patent-grant-display",
    "part": "proof",
    "name": "18 Granted Global Patents & Technology Rights",
    "koreanName": "📜 18건의 등록 완료된 글로벌 특허 기술권",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-60-40",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "독자적인 AI 압축 알고리즘과 보안 프로토콜 특허 번호 목록 전시",
    "wireframeShape": "casestudy-patent-grant-display",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "split-60-40 structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 18 Granted Global Patents & Technology Rights designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "proof-casestudy-founder-letter-promise",
    "part": "proof",
    "name": "Personal Letter & Commitment from the Founder",
    "koreanName": "✉️ 창업자의 자필 서명과 철학이 담긴 약속",
    "trend": "Asymmetric Split",
    "gridGeometry": "split-60-40",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "“우리는 고객의 성공 전까지 멈추지 않습니다” 창업팀의 진정성 있는 편지",
    "wireframeShape": "casestudy-founder-letter-promise",
    "keyFeatures": [
      "압도적 정량 지표",
      "고객 신뢰도 검증",
      "원클릭 증빙 연동"
    ],
    "tags": [
      "Social Proof",
      "Trust",
      "Credibility"
    ],
    "promptDirectives": {
      "figma": "split-60-40 structure in Figma Auto-Layout, Asymmetric Split visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Personal Letter & Commitment from the Founder designed in Asymmetric Split aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-3tier-popular-neon-glow",
    "part": "pricing",
    "name": "Center Card Highlighted with Neon Laser Glow",
    "koreanName": "🌟 중앙 프로 플랜 네온 레이저 발광 하이라이트",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "가장 인기 있는 가운데 카드가 위로 16px 솟아오르고 네온 에메랄드 테두리로 발광하는 정석 3단",
    "wireframeShape": "3tier-popular-neon-glow",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Center Card Highlighted with Neon Laser Glow designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-3tier-frosted-glass-depth",
    "part": "pricing",
    "name": "Frosted Glass 3-Tier with Variable Blur Depth",
    "koreanName": "❄️ 투명도 단차 프로스티드 글래스 3단 카드",
    "trend": "Liquid Glass",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "스타터는 10px 블러, 프로는 30px 블러, 엔터프라이즈는 60px 딥 블러로 깊이감을 차등 부여",
    "wireframeShape": "3tier-frosted-glass-depth",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Frosted Glass 3-Tier with Variable Blur Depth designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-3tier-swiss-hairline-minimal",
    "part": "pricing",
    "name": "Swiss Monochrome Hairline 3-Tier Pricing",
    "koreanName": "📏 스위스 흑백 헤어라인 미니멀 3단 요금제",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "어떠한 화려한 색도 배제하고 0.5px 정밀한 외곽선과 단정한 폰트 크기만으로 위계를 세운 구성",
    "wireframeShape": "3tier-swiss-hairline-minimal",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Swiss Monochrome Hairline 3-Tier Pricing designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-3tier-neo-brutalist-shadow",
    "part": "pricing",
    "name": "Neo-Brutalist 3-Tier with Hard Drop Shadow",
    "koreanName": "🧱 네오 브루탈리스트 4px 하드 섀도우 3단",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "두꺼운 3px 검은 외곽선과 그림자 번짐 없는 6px 하드 블랙 섀도우가 경쾌한 주목성을 부여",
    "wireframeShape": "3tier-neo-brutalist-shadow",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Neo-Brutalist 3-Tier with Hard Drop Shadow designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-3tier-oled-laser-matrix",
    "part": "pricing",
    "name": "OLED Dark Mode 3-Tier with Cyan Hairline",
    "koreanName": "🌌 OLED 딥블랙 & 사이언 레이저 3단 요금제",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "트루블랙(#000) 배경 위에 전기빛 사이언과 마젠타 얇은 레이저 선이 카드를 감싸는 하이테크",
    "wireframeShape": "3tier-oled-laser-matrix",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: OLED Dark Mode 3-Tier with Cyan Hairline designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-3tier-pill-badge-floating",
    "part": "pricing",
    "name": "Floating Pill Badges 3-Tier Pricing",
    "koreanName": "🏷️ 플로팅 알약 배지 3단 요금제 (Best Value)",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "카드 상단 정중앙에 “🔥 가장 많은 선택” 알약 뱃지가 반쯤 걸쳐진 입체 요금제",
    "wireframeShape": "3tier-pill-badge-floating",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Floating Pill Badges 3-Tier Pricing designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-3tier-annual-discount-toggle",
    "part": "pricing",
    "name": "Bento 3-Tier with 20% Annual Discount Switch",
    "koreanName": "🔄 연간 20% 할인 토글러 내장 벤토 3단",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "상단에 “월간 결제” vs “연간 결제 (2개월 무료!)” 스위치가 달려 숫자가 실시간 슬라이드",
    "wireframeShape": "3tier-annual-discount-toggle",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Bento 3-Tier with 20% Annual Discount Switch designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-3tier-checklist-dense",
    "part": "pricing",
    "name": "High-Density Feature Checklist 3-Tier Cards",
    "koreanName": "📋 고밀도 기능 체크리스트 3단 카드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "각 티어마다 10~15개의 상세 기능 체크 항목이 빼곡히 들어차 가성비를 체감시키는 구조",
    "wireframeShape": "3tier-checklist-dense",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: High-Density Feature Checklist 3-Tier Cards designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-3tier-free-pro-enterprise",
    "part": "pricing",
    "name": "Free Forever vs Pro vs Enterprise Contrast",
    "koreanName": "⚖️ 완전 무료 vs 프로 vs 엔터프라이즈 극명 대비",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "개인 무료 체험을 장려하면서 엔터프라이즈의 보안/전담 기능을 뚜렷하게 대조",
    "wireframeShape": "3tier-free-pro-enterprise",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Free Forever vs Pro vs Enterprise Contrast designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-3tier-stacked-card-deck",
    "part": "pricing",
    "name": "Z-Index Layered Overlapping 3-Card Deck",
    "koreanName": "🃏 Z-인덱스 겹침형 3단 카드 덱",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "3장의 카드가 부채꼴처럼 살짝 겹쳐져 호버 시 마우스가 올라간 카드가 맨 앞으로 튀어나옴",
    "wireframeShape": "3tier-stacked-card-deck",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Z-Index Layered Overlapping 3-Card Deck designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-3tier-asymmetric-hero-pro",
    "part": "pricing",
    "name": "Asymmetric 60% Giant Pro Card + 2 Small Wings",
    "koreanName": "👑 60% 자이언트 프로 카드 + 양날개 미니 카드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "프로 플랜에 60%의 압도적 가로폭을 할당하고 양쪽에 무료와 기업 플랜을 날개처럼 배치",
    "wireframeShape": "3tier-asymmetric-hero-pro",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Asymmetric 60% Giant Pro Card + 2 Small Wings designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-3tier-horizontal-strip-row",
    "part": "pricing",
    "name": "Compact Horizontal 3-Row Pricing Strip",
    "koreanName": "➖ 가로 3열 컴팩트 스트립 요금제",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "세로 카드가 아닌 가로로 길게 뻗은 3개의 가로 행 스트립으로 모바일에서도 한눈에 파악",
    "wireframeShape": "3tier-horizontal-strip-row",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Compact Horizontal 3-Row Pricing Strip designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-3tier-color-coded-tiers",
    "part": "pricing",
    "name": "Color-Coded Blue/Purple/Gold Tier Badges",
    "koreanName": "🎨 블루/퍼플/골드 컬러 코딩 티어 배지",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "스타터는 차분한 블루, 프로는 환상적인 퍼플, 엔터프라이즈는 럭셔리 골드 포인트",
    "wireframeShape": "3tier-color-coded-tiers",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Color-Coded Blue/Purple/Gold Tier Badges designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-3tier-gradient-header-cards",
    "part": "pricing",
    "name": "Aurora Gradient Header 3-Tier Pricing",
    "koreanName": "🌈 오로라 그라디언트 헤더 3단 카드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "카드 상단 100px 영역에만 화려한 오로라 빛 그라디언트가 채워진 세련된 카드",
    "wireframeShape": "3tier-gradient-header-cards",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Aurora Gradient Header 3-Tier Pricing designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-3tier-interactive-hover-zoom",
    "part": "pricing",
    "name": "Spring Kinetic Hover Zoom 3-Tier Pricing",
    "koreanName": "🚀 스프링 키네틱 호버 줌 3단 요금제",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "마우스 호버 시 1.05배 부드럽게 확대되며 하단 CTA 버튼에 빛이 흐르는 역동적 인터랙션",
    "wireframeShape": "3tier-interactive-hover-zoom",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Spring Kinetic Hover Zoom 3-Tier Pricing designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-matrix-sticky-header-table",
    "part": "pricing",
    "name": "Sticky Header Full Feature Comparison Matrix",
    "koreanName": "📌 스티키 헤더 고정 풀 피처 비교 매트릭스",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "ultra-dense",
    "description": "스크롤을 내려도 상단 티어 이름과 가격이 브라우저 상단에 고정되어 긴 표를 편하게 열람",
    "wireframeShape": "matrix-sticky-header-table",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Sticky Header Full Feature Comparison Matrix designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-matrix-accordion-categories",
    "part": "pricing",
    "name": "Accordion Expandable Feature Comparison Table",
    "koreanName": "📂 아코디언 카테고리 접이식 비교표",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "ultra-dense",
    "description": "보안, 분석, 협업 등 카테고리 헤더를 클릭하여 원하는 영역만 펼쳐보는 깔끔한 비교표",
    "wireframeShape": "matrix-accordion-categories",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Accordion Expandable Feature Comparison Table designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-matrix-check-vs-cross-icons",
    "part": "pricing",
    "name": "Green Check vs Gray Dash Visual Indicator Table",
    "koreanName": "🟢 초록 체크 vs 회색 대시 직관적 지원 여부 표",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "ultra-dense",
    "description": "불필요한 글자 대신 명쾌한 그린 체크 아이콘과 회색 대시 기호로 지원 여부를 직관화",
    "wireframeShape": "matrix-check-vs-cross-icons",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Green Check vs Gray Dash Visual Indicator Table designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-matrix-scorecard-rating-grid",
    "part": "pricing",
    "name": "5-Star Feature Scorecard Comparison Grid",
    "koreanName": "⭐ 5점 만점 기능별 성적표 비교 그리드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "ultra-dense",
    "description": "단순 지원 여부를 넘어 기능 완성도를 별점과 점수로 상세히 채점한 스코어카드",
    "wireframeShape": "matrix-scorecard-rating-grid",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 5-Star Feature Scorecard Comparison Grid designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-matrix-plan-limit-slider",
    "part": "pricing",
    "name": "Dynamic Plan Limit Highlight Slider",
    "koreanName": "🎚️ 플랜별 한도 하이라이트 동적 슬라이더",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "ultra-dense",
    "description": "사용자가 원하는 일일 API 호출량을 선택하면 충족하는 티어가 자동으로 밝게 점등",
    "wireframeShape": "matrix-plan-limit-slider",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Dynamic Plan Limit Highlight Slider designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-matrix-diff-only-toggle",
    "part": "pricing",
    "name": "“Show Only Differences” Toggle Matrix Table",
    "koreanName": "🔍 “차이점만 모아보기” 필터 토글 비교표",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "ultra-dense",
    "description": "모든 플랜이 공통으로 지원하는 항목을 숨기고 차이나는 핵심 항목만 골라보는 똑똑한 표",
    "wireframeShape": "matrix-diff-only-toggle",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: “Show Only Differences” Toggle Matrix Table designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-matrix-enterprise-sla-checklist",
    "part": "pricing",
    "name": "Dedicated Enterprise SLA & Compliance Sheet",
    "koreanName": "🏢 전담 엔터프라이즈 SLA & 컴플라이언스 시트",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "ultra-dense",
    "description": "SOC2, 싱글사인온(SSO), 전담 매니저 배정 여부를 집중 조명한 B2B 맞춤 비교표",
    "wireframeShape": "matrix-enterprise-sla-checklist",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Dedicated Enterprise SLA & Compliance Sheet designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-matrix-addon-modular-selector",
    "part": "pricing",
    "name": "Modular Add-On Feature Checkbox Matrix",
    "koreanName": "🧩 모듈러 추가 옵션(Add-on) 체크박스 표",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "ultra-dense",
    "description": "기본 플랜 위에 필요한 애드온(전용 IP, 감사 로그)을 체크하여 총액을 합산해보는 표",
    "wireframeShape": "matrix-addon-modular-selector",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Modular Add-On Feature Checkbox Matrix designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-matrix-security-deep-dive-grid",
    "part": "pricing",
    "name": "Bank-Grade Security Deep-Dive Comparison",
    "koreanName": "🔒 금융권 보안 심층 비교 그리드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "ultra-dense",
    "description": "데이터 암호화 방식, 백업 주기, 재해 복구(DR) 시간을 조목조목 비교한 테크 시트",
    "wireframeShape": "matrix-security-deep-dive-grid",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Bank-Grade Security Deep-Dive Comparison designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-matrix-api-quota-rate-limits",
    "part": "pricing",
    "name": "API Quota & Rate Limit Technical Matrix",
    "koreanName": "⚡ API 쿼터 & 속도 제한(Rate Limit) 기술 비교표",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "ultra-dense",
    "description": "초당 요청 수(RPS), 동시 연결 수, 웹훅 지원 여부를 개발자 관점에서 정밀 기술",
    "wireframeShape": "matrix-api-quota-rate-limits",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: API Quota & Rate Limit Technical Matrix designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-matrix-team-seats-volume-scale",
    "part": "pricing",
    "name": "Team Seat Volume Discount Step Matrix",
    "koreanName": "👥 팀 인원수 구간별 볼륨 할인 매트릭스",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "ultra-dense",
    "description": "5인, 20인, 100인 구간별로 1인당 단가가 40%까지 저렴해지는 계단식 할인표",
    "wireframeShape": "matrix-team-seats-volume-scale",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Team Seat Volume Discount Step Matrix designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-matrix-cloud-vs-onpremise",
    "part": "pricing",
    "name": "Cloud SaaS vs On-Premise Self-Hosted Matrix",
    "koreanName": "☁️ 클라우드 SaaS vs 온프레미스 설치형 대조표",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "ultra-dense",
    "description": "인프라 관리 주체, 데이터 소유권, 배포 방식을 양대 산맥으로 비교한 기업용 표",
    "wireframeShape": "matrix-cloud-vs-onpremise",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Cloud SaaS vs On-Premise Self-Hosted Matrix designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-matrix-third-party-integrations",
    "part": "pricing",
    "name": "100+ Integrations Ecosystem Matrix (Slack/Notion)",
    "koreanName": "🔌 100+ 서드파티 연동 생태계 지원 매트릭스",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "ultra-dense",
    "description": "슬랙, 노션, 깃허브, 피그마 등 연동 가능한 툴의 로고와 지원 수준을 뱃지로 정리",
    "wireframeShape": "matrix-third-party-integrations",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 100+ Integrations Ecosystem Matrix (Slack/Notion) designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-matrix-support-response-time",
    "part": "pricing",
    "name": "SLA Support Response Time Tiers (15m vs 24h)",
    "koreanName": "⏱️ 지원 응답 시간 티어별 보증표 (15분 vs 24시간)",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "ultra-dense",
    "description": "이메일 지원(24시간)부터 슬랙 전용 채널(15분)까지 응답 속도를 차등화한 명세표",
    "wireframeShape": "matrix-support-response-time",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: SLA Support Response Time Tiers (15m vs 24h) designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-matrix-currency-switcher-table",
    "part": "pricing",
    "name": "Global Multi-Currency Auto-Converted Matrix",
    "koreanName": "🌍 글로벌 다통화 자동 환산 비교표 (USD/EUR/JPY/KRW)",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "ultra-dense",
    "description": "방문자 국가 IP를 감지하여 현지 통화와 부가세 포함 금액으로 자동 표시되는 글로벌 표",
    "wireframeShape": "matrix-currency-switcher-table",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Global Multi-Currency Auto-Converted Matrix designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-calc-mau-slider-volume",
    "part": "pricing",
    "name": "Monthly Active Users (MAU) Drag-to-Price Slider",
    "koreanName": "👥 월간 활성 사용자(MAU) 드래그 슬라이더 계산기",
    "trend": "Linear HUD",
    "gridGeometry": "bento-asymmetric",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "1만 명부터 1,000만 명까지 슬라이더를 부드럽게 당기면 월 청구 예상액이 즉각 반응",
    "wireframeShape": "calc-mau-slider-volume",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-asymmetric structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Monthly Active Users (MAU) Drag-to-Price Slider designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-calc-storage-gb-stepper",
    "part": "pricing",
    "name": "Cloud Storage GB/TB Capacity Dynamic Stepper",
    "koreanName": "💾 클라우드 저장 공간 GB/TB 용량 동적 스텝퍼",
    "trend": "Linear HUD",
    "gridGeometry": "bento-asymmetric",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "필요한 데이터 저장 용량을 기가바이트 단위로 조작하여 최적의 플랜을 추천받는 계산기",
    "wireframeShape": "calc-storage-gb-stepper",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-asymmetric structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Cloud Storage GB/TB Capacity Dynamic Stepper designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-calc-team-seats-counter",
    "part": "pricing",
    "name": "Team Members Number Stepper with Instant Total",
    "koreanName": "🔢 팀원 수 플러스/마이너스 카운터 & 즉시 견적",
    "trend": "Linear HUD",
    "gridGeometry": "bento-asymmetric",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "[ - ] 12명 [ + ] 버튼을 눌러 인원수에 따른 실시간 할인 적용 총액을 산출",
    "wireframeShape": "calc-team-seats-counter",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-asymmetric structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Team Members Number Stepper with Instant Total designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-calc-token-api-usage",
    "part": "pricing",
    "name": "AI Token & API Credits Consumption Forecaster",
    "koreanName": "🪙 AI 토큰 & API 크레딧 소모량 예측 계산기",
    "trend": "Linear HUD",
    "gridGeometry": "bento-asymmetric",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "월간 프롬프트 생성 횟수를 입력하면 필요한 토큰량과 최적 크레딧 번들을 안내",
    "wireframeShape": "calc-token-api-usage",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-asymmetric structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: AI Token & API Credits Consumption Forecaster designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-calc-cost-saving-vs-legacy",
    "part": "pricing",
    "name": "Annual Cost Saving Simulator vs Legacy System",
    "koreanName": "💵 기존 레거시 대비 연간 비용 절감 시뮬레이터",
    "trend": "Linear HUD",
    "gridGeometry": "bento-asymmetric",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "현재 지출 중인 인건비와 외주비를 입력하면 연간 수천만 원 절감 효과를 그래프로 증명",
    "wireframeShape": "calc-cost-saving-vs-legacy",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-asymmetric structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Annual Cost Saving Simulator vs Legacy System designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-calc-pay-as-you-go-bundles",
    "part": "pricing",
    "name": "Prepaid Credit Bundles with Bonus Credits",
    "koreanName": "🎁 종량제 선불 크레딧 번들 (보너스 충전 혜택)",
    "trend": "Linear HUD",
    "gridGeometry": "bento-asymmetric",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "10만 원 충전 시 +2만 원 보너스 등 게임 캐시처럼 직관적인 크레딧 충전식 카드",
    "wireframeShape": "calc-pay-as-you-go-bundles",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-asymmetric structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Prepaid Credit Bundles with Bonus Credits designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-calc-custom-enterprise-rfp",
    "part": "pricing",
    "name": "Interactive Custom Enterprise RFP Configurator",
    "koreanName": "📑 대기업 맞춤 견적서 실시간 조합 계산기",
    "trend": "Linear HUD",
    "gridGeometry": "bento-asymmetric",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "전용망 구축, 온사이트 교육, 24시간 핫라인을 체크하면 맞춤 견적 요약서가 생성",
    "wireframeShape": "calc-custom-enterprise-rfp",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-asymmetric structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Interactive Custom Enterprise RFP Configurator designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-calc-hourly-vs-monthly-flip",
    "part": "pricing",
    "name": "Micro-Billing Hourly vs Monthly Rate Switcher",
    "koreanName": "⏱️ 초단위 마이크로 과금 시간당 vs 월간 전환기",
    "trend": "Linear HUD",
    "gridGeometry": "bento-asymmetric",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "서버 인스턴스 시간당 $0.04 과금과 월간 고정 요금을 실시간 환산해 비교",
    "wireframeShape": "calc-hourly-vs-monthly-flip",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-asymmetric structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Micro-Billing Hourly vs Monthly Rate Switcher designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-calc-startup-discount-claim",
    "part": "pricing",
    "name": "Early-Stage Startup 80% Discount Claimer",
    "koreanName": "🚀 초기 스타트업 80% 파격 할인 자격 확인기",
    "trend": "Linear HUD",
    "gridGeometry": "bento-asymmetric",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "투자 단계(Seed/Pre-A)를 선택하면 80% 지원금을 즉시 적용해주는 특별 계산기",
    "wireframeShape": "calc-startup-discount-claim",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-asymmetric structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Early-Stage Startup 80% Discount Claimer designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-calc-open-source-credit-grant",
    "part": "pricing",
    "name": "Open Source Maintainer 100% Free Grant Card",
    "koreanName": "🐙 오픈소스 메인테이너 100% 무료 지원 신청 카드",
    "trend": "Linear HUD",
    "gridGeometry": "bento-asymmetric",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "깃허브 저장소 URL을 입력하면 즉시 무료 Pro 권한을 부여하는 개발자 친화 카드",
    "wireframeShape": "calc-open-source-credit-grant",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-asymmetric structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Open Source Maintainer 100% Free Grant Card designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-calc-fair-use-meter",
    "part": "pricing",
    "name": "Transparent Fair-Use Policy Traffic Meter",
    "koreanName": "📊 투명한 공정 사용 정책(Fair-Use) 트래픽 미터",
    "trend": "Linear HUD",
    "gridGeometry": "bento-asymmetric",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "숨겨진 추가 요금 없이 허용되는 대역폭 한도를 게이지 바로 투명하게 사전 고지",
    "wireframeShape": "calc-fair-use-meter",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-asymmetric structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Transparent Fair-Use Policy Traffic Meter designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-calc-overage-charge-estimator",
    "part": "pricing",
    "name": "Over-Quota Overage Charge Transparent Slider",
    "koreanName": "📈 초과 사용량 단가 투명 계산기",
    "trend": "Linear HUD",
    "gridGeometry": "bento-asymmetric",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "기본 할당량을 초과했을 때 건당 얼마가 청구되는지 미리 계산해보는 안심 도구",
    "wireframeShape": "calc-overage-charge-estimator",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-asymmetric structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Over-Quota Overage Charge Transparent Slider designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-calc-annual-upfront-badge",
    "part": "pricing",
    "name": "Pay Annually and Save 2 Months Free Ribbon",
    "koreanName": "🎀 연간 선납 2개월 무료 혜택 뱃지 요금제",
    "trend": "Linear HUD",
    "gridGeometry": "bento-asymmetric",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "연간 일시불 결제 시 12개월 중 2개월 치를 완전히 무료로 공제해주는 직관적 혜택",
    "wireframeShape": "calc-annual-upfront-badge",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-asymmetric structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Pay Annually and Save 2 Months Free Ribbon designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-calc-roi-payback-months",
    "part": "pricing",
    "name": "Investment Payback Period Calculator (Weeks/Months)",
    "koreanName": "⏳ 투자비 회수 기간(ROI) 주/월 단위 계산기",
    "trend": "Linear HUD",
    "gridGeometry": "bento-asymmetric",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "투자 대비 수익 회수 시점을 주 단위로 쪼개어 의사결정권자를 설득하는 계산기",
    "wireframeShape": "calc-roi-payback-months",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-asymmetric structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Investment Payback Period Calculator (Weeks/Months) designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-calc-custom-split-billing",
    "part": "pricing",
    "name": "Multi-Department Split Billing Configurator",
    "koreanName": "🏢 다부서 비용 분할 청구 설정 시뮬레이터",
    "trend": "Linear HUD",
    "gridGeometry": "bento-asymmetric",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "마케팅팀과 개발팀이 비용을 나누어 청구할 수 있도록 부서별 견적을 분할",
    "wireframeShape": "calc-custom-split-billing",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-asymmetric structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Multi-Department Split Billing Configurator designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-single-all-in-one-bold",
    "part": "pricing",
    "name": "All-in-One Bold Single Plan Card ($49/mo)",
    "koreanName": "📦 모든 기능 올인원 단일 플랜 ($49/월)",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "복잡한 등급 고민을 끝내주는, 모든 기능이 다 들어간 단 하나의 볼드한 사각 카드",
    "wireframeShape": "single-all-in-one-bold",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: All-in-One Bold Single Plan Card ($49/mo) designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-single-lifetime-deal-countdown",
    "part": "pricing",
    "name": "Lifetime Deal (LTD) with 48H Countdown Clock",
    "koreanName": "⏰ 48시간 한정 평생 소장 라이선스(LTD) 카드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "한 번 결제로 평생 무료 업데이트를 받는 한정 수량 카운트다운 타이머 카드",
    "wireframeShape": "single-lifetime-deal-countdown",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Lifetime Deal (LTD) with 48H Countdown Clock designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-single-pay-once-forever",
    "part": "pricing",
    "name": "“Buy Once, Use Forever” Clean Guarantee Card",
    "koreanName": "💎 “한 번 구매, 평생 이용” 클린 보증 카드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "구독 피로감에 지친 현대인을 위한 영구 소장 단일 라이선스 보증서",
    "wireframeShape": "single-pay-once-forever",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: “Buy Once, Use Forever” Clean Guarantee Card designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-single-early-bird-tier",
    "part": "pricing",
    "name": "Early-Bird Supporter Tier (Only 42 Spots Left)",
    "koreanName": "🐦 얼리버드 서포터 한정 티어 (단 42자리 잔여)",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "선착순 100명 한정 파격가 제공, 실시간 잔여 좌석 프로그레스 바 표시",
    "wireframeShape": "single-early-bird-tier",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Early-Bird Supporter Tier (Only 42 Spots Left) designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-single-free-forever-oss",
    "part": "pricing",
    "name": "Community Free Forever Open-Source Card",
    "koreanName": "💚 커뮤니티 평생 무료 오픈소스 플랜",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "개인 개발자와 학생은 평생 0원으로 이용할 수 있는 영구 무료 카드",
    "wireframeShape": "single-free-forever-oss",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Community Free Forever Open-Source Card designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-single-pay-what-you-want",
    "part": "pricing",
    "name": "Pay What You Want (PWYW) Voluntary Slider",
    "koreanName": "💝 원하는 만큼 후원하는 자율 가격 슬라이더",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "기본 $5부터 사용자가 원하는 금액을 직접 슬라이더로 올려 기부하는 모델",
    "wireframeShape": "single-pay-what-you-want",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Pay What You Want (PWYW) Voluntary Slider designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-single-nonprofit-education",
    "part": "pricing",
    "name": "Non-Profit & Student 100% Free Education Pass",
    "koreanName": "🎓 비영리 단체 & 학생 100% 무료 에듀케이션 패스",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "학교 이메일(.ac.kr / .edu) 인증 시 즉시 무료로 열리는 교육용 카드",
    "wireframeShape": "single-nonprofit-education",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Non-Profit & Student 100% Free Education Pass designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-single-high-ticket-enterprise",
    "part": "pricing",
    "name": "Executive Briefing High-Ticket Enterprise Pass",
    "koreanName": "👔 경영진 브리핑 전용 하이티켓 엔터프라이즈 패스",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "가격 대신 [경영진 1:1 상담 예약] 버튼이 크게 들어간 B2B 엔터프라이즈",
    "wireframeShape": "single-high-ticket-enterprise",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Executive Briefing High-Ticket Enterprise Pass designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-single-freemium-gateway",
    "part": "pricing",
    "name": "Freemium Conversion Gateway Card (No Card Needed)",
    "koreanName": "🚪 신용카드 등록 없는 프리미엄 게이트웨이",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "카드 번호 입력 없이 이메일만으로 지금 즉시 시작할 수 있음을 강조",
    "wireframeShape": "single-freemium-gateway",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Freemium Conversion Gateway Card (No Card Needed) designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-single-money-back-30day",
    "part": "pricing",
    "name": "100% Risk-Free 30-Day Money-Back Guarantee Card",
    "koreanName": "🛡️ 100% 무조건 30일 환불 보장 실드 카드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "불만족 시 이유 불문 100% 전액 환불해주는 황금빛 보증 도장 각인 카드",
    "wireframeShape": "single-money-back-30day",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 100% Risk-Free 30-Day Money-Back Guarantee Card designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-single-no-credit-card-pill",
    "part": "pricing",
    "name": "“No Credit Card Required” Micro Highlight Card",
    "koreanName": "💳 “신용카드 필요 없음” 안심 마이크로 카드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "가입 문턱을 낮추기 위해 신용카드 불필요 뱃지를 전면에 내세운 안심 요금제",
    "wireframeShape": "single-no-credit-card-pill",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: “No Credit Card Required” Micro Highlight Card designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-single-referral-credit-bonus",
    "part": "pricing",
    "name": "Invite Friends and Get $50 Credit Card",
    "koreanName": "🤝 친구 초대하고 $50 크레딧 적립 카드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "동료 디자이너를 초대할 때마다 양쪽 모두에게 크레딧을 지급하는 리퍼럴 카드",
    "wireframeShape": "single-referral-credit-bonus",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Invite Friends and Get $50 Credit Card designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-single-black-friday-banner",
    "part": "pricing",
    "name": "Seasonal Black Friday 50% Off Banner Card",
    "koreanName": "🛍️ 블랙프라이데이 시즌 50% 반값 세일 배너",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "형광 네온 레드 테두리와 함께 파격적인 반값 할인을 알리는 시즌 한정 카드",
    "wireframeShape": "single-black-friday-banner",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Seasonal Black Friday 50% Off Banner Card designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-single-custom-rfp-submission",
    "part": "pricing",
    "name": "Submit RFP for Custom Multi-Year Contract",
    "koreanName": "📬 다년 계약 맞춤 RFP 제안서 제출 카드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "기업 구매 조달 시스템에 맞춘 RFP 파일 업로드 및 법무 검토 지원 카드",
    "wireframeShape": "single-custom-rfp-submission",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Submit RFP for Custom Multi-Year Contract designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "pricing-single-whitelabel-agency",
    "part": "pricing",
    "name": "White-Label Agency Reseller License Tier",
    "koreanName": "🏢 화이트라벨 에이전시 리셀러 라이선스",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "자사 로고를 떼고 에이전시 브랜드로 클라이언트에게 재판매할 수 있는 권한",
    "wireframeShape": "single-whitelabel-agency",
    "keyFeatures": [
      "전환율 극대화 설계",
      "투명한 가격 체계",
      "원클릭 결제 연동"
    ],
    "tags": [
      "Pricing",
      "Conversion",
      "SaaS"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: White-Label Agency Reseller License Tier designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-ambient-gradient-fullbleed",
    "part": "cta",
    "name": "Full-Bleed Aurora Ambient Gradient CTA Banner",
    "koreanName": "🌌 풀블리드 오로라 앰비언트 그라디언트 CTA",
    "trend": "Liquid Glass",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "화면 전체를 가득 채우는 오로라 빛과 중앙의 볼드한 헤드라인 + 단일 메인 버튼",
    "wireframeShape": "ambient-gradient-fullbleed",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Full-Bleed Aurora Ambient Gradient CTA Banner designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-darkroom-spotlight-center",
    "part": "cta",
    "name": "Darkroom Spotlight Center Focus CTA",
    "koreanName": "🔦 다크룸 스포트라이트 중앙 포커스 CTA",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "어두운 공간 한가운데 위에서 스포트라이트 조명이 쏟아지듯 버튼을 비추는 연출",
    "wireframeShape": "darkroom-spotlight-center",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Darkroom Spotlight Center Focus CTA designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-glowing-laser-edge-card",
    "part": "cta",
    "name": "Glowing Laser Edge Border Floating CTA",
    "koreanName": "⚡ 발광 레이저 에지 보더 플로팅 CTA 카드",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "카드 둘레를 따라 에메랄드/사이언 레이저 선이 부드럽게 순환하는 입체 카드",
    "wireframeShape": "glowing-laser-edge-card",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Glowing Laser Edge Border Floating CTA designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-floating-capsule-dock-cta",
    "part": "cta",
    "name": "VisionOS Floating Capsule Action Dock",
    "koreanName": "💊 VisionOS 부유형 캡슐 액션 독 CTA",
    "trend": "Minimalist Editorial",
    "gridGeometry": "floating-dock",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "화면 하단에 떠있는 반투명 알약 캡슐 바 안에 카피와 시작하기 버튼 탑재",
    "wireframeShape": "floating-capsule-dock-cta",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "floating-dock structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: VisionOS Floating Capsule Action Dock designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-monospace-developer-cli-cta",
    "part": "cta",
    "name": "Monospaced Developer One-Liner CLI CTA",
    "koreanName": "💻 모노스페이스 개발자 원라이너 CLI CTA",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "`curl -sL https://core.sh | bash` 한 줄 명령어와 원클릭 복사 버튼",
    "wireframeShape": "monospace-developer-cli-cta",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Monospaced Developer One-Liner CLI CTA designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-giant-display-single-action",
    "part": "cta",
    "name": "Monumental Display Copy with Single Giant Action",
    "koreanName": "📰 모뉴멘탈 자이언트 카피 & 거대 단일 액션",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "80pt 크기의 강렬한 한 줄 질문(“준비되셨습니까?”)과 묵직한 풀사이즈 버튼",
    "wireframeShape": "giant-display-single-action",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Monumental Display Copy with Single Giant Action designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-aurora-borealis-glass-cta",
    "part": "cta",
    "name": "Frosted Glass Aurora Borealis Window CTA",
    "koreanName": "❄️ 프로스티드 글래스 오로라 윈도우 CTA",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "유리창 너머로 북극광이 일렁이는 듯한 환상적인 글래스모피즘 CTA",
    "wireframeShape": "aurora-borealis-glass-cta",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Frosted Glass Aurora Borealis Window CTA designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-swiss-hairline-boxed-cta",
    "part": "cta",
    "name": "Swiss Strict Hairline Minimal Boxed CTA",
    "koreanName": "📏 스위스 엄격한 헤어라인 박스드 CTA",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "0.5px 가로세로 선으로만 구획된 미술관 도록 같은 미니멀 엔딩 박스",
    "wireframeShape": "swiss-hairline-boxed-cta",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Swiss Strict Hairline Minimal Boxed CTA designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-neo-brutalist-thick-stroke-cta",
    "part": "cta",
    "name": "Neo-Brutalist 4px Solid Black Stroke CTA",
    "koreanName": "🧱 네오 브루탈리스트 4px 솔리드 블랙 스트로크 CTA",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "두꺼운 4px 외곽선과 쨍한 노란색 배경, 하드 섀도우가 눈을 때리는 강력한 CTA",
    "wireframeShape": "neo-brutalist-thick-stroke-cta",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Neo-Brutalist 4px Solid Black Stroke CTA designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-asymmetric-diagonal-slice-cta",
    "part": "cta",
    "name": "Asymmetric Diagonal Angled Slice CTA",
    "koreanName": "📐 비대칭 사선 앵글 슬라이스 CTA",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "-6도 기울어진 사선 컷아웃 배경 위에 텍스트와 버튼이 얹혀진 역동적 레이아웃",
    "wireframeShape": "asymmetric-diagonal-slice-cta",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Asymmetric Diagonal Angled Slice CTA designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-video-background-ambient-cta",
    "part": "cta",
    "name": "Ambient Looping Video Backdrop Dark CTA",
    "koreanName": "🎬 앰비언트 비디오 루프 배경 다크 CTA",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "잔잔하게 움직이는 도심 야경 비디오 루프 위에 부유하는 CTA 컨테이너",
    "wireframeShape": "video-background-ambient-cta",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Ambient Looping Video Backdrop Dark CTA designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-micro-grid-textured-dark-cta",
    "part": "cta",
    "name": "Micro-Grid Technical Texture Dark CTA",
    "koreanName": "📐 마이크로 모눈 그리드 텍스처 다크 CTA",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "엔지니어링 모눈종이 배경 위에 청사진 십자선 마커가 배치된 테크 CTA",
    "wireframeShape": "micro-grid-textured-dark-cta",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Micro-Grid Technical Texture Dark CTA designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-iridescent-chrome-shine-cta",
    "part": "cta",
    "name": "Iridescent Chrome Sheen Liquid Metal CTA",
    "koreanName": "🪞 이리디센트 크롬 광채 리퀴드 메탈 CTA",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "빛을 반사하는 유동성 액체 금속 질감의 테두리가 고급감을 자극하는 배너",
    "wireframeShape": "iridescent-chrome-shine-cta",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Iridescent Chrome Sheen Liquid Metal CTA designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-monochrome-stark-contrast-cta",
    "part": "cta",
    "name": "100% Monochrome Stark Black/White Contrast CTA",
    "koreanName": "⚖️ 100% 무채색 흑백 절대 명암비 CTA",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "오직 블랙과 화이트의 극한 대비만으로 가장 순수한 전환을 이끌어내는 카드",
    "wireframeShape": "monochrome-stark-contrast-cta",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 100% Monochrome Stark Black/White Contrast CTA designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-spatial-floating-orb-cta",
    "part": "cta",
    "name": "Spatial Floating Glowing Orb Centerpiece CTA",
    "koreanName": "🔮 공간 부유형 발광 오브 중심 CTA",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "중앙에 공중에 뜬 3D 크리스탈 오브가 천천히 회전하며 시선을 끌어당김",
    "wireframeShape": "spatial-floating-orb-cta",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Spatial Floating Glowing Orb Centerpiece CTA designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-lead-single-email-instant",
    "part": "cta",
    "name": "Single-Line Email Input with Instant Magic Submit",
    "koreanName": "✉️ 한 줄 이메일 입력 & 매직 원클릭 전송",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "이메일 주소를 적고 엔터를 누르면 마법처럼 즉시 가입 완료되는 인라인 폼",
    "wireframeShape": "lead-single-email-instant",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Single-Line Email Input with Instant Magic Submit designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-lead-two-step-onboarding",
    "part": "cta",
    "name": "Two-Step Quick Onboarding Progressive Form",
    "koreanName": "🪜 2단계 점진적 퀵 온보딩 폼",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "Step 1: 이메일 입력 → Step 2: 팀 이름 입력으로 심리적 장벽을 낮춘 폼",
    "wireframeShape": "lead-two-step-onboarding",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Two-Step Quick Onboarding Progressive Form designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-lead-free-audit-url-analyzer",
    "part": "cta",
    "name": "Instant Free SEO/Speed Audit URL Analyzer",
    "koreanName": "🔍 무료 성능/SEO 진단 URL 분석기 인풋",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "웹사이트 URL을 입력하면 3초 만에 100점 만점 진단 리포트를 뽑아주는 폼",
    "wireframeShape": "lead-free-audit-url-analyzer",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Instant Free SEO/Speed Audit URL Analyzer designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-lead-interactive-quiz-launcher",
    "part": "cta",
    "name": "Interactive 3-Question Needs Assessment Quiz",
    "koreanName": "🧩 인터랙티브 3문항 맞춤 솔루션 진단 퀴즈",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "“현재 팀 규모는?” “가장 큰 병목은?” 3개 클릭으로 맞춤 플랜을 추천",
    "wireframeShape": "lead-interactive-quiz-launcher",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Interactive 3-Question Needs Assessment Quiz designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-lead-calendly-1click-scheduler",
    "part": "cta",
    "name": "Calendly 1-Click Executive Meeting Scheduler",
    "koreanName": "📅 캘린들리 1클릭 15분 미팅 예약 위젯",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "캘린더 날짜와 시간을 클릭하여 영업 대표와 즉시 화상 통화를 잡는 위젯",
    "wireframeShape": "lead-calendly-1click-scheduler",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Calendly 1-Click Executive Meeting Scheduler designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-lead-phone-sms-invite-sender",
    "part": "cta",
    "name": "Mobile Phone SMS App Link Direct Sender",
    "koreanName": "📱 휴대폰 번호 입력 앱 다운로드 SMS 발송기",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "전화번호를 입력하면 1초 만에 스마트폰으로 설치 링크가 전송되는 폼",
    "wireframeShape": "lead-phone-sms-invite-sender",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Mobile Phone SMS App Link Direct Sender designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-lead-domain-name-checker",
    "part": "cta",
    "name": "Instant Domain / Workspace Availability Checker",
    "koreanName": "🌐 워크스페이스 / 도메인 이름 중복 확인 인풋",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "“myteam.core.app” 원하는 팀 주소를 쳐서 사용 가능한지 실시간 체크",
    "wireframeShape": "lead-domain-name-checker",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Instant Domain / Workspace Availability Checker designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-lead-roi-lead-capture-form",
    "part": "cta",
    "name": "Custom ROI Report PDF Download Lead Capture",
    "koreanName": "📊 맞춤형 ROI 분석 리포트 PDF 다운로드 폼",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "예상 절감액을 확인한 뒤 상세 10장짜리 분석 보고서를 이메일로 수령",
    "wireframeShape": "lead-roi-lead-capture-form",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Custom ROI Report PDF Download Lead Capture designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-lead-multi-select-goals",
    "part": "cta",
    "name": "Multi-Select Goal Checkboxes with Action Button",
    "koreanName": "☑️ 다중 선택 목표 체크박스 결합 폼",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "“속도 개선”, “비용 절감”, “보안 강화” 관심사를 체크하고 시작하기",
    "wireframeShape": "lead-multi-select-goals",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Multi-Select Goal Checkboxes with Action Button designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-lead-whitepaper-download-card",
    "part": "cta",
    "name": "Exclusive 2026 Industry Whitepaper Download",
    "koreanName": "📑 2026 최신 업계 백서 무료 다운로드 카드",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "표지 미리보기와 목차가 깔끔히 정리된 전문 테크 리포트 다운로드 폼",
    "wireframeShape": "lead-whitepaper-download-card",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Exclusive 2026 Industry Whitepaper Download designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-lead-early-access-waitlist",
    "part": "cta",
    "name": "Early Access Waitlist with Live Queue Number",
    "koreanName": "⏳ 사전 예약 대기자 명단 & 실시간 순번 발급",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "신청 즉시 “현재 대기 번호 #1,420번” 실시간 순번 티켓을 발급하는 폼",
    "wireframeShape": "lead-early-access-waitlist",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Early Access Waitlist with Live Queue Number designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-lead-instant-api-key-issue",
    "part": "cta",
    "name": "One-Click Instant Free API Key Generator",
    "koreanName": "🔑 원클릭 즉시 무료 API 키 발급 인풋",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "카드 등록 없이 이메일만으로 100회 무료 테스트 API 키를 즉시 화면에 복사",
    "wireframeShape": "lead-instant-api-key-issue",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: One-Click Instant Free API Key Generator designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-lead-company-size-selector",
    "part": "cta",
    "name": "Company Size & Industry Segmented Onboarding",
    "koreanName": "🏢 기업 규모 및 업종 선택 세그먼트 폼",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "스타트업 / 중견 / 대기업 라디오 버튼을 선택하여 맞춤 데모를 요청",
    "wireframeShape": "lead-company-size-selector",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Company Size & Industry Segmented Onboarding designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-lead-feedback-drawer-prompt",
    "part": "cta",
    "name": "Slide-Out Feedback & Consultation Drawer",
    "koreanName": "💬 슬라이드아웃 1:1 상담 문의 드로어 폼",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "버튼 클릭 시 우측에서 부드럽게 열리는 1:1 전담 컨설팅 문의 창",
    "wireframeShape": "lead-feedback-drawer-prompt",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Slide-Out Feedback & Consultation Drawer designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-lead-live-demo-video-trigger",
    "part": "cta",
    "name": "Interactive Live Interactive Sandbox Trigger",
    "koreanName": "🎮 브라우저 내 1분 라이브 샌드박스 실행 버튼",
    "trend": "GenUI & AI-Native",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "가입 없이 브라우저 안에서 직접 코드를 쳐보고 실행해보는 체험 트리거",
    "wireframeShape": "lead-live-demo-video-trigger",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, GenUI & AI-Native visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Interactive Live Interactive Sandbox Trigger designed in GenUI & AI-Native aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-urgency-perforated-coupon-ticket",
    "part": "cta",
    "name": "Perforated Tear-Off 30% Discount Coupon Ticket",
    "koreanName": "🎟️ 뜯어 쓰는 절취선 30% 할인 쿠폰 티켓",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "우측 점선을 마우스로 뜯는 듯한 인터랙션과 함께 쿠폰 코드가 자동 복사",
    "wireframeShape": "urgency-perforated-coupon-ticket",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Perforated Tear-Off 30% Discount Coupon Ticket designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-urgency-golden-vip-pass",
    "part": "cta",
    "name": "Golden VIP Lifetime Access Metal Pass Card",
    "koreanName": "🥇 골든 VIP 평생 이용권 메탈 패스 카드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "금빛 반사광이 흐르는 VIP 한정판 카드 메타포의 고급스러운 전환 유도",
    "wireframeShape": "urgency-golden-vip-pass",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Golden VIP Lifetime Access Metal Pass Card designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-urgency-live-countdown-48h",
    "part": "cta",
    "name": "Live 48-Hour Countdown Clock Urgent Banner",
    "koreanName": "⏰ 48시간 실시간 카운트다운 타이머 배너",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "“01일 23시간 42분 18초 남음” 1초마다 줄어드는 긴박감 넘치는 배너",
    "wireframeShape": "urgency-live-countdown-48h",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Live 48-Hour Countdown Clock Urgent Banner designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-urgency-limited-seats-progress",
    "part": "cta",
    "name": "Limited 50 Spots Progress Bar (38 Claimed)",
    "koreanName": "⏳ 선착순 50명 한정 프로그레스 바 (38명 등록)",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "정원 마감 게이지가 76%까지 차올라 조기 마감을 경고하는 레이아웃",
    "wireframeShape": "urgency-limited-seats-progress",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Limited 50 Spots Progress Bar (38 Claimed) designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-urgency-pulsing-flash-sale",
    "part": "cta",
    "name": "Animated Red Pulsing Flash Sale Alert Badge",
    "koreanName": "🚨 빨간색 점멸 플래시 세일 알림 뱃지",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "실시간 번개 세일 뱃지가 두근거리듯 펄스하며 시선을 집중시키는 구조",
    "wireframeShape": "urgency-pulsing-flash-sale",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Animated Red Pulsing Flash Sale Alert Badge designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-urgency-mystery-gift-reveal",
    "part": "cta",
    "name": "Click to Reveal Secret Bonus Package Card",
    "koreanName": "🎁 클릭하여 시크릿 보너스 패키지 열기 카드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "물음표 상자를 클릭하면 $200 상당의 추가 템플릿 번들이 팡 터지는 연출",
    "wireframeShape": "urgency-mystery-gift-reveal",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Click to Reveal Secret Bonus Package Card designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-urgency-scratch-card-discount",
    "part": "cta",
    "name": "Interactive Scratch-to-Reveal 40% Off Card",
    "koreanName": "🪙 동전으로 긁는 복권 스크래치 할인 카드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "마우스로 은색 표면을 긁어내면 숨겨진 40% 할인 코드가 나타나는 재미",
    "wireframeShape": "urgency-scratch-card-discount",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Interactive Scratch-to-Reveal 40% Off Card designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-urgency-lucky-spin-wheel",
    "part": "cta",
    "name": "Gamified Lucky Wheel Discount Selector",
    "koreanName": "🎡 게이미피케이션 룰렛 할인 추첨기",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "돌려돌려 돌림판을 돌려 10%~50% 랜덤 할인을 즉석에서 뽑아 적용",
    "wireframeShape": "urgency-lucky-spin-wheel",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Gamified Lucky Wheel Discount Selector designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-urgency-price-increase-warning",
    "part": "cta",
    "name": "Notice of Price Increase Next Month Banner",
    "koreanName": "📈 다음 달 정가 인상 예고 공식 공지 배너",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "“다음 분기부터 월 $79로 인상됩니다” 현 가격 동결을 위한 서두름 유도",
    "wireframeShape": "urgency-price-increase-warning",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Notice of Price Increase Next Month Banner designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-urgency-first-100-founders",
    "part": "cta",
    "name": "First 100 Founding Members Exclusive Shield",
    "koreanName": "🛡️ 최초 100인 파운딩 멤버 영구 혜택 실드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "초기 멤버 100인에게만 주어지는 영구 프라이빗 채널 입장권 뱃지",
    "wireframeShape": "urgency-first-100-founders",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: First 100 Founding Members Exclusive Shield designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-urgency-early-supporter-token",
    "part": "cta",
    "name": "Numbered Early Supporter Digital Certificate",
    "koreanName": "📜 일련번호가 각인된 공식 얼리 서포터 인증서",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "“SUPPORTER #084” 고유 번호가 찍힌 인증서 카드로 소장 가치 부여",
    "wireframeShape": "urgency-early-supporter-token",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Numbered Early Supporter Digital Certificate designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-urgency-referral-sharing-incentive",
    "part": "cta",
    "name": "Dual-Sided Referral Sharing Incentive Strip",
    "koreanName": "🤝 친구와 나 모두 3만 원 적립 추천 스트립",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "초대 링크 1클릭 복사 버튼과 함께 양방향 보상을 약속하는 가로 바",
    "wireframeShape": "urgency-referral-sharing-incentive",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Dual-Sided Referral Sharing Incentive Strip designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-urgency-group-bulk-discount",
    "part": "cta",
    "name": "Unlock 5+ Team Seat Bulk Discount Tier",
    "koreanName": "👥 5인 이상 단체 구매 추가 30% 할인 언락",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "인원수가 채워질 때마다 자물쇠가 풀리며 할인이 커지는 그룹 바",
    "wireframeShape": "urgency-group-bulk-discount",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Unlock 5+ Team Seat Bulk Discount Tier designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-urgency-seasonal-promo-pill",
    "part": "cta",
    "name": "Spring Promo Code Auto-Applied Pill Notification",
    "koreanName": "🌸 봄맞이 프로모션 코드 자동 적용 캡슐",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "결제 페이지 이동 시 쿠폰 코드가 자동으로 쏙 들어가는 안심 알약 바",
    "wireframeShape": "urgency-seasonal-promo-pill",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Spring Promo Code Auto-Applied Pill Notification designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-urgency-holiday-gift-redeem",
    "part": "cta",
    "name": "Holiday Special Gift Redemption Voucher",
    "koreanName": "🎄 연말연시 스페셜 기프트 바우처 카드",
    "trend": "Bento Grid 2.0",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "선물 포장 리본 그래픽과 함께 소중한 팀원에게 라이선스를 선물하는 카드",
    "wireframeShape": "urgency-holiday-gift-redeem",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Bento Grid 2.0 visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Holiday Special Gift Redemption Voucher designed in Bento Grid 2.0 aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-reassure-faq-accordion-cta",
    "part": "cta",
    "name": "Split FAQ Accordion on Left + Sticky CTA Right",
    "koreanName": "❓ 좌측 FAQ 아코디언 + 우측 스티키 CTA",
    "trend": "Minimalist Editorial",
    "gridGeometry": "split-60-40",
    "focalAnchor": "hybrid",
    "density": "compact",
    "description": "가장 자주 묻는 5대 질문을 풀면서 우측에서 즉시 시작할 수 있는 최적 결합",
    "wireframeShape": "reassure-faq-accordion-cta",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "split-60-40 structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Split FAQ Accordion on Left + Sticky CTA Right designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-reassure-money-back-shield-big",
    "part": "cta",
    "name": "100% Risk-Free 30-Day Refund Assurance Shield",
    "koreanName": "🛡️ 100% 위험 제로 30일 환불 보증 실드",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "아무런 조건 없이 30일 이내 환불해 준다는 큼직한 황금 도장 보증서",
    "wireframeShape": "reassure-money-back-shield-big",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 100% Risk-Free 30-Day Refund Assurance Shield designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-reassure-support-team-online",
    "part": "cta",
    "name": "Live Support Avatar Duo with “Online Now (2m)”",
    "koreanName": "🟢 실시간 상담원 아바타 & “현재 접속 중(응답 2분)”",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "실제 고객 지원 팀원의 밝은 얼굴 사진과 초록색 접속 중 펄스 라이트",
    "wireframeShape": "reassure-support-team-online",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Live Support Avatar Duo with “Online Now (2m)” designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-reassure-no-contract-lockin",
    "part": "cta",
    "name": "“Cancel Anytime with 1-Click” Reassurance Pill",
    "koreanName": "🔓 “언제든 1클릭으로 위약금 없이 해지 가능”",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "약정이나 위약금 없이 마이페이지에서 단 1클릭으로 해지됨을 공언",
    "wireframeShape": "reassure-no-contract-lockin",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: “Cancel Anytime with 1-Click” Reassurance Pill designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-reassure-founder-signature-letter",
    "part": "cta",
    "name": "Founder Personal Letter & Hand-Drawn Signature",
    "koreanName": "✍️ 창업자의 친필 서명과 고객을 향한 편지",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "서비스를 만든 이유와 품질에 대한 자부심이 담긴 창업자 서명 카드",
    "wireframeShape": "reassure-founder-signature-letter",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Founder Personal Letter & Hand-Drawn Signature designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-reassure-security-badge-cluster",
    "part": "cta",
    "name": "SOC2, ISO, GDPR 4-Shield Compliance Cluster",
    "koreanName": "🔒 4대 국제 표준 보안 인증 마크 클러스터",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "금융권 수준의 안전한 결제 시스템과 데이터 보호 체계를 재확인",
    "wireframeShape": "reassure-security-badge-cluster",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: SOC2, ISO, GDPR 4-Shield Compliance Cluster designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-reassure-concierge-migration",
    "part": "cta",
    "name": "Free Concierge Data Migration Service Included",
    "koreanName": "🚚 타사 데이터 무료 대행 이전(마이그레이션) 보장",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "기존에 쓰던 복잡한 데이터를 전담 엔지니어가 무료로 다 옮겨줌을 약속",
    "wireframeShape": "reassure-concierge-migration",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Free Concierge Data Migration Service Included designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-reassure-community-discord-invite",
    "part": "cta",
    "name": "Join 24,000 Active Creators Discord Community",
    "koreanName": "👾 24,000명 디스코드 커뮤니티 초대 배너",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "구매 후 혼자가 아니라 수만 명의 동료들과 실시간 팁을 나눌 수 있는 방",
    "wireframeShape": "reassure-community-discord-invite",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Join 24,000 Active Creators Discord Community designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-reassure-github-oauth-1click",
    "part": "cta",
    "name": "Instant 1-Click GitHub / Google OAuth Button",
    "koreanName": "🐙 깃허브 / 구글 계정으로 1초 만에 로그인",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "비밀번호 설정 없이 평소 쓰던 개발자 계정으로 즉시 시작하는 버튼",
    "wireframeShape": "reassure-github-oauth-1click",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Instant 1-Click GitHub / Google OAuth Button designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-reassure-qr-code-mobile-app",
    "part": "cta",
    "name": "Scan QR Code to Download Companion Mobile App",
    "koreanName": "📲 QR 코드 스캔 모바일 컴패니언 앱 다운로드",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "카메라로 QR을 비추면 바로 앱스토어로 연결되는 온보딩 카드",
    "wireframeShape": "reassure-qr-code-mobile-app",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Scan QR Code to Download Companion Mobile App designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-reassure-chrome-extension-install",
    "part": "cta",
    "name": "Chrome Web Store 5-Star Extension Badge",
    "koreanName": "🧩 크롬 웹스토어 5성급 공식 확장 프로그램 설치",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "크롬 브라우저 상단에서 바로 쓰는 확장 도구 원클릭 추가 배너",
    "wireframeShape": "reassure-chrome-extension-install",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Chrome Web Store 5-Star Extension Badge designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-reassure-terminal-sdk-install",
    "part": "cta",
    "name": "Copy Terminal Install Command with Live Check",
    "koreanName": "💻 터미널 설치 명령어 복사 & 복사 완료 피드백",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "`npm install @core/cli -g` 복사 시 초록색 체크 마크로 전환",
    "wireframeShape": "reassure-terminal-sdk-install",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Copy Terminal Install Command with Live Check designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-reassure-live-chat-floating-summon",
    "part": "cta",
    "name": "Floating Live Chat Consultation Summon Widget",
    "koreanName": "💬 우하단 실시간 1:1 채팅 상담 호출 위젯",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "궁금한 점이 있을 때 즉시 물어볼 수 있는 플로팅 챗봇 트리거",
    "wireframeShape": "reassure-live-chat-floating-summon",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Floating Live Chat Consultation Summon Widget designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-reassure-exit-intent-modal-bar",
    "part": "cta",
    "name": "Exit-Intent Gentle Floating Discount Bar",
    "koreanName": "👋 이탈 방지 부드러운 플로팅 할인 바",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "마우스가 창 밖으로 나갈 때 부드럽게 고개를 드는 특별 제안 바",
    "wireframeShape": "reassure-exit-intent-modal-bar",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Exit-Intent Gentle Floating Discount Bar designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "cta-reassure-sticky-bottom-banner",
    "part": "cta",
    "name": "Persistent Sticky Bottom Action Strip",
    "koreanName": "📌 화면 하단 항상 고정되는 슬림 액션 바",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "스크롤을 아무리 내려도 항상 손닿는 거리에 머무는 미니멀 전환 바",
    "wireframeShape": "reassure-sticky-bottom-banner",
    "keyFeatures": [
      "원클릭 전환 최적화",
      "심리적 장벽 제거",
      "즉각적인 행동 유도"
    ],
    "tags": [
      "CTA",
      "Conversion",
      "Ending"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Persistent Sticky Bottom Action Strip designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-glass-capsule-island",
    "part": "nav_footer",
    "name": "VisionOS Floating Glass Capsule Island Nav",
    "koreanName": "🏝️ VisionOS 부유형 글래스 캡슐 아일랜드 GNB",
    "trend": "Liquid Glass",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "상단 화면에 둥둥 떠있는 반투명 유리 알약 바, 로고와 메뉴가 콤팩트하게 정렬",
    "wireframeShape": "nav-glass-capsule-island",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: VisionOS Floating Glass Capsule Island Nav designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-swiss-hairline-1line",
    "part": "nav_footer",
    "name": "Swiss 1-Line Strict Minimalist Text Nav",
    "koreanName": "📏 스위스 1-라인 엄격한 흑백 미니멀 GNB",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "0.5px 가로선 하나로 구분된 정갈한 고딕 서체의 1열 텍스트 네비게이션",
    "wireframeShape": "nav-swiss-hairline-1line",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Swiss 1-Line Strict Minimalist Text Nav designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-standard-left-center-right",
    "part": "nav_footer",
    "name": "Classic Left-Logo Center-Links Right-CTA Nav",
    "koreanName": "🏛️ 클래식 좌측 로고 + 중앙 링크 + 우측 CTA GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "웹 표준의 가장 익숙하고 실패 없는 3분할 클래식 네비게이션 바",
    "wireframeShape": "nav-standard-left-center-right",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Classic Left-Logo Center-Links Right-CTA Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-mega-menu-dropdown",
    "part": "nav_footer",
    "name": "Enterprise Multi-Column Bento Mega Menu Nav",
    "koreanName": "🍱 엔터프라이즈 멀티 칼럼 벤토 메가 메뉴 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "compact",
    "description": "“제품” 호버 시 솔루션, 템플릿, 고객사 카드가 풍성하게 열리는 대형 메뉴",
    "wireframeShape": "nav-mega-menu-dropdown",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Enterprise Multi-Column Bento Mega Menu Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-prompt-search-integrated",
    "part": "nav_footer",
    "name": "Integrated Natural Language Prompt Bar Nav",
    "koreanName": "🤖 자연어 프롬프트 검색창 일체형 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "interactive",
    "density": "balanced",
    "description": "GNB 중앙에 `Search or Ask AI... [⌘K]` 인풋 필드가 내장된 최신 트렌드",
    "wireframeShape": "nav-prompt-search-integrated",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Integrated Natural Language Prompt Bar Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-terminal-hud-latency",
    "part": "nav_footer",
    "name": "Terminal HUD Monospace Nav with Live Ping Indicator",
    "koreanName": "📟 터미널 HUD 모노스페이스 GNB (실시간 핑 12ms)",
    "trend": "Linear HUD",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "초록색 핑 점멸 라이트, 서버 상태, 터미널 폰트로 무장한 개발자용 상단바",
    "wireframeShape": "nav-terminal-hud-latency",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Terminal HUD Monospace Nav with Live Ping Indicator designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-fullscreen-overlay-modal",
    "part": "nav_footer",
    "name": "Bold Fullscreen Overlay Hamburger Modal Nav",
    "koreanName": "🍔 전폭 풀스크린 햄버거 오버레이 메뉴 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "메뉴 버튼 클릭 시 화면 전체가 칠흑같이 어두워지며 60pt 대형 링크가 등장",
    "wireframeShape": "nav-fullscreen-overlay-modal",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Bold Fullscreen Overlay Hamburger Modal Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-mobile-bottom-dock",
    "part": "nav_footer",
    "name": "Mobile Native Bottom Tab Bar Dock Nav",
    "koreanName": "📱 모바일 네이티브 하단 탭 바 독(Dock) 네비게이션",
    "trend": "Minimalist Editorial",
    "gridGeometry": "floating-dock",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "스마트폰 엄지손가락 영역에 5개 주요 탭 아이콘이 상시 고정된 하단 독",
    "wireframeShape": "nav-mobile-bottom-dock",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "floating-dock structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Mobile Native Bottom Tab Bar Dock Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-vertical-collapsible-sidebar",
    "part": "nav_footer",
    "name": "Collapsible Left Vertical Sidebar Nav (Linear Style)",
    "koreanName": "📁 접이식 좌측 세로 사이드바 GNB (Linear 스타일)",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "좌측에 세로로 길게 뻗은 사이드바, 아이콘 모드와 확장 모드를 토글 지원",
    "wireframeShape": "nav-vertical-collapsible-sidebar",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Collapsible Left Vertical Sidebar Nav (Linear Style) designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-split-center-logo",
    "part": "nav_footer",
    "name": "Split Nav with Centered Brand Monogram",
    "koreanName": "⚜️ 중앙 브랜드 모노그램 좌우 대칭 분할 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "가운데 정렬된 럭셔리 심볼을 기준으로 좌측 3개, 우측 3개 링크가 완벽 대칭",
    "wireframeShape": "nav-split-center-logo",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Split Nav with Centered Brand Monogram designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-minimalist-icon-dock",
    "part": "nav_footer",
    "name": "Ultra-Minimalist Icon-Only Floating Dock Nav",
    "koreanName": "🎛️ 울트라 미니멀 아이콘 전용 플로팅 독 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "글자 없이 오직 정밀한 벡터 아이콘 4개만 떠있어 호버 시 툴팁을 제공",
    "wireframeShape": "nav-minimalist-icon-dock",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Ultra-Minimalist Icon-Only Floating Dock Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-stacked-notification-banner",
    "part": "nav_footer",
    "name": "Stacked Announcement Notification Bar + Nav",
    "koreanName": "📢 상단 공지 배너 + 네비게이션 2단 스택 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "“🎉 2.0 버전 대규모 릴리즈!” 알림 바가 상단에 착 달라붙은 2단 구조",
    "wireframeShape": "nav-stacked-notification-banner",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Stacked Announcement Notification Bar + Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-breadcrumb-trail-topbar",
    "part": "nav_footer",
    "name": "Dynamic Breadcrumb Trail Integrated Topbar",
    "koreanName": "🍞 동적 브레드크럼(경로 추적) 일체형 상단바",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "`Home / Products / AI Studio / Settings` 현재 위치가 명확히 보이는 바",
    "wireframeShape": "nav-breadcrumb-trail-topbar",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Dynamic Breadcrumb Trail Integrated Topbar designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-ecommerce-cart-drawer",
    "part": "nav_footer",
    "name": "E-Commerce Sticky Nav with Slide-Out Cart",
    "koreanName": "🛍️ 슬라이드아웃 장바구니 일체형 이커머스 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "우측 상단에 담긴 상품 개수 뱃지와 클릭 시 열리는 사이드 장바구니",
    "wireframeShape": "nav-ecommerce-cart-drawer",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: E-Commerce Sticky Nav with Slide-Out Cart designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-developer-git-status",
    "part": "nav_footer",
    "name": "Developer Git Branch Selector Integrated Nav",
    "koreanName": "🌿 Git 브랜치(main/dev) 셀렉터 일체형 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "현재 보고 있는 문서나 프로젝트의 브랜치를 즉시 스위칭할 수 있는 상단바",
    "wireframeShape": "nav-developer-git-status",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Developer Git Branch Selector Integrated Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-currency-language-globe",
    "part": "nav_footer",
    "name": "Global Multi-Language & Currency Selector Nav",
    "koreanName": "🌍 글로벌 다국어 & 통화 변환 드롭다운 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "지구본 아이콘을 눌러 한국어, 영어, 일본어 및 통화를 1초 만에 변경",
    "wireframeShape": "nav-currency-language-globe",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Global Multi-Language & Currency Selector Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-dynamic-scroll-shrink",
    "part": "nav_footer",
    "name": "Dynamic Scroll-Morphing Shrink & Blur Nav",
    "koreanName": "📜 스크롤 시 자동 축소 및 블러 강화 모핑 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "페이지를 아래로 내리면 패딩이 줄어들며 얇은 유리바로 매끄럽게 변신",
    "wireframeShape": "nav-dynamic-scroll-shrink",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Dynamic Scroll-Morphing Shrink & Blur Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-tabbed-category-header",
    "part": "nav_footer",
    "name": "Tabbed Category Horizon Header Nav",
    "koreanName": "📑 수평 탭 카테고리 일체형 헤더 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "상단바 바로 아래에 주요 하위 카테고리 6개가 가로 탭으로 연결된 구성",
    "wireframeShape": "nav-tabbed-category-header",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Tabbed Category Horizon Header Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-transparent-hero-blend",
    "part": "nav_footer",
    "name": "Transparent Gradient Hero Seamless Blend Nav",
    "koreanName": "🌅 히어로 배경과 매끄럽게 녹아드는 투명 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "경계선 없이 히어로 섹션의 화보나 그래픽 위로 자연스럽게 스며든 상단바",
    "wireframeShape": "nav-transparent-hero-blend",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Transparent Gradient Hero Seamless Blend Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-command-k-spotlight",
    "part": "nav_footer",
    "name": "Command-K Quick Palette Trigger Badge Nav",
    "koreanName": "⌨️ [⌘K] 퀵 검색 팔레트 호출 배지 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "누르면 맥OS 스포트라이트처럼 화면 중앙에 검색창이 열리는 트리거 버튼",
    "wireframeShape": "nav-command-k-spotlight",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Command-K Quick Palette Trigger Badge Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-user-profile-avatar-pill",
    "part": "nav_footer",
    "name": "User Profile Avatar & Credit Balance Pill Nav",
    "koreanName": "👤 사용자 프로필 아바타 & 보유 크레딧 캡슐 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "로그인 후 내 잔여 토큰(1,420 크레딧)과 프로필 썸네일이 보이는 앱형 상단바",
    "wireframeShape": "nav-user-profile-avatar-pill",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: User Profile Avatar & Credit Balance Pill Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-brutalist-thick-border",
    "part": "nav_footer",
    "name": "Neo-Brutalist Thick 3px Black Border Nav",
    "koreanName": "🧱 네오 브루탈리스트 3px 볼드 블랙 보더 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "선명한 3px 검은 실선과 비비드 컬러 버튼이 레트로한 감각을 뽐내는 바",
    "wireframeShape": "nav-brutalist-thick-border",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Neo-Brutalist Thick 3px Black Border Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-luxury-lettermark-serif",
    "part": "nav_footer",
    "name": "Haute Couture Luxury Lettermark Serif Nav",
    "koreanName": "✨ 오트 쿠튀르 럭셔리 세리프 레터마크 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "파리 패션 하우스처럼 우아한 세리프 로고와 넉넉한 글자 자간이 돋보이는 바",
    "wireframeShape": "nav-luxury-lettermark-serif",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Haute Couture Luxury Lettermark Serif Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-video-reel-peek-header",
    "part": "nav_footer",
    "name": "Micro Video Reel Peek on Menu Hover Nav",
    "koreanName": "🎞️ 메뉴 호버 시 마이크로 비디오 엿보기 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "메뉴에 마우스를 올리면 작은 썸네일 영상이 재생되며 흥미를 유발",
    "wireframeShape": "nav-video-reel-peek-header",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Micro Video Reel Peek on Menu Hover Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-multi-brand-switcher",
    "part": "nav_footer",
    "name": "Parent Company Multi-Brand Switcher Nav",
    "koreanName": "🏢 모회사 산하 패밀리 브랜드 셀렉터 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "상단 초미니 바에서 계열사 4개 서비스 간을 자유롭게 오가는 스위처",
    "wireframeShape": "nav-multi-brand-switcher",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Parent Company Multi-Brand Switcher Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-live-cluster-health-light",
    "part": "nav_footer",
    "name": "Live Cluster Health Pulse Indicator Nav",
    "koreanName": "🟢 실시간 클러스터 헬스 펄스 라이트 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "우측 상단에 작은 녹색 불이 반짝이며 `All Systems Normal`을 알림",
    "wireframeShape": "nav-live-cluster-health-light",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Live Cluster Health Pulse Indicator Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-dark-light-mode-toggle",
    "part": "nav_footer",
    "name": "Tactile Sliding Sun/Moon Theme Toggle Nav",
    "koreanName": "🌓 슬라이딩 해/달 테마 스위치 내장 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "해와 달 아이콘이 부드럽게 굴러가며 라이트/다크 모드를 바꾸는 스위치",
    "wireframeShape": "nav-dark-light-mode-toggle",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Tactile Sliding Sun/Moon Theme Toggle Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-quick-demo-launcher",
    "part": "nav_footer",
    "name": "Instant 60-Sec Demo Launcher Modal Nav",
    "koreanName": "🚀 즉석 60초 인터랙티브 데모 팝업 버튼 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "상단바에서 바로 팝업창을 띄워 핵심 기능을 1분 만에 둘러보는 버튼",
    "wireframeShape": "nav-quick-demo-launcher",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Instant 60-Sec Demo Launcher Modal Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-glassmorphism-frosted-deep",
    "part": "nav_footer",
    "name": "Deep 60px Frosted Glass Blur Sticky Nav",
    "koreanName": "❄️ 딥 60px 프로스티드 글래스 블러 스티키 GNB",
    "trend": "Liquid Glass",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "유리 뒤로 지나가는 본문 텍스트가 안개처럼 환상적으로 번지는 글래스 바",
    "wireframeShape": "nav-glassmorphism-frosted-deep",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Deep 60px Frosted Glass Blur Sticky Nav designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-nav-isometric-cube-logo",
    "part": "nav_footer",
    "name": "3D Rotating Isometric Cube Logo Nav",
    "koreanName": "🧊 3D 회전 아이소메트릭 큐브 로고 GNB",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "좌측 상단에서 3D 큐브 로고가 마우스 시선에 따라 각도를 바꾸는 인터랙티브",
    "wireframeShape": "nav-isometric-cube-logo",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 3D Rotating Isometric Cube Logo Nav designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-classic-4col-sitemap",
    "part": "nav_footer",
    "name": "Classic 4-Column Enterprise Categorized Sitemap",
    "koreanName": "🏛️ 클래식 4단 엔터프라이즈 카테고리 사이트맵",
    "trend": "Minimalist Editorial",
    "gridGeometry": "bento-3col",
    "focalAnchor": "hybrid",
    "density": "compact",
    "description": "제품, 솔루션, 회사, 법적 고지가 4개의 단정한 열로 깔끔히 정렬된 정통 푸터",
    "wireframeShape": "footer-classic-4col-sitemap",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "bento-3col structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Classic 4-Column Enterprise Categorized Sitemap designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-newsletter-signup-split",
    "part": "nav_footer",
    "name": "5-Column Mega Footer with Live Newsletter Box",
    "koreanName": "📬 5단 메가 푸터 & 뉴스레터 구독 박스 일체형",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "좌측에 최신 테크 리포트 구독 인풋, 우측에 4단 링크가 펼쳐진 종합 푸터",
    "wireframeShape": "footer-newsletter-signup-split",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: 5-Column Mega Footer with Live Newsletter Box designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-giant-brand-lettermark",
    "part": "nav_footer",
    "name": "Monumental Brand Lettermark Brutalist Footer",
    "koreanName": "📰 모뉴멘탈 자이언트 브랜드 레터마크 푸터",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "화면 가로폭 전체를 꽉 채우는 120pt 초대형 로고 타이포가 압도하는 엔딩",
    "wireframeShape": "footer-giant-brand-lettermark",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Monumental Brand Lettermark Brutalist Footer designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-minimal-1line-strip",
    "part": "nav_footer",
    "name": "Ultra-Minimalist 1-Line Copyright & Social Strip",
    "koreanName": "📏 울트라 미니멀 1-라인 저작권 & 소셜 스트립",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "여백을 아끼고 단 한 줄의 깔끔한 가로선 위에 카피라이트와 SNS 링크만 배치",
    "wireframeShape": "footer-minimal-1line-strip",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Ultra-Minimalist 1-Line Copyright & Social Strip designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-terminal-cli-command",
    "part": "nav_footer",
    "name": "Terminal Monospace Command-Line Footer",
    "koreanName": "💻 터미널 모노스페이스 커맨드라인 푸터",
    "trend": "Linear HUD",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "`$ core --version 2.6.0` 텔레메트리 정보와 깃허브 커밋 해시가 각인된 푸터",
    "wireframeShape": "footer-terminal-cli-command",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Linear HUD visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Terminal Monospace Command-Line Footer designed in Linear HUD aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-bento-grid-widgets",
    "part": "nav_footer",
    "name": "Bento Grid Modular Footer with Status & Links",
    "koreanName": "🍱 벤토 그리드 모듈러 푸터 (서버 상태 + 소셜)",
    "trend": "Minimalist Editorial",
    "gridGeometry": "bento-12col",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "각기 다른 사각 카드 안에 상태판, 뉴스레터, 링크, 어워드가 정돈된 벤토",
    "wireframeShape": "footer-bento-grid-widgets",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "bento-12col structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Bento Grid Modular Footer with Status & Links designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-global-office-locations",
    "part": "nav_footer",
    "name": "Multi-Region Global Office Cards (SF/Seoul/London)",
    "koreanName": "🗺️ 글로벌 지사 카드 푸터 (샌프란시스코/서울/런던)",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "세계 3대 거점 지사의 현지 시각, 사무실 주소, 연락처가 담긴 글로벌 푸터",
    "wireframeShape": "footer-global-office-locations",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Multi-Region Global Office Cards (SF/Seoul/London) designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-infinite-social-marquee",
    "part": "nav_footer",
    "name": "Infinite Rolling Social Icon & Tag Marquee Footer",
    "koreanName": "🌊 무한 롤링 소셜 아이콘 & 해시태그 마퀴 푸터",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "디스코드, X, 깃허브, 유튜브 아이콘이 가로로 끝없이 흘러가는 역동적 푸터",
    "wireframeShape": "footer-infinite-social-marquee",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Infinite Rolling Social Icon & Tag Marquee Footer designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-statuspage-live-embed",
    "part": "nav_footer",
    "name": "Embedded Live StatusPage 90-Day History Footer",
    "koreanName": "🟢 90일 무중단 가동 이력 위젯 내장 푸터",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "푸터 하단에 최근 90일간의 서버 가동률 막대가 실시간 임베드된 신뢰 푸터",
    "wireframeShape": "footer-statuspage-live-embed",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Embedded Live StatusPage 90-Day History Footer designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-legal-regulatory-accordion",
    "part": "nav_footer",
    "name": "Collapsible Legal & Regulatory Compliance Accordion",
    "koreanName": "📜 접이식 법적 고지 & 규제 준수 아코디언 푸터",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "이용약관, 개인정보처리방침, 사업자정보를 깔끔하게 접었다 펴는 구조",
    "wireframeShape": "footer-legal-regulatory-accordion",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Collapsible Legal & Regulatory Compliance Accordion designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-oled-luxury-dark",
    "part": "nav_footer",
    "name": "OLED Deep Black Luxury High-Fashion Footer",
    "koreanName": "🌌 OLED 딥블랙 럭셔리 하이패션 푸터",
    "trend": "Liquid Glass",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "칠흑 같은 블랙 배경 위에 0.5px 미세 은색 헤어라인과 얇은 세리프 링크",
    "wireframeShape": "footer-oled-luxury-dark",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Liquid Glass visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: OLED Deep Black Luxury High-Fashion Footer designed in Liquid Glass aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-back-to-top-floating",
    "part": "nav_footer",
    "name": "Back-to-Top Rocket Button Integrated Footer",
    "koreanName": "🚀 맨 위로 가기 로켓 버튼 일체형 푸터",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "클릭 시 스크롤이 부드럽게 최상단으로 솟구쳐 올라가는 인터랙션 버튼 탑재",
    "wireframeShape": "footer-back-to-top-floating",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Back-to-Top Rocket Button Integrated Footer designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-app-store-badges-dual",
    "part": "nav_footer",
    "name": "App Store & Google Play Official Download Badges",
    "koreanName": "📲 앱스토어 & 구글플레이 공식 다운로드 배지 푸터",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "스마트폰 앱을 손쉽게 내려받을 수 있는 공식 앱 마켓 블랙 배지 진열",
    "wireframeShape": "footer-app-store-badges-dual",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: App Store & Google Play Official Download Badges designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-timezone-clock-matrix",
    "part": "nav_footer",
    "name": "Realtime World Timezone Clocks (KST/PST/UTC)",
    "koreanName": "⏱️ 실시간 세계 주요 도시 시계 매트릭스 푸터",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "서울, 런던, 뉴욕의 현재 시각이 초 단위로 째깍거리는 인터내셔널 감성",
    "wireframeShape": "footer-timezone-clock-matrix",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Realtime World Timezone Clocks (KST/PST/UTC) designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-brand-mascot-illustration",
    "part": "nav_footer",
    "name": "Charming 3D Brand Mascot Character Farewell",
    "koreanName": "👋 친근한 3D 브랜드 마스코트 작별 인사 푸터",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "귀여운 3D 캐릭터가 손을 흔들며 다음 방문을 기약하는 따뜻한 무드",
    "wireframeShape": "footer-brand-mascot-illustration",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Charming 3D Brand Mascot Character Farewell designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-swiss-broadside-columns",
    "part": "nav_footer",
    "name": "Swiss Strict Broadside 6-Column Grid Footer",
    "koreanName": "📐 스위스 엄격한 브로드시트 6단 그리드 푸터",
    "trend": "Swiss & Neo-Brutalist",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "스위스 양식의 엄격한 6분할 그리드선 위에 일목요연하게 정리된 방대한 링크",
    "wireframeShape": "footer-swiss-broadside-columns",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Swiss & Neo-Brutalist visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Swiss Strict Broadside 6-Column Grid Footer designed in Swiss & Neo-Brutalist aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-investor-relations-esg",
    "part": "nav_footer",
    "name": "Investor Relations & ESG Sustainability Links",
    "koreanName": "📊 투자자 정보(IR) & ESG 지속가능경영 푸터",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "투자사 공시 보고서, 주주 서한, 친환경 지속가능성 리포트 전용 링크 열",
    "wireframeShape": "footer-investor-relations-esg",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Investor Relations & ESG Sustainability Links designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-customer-support-cards",
    "part": "nav_footer",
    "name": "Quick Customer Support Helpline Cards Footer",
    "koreanName": "🎧 고객센터 핫라인 & 1:1 상담 접수 카드 푸터",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "운영 시간, 카카오톡 상담, 이메일 문의 채널을 큼직한 3개 카드로 강조",
    "wireframeShape": "footer-customer-support-cards",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Quick Customer Support Helpline Cards Footer designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-community-discord-showcase",
    "part": "nav_footer",
    "name": "Community Hub Showcase with Member Count Badge",
    "koreanName": "👾 커뮤니티 허브 푸터 (디스코드 2만 명 참여 배지)",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "열정적인 사용자 커뮤니티로 연결되는 전용 초대장 배너가 포함된 엔딩",
    "wireframeShape": "footer-community-discord-showcase",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Community Hub Showcase with Member Count Badge designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-security-certification-strip",
    "part": "nav_footer",
    "name": "Full Security Certification Official Shield Bar",
    "koreanName": "🛡️ 보안 인증 마크(ISO/SOC2) 공식 실드 바 푸터",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "국제 정보보호 인증 로고 6종이 금속 질감 배지로 단정하게 진열된 하단 바",
    "wireframeShape": "footer-security-certification-strip",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Full Security Certification Official Shield Bar designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-career-hiring-banner",
    "part": "nav_footer",
    "name": "“We Are Hiring! Join Our Team” Pulse Banner",
    "koreanName": "💼 “우리는 채용 중입니다! 12개 직군 오픈” 배너",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "초록색 인재 영입 펄스 배지와 함께 채용 공고 페이지로 유도하는 배너",
    "wireframeShape": "footer-career-hiring-banner",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: “We Are Hiring! Join Our Team” Pulse Banner designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-product-changelog-teaser",
    "part": "nav_footer",
    "name": "Latest Changelog v2.6 Release Notes Teaser",
    "koreanName": "📦 최신 릴리즈 v2.6 변경점 티저 위젯 푸터",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "“신규 기능 4종 추가, 속도 20% 개선” 최신 패치노트 한 줄 티저",
    "wireframeShape": "footer-product-changelog-teaser",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Latest Changelog v2.6 Release Notes Teaser designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-api-docs-rss-feed",
    "part": "nav_footer",
    "name": "Developer RSS Feed & API Documentation Quickbar",
    "koreanName": "📡 개발자 RSS 피드 & API 도큐먼트 퀵바 푸터",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "엔지니어들이 즐겨찾는 기술 블로그 RSS 및 API 참조 링크 모음",
    "wireframeShape": "footer-api-docs-rss-feed",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Developer RSS Feed & API Documentation Quickbar designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-ambient-aurora-glow",
    "part": "nav_footer",
    "name": "Subtle Ambient Aurora Glow Behind Footer Canvas",
    "koreanName": "🌌 푸터 캔버스 뒷배경 은은한 오로라 글로우",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "웹사이트의 가장 마지막 바닥에서 은은하게 피어오르는 보라색 앰비언트 빛",
    "wireframeShape": "footer-ambient-aurora-glow",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Subtle Ambient Aurora Glow Behind Footer Canvas designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-trademark-open-source",
    "part": "nav_footer",
    "name": "Open Source MIT License & Attribution Block",
    "koreanName": "⚖️ 오픈소스 MIT 라이선스 & 오픈소스 기여 표기",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "누구나 자유롭게 기여할 수 있는 오픈소스 정신을 명시한 라이선스 블록",
    "wireframeShape": "footer-trademark-open-source",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Open Source MIT License & Attribution Block designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-multi-language-flag-picker",
    "part": "nav_footer",
    "name": "Country Flag Multi-Language Selector Dropdown",
    "koreanName": "🚩 국기 아이콘 다국어 셀렉터 드롭다운 푸터",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "전 세계 16개국 국기 아이콘과 함께 로컬라이제이션을 지원하는 선택기",
    "wireframeShape": "footer-multi-language-flag-picker",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Country Flag Multi-Language Selector Dropdown designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-micro-site-quicktabs",
    "part": "nav_footer",
    "name": "Ecosystem Micro-Sites Quick Tab Switcher",
    "koreanName": "🌐 패밀리 마이크로사이트 퀵 탭 스위처 푸터",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "블로그, 문서, 포럼, 쇼케이스 등 4개 서브 도메인을 1클릭 전환",
    "wireframeShape": "footer-micro-site-quicktabs",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Ecosystem Micro-Sites Quick Tab Switcher designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-mobile-accordion-stack",
    "part": "nav_footer",
    "name": "Mobile-Optimized Seamless Accordion Footer",
    "koreanName": "📱 모바일 최적화 원터치 아코디언 폴딩 푸터",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "모바일 화면에서 수직 길이가 늘어지지 않도록 깔끔하게 접히는 아코디언",
    "wireframeShape": "footer-mobile-accordion-stack",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Mobile-Optimized Seamless Accordion Footer designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-minimal-centered-credits",
    "part": "nav_footer",
    "name": "Artistic Museum Catalog Centered Credits Footer",
    "koreanName": "🏛️ 미술관 도록풍 중앙 정렬 크레딧 푸터",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "기획자, 디자이너, 개발자의 이름이 영화 엔딩 크레딧처럼 우아하게 흐름",
    "wireframeShape": "footer-minimal-centered-credits",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Artistic Museum Catalog Centered Credits Footer designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  },
  {
    "id": "nav_footer-footer-dynamic-quote-generator",
    "part": "nav_footer",
    "name": "Daily Inspiring Design Philosophy Quote Footer",
    "koreanName": "💬 오늘의 디자인 영감 명언 한 줄 생성 푸터",
    "trend": "Minimalist Editorial",
    "gridGeometry": "1col-center",
    "focalAnchor": "hybrid",
    "density": "balanced",
    "description": "페이지를 새로고침할 때마다 세계적 거장 디자이너들의 명언이 랜덤 출력",
    "wireframeShape": "footer-dynamic-quote-generator",
    "keyFeatures": [
      "글로벌 디자인 트렌드",
      "완벽한 정보 아키텍처",
      "반응형 모바일 지원"
    ],
    "tags": [
      "Navigation",
      "Footer",
      "Information-Architecture"
    ],
    "promptDirectives": {
      "figma": "1col-center structure in Figma Auto-Layout, Minimalist Editorial visual language with 16px/24px padding and structured hierarchy",
      "tailwind": "w-full py-12 px-4 md:px-8 relative",
      "aiImage": "High-fidelity production web component: Daily Inspiring Design Philosophy Quote Footer designed in Minimalist Editorial aesthetic, crisp detail, modern 2026 UI"
    },
    "customOptions": {
      "showBadge": true,
      "showSecondaryCta": true,
      "showGridLines": false,
      "showSparkline": false
    }
  }
];

export const HERO_LAYOUTS = ALL_LAYOUT_REFERENCES.filter(r => r.part === 'hero');
export const FEATURE_LAYOUTS = ALL_LAYOUT_REFERENCES.filter(r => r.part === 'feature');
export const PROOF_LAYOUTS = ALL_LAYOUT_REFERENCES.filter(r => r.part === 'proof');
export const PRICING_LAYOUTS = ALL_LAYOUT_REFERENCES.filter(r => r.part === 'pricing');
export const CTA_LAYOUTS = ALL_LAYOUT_REFERENCES.filter(r => r.part === 'cta');
export const NAV_FOOTER_LAYOUTS = ALL_LAYOUT_REFERENCES.filter(r => r.part === 'nav_footer');

export function getLayoutsByPart(part: ReferencePartKey): LayoutReference[] {
  return ALL_LAYOUT_REFERENCES.filter(r => r.part === part);
}

export function getLayoutById(id: string): LayoutReference | undefined {
  return ALL_LAYOUT_REFERENCES.find(r => r.id === id);
}
