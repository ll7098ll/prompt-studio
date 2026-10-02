'use client';

import React, { useState, useMemo } from 'react';
import { 
  LegoBlockItem, 
  DomainComponentOption, 
  WEB_COMPONENTS, 
  PPT_COMPONENTS,
  INSTA_COMPONENTS,
  COMMERCE_COMPONENTS,
  YOUTUBE_COMPONENTS,
  FocalAnchor 
} from '@/data/component-presets';
import { 
  X, Plus, Trash2, ArrowUp, ArrowDown, Copy, 
  Sparkles, Shuffle, Layers,
  Check, Search
} from 'lucide-react';
import ComponentVisualBlueprint from '@/components/ComponentVisualBlueprint';

interface LegoBlockStackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  legoBlocks: LegoBlockItem[];
  onMoveLegoBlock: (instanceId: string, direction: 'up' | 'down') => void;
  onRemoveLegoBlock: (instanceId: string) => void;
  onAddLegoBlock: (component: DomainComponentOption) => void;
  onDuplicateLegoBlock?: (instanceId: string) => void;
  onResetLegoBlocks: (focalAnchor?: string) => void;
  onShuffleLegoBlocks: () => void;
  onClearLegoBlocks?: () => void;
  domainId?: string;
}

export default function LegoBlockStackerModal({
  isOpen,
  onClose,
  legoBlocks,
  onMoveLegoBlock,
  onRemoveLegoBlock,
  onAddLegoBlock,
  onDuplicateLegoBlock,
  onResetLegoBlocks,
  onShuffleLegoBlocks,
  onClearLegoBlocks,
  domainId = 'web',
}: LegoBlockStackerModalProps) {
  // 컴포넌트 라이브러리 필터 상태
  const [selectedAnchorFilter, setSelectedAnchorFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [addedNotice, setAddedNotice] = useState<string | null>(null);

  // 도메인별 컴포넌트 풀 (기본 웹 컴포넌트)
  const availableComponents = useMemo(() => {
    if (domainId === 'ppt') return PPT_COMPONENTS;
    if (domainId === 'instagram') return INSTA_COMPONENTS;
    if (domainId === 'commerce') return COMMERCE_COMPONENTS;
    if (domainId === 'youtube') return YOUTUBE_COMPONENTS;
    return WEB_COMPONENTS;
  }, [domainId]);

  // 필터링 및 검색된 컴포넌트 리스트
  const filteredComponents = useMemo(() => {
    return availableComponents.filter(c => {
      const matchFilter = selectedAnchorFilter === 'all' 
        || c.focalAnchor === selectedAnchorFilter
        || c.category === selectedAnchorFilter;
      const matchQuery = !searchQuery || 
        c.koreanName.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        c.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchFilter && matchQuery;
    });
  }, [availableComponents, selectedAnchorFilter, searchQuery]);

  if (!isOpen) return null;

  const handleAdd = (comp: DomainComponentOption) => {
    onAddLegoBlock(comp);
    setAddedNotice(`'${comp.koreanName}' 블록이 스택 하단에 추가되었습니다.`);
    setTimeout(() => setAddedNotice(null), 2200);
  };

  const getAnchorBadge = (anchor: FocalAnchor) => {
    switch (anchor) {
      case 'video':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">🎥 영상</span>;
      case 'visual':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center gap-1">📸 사진</span>;
      case 'typo':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">🔤 타이포</span>;
      case 'data':
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">📊 데이터</span>;
      default:
        return <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">⚡ 모듈</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-6xl max-h-[92vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===================================================================
            1. 모달 상단 헤더: 타이틀 & 원클릭 프리셋 툴바 & 닫기 버튼
            =================================================================== */}
        <div className="p-4 md:p-6 border-b border-slate-800 bg-slate-950/70 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base md:text-lg font-black text-white tracking-tight">
                    🧱 레고 블록 컴포넌트 스태커
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    LEGO MODULAR ARCHITECTURE
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  40여 종의 독보적 컴포넌트(영상, 룩북, 벤토, 타이포)를 레고 블록처럼 원하는 순서대로 쌓고 조합하세요.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition"
              title="닫기"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 원클릭 추천 스택 프리셋 바 */}
          <div className="flex items-center justify-between flex-wrap gap-2 pt-1 border-t border-slate-800/80 text-xs">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-mono text-[11px] text-slate-400 font-bold flex items-center gap-1 mr-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                원클릭 스택:
              </span>
              <button
                onClick={() => onResetLegoBlocks('video')}
                className="px-2.5 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 font-bold text-[11px] transition flex items-center gap-1 shadow-sm"
              >
                <span>🎥 비디오 중심</span>
              </button>
              <button
                onClick={() => onResetLegoBlocks('visual')}
                className="px-2.5 py-1 rounded-lg bg-pink-950/60 hover:bg-pink-900/80 border border-pink-500/40 text-pink-300 font-bold text-[11px] transition flex items-center gap-1 shadow-sm"
              >
                <span>📸 룩북 중심</span>
              </button>
              <button
                onClick={() => onResetLegoBlocks('typo')}
                className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900/80 border border-amber-500/40 text-amber-300 font-bold text-[11px] transition flex items-center gap-1 shadow-sm"
              >
                <span>🔤 스위스 타이포</span>
              </button>
              <button
                onClick={() => onResetLegoBlocks('data')}
                className="px-2.5 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900/80 border border-blue-500/40 text-blue-300 font-bold text-[11px] transition flex items-center gap-1 shadow-sm"
              >
                <span>📊 SaaS 벤토 데이터</span>
              </button>
              <button
                onClick={onShuffleLegoBlocks}
                className="px-2.5 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900/80 border border-purple-500/40 text-purple-300 font-bold text-[11px] transition flex items-center gap-1 shadow-sm"
              >
                <Shuffle className="w-3 h-3" />
                <span>🎲 랜덤 꿀조합</span>
              </button>
            </div>

            {onClearLegoBlocks && (
              <button
                onClick={onClearLegoBlocks}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-red-950 hover:text-red-400 hover:border-red-500/50 border border-slate-700 text-slate-400 font-mono text-[11px] transition flex items-center gap-1"
                title="모든 블록 비우기"
              >
                <Trash2 className="w-3 h-3" />
                <span>스택 비우기</span>
              </button>
            )}
          </div>
        </div>

        {/* ===================================================================
            2. 메인 바디: 좌측(현재 스택 시퀀스 40%) vs 우측(40+ 컴포넌트 팔레트 60%)
            =================================================================== */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden divide-y lg:divide-y-0 lg:divide-x divide-slate-800">
          
          {/* -----------------------------------------------------------------
              2-A. 좌측 패널 (조립된 레고 블록 시퀀스 리스트, 5열)
              ----------------------------------------------------------------- */}
          <div className="lg:col-span-5 flex flex-col bg-slate-950/40 overflow-hidden">
            {/* 좌측 패널 상단 상태 표시줄 */}
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white font-mono">
                  🧱 활성 스택 시퀀스
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-mono font-bold text-[11px] border border-emerald-500/40">
                  {legoBlocks.length}개 블록
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">위에서 아래로 렌더링</span>
            </div>

            {/* 스택 블록 목록 (스크롤 가능) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
              {legoBlocks.length === 0 ? (
                <div className="py-16 text-center space-y-3 px-4">
                  <div className="w-12 h-12 mx-auto rounded-2xl bg-slate-800 flex items-center justify-center text-slate-500">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-300">스택된 블록이 없습니다</h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                    우측 라이브러리에서 원하는 컴포넌트의 <span className="text-emerald-400 font-bold">[+ 추가]</span> 버튼을 누르거나 상단의 [원클릭 스택] 프리셋을 선택하세요.
                  </p>
                </div>
              ) : (
                legoBlocks.map((block, idx) => (
                  <div 
                    key={block.instanceId}
                    className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col gap-2.5 group shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono font-black text-xs shrink-0 border border-emerald-500/30 mt-0.5">
                          {idx + 1}
                        </div>
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <h4 className="text-xs font-bold text-white truncate max-w-[160px] sm:max-w-[200px]" title={block.koreanName}>
                              {block.koreanName}
                            </h4>
                            {getAnchorBadge(block.focalAnchor)}
                          </div>
                          <p className="text-[11px] text-slate-400 line-clamp-1 leading-snug">
                            {block.description}
                          </p>
                        </div>
                      </div>

                      {/* 조작 액션 버튼 툴바 (위, 아래, 복제, 삭제) */}
                      <div className="flex items-center gap-1 shrink-0 pt-0.5">
                        <button
                          onClick={() => onMoveLegoBlock(block.instanceId, 'up')}
                          disabled={idx === 0}
                          className={`p-1 rounded-md transition ${idx === 0 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                          title="위로 이동"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onMoveLegoBlock(block.instanceId, 'down')}
                          disabled={idx === legoBlocks.length - 1}
                          className={`p-1 rounded-md transition ${idx === legoBlocks.length - 1 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                          title="아래로 이동"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        {onDuplicateLegoBlock && (
                          <button
                            onClick={() => onDuplicateLegoBlock(block.instanceId)}
                            className="p-1 rounded-md text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition"
                            title="블록 복제"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          onClick={() => onRemoveLegoBlock(block.instanceId)}
                          className="p-1 rounded-md text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition"
                          title="블록 삭제"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* 미니 와이어프레임 블루프린트 미리보기 */}
                    <ComponentVisualBlueprint 
                      componentId={block.componentId}
                      type={block.type}
                      category={block.category}
                      focalAnchor={block.focalAnchor}
                      className="h-12 border-slate-800/80 bg-slate-950/60"
                      active={false}
                    />
                  </div>
                ))
              )}
            </div>

            {/* 좌측 패널 하단 실시간 피드백 알림 */}
            {addedNotice && (
              <div className="px-4 py-2 bg-emerald-950/90 border-t border-emerald-500/40 text-emerald-300 text-xs font-medium flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
                <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="truncate">{addedNotice}</span>
              </div>
            )}
          </div>

          {/* -----------------------------------------------------------------
              2-B. 우측 패널 (40여 종 컴포넌트 팔레트 라이브러리, 7열)
              ----------------------------------------------------------------- */}
          <div className="lg:col-span-7 flex flex-col bg-slate-900/60 overflow-hidden">
            {/* 우측 상단 필터 & 검색 툴바 */}
            <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-950/40">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-mono flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    컴포넌트 라이브러리
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ({filteredComponents.length}개 선택 가능)
                  </span>
                </div>

                {/* 검색 바 */}
                <div className="relative w-48 sm:w-60">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="컴포넌트 이름/키워드 검색..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-emerald-500 transition"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* 비주얼 앵커(Focal Anchor) & 슬롯 카테고리 필터 칩 */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px] custom-scrollbar">
                {[
                  { id: 'all', label: '전체 (All)' },
                  { id: 'sidebar', label: '📂 사이드바 (Sidebar)' },
                  { id: 'aside', label: '⚡️ 우측 패널 (Aside)' },
                  { id: 'data', label: '📊 데이터/벤토 (Data)' },
                  { id: 'video', label: '🎥 영상/모션 (Video)' },
                  { id: 'visual', label: '📸 사진/화보 (Photo)' },
                  { id: 'typo', label: '🔤 타이포 (Typo)' },
                  { id: 'hybrid', label: '🔀 인터랙티브 (Hybrid)' },
                ].map(chip => {
                  const isSelected = selectedAnchorFilter === chip.id;
                  return (
                    <button
                      key={chip.id}
                      onClick={() => setSelectedAnchorFilter(chip.id)}
                      className={`px-3 py-1 rounded-xl font-bold whitespace-nowrap transition ${
                        isSelected
                          ? 'bg-emerald-500 text-slate-950 shadow-md font-black'
                          : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 컴포넌트 카드 목록 (그리드) */}
            <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-3 custom-scrollbar">
              {filteredComponents.map(comp => {
                // 현재 스택에 몇 개 포함되어 있는지 카운트
                const stackCount = legoBlocks.filter(b => b.componentId === comp.id).length;

                return (
                  <div 
                    key={comp.id}
                    className="p-3 rounded-2xl bg-slate-950/80 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-900/90 transition flex flex-col justify-between gap-2.5 group relative"
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

                    <div className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-0.5 min-w-0">
                          <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition truncate">
                            {comp.koreanName}
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono block truncate">
                            {comp.name}
                          </span>
                        </div>
                        {getAnchorBadge(comp.focalAnchor)}
                      </div>

                      <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2">
                        {comp.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-800/80">
                      <span className="text-[10px] text-slate-400 font-mono">
                        {stackCount > 0 ? (
                          <span className="text-emerald-400 font-bold">✓ 스택에 {stackCount}개 포함</span>
                        ) : (
                          <span className="text-slate-400 uppercase">{comp.category}</span>
                        )}
                      </span>

                      <button
                        onClick={() => handleAdd(comp)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1 active:scale-95 shadow"
                      >
                        <Plus className="w-3.5 h-3.5 stroke-[3]" />
                        <span>스택에 추가</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ===================================================================
            3. 모달 하단 액션 풋터
            =================================================================== */}
        <div className="p-4 px-6 border-t border-slate-800 bg-slate-950/90 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="text-slate-400 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>
              현재 <strong>{legoBlocks.length}개</strong>의 블록이 실시간 캔버스에 즉각 연동되어 렌더링됩니다.
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition active:scale-98"
            >
              완료 및 실시간 캔버스 확인
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
