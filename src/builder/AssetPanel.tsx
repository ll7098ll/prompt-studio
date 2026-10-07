"use client";
/* eslint-disable @next/next/no-img-element -- Local authoring assets retain their authored dimensions. */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Download,
  FileAudio,
  FileImage,
  FileVideo,
  Upload,
} from "lucide-react";
import {
  inspectAsset,
  assetRef,
  assetsSchema,
  safeMediaURL,
  type Asset,
} from "./asset-model";
import { getAssetBlob, putAssets, type AssetBytes } from "./asset-repository";
import { editProject, isLocked, type Project } from "./model";
import type { Field } from "./catalog";
import { downloadFile } from "./export";
import { exportProjectArchive } from "./project-archive";
import { assetUsage } from "./asset-usage";
function partAssetValues(
  project: Project,
  nodeId: string,
  path: string,
  create = false,
) {
  const node = project.nodes[nodeId];
  if (create) {
    node.parts ??= {};
    node.parts[path] ??= { layout: {}, responsive: {} };
    node.parts[path].attributes ??= {};
  }
  return node.parts?.[path]?.attributes as
    Record<string, string | number | boolean> | undefined;
}

export const ASSET_ACCEPT =
  ".png,.jpg,.jpeg,.webp,.avif,.mp4,.webm,.mp3,.wav,.ogg,.m4a,.weba,.woff2,.vtt";
export function useAssetUpload(project: Project, commit: (p: Project) => void) {
  const latest = useRef(project),
    alive = useRef(true);
  useLayoutEffect(() => {
    latest.current = project;
  }, [project]);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);
  const [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function upload(
    files: File[],
    apply?: {
      nodeId: string;
      field: Field;
      collectionKey?: string;
      itemId?: string;
      partPath?: string;
    },
  ) {
    const projectId = latest.current.id;
    setBusy(true);
    setError("");
    try {
      const items: AssetBytes[] = [];
      for (const file of files) {
        const asset = await inspectAsset(file, file.name);
        if (
          apply?.field.assetKinds &&
          !apply.field.assetKinds.includes(asset.kind)
        )
          throw Error("이 위치에 사용할 수 없는 종류의 파일입니다.");
        items.push({ asset, blob: file });
      }
      if (!alive.current || latest.current.id !== projectId) return;
      const merged = {
        ...latest.current.assets,
        ...Object.fromEntries(items.map((item) => [item.asset.id, item.asset])),
      };
      assetsSchema.parse(merged);
      await putAssets(items);
      if (!alive.current || latest.current.id !== projectId) return;
      const current = latest.current;
      commit(
        editProject(current, (next) => {
          for (const { asset } of items)
            next.assets[asset.id] = next.assets[asset.id] ?? asset;
          if (apply && items[0]) {
            if (!next.nodes[apply.nodeId] || isLocked(next, apply.nodeId))
              throw Error(
                "요소가 삭제되었거나 잠겼습니다. 자산을 다시 선택하세요.",
              );
            const target = apply.partPath
              ? partAssetValues(next, apply.nodeId, apply.partPath, true)
              : apply.collectionKey
                ? next.nodes[apply.nodeId].content?.[apply.collectionKey]?.find(
                    (item) => item.id === apply.itemId,
                  )?.values
                : next.nodes[apply.nodeId].props;
            if (!target)
              throw Error("항목이 삭제되었습니다. 자산을 다시 선택하세요.");
            target[apply.field.key] = assetRef(items[0].asset.id);
          }
        }),
      );
    } catch (e) {
      if (alive.current)
        setError(
          e instanceof Error ? e.message : "파일을 등록하지 못했습니다.",
        );
    } finally {
      if (alive.current) setBusy(false);
    }
  }
  return { upload, busy, error };
}
export function AssetField({
  project,
  nodeId,
  field,
  collectionKey,
  itemId,
  partPath,
  commit,
}: {
  project: Project;
  nodeId: string;
  field: Field;
  collectionKey?: string;
  itemId?: string;
  partPath?: string;
  commit: (p: Project) => void;
}) {
  const { upload, busy, error } = useAssetUpload(project, commit);
  const [urlMode, setURLMode] = useState(false);
  const values = (p: Project, create = false) =>
    partPath
      ? partAssetValues(p, nodeId, partPath, create)
      : collectionKey
        ? p.nodes[nodeId].content?.[collectionKey]?.find(
            (item) => item.id === itemId,
          )?.values
        : p.nodes[nodeId].props;
  const value = String(values(project)?.[field.key] ?? "");
  const assets = Object.values(project.assets).filter((a) =>
    field.assetKinds?.includes(a.kind),
  );
  const set = (value: string) =>
    commit(
      editProject(project, (next) => {
        if (isLocked(next, nodeId)) return;
        const target = values(next, true);
        if (target) target[field.key] = value;
      }),
    );
  return (
    <div className="b-asset-field">
      <label className="b-field">
        {field.label}
        <select
          aria-label={`${field.label} 자산 선택`}
          value={!urlMode && value.startsWith("asset:") ? value : ""}
          onChange={(e) => {
            if (partPath && !e.target.value && value.startsWith("asset:"))
              setURLMode(true);
            else {
              setURLMode(false);
              set(e.target.value);
            }
          }}
        >
          <option value="">URL 직접 입력 또는 파일 등록</option>
          {assets.map((asset) => (
            <option key={asset.id} value={assetRef(asset.id)}>
              {asset.name}
            </option>
          ))}
        </select>
      </label>
      {(!value.startsWith("asset:") || urlMode) && (
        <label className="b-field">
          <span>HTTPS URL</span>
          {partPath ? (
            <PartImageURL
              key={`${partPath}-${value}`}
              value={urlMode ? "" : value}
              label={`${field.label} HTTPS URL`}
              onCommit={(next) => {
                set(next);
                setURLMode(false);
              }}
            />
          ) : (
            <input
              aria-label={`${field.label} HTTPS URL`}
              placeholder="https://…"
              value={value}
              maxLength={20000}
              onChange={(e) => set(e.target.value)}
            />
          )}
        </label>
      )}
      {urlMode && (
        <button className="b-text-button" onClick={() => setURLMode(false)}>
          파일 선택 유지
        </button>
      )}
      <label className="b-asset-upload">
        <Upload size={14} />
        {busy ? "등록 중…" : "파일로 교체"}
        <input
          type="file"
          aria-label={`${field.label} 파일로 교체`}
          accept={ASSET_ACCEPT}
          disabled={busy}
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = "";
            if (files.length)
              void upload(files, {
                nodeId,
                field,
                collectionKey,
                itemId,
                partPath,
              });
          }}
        />
      </label>
      {value && (
        <button className="b-text-button" onClick={() => set("")}>
          연결 해제
        </button>
      )}
      {error && (
        <p className="b-notice" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
function AssetTile({
  asset,
  children,
}: {
  asset: Asset;
  children: React.ReactNode;
}) {
  const [url, setUrl] = useState(""),
    [missing, setMissing] = useState(false);
  const [epoch, setEpoch] = useState(0);
  useEffect(() => {
    const change = () => setEpoch((value) => value + 1);
    window.addEventListener("studio-assets-changed", change);
    return () => window.removeEventListener("studio-assets-changed", change);
  }, []);
  useEffect(() => {
    let disposed = false,
      objectURL = "";
    void getAssetBlob(asset.id)
      .then((blob) => {
        if (disposed) return;
        if (blob) {
          objectURL = URL.createObjectURL(blob);
          setUrl(objectURL);
          setMissing(false);
        } else setMissing(true);
      })
      .catch(() => {
        if (!disposed) setMissing(true);
      });
    return () => {
      disposed = true;
      if (objectURL) URL.revokeObjectURL(objectURL);
    };
  }, [asset.id, asset.createdAt, epoch]);
  const Icon =
    asset.kind === "video"
      ? FileVideo
      : asset.kind === "audio"
        ? FileAudio
        : FileImage;
  return (
    <article className="b-asset-tile">
      <div className="b-asset-preview">
        {url && asset.kind === "image" ? (
          <img src={url} alt={asset.description || asset.name} />
        ) : (
          <Icon size={24} />
        )}
      </div>
      <strong title={asset.name}>{asset.name}</strong>
      <small>
        {asset.kind} · {(asset.bytes / 1000000).toFixed(2)} MB
      </small>
      {missing && (
        <small role="status">원본 없음 · 같은 파일을 다시 등록하세요</small>
      )}
      {children}
    </article>
  );
}
export default function AssetPanel({
  project,
  commit,
  onInsert,
}: {
  project: Project;
  commit: (p: Project) => void;
  onInsert: (asset: Asset) => void;
}) {
  const { upload, busy, error } = useAssetUpload(project, commit);
  const [backupError, setBackupError] = useState(""),
    [backingUp, setBackingUp] = useState(false);
  const assets = Object.values(project.assets);
  const usage = assetUsage(project);
  return (
    <div className="builder-panel-content b-assets-panel">
      <div className="b-section-title">
        프로젝트 자산 <span>{assets.length}</span>
      </div>
      <div
        className="b-asset-drop"
        onDragOver={(e) => {
          if (e.dataTransfer.types.includes("Files")) e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          if (!busy) void upload(Array.from(e.dataTransfer.files));
        }}
      >
        <Upload size={24} />
        <strong>사진·영상·음성을 여기에 놓으세요</strong>
        <p>
          이미지 10MB · 영상/음성 50MB
          <br />
          프로젝트 전체 150MB
        </p>
        <label className="b-asset-upload">
          {busy ? "파일 등록 중…" : "파일 선택"}
          <input
            type="file"
            aria-label="자산 파일 등록"
            multiple
            accept={ASSET_ACCEPT}
            disabled={busy}
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              e.target.value = "";
              if (files.length) void upload(files);
            }}
          />
        </label>
      </div>
      {(error || backupError) && (
        <p className="b-notice" role="alert">
          {error || backupError}
        </p>
      )}
      <p className="b-help">
        이 브라우저에 보관됩니다. 다른 기기로 옮길 때는 자산 포함 ZIP을
        사용하세요. 같은 파일을 등록하면 기존 연결을 복구합니다.
      </p>
      <button
        className="b-button"
        disabled={backingUp}
        onClick={async () => {
          setBackingUp(true);
          setBackupError("");
          try {
            downloadFile(
              `${project.name}.studio.zip`,
              await exportProjectArchive(project),
            );
          } catch (e) {
            setBackupError(
              e instanceof Error ? e.message : "백업에 실패했습니다.",
            );
          } finally {
            setBackingUp(false);
          }
        }}
      >
        <Download size={14} />
        {backingUp ? "파일을 모으는 중…" : "자산 포함 ZIP 백업"}
      </button>
      <div className="b-asset-grid">
        {assets.map((asset) => (
          <AssetTile key={`${asset.id}-${asset.createdAt}`} asset={asset}>
            <small>{usage.get(asset.id) ?? 0}곳에서 사용</small>
            <button
              className="b-text-button"
              aria-label={`${asset.name} 목록에서 제거`}
              disabled={!!usage.get(asset.id)}
              title={
                usage.get(asset.id)
                  ? "연결을 모두 해제하면 목록에서 제거할 수 있습니다."
                  : "이 프로젝트 목록에서 제거합니다. 버전·실행 취소에 필요한 원본은 보관합니다."
              }
              onClick={() =>
                commit(
                  editProject(project, (next) => {
                    delete next.assets[asset.id];
                  }),
                )
              }
            >
              목록에서 제거
            </button>
            {["image", "video", "audio"].includes(asset.kind) && (
              <button
                className="b-button b-button-small"
                onClick={() => onInsert(asset)}
              >
                화면에 추가
              </button>
            )}
            <details>
              <summary>설명과 출처</summary>
              <label className="b-field">
                대체 설명
                <textarea
                  aria-label={`${asset.name} 대체 설명`}
                  value={asset.description}
                  maxLength={2000}
                  onChange={(e) =>
                    commit(
                      editProject(project, (next) => {
                        next.assets[asset.id].description = e.target.value;
                      }),
                    )
                  }
                />
              </label>
              <label className="b-field">
                출처·이용 조건
                <input
                  aria-label={`${asset.name} 출처`}
                  value={asset.credit}
                  maxLength={1000}
                  onChange={(e) =>
                    commit(
                      editProject(project, (next) => {
                        next.assets[asset.id].credit = e.target.value;
                      }),
                    )
                  }
                />
              </label>
            </details>
          </AssetTile>
        ))}
      </div>
    </div>
  );
}

function PartImageURL({
  value,
  label,
  onCommit,
}: {
  value: string;
  label: string;
  onCommit: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value),
    [invalid, setInvalid] = useState(false);
  return (
    <>
      <input
        aria-label={label}
        aria-invalid={invalid}
        placeholder="https://…"
        value={draft}
        maxLength={20000}
        onChange={(event) => {
          setDraft(event.target.value);
          setInvalid(false);
        }}
        onBlur={() => {
          if (draft === value) return;
          if (draft && !safeMediaURL(draft)) {
            setInvalid(true);
            return;
          }
          onCommit(draft);
        }}
      />
      {invalid && (
        <small role="alert">
          완전한 HTTPS 주소를 입력하세요. 기존 이미지는 유지됩니다.
        </small>
      )}
    </>
  );
}
