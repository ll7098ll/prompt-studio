'use client';

import React from 'react';
import { GridGeometry } from '@/data/layout-references';

interface WireframePreviewProps {
  geometry: GridGeometry;
  wireframeShape?: string;
  className?: string;
  active?: boolean;
}

export default function WireframePreview({
  geometry,
  wireframeShape = '',
  className = '',
  active = false
}: WireframePreviewProps) {
  const borderCol = active ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-700 bg-slate-900/60';
  const blockCol = active ? 'bg-emerald-400' : 'bg-slate-600';
  const subBlockCol = active ? 'bg-emerald-500/40' : 'bg-slate-700/80';
  const accentBlockCol = active ? 'bg-emerald-300' : 'bg-indigo-400';

  // Render miniature visual layout blueprint (48px height)
  return (
    <div 
      className={`w-full h-14 rounded-lg border p-1.5 flex items-center justify-center overflow-hidden transition-all duration-200 select-none ${borderCol} ${className}`}
    >
      {/* 1. Bento 12-col or Bento Asymmetric */}
      {(geometry === 'bento-12col' || geometry === 'bento-asymmetric' || wireframeShape.includes('bento-12col')) && (
        <div className="w-full h-full grid grid-cols-12 gap-1">
          <div className={`col-span-8 rounded ${subBlockCol} flex flex-col justify-between p-1`}>
            <div className={`w-3/4 h-1 rounded-sm ${blockCol}`} />
            <div className={`w-1/2 h-1 rounded-sm ${subBlockCol}`} />
          </div>
          <div className={`col-span-4 rounded ${accentBlockCol} flex items-center justify-center`}>
            <div className="w-2 h-2 rounded-full bg-white/60" />
          </div>
          <div className={`col-span-4 rounded ${subBlockCol}`} />
          <div className={`col-span-4 rounded ${subBlockCol}`} />
          <div className={`col-span-4 rounded ${subBlockCol}`} />
        </div>
      )}

      {/* 2. Bento 3-col / Masonry */}
      {(geometry === 'bento-3col' || geometry === 'masonry-3col' || geometry === 'masonry-4col') && (
        <div className="w-full h-full grid grid-cols-3 gap-1">
          <div className={`h-full rounded ${subBlockCol} p-1 flex flex-col gap-0.5`}>
            <div className={`w-full h-1 rounded-sm ${blockCol}`} />
            <div className={`w-2/3 h-1 rounded-sm ${subBlockCol}`} />
          </div>
          <div className={`h-full rounded ${accentBlockCol} flex items-center justify-center`}>
            <div className="w-2 h-2 rounded-full bg-white/70" />
          </div>
          <div className={`h-full rounded ${subBlockCol} p-1 flex flex-col gap-0.5`}>
            <div className={`w-full h-1 rounded-sm ${blockCol}`} />
            <div className={`w-1/2 h-1 rounded-sm ${subBlockCol}`} />
          </div>
        </div>
      )}

      {/* 3. Split 50:50 */}
      {(geometry === 'split-50-50' || wireframeShape.includes('split-50-50')) && (
        <div className="w-full h-full grid grid-cols-2 gap-1.5 items-center">
          <div className="flex flex-col gap-1 p-0.5">
            <div className={`w-4/5 h-1.5 rounded-sm ${blockCol}`} />
            <div className={`w-full h-1 rounded-sm ${subBlockCol}`} />
            <div className={`w-1/2 h-1.5 rounded ${accentBlockCol}`} />
          </div>
          <div className={`w-full h-full rounded border border-dashed border-slate-600 ${subBlockCol} flex items-center justify-center`}>
            <div className="w-3 h-3 rounded bg-white/20" />
          </div>
        </div>
      )}

      {/* 4. Split 70:30 or 60:40 */}
      {(geometry === 'split-70-30' || geometry === 'split-60-40') && (
        <div className="w-full h-full grid grid-cols-10 gap-1.5 items-center">
          <div className="col-span-7 flex flex-col gap-1 p-0.5">
            <div className={`w-3/4 h-1.5 rounded-sm ${blockCol}`} />
            <div className={`w-full h-1 rounded-sm ${subBlockCol}`} />
            <div className={`w-1/3 h-1.5 rounded ${accentBlockCol}`} />
          </div>
          <div className={`col-span-3 h-full rounded ${accentBlockCol} flex items-center justify-center`}>
            <div className="w-2 h-2 rounded-full bg-white/60" />
          </div>
        </div>
      )}

      {/* 5. Terminal Window */}
      {(geometry === 'terminal-window' || wireframeShape.includes('terminal')) && (
        <div className="w-full h-full rounded border border-slate-700 bg-slate-950 p-1 flex flex-col justify-between font-mono">
          <div className="flex items-center gap-0.5 pb-0.5 border-b border-slate-800">
            <div className="w-1 h-1 rounded-full bg-red-400" />
            <div className="w-1 h-1 rounded-full bg-yellow-400" />
            <div className="w-1 h-1 rounded-full bg-green-400" />
          </div>
          <div className="space-y-0.5">
            <div className={`w-2/3 h-1 rounded-sm ${blockCol}`} />
            <div className={`w-1/2 h-0.5 rounded-sm ${subBlockCol}`} />
          </div>
        </div>
      )}

      {/* 6. Comparison Slider */}
      {(geometry === 'comparison-slider' || wireframeShape.includes('slider')) && (
        <div className="w-full h-full relative rounded overflow-hidden flex items-center">
          <div className={`w-1/2 h-full ${subBlockCol} border-r-2 border-emerald-400 flex items-center justify-center`}>
            <span className="text-[7px] font-mono text-slate-300">OLD</span>
          </div>
          <div className={`w-1/2 h-full ${accentBlockCol} flex items-center justify-center`}>
            <span className="text-[7px] font-mono text-white font-bold">NEW</span>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow" />
        </div>
      )}

      {/* 7. Floating Dock */}
      {(geometry === 'floating-dock' || wireframeShape.includes('dock')) && (
        <div className="w-full h-full flex flex-col justify-between items-center py-0.5">
          <div className={`w-2/3 h-1.5 rounded-sm ${blockCol}`} />
          <div className={`w-3/4 h-3.5 rounded-full border border-slate-600 ${subBlockCol} flex items-center justify-center gap-1 px-1.5`}>
            <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
            <div className="w-1.5 h-1.5 rounded-full bg-white/70" />
          </div>
        </div>
      )}

      {/* 8. Marquee Ticker */}
      {(geometry === 'marquee-ticker' || wireframeShape.includes('marquee')) && (
        <div className="w-full h-full flex flex-col justify-center gap-1">
          <div className={`w-full h-2 rounded ${subBlockCol} flex items-center gap-1 px-1 overflow-hidden`}>
            <div className="w-6 h-1 rounded bg-slate-400" />
            <div className="w-8 h-1 rounded bg-slate-400" />
            <div className="w-10 h-1 rounded bg-slate-400" />
          </div>
          <div className={`w-full h-2 rounded ${accentBlockCol} flex items-center gap-1 px-1 overflow-hidden`}>
            <div className="w-8 h-1 rounded bg-white/80" />
            <div className="w-6 h-1 rounded bg-white/80" />
            <div className="w-12 h-1 rounded bg-white/80" />
          </div>
        </div>
      )}

      {/* 9. Interactive Tabs */}
      {(geometry === 'interactive-tabs' || wireframeShape.includes('tabs')) && (
        <div className="w-full h-full grid grid-cols-12 gap-1 items-stretch">
          <div className="col-span-4 flex flex-col gap-0.5 justify-around">
            <div className={`w-full h-1.5 rounded ${accentBlockCol}`} />
            <div className={`w-4/5 h-1.5 rounded ${subBlockCol}`} />
            <div className={`w-4/5 h-1.5 rounded ${subBlockCol}`} />
          </div>
          <div className={`col-span-8 rounded border ${subBlockCol} p-1 flex flex-col justify-between`}>
            <div className={`w-full h-1 rounded ${blockCol}`} />
            <div className={`w-2/3 h-1 rounded ${subBlockCol}`} />
          </div>
        </div>
      )}

      {/* 10. Stacked Z-Index */}
      {(geometry === 'stacked-zindex' || wireframeShape.includes('stack')) && (
        <div className="w-full h-full relative flex items-center justify-center">
          <div className={`absolute w-3/4 h-8 rounded border border-slate-700 ${subBlockCol} -rotate-6`} />
          <div className={`absolute w-3/4 h-8 rounded border border-slate-600 ${subBlockCol} rotate-3`} />
          <div className={`relative w-3/4 h-8 rounded border ${accentBlockCol} flex items-center justify-center shadow`}>
            <div className="w-1/2 h-1 rounded bg-white/80" />
          </div>
        </div>
      )}

      {/* 0-A. Video Player Shape */}
      {wireframeShape.includes('video-player') && (
        <div className="w-full h-full rounded relative overflow-hidden bg-slate-950 border border-slate-800 flex flex-col justify-between p-1">
          <div className="flex items-center justify-between">
            <span className="text-[6px] font-mono text-red-400 font-bold flex items-center gap-0.5">● REC 4K</span>
            <div className="w-6 h-0.5 rounded bg-slate-700" />
          </div>
          <div className="flex items-center justify-center">
            <div className={`w-4 h-4 rounded-full ${accentBlockCol} flex items-center justify-center shadow-lg shadow-cyan-500/20`}>
              <div className="w-0 h-0 border-y-[3px] border-y-transparent border-l-[5px] border-l-slate-950 ml-0.5" />
            </div>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3/4 h-1 rounded-full bg-slate-700 relative overflow-hidden">
              <div className={`w-1/2 h-full ${accentBlockCol}`} />
            </div>
            <span className="text-[6px] font-mono text-slate-400">03:45</span>
          </div>
        </div>
      )}

      {/* 0-B. Visual Photo Lookbook Strip */}
      {wireframeShape.includes('visual-photo-lookbook') && (
        <div className="w-full h-full flex items-center gap-1 overflow-hidden p-0.5">
          <div className={`w-1/3 h-full rounded border border-slate-700 ${subBlockCol} flex flex-col justify-end p-0.5`}>
            <div className="w-full h-0.5 rounded bg-white/70" />
          </div>
          <div className={`w-1/3 h-full rounded border ${accentBlockCol} shadow flex flex-col justify-end p-0.5`}>
            <div className="w-full h-0.5 rounded bg-white" />
          </div>
          <div className={`w-1/3 h-full rounded border border-slate-700 ${subBlockCol} flex flex-col justify-end p-0.5`}>
            <div className="w-full h-0.5 rounded bg-white/70" />
          </div>
        </div>
      )}

      {/* 0-C. Typo Giant Display */}
      {wireframeShape.includes('typo-giant-display') && (
        <div className="w-full h-full flex flex-col justify-between p-1 bg-slate-950">
          <div className="w-full h-1 bg-yellow-400/80 rounded-sm" />
          <div className="flex items-center justify-center gap-0.5">
            <div className={`w-full h-3 rounded-sm ${blockCol} font-black flex items-center justify-center text-[8px] text-slate-950`}>
              BOLD DISPLAY
            </div>
          </div>
          <div className="w-3/4 mx-auto h-0.5 rounded bg-slate-500" />
        </div>
      )}

      {/* 0-D. Typo Swiss Grid */}
      {wireframeShape.includes('typo-swiss-grid') && (
        <div className="w-full h-full grid grid-cols-4 gap-1 p-1 divide-x divide-slate-700 bg-slate-950">
          <div className="flex flex-col justify-between pr-0.5">
            <span className="text-[5px] font-mono text-slate-400">01</span>
            <div className={`w-full h-1 rounded ${blockCol}`} />
          </div>
          <div className="flex flex-col justify-between px-0.5">
            <span className="text-[5px] font-mono text-slate-400">02</span>
            <div className={`w-full h-1 rounded ${subBlockCol}`} />
          </div>
          <div className="flex flex-col justify-between px-0.5">
            <span className="text-[5px] font-mono text-slate-400">03</span>
            <div className={`w-full h-1 rounded ${accentBlockCol}`} />
          </div>
          <div className="flex flex-col justify-between pl-0.5">
            <span className="text-[5px] font-mono text-slate-400">04</span>
            <div className={`w-full h-1 rounded ${subBlockCol}`} />
          </div>
        </div>
      )}

      {/* 11. Full-Bleed Cinematic */}
      {(geometry === 'fullbleed-cinematic' || wireframeShape.includes('fullbleed')) && !wireframeShape.includes('video-player') && (
        <div className="w-full h-full rounded relative overflow-hidden bg-slate-800 flex flex-col justify-end p-1">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          <div className={`relative z-10 w-2/3 h-1.5 rounded-sm ${blockCol}`} />
          <div className={`relative z-10 w-1/3 h-1 rounded-sm ${accentBlockCol} mt-0.5`} />
        </div>
      )}

      {/* 12. Default / 1-Column Center */}
      {geometry === '1col-center' && !wireframeShape.includes('terminal') && (
        <div className="w-full h-full flex flex-col items-center justify-center gap-1">
          <div className={`w-1/3 h-1 rounded-full ${accentBlockCol}`} />
          <div className={`w-3/4 h-2 rounded-sm ${blockCol}`} />
          <div className={`w-1/2 h-1 rounded-sm ${subBlockCol}`} />
          <div className={`w-1/4 h-1.5 rounded-full ${accentBlockCol} mt-0.5`} />
        </div>
      )}
    </div>
  );
}
