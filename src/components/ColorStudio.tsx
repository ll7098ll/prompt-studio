'use client';

import React, { useState } from 'react';
import { ColorThemeOption, COLOR_THEMES } from '@/data/design-options';
import { 
  HarmonyMode, 
  generateHarmonyPalette, 
  CURATED_SEED_COLORS, 
  getContrastRatio, 
  hslToHex 
} from '@/lib/color-harmony';
import { 
  Palette, Sliders, Dices, Sparkles, Check, 
  Sun, Moon, ShieldCheck, Wand2 
} from 'lucide-react';

interface ColorStudioProps {
  selectedColorTheme: ColorThemeOption;
  onSelectColorTheme: (theme: ColorThemeOption) => void;
}

export default function ColorStudio({
  selectedColorTheme,
  onSelectColorTheme,
}: ColorStudioProps) {
  // 모드: 'harmony' (색채학 조화 추천) | 'custom' (직접 조합) | 'preset' (큐레이션 프리셋)
  const [colorMode, setColorMode] = useState<'harmony' | 'custom' | 'preset'>('harmony');

  // 1. 색채학 조화 상태
  const [seedColor, setSeedColor] = useState<string>(selectedColorTheme.tokens.accent || '#22C55E');
  const [harmonyMode, setHarmonyMode] = useState<HarmonyMode>('triadic');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');

  // 2. 직접 커스텀 상태
  const [customTokens, setCustomTokens] = useState({
    bg: selectedColorTheme.tokens.bg,
    cardBg: selectedColorTheme.tokens.cardBg,
    cardBorder: selectedColorTheme.tokens.cardBorder,
    accent: selectedColorTheme.tokens.accent,
    accentSecondary: selectedColorTheme.tokens.accentSecondary,
    textPrimary: selectedColorTheme.tokens.textPrimary,
    textSecondary: selectedColorTheme.tokens.textSecondary,
  });

  // 색채학 조화 모드 계산
  const generatedTokens = React.useMemo(() => {
    return generateHarmonyPalette(seedColor, harmonyMode, themeMode);
  }, [seedColor, harmonyMode, themeMode]);

  // 실시간 대비율 (텍스트 vs 배경)
  const contrastRatio = React.useMemo(() => {
    return getContrastRatio(selectedColorTheme.tokens.textPrimary, selectedColorTheme.tokens.bg);
  }, [selectedColorTheme.tokens.textPrimary, selectedColorTheme.tokens.bg]);

  // 색채학 조화 팔레트 즉시 적용 함수
  const applyHarmony = (
    seed: string = seedColor,
    hMode: HarmonyMode = harmonyMode,
    tMode: 'dark' | 'light' = themeMode
  ) => {
    const modeNames: Record<HarmonyMode, string> = {
      'complementary': '보색 조화 (Complementary)',
      'analogous': '유사색 조화 (Analogous)',
      'triadic': '3분할 조화 (Triadic)',
      'split-complementary': '분할 보색 (Split-Comp)',
      'monochromatic': '단색 톤온톤 (Monochrome)',
    };

    const tokens = generateHarmonyPalette(seed, hMode, tMode);
    const newTheme: ColorThemeOption = {
      id: `harmony-${Date.now()}`,
      name: `Adobe Harmony (${modeNames[hMode]})`,
      koreanName: `🎨 ${modeNames[hMode].split(' ')[0]} 추천 테마`,
      mood: `${seed} 중심의 ${hMode} 색채학 공식 적용`,
      harmonyMode: modeNames[hMode],
      tokens,
    };
    onSelectColorTheme(newTheme);
  };

  const handleApplyHarmony = () => {
    applyHarmony(seedColor, harmonyMode, themeMode);
  };

  // 랜덤 매직 셔플 (주사위)
  const handleMagicShuffle = () => {
    const randomHue = Math.floor(Math.random() * 360);
    const newSeed = hslToHex({ h: randomHue, s: 80, l: 55 });
    const modes: HarmonyMode[] = ['complementary', 'analogous', 'triadic', 'split-complementary'];
    const randomMode = modes[Math.floor(Math.random() * modes.length)];
    
    setSeedColor(newSeed);
    setHarmonyMode(randomMode);

    const generated = generateHarmonyPalette(newSeed, randomMode, themeMode);
    const modeNames: Record<HarmonyMode, string> = {
      'complementary': '보색 조화 (Complementary)',
      'analogous': '유사색 조화 (Analogous)',
      'triadic': '3분할 조화 (Triadic)',
      'split-complementary': '분할 보색 (Split-Comp)',
      'monochromatic': '단색 톤온톤 (Monochrome)',
    };

    onSelectColorTheme({
      id: `shuffle-${Date.now()}`,
      name: `Magic Harmony (${modeNames[randomMode]})`,
      koreanName: `🎲 매직 추천 (${modeNames[randomMode].split(' ')[0]})`,
      mood: 'AI 매직 색채학 랜덤 조합',
      harmonyMode: modeNames[randomMode],
      tokens: generated,
    });
  };

  // 커스텀 색상 실시간 업데이트
  const handleCustomChange = (key: keyof typeof customTokens, value: string) => {
    const updated = { ...customTokens, [key]: value };
    setCustomTokens(updated);

    onSelectColorTheme({
      id: 'custom-palette',
      name: 'Custom User Palette',
      koreanName: '🎛️ 사용자 직접 조합 테마',
      mood: '사용자가 직접 조율한 커스텀 토큰',
      tokens: {
        ...updated,
        badgeBg: `${updated.accent}26`,
        badgeText: updated.accent,
      },
    });
  };

  return (
    <div className="space-y-3">
      {/* 1. 상단 서브모드 스위처 (색채학 추천 / 직접 조합 / 큐레이션 프리셋) */}
      <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-bold">
        <button
          onClick={() => setColorMode('harmony')}
          className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition ${
            colorMode === 'harmony'
              ? 'bg-emerald-500 text-slate-950 font-black shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Wand2 className="w-3 h-3" />
          <span>색채학 추천</span>
        </button>

        <button
          onClick={() => setColorMode('custom')}
          className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition ${
            colorMode === 'custom'
              ? 'bg-emerald-500 text-slate-950 font-black shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sliders className="w-3 h-3" />
          <span>직접 조합</span>
        </button>

        <button
          onClick={() => setColorMode('preset')}
          className={`py-1.5 rounded-lg flex items-center justify-center gap-1 transition ${
            colorMode === 'preset'
              ? 'bg-emerald-500 text-slate-950 font-black shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="w-3 h-3" />
          <span>프리셋 (12)</span>
        </button>
      </div>

      {/* 대비율 인디케이터 배너 */}
      <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-[11px]">
        <span className="text-slate-400 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          가독성 명도 대비율
        </span>
        <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
          {contrastRatio}:1 (WCAG {contrastRatio >= 7 ? 'AAA Pass' : contrastRatio >= 4.5 ? 'AA Pass' : 'Caution'})
        </span>
      </div>

      {/* =========================================================================
          모드 1: 🎨 어도비 CC 스타일 색채학 조화 추천 (Adobe Color Harmony)
          ========================================================================= */}
      {colorMode === 'harmony' && (
        <div className="space-y-3.5 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              키 컬러 기반 색채학 자동 연산
            </span>
            <button
              onClick={handleMagicShuffle}
              className="text-[10px] font-bold flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 transition"
              title="색채학 공식 기반 랜덤 셔플"
            >
              <Dices className="w-3.5 h-3.5" />
              <span>랜덤 셔플</span>
            </button>
          </div>

          {/* 1) 추천 키 컬러 칩 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>원하는 중심 컬러(Seed) 선택:</span>
              <div className="flex items-center gap-1.5 font-mono text-[10px]">
                <span>{seedColor.toUpperCase()}</span>
                <input
                  type="color"
                  value={seedColor}
                  onChange={(e) => {
                    setSeedColor(e.target.value);
                    applyHarmony(e.target.value, harmonyMode, themeMode);
                  }}
                  className="w-5 h-5 rounded cursor-pointer border border-slate-700 bg-transparent"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-1.5">
              {CURATED_SEED_COLORS.map(c => (
                <button
                  key={c.hex}
                  onClick={() => {
                    setSeedColor(c.hex);
                    applyHarmony(c.hex, harmonyMode, themeMode);
                  }}
                  className={`h-7 rounded-lg border flex items-center justify-center text-[10px] font-bold transition-all relative ${
                    seedColor.toUpperCase() === c.hex.toUpperCase()
                      ? 'border-white ring-2 ring-emerald-500 scale-[1.03]'
                      : 'border-white/10 hover:border-white/40'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={`${c.name} (${c.mood})`}
                >
                  {seedColor.toUpperCase() === c.hex.toUpperCase() && (
                    <Check className="w-3.5 h-3.5 text-slate-950 font-black" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* 2) 색채학 하모니 공식 선택 */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 block font-semibold">
              색채학 조화 공식 (Harmony Mode):
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-[11px]">
              {[
                { id: 'triadic', label: '🔺 3분할 (Triadic)', desc: '120° 균형 3색' },
                { id: 'complementary', label: '🔄 보색 (Contrast)', desc: '180° 강렬한 주목' },
                { id: 'analogous', label: '🌿 유사색 (Analogous)', desc: '±35° 편안한 조화' },
                { id: 'split-complementary', label: '✂️ 분할보색 (Split)', desc: '150° 세련된 대비' },
                { id: 'monochromatic', label: '🧊 단색 (Monochrome)', desc: '톤온톤 명도 계조' },
              ].map(h => (
                <button
                  key={h.id}
                  onClick={() => {
                    const newMode = h.id as HarmonyMode;
                    setHarmonyMode(newMode);
                    applyHarmony(seedColor, newMode, themeMode);
                  }}
                  className={`p-2 rounded-lg border text-left transition ${
                    harmonyMode === h.id
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500 font-bold'
                      : 'bg-slate-800/40 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold text-[11px]">{h.label}</div>
                  <div className="text-[9px] opacity-70">{h.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3) 캔버스 무드 (다크 vs 라이트) */}
          <div className="flex items-center justify-between text-[11px] pt-1">
            <span className="text-slate-400 font-semibold">캔버스 기본 배경:</span>
            <div className="flex gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => {
                  setThemeMode('dark');
                  applyHarmony(seedColor, harmonyMode, 'dark');
                }}
                className={`px-2.5 py-1 rounded flex items-center gap-1 text-[10px] font-bold ${
                  themeMode === 'dark' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400'
                }`}
              >
                <Moon className="w-3 h-3" />
                <span>딥 다크</span>
              </button>
              <button
                onClick={() => {
                  setThemeMode('light');
                  applyHarmony(seedColor, harmonyMode, 'light');
                }}
                className={`px-2.5 py-1 rounded flex items-center gap-1 text-[10px] font-bold ${
                  themeMode === 'light' ? 'bg-slate-200 text-slate-950' : 'text-slate-400'
                }`}
              >
                <Sun className="w-3 h-3" />
                <span>클린 라이트</span>
              </button>
            </div>
          </div>

          {/* 4) 계산된 5색 팔레트 프리뷰 칩 & 원클릭 적용 */}
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-[10px] text-slate-400">
              <span>연산된 5대 디자인 토큰:</span>
              <span className="font-mono text-emerald-400">Ready to Apply</span>
            </div>

            <div className="flex items-center gap-1 h-8 rounded-lg overflow-hidden border border-slate-700">
              <div 
                className="flex-1 h-full flex items-center justify-center text-[8px] font-mono font-bold text-white shadow-inner"
                style={{ backgroundColor: generatedTokens.bg }}
                title={`Background: ${generatedTokens.bg}`}
              >
                BG
              </div>
              <div 
                className="flex-1 h-full flex items-center justify-center text-[8px] font-mono font-bold text-white shadow-inner"
                style={{ backgroundColor: generatedTokens.cardBg }}
                title={`Card Surface: ${generatedTokens.cardBg}`}
              >
                Card
              </div>
              <div 
                className="flex-1 h-full flex items-center justify-center text-[8px] font-mono font-bold text-slate-950 shadow-inner"
                style={{ backgroundColor: generatedTokens.accent }}
                title={`Accent 1: ${generatedTokens.accent}`}
              >
                Acc1
              </div>
              <div 
                className="flex-1 h-full flex items-center justify-center text-[8px] font-mono font-bold text-slate-950 shadow-inner"
                style={{ backgroundColor: generatedTokens.accentSecondary }}
                title={`Accent 2: ${generatedTokens.accentSecondary}`}
              >
                Acc2
              </div>
              <div 
                className="flex-1 h-full flex items-center justify-center text-[8px] font-mono font-bold text-slate-950 shadow-inner"
                style={{ backgroundColor: generatedTokens.textPrimary }}
                title={`Primary Text: ${generatedTokens.textPrimary}`}
              >
                Text
              </div>
            </div>

            <button
              onClick={handleApplyHarmony}
              className="w-full py-2 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold text-xs flex items-center justify-center gap-1.5 transition shadow"
            >
              <Check className="w-3.5 h-3.5" />
              <span>✓ 실시간 라이브 캔버스에 100% 자동 반영 중</span>
            </button>
          </div>
        </div>
      )}

      {/* =========================================================================
          모드 2: 🎛️ 사용자 직접 커스텀 조합 (Custom Mixer)
          ========================================================================= */}
      {colorMode === 'custom' && (
        <div className="space-y-2.5 bg-slate-900/50 p-3.5 rounded-xl border border-slate-800">
          <span className="text-xs font-bold text-white flex items-center gap-1.5 mb-1">
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            5대 컬러 토큰 직접 튜닝
          </span>

          {[
            { key: 'bg', label: '캔버스 배경색 (BG)', value: customTokens.bg },
            { key: 'cardBg', label: '카드 서피스색 (Card)', value: customTokens.cardBg },
            { key: 'accent', label: '1차 메인 포인트 (Accent 1)', value: customTokens.accent },
            { key: 'accentSecondary', label: '2차 서브 포인트 (Accent 2)', value: customTokens.accentSecondary },
            { key: 'textPrimary', label: '주요 텍스트 컬러 (Text)', value: customTokens.textPrimary },
          ].map(tok => (
            <div key={tok.key} className="flex items-center justify-between p-2 rounded-lg bg-slate-950 border border-slate-800 text-xs">
              <span className="text-slate-300 font-medium text-[11px]">{tok.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-slate-400">{tok.value}</span>
                <input
                  type="color"
                  value={tok.value}
                  onChange={(e) => handleCustomChange(tok.key as keyof typeof customTokens, e.target.value)}
                  className="w-6 h-6 rounded cursor-pointer border border-slate-700 bg-transparent"
                />
              </div>
            </div>
          ))}

          <div className="text-[10px] text-slate-400 pt-1">
            * 색상을 변경하면 중앙 캔버스와 우측 프롬프트 사양서에 실시간 반영됩니다.
          </div>
        </div>
      )}

      {/* =========================================================================
          모드 3: 🌟 12대 디자이너 큐레이션 프리셋 (Curated Presets)
          ========================================================================= */}
      {colorMode === 'preset' && (
        <div className="space-y-2 max-h-[calc(100vh-340px)] overflow-y-auto pr-1">
          {COLOR_THEMES.map(ct => {
            const isSelected = ct.id === selectedColorTheme.id;
            return (
              <div
                key={ct.id}
                onClick={() => onSelectColorTheme(ct)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col gap-2 relative ${
                  isSelected
                    ? 'bg-slate-800 border-emerald-500 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/50'
                    : 'bg-slate-800/40 hover:bg-slate-800/80 border-slate-700/60 hover:border-slate-600'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                    {ct.koreanName}
                  </h3>
                  {isSelected && (
                    <span className="text-[9px] font-bold text-slate-950 bg-emerald-400 px-2 py-0.5 rounded-full">
                      선택됨
                    </span>
                  )}
                </div>

                <div className="text-[10px] text-slate-400">
                  무드: {ct.mood}
                </div>

                {/* 4종 컬러 칩 */}
                <div className="flex items-center gap-1.5 pt-0.5">
                  <div 
                    className="flex-1 h-5 rounded border border-white/20 flex items-center justify-center text-[7px] font-mono font-bold text-white shadow-inner"
                    style={{ backgroundColor: ct.tokens.bg }}
                    title={`BG: ${ct.tokens.bg}`}
                  >
                    BG
                  </div>
                  <div 
                    className="flex-1 h-5 rounded border border-white/20 flex items-center justify-center text-[7px] font-mono font-bold text-white shadow-inner"
                    style={{ backgroundColor: ct.tokens.cardBg }}
                    title={`Card: ${ct.tokens.cardBg}`}
                  >
                    Card
                  </div>
                  <div 
                    className="flex-1 h-5 rounded border border-white/20 flex items-center justify-center text-[7px] font-mono font-bold text-slate-950 shadow-inner"
                    style={{ backgroundColor: ct.tokens.accent }}
                    title={`Accent: ${ct.tokens.accent}`}
                  >
                    Acc
                  </div>
                  <div 
                    className="flex-1 h-5 rounded border border-white/20 flex items-center justify-center text-[7px] font-mono font-bold text-slate-950 shadow-inner"
                    style={{ backgroundColor: ct.tokens.accentSecondary }}
                    title={`Sec: ${ct.tokens.accentSecondary}`}
                  >
                    Sec
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
