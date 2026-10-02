'use client';

import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { PromptResult, TargetAI } from '@/lib/prompt-engine';
import { Copy, Check, Sparkles, X, Terminal, Code2, Presentation, Image as ImageIcon, Info } from 'lucide-react';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptResult: PromptResult;
  targetAI: TargetAI;
  onTargetAIChange: (ai: TargetAI) => void;
}

export default function PromptModal({
  isOpen,
  onClose,
  promptResult,
  targetAI,
  onTargetAIChange,
}: PromptModalProps) {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptResult.promptText);
      setCopied(true);
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.7 },
      });
      setTimeout(() => setCopied(false), 3000);
    } catch {
      alert('클립보드 복사에 실패했습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-3xl w-full flex flex-col max-h-[90vh] shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 모달 상단 헤더 */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-black text-white flex items-center gap-2">
                조립된 전문 디자인 프롬프트
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono border border-emerald-500/20 font-bold">
                  v8.0 Ready
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                선택하신 스타일, 컬러, 컴포넌트 청사진이 100% 반영되었습니다.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition border border-slate-700/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI 타겟 선택기 탭 */}
        <div className="px-6 pt-4 pb-2 bg-slate-900">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            사용하실 AI 모델을 선택하세요:
          </span>
          <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
            {[
              { id: 'chatgpt_claude', label: 'ChatGPT / Claude', icon: Terminal },
              { id: 'v0_code', label: 'v0 / React 코드', icon: Code2 },
              { id: 'gamma_slide', label: 'Gamma 슬라이드', icon: Presentation },
              { id: 'midjourney', label: 'Midjourney 비주얼', icon: ImageIcon },
            ].map(ai => {
              const Icon = ai.icon;
              const isSelected = targetAI === ai.id;
              return (
                <button
                  key={ai.id}
                  onClick={() => onTargetAIChange(ai.id as TargetAI)}
                  className={`py-2.5 px-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition ${
                    isSelected
                      ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold shadow-md shadow-emerald-500/10'
                      : 'bg-slate-800/60 text-slate-300 border-slate-700/60 hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-[11px] truncate w-full text-center">{ai.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 1-Click 대형 복사 버튼 & AI 직접 열기 바 */}
        <div className="px-6 py-3 bg-slate-900 space-y-2.5">
          <button
            onClick={handleCopy}
            className={`w-full py-3.5 rounded-xl font-black text-sm flex items-center justify-center gap-2 shadow-xl transition-all ${
              copied
                ? 'bg-emerald-400 text-slate-950 scale-[0.99]'
                : 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-emerald-500/25'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 font-bold" />
                <span>복사 완료! 아래 AI 사이트를 열어 즉시 붙여넣으세요 🎉</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 font-bold" />
                <span>완성된 디자인 프롬프트 1-Click 클립보드 복사</span>
              </>
            )}
          </button>

          {/* AI 플랫폼 즉시 이동 퀵 링크 */}
          <div className="flex items-center justify-between text-xs pt-1">
            <span className="text-slate-400 font-medium">복사 후 바로 이동하기:</span>
            <div className="flex items-center gap-2">
              <a
                href="https://chatgpt.com"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-slate-700 hover:text-white transition flex items-center gap-1"
              >
                <span>ChatGPT</span>
                <span className="text-[10px] text-emerald-400">↗</span>
              </a>
              <a
                href="https://claude.ai"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-slate-700 hover:text-white transition flex items-center gap-1"
              >
                <span>Claude</span>
                <span className="text-[10px] text-emerald-400">↗</span>
              </a>
              <a
                href="https://v0.dev"
                target="_blank"
                rel="noreferrer"
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold border border-slate-700 hover:text-white transition flex items-center gap-1"
              >
                <span>v0.dev</span>
                <span className="text-[10px] text-emerald-400">↗</span>
              </a>
            </div>
          </div>
        </div>

        {/* 프롬프트 텍스트 콘솔 */}
        <div className="flex-1 px-6 pb-4 overflow-hidden flex flex-col">
          <div className="flex-1 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex flex-col">
            <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800 text-[11px] flex items-center justify-between text-slate-400 font-mono">
              <span className="text-emerald-400 font-bold">{promptResult.title}</span>
              <span>{promptResult.charCount.toLocaleString()} 글자</span>
            </div>
            <pre className="flex-1 p-4 text-[11px] font-mono text-emerald-400/90 overflow-y-auto whitespace-pre-wrap leading-relaxed max-h-[320px] select-all">
              {promptResult.promptText}
            </pre>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-2.5 bg-slate-800/40 p-2 rounded-xl border border-slate-800">
            <Info className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>AI 채팅창에 복사한 프롬프트를 붙여넣고, 맨 아래 <code>{'"""원고"""'}</code> 위치에 당신의 발표 내용이나 기획안을 던지면 완성됩니다!</span>
          </div>
        </div>
      </div>
    </div>
  );
}
