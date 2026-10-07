import type { PointerEvent as ReactPointerEvent } from "react";
import { findDropTarget, type DropTarget } from "./drop-target";
import type { Project, Viewport } from "./model";

// Keep the pointer in the outer document while crossing the preview iframe.
// Native HTML drag-and-drop does not consistently cross iframe boundaries.
export function beginLibraryDrag(
  event: ReactPointerEvent<HTMLButtonElement>,
  project: Project,
  canvas: Document | null,
  viewport: Viewport,
  label: string,
  onDrop: (target: DropTarget) => void,
  onDragged: () => void,
): () => void {
  if (event.button !== 0 || !canvas) return () => {};
  const source = event.currentTarget,
    doc = source.ownerDocument,
    win = doc.defaultView!,
    frame = canvas.defaultView?.frameElement as HTMLIFrameElement | null;
  if (!frame) return () => {};
  const pointer = event.pointerId,
    startX = event.clientX,
    startY = event.clientY;
  let active = false,
    closed = false,
    target: DropTarget | null = null,
    shield: HTMLDivElement | null = null,
    indicator: HTMLDivElement | null = null;
  const clean = () => {
    if (closed) return;
    closed = true;
    doc.removeEventListener("pointermove", move, true);
    doc.removeEventListener("pointerup", up, true);
    doc.removeEventListener("pointercancel", cancel, true);
    doc.removeEventListener("keydown", key, true);
    win.removeEventListener("blur", cancel);
    source.removeEventListener("lostpointercapture", cancel);
    if (source.hasPointerCapture(pointer))
      source.releasePointerCapture(pointer);
    shield?.remove();
  };
  const cancel = () => {
    if(closed)return;
    if (active) onDragged();
    clean();
  };
  const key = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();
      cancel();
    }
  };
  const move = (e: PointerEvent) => {
    if (e.pointerId !== pointer) return;
    if (!active) {
      if (Math.hypot(e.clientX - startX, e.clientY - startY) < 5) return;
      active = true;
      source.setPointerCapture(pointer);
      shield = doc.createElement("div");
      shield.setAttribute("aria-hidden", "true");
      Object.assign(shield.style, {
        position: "fixed",
        inset: "0",
        zIndex: "10000",
        cursor: "copy",
        touchAction: "none",
      });
      indicator = doc.createElement("div");
      Object.assign(indicator.style, {
        position: "fixed",
        pointerEvents: "none",
        border: "2px solid #6366f1",
        background: "#6366f11a",
        color: "#3730a3",
        font: "12px sans-serif",
      });
      shield.append(indicator);
      doc.body.append(shield);
    }
    e.preventDefault();
    const r = frame.getBoundingClientRect(),
      scale = r.width / frame.clientWidth;
    target = null;
    if (
      scale > 0 &&
      e.clientX >= r.left &&
      e.clientX <= r.right &&
      e.clientY >= r.top &&
      e.clientY <= r.bottom
    ) {
      const x = (e.clientX - r.left) / scale,
        y = (e.clientY - r.top) / scale;
      const view = canvas.defaultView;
      if (view) {
        if (y < 32) view.scrollBy(0, -14);
        else if (y > view.innerHeight - 32) view.scrollBy(0, 14);
      }
      target = findDropTarget(project, canvas, viewport, x, y);
    }
    if (target && indicator) {
      const box = target.indicator;
      Object.assign(indicator.style, {
        display: "block",
        left: `${r.left + box.x * scale}px`,
        top: `${r.top + box.y * scale}px`,
        width: `${box.width * scale}px`,
        height: `${Math.max(3, box.height * scale)}px`,
      });
      indicator.textContent = `${label} → ${project.nodes[target.parent].name} · ${target.free ? "자유 배치" : "자동 배치"}`;
    } else if (indicator) indicator.style.display = "none";
  };
  const up = (e: PointerEvent) => {
    if (e.pointerId !== pointer) return;
    const drop = target;
    if (active) {
      e.preventDefault();
      onDragged();
    }
    clean();
    if (active && drop) onDrop(drop);
  };
  doc.addEventListener("pointermove", move, { capture: true, passive: false });
  doc.addEventListener("pointerup", up, true);
  doc.addEventListener("pointercancel", cancel, true);
  doc.addEventListener("keydown", key, true);
  win.addEventListener("blur", cancel);
  source.addEventListener("lostpointercapture", cancel);
  source.setPointerCapture(pointer);
  return cancel;
}
