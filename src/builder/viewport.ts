import type { Viewport } from "./model";

export const VIEWPORT_WIDTH = {
  mobile: 390,
  tablet: 768,
  desktop: 1440,
} as const;
export const MIN_VIEWPORT_WIDTH = 320;
export const MAX_VIEWPORT_WIDTH = 2560;

export function viewportForWidth(width: number): Viewport {
  return width >= 1024 ? "desktop" : width >= 768 ? "tablet" : "mobile";
}

export function previewWidth(value: Viewport | number): number {
  if (typeof value !== "number") return VIEWPORT_WIDTH[value];
  if (
    !Number.isInteger(value) ||
    value < MIN_VIEWPORT_WIDTH ||
    value > MAX_VIEWPORT_WIDTH
  )
    throw new Error("미리보기 너비는 320~2560px의 정수여야 합니다.");
  return value;
}
