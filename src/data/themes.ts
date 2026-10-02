export interface DesignTheme {
  id: string;
  name: string;
  koreanName: string;
  description: string;
  tokens: {
    bg: string;
    cardBg: string;
    cardBorder: string;
    accent: string;
    accentSecondary: string;
    textPrimary: string;
    textSecondary: string;
    badgeBg: string;
    badgeText: string;
  };
  tailwind: {
    canvasBg: string;
    cardBg: string;
    cardBorder: string;
    accentText: string;
    accentBg: string;
    textPrimary: string;
    textSecondary: string;
  };
  fontFamily: string;
  moodKeywords: string[];
}

export const DESIGN_THEMES: DesignTheme[] = [
  {
    id: 'dark-tech',
    name: 'Dark Tech & OLED',
    koreanName: '🌌 다크 테크 (OLED & 네온)',
    description: '깊은 네이비/블랙 배경에 네온 민트 그린 액센트가 돋보이는 모던 테크 스타일',
    tokens: {
      bg: '#0F172A',
      cardBg: '#1E293B',
      cardBorder: '#334155',
      accent: '#22C55E',
      accentSecondary: '#38BDF8',
      textPrimary: '#F8FAFC',
      textSecondary: '#94A3B8',
      badgeBg: 'rgba(34, 197, 94, 0.15)',
      badgeText: '#4ADE80',
    },
    tailwind: {
      canvasBg: 'bg-slate-900',
      cardBg: 'bg-slate-800/90',
      cardBorder: 'border-slate-700/80',
      accentText: 'text-emerald-400',
      accentBg: 'bg-emerald-500',
      textPrimary: 'text-slate-50',
      textSecondary: 'text-slate-400',
    },
    fontFamily: 'Inter, system-ui, sans-serif',
    moodKeywords: ['고대비', '미래지향적', '신뢰성', '데이터 중심', 'OLED 최적화'],
  },
  {
    id: 'swiss-minimal',
    name: 'Swiss Style & Modern Minimal',
    koreanName: '⚪️ 스위스 미니멀 (클린 화이트)',
    description: '충분한 여백, 기하학적 그리드, 블랙 & 오프화이트의 절제된 타이포그래피 미학',
    tokens: {
      bg: '#F8FAFC',
      cardBg: '#FFFFFF',
      cardBorder: '#E2E8F0',
      accent: '#0F172A',
      accentSecondary: '#2563EB',
      textPrimary: '#0F172A',
      textSecondary: '#64748B',
      badgeBg: '#F1F5F9',
      badgeText: '#0F172A',
    },
    tailwind: {
      canvasBg: 'bg-slate-50',
      cardBg: 'bg-white',
      cardBorder: 'border-slate-200',
      accentText: 'text-slate-900',
      accentBg: 'bg-slate-900',
      textPrimary: 'text-slate-900',
      textSecondary: 'text-slate-500',
    },
    fontFamily: 'Helvetica Neue, Inter, sans-serif',
    moodKeywords: ['절제미', '넓은 여백', '가독성 극대화', '고급스러운 단순함'],
  },
  {
    id: 'soft-ui',
    name: 'Soft UI Evolution',
    koreanName: '🌸 소프트 UI (뉴모피즘 진화형)',
    description: '부드러운 다층 그림자, 포근한 파스텔 톤과 웰빙/라이프스타일 감성',
    tokens: {
      bg: '#FDFBF7',
      cardBg: '#FFFFFF',
      cardBorder: '#F1ECE4',
      accent: '#E07A5F',
      accentSecondary: '#81B29A',
      textPrimary: '#2D3142',
      textSecondary: '#6C757D',
      badgeBg: '#FCEFE9',
      badgeText: '#E07A5F',
    },
    tailwind: {
      canvasBg: 'bg-[#faf8f5]',
      cardBg: 'bg-white',
      cardBorder: 'border-amber-100/80',
      accentText: 'text-[#e07a5f]',
      accentBg: 'bg-[#e07a5f]',
      textPrimary: 'text-stone-800',
      textSecondary: 'text-stone-500',
    },
    fontFamily: 'Pretendard, system-ui, sans-serif',
    moodKeywords: ['포근함', '친근한', '웰빙/뷰티', '부드러운 그림자'],
  },
  {
    id: 'vibrant-bold',
    name: 'Vibrant & Block-based',
    koreanName: '⚡️ 비비드 & 볼드 블록',
    description: '시선을 확 잡아끄는 비비드 컬러 블록과 팝한 타이포그래피의 강렬한 조화',
    tokens: {
      bg: '#18181B',
      cardBg: '#27272A',
      cardBorder: '#3F3F46',
      accent: '#FACC15',
      accentSecondary: '#F43F5E',
      textPrimary: '#FFFFFF',
      textSecondary: '#A1A1AA',
      badgeBg: 'rgba(250, 204, 21, 0.2)',
      badgeText: '#FDE047',
    },
    tailwind: {
      canvasBg: 'bg-zinc-900',
      cardBg: 'bg-zinc-800',
      cardBorder: 'border-zinc-700',
      accentText: 'text-yellow-400',
      accentBg: 'bg-yellow-400',
      textPrimary: 'text-zinc-50',
      textSecondary: 'text-zinc-400',
    },
    fontFamily: 'Montserrat, sans-serif',
    moodKeywords: ['폭발적 에너지', '스타트업', '젊은 감각', '고대비 주목도'],
  },
  {
    id: 'cyber-glow',
    name: 'Cyberpunk & Violet Glow',
    koreanName: '🔮 사이버 글로우 (바이올렛)',
    description: '퍼플 & 사이언 네온 글로우와 미래지향적 유리 질감의 글래스모피즘',
    tokens: {
      bg: '#090514',
      cardBg: 'rgba(26, 17, 51, 0.7)',
      cardBorder: 'rgba(168, 85, 247, 0.3)',
      accent: '#C084FC',
      accentSecondary: '#38BDF8',
      textPrimary: '#FAF5FF',
      textSecondary: '#C4B5FD',
      badgeBg: 'rgba(192, 132, 252, 0.2)',
      badgeText: '#E9D5FF',
    },
    tailwind: {
      canvasBg: 'bg-[#090514]',
      cardBg: 'bg-[#1a1133]/80 backdrop-blur-md',
      cardBorder: 'border-purple-500/30',
      accentText: 'text-purple-300',
      accentBg: 'bg-purple-500',
      textPrimary: 'text-purple-50',
      textSecondary: 'text-purple-300',
    },
    fontFamily: 'Orbitron, Inter, sans-serif',
    moodKeywords: ['글래스모피즘', '퍼플 네온', 'AI 네이티브', '하이테크'],
  },
];
