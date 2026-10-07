"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Renderer } from "./Renderer";
import { PREVIEW_CSS } from "./preview-css";
import { componentExample } from "./library";
import type { Project } from "./model";
import type { DesignFamily } from "./visual-presets";
const HTML = `<!doctype html><html><head><link rel="stylesheet" href="/studio-ui.css"><style>${PREVIEW_CSS}\n.ui-root,.ui-page{min-height:0!important}body{overflow:hidden}*{animation:none!important;transition:none!important}</style></head><body><div id="tile"></div></body></html>`;
export default function LiveThumbnail({
  id,
  theme,
  family,
}: {
  id: string;
  theme: Project["theme"];
  family: DesignFamily | "legacy";
}) {
  const host = useRef<HTMLSpanElement>(null),
    [visible, setVisible] = useState(false),
    [width, setWidth] = useState(140);
  useEffect(() => {
    const element = host.current!;
    const observer = new IntersectionObserver(
      (entries) => setVisible(entries[0].isIntersecting),
      { rootMargin: "120px" },
    );
    observer.observe(element);
    const resize = new ResizeObserver((entries) =>
      setWidth(entries[0].contentRect.width),
    );
    resize.observe(element);
    return () => {
      observer.disconnect();
      resize.disconnect();
    };
  }, []);
  const project = useMemo(() => {
    const p = componentExample(id, theme);
    const node = p.nodes[p.nodes[p.pages[0].rootId].children[0]];
    node.appearance = { family };
    return p;
  }, [id, theme, family]);
  const large =
      id.startsWith("block-") ||
      id.startsWith("scene-") ||
      ["hero", "navbar", "footer", "dashboard"].includes(id),
    canvasWidth = large ? 960 : 400;
  return (
    <span ref={host} className="b-live-thumbnail" aria-hidden="true">
      {visible && (
        <ThumbnailFrame
          project={project}
          width={width}
          canvasWidth={canvasWidth}
          large={large}
        />
      )}
    </span>
  );
}
function ThumbnailFrame({
  project,
  width,
  canvasWidth,
  large,
}: {
  project: Project;
  width: number;
  canvasWidth: number;
  large: boolean;
}) {
  const [mount, setMount] = useState<HTMLElement | null>(null);
  return (
    <>
      <iframe
        title="컴포넌트 디자인 썸네일"
        tabIndex={-1}
        srcDoc={HTML}
        onLoad={(e) =>
          setMount(
            e.currentTarget.contentDocument?.getElementById("tile") ?? null,
          )
        }
        style={{
          width: canvasWidth,
          height: large ? 640 : 320,
          transform: `scale(${width / canvasWidth})`,
        }}
      />
      {mount &&
        createPortal(
          <Renderer
            project={project}
            pageId={project.pages[0].id}
            viewport={large ? "desktop" : "mobile"}
            preview
            capture
          />,
          mount,
        )}
    </>
  );
}
