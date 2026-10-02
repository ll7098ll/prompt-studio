'use client';
import './legacy.css';

import React, { useState, useMemo, useRef, type ChangeEvent } from 'react';
import { toPng } from 'html-to-image';
import { DESIGN_DOMAINS } from '@/data/domains';
import { 
  VISUAL_STYLES, VisualStyleOption, 
  COLOR_THEMES, ColorThemeOption, 
  DESIGN_ELEMENTS,
  TYPOGRAPHY_OPTIONS, TypographyOption,
  getMatchingButtonStyle
} from '@/data/design-options';
import { 
  WEB_COMPONENTS, DomainComponentOption, FocalAnchor,
  LegoBlockItem, createDefaultLegoStack,
  LayoutPreset, LayoutZoneSlot, GridColumnSpan
} from '@/data/component-presets';
import { generateDesignPrompt, TargetAI, PromptResult } from '@/lib/prompt-engine';
import { replaceDocumentBlocks, serializeStudioDocument } from '@/studio/document';
import { useStudioDocument } from '@/studio/use-studio-document';
import { auditStudioDocument } from '@/studio/validation';
import CanvasRenderer from '@/components/CanvasRenderer';
import ColorStudio from '@/components/ColorStudio';
import PromptModal from '@/components/PromptModal';
import LegoBlockStackerModal from '@/components/LegoBlockStackerModal';
import CodeExportModal from '@/components/CodeExportModal';
import ComponentVisualBlueprint from '@/components/ComponentVisualBlueprint';
import { 
  HERO_LAYOUTS, 
  FEATURE_LAYOUTS, 
  PROOF_LAYOUTS, 
  PRICING_LAYOUTS, 
  CTA_LAYOUTS, 
  NAV_FOOTER_LAYOUTS 
} from '@/data/layout-references';
import { 
  Sparkles, Copy, Check, Palette, Layers, 
  LayoutGrid,
  Smartphone, Monitor, Edit3, Download,
  Eye,
  Type, ArrowUp, ArrowDown, Trash2, Plus, Code, Shuffle,
  ExternalLink, Undo2, Redo2, FileJson, Upload,
  EyeOff, LockKeyhole, UnlockKeyhole, GripVertical
} from 'lucide-react';

function createAvailableBlockId(blocks: LegoBlockItem[], componentId: string): string {
  let copyNumber = 1;
  let candidate = `lego-${componentId}-${copyNumber}`;
  while (blocks.some((block) => block.instanceId === candidate)) {
    copyNumber += 1;
    candidate = `lego-${componentId}-${copyNumber}`;
  }
  return candidate;
}

export default function UIUXStudioPage() {
  const canvasExportRef = useRef<HTMLDivElement>(null);
  const projectFileInputRef = useRef<HTMLInputElement>(null);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const {
    document: studioDocument,
    activePage,
    blocks: legoBlocks,
    canUndo,
    canRedo,
    updateDocument,
    setBlocks: setLegoBlocks,
    setLayout,
    setHeadline,
    setTargetAI,
    replaceDocument,
    undo,
    redo,
  } = useStudioDocument();

  // =========================================================================
  // 1. 🎛️ 스튜디오 4대 핵심 축 상태 (Blocks, Styles, Typography, Colors)
  // =========================================================================
  type StudioTab = 'blocks' | 'styles' | 'typography' | 'colors';
  const [activeStudioTab, setActiveStudioTab] = useState<StudioTab>('blocks');

  // [Pillar 1: 🧱 컴포넌트 레고 블록 스택 & 레이아웃 아키텍처]
  const [inspectMode, setInspectMode] = useState<boolean>(false);
  const layoutPreset = activePage.layoutPreset;
  const [componentAnchorFilter, setComponentAnchorFilter] = useState<FocalAnchor>('all');
  const [componentSearchQuery, setComponentSearchQuery] = useState<string>('');
  const [isLegoModalOpen, setIsLegoModalOpen] = useState<boolean>(false);

  // [Pillar 2: ✨ 테마 & 비주얼 스타일 DNA (24대)]
  const selectedStyle = VISUAL_STYLES.find((style) => style.id === studioDocument.theme.styleId) ?? VISUAL_STYLES[0];
  const setSelectedStyle = (style: VisualStyleOption) => updateDocument((document) => ({
    ...document,
    theme: { ...document.theme, styleId: style.id },
  }));
  const [styleCategoryFilter, setStyleCategoryFilter] = useState<string>('All');
  const derivedButtonStyle = useMemo(() => getMatchingButtonStyle(selectedStyle.id), [selectedStyle.id]);

  // [Pillar 3: 🔤 폰트 & 타이포그래피 (16대)]
  const selectedTypography = TYPOGRAPHY_OPTIONS.find((typography) => typography.id === studioDocument.theme.typographyId) ?? TYPOGRAPHY_OPTIONS[0];
  const setSelectedTypography = (typography: TypographyOption) => updateDocument((document) => ({
    ...document,
    theme: { ...document.theme, typographyId: typography.id },
  }));
  const [typoCategoryFilter, setTypoCategoryFilter] = useState<string>('ALL');
  const headline = studioDocument.content.headline;

  // [Pillar 4: 🎨 컬러 팔레트 & 톤]
  const selectedColorTheme = COLOR_THEMES.find((theme) => theme.id === studioDocument.theme.colorThemeId) ?? COLOR_THEMES[0];
  const setSelectedColorTheme = (theme: ColorThemeOption) => updateDocument((document) => ({
    ...document,
    theme: { ...document.theme, colorThemeId: theme.id },
  }));
  const activeElements = DESIGN_ELEMENTS.filter((element) => studioDocument.theme.activeElementIds.includes(element.id));

  // =========================================================================
  // 2. 🖥️ 뷰포트 & 캔버스 화면 제어 상태
  // =========================================================================
  const [viewportMode, setViewportMode] = useState<'desktop' | 'mobile'>('desktop');
  const [canvasScale, setCanvasScale] = useState<'100' | '85' | '75'>('100');

  // 모달 상태 (AI 프롬프트, React/HTML 코드 내보내기)
  const [isPromptModalOpen, setIsPromptModalOpen] = useState<boolean>(false);
  const [isCodeModalOpen, setIsCodeModalOpen] = useState<boolean>(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null);
  const targetAI: TargetAI = studioDocument.generation.targetAI;
  const studioAudit = useMemo(() => auditStudioDocument(studioDocument), [studioDocument]);
  const selectedBlock = useMemo(
    () => legoBlocks.find((block) => block.instanceId === selectedBlockId) ?? null,
    [legoBlocks, selectedBlockId],
  );

  // 기본 도메인 객체 (웹 & 디지털 UI/UX)
  const webDomain = useMemo(() => {
    return DESIGN_DOMAINS.find(d => d.id === 'web') || DESIGN_DOMAINS[0];
  }, []);

  // 기본 슬롯 더미 (하위 호환성 유지)
  const selectedNav: DomainComponentOption = WEB_COMPONENTS[0];
  const selectedMainDeck: DomainComponentOption = WEB_COMPONENTS[1];
  const selectedMetric: DomainComponentOption = WEB_COMPONENTS[8];
  const selectedFooter: DomainComponentOption = WEB_COMPONENTS[15];

  const activeLayouts = useMemo(() => ({
    hero: HERO_LAYOUTS[0],
    feature: FEATURE_LAYOUTS[0],
    proof: PROOF_LAYOUTS[0],
    pricing: PRICING_LAYOUTS[0],
    cta: CTA_LAYOUTS[0],
    nav_footer: NAV_FOOTER_LAYOUTS[0],
  }), []);

  // =========================================================================
  // 3. 🧱 레고 블록 조작 핸들러
  // =========================================================================
  const handleMoveLegoBlock = (instanceId: string, direction: 'up' | 'down') => {
    setLegoBlocks(prev => {
      const index = prev.findIndex(b => b.instanceId === instanceId);
      if (index === -1 || prev[index].locked) return prev;
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.length) return prev;
      const next = [...prev];
      const [moved] = next.splice(index, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
  };

  const handleRemoveLegoBlock = (instanceId: string) => {
    setLegoBlocks(prev => prev.filter(b => b.instanceId !== instanceId || b.locked));
    if (selectedBlockId === instanceId) setSelectedBlockId(null);
  };

  const handleSelectLayoutPreset = (preset: LayoutPreset) => {
    setSelectedBlockId(null);
    setLayout(preset, createDefaultLegoStack('web', 'visual', preset));
  };

  const handleUpdateLegoBlockSlot = (instanceId: string, slot: LayoutZoneSlot) => {
    setLegoBlocks(prev => prev.map(b => b.instanceId === instanceId && !b.locked ? { ...b, targetSlot: slot } : b));
  };

  const handleUpdateLegoBlockColSpan = (instanceId: string, span: GridColumnSpan) => {
    setLegoBlocks(prev => prev.map(b => b.instanceId === instanceId && !b.locked ? {
      ...b,
      colSpan: span,
      responsive: {
        ...b.responsive,
        md: { ...b.responsive?.md, colSpan: span },
      },
    } : b));
  };

  const handleUpdateLegoBlock = (instanceId: string, changes: Partial<LegoBlockItem>) => {
    setLegoBlocks(prev => prev.map(b => b.instanceId === instanceId ? { ...b, ...changes } : b));
  };

  const handleUpdateLegoBlockVisibility = (
    instanceId: string,
    breakpoint: 'base' | 'md',
    hidden: boolean,
  ) => {
    setLegoBlocks(prev => prev.map(b => b.instanceId === instanceId ? {
      ...b,
      responsive: {
        ...b.responsive,
        [breakpoint]: { ...b.responsive?.[breakpoint], hidden },
      },
    } : b));
  };

  const handleDropLegoBlock = (targetInstanceId: string) => {
    if (!draggingBlockId || draggingBlockId === targetInstanceId) {
      setDraggingBlockId(null);
      return;
    }

    setLegoBlocks(prev => {
      const sourceIndex = prev.findIndex((block) => block.instanceId === draggingBlockId);
      const targetIndex = prev.findIndex((block) => block.instanceId === targetInstanceId);
      if (sourceIndex < 0 || targetIndex < 0 || prev[sourceIndex].locked) return prev;
      const next = [...prev];
      const [moved] = next.splice(sourceIndex, 1);
      next.splice(targetIndex, 0, moved);
      return next;
    });
    setDraggingBlockId(null);
  };

  const handleAddLegoBlock = (component: DomainComponentOption) => {
    const defaultSlot = component.defaultSlot || (
      component.category === 'header' ? 'header' :
      component.category === 'footer' ? 'footer' :
      component.category === 'sidebar' ? 'sidebar' :
      component.category === 'aside' ? 'aside' : 'main'
    );
    setLegoBlocks(prev => {
      const newBlock: LegoBlockItem = {
        instanceId: createAvailableBlockId(prev, component.id),
        componentId: component.id,
        name: component.name,
        koreanName: component.koreanName,
        focalAnchor: component.focalAnchor,
        category: component.category,
        type: component.type,
        description: component.description,
        promptDirective: component.promptDirective,
        targetSlot: defaultSlot,
        colSpan: component.defaultColSpan || 'full',
      };
      return [...prev, newBlock];
    });
  };

  const handleDuplicateLegoBlock = (instanceId: string) => {
    setLegoBlocks(prev => {
      const index = prev.findIndex(b => b.instanceId === instanceId);
      if (index === -1) return prev;
      const target = prev[index];
      const cloned: LegoBlockItem = {
        ...target,
        instanceId: createAvailableBlockId(prev, target.componentId),
      };
      const next = [...prev];
      next.splice(index + 1, 0, cloned);
      return next;
    });
  };

  const handleResetLegoBlocks = (anchor: string = 'visual') => {
    setSelectedBlockId(null);
    setLayout('landing', createDefaultLegoStack('web', anchor, 'landing'));
  };

  const handleShuffleLegoBlocks = () => {
    setSelectedBlockId(null);
    const videoComp = WEB_COMPONENTS.filter(c => c.focalAnchor === 'video');
    const photoComp = WEB_COMPONENTS.filter(c => c.focalAnchor === 'visual');
    const typoComp = WEB_COMPONENTS.filter(c => c.focalAnchor === 'typo');
    const dataComp = WEB_COMPONENTS.filter(c => c.focalAnchor === 'data');
    const pickRandom = (arr: DomainComponentOption[]) => arr[Math.floor(Math.random() * arr.length)];

    const selected = [
      WEB_COMPONENTS.find(c => c.id === 'nav-dynamic-island') || WEB_COMPONENTS[0],
      pickRandom(videoComp.length ? videoComp : WEB_COMPONENTS),
      pickRandom(photoComp.length ? photoComp : WEB_COMPONENTS),
      pickRandom(typoComp.length ? typoComp : WEB_COMPONENTS),
      pickRandom(dataComp.length ? dataComp : WEB_COMPONENTS),
      WEB_COMPONENTS.find(c => c.id === 'footer-minimalist-line') || WEB_COMPONENTS[15],
    ];

    setLegoBlocks(selected.map((comp, idx) => ({
      instanceId: `lego-rand-${comp.id}-${idx}`,
      componentId: comp.id,
      name: comp.name,
      koreanName: comp.koreanName,
      focalAnchor: comp.focalAnchor,
      category: comp.category,
      type: comp.type,
      description: comp.description,
      promptDirective: comp.promptDirective,
    })));
  };

  const handleClearLegoBlocks = () => {
    setSelectedBlockId(null);
    setLegoBlocks(prev => prev.filter((block) => block.locked));
  };

  // =========================================================================
  // 4. 🎲 원클릭 전면 영감 셔플 (블록 + 스타일 + 폰트 + 컬러 동시 조화)
  // =========================================================================
  const handleRandomInspiration = () => {
    setSelectedBlockId(null);
    // 1. 랜덤 스타일
    const randomStyle = VISUAL_STYLES[Math.floor(Math.random() * VISUAL_STYLES.length)];
    const randomColor = COLOR_THEMES[Math.floor(Math.random() * COLOR_THEMES.length)];
    const randomTypo = TYPOGRAPHY_OPTIONS[Math.floor(Math.random() * TYPOGRAPHY_OPTIONS.length)];
    const anchorByStyleCategory: Record<VisualStyleOption['category'], FocalAnchor> = {
      'High-Tech': 'interactive',
      Clean: 'data',
      Tactile: 'visual',
      Pop: 'typo',
      Editorial: 'visual',
    };
    const candidates = WEB_COMPONENTS.filter((component) => component.focalAnchor === anchorByStyleCategory[randomStyle.category]);
    const pool = candidates.length > 0 ? candidates : WEB_COMPONENTS;
    const pickRandom = () => pool[Math.floor(Math.random() * pool.length)];
    const header = WEB_COMPONENTS.find((component) => component.category === 'header') ?? WEB_COMPONENTS[0];
    const footer = WEB_COMPONENTS.find((component) => component.category === 'footer') ?? WEB_COMPONENTS.at(-1) ?? WEB_COMPONENTS[0];
    const selected = [header, pickRandom(), pickRandom(), pickRandom(), footer];
    const blocks = selected.map((component, index): LegoBlockItem => ({
      instanceId: `lego-inspiration-${component.id}-${index}`,
      componentId: component.id,
      name: component.name,
      koreanName: component.koreanName,
      focalAnchor: component.focalAnchor,
      category: component.category,
      type: component.type,
      description: component.description,
      promptDirective: component.promptDirective,
      targetSlot: component.defaultSlot ?? (component.category === 'header' ? 'header' : component.category === 'footer' ? 'footer' : 'main'),
      colSpan: component.defaultColSpan ?? 'full',
    }));

    updateDocument((document) => replaceDocumentBlocks({
      ...document,
      theme: {
        ...document.theme,
        styleId: randomStyle.id,
        colorThemeId: randomColor.id,
        typographyId: randomTypo.id,
      },
    }, blocks, 'landing'));
  };

  // =========================================================================
  // 5. 🖼️ PNG 내보내기 핸들러
  // =========================================================================
  const handleExportPng = async () => {
    if (!canvasExportRef.current) return;
    try {
      setIsExporting(true);
      const dataUrl = await toPng(canvasExportRef.current, {
        cacheBust: true,
        pixelRatio: 2,
        backgroundColor: selectedColorTheme.tokens.bg || '#020617',
      });
      const link = document.createElement('a');
      link.download = `ui-ux-${selectedStyle.id}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('PNG Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportProject = () => {
    const blob = new Blob([serializeStudioDocument(studioDocument)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `prompt-studio-${studioDocument.project.id}.json`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImportProject = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const value = JSON.parse(await file.text()) as unknown;
      replaceDocument(value);
    } catch (error) {
      const message = error instanceof Error ? error.message : '알 수 없는 오류';
      window.alert(`프로젝트를 불러오지 못했습니다.\n${message}`);
    } finally {
      event.target.value = '';
    }
  };

  // 실시간 AI 디자인 프롬프트 생성
  const promptResult: PromptResult = useMemo(() => {
    return generateDesignPrompt(
      webDomain,
      selectedStyle,
      selectedColorTheme,
      activeElements,
      targetAI,
      {
        nav: selectedNav,
        mainDeck: selectedMainDeck,
        metric: selectedMetric,
        footer: selectedFooter,
      },
      undefined,
      undefined,
      derivedButtonStyle,
      selectedTypography,
      layoutPreset
      ,studioDocument
    );
  }, [webDomain, selectedStyle, selectedColorTheme, activeElements, targetAI, selectedNav, selectedMainDeck, selectedMetric, selectedFooter, derivedButtonStyle, selectedTypography, layoutPreset, studioDocument]);

  // 필터링된 컴포넌트 라이브러리 목록
  const filteredComponents = useMemo(() => {
    return WEB_COMPONENTS.filter(c => {
      const matchAnchor = componentAnchorFilter === 'all' || c.focalAnchor === componentAnchorFilter;
      const matchQuery = !componentSearchQuery || 
        c.koreanName.toLowerCase().includes(componentSearchQuery.toLowerCase()) || 
        c.name.toLowerCase().includes(componentSearchQuery.toLowerCase()) || 
        c.description.toLowerCase().includes(componentSearchQuery.toLowerCase());
      return matchAnchor && matchQuery;
    });
  }, [componentAnchorFilter, componentSearchQuery]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-400 selection:text-slate-950">
      
      {/* =====================================================================
          1. 🌐 상단 글로벌 앱 헤더: 로고 + 뷰포트 토글 + 퀵 액션 버튼들
          ===================================================================== */}
      <header className="h-16 px-4 md:px-6 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between z-30 sticky top-0">
        
        {/* 좌측: 로고 & 플랫폼 명칭 */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/25">
            <Layers className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-black text-sm md:text-base tracking-tight text-white flex items-center gap-1.5">
                <span>CORE // UI·UX STUDIO</span>
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                MODULAR BUILDER
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              컴포넌트 스택 • 테마 • 폰트 • 컬러 실시간 UI/UX 아키텍처
            </p>
          </div>
        </div>

        {/* 중앙: 뷰 모드 & 디바이스 뷰포트 컨트롤러 */}
        <div className="flex items-center gap-2">
          {/* 순수 미리보기 vs 블록 인스펙트 토글 */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setInspectMode(false)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition ${
                !inspectMode
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="에디터 UI 없는 100% 무결점 실서비스 뷰"
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">순수 미리보기</span>
            </button>
            <button
              onClick={() => setInspectMode(true)}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition ${
                inspectMode
                  ? 'bg-emerald-500 text-slate-950 shadow font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="블록별 슬롯 및 경계선을 확인할 수 있는 검사 모드"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">인스펙트</span>
            </button>
          </div>

          {/* 디바이스 뷰포트 토글 (데스크톱 vs 모바일) */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setViewportMode('desktop')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition ${
                viewportMode === 'desktop'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">데스크톱 (100%)</span>
            </button>
            <button
              onClick={() => setViewportMode('mobile')}
              className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold transition ${
                viewportMode === 'mobile'
                  ? 'bg-emerald-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">모바일 (390px)</span>
            </button>
          </div>

          {/* 캔버스 축소/확대 줌 */}
          <div className="hidden xl:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
            {(['100', '85', '75'] as const).map(scale => (
              <button
                key={scale}
                onClick={() => setCanvasScale(scale)}
                className={`px-2 py-1 rounded-md transition ${
                  canvasScale === scale
                    ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {scale}%
              </button>
            ))}
          </div>
        </div>

        {/* 우측: 퀵 액션 (영감 셔플, AI 프롬프트, 코드 복사, PNG 다운로드) */}
        <div className="flex items-center gap-2">
          <input
            ref={projectFileInputRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={handleImportProject}
          />

          <div className="hidden 2xl:flex items-center rounded-xl border border-slate-800 bg-slate-950 p-1">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="실행 취소"
              title="실행 취소"
            >
              <Undo2 className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              aria-label="다시 실행"
              title="다시 실행"
            >
              <Redo2 className="h-3.5 w-3.5" />
            </button>
            <span className="mx-1 h-4 w-px bg-slate-800" />
            <button
              type="button"
              onClick={handleExportProject}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-emerald-300"
              aria-label="프로젝트 JSON 내보내기"
              title="프로젝트 JSON 내보내기"
            >
              <FileJson className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => projectFileInputRef.current?.click()}
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-emerald-300"
              aria-label="프로젝트 JSON 불러오기"
              title="프로젝트 JSON 불러오기"
            >
              <Upload className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* 원클릭 영감 셔플 버튼 */}
          <button
            onClick={handleRandomInspiration}
            className="px-3 py-1.5 rounded-xl bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-300 text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
            title="테마, 폰트, 컬러, 컴포넌트 스택을 무작위 꿀조합으로 일괄 변경합니다"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden md:inline">영감 셔플</span>
          </button>

          {/* AI 프롬프트 모달 열기 */}
          <button
            onClick={() => setIsPromptModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden md:inline">AI 프롬프트</span>
          </button>

          {/* React/HTML 코드 복사 모달 열기 */}
          <button
            onClick={() => setIsCodeModalOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Code className="w-3.5 h-3.5" />
            <span>코드 복사</span>
          </button>

          {/* PNG 다운로드 버튼 */}
          <button
            onClick={handleExportPng}
            disabled={isExporting}
            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span className="hidden sm:inline">{isExporting ? '저장 중...' : 'PNG 다운로드'}</span>
          </button>
        </div>

      </header>

      {/* =====================================================================
          2. 메인 스튜디오 레이아웃: 좌측 컨트롤러 (4개 탭) + 우측 실시간 캔버스
          ===================================================================== */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        
        {/* -------------------------------------------------------------------
            2-A. 좌측 통합 스튜디오 컨트롤러 (420px ~ 460px)
            ------------------------------------------------------------------- */}
        <aside className="w-full lg:w-[420px] xl:w-[460px] flex flex-col shrink-0 bg-slate-900 border-r border-slate-800 h-auto lg:h-[calc(100vh-64px)] overflow-hidden">
          
          {/* 스튜디오 4대 핵심 축 탭 전환 바 */}
          <div className="grid grid-cols-4 p-1.5 bg-slate-950 border-b border-slate-800 text-xs font-bold">
            {[
              { id: 'blocks' as StudioTab, label: '컴포넌트', icon: Layers, badge: legoBlocks.length },
              { id: 'styles' as StudioTab, label: '테마·스타일', icon: Sparkles },
              { id: 'typography' as StudioTab, label: '폰트', icon: Type },
              { id: 'colors' as StudioTab, label: '컬러', icon: Palette },
            ].map(tab => {
              const Icon = tab.icon;
              const isSelected = activeStudioTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveStudioTab(tab.id)}
                  className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition ${
                    isSelected
                      ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center gap-1">
                    <Icon className="w-3.5 h-3.5" />
                    {tab.badge !== undefined && (
                      <span className={`text-[10px] px-1 py-0.2 rounded-full font-mono ${isSelected ? 'bg-slate-950 text-emerald-300' : 'bg-slate-800 text-slate-400'}`}>
                        {tab.badge}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] truncate">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 탭 내용 영역 (스크롤 지원) */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">

            {/* ===============================================================
                [TAB 1] 🧱 컴포넌트 레고 블록 스태커 & 라이브러리
                =============================================================== */}
            {activeStudioTab === 'blocks' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                {/* 상단 스택 안내 & 대형 스튜디오 열기 */}
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                      <span>🧱 조립된 컴포넌트 스택</span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                        {legoBlocks.length}개
                      </span>
                    </h2>
                    <p className="text-[11px] text-slate-400">위에서 아래 순서대로 캔버스에 즉각 렌더링됩니다</p>
                  </div>
                  <button
                    onClick={() => setIsLegoModalOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 text-xs font-bold border border-emerald-500/40 transition flex items-center gap-1"
                  >
                    <span>대형 스튜디오</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>

                {/* 🏛️ 4대 레이아웃 아키텍처 선택기 */}
                <div className="space-y-2 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-emerald-400 font-bold flex items-center gap-1.5">
                      <LayoutGrid className="w-3.5 h-3.5" /> 레이아웃 아키텍처 프리셋
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      {layoutPreset === 'sidebar_main' ? '사이드바 + 메인' : layoutPreset === 'holy_grail' ? '3단 홀리그레일' : layoutPreset === 'bento_grid' ? '벤토 그리드' : '단일 랜딩 세로형'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'landing' as LayoutPreset, label: '단일 랜딩', desc: '세로 롱스크롤' },
                      { id: 'sidebar_main' as LayoutPreset, label: '사이드바 + 메인', desc: 'SaaS 대시보드' },
                      { id: 'holy_grail' as LayoutPreset, label: '3단 홀리그레일', desc: '사이드+피드+패널' },
                      { id: 'bento_grid' as LayoutPreset, label: '벤토 그리드', desc: '모듈러 위젯 격자' },
                    ].map(preset => {
                      const isSelected = layoutPreset === preset.id;
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleSelectLayoutPreset(preset.id)}
                          className={`p-2 rounded-xl text-left border transition ${
                            isSelected
                              ? 'bg-emerald-950/50 border-emerald-500 ring-1 ring-emerald-500/50 shadow-sm'
                              : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                          }`}
                        >
                          <div className="text-xs font-bold text-white flex items-center justify-between">
                            <span>{preset.label}</span>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
                          </div>
                          <div className="text-[10px] text-slate-400">{preset.desc}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 원클릭 추천 스택 프리셋 */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 font-bold block">앵커별 퀵 스택:</span>
                  <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-bold">
                    <button
                      onClick={() => handleResetLegoBlocks('video')}
                      className="px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 transition"
                    >
                      🎥 비디오 런칭
                    </button>
                    <button
                      onClick={() => handleResetLegoBlocks('visual')}
                      className="px-2.5 py-1 rounded-lg bg-pink-950/60 hover:bg-pink-900 border border-pink-500/40 text-pink-300 transition"
                    >
                      📸 패션 룩북
                    </button>
                    <button
                      onClick={() => handleResetLegoBlocks('typo')}
                      className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-amber-300 transition"
                    >
                      🔤 스위스 타이포
                    </button>
                    <button
                      onClick={() => handleResetLegoBlocks('data')}
                      className="px-2.5 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900 border border-blue-500/40 text-blue-300 transition"
                    >
                      📊 SaaS 벤토 데이터
                    </button>
                    <button
                      onClick={handleShuffleLegoBlocks}
                      className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-300 transition flex items-center gap-1"
                    >
                      <Shuffle className="w-2.5 h-2.5" />
                      <span>랜덤 셔플</span>
                    </button>
                  </div>
                </div>

                {/* 현재 스택 리스트 */}
                <div className="space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 font-bold block">
                    {selectedBlock ? `선택된 레이어: ${selectedBlock.koreanName}` : '현재 레이어 순서:'}
                  </span>
                  {legoBlocks.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/60 rounded-xl border border-slate-800">
                      스택된 블록이 없습니다. 아래 라이브러리에서 블록을 추가하세요.
                    </div>
                  ) : (
                    legoBlocks.map((block, idx) => {
                      const isSelected = selectedBlockId === block.instanceId;
                      return (
                      <div 
                        key={block.instanceId}
                        role="button"
                        tabIndex={0}
                        onClick={() => setSelectedBlockId(block.instanceId)}
                        onDragOver={(event) => {
                          if (!draggingBlockId) return;
                          event.preventDefault();
                          event.dataTransfer.dropEffect = 'move';
                        }}
                        onDrop={(event) => {
                          event.preventDefault();
                          handleDropLegoBlock(block.instanceId);
                        }}
                        onKeyDown={(event) => {
                          if (event.key === 'Enter' || event.key === ' ') {
                            event.preventDefault();
                            setSelectedBlockId(block.instanceId);
                          }
                        }}
                        className={`p-2.5 rounded-xl border flex flex-col gap-2 shadow-sm transition outline-none ${
                          isSelected
                            ? 'bg-emerald-950/25 border-emerald-500/70 ring-1 ring-emerald-500/30'
                            : 'bg-slate-950/80 border-slate-800 hover:border-slate-700'
                        } ${block.hidden ? 'opacity-60' : ''} ${
                          draggingBlockId === block.instanceId ? 'scale-[0.99] opacity-50' : ''
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <span
                              draggable={!block.locked}
                              onDragStart={(event) => {
                                if (block.locked) {
                                  event.preventDefault();
                                  return;
                                }
                                event.dataTransfer.effectAllowed = 'move';
                                event.dataTransfer.setData('text/plain', block.instanceId);
                                setDraggingBlockId(block.instanceId);
                              }}
                              onDragEnd={() => setDraggingBlockId(null)}
                              className={`rounded-md p-0.5 ${
                                block.locked
                                  ? 'cursor-not-allowed text-slate-700'
                                  : 'cursor-grab text-slate-500 hover:bg-slate-800 hover:text-slate-200 active:cursor-grabbing'
                              }`}
                              title={block.locked ? '잠긴 레이어는 이동할 수 없습니다' : '드래그하여 레이어 순서 변경'}
                            >
                              <GripVertical className="h-3.5 w-3.5" />
                            </span>
                            <span className="w-5 h-5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-black flex items-center justify-center shrink-0 border border-emerald-500/30">
                              {idx + 1}
                            </span>
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-200 block truncate max-w-[170px]" title={block.koreanName}>
                                {block.koreanName}
                              </span>
                              <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                                {block.focalAnchor === 'video' ? '🎥 영상' : block.focalAnchor === 'visual' ? '📸 사진' : block.focalAnchor === 'typo' ? '🔤 타이포' : block.focalAnchor === 'data' ? '📊 데이터' : '⚡ 모듈'}
                                {block.hidden && <EyeOff className="w-3 h-3 text-amber-400" />}
                                {block.locked && <LockKeyhole className="w-3 h-3 text-cyan-400" />}
                              </span>
                            </div>
                          </div>

                          {/* 조작 버튼 */}
                          <div className="flex items-center gap-0.5 shrink-0">
                            <button
                              onClick={() => handleMoveLegoBlock(block.instanceId, 'up')}
                              disabled={idx === 0 || block.locked}
                              className={`p-1 rounded ${idx === 0 || block.locked ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                              title="위로 이동"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleMoveLegoBlock(block.instanceId, 'down')}
                              disabled={idx === legoBlocks.length - 1 || block.locked}
                              className={`p-1 rounded ${idx === legoBlocks.length - 1 || block.locked ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                              title="아래로 이동"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDuplicateLegoBlock(block.instanceId)}
                              className="p-1 rounded text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10"
                              title="복제"
                            >
                              <Copy className="w-3 h-3" />
                            </button>
                            <button
                              onClick={() => handleRemoveLegoBlock(block.instanceId)}
                              disabled={block.locked}
                              className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 ml-0.5 disabled:cursor-not-allowed disabled:opacity-30"
                              title="삭제"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* 슬롯 및 너비 조작 바 */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-900 text-[10px] font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-500">슬롯:</span>
                            <select
                              value={block.targetSlot || (block.category === 'header' ? 'header' : block.category === 'footer' ? 'footer' : block.category === 'sidebar' ? 'sidebar' : block.category === 'aside' ? 'aside' : 'main')}
                              onChange={(e) => handleUpdateLegoBlockSlot(block.instanceId, e.target.value as LayoutZoneSlot)}
                              disabled={block.locked}
                              className="bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-emerald-400 font-bold outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              <option value="header">헤더 (Header)</option>
                              <option value="sidebar">사이드바 (Sidebar)</option>
                              <option value="main">본문 (Main)</option>
                              <option value="aside">우측 패널 (Aside)</option>
                              <option value="footer">푸터 (Footer)</option>
                            </select>
                          </div>

                          {(!block.targetSlot || block.targetSlot === 'main') && (
                            <div className="flex items-center gap-1">
                              <span className="text-slate-500">폭:</span>
                              {(['full', 'half', 'third'] as const).map(w => (
                                <button
                                  key={w}
                                  type="button"
                                  onClick={() => handleUpdateLegoBlockColSpan(block.instanceId, w)}
                                  disabled={block.locked}
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${
                                    (block.colSpan || 'full') === w 
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                                      : 'text-slate-500 hover:text-slate-300'
                                  }`}
                                >
                                  {w === 'full' ? '100%' : w === 'half' ? '50%' : '33%'}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* 미니 와이어프레임 블루프린트 미리보기 */}
                        <ComponentVisualBlueprint 
                          componentId={block.componentId}
                          type={block.type}
                          category={block.category}
                          focalAnchor={block.focalAnchor}
                          className="h-11 border-slate-800/70 bg-slate-900/50"
                          active={isSelected}
                        />

                        {isSelected && (
                          <div
                            className="space-y-2.5 rounded-xl border border-emerald-500/20 bg-slate-900/80 p-2.5"
                            onClick={(event) => event.stopPropagation()}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-300">Layer Inspector</span>
                              <div className="flex items-center gap-1">
                                <button
                                  type="button"
                                  onClick={() => handleUpdateLegoBlock(block.instanceId, { hidden: !block.hidden })}
                                  className={`rounded-md border px-2 py-1 text-[9px] font-bold transition ${
                                    block.hidden
                                      ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                                      : 'border-slate-700 bg-slate-950 text-slate-400 hover:text-white'
                                  }`}
                                >
                                  {block.hidden ? '전체 숨김' : '표시 중'}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleUpdateLegoBlock(block.instanceId, { locked: !block.locked })}
                                  className={`rounded-md border p-1 transition ${
                                    block.locked
                                      ? 'border-cyan-500/40 bg-cyan-500/10 text-cyan-300'
                                      : 'border-slate-700 bg-slate-950 text-slate-400 hover:text-white'
                                  }`}
                                  aria-label={block.locked ? '레이어 잠금 해제' : '레이어 잠금'}
                                >
                                  {block.locked ? <LockKeyhole className="h-3 w-3" /> : <UnlockKeyhole className="h-3 w-3" />}
                                </button>
                              </div>
                            </div>

                            <label className="block space-y-1 text-[10px] text-slate-400">
                              <span>표시 이름</span>
                              <input
                                key={`${block.instanceId}-${block.koreanName}`}
                                defaultValue={block.koreanName}
                                disabled={block.locked}
                                onBlur={(event) => {
                                  const value = event.target.value.trim();
                                  if (value && value !== block.koreanName) {
                                    handleUpdateLegoBlock(block.instanceId, { koreanName: value });
                                  }
                                }}
                                className="w-full rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-xs text-white outline-none transition focus:border-emerald-500 disabled:opacity-40"
                              />
                            </label>

                            <label className="block space-y-1 text-[10px] text-slate-400">
                              <span>AI 구현 설명</span>
                              <textarea
                                key={`${block.instanceId}-${block.description}`}
                                defaultValue={block.description}
                                disabled={block.locked}
                                rows={2}
                                onBlur={(event) => {
                                  const value = event.target.value.trim();
                                  if (value !== block.description) {
                                    handleUpdateLegoBlock(block.instanceId, { description: value });
                                  }
                                }}
                                className="w-full resize-none rounded-lg border border-slate-700 bg-slate-950 px-2.5 py-1.5 text-[10px] leading-relaxed text-slate-200 outline-none transition focus:border-emerald-500 disabled:opacity-40"
                              />
                            </label>

                            <div className="grid grid-cols-2 gap-1.5 text-[9px] font-bold">
                              <button
                                type="button"
                                onClick={() => handleUpdateLegoBlockVisibility(block.instanceId, 'base', !block.responsive?.base?.hidden)}
                                className={`rounded-lg border px-2 py-1.5 transition ${
                                  block.responsive?.base?.hidden
                                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                                    : 'border-slate-700 bg-slate-950 text-slate-400 hover:text-white'
                                }`}
                              >
                                모바일 {block.responsive?.base?.hidden ? '숨김' : '표시'}
                              </button>
                              <button
                                type="button"
                                onClick={() => handleUpdateLegoBlockVisibility(block.instanceId, 'md', !block.responsive?.md?.hidden)}
                                className={`rounded-lg border px-2 py-1.5 transition ${
                                  block.responsive?.md?.hidden
                                    ? 'border-amber-500/40 bg-amber-500/10 text-amber-300'
                                    : 'border-slate-700 bg-slate-950 text-slate-400 hover:text-white'
                                }`}
                              >
                                데스크톱 {block.responsive?.md?.hidden ? '숨김' : '표시'}
                              </button>
                            </div>

                            <div className="flex items-center justify-between font-mono text-[9px] text-slate-500">
                              <span>{block.componentId}</span>
                              <span>{block.instanceId}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      );
                    })
                  )}
                </div>

                {/* 하단 인라인 컴포넌트 라이브러리 (직접 추가 가능) */}
                <div className="pt-2 border-t border-slate-800 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5 text-emerald-400" />
                      새 컴포넌트 블록 추가 ({filteredComponents.length}개):
                    </span>
                  </div>

                  {/* 앵커 필터 칩 */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[10px] custom-scrollbar">
                    {[
                      { id: 'all' as FocalAnchor, label: '전체' },
                      { id: 'video' as FocalAnchor, label: '🎥 영상' },
                      { id: 'visual' as FocalAnchor, label: '📸 사진' },
                      { id: 'typo' as FocalAnchor, label: '🔤 타이포' },
                      { id: 'data' as FocalAnchor, label: '📊 데이터' },
                    ].map(f => (
                      <button
                        key={f.id}
                        onClick={() => setComponentAnchorFilter(f.id)}
                        className={`px-2.5 py-1 rounded-lg font-bold whitespace-nowrap transition ${
                          componentAnchorFilter === f.id
                            ? 'bg-emerald-500 text-slate-950 font-black'
                            : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* 빠른 검색 */}
                  <input
                    type="text"
                    placeholder="컴포넌트 검색 (예: 룩북, 비디오, 벤토)..."
                    value={componentSearchQuery}
                    onChange={(e) => setComponentSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-emerald-500"
                  />

                  {/* 컴포넌트 리스트 */}
                  <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
                    {filteredComponents.map(comp => {
                      const stackCount = legoBlocks.filter(b => b.componentId === comp.id).length;
                      return (
                        <div
                          key={comp.id}
                          className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-950/90 transition space-y-2 group"
                        >
                          {/* 상단 미니 와이어프레임 블루프린트 미리보기 */}
                          <ComponentVisualBlueprint 
                            componentId={comp.id}
                            type={comp.type}
                            category={comp.category}
                            focalAnchor={comp.focalAnchor}
                            className="h-14 border-slate-800 group-hover:border-emerald-500/40"
                            active={stackCount > 0}
                          />

                          <div className="flex items-center justify-between gap-2">
                            <div className="min-w-0 space-y-0.5">
                              <div className="flex items-center gap-1.5">
                                <h4 className="text-xs font-bold text-slate-200 group-hover:text-emerald-300 truncate transition">
                                  {comp.koreanName}
                                </h4>
                                {stackCount > 0 && (
                                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
                                    {stackCount}개
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-400 line-clamp-1">{comp.description}</p>
                            </div>

                            <button
                              onClick={() => handleAddLegoBlock(comp)}
                              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/40 text-xs font-bold transition shrink-0 flex items-center gap-1 active:scale-95 shadow"
                            >
                              <Plus className="w-3 h-3 stroke-[3]" />
                              <span>추가</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ===============================================================
                [TAB 2] ✨ 테마 & 비주얼 스타일 DNA (24대 스타일 팩)
                =============================================================== */}
            {activeStudioTab === 'styles' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                      <span>✨ 24대 비주얼 스타일 DNA</span>
                    </h2>
                    <p className="text-[11px] text-slate-400">보더 반경, 섀도우, 여백, 아키텍처 규칙이 즉각 적용됩니다</p>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40">
                    {selectedStyle.category}
                  </span>
                </div>

                {/* 스타일 카테고리 필터 칩 */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
                  {[
                    { id: 'All', label: '전체 (24)' },
                    { id: 'High-Tech', label: '🚀 하이테크' },
                    { id: 'Clean', label: '⚪️ 클린 미니멀' },
                    { id: 'Pop', label: '⚡️ 볼드 팝' },
                    { id: 'Editorial', label: '🏛️ 에디토리얼' },
                    { id: 'Tactile', label: '🌸 웜 웰빙' },
                  ].map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => setStyleCategoryFilter(cat.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition ${
                        styleCategoryFilter === cat.id
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                          : 'bg-slate-950 border border-slate-800 text-slate-400 hover:bg-slate-800'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* 24대 스타일 카드 그리드 */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                  {VISUAL_STYLES
                    .filter(s => styleCategoryFilter === 'All' || s.category === styleCategoryFilter)
                    .map(styleItem => {
                      const isStyleSelected = selectedStyle.id === styleItem.id;
                      return (
                        <div
                          key={styleItem.id}
                          onClick={() => setSelectedStyle(styleItem)}
                          className={`p-3 rounded-2xl border cursor-pointer transition flex flex-col gap-1.5 ${
                            isStyleSelected
                              ? 'bg-gradient-to-r from-emerald-950/40 via-slate-850 to-slate-850 border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg'
                              : 'bg-slate-950/70 border-slate-800 hover:bg-slate-850/60 hover:border-slate-700'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <h3 className="text-xs font-black text-white">{styleItem.koreanName}</h3>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                                {styleItem.category}
                              </span>
                            </div>
                            {isStyleSelected && (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 flex items-center gap-1 shadow">
                                <Check className="w-3 h-3 stroke-[3]" /> 적용중
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-300 leading-snug">
                            {styleItem.description}
                          </p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono pt-0.5">
                            <span>반경: {styleItem.defaultBorderRadius}</span>
                            <span>•</span>
                            <span>섀도우: {styleItem.shadowType}</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* ===============================================================
                [TAB 3] 🔤 폰트 & 타이포그래피 (16대 폰트 테마)
                =============================================================== */}
            {activeStudioTab === 'typography' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                      <span>🔤 16대 프리미엄 폰트 시스템</span>
                    </h2>
                    <p className="text-[11px] text-slate-400">헤드라인과 본문 글꼴이 캔버스 전체에 적용됩니다</p>
                  </div>
                  <span className="text-[10px] font-mono text-purple-300 font-bold px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-800/40">
                    {selectedTypography.category}
                  </span>
                </div>

                {/* 헤드라인 인라인 실시간 편집기 */}
                <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 font-bold block">헤드라인 카피 실시간 편집:</span>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-purple-400 transition"
                  />
                  <div className="flex items-center gap-1.5 overflow-x-auto text-[10px] pt-1">
                    {[
                      '차세대 생성형 UI/UX 아키텍처',
                      '빛과 여백이 빚어내는 럭셔리 에디토리얼',
                      '실시간 ARR 52.4억 달성 SaaS 대시보드',
                      '프레임 단위로 살아 숨 쉬는 모션 비디오 스튜디오',
                    ].map((sample, idx) => (
                      <button
                        key={idx}
                        onClick={() => setHeadline(sample)}
                        className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-white whitespace-nowrap"
                      >
                        {sample.split(' ')[0]}...
                      </button>
                    ))}
                  </div>
                </div>

                {/* 폰트 카테고리 필터 칩 */}
                <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-950 border border-slate-800 text-[11px] overflow-x-auto custom-scrollbar">
                  {(['ALL', 'Sans', 'Serif', 'Mono', 'Display'] as const).map(cat => {
                    const labels: Record<string, string> = {
                      ALL: '전체 (16)',
                      Sans: '산세리프 (5)',
                      Serif: '세리프 (5)',
                      Mono: '모노 (2)',
                      Display: '디스플레이 (4)',
                    };
                    const isCatActive = typoCategoryFilter === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setTypoCategoryFilter(cat)}
                        className={`px-2.5 py-1 rounded-lg transition font-medium whitespace-nowrap text-[11px] ${
                          isCatActive
                            ? 'bg-purple-600 text-white font-bold shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                        }`}
                      >
                        {labels[cat]}
                      </button>
                    );
                  })}
                </div>

                {/* 16대 폰트 카드 목록 */}
                <div className="grid grid-cols-1 gap-2 max-h-[460px] overflow-y-auto pr-1 custom-scrollbar">
                  {TYPOGRAPHY_OPTIONS
                    .filter(t => typoCategoryFilter === 'ALL' || t.category === typoCategoryFilter)
                    .map(typo => {
                      const isTypoSelected = selectedTypography.id === typo.id;
                      return (
                        <div
                          key={typo.id}
                          onClick={() => setSelectedTypography(typo)}
                          className={`p-3 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                            isTypoSelected
                              ? 'bg-purple-950/40 border-purple-400 ring-1 ring-purple-400/50 shadow-md'
                              : 'bg-slate-950/70 border-slate-800 hover:border-slate-700 hover:bg-slate-900 text-slate-300'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            {/* 비주얼 글꼴 샘플 글자 */}
                            <div 
                              className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-inner"
                              style={{ fontFamily: typo.headlineFont }}
                            >
                              {typo.sampleLetter}
                            </div>
                            <div className="space-y-0.5 min-w-0">
                              <h4 className="text-xs font-bold text-white truncate">{typo.koreanName}</h4>
                              <p className="text-[10px] text-slate-400 font-mono truncate">{typo.headlineFont} • {typo.category}</p>
                              <p className="text-[10px] text-slate-500 line-clamp-1">{typo.description}</p>
                            </div>
                          </div>
                          {isTypoSelected && <Check className="w-4 h-4 text-purple-400 shrink-0" />}
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* ===============================================================
                [TAB 4] 🎨 컬러 팔레트 & 톤 (Color Studio)
                =============================================================== */}
            {activeStudioTab === 'colors' && (
              <div className="space-y-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <div>
                    <h2 className="text-sm font-black text-white flex items-center gap-1.5">
                      <span>🎨 컬러 팔레트 & 톤 스튜디오</span>
                    </h2>
                    <p className="text-[11px] text-slate-400">WCAG 대비비 검증 및 큐레이션 팔레트</p>
                  </div>
                  <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: selectedColorTheme.tokens.accent }} />
                    <span>{selectedColorTheme.koreanName.split(' ')[1] || selectedColorTheme.koreanName}</span>
                  </div>
                </div>

                {/* ColorStudio 임베딩 */}
                <div className="rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 p-2">
                  <ColorStudio
                    selectedColorTheme={selectedColorTheme}
                    onSelectColorTheme={setSelectedColorTheme}
                  />
                </div>
              </div>
            )}

          </div>

          {/* 좌측 패널 하단 고정 요약 바 */}
          <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: selectedColorTheme.tokens.accent }} />
              <span className="font-bold text-white">{selectedStyle.koreanName}</span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300 font-mono text-[11px]">{legoBlocks.length}개 블록</span>
            </div>

            <button
              onClick={() => setIsCodeModalOpen(true)}
              className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow flex items-center gap-1"
            >
              <Code className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>코드 추출</span>
            </button>
          </div>

        </aside>

        {/* -------------------------------------------------------------------
            2-B. 우측 메인 라이브 인터랙티브 캔버스 뷰포트
            ------------------------------------------------------------------- */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-950 overflow-hidden">
          
          {/* 캔버스 상단 상태 브레드크럼 & 퀵 인포 */}
          <div className="px-6 py-2.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                LIVE UI/UX ARCHITECTURE
              </span>
              <span>•</span>
              <span>STYLE: {selectedStyle.koreanName}</span>
              <span>•</span>
              <span>FONT: {selectedTypography.headlineFont}</span>
              <span>•</span>
              <span className="text-white font-bold">BLOCKS: {legoBlocks.length}개 순차 렌더링</span>
            </div>

            <div
              className="hidden sm:flex items-center gap-2 text-[11px]"
              title={studioAudit.issues.map((issue) => issue.message).join('\n') || '검증 항목을 모두 통과했습니다.'}
            >
              <span className={studioAudit.isReady ? 'text-emerald-400' : 'text-amber-300'}>
                QUALITY {studioAudit.score}/100
              </span>
              <span>•</span>
              <span>CONTRAST {studioAudit.contrastRatio.toFixed(2)}:1</span>
              <span>•</span>
              <span>REACT 19 / TAILWIND READY</span>
            </div>
          </div>

          {/* 중앙 광활한 캔버스 뷰포트 영역 (상단 잘림 없는 완전 스크롤 & 확대/축소 지원) */}
          <div className="flex-1 overflow-y-auto p-3 md:p-8 flex items-start justify-center transition-all scrollbar-thin scrollbar-thumb-slate-700">
            <div 
              ref={canvasExportRef}
              style={{
                transform: canvasScale === '85' ? 'scale(0.85)' : canvasScale === '75' ? 'scale(0.75)' : 'none',
                transformOrigin: 'top center',
                width: canvasScale === '85' ? '117.6%' : canvasScale === '75' ? '133.3%' : '100%',
              }}
              className={`transition-all duration-300 w-full flex justify-center py-2 ${
                viewportMode === 'mobile' ? 'max-w-[390px]' : 'max-w-5xl'
              }`}
            >
              <CanvasRenderer
                domain={webDomain}
                style={selectedStyle}
                colorTheme={selectedColorTheme}
                buttonStyle={derivedButtonStyle}
                typography={selectedTypography}
                activeElements={activeElements}
                selectedNav={selectedNav}
                selectedMainDeck={selectedMainDeck}
                selectedMetric={selectedMetric}
                selectedFooter={selectedFooter}
                userContent={headline}
                onUpdateHeadline={setHeadline}
                activeLayouts={activeLayouts}
                viewportMode={viewportMode}
                onViewportModeChange={setViewportMode}
                webViewMode={viewportMode === 'mobile' ? 'mobile' : 'full_scroll'}
                onWebViewModeChange={(mode) => setViewportMode(mode === 'mobile' ? 'mobile' : 'desktop')}
                legoBlocks={legoBlocks}
                onMoveLegoBlock={handleMoveLegoBlock}
                onRemoveLegoBlock={handleRemoveLegoBlock}
                onAddLegoBlockClick={() => setIsLegoModalOpen(true)}
                layoutPreset={layoutPreset}
                inspectMode={inspectMode}
              />
            </div>
          </div>

        </main>

      </div>

      {/* =====================================================================
          3. 모달 레이어 (대형 블록 스태커, AI 프롬프트, React/HTML 코드 복사)
          ===================================================================== */}
      
      {/* 3-A. 🧱 레고 블록 대형 컴포넌트 스태커 모달 */}
      <LegoBlockStackerModal
        isOpen={isLegoModalOpen}
        onClose={() => setIsLegoModalOpen(false)}
        legoBlocks={legoBlocks}
        onMoveLegoBlock={handleMoveLegoBlock}
        onRemoveLegoBlock={handleRemoveLegoBlock}
        onAddLegoBlock={handleAddLegoBlock}
        onDuplicateLegoBlock={handleDuplicateLegoBlock}
        onResetLegoBlocks={handleResetLegoBlocks}
        onShuffleLegoBlocks={handleShuffleLegoBlocks}
        onClearLegoBlocks={handleClearLegoBlocks}
        domainId="web"
      />

      {/* 3-B. 💻 React / HTML / 디자인 토큰 코드 내보내기 모달 */}
      <CodeExportModal
        isOpen={isCodeModalOpen}
        onClose={() => setIsCodeModalOpen(false)}
        blueprint={studioDocument}
        legoBlocks={legoBlocks}
        style={selectedStyle}
        colorTheme={selectedColorTheme}
        typography={selectedTypography}
        headline={headline}
        layoutPreset={layoutPreset}
      />

      {/* 3-C. 📋 AI 디자인 프롬프트 생성 모달 (ChatGPT, Claude, v0, Midjourney) */}
      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        promptResult={promptResult}
        targetAI={targetAI}
        onTargetAIChange={setTargetAI}
      />

    </div>
  );
}
