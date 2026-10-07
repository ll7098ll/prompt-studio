import { z } from "zod";
import { MOTIONS } from "./visual-presets";

export const PACK_IDS = [
  "quiet-editorial",
  "swiss-kinetic",
  "cinematic",
  "product-story",
  "tactile-collage",
  "vivid-modular",
  "blueprint-canvas",
  "commerce-lookbook",
] as const;
export const PACK_SCOPES = [
  "colors",
  "typography",
  "surface",
  "motion",
] as const;
export type PackScope = (typeof PACK_SCOPES)[number];
export const typographySchema = z
  .strictObject({
    numericFont: z.enum(["sans", "serif", "mono"]),
    bodySize: z.number().min(12).max(22),
    bodyLineHeight: z.number().min(1.2).max(2.2),
    headingMin: z.number().min(24).max(64),
    headingMax: z.number().min(32).max(120),
    headingWeight: z.number().int().min(300).max(900),
    headingLineHeight: z.number().min(1).max(1.6),
    headingTracking: z.number().min(-0.1).max(0.15),
  })
  .refine(
    (value) => value.headingMin <= value.headingMax,
    "제목의 최소 크기는 최대 크기보다 작아야 합니다.",
  );
export const surfaceSchema = z.strictObject({
  texture: z.enum(["plain", "paper", "dots", "grid"]),
  shadow: z.enum(["none", "soft", "offset", "float"]),
  border: z.enum(["solid", "dashed"]),
});
export const themeMotionSchema = z.strictObject({
  preset: z.enum(MOTIONS.map((item) => item[0])),
  duration: z.number().min(0.15).max(3),
  mobile: z.enum(["still", "inherit"]),
});
export const packSourcesSchema = z.strictObject({
  colors: z.enum(PACK_IDS).optional(),
  typography: z.enum(PACK_IDS).optional(),
  surface: z.enum(PACK_IDS).optional(),
  motion: z.enum(PACK_IDS).optional(),
});
export type PackTypography = z.infer<typeof typographySchema>;
export type PackSurface = z.infer<typeof surfaceSchema>;
export type PackMotion = z.infer<typeof themeMotionSchema>;
