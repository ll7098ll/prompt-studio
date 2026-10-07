import type { Theme, Colors } from "./theme";
import {
  DEFAULT_LAYOUT,
  editProject,
  isLocked,
  type Layout,
  type Project,
} from "./model";
import { PACK_IDS, PACK_SCOPES, type PackScope } from "./design-pack-schema";

export type DesignPack = {
  id: (typeof PACK_IDS)[number];
  code: string;
  name: string;
  description: string;
  use: string;
  mobile: string;
  spacing: number;
  scenes: string[];
  theme: Theme;
};
const colors = (
  background: string,
  surface: string,
  foreground: string,
  muted: string,
  border: string,
  primary: string,
  onPrimary: string,
  soft: string,
): Colors => ({
  background,
  surface,
  foreground,
  muted,
  border,
  primary,
  onPrimary,
  soft,
});
const night = (primary: string, soft = "#2c3036"): Colors =>
  colors(
    "#15171b",
    "#202329",
    "#f4f5f7",
    "#b4bac5",
    "#505764",
    primary,
    "#15171b",
    soft,
  );
function theme(
  name: string,
  light: Colors,
  dark: Colors,
  options: Partial<Theme> = {},
): Theme {
  return {
    name,
    mode: "light",
    light,
    dark,
    radius: 8,
    density: 1,
    font: "sans",
    headingFont: "sans",
    typography: {
      numericFont: "mono",
      bodySize: 15,
      bodyLineHeight: 1.8,
      headingMin: 32,
      headingMax: 68,
      headingWeight: 650,
      headingLineHeight: 1.14,
      headingTracking: -0.04,
    },
    surface: { texture: "plain", shadow: "none", border: "solid" },
    motion: { preset: "fade", duration: 0.7, mobile: "still" },
    ...options,
  };
}
const type = (
  font: "sans" | "serif" | "mono",
  max: number,
  weight: number,
  tracking: number,
  lineHeight = 1.12,
) => ({
  numericFont: font,
  bodySize: 15,
  bodyLineHeight: 1.85,
  headingMin: 32,
  headingMax: max,
  headingWeight: weight,
  headingLineHeight: lineHeight,
  headingTracking: tracking,
});
export const DESIGN_PACKS: DesignPack[] = [
  {
    id: "quiet-editorial",
    code: "T01",
    name: "Quiet Editorial",
    description: "종이 질감, 큰 세리프와 넉넉한 여백",
    use: "매거진 · 저널 · 브랜드 기록",
    mobile: "글과 이미지를 한 열로 읽기",
    spacing: 36,
    scenes: ["scene-photo-index", "scene-portfolio", "scene-audio-episode"],
    theme: theme(
      "Quiet Editorial",
      colors(
        "#f6f2e9",
        "#fffcf6",
        "#28291f",
        "#656456",
        "#c9c6b6",
        "#47533c",
        "#ffffff",
        "#e8e7d9",
      ),
      night("#d4d9b5", "#34382c"),
      {
        radius: 2,
        headingFont: "serif",
        typography: type("serif", 78, 400, -0.055, 1.16),
        surface: { texture: "paper", shadow: "none", border: "solid" },
      },
    ),
  },
  {
    id: "swiss-kinetic",
    code: "T02",
    name: "Swiss Kinetic",
    description: "선명한 그리드, 거대한 활자와 단색 강조",
    use: "행사 · 크리에이티브 스튜디오",
    mobile: "제목을 정지 상태로 줄바꿈",
    spacing: 20,
    scenes: ["scene-manifesto", "scene-modular-board", "scene-video-split"],
    theme: theme(
      "Swiss Kinetic",
      colors(
        "#f7f7f3",
        "#ffffff",
        "#181818",
        "#595959",
        "#898989",
        "#c52c19",
        "#ffffff",
        "#f6d8d1",
      ),
      night("#ff947f"),
      {
        radius: 0,
        typography: type("mono", 104, 850, -0.065, 1.04),
        surface: { texture: "grid", shadow: "none", border: "solid" },
        motion: { preset: "slide", duration: 0.55, mobile: "still" },
      },
    ),
  },
  {
    id: "cinematic",
    code: "T03",
    name: "Cinematic",
    description: "어두운 무대, 넓은 영상과 짧은 문장",
    use: "필름 · 캠페인 · 쇼릴",
    mobile: "포스터를 먼저 보고 눌러 재생",
    spacing: 40,
    scenes: ["scene-video-hero", "scene-video-split", "scene-video-reviews"],
    theme: theme(
      "Cinematic",
      colors(
        "#f7f5ef",
        "#ffffff",
        "#202126",
        "#63636b",
        "#c6c6cc",
        "#655130",
        "#ffffff",
        "#eee3d0",
      ),
      colors(
        "#101114",
        "#1a1c21",
        "#f9f5ec",
        "#bdb9b0",
        "#494b52",
        "#e8c99a",
        "#251e16",
        "#332d26",
      ),
      {
        mode: "dark",
        radius: 4,
        typography: type("sans", 88, 500, -0.045, 1.12),
        motion: { preset: "fade", duration: 1.2, mobile: "still" },
      },
    ),
  },
  {
    id: "product-story",
    code: "T04",
    name: "Product Story",
    description: "제품이 주인공인 넓은 화면과 절제된 설명",
    use: "제품 출시 · 기능 소개",
    mobile: "설명 다음에 미디어를 세로 배치",
    spacing: 40,
    scenes: [
      "scene-video-split",
      "scene-before-after",
      "scene-hotspot-lookbook",
    ],
    theme: theme(
      "Product Story",
      colors(
        "#f5f7fa",
        "#ffffff",
        "#1b2738",
        "#5a6677",
        "#c7d1df",
        "#2258c1",
        "#ffffff",
        "#e2eafa",
      ),
      night("#a5c9ff", "#26364c"),
      {
        radius: 24,
        typography: type("sans", 80, 700, -0.05),
        surface: { texture: "plain", shadow: "float", border: "solid" },
        motion: { preset: "scale", duration: 0.8, mobile: "still" },
      },
    ),
  },
  {
    id: "tactile-collage",
    code: "T05",
    name: "Tactile Collage",
    description: "종이 조각, 스티커와 손으로 만든 듯한 형태",
    use: "아트 · 독립 브랜드 · 페스티벌",
    mobile: "읽는 순서를 유지한 세로 콜라주",
    spacing: 28,
    scenes: ["scene-collage-hero", "scene-portfolio", "scene-audio-episode"],
    theme: theme(
      "Tactile Collage",
      colors(
        "#f4e8ce",
        "#fff7e6",
        "#302924",
        "#675543",
        "#a9987a",
        "#8c3830",
        "#ffffff",
        "#e6ceb0",
      ),
      night("#f1b697", "#46382e"),
      {
        radius: 3,
        headingFont: "serif",
        typography: type("mono", 82, 600, -0.04, 1.1),
        surface: { texture: "paper", shadow: "offset", border: "dashed" },
        motion: { preset: "lift", duration: 0.3, mobile: "still" },
      },
    ),
  },
  {
    id: "vivid-modular",
    code: "T06",
    name: "Vivid Modular",
    description: "대담한 활자, 여러 색의 큼직한 모듈",
    use: "커뮤니티 · 행사 · 서비스 요약",
    mobile: "카드 단위를 한두 열로 전환",
    spacing: 24,
    scenes: ["scene-modular-board", "scene-manifesto", "scene-retro-launch"],
    theme: theme(
      "Vivid Modular",
      colors(
        "#f4f0fb",
        "#ffffff",
        "#25143c",
        "#665675",
        "#bbaeC7",
        "#6135a4",
        "#ffffff",
        "#e6d4fa",
      ),
      night("#dbb2ff", "#3b294f"),
      {
        radius: 28,
        typography: type("sans", 92, 800, -0.055, 1.05),
        surface: { texture: "plain", shadow: "offset", border: "solid" },
        motion: { preset: "lift", duration: 0.25, mobile: "still" },
      },
    ),
  },
  {
    id: "blueprint-canvas",
    code: "T07",
    name: "Blueprint Canvas",
    description: "점 격자, 기술 라벨과 또렷한 연결 구조",
    use: "도구 소개 · 설계 · 워크플로",
    mobile: "단계와 라벨을 위에서 아래로 읽기",
    spacing: 24,
    scenes: ["scene-photo-index", "scene-modular-board", "scene-before-after"],
    theme: theme(
      "Blueprint Canvas",
      colors(
        "#f3f7fd",
        "#ffffff",
        "#143357",
        "#4e6785",
        "#aebed3",
        "#205aa5",
        "#ffffff",
        "#dce8f8",
      ),
      colors(
        "#101e31",
        "#172a42",
        "#edf5ff",
        "#a9c3e4",
        "#4c6a91",
        "#a3ceff",
        "#132d4c",
        "#243d5b",
      ),
      {
        radius: 4,
        headingFont: "mono",
        typography: type("mono", 64, 650, -0.055, 1.2),
        surface: { texture: "dots", shadow: "none", border: "solid" },
        motion: { preset: "reveal", duration: 0.7, mobile: "still" },
      },
    ),
  },
  {
    id: "commerce-lookbook",
    code: "T08",
    name: "Commerce Lookbook",
    description: "큰 이미지, 작은 라벨과 차분한 상품 디테일",
    use: "패션 · 오브젝트 · 컬렉션",
    mobile: "사진과 상세 정보를 한 열로 탐색",
    spacing: 32,
    scenes: ["scene-hotspot-lookbook", "scene-portfolio", "scene-before-after"],
    theme: theme(
      "Commerce Lookbook",
      colors(
        "#f7f5f1",
        "#ffffff",
        "#24211e",
        "#68625b",
        "#c8c0b7",
        "#51483d",
        "#ffffff",
        "#e7e1d8",
      ),
      night("#dacdb9", "#37322c"),
      {
        radius: 0,
        headingFont: "serif",
        typography: type("sans", 84, 400, -0.05, 1.15),
        motion: { preset: "fade", duration: 0.9, mobile: "still" },
      },
    ),
  },
];
export const SCOPE_LABELS: Record<PackScope, string> = {
  colors: "색상",
  typography: "서체",
  surface: "표면",
  motion: "모션",
};
const overrideKeys: Record<PackScope, (keyof Layout)[]> = {
  colors: ["fillColor", "textColor", "strokeColor"],
  typography: ["fontSize", "fontWeight", "lineHeight", "letterSpacing"],
  surface: ["cornerRadius", "shadow", "strokeWidth"],
  motion: [],
};
export function packOverrideImpact(
  project: Project,
  scopes: PackScope[],
): string[] {
  const draft = structuredClone(project);
  return resetOverrides(draft, scopes);
}
function resetOverrides(project: Project, scopes: PackScope[]): string[] {
  const impacted: string[] = [],
    keys = scopes.flatMap((scope) => overrideKeys[scope]);
  for (const node of Object.values(project.nodes)) {
    if (isLocked(project, node.id)) continue;
    const original = JSON.stringify(node);
    const reset = (layout: Partial<Layout>, base = false) => {
      for (const key of keys)
        if (Object.hasOwn(layout, key)) {
          if (base) Object.assign(layout, { [key]: DEFAULT_LAYOUT[key] });
          else delete layout[key];
        }
    };
    reset(node.layout, true);
    Object.values(node.responsive).forEach((value) => reset(value));
    for (const part of Object.values(node.parts ?? {})) {
      reset(part.layout);
      Object.values(part.responsive).forEach((value) => reset(value));
      for (const value of [part.layout, ...Object.values(part.responsive)]) {
        if (scopes.includes("typography")) delete value.fontFamily;
        if (scopes.includes("colors")) {
          delete value.svgFill;
          delete value.svgStroke;
        }
        if (scopes.includes("surface")) {
          delete value.svgStrokeWidth;
          delete value.borderTopLeftRadius;
          delete value.borderTopRightRadius;
          delete value.borderBottomLeftRadius;
          delete value.borderBottomRightRadius;
        }
      }
    }
    if (scopes.includes("motion") && node.appearance)
      delete node.appearance.motion;
    if (
      scopes.includes("colors") &&
      scopes.includes("surface") &&
      node.appearance
    )
      delete node.appearance.family;
    if (JSON.stringify(node) !== original) impacted.push(node.name);
  }
  return impacted;
}
export function applyDesignPack(
  project: Project,
  pack: DesignPack,
  scopes: PackScope[] = [...PACK_SCOPES],
  reset = false,
): Project {
  return editProject(project, (draft) => {
    const target = draft.theme,
      source = pack.theme;
    target.packSources ??= {};
    for (const scope of scopes) target.packSources[scope] = pack.id;
    if (scopes.includes("colors")) {
      target.light = structuredClone(source.light);
      target.dark = structuredClone(source.dark);
    }
    if (scopes.includes("typography")) {
      target.font = source.font;
      target.headingFont = source.headingFont;
      target.typography = structuredClone(source.typography);
      if (reset) {
        delete target.bodyFontAsset;
        delete target.headingFontAsset;
      }
    }
    if (scopes.includes("surface")) {
      target.radius = source.radius;
      target.surface = structuredClone(source.surface);
    }
    if (scopes.includes("motion"))
      target.motion = structuredClone(source.motion);
    if (scopes.length === PACK_SCOPES.length) target.name = pack.name;
    if (reset) resetOverrides(draft, scopes);
    // Mode, density, document structure and authored values are intentionally retained.
  });
}
