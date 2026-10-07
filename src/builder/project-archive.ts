import JSZip from "jszip";
import { parseProjectText, type Project } from "./model";
import { getAssetBlob, type AssetBytes } from "./asset-repository";
import { ASSET_LIMIT, assetsSchema, inspectAsset, sha256 } from "./asset-model";

export const ARCHIVE_LIMIT = 200_000_000;
type BlobReader = (id: string) => Promise<Blob | undefined>;
export async function appendAssetsToZip(
  zip: JSZip,
  project: Project,
  read: BlobReader = getAssetBlob,
) {
  const metadata = assetsSchema.parse(project.assets);
  for (const asset of Object.values(metadata)) {
    const blob = await read(asset.id);
    if (!blob)
      throw Error(
        `${asset.name} 원본이 없습니다. 자산 패널에서 같은 파일을 다시 등록한 뒤 백업하세요.`,
      );
    const bytes = await blob.arrayBuffer();
    if (
      bytes.byteLength !== asset.bytes ||
      (await sha256(bytes)) !== asset.sha256
    )
      throw Error(`${asset.name} 원본을 검증하지 못했습니다.`);
    zip.file(`assets/${asset.id}`, bytes, { compression: "STORE" });
  }
  zip.file(
    "assets/manifest.json",
    JSON.stringify(
      { format: "prompt-studio-assets", version: 1, assets: metadata },
      null,
      2,
    ),
  );
}
export async function exportProjectArchive(
  project: Project,
  read?: BlobReader,
): Promise<Blob> {
  const zip = new JSZip();
  zip.file("project.json", JSON.stringify(project, null, 2));
  await appendAssetsToZip(zip, project, read);
  return zip.generateAsync({
    type: "blob",
    compression: "STORE",
    streamFiles: true,
  });
}

// Inspect central-directory lengths BEFORE JSZip allocates decompressed files.
// ZIP64, encrypted archives, ambiguous duplicate paths and traversal are not accepted.
export function inspectZipDirectory(buffer: ArrayBuffer): Map<string, number> {
  if (buffer.byteLength > ARCHIVE_LIMIT)
    throw Error("프로젝트 ZIP은 200MB 이하여야 합니다.");
  const data = new DataView(buffer),
    bytes = new Uint8Array(buffer);
  let end = -1;
  for (
    let i = data.byteLength - 22;
    i >= Math.max(0, data.byteLength - 65557);
    i--
  ) {
    if (
      data.getUint32(i, true) === 0x06054b50 &&
      i + 22 + data.getUint16(i + 20, true) === data.byteLength
    ) {
      end = i;
      break;
    }
  }
  if (end < 0) throw Error("올바른 ZIP 파일이 아닙니다.");
  const entries = data.getUint16(end + 10, true),
    size = data.getUint32(end + 12, true),
    start = data.getUint32(end + 16, true);
  if (
    data.getUint16(end + 4, true) ||
    data.getUint16(end + 6, true) ||
    entries !== data.getUint16(end + 8, true) ||
    entries > 2000 ||
    start + size !== end
  )
    throw Error(
      "분할 ZIP, ZIP64 또는 너무 많은 파일이 포함된 ZIP은 지원하지 않습니다.",
    );
  const names = new Map<string, number>();
  let at = start,
    total = 0;
  for (let i = 0; i < entries; i++) {
    if (at + 46 > end || data.getUint32(at, true) !== 0x02014b50)
      throw Error("ZIP 파일 목록이 손상되었습니다.");
    const flags = data.getUint16(at + 8, true),
      method = data.getUint16(at + 10, true),
      length = data.getUint32(at + 24, true);
    const nameLength = data.getUint16(at + 28, true),
      extraLength = data.getUint16(at + 30, true),
      commentLength = data.getUint16(at + 32, true);
    if (
      flags & 1 ||
      ![0, 8].includes(method) ||
      length > 50_000_000 ||
      data.getUint32(at + 42, true) >= start ||
      at + 46 + nameLength + extraLength + commentLength > end
    )
      throw Error("지원하지 않거나 허용 크기를 초과하는 ZIP 항목입니다.");
    const name = new TextDecoder("utf-8", { fatal: true }).decode(
      bytes.slice(at + 46, at + 46 + nameLength),
    );
    if (
      !/^[^\x00-\x1f\\:]+$/.test(name) ||
      name.startsWith("/") ||
      name.split("/").some((part) => part === ".." || part === ".") ||
      names.has(name)
    )
      throw Error("ZIP에 중복되거나 올바르지 않은 파일 경로가 있습니다.");
    names.set(name, length);
    total += length;
    if (total > ARCHIVE_LIMIT)
      throw Error("ZIP을 풀었을 때 200MB를 초과합니다.");
    at += 46 + nameLength + extraLength + commentLength;
  }
  if (
    at !== end ||
    !names.has("project.json") ||
    names.get("project.json")! > 3_000_000 ||
    (names.get("assets/manifest.json") ?? 0) > 1_000_000
  )
    throw Error("프로젝트 문서가 없거나 허용 크기를 초과합니다.");
  return names;
}
export async function readProjectArchive(
  file: Blob,
): Promise<{ project: Project; assets: AssetBytes[] }> {
  if (file.size > ARCHIVE_LIMIT)
    throw Error("프로젝트 ZIP은 200MB 이하여야 합니다.");
  const bytes = await file.arrayBuffer();
  const directory = inspectZipDirectory(bytes);
  const zip = await JSZip.loadAsync(bytes);
  const read = (path: string) =>
    readBoundedEntry(zip, path, directory.get(path) ?? 0);
  const project = parseProjectText(
    new TextDecoder().decode(await read("project.json")),
  );
  const expected = Object.values(project.assets);
  if (expected.reduce((sum, asset) => sum + asset.bytes, 0) > ASSET_LIMIT)
    throw Error("자산 총 크기는 150MB 이하여야 합니다.");
  if (expected.length) {
    const manifestFile = zip.file("assets/manifest.json");
    if (!manifestFile) throw Error("자산 목록이 없습니다.");
    const manifest = JSON.parse(
      new TextDecoder().decode(await read("assets/manifest.json")),
    );
    if (
      manifest.format !== "prompt-studio-assets" ||
      manifest.version !== 1 ||
      JSON.stringify(assetsSchema.parse(manifest.assets)) !==
        JSON.stringify(project.assets)
    )
      throw Error("자산 목록과 프로젝트가 일치하지 않습니다.");
  }
  const assets: AssetBytes[] = [];
  for (const asset of expected) {
    const path = `assets/${asset.id}`,
      entry = zip.file(path);
    if (!entry || directory.get(path) !== asset.bytes)
      throw Error(`${asset.name} 원본이 없거나 크기가 다릅니다.`);
    const content = await read(path);
    const blob = new Blob([new Uint8Array(content).buffer], {
      type: asset.mime,
    });
    const inspected = await inspectAsset(blob, asset.name);
    if (inspected.sha256 !== asset.sha256 || inspected.mime !== asset.mime)
      throw Error(`${asset.name} 파일이 손상되었거나 형식이 다릅니다.`);
    assets.push({ asset, blob });
  }
  return { project, assets };
}
function readBoundedEntry(
  zip: JSZip,
  path: string,
  limit: number,
): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    const file = zip.file(path);
    if (!file) {
      reject(Error(`${path} 파일이 없습니다.`));
      return;
    }
    const chunks: Uint8Array[] = [];
    let bytes = 0,
      failed = false;
    // JSZip 3 exposes this browser stream API but omits it from JSZipObject's types.
    const stream = (
      file as JSZip.JSZipObject & {
        internalStream(type: "uint8array"): JSZip.JSZipStreamHelper<Uint8Array>;
      }
    ).internalStream("uint8array");
    stream.on("data", (chunk) => {
      if (failed) return;
      bytes += chunk.length;
      if (bytes > limit) {
        failed = true;
        stream.pause();
        reject(Error("ZIP 항목이 신고된 크기를 초과합니다."));
        return;
      }
      chunks.push(chunk);
    });
    stream.on("error", reject);
    stream.on("end", () => {
      if (failed) return;
      if (bytes !== limit) {
        reject(Error("ZIP 항목 크기가 일치하지 않습니다."));
        return;
      }
      const joined = new Uint8Array(bytes);
      let at = 0;
      for (const chunk of chunks) {
        joined.set(chunk, at);
        at += chunk.length;
      }
      resolve(joined);
    });
    stream.resume();
  });
}
