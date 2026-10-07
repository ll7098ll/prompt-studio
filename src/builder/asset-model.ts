import { z } from "zod";

export const ASSET_LIMIT = 150_000_000;
export const ASSET_COUNT_LIMIT = 300;
export const assetIdSchema = z.string().regex(/^asset-[a-f0-9]{64}$/);
export const assetSchema = z
  .strictObject({
    id: assetIdSchema,
    name: z.string().min(1).max(160),
    kind: z.enum(["image", "video", "audio", "font", "captions"]),
    mime: z.enum([
      "image/png",
      "image/jpeg",
      "image/webp",
      "image/avif",
      "video/mp4",
      "video/webm",
      "audio/mpeg",
      "audio/wav",
      "audio/ogg",
      "audio/mp4",
      "audio/webm",
      "font/woff2",
      "text/vtt",
    ]),
    bytes: z.number().int().positive().max(50_000_000),
    sha256: z.string().regex(/^[a-f0-9]{64}$/),
    source: z.literal("local"),
    createdAt: z.string().datetime(),
    description: z.string().max(2000).default(""),
    credit: z.string().max(1000).default(""),
    width: z.number().int().positive().max(50000).optional(),
    height: z.number().int().positive().max(50000).optional(),
    duration: z.number().finite().nonnegative().max(86400).optional(),
  })
  .superRefine((asset, ctx) => {
    if (asset.id !== `asset-${asset.sha256}`)
      ctx.addIssue({
        code: "custom",
        message: "자산 식별자가 파일 지문과 일치하지 않습니다.",
      });
    if (kindForMime(asset.mime) !== asset.kind)
      ctx.addIssue({
        code: "custom",
        message: "자산 종류가 파일 형식과 일치하지 않습니다.",
      });
    if (asset.bytes > maxAssetBytes(asset.kind))
      ctx.addIssue({
        code: "custom",
        message: "자산 파일이 허용 크기를 초과합니다.",
      });
  });
export type Asset = z.infer<typeof assetSchema>;
export const assetsSchema = z
  .record(assetIdSchema, assetSchema)
  .superRefine((assets, ctx) => {
    const values = Object.values(assets);
    if (
      values.length > ASSET_COUNT_LIMIT ||
      values.reduce((sum, a) => sum + a.bytes, 0) > ASSET_LIMIT
    )
      ctx.addIssue({
        code: "custom",
        message: "프로젝트 자산은 300개, 총 150MB까지 저장할 수 있습니다.",
      });
    for (const [id, asset] of Object.entries(assets))
      if (id !== asset.id)
        ctx.addIssue({
          code: "custom",
          message: "자산 참조가 올바르지 않습니다.",
        });
  });
export function kindForMime(mime: string): Asset["kind"] {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) return "audio";
  return mime === "font/woff2" ? "font" : "captions";
}
export function maxAssetBytes(kind: Asset["kind"]) {
  return kind === "video" || kind === "audio"
    ? 50_000_000
    : kind === "captions"
      ? 1_000_000
      : 10_000_000;
}
export async function sha256(bytes: ArrayBuffer) {
  return [...new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}
// Detect the file signature; extensions disambiguate M4A/WebA and VTT containers.
export async function inspectAsset(file: Blob, name: string): Promise<Asset> {
  if (!file.size || file.size > 50_000_000)
    throw Error("빈 파일 또는 50MB보다 큰 파일은 등록할 수 없습니다.");
  const bytes = new Uint8Array(await file.slice(0, 4096).arrayBuffer());
  const ascii = (at: number, length: number) =>
    String.fromCharCode(...bytes.slice(at, at + length));
  const ext = name.split(".").at(-1)?.toLowerCase();
  let mime = "";
  if (
    bytes[0] === 137 &&
    ascii(1, 3) === "PNG" &&
    bytes[4] === 13 &&
    bytes[5] === 10
  )
    mime = "image/png";
  else if (bytes[0] === 255 && bytes[1] === 216 && bytes[2] === 255)
    mime = "image/jpeg";
  else if (ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP")
    mime = "image/webp";
  else if (ascii(4, 4) === "ftyp") {
    const brands = ascii(8, 48);
    mime = /avif|avis/.test(brands)
      ? "image/avif"
      : ext === "m4a"
        ? "audio/mp4"
        : "video/mp4";
  } else if (
    bytes[0] === 26 &&
    bytes[1] === 69 &&
    bytes[2] === 223 &&
    bytes[3] === 163 &&
    ascii(0, bytes.length).includes("webm")
  )
    mime = ext === "weba" ? "audio/webm" : "video/webm";
  else if (
    ascii(0, 3) === "ID3" ||
    (bytes[0] === 255 && (bytes[1] & 0xe0) === 0xe0)
  )
    mime = "audio/mpeg";
  else if (ascii(0, 4) === "RIFF" && ascii(8, 4) === "WAVE") mime = "audio/wav";
  else if (ascii(0, 4) === "OggS") mime = "audio/ogg";
  else if (ascii(0, 4) === "wOF2") mime = "font/woff2";
  else if (
    ext === "vtt" &&
    /^\uFEFF?WEBVTT(?:\s|$)/.test(new TextDecoder().decode(bytes))
  )
    mime = "text/vtt";
  if (!mime)
    throw Error(
      "지원하지 않는 파일입니다. PNG·JPEG·WebP·AVIF, MP4·WebM, MP3·WAV·OGG·M4A, WOFF2, VTT를 사용하세요.",
    );
  const kind = kindForMime(mime);
  if (file.size > maxAssetBytes(kind))
    throw Error(
      `${kind === "captions" ? "자막은 1MB" : "이미지와 폰트는 10MB"}까지 등록할 수 있습니다.`,
    );
  const hash = await sha256(await file.arrayBuffer());
  return assetSchema.parse({
    id: `asset-${hash}`,
    name: name.slice(0, 160) || "자산",
    kind,
    mime,
    bytes: file.size,
    sha256: hash,
    source: "local",
    createdAt: new Date().toISOString(),
    description: "",
    credit: "",
  });
}
export const assetRef = (id: string) => `asset:${id}`;
export function referencedAssetId(ref: string) {
  return ref.startsWith("asset:") ? ref.slice(6) : undefined;
}
export function safeMediaURL(ref: string) {
  if (/^\/studio-assets\/[a-zA-Z0-9/_.-]+$/.test(ref) && !ref.includes(".."))
    return ref;
  try {
    const url = new URL(ref);
    return url.protocol === "https:" && !url.username && !url.password
      ? url.href
      : "";
  } catch {
    return "";
  }
}
