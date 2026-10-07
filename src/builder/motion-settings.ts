import { z } from "zod";
import type { Node } from "./model";
import type { Theme } from "./theme";
import type { MotionId } from "./visual-presets";

export const motionSettingsSchema = z
  .strictObject({
    duration: z.number().min(0.1).max(20).optional(),
    delay: z.number().min(0).max(10).optional(),
    iterations: z.number().int().min(0).max(100).optional(),
    intensity: z.number().min(0).max(2).optional(),
    easing: z
      .enum(["ease", "linear", "ease-in", "ease-out", "ease-in-out"])
      .optional(),
    trigger: z.enum(["load", "view", "hover", "press", "scroll"]).optional(),
    once: z.boolean().optional(),
    threshold: z.number().min(0).max(1).optional(),
    mobile: z.enum(["inherit", "still"]).optional(),
    stagger: z.number().min(0).max(0.5).optional(),
    scrollStart: z.number().min(0).max(99).optional(),
    scrollEnd: z.number().min(1).max(100).optional(),
  })
  .refine(
    (value) => (value.scrollEnd ?? 100) > (value.scrollStart ?? 0),
    "스크롤 종료 지점은 시작 지점보다 커야 합니다.",
  );
export type MotionSettings = z.infer<typeof motionSettingsSchema>;
export const RUNTIME_MOTIONS = [
  "words",
  "mask",
  "parallax",
  "scroll-zoom",
] as const;
export const isRuntimeMotion = (id: MotionId) =>
  (RUNTIME_MOTIONS as readonly string[]).includes(id);
const durations: Record<string, number> = {
  fade: 0.7,
  slide: 0.7,
  scale: 0.6,
  float: 3,
  pulse: 2,
  shimmer: 3,
  gradient: 5,
  border: 2.5,
  tilt: 0.25,
  lift: 0.25,
  reveal: 0.8,
  glow: 3,
  words: 0.7,
  mask: 1,
  parallax: 1,
  "scroll-zoom": 1,
};
const loops = new Set([
  "float",
  "pulse",
  "shimmer",
  "gradient",
  "border",
  "glow",
]);
export function resolveMotion(node: Node, theme: Theme) {
  const inherited = node.appearance?.motion === undefined;
  const preset =
    node.appearance?.motion ??
    (["heading", "image", "feature", "stat"].includes(node.component)
      ? theme.motion?.preset
      : undefined) ??
    "none";
  const settings = node.appearance?.motionSettings;
  return {
    preset,
    source: inherited ? ("pack" as const) : ("node" as const),
    duration:
      settings?.duration ??
      (inherited ? theme.motion?.duration : undefined) ??
      durations[preset] ??
      0.7,
    delay: settings?.delay ?? 0,
    iterations: settings?.iterations ?? (loops.has(preset) ? 0 : 1),
    intensity: settings?.intensity ?? 1,
    easing:
      settings?.easing ??
      (preset === "shimmer"
        ? "linear"
        : preset === "float" || preset === "pulse"
          ? "ease-in-out"
          : "ease"),
    trigger:
      settings?.trigger ??
      (["tilt", "lift"].includes(preset)
        ? "hover"
        : ["parallax", "scroll-zoom"].includes(preset)
          ? "scroll"
          : "load"),
    once: settings?.once ?? true,
    threshold: settings?.threshold ?? 0,
    mobile:
      settings?.mobile ??
      (inherited ? theme.motion?.mobile : undefined) ??
      "inherit",
    stagger: settings?.stagger ?? 0.06,
    scrollStart: settings?.scrollStart ?? 0,
    scrollEnd: settings?.scrollEnd ?? 100,
  };
}
export type ResolvedMotion = ReturnType<typeof resolveMotion>;
export function motionVariables(motion: ResolvedMotion) {
  return {
    "--motion-duration": `${motion.duration}s`,
    "--motion-delay": `${motion.delay}s`,
    "--motion-iterations":
      motion.trigger === "scroll"
        ? "1"
        : motion.iterations === 0
          ? "infinite"
          : String(motion.iterations),
    "--motion-easing": motion.easing,
    "--motion-distance": `${20 * motion.intensity}px`,
    "--motion-float": `${-8 * motion.intensity}px`,
    "--motion-lift": `${-6 * motion.intensity}px`,
    "--motion-tilt": `${2 * motion.intensity}deg`,
    "--motion-scale": 1 - 0.08 * motion.intensity,
    "--motion-pulse": 1 - 0.3 * motion.intensity,
    "--motion-glow": `${24 * motion.intensity}px`,
    "--motion-outline": `${2 * motion.intensity}px`,
    "--motion-start-opacity": Math.max(0, 1 - motion.intensity),
    "--motion-travel": `${100 * motion.intensity}%`,
    "--motion-mask": `${Math.min(100, 100 * motion.intensity)}%`,
  };
}
export function scrollMotionProgress(
  top: number,
  height: number,
  viewportHeight: number,
  start = 0,
  end = 100,
) {
  const total = (viewportHeight - top) / Math.max(1, viewportHeight + height);
  return Math.max(
    0,
    Math.min(1, (total - start / 100) / Math.max(0.01, (end - start) / 100)),
  );
}
