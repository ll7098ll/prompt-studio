import type { Asset } from "./asset-model";

/** Asset ids are validated hashes; URLs come only from owned blobs or archive paths. */
export function assetFontCSS(
  assets: Record<string, Asset>,
  resolve: (id: string) => string | undefined,
) {
  return Object.values(assets)
    .filter((asset) => asset.kind === "font")
    .flatMap((asset) => {
      const url = resolve(asset.id);
      return url
        ? [
            `@font-face{font-family:"StudioAsset_${asset.id}";src:url("${url}") format("woff2");font-display:swap;}`,
          ]
        : [];
    })
    .join("\n");
}

export function blobDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () =>
      reject(Error("파일을 이미지에 포함하지 못했습니다."));
    reader.readAsDataURL(blob);
  });
}
