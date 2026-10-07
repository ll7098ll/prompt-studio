import { openDatabase } from "./repository";
import { assetSchema, sha256, type Asset } from "./asset-model";
import { BUILTIN_BY_ID } from "./builtin-assets";

export type AssetBytes = { asset: Asset; blob: Blob };
export async function putAssets(items: AssetBytes[]): Promise<void> {
  // Validate the complete batch before opening a write transaction.
  const records: { id: string; bytes: ArrayBuffer; mime: string }[] = [];
  for (const { asset, blob } of items) {
    assetSchema.parse(asset);
    const bytes = await blob.arrayBuffer();
    if (blob.size !== asset.bytes || (await sha256(bytes)) !== asset.sha256)
      throw Error(
        `${asset.name}: 파일이 손상되었거나 메타데이터와 일치하지 않습니다.`,
      );
    // WebKit on Windows cannot persist Blob records reliably. Raw bytes are
    // structured-cloneable on every supported engine and keep the same identity.
    records.push({ id: asset.id, bytes, mime: asset.mime });
  }
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    let tx: IDBTransaction;
    try {
      tx = db.transaction("assets", "readwrite");
    } catch {
      db.close();
      reject(Error("파일을 보관하지 못했습니다. 저장 공간을 확인하세요."));
      return;
    }
    tx.oncomplete = () => {
      db.close();
      if (typeof window !== "undefined")
        window.dispatchEvent(new Event("studio-assets-changed"));
      resolve();
    };
    tx.onabort = () => {
      db.close();
      reject(
        Error(
          "파일을 보관하지 못했습니다. 저장 공간을 확인하고 프로젝트 ZIP을 백업하세요.",
        ),
      );
    };
    try {
      for (const record of records) tx.objectStore("assets").put(record);
    } catch {
      tx.abort();
    }
  });
}
async function storedAssetBlob(id: string): Promise<Blob | undefined> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    let tx: IDBTransaction;
    try {
      tx = db.transaction("assets", "readonly");
    } catch {
      db.close();
      reject(Error("파일을 읽을 수 없습니다."));
      return;
    }
    const request = tx.objectStore("assets").get(id);
    tx.oncomplete = () => {
      db.close();
      const record = request.result;
      resolve(
        record?.bytes
          ? new Blob([record.bytes], { type: record.mime })
          : record?.blob,
      );
    };
    tx.onabort = () => {
      db.close();
      reject(Error("보관된 파일을 읽을 수 없습니다."));
    };
  });
}
const importing = new Map<string, Promise<Blob | undefined>>();
export async function getAssetBlob(id: string): Promise<Blob | undefined> {
  const stored = await storedAssetBlob(id);
  if (stored) return stored;
  const entry = BUILTIN_BY_ID.get(id);
  if (!entry) return undefined;
  let pending = importing.get(id);
  if (!pending) {
    pending = (async () => {
      const response = await fetch(entry.path);
      if (!response.ok)
        throw Error(`${entry.asset.name}: 샘플 파일을 불러오지 못했습니다.`);
      const blob = new Blob([await response.arrayBuffer()], {
        type: entry.asset.mime,
      });
      await putAssets([{ asset: entry.asset, blob }]);
      return blob;
    })().finally(() => importing.delete(id));
    importing.set(id, pending);
  }
  return pending;
}
// Bytes are immutable and shared by content hash. Removing a reference never deletes
// the bytes: other projects, checkpoints, recovery drafts and Undo may still need them.
export type AssetSession = {
  urls: Record<string, string>;
  missing: string[];
  dispose: () => void;
};
export async function loadAssetSession(
  assets: Record<string, Asset>,
): Promise<AssetSession> {
  const urls: Record<string, string> = {},
    missing: string[] = [];
  await Promise.all(
    Object.values(assets).map(async (asset) => {
      try {
        const blob = await getAssetBlob(asset.id);
        if (blob && blob.size === asset.bytes)
          urls[asset.id] = URL.createObjectURL(blob);
        else missing.push(asset.id);
      } catch {
        missing.push(asset.id);
      }
    }),
  );
  return {
    urls,
    missing,
    dispose: () =>
      Object.values(urls).forEach((url) => URL.revokeObjectURL(url)),
  };
}
