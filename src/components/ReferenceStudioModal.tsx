'use client';

import React, { useState, useMemo } from 'react';
import { 
  ALL_LAYOUT_REFERENCES, 
  LayoutReference, 
  ReferencePartKey, 
  TrendCategory,
  ReferenceFocalAnchor,
  FOCAL_ANCHOR_METADATA,
  PART_METADATA 
} from '@/data/layout-references';
import WireframePreview from './WireframePreview';
import { 
  X, Search, Sparkles, Filter, Check, Copy, Sliders, 
  Layers, Zap, SlidersHorizontal, Wand2
} from 'lucide-react';

interface ReferenceCustomOptions {
  showBadge?: boolean;
  showSecondaryCta?: boolean;
  showLiveStatus?: boolean;
  showGridLines?: boolean;
  showSparkline?: boolean;
  splitRatio?: string;
  [key: string]: string | number | boolean | undefined;
}

interface ReferenceStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPart?: ReferencePartKey;
  // Currently selected layouts per part
  activeLayouts: Record<ReferencePartKey, LayoutReference>;
  onSelectLayout: (part: ReferencePartKey, layout: LayoutReference) => void;
  // Customization options state
  customOptions: ReferenceCustomOptions;
  onUpdateCustomOption: (key: string, value: string | number | boolean | undefined) => void;
  // Current user editable texts
  headline: string;
  onUpdateHeadline: (val: string) => void;
}

const ALL_TRENDS: (TrendCategory | 'ALL')[] = [
  'ALL',
  'Bento Grid 2.0',
  'GenUI & AI-Native',
  'Liquid Glass',
  'Swiss & Neo-Brutalist',
  'Linear HUD',
  'Spatial 3D & Clay',
  'Asymmetric Split',
  'Minimalist Editorial',
];

export default function ReferenceStudioModal({
  isOpen,
  onClose,
  initialPart,
  activeLayouts,
  onSelectLayout,
  customOptions,
  onUpdateCustomOption,
  headline,
  onUpdateHeadline
}: ReferenceStudioModalProps) {
  const [activePart, setActivePart] = useState<ReferencePartKey>(initialPart || 'hero');
  const [selectedAnchor, setSelectedAnchor] = useState<ReferenceFocalAnchor>('all');
  const [selectedTrend, setSelectedTrend] = useState<TrendCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Filtered layouts for current part, anchor, trend, and search query
  const filteredLayouts = useMemo(() => {
    return ALL_LAYOUT_REFERENCES.filter(item => {
      if (item.part !== activePart) return false;
      if (selectedAnchor !== 'all' && item.focalAnchor !== selectedAnchor) return false;
      if (selectedTrend !== 'ALL' && item.trend !== selectedTrend) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = item.name.toLowerCase().includes(q);
        const matchKorean = item.koreanName.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        const matchTag = item.tags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchKorean && !matchDesc && !matchTag) return false;
      }
      return true;
    });
  }, [activePart, selectedAnchor, selectedTrend, searchQuery]);

  const currentSelected = activeLayouts[activePart];

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-7xl h-[92vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden">
        
        {/* =========================================================================
            1. 헤더: 타이틀, 376개 레퍼런스 카운트 뱃지, 닫기 버튼
            ========================================================================= */}
        <header className="px-6 py-4 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base md:text-lg font-black text-white tracking-tight">
                  376대 글로벌 디자인 레퍼런스 & 커스터마이저 스튜디오
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  파트별 60+ 레이아웃
                </span>
              </div>
              <p className="text-xs text-slate-400">
                색상만 다른 베리에이션이 아닌 구성·배치·그리드가 완전히 다른 최신 Figma & Web 트렌드 아키텍처
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* =========================================================================
            2. 파트 선택 탭 (6대 파트)
            ========================================================================= */}
        <div className="px-6 py-2.5 border-b border-slate-800 bg-slate-900 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {(Object.keys(PART_METADATA) as ReferencePartKey[]).map(key => {
            const meta = PART_METADATA[key];
            const isCurrent = activePart === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setActivePart(key);
                  setSelectedTrend('ALL');
                }}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isCurrent
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300'
                }`}
              >
                <span>{meta.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isCurrent ? 'bg-slate-950/30 text-slate-950 font-black' : 'bg-slate-700 text-emerald-400'
                }`}>
                  {meta.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* =========================================================================
            3. 검색 & 중심 축(Visual Anchor) / 트렌드 필터 툴바
            ========================================================================= */}
        <div className="px-6 py-3 border-b border-slate-800/80 bg-slate-950/60 space-y-2.5 text-xs">
          {/* 3-A. 핵심 비주얼 앵커(Visual Anchor) 중심 필터 */}
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
              <span className="text-slate-300 flex items-center gap-1 font-bold mr-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                중심 축:
              </span>
              {(Object.keys(FOCAL_ANCHOR_METADATA) as ReferenceFocalAnchor[]).map(anchorKey => {
                const meta = FOCAL_ANCHOR_METADATA[anchorKey];
                const isCurrent = selectedAnchor === anchorKey;
                return (
                  <button
                    key={anchorKey}
                    onClick={() => setSelectedAnchor(anchorKey)}
                    className={`px-3 py-1.5 rounded-xl transition whitespace-nowrap text-xs font-bold flex items-center gap-1.5 ${
                      isCurrent
                        ? 'bg-emerald-500 text-slate-950 shadow-md font-black ring-1 ring-emerald-400'
                        : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`}
                  >
                    <span>{meta.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 검색창 */}
            <div className="relative min-w-[240px]">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="레이아웃, 앵커, 키워드 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* 3-B. 트렌드 서브 필터 */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1 border-t border-slate-800/60">
            <span className="text-slate-500 flex items-center gap-1 font-semibold text-[11px] mr-1">
              <Filter className="w-3 h-3 text-slate-500" />
              스타일 트렌드:
            </span>
            {ALL_TRENDS.map(t => (
              <button
                key={t}
                onClick={() => setSelectedTrend(t)}
                className={`px-2 py-0.5 rounded-lg transition whitespace-nowrap text-[11px] font-medium ${
                  selectedTrend === t
                    ? 'bg-slate-200 text-slate-950 font-bold shadow'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {t === 'ALL' ? '전체' : t}
              </button>
            ))}
          </div>
        </div>

        {/* =========================================================================
            4. 메인 컨텐츠 영역: [좌측 갤러리 그리드] + [우측 실시간 커스텀 인스펙터]
            ========================================================================= */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* 4-A. 좌측 레퍼런스 갤러리 리스트 */}
          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max">
            {filteredLayouts.length === 0 ? (
              <div className="col-span-full py-20 text-center text-slate-500 space-y-2">
                <p className="text-sm">일치하는 레퍼런스가 없습니다.</p>
                <button
                  onClick={() => { setSelectedAnchor('all'); setSelectedTrend('ALL'); setSearchQuery(''); }}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-emerald-400 font-bold hover:bg-slate-700"
                >
                  필터 초기화
                </button>
              </div>
            ) : (
              filteredLayouts.map(ref => {
                const isSelected = currentSelected?.id === ref.id;
                const anchorBadge = 
                  ref.focalAnchor === 'video' ? '🎥 영상 중심' :
                  ref.focalAnchor === 'visual' ? '📸 사진 중심' :
                  ref.focalAnchor === 'typo' ? '🔤 타이포 중심' :
                  ref.focalAnchor === 'data' ? '📊 데이터 중심' :
                  ref.focalAnchor === 'interactive' ? '🤖 GenUI' : '⚖️ 하이브리드';
                
                return (
                  <div
                    key={ref.id}
                    onClick={() => onSelectLayout(activePart, ref)}
                    className={`rounded-xl border p-4 flex flex-col justify-between gap-3 cursor-pointer transition-all duration-200 hover:-translate-y-0.5 group ${
                      isSelected
                        ? 'border-emerald-500 bg-slate-800/80 shadow-lg shadow-emerald-500/10 ring-1 ring-emerald-500'
                        : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div>
                      {/* 미니 와이어프레임 구조 미리보기 */}
                      <WireframePreview
                        geometry={ref.gridGeometry}
                        wireframeShape={ref.wireframeShape}
                        active={isSelected}
                        className="mb-3"
                      />

                      {/* 배지 및 트렌드 */}
                      <div className="flex items-center justify-between gap-1 mb-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-emerald-400 border border-slate-700">
                          {anchorBadge}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">
                          {ref.gridGeometry}
                        </span>
                      </div>

                      {/* 제목 */}
                      <h4 className="text-xs md:text-sm font-bold text-white group-hover:text-emerald-400 transition line-clamp-1">
                        {ref.koreanName}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-400 line-clamp-1 mb-2">
                        {ref.name}
                      </p>

                      {/* 설명 */}
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {ref.description}
                      </p>
                    </div>

                    {/* 하단 태그 & 적용 버튼 */}
                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {ref.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-slate-800">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectLayout(activePart, ref);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          isSelected
                            ? 'bg-emerald-500 text-slate-950 font-black'
                            : 'bg-slate-800 hover:bg-emerald-500/20 text-slate-300 hover:text-emerald-400'
                        }`}
                      >
                        {isSelected ? <Check className="w-3.5 h-3.5" /> : null}
                        <span>{isSelected ? '적용 중' : '선택'}</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* 4-B. 우측 실시간 커스텀 인스펙터 패널 ("그걸 좀 수정해보는 그런거") */}
          <div className="w-80 md:w-96 border-l border-slate-800 bg-slate-950/90 p-5 overflow-y-auto space-y-5 flex flex-col justify-between">
            {currentSelected ? (
              <div className="space-y-5">
                {/* 선택된 레이아웃 요약 헤더 */}
                <div className="space-y-2 pb-4 border-b border-slate-800">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-1">
                      <Sliders className="w-3 h-3" />
                      선택된 레이아웃 인스펙터
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300">
                      {currentSelected.density}
                    </span>
                  </div>
                  <h3 className="text-sm font-extrabold text-white">
                    {currentSelected.koreanName}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {currentSelected.description}
                  </p>
                </div>

                {/* 실시간 텍스트 인라인 수정 */}
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Wand2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>헤드라인 텍스트 즉시 수정</span>
                  </label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => onUpdateHeadline(e.target.value)}
                    placeholder="헤드라인을 입력하세요..."
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                  <p className="text-[10px] text-slate-400">
                    💡 레이아웃을 바꿔도 입력한 텍스트와 데이터는 그대로 유지됩니다.
                  </p>
                </div>

                {/* 구조적 컴포넌트 On/Off 스위처 */}
                <div className="space-y-2 pt-2">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
                    <span>배치 및 구조적 요소 토글</span>
                  </label>
                  
                  <div className="space-y-1.5 bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs">
                    <label className="flex items-center justify-between cursor-pointer py-1">
                      <span className="text-slate-300">상단 알약 배지 표시</span>
                      <input
                        type="checkbox"
                        checked={customOptions.showBadge ?? true}
                        onChange={(e) => onUpdateCustomOption('showBadge', e.target.checked)}
                        className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer py-1">
                      <span className="text-slate-300">보조 CTA 버튼 표시</span>
                      <input
                        type="checkbox"
                        checked={customOptions.showSecondaryCta ?? true}
                        onChange={(e) => onUpdateCustomOption('showSecondaryCta', e.target.checked)}
                        className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer py-1">
                      <span className="text-slate-300">실시간 점멸 라이트 (Live Status)</span>
                      <input
                        type="checkbox"
                        checked={customOptions.showLiveStatus ?? true}
                        onChange={(e) => onUpdateCustomOption('showLiveStatus', e.target.checked)}
                        className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer py-1">
                      <span className="text-slate-300">배경 모눈/헤어라인 그리드</span>
                      <input
                        type="checkbox"
                        checked={customOptions.showGridLines ?? false}
                        onChange={(e) => onUpdateCustomOption('showGridLines', e.target.checked)}
                        className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                      />
                    </label>

                    <label className="flex items-center justify-between cursor-pointer py-1">
                      <span className="text-slate-300">실시간 스파크라인 차트</span>
                      <input
                        type="checkbox"
                        checked={customOptions.showSparkline ?? false}
                        onChange={(e) => onUpdateCustomOption('showSparkline', e.target.checked)}
                        className="rounded border-slate-700 text-emerald-500 focus:ring-emerald-500"
                      />
                    </label>
                  </div>
                </div>

                {/* 화면 분할 비율 조정 */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300">
                    분할 그리드 비율 조정
                  </label>
                  <div className="grid grid-cols-4 gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-[11px]">
                    {['50:50', '60:40', '70:30', 'reversed'].map((ratio) => (
                      <button
                        key={ratio}
                        onClick={() => onUpdateCustomOption('splitRatio', ratio)}
                        className={`py-1 rounded-lg font-mono font-bold transition ${
                          (customOptions.splitRatio || '50:50') === ratio
                            ? 'bg-emerald-500 text-slate-950 shadow'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {ratio}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4-C. 원클릭 내보내기 액션 */}
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    원클릭 프롬프트 & 스펙 복사
                  </span>
                  
                  <div className="space-y-1.5">
                    <button
                      onClick={() => handleCopy(currentSelected.promptDirectives.figma, 'figma')}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-cyan-400" />
                        Figma Auto-Layout 스펙
                      </span>
                      {copiedKey === 'figma' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    </button>

                    <button
                      onClick={() => handleCopy(currentSelected.promptDirectives.tailwind, 'tailwind')}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                        Tailwind / v0 JSX 구조
                      </span>
                      {copiedKey === 'tailwind' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    </button>

                    <button
                      onClick={() => handleCopy(currentSelected.promptDirectives.aiImage, 'image')}
                      className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-between transition"
                    >
                      <span className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-purple-400" />
                        Midjourney 8K 이미지 프롬프트
                      </span>
                      {copiedKey === 'image' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-20 text-center text-slate-500 text-xs">
                레퍼런스를 선택하면 실시간 수정 패널이 활성화됩니다.
              </div>
            )}

            {/* 캔버스 즉시 적용 완료 버튼 */}
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs md:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition"
              >
                <span>캔버스에 즉시 적용 및 닫기</span>
                <Check className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
