"use client";

import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { PREVIEW_CSS } from "./preview-css";
import { Renderer } from "./Renderer";
import type { Project, Viewport } from "./model";
import { previewWidth, viewportForWidth } from "./viewport";

const FRAME_HTML = `<!doctype html><html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>${PREVIEW_CSS}</style></head><body><div id="preview-root"></div></body></html>`;
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
}) {
  const frame = useRef<HTMLIFrameElement>(null);
  const host = useRef<HTMLDivElement>(null);
  const [mount, setMount] = useState<HTMLElement | null>(null);
  const [available, setAvailable] = useState(900);
  useEffect(() => {
    if (!host.current) return;
    const observer = new ResizeObserver((entries) =>
      setAvailable(Math.max(180, entries[0].contentRect.width - 64)),
    );
    observer.observe(host.current);
    return () => observer.disconnect();
  }, []);
  const width = previewWidth(customWidth ?? viewport);
  const scale = zoom || Math.min(1, available / width);
  const frameHeight = Math.max(
    Math.min(600, viewportHeight),
    viewportHeight * scale,
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
          srcDoc={FRAME_HTML}
          onLoad={() =>
            setMount(
              frame.current?.contentDocument?.getElementById("preview-root") ??
                null,
            )
          }
          style={{
            width,
            height: frameHeight / scale,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        />
        {mount &&
          createPortal(
            <Renderer
              project={project}
              pageId={pageId}
              viewport={viewportForWidth(width)}
              selected={selected}
              onSelect={onSelect}
              preview={preview}
            />,
            mount,
          )}
      </div>
    </div>
  );
}
