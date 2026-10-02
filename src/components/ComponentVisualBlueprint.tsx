'use client';

import React from 'react';

interface ComponentVisualBlueprintProps {
  type?: string;
  componentId?: string;
  focalAnchor?: string;
  category?: string;
  className?: string;
  active?: boolean;
}

export default function ComponentVisualBlueprint({
  type = '',
  componentId = '',
  focalAnchor = 'visual',
  category = 'hero',
  className = '',
  active = false,
}: ComponentVisualBlueprintProps) {
  const t = (type || componentId).toLowerCase();

  // 색상 토큰
  const borderCol = active ? 'border-emerald-500/70 bg-emerald-950/20' : 'border-slate-800 bg-slate-950/70';
  return (
    <div 
      data-focal-anchor={focalAnchor}
      className={`w-full h-16 rounded-xl border p-2 flex items-center justify-center overflow-hidden select-none transition-all duration-200 ${borderCol} ${className}`}
    >
      {/* 1. 🎥 16:9 시네마틱 앰비언트 비디오 루프 / 쇼릴 플레이어 */}
      {(t.includes('video-ambient') || t.includes('showreel') || t.includes('video-hero')) && (
        <div className="w-full h-full rounded-lg bg-slate-900 border border-slate-700/80 p-1 flex flex-col justify-between relative overflow-hidden">
          <div className="flex items-center justify-between text-[7px] font-mono">
            <span className="text-red-400 font-bold flex items-center gap-0.5">● 4K 60FPS</span>
            <span className="text-slate-400">03:45 / 07:20</span>
          </div>
          {/* 중앙 플레이 버튼 */}
          <div className="flex items-center justify-center my-auto">
            <div className="w-4 h-4 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center shadow-md shadow-cyan-500/40">
              <div className="w-0 h-0 border-y-[2.5px] border-y-transparent border-l-[4.5px] border-l-slate-950 ml-0.5" />
            </div>
          </div>
          {/* 하단 스크러버 바 */}
          <div className="w-full h-1 rounded-full bg-slate-800 relative overflow-hidden">
            <div className="w-3/5 h-full bg-gradient-to-r from-cyan-400 to-emerald-400" />
          </div>
        </div>
      )}

      {/* 2. 📱 9:16 모바일 세로 숏폼 릴스 3단 그리드 */}
      {(t.includes('shorts') || t.includes('video-shorts')) && (
        <div className="w-full h-full grid grid-cols-3 gap-1">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-full rounded-md bg-slate-900 border border-slate-700/80 p-1 flex flex-col justify-between">
              <div className="flex items-center justify-between text-[6px] font-mono text-cyan-400">
                <span>0{i}</span>
                <span>●</span>
              </div>
              <div className="w-3 h-3 rounded-full bg-cyan-500/20 text-cyan-300 mx-auto flex items-center justify-center">
                <div className="w-0 h-0 border-y-[2px] border-y-transparent border-l-[3px] border-l-cyan-300 ml-0.5" />
              </div>
              <div className="w-full h-0.5 rounded bg-slate-700" />
            </div>
          ))}
        </div>
      )}

      {/* 3. 📺 PiP 플로팅 독 또는 비디오 분할 */}
      {(t.includes('pip') || t.includes('split-narrative')) && (
        <div className="w-full h-full grid grid-cols-2 gap-1 items-center">
          <div className="h-full rounded bg-slate-900 border border-slate-700 p-1 flex flex-col justify-between">
            <span className="text-[6px] font-mono text-cyan-400">VIDEO</span>
            <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 mx-auto" />
            <div className="w-full h-0.5 rounded bg-slate-700" />
          </div>
          <div className="space-y-1 p-0.5">
            <div className="w-full h-1 rounded bg-slate-400" />
            <div className="w-3/4 h-1 rounded bg-slate-600" />
            <div className="w-1/2 h-1 rounded bg-emerald-400" />
          </div>
        </div>
      )}

      {/* 4. 🎞️ 하이패션 세로 2:3 룩북 필름스트립 */}
      {(t.includes('lookbook') || t.includes('vis-lookbook')) && (
        <div className="w-full h-full flex items-center gap-1.5 justify-center">
          {[1, 2, 3].map(i => (
            <div key={i} className={`h-full w-1/3 rounded-md border border-slate-700/80 bg-slate-900 p-1 flex flex-col justify-between relative overflow-hidden ${i === 2 ? 'ring-1 ring-pink-500/50' : ''}`}>
              <span className="text-[6px] font-mono text-pink-400">LOOK #{i}</span>
              <div className="space-y-0.5">
                <div className="w-full h-0.5 rounded bg-white/80" />
                <div className="w-2/3 h-0.5 rounded bg-slate-500" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 5. ⚖️ 60:40 비대칭 화보 & 스토리텔링 스플릿 */}
      {(t.includes('split-6040') || t.includes('vis-split-6040')) && (
        <div className="w-full h-full grid grid-cols-12 gap-1.5 items-center">
          <div className="col-span-7 h-full rounded-md bg-slate-800 border border-slate-700 p-1 flex flex-col justify-between">
            <span className="text-[6px] font-mono text-emerald-400 font-bold">60% PHOTO</span>
            <div className="w-full h-0.5 rounded bg-white/70" />
          </div>
          <div className="col-span-5 space-y-1">
            <div className="w-full h-1.5 rounded bg-slate-300" />
            <div className="w-4/5 h-1 rounded bg-slate-500" />
            <div className="w-1/2 h-1.5 rounded bg-emerald-400" />
          </div>
        </div>
      )}

      {/* 6. 🔮 3D 실물 플로팅 쇼케이스 무대 */}
      {(t.includes('3d') || t.includes('podium') || t.includes('3d-stage')) && (
        <div className="w-full h-full rounded bg-slate-950 border border-slate-800 p-1 flex flex-col items-center justify-between">
          <span className="text-[6px] font-mono text-emerald-400 font-bold">3D RAY-TRACED STAGE</span>
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-slate-800 to-slate-700 border border-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <div className="w-2 h-2 rounded-sm bg-emerald-400 rotate-45" />
          </div>
          <div className="w-10 h-0.5 rounded-full bg-slate-700 shadow" />
        </div>
      )}

      {/* 7. 📍 인터랙티브 핫스팟 핀 뷰어 */}
      {(t.includes('hotspot') || t.includes('vis-hotspot')) && (
        <div className="w-full h-full rounded bg-slate-900 border border-slate-700/80 p-1 relative flex flex-col justify-between">
          <span className="text-[6px] font-mono text-emerald-400">HOTSPOT 4 PINS</span>
          <div className="absolute top-2 left-6 w-2 h-2 rounded-full bg-emerald-400 animate-pulse text-[5px] text-slate-950 font-bold flex items-center justify-center">1</div>
          <div className="absolute bottom-2 left-1/2 w-2 h-2 rounded-full bg-cyan-400 animate-pulse text-[5px] text-slate-950 font-bold flex items-center justify-center">2</div>
          <div className="absolute top-3 right-8 w-2 h-2 rounded-full bg-emerald-400 animate-pulse text-[5px] text-slate-950 font-bold flex items-center justify-center">3</div>
          <div className="w-12 h-1 rounded bg-slate-800 self-end" />
        </div>
      )}

      {/* 8. 🧱 핀터레스트형 메이슨리 무드보드 */}
      {(t.includes('masonry') || t.includes('vis-masonry')) && (
        <div className="w-full h-full grid grid-cols-4 gap-1">
          <div className="h-full rounded bg-slate-800 border border-slate-700" />
          <div className="h-3/4 rounded bg-slate-700 self-end" />
          <div className="h-full rounded bg-slate-800 border border-slate-700" />
          <div className="h-2/3 rounded bg-slate-700 self-center" />
        </div>
      )}

      {/* 9. ⚡️ 96pt 네오 브루탈리스트 자이언트 슬로건 */}
      {(t.includes('giant') || t.includes('brutalist') || t.includes('typo-giant')) && (
        <div className="w-full h-full rounded bg-slate-950 border-2 border-yellow-400/80 p-1 flex flex-col justify-between">
          <div className="flex items-center justify-between text-[6px] font-mono text-yellow-400 font-bold">
            <span>NEO-BRUTALISM</span>
            <span>96PT</span>
          </div>
          <div className="w-full h-3 rounded bg-yellow-400 text-slate-950 font-black text-[8px] flex items-center justify-center tracking-tighter">
            GIANT SLOGAN
          </div>
          <div className="w-full h-0.5 bg-yellow-400" />
        </div>
      )}

      {/* 10. 🔄 키네틱 가로 롤링 전광판 티커 */}
      {(t.includes('marquee') || t.includes('typo-marquee')) && (
        <div className="w-full h-full flex flex-col justify-center gap-1">
          <div className="w-full h-2 rounded bg-slate-900 border border-slate-800 flex items-center gap-1 px-1">
            <span className="text-[6px] font-mono text-emerald-400 font-bold">✦ KINETIC MARQUEE ✦ SYSTEM ✦</span>
          </div>
          <div className="w-full h-2 rounded bg-emerald-950/60 border border-emerald-500/30 flex items-center gap-1 px-1">
            <span className="text-[6px] font-mono text-emerald-300 font-bold">✦ MONUMENTAL TYPOGRAPHY ✦</span>
          </div>
        </div>
      )}

      {/* 11. 💻 개발자용 라이브 CLI 터미널 윈도우 */}
      {(t.includes('terminal') || t.includes('code') || t.includes('typo-terminal')) && (
        <div className="w-full h-full rounded border border-slate-700 bg-slate-950 p-1 flex flex-col justify-between font-mono">
          <div className="flex items-center gap-0.5 pb-0.5 border-b border-slate-800">
            <div className="w-1 h-1 rounded-full bg-red-400" />
            <div className="w-1 h-1 rounded-full bg-yellow-400" />
            <div className="w-1 h-1 rounded-full bg-green-400" />
            <span className="text-[5px] text-slate-400 ml-1">bash - 80x24</span>
          </div>
          <div className="space-y-0.5">
            <div className="w-4/5 h-1 rounded bg-emerald-400/80" />
            <div className="w-1/2 h-0.5 rounded bg-cyan-400/60" />
          </div>
        </div>
      )}

      {/* 12. 💬 모뉴멘탈 대형 매니페스토 인용구 */}
      {(t.includes('quote') || t.includes('typo-quote')) && (
        <div className="w-full h-full rounded bg-slate-950 border border-slate-800 p-1 flex flex-col justify-between text-center">
          <span className="text-[8px] font-serif text-amber-400 leading-none">&ldquo;</span>
          <div className="w-4/5 mx-auto h-1.5 rounded bg-slate-200" />
          <div className="w-1/2 mx-auto h-0.5 rounded bg-slate-500" />
        </div>
      )}

      {/* 13. 🍱 12열 벤토 모듈러 그리드 2.0 */}
      {(t.includes('bento') || t.includes('bento-grid') || t.includes('bento-hero')) && (
        <div className="w-full h-full grid grid-cols-12 gap-1">
          <div className="col-span-8 h-full rounded bg-slate-800 border border-slate-700 p-1 flex flex-col justify-between">
            <div className="w-3/4 h-1 rounded bg-emerald-400" />
            <div className="w-1/2 h-0.5 rounded bg-slate-500" />
          </div>
          <div className="col-span-4 h-full rounded bg-slate-900 border border-emerald-500/40 p-1 flex flex-col justify-between text-center">
            <span className="text-[5px] font-mono text-slate-400">KPI</span>
            <span className="text-[7px] font-black text-emerald-400">99.9%</span>
          </div>
        </div>
      )}

      {/* 14. 📈 48pt 볼드 ARR 지표 + 스파크라인 차트 */}
      {(t.includes('sparkline') || t.includes('metric') || t.includes('data-48pt')) && (
        <div className="w-full h-full grid grid-cols-3 gap-1">
          {[
            { val: '₩52억', d: '+240%' },
            { val: '38K', d: '+78%' },
            { val: '99.9%', d: 'SLA' }
          ].map((m, i) => (
            <div key={i} className="h-full rounded bg-slate-900 border border-slate-800 p-1 flex flex-col justify-between">
              <span className="text-[5px] font-mono text-slate-400">ARR</span>
              <span className="text-[7px] font-black font-mono text-white">{m.val}</span>
              <span className="text-[5px] font-bold text-emerald-400">{m.d}</span>
            </div>
          ))}
        </div>
      )}

      {/* 15. 🏷️ 3단 요금제 플랜 매트릭스 */}
      {(t.includes('pricing') || t.includes('tier')) && (
        <div className="w-full h-full grid grid-cols-3 gap-1 items-end">
          <div className="h-4/5 rounded bg-slate-900 border border-slate-800 p-1 flex flex-col justify-between">
            <span className="text-[5px] font-mono text-slate-400">STARTER</span>
            <div className="w-full h-0.5 rounded bg-slate-700" />
            <div className="w-3/4 h-0.5 rounded bg-slate-700" />
          </div>
          <div className="h-full rounded bg-emerald-950/60 border border-emerald-500/60 p-1 flex flex-col justify-between shadow-sm">
            <span className="text-[5px] font-mono text-emerald-400 font-bold">PRO ★</span>
            <div className="w-full h-1 rounded bg-emerald-400" />
            <div className="w-full h-0.5 rounded bg-emerald-500/50" />
          </div>
          <div className="h-4/5 rounded bg-slate-900 border border-slate-800 p-1 flex flex-col justify-between">
            <span className="text-[5px] font-mono text-slate-400">ENTERPRISE</span>
            <div className="w-full h-0.5 rounded bg-slate-700" />
            <div className="w-3/4 h-0.5 rounded bg-slate-700" />
          </div>
        </div>
      )}

      {/* 16. ⭕️ 360도 도넛 게이지 다이얼 */}
      {(t.includes('gauge') || t.includes('circular')) && (
        <div className="w-full h-full rounded bg-slate-950 border border-slate-800 p-1 flex items-center justify-around">
          <div className="w-9 h-9 rounded-full border-2 border-emerald-400 border-t-transparent flex items-center justify-center animate-spin-slow">
            <span className="text-[7px] font-mono font-black text-emerald-400">94%</span>
          </div>
          <div className="space-y-0.5">
            <div className="w-12 h-1 rounded bg-white" />
            <div className="w-8 h-0.5 rounded bg-slate-500" />
            <span className="text-[5px] font-mono text-emerald-400">TARGET HIT</span>
          </div>
        </div>
      )}

      {/* 17. 🚩 수평 4단계 마일스톤 스텝퍼 */}
      {(t.includes('stepper') || t.includes('roadmap')) && (
        <div className="w-full h-full rounded bg-slate-950 border border-slate-800 p-1 flex items-center justify-between relative px-2">
          <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-0.5 bg-slate-800" />
          {[1, 2, 3, 4].map(s => (
            <div key={s} className="relative z-10 flex flex-col items-center gap-0.5">
              <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[6px] font-bold ${s <= 2 ? 'bg-emerald-400 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                {s}
              </div>
              <span className="text-[5px] font-mono text-slate-400">P{s}</span>
            </div>
          ))}
        </div>
      )}

      {/* 18. ✨ 3단 피처 스포트라이트 카드 */}
      {(t.includes('feature') || t.includes('spotlight')) && (
        <div className="w-full h-full grid grid-cols-3 gap-1">
          {[1, 2, 3].map(f => (
            <div key={f} className="h-full rounded bg-slate-900 border border-slate-800 p-1 flex flex-col justify-between">
              <div className="w-2 h-2 rounded-full bg-cyan-400/80" />
              <div className="w-full h-1 rounded bg-slate-200" />
              <div className="w-3/4 h-0.5 rounded bg-slate-600" />
            </div>
          ))}
        </div>
      )}

      {/* 19. 📂 세부 기술 명세 확장 아코디언 */}
      {(t.includes('accordion') || t.includes('drawer')) && (
        <div className="w-full h-full rounded bg-slate-950 border border-slate-800 p-1 flex flex-col justify-between">
          <div className="w-full h-3 rounded bg-slate-900 border border-slate-800 px-1.5 flex items-center justify-between">
            <span className="text-[5px] font-mono text-slate-300">01 Architecture Core</span>
            <span className="text-[6px] text-slate-500">▼</span>
          </div>
          <div className="w-full h-4 rounded bg-emerald-950/40 border border-emerald-500/40 px-1.5 flex flex-col justify-center gap-0.5">
            <div className="flex items-center justify-between">
              <span className="text-[5px] font-mono text-emerald-400 font-bold">02 Distributed Nodes</span>
              <span className="text-[6px] text-emerald-400">▲</span>
            </div>
            <div className="w-3/4 h-0.5 rounded bg-slate-400" />
          </div>
        </div>
      )}

      {/* 20. 🎨 Z-인덱스 스태킹 콜라주 */}
      {(t.includes('collage') || t.includes('vis-collage')) && (
        <div className="w-full h-full rounded bg-slate-950 border border-slate-800 p-1 relative overflow-hidden flex items-center justify-center">
          <div className="absolute w-12 h-8 rounded bg-slate-800 border border-slate-600 -rotate-6 shadow" />
          <div className="relative w-12 h-8 rounded bg-slate-900 border border-emerald-500/50 rotate-3 shadow-lg flex items-center justify-center">
            <span className="text-[6px] font-mono text-emerald-300 font-bold">COLLAGE</span>
          </div>
        </div>
      )}

      {/* 21. 🧭 네비게이션 헤더 / GNB */}
      {(t.includes('nav') || category === 'header') && (
        <div className="w-full h-full flex flex-col justify-center">
          <div className="w-full h-6 rounded-full bg-slate-900 border border-slate-700/80 px-2 flex items-center justify-between">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <div className="w-6 h-1 rounded bg-slate-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-0.5 rounded bg-slate-500" />
              <div className="w-3 h-0.5 rounded bg-slate-500" />
              <div className="w-3 h-0.5 rounded bg-slate-500" />
            </div>
            <div className="w-6 h-2 rounded-md bg-emerald-400" />
          </div>
        </div>
      )}

      {/* 22. ⚡️ 전환 유도 CTA 배너 */}
      {(t.includes('cta') || category === 'conversion' || category === 'cta') && (
        <div className="w-full h-full rounded-lg bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 border border-emerald-500/40 p-1 flex items-center justify-between gap-1">
          <div className="space-y-0.5 min-w-0">
            <div className="w-14 h-1.5 rounded bg-white" />
            <div className="w-10 h-0.5 rounded bg-slate-400" />
          </div>
          <div className="w-8 h-3 rounded-md bg-emerald-400 text-slate-950 text-[6px] font-black flex items-center justify-center shrink-0">
            START
          </div>
        </div>
      )}

      {/* 23. 🏛️ 사이트맵 푸터 */}
      {(t.includes('footer') || category === 'footer') && (
        <div className="w-full h-full rounded bg-slate-950 border border-slate-800 p-1 flex flex-col justify-between">
          <div className="grid grid-cols-4 gap-1">
            <div className="w-full h-1 rounded bg-slate-400" />
            <div className="w-full h-1 rounded bg-slate-600" />
            <div className="w-full h-1 rounded bg-slate-600" />
            <div className="w-full h-1 rounded bg-slate-600" />
          </div>
          <div className="w-full h-0.5 rounded bg-slate-800" />
          <div className="flex items-center justify-between text-[5px] font-mono text-slate-500">
            <span>© 2026 CORE</span>
            <span>PRIVACY • TERMS</span>
          </div>
        </div>
      )}

      {/* 기본 폴백 와이어프레임 */}
      {!t.includes('video') && !t.includes('lookbook') && !t.includes('split') && !t.includes('3d') && !t.includes('hotspot') && !t.includes('masonry') && !t.includes('giant') && !t.includes('marquee') && !t.includes('terminal') && !t.includes('quote') && !t.includes('bento') && !t.includes('sparkline') && !t.includes('metric') && !t.includes('nav') && !t.includes('cta') && !t.includes('footer') && !t.includes('pricing') && !t.includes('gauge') && !t.includes('stepper') && !t.includes('feature') && !t.includes('accordion') && !t.includes('collage') && (
        <div className="w-full h-full flex flex-col justify-between p-1 bg-slate-950 rounded border border-slate-800">
          <div className="w-1/3 h-1.5 rounded bg-emerald-400" />
          <div className="w-full h-1 rounded bg-slate-600" />
          <div className="w-2/3 h-1 rounded bg-slate-700" />
        </div>
      )}
    </div>
  );
}
