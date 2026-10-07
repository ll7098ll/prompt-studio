import type { PackTypography, PackSurface, PackMotion, PACK_IDS } from "./design-pack-schema";
export type Colors = {
  background: string;
  surface: string;
  foreground: string;
  muted: string;
  border: string;
  primary: string;
  onPrimary: string;
  soft: string;
};
export type Theme = {
  name: string;
  mode: "light" | "dark";
  light: Colors;
  dark: Colors;
  radius: number;
  density: number;
  font: "sans" | "serif" | "mono";
  headingFont?: "sans" | "serif" | "mono";
  bodyFontAsset?: string;
  headingFontAsset?: string;
  typography?: PackTypography;
  surface?: PackSurface;
  motion?: PackMotion;
  packSources?: Partial<Record<"colors" | "typography" | "surface" | "motion", typeof PACK_IDS[number]>>;
};
const dark: Colors = {
  background: "#15171b",
  surface: "#202329",
  foreground: "#f4f5f7",
  muted: "#a7aebc",
  border: "#383e48",
  primary: "#a5b4fc",
  onPrimary: "#1e1b4b",
  soft: "#30334b",
};
const light: Colors = {
  background: "#fbfaf8",
  surface: "#ffffff",
  foreground: "#24262b",
  muted: "#686c76",
  border: "#e4e3e0",
  primary: "#536448",
  onPrimary: "#ffffff",
  soft: "#eaf0e5",
};
export const THEME_PRESETS: Theme[] = [
  {
    name: "올리브 스튜디오",
    mode: "light",
    light,
    dark: {
      ...dark,
      primary: "#b5cc9e",
      onPrimary: "#202a19",
      soft: "#293426",
    },
    radius: 16,
    density: 1,
    font: "sans",
  },
  {
    name: "인디고 클라우드",
    mode: "light",
    light: {
      ...light,
      background: "#f8f9ff",
      primary: "#4f46e5",
      soft: "#eeecff",
    },
    dark,
    radius: 12,
    density: 1,
    font: "sans",
  },
  {
    name: "웜 에디토리얼",
    mode: "light",
    light: {
      ...light,
      background: "#faf4ed",
      surface: "#fffaf5",
      primary: "#a04630",
      foreground: "#392b24",
      soft: "#f3e1d5",
      border: "#e8d8c9",
      muted: "#79695e",
    },
    dark: {
      ...dark,
      background: "#241f1c",
      surface: "#302924",
      primary: "#edb090",
      soft: "#4b342a",
      onPrimary: "#2c1a12",
    },
    radius: 4,
    density: 1.15,
    font: "serif",
  },
  {
    name: "모노 그래픽",
    mode: "light",
    light: {
      ...light,
      background: "#ffffff",
      primary: "#18181b",
      soft: "#f1f1f2",
      foreground: "#18181b",
    },
    dark: {
      ...dark,
      primary: "#f4f4f5",
      onPrimary: "#18181b",
      soft: "#353538",
    },
    radius: 0,
    density: 0.9,
    font: "sans",
  },
  {
    name: "오션 블루",
    mode: "light",
    light: {
      ...light,
      background: "#f3f9fc",
      primary: "#036a90",
      soft: "#ddf2fa",
      border: "#d7e6ed",
    },
    dark: {
      ...dark,
      primary: "#7dd3fc",
      onPrimary: "#082f49",
      soft: "#17374a",
    },
    radius: 24,
    density: 1,
    font: "sans",
  },
  {
    name: "로즈 페이퍼",
    mode: "light",
    light: {
      ...light,
      background: "#fff8fa",
      primary: "#a83762",
      soft: "#fce5ed",
      border: "#efdce3",
    },
    dark: {
      ...dark,
      primary: "#f5abc7",
      onPrimary: "#4b1530",
      soft: "#422735",
    },
    radius: 20,
    density: 1,
    font: "sans",
  },
];
THEME_PRESETS.push(
  {
    name: "코랄 팝",
    mode: "light",
    radius: 28,
    density: 1.1,
    font: "sans",
    light: {
      ...light,
      background: "#fff5f0",
      primary: "#b83227",
      soft: "#ffdbce",
      foreground: "#341d23",
      border: "#edc7bb",
      muted: "#775d59",
    },
    dark: {
      ...dark,
      background: "#24171a",
      surface: "#342326",
      primary: "#ff9a83",
      onPrimary: "#3b1912",
      soft: "#57302c",
    },
  },
  {
    name: "볼드 옐로",
    mode: "light",
    radius: 0,
    density: 1,
    font: "sans",
    light: {
      background: "#fae34e",
      surface: "#fffef6",
      foreground: "#171717",
      muted: "#514923",
      border: "#171717",
      primary: "#171717",
      onPrimary: "#fae34e",
      soft: "#fff4a1",
    },
    dark: {
      ...dark,
      background: "#191914",
      surface: "#26261d",
      primary: "#fae34e",
      onPrimary: "#171717",
      soft: "#414025",
      border: "#a1a16f",
    },
  },
  {
    name: "미드나잇 시안",
    mode: "dark",
    radius: 20,
    density: 1,
    font: "sans",
    light: {
      ...light,
      background: "#f0f9fc",
      primary: "#066c83",
      soft: "#d7f3fa",
      foreground: "#182a3a",
      border: "#c6dfe8",
    },
    dark: {
      background: "#080f1d",
      surface: "#111e30",
      foreground: "#eff9ff",
      muted: "#a0b5ca",
      border: "#2a3c53",
      primary: "#6fe9ed",
      onPrimary: "#092d37",
      soft: "#163845",
    },
  },
  {
    name: "레트로 민트",
    mode: "dark",
    radius: 2,
    density: 1,
    font: "mono",
    light: {
      ...light,
      background: "#f0fff5",
      primary: "#24654e",
      soft: "#cbf2d9",
      border: "#94bba4",
      foreground: "#173d2c",
      muted: "#557160",
    },
    dark: {
      background: "#131b19",
      surface: "#1c2924",
      foreground: "#deffed",
      muted: "#9cb9aa",
      border: "#344e40",
      primary: "#a8f6ba",
      onPrimary: "#153a21",
      soft: "#314a3b",
    },
  },
  {
    name: "라일락 콜라주",
    mode: "light",
    radius: 32,
    density: 1.1,
    font: "sans",
    light: {
      ...light,
      background: "#f8f0ff",
      surface: "#fffafd",
      primary: "#7338a6",
      soft: "#e9d5fa",
      foreground: "#331f47",
      muted: "#765e88",
      border: "#ddc7ed",
    },
    dark: {
      ...dark,
      background: "#21162d",
      surface: "#30213f",
      primary: "#d5a4ff",
      onPrimary: "#321149",
      soft: "#49325b",
    },
  },
  {
    name: "포레스트 리빙",
    mode: "light",
    radius: 8,
    density: 1.15,
    font: "serif",
    light: {
      ...light,
      background: "#f4f5ee",
      surface: "#fffffa",
      foreground: "#283a2f",
      muted: "#637269",
      primary: "#30624a",
      soft: "#dce8d6",
      border: "#cfd9cb",
    },
    dark: {
      ...dark,
      background: "#17221c",
      surface: "#233329",
      primary: "#b4d4a8",
      onPrimary: "#1b3521",
      soft: "#354d38",
    },
  },
);
export const FONT_STACKS = {
  sans: 'Arial, "Malgun Gothic", sans-serif',
  serif: 'Georgia, "Batang", serif',
  mono: 'Consolas, "Malgun Gothic", monospace',
};
export function themeVariables(theme: Theme): Record<string, string> {
  const colors = theme[theme.mode];
  return {
    ...Object.fromEntries(
      Object.entries(colors).map(([key, value]) => [`--ui-${key}`, value]),
    ),
    "--ui-radius": `${theme.radius}px`,
    "--ui-space": `${24 * theme.density}px`,
    "--ui-font": theme.bodyFontAsset ? `"StudioAsset_${theme.bodyFontAsset}", ${FONT_STACKS[theme.font]}` : FONT_STACKS[theme.font],
    "--ui-heading-font": theme.headingFontAsset ? `"StudioAsset_${theme.headingFontAsset}", ${FONT_STACKS[theme.headingFont ?? theme.font]}` : FONT_STACKS[theme.headingFont ?? theme.font],
    "--ui-numeric-font": FONT_STACKS[theme.typography?.numericFont ?? "sans"],
    ...(theme.typography ? {
      "--pack-body-size": `${theme.typography.bodySize}px`,
      "--pack-body-leading": String(theme.typography.bodyLineHeight),
      "--pack-heading-size": `clamp(${theme.typography.headingMin}px, 6.2vw, ${theme.typography.headingMax}px)`,
      "--pack-heading-weight": String(theme.typography.headingWeight),
      "--pack-heading-leading": String(theme.typography.headingLineHeight),
      "--pack-heading-tracking": `${theme.typography.headingTracking}em`,
    } : {}),
    ...(theme.surface ? {
      "--pack-shadow": { none: "none", soft: "0 8px 24px #0000000d", offset: "5px 5px 0 color-mix(in srgb,var(--ui-foreground) 16%,transparent)", float: "0 24px 64px #13274416" }[theme.surface.shadow],
      "--pack-border-style": theme.surface.border,
    } : {}),
    ...(theme.motion ? { "--pack-motion-duration": `${theme.motion.duration}s` } : {}),
  };
}
export function themeCSS(theme: Theme): string {
  return `:root {\n${Object.entries(themeVariables(theme))
    .map(([key, value]) => `  ${key}: ${value};`)
    .join("\n")}\n}\n`;
}
