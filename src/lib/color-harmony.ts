/**
 * Adobe Color (CC) 스타일의 색채학 조화(Color Harmony) 계산 및 팔레트 생성 엔진
 */

export interface HSL {
  h: number; // 0 ~ 360
  s: number; // 0 ~ 100
  l: number; // 0 ~ 100
}

export interface RGB {
  r: number; // 0 ~ 255
  g: number; // 0 ~ 255
  b: number; // 0 ~ 255
}

export type HarmonyMode = 
  | 'complementary'       // 보색 (180도)
  | 'analogous'           // 유사색 (±30도)
  | 'triadic'             // 3분할 (120도, 240도)
  | 'split-complementary' // 분할 보색 (150도, 210도)
  | 'monochromatic';      // 단색 (동일 색상, 명도/채도 계조)

export interface PaletteTokens {
  bg: string;
  cardBg: string;
  cardBorder: string;
  accent: string;
  accentSecondary: string;
  textPrimary: string;
  textSecondary: string;
  badgeBg: string;
  badgeText: string;
}

// 1. HEX <-> RGB 변환
export function hexToRgb(hex: string): RGB {
  let clean = hex.replace('#', '').trim();
  if (clean.length === 3) {
    clean = clean.split('').map(c => c + c).join('');
  }
  const num = parseInt(clean, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(rgb: RGB): string {
  const toHex = (n: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(n)));
    return clamped.toString(16).padStart(2, '0').toUpperCase();
  };
  return `#${toHex(rgb.r)}${toHex(rgb.g)}${toHex(rgb.b)}`;
}

// 2. RGB <-> HSL 변환
export function rgbToHsl(rgb: RGB): HSL {
  const r = rgb.r / 255;
  const g = rgb.g / 255;
  const b = rgb.b / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h *= 60;
  }

  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

export function hslToRgb(hsl: HSL): RGB {
  const h = ((hsl.h % 360) + 360) % 360 / 360;
  const s = Math.max(0, Math.min(100, hsl.s)) / 100;
  const l = Math.max(0, Math.min(100, hsl.l)) / 100;

  if (s === 0) {
    const val = Math.round(l * 255);
    return { r: val, g: val, b: val };
  }

  const hue2rgb = (p: number, q: number, t: number) => {
    let tAdj = t;
    if (tAdj < 0) tAdj += 1;
    if (tAdj > 1) tAdj -= 1;
    if (tAdj < 1 / 6) return p + (q - p) * 6 * tAdj;
    if (tAdj < 1 / 2) return q;
    if (tAdj < 2 / 3) return p + (q - p) * (2 / 3 - tAdj) * 6;
    return p;
  };

  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;

  return {
    r: Math.round(hue2rgb(p, q, h + 1 / 3) * 255),
    g: Math.round(hue2rgb(p, q, h) * 255),
    b: Math.round(hue2rgb(p, q, h - 1 / 3) * 255),
  };
}

export function hexToHsl(hex: string): HSL {
  return rgbToHsl(hexToRgb(hex));
}

export function hslToHex(hsl: HSL): string {
  return rgbToHex(hslToRgb(hsl));
}

// 3. 상대 휘도 및 WCAG 명도 대비율 계산
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  const a = [rgb.r, rgb.g, rgb.b].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

export function getContrastRatio(hex1: string, hex2: string): number {
  const lum1 = getLuminance(hex1);
  const lum2 = getLuminance(hex2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return Number(((brightest + 0.05) / (darkest + 0.05)).toFixed(2));
}

// 4. 어도비 색채학 조화 규칙 기반 5대 디자인 토큰 자동 생성
export function generateHarmonyPalette(
  seedHex: string,
  mode: HarmonyMode,
  themeType: 'dark' | 'light' = 'dark'
): PaletteTokens {
  const seedHsl = hexToHsl(seedHex);
  const isDark = themeType === 'dark';

  let accentSecondaryH = (seedHsl.h + 180) % 360; // 기본 보색

  switch (mode) {
    case 'complementary':
      accentSecondaryH = (seedHsl.h + 180) % 360;
      break;
    case 'analogous':
      accentSecondaryH = (seedHsl.h + 35) % 360;
      break;
    case 'triadic':
      accentSecondaryH = (seedHsl.h + 120) % 360;
      break;
    case 'split-complementary':
      accentSecondaryH = (seedHsl.h + 150) % 360;
      break;
    case 'monochromatic':
      accentSecondaryH = seedHsl.h;
      break;
  }

  // 1차 포인트 (Primary Accent): 생생한 채도 보장
  const primaryAccentHsl: HSL = {
    h: seedHsl.h,
    s: Math.max(65, Math.min(95, seedHsl.s)),
    l: isDark ? Math.max(48, Math.min(65, seedHsl.l)) : Math.max(35, Math.min(50, seedHsl.l)),
  };
  const accent = hslToHex(primaryAccentHsl);

  // 2차 서브 포인트 (Secondary Accent)
  const secondaryAccentHsl: HSL = {
    h: accentSecondaryH,
    s: mode === 'monochromatic' ? Math.max(30, seedHsl.s - 25) : Math.max(70, Math.min(95, seedHsl.s)),
    l: mode === 'monochromatic' 
      ? (isDark ? 75 : 30)
      : (isDark ? Math.max(55, Math.min(70, seedHsl.l)) : Math.max(40, Math.min(55, seedHsl.l))),
  };
  const accentSecondary = hslToHex(secondaryAccentHsl);

  if (isDark) {
    // 딥 다크 모드 캔버스 배색 (High-Tech, OLED)
    // 배경은 씨드 컬러의 색상을 5~8% 은은하게 머금은 고급스러운 심야 톤
    const bg = hslToHex({ h: seedHsl.h, s: 20, l: 6 });
    const cardBg = hslToHex({ h: seedHsl.h, s: 22, l: 11 });
    const cardBorder = hslToHex({ h: seedHsl.h, s: 25, l: 18 });
    const textPrimary = '#F8FAFC';
    const textSecondary = hslToHex({ h: seedHsl.h, s: 15, l: 65 });
    const badgeBg = `rgba(${hexToRgb(accent).r}, ${hexToRgb(accent).g}, ${hexToRgb(accent).b}, 0.16)`;
    const badgeText = hslToHex({ h: seedHsl.h, s: 85, l: 70 });

    return {
      bg,
      cardBg,
      cardBorder,
      accent,
      accentSecondary,
      textPrimary,
      textSecondary,
      badgeBg,
      badgeText,
    };
  } else {
    // 클린 라이트 모드 캔버스 배색 (Editorial, Modern Clean)
    const bg = hslToHex({ h: seedHsl.h, s: 12, l: 97 });
    const cardBg = '#FFFFFF';
    const cardBorder = hslToHex({ h: seedHsl.h, s: 15, l: 88 });
    const textPrimary = hslToHex({ h: seedHsl.h, s: 30, l: 10 });
    const textSecondary = hslToHex({ h: seedHsl.h, s: 15, l: 42 });
    const badgeBg = `rgba(${hexToRgb(accent).r}, ${hexToRgb(accent).g}, ${hexToRgb(accent).b}, 0.12)`;
    const badgeText = accent;

    return {
      bg,
      cardBg,
      cardBorder,
      accent,
      accentSecondary,
      textPrimary,
      textSecondary,
      badgeBg,
      badgeText,
    };
  }
}

// 5. 인기 무드별 추천 씨드 컬러 세트
export const CURATED_SEED_COLORS = [
  { name: '에메랄드 핀테크', hex: '#10B981', mood: '성장 & 신뢰 테크' },
  { name: '일렉트릭 사이언', hex: '#06B6D4', mood: '혁신 & 클라우드 SaaS' },
  { name: '사이버 네온 퍼플', hex: '#8B5CF6', mood: 'AI & 차세대 크리에이티브' },
  { name: '선셋 코랄 오렌지', hex: '#F97316', mood: '열정 & 마케팅 전환율' },
  { name: '로열 샴페인 골드', hex: '#EAB308', mood: '럭셔리 & 프리미엄 자산' },
  { name: '비비드 핫핑크', hex: '#EC4899', mood: '팝아트 & Z세대 트렌드' },
  { name: '세이지 내추럴 그린', hex: '#84CC16', mood: '친환경 & 웰빙 라이프' },
  { name: '미드나잇 울트라 마린', hex: '#3B82F6', mood: '엔터프라이즈 신뢰감' },
];
