"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { PREVIEW_CSS } from "./preview-css";
import { Renderer } from "./Renderer";
import type { Project, Viewport } from "./model";
import { previewWidth, viewportForWidth } from "./viewport";
import CanvasEditor from "./CanvasEditor";
import type { PartSelection } from "./PartsPanel";
import type { Layout } from "./model";
import { findDropTarget, type DropTarget } from "./drop-target";

const FRAME_HTML = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/studio-ui.css"><style>${PREVIEW_CSS}</style></head><body><div id="preview-root"></div></body></html>`;
export default function PreviewFrame({
  project,
  pageId,
  viewport,
  width: customWidth,
  selected,
  onSelect,
  preview,
  zoom,
  viewportHeight = 920,
  fitViewport = false,
  selection = [],
  onSelection,
  commit,
  onReady,
  onMessage,
  tool = "select",
  partSelection,
  onPartSelection,
  onPartPatch,
  onLibraryDrop,
}: {
  project: Project;
  pageId: string;
  viewport: Viewport;
  width?: number;
  selected: string | null;
  onSelect: (id: string) => void;
  preview: boolean;
  zoom: number;
  viewportHeight?: number;
  fitViewport?: boolean;
  selection?: string[];
  onSelection?: (ids: string[]) => void;
  commit?: (project: Project, group?: string) => void;
  onReady?: (doc: Document) => void;
  onMessage?: (message: string) => void;
  tool?: "select" | "hand";
  partSelection?: PartSelection;
  onPartSelection?: (part: PartSelection) => void;
  onPartPatch?: (path: string, patch: Partial<Layout>) => void;
  onLibraryDrop?: (id: string, drop: DropTarget) => void;
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const [available, setAvailable] = useState(900);
  const [availableHeight, setAvailableHeight] = useState(viewportHeight + 64);
  const [libraryDrop, setLibraryDrop] = useState<DropTarget | null>(null);
  useEffect(() => {
    if (!host.current) return;
    const observer = new ResizeObserver((entries) => {
      setAvailable(Math.max(180, entries[0].contentRect.width - 64));
      setAvailableHeight(entries[0].target.clientHeight);
    });
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  const width = previewWidth(customWidth ?? viewport);
  const scale = zoom || Math.min(1, available / width);
  const preferredHeight = Math.max(
    Math.min(600, viewportHeight),
    viewportHeight * scale,
  );
  // A preview is a viewport, not a tall editing canvas. Keep fixed playback and
  // media controls reachable without nesting them below the outer scroll area.
  const frameHeight = preview && fitViewport ? Math.min(preferredHeight, Math.max(220, availableHeight - 76)) : preferredHeight;
  const rendering = (
    <Renderer
      project={project}
      pageId={pageId}
      viewport={viewportForWidth(width)}
      selected={selected}
      selectedIds={commit ? selection : undefined}
      onSelect={onSelect}
      preview={preview}
    />
  );
  return (
    <div
      ref={host}
      className="builder-canvas-scroll"
      tabIndex={0}
      role="region"
      aria-label="화면 미리보기 영역"
    >
      <div className="builder-canvas-label">
        <span>{project.pages.find((p) => p.id === pageId)?.name ?? "홈"}</span>
        <span>
          {width} px · {Math.round(scale * 100)}%
        </span>
      </div>
      <div
        className="builder-frame-shell"
        style={{ width: width * scale, height: frameHeight }}
      >
        <iframe
          ref={frame}
          title="디자인 미리보기"
          allowFullScreen
          srcDoc={FRAME_HTML}
          onLoad={() => {
            setMount(
              frame.current?.contentDocument?.getElementById("preview-root") ??
                null,
            );
            if (frame.current?.contentDocument)
              onReady?.(frame.current.contentDocument);
          }}
          style={{
            width,
            height: frameHeight / scale,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        />
        {mount &&
          createPortal(
            <div
              onDragOver={(event) => {
                if (
                  preview ||
                  !onLibraryDrop ||
                  !event.dataTransfer.types.includes(
                    "application/x-studio-component",
                  )
                )
                  return;
                event.preventDefault();
                event.dataTransfer.dropEffect = "copy";
                const doc = event.currentTarget.ownerDocument;
                const win = doc.defaultView!;
                if (event.clientY < 40) win.scrollBy(0, -16);
                else if (event.clientY > win.innerHeight - 40)
                  win.scrollBy(0, 16);
                setLibraryDrop(
                  findDropTarget(
                    project,
                    doc,
                    viewportForWidth(width),
                    event.clientX,
                    event.clientY,
                  ),
                );
              }}
              onDragLeave={(event) => {
                if (
                  !event.currentTarget.contains(
                    event.relatedTarget as globalThis.Node | null,
                  )
                )
                  setLibraryDrop(null);
              }}
              onDrop={(event) => {
                event.preventDefault();
                const id = event.dataTransfer.getData(
                  "application/x-studio-component",
                );
                const drop = findDropTarget(
                  project,
                  event.currentTarget.ownerDocument,
                  viewportForWidth(width),
                  event.clientX,
                  event.clientY,
                );
                if (id && drop) onLibraryDrop?.(id, drop);
                setLibraryDrop(null);
              }}
            >
              {!preview && commit && onSelection ? (
                <CanvasEditor
                  key={`${pageId}-${viewportForWidth(width)}`}
                  project={project}
                  pageId={pageId}
                  viewport={viewportForWidth(width)}
                  selection={selection}
                  onSelection={onSelection}
                  commit={commit}
                  scale={scale}
                  tool={tool}
                  onMessage={onMessage}
                  onPan={(dx, dy) => host.current?.scrollBy(dx, dy)}
                  partSelection={partSelection}
                  onPartSelection={onPartSelection}
                  onPartPatch={onPartPatch}
                >
                  {rendering}
                </CanvasEditor>
              ) : (
                rendering
              )}
              {libraryDrop && (
                <div
                  aria-label={
                    libraryDrop.free ? "자유 위치에 추가" : "이 순서에 추가"
                  }
                  style={{
                    position: "fixed",
                    pointerEvents: "none",
                    zIndex: 999,
                    left: libraryDrop.indicator.x,
                    top: libraryDrop.indicator.y,
                    width: libraryDrop.indicator.width,
                    height: libraryDrop.indicator.height,
                    border: "2px solid #6366f1",
                    background: "#6366f122",
                  }}
                />
              )}
            </div>,
            mount,
          )}
      </div>
    </div>
  );
}
