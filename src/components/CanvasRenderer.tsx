'use client';

import React, { useMemo, useState } from 'react';
import { DesignDomain, SubPurposeOption, TailoredMoodOption } from '@/data/domains';
import { VisualStyleOption, ColorThemeOption, DesignElementOption, ButtonStyleOption, TypographyOption } from '@/data/design-options';
import { resolveDesignSystem, ResolvedDesignSystem } from '@/lib/design-token-resolver';
import { LayoutReference, ReferencePartKey } from '@/data/layout-references';
import { DomainComponentOption, LegoBlockItem, LayoutPreset, LayoutZoneSlot, GridColumnSpan } from '@/data/component-presets';

type CanvasCustomOptions = Record<string, string | number | boolean | undefined>;
import { 
  TrendingUp, Milestone, Columns2, Sparkles, Zap, 
  ArrowUpRight, Check, X, Flame, ArrowRight, Eye, Star,
  Heart, MessageSquare, Share2, Bookmark, MoreHorizontal,
  Compass, Radio, Shield, Terminal, Activity, ChevronLeft, ChevronRight,
  ShieldCheck, CircleDot, Layers, HelpCircle, User, ArrowDown, LayoutGrid,
  Clock, Award, ThumbsUp, ShoppingBag, AlertTriangle, ExternalLink,
  Sliders, Maximize2, Monitor, Smartphone, Play, Quote, CreditCard,
  Grid3X3, Film, EyeOff, MessageCircle, CheckCircle2, XCircle,
  Gift, Percent, Copy, CheckCheck, Code, Command, Send, RefreshCw,
  BarChart3, PieChart, LineChart, Target, DollarSign, Gauge, Filter, Wand2,
  Trash2, ArrowUp, Plus, Box, Search, Bell, Settings, Calendar, Users,
  CheckSquare, ListFilter, Layout, Folder, ChevronDown, MoreVertical,
  Cpu, Globe, SlidersHorizontal, Database, ArrowUpDown, Lock, FileText,
  Workflow
} from 'lucide-react';

interface CanvasRendererProps {
  domain: DesignDomain;
  style: VisualStyleOption;
  colorTheme: ColorThemeOption;
  activeElements: DesignElementOption[];
  buttonStyle?: ButtonStyleOption;
  typography?: TypographyOption;
  selectedNav?: DomainComponentOption;
  selectedMainDeck?: DomainComponentOption;
  selectedMetric?: DomainComponentOption;
  selectedFooter?: DomainComponentOption;
  userContent?: string;
  onUpdateHeadline?: (newHeadline: string) => void;
  // 글로벌 376대 레퍼런스 및 실시간 커스터마이징 상태
  activeLayouts?: Record<ReferencePartKey, LayoutReference>;
  customOptions?: CanvasCustomOptions;
  onOpenReferenceStudio?: (part?: ReferencePartKey) => void;
  // 도메인 맥락형 뷰포트 & 네비게이션 제어
  viewportMode?: 'desktop' | 'mobile';
  onViewportModeChange?: (mode: 'desktop' | 'mobile') => void;
  pptSlide?: number;
  onPptSlideChange?: (slide: number) => void;
  pptViewMode?: 'deck_overview' | 'single_focus';
  onPptViewModeChange?: (mode: 'deck_overview' | 'single_focus') => void;
  webViewMode?: 'full_scroll' | 'hero_focus' | 'mobile';
  onWebViewModeChange?: (mode: 'full_scroll' | 'hero_focus' | 'mobile') => void;
  instaSlide?: number;
  onInstaSlideChange?: (slide: number) => void;
  instaAspect?: '4:5' | '1:1';
  onInstaAspectChange?: (aspect: '4:5' | '1:1') => void;
  instaViewMode?: 'carousel' | 'deck_overview';
  onInstaViewModeChange?: (mode: 'carousel' | 'deck_overview') => void;
  commerceViewMode?: 'mobile' | 'desktop';
  ytViewMode?: 'studio' | 'ctr_mobile';
  subPurpose?: SubPurposeOption;
  tailoredMood?: TailoredMoodOption;
  // 🧱 레고 블록 조립형 인터랙션
  legoBlocks?: LegoBlockItem[];
  onMoveLegoBlock?: (instanceId: string, direction: 'up' | 'down') => void;
  onRemoveLegoBlock?: (instanceId: string) => void;
  onAddLegoBlockClick?: () => void;
  // 🌟 자유 배치 멀티존 레이아웃 & 순수 미리보기 모드
  layoutPreset?: LayoutPreset;
  inspectMode?: boolean;
}

// 고품질 Unsplash 실사 큐레이션 에셋
const UNSPLASH = {
  fashionLookbook1: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
  fashionLookbook2: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
  fashionLookbook3: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
  architecture: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  techDevice: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
  macroTexture: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
  streetCollage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80',
  organicFood: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=1200&q=80',
  documentary: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
  portraitEmotion: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80',
  explodedTech: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
  lifestyleBedroom: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80',
  cyberNeon: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80',
};

function parseContentForLayout(raw: string, defaultHeadline: string) {
  const safeRaw = typeof raw === 'string' ? raw : '';
  const lines = safeRaw.split('\n').map(l => l.trim()).filter(Boolean);
  
  let headline = lines[0]?.replace(/^\[.*?\]\s*/, '').replace(/^#+\s*/, '') || defaultHeadline;
  if (headline.length > 55) headline = headline.slice(0, 55) + '...';

  const metricRegex = /([0-9,.]+(?:억원|억|만명|명|%|점|원|달러|개|배|X|k|M)?)/gi;
  const foundMetrics: string[] = [];
  safeRaw.replace(metricRegex, (match) => {
    if (match.length >= 2 && !match.match(/^202[0-9]$/)) {
      foundMetrics.push(match);
    }
    return match;
  });

  const stepRegex = /(?:([0-9]+월|Step\s*[0-9]+|Q[1-4]|단계\s*[0-9]+)[^:\n]*[:\-]?\s*([^\n]+))/gi;
  const foundSteps: { tag: string; text: string }[] = [];
  let m;
  while ((m = stepRegex.exec(safeRaw)) !== null) {
    foundSteps.push({ tag: m[1], text: m[2] || '실행 계획' });
  }

  const bullets = lines
    .filter(l => l.startsWith('-') || l.startsWith('•') || l.startsWith('*'))
    .map(l => l.replace(/^[-•*]\s*/, ''));

  return {
    headline,
    metrics: [
      foundMetrics[0] || '52.4억',
      foundMetrics[1] || '38,500명',
      foundMetrics[2] || '92.4%',
    ],
    labels: [
      bullets[0]?.split(':')[0] || '분기 총 매출',
      bullets[1]?.split(':')[0] || '활성 정기 구독자',
      bullets[2]?.split(':')[0] || '고객 유지율(Retention)',
    ],
    steps: foundSteps.length >= 2 ? foundSteps.slice(0, 4) : [
      { tag: 'Step 01', text: 'AI 추천 엔진 3.0 엔터프라이즈 배포' },
      { tag: 'Step 02', text: '새벽 배송망 전국 100% 클라우드 확대' },
      { tag: 'Step 03', text: 'B2B 기업 전용 오피스 플랜 런칭' },
      { tag: 'Step 04', text: '글로벌 APAC 3개국 동시 시장 진출' },
    ],
    bullets: bullets.length > 0 ? bullets : [
      '데이터 기반 초신선 알고리즘으로 분기 리텐션 2배 견인',
      '전국 콜드체인 물류망 확충으로 익일 새벽 7시 도착 보증',
      '친환경 생분해성 패키징 도입으로 고객 신뢰도 극대화',
    ],
  };
}

function EditableHeadline({
  headline,
  onSave,
  className = '',
  style = {},
}: {
  headline: string;
  onSave?: (val: string) => void;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [val, setVal] = useState(headline);

  const handleCommit = () => {
    setIsEditing(false);
    if (val.trim() && val !== headline && onSave) {
      onSave(val.trim());
    }
  };

  if (isEditing) {
    return (
      <input
        type="text"
        autoFocus
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onBlur={handleCommit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleCommit();
          if (e.key === 'Escape') {
            setVal(headline);
            setIsEditing(false);
          }
        }}
        className={`bg-slate-900 text-white border-2 border-emerald-400 rounded-lg px-2.5 py-1 outline-none w-full shadow-lg ${className}`}
        style={style}
      />
    );
  }

  return (
    <div
      onClick={() => {
        setVal(headline);
        setIsEditing(true);
      }}
      title="클릭하여 제목을 직접 수정할 수 있습니다"
      className={`group/edit cursor-pointer relative hover:ring-2 hover:ring-emerald-400/60 hover:bg-white/5 rounded-lg px-1 transition duration-150 inline-block ${className}`}
      style={style}
    >
      <span>{headline}</span>
      <span className="opacity-0 group-hover/edit:opacity-100 text-[10px] font-mono text-emerald-300 ml-2 inline-flex items-center gap-0.5 bg-slate-900/90 px-2 py-0.5 rounded border border-emerald-500/50 align-middle shadow transition">
        ✏️ 수정
      </span>
    </div>
  );
}

function StyleAtmosphereBadge({ ds }: { ds: ResolvedDesignSystem }) {
  if (ds.isBrutalist) {
    return (
      <div className="w-full px-3 py-1 flex items-center justify-between text-[10px] font-mono font-black border-b-2 border-black bg-yellow-300 text-black select-none tracking-tight">
        <span>■ NEO-BRUTALISM // 0% BLUR • HARD SHADOW 5px ■</span>
        <span className="hidden sm:inline">VIVID BLOCK SYSTEM</span>
      </div>
    );
  }
  if (ds.isCyber) {
    return (
      <div className={`w-full px-3 py-1 flex items-center justify-between text-[10px] font-mono border-b ${ds.isDark ? 'border-cyan-500/30 bg-cyan-950/40 text-cyan-400' : 'border-cyan-600/30 bg-cyan-100 text-cyan-900'} select-none`}>
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          [SYS::TERMINAL HUD v3.8] CRT_SCANLINE=ON
        </span>
        <span className="text-[9px] text-cyan-500 hidden sm:inline">TELEMETRY_ACTIVE // COORD 37.56°N</span>
      </div>
    );
  }
  if (ds.isY2K) {
    return (
      <div className={`w-full px-3 py-1 flex items-center justify-between text-[10px] font-mono border-b ${ds.isDark ? 'border-pink-500/30 bg-gradient-to-r from-pink-950/40 via-purple-950/40 to-cyan-950/40 text-pink-300' : 'border-pink-300 bg-pink-100 text-pink-900'} select-none`}>
        <span>✦ ★ CYBER MILLENNIUM 2000s SPECIAL EDITION ★ ✦</span>
        <span className="text-[9px] text-pink-500 hidden sm:inline">METALLIC CHROME GLOSS</span>
      </div>
    );
  }
  if (ds.isBiotech) {
    return (
      <div className={`w-full px-3 py-1 flex items-center justify-between text-[10px] font-mono border-b ${ds.isDark ? 'border-emerald-500/30 bg-emerald-950/30 text-emerald-400' : 'border-emerald-400/50 bg-emerald-100 text-emerald-900'} select-none`}>
        <span>⊕ CLINICAL LAB SPEC // 100% STERILE PROTOCOL ⊕</span>
        <span className="text-[9px] text-emerald-600 hidden sm:inline">GRADE: PHARMACEUTICAL-A</span>
      </div>
    );
  }
  if (ds.isEditorial) {
    return (
      <div className={`w-full px-3 py-1 flex items-center justify-between text-[10px] font-serif italic border-b ${ds.isDark ? 'border-amber-500/30 bg-amber-950/30 text-amber-200' : 'border-amber-400/50 bg-amber-100 text-amber-900'} select-none`}>
        <span>— Vol. 28 Editorial Luxury Collection —</span>
        <span className="text-[9px] font-mono tracking-widest text-amber-500 uppercase hidden sm:inline">HAIRLINE SERIF</span>
      </div>
    );
  }
  if (ds.isZen) {
    return (
      <div className={`w-full px-3 py-1 flex items-center justify-between text-[10px] font-sans tracking-widest border-b ${ds.isDark ? 'border-stone-700 bg-stone-900/60 text-stone-300' : 'border-stone-300 bg-stone-100 text-stone-800'} select-none`}>
        <span>— 閑寂 (KANJAKU) MINIMAL ARCHITECTURE —</span>
        <span className="text-[9px] font-mono hidden sm:inline">NEGATIVE SPACE 40%</span>
      </div>
    );
  }
  if (ds.isAerospace) {
    return (
      <div className={`w-full px-3 py-1 flex items-center justify-between text-[10px] font-mono border-b ${ds.isDark ? 'border-amber-500/30 bg-amber-950/40 text-amber-400' : 'border-amber-500/40 bg-amber-100 text-amber-900'} select-none`}>
        <span>[HUD::COORD 37.5665°N 126.9780°E // MACH 2.4]</span>
        <span className="text-[9px] text-amber-600 hidden sm:inline">TACTICAL AMBER TELEMETRY</span>
      </div>
    );
  }
  if (ds.isClay) {
    return (
      <div className={`w-full px-3 py-1 flex items-center justify-between text-[10px] font-sans font-bold border-b ${ds.isDark ? 'border-purple-500/20 bg-purple-950/30 text-purple-300' : 'border-purple-300 bg-purple-100 text-purple-900'} select-none`}>
        <span>● CHUNKY 3D CLAY CAPSULE SYSTEM ●</span>
        <span className="text-[9px] font-mono text-purple-600 hidden sm:inline">DUAL EMBOSS DEPTH</span>
      </div>
    );
  }
  if (ds.isSwiss) {
    return (
      <div className={`w-full px-3 py-1 flex items-center justify-between text-[10px] font-mono border-b ${ds.isDark ? 'border-slate-700 bg-slate-900/90 text-slate-300' : 'border-slate-300 bg-slate-100 text-slate-800'} select-none`}>
        <span>[12-COLUMN MODULAR GRID // HELVETICA SYSTEM]</span>
        <span className="text-[9px] hidden sm:inline">MAX CONTRAST RATIO 7:1</span>
      </div>
    );
  }
  return null;
}

export default function CanvasRenderer({
  domain,
  style,
  colorTheme,
  activeElements,
  buttonStyle,
  typography,
  selectedNav,
  selectedMainDeck,
  selectedMetric,
  selectedFooter,
  userContent,
  onUpdateHeadline,
  activeLayouts,
  customOptions,
  onOpenReferenceStudio,
  viewportMode = 'desktop',
  onViewportModeChange,
  pptSlide,
  onPptSlideChange,
  pptViewMode = 'deck_overview',
  onPptViewModeChange,
  webViewMode = 'full_scroll',
  onWebViewModeChange,
  instaSlide,
  onInstaSlideChange,
  instaAspect = '4:5',
  onInstaAspectChange,
  instaViewMode = 'carousel',
  onInstaViewModeChange,
  commerceViewMode = 'mobile',
  ytViewMode = 'studio',
  subPurpose,
  tailoredMood,
  legoBlocks,
  onMoveLegoBlock,
  onRemoveLegoBlock,
  onAddLegoBlockClick,
  layoutPreset = 'landing',
  inspectMode = false,
}: CanvasRendererProps) {
  const fallbackHeadline = subPurpose?.sampleHeadline || subPurpose?.title
    ? (subPurpose.sampleHeadline || `[${subPurpose.badge}] ${subPurpose.title}`)
    : domain.defaultHeadline;

  const content = useMemo(
    () => parseContentForLayout(userContent || '', fallbackHeadline),
    [userContent, fallbackHeadline]
  );

  // 중앙 디자인 토큰 시스템 해석 (선택된 테마, 스타일, 버튼, 폰트, 시각요소 100% 결합)
  const ds: ResolvedDesignSystem = useMemo(
    () => resolveDesignSystem(style, colorTheme, activeElements, buttonStyle, typography),
    [style, colorTheme, activeElements, buttonStyle, typography]
  );

  // 로컬 상태 백업
  const [internalPptSlide, setInternalPptSlide] = useState<number>(0);
  const [internalPptViewMode, setInternalPptViewMode] = useState<'deck_overview' | 'single_focus'>(pptViewMode);
  const [internalWebViewMode, setInternalWebViewMode] = useState<'full_scroll' | 'hero_focus' | 'mobile'>(webViewMode);
  const [internalInstaSlide, setInternalInstaSlide] = useState<number>(0);
  const [internalInstaViewMode, setInternalInstaViewMode] = useState<'carousel' | 'deck_overview'>(instaViewMode);

  const currentPptSlide = pptSlide !== undefined ? pptSlide : internalPptSlide;
  const setPptSlide = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === 'function' ? val(currentPptSlide) : val;
    if (onPptSlideChange) onPptSlideChange(nextVal);
    else setInternalPptSlide(nextVal);
  };

  const currentPptViewMode = pptViewMode || internalPptViewMode;
  const setPptViewMode = (mode: 'deck_overview' | 'single_focus') => {
    if (onPptViewModeChange) onPptViewModeChange(mode);
    else setInternalPptViewMode(mode);
  };

  const currentWebViewMode = webViewMode || internalWebViewMode;
  const setWebViewMode = (mode: 'full_scroll' | 'hero_focus' | 'mobile') => {
    if (onWebViewModeChange) onWebViewModeChange(mode);
    else setInternalWebViewMode(mode);
  };

  const currentInstaSlide = instaSlide !== undefined ? instaSlide : internalInstaSlide;
  const setInstaSlide = (val: number | ((prev: number) => number)) => {
    const nextVal = typeof val === 'function' ? val(currentInstaSlide) : val;
    if (onInstaSlideChange) onInstaSlideChange(nextVal);
    else setInternalInstaSlide(nextVal);
  };

  const currentInstaViewMode = instaViewMode || internalInstaViewMode;
  const setInstaViewMode = (mode: 'carousel' | 'deck_overview') => {
    if (onInstaViewModeChange) onInstaViewModeChange(mode);
    else setInternalInstaViewMode(mode);
  };

  // 도메인 판별
  const domainId = domain.id;
  const isPPT = domainId === 'ppt';
  const isInsta = domainId === 'instagram' || domainId === 'card_news';
  const isCommerce = domainId === 'commerce' || domainId === 'detail_page';
  const isYT = domainId === 'youtube' || domainId === 'youtube_thumb';
  const isBanner = domainId === 'banner';

  return (
    <div className="w-full flex flex-col items-center justify-center p-1 font-sans">
      {isPPT && (
        <PPTCanvasSection
          ds={ds}
          content={content}
          pptSlide={currentPptSlide}
          setPptSlide={setPptSlide}
          pptViewMode={currentPptViewMode}
          setPptViewMode={setPptViewMode}
          subPurpose={subPurpose}
          tailoredMood={tailoredMood}
          onUpdateHeadline={onUpdateHeadline}
        />
      )}

      {isBanner && (
        <BannerCanvasSection
          ds={ds}
          content={content}
          subPurpose={subPurpose}
          tailoredMood={tailoredMood}
          onUpdateHeadline={onUpdateHeadline}
        />
      )}

      {!isPPT && !isInsta && !isCommerce && !isYT && !isBanner && (
        <WebCanvasSection
          ds={ds}
          content={content}
          webViewMode={currentWebViewMode}
          setWebViewMode={setWebViewMode}
          selectedNav={selectedNav}
          selectedMainDeck={selectedMainDeck}
          selectedMetric={selectedMetric}
          selectedFooter={selectedFooter}
          subPurpose={subPurpose}
          tailoredMood={tailoredMood}
          onUpdateHeadline={onUpdateHeadline}
          activeLayouts={activeLayouts}
          customOptions={customOptions}
          onOpenReferenceStudio={onOpenReferenceStudio}
          legoBlocks={legoBlocks}
          onMoveLegoBlock={onMoveLegoBlock}
          onRemoveLegoBlock={onRemoveLegoBlock}
          onAddLegoBlockClick={onAddLegoBlockClick}
          layoutPreset={layoutPreset}
          inspectMode={inspectMode}
        />
      )}

      {isInsta && (
        <InstagramCanvasSection
          ds={ds}
          content={content}
          instaSlide={currentInstaSlide}
          setInstaSlide={setInstaSlide}
          instaAspect={instaAspect}
          instaViewMode={currentInstaViewMode}
          setInstaViewMode={setInstaViewMode}
          subPurpose={subPurpose}
          tailoredMood={tailoredMood}
          onUpdateHeadline={onUpdateHeadline}
        />
      )}

      {isCommerce && (
        <CommerceCanvasSection
          ds={ds}
          content={content}
          commerceViewMode={commerceViewMode}
          subPurpose={subPurpose}
          tailoredMood={tailoredMood}
          onUpdateHeadline={onUpdateHeadline}
        />
      )}

      {isYT && (
        <YouTubeCanvasSection
          ds={ds}
          content={content}
          ytViewMode={ytViewMode}
          subPurpose={subPurpose}
          tailoredMood={tailoredMood}
          onUpdateHeadline={onUpdateHeadline}
        />
      )}
    </div>
  );
}

/* =========================================================================
   1. 📊 PPT 프레젠테이션 캔버스 (전체 덱 6개 조감도 뷰 & 단일 포커스 뷰)
   ========================================================================= */
interface PPTCanvasSectionProps {
  ds: ResolvedDesignSystem;
  content: ReturnType<typeof parseContentForLayout>;
  pptSlide: number;
  setPptSlide: (slide: number | ((prev: number) => number)) => void;
  pptViewMode: 'deck_overview' | 'single_focus';
  setPptViewMode: (mode: 'deck_overview' | 'single_focus') => void;
  subPurpose?: SubPurposeOption;
  tailoredMood?: TailoredMoodOption;
  onUpdateHeadline?: (headline: string) => void;
}

// 6개 슬라이드 메타데이터
const PPT_SLIDE_CONFIGS = [
  { id: 0, tag: 'SLIDE 01', category: 'EXECUTIVE VISION', title: '핵심 비전 & IR 킬러 선언문' },
  { id: 1, tag: 'SLIDE 02', category: 'MARKET & TAM-SAM-SOM', title: 'TAM 12조 시장 규모 & 세그먼트 도넛' },
  { id: 2, tag: 'SLIDE 03', category: 'GROWTH TRACTION & CHARTS', title: '분기별 매출 성장 막대 차트 & ARR 추세선' },
  { id: 3, tag: 'SLIDE 04', category: 'CONVERSION FUNNEL', title: '고객 전환 깔때기(Funnel) & LTV/CAC' },
  { id: 4, tag: 'SLIDE 05', category: 'COMPETITIVE MATRIX', title: '2x2 경쟁 포지셔닝 축 & 마켓 리더 버블' },
  { id: 5, tag: 'SLIDE 06', category: 'STRATEGIC ROADMAP', title: '4단계 마일스톤 & BEP 조기 달성' },
];

function PPTCanvasSection({
  ds,
  content,
  pptSlide,
  setPptSlide,
  pptViewMode,
  setPptViewMode,
  subPurpose,
  tailoredMood,
  onUpdateHeadline,
}: PPTCanvasSectionProps) {
  const { tokens, getCardStyle, getButtonStyle, getBadgeStyle, getHeadlineStyle } = ds;

  const moodId = tailoredMood?.id || subPurpose?.recommendedMoodId || 'ppt-mood-vc';
  const isKeynote = moodId.includes('keynote') || subPurpose?.id === 'ppt-keynote';
  const isMckinsey = moodId.includes('mckinsey') || moodId.includes('strategy') || subPurpose?.id === 'ppt-strategy';
  const isContrast = moodId.includes('contrast') || moodId.includes('solution') || subPurpose?.id === 'ppt-solution';

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* PPT 전용 툴바: [전체 덱 조감도 (6 슬라이드)] vs [단일 슬라이드 포커스] */}
      <div className="w-full max-w-5xl flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Film className="w-4 h-4 text-emerald-400" />
            <span>프레젠테이션 덱 모드:</span>
          </span>
          <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800">
            <button
              onClick={() => setPptViewMode('deck_overview')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition ${
                pptViewMode === 'deck_overview'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Grid3X3 className="w-3.5 h-3.5" />
              <span>전체 덱 조감도 (6 슬라이드)</span>
            </button>
            <button
              onClick={() => setPptViewMode('single_focus')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition ${
                pptViewMode === 'single_focus'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>단일 슬라이드 포커스</span>
            </button>
          </div>
        </div>

        {/* 단일 포커스 모드일 때 슬라이드 바로가기 탭 */}
        {pptViewMode === 'single_focus' && (
          <div className="flex items-center gap-1 overflow-x-auto">
            {PPT_SLIDE_CONFIGS.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setPptSlide(idx)}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition flex items-center gap-1 whitespace-nowrap ${
                  pptSlide === idx
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold'
                    : 'text-slate-400 hover:bg-slate-800'
                }`}
                title={s.title}
              >
                <span>0{idx + 1}</span>
                <span className="hidden lg:inline text-[10px]">{s.category.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* -------------------------------------------------------------------
          모드 1: 전체 덱 조감도 파노라마 뷰 (6개 슬라이드 그리드)
          ------------------------------------------------------------------- */}
      {pptViewMode === 'deck_overview' ? (
        <div className="w-full max-w-5xl space-y-3">
          <div className="flex items-center justify-between text-xs px-1 text-slate-400 font-mono">
            <span>✦ {subPurpose?.badge || 'IR PITCH'} • COMPLETE 6-SLIDE STORYLINE (CLICK TO ZOOM)</span>
            <span className="text-emerald-400 font-bold">{subPurpose?.title || '스타트업 피치덱'}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PPT_SLIDE_CONFIGS.map((slideConfig, idx) => (
              <div
                key={slideConfig.id}
                onClick={() => {
                  setPptSlide(idx);
                  setPptViewMode('single_focus');
                }}
                className="group cursor-pointer rounded-xl overflow-hidden border transition-all duration-200 transform hover:-translate-y-1 hover:shadow-2xl relative"
                style={{
                  ...ds.canvasRootStyle,
                  borderColor: pptSlide === idx ? tokens.accent : ds.canvasRootStyle.borderColor,
                }}
              >
                {/* 상단 슬라이드 칩 */}
                <div 
                  className="px-3 py-1.5 border-b flex items-center justify-between text-[10px] font-mono font-bold"
                  style={{ borderColor: tokens.cardBorder, backgroundColor: `${tokens.cardBg}88` }}
                >
                  <span style={{ color: tokens.accent }}>{slideConfig.tag}</span>
                  <span className="text-slate-400">{slideConfig.category}</span>
                </div>

                {/* 슬라이드 16:9 미니어처 렌더링 */}
                <div className="aspect-[16/9] p-3 flex flex-col justify-between relative overflow-hidden select-none">
                  {renderPPTSlideContent(idx, ds, content, isKeynote, isMckinsey, isContrast, onUpdateHeadline, true)}
                </div>

                {/* 호버 오버레이 */}
                <div className="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition flex items-center justify-center pointer-events-none">
                  <span className="px-2.5 py-1 rounded-full bg-slate-950/90 text-emerald-400 border border-emerald-500/50 text-[10px] font-bold shadow-lg">
                    🔍 클릭하여 확대 편집
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* -------------------------------------------------------------------
           모드 2: 단일 슬라이드 대형 포커스 뷰 (16:9)
           ------------------------------------------------------------------- */
        <div 
          className="w-full max-w-5xl min-h-[520px] md:min-h-[580px] rounded-2xl overflow-hidden shadow-2xl border flex flex-col justify-between p-6 md:p-8 relative select-none"
          style={ds.canvasRootStyle}
        >
          <StyleAtmosphereBadge ds={ds} />
          {/* 앰비언트 글로우 오브 */}
          {ds.hasGlow && (
            <div 
              className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none"
              style={{ backgroundColor: tokens.accent, opacity: 0.2 }}
            />
          )}

          {/* 상단 바: 슬라이드 네비게이션 & 헤드라인 */}
          <div className="relative z-10 space-y-2 border-b pb-4" style={{ borderColor: tokens.cardBorder }}>
            <div className="flex items-center justify-between text-xs">
              <span className="font-mono font-bold tracking-wider" style={{ color: tokens.accent }}>
                {PPT_SLIDE_CONFIGS[pptSlide]?.tag} • {PPT_SLIDE_CONFIGS[pptSlide]?.category}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPptSlide(prev => (prev > 0 ? prev - 1 : 5))}
                  className="px-2 py-0.5 rounded text-xs font-bold border transition hover:opacity-80"
                  style={getButtonStyle('outline')}
                >
                  ◀ 이전 슬라이드
                </button>
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded" style={{ color: tokens.accent }}>
                  {pptSlide + 1} / 6
                </span>
                <button
                  onClick={() => setPptSlide(prev => (prev < 5 ? prev + 1 : 0))}
                  className="px-2 py-0.5 rounded text-xs font-bold border transition hover:opacity-80"
                  style={getButtonStyle('outline')}
                >
                  다음 슬라이드 ▶
                </button>
              </div>
            </div>
            <div>
              <EditableHeadline
                headline={content.headline}
                onSave={onUpdateHeadline}
                className="text-2xl md:text-3xl font-black tracking-tight leading-snug block"
                style={getHeadlineStyle('section')}
              />
            </div>
          </div>

          {/* 중단 메인 바디 */}
          <div className="relative z-10 flex-1 my-4 flex items-center justify-center">
            {renderPPTSlideContent(pptSlide, ds, content, isKeynote, isMckinsey, isContrast, onUpdateHeadline, false)}
          </div>

          {/* 하단 각주 & Takeaway */}
          <div className="relative z-10 pt-3 border-t flex items-center justify-between text-xs" style={{ borderColor: tokens.cardBorder }}>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-black" style={getBadgeStyle('accent')}>
                TAKEAWAY
              </span>
              <span className="font-medium text-[11px]" style={{ color: tokens.textSecondary }}>
                {pptSlide === 0 && '차세대 AI 자동화 아키텍처로 기존 수작업 비용 90% 영구 절감'}
                {pptSlide === 1 && '12조 원 글로벌 시장에서 3,500억 원 타겟 시장 연 34.2% 고속 침투'}
                {pptSlide === 2 && '전년 대비 분기 매출 240% 성장 및 3분기 손익분기점(BEP) 조기 달성'}
                {pptSlide === 3 && 'LTV:CAC 5.8배 및 3.2개월 초고속 회수율로 독보적 단위 경제성 입증'}
                {pptSlide === 4 && '2x2 독점 영역 선점 및 경쟁사 대비 4.8배 ROI로 진입 장벽 구축'}
                {pptSlide === 5 && 'APAC 3개국 동시 진출 및 2027년 연간 반복 매출(ARR) 150억 달성'}
              </span>
            </div>
            <span className="text-[10px] font-mono" style={{ color: tokens.textSecondary }}>
              Confidential • {subPurpose?.title || 'Core Pitch Deck 2026'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

// 개별 슬라이드 콘텐츠 렌더러 (세부 목적별 레이아웃 차별화!)
function renderPPTSlideContent(
  slideIndex: number,
  ds: ResolvedDesignSystem,
  content: ReturnType<typeof parseContentForLayout>,
  isKeynote: boolean,
  isMckinsey: boolean,
  isContrast: boolean,
  onUpdateHeadline?: (headline: string) => void,
  isMiniature: boolean = false
) {
  const { tokens, getCardStyle, getButtonStyle, getBadgeStyle, getHeadlineStyle } = ds;

  // Keynote 모드: 1줄 킬러 쿼트 & 시네마틱 화보 중심
  if (isKeynote && slideIndex === 0) {
    return (
      <div className="relative w-full h-full rounded-xl overflow-hidden flex flex-col justify-center items-center text-center p-4">
        <img src={UNSPLASH.architecture} alt="Keynote" className="absolute inset-0 w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        <div className="relative z-10 space-y-2 max-w-xl">
          <span className="text-[9px] font-mono font-bold tracking-widest uppercase" style={{ color: tokens.accent }}>
            ✦ 2026 WORLD KEYNOTE VISION
          </span>
          <h2 className={`${isMiniature ? 'text-xs' : 'text-3xl md:text-4xl'} font-black text-white leading-tight`}>
            &quot;우리는 불가능을 디자인합니다&quot;
          </h2>
          <p className={`${isMiniature ? 'text-[7px]' : 'text-xs'} text-slate-300`}>
            전 세계 2,400개 기업이 매일 아침 우리의 디자인 언어로 영감을 얻습니다.
          </p>
        </div>
      </div>
    );
  }

  // McKinsey 모드: 2x2 전략 포지셔닝 매트릭스
  if (isMckinsey && slideIndex === 0) {
    return (
      <div className="w-full h-full grid grid-cols-2 gap-2 p-2">
        <div className="p-3 rounded-lg border flex flex-col justify-between" style={getCardStyle('surface')}>
          <span className="text-[9px] font-bold" style={{ color: tokens.textSecondary }}>CHALLENGERS</span>
          <div className="text-xs font-semibold" style={{ color: tokens.textPrimary }}>기존 레거시 에이전시</div>
        </div>
        <div className="p-3 rounded-lg border-2 flex flex-col justify-between relative" style={{ ...getCardStyle('highlight'), borderColor: tokens.accent }}>
          <span className="text-[9px] font-bold" style={{ color: tokens.accent }}>★ MARKET LEADERS</span>
          <div className="text-xs font-black" style={{ color: tokens.textPrimary }}>CORE STUDIO AI (자사)</div>
          <span className="text-[8px] font-mono text-emerald-400">점유율 68% 독점</span>
        </div>
        <div className="p-3 rounded-lg border flex flex-col justify-between" style={getCardStyle('surface')}>
          <span className="text-[9px] font-bold" style={{ color: tokens.textSecondary }}>NICHE PLAYERS</span>
          <div className="text-xs font-semibold" style={{ color: tokens.textSecondary }}>단순 생성 툴</div>
        </div>
        <div className="p-3 rounded-lg border flex flex-col justify-between" style={getCardStyle('surface')}>
          <span className="text-[9px] font-bold" style={{ color: tokens.textSecondary }}>VISIONARIES</span>
          <div className="text-xs font-semibold" style={{ color: tokens.textPrimary }}>오픈소스 모델</div>
        </div>
      </div>
    );
  }

  // Slide 0: 기본 타이틀 & 킬러 비전 선언 (VC 투자용)
  if (slideIndex === 0) {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center text-center p-2 space-y-2">
        <span 
          className={`font-mono font-bold ${isMiniature ? 'text-[8px] px-1.5 py-0.5' : 'text-xs px-3 py-1'} rounded-full`}
          style={getBadgeStyle('accent')}
        >
          ✦ 2026 AI AUTOMATION IR PITCH
        </span>
        <h2 
          className={`${isMiniature ? 'text-xs leading-tight' : 'text-2xl md:text-3xl leading-snug'} font-extrabold max-w-2xl`}
          style={getHeadlineStyle('hero')}
        >
          &quot;우리는 데이터와 AI 기술로 수작업의 비효율을 100% 자동화합니다.&quot;
        </h2>
        <p className={`${isMiniature ? 'text-[8px] line-clamp-1' : 'text-xs md:text-sm'} max-w-lg`} style={{ color: tokens.textSecondary }}>
          전국 38,500개 기업이 매일 아침 우리의 지능형 아키텍처로 업무를 시작합니다.
        </p>

        {/* 핵심 실적 티커 바 */}
        <div className={`flex items-center gap-2 pt-1 ${isMiniature ? 'scale-90 origin-center' : ''}`}>
          <div className="px-2.5 py-1 rounded-lg border text-[10px] md:text-xs font-mono font-bold flex items-center gap-1.5" style={getCardStyle('surface')}>
            <span style={{ color: tokens.accent }}>ARR</span>
            <span style={{ color: tokens.textPrimary }}>₩52.4억</span>
            <span className="text-emerald-400 font-bold">+240% YoY</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg border text-[10px] md:text-xs font-mono font-bold flex items-center gap-1.5" style={getCardStyle('surface')}>
            <span style={{ color: tokens.accent }}>NDR</span>
            <span style={{ color: tokens.textPrimary }}>134.8%</span>
          </div>
          <div className="px-2.5 py-1 rounded-lg border text-[10px] md:text-xs font-mono font-bold flex items-center gap-1.5" style={getCardStyle('surface')}>
            <span style={{ color: tokens.accent }}>LTV:CAC</span>
            <span className="text-emerald-400 font-bold">5.8x</span>
          </div>
        </div>

        {!isMiniature && (
          <div className="flex items-center gap-3 pt-2">
            <button className="px-5 py-2 text-xs font-bold shadow-lg" style={getButtonStyle('primary')}>
              투자 제안서 다운로드
            </button>
            <button className="px-4 py-2 text-xs font-bold border" style={getButtonStyle('outline')}>
              실시간 데모 확인
            </button>
          </div>
        )}
      </div>
    );
  }

  // Slide 1: TAM-SAM-SOM 12조 시장 규모 & 세그먼트 도넛 차트 (또는 50:50 대비)
  if (slideIndex === 1) {
    if (isContrast) {
      return (
        <div className="grid grid-cols-2 gap-3 w-full h-full items-center">
          {/* 기존 방식 */}
          <div 
            className={`${isMiniature ? 'p-2' : 'p-5'} rounded-xl border flex flex-col justify-between h-full`}
            style={{ ...getCardStyle('sunken'), borderColor: '#ef444466' }}
          >
            <div>
              <span className={`${isMiniature ? 'text-[7px]' : 'text-xs'} font-bold font-mono block`} style={{ color: '#ef4444' }}>
                ❌ THE OLD WAY (수작업 한계)
              </span>
              <p className={`${isMiniature ? 'text-[8px] mt-1' : 'text-sm mt-2 font-semibold'}`} style={{ color: tokens.textPrimary }}>
                엑셀과 파워포인트 수기 편집으로 매일 4시간 이상의 리소스 낭비 발생
              </p>
            </div>
            <span className={`${isMiniature ? 'text-[7px]' : 'text-xs'} font-mono font-bold mt-1`} style={{ color: '#ef4444' }}>
              연간 ₩1.4억 원 인건비 손실
            </span>
          </div>

          {/* 자사 솔루션 */}
          <div 
            className={`${isMiniature ? 'p-2' : 'p-5'} rounded-xl border flex flex-col justify-between h-full`}
            style={{ ...getCardStyle('highlight'), borderColor: tokens.accent }}
          >
            <div>
              <span className={`${isMiniature ? 'text-[7px]' : 'text-xs'} font-bold font-mono block`} style={{ color: tokens.accent }}>
                ⭕️ THE CORE WAY (AI 자동화)
              </span>
              <p className={`${isMiniature ? 'text-[8px] mt-1' : 'text-sm mt-2 font-semibold'}`} style={{ color: tokens.textPrimary }}>
                원클릭 프롬프트 엔진으로 단 3초 만에 프로덕션 디자인 & 코드 즉시 생성
              </p>
            </div>
            <span className={`${isMiniature ? 'text-[7px]' : 'text-xs'} font-mono font-bold mt-1`} style={{ color: tokens.accent }}>
              업무 생산성 +240% 극대화
            </span>
          </div>
        </div>
      );
    }

    // 기본: 시장 규모 3단계 동심원 + 고객군 비중 도넛 차트
    return (
      <div className="grid grid-cols-2 gap-3 w-full h-full items-center">
        {/* 좌측: TAM-SAM-SOM 3단계 동심원 시장 다이어그램 */}
        <div 
          className={`${isMiniature ? 'p-2' : 'p-4'} rounded-xl border flex flex-col justify-between h-full relative overflow-hidden`}
          style={getCardStyle('surface')}
        >
          <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: tokens.cardBorder }}>
            <span className={`${isMiniature ? 'text-[7px]' : 'text-xs'} font-mono font-bold flex items-center gap-1`} style={{ color: tokens.accent }}>
              <Target className={`${isMiniature ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'}`} />
              <span>TAM-SAM-SOM 시장 기회</span>
            </span>
            <span className={`${isMiniature ? 'text-[6px]' : 'text-[10px]'} font-mono px-1.5 py-0.5 rounded`} style={getBadgeStyle('accent')}>
              CAGR +34.2%
            </span>
          </div>

          {/* 동심원 레이어 시각화 */}
          <div className="flex-1 flex flex-col items-center justify-center my-1 relative">
            <div 
              className="w-full max-w-[260px] rounded-2xl p-2 md:p-2.5 border border-dashed flex flex-col items-center justify-between relative transition"
              style={{ borderColor: `${tokens.accent}55`, backgroundColor: `${tokens.accent}08` }}
            >
              <div className="w-full flex items-center justify-between text-[8px] md:text-[11px] font-mono">
                <span className="font-bold text-slate-400">TAM (전체 시장)</span>
                <span className="font-black text-slate-200">₩12.0조</span>
              </div>

              {/* SAM 중간 원 */}
              <div 
                className="w-[88%] rounded-xl p-1.5 md:p-2 my-1 border flex flex-col items-center justify-between relative shadow-sm"
                style={{ borderColor: `${tokens.accent}88`, backgroundColor: `${tokens.accent}15` }}
              >
                <div className="w-full flex items-center justify-between text-[8px] md:text-[10px] font-mono">
                  <span className="font-bold" style={{ color: tokens.accentSecondary }}>SAM (유효 시장)</span>
                  <span className="font-black" style={{ color: tokens.textPrimary }}>₩2.4조</span>
                </div>

                {/* SOM 타겟 코어 원 */}
                <div 
                  className="w-[82%] rounded-lg p-1 md:p-1.5 mt-1 border-2 flex items-center justify-between shadow-md"
                  style={{ ...getCardStyle('highlight'), borderColor: tokens.accent }}
                >
                  <span className="text-[7px] md:text-[9px] font-mono font-black" style={{ color: tokens.accent }}>
                    🎯 SOM 타겟
                  </span>
                  <span className={`${isMiniature ? 'text-[8px]' : 'text-xs'} font-mono font-black text-emerald-400`}>
                    ₩3,500억
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-[7px] md:text-[10px] font-mono" style={{ color: tokens.textSecondary }}>
            <span>Source: Gartner & IDC 2026</span>
            <span className="text-emerald-400 font-bold">목표 침투율 14.5%</span>
          </div>
        </div>

        {/* 우측: 고객군별 점유율 세그먼트 도넛 차트 */}
        <div 
          className={`${isMiniature ? 'p-2' : 'p-4'} rounded-xl border flex flex-col justify-between h-full`}
          style={getCardStyle('surface')}
        >
          <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: tokens.cardBorder }}>
            <span className={`${isMiniature ? 'text-[7px]' : 'text-xs'} font-mono font-bold flex items-center gap-1`} style={{ color: tokens.accent }}>
              <PieChart className={`${isMiniature ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'}`} />
              <span>고객군 매출 비중 (Customer Segments)</span>
            </span>
            <span className={`${isMiniature ? 'text-[6px]' : 'text-[10px]'} font-mono text-slate-400`}>
              38,500개사
            </span>
          </div>

          <div className="flex-1 flex items-center justify-around my-1 gap-2">
            {/* SVG 도넛 */}
            <div className="relative flex items-center justify-center shrink-0">
              <svg className={`${isMiniature ? 'w-16 h-16' : 'w-24 h-24 md:w-28 md:h-28'} transform -rotate-90`} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#334155" strokeWidth="14" opacity="0.3" />
                {/* Enterprise 45% */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke={tokens.accent} strokeWidth="14" strokeDasharray="238.7" strokeDashoffset="131.3" />
                {/* Tech SaaS 32% */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke={tokens.accentSecondary} strokeWidth="14" strokeDasharray="238.7" strokeDashoffset="162.3" transform="rotate(162 50 50)" />
                {/* Commerce 15% */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#f59e0b" strokeWidth="14" strokeDasharray="238.7" strokeDashoffset="202.9" transform="rotate(277 50 50)" />
                {/* Agency 8% */}
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#8b5cf6" strokeWidth="14" strokeDasharray="238.7" strokeDashoffset="219.6" transform="rotate(331 50 50)" />
              </svg>
              <div className="absolute flex flex-col items-center justify-center text-center">
                <span className={`${isMiniature ? 'text-[6px]' : 'text-[9px]'} font-mono text-slate-400`}>SHARE</span>
                <span className={`${isMiniature ? 'text-[8px]' : 'text-xs md:text-sm'} font-mono font-black`} style={{ color: tokens.textPrimary }}>
                  45%
                </span>
              </div>
            </div>

            {/* 도넛 범례 (Legend) */}
            <div className="space-y-1 text-[8px] md:text-[11px] font-mono flex-1">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tokens.accent }} />
                  <span style={{ color: tokens.textPrimary }}>엔터프라이즈</span>
                </span>
                <span className="font-bold text-emerald-400">45%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tokens.accentSecondary }} />
                  <span style={{ color: tokens.textPrimary }}>테크 SaaS</span>
                </span>
                <span className="font-bold" style={{ color: tokens.accentSecondary }}>32%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span style={{ color: tokens.textPrimary }}>이커머스</span>
                </span>
                <span className="font-bold text-amber-400">15%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span style={{ color: tokens.textPrimary }}>에이전시</span>
                </span>
                <span className="font-bold text-purple-400">8%</span>
              </div>
            </div>
          </div>

          <div className="pt-1.5 border-t text-[7px] md:text-[10px] font-mono flex items-center justify-between" style={{ borderColor: tokens.cardBorder, color: tokens.textSecondary }}>
            <span>평균 계약 단가: ₩1.2억</span>
            <span className="text-emerald-400 font-bold">NDR 134.8%</span>
          </div>
        </div>
      </div>
    );
  }

  // Slide 2: 분기별 매출 폭발 성장 막대 차트 (Q1~Q4) & ARR 추세선
  if (slideIndex === 2) {
    const quarters = [
      { q: '2026 Q1', val: '₩12.0억', height: 28, badge: '실적', isCurrent: false },
      { q: '2026 Q2', val: '₩21.5억', height: 50, badge: '+79% QoQ', isCurrent: false },
      { q: '2026 Q3', val: '₩34.2억', height: 74, badge: '+59% QoQ', isCurrent: false, highlight: '★ BEP 돌파' },
      { q: '2026 Q4 (E)', val: '₩52.4억', height: 100, badge: '★ +240% YoY', isCurrent: true },
    ];

    return (
      <div className="w-full h-full flex flex-col justify-between p-1 md:p-2 space-y-2">
        {/* 상단 3단 핵심 지표 바 */}
        <div className="grid grid-cols-3 gap-2 w-full shrink-0">
          <div className={`${isMiniature ? 'p-1.5' : 'p-2.5'} rounded-lg border flex items-center justify-between`} style={getCardStyle('elevated')}>
            <div>
              <span className={`${isMiniature ? 'text-[6px]' : 'text-[10px]'} font-mono block text-slate-400`}>ARR (연환산 매출)</span>
              <span className={`${isMiniature ? 'text-xs' : 'text-xl md:text-2xl'} font-black font-mono`} style={{ color: tokens.textPrimary }}>₩52.4억</span>
            </div>
            <span className={`${isMiniature ? 'text-[6px] px-1' : 'text-[10px] px-2 py-0.5'} rounded-full font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30`}>
              +240% YoY
            </span>
          </div>
          <div className={`${isMiniature ? 'p-1.5' : 'p-2.5'} rounded-lg border flex items-center justify-between`} style={getCardStyle('elevated')}>
            <div>
              <span className={`${isMiniature ? 'text-[6px]' : 'text-[10px]'} font-mono block text-slate-400`}>순매출 유지율 (NDR)</span>
              <span className={`${isMiniature ? 'text-xs' : 'text-xl md:text-2xl'} font-black font-mono`} style={{ color: tokens.textPrimary }}>134.8%</span>
            </div>
            <span className={`${isMiniature ? 'text-[6px] px-1' : 'text-[10px] px-2 py-0.5'} rounded-full font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30`}>
              Top 1%
            </span>
          </div>
          <div className={`${isMiniature ? 'p-1.5' : 'p-2.5'} rounded-lg border flex items-center justify-between`} style={getCardStyle('elevated')}>
            <div>
              <span className={`${isMiniature ? 'text-[6px]' : 'text-[10px]'} font-mono block text-slate-400`}>유료 전환율</span>
              <span className={`${isMiniature ? 'text-xs' : 'text-xl md:text-2xl'} font-black font-mono`} style={{ color: tokens.textPrimary }}>18.2%</span>
            </div>
            <span className={`${isMiniature ? 'text-[6px] px-1' : 'text-[10px] px-2 py-0.5'} rounded-full font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30`}>
              3.2x 배속
            </span>
          </div>
        </div>

        {/* 메인 차트 영역: 4분기 막대그래프 + SVG 상향 추세선 */}
        <div 
          className="flex-1 rounded-xl border p-2 md:p-3 flex flex-col justify-between relative overflow-hidden"
          style={getCardStyle('surface')}
        >
          <div className="flex items-center justify-between border-b pb-1 text-[10px] font-mono">
            <span className="font-bold flex items-center gap-1.5" style={{ color: tokens.accent }}>
              <BarChart3 className="w-3.5 h-3.5" />
              <span>2026 분기별 매출 성장 추이 & 손익분기점(BEP) 돌파 곡선</span>
            </span>
            <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 text-[9px] md:text-[10px]">
              ✓ Q3 BEP 조기 달성 완료
            </span>
          </div>

          {/* 차트 캔버스 */}
          <div className="flex-1 flex items-end justify-around pt-3 md:pt-4 pb-1 relative px-2">
            {/* SVG 배경 그리드 라인 & 상향 추세선 */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none" viewBox="0 0 400 120">
              <line x1="20" y1="30" x2="380" y2="30" stroke="#334155" strokeDasharray="3 3" opacity="0.3" />
              <line x1="20" y1="65" x2="380" y2="65" stroke="#334155" strokeDasharray="3 3" opacity="0.3" />
              <line x1="20" y1="100" x2="380" y2="100" stroke="#334155" opacity="0.4" />
              
              {/* 상향 추세선 (Curved Spline) */}
              <path 
                d="M 50 95 C 120 85, 170 65, 230 45 S 310 25, 350 15" 
                fill="none" 
                stroke={tokens.accent} 
                strokeWidth="2.5" 
              />
              {/* 추세선 노드 */}
              <circle cx="50" cy="95" r="3.5" fill={tokens.accent} />
              <circle cx="150" cy="75" r="3.5" fill={tokens.accent} />
              <circle cx="250" cy="45" r="4" fill="#10b981" />
              <circle cx="350" cy="15" r="5" fill="#f59e0b" className="animate-pulse" />
            </svg>

            {/* 4개 분기 막대 */}
            {quarters.map((q, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full z-10 px-1 md:px-2 max-w-[90px]">
                {/* 상단 수치 레이블 */}
                <span className={`${isMiniature ? 'text-[7px]' : 'text-[11px]'} font-mono font-bold mb-1 whitespace-nowrap`} style={{ color: tokens.textPrimary }}>
                  {q.val}
                </span>

                {/* 막대 바 */}
                <div 
                  className={`w-full rounded-t-lg transition-all duration-300 relative group cursor-pointer ${q.isCurrent ? 'shadow-lg ring-2 ring-emerald-400/50' : ''}`}
                  style={{
                    height: `${q.height}%`,
                    background: q.isCurrent 
                      ? `linear-gradient(to top, ${tokens.accent}, #10b981)` 
                      : `linear-gradient(to top, ${tokens.cardBg}, ${tokens.accent}99)`,
                    borderTop: `2px solid ${tokens.accent}`,
                  }}
                >
                  {q.highlight && !isMiniature && (
                    <span className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-1.5 py-0.5 rounded text-[8px] font-mono font-bold bg-emerald-500 text-slate-950 shadow">
                      {q.highlight}
                    </span>
                  )}
                </div>

                {/* 하단 분기명 & 뱃지 */}
                <span className={`${isMiniature ? 'text-[6px]' : 'text-[10px]'} font-mono text-slate-400 mt-1 whitespace-nowrap`}>
                  {q.q}
                </span>
                <span className={`${isMiniature ? 'text-[5px]' : 'text-[9px]'} font-mono font-bold text-emerald-400`}>
                  {q.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Slide 3: 고객 획득 & 전환 깔때기(Funnel) & LTV/CAC 단위 경제성
  if (slideIndex === 3) {
    const funnelSteps = [
      { label: '월간 웹 방문자', val: '125,000명', rate: '100%', width: 'w-full' },
      { label: '무료 체험 활성화', val: '42,000명', rate: '전환 33.6%', width: 'w-[82%]' },
      { label: '유료 플랜 결제', val: '18,500명', rate: '전환 14.8%', width: 'w-[64%]' },
      { label: '12개월 장기 리텐션', val: '17,100명', rate: '유지율 92.4%', width: 'w-[48%]' },
    ];

    return (
      <div className="grid grid-cols-2 gap-3 w-full h-full items-center">
        {/* 좌측: 4단계 전환 사다리꼴 깔때기 퍼널 */}
        <div 
          className={`${isMiniature ? 'p-2' : 'p-4'} rounded-xl border flex flex-col justify-between h-full`}
          style={getCardStyle('surface')}
        >
          <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: tokens.cardBorder }}>
            <span className={`${isMiniature ? 'text-[7px]' : 'text-xs'} font-mono font-bold flex items-center gap-1`} style={{ color: tokens.accent }}>
              <Filter className={`${isMiniature ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'}`} />
              <span>고객 획득 & 전환 퍼널 (Funnel Pipeline)</span>
            </span>
            <span className={`${isMiniature ? 'text-[6px]' : 'text-[10px]'} font-mono text-emerald-400 font-bold`}>
              리텐션 92.4%
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center gap-1.5 my-1">
            {funnelSteps.map((step, idx) => (
              <div key={idx} className="flex flex-col items-center w-full">
                <div 
                  className={`${step.width} ${isMiniature ? 'py-1 px-1.5' : 'py-1.5 px-3'} rounded-lg border flex items-center justify-between transition shadow-sm`}
                  style={{
                    backgroundColor: idx === 3 ? `${tokens.accent}25` : `${tokens.cardBg}ee`,
                    borderColor: idx === 3 ? tokens.accent : `${tokens.cardBorder}`,
                  }}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className={`${isMiniature ? 'text-[6px]' : 'text-[10px]'} font-mono text-slate-400`}>0{idx + 1}</span>
                    <span className={`${isMiniature ? 'text-[7px]' : 'text-xs'} font-semibold truncate`} style={{ color: tokens.textPrimary }}>
                      {step.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`${isMiniature ? 'text-[7px]' : 'text-xs'} font-mono font-black`} style={{ color: tokens.textPrimary }}>
                      {step.val}
                    </span>
                    <span className={`${isMiniature ? 'text-[6px]' : 'text-[9px]'} font-mono px-1 py-0.2 rounded font-bold ${idx === 3 ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                      {step.rate}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1.5 border-t text-[7px] md:text-[10px] font-mono flex items-center justify-between" style={{ borderColor: tokens.cardBorder, color: tokens.textSecondary }}>
            <span>CAC ₩65만 • LTV ₩380만</span>
            <span className="text-emerald-400 font-bold">오가닉 유입 68%</span>
          </div>
        </div>

        {/* 우측: 단위 경제성(Unit Economics) LTV/CAC 게이지 & 회수기간 */}
        <div 
          className={`${isMiniature ? 'p-2' : 'p-4'} rounded-xl border flex flex-col justify-between h-full`}
          style={getCardStyle('surface')}
        >
          <div className="flex items-center justify-between border-b pb-1.5" style={{ borderColor: tokens.cardBorder }}>
            <span className={`${isMiniature ? 'text-[7px]' : 'text-xs'} font-mono font-bold flex items-center gap-1`} style={{ color: tokens.accent }}>
              <Gauge className={`${isMiniature ? 'w-2.5 h-2.5' : 'w-3.5 h-3.5'}`} />
              <span>단위 경제성 & 수익성 (Unit Economics)</span>
            </span>
            <span className={`${isMiniature ? 'text-[6px]' : 'text-[10px]'} font-mono text-slate-400`}>
              VC Benchmark 3.0x
            </span>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center my-1 space-y-2">
            {/* LTV/CAC 5.8x 게이지 카드 */}
            <div className="w-full p-2.5 rounded-xl border flex items-center justify-between" style={getCardStyle('highlight')}>
              <div>
                <span className={`${isMiniature ? 'text-[6px]' : 'text-[10px]'} font-mono text-slate-400 block`}>LTV : CAC 비율</span>
                <span className={`${isMiniature ? 'text-lg' : 'text-3xl'} font-black font-mono text-emerald-400 leading-none`}>5.8x</span>
                <span className={`${isMiniature ? 'text-[6px]' : 'text-[9px]'} font-mono text-slate-400 block mt-0.5`}>LTV ₩380만 / CAC ₩65만</span>
              </div>
              <div className="text-right">
                <span className={`${isMiniature ? 'text-[6px] px-1' : 'text-[10px] px-2 py-0.5'} rounded-full font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40`}>
                  1.9x 벤치마크 초과
                </span>
                <p className={`${isMiniature ? 'text-[6px]' : 'text-[10px]'} text-slate-400 mt-1`}>압도적 고수익 구조</p>
              </div>
            </div>

            {/* CAC 회수기간 프로그레스 바 */}
            <div className="w-full space-y-1">
              <div className="flex items-center justify-between text-[8px] md:text-[10px] font-mono">
                <span className="text-slate-400">CAC 투자 회수 기간 (Payback Period)</span>
                <span className="font-bold text-emerald-400">3.2개월 (업계 12개월 대비 4배 신속)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-800 overflow-hidden relative border border-slate-700">
                <div 
                  className="h-full rounded-full transition-all duration-500" 
                  style={{ 
                    width: '27%', 
                    background: `linear-gradient(to right, ${tokens.accent}, #10b981)` 
                  }} 
                />
              </div>
            </div>

            {/* 마진율 뱃지 */}
            <div className="w-full flex items-center justify-between text-[8px] md:text-[10px] font-mono px-2 py-1 rounded bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400">Gross Margin (매출 총이익률)</span>
              <span className="font-black text-slate-200">82.5% 고마진 SaaS</span>
            </div>
          </div>

          <div className="pt-1.5 border-t text-[7px] md:text-[10px] font-mono flex items-center justify-between" style={{ borderColor: tokens.cardBorder, color: tokens.textSecondary }}>
            <span>월간 이탈률: 0.6% 미만</span>
            <span className="text-emerald-400 font-bold">마이너스 넷 처언(Net Churn) 달성</span>
          </div>
        </div>
      </div>
    );
  }

  // Slide 4: 2x2 경쟁 포지셔닝 축 & 마켓 리더 버블 스캐터 매트릭스
  if (slideIndex === 4) {
    return (
      <div 
        className={`${isMiniature ? 'p-2' : 'p-4'} rounded-xl border w-full h-full flex flex-col justify-between relative`}
        style={getCardStyle('surface')}
      >
        <div className="flex items-center justify-between border-b pb-1.5 text-xs font-mono">
          <span className="font-bold flex items-center gap-1.5" style={{ color: tokens.accent }}>
            <Target className="w-3.5 h-3.5" />
            <span>2x2 경쟁 포지셔닝 매트릭스 (Competitive Landscape)</span>
          </span>
          <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30 text-[10px]">
            ★ 마켓 리더 독점 영역
          </span>
        </div>

        {/* 2x2 사분면 그리드 */}
        <div className="flex-1 grid grid-cols-2 gap-2 my-2 relative">
          {/* Challengers (좌상단) */}
          <div className={`${isMiniature ? 'p-1.5' : 'p-3'} rounded-lg border flex flex-col justify-between`} style={getCardStyle('sunken')}>
            <span className={`${isMiniature ? 'text-[7px]' : 'text-[10px]'} font-bold font-mono text-slate-400`}>CHALLENGERS</span>
            <div>
              <div className={`${isMiniature ? 'text-[8px]' : 'text-xs md:text-sm'} font-bold text-slate-200`}>레거시 SI & 전통 디자인 에이전시</div>
              <p className={`${isMiniature ? 'text-[6px]' : 'text-[10px]'} text-slate-400 mt-0.5`}>프로젝트당 수억 원 소요, 6개월 이상의 긴 리드타임</p>
            </div>
            <span className={`${isMiniature ? 'text-[6px]' : 'text-[9px]'} font-mono text-red-400 font-bold`}>높은 비용 • 낮은 유연성</span>
          </div>

          {/* ★ MARKET LEADER (우상단 - 자사 단독 스포트라이트) */}
          <div 
            className={`${isMiniature ? 'p-1.5' : 'p-3'} rounded-lg border-2 flex flex-col justify-between relative shadow-xl overflow-hidden`} 
            style={{ ...getCardStyle('highlight'), borderColor: tokens.accent }}
          >
            <div className="flex items-center justify-between">
              <span className={`${isMiniature ? 'text-[7px]' : 'text-[10px]'} font-black font-mono flex items-center gap-1 text-emerald-400`}>
                <Sparkles className="w-3 h-3" />
                <span>★ UNCONTESTED LEADER</span>
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </div>
            <div>
              <div className={`${isMiniature ? 'text-[9px]' : 'text-sm md:text-base'} font-black`} style={{ color: tokens.textPrimary }}>
                CORE STUDIO AI (자사)
              </div>
              <p className={`${isMiniature ? 'text-[6px]' : 'text-[10px]'} text-slate-300 mt-0.5`}>
                초정밀 프롬프트-코드 아키텍처로 3초 완성 & 엔터프라이즈 맞춤형
              </p>
            </div>
            <div className="flex items-center justify-between text-[7px] md:text-[10px] font-mono">
              <span className="text-emerald-400 font-black">시장 점유율 68% 독점</span>
              <span className="font-bold text-slate-200">ROI 4.8배</span>
            </div>
          </div>

          {/* Niche Players (좌하단) */}
          <div className={`${isMiniature ? 'p-1.5' : 'p-3'} rounded-lg border flex flex-col justify-between`} style={getCardStyle('sunken')}>
            <span className={`${isMiniature ? 'text-[7px]' : 'text-[10px]'} font-bold font-mono text-slate-400`}>NICHE PLAYERS</span>
            <div>
              <div className={`${isMiniature ? 'text-[8px]' : 'text-xs md:text-sm'} font-bold text-slate-300`}>단순 노코드 템플릿 도구</div>
              <p className={`${isMiniature ? 'text-[6px]' : 'text-[10px]'} text-slate-400 mt-0.5`}>커스텀 불가, 단순 정적 레이아웃 한계</p>
            </div>
            <span className={`${isMiniature ? 'text-[6px]' : 'text-[9px]'} font-mono text-slate-400`}>엔터프라이즈 적용 불가</span>
          </div>

          {/* Visionaries (우하단) */}
          <div className={`${isMiniature ? 'p-1.5' : 'p-3'} rounded-lg border flex flex-col justify-between`} style={getCardStyle('sunken')}>
            <span className={`${isMiniature ? 'text-[7px]' : 'text-[10px]'} font-bold font-mono text-slate-400`}>VISIONARIES</span>
            <div>
              <div className={`${isMiniature ? 'text-[8px]' : 'text-xs md:text-sm'} font-bold text-slate-300`}>오픈소스 파운데이션 모델</div>
              <p className={`${isMiniature ? 'text-[6px]' : 'text-[10px]'} text-slate-400 mt-0.5`}>자체 인프라 엔지니어링 필요, 도입 난이도 高</p>
            </div>
            <span className={`${isMiniature ? 'text-[6px]' : 'text-[9px]'} font-mono text-slate-400`}>높은 기술 장벽</span>
          </div>
        </div>

        {/* 축 레이블 각주 */}
        <div className="pt-1.5 border-t flex items-center justify-between text-[7px] md:text-[10px] font-mono text-slate-400" style={{ borderColor: tokens.cardBorder }}>
          <span>X축: 도입 용이성 및 비용 효율성 →</span>
          <span>↑ Y축: 엔터프라이즈 맞춤형 AI 완성도</span>
        </div>
      </div>
    );
  }

  // Slide 5: 4단계 마일스톤 실행 로드맵 & 2026 Q4 BEP 조기 달성 결론
  return (
    <div className="w-full h-full flex flex-col justify-between p-1 md:p-2 space-y-2">
      {/* 4단계 타임라인 카드 */}
      <div className="grid grid-cols-4 gap-2 w-full">
        {[
          { step: 'Q1-Q2', title: 'AI 엔진 2.0 배포', desc: '초정밀 프롬프트 100% 컴파일', status: '완료 ✓', active: false },
          { step: 'Q3', title: '국내 인프라 공급', desc: '38,500사 도입 & BEP 조기 달성', status: '완료 ✓', active: false },
          { step: 'Q4', title: 'APAC 3개국 동시 런칭', desc: '싱가포르·일본 엔터프라이즈 진출', status: '진행 중 ⚡️', active: true },
          { step: '2027 Q2', title: 'ARR 150억 돌파', desc: '글로벌 SaaS 시장 1위 안착', status: '예정 🎯', active: false },
        ].map((st, idx) => (
          <div 
            key={idx} 
            className={`${isMiniature ? 'p-1.5' : 'p-3'} rounded-xl border flex flex-col justify-between ${st.active ? 'border-2 ring-1' : ''}`}
            style={{
              ...getCardStyle(st.active ? 'highlight' : 'surface'),
              borderColor: st.active ? tokens.accent : tokens.cardBorder,
            }}
          >
            <div className="flex items-center justify-between">
              <span className={`${isMiniature ? 'text-[7px]' : 'text-xs'} font-mono font-bold`} style={{ color: tokens.accent }}>
                {st.step}
              </span>
              <span className={`${isMiniature ? 'text-[6px]' : 'text-[9px]'} font-mono font-bold ${st.active ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`}>
                {st.status}
              </span>
            </div>
            <h4 className={`${isMiniature ? 'text-[7px] my-1' : 'text-xs md:text-sm font-bold my-1.5'}`} style={{ color: tokens.textPrimary }}>
              {st.title}
            </h4>
            <p className={`${isMiniature ? 'text-[6px] line-clamp-1' : 'text-[10px]'} leading-tight`} style={{ color: tokens.textSecondary }}>
              {st.desc}
            </p>
          </div>
        ))}
      </div>

      {/* 최종 경영진 결론 콜아웃 */}
      <div 
        className={`${isMiniature ? 'p-2' : 'p-4 md:p-5'} rounded-xl border text-center space-y-1`}
        style={getCardStyle('highlight')}
      >
        <span className={`${isMiniature ? 'text-[6px]' : 'text-[10px]'} font-mono font-bold uppercase tracking-wider text-emerald-400`}>
          ✦ STRATEGIC EXECUTIVE TAKEAWAY
        </span>
        <h3 className={`${isMiniature ? 'text-[9px]' : 'text-base md:text-xl font-black'} leading-snug`} style={{ color: tokens.textPrimary }}>
          &quot;독보적 기술 해자와 강력한 플라이휠로 2026년 4분기 BEP 조기 달성 및 글로벌 시장 1위 도약&quot;
        </h3>
        <p className={`${isMiniature ? 'text-[6px] line-clamp-1' : 'text-xs'} max-w-xl mx-auto`} style={{ color: tokens.textSecondary }}>
          Series B 150억 원 투자 유치를 통해 글로벌 APAC 시장을 조기 선점하고 압도적 경쟁 격차를 구축합니다.
        </p>
      </div>
    </div>
  );
}

/* =========================================================================
   2. 🌐 웹사이트 풀 아키텍처 캔버스 (풀 랜딩 롱스크롤 & 8대 섹션 완결)
   ========================================================================= */
interface WebCanvasSectionProps {
  ds: ResolvedDesignSystem;
  content: ReturnType<typeof parseContentForLayout>;
  webViewMode: 'full_scroll' | 'hero_focus' | 'mobile';
  setWebViewMode: (mode: 'full_scroll' | 'hero_focus' | 'mobile') => void;
  selectedNav?: DomainComponentOption;
  selectedMainDeck?: DomainComponentOption;
  selectedMetric?: DomainComponentOption;
  selectedFooter?: DomainComponentOption;
  subPurpose?: SubPurposeOption;
  tailoredMood?: TailoredMoodOption;
  onUpdateHeadline?: (headline: string) => void;
  activeLayouts?: Record<ReferencePartKey, LayoutReference>;
  customOptions?: CanvasCustomOptions;
  onOpenReferenceStudio?: (part?: ReferencePartKey) => void;
  legoBlocks?: LegoBlockItem[];
  onMoveLegoBlock?: (instanceId: string, direction: 'up' | 'down') => void;
  onRemoveLegoBlock?: (instanceId: string) => void;
  onAddLegoBlockClick?: () => void;
  layoutPreset?: LayoutPreset;
  inspectMode?: boolean;
}

function renderSingleLegoBlockContent(
  block: LegoBlockItem,
  ds: ResolvedDesignSystem,
  content: ReturnType<typeof parseContentForLayout>,
  customOptions: CanvasCustomOptions,
  onUpdateHeadline?: (headline: string) => void,
  activeHotspot: number | null = 0,
  setActiveHotspot?: (idx: number) => void
) {
  const { tokens, getCardStyle, getButtonStyle, getBadgeStyle, getHeadlineStyle } = ds;
  const t = block.type || block.componentId || '';

  // 1. 헤더 / GNB
  if (block.category === 'header' || t.includes('nav')) {
    return (
      <header className="px-4 py-3 rounded-xl border flex items-center justify-between select-none" style={getCardStyle('surface')}>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tokens.accent }} />
          <span className="font-black text-xs tracking-tight" style={{ color: tokens.textPrimary }}>CORE//STUDIO</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-[11px]" style={{ color: tokens.textSecondary }}>
          <span className="font-bold text-white">기능</span>
          <span>쇼케이스</span>
          <span>기술 스펙</span>
          <span>요금제</span>
        </div>
        <button className="px-3 py-1 text-[11px] font-bold rounded shadow" style={getButtonStyle('primary')}>
          시작하기
        </button>
      </header>
    );
  }

  // 2. 16:9 비디오 플레이어 & 쇼릴
  if (t.includes('video-ambient') || t.includes('showreel') || (block.focalAnchor === 'video' && block.category === 'hero')) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 min-h-[300px] flex flex-col justify-between p-6">
        <img src={UNSPLASH.cyberNeon} alt="Video" className="absolute inset-0 w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70" />
        <div className="relative z-10 flex items-center justify-between text-xs font-mono">
          <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            LIVE 4K 60FPS
          </span>
          <span className="text-slate-400">03:45 / 07:20</span>
        </div>
        <div className="relative z-10 text-center my-auto space-y-3 py-4">
          <div className="inline-flex w-14 h-14 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 items-center justify-center shadow-xl shadow-cyan-500/30">
            <Play className="w-6 h-6 fill-current ml-0.5" />
          </div>
          <h3 className="text-xl md:text-3xl font-black text-white">{content.headline}</h3>
          <p className="text-xs text-slate-300 max-w-md mx-auto">프레임 단위로 살아 숨 쉬는 인터랙티브 비디오 모션 아키텍처</p>
        </div>
        <div className="relative z-10 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>● 01 KEYNOTE INTRO</span>
          <span>1080p 60fps</span>
        </div>
      </div>
    );
  }

  // 3. 9:16 세로 숏폼 릴스 3단 그리드
  if (t.includes('shorts') || t.includes('video-shorts')) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { tag: '01 MOTION REEL', title: '실시간 AI 인터랙션 렌더링', views: '14.8M', img: UNSPLASH.techDevice },
          { tag: '02 HARDWARE BTS', title: '티타늄 프레임 가공 공정', views: '8.4M', img: UNSPLASH.explodedTech },
          { tag: '03 KEYNOTE CUT', title: '원클릭 프롬프트 생성 시연', views: '22.1M', img: UNSPLASH.cyberNeon },
        ].map((reel, idx) => (
          <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 min-h-[140px] flex flex-col justify-between p-3.5 group hover:border-cyan-500/50 transition">
            <img src={reel.img} alt={reel.title} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
            <div className="relative z-10 flex items-center justify-between text-[10px] font-mono">
              <span className="px-2 py-0.5 rounded bg-slate-950/80 text-cyan-400 border border-cyan-500/30 font-bold">{reel.tag}</span>
              <span className="flex items-center gap-1 text-slate-300"><Eye className="w-3 h-3 text-cyan-400" />{reel.views}</span>
            </div>
            <div className="relative z-10 flex items-end justify-between">
              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition">{reel.title}</h4>
                <span className="text-[10px] text-slate-400 font-mono">00:45 / REEL</span>
              </div>
              <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-500/40">
                <Play className="w-3 h-3 fill-current ml-0.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 4. 하이패션 룩북 필름스트립
  if (t.includes('lookbook')) {
    return (
      <div className="p-5 md:p-8 rounded-2xl border space-y-4" style={getCardStyle('elevated')}>
        <div className="flex items-center justify-between border-b pb-3 border-slate-700/60">
          <span className="text-xs font-serif font-bold text-emerald-400">LUXURY EDITORIAL LOOKBOOK</span>
          <span className="text-[10px] font-mono text-slate-400">COLLECTION 01/08</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { img: UNSPLASH.fashionLookbook1, label: 'SILHOUETTE NO.1', desc: '내추럴 리넨 & 미니멀 드레이프' },
            { img: UNSPLASH.fashionLookbook2, label: 'SILHOUETTE NO.2', desc: '건축적 볼륨 & 모노크롬 텍스처' },
            { img: UNSPLASH.fashionLookbook3, label: 'SILHOUETTE NO.3', desc: '자연광 테일러링 & 클래식 핏' },
          ].map((item, idx) => (
            <div key={idx} className="group relative rounded-xl overflow-hidden border border-slate-800 aspect-[3/4]">
              <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3">
                <div className="text-xs font-bold text-white font-serif">{item.label}</div>
                <div className="text-[10px] text-slate-300">{item.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. 60:40 비대칭 화보 스플릿
  if (t.includes('split-6040') || t.includes('photo-split')) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 rounded-2xl border" style={getCardStyle('elevated')}>
        <div className="md:col-span-7 relative rounded-xl overflow-hidden border border-slate-700 min-h-[240px]">
          <img src={UNSPLASH.architecture} alt="Arch" className="w-full h-full object-cover min-h-[240px]" />
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs font-mono text-white">
            <span className="px-2 py-0.5 rounded bg-slate-900/90">ARCHITECTURAL RESIDENCE</span>
            <span className="text-emerald-400">100% DAYLIGHT</span>
          </div>
        </div>
        <div className="md:col-span-5 space-y-3">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold" style={getBadgeStyle('accent')}>60:40 ASYMMETRIC TENSION</span>
          <h4 className="text-xl font-bold" style={{ color: tokens.textPrimary }}>공간과 자연광의 순수한 조화</h4>
          <p className="text-xs text-slate-400">좌측의 웅장한 실사 화보와 우측의 미니멀 텍스트가 빚어내는 궁극의 시각적 긴장감.</p>
        </div>
      </div>
    );
  }

  // 6. 메이슨리 갤러리
  if (t.includes('masonry')) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[UNSPLASH.macroTexture, UNSPLASH.streetCollage, UNSPLASH.techDevice, UNSPLASH.organicFood].map((src, i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-slate-800 aspect-[4/5] relative group">
            <img src={src} alt="Mood" className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
            <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-transparent transition" />
          </div>
        ))}
      </div>
    );
  }

  // 7. 3D 포디움 스테이지
  if (t.includes('3d') || t.includes('podium')) {
    return (
      <div className="p-8 rounded-2xl border text-center space-y-4 flex flex-col items-center" style={getCardStyle('elevated')}>
        <span className="text-xs font-mono font-bold text-emerald-400">3D HARDWARE PODIUM</span>
        <div className="w-36 h-36 rounded-2xl bg-gradient-to-tr from-slate-800 to-slate-900 border-2 border-emerald-400 flex items-center justify-center shadow-2xl shadow-emerald-500/20">
          <Sparkles className="w-10 h-10 text-emerald-300 animate-spin" />
        </div>
        <h4 className="text-base font-bold text-white">초정밀 3D 레이트레이싱 렌더링 무대</h4>
      </div>
    );
  }

  // 8. 핫스팟 핀 뷰어
  if (t.includes('hotspot')) {
    return (
      <div className="relative rounded-2xl overflow-hidden border border-slate-700 min-h-[240px]">
        <img src={UNSPLASH.techDevice} alt="Hotspot" className="w-full h-full object-cover min-h-[240px]" />
        <div className="absolute inset-0 bg-slate-950/40" />
        {[
          { top: '35%', left: '30%', label: '0.1mm 레이저 커팅 바디' },
          { top: '60%', left: '50%', label: '초정밀 햅틱 센서' },
          { top: '40%', left: '75%', label: '항공 티타늄 프레임' },
        ].map((pin, i) => (
          <div key={i} className="absolute w-6 h-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-400 flex items-center justify-center text-slate-950 font-bold text-xs shadow-lg animate-pulse" style={{ top: pin.top, left: pin.left }}>
            {i + 1}
          </div>
        ))}
        <div className="absolute bottom-3 left-3 bg-slate-900/90 p-2 rounded-lg text-xs text-emerald-300 font-mono">
          📍 INTERACTIVE HOTSPOT SPEC VIEWER
        </div>
      </div>
    );
  }

  // 9. 96pt 자이언트 서체
  if (t.includes('giant') || t.includes('brutalist')) {
    return (
      <div className="p-8 rounded-2xl border text-center space-y-4" style={getCardStyle('surface')}>
        <span className="text-xs font-mono text-yellow-400 font-bold">⚡ NEO-BRUTALIST SLOGAN</span>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter uppercase" style={getHeadlineStyle('hero')}>
          {content.headline}
        </h2>
        <div className="w-full h-1 bg-yellow-400" />
      </div>
    );
  }

  // 10. 무한 롤링 마키 티커
  if (t.includes('marquee')) {
    return (
      <div className="w-full overflow-hidden py-3 border-y border-slate-700/60 font-mono text-xs space-y-1">
        <div className="whitespace-nowrap flex gap-6 text-emerald-400 font-bold animate-pulse">
          <span>✦ REVOLUTIONARY DESIGN SYSTEMS</span>
          <span>✦ ARCHITECTURAL PRECISION</span>
          <span>✦ MONUMENTAL TYPOGRAPHY</span>
          <span>✦ WCAG 7:1 ACCESSIBILITY</span>
        </div>
      </div>
    );
  }

  // 11. 대형 인용구
  if (t.includes('quote')) {
    return (
      <div className="p-8 rounded-2xl border text-center space-y-3" style={getCardStyle('surface')}>
        <span className="text-3xl font-serif text-amber-400">&ldquo;</span>
        <blockquote className="text-lg md:text-2xl font-serif italic text-white max-w-xl mx-auto">
          &quot;단순함이 궁극의 정교함이다. 비울수록 프로덕트의 가치는 극대화됩니다.&quot;
        </blockquote>
        <div className="text-xs font-mono text-slate-400">— EXECUTIVE MANIFESTO</div>
      </div>
    );
  }

  // 12. 12열 벤토 그리드
  if (t.includes('bento')) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        <div className="md:col-span-8 p-6 rounded-2xl border flex flex-col justify-between space-y-3" style={getCardStyle('elevated')}>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold" style={getBadgeStyle('accent')}>BENTO GRID 2.0</span>
          <h3 className="text-xl font-bold" style={{ color: tokens.textPrimary }}>모듈러 컴포넌트 유기적 결합</h3>
          <p className="text-xs text-slate-400">데이터와 기능을 한 화면에 증명하는 고성능 벤토 아키텍처</p>
        </div>
        <div className="md:col-span-4 p-6 rounded-2xl border flex flex-col justify-between" style={getCardStyle('surface')}>
          <span className="text-[10px] font-mono text-slate-400">SLA RELIABILITY</span>
          <div className="text-3xl font-black font-mono text-emerald-400">99.999%</div>
        </div>
      </div>
    );
  }

  // 13. 48pt 스파크라인 지표
  if (t.includes('sparkline') || block.category === 'metric') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: '연간 반복 매출(ARR)', val: '₩52.4억', delta: '+240% YoY' },
          { label: '활성 구독 기업', val: '38,500사', delta: '+78% QoQ' },
          { label: '고객 유지율(NDR)', val: '134.8%', delta: '상위 1%' },
        ].map((m, i) => (
          <div key={i} className="p-5 rounded-2xl border flex flex-col justify-between" style={getCardStyle('surface')}>
            <span className="text-xs font-mono text-slate-400">{m.label}</span>
            <div className="text-2xl font-black font-mono my-2 text-white">{m.val}</div>
            <span className="text-xs font-bold text-emerald-400">{m.delta}</span>
          </div>
        ))}
      </div>
    );
  }

  // 14. 소셜 프루프 로고 마키
  if (t.includes('proof') || block.category === 'trust') {
    return (
      <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/60 flex items-center justify-between text-xs font-mono text-slate-400 overflow-x-auto">
        <span>TRUSTED BY 2,400+ TECH LEADERS:</span>
        <div className="flex items-center gap-6 font-bold text-slate-300">
          <span>◆ ACME</span>
          <span>◆ HYPERION</span>
          <span>◆ STARLIGHT</span>
          <span>◆ NEXTSCALE</span>
        </div>
      </div>
    );
  }

  // 15. CTA 배너 & 플로팅 독
  if ((block.category as string) === 'cta' || block.category === 'conversion' || t.includes('pip')) {
    return (
      <div className="p-6 md:p-10 rounded-2xl border text-center space-y-4 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-cyan-950/40" style={getCardStyle('highlight')}>
        <span className="px-3 py-1 rounded-full text-xs font-mono font-bold" style={getBadgeStyle('accent')}>⚡️ 1-CLICK INSTANT LAUNCH</span>
        <h3 className="text-xl md:text-3xl font-black text-white">지금 나만의 독보적 디자인 아키텍처를 완성하세요</h3>
        <button className="px-6 py-3 rounded-xl text-xs font-bold shadow-lg" style={getButtonStyle('primary')}>
          무료로 프로젝트 시작하기 ▶
        </button>
      </div>
    );
  }

  // 16. 푸터
  if (block.category === 'footer') {
    return (
      <footer className="py-4 px-6 rounded-xl border flex items-center justify-between text-xs text-slate-400 font-mono" style={getCardStyle('surface')}>
        <span>© 2026 CORE STUDIO. All rights reserved.</span>
        <span>LATENCY: 12ms • SLA: 99.999%</span>
      </footer>
    );
  }

  // 17. 📂 사이드바 계층형 앱 트리 (sidebar-tree / sidebar-app-tree)
  if (t.includes('sidebar-tree') || t.includes('sidebar-app-tree') || (block.category === 'sidebar' && !t.includes('dock') && !t.includes('filter') && !t.includes('docs'))) {
    return (
      <div className="p-3.5 rounded-2xl border flex flex-col gap-4 select-none min-h-[460px] justify-between" style={getCardStyle('surface')}>
        <div className="space-y-3">
          {/* 워크스페이스 스위처 */}
          <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-lg flex items-center justify-center font-bold text-[10px]" style={{ backgroundColor: tokens.accent, color: tokens.bg }}>C</span>
              <div className="text-left">
                <span className="text-xs font-bold block text-white leading-tight">Core Studio</span>
                <span className="text-[9px] font-mono text-slate-400">Pro Enterprise</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* 검색 바 */}
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400">
            <Search className="w-3.5 h-3.5" />
            <span className="text-[11px]">빠른 검색...</span>
            <span className="ml-auto font-mono text-[9px] px-1 rounded bg-slate-800/80 border border-slate-700">⌘K</span>
          </div>

          {/* 네비게이션 트리 */}
          <div className="space-y-1 text-xs">
            <span className="text-[10px] font-mono font-bold text-slate-500 uppercase px-2">Workspace</span>
            {[
              { label: '대시보드 홈', icon: Layout, active: true, count: 'Live' },
              { label: '분석 & 텔레메트리', icon: BarChart3, active: false },
              { label: '데이터베이스 그리드', icon: Database, active: false, count: '24' },
              { label: '자동화 워크플로우', icon: Workflow, active: false },
              { label: 'API & 웹훅', icon: Terminal, active: false },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-xl cursor-pointer transition ${
                    item.active 
                      ? 'bg-slate-800/80 text-white font-bold border border-slate-700/60' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className="w-3.5 h-3.5" style={{ color: item.active ? tokens.accent : undefined }} />
                    <span className="text-xs">{item.label}</span>
                  </div>
                  {item.count && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${item.active ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                      {item.count}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 하단 사용자 프로필 */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">
              JD
            </div>
            <div>
              <span className="text-xs font-bold text-white block leading-tight">Jane Doe</span>
              <span className="text-[10px] text-slate-400 font-mono">Architect</span>
            </div>
          </div>
          <Settings className="w-3.5 h-3.5 text-slate-400 hover:text-white cursor-pointer" />
        </div>
      </div>
    );
  }

  // 18. 🍱 사이드바 슬림 아이콘 독 (sidebar-dock / sidebar-icon-dock)
  if (t.includes('sidebar-dock') || t.includes('sidebar-icon-dock')) {
    return (
      <div className="p-2 rounded-2xl border flex flex-col items-center justify-between select-none min-h-[460px] w-full" style={getCardStyle('surface')}>
        <div className="flex flex-col items-center gap-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shadow-md" style={{ backgroundColor: tokens.accent, color: tokens.bg }}>
            ▲
          </div>
          <div className="w-6 h-[1px] bg-slate-800" />
          <div className="flex flex-col items-center gap-1.5">
            {[
              { icon: Layout, active: true },
              { icon: BarChart3, active: false },
              { icon: Database, active: false },
              { icon: Users, active: false },
              { icon: Zap, active: false },
            ].map((btn, idx) => {
              const Icon = btn.icon;
              return (
                <div
                  key={idx}
                  className={`w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition ${
                    btn.active ? 'bg-slate-800 text-white shadow border border-slate-700' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className="w-4 h-4" style={{ color: btn.active ? tokens.accent : undefined }} />
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-white">
            JD
          </div>
          <Settings className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer transition" />
        </div>
      </div>
    );
  }

  // 19. 🔍 사이드바 다면 필터 (sidebar-filter / sidebar-filter-facets)
  if (t.includes('sidebar-filter')) {
    return (
      <div className="p-4 rounded-2xl border space-y-4 select-none min-h-[460px]" style={getCardStyle('surface')}>
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-black text-white flex items-center gap-1.5">
            <ListFilter className="w-3.5 h-3.5 text-emerald-400" /> 필터 검색
          </span>
          <button className="text-[10px] text-slate-400 hover:text-white font-mono">초기화</button>
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">가격대 (\$0 - \$1,000)</span>
          <input type="range" className="w-full accent-emerald-400 h-1.5 bg-slate-800 rounded-lg cursor-pointer" />
          <div className="flex justify-between text-[10px] font-mono text-slate-400">
            <span>\$0</span>
            <span className="text-emerald-400 font-bold">\$450</span>
            <span>\$1,000+</span>
          </div>
        </div>
        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">카테고리</span>
          {['생성형 AI 모델', '엔터프라이즈 SaaS', '모바일 SDK', '클라우드 인프라'].map((cat, i) => (
            <label key={i} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white">
              <input type="checkbox" defaultChecked={i === 0 || i === 1} className="rounded accent-emerald-500" />
              <span>{cat}</span>
            </label>
          ))}
        </div>
        <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
          <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">인기 태그</span>
          <div className="flex flex-wrap gap-1">
            {['#Next.js16', '#Tailwind4', '#React19', '#v0', '#AI'].map((t, i) => (
              <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800 text-slate-300 hover:border-emerald-500/50 cursor-pointer">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 20. 📑 사이드바 도큐먼트 목차 (sidebar-docs / sidebar-docs-nav)
  if (t.includes('sidebar-docs')) {
    return (
      <div className="p-4 rounded-2xl border space-y-4 select-none min-h-[460px]" style={getCardStyle('surface')}>
        <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span className="text-xs font-bold text-white">API Reference</span>
          <span className="text-[9px] font-mono px-1 rounded bg-slate-800 text-emerald-400 ml-auto">v3.2</span>
        </div>
        <div className="space-y-3 text-xs">
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Getting Started</span>
            <div className="mt-1 space-y-1 pl-2 border-l border-slate-800">
              <div className="text-emerald-400 font-bold">빠른 시작 (Quickstart)</div>
              <div className="text-slate-400 hover:text-white cursor-pointer">인증 및 토큰 발급</div>
              <div className="text-slate-400 hover:text-white cursor-pointer">SDK 설치 가이드</div>
            </div>
          </div>
          <div>
            <span className="text-[10px] font-mono text-slate-500 uppercase font-bold">Endpoints</span>
            <div className="mt-1 space-y-1.5">
              {[
                { m: 'GET', p: '/v1/chat/models', c: 'text-blue-400 bg-blue-950/60' },
                { m: 'POST', p: '/v1/completions', c: 'text-emerald-400 bg-emerald-950/60' },
                { m: 'POST', p: '/v1/embeddings', c: 'text-emerald-400 bg-emerald-950/60' },
                { m: 'DELETE', p: '/v1/keys/:id', c: 'text-red-400 bg-red-950/60' },
              ].map((ep, i) => (
                <div key={i} className="flex items-center gap-2 font-mono text-[10px] p-1.5 rounded-lg bg-slate-900/60 border border-slate-800 hover:border-slate-700 cursor-pointer">
                  <span className={`px-1 py-0.2 rounded font-bold ${ep.c}`}>{ep.m}</span>
                  <span className="text-slate-300 truncate">{ep.p}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 21. ⚡️ 우측 액티비티 타임라인 (aside-timeline / aside-activity)
  if (t.includes('aside-timeline') || t.includes('aside-activity')) {
    return (
      <div className="p-4 rounded-2xl border space-y-4 select-none min-h-[420px]" style={getCardStyle('surface')}>
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-black text-white">실시간 액티비티</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">LIVE FEED</span>
        </div>
        <div className="space-y-3 text-xs">
          {[
            { tag: 'DEPLOY', title: 'Edge Worker v3.8 배포 성공', time: '방금 전', color: 'bg-emerald-500' },
            { tag: 'SECURITY', title: '2단계 인증 토큰 생성', time: '12분 전', color: 'bg-blue-500' },
            { tag: 'BILLING', title: 'Pro 플랜 정기 결제 승인', time: '42분 전', color: 'bg-purple-500' },
            { tag: 'API', title: '웹훅 엔드포인트 200 OK', time: '1시간 전', color: 'bg-cyan-500' },
            { tag: 'BACKUP', title: 'PostgreSQL 스냅샷 저장', time: '3시간 전', color: 'bg-slate-500' },
          ].map((act, i) => (
            <div key={i} className="flex gap-2.5 items-start">
              <div className="mt-1 flex flex-col items-center">
                <span className={`w-2 h-2 rounded-full ${act.color}`} />
                {i < 4 && <div className="w-[1px] h-6 bg-slate-800 my-0.5" />}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-slate-900 border border-slate-800 text-slate-300">{act.tag}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{act.time}</span>
                </div>
                <p className="text-xs text-slate-300 font-medium leading-snug mt-0.5 truncate">{act.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 22. 📊 우측 KPI 인스펙터 (aside-inspector / aside-kpi)
  if (t.includes('aside-inspector') || t.includes('aside-kpi')) {
    return (
      <div className="p-4 rounded-2xl border space-y-4 select-none min-h-[420px]" style={getCardStyle('surface')}>
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-black text-white flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" /> 시스템 인스펙터
          </span>
          <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">ONLINE</span>
        </div>
        <div className="space-y-3">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">평균 응답 속도</span>
              <span className="text-white font-mono font-bold">14.2ms</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-400 rounded-full" style={{ width: '85%' }} />
            </div>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-400">클러스터 가용 메모리</span>
              <span className="text-white font-mono font-bold">78.4%</span>
            </div>
            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-400 rounded-full" style={{ width: '78%' }} />
            </div>
          </div>
          <div className="space-y-1 text-xs pt-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">속성 메타데이터</span>
            <div className="text-[11px] font-mono text-slate-300 space-y-1">
              <div className="flex justify-between py-1 border-b border-slate-800/60"><span className="text-slate-500">REGION</span><span>ap-northeast-2</span></div>
              <div className="flex justify-between py-1 border-b border-slate-800/60"><span className="text-slate-500">RUNTIME</span><span>Node.js v20.18</span></div>
              <div className="flex justify-between py-1 border-b border-slate-800/60"><span className="text-slate-500">TLS CERT</span><span>Let&apos;s Encrypt ECC</span></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 23. 👥 우측 팀 협업 & 접속 멤버 (aside-team / aside-team-presence)
  if (t.includes('aside-team')) {
    return (
      <div className="p-4 rounded-2xl border space-y-4 select-none min-h-[420px]" style={getCardStyle('surface')}>
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-black text-white flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-emerald-400" /> 팀원 협업
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 font-bold">4 온라인</span>
        </div>
        <div className="space-y-2.5">
          {[
            { name: 'Sarah Kang', role: '디자인 리드', status: 'online', task: '블록 그리드 튜닝' },
            { name: 'Alex Min', role: '프론트엔드', status: 'online', task: 'Next.js 16 최적화' },
            { name: 'David Lee', role: '백엔드 엔지니어', status: 'busy', task: 'GraphQL 캐시' },
            { name: 'Elena Park', role: '프로덕트 매니저', status: 'away', task: '로드맵 검토' },
          ].map((mem, i) => (
            <div key={i} className="p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div className="w-7 h-7 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-white">
                    {mem.name[0]}
                  </div>
                  <span className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-slate-950 ${mem.status === 'online' ? 'bg-emerald-400' : mem.status === 'busy' ? 'bg-red-400' : 'bg-amber-400'}`} />
                </div>
                <div>
                  <span className="text-xs font-bold text-white block leading-tight">{mem.name}</span>
                  <span className="text-[10px] text-slate-400">{mem.task}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <button className="w-full py-2 rounded-xl border border-dashed border-slate-700 hover:border-emerald-500/60 text-slate-300 hover:text-white text-xs font-bold transition flex items-center justify-center gap-1.5">
          <Plus className="w-3.5 h-3.5 text-emerald-400" />
          <span>새 멤버 초대하기</span>
        </button>
      </div>
    );
  }

  // 24. 🗓️ 우측 캘린더 & 위젯 스택 (aside-widget / aside-widget-stack)
  if (t.includes('aside-widget')) {
    return (
      <div className="p-4 rounded-2xl border space-y-4 select-none min-h-[420px]" style={getCardStyle('surface')}>
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="text-xs font-black text-white flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-purple-400" /> 오늘의 태스크
          </span>
          <span className="text-[10px] font-mono text-slate-400">3/4 완료</span>
        </div>
        <div className="space-y-2">
          {[
            { text: '디자인 시스템 토큰 검증', done: true },
            { text: '사이드바 프리셋 렌더러 구현', done: true },
            { text: 'v0 프롬프트 엔진 연동 테스트', done: true },
            { text: 'WCAG AAA 접근성 최종 확인', done: false },
          ].map((task, i) => (
            <div key={i} className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs">
              <input type="checkbox" defaultChecked={task.done} className="accent-purple-500 rounded" />
              <span className={`text-xs ${task.done ? 'line-through text-slate-500' : 'text-slate-200 font-medium'}`}>{task.text}</span>
            </div>
          ))}
        </div>
        <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-1">
          <span className="text-[10px] font-mono text-purple-300 font-bold block">💡 빠른 퀵 메모:</span>
          <p className="text-xs text-slate-300 leading-relaxed">컴포넌트 추가 시 좌측 슬롯 및 가로폭을 지정하면 자동으로 반응형 그리드에 맞춰집니다.</p>
        </div>
      </div>
    );
  }

  // 25. 📋 인터랙티브 데이터 그리드 테이블 (table-grid / main-data-table)
  if (t.includes('table-grid') || t.includes('main-data-table')) {
    return (
      <div className="p-5 rounded-2xl border space-y-4 select-none" style={getCardStyle('surface')}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" /> 엔터프라이즈 리소스 인덱스
            </h3>
            <p className="text-[11px] text-slate-400">실시간 클라우드 워크로드 및 인프라 상태 테이블</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-400">
              <Search className="w-3 h-3" />
              <input type="text" placeholder="검색..." className="bg-transparent text-white outline-none w-20 sm:w-28 text-xs" />
            </div>
            <button className="px-2.5 py-1 rounded-lg text-xs font-bold shadow" style={getButtonStyle('primary')}>
              + 리소스 생성
            </button>
          </div>
        </div>

        {/* 테이블 본문 */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] font-mono text-slate-400">
                <th className="py-2 px-3">노드 식별자</th>
                <th className="py-2 px-3">상태</th>
                <th className="py-2 px-3">리전</th>
                <th className="py-2 px-3">처리량</th>
                <th className="py-2 px-3 text-right">가용성</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {[
                { id: 'node-cluster-apac-01', status: 'Active', region: 'ICN-01', tps: '124,500 req/s', sla: '99.99%', col: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40' },
                { id: 'node-cluster-us-east-04', status: 'Active', region: 'IAD-04', tps: '389,100 req/s', sla: '100.0%', col: 'text-emerald-400 bg-emerald-950/60 border-emerald-500/40' },
                { id: 'node-cluster-eu-west-02', status: 'Syncing', region: 'LHR-02', tps: '84,200 req/s', sla: '99.95%', col: 'text-amber-400 bg-amber-950/60 border-amber-500/40' },
                { id: 'node-cluster-sa-east-01', status: 'Standby', region: 'GRU-01', tps: '12,000 req/s', sla: '99.90%', col: 'text-slate-400 bg-slate-800 border-slate-700' },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-slate-900/40 transition">
                  <td className="py-2.5 px-3 font-bold text-white flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span>{row.id}</span>
                  </td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${row.col}`}>{row.status}</span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-300">{row.region}</td>
                  <td className="py-2.5 px-3 text-slate-300">{row.tps}</td>
                  <td className="py-2.5 px-3 text-right font-bold text-emerald-400">{row.sla}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  // 26. 📌 애자일 칸반 보드 (kanban-board / main-kanban-board)
  if (t.includes('kanban-board') || t.includes('main-kanban-board')) {
    return (
      <div className="p-5 rounded-2xl border space-y-4 select-none" style={getCardStyle('surface')}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Layout className="w-4 h-4 text-emerald-400" /> 애자일 스프린트 칸반 보드
            </h3>
            <p className="text-[11px] text-slate-400">우선순위 태스크 및 진행 상태 트래킹</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">Sprint 42</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              title: '대기 중 (To Do)',
              count: 2,
              cards: [
                { title: '웹훅 보안 서명 검증', tag: 'SECURITY', priority: 'High', color: 'border-red-500/40 text-red-400' },
                { title: '피그마 컴포넌트 라이브러리 동기화', tag: 'DESIGN', priority: 'Med', color: 'border-blue-500/40 text-blue-400' },
              ]
            },
            {
              title: '진행 중 (In Progress)',
              count: 2,
              cards: [
                { title: '사이드바 자유 배치 아키텍처', tag: 'CORE', priority: 'High', color: 'border-emerald-500/40 text-emerald-400' },
                { title: 'Next.js 16 App Router 최적화', tag: 'ENGINE', priority: 'High', color: 'border-purple-500/40 text-purple-400' },
              ]
            },
            {
              title: '완료됨 (Done)',
              count: 2,
              cards: [
                { title: 'WCAG 7:1 AAA 명도 대비 통과', tag: 'A11Y', priority: 'Done', color: 'border-slate-500/40 text-slate-400' },
                { title: '24대 비주얼 스타일 DNA 구축', tag: 'THEME', priority: 'Done', color: 'border-slate-500/40 text-slate-400' },
              ]
            },
          ].map((col, cIdx) => (
            <div key={cIdx} className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-bold text-white">
                <span>{col.title}</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">{col.count}</span>
              </div>
              <div className="space-y-2">
                {col.cards.map((c, i) => (
                  <div key={i} className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition space-y-2 cursor-pointer shadow-sm">
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span className={`px-1.5 py-0.2 rounded border ${c.color}`}>{c.tag}</span>
                      <span className="text-slate-500">{c.priority}</span>
                    </div>
                    <h4 className="text-xs font-bold text-white leading-snug">{c.title}</h4>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 27. 📈 분석 차트 & 메트릭 매트릭스 (chart-suite / main-chart-suite)
  if (t.includes('chart-suite') || t.includes('main-chart-suite')) {
    return (
      <div className="p-5 rounded-2xl border space-y-5 select-none" style={getCardStyle('surface')}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" /> 실시간 비즈니스 성장 매트릭스
            </h3>
            <p className="text-[11px] text-slate-400">분기별 ARR, 정기 구독자 및 전환율 추이</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">MoM +34.8%</span>
          </div>
        </div>

        {/* 3대 KPI 카드 */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { label: '연간 반복 매출 (ARR)', value: '\$5.24M', delta: '+48.2% YoY', icon: DollarSign },
            { label: '활성 엔터프라이즈 고객', value: '1,420개사', delta: '+124 이번달', icon: Users },
            { label: 'API 평균 레이턴시', value: '18.4ms', delta: '-6.2ms 개선', icon: Zap },
          ].map((kpi, i) => {
            const Icon = kpi.icon;
            return (
              <div key={i} className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>{kpi.label}</span>
                  <Icon className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <div className="text-xl font-black text-white font-mono">{kpi.value}</div>
                <div className="text-[10px] text-emerald-400 font-mono font-bold">{kpi.delta}</div>
              </div>
            );
          })}
        </div>

        {/* 가상 차트 시각화 바 */}
        <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 space-y-2">
          <div className="flex justify-between text-xs font-mono text-slate-400">
            <span>ARR 추이 (2026 Q1 - Q4)</span>
            <span className="text-emerald-400 font-bold">목표 달성률 114%</span>
          </div>
          <div className="h-28 flex items-end gap-2 pt-4 px-2">
            {[35, 45, 60, 52, 70, 85, 78, 92, 100, 115, 128, 142].map((v, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                <div 
                  className="w-full rounded-t-md transition-all duration-300 group-hover:brightness-125"
                  style={{ 
                    height: `${(v / 150) * 100}%`,
                    backgroundColor: idx === 11 ? tokens.accent : '#334155'
                  }}
                />
                <span className="text-[9px] font-mono text-slate-500">{idx + 1}월</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 28. ⚙️ 분할 2열 환경설정 폼 (split-settings / main-split-settings)
  if (t.includes('split-settings') || t.includes('main-split-settings')) {
    return (
      <div className="p-5 rounded-2xl border space-y-4 select-none" style={getCardStyle('surface')}>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-5 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Settings className="w-4 h-4 text-emerald-400" /> 워크스페이스 보안 및 API 제어
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              엔터프라이즈 보안 감사 규칙, 웹훅 자동 재시도 및 접근 토큰 권한을 설정합니다.
            </p>
          </div>
          <div className="md:col-span-7 space-y-3">
            {[
              { title: '엔드포인트 2단계 인증 강제', desc: '모든 API 요청에 헤더 기반 HMAC 서명을 요구합니다', checked: true },
              { title: '실시간 이상 트래픽 자동 차단', desc: '초당 5,000건 이상의 비정상 IP를 즉시 격리합니다', checked: true },
              { title: '주간 분석 리포트 자동 발송', desc: '매주 월요일 슬랙 웹훅으로 통계 요약을 전송합니다', checked: false },
            ].map((setting, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <h4 className="text-xs font-bold text-white">{setting.title}</h4>
                  <p className="text-[11px] text-slate-400">{setting.desc}</p>
                </div>
                <input type="checkbox" defaultChecked={setting.checked} className="accent-emerald-400 w-4 h-4 rounded cursor-pointer" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 29. 💬 소셜 / 타임라인 포스트 피드 (feed-cards / main-feed-cards)
  if (t.includes('feed-cards') || t.includes('main-feed-cards')) {
    return (
      <div className="space-y-4 select-none">
        {[
          {
            author: 'Design Systems Architecture',
            handle: '@ds_core',
            time: '2시간 전',
            text: '차세대 모듈러 UI 아키텍처는 단순히 세로로 쌓는 스택을 넘어, 사이드바와 3단 분할 그리드를 자유롭게 배치할 수 있을 때 진정한 위력을 발휘합니다. 🚀',
            img: UNSPLASH.techDevice,
            likes: '1.2k',
            comments: 84
          },
          {
            author: 'AI Creative Engineering',
            handle: '@ai_creative',
            time: '4시간 전',
            text: 'v0 및 Claude와 100% 호환되는 디자인 토큰 기반 자동 코드 생성 파이프라인 시연 결과입니다.',
            img: UNSPLASH.cyberNeon,
            likes: '890',
            comments: 42
          }
        ].map((post, i) => (
          <div key={i} className="p-4 rounded-2xl border space-y-3" style={getCardStyle('surface')}>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
                {post.author[0]}
              </div>
              <div>
                <span className="text-xs font-bold text-white block leading-tight">{post.author}</span>
                <span className="text-[10px] text-slate-400 font-mono">{post.handle} • {post.time}</span>
              </div>
            </div>
            <p className="text-xs text-slate-200 leading-relaxed">{post.text}</p>
            <div className="rounded-xl overflow-hidden h-40 border border-slate-800 relative">
              <img src={post.img} alt="Post" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <button className="flex items-center gap-1 hover:text-red-400 transition"><Heart className="w-3.5 h-3.5" />{post.likes}</button>
              <button className="flex items-center gap-1 hover:text-blue-400 transition"><MessageCircle className="w-3.5 h-3.5" />{post.comments}</button>
              <button className="flex items-center gap-1 hover:text-white transition ml-auto"><Share2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 30. 🔲 4분할 벤토 인터랙티브 위젯 박스 (bento-quad / main-bento-quad)
  if (t.includes('bento-quad') || t.includes('main-bento-quad')) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 select-none">
        <div className="p-5 rounded-2xl border space-y-2 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900" style={getCardStyle('highlight')}>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">MODULE 01</span>
          <h4 className="text-sm font-bold text-white">실시간 AI 레이아웃 최적화</h4>
          <p className="text-xs text-slate-300">사용자 디바이스와 컨텍스트를 분석하여 0.05초 만에 최적의 그리드를 계산합니다.</p>
        </div>
        <div className="p-5 rounded-2xl border space-y-2 bg-slate-900" style={getCardStyle('surface')}>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold border border-blue-500/30">MODULE 02</span>
          <h4 className="text-sm font-bold text-white">WCAG AAA 색상 조화 엔진</h4>
          <p className="text-xs text-slate-300">7:1 이상의 초고대비 명도 알고리즘으로 시각 장애인 및 저시력자 접근성을 100% 준수합니다.</p>
        </div>
        <div className="p-5 rounded-2xl border space-y-2 bg-slate-900" style={getCardStyle('surface')}>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 font-bold border border-purple-500/30">MODULE 03</span>
          <h4 className="text-sm font-bold text-white">React 19 & Tailwind 4 네이티브</h4>
          <p className="text-xs text-slate-300">불필요한 종속성 없이 표준 Tailwind 클래스로 즉시 배포 가능한 클린 코드를 추출합니다.</p>
        </div>
        <div className="p-5 rounded-2xl border space-y-2 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900" style={getCardStyle('highlight')}>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30">MODULE 04</span>
          <h4 className="text-sm font-bold text-white">글로벌 엣지 배포 텔레메트리</h4>
          <p className="text-xs text-slate-300">전 세계 300+ 엣지 로케이션에 레이아웃 토큰을 즉시 캐싱하여 10ms 미만 로딩을 보장합니다.</p>
        </div>
      </div>
    );
  }

  // 기본 폴백
  return (
    <div className="p-4 rounded-xl border border-slate-800 bg-slate-900/40 text-xs font-mono text-slate-300 flex items-center justify-between">
      <span>🧱 {block.koreanName}</span>
      <span className="text-[10px] text-slate-500 uppercase">{block.category}</span>
    </div>
  );
}

// 기본 사이드바 폴백 컴포넌트 (사이드바 슬롯에 블록이 없을 때 자동 렌더링)
function renderDefaultSidebar(ds: ResolvedDesignSystem) {
  const { tokens, getCardStyle } = ds;
  return (
    <div className="p-3.5 rounded-2xl border flex flex-col gap-4 select-none min-h-[460px] justify-between" style={getCardStyle('surface')}>
      <div className="space-y-3">
        <div className="p-2 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-5 h-5 rounded-lg flex items-center justify-center font-bold text-[10px]" style={{ backgroundColor: tokens.accent, color: tokens.bg }}>C</span>
            <div className="text-left">
              <span className="text-xs font-bold block text-white leading-tight">Core Studio</span>
              <span className="text-[9px] font-mono text-slate-400">Enterprise</span>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>
        <div className="space-y-1 text-xs">
          <span className="text-[10px] font-mono text-slate-500 uppercase px-2 font-bold">App Navigation</span>
          {[
            { label: '대시보드 개요', icon: Layout, active: true },
            { label: '메트릭 & 지표', icon: BarChart3, active: false },
            { label: '데이터베이스', icon: Database, active: false },
            { label: '팀 협업 워크스페이스', icon: Users, active: false },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl cursor-pointer ${
                  item.active ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" style={{ color: item.active ? tokens.accent : undefined }} />
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </div>
      <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
        <span>Jane Doe</span>
        <Settings className="w-3.5 h-3.5" />
      </div>
    </div>
  );
}

// 기본 우측 패널 폴백 컴포넌트
function renderDefaultAside(ds: ResolvedDesignSystem) {
  const { tokens, getCardStyle } = ds;
  return (
    <div className="p-4 rounded-2xl border space-y-4 select-none min-h-[420px]" style={getCardStyle('surface')}>
      <div className="flex items-center justify-between pb-2 border-b border-slate-800">
        <span className="text-xs font-black text-white flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-emerald-400" /> 인스펙터 속성
        </span>
        <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">ONLINE</span>
      </div>
      <div className="space-y-2 text-xs">
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>실시간 가용성</span>
            <span className="text-emerald-400 font-bold font-mono">99.99%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-400" style={{ width: '99%' }} />
          </div>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1">
            <span>평균 지연율</span>
            <span className="text-white font-bold font-mono">14ms</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-400" style={{ width: '85%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

function WebCanvasSection({
  ds,
  content,
  webViewMode,
  setWebViewMode,
  selectedNav,
  selectedMainDeck,
  selectedMetric,
  selectedFooter,
  subPurpose,
  tailoredMood,
  onUpdateHeadline,
  activeLayouts,
  customOptions = {},
  onOpenReferenceStudio,
  legoBlocks,
  onMoveLegoBlock,
  onRemoveLegoBlock,
  onAddLegoBlockClick,
  layoutPreset = 'landing',
  inspectMode = false,
}: WebCanvasSectionProps) {
  const { tokens, getCardStyle, getButtonStyle, getBadgeStyle, getHeadlineStyle } = ds;
  const isMobile = webViewMode === 'mobile';
  const isHeroFocus = webViewMode === 'hero_focus';

  // 실시간 인터랙션 데모 상태 (슬라이더, 탭, 핫스팟 핀, 계산기)
  const [compareSliderPos, setCompareSliderPos] = useState<number>(50);
  const [activeTabIdx, setActiveTabIdx] = useState<number>(0);
  const [activeHotspot, setActiveHotspot] = useState<number | null>(0);
  const [calcMau, setCalcMau] = useState<number>(35000);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // 현재 선택된 파트별 레이아웃 레퍼런스
  const activeHero = activeLayouts?.hero;
  const activeFeature = activeLayouts?.feature;
  const activeProof = activeLayouts?.proof;
  const activePricing = activeLayouts?.pricing;
  const activeCta = activeLayouts?.cta;
  const activeNavFooter = activeLayouts?.nav_footer;

  // 세부 목적(SubPurpose) 및 맞춤 무드(TailoredMood) 실시간 레이아웃 반영
  const spId = subPurpose?.id || '';
  const moodId = tailoredMood?.id || subPurpose?.recommendedMoodId || '';
  const effectiveAnchor = tailoredMood?.focalAnchor || selectedMainDeck?.focalAnchor || activeHero?.focalAnchor;

  // 히어로 레이아웃 및 비주얼 앵커 판별
  const heroShape = activeHero?.wireframeShape || '';
  const heroTrend = activeHero?.trend || '';
  const heroGeom = activeHero?.gridGeometry || '';

  // 1. 🎥 영상 중심: 세부목적이 비디오이거나, 무드가 비디오이거나, 앵커가 video이거나, 레이아웃이 video일 때
  const isVideoHero = spId === 'web-video-launch' || moodId.includes('video') || effectiveAnchor === 'video' || heroShape.includes('video') || activeHero?.id?.includes('video') || selectedMainDeck?.id?.includes('video');

  // 2. 📸 사진/화보 룩북: 세부목적이 룩북/에이전시이거나, 무드가 cinematic이거나, 앵커가 visual이거나
  const isPhotoLookbookHero = !isVideoHero && (spId === 'web-agency' || moodId.includes('cinematic') || (effectiveAnchor === 'visual' && !heroShape.includes('hotspot') && !heroShape.includes('podium') && !heroGeom.includes('60-40')) || heroShape.includes('lookbook') || activeHero?.id?.includes('lookbook') || activeHero?.id?.includes('vogue'));

  // 3. 📸 60:40 비대칭 화보 스플릿
  const isAsymPhotoSplit = !isVideoHero && !isPhotoLookbookHero && (heroShape.includes('photo-split') || heroGeom === 'split-60-40' || activeHero?.id?.includes('6040') || activeHero?.id?.includes('asym'));

  // 4. 🔤 스위스 타이포/에디토리얼 중심
  const isSwissHero = !isVideoHero && !isPhotoLookbookHero && !isAsymPhotoSplit && (spId === 'web-swiss-editorial' || moodId.includes('swiss') || moodId.includes('typo') || effectiveAnchor === 'typo' || heroTrend.includes('Swiss') || heroShape.includes('giant-typo') || heroShape.includes('swiss'));

  // 5. 📊 벤토 모듈러 SaaS 데이터 중심
  const isBentoHero = !isVideoHero && !isPhotoLookbookHero && !isAsymPhotoSplit && !isSwissHero && (spId === 'web-saas' || moodId.includes('bento') || effectiveAnchor === 'data' || heroGeom.includes('bento') || heroShape.includes('bento'));

  // 6. 3D 포디움 & 핫스팟
  const isPodiumHero = !isVideoHero && !isPhotoLookbookHero && !isAsymPhotoSplit && !isSwissHero && !isBentoHero && (heroShape.includes('podium') || activeHero?.id?.includes('podium') || heroShape.includes('3d'));
  const isHotspotHero = !isVideoHero && !isPhotoLookbookHero && !isAsymPhotoSplit && !isSwissHero && !isBentoHero && (heroShape.includes('hotspot') || activeHero?.id?.includes('hotspot'));

  // 7. GenUI 프롬프트 바 (개발자 도구나 GenUI 명시 시)
  const isGenUiPrompt = !isVideoHero && !isPhotoLookbookHero && !isAsymPhotoSplit && !isSwissHero && !isBentoHero && (spId === 'web-dev' || moodId.includes('terminal') || heroShape.includes('prompt') || activeHero?.id?.includes('genui') || effectiveAnchor === 'interactive');
  const isSplit7030 = heroGeom === 'split-70-30';
  const isSplit5050 = heroGeom === 'split-50-50';

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* 웹 전용 뷰포트 툴바 */}
      <div className="w-full max-w-5xl flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-300 flex items-center gap-1.5">
            <Monitor className="w-4 h-4 text-emerald-400" />
            <span>웹사이트 아키텍처 뷰:</span>
          </span>
          <div className="flex items-center p-0.5 rounded-lg bg-slate-950 border border-slate-800">
            <button
              onClick={() => setWebViewMode('full_scroll')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition ${
                webViewMode === 'full_scroll'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>풀 랜딩 롱스크롤</span>
            </button>
            <button
              onClick={() => setWebViewMode('hero_focus')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition ${
                webViewMode === 'hero_focus'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Maximize2 className="w-3.5 h-3.5" />
              <span>히어로 포커스</span>
            </button>
            <button
              onClick={() => setWebViewMode('mobile')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-bold transition ${
                webViewMode === 'mobile'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>모바일 반응형 뷰</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => onOpenReferenceStudio?.('hero')}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold transition"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>376대 레퍼런스 스튜디오</span>
        </button>
      </div>

      {/* 메인 웹 컨테이너 */}
      <div
        className={`w-full ${isMobile ? 'max-w-sm rounded-[36px] border-4 border-slate-700 shadow-2xl p-2' : 'max-w-5xl rounded-2xl border shadow-2xl'} overflow-hidden transition-all duration-300 relative group`}
        style={ds.canvasRootStyle}
      >
        <StyleAtmosphereBadge ds={ds} />
        {isMobile && (
          <div className="w-full flex items-center justify-between px-4 py-1 text-[10px] text-slate-400 select-none border-b border-slate-800/80 mb-2 font-mono">
            <span className="font-bold">9:41</span>
            <div className="w-16 h-3 bg-slate-800 rounded-full" />
            <span>5G 100%</span>
          </div>
        )}

        {/* 앰비언트 글로우 오브 */}
        {ds.hasGlow && (
          <div 
            className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full blur-[100px] pointer-events-none"
            style={ds.glowOrbStyle}
          />
        )}

        {/* -----------------------------------------------------------------
            💎 순수 라이브 미리보기 & 자유 배치 멀티존 레이아웃 엔진
            (헤더 / 사이드바 / 메인 그리드 / 우측 인스펙터 / 푸터 슬롯 분할)
            ----------------------------------------------------------------- */}
        {legoBlocks && legoBlocks.length > 0 ? (() => {
          const visibleBlocks = legoBlocks.filter((block) => {
            if (block.hidden) return false;
            const responsiveHidden = isMobile
              ? block.responsive?.base?.hidden
              : block.responsive?.md?.hidden;
            return !responsiveHidden;
          });
          // 1. 슬롯별 블록 그룹핑
          const headerBlocks = visibleBlocks.filter(b => (b.targetSlot || b.category) === 'header');
          const sidebarBlocks = visibleBlocks.filter(b => (b.targetSlot || b.category) === 'sidebar');
          const asideBlocks = visibleBlocks.filter(b => (b.targetSlot || b.category) === 'aside');
          const footerBlocks = visibleBlocks.filter(b => (b.targetSlot || b.category) === 'footer');
          const mainBlocks = visibleBlocks.filter(b => {
            const slot = b.targetSlot || b.category;
            return !['header', 'sidebar', 'aside', 'footer'].includes(slot);
          });

          // 컬럼 스팬 변환기
          const getColSpanClass = (span?: GridColumnSpan) => {
            switch (span) {
              case 'half':
                return 'col-span-12 md:col-span-6';
              case 'third':
                return 'col-span-12 md:col-span-4';
              case 'two-thirds':
                return 'col-span-12 md:col-span-8';
              default:
                return 'col-span-12';
            }
          };

          const getResponsiveColSpan = (block: LegoBlockItem): GridColumnSpan | undefined => (
            isMobile
              ? block.responsive?.base?.colSpan ?? block.colSpan
              : block.responsive?.md?.colSpan ?? block.colSpan
          );

          // 블록 렌더러 래퍼 (순수 프리뷰 vs 인스펙트 모드)
          const renderBlockWrapper = (block: LegoBlockItem, idx: number, colClass: string = 'col-span-12') => {
            if (inspectMode) {
              return (
                <div 
                  key={block.instanceId} 
                  className={`group/inspect relative rounded-2xl transition duration-150 ${colClass}`}
                >
                  <div className="absolute top-2 right-2 z-30 opacity-0 group-hover/inspect:opacity-100 transition-opacity bg-slate-900/90 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/50 text-emerald-300 shadow pointer-events-none flex items-center gap-1.5">
                    <span className="font-bold">{block.koreanName}</span>
                    <span className="text-slate-400">[{block.targetSlot || 'main'}]</span>
                  </div>
                  <div className="rounded-xl overflow-hidden ring-1 ring-emerald-500/30 group-hover/inspect:ring-2 group-hover/inspect:ring-emerald-400 transition">
                    {renderSingleLegoBlockContent(block, ds, content, customOptions, onUpdateHeadline, activeHotspot, setActiveHotspot)}
                  </div>
                </div>
              );
            }
            // 💎 Pure Live Preview: 100% 무결점 실서비스 뷰
            return (
              <div key={block.instanceId} className={`${colClass} rounded-xl overflow-hidden`}>
                {renderSingleLegoBlockContent(block, ds, content, customOptions, onUpdateHeadline, activeHotspot, setActiveHotspot)}
              </div>
            );
          };

          // 2. 프리셋별 레이아웃 렌더링
          if (layoutPreset === 'sidebar_main') {
            return (
              <div className="relative z-10 flex flex-col min-h-[640px] w-full">
                {headerBlocks.map((b, i) => renderBlockWrapper(b, i, 'w-full'))}
                <div className="flex-1 flex flex-col md:flex-row min-w-0 border-b border-slate-800/80">
                  <aside className="w-full md:w-64 lg:w-72 shrink-0 border-b md:border-b-0 md:border-r border-slate-800/80 p-3 md:p-4 space-y-4 bg-slate-950/40">
                    {sidebarBlocks.length > 0 ? (
                      sidebarBlocks.map((b, i) => renderBlockWrapper(b, i, 'w-full'))
                    ) : (
                      renderDefaultSidebar(ds)
                    )}
                  </aside>
                  <main className="flex-1 min-w-0 p-3 md:p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
                      {mainBlocks.map((b, i) => renderBlockWrapper(b, i, getColSpanClass(getResponsiveColSpan(b))))}
                    </div>
                  </main>
                </div>
                {footerBlocks.map((b, i) => renderBlockWrapper(b, i, 'w-full'))}
              </div>
            );
          }

          if (layoutPreset === 'holy_grail') {
            return (
              <div className="relative z-10 flex flex-col min-h-[680px] w-full">
                {headerBlocks.map((b, i) => renderBlockWrapper(b, i, 'w-full'))}
                <div className="flex-1 flex flex-col lg:flex-row min-w-0 border-b border-slate-800/80">
                  <aside className="w-full lg:w-60 shrink-0 border-b lg:border-b-0 lg:border-r border-slate-800/80 p-3 md:p-4 space-y-4 bg-slate-950/40">
                    {sidebarBlocks.length > 0 ? (
                      sidebarBlocks.map((b, i) => renderBlockWrapper(b, i, 'w-full'))
                    ) : (
                      renderDefaultSidebar(ds)
                    )}
                  </aside>
                  <main className="flex-1 min-w-0 p-3 md:p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
                      {mainBlocks.map((b, i) => renderBlockWrapper(b, i, getColSpanClass(getResponsiveColSpan(b))))}
                    </div>
                  </main>
                  <aside className="w-full lg:w-72 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-800/80 p-3 md:p-4 space-y-4 bg-slate-950/30">
                    {asideBlocks.length > 0 ? (
                      asideBlocks.map((b, i) => renderBlockWrapper(b, i, 'w-full'))
                    ) : (
                      renderDefaultAside(ds)
                    )}
                  </aside>
                </div>
                {footerBlocks.map((b, i) => renderBlockWrapper(b, i, 'w-full'))}
              </div>
            );
          }

          if (layoutPreset === 'bento_grid') {
            return (
              <div className="relative z-10 space-y-5 p-3 md:p-6 w-full">
                {headerBlocks.map((b, i) => renderBlockWrapper(b, i, 'w-full'))}
                <main className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-5">
                  {mainBlocks.map((b, i) => renderBlockWrapper(b, i, getColSpanClass(getResponsiveColSpan(b))))}
                </main>
                {footerBlocks.map((b, i) => renderBlockWrapper(b, i, 'w-full'))}
              </div>
            );
          }

          // 기본: landing (단일 세로 스택)
          return (
            <div className="relative z-10 flex flex-col gap-6 p-3 md:p-6 w-full">
              {headerBlocks.map((b, i) => renderBlockWrapper(b, i, 'w-full'))}
              <main className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
                {mainBlocks.map((b, i) => renderBlockWrapper(b, i, getColSpanClass(getResponsiveColSpan(b))))}
              </main>
              {footerBlocks.map((b, i) => renderBlockWrapper(b, i, 'w-full'))}
            </div>
          );
        })() : (
          <>
            {/* -----------------------------------------------------------------
                섹션 01: 네비게이션 헤더 (GNB)
                ----------------------------------------------------------------- */}
        <header 
          className="relative z-20 px-6 py-4 border-b flex items-center justify-between select-none"
          style={ds.dividerStyle}
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full" style={{ backgroundColor: tokens.accent }} />
            <span className="font-black text-sm tracking-tight" style={{ color: tokens.textPrimary }}>
              CORE//STUDIO 2026
            </span>
          </div>

          {/* 프롬프트 검색창 내장형 GNB일 때 */}
          {activeNavFooter?.id.includes('prompt-search') ? (
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-slate-700 text-xs text-slate-400 w-72">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Search or Ask AI...</span>
              <span className="ml-auto font-mono text-[10px] px-1 rounded bg-slate-800">⌘K</span>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-6 text-xs" style={{ color: tokens.textSecondary }}>
              <span className="font-bold cursor-pointer transition hover:opacity-80" style={{ color: tokens.textPrimary }}>기능 소개</span>
              <span className="cursor-pointer transition hover:opacity-80">아키텍처</span>
              <span className="cursor-pointer transition hover:opacity-80">요금제</span>
              <span className="cursor-pointer transition hover:opacity-80">도큐먼트</span>
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenReferenceStudio?.('nav_footer')}
              className="px-2.5 py-1 text-[11px] font-bold rounded-lg border border-slate-700 hover:border-emerald-500/50 bg-slate-900/60 text-slate-300 transition flex items-center gap-1"
            >
              <Compass className="w-3 h-3 text-emerald-400" />
              <span className="hidden sm:inline">GNB 변경 (60종)</span>
            </button>
            <button className="px-3 py-1.5 text-xs font-bold shadow" style={getButtonStyle('primary')}>
              무료 시작하기
            </button>
          </div>
        </header>

        {/* -----------------------------------------------------------------
            섹션 02: 메인 히어로 쇼케이스 (선택된 레퍼런스에 따라 완전히 다른 DOM 구조)
            ----------------------------------------------------------------- */}
        <section className="relative z-10 p-6 md:p-8 space-y-4">
          {/* 섹션 레퍼런스 전환 뱃지 바 */}
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-mono font-bold text-slate-400 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>HERO ARCHITECTURE: {activeHero?.koreanName || '자연어 프롬프트 히어로'}</span>
            </span>
            <button
              onClick={() => onOpenReferenceStudio?.('hero')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 text-[11px] font-bold border border-slate-700 transition flex items-center gap-1.5 shadow"
            >
              <Sparkles className="w-3 h-3 text-emerald-400" />
              <span>히어로 레이아웃 변경 (72종 보유)</span>
            </button>
          </div>

          {/* [레이아웃 0-A] 🎥 영상 중심: 16:9 시네마틱 앰비언트 비디오 루프 & 쇼릴 플레이어 */}
          {isVideoHero ? (
            <div className="space-y-6">
              <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 shadow-2xl group min-h-[360px] md:min-h-[460px] flex flex-col justify-between p-6 md:p-8">
                {/* 비디오 배경 이미지 시뮬레이션 */}
                <img 
                  src={UNSPLASH.cyberNeon} 
                  alt="Cinematic Video Backdrop" 
                  className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700 pointer-events-none" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/70 pointer-events-none" />

                {/* 상단 비디오 HUD 컨트롤 */}
                <div className="relative z-10 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/40 font-bold">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      LIVE 4K 60FPS
                    </span>
                    <span className="hidden sm:inline px-2 py-0.5 rounded bg-slate-900/80 text-slate-300 border border-slate-700">
                      HDR10+ / DOLBY VISION
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-700 transition">
                      <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      <span>SPATIAL AUDIO ON</span>
                    </button>
                    <span className="px-2 py-0.5 rounded bg-slate-900/80 text-slate-400 border border-slate-700">
                      03:45 / 07:20
                    </span>
                  </div>
                </div>

                {/* 중앙 펄스 재생 버튼 & 타이틀 */}
                <div className="relative z-10 text-center my-auto space-y-4 max-w-2xl mx-auto py-8">
                  {/* 중앙 원형 펄스 플레이 버튼 */}
                  <div className="inline-flex items-center justify-center relative cursor-pointer group/play">
                    <div className="absolute -inset-4 rounded-full bg-cyan-500/30 blur-md group-hover/play:scale-125 transition-all duration-300 animate-pulse" />
                    <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-slate-950 flex items-center justify-center shadow-2xl shadow-cyan-500/50 group-hover/play:scale-110 transition-transform">
                      <Play className="w-8 h-8 fill-current ml-1" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <EditableHeadline
                      headline={content.headline}
                      onSave={onUpdateHeadline}
                      className="text-2xl md:text-5xl font-black tracking-tight text-white block drop-shadow-md"
                      style={getHeadlineStyle('hero')}
                    />
                    <p className="text-xs md:text-sm text-slate-300 max-w-lg mx-auto leading-relaxed drop-shadow">
                      정적인 이미지를 넘어선 초동적 스토리텔링. 프레임 단위로 살아 숨 쉬는 모션 비디오 아키텍처.
                    </p>
                  </div>
                </div>

                {/* 하단 인터랙티브 타임라인 스크러버 바 & 3단 챕터 */}
                <div className="relative z-10 space-y-2 pt-4 border-t border-slate-800/80">
                  <div className="w-full h-1.5 rounded-full bg-slate-800 relative cursor-pointer overflow-hidden group/bar">
                    <div className="absolute left-0 top-0 bottom-0 w-[52%] bg-gradient-to-r from-cyan-500 to-emerald-400 rounded-full" />
                    <div className="absolute left-[52%] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-md ring-2 ring-cyan-400 opacity-0 group-hover/bar:opacity-100 transition" />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                    <div className="flex items-center gap-4">
                      <span className="text-cyan-400 font-bold cursor-pointer">● 01 KEYNOTE INTRO</span>
                      <span className="hover:text-white cursor-pointer">○ 02 ARCHITECTURE DEMO</span>
                      <span className="hover:text-white cursor-pointer hidden sm:inline">○ 03 PRODUCTION LAUNCH</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="cursor-pointer hover:text-white">1080p 60fps</span>
                      <Maximize2 className="w-3.5 h-3.5 cursor-pointer hover:text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* 하단 9:16 세로 숏폼/릴스 3단 인터랙티브 그리드 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { tag: '01 MOTION REEL', title: '실시간 AI 인터랙션 렌더링', views: '14.8M', img: UNSPLASH.techDevice },
                  { tag: '02 HARDWARE BTS', title: '티타늄 프레임 가공 공정', views: '8.4M', img: UNSPLASH.explodedTech },
                  { tag: '03 KEYNOTE CUT', title: '원클릭 프롬프트 생성 시연', views: '22.1M', img: UNSPLASH.cyberNeon },
                ].map((reel, idx) => (
                  <div key={idx} className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900 group min-h-[160px] flex flex-col justify-between p-4 cursor-pointer hover:border-cyan-500/50 transition">
                    <img src={reel.img} alt={reel.title} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition duration-500 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent pointer-events-none" />
                    
                    <div className="relative z-10 flex items-center justify-between text-[10px] font-mono">
                      <span className="px-2 py-0.5 rounded bg-slate-950/80 text-cyan-400 border border-cyan-500/30 font-bold">{reel.tag}</span>
                      <span className="flex items-center gap-1 text-slate-300">
                        <Eye className="w-3 h-3 text-cyan-400" />
                        {reel.views}
                      </span>
                    </div>

                    <div className="relative z-10 flex items-end justify-between gap-2">
                      <div>
                        <h4 className="text-xs font-bold text-white group-hover:text-cyan-400 transition">{reel.title}</h4>
                        <span className="text-[10px] text-slate-400 font-mono">00:45 / REEL</span>
                      </div>
                      <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center shrink-0 border border-cyan-500/40">
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : isPhotoLookbookHero ? (
            /* [레이아웃 0-B] 📸 사진 중심: 하이패션 세로 2:3 룩북 필름스트립 & 에디토리얼 */
            <div className="p-6 md:p-10 rounded-2xl border space-y-6" style={getCardStyle('elevated')}>
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-700/60">
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-widest border inline-block" style={getBadgeStyle('accent')}>
                    📸 LUXURY EDITORIAL LOOKBOOK 2026
                  </span>
                  <EditableHeadline
                    headline={content.headline}
                    onSave={onUpdateHeadline}
                    className="text-2xl md:text-5xl font-serif font-black tracking-tight leading-tight block"
                    style={getHeadlineStyle('hero')}
                  />
                </div>
                <div className="text-xs font-mono text-slate-400 shrink-0 text-right">
                  <div>COLLECTION 01/08</div>
                  <div className="text-emerald-400 font-bold">HAUTE COUTURE</div>
                </div>
              </div>

              {/* 가로 룩북 3단 세로 2:3 화보 필름스트립 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { img: UNSPLASH.fashionLookbook1, label: 'SILHOUETTE NO.1', desc: '내추럴 리넨 & 미니멀 드레이프' },
                  { img: UNSPLASH.fashionLookbook2, label: 'SILHOUETTE NO.2', desc: '건축적 볼륨 & 모노크롬 텍스처' },
                  { img: UNSPLASH.fashionLookbook3, label: 'SILHOUETTE NO.3', desc: '자연광 테일러링 & 클래식 핏' },
                ].map((item, idx) => (
                  <div key={idx} className="group relative rounded-xl overflow-hidden border border-slate-800 aspect-[3/4] cursor-pointer">
                    <img src={item.img} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                    <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-slate-900/80 backdrop-blur text-[10px] font-mono text-emerald-300 border border-slate-700">
                      LOOK #{idx + 1}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 space-y-1">
                      <div className="text-xs font-bold text-white font-serif">{item.label}</div>
                      <div className="text-[11px] text-slate-300">{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
                <p className="text-xs text-slate-400 max-w-md leading-relaxed font-serif italic">
                  &ldquo;사진 한 장이 전하는 침묵의 언어. 불필요한 장식을 배제하고 피사체의 본질과 직물 고유의 결을 극대화합니다.&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <button className="px-6 py-2.5 text-xs font-bold shadow" style={getButtonStyle('primary')}>
                    시즌 화보집 다운로드
                  </button>
                  <button className="px-5 py-2.5 text-xs font-bold border" style={getButtonStyle('outline')}>
                    룩북 뷰어 열기
                  </button>
                </div>
              </div>
            </div>
          ) : isAsymPhotoSplit ? (
            /* [레이아웃 0-C] 📸 사진 중심: 60:40 비대칭 건축 화보 & 스토리텔링 스플릿 */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 md:p-8 rounded-2xl border" style={getCardStyle('elevated')}>
              <div className="md:col-span-7 relative rounded-2xl overflow-hidden border border-slate-700 min-h-[340px] shadow-2xl group">
                <img src={UNSPLASH.architecture} alt="Architecture" className="w-full h-full object-cover min-h-[340px] group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-mono text-white">
                  <span className="px-2.5 py-1 rounded bg-slate-900/90 backdrop-blur border border-slate-700">ARCHITECTURAL RESIDENCE 2026</span>
                  <span className="text-emerald-400 font-bold">100% DAYLIGHT</span>
                </div>
              </div>
              <div className="md:col-span-5 space-y-4">
                <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider border inline-block" style={getBadgeStyle('accent')}>
                  ⚖️ 60:40 ASYMMETRIC VISUAL TENSION
                </span>
                <EditableHeadline
                  headline={content.headline}
                  onSave={onUpdateHeadline}
                  className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight block"
                  style={getHeadlineStyle('hero')}
                />
                <p className="text-xs md:text-sm leading-relaxed" style={{ color: tokens.textSecondary }}>
                  공간의 비율과 자연광의 흐름을 설계합니다. 좌측의 웅장한 실사 화보와 우측의 미니멀 텍스트가 빚어내는 궁극의 시각적 긴장감.
                </p>
                <div className="pt-2 flex items-center gap-3">
                  <button className="px-5 py-2.5 text-xs font-bold shadow" style={getButtonStyle('primary')}>
                    프로젝트 문의하기
                  </button>
                  <button className="px-4 py-2.5 text-xs font-bold border" style={getButtonStyle('outline')}>
                    포트폴리오 열람
                  </button>
                </div>
              </div>
            </div>
          ) : isGenUiPrompt ? (
            <div className="p-8 md:p-12 rounded-2xl border text-center space-y-6 relative overflow-hidden" style={getCardStyle('elevated')}>
              {customOptions.showBadge !== false && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider border" style={getBadgeStyle('accent')}>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI-NATIVE PROMPT WORKSPACE 2026</span>
                </div>
              )}
              
              <div className="max-w-2xl mx-auto space-y-3">
                <EditableHeadline
                  headline={content.headline}
                  onSave={onUpdateHeadline}
                  className="text-2xl md:text-5xl font-black leading-tight tracking-tight block"
                  style={getHeadlineStyle('hero')}
                />
                <p className="text-xs md:text-sm leading-relaxed" style={{ color: tokens.textSecondary }}>
                  자연어로 원하는 비주얼과 데이터 구조를 설명하세요. 실시간 디자인 오케스트레이션 엔진이 즉시 완성합니다.
                </p>
              </div>

              {/* 중앙 생성형 AI 프롬프트 바 인풋 */}
              <div className="max-w-xl mx-auto p-1.5 rounded-2xl bg-slate-950/90 border border-emerald-500/40 shadow-2xl flex items-center gap-2 relative">
                <div className="pl-3 text-emerald-400">
                  <Wand2 className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  readOnly
                  value="16:9 피치덱 스타일, 네온 사이언 액센트, 실시간 ARR 지표가 포함된 SaaS 랜딩페이지"
                  className="w-full bg-transparent text-xs text-slate-200 outline-none select-none font-mono"
                />
                <button className="px-4 py-2 rounded-xl text-xs font-bold text-slate-950 bg-emerald-400 shadow-md shrink-0 flex items-center gap-1">
                  <span>생성하기</span>
                  <span className="text-[10px] opacity-75 font-mono">⌘K</span>
                </button>
              </div>

              {/* 빠른 추천 칩 */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-[11px]">
                {['🎨 3D 피치덱', '⚡ SaaS 대시보드', '🛍️ 와디즈 상세페이지', '📱 인스타 카드뉴스'].map((chip, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700 text-slate-300 cursor-pointer hover:border-emerald-500 transition">
                    {chip}
                  </span>
                ))}
              </div>

              {/* 하단 텔레메트리 틱 */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-center gap-6 text-[11px] font-mono text-slate-400">
                <span>⚡ LATENCY: 12ms</span>
                <span>• THROUGHPUT: 1,480 TPS</span>
                <span>• SLA: 99.999%</span>
              </div>
            </div>
          ) : isBentoHero ? (
            /* [레이아웃 2] 비대칭 12열 벤토 히어로 */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 p-6 md:p-8 rounded-2xl border flex flex-col justify-between space-y-4" style={getCardStyle('elevated')}>
                <div className="space-y-3">
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold" style={getBadgeStyle('accent')}>
                    BENTO GRID 2.0 FLAGSHIP
                  </span>
                  <EditableHeadline
                    headline={content.headline}
                    onSave={onUpdateHeadline}
                    className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight block"
                    style={getHeadlineStyle('hero')}
                  />
                  <p className="text-xs md:text-sm leading-relaxed" style={{ color: tokens.textSecondary }}>
                    모듈러 카드가 유기적으로 맞물려 기능과 데이터를 동시에 증명하는 고성능 벤토 아키텍처.
                  </p>
                </div>

                {/* SVG 라이브 스파크라인 */}
                <div className="pt-4">
                  <div className="flex items-center justify-between text-xs font-mono mb-2" style={{ color: tokens.textSecondary }}>
                    <span>실시간 성장 곡선 (ARR)</span>
                    <span className="font-bold text-emerald-400">+240% 달성</span>
                  </div>
                  <div className="w-full h-16 rounded-xl bg-slate-950/60 border border-slate-800 p-2 flex items-end gap-1">
                    {[30, 45, 38, 55, 62, 58, 75, 82, 90, 85, 98, 110].map((h, i) => (
                      <div
                        key={i}
                        className="flex-1 rounded-sm bg-gradient-to-t from-emerald-500/20 to-emerald-400 transition-all duration-300"
                        style={{ height: `${(h / 110) * 100}%` }}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  <button className="px-5 py-2.5 text-xs font-bold shadow" style={getButtonStyle('primary')}>
                    프로덕트 체험하기
                  </button>
                  <button className="px-4 py-2.5 text-xs font-bold border" style={getButtonStyle('outline')}>
                    가이드 보기
                  </button>
                </div>
              </div>

              {/* 우측 4열 서브 카드들 */}
              <div className="md:col-span-4 flex flex-col gap-4">
                <div className="p-5 rounded-2xl border flex flex-col justify-between flex-1" style={getCardStyle('surface')}>
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-1">
                      <span>CONCURRENT USERS</span>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    </div>
                    <div className="text-2xl font-black font-mono" style={{ color: tokens.textPrimary }}>
                      38,500 <span className="text-xs font-normal text-emerald-400">명</span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">유료 전환율 18.2% 기록</p>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border flex flex-col justify-between flex-1" style={getCardStyle('surface')}>
                  <div>
                    <div className="text-xs font-mono text-slate-400 mb-1">SECURITY SCORE</div>
                    <div className="text-2xl font-black font-mono text-emerald-400">
                      100 / 100
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">SOC2 Type II 완벽 통과</p>
                  </div>
                </div>
              </div>
            </div>
          ) : isPodiumHero ? (
            /* [레이아웃 3] 3D 실물 플로팅 포디움 스테이지 */
            <div className="p-8 md:p-14 rounded-2xl border text-center space-y-6 relative overflow-hidden flex flex-col items-center" style={getCardStyle('elevated')}>
              <div className="max-w-xl space-y-2 relative z-10">
                <span className="px-3 py-1 rounded-full text-xs font-mono font-bold tracking-wider border inline-block" style={getBadgeStyle('accent')}>
                  3D HARDWARE SHOWCASE STAGE
                </span>
                <EditableHeadline
                  headline={content.headline}
                  onSave={onUpdateHeadline}
                  className="text-2xl md:text-4xl font-extrabold tracking-tight block"
                  style={getHeadlineStyle('hero')}
                />
              </div>

              {/* 중앙 원형 포디움 및 3D 기기 렌더링 */}
              <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center my-4 group cursor-pointer">
                {/* 바닥 반사 그림자 원 */}
                <div className="absolute bottom-2 w-48 h-8 rounded-[100%] bg-emerald-500/20 blur-xl group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute bottom-6 w-56 h-12 rounded-[100%] border border-emerald-500/30 bg-slate-950/60" />
                
                {/* 공중에 뜬 3D 디바이스 */}
                <div className="relative z-10 w-44 h-44 rounded-2xl bg-gradient-to-tr from-slate-800 via-slate-700 to-slate-900 border-2 border-emerald-400/60 shadow-2xl p-4 flex flex-col justify-between transform -rotate-6 group-hover:rotate-0 group-hover:-translate-y-2 transition-all duration-500">
                  <div className="flex items-center justify-between text-[10px] font-mono text-emerald-400">
                    <span>PRO-CHIP X1</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  </div>
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-400/20 flex items-center justify-center text-emerald-300">
                    <Sparkles className="w-6 h-6 animate-spin" />
                  </div>
                  <div className="text-[10px] font-mono text-center text-slate-300">
                    RAY-TRACED CORE
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex items-center gap-3">
                <button className="px-6 py-3 text-xs font-bold shadow-lg" style={getButtonStyle('primary')}>
                  360도 인터랙티브 회전
                </button>
                <button className="px-5 py-3 text-xs font-bold border" style={getButtonStyle('outline')}>
                  기술 사양서 다운로드
                </button>
              </div>
            </div>
          ) : isHotspotHero ? (
            /* [레이아웃 4] 인터랙티브 핫스팟 핀 뷰어 */
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center p-6 md:p-8 rounded-2xl border" style={getCardStyle('elevated')}>
              <div className="md:col-span-7 relative rounded-xl overflow-hidden min-h-[300px] border border-slate-700">
                <img src={UNSPLASH.techDevice} alt="Product Macro" className="w-full h-full object-cover min-h-[300px]" />
                <div className="absolute inset-0 bg-slate-950/40" />

                {/* 4개 펄스 핫스팟 핀 */}
                {[
                  { top: '30%', left: '35%', label: '0.1mm 레이저 커팅 바디' },
                  { top: '65%', left: '45%', label: '초정밀 햅틱 센서' },
                  { top: '40%', left: '70%', label: '항공 티타늄 합금' },
                ].map((pin, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveHotspot(i)}
                    className="absolute w-7 h-7 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center cursor-pointer group"
                    style={{ top: pin.top, left: pin.left }}
                  >
                    <span className={`absolute w-full h-full rounded-full animate-ping opacity-75 ${activeHotspot === i ? 'bg-emerald-400' : 'bg-cyan-400'}`} />
                    <span className={`relative w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-slate-950 ${activeHotspot === i ? 'bg-emerald-300 scale-125' : 'bg-white'}`}>
                      {i + 1}
                    </span>
                  </button>
                ))}
              </div>

              {/* 우측 핫스팟 상세 정보 */}
              <div className="md:col-span-5 space-y-4">
                <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                  📍 INTERACTIVE PIN VIEWER
                </span>
                <EditableHeadline
                  headline={content.headline}
                  onSave={onUpdateHeadline}
                  className="text-xl md:text-3xl font-extrabold tracking-tight block"
                  style={getHeadlineStyle('hero')}
                />
                
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-2">
                  <div className="text-xs font-mono font-bold text-emerald-400">
                    PIN #{activeHotspot !== null ? activeHotspot + 1 : 1} 사양 분석
                  </div>
                  <p className="text-xs text-slate-300">
                    {activeHotspot === 0 && '독자 특허 소재의 0.1mm 초정밀 레이저 가공으로 긁힘 없는 내구성을 보장합니다.'}
                    {activeHotspot === 1 && '1초에 1,000회 진동하는 마이크로 햅틱 모터가 실물 버튼의 촉각을 재현합니다.'}
                    {activeHotspot === 2 && '항공 우주 등급 티타늄 프레임으로 무게는 40% 줄이고 강도는 2배 높였습니다.'}
                  </p>
                </div>

                <button className="w-full py-2.5 text-xs font-bold" style={getButtonStyle('primary')}>
                  자세한 스펙 검증서 열람
                </button>
              </div>
            </div>
          ) : isSwissHero ? (
            /* [레이아웃 5] 96pt 모뉴멘탈 스위스 에디토리얼 + 듀얼 마퀴 */
            <div className="p-6 md:p-12 rounded-2xl border space-y-8" style={getCardStyle('surface')}>
              <div className="flex items-center justify-between border-b pb-3 border-slate-700/60 text-xs font-mono">
                <span>SWISS INTERNATIONAL POSTER</span>
                <span>VOL. 26 // AUTUMN</span>
                <span>EDITION 01/80</span>
              </div>

              <div className="space-y-4 text-center">
                <EditableHeadline
                  headline={content.headline}
                  onSave={onUpdateHeadline}
                  className="text-3xl md:text-6xl font-black tracking-tighter leading-none block uppercase"
                  style={getHeadlineStyle('hero')}
                />
                <p className="text-sm max-w-lg mx-auto leading-relaxed" style={{ color: tokens.textSecondary }}>
                  장식을 걷어내고 본질에 집중합니다. 12열 엄격한 그리드와 흑백 명암비가 창조하는 순수한 시각 질서.
                </p>
              </div>

              {/* 듀얼 역방향 마퀴 티커 */}
              <div className="w-full overflow-hidden space-y-1.5 py-2 border-y border-slate-700/60 font-mono text-xs">
                <div className="whitespace-nowrap flex gap-6 text-emerald-400 font-bold animate-pulse">
                  <span>✦ REVOLUTIONARY DESIGN SYSTEMS</span>
                  <span>✦ ARCHITECTURAL PRECISION</span>
                  <span>✦ MONUMENTAL TYPOGRAPHY</span>
                  <span>✦ WCAG 7:1 ACCESSIBILITY</span>
                </div>
                <div className="whitespace-nowrap flex gap-6 text-slate-400 text-[11px]">
                  <span>GENUI NATIVE • BENTO GRID 2.0 • LIQUID GLASS • SPATIAL 3D • LINEAR HUD • SWISS MINIMAL</span>
                </div>
              </div>

              <div className="flex justify-center gap-4 pt-2">
                <button className="px-6 py-3 text-xs font-bold" style={getButtonStyle('primary')}>
                  도록 신청하기
                </button>
                <button className="px-6 py-3 text-xs font-bold border" style={getButtonStyle('outline')}>
                  가이드라인
                </button>
              </div>
            </div>
          ) : (
            /* [기본 레이아웃] 50:50 클래식 대칭 스플릿 */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-6 md:p-8 rounded-2xl border" style={getCardStyle('elevated')}>
              <div className="space-y-4">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border inline-block" style={getBadgeStyle('accent')}>
                  ✦ NEXT-GEN DESIGN STUDIO
                </span>
                <EditableHeadline
                  headline={content.headline}
                  onSave={onUpdateHeadline}
                  className="text-2xl md:text-4xl font-extrabold tracking-tight leading-tight block"
                  style={getHeadlineStyle('hero')}
                />
                <p className="text-xs md:text-sm leading-relaxed" style={{ color: tokens.textSecondary }}>
                  빛과 공간이 빚어내는 궁극의 조화. 시선을 압도하는 비주얼 아키텍처로 브랜드 가치를 재정의합니다.
                </p>
                <div className="flex items-center gap-3 pt-2">
                  <button className="px-5 py-2.5 text-xs font-bold shadow" style={getButtonStyle('primary')}>
                    무료 시작하기
                  </button>
                  <button className="px-4 py-2.5 text-xs font-bold border" style={getButtonStyle('outline')}>
                    라이브 데모 ▶
                  </button>
                </div>
              </div>

              <div className="relative rounded-xl overflow-hidden border border-slate-700 min-h-[260px] shadow-2xl group">
                <img src={UNSPLASH.techDevice} alt="Product Demo" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 p-3 rounded-lg bg-slate-900/90 backdrop-blur border border-slate-700 flex items-center justify-between text-xs">
                  <span className="font-mono text-emerald-400 font-bold">● ACTIVE ENGINE V2.6</span>
                  <span className="text-[11px] text-slate-400">1,480 TPS</span>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* -----------------------------------------------------------------
            섹션 03: 소셜 프루프 & 지표 / 로고 마퀴
            ----------------------------------------------------------------- */}
        <section 
          className="border-y px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs select-none relative"
          style={{ borderColor: tokens.cardBorder, backgroundColor: `${tokens.cardBg}40` }}
        >
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] font-bold" style={{ color: tokens.textSecondary }}>
              TRUSTED BY 2,400+ TECH LEADERS
            </span>
          </div>

          <div className="flex items-center gap-6 font-mono text-xs font-semibold overflow-x-auto scrollbar-none" style={{ color: tokens.textSecondary }}>
            <span>◆ ACME CORP</span>
            <span>◆ HYPERION</span>
            <span>◆ STARLIGHT AI</span>
            <span>◆ NEXTSCALE</span>
            <span>◆ NOVAPRO</span>
          </div>

          <button
            onClick={() => onOpenReferenceStudio?.('proof')}
            className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-700 transition"
          >
            소셜 프루프 변경 (62종)
          </button>
        </section>

        {/* -----------------------------------------------------------------
            섹션 04: 기능 & 벤토 쇼케이스 (비교 슬라이더 / 탭 / 벤토 등)
            ----------------------------------------------------------------- */}
        {(!isHeroFocus || !isMobile) && (
          <section className="p-6 md:p-8 space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold" style={{ color: tokens.accent }}>
                  {activeFeature?.trend || 'MODULAR ARCHITECTURE'}
                </span>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: tokens.textPrimary }}>
                  {activeFeature?.koreanName || '복잡한 디자인 시스템을 원클릭으로 결합'}
                </h2>
              </div>

              <button
                onClick={() => onOpenReferenceStudio?.('feature')}
                className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 text-[11px] font-bold border border-slate-700 transition flex items-center gap-1.5 shadow"
              >
                <LayoutGrid className="w-3 h-3 text-emerald-400" />
                <span>기능/벤토 변경 (62종)</span>
              </button>
            </div>

            {/* 기능 레이아웃 A: Before & After 양방향 드래그 슬라이더 */}
            {activeFeature?.id.includes('compare-split-slider') ? (
              <div className="relative w-full h-80 rounded-2xl overflow-hidden border border-slate-700 select-none">
                {/* Before 패널 (레거시 수작업) */}
                <div 
                  className="absolute inset-y-0 left-0 bg-slate-950 p-6 flex flex-col justify-between"
                  style={{ width: `${compareSliderPos}%` }}
                >
                  <div className="space-y-2">
                    <span className="px-2 py-0.5 rounded bg-red-500/20 text-red-400 text-[10px] font-mono font-bold border border-red-500/30">
                      BEFORE: 수작업 레거시 방식
                    </span>
                    <h3 className="text-lg font-bold text-slate-400 line-through">48시간 걸리던 수동 디자인 조율</h3>
                    <p className="text-xs text-slate-500">
                      디자이너와 개발자 간의 끝없는 피드백 루프, 깨지는 레이아웃, 오프라인 미팅의 연속.
                    </p>
                  </div>
                  <div className="text-xs font-mono text-red-400">⏱️ 평균 48시간 소요</div>
                </div>

                {/* After 패널 (AI 오토메이션) */}
                <div 
                  className="absolute inset-y-0 right-0 bg-slate-900 p-6 flex flex-col justify-between border-l-2 border-emerald-400"
                  style={{ width: `${100 - compareSliderPos}%` }}
                >
                  <div className="space-y-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/30">
                      AFTER: AI 아키텍처 자동 완성
                    </span>
                    <h3 className="text-lg font-bold text-white">단 3초 만에 376개 레이아웃 스왑</h3>
                    <p className="text-xs text-slate-300">
                      Figma Auto-Layout과 Tailwind 코드가 실시간 동기화되어 즉시 프로덕션 배포.
                    </p>
                  </div>
                  <div className="text-xs font-mono text-emerald-400 font-bold">⚡ 단 3초 완성 (+1,600% 가속)</div>
                </div>

                {/* 드래그 슬라이더 핸들 */}
                <div 
                  className="absolute inset-y-0 -translate-x-1/2 flex items-center justify-center cursor-ew-resize z-20 pointer-events-none"
                  style={{ left: `${compareSliderPos}%` }}
                >
                  <div className="w-8 h-8 rounded-full bg-emerald-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-2xl">
                    ↔
                  </div>
                </div>

                {/* 슬라이더 컨트롤러 인풋 바닥 */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 bg-slate-950/80 px-4 py-1.5 rounded-full border border-slate-700 flex items-center gap-3 text-xs">
                  <span className="text-[10px] text-slate-400 font-mono">드래그하여 비교:</span>
                  <input
                    type="range"
                    min="10"
                    max="90"
                    value={compareSliderPos}
                    onChange={(e) => setCompareSliderPos(Number(e.target.value))}
                    className="w-32 accent-emerald-400 cursor-pointer"
                  />
                  <span className="font-mono text-emerald-400 font-bold text-xs">{compareSliderPos}%</span>
                </div>
              </div>
            ) : (
              /* 기본 벤토 기능 그리드 */
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="md:col-span-7 rounded-2xl p-6 border flex flex-col justify-between" style={getCardStyle('surface')}>
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={getBadgeStyle('accent')}>
                      MODULE 01
                    </span>
                    <h3 className="text-lg font-bold" style={{ color: tokens.textPrimary }}>초정밀 AI 시각 컴포넌트 자동 결합</h3>
                    <p className="text-xs leading-relaxed" style={{ color: tokens.textSecondary }}>
                      선택한 블록들을 1초 만에 최적의 시각적 위계와 대비로 자동 오케스트레이션합니다.
                    </p>
                  </div>
                  <div className="pt-4 mt-4 border-t flex items-center justify-between text-xs" style={{ borderColor: tokens.cardBorder }}>
                    <span className="font-mono" style={{ color: tokens.textSecondary }}>가동 안정성</span>
                    <span className="font-bold font-mono" style={{ color: tokens.accent }}>99.99% 무중단 SLA</span>
                  </div>
                </div>

                <div className="md:col-span-5 flex flex-col gap-4">
                  <div className="p-4 rounded-xl border flex items-center justify-between" style={getCardStyle('surface')}>
                    <div>
                      <div className="text-[10px] font-mono" style={{ color: tokens.textSecondary }}>실시간 트랜잭션</div>
                      <div className="text-lg font-black font-mono" style={{ color: tokens.textPrimary }}>1,480 TPS</div>
                    </div>
                    <Activity className="w-5 h-5" style={{ color: tokens.accent }} />
                  </div>
                  <div className="p-4 rounded-xl border flex items-center justify-between" style={getCardStyle('surface')}>
                    <div>
                      <div className="text-[10px] font-mono" style={{ color: tokens.textSecondary }}>신규 가입자 리텐션</div>
                      <div className="text-lg font-black font-mono" style={{ color: tokens.accent }}>+92.4% MoM</div>
                    </div>
                    <ShieldCheck className="w-5 h-5" style={{ color: tokens.accentSecondary }} />
                  </div>
                </div>
              </div>
            )}
          </section>
        )}

        {/* -----------------------------------------------------------------
            섹션 05: 요금제 & 피처 비교 매트릭스
            ----------------------------------------------------------------- */}
        {!isHeroFocus && (
          <section className="p-6 md:p-8 border-t space-y-6" style={{ borderColor: tokens.cardBorder }}>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold" style={{ color: tokens.accent }}>
                  {activePricing?.trend || 'TRANSPARENT PRICING'}
                </span>
                <h2 className="text-xl md:text-2xl font-bold tracking-tight" style={{ color: tokens.textPrimary }}>
                  {activePricing?.koreanName || '팀의 규모에 맞는 최적의 플랜을 선택하세요'}
                </h2>
              </div>

              <button
                onClick={() => onOpenReferenceStudio?.('pricing')}
                className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 text-[11px] font-bold border border-slate-700 transition flex items-center gap-1.5 shadow"
              >
                <CreditCard className="w-3 h-3 text-emerald-400" />
                <span>요금제 변경 (60종)</span>
              </button>
            </div>

            {/* 가격 계산기 모드 */}
            {activePricing?.id.includes('calc') ? (
              <div className="p-6 md:p-8 rounded-2xl border space-y-6 bg-slate-950" style={{ borderColor: tokens.accent }}>
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-xs font-mono text-emerald-400 font-bold">INTERACTIVE MAU CALCULATOR</span>
                    <h3 className="text-lg font-bold text-white">월간 활성 사용자(MAU) 기준 즉시 요금 견적</h3>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-black font-mono text-emerald-400">
                      ₩{(Math.round((calcMau * 1.8) / 1000) * 1000).toLocaleString()} <span className="text-xs text-slate-400">/월</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">기존 외주 대비 연간 1,400만원 절감</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-slate-300">
                    <span>1,000 MAU</span>
                    <span className="font-bold text-emerald-400">{calcMau.toLocaleString()} MAU 선택됨</span>
                    <span>100,000 MAU</span>
                  </div>
                  <input
                    type="range"
                    min="1000"
                    max="100000"
                    step="1000"
                    value={calcMau}
                    onChange={(e) => setCalcMau(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
                  />
                </div>
              </div>
            ) : (
              /* 기본 3단 요금제 카드 */
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { name: 'Starter', price: '₩0', desc: '개인 및 사이드 프로젝트용', badge: '기본' },
                  { name: 'Pro Studio', price: '₩29,000', desc: '스타트업 및 전문 디자이너', badge: '가장 인기', highlight: true },
                  { name: 'Enterprise', price: '문의', desc: '맞춤형 대규모 팀 솔루션', badge: '엔터프라이즈' },
                ].map((tier, idx) => (
                  <div 
                    key={idx} 
                    className={`p-6 rounded-2xl border flex flex-col justify-between space-y-4 relative ${tier.highlight ? 'ring-2' : ''}`}
                    style={{
                      ...getCardStyle(tier.highlight ? 'highlight' : 'surface'),
                      borderColor: tier.highlight ? tokens.accent : tokens.cardBorder,
                    }}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-bold text-base" style={{ color: tokens.textPrimary }}>{tier.name}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={getBadgeStyle(tier.highlight ? 'accent' : 'neutral')}>
                          {tier.badge}
                        </span>
                      </div>
                      <div className="text-2xl md:text-3xl font-black font-mono" style={{ color: tokens.textPrimary }}>
                        {tier.price} <span className="text-xs font-normal" style={{ color: tokens.textSecondary }}>/월</span>
                      </div>
                      <p className="text-xs" style={{ color: tokens.textSecondary }}>{tier.desc}</p>
                    </div>
                    <button 
                      className="w-full py-2.5 rounded-xl text-xs font-bold shadow transition"
                      style={getButtonStyle(tier.highlight ? 'primary' : 'outline')}
                    >
                      플랜 시작하기
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* -----------------------------------------------------------------
            섹션 06: 고객 리뷰 & 소셜 증명
            ----------------------------------------------------------------- */}
        {!isHeroFocus && (
          <section className="p-6 md:p-8 border-t space-y-4" style={{ borderColor: tokens.cardBorder }}>
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold" style={{ color: tokens.accent }}>
                  TESTIMONIALS
                </span>
                <h3 className="text-lg font-bold" style={{ color: tokens.textPrimary }}>실제 현업 리더들의 생생한 후기</h3>
              </div>
              <div className="flex text-yellow-400 text-xs">★★★★★ 4.95 / 5.0</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border space-y-2" style={getCardStyle('surface')}>
                <p className="text-xs italic leading-relaxed" style={{ color: tokens.textSecondary }}>
                  &quot;기획서 대본만 넣었는데 IR 피치덱과 SaaS 랜딩페이지가 3초 만에 완성되었습니다. 디자인 외주 비용 1,200만원을 절감했습니다.&quot;
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-[10px]">K</div>
                  <div>
                    <span className="font-bold block" style={{ color: tokens.textPrimary }}>김서연 대표</span>
                    <span className="text-[10px]" style={{ color: tokens.textSecondary }}>하이퍼스케일 AI 스타트업</span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-xl border space-y-2" style={getCardStyle('surface')}>
                <p className="text-xs italic leading-relaxed" style={{ color: tokens.textSecondary }}>
                  &quot;컬러 테마와 버튼 스타일이 캔버스에 즉각 반영되는 인터랙션이 경이롭습니다. 팀 전체의 디자인 프로토타이핑 표준이 되었습니다.&quot;
                </p>
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center font-bold text-white text-[10px]">P</div>
                  <div>
                    <span className="font-bold block" style={{ color: tokens.textPrimary }}>박준형 디자인 총괄</span>
                    <span className="text-[10px]" style={{ color: tokens.textSecondary }}>핀테크 유니콘 프로덕트팀</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* -----------------------------------------------------------------
            섹션 07: 최종 전환 CTA 배너 & 리드 수집
            ----------------------------------------------------------------- */}
        <section className="p-6 md:p-8 border-t space-y-4" style={{ borderColor: tokens.cardBorder }}>
          <div className="flex items-center justify-between pb-1">
            <span className="text-[10px] font-mono font-bold text-slate-400">
              CONVERSION ARCHITECTURE: {activeCta?.koreanName || '전환 유도 배너'}
            </span>
            <button
              onClick={() => onOpenReferenceStudio?.('cta')}
              className="px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 text-[11px] font-bold border border-slate-700 transition flex items-center gap-1.5 shadow"
            >
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>전환 CTA 변경 (60종)</span>
            </button>
          </div>

          {activeCta?.id.includes('lead-single-email') ? (
            <div className="p-8 rounded-2xl border text-center space-y-4" style={getCardStyle('highlight')}>
              <h3 className="text-xl font-bold text-white">단 한 줄의 이메일로 14일 무료 체험을 시작하세요</h3>
              <p className="text-xs text-slate-300">신용카드 등록 없이 지금 즉시 376개 모든 프로 템플릿이 잠금 해제됩니다.</p>
              
              <div className="max-w-md mx-auto flex items-center gap-2 p-1.5 rounded-xl bg-slate-950 border border-slate-700">
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full bg-transparent text-xs text-white px-3 outline-none font-mono"
                />
                <button className="px-5 py-2 rounded-lg text-xs font-bold text-slate-950 bg-emerald-400 shadow shrink-0">
                  즉시 시작
                </button>
              </div>
            </div>
          ) : (
            <div 
              className="p-6 rounded-2xl border flex flex-col md:flex-row items-center justify-between gap-4"
              style={getCardStyle('highlight')}
            >
              <div className="space-y-1">
                <h3 className="text-lg font-bold" style={{ color: tokens.textPrimary }}>지금 바로 시작하고 디자인 생산성을 300% 높이세요</h3>
                <p className="text-xs" style={{ color: tokens.textSecondary }}>신용카드 등록 없이 14일 동안 모든 엔터프라이즈 기능을 무료로 체험하실 수 있습니다.</p>
              </div>
              <button className="px-6 py-3 rounded-xl text-xs font-bold shadow-xl shrink-0" style={getButtonStyle('primary')}>
                무료 체험 시작하기
              </button>
            </div>
          )}
        </section>

        {/* -----------------------------------------------------------------
            섹션 08: 사이트맵 메가 푸터
            ----------------------------------------------------------------- */}
        <footer 
          className="border-t p-6 md:p-8 space-y-6"
          style={{ borderColor: tokens.cardBorder, backgroundColor: `${tokens.cardBg}88` }}
        >
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <span className="text-[10px] font-mono text-slate-400">
              FOOTER: {activeNavFooter?.koreanName || '4단 클래식 사이트맵'}
            </span>
            <button
              onClick={() => onOpenReferenceStudio?.('nav_footer')}
              className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300 hover:text-emerald-400 border border-slate-700 transition"
            >
              푸터 변경 (60종)
            </button>
          </div>

          {/* 4단 클래식 사이트맵 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
            <div className="space-y-2">
              <span className="font-bold text-slate-300">프로덕트</span>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                <li className="cursor-pointer hover:text-white">AI 프롬프트 스튜디오</li>
                <li className="cursor-pointer hover:text-white">벤토 그리드 메이커</li>
                <li className="cursor-pointer hover:text-white">Figma 플러그인</li>
              </ul>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-slate-300">디자인 리소스</span>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                <li className="cursor-pointer hover:text-white">376대 레퍼런스 카탈로그</li>
                <li className="cursor-pointer hover:text-white">WCAG 색상 조화기</li>
                <li className="cursor-pointer hover:text-white">디자인 토큰 시스템</li>
              </ul>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-slate-300">엔터프라이즈</span>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                <li className="cursor-pointer hover:text-white">SOC2 보안 인증</li>
                <li className="cursor-pointer hover:text-white">전담 SLA 계약</li>
                <li className="cursor-pointer hover:text-white">온프레미스 설치</li>
              </ul>
            </div>
            <div className="space-y-2">
              <span className="font-bold text-slate-300">법적 고지</span>
              <ul className="space-y-1 text-slate-400 text-[11px]">
                <li className="cursor-pointer hover:text-white">개인정보처리방침</li>
                <li className="cursor-pointer hover:text-white">이용약관</li>
                <li className="cursor-pointer hover:text-white">오픈소스 라이선스</li>
              </ul>
            </div>
          </div>

          {/* 메가 푸터 링크 */}
          <div className="pt-4 border-t flex flex-col sm:flex-row items-center justify-between text-xs gap-2 font-mono" style={{ borderColor: tokens.cardBorder, color: tokens.textSecondary }}>
            <span>© 2026 Core Design Studio Inc. All rights reserved.</span>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="cursor-pointer transition hover:opacity-80">개인정보처리방침</span>
              <span className="cursor-pointer transition hover:opacity-80">이용약관</span>
              <span className="cursor-pointer transition hover:opacity-80">보안 인증 (SOC2)</span>
            </div>
          </div>
        </footer>
          </>
        )}
      </div>
    </div>
  );
}

/* =========================================================================
   3. 📱 인스타그램 카드뉴스 캔버스 (4슬라이드 조감도 & 캐러셀 뷰)
   ========================================================================= */
interface InstagramCanvasSectionProps {
  ds: ResolvedDesignSystem;
  content: ReturnType<typeof parseContentForLayout>;
  instaSlide: number;
  setInstaSlide: (slide: number | ((prev: number) => number)) => void;
  instaAspect?: '4:5' | '1:1';
  instaViewMode?: 'carousel' | 'deck_overview';
  setInstaViewMode?: (mode: 'carousel' | 'deck_overview') => void;
  subPurpose?: SubPurposeOption;
  tailoredMood?: TailoredMoodOption;
  onUpdateHeadline?: (headline: string) => void;
}

function InstagramCanvasSection({
  ds,
  content,
  instaSlide,
  setInstaSlide,
  instaAspect = '4:5',
  instaViewMode = 'carousel',
  setInstaViewMode,
  subPurpose,
  tailoredMood,
  onUpdateHeadline,
}: InstagramCanvasSectionProps) {
  const { tokens, getCardStyle, getButtonStyle, getBadgeStyle, getHeadlineStyle } = ds;

  const moodId = tailoredMood?.id || subPurpose?.recommendedMoodId || 'insta-mood-viral-tip';
  const isChat = moodId.includes('chat') || subPurpose?.id === 'insta-story';
  const isVogue = moodId.includes('vogue') || subPurpose?.id === 'insta-fashion';
  const isY2K = moodId.includes('y2k') || subPurpose?.id === 'insta-y2k';

  return (
    <div className="w-full flex flex-col items-center gap-4">
      {/* 인스타 툴바 */}
      <div className="w-full max-w-sm flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <span className="font-bold text-slate-300">📱 {subPurpose?.badge || '인스타그램'}:</span>
        <div className="flex items-center gap-1 font-mono text-[11px]">
          <span className="text-emerald-400 font-bold">Slide {instaSlide + 1} / 4</span>
        </div>
      </div>

      {/* 인스타그램 모바일 프레임 */}
      <div 
        className="w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl border flex flex-col select-none"
        style={ds.canvasRootStyle}
      >
        <StyleAtmosphereBadge ds={ds} />
        {/* 인스타그램 상단 프로필 헤더 */}
        <div className="px-4 py-3 border-b flex items-center justify-between text-xs" style={ds.dividerStyle}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full p-0.5 bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600">
              <img src={UNSPLASH.portraitEmotion} alt="Profile" className="w-full h-full rounded-full object-cover border-2 border-slate-950" />
            </div>
            <div>
              <span className="font-bold block leading-none" style={{ color: tokens.textPrimary }}>
                {isChat ? 'daily_chat_story' : isVogue ? 'vogue_editorial' : 'core.design_studio'}
              </span>
              <span className="text-[10px] text-slate-400">Sponsored</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={getBadgeStyle('accent')}>
              {instaSlide + 1} / 4
            </span>
            <MoreHorizontal className="w-4 h-4 text-slate-400" />
          </div>
        </div>

        {/* 중앙 메인 카드뉴스 영역 */}
        <div className={`relative ${instaAspect === '1:1' ? 'aspect-square' : 'aspect-[4/5]'} overflow-hidden flex flex-col justify-between p-6 transition-all duration-300`}>
          {/* 좌우 넘김 버튼 */}
          <button
            onClick={() => setInstaSlide(prev => (prev > 0 ? prev - 1 : 3))}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-white/20 flex items-center justify-center text-xs text-white shadow-lg transition"
            title="이전 카드뉴스"
          >
            ‹
          </button>
          <button
            onClick={() => setInstaSlide(prev => (prev < 3 ? prev + 1 : 0))}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-7 h-7 rounded-full bg-slate-950/70 hover:bg-slate-900 border border-white/20 flex items-center justify-center text-xs text-white shadow-lg transition"
            title="다음 카드뉴스"
          >
            ›
          </button>

          {/* 카카오톡/iMessage 말풍선 대화형 UI */}
          {isChat ? (
            <div className="h-full flex flex-col justify-between py-2 space-y-3">
              <div className="text-center pb-1 border-b border-slate-800 text-[10px] text-slate-400 font-mono">
                오늘 오후 3:42 • 팀장님과의 대화
              </div>
              
              <div className="space-y-2.5 overflow-y-auto">
                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white">팀장</div>
                  <div className="bg-slate-800 text-slate-100 rounded-2xl rounded-tl-sm px-3 py-2 text-xs max-w-[80%] shadow">
                    &quot;내일 IR 피치덱 발표인데 디자인 다 끝났어? ㅠㅠ&quot;
                  </div>
                </div>

                <div className="flex items-start justify-end gap-2">
                  <div className="rounded-2xl rounded-tr-sm px-3 py-2 text-xs max-w-[80%] shadow font-medium" style={{ backgroundColor: tokens.accent, color: tokens.bg }}>
                    &quot;아직 텍스트만 있는데... 이 프롬프트 쓰면 3분 만에 끝납니다 ㅎㅎ&quot;
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-[10px] text-white">팀장</div>
                  <div className="bg-slate-800 text-slate-100 rounded-2xl rounded-tl-sm px-3 py-2 text-xs max-w-[80%] shadow">
                    &quot;헐 진짜?! 그 프롬프트 좀 공유해줘! 🔥&quot;
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>밀어서 비법 확인 👉</span>
                <span className="font-mono text-emerald-400">SAVE & SHARE</span>
              </div>
            </div>
          ) : isY2K ? (
            /* Y2K 팝 & 스트릿 스티커 모드 */
            <div className="h-full flex flex-col justify-between p-2 relative bg-yellow-400/10 rounded-xl border-2 border-dashed border-yellow-400/50">
              <div className="flex justify-between items-start">
                <span className="px-2.5 py-1 rounded bg-yellow-400 text-black font-black text-xs rotate-[-6deg] shadow-lg">
                  [필독] MZ 필수템 🔥
                </span>
                <span className="px-2 py-0.5 rounded-full bg-pink-500 text-white font-mono text-[10px] font-bold">
                  Y2K POP
                </span>
              </div>
              <div className="space-y-2 text-center my-auto">
                <EditableHeadline
                  headline={content.headline}
                  onSave={onUpdateHeadline}
                  className="text-2xl font-black text-white leading-tight drop-shadow-[0_2px_10px_rgba(234,179,8,0.5)] block"
                />
                <p className="text-xs text-yellow-200 font-bold">
                  이거 모르면 야근 확정! 1초 만에 끝내는 치트키 ✨
                </p>
              </div>
              <div className="text-center text-xs font-black text-yellow-400">
                스와이프해서 저장하기 👉
              </div>
            </div>
          ) : instaSlide === 0 ? (
            <>
              <img src={UNSPLASH.fashionLookbook1} alt="Vogue Cover" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-slate-950/60" />
              <div className="relative z-10 flex justify-between items-start">
                <span className="font-serif text-3xl font-black tracking-widest text-white">VOGUE</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded" style={getBadgeStyle('accent')}>
                  OCT ISSUE
                </span>
              </div>
              <div className="relative z-10 space-y-2">
                <span className="text-[10px] font-mono font-bold" style={{ color: tokens.accent }}>
                  2026 TREND REPORT
                </span>
                <EditableHeadline
                  headline={content.headline}
                  onSave={onUpdateHeadline}
                  className="text-xl font-bold leading-tight drop-shadow-md text-white block"
                />
                <span className="text-[11px] text-slate-300 block font-mono">밀어서 확인하기 👉</span>
              </div>
            </>
          ) : instaSlide === 1 ? (
            <>
              <img src={UNSPLASH.macroTexture} alt="Macro" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-slate-950/40" />
              <div className="relative z-10">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded" style={getBadgeStyle('accent')}>
                  TACTILE TEXTURE
                </span>
              </div>
              <div className="relative z-10 space-y-1">
                <h3 className="text-lg font-black leading-snug text-white">수분 분자가 피부 속 깊이 전달되는 순간</h3>
                <p className="text-xs text-slate-200">초미세 마이크로 텍스처로 완성하는 피부 광채.</p>
              </div>
            </>
          ) : instaSlide === 2 ? (
            <div className="h-full flex flex-col justify-between py-2">
              <div className="space-y-1 text-center">
                <span className="text-[10px] font-bold font-mono" style={{ color: tokens.accent }}>
                  FACT CHECK
                </span>
                <h3 className="text-base font-bold" style={{ color: tokens.textPrimary }}>당신이 몰랐던 팩트</h3>
              </div>
              <div className="p-4 rounded-xl border border-red-500/40 bg-red-950/20 space-y-1">
                <span className="text-xs font-bold text-red-400">❌ 흔한 착각</span>
                <p className="text-xs" style={{ color: tokens.textSecondary }}>비싼 템플릿만 사면 디자인이 저절로 예뻐진다?</p>
              </div>
              <div className="p-4 rounded-xl border space-y-1" style={getCardStyle('highlight')}>
                <span className="text-xs font-bold" style={{ color: tokens.accent }}>⭕️ 과학적 진실</span>
                <p className="text-xs font-semibold" style={{ color: tokens.textPrimary }}>시각적 대비와 앵커 모드가 디자인의 80%를 결정합니다.</p>
              </div>
              <div className="text-center text-[10px] font-mono" style={{ color: tokens.textSecondary }}>3 / 4 슬라이드</div>
            </div>
          ) : (
            <div className="h-full flex flex-col justify-between py-4 text-center">
              <span className="text-[10px] font-mono font-bold" style={{ color: tokens.accent }}>
                SWIPE INSIGHT
              </span>
              <div className="space-y-3">
                <EditableHeadline
                  headline={content.headline}
                  onSave={onUpdateHeadline}
                  className="text-2xl font-black leading-tight block"
                  style={getHeadlineStyle('section')}
                />
                <p className="text-xs leading-relaxed px-2" style={{ color: tokens.textSecondary }}>
                  단 한 번의 스와이프로 확인하는 2026년 하반기 핵심 실행 전략.
                </p>
              </div>
              <div className="text-xs font-bold" style={{ color: tokens.accent }}>밀어서 저장하기 👉</div>
            </div>
          )}
        </div>

        {/* 인스타그램 하단 액션 바 */}
        <div className="px-4 py-3 border-t flex items-center justify-between text-xs" style={ds.dividerStyle}>
          <div className="flex items-center gap-4">
            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
            <MessageSquare className="w-5 h-5" style={{ color: tokens.textSecondary }} />
            <Share2 className="w-5 h-5" style={{ color: tokens.textSecondary }} />
          </div>

          <div className="flex items-center gap-1">
            {[0, 1, 2, 3].map(i => (
              <span
                key={i}
                onClick={() => setInstaSlide(i)}
                className={`cursor-pointer rounded-full transition-all ${
                  instaSlide === i ? 'w-4 h-1.5' : 'w-1.5 h-1.5 bg-slate-700'
                }`}
                style={{ backgroundColor: instaSlide === i ? tokens.accent : undefined }}
              />
            ))}
          </div>

          <Bookmark className="w-5 h-5 text-yellow-400 fill-yellow-400" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   4. 🛍️ 이커머스 상세페이지 캔버스 (디자인 토큰 연동)
   ========================================================================= */
interface CommerceCanvasSectionProps {
  ds: ResolvedDesignSystem;
  content: ReturnType<typeof parseContentForLayout>;
  commerceViewMode: 'mobile' | 'desktop';
  subPurpose?: SubPurposeOption;
  tailoredMood?: TailoredMoodOption;
  onUpdateHeadline?: (headline: string) => void;
}

function CommerceCanvasSection({
  ds,
  content,
  commerceViewMode,
  subPurpose,
  tailoredMood,
  onUpdateHeadline,
}: CommerceCanvasSectionProps) {
  const { tokens, getCardStyle, getButtonStyle, getBadgeStyle, getHeadlineStyle } = ds;

  const moodId = tailoredMood?.id || subPurpose?.recommendedMoodId || 'pdp-mood-funding-tech';
  const isBeauty = moodId.includes('luxury') || moodId.includes('beauty') || subPurpose?.id === 'pdp-beauty';
  const isFlash = moodId.includes('flash') || subPurpose?.id === 'pdp-flashsale';
  const isOrganic = moodId.includes('organic') || subPurpose?.id === 'pdp-organic';

  return (
    <div 
      className="w-full max-w-md rounded-2xl overflow-hidden shadow-2xl border flex flex-col relative select-none"
      style={ds.canvasRootStyle}
    >
      <StyleAtmosphereBadge ds={ds} />
      {/* 1. 상단 히어로 배너 */}
      <div className="relative aspect-square">
        <img 
          src={isOrganic ? UNSPLASH.organicFood : isBeauty ? UNSPLASH.macroTexture : UNSPLASH.lifestyleBedroom} 
          alt="Hero Product" 
          className="w-full h-full object-cover" 
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 space-y-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-black" style={getBadgeStyle('accent')}>
            {isFlash ? '⚡️ 오늘 밤 24시 마감 50% 특가' : isOrganic ? '🌿 제주 100% 유기농 인증' : isBeauty ? '👑 피부과 저자극 임상 완료' : '누적 펀딩 12억 돌파'}
          </span>
          <EditableHeadline
            headline={content.headline}
            onSave={onUpdateHeadline}
            className="text-xl font-extrabold text-white leading-tight block"
            style={getHeadlineStyle('section')}
          />
        </div>
      </div>

      {/* 2. 3D X-Ray 단면 분해도 또는 성분 분석표 */}
      <div className="p-5 border-t space-y-3" style={ds.dividerStyle}>
        <span className="text-[10px] font-mono font-bold" style={{ color: tokens.accent }}>
          {isOrganic ? 'ECO-FRIENDLY BIO SYSTEM' : isBeauty ? 'CELLULAR REGENERATION MATRIX' : '5-LAYER ERGONOMIC TECH'}
        </span>
        <h3 className="text-sm font-bold" style={{ color: tokens.textPrimary }}>
          {isOrganic ? '자연 유래 100% 무농약 안심 공법' : isBeauty ? '초미세 펩타이드 수분 침투 포뮬러' : '5중 레이어 에어메쉬 인체공학 구조'}
        </h3>
        <div className="relative rounded-xl overflow-hidden aspect-video border" style={{ borderColor: tokens.cardBorder }}>
          <img src={isOrganic ? UNSPLASH.organicFood : UNSPLASH.explodedTech} alt="Exploded Tech" className="w-full h-full object-cover" />
          <div className="absolute bottom-2 left-2 px-2 py-1 rounded text-[9px] font-mono" style={getBadgeStyle('secondary')}>
            {isOrganic ? '✓ 0% 잔류 농약 불검출' : '✓ 0.1mm 정밀 체압 분산 설계'}
          </div>
        </div>
      </div>

      {/* 3. 공인 시험성적서 & 인증 엠블럼 바 */}
      <div className="p-4 border-t flex items-center justify-around text-center" style={{ borderColor: tokens.cardBorder, backgroundColor: `${tokens.cardBg}88` }}>
        <div>
          <Award className="w-5 h-5 text-yellow-400 mx-auto" />
          <span className="text-[9px] block mt-1" style={{ color: tokens.textSecondary }}>대학병원 임상완료</span>
        </div>
        <div>
          <ShieldCheck className="w-5 h-5 mx-auto" style={{ color: tokens.accent }} />
          <span className="text-[9px] block mt-1" style={{ color: tokens.textSecondary }}>유해물질 불검출</span>
        </div>
        <div>
          <ThumbsUp className="w-5 h-5 mx-auto" style={{ color: tokens.accentSecondary }} />
          <span className="text-[9px] block mt-1" style={{ color: tokens.textSecondary }}>100% 무료 반품</span>
        </div>
      </div>

      {/* 4. 마감 임박 카운트다운 타이머 */}
      <div className="p-3 flex items-center justify-between text-xs font-bold text-white shadow-inner" style={{ backgroundColor: isFlash ? '#dc2626' : '#059669' }}>
        <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" /> 오늘 23:59 얼리버드 마감!</span>
        <span className="font-mono bg-black/40 px-2 py-0.5 rounded">04:18:22 남음</span>
      </div>

      {/* 5. 모바일 하단 고정 구매 바 */}
      <div className="sticky bottom-0 z-30 p-3 border-t flex items-center gap-2" style={{ backgroundColor: tokens.bg, borderColor: tokens.cardBorder }}>
        <button className="p-2.5 rounded-xl border transition hover:opacity-80" style={{ ...getButtonStyle('outline'), color: tokens.textPrimary }}>
          <Bookmark className="w-4 h-4" />
        </button>
        <button className="flex-1 py-2.5 rounded-xl font-black text-xs shadow-lg flex items-center justify-center gap-1" style={getButtonStyle('primary')}>
          <ShoppingBag className="w-4 h-4" /> {isFlash ? '50% 할인 바로 구매하기' : isOrganic ? '신선 산지직송 주문' : '45% 얼리버드 펀딩하기'}
        </button>
      </div>
    </div>
  );
}

/* =========================================================================
   5. 🎬 유튜브 썸네일 캔버스 (디자인 토큰 연동)
   ========================================================================= */
interface YouTubeCanvasSectionProps {
  ds: ResolvedDesignSystem;
  content: ReturnType<typeof parseContentForLayout>;
  ytViewMode: 'studio' | 'ctr_mobile';
  subPurpose?: SubPurposeOption;
  tailoredMood?: TailoredMoodOption;
  onUpdateHeadline?: (headline: string) => void;
}

function YouTubeCanvasSection({
  ds,
  content,
  ytViewMode,
  subPurpose,
  tailoredMood,
  onUpdateHeadline,
}: YouTubeCanvasSectionProps) {
  const { tokens, getCardStyle, getButtonStyle, getBadgeStyle, getHeadlineStyle } = ds;

  const moodId = tailoredMood?.id || subPurpose?.recommendedMoodId || 'yt-mood-shock-aggro';
  const isVersus = moodId.includes('lightning') || moodId.includes('versus') || subPurpose?.id === 'yt-versus';
  const isDoc = moodId.includes('documentary') || subPurpose?.id === 'yt-knowledge';
  const isVlog = moodId.includes('vlog') || subPurpose?.id === 'yt-vlog';

  return (
    <div 
      className="w-full max-w-4xl aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl border-4 relative flex items-center justify-between select-none p-6 md:p-8"
      style={ds.canvasRootStyle}
    >
      <div className="absolute top-0 left-0 right-0 z-30">
        <StyleAtmosphereBadge ds={ds} />
      </div>
      {/* 대각선 VS 분할 모드 */}
      {isVersus ? (
        <>
          <div className="absolute inset-0 flex">
            <div className="w-1/2 h-full relative overflow-hidden bg-slate-950">
              <img src={UNSPLASH.documentary} alt="Old" className="w-full h-full object-cover grayscale opacity-40" />
              <div className="absolute top-4 left-4 px-3 py-1 rounded bg-red-600 text-white font-black text-xs">
                ❌ 옛날 방식 (3시간)
              </div>
            </div>
            <div className="w-1/2 h-full relative overflow-hidden" style={{ backgroundColor: `${tokens.accent}33` }}>
              <img src={UNSPLASH.cyberNeon} alt="New" className="w-full h-full object-cover opacity-80" />
              <div className="absolute top-4 right-4 px-3 py-1 rounded font-black text-xs text-black" style={{ backgroundColor: tokens.accent }}>
                ✨ AI 신세계 (1초)
              </div>
            </div>
          </div>
          <div className="absolute inset-y-0 left-1/2 w-4 -translate-x-1/2 rotate-12 shadow-[0_0_30px_#fff]" style={{ backgroundColor: tokens.accent }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-slate-950 border-4 border-white flex items-center justify-center font-black text-xl text-yellow-400 shadow-2xl">
            VS
          </div>
        </>
      ) : isDoc ? (
        /* 다큐멘터리 진지 모드 */
        <>
          <img src={UNSPLASH.documentary} alt="Documentary" className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
        </>
      ) : (
        /* 기본 충격 실화 모드 */
        <>
          <div className="absolute inset-0 flex">
            <div className="w-1/2 h-full relative overflow-hidden" style={{ backgroundColor: `${tokens.cardBg}ee` }}>
              <img src={UNSPLASH.documentary} alt="Left" className="w-full h-full object-cover grayscale opacity-50" />
            </div>
            <div className="w-1/2 h-full relative overflow-hidden" style={{ backgroundColor: `${tokens.accent}33` }}>
              <img src={UNSPLASH.streetCollage} alt="Right" className="w-full h-full object-cover opacity-80" />
            </div>
          </div>
          <div className="absolute inset-y-0 left-1/2 w-3 -translate-x-1/2 rotate-12 shadow-[0_0_20px_#fff]" style={{ backgroundColor: tokens.accent }} />
        </>
      )}

      {/* 썸네일 카피 영역 */}
      <div className="relative z-10 max-w-md space-y-3">
        <span className="inline-block font-black text-[9px] md:text-xs px-2.5 py-1 rounded shadow-lg uppercase tracking-wider" style={getBadgeStyle('accent')}>
          {isVersus ? '⚡️ 2026 끝장 비교' : isDoc ? '🎓 지식 다큐 탐사' : '★ 충격 실화 100%'}
        </span>
        <div>
          <EditableHeadline
            headline={content.headline}
            onSave={onUpdateHeadline}
            className="text-2xl md:text-4xl font-black uppercase tracking-tight leading-none block"
            style={getHeadlineStyle('hero')}
          />
        </div>
        <div className="inline-block px-3 py-1 font-mono font-bold text-xs md:text-sm rounded shadow" style={{ ...getCardStyle('highlight'), color: tokens.textPrimary }}>
          {subPurpose?.desc || '실제 피해액 12억 공개'}
        </div>
      </div>

      {/* 우측 인물 누끼 */}
      <div className="relative z-10 flex flex-col items-center">
        <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden border-4 shadow-2xl" style={{ borderColor: tokens.accent }}>
          <img src={UNSPLASH.portraitEmotion} alt="Shock Face" className="w-full h-full object-cover" />
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   6. 🎯 배너 & 디스플레이 광고 캔버스 (신규 추가!)
   ========================================================================= */
interface BannerCanvasSectionProps {
  ds: ResolvedDesignSystem;
  content: ReturnType<typeof parseContentForLayout>;
  subPurpose?: SubPurposeOption;
  tailoredMood?: TailoredMoodOption;
  onUpdateHeadline?: (headline: string) => void;
}

function BannerCanvasSection({
  ds,
  content,
  subPurpose,
  tailoredMood,
  onUpdateHeadline,
}: BannerCanvasSectionProps) {
  const { tokens, getCardStyle, getButtonStyle, getBadgeStyle, getHeadlineStyle } = ds;

  const moodId = tailoredMood?.id || subPurpose?.recommendedMoodId || 'banner-mood-urgency';
  const isLaunch = moodId.includes('neon') || subPurpose?.id === 'banner-launch';
  const isBrand = moodId.includes('luxury') || subPurpose?.id === 'banner-brand';
  const isEvent = moodId.includes('warm') || subPurpose?.id === 'banner-event';

  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-4">
      {/* 배너 정보 바 */}
      <div className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <span className="font-bold text-slate-300">🎯 디스플레이 광고 배너:</span>
        <span className="text-emerald-400 font-mono text-[11px]">{subPurpose?.badge || '타임세일 배너'}</span>
      </div>

      {/* 메인 가로 배너 캔버스 (12:5 비율) */}
      <div 
        className="w-full rounded-2xl overflow-hidden shadow-2xl border-2 flex flex-col justify-between relative select-none"
        style={ds.canvasRootStyle}
      >
        <StyleAtmosphereBadge ds={ds} />
        <div className="p-6 md:p-8 flex items-center justify-between relative">
        {/* 배경 이미지 & 그라디언트 */}
        <div className="absolute inset-0 z-0">
          <img 
            src={isLaunch ? UNSPLASH.cyberNeon : isBrand ? UNSPLASH.architecture : isEvent ? UNSPLASH.organicFood : UNSPLASH.explodedTech} 
            alt="Banner BG" 
            className="w-full h-full object-cover opacity-20" 
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent" />
        </div>

        {/* 좌측 메인 텍스트 */}
        <div className="relative z-10 max-w-lg space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded text-[10px] font-black uppercase tracking-wider" style={getBadgeStyle('accent')}>
              {isLaunch ? 'NEW LAUNCH' : isBrand ? 'PREMIUM BRAND' : isEvent ? 'GIFT EVENT' : 'D-DAY TIMEOUT'}
            </span>
            <span className="text-[11px] font-mono" style={{ color: tokens.textSecondary }}>
              {isLaunch ? '2026 차세대 AI 툴킷' : isBrand ? 'Since 2019 품격' : isEvent ? '선착순 100명 한정' : '오늘 밤 24:00 마감'}
            </span>
          </div>

          <EditableHeadline
            headline={content.headline}
            onSave={onUpdateHeadline}
            className="text-xl md:text-3xl font-extrabold leading-tight block tracking-tight"
            style={getHeadlineStyle('hero')}
          />

          <p className="text-xs line-clamp-1 max-w-md" style={{ color: tokens.textSecondary }}>
            {subPurpose?.desc || '단 3초 만에 프로덕션 수준의 디자인과 코드를 생성하세요.'}
          </p>
        </div>

        {/* 우측 액션 박스 & 혜택 스탬프 */}
        <div className="relative z-10 flex flex-col items-end gap-3 shrink-0">
          <div className="p-3 rounded-xl border text-center shadow-lg" style={getCardStyle('highlight')}>
            <span className="text-[10px] font-mono font-bold block" style={{ color: tokens.accent }}>
              {isBrand ? 'VIP BENEFIT' : 'SPECIAL OFFER'}
            </span>
            <span className="text-2xl md:text-3xl font-black font-mono" style={{ color: tokens.textPrimary }}>
              {isBrand ? '100% 보증' : isEvent ? '무료 증정' : '50% OFF'}
            </span>
          </div>

          <button className="px-5 py-2.5 rounded-xl font-bold text-xs shadow-xl flex items-center gap-1.5" style={getButtonStyle('primary')}>
            <span>{isEvent ? '이벤트 참여하기 🎁' : '지금 신청하기'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
