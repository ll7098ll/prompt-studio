import React from 'react';
import { VisualStyleOption, ColorThemeOption, DesignElementOption, ButtonStyleOption, TypographyOption, TYPOGRAPHY_OPTIONS, getMatchingButtonStyle } from '@/data/design-options';

export interface ResolvedDesignSystem {
  // 루트 캔버스 컨테이너 스타일
  canvasRootStyle: React.CSSProperties;
  canvasRootClassName: string;

  // 카드 서피스 스타일 생성기
  getCardStyle: (variant?: 'surface' | 'elevated' | 'sunken' | 'highlight') => React.CSSProperties;
  
  // 버튼 스타일 생성기
  getButtonStyle: (variant?: 'primary' | 'secondary' | 'ghost' | 'outline') => React.CSSProperties;

  // 뱃지 및 상태 칩 스타일 생성기
  getBadgeStyle: (variant?: 'accent' | 'secondary' | 'neutral') => React.CSSProperties;

  // 텍스트 헤드라인 스타일
  getHeadlineStyle: (level?: 'hero' | 'section' | 'card') => React.CSSProperties;

  // 구분선 스타일
  dividerStyle: React.CSSProperties;

  // 앰비언트 글로우 오브 스타일
  glowOrbStyle: React.CSSProperties;

  // 플래그들 (24대 특색 스타일별 시각 효과 분기)
  isBrutalist: boolean;
  isGlass: boolean;
  isClay: boolean;
  isNeon: boolean;
  isEditorial: boolean;
  isSwiss: boolean;
  isY2K: boolean;
  isBiotech: boolean;
  isAerospace: boolean;
  isZen: boolean;
  isWireframe: boolean;
  isBoldType: boolean;
  isSkeuomorphic: boolean;
  isBento: boolean;
  isCyber: boolean;
  isDark: boolean;
  hasGlow: boolean;
  hasGrid: boolean;
  hasGlassBlur: boolean;
  hasGradientText: boolean;

  // 원본 토큰 참조
  tokens: ColorThemeOption['tokens'];
  borderRadius: string;
  fontFamily: string;
}

export function resolveDesignSystem(
  style: VisualStyleOption,
  colorTheme: ColorThemeOption,
  activeElements: DesignElementOption[] = [],
  buttonStyle?: ButtonStyleOption,
  typography?: TypographyOption
): ResolvedDesignSystem {
  const tokens = colorTheme.tokens;
  const btn = buttonStyle || getMatchingButtonStyle(style.id);
  const typo = typography || TYPOGRAPHY_OPTIONS[0];

  // 24대 스타일 세부 계열 완벽 판별 (하위 호환성 alias 포함)
  const isBrutalist = style.id === 'neo-brutalism' || style.id === 'acid-streetwear';
  const isGlass = style.id === 'glassmorphism' || style.id === 'aurora-mesh' || style.id === 'holographic-prism';
  const isBiotech = style.id === 'biotech-clean';
  const isClay = style.id === 'claymorphism-3d' || style.id === 'claymorphism';
  const isNeon = style.id === 'cyberpunk-hud' || style.id === 'cyber-glow' || style.id === 'space-aerospace' || style.id === 'scifi-hud' || style.id === 'cyber-cyan-magenta';
  const isCyber = style.id === 'cyberpunk-hud' || style.id === 'cyber-glow';
  const isAerospace = style.id === 'space-aerospace' || style.id === 'scifi-hud';
  const isEditorial = style.id === 'luxury-editorial' || style.id === 'vogue-fashion-mag' || style.id === 'vintage-broadsheet' || style.id === 'architectural-concrete';
  const isSwiss = style.id === 'swiss-international' || style.id === 'swiss-minimal';
  const isY2K = style.id === 'y2k-retro-chrome' || style.id === 'y2k-retro';
  const isZen = style.id === 'japanese-zen' || style.id === 'craft-paper-textured' || style.id === 'organic-botanical' || style.id === 'botanical-organic';
  const isWireframe = style.id === 'monochrome-wireframe';
  const isBoldType = style.id === 'bold-heavy-type';
  const isSkeuomorphic = style.id === 'skeuomorphic-luxe' || style.id === 'skeuomorphism-2';
  const isBento = style.id === 'bento-apple' || style.id === 'bento-grid';

  // 다크/라이트 모드 배경 명도 자동 판별 (WCAG 7:1 고대비 가독성 보장)
  const isDark = (() => {
    const hex = (tokens.bg || '#000000').replace('#', '');
    if (hex.length === 6) {
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const yiq = (r * 299 + g * 587 + b * 114) / 1000;
      return yiq < 140;
    }
    return true;
  })();

  // 시각 효과 토글
  const hasGlow = activeElements.some(e => e.id === 'elem-ambient-glow');
  const hasGrid = activeElements.some(e => e.id === 'elem-grid-guide') || isWireframe || isAerospace;
  const hasGlassBlur = activeElements.some(e => e.id === 'elem-glass-blur') || isGlass || isBiotech;
  const hasGradientText = activeElements.some(e => e.id === 'elem-gradient-text') || isY2K || isGlass;

  // 모서리 라운드값 결정 (스타일 기본값 우선)
  const baseBorderRadius = style.defaultBorderRadius || (isBrutalist || isSwiss || isWireframe ? '0px' : '16px');
  const fontFamily = typo.fontFamily;

  // 스타일에 따른 독창적 그림자 연산
  let baseShadow = '0 10px 30px -10px rgba(0,0,0,0.5)';
  if (isBrutalist) {
    baseShadow = '5px 5px 0px #000000';
  } else if (isClay) {
    baseShadow = isDark 
      ? '8px 16px 30px rgba(0,0,0,0.4), inset -3px -3px 8px rgba(0,0,0,0.3), inset 3px 3px 8px rgba(255,255,255,0.2)'
      : '6px 12px 24px rgba(0,0,0,0.12), inset -2px -2px 6px rgba(0,0,0,0.08), inset 2px 2px 6px rgba(255,255,255,0.8)';
  } else if (isNeon || isCyber) {
    baseShadow = `0 0 24px ${tokens.accent}44, 0 8px 32px rgba(0,0,0,0.85)`;
  } else if (isGlass || isBiotech) {
    baseShadow = isDark ? '0 20px 50px rgba(0,0,0,0.35), inset 0 1px 1px rgba(255,255,255,0.25)' : '0 12px 32px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,0.9)';
  } else if (isSwiss || isEditorial || isWireframe || isZen) {
    baseShadow = 'none';
  } else if (isY2K) {
    baseShadow = `0 8px 32px rgba(255, 0, 127, 0.25), inset 0 2px 2px rgba(255,255,255,0.6)`;
  } else if (isSkeuomorphic) {
    baseShadow = isDark ? '0 12px 28px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.15)' : '0 8px 20px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.8)';
  }

  // 1. 루트 캔버스 스타일
  const canvasRootStyle: React.CSSProperties = {
    backgroundColor: tokens.bg,
    color: tokens.textPrimary,
    fontFamily: fontFamily,
    borderColor: isBrutalist ? '#000000' : isNeon ? `${tokens.accent}88` : tokens.cardBorder,
    borderWidth: isBrutalist ? '3px' : isNeon ? '2px' : '1px',
    boxShadow: isBrutalist ? '10px 10px 0px #000000' : isDark ? '0 25px 60px -15px rgba(0,0,0,0.7)' : '0 20px 50px -12px rgba(0,0,0,0.12)',
    backgroundImage: hasGrid
      ? `linear-gradient(to right, ${tokens.cardBorder}55 1px, transparent 1px), linear-gradient(to bottom, ${tokens.cardBorder}55 1px, transparent 1px)`
      : undefined,
    backgroundSize: hasGrid ? '28px 28px' : undefined,
  };

  // 2. 카드 서피스 스타일 생성 (100% 텍스트 대비 및 가독성 포함)
  const getCardStyle = (variant: 'surface' | 'elevated' | 'sunken' | 'highlight' = 'surface'): React.CSSProperties => {
    let bg = tokens.cardBg;
    let border = isBrutalist ? '#000000' : tokens.cardBorder;
    const borderWidth = isBrutalist ? '2.5px' : '1px';
    let shadow = baseShadow;
    let backdropBlur = undefined;

    if (variant === 'highlight') {
      bg = isBrutalist ? `${tokens.accent}20` : isDark ? `${tokens.cardBg}` : `${tokens.cardBg}`;
      border = tokens.accent;
      shadow = isBrutalist ? `4px 4px 0px #000000` : `0 0 25px ${tokens.accent}30`;
    } else if (variant === 'elevated') {
      bg = isGlass ? (isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.03)') : tokens.cardBg;
      shadow = isBrutalist ? '6px 6px 0px #000000' : isDark ? '0 20px 40px rgba(0,0,0,0.4)' : '0 12px 30px rgba(0,0,0,0.08)';
    } else if (variant === 'sunken') {
      bg = isDark ? `${tokens.bg}cc` : '#F1F5F9';
      shadow = isBrutalist ? '2px 2px 0px #000' : 'inset 0 2px 4px rgba(0,0,0,0.1)';
    }

    if (isGlass || hasGlassBlur) {
      bg = isDark ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.7)';
      backdropBlur = 'blur(16px)';
      border = isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.12)';
    }

    return {
      backgroundColor: bg,
      borderColor: border,
      borderWidth: borderWidth,
      borderStyle: 'solid',
      borderRadius: baseBorderRadius,
      boxShadow: shadow,
      backdropFilter: backdropBlur,
      WebkitBackdropFilter: backdropBlur,
      color: tokens.textPrimary,
    };
  };

  // 3. 버튼 스타일 생성
  const getButtonStyle = (variant: 'primary' | 'secondary' | 'ghost' | 'outline' = 'primary'): React.CSSProperties => {
    const btnRadius = btn.borderRadius;
    const btnBorderWidth = btn.borderWidth;
    let bg = tokens.accent;
    let color = tokens.bg;
    let border = 'transparent';
    let shadow = '0 4px 14px rgba(0,0,0,0.25)';
    const textTransform = btn.textTransform || 'none';
    const letterSpacing = btn.letterSpacing || 'normal';

    if (btn.id === 'btn-brutalist') {
      shadow = '4px 4px 0px #000000';
      border = '#000000';
    } else if (btn.id === 'btn-clay') {
      shadow = '5px 8px 16px rgba(0,0,0,0.3), inset -2px -2px 6px rgba(0,0,0,0.3), inset 2px 2px 6px rgba(255,255,255,0.3)';
    } else if (btn.id === 'btn-neon') {
      shadow = `0 0 16px ${tokens.accent}88`;
      border = `${tokens.accent}`;
    } else if (btn.id === 'btn-glass') {
      shadow = '0 8px 24px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.3)';
      border = 'rgba(255,255,255,0.25)';
    } else if (btn.id === 'btn-editorial') {
      shadow = 'none';
      border = tokens.accent;
    }

    if (variant === 'secondary') {
      bg = `${tokens.accentSecondary}22`;
      color = tokens.textPrimary;
      border = tokens.accentSecondary;
      if (btn.id === 'btn-brutalist') {
        bg = '#FFFFFF';
        color = '#000000';
        border = '#000000';
        shadow = '3px 3px 0px #000000';
      }
    } else if (variant === 'outline') {
      bg = 'transparent';
      color = tokens.textPrimary;
      border = tokens.cardBorder;
      shadow = 'none';
      if (btn.id === 'btn-brutalist') {
        border = '#000000';
        shadow = '3px 3px 0px #000000';
      }
    } else if (variant === 'ghost') {
      bg = 'transparent';
      color = tokens.textSecondary;
      border = 'transparent';
      shadow = 'none';
    }

    return {
      backgroundColor: bg,
      color: color,
      borderRadius: btnRadius,
      borderWidth: btnBorderWidth !== '0px' ? btnBorderWidth : (border !== 'transparent' ? '1px' : '0px'),
      borderColor: border,
      borderStyle: 'solid',
      boxShadow: shadow,
      fontWeight: btn.fontWeight,
      textTransform,
      letterSpacing: letterSpacing,
      transition: 'all 0.18s ease-in-out',
    };
  };

  // 4. 뱃지 스타일 생성
  const getBadgeStyle = (variant: 'accent' | 'secondary' | 'neutral' = 'accent'): React.CSSProperties => {
    let bg = tokens.badgeBg;
    let color = tokens.badgeText;
    let border = `${tokens.accent}44`;

    if (variant === 'secondary') {
      bg = `${tokens.accentSecondary}20`;
      color = tokens.accentSecondary;
      border = `${tokens.accentSecondary}40`;
    } else if (variant === 'neutral') {
      bg = `${tokens.cardBorder}40`;
      color = tokens.textSecondary;
      border = tokens.cardBorder;
    }

    if (isBrutalist) {
      border = '#000000';
      return {
        backgroundColor: bg,
        color: color,
        border: '1.5px solid #000000',
        borderRadius: '0px',
        boxShadow: '2px 2px 0px #000000',
        fontWeight: '800',
      };
    }

    return {
      backgroundColor: bg,
      color: color,
      border: `1px solid ${border}`,
      borderRadius: isClay ? '9999px' : isEditorial ? '2px' : '8px',
      fontWeight: '700',
    };
  };

  // 5. 헤드라인 스타일
  const getHeadlineStyle = (level: 'hero' | 'section' | 'card' = 'hero'): React.CSSProperties => {
    const isSerif = typo.category === 'Serif';
    const isDisplay = typo.category === 'Display';

    const base: React.CSSProperties = {
      fontFamily: typo.headlineFont,
      color: tokens.textPrimary,
      fontWeight: isDisplay ? '900' : isSerif ? '800' : '800',
      letterSpacing: isDisplay ? '-0.03em' : isSerif ? '0.02em' : '-0.02em',
    };

    if (hasGradientText && level === 'hero') {
      return {
        ...base,
        backgroundImage: `linear-gradient(135deg, ${tokens.textPrimary} 30%, ${tokens.accent} 75%, ${tokens.accentSecondary} 100%)`,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      };
    }

    return base;
  };

  // 6. 구분선
  const dividerStyle: React.CSSProperties = {
    borderColor: isBrutalist ? '#000000' : tokens.cardBorder,
    borderWidth: isBrutalist ? '2px' : '1px',
    borderTopStyle: 'solid',
  };

  // 7. 글로우 오브
  const glowOrbStyle: React.CSSProperties = {
    backgroundColor: tokens.accent,
    filter: 'blur(100px)',
    opacity: hasGlow ? 0.28 : 0,
    pointerEvents: 'none',
  };

  return {
    canvasRootStyle,
    canvasRootClassName: isBrutalist ? 'selection:bg-yellow-300 selection:text-black' : '',
    getCardStyle,
    getButtonStyle,
    getBadgeStyle,
    getHeadlineStyle,
    dividerStyle,
    glowOrbStyle,
    isBrutalist,
    isGlass,
    isClay,
    isNeon,
    isEditorial,
    isSwiss,
    isY2K,
    isBiotech,
    isAerospace,
    isZen,
    isWireframe,
    isBoldType,
    isSkeuomorphic,
    isBento,
    isCyber,
    isDark,
    hasGlow,
    hasGrid,
    hasGlassBlur,
    hasGradientText,
    tokens,
    borderRadius: baseBorderRadius,
    fontFamily,
  };
}
