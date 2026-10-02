export interface ComponentSlot {
  id: string;
  label: string;
  defaultText: string;
  type: 'title' | 'metric' | 'badge' | 'body' | 'date' | 'tag';
}

export interface VisualComponent {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnailIcon: string;
  slots: Record<string, string>;
  layoutType: string;
  specs: {
    heightRatio: string;
    columns?: number;
    visualElements: string[];
    contractDescription: string;
  };
}

export interface SubPurposeOption {
  id: string;
  title: string;
  badge: string;
  desc: string;
  /** 이 세부 목적 선택 시 자동 적용할 TailoredMoodOption.id */
  recommendedMoodId: string;
  /** 캔버스에 표시할 세부 목적별 차별화된 샘플 헤드라인 */
  sampleHeadline: string;
}

export interface TailoredMoodOption {
  id: string;
  title: string;
  badge: string;
  desc: string;
  icon: string;
  recommendedThemeId: string;
  recommendedStyleId: string;
  focalAnchor: 'visual' | 'video' | 'typo' | 'data' | 'hybrid' | 'interactive';
  aiDirective: string;
  bundleId?: string;
}

export interface DesignDomain {
  id: string;
  name: string;
  koreanName: string;
  icon: string;
  canvasAspect: '16:9' | '1:1' | '4:5' | 'vertical-scroll' | 'horizontal-banner' | 'a4-vertical';
  aspectRatioClass: string;
  description: string;
  defaultHeadline: string;
  subPurposes: SubPurposeOption[];
  tailoredMoods: TailoredMoodOption[];
  components: VisualComponent[];
  sampleContent: {
    title: string;
    rawText: string;
  };
}

export const DESIGN_DOMAINS: DesignDomain[] = [
  {
    id: 'ppt',
    name: 'Presentation & Pitch Deck',
    koreanName: '📊 PPT / 발표 슬라이드',
    icon: 'Presentation',
    canvasAspect: '16:9',
    aspectRatioClass: 'aspect-[16/9]',
    description: '16:9 와이드스크린 피치덱, 비즈니스 제안서 및 성과 보고 슬라이드',
    defaultHeadline: '2026 Q3 비즈니스 성장 성과 및 Q4 실행 로드맵',
    subPurposes: [
      { id: 'ppt-growth-data', title: '📊 통계·차트 중심 성장 피치덱 (Growth & Charts)', badge: '차트·통계 특화', desc: '분기별 매출 막대 차트, ARR 추세선, TAM-SAM-SOM 도넛, 전환 퍼널 시각화', recommendedMoodId: 'ppt-mood-data-charts', sampleHeadline: 'Series B 52억 달성: 분기 매출 240% 폭발 성장 및 LTV:CAC 5.8x 달성' },
      { id: 'ppt-vc', title: '스타트업 IR 투자 유치 (피치덱)', badge: 'VC 투자용', desc: '투자 심사역을 설득하는 핵심 지표, 비즈니스 모델, 트랙션', recommendedMoodId: 'ppt-mood-vc', sampleHeadline: 'Series B 투자 유치: MAU 240% 성장, ARR 52억 돌파' },
      { id: 'ppt-market-tam', title: '시장 규모 & 경쟁 우위 분석 (TAM-SAM-SOM)', badge: '시장 분석용', desc: '12조 원 시장 동심원 다이어그램, 45% 엔터프라이즈 도넛, 2x2 경쟁사 포지셔닝', recommendedMoodId: 'ppt-mood-data-charts', sampleHeadline: '12조 원 AI 자동화 시장 선점: TAM-SAM-SOM 분석 및 독점 우위' },
      { id: 'ppt-keynote', title: '신제품 키노트 & 비전 선포', badge: '키노트용', desc: '압도적 화보와 1줄 킬러 쿼트로 청중을 사로잡는 발표', recommendedMoodId: 'ppt-mood-keynote', sampleHeadline: '우리는 불가능을 디자인합니다' },
      { id: 'ppt-strategy', title: '분기 성과 및 경영 전략 보고', badge: '경영 보고', desc: '임원 보고용 구조화된 2x2 매트릭스와 3대 핵심 추진 기둥', recommendedMoodId: 'ppt-mood-mckinsey', sampleHeadline: '2026 Q3 성과 분석 및 Q4 전략 기둥 3대 추진 보고' },
      { id: 'ppt-solution', title: '기업 솔루션 도입 제안서', badge: 'B2B 제안', desc: '고객사의 고통(Before)을 자사 솔루션(After)으로 전환', recommendedMoodId: 'ppt-mood-contrast', sampleHeadline: '수작업 3시간 → AI 자동화 30초: 업무 혁신 제안' },
    ],
    tailoredMoods: [
      {
        id: 'ppt-mood-data-charts',
        title: '데이터 사이언스 & 비주얼 차트 피치',
        badge: 'Visual Charts 4대 시각화',
        desc: '그라데이션 분기 막대 차트, 동심원 TAM-SAM-SOM, 단계별 전환 퍼널, LTV/CAC 게이지',
        icon: '📊',
        recommendedThemeId: 'emerald-tech',
        recommendedStyleId: 'bento-grid',
        focalAnchor: 'data',
        bundleId: 'bundle-ppt-data-pitch',
        aiDirective: 'Data-Driven Pitch Deck: Emphasize high-contrast vector data visualizations, quarterly revenue bar charts with growth trendlines, TAM-SAM-SOM concentric circles, conversion funnel drop-off stages, and unit economics KPI gauges.',
      },
      {
        id: 'ppt-mood-vc',
        title: 'VC 투자 유치 & 성장 지표',
        badge: 'Big KPI 56pt',
        desc: '투자자 시선을 고정하는 56pt 초대형 숫자, YoY 상승률 뱃지, 트랙션 위주 구조',
        icon: '📈',
        recommendedThemeId: 'emerald-tech',
        recommendedStyleId: 'bento-grid',
        focalAnchor: 'data',
        bundleId: 'bundle-ppt-vc-pitch',
        aiDirective: 'VC Pitch Deck Style: Focus on massive 56pt traction metrics, green growth delta badges, structured 3-card metrics, and strategic executive takeaways.',
      },
      {
        id: 'ppt-mood-keynote',
        title: '애플식 키노트 비전 선포',
        badge: '1줄 킬러 쿼트',
        desc: '화면 전체를 지배하는 고화질 현장 화보와 56pt 단 한 줄의 임팩트 선언문',
        icon: '📸',
        recommendedThemeId: 'champagne-gold',
        recommendedStyleId: 'dark-oled',
        focalAnchor: 'visual',
        bundleId: 'bundle-ppt-keynote-visual',
        aiDirective: 'Executive Keynote Style: Full-bleed dramatic cinematic photo backdrop with ambient dark vignette and single 56pt killer vision statement.',
      },
      {
        id: 'ppt-mood-mckinsey',
        title: '맥킨지식 구조화 전략 보고',
        badge: '2x2 & 3대 기둥',
        desc: '엄격한 사분면 포지셔닝 매트릭스와 3대 전략 기둥, 공신력 있는 데이터 출처 각주',
        icon: '🏛️',
        recommendedThemeId: 'ocean-cyan',
        recommendedStyleId: 'swiss-minimal',
        focalAnchor: 'data',
        bundleId: 'bundle-ppt-strategy-mckinsey',
        aiDirective: 'Management Consulting Style: Structured 2x2 quadrant positioning matrix, 3-pillar architectural cards, and authoritative 10pt research citations.',
      },
      {
        id: 'ppt-mood-contrast',
        title: '문제 해결 Before vs After',
        badge: '50:50 극대비',
        desc: '기존 방식의 비효율(레드/흑백) vs 자사 솔루션 혁신(그린/컬러) 5:5 대조',
        icon: '⚖️',
        recommendedThemeId: 'sunset-coral',
        recommendedStyleId: 'bento-grid',
        focalAnchor: 'hybrid',
        bundleId: 'bundle-ppt-contrast-solution',
        aiDirective: 'Problem-Solution Tension Style: Dramatic 50:50 side-by-side comparison container contrasting manual pain-points against automated AI velocity.',
      },
    ],
    sampleContent: {
      title: 'Series B 투자 유치: 매출 성장 및 시장 분석 피치덱',
      rawText: `[1. 재무 및 트랙션 성장 (Financial Growth)]
- 2026 Q1 매출: 12.0억원
- 2026 Q2 매출: 21.5억원 (QoQ +79%)
- 2026 Q3 매출: 34.2억원 (QoQ +59%)
- 2026 Q4 (예상): 52.4억원 (YoY +240% 폭발 성장)
- 누적 연간 반복 매출(ARR): 52.4억원 달성
- 순매출 유지율(NDR): 134.8%

[2. 시장 기회 분석 (TAM-SAM-SOM)]
- TAM (전체 시장): 12조원 (글로벌 생성형 UI/UX & AI 자동화 시장)
- SAM (유효 시장): 2.4조원 (아시아-태평양 B2B 엔터프라이즈 솔루션)
- SOM (수익 가능 시장): 3,500억원 (국내 및 초기 진출 타겟 고객군, CAGR 34.2%)
- 고객군 비중: 엔터프라이즈 45%, 테크 SaaS 32%, 커머스 15%, 에이전시 8%

[3. 고객 획득 및 전환 퍼널 (Acquisition & Retention Funnel)]
- 월간 방문자(Traffic): 125,000명 (100%)
- 무료 체험 가입(Trial): 42,000명 (33.6% 전환)
- 유료 플랜 전환(Paid): 18,500명 (14.8% 전환)
- 12개월 장기 리텐션(Retention): 92.4% (이탈률 0.6% 미만)

[4. 단위 경제성 (Unit Economics)]
- 고객 생애 가치(LTV): 380만원
- 고객 획득 비용(CAC): 65만원
- LTV : CAC 비율: 5.8배 (투자 유치 적격 기준 3.0x 대비 1.9배 우수)
- CAC 회수 기간(Payback Period): 3.2개월 (업계 평균 12개월 대비 4배 신속)`,
    },
    components: [
      {
        id: 'ppt-chart-growth',
        name: '분기별 매출 성장 막대 & 추세선 차트',
        category: 'Metrics & Data',
        description: 'Q1~Q4 막대그래프(12억→21억→34억→52.4억) 및 상향 돌파 추세선, YoY +240% 지표',
        thumbnailIcon: 'BarChart3',
        slots: {
          slot1_metric: '₩52.4억',
          slot1_label: '2026 Q4 ARR',
          slot1_badge: '+240% YoY',
          slot2_metric: '134.8%',
          slot2_label: '순유지율(NDR)',
          slot2_badge: '업계 1위',
          slot3_metric: '5.8x',
          slot3_label: 'LTV : CAC',
          slot3_badge: '고효율',
        },
        layoutType: 'quarterly-growth-bar',
        specs: {
          heightRatio: '55%',
          columns: 4,
          visualElements: ['분기별 그라데이션 막대', 'SVG 상향 추세선', 'YoY +240% 알약 뱃지', 'BEP 손익분기점 노드'],
          contractDescription: 'Q1~Q4 4분기 막대 차트와 상단 3단 핵심 KPI 요약 카드, 상향 추세선 곡선 결합',
        },
      },
      {
        id: 'ppt-chart-tam',
        name: 'TAM-SAM-SOM 시장 규모 동심원 & 도넛',
        category: 'Metrics & Data',
        description: '12조 원 시장 3단계 동심원 타겟 다이어그램과 45% 엔터프라이즈 세그먼트 도넛 차트',
        thumbnailIcon: 'PieChart',
        slots: {
          slot1_metric: '₩12조',
          slot1_label: 'TAM 전체 시장',
          slot1_badge: '글로벌',
          slot2_metric: '₩2.4조',
          slot2_label: 'SAM 유효 시장',
          slot2_badge: 'APAC B2B',
          slot3_metric: '₩3,500억',
          slot3_label: 'SOM 타겟 시장',
          slot3_badge: 'CAGR +34%',
        },
        layoutType: 'tam-sam-som-donut',
        specs: {
          heightRatio: '50%',
          columns: 2,
          visualElements: ['3단계 동심원 레이어', 'SVG 벡터 세그먼트 도넛', 'CAGR 뱃지', '컬러 도트 범례'],
          contractDescription: '좌측 동심원 시장 깔때기(12조/2.4조/3500억) vs 우측 4색 고객군 도넛 차트',
        },
      },
      {
        id: 'ppt-kpi',
        name: '3단 KPI 대형 숫자 카드',
        category: 'Metrics & Data',
        description: '48pt 대형 하이라이트 숫자와 전년비 증감 뱃지가 포함된 3열 카드',
        thumbnailIcon: 'TrendingUp',
        slots: {
          slot1_metric: '52.4억',
          slot1_label: '분기 매출',
          slot1_badge: '+240% YoY',
          slot2_metric: '38,500명',
          slot2_label: '정기 구독자',
          slot2_badge: '유지율 92%',
          slot3_metric: '78점',
          slot3_label: '고객 NPS',
          slot3_badge: '업계 1위',
        },
        layoutType: 'kpi-3-card',
        specs: {
          heightRatio: '45%',
          columns: 3,
          visualElements: ['대형 숫자 48pt 볼드', '알약형 상승률 뱃지', '미세 1px 서피스 테두리', '서브 레이블'],
          contractDescription: '가로 3분할 대등한 라운드 카드. 상단 48pt 메트릭 볼드 + 중단 라벨 + 하단 전년비 상승률 뱃지',
        },
      },
      {
        id: 'ppt-timeline',
        name: '4단계 수평 로드맵 타임라인',
        category: 'Roadmap & Process',
        description: '가로 연결선과 마일스톤 도트 노드로 구성된 단계별 실행 계획',
        thumbnailIcon: 'Milestone',
        slots: {
          step1_date: '10월',
          step1_title: 'AI 추천 엔진 2.0',
          step1_desc: '개인 맞춤 식단 알고리즘 배포',
          step2_date: '11월',
          step2_title: '새벽 배송망 전국화',
          step2_desc: '콜드체인 풀필먼트 100% 완공',
          step3_date: '12월',
          step3_title: 'B2B 오피스 플랜',
          step3_desc: '기업 복지 케어 솔루션 공식 출시',
        },
        layoutType: 'horizontal-timeline',
        specs: {
          heightRatio: '35%',
          columns: 3,
          visualElements: ['수평 연결 액시스 라인', '원형 노드 뱃지', '단계별 월(Month) 태그', '핵심 액션 불릿'],
          contractDescription: '수평 프로세스 바와 3개의 단계별 노드. 노드 상단 시기 태그 + 중단 목표 볼드 + 하단 1줄 요약',
        },
      },
      {
        id: 'ppt-vs',
        name: 'Before vs After 2단 대비표',
        category: 'Comparison',
        description: '문제점(Problem)과 해결책(Solution)을 극적으로 대비하는 2단 카드',
        thumbnailIcon: 'Columns2',
        slots: {
          before_title: '기존 방식의 문제점 (Before)',
          before_point1: '주문 후 배송까지 3일 이상 소요',
          before_point2: '불필요한 플라스틱 쓰레기 다량 배출',
          after_title: '솔루션 도입 후 변화 (After)',
          after_point1: '밤 11시 주문 시 익일 새벽 7시 문앞 도착',
          after_point2: '100% 생분해성 에코 패키징 전면 적용',
        },
        layoutType: 'vs-comparison',
        specs: {
          heightRatio: '45%',
          columns: 2,
          visualElements: ['대비 색상 분할', '❌ 경고 아이콘 / ✨ 해결 아이콘', '전환 화살표 뱃지'],
          contractDescription: '좌측 문제점 카드(레드/그레이 톤) vs 우측 솔루션 카드(프라이머리/그린 톤) 5:5 대비 구조',
        },
      },
      {
        id: 'ppt-grid',
        name: '3열 피처 카드 그리드',
        category: 'Features',
        description: '아이콘 컨테이너와 소제목, 2줄 설명으로 구성된 핵심 강점 그리드',
        thumbnailIcon: 'LayoutGrid',
        slots: {
          feature1_title: '당일 수확 신선 보증',
          feature1_desc: '산지 직송 스마트팜 제휴로 신선도 극대화',
          feature2_title: '영양사 1:1 맞춤 설계',
          feature2_desc: '체성분 분석 기반 최적 칼로리 식단 제공',
          feature3_title: '친환경 제로웨이스트',
          feature3_desc: '모든 용기 수거 및 친환경 업사이클링',
        },
        layoutType: 'feature-grid-3',
        specs: {
          heightRatio: '40%',
          columns: 3,
          visualElements: ['원형 아이콘 배경', '18pt 볼드 소제목', '13pt 서브 텍스트'],
          contractDescription: '균등 3단 카드. 각 카드 상단에 테마 아이콘, 중단 타이틀, 하단 2줄 요약 설명',
        },
      },
      {
        id: 'ppt-callout',
        name: '핵심 시사점 인용구 콜아웃',
        category: 'Highlights',
        description: '굵은 보더 바와 대형 따옴표가 들어간 슬라이드 요약 강조 박스',
        thumbnailIcon: 'Quote',
        slots: {
          callout_text: '"고객 중심의 초신선 경험 혁신이 분기 리텐션을 2배로 견인했습니다."',
          callout_source: '- 2026 Q3 프로덕트 총괄 디렉터 코멘트',
        },
        layoutType: 'callout-box',
        specs: {
          heightRatio: '20%',
          visualElements: ['좌측 4px 프라이머리 액센트 바', '20pt 이탤릭 하이라이트 문구', '출처 서브캡션'],
          contractDescription: '슬라이드 하단에 배치되는 전폭 콜아웃 박스. 좌측 보더 강조선 + 핵심 문장 + 출처',
        },
      },
    ],
  },
  {
    id: 'web',
    name: 'Web & Landing Page',
    koreanName: '🌐 웹 / 랜딩페이지',
    icon: 'Globe',
    canvasAspect: '16:9',
    aspectRatioClass: 'aspect-[16/10]',
    description: '전환율 높은 SaaS 랜딩, 모던 서비스 소개 및 비대칭 벤토 그리드 웹',
    defaultHeadline: 'AI가 디자인하는 당신만의 차세대 프로덕트',
    subPurposes: [
      { id: 'web-video-launch', title: '🎥 다이내믹 쇼릴 & 비디오 런칭 (Video-First)', badge: '영상 중심', desc: '16:9 앰비언트 비디오 루프, 쇼릴 플레이어 스테이지, 세로 릴스 3단 그리드', recommendedMoodId: 'web-mood-video', sampleHeadline: 'Motion in Harmony — 차세대 시네마틱 비디오 아키텍처' },
      { id: 'web-agency', title: '📸 크리에이티브 에이전시 & 룩북 (Photo-First)', badge: '사진 중심', desc: '하이패션 가로 룩북 필름스트립, 60:40 비대칭 화보 스플릿, 핀터레스트 메이슨리', recommendedMoodId: 'web-mood-cinematic', sampleHeadline: '자연광과 직물의 침묵 — 2026 하이엔드 룩북 컬렉션' },
      { id: 'web-swiss-editorial', title: '🔤 스위스 모더니즘 12열 에디토리얼 (Typo-First)', badge: '타이포 중심', desc: '96pt 자이언트 서체, 무한 롤링 텍스트 마키, 12-컬럼 브로드시트 텍스트 그리드', recommendedMoodId: 'web-mood-typo-editorial', sampleHeadline: 'SWISS MODERNISM // 본질만을 남긴 순수 시각 질서' },
      { id: 'web-saas', title: '📊 B2B AI & SaaS 제품 랜딩 (Data-First)', badge: '데이터 벤토', desc: '비대칭 모듈러 벤토 그리드, 48pt 스파크라인 지표, 실시간 ARR 트랙션', recommendedMoodId: 'web-mood-bento', sampleHeadline: '1분 만에 완성하는 엔터프라이즈급 AI 디자인 시스템' },
      { id: 'web-dev', title: '💻 개발자 도구 & 오픈소스 플랫폼 (CLI Terminal)', badge: '개발자 도구', desc: 'macOS 터미널 CLI, 코드 복사, 시스템 텔레메트리', recommendedMoodId: 'web-mood-terminal', sampleHeadline: '$ npm install next-gen-ai --save → 빌드 완료 0.8s' },
      { id: 'web-consumer', title: '⚪️ 라이프스타일 미니멀 B2C 서비스', badge: 'B2C 서비스', desc: '스위스 클린 미니멀, 친근한 카드 레이아웃, 모바일 최적화', recommendedMoodId: 'web-mood-swiss', sampleHeadline: '오늘부터 시작하는 나만의 건강한 루틴' },
    ],
    tailoredMoods: [
      {
        id: 'web-mood-video',
        title: '나이키식 다이내믹 쇼릴 & 비디오',
        badge: '16:9 비디오 HUD',
        desc: '16:9 앰비언트 비디오 루프, 쇼릴 플레이어 스테이지, 타임라인 스크러버, 세로 릴스 3단',
        icon: '🎥',
        recommendedThemeId: 'ocean-cyan',
        recommendedStyleId: 'dark-oled',
        focalAnchor: 'video',
        bundleId: 'bundle-web-video-showreel',
        aiDirective: 'Dynamic Motion Showreel & Video-First: 16:9 ambient cinematic video player with play/pause ripple button, timeline scrubber bar [03:45], and 3-column vertical 9:16 mobile reels grid.',
      },
      {
        id: 'web-mood-cinematic',
        title: '자크뮈스식 럭셔리 에디토리얼 룩북',
        badge: '세로 2:3 룩북 화보',
        desc: '전폭 화보 컷, 2:3 세로 룩북 필름스트립, 60:40 비대칭 화보 스플릿, 앰비언트 비네팅',
        icon: '📸',
        recommendedThemeId: 'champagne-gold',
        recommendedStyleId: 'luxury-editorial',
        focalAnchor: 'visual',
        bundleId: 'bundle-web-cinematic-lookbook',
        aiDirective: 'Cinematic Visual Lookbook: 100vw high-fashion and architectural photography, subtle floating typography, and smooth filmstrip galleries.',
      },
      {
        id: 'web-mood-typo-editorial',
        title: '스위스 모더니즘 & 자이언트 타이포',
        badge: '96pt 키네틱 마키',
        desc: '화면 가로 폭을 채우는 96pt 디스플레이 폰트, 무한 롤링 텍스트 마키 티커, 1px 헤어라인',
        icon: '🔤',
        recommendedThemeId: 'swiss-monochrome',
        recommendedStyleId: 'swiss-minimal',
        focalAnchor: 'typo',
        bundleId: 'bundle-web-swiss-editorial',
        aiDirective: 'Swiss Modernism & Typographic-Heavy: Giant 96pt display typography, dual infinite rolling marquee tickers, strict 12-column hairline grid, and pure monochrome contrast.',
      },
      {
        id: 'web-mood-bento',
        title: '애플식 모던 벤토 SaaS',
        badge: '모듈러 2x2',
        desc: '비대칭 모듈러 박스, 48pt 스파크라인 지표, 실시간 시스템 상태 칩',
        icon: '📊',
        recommendedThemeId: 'emerald-tech',
        recommendedStyleId: 'bento-grid',
        focalAnchor: 'data',
        bundleId: 'bundle-web-bento-saas',
        aiDirective: 'Apple-Style Bento Modular: Asymmetric modular layout with 7-column hero card, live stat widgets, and clean 22px rounded borders.',
      },
      {
        id: 'web-mood-terminal',
        title: '개발자 CLI & 사이버 텔레메트리',
        badge: '모노스페이스 HUD',
        desc: 'macOS 다크 터미널 프레임, 네온 시안 발광, 라이브 펄스 상태 바',
        icon: '💻',
        recommendedThemeId: 'cyber-cyan-magenta',
        recommendedStyleId: 'cyber-glow',
        focalAnchor: 'typo',
        bundleId: 'bundle-web-brutalist-street',
        aiDirective: 'Developer CLI Terminal: Monospace typography, green glowing cursor, command-line snippets, and telemetry coordinate status bars.',
      },
      {
        id: 'web-mood-swiss',
        title: '스위스 클린 미니멀',
        badge: '여백 40% 헤어라인',
        desc: '극대화된 여백, 엄격한 12열 그리드, 1px 섬세한 헤어라인과 절제된 타이포',
        icon: '⚪️',
        recommendedThemeId: 'swiss-monochrome',
        recommendedStyleId: 'swiss-minimal',
        focalAnchor: 'typo',
        bundleId: 'bundle-web-3d-acoustics',
        aiDirective: 'Swiss International Style: 40% negative breathing space, hairline borders, bold typographic scale contrast, zero drop shadow.',
      },
    ],
    sampleContent: {
      title: '모던 클라우드 AI 협업 플랫폼 랜딩페이지',
      rawText: `[헤더 & 가치제안]
- 헤드라인: 1분 만에 완성하는 엔터프라이즈급 AI 디자인 시스템
- 서브카피: 복잡한 디자인 툴 없이, 클릭 몇 번으로 프로덕트 UI와 프로토타입 코드를 즉시 생성하세요.
- CTA: 지금 무료로 체험하기 / 14일 무료 평가판 제공

[핵심 기능 소개]
- 벤토 기능 1: AI 시각 컴포넌트 자동 결합 (100% 레이아웃 동기화)
- 벤토 기능 2: 1초 만에 반응형 코드(React/Tailwind) 추출
- 벤토 기능 3: 엔터프라이즈 보안 및 팀 실시간 협업 지원

[신뢰 요소]
- 전 세계 2,400개 이상의 테크 스타트업과 엔터프라이즈 팀이 매일 사용 중`,
    },
    components: [
      {
        id: 'web-hero',
        name: '스플릿 히어로 + 이메일 CTA',
        category: 'Hero Sections',
        description: '좌측 강렬한 가치제안 & 이메일 인풋 폼 + 우측 플로팅 인터랙션 목업',
        thumbnailIcon: 'Sparkles',
        slots: {
          badge: '⚡️ 2026년 차세대 UI 스튜디오 오픈',
          headline: '1분 만에 완성하는 엔터프라이즈 AI 디자인 시스템',
          subtext: '복잡한 툴 없이 클릭 몇 번으로 프로덕트 UI와 코드를 즉시 생성하세요.',
          cta_button: '무료로 시작하기',
          proof_text: '신용카드 등록 없이 14일간 무료 체험',
        },
        layoutType: 'split-hero',
        specs: {
          heightRatio: '55%',
          columns: 2,
          visualElements: ['반짝이는 알약 뱃지', 'H1 대형 타이포그래피', '이메일 인풋 + CTA 버튼 그룹', '플로팅 카드'],
          contractDescription: '좌측 55% 텍스트 & 전환 폼 + 우측 45% 인터랙티브 앱 프리뷰 카드',
        },
      },
      {
        id: 'web-bento',
        name: '비대칭 벤토 그리드 (3x2)',
        category: 'Grid Showcases',
        description: '다양한 크기의 라운드 박스로 주요 기능들을 매력적으로 배치하는 벤토 레이아웃',
        thumbnailIcon: 'PanelsTopLeft',
        slots: {
          card1_tag: '핵심 엔진',
          card1_title: 'AI 시각 컴포넌트 자동 결합',
          card1_desc: '선택한 블록들을 1초 만에 황금비율로 오케스트레이션합니다.',
          card2_tag: '고속 내보내기',
          card2_title: 'Tailwind + React 코드 생성',
          card2_desc: '복사해서 프로젝트에 바로 붙여넣는 프로덕션 코드',
          card3_tag: '보안 & 협업',
          card3_title: 'SOC2 인증 실시간 협업',
          card3_desc: '팀 단위 권한 관리 및 히스토리 보존',
        },
        layoutType: 'bento-grid',
        specs: {
          heightRatio: '45%',
          columns: 3,
          visualElements: ['비대칭 카드 크기 (1 큰 카드 + 2 작은 카드)', '미니 차트/그래픽 인셋', '1px 글래스 보더'],
          contractDescription: '좌측 1개 2열 메인 카드 + 우측 2개 1열 서브 카드로 구성된 비대칭 벤토 그리드',
        },
      },
      {
        id: 'web-pricing',
        name: '3단 요금제 테이블 + 월/연 토글',
        category: 'Pricing',
        description: '추천 플랜 하이라이트와 토글 스위치가 포함된 전환율 최적화 요금제 카드',
        thumbnailIcon: 'CreditCard',
        slots: {
          tier1_name: 'Starter',
          tier1_price: '$0',
          tier2_name: 'Pro (인기)',
          tier2_price: '$29 /월',
          tier3_name: 'Enterprise',
          tier3_price: '$99 /월',
        },
        layoutType: 'pricing-table',
        specs: {
          heightRatio: '45%',
          columns: 3,
          visualElements: ['토글 스위치', '중앙 Pro 카드 하이라이트 뱃지', '체크리스트 불릿', '플랜별 CTA 버튼'],
          contractDescription: '3단 카드. 중앙 추천 플랜은 프라이머리 컬러 테두리와 음영으로 시각적 1순위 강조',
        },
      },
      {
        id: 'web-ticker',
        name: '고객사 로고 무한 롤링 티커',
        category: 'Social Proof',
        description: '글로벌 파트너사/고객사 흑백 로고들이 부드럽게 가로로 흐르는 신뢰성 바',
        thumbnailIcon: 'Repeat',
        slots: {
          ticker_label: '전 세계 2,400개 이상의 팀이 함께하고 있습니다',
          logos: 'Acme Corp • Starlight AI • NextScale • Hyperion • NovaLab',
        },
        layoutType: 'logo-ticker',
        specs: {
          heightRatio: '15%',
          visualElements: ['단색 흑백 로고 배열', '은은한 페이드 아웃 좌우 마스크', '신뢰 안내 문구'],
          contractDescription: '페이지 하단 또는 히어로 하단에 위치하는 흑백 로고 티커 바',
        },
      },
    ],
  },
  {
    id: 'detail_page',
    name: 'E-Commerce Detail Page',
    koreanName: '🛍️ 이커머스 상세페이지',
    icon: 'ShoppingBag',
    canvasAspect: 'vertical-scroll',
    aspectRatioClass: 'aspect-[9/16]',
    description: '스마트스토어, 쿠팡, 와디즈 펀딩용 고전환 세로 스크롤 상세페이지',
    defaultHeadline: '단 3초 만에 차이를 느끼는 프리미엄 에어 필터',
    subPurposes: [
      { id: 'pdp-crowdfund', title: '와디즈/텀블벅 펀딩 신화', badge: '크라우드펀딩', desc: '누적 펀딩액 돌파, 3D 단면 투시도, 얼리버드 혜택 강조', recommendedMoodId: 'pdp-mood-funding-tech', sampleHeadline: '1,800% 펀딩 돌파! 5중 에어메쉬 혁신 설계' },
      { id: 'pdp-beauty', title: '럭셔리 코스메틱 & 뷰티', badge: '뷰티/코스메틱', desc: '초근접 제형 텍스처, 저자극 임상 완료, 감각적 럭셔리', recommendedMoodId: 'pdp-mood-luxury-macro', sampleHeadline: '피부과 전문의 95% 추천, 프리미엄 앰플 에센스' },
      { id: 'pdp-flashsale', title: '타임세일 파격 할인 프로모션', badge: '타임세일', desc: '오늘 자정 마감 카운트다운, 50% 할인 스티커, 결제 유도', recommendedMoodId: 'pdp-mood-flash-sale', sampleHeadline: '⚡ 오늘 밤 자정 마감! 50% 한정 특가' },
      { id: 'pdp-organic', title: '친환경 웰빙 & 오가닉 푸드', badge: '친환경/식품', desc: '자연 친화적 크라프트 질감, 산지 직송 신선 보증, 생산자 스토리', recommendedMoodId: 'pdp-mood-organic-eco', sampleHeadline: '제주 자연 그대로, 무농약 유기농 산지 직송' },
    ],
    tailoredMoods: [
      {
        id: 'pdp-mood-funding-tech',
        title: '완판 신화 크라우드펀딩',
        badge: '3D 투시 분해도',
        desc: '5중 레이어 에어메쉬 내부 단면도, 대학병원 임상 인증 엠블럼, 마감 카운트다운 타이머',
        icon: '🛍️',
        recommendedThemeId: 'ocean-cyan',
        recommendedStyleId: 'soft-ui',
        focalAnchor: 'hybrid',
        bundleId: 'bundle-pdp-million-sold',
        aiDirective: 'Crowdfunding PDP: 3D exploded architectural diagram of internal product layers, official certification badges, and sticky mobile purchase dock.',
      },
      {
        id: 'pdp-mood-luxury-macro',
        title: '프리미엄 럭셔리 & 뷰티',
        badge: '초근접 매크로 샷',
        desc: '수분 분자 및 텍스처 초근접 클로즈업, 골드 왁스 실링 안심 보증 마크, 우아한 세리프',
        icon: '👑',
        recommendedThemeId: 'champagne-gold',
        recommendedStyleId: 'luxury-editorial',
        focalAnchor: 'visual',
        bundleId: 'bundle-pdp-luxury-beauty',
        aiDirective: 'Luxury Beauty PDP: Tactile macro texture photography, golden satisfaction guarantee seal, and elegant editorial storytelling.',
      },
      {
        id: 'pdp-mood-flash-sale',
        title: '파격 특가 타임세일',
        badge: '50% 할인 스티커',
        desc: '시선을 강탈하는 50% 할인 뱃지, 실시간 초 단위 마감 시계, 하단 고정 원클릭 구매 바',
        icon: '⚡️',
        recommendedThemeId: 'vivid-yellow',
        recommendedStyleId: 'neo-brutalism',
        focalAnchor: 'data',
        bundleId: 'bundle-pdp-flash-sale',
        aiDirective: 'Urgency Flash Sale PDP: High-contrast red/yellow discount stamps, countdown timers, and friction-free purchase CTAs.',
      },
      {
        id: 'pdp-mood-organic-eco',
        title: '친환경 오가닉 힐링',
        badge: '보태니컬 웜톤',
        desc: '자연광 햇살 아래 놓인 제품 실사, 친환경 인증 직인, 유기농 원사 매크로 클로즈업',
        icon: '🌿',
        recommendedThemeId: 'warm-earth',
        recommendedStyleId: 'botanical-organic',
        focalAnchor: 'visual',
        bundleId: 'bundle-pdp-organic-healing',
        aiDirective: 'Organic Wellness PDP: Warm earthy palette, recycled paper texture feel, certified organic seals, and breathable lifestyle imagery.',
      },
    ],
    sampleContent: {
      title: '친환경 항균 텀블러 와디즈 펀딩 상세페이지',
      rawText: `[인트로 후킹]
- "아직도 무거운 보온병 들고 다니시나요?"
- 단 180g의 경량 티타늄으로 하루 종일 완벽한 24시간 보온보냉

[소비자 고민 체크리스트]
- 커피 냄새가 배어 불쾌했던 경험
- 가방 안에서 음료가 새어 낭패를 본 경험
- 환경을 생각하지만 세척이 번거로웠던 경험

[제품 핵심 스펙 분해]
- 소재: 항공우주 등급 GR5 티타늄 100%
- 진공: 듀얼 월 에어로겔 단열층 설계
- 패킹: 원터치 실리콘 누수 방지 락 시스템`,
    },
    components: [
      {
        id: 'detail-hook',
        name: '3초 후킹 인트로 비주얼',
        category: 'Intro Hook',
        description: '소비자의 시선을 멈추게 하는 대형 의문문 헤드카피와 핵심 강점 뱃지',
        thumbnailIcon: 'Flame',
        slots: {
          hook_sub: '매일 마시는 물, 아직도 찝찝하신가요?',
          hook_main: '단 180g으로 완성한 24시간 완벽 보온보냉',
          hook_badge: '와디즈 1위 달성 1,800% 펀딩 돌파',
        },
        layoutType: 'detail-intro',
        specs: {
          heightRatio: '30%',
          visualElements: ['초고대비 헤드라인 32pt', '하이라이트 형광 뱃지', '단색 감성 배경', '경량화 수치 강조'],
          contractDescription: '상세페이지 최상단 배치. 소비자의 결핍을 찌르는 후킹 질문 + 압도적 수치 강조',
        },
      },
      {
        id: 'detail-checklist',
        name: '페인포인트 공감 체크리스트',
        category: 'Pain Points',
        description: '소비자가 겪는 불편함 3가지를 짚어 문제의식을 자극하는 체크 박스',
        thumbnailIcon: 'CheckSquare',
        slots: {
          check_title: '혹시 이런 경험 있으신가요?',
          check1: '가방 안에서 음료가 흘러 소중한 물건을 망친 적',
          check2: '커피 찌든 냄새가 아무리 씻어도 빠지지 않을 때',
          check3: '무거운 텀블러 때문에 결국 외출할 때 두고 나갈 때',
        },
        layoutType: 'pain-checklist',
        specs: {
          heightRatio: '25%',
          visualElements: ['경고/체크 아이콘', '옅은 회색 라운드 컨테이너', '공감 유도 소제목'],
          contractDescription: '문제점 공감 영역. 3개의 체크박스 불릿으로 고객의 기존 고통을 환기',
        },
      },
      {
        id: 'detail-breakdown',
        name: '제품 핵심 스펙 3단 분해 단면도',
        category: 'Product Specs',
        description: '제품의 내부 구조와 핵심 소재 기술을 3개 카드로 설명하는 스펙 블록',
        thumbnailIcon: 'Layers',
        slots: {
          layer1_title: 'GR5 항공 티타늄 외벽',
          layer1_desc: '기스 없는 내구성과 깃털 같은 초경량 무게',
          layer2_title: '에어로겔 듀얼 진공층',
          layer2_desc: '외부 열 전달을 99.8% 차단하는 극강 단열',
          layer3_title: '원터치 무독성 실리콘 락',
          layer3_desc: '뒤집어도 1방울도 새지 않는 완벽 밀폐 설계',
        },
        layoutType: 'product-layers',
        specs: {
          heightRatio: '35%',
          columns: 3,
          visualElements: ['층별 단면도 번호 뱃지', '기술명 볼드', '특허 및 효과 설명'],
          contractDescription: '3단계 기술 분해 카드. 소재와 원리를 보여주어 제품의 압도적 품질을 증명',
        },
      },
      {
        id: 'detail-proof',
        name: '인증서 & 시험성적서 뱃지 그리드',
        category: 'Trust & Proof',
        description: '공인 연구기관의 유해물질 불검출 성적서와 특허 뱃지를 보여주는 신뢰 블록',
        thumbnailIcon: 'ShieldCheck',
        slots: {
          proof_title: '국가 공인 시험연구원 100% 안전 입증',
          cert1: '미세플라스틱 0% 불검출',
          cert2: '중금속 10종 불검출 인증',
          cert3: 'FDA 식품용기 승인',
        },
        layoutType: 'cert-grid',
        specs: {
          heightRatio: '20%',
          columns: 3,
          visualElements: ['골드/그린 인증 뱃지 마크', '공식 시험연구원 명칭', '안전 보증 문구'],
          contractDescription: '품질 보증 그리드. 의심을 종식시키는 3개의 인증 도장 뱃지 배열',
        },
      },
    ],
  },
  {
    id: 'card_news',
    name: 'Card News & Carousel',
    koreanName: '📱 카드뉴스 / SNS 캐러셀',
    icon: 'Smartphone',
    canvasAspect: '1:1',
    aspectRatioClass: 'aspect-square',
    description: '인스타그램 피드, 스레드, 링크드인용 3초 후킹 및 캐러셀 슬라이드',
    defaultHeadline: '모르면 손해보는 2026 AI 생산성 꿀팁 3가지',
    subPurposes: [
      { id: 'insta-tips', title: '1분 실무 꿀팁 & 저장 유도', badge: '바이럴 꿀팁', desc: '질문형 후킹 표지, O/X 팩트체크, 자가진단, 저장 유도 엔딩', recommendedMoodId: 'insta-mood-viral-tip', sampleHeadline: '모르면 손해보는 2026 AI 생산성 꿀팁 3가지' },
      { id: 'insta-fashion', title: '하이패션 & 매거진 룩북', badge: '패션/에디토리얼', desc: '4:5 세로 화보, 보그 세리프 제호, 오감 자극 매크로 질감', recommendedMoodId: 'insta-mood-vogue-mag', sampleHeadline: 'VOGUE EDIT — 2026 F/W 컬렉션 프리뷰' },
      { id: 'insta-story', title: '일상 공감 & 메신저 문답', badge: '공감 스토리', desc: '카톡/iMessage 형태 말풍선 버블, 현실적 대화 상황 재현', recommendedMoodId: 'insta-mood-chat-dialog', sampleHeadline: '팀장님 보고서 다 됐어요? — 아직이요 ㅠㅠ' },
      { id: 'insta-y2k', title: 'Z세대 스트릿 & 팝 컬처', badge: 'Gen-Z 팝', desc: '실사 누끼 컷, 홀로그램 스티커, [필독] 뱃지, 키치 감성', recommendedMoodId: 'insta-mood-y2k-street', sampleHeadline: '[필독] 요즘 MZ는 다 이렇게 한다고?! 🔥' },
    ],
    tailoredMoods: [
      {
        id: 'insta-mood-viral-tip',
        title: '바이럴 꿀팁 & 북마크 폭발',
        badge: '질문 후킹 44pt',
        desc: '형광펜 밑줄 질문형 표지, O/X 팩트체크 대조, 자가진단 체크, 북마크 저장 유도',
        icon: '💡',
        recommendedThemeId: 'emerald-tech',
        recommendedStyleId: 'bento-grid',
        focalAnchor: 'data',
        bundleId: 'bundle-insta-knowledge-save',
        aiDirective: 'Viral Knowledge Tip Carousel: Highlighter marker question punch cover, 50:50 Myth vs Fact checks, and actionable outcome-driven bookmark cards.',
      },
      {
        id: 'insta-mood-vogue-mag',
        title: '보그 스타일 하이패션 화보',
        badge: '4:5 화보 80%',
        desc: '세로 4:5 고화질 모델 화보 위에 얹힌 클래식 세리프 제호와 감각적 레이아웃',
        icon: '🏛️',
        recommendedThemeId: 'champagne-gold',
        recommendedStyleId: 'luxury-editorial',
        focalAnchor: 'visual',
        bundleId: 'bundle-insta-vogue-lookbook',
        aiDirective: 'High-Fashion Editorial Carousel: 4:5 vertical photographic cover with serif masthead, macro sensory texture details, and minimalist pagination.',
      },
      {
        id: 'insta-mood-chat-dialog',
        title: '메신저 공감 스토리텔링',
        badge: '말풍선 대화 UI',
        desc: '카카오톡/iMessage 형태의 친근한 좌우 대화 버블로 독자의 일상 고민 극적 공감',
        icon: '💬',
        recommendedThemeId: 'warm-earth',
        recommendedStyleId: 'soft-ui',
        focalAnchor: 'hybrid',
        bundleId: 'bundle-insta-chat-dialog',
        aiDirective: 'Chat Bubble Storytelling: Messenger-style speech bubbles capturing authentic relatable dialogues between two colleagues or friends.',
      },
      {
        id: 'insta-mood-y2k-street',
        title: 'Gen-Z 감성 스티커 & 팝',
        badge: 'Y2K 크롬 & 3D',
        desc: '실사 누끼 컷, 회전된 홀로그램 스티커, [필독] 뱃지가 통통 튀는 키치한 감성',
        icon: '⚡️',
        recommendedThemeId: 'vivid-yellow',
        recommendedStyleId: 'neo-brutalism',
        focalAnchor: 'visual',
        bundleId: 'bundle-insta-y2k-street',
        aiDirective: 'Y2K Street Sticker Style: Dynamic rotated sticker badges, chrome typography highlights, glossy emojis, and street culture attitude.',
      },
    ],
    sampleContent: {
      title: '직장인 퇴근 2시간 앞당기는 AI 실무 프롬프트 팁',
      rawText: `[표지]
- "아직도 보고서 쓸 때 막막하신가요?"
- 챗GPT로 5분 만에 기획서 뼈대 뽑는 프롬프트 공식

[본문 팁 1]
- TIP 01. 배경과 역할을 먼저 못박아라
- '너는 10년 차 기획팀장이야'라고 역할을 주는 순간 답변 퀄리티가 3배 상승합니다.

[엔딩 장]
- 나중에 필요할 때 바로 꺼내볼 수 있도록
- 지금 북마크(저장)해두고 동료에게 공유해보세요!`,
    },
    components: [
      {
        id: 'card-hook-title',
        name: '형광펜 강조 3초 후킹 표지',
        category: 'Cover Slide',
        description: '스크롤을 멈추게 하는 형광 하이라이트 박스와 3줄 이내 대형 질문 카피',
        thumbnailIcon: 'Highlighter',
        slots: {
          tag: '🔥 마케터 필독 꿀팁',
          hook_head: '아직도 보고서 쓸 때\n모니터만 노려보시나요?',
          hook_sub: '챗GPT로 5분 만에 기획서 끝내는 프롬프트 공식',
          swipe_hint: '옆으로 넘겨서 비법 확인 👉',
        },
        layoutType: 'card-hook-cover',
        specs: {
          heightRatio: '100%',
          visualElements: ['형광 옐로우/코랄 텍스트 하이라이트', '대형 볼드 폰트', '하단 스와이프 유도 화살표'],
          contractDescription: '1:1 정방형 표지. 시선을 사로잡는 질문형 카피 + 하단 스와이프 유도 바',
        },
      },
      {
        id: 'card-step-tip',
        name: '넘버링 스텝 뱃지 [TIP 01] 본문장',
        category: 'Content Slide',
        description: '상단 진행률 바와 볼드 넘버링 뱃지로 가독성을 극대화한 정보 전달 카드',
        thumbnailIcon: 'FileSpreadsheet',
        slots: {
          progress: 'Step 01 / 03',
          step_badge: 'TIP 01',
          tip_title: '역할과 배경을 먼저 못박아라',
          tip_body: 'AI에게 바로 질문하지 말고, "너는 10년 차 IT 서비스 기획 총괄 팀장이야"라고 맥락을 부여하세요.',
          tip_highlight: '💡 역할 지정만으로 답변 전문성이 3배 상승합니다.',
        },
        layoutType: 'card-step-body',
        specs: {
          heightRatio: '100%',
          visualElements: ['상단 프로그레스 바', '둥근 사각 넘버링 스티커', '키워드 볼드', '팁 박스 콜아웃'],
          contractDescription: '본문 정보장. 상단 진행 바 + 번호 태그 + 핵심 설명 + 하단 꿀팁 박스',
        },
      },
      {
        id: 'card-chat-bubble',
        name: '메신저 말풍선 대화 UI',
        category: 'Storytelling',
        description: '카카오톡/iMessage 형태의 친근한 좌우 대화 버블로 문제를 공감시키는 카드',
        thumbnailIcon: 'MessageCircle',
        slots: {
          chat1: '팀장님, 내일 발표할 IR 피치덱 디자인 다 끝났나요?',
          chat2: '아직 텍스트만 정리했는데... 디자인은 언제 다 하지? ㅠㅠ',
          chat3: '걱정 마세요! 이 프롬프트 쓰면 3분 만에 끝납니다 ㅎㅎ',
        },
        layoutType: 'card-chat-dialog',
        specs: {
          heightRatio: '100%',
          visualElements: ['좌우 말풍선 버블', '프로필 아바타', '메신저 감성 타임스탬프'],
          contractDescription: '문답형 스토리텔링. 독자의 실제 대화 상황을 재현하여 극적인 몰입감 유도',
        },
      },
      {
        id: 'card-save-ending',
        name: '3D 북마크 저장 유도 엔딩 액션장',
        category: 'Outro Slide',
        description: '북마크 아이콘과 팔로우 버튼 모양 UI로 저장 및 채널 유입을 유도하는 마지막 장',
        thumbnailIcon: 'BookmarkCheck',
        slots: {
          ending_head: '도움이 되셨나요?',
          ending_sub: '나중에 퇴근길에 꺼내보려면 지금 저장(북마크)해두세요!',
          profile_name: '@prompt_master_lab',
          action_btn: '팔로우하고 매일 꿀팁 받기',
        },
        layoutType: 'card-save-outro',
        specs: {
          heightRatio: '100%',
          visualElements: ['3D 북마크 그래픽', '프로필 카드 UI', 'CTA 팔로우 버튼'],
          contractDescription: '카드뉴스 엔딩장. 저장 및 공유 전환율을 높이는 프로필 및 북마크 콜아웃',
        },
      },
    ],
  },
  {
    id: 'banner',
    name: 'Display Banner & Ads',
    koreanName: '🎯 배너 & 디스플레이 광고',
    icon: 'Megaphone',
    canvasAspect: 'horizontal-banner',
    aspectRatioClass: 'aspect-[12/6]',
    description: 'Z패턴 시선 동선과 3초 내 클릭을 유도하는 고전환 광고 및 이벤트 배너',
    defaultHeadline: '마감 임박! 2026 AI 디자인 마스터클래스 50% 얼리버드',
    subPurposes: [
      { id: 'banner-sale', title: '타임세일 & 한정 특가 배너', badge: '타임세일', desc: 'D-day 타이머, 50% 할인 스탬프, 마감 임박 긴박감', recommendedMoodId: 'banner-mood-urgency', sampleHeadline: '⏳ 마감 임박! 50% 할인 오늘 밤 24시 종료' },
      { id: 'banner-launch', title: '신규 프로덕트 런칭 공지', badge: '신제품 런칭', desc: '사이버 네온 광원, 실물 3D 컷, 얼리버드 신청 유도', recommendedMoodId: 'banner-mood-neon-launch', sampleHeadline: 'NEW — 차세대 AI 크리에이터 도구 공식 출시' },
      { id: 'banner-brand', title: '브랜드 인지도 & 신뢰 배너', badge: '브랜딩', desc: '골드 에디토리얼, 품격 있는 로고, 신뢰 마이크로카피', recommendedMoodId: 'banner-mood-luxury-brand', sampleHeadline: 'Since 2019 — 프리미엄 크래프트의 품격' },
      { id: 'banner-event', title: '경품 이벤트 & 참여 유도', badge: '프로모션', desc: '친근한 파스텔 톤, 원클릭 참여 버튼, 혜택 강조', recommendedMoodId: 'banner-mood-warm-event', sampleHeadline: '🎁 참여만 해도 선물이! 봄맞이 감사 이벤트' },
    ],
    tailoredMoods: [
      {
        id: 'banner-mood-urgency',
        title: '긴급 마감 카운트다운',
        badge: 'D-day 타이머',
        desc: '마감 임박 디지털 전광판, 펄스 애니메이션 CTA 버튼, 50% 할인 스탬프',
        icon: '⏳',
        recommendedThemeId: 'vivid-yellow',
        recommendedStyleId: 'neo-brutalism',
        focalAnchor: 'data',
        bundleId: 'bundle-banner-urgency',
        aiDirective: 'Urgency Countdown Banner: Digital countdown timer block, high-contrast 50% OFF discount badge, and pulse animation CTA.',
      },
      {
        id: 'banner-mood-neon-launch',
        title: '사이버 네온 런칭',
        badge: '네온 발광 CTA',
        desc: '어두운 배경 위 일렉트릭 사이언 광원, 신제품 3D 실물 컷, 발광 뱃지',
        icon: '🔮',
        recommendedThemeId: 'ocean-cyan',
        recommendedStyleId: 'dark-oled',
        focalAnchor: 'visual',
        bundleId: 'bundle-banner-neon-launch',
        aiDirective: 'Cyber Launch Banner: Dark futuristic backdrop with electric neon glows, product 3D cutouts, and sleek glass pill badges.',
      },
      {
        id: 'banner-mood-luxury-brand',
        title: '골드 에디토리얼 브랜딩',
        badge: '샴페인 골드',
        desc: '품격 있는 세리프 브랜드 로고, 골드 헤어라인 테두리, 미니멀한 1줄 카피',
        icon: '👑',
        recommendedThemeId: 'champagne-gold',
        recommendedStyleId: 'luxury-editorial',
        focalAnchor: 'typo',
        bundleId: 'bundle-banner-luxury-brand',
        aiDirective: 'Luxury Branding Banner: Elegant serif typography, gold hairline framing, generous whitespace, and premium tone.',
      },
      {
        id: 'banner-mood-warm-event',
        title: '따스한 오가닉 이벤트',
        badge: '소프트 파스텔',
        desc: '친근한 일러스트 뱃지, 부드러운 라운드 컨테이너, 선물 박스 그래픽',
        icon: '🎁',
        recommendedThemeId: 'warm-earth',
        recommendedStyleId: 'soft-ui',
        focalAnchor: 'hybrid',
        bundleId: 'bundle-banner-organic-event',
        aiDirective: 'Warm Event Banner: Friendly pastel soft-UI containers, playful gift badges, and welcoming conversational invitations.',
      },
    ],
    sampleContent: {
      title: '블랙프라이데이 타임세일 프로모션 배너',
      rawText: `[배너 메인 카피]
- 50% OFF 시즌 최대 할인
- 2026 프롬프트 마스터 전 패키지 한정 수량 특가

[긴급성 요소]
- 종료까지 남은 시간: D-1 (오늘 밤 24:00 마감)
- 선착순 잔여 수량 15개 한정

[CTA 버튼]
- 지금 50% 쿠폰 받고 시작하기 👉`,
    },
    components: [
      {
        id: 'banner-timer',
        name: '카운트다운 D-day 타이머 박스',
        category: 'Urgency',
        description: '긴박감을 조성하는 카운트다운 타이머 시계와 마감 임박 알림 뱃지',
        thumbnailIcon: 'Timer',
        slots: {
          timer_badge: '⏳ 오늘 밤 24:00 종료',
          timer_countdown: '08 : 42 : 19',
          timer_sub: '선착순 마감 시 사전 예고 없이 종료됩니다',
        },
        layoutType: 'banner-timer-block',
        specs: {
          heightRatio: '30%',
          visualElements: ['어두운 디지털 전광판 숫자', '초 단위 깜빡임 효과', '긴급 알림 뱃지'],
          contractDescription: '긴급성 강조 블록. 실시간 카운트다운 박스로 즉각적인 결제 유도',
        },
      },
      {
        id: 'banner-discount',
        name: '50% OFF 할인율 폭발 뱃지',
        category: 'Discount',
        description: '시선을 단숨에 뺏는 대형 할인율 숫자와 홀로그램/네온 광원 스티커',
        thumbnailIcon: 'Percent',
        slots: {
          discount_head: '시즌 최대 할인',
          discount_number: '50%',
          discount_unit: 'OFF',
          discount_target: '전 강좌 및 프롬프트 팩',
        },
        layoutType: 'banner-discount-stamp',
        specs: {
          heightRatio: '40%',
          visualElements: ['초대형 볼드 숫자', '경사진 다이내믹 뱃지', '네온 광원 효과'],
          contractDescription: '혜택 극대화 엠블럼. 50% 숫자를 화면의 가장 큰 시각적 앵커로 배치',
        },
      },
      {
        id: 'banner-cta',
        name: '고대비 펄스 애니메이션 CTA 버튼',
        category: 'Action',
        description: '배경색과 확실히 분리되는 고대비 컬러와 마우스 호버 확대 버튼',
        thumbnailIcon: 'MousePointerClick',
        slots: {
          cta_label: '지금 50% 쿠폰 받고 시작하기',
          guarantee: '✓ 7일 이내 100% 환불 보장',
        },
        layoutType: 'banner-cta-group',
        specs: {
          heightRatio: '30%',
          visualElements: ['고대비 프라이머리 버튼', '우측 이동 화살표', '안심 보증 마이크로카피'],
          contractDescription: '클릭 유도 버튼 영역. 명확한 동사 카피와 환불 보증 텍스트로 저항감 제거',
        },
      },
    ],
  },
  {
    id: 'youtube_thumb',
    name: 'YouTube Thumbnail',
    koreanName: '🎬 유튜브 썸네일',
    icon: 'PlaySquare',
    canvasAspect: '16:9',
    aspectRatioClass: 'aspect-[16/9]',
    description: '작은 모바일 피드에서도 클릭률(CTR)을 폭발시키는 고대비 썸네일',
    defaultHeadline: '이것만 알면 디자인 끝! AI 툴 3종 실전 비교',
    subPurposes: [
      { id: 'yt-shock', title: '충격 실화 & 시선 강탈 리뷰', badge: '충격 실화', desc: '경악 표정 누끼, 3단어 펀치 타이포, 굵은 레드 화살표', recommendedMoodId: 'yt-mood-shock-aggro', sampleHeadline: '결국 갈아탔습니다 — 12억 날린 충격 실화' },
      { id: 'yt-versus', title: '제품/기술 극단적 VS 대결', badge: 'VS 대결', desc: '사선 대각선 분할선, 흑백 과거 vs 컬러 혁신 극대비', recommendedMoodId: 'yt-mood-lightning-vs', sampleHeadline: '피그마 vs v0 vs 미드저니 — 2026 종결판' },
      { id: 'yt-knowledge', title: '지식 정보 & 다큐멘터리', badge: '지식 다큐', desc: '진지한 다크 톤, 흑백 인물 컷, 시안/골드 헤어라인 발광', recommendedMoodId: 'yt-mood-documentary', sampleHeadline: '왜 90%의 스타트업은 실패하는가 — 깊은 분석' },
      { id: 'yt-vlog', title: '감성 브이로그 & 라이프', badge: '감성 일상', desc: '따뜻한 아날로그 필름 감성, 자연광, 편안한 톤앤매너', recommendedMoodId: 'yt-mood-lifestyle-film', sampleHeadline: '소소한 일상, 커피 한 잔의 여유로운 오후' },
    ],
    tailoredMoods: [
      {
        id: 'yt-mood-shock-aggro',
        title: '0.3초 시선 강탈 어그로',
        badge: '3단어 펀치 타이포',
        desc: '두꺼운 블랙 외곽선 옐로우 폰트, 경악 표정 누끼 컷, 곡선 레드 화살표',
        icon: '🥊',
        recommendedThemeId: 'vivid-yellow',
        recommendedStyleId: 'neo-brutalism',
        focalAnchor: 'hybrid',
        bundleId: 'bundle-yt-high-ctr',
        aiDirective: 'High-CTR Shock YouTube Thumbnail: Massive 3-word punchy display text with 8px black stroke, extreme human shock facial expression, and pointing red arrow.',
      },
      {
        id: 'yt-mood-lightning-vs',
        title: '라이트닝 VS 극단적 대결',
        badge: '사선 대각선 분할',
        desc: '화면을 가르는 번개 모양 절단선, 흑백 과거 방식 vs 화려한 컬러 혁신 대비',
        icon: '⚡️',
        recommendedThemeId: 'cyber-cyan-magenta',
        recommendedStyleId: 'cyber-glow',
        focalAnchor: 'visual',
        bundleId: 'bundle-yt-lightning-vs',
        aiDirective: 'Versus Split Screen YouTube Thumbnail: 45-degree diagonal lightning slash split contrasting old obsolete ways on left against hyper-saturated future tech on right.',
      },
      {
        id: 'yt-mood-documentary',
        title: '진중한 지식 & 다큐멘터리',
        badge: '진지한 다크 톤',
        desc: '흑백 초상화 인물 컷 + 시안/골드 헤어라인 발광 + 신뢰감 넘치는 산세리프 슬로건',
        icon: '🎓',
        recommendedThemeId: 'ocean-cyan',
        recommendedStyleId: 'dark-oled',
        focalAnchor: 'data',
        bundleId: 'bundle-yt-documentary',
        aiDirective: 'Deep Documentary YouTube Thumbnail: Dramatic low-key portrait lighting with crisp cyan edge rim light, serious typography, and curiosity gap badge.',
      },
      {
        id: 'yt-mood-lifestyle-film',
        title: '감성 브이로그 & 필름 룩',
        badge: '필름 그레인 & 감성',
        desc: '따뜻한 아날로그 자연광 컷, 손글씨 느낌의 자연스러운 타이포그래피',
        icon: '☕️',
        recommendedThemeId: 'espresso-luxe',
        recommendedStyleId: 'nordic-clean',
        focalAnchor: 'visual',
        bundleId: 'bundle-yt-vlog-lifestyle',
        aiDirective: 'Warm Film Vlog YouTube Thumbnail: Analog warm daylight tone, gentle film grain, soft aesthetic typography, and calm relatable lifestyle framing.',
      },
    ],
    sampleContent: {
      title: '유튜브 테크 리뷰 채널 썸네일 기획',
      rawText: `[메인 타이틀 카피]
- "결국 갈아탔습니다" (외곽선 굵은 3단 타이포)
- 피그마 vs v0 vs 미드저니 2026 종결판

[비주얼 연출]
- 좌측: 경악하는 인물 표정 컷 (누끼 컷 + 옐로우 아웃라인)
- 우측: 대각선 분할 화면 (Before 옛날 방식 ❌ vs After 신세계 ✨)
- 상단: '충격 실화' 레드 뱃지 스티커`,
    },
    components: [
      {
        id: 'thumb-typo',
        name: '3단 외곽선 초고대비 어그로 타이포',
        category: 'Typography',
        description: '작은 화면에서도 한눈에 읽히는 블랙 외곽선 + 옐로우/화이트 볼드 폰트',
        thumbnailIcon: 'Type',
        slots: {
          tag: '⚡️ 2026 종결판',
          main_line1: '결국 갈아탔습니다',
          main_line2: '피그마 쓰지 마세요?!',
        },
        layoutType: 'thumb-typo-block',
        specs: {
          heightRatio: '50%',
          visualElements: ['3px 블랙 텍스트 스트로크', '옐로우/화이트 고대비', '기울임 -5도 역동적 앵글'],
          contractDescription: '모바일 가독성 1순위 타이포. 두꺼운 외곽선과 네온 옐로우 하이라이트',
        },
      },
      {
        id: 'thumb-split',
        name: '대각선 Before vs After 분할선',
        category: 'Composition',
        description: '극적인 결과 차이를 보여주는 대각선 크로스 분할과 ❌/✨ 대비',
        thumbnailIcon: 'Split',
        slots: {
          left_label: '3시간 삽질 ❌',
          right_label: '1초 만에 완성 ✨',
        },
        layoutType: 'thumb-split-screen',
        specs: {
          heightRatio: '50%',
          visualElements: ['대각선 분할 슬래시', '어두운 흑백 vs 화려한 컬러 대비', '스티커 이모지'],
          contractDescription: '대각선 2분할 캔버스. 극단적인 결과 대비로 호기심 자극',
        },
      },
    ],
  },
  {
    id: 'newsletter',
    name: 'Email Newsletter',
    koreanName: '✉️ 이메일 뉴스레터',
    icon: 'Mail',
    canvasAspect: 'vertical-scroll',
    aspectRatioClass: 'aspect-[3/5]',
    description: '스티비, 메일리용 정갈한 브랜드 헤더와 큐레이션 아티클 이메일 템플릿',
    defaultHeadline: '이번 주 디자이너가 주목해야 할 5가지 혁신 툴',
    subPurposes: [
      { id: 'news-weekly', title: '주간 디자인 & 테크 트렌드 리포트', badge: '트렌드 리포트', desc: '큐레이션 아티클, 핵심 요약 불릿, 링크', recommendedMoodId: 'news-mood-editorial', sampleHeadline: '이번 주 디자이너가 주목해야 할 5가지 혁신 툴' },
      { id: 'news-case', title: '스타트업 성공 케이스 스터디', badge: '케이스 스터디', desc: '심층 인터뷰, 성과 수치 분석, 인사이트', recommendedMoodId: 'news-mood-dark-curation', sampleHeadline: '시리즈 A에서 유니콘까지 — 실전 케이스 분석' },
    ],
    tailoredMoods: [
      {
        id: 'news-mood-editorial',
        title: '정갈한 에디토리얼 매거진',
        badge: '클린 1열 그리드',
        desc: '브랜드 로고 바, 썸네일 카드, 14pt 요약문과 깔끔한 디바이더',
        icon: '📰',
        recommendedThemeId: 'swiss-monochrome',
        recommendedStyleId: 'swiss-minimal',
        focalAnchor: 'typo',
        aiDirective: 'Minimalist Newsletter: Clean single-column layout, serif headings, and high contrast.',
      },
      {
        id: 'news-mood-dark-curation',
        title: '다크 테크 큐레이션',
        badge: '다크 OLED',
        desc: '어두운 배경 위 네온 포인트, 개발자 및 테크 독자 타겟',
        icon: '💻',
        recommendedThemeId: 'ocean-cyan',
        recommendedStyleId: 'dark-oled',
        focalAnchor: 'data',
        aiDirective: 'Dark Tech Newsletter: Dark theme with glowing badges and monospace details.',
      },
    ],
    sampleContent: {
      title: '주간 디자인 & AI 인사이트 뉴스레터 #42',
      rawText: `[에디터 서문]
- 안녕하세요 구독자님, 에디터 레오입니다.
- 이번 주는 디자인 시스템과 AI가 만났을 때 생기는 놀라운 효율성 변화를 다룹니다.

[큐레이션 아티클 1]
- 제목: v0로 프론트엔드 개발 속도 5배 올린 스타트업 이야기
- 요약: 디자이너가 직접 작성한 Tailwind 프롬프트로 3일 만에 MVP를 출시한 실제 케이스 스터디입니다.`,
    },
    components: [
      {
        id: 'news-header',
        name: '브랜드 미니멀 헤더 로고 바',
        category: 'Header',
        description: '깔끔한 레터 넘버링과 브랜드 로고가 배치된 정갈한 상단 헤더',
        thumbnailIcon: 'Heading',
        slots: {
          brand: 'DESIGN PULSE',
          issue: 'VOL. 42 • 2026.09.30',
          view_browser: '웹에서 보기',
        },
        layoutType: 'news-header-bar',
        specs: {
          heightRatio: '15%',
          visualElements: ['세련된 자간 -0.02em 영문 로고', '연회색 디바이더 라인', '호 발행일 뱃지'],
          contractDescription: '뉴스레터 상단 브랜딩 바. 신뢰감을 주는 미니멀 레이아웃',
        },
      },
      {
        id: 'news-article',
        name: '큐레이션 아티클 카드',
        category: 'Article',
        description: '썸네일과 볼드 제목, 3줄 요약 불릿으로 구성된 클릭 유도 카드',
        thumbnailIcon: 'Newspaper',
        slots: {
          article_tag: 'CASE STUDY',
          article_title: 'v0로 프론트엔드 개발 속도 5배 올린 스타트업',
          article_desc: '디자이너가 작성한 프롬프트로 3일 만에 MVP 출시한 실전 노하우를 공개합니다.',
          read_more: '전문 읽어보기 →',
        },
        layoutType: 'news-article-card',
        specs: {
          heightRatio: '45%',
          visualElements: ['라운드 썸네일 박스', '16pt 볼드 헤드라인', '14pt 요약문', '화살표 링크'],
          contractDescription: '콘텐츠 큐레이션 카드. 모바일 이메일 앱에서도 한눈에 들어오는 가독성',
        },
      },
    ],
  },
  {
    id: 'poster',
    name: 'Event Poster & Flyer',
    koreanName: '📜 행사 포스터 & 리플렛',
    icon: 'FileText',
    canvasAspect: 'a4-vertical',
    aspectRatioClass: 'aspect-[1/1.414]',
    description: '세미나, 전시회, 대학 축제용 감각적인 키 비주얼과 QR코드가 포함된 포스터',
    defaultHeadline: '2026 FUTURE DESIGN & AI SUMMIT',
    subPurposes: [
      { id: 'poster-conf', title: '글로벌 컨퍼런스 & 테크 서밋', badge: '컨퍼런스', desc: '대형 키비주얼, 행사 일정, 사전등록 QR', recommendedMoodId: 'poster-mood-monumental', sampleHeadline: '2026 FUTURE DESIGN & AI SUMMIT' },
      { id: 'poster-exhibit', title: '현대미술 전시 & 디자인 페어', badge: '전시회', desc: '예술적 비주얼, 장소 메타 정보, 티켓 예매', recommendedMoodId: 'poster-mood-brutalist', sampleHeadline: 'EXPERIMENTAL ART EXHIBITION 2026' },
    ],
    tailoredMoods: [
      {
        id: 'poster-mood-monumental',
        title: '모뉴멘탈 대형 키비주얼',
        badge: '대형 타이포 55%',
        desc: '압도적인 그래픽 아트워크, 볼드 산세리프 타이포, 3열 메타 칩',
        icon: '📜',
        recommendedThemeId: 'champagne-gold',
        recommendedStyleId: 'luxury-editorial',
        focalAnchor: 'visual',
        aiDirective: 'Conference Poster: Giant key visual hero with date badge and QR ticket box.',
      },
      {
        id: 'poster-mood-brutalist',
        title: '네오 브루탈리스트 페스티벌',
        badge: '볼드 블랙 & 옐로우',
        desc: '강렬한 3px 블랙 외곽선, 비비드 원색, 파괴적 타이포그래피',
        icon: '⚡️',
        recommendedThemeId: 'vivid-yellow',
        recommendedStyleId: 'neo-brutalism',
        focalAnchor: 'typo',
        aiDirective: 'Festival Poster: Bold black borders, vibrant pop contrast, and raw street energy.',
      },
    ],
    sampleContent: {
      title: '2026 글로벌 디자인 & AI 서밋 컨퍼런스 포스터',
      rawText: `[행사 타이틀]
- 2026 FUTURE DESIGN & AI SUMMIT
- 부제: 인공지능과 비주얼 인터페이스의 공존과 진화

[행사 개요 3단 메타 정보]
- 일시: 2026. 10. 24 (토) 10:00 - 18:00
- 장소: 코엑스 오디토리움 Hall A
- 대상: UI/UX 디자이너, PM, 프론트엔드 개발자

[신청 및 참여]
- 사전 등록 QR코드 스캔 시 30% 할인 혜택 제공`,
    },
    components: [
      {
        id: 'poster-kv',
        name: '대형 키 비주얼 & 헤드라인 프레임',
        category: 'Key Visual',
        description: '압도적인 첫인상을 주는 그래픽 아트워크 영역과 볼드 타이포그래피',
        thumbnailIcon: 'Image',
        slots: {
          event_edition: 'THE 4TH ANNUAL CONFERENCE',
          event_title: 'FUTURE DESIGN\n& AI SUMMIT',
          event_date_badge: 'OCT 24, 2026',
        },
        layoutType: 'poster-kv-hero',
        specs: {
          heightRatio: '55%',
          visualElements: ['대형 40pt 산세리프 타이포', '날짜 캡슐 뱃지', '모던 아트워크 프레임'],
          contractDescription: '포스터 상단 55% 영역. 멀리서도 행사명을 인지할 수 있는 대형 타이포',
        },
      },
      {
        id: 'poster-meta',
        name: '행사 개요 3단 메타 칩 & QR 컨테이너',
        category: 'Event Details',
        description: '일시, 장소, 대상 3대 필수 정보와 사전 등록용 QR코드 박스',
        thumbnailIcon: 'QrCode',
        slots: {
          time_label: '2026. 10. 24 (SAT) 10:00 - 18:00',
          place_label: 'COEX AUDITORIUM HALL A',
          target_label: 'DESIGNERS, PM, DEVELOPERS',
          qr_notice: 'SCAN QR FOR EARLY BIRD TICKET',
        },
        layoutType: 'poster-meta-bottom',
        specs: {
          heightRatio: '35%',
          visualElements: ['3열 메타데이터 태그', '정사각형 QR코드 인셋', '주최사 로고 바'],
          contractDescription: '포스터 하단 35% 영역. 행사 일정 및 장소 정보와 사전 등록 QR 배치',
        },
      },
    ],
  },
];
