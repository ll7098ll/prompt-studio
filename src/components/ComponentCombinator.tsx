'use client';

import React, { useState, useMemo } from 'react';
import { 
  WEB_COMPONENTS, PPT_COMPONENTS, INSTA_COMPONENTS, COMMERCE_COMPONENTS, YOUTUBE_COMPONENTS,
  ALL_PRESET_BUNDLES, DomainComponentOption, PresetBundleOption, FocalAnchor, LegoBlockItem
} from '@/data/component-presets';
import { DesignDomain } from '@/data/domains';
import { 
  Sparkles, Layers, Compass, LayoutGrid,
  Box, Zap, Image as ImageIcon, Type,
  Shuffle, Filter,
  ArrowUp, ArrowDown, Trash2, Plus, ExternalLink
} from 'lucide-react';

interface ComponentCombinatorProps {
  selectedDomain: DesignDomain;
  selectedNav: DomainComponentOption;
  onSelectNav: (nav: DomainComponentOption) => void;
  selectedMainDeck: DomainComponentOption;
  onSelectMainDeck: (deck: DomainComponentOption) => void;
  selectedMetric: DomainComponentOption;
  onSelectMetric: (metric: DomainComponentOption) => void;
  selectedFooter: DomainComponentOption;
  onSelectFooter: (footer: DomainComponentOption) => void;
  onApplyBundle: (bundle: PresetBundleOption) => void;
  // 🧱 레고 블록 스택 연동 props
  legoBlocks?: LegoBlockItem[];
  onMoveLegoBlock?: (instanceId: string, direction: 'up' | 'down') => void;
  onRemoveLegoBlock?: (instanceId: string) => void;
  onAddLegoBlock?: (component: DomainComponentOption) => void;
  onOpenLegoStackerModal?: () => void;
  onResetLegoBlocks?: (focalAnchor?: string) => void;
  onShuffleLegoBlocks?: () => void;
}

export default function ComponentCombinator({
  selectedDomain,
  selectedNav,
  onSelectNav,
  selectedMainDeck,
  onSelectMainDeck,
  selectedMetric,
  onSelectMetric,
  selectedFooter,
  onSelectFooter,
  onApplyBundle,
  legoBlocks = [],
  onMoveLegoBlock,
  onRemoveLegoBlock,
  onOpenLegoStackerModal,
  onResetLegoBlocks,
  onShuffleLegoBlocks,
}: ComponentCombinatorProps) {
  // 모드 전환: 'lego' (레고 블록 스태커) vs 'classic' (4단 슬롯 & 번들)
  const [combinatorMode, setCombinatorMode] = useState<'lego' | 'classic'>('lego');

  // 1. 디자인 주도권 (Focal Anchor) 필터: 'all' | 'visual' | 'video' | 'typo' | 'data' | 'hybrid'
  const [focalFilter, setFocalFilter] = useState<FocalAnchor>('all');

  // 도메인 판별
  const domainId = selectedDomain.id;
  const isPPT = domainId === 'ppt';
  const isInsta = domainId === 'instagram';
  const isCommerce = domainId === 'commerce';
  const isYT = domainId === 'youtube';
  const isWeb = !isPPT && !isInsta && !isCommerce && !isYT;

  // 도메인별 하위 탭 키
  type TabKey = 'bundles' | 'slot1' | 'slot2' | 'slot3' | 'slot4';
  const [subTab, setSubTab] = useState<TabKey>('bundles');

  // 도메인별 탭 구성 정의
  const tabConfig = useMemo(() => {
    if (isPPT) {
      return [
        { id: 'bundles' as TabKey, label: '피치덱 번들', icon: Zap },
        { id: 'slot1' as TabKey, label: '슬라이드 헤더', icon: Compass },
        { id: 'slot2' as TabKey, label: '본문 화보/도표', icon: LayoutGrid },
        { id: 'slot3' as TabKey, label: '트랙션 KPI', icon: Layers },
        { id: 'slot4' as TabKey, label: '결론 시사점', icon: Box },
      ];
    }
    if (isInsta) {
      return [
        { id: 'bundles' as TabKey, label: '카드뉴스 번들', icon: Zap },
        { id: 'slot1' as TabKey, label: '표지 훅/화보', icon: ImageIcon },
        { id: 'slot2' as TabKey, label: '본문 인사이트', icon: LayoutGrid },
        { id: 'slot4' as TabKey, label: '엔딩 저장/CTA', icon: Box },
      ];
    }
    if (isCommerce) {
      return [
        { id: 'bundles' as TabKey, label: '상세페이지 번들', icon: Zap },
        { id: 'slot1' as TabKey, label: '공감 인트로', icon: Compass },
        { id: 'slot2' as TabKey, label: '3D 분해/기술', icon: LayoutGrid },
        { id: 'slot3' as TabKey, label: '신뢰/후기', icon: Layers },
        { id: 'slot4' as TabKey, label: '구매 전환', icon: Box },
      ];
    }
    if (isYT) {
      return [
        { id: 'bundles' as TabKey, label: '썸네일 번들', icon: Zap },
        { id: 'slot1' as TabKey, label: '펀치 타이포', icon: Type },
        { id: 'slot2' as TabKey, label: '인물 감정 누끼', icon: ImageIcon },
        { id: 'slot3' as TabKey, label: '시선 유도 장치', icon: Layers },
      ];
    }
    // 기본 웹
    return [
      { id: 'bundles' as TabKey, label: '추천 번들', icon: Zap },
      { id: 'slot1' as TabKey, label: '네비/GNB', icon: Compass },
      { id: 'slot2' as TabKey, label: '히어로 쇼케이스', icon: LayoutGrid },
      { id: 'slot3' as TabKey, label: '피처/지표', icon: Layers },
      { id: 'slot4' as TabKey, label: '전환/푸터', icon: Box },
    ];
  }, [isPPT, isInsta, isCommerce, isYT]);

  // 도메인별 추천 번들 목록
  const activeBundles = useMemo(() => {
    return ALL_PRESET_BUNDLES.filter(b => {
      const matchDomain = b.domainId === domainId || (isWeb && (b.domainId === 'web' || b.domainId === 'all'));
      const matchAnchor = focalFilter === 'all' || b.focalAnchor === focalFilter;
      return matchDomain && matchAnchor;
    });
  }, [domainId, isWeb, focalFilter]);

  // 도메인별 전체 컴포넌트 풀
  const currentDomainPool: DomainComponentOption[] = useMemo(() => {
    if (isPPT) return PPT_COMPONENTS;
    if (isInsta) return INSTA_COMPONENTS;
    if (isCommerce) return COMMERCE_COMPONENTS;
    if (isYT) return YOUTUBE_COMPONENTS;
    return WEB_COMPONENTS;
  }, [isPPT, isInsta, isCommerce, isYT]);

  // 앵커 모드 필터링 적용된 컴포넌트들
  const filteredComponents = useMemo(() => {
    if (focalFilter === 'all') return currentDomainPool;
    return currentDomainPool.filter(c => c.focalAnchor === focalFilter);
  }, [currentDomainPool, focalFilter]);

  // 슬롯별 컴포넌트 추출
  const slot1Options = useMemo(() => {
    return filteredComponents.filter(c => c.category === 'header' || (isInsta && c.category === 'hero') || (isCommerce && c.category === 'hero') || (isYT && c.category === 'hero'));
  }, [filteredComponents, isInsta, isCommerce, isYT]);

  const slot2Options = useMemo(() => {
    return filteredComponents.filter(c => c.category === 'hero' || c.category === 'body');
  }, [filteredComponents]);

  const slot3Options = useMemo(() => {
    return filteredComponents.filter(c => c.category === 'metric' || c.category === 'body' || c.category === 'trust');
  }, [filteredComponents]);

  const slot4Options = useMemo(() => {
    return filteredComponents.filter(c => c.category === 'footer' || c.category === 'conversion');
  }, [filteredComponents]);

  // 앵커 모드 레이블 뱃지 헬퍼
  const renderAnchorBadge = (anchor: FocalAnchor) => {
    switch (anchor) {
      case 'video':
        return <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center gap-1">🎥 영상/모션</span>;
      case 'visual':
        return <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-400 border border-pink-500/30 flex items-center gap-1">📸 사진/화보</span>;
      case 'typo':
        return <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center gap-1">🔤 타이포</span>;
      case 'data':
        return <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center gap-1">📊 데이터/벤토</span>;
      case 'hybrid':
        return <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center gap-1">🔀 하이브리드</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-3">
      {/* =========================================================================
          0. 상단 모드 스위처: [🧱 레고 블록 자유 조립] vs [⚡ 원클릭 4단 슬롯 & 번들]
          ========================================================================= */}
      <div className="flex items-center p-1 rounded-xl bg-slate-950 border border-slate-800 text-xs font-bold">
        <button
          onClick={() => setCombinatorMode('lego')}
          className={`flex-1 py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
            combinatorMode === 'lego'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>🧱 레고 블록 자유 조립 ({legoBlocks.length}개)</span>
        </button>
        <button
          onClick={() => setCombinatorMode('classic')}
          className={`flex-1 py-1.5 px-2 rounded-lg transition flex items-center justify-center gap-1.5 ${
            combinatorMode === 'classic'
              ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>⚡ 추천 번들 & 4단 슬롯</span>
        </button>
      </div>

      {/* =========================================================================
          모드 1: 🧱 레고 블록 자유 조립 (스태커 뷰)
          ========================================================================= */}
      {combinatorMode === 'lego' && (
        <div className="space-y-3">
          {/* 레고 스택 툴바 (원클릭 프리셋 & 스튜디오 열기) */}
          <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                원클릭 스택 프리셋:
              </span>
              {onOpenLegoStackerModal && (
                <button
                  onClick={onOpenLegoStackerModal}
                  className="px-2 py-0.5 rounded text-[11px] font-bold text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <span>전체 라이브러리 열기</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-wrap text-[10px] font-bold">
              <button
                onClick={() => onResetLegoBlocks?.('video')}
                className="px-2 py-1 rounded-lg bg-cyan-950/60 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300"
              >
                🎥 비디오 스택
              </button>
              <button
                onClick={() => onResetLegoBlocks?.('visual')}
                className="px-2 py-1 rounded-lg bg-pink-950/60 hover:bg-pink-900 border border-pink-500/40 text-pink-300"
              >
                📸 룩북 스택
              </button>
              <button
                onClick={() => onResetLegoBlocks?.('typo')}
                className="px-2 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900 border border-amber-500/40 text-amber-300"
              >
                🔤 타이포 스택
              </button>
              <button
                onClick={() => onResetLegoBlocks?.('data')}
                className="px-2 py-1 rounded-lg bg-blue-950/60 hover:bg-blue-900 border border-blue-500/40 text-blue-300"
              >
                📊 SaaS 데이터 스택
              </button>
              <button
                onClick={() => onShuffleLegoBlocks?.()}
                className="px-2 py-1 rounded-lg bg-purple-950/60 hover:bg-purple-900 border border-purple-500/40 text-purple-300 flex items-center gap-1"
              >
                <Shuffle className="w-2.5 h-2.5" />
                <span>랜덤 셔플</span>
              </button>
            </div>
          </div>

          {/* 현재 쌓여있는 레고 블록 리스트 */}
          <div className="space-y-1.5 max-h-[320px] overflow-y-auto pr-1 custom-scrollbar">
            {legoBlocks.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-950/60 rounded-xl border border-slate-800">
                쌓여있는 레고 블록이 없습니다. 아래 컴포넌트를 추가하세요.
              </div>
            ) : (
              legoBlocks.map((block, idx) => (
                <div 
                  key={block.instanceId}
                  className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 flex items-center justify-between gap-2 shadow-sm"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-400 font-mono text-[10px] font-black flex items-center justify-center shrink-0 border border-emerald-500/30">
                      {idx + 1}
                    </span>
                    <span className="text-xs font-bold text-slate-200 truncate max-w-[150px]">
                      {block.koreanName}
                    </span>
                    {renderAnchorBadge(block.focalAnchor)}
                  </div>

                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      onClick={() => onMoveLegoBlock?.(block.instanceId, 'up')}
                      disabled={idx === 0}
                      className={`p-1 rounded ${idx === 0 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                      title="위로 이동"
                    >
                      <ArrowUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onMoveLegoBlock?.(block.instanceId, 'down')}
                      disabled={idx === legoBlocks.length - 1}
                      className={`p-1 rounded ${idx === legoBlocks.length - 1 ? 'text-slate-700 cursor-not-allowed' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
                      title="아래로 이동"
                    >
                      <ArrowDown className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onRemoveLegoBlock?.(block.instanceId)}
                      className="p-1 rounded text-slate-500 hover:text-red-400 hover:bg-red-500/10 ml-0.5"
                      title="삭제"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* 블록 추가 퀵 버튼 */}
          {onOpenLegoStackerModal && (
            <button
              onClick={onOpenLegoStackerModal}
              className="w-full py-2.5 rounded-xl border border-dashed border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>+ 새 레고 블록 라이브러리에서 추가하기</span>
            </button>
          )}
        </div>
      )}

      {/* =========================================================================
          모드 2: ⚡ 추천 번들 & 4단 슬롯 (클래식 뷰)
          ========================================================================= */}
      {combinatorMode === 'classic' && (
        <div className="space-y-3">
          {/* 디자인 주도권 (Focal Anchor) 필터 바 */}
          <div className="bg-slate-900/90 p-2 rounded-xl border border-slate-800 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] px-1">
              <span className="font-bold text-slate-300 flex items-center gap-1">
                <Filter className="w-3 h-3 text-emerald-400" /> 중심 축 (Focal Anchor)
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {filteredComponents.length}개 컴포넌트
              </span>
            </div>
            <div className="grid grid-cols-6 gap-1 text-[10px]">
              {[
                { id: 'all' as FocalAnchor, label: '전체' },
                { id: 'visual' as FocalAnchor, label: '📸 사진' },
                { id: 'video' as FocalAnchor, label: '🎥 영상' },
                { id: 'typo' as FocalAnchor, label: '🔤 타이포' },
                { id: 'data' as FocalAnchor, label: '📊 데이터' },
                { id: 'hybrid' as FocalAnchor, label: '🔀 복합' },
              ].map(f => {
                const isSelected = focalFilter === f.id;
                return (
                  <button
                    key={f.id}
                    onClick={() => setFocalFilter(f.id)}
                    className={`py-1 rounded-lg font-bold transition text-center truncate ${
                      isSelected
                        ? 'bg-emerald-500 text-slate-950 font-black shadow'
                        : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800/80'
                    }`}
                  >
                    {f.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 도메인 맞춤형 탭 스위처 */}
          <div className="grid grid-cols-5 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[10px] font-bold">
            {tabConfig.map(tab => {
              const Icon = tab.icon;
              const isSelected = subTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSubTab(tab.id)}
                  className={`py-1.5 px-1 rounded-lg flex flex-col items-center justify-center gap-0.5 transition ${
                    isSelected
                      ? 'bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span className="truncate w-full text-center">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* 슬롯 탭별 컴포넌트 목록 */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
            {subTab === 'bundles' && (
              <div className="space-y-2">
                {activeBundles.map(b => (
                  <div
                    key={b.id}
                    onClick={() => onApplyBundle(b)}
                    className="p-3 rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-800/80 hover:border-emerald-500/60 cursor-pointer transition flex flex-col gap-1.5 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{b.icon}</span>
                        <h4 className="text-xs font-bold text-white group-hover:text-emerald-400 transition">
                          {b.koreanName}
                        </h4>
                      </div>
                      {renderAnchorBadge(b.focalAnchor)}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {b.description}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {subTab === 'slot1' && (
              <div className="space-y-2">
                {slot1Options.map(item => (
                  <div
                    key={item.id}
                    onClick={() => onSelectNav(item)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex flex-col gap-1.5 ${
                      selectedNav?.id === item.id
                        ? 'bg-slate-800 border-emerald-500 ring-1 ring-emerald-500/40'
                        : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-100">{item.koreanName}</h4>
                      {renderAnchorBadge(item.focalAnchor)}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            )}

            {subTab === 'slot2' && (
              <div className="space-y-2">
                {slot2Options.map(item => (
                  <div
                    key={item.id}
                    onClick={() => onSelectMainDeck(item)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex flex-col gap-1.5 ${
                      selectedMainDeck?.id === item.id
                        ? 'bg-slate-800 border-emerald-500 ring-1 ring-emerald-500/40'
                        : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-100">{item.koreanName}</h4>
                      {renderAnchorBadge(item.focalAnchor)}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            )}

            {subTab === 'slot3' && (
              <div className="space-y-2">
                {slot3Options.map(item => (
                  <div
                    key={item.id}
                    onClick={() => onSelectMetric(item)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex flex-col gap-1.5 ${
                      selectedMetric?.id === item.id
                        ? 'bg-slate-800 border-emerald-500 ring-1 ring-emerald-500/40'
                        : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-100">{item.koreanName}</h4>
                      {renderAnchorBadge(item.focalAnchor)}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            )}

            {subTab === 'slot4' && (
              <div className="space-y-2">
                {slot4Options.map(item => (
                  <div
                    key={item.id}
                    onClick={() => onSelectFooter(item)}
                    className={`p-3 rounded-xl border cursor-pointer transition flex flex-col gap-1.5 ${
                      selectedFooter?.id === item.id
                        ? 'bg-slate-800 border-emerald-500 ring-1 ring-emerald-500/40'
                        : 'bg-slate-900/50 hover:bg-slate-800/60 border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-100">{item.koreanName}</h4>
                      {renderAnchorBadge(item.focalAnchor)}
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
