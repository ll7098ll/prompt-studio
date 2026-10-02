'use client';

import React, { useState } from 'react';
import { LegoBlockItem, LayoutPreset } from '@/data/component-presets';
import { VisualStyleOption, ColorThemeOption, TypographyOption } from '@/data/design-options';
import { serializeStudioDocument } from '@/studio/document';
import type { StudioDocument } from '@/studio/types';
import { X, Copy, Check, Code, Terminal, Sparkles, FileJson } from 'lucide-react';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  blueprint: StudioDocument;
  legoBlocks: LegoBlockItem[];
  style: VisualStyleOption;
  colorTheme: ColorThemeOption;
  typography: TypographyOption;
  headline?: string;
  layoutPreset?: LayoutPreset;
}

export default function CodeExportModal({
  isOpen,
  onClose,
  blueprint,
  legoBlocks,
  style,
  colorTheme,
  typography,
  headline = '차세대 생성형 UI/UX 디자인 아키텍처',
  layoutPreset = 'landing',
}: CodeExportModalProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'react' | 'html' | 'tokens' | 'blueprint'>('react');

  if (!isOpen) return null;

  // React JSX 코드 생성
  const generateReactCode = () => {
    const sidebarBlocks = legoBlocks.filter(b => (b.targetSlot || b.category) === 'sidebar');
    const mainBlocks = legoBlocks.filter(b => {
      const slot = b.targetSlot || b.category;
      return !['header', 'sidebar', 'aside', 'footer'].includes(slot);
    });

    const getColClass = (span?: string) => {
      if (span === 'half') return 'col-span-12 md:col-span-6';
      if (span === 'third') return 'col-span-12 md:col-span-4';
      if (span === 'two-thirds') return 'col-span-12 md:col-span-8';
      return 'col-span-12';
    };

    if (layoutPreset === 'sidebar_main') {
      return `import React from 'react';

// Layout: SaaS Dashboard (Left Sidebar + Main Grid)
// Style: ${style.koreanName} | Theme: ${colorTheme.koreanName}
// Fonts: Headline(${typography.headlineFont}), Body(${typography.bodyFont})

export default function SaaSApp() {
  return (
    <div 
      className="min-h-screen text-slate-100 flex flex-col"
      style={{ backgroundColor: '${colorTheme.tokens.bg}', fontFamily: '${typography.bodyFont}' }}
    >
      {/* 1. Header Bar */}
      <header className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <span className="font-bold text-sm tracking-tight text-[${colorTheme.tokens.accent}]">CORE//STUDIO</span>
        <span className="text-xs text-slate-400">${headline}</span>
      </header>

      {/* 2. Workspace Body (Sidebar + Main Content) */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Left Sidebar */}
        <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-slate-800 p-4 space-y-4 bg-slate-950/40">
${sidebarBlocks.map(b => `          {/* 📂 ${b.koreanName} */}\n          <div className="p-3 rounded-xl border border-slate-800">\n            <span className="text-xs font-bold">${b.koreanName}</span>\n          </div>`).join('\n')}
        </aside>

        {/* Main Content Grid */}
        <main className="flex-1 p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
${mainBlocks.map(b => `            <section className="${getColClass(b.colSpan)} p-6 rounded-2xl border border-slate-800 bg-slate-900/60">\n              <h3 className="text-lg font-bold">${b.koreanName}</h3>\n              <p className="text-xs text-slate-400 mt-1">${b.description}</p>\n            </section>`).join('\n\n')}
          </div>
        </main>
      </div>

      {/* 3. Footer */}
      <footer className="py-4 px-6 border-t border-slate-800 text-xs text-slate-500 font-mono flex justify-between">
        <span>© 2026 CORE STUDIO</span>
        <span>LATENCY: 12ms</span>
      </footer>
    </div>
  );
}`;
    }

    if (layoutPreset === 'holy_grail') {
      return `import React from 'react';

// Layout: 3-Column Holy Grail (Sidebar + Center Feed + Right Aside)
// Style: ${style.koreanName} | Theme: ${colorTheme.koreanName}

export default function HolyGrailApp() {
  return (
    <div 
      className="min-h-screen text-slate-100 flex flex-col"
      style={{ backgroundColor: '${colorTheme.tokens.bg}', fontFamily: '${typography.bodyFont}' }}
    >
      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Left Navigation */}
        <aside className="w-full lg:w-60 border-r border-slate-800 p-4">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Navigation</span>
        </aside>

        {/* Center Main Feed */}
        <main className="flex-1 p-6 space-y-6">
${mainBlocks.map(b => `          <section className="p-6 rounded-2xl border border-slate-800 bg-slate-900/60">\n            <h3 className="text-lg font-bold">${b.koreanName}</h3>\n          </section>`).join('\n')}
        </main>

        {/* Right Inspector Aside */}
        <aside className="w-full lg:w-72 border-l border-slate-800 p-4 space-y-4 bg-slate-950/40">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Inspector</span>
        </aside>
      </div>
    </div>
  );
}`;
    }

    // Default: Landing
    const blockNames = legoBlocks.map(b => `      {/* 🧱 ${b.koreanName} (${b.targetSlot || b.category}) */}\n      <section className="py-12 border-b border-slate-800">\n        <div className="max-w-6xl mx-auto px-4">\n          <span className="text-xs font-mono text-[${colorTheme.tokens.accent}] uppercase">${b.focalAnchor} SECTION</span>\n          <h3 className="text-2xl font-bold mt-1">${b.koreanName}</h3>\n          <p className="text-sm text-slate-400 mt-2">${b.description}</p>\n        </div>\n      </section>`).join('\n\n');

    return `import React from 'react';

// Design Tokens: ${style.koreanName} + ${colorTheme.koreanName}
// Typography: Headline(${typography.headlineFont}), Body(${typography.bodyFont})

export default function GeneratedLandingPage() {
  return (
    <div 
      className="min-h-screen text-slate-100"
      style={{
        backgroundColor: '${colorTheme.tokens.bg}',
        fontFamily: '${typography.bodyFont}',
      }}
    >
      <header className="pt-20 pb-12 text-center max-w-4xl mx-auto px-4">
        <h1 
          className="text-4xl md:text-6xl font-black tracking-tight leading-tight"
          style={{ fontFamily: '${typography.headlineFont}', color: '${colorTheme.tokens.textPrimary}' }}
        >
          ${headline}
        </h1>
        <p className="mt-4 text-base md:text-lg text-slate-400">
          ${style.koreanName} 감성의 모듈러 UI/UX 아키텍처
        </p>
      </header>

${blockNames}

      <footer className="py-8 text-center text-xs text-slate-500 font-mono">
        © 2026 CORE UI/UX STUDIO. Generated with Antigravity.
      </footer>
    </div>
  );
}`;
  };

  // HTML + Tailwind 코드 생성
  const generateHtmlCode = () => {
    const blockHtml = legoBlocks.map((b, i) => `    <!-- Block ${i + 1}: ${b.koreanName} [Slot: ${b.targetSlot || 'main'}] -->\n    <section class="py-12 border-b border-slate-800">\n      <div class="max-w-6xl mx-auto px-4">\n        <span class="text-xs font-mono uppercase text-emerald-400">${b.focalAnchor}</span>\n        <h2 class="text-2xl font-bold text-white mt-1">${b.koreanName}</h2>\n        <p class="text-slate-400 text-sm mt-2">${b.description}</p>\n      </div>\n    </section>`).join('\n\n');

    return `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${headline}</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-950 text-slate-100 min-h-screen">
  <div class="max-w-5xl mx-auto px-4 py-16 text-center">
    <h1 class="text-4xl md:text-6xl font-black tracking-tight text-white">${headline}</h1>
    <p class="text-slate-400 text-sm mt-2 font-mono">Layout: ${layoutPreset}</p>
  </div>

  <!-- Modular Sections -->
${blockHtml}
</body>
</html>`;
  };

  // 디자인 토큰 JSON 생성
  const generateTokensJson = () => {
    return JSON.stringify({
      designSystem: {
        style: style.koreanName,
        styleId: style.id,
        category: style.category,
        borderRadius: style.defaultBorderRadius,
        shadow: style.shadowType,
      },
      colorTokens: {
        themeName: colorTheme.koreanName,
        accent: colorTheme.tokens.accent,
        bg: colorTheme.tokens.bg,
        surface: colorTheme.tokens.cardBg,
        border: colorTheme.tokens.cardBorder,
        textPrimary: colorTheme.tokens.textPrimary,
        textSecondary: colorTheme.tokens.textSecondary,
      },
      typography: {
        name: typography.koreanName,
        headlineFont: typography.headlineFont,
        bodyFont: typography.bodyFont,
        category: typography.category,
      },
      stackedBlocks: legoBlocks.map((b, idx) => ({
        order: idx + 1,
        componentId: b.componentId,
        koreanName: b.koreanName,
        focalAnchor: b.focalAnchor,
        category: b.category,
      })),
    }, null, 2);
  };

  const currentCode = activeTab === 'react'
    ? generateReactCode()
    : activeTab === 'html'
      ? generateHtmlCode()
      : activeTab === 'tokens'
        ? generateTokensJson()
        : serializeStudioDocument(blueprint);

  const handleCopy = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl max-h-[88vh] flex flex-col rounded-3xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="p-4 md:p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Code className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                <span>UI/UX 코드 & 디자인 토큰 내보내기</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {legoBlocks.length}개 블록 조립됨
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                조합된 컴포넌트 스택과 디자인 토큰을 바로 프로젝트에 적용할 수 있는 코드로 변환합니다.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 탭 & 복사 툴바 */}
        <div className="px-4 py-2.5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setActiveTab('react')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'react'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>React (JSX + Tailwind)</span>
            </button>
            <button
              onClick={() => setActiveTab('html')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'html'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>HTML5 (Tailwind CDN)</span>
            </button>
            <button
              onClick={() => setActiveTab('tokens')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'tokens'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>디자인 토큰 (JSON)</span>
            </button>
            <button
              onClick={() => setActiveTab('blueprint')}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
                activeTab === 'blueprint'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileJson className="w-3.5 h-3.5" />
              <span>UI Blueprint</span>
            </button>
          </div>

          <button
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 border border-emerald-500/40 text-xs font-bold transition flex items-center gap-1.5 active:scale-95 shadow"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '복사 완료!' : '코드 전체 복사'}</span>
          </button>
        </div>

        {/* 코드 프리뷰 에디터 */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-emerald-300/90 leading-relaxed custom-scrollbar">
          <pre className="whitespace-pre">{currentCode}</pre>
        </div>

        {/* 풋터 */}
        <div className="p-3 px-5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Tailwind CSS v3/v4 & React 18/19 완벽 호환</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold transition"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
