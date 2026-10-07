import { z } from "zod";
import { referencedAssetId, safeMediaURL } from "./asset-model";
export const partAttributesSchema = z.strictObject({
  src: z
    .string()
    .max(20000)
    .refine(
      (value) => !value || !!referencedAssetId(value) || !!safeMediaURL(value),
      "이미지는 자산 또는 HTTPS 주소를 사용하세요.",
    )
    .optional(),
  alt: z.string().max(2000).optional(),
  title: z.string().max(2000).optional(),
  placeholder: z.string().max(2000).optional(),
  href: z
    .string()
    .max(2000)
    .refine(
      (value) =>
        !value ||
        /^(https?:\/\/|mailto:|tel:|#|\/(?!\/))[^\s<>]*$/i.test(value),
      "올바른 링크를 입력하세요.",
    )
    .optional(),
});
const color = z
  .string()
  .regex(
    /^(|none|currentColor|#[0-9a-fA-F]{6}|theme:(background|surface|foreground|muted|border|primary|onPrimary|soft))$/,
  );
const space = () => z.number().min(0).max(1000).optional();
export const partFields = {
  paddingTop: space(),
  paddingRight: space(),
  paddingBottom: space(),
  paddingLeft: space(),
  marginTop: space(),
  marginRight: space(),
  marginBottom: space(),
  marginLeft: space(),
  borderTopLeftRadius: space(),
  borderTopRightRadius: space(),
  borderBottomLeftRadius: space(),
  borderBottomRightRadius: space(),
  fontFamily: z
    .enum(["inherit", "body", "heading", "numeric", "sans", "serif", "mono"])
    .optional(),
  display: z
    .enum(["original", "block", "inline-block", "flex", "grid", "none"])
    .optional(),
  overflow: z.enum(["original", "visible", "hidden", "auto"]).optional(),
  svgFill: color.optional(),
  svgStroke: color.optional(),
  svgStrokeWidth: z.number().min(0).max(30).optional(),
};
