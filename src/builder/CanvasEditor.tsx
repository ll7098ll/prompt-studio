"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { DEFINITIONS } from "./catalog";
import { findDropTarget, type DropTarget } from "./drop-target";
import { relocateNode } from "./design-dom";
import {
  applyBoxes,
  editableRoots,
  patchLayouts,
  selectionRoots,
} from "./design-commands";
import {
  HANDLES,
  boxInParent,
  clamp,
  elementRotation,
  elementSize,
  localPoint,
  measureChildren,
  resizeBox,
  rotatePoint,
  snapBox,
  unionBox,
  type Box,
  type Handle,
} from "./geometry";
import { partElement, partPath, resolvedPart } from "./component-parts";
import type { PartSelection } from "./PartsPanel";
import {
  editProject,
  isLocked,
  parentId,
  resolvedLayout,
  type Layout,
  type Project,
  type Viewport,
} from "./model";

type Outline = Box & { id: string; rotation: number; locked: boolean };
type Inline = {
  id: string;
  key: string;
  value: string;
  box: Box;
  fontSize: string;
  fontWeight: string;
  lineHeight: string;
};
type Props = {
  project: Project;
  pageId: string;
  viewport: Viewport;
  selection: string[];
  onSelection: (ids: string[]) => void;
  commit: (project: Project, group?: string) => void;
  scale: number;
  children: ReactNode;
  tool: "select" | "hand";
  partSelection?: PartSelection;
  onPartSelection?: (part: PartSelection) => void;
  onPartPatch?: (path: string, patch: Partial<Layout>) => void;
  onPan?: (dx: number, dy: number) => void;
  onMessage?: (message: string) => void;
};
export default function CanvasEditor(props: Props) {
  const surface = useRef<HTMLDivElement>(null),
    latest = useRef(props);
  const cancel = useRef<(() => void) | null>(null),
    space = useRef(false),
    frame = useRef(0);
  const [outlines, setOutlines] = useState<Outline[]>([]);
  const [partBounds, setPartBounds] = useState<Box | null>(null);
  const [marquee, setMarquee] = useState<Box | null>(null);
  const [guides, setGuides] = useState<{
    x?: number;
    y?: number;
    spacing?: string;
  }>({});
  const [drop, setDrop] = useState<(Box & { label?: string }) | null>(null);
  const [inline, setInline] = useState<Inline | null>(null);
  const textarea = useRef<HTMLTextAreaElement>(null),
    composing = useRef(false);
  useLayoutEffect(() => {
    latest.current = props;
  });

  function refresh() {
    const doc = surface.current?.ownerDocument;
    if (!doc) return;
    if (frame.current) doc.defaultView!.cancelAnimationFrame(frame.current);
    frame.current = doc.defaultView!.requestAnimationFrame(() => {
      frame.current = 0;
      const p = latest.current;
      const next = selectionRoots(p.project, p.selection).flatMap((id) => {
        const el = doc.getElementById(id);
        if (!el || !el.getClientRects().length) return [];
        const r = el.getBoundingClientRect(),
          size = elementSize(el);
        return [
          {
            id,
            x: r.x + (r.width - size.width) / 2,
            y: r.y + (r.height - size.height) / 2,
            ...size,
            rotation: elementRotation(el),
            locked: isLocked(p.project, id),
          },
        ];
      });
      setOutlines(next);
      const owner = p.partSelection
        ? doc.getElementById(p.partSelection.id)
        : null;
      const part =
        owner && p.partSelection
          ? partElement(owner, p.partSelection.path)
          : null;
      const r = part?.getBoundingClientRect();
      setPartBounds(
        r ? { x: r.x, y: r.y, width: r.width, height: r.height } : null,
      );
    });
  }
  useEffect(() => {
    const doc = surface.current!.ownerDocument,
      win = doc.defaultView!;
    const observer = new win.ResizeObserver(refresh);
    for (const id of props.selection) {
      const el = doc.getElementById(id);
      if (el) observer.observe(el);
    }
    refresh();
    doc.addEventListener("scroll", refresh, true);
    win.addEventListener("resize", refresh);
    return () => {
      observer.disconnect();
      doc.removeEventListener("scroll", refresh, true);
      win.removeEventListener("resize", refresh);
    };
  }, [props.selection, props.project, props.viewport, props.partSelection]);
  useEffect(() => {
    const doc = surface.current!.ownerDocument,
      win = doc.defaultView!;
    const down = (e: KeyboardEvent) => {
      if (
        (e.target as HTMLElement)?.closest(
          "input,textarea,select,[contenteditable=true]",
        ) ||
        e.isComposing
      )
        return;
      if (e.code === "Space") {
        space.current = true;
        e.preventDefault();
      }
      if (e.key === "Escape") {
        cancel.current?.();
        setInline(null);
      }
    };
    const up = (e: KeyboardEvent) => {
      if (e.code === "Space") space.current = false;
    };
    const blur = () => {
      space.current = false;
      cancel.current?.();
    };
    doc.addEventListener("keydown", down);
    doc.addEventListener("keyup", up);
    win.addEventListener("blur", blur);
    return () => {
      cancel.current?.();
      if (frame.current) win.cancelAnimationFrame(frame.current);
      doc.removeEventListener("keydown", down);
      doc.removeEventListener("keyup", up);
      win.removeEventListener("blur", blur);
    };
  }, []);
  useEffect(() => {
    if (inline) {
      textarea.current?.focus();
      textarea.current?.select();
    }
  }, [inline]);

  function finishText(apply: boolean) {
    const p = latest.current;
    if (apply && inline && !isLocked(p.project, inline.id)) {
      const value = (textarea.current?.value ?? inline.value).slice(0, 20000);
      p.commit(
        editProject(p.project, (next) => {
          next.nodes[inline.id].props[inline.key] = value;
        }),
      );
    }
    setInline(null);
  }

  function start(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0 && event.button !== 1) return;
    const target = event.target as HTMLElement;
    if (target.closest("[data-studio-part-action]")) return;
    if (target.closest(".design-inline")) return;
    const p = latest.current,
      doc = target.ownerDocument,
      win = doc.defaultView!;
    const moveId =
      target.closest<HTMLElement>("[data-move-id]")?.dataset.moveId;
    const nodeEl = moveId
      ? doc.getElementById(moveId)
      : target.closest<HTMLElement>(".ui-node");
    if (
      nodeEl &&
      (event.ctrlKey || event.metaKey) &&
      p.onPartSelection &&
      !DEFINITIONS[p.project.nodes[nodeEl.id]?.component]?.container
    ) {
      const partTarget = target.closest("svg") ?? target;
      const path = partPath(partTarget, nodeEl, p.project.nodes[nodeEl.id]?.parts);
      if (path) {
        event.preventDefault();
        event.stopPropagation();
        p.onSelection([nodeEl.id]);
        p.onPartSelection({ id: nodeEl.id, path });
        return;
      }
    }
    if (p.partSelection && p.onPartPatch) {
      const owner = doc.getElementById(p.partSelection.id);
      const el = owner ? partElement(owner, p.partSelection.path) : null;
      if (el && (el.contains(target) || target.dataset.partHandle)) {
        event.preventDefault();
        event.stopPropagation();
        cancel.current?.();
        surface.current?.focus({ preventScroll: true });
        const selectedPart = p.partSelection;
        const layout = resolvedPart(
          p.project.nodes[selectedPart.id].parts?.[selectedPart.path],
          p.viewport,
        );
        if (isLocked(p.project, selectedPart.id)) return;
        const rect = el.getBoundingClientRect(),
          size = elementSize(el as HTMLElement);
        const box = { x: rect.x, y: rect.y, ...size },
          oldStyle = el.getAttribute("style");
        const x = event.clientX,
          y = event.clientY,
          handle = target.dataset.partHandle as Handle | undefined;
        let patch: Partial<import("./model").Layout> | null = null;
        const pointer = event.pointerId,
          capture = surface.current!;
        const clean = () => {
          doc.removeEventListener("pointermove", movePart);
          doc.removeEventListener("pointerup", upPart);
          doc.removeEventListener("pointercancel", abortPart);
          capture.removeEventListener("lostpointercapture", abortPart);
          if (capture.hasPointerCapture(pointer))
            capture.releasePointerCapture(pointer);
          if (oldStyle === null) el.removeAttribute("style");
          else el.setAttribute("style", oldStyle);
          cancel.current = null;
          refresh();
        };
        const abortPart = () => clean();
        const movePart = (e: PointerEvent) => {
          if (
            e.pointerId !== pointer ||
            Math.hypot(e.clientX - x, e.clientY - y) * p.scale < 3
          )
            return;
          if (!capture.hasPointerCapture(pointer))
            capture.setPointerCapture(pointer);
          const delta = rotatePoint(
            e.clientX - x,
            e.clientY - y,
            -elementRotation(el.parentElement!),
          );
          if (handle) {
            const b = resizeBox(
              box,
              handle,
              delta.x,
              delta.y,
              e.shiftKey,
              layout.rotation,
            );
            patch = {
              x: layout.x + b.x - box.x,
              y: layout.y + b.y - box.y,
              width: b.width,
              height: b.height,
              widthMode: "fixed",
              heightMode: "fixed",
            };
            el.style.setProperty("width", `${b.width}px`, "important");
            el.style.setProperty("height", `${b.height}px`, "important");
          } else
            patch = {
              x: clamp(layout.x + delta.x, -100000, 100000),
              y: clamp(layout.y + delta.y, -100000, 100000),
            };
          el.style.setProperty(
            "transform",
            `translate(${patch.x}px,${patch.y}px) rotate(${layout.rotation}deg)`,
            "important",
          );
          refresh();
        };
        const upPart = (e: PointerEvent) => {
          if (e.pointerId !== pointer) return;
          clean();
          if (patch) p.onPartPatch?.(selectedPart.path, patch);
        };
        cancel.current = clean;
        doc.addEventListener("pointermove", movePart);
        doc.addEventListener("pointerup", upPart);
        doc.addEventListener("pointercancel", abortPart);
        capture.addEventListener("lostpointercapture", abortPart);
        return;
      }
      p.onPartSelection?.(null);
    }
    const handle = target.dataset.handle as Handle | "rotate" | undefined;
    const pan = space.current || p.tool === "hand" || event.button === 1;
    if (!nodeEl && !handle && !pan) return;
    event.preventDefault();
    event.stopPropagation();
    cancel.current?.();
    surface.current?.focus({ preventScroll: true });
    const startX = event.clientX,
      startY = event.clientY;
    let ids = p.selection;
    if (nodeEl && !pan) {
      if (event.shiftKey) {
        ids = ids.includes(nodeEl.id)
          ? ids.filter((id) => id !== nodeEl.id)
          : selectionRoots(p.project, [...ids, nodeEl.id]);
        p.onSelection(ids);
        return;
      }
      if (!ids.includes(nodeEl.id)) {
        ids = [nodeEl.id];
        p.onSelection(ids);
      }
    }
    const containerBackground =
      nodeEl &&
      DEFINITIONS[p.project.nodes[nodeEl.id]?.component]?.container &&
      (target === nodeEl || !!target.closest(".ui-empty-container"));
    const selectArea =
      !moveId &&
      !handle &&
      !pan &&
      containerBackground &&
      p.project.nodes[nodeEl.id].component !== "group";
    const roots = editableRoots(p.project, ids).filter(
      (id) => parentId(p.project, id) && doc.getElementById(id),
    );
    const parent = roots.length ? parentId(p.project, roots[0]) : undefined;
    const parentEl = parent ? doc.getElementById(parent) : null;
    const sameParent =
      !!parent && roots.every((id) => parentId(p.project, id) === parent);
    const free =
      !!parent &&
      resolvedLayout(p.project.nodes[parent], p.viewport).mode === "free";
    const originalBoxes = parentEl
      ? Object.fromEntries(
          roots.map((id) => [
            id,
            boxInParent(doc.getElementById(id)!, parentEl),
          ]),
        )
      : {};
    const bounds = unionBox(Object.values(originalBoxes));
    const originalStyles = roots.map((id) => {
      const el = doc.getElementById(id)!;
      return [el, el.getAttribute("style")] as const;
    });
    const initialPoint = parentEl
      ? localPoint(parentEl, startX, startY)
      : { x: startX, y: startY };
    let changed = false,
      lastBoxes = originalBoxes,
      rotation: number | undefined;
    let lastPan = { x: startX, y: startY },
      flowTarget: DropTarget | null = null;
    const parentSize = parentEl ? elementSize(parentEl) : undefined;
    const snapTargets =
      parent && parentEl
        ? [
            { x: 0, y: 0, ...elementSize(parentEl) },
            ...Object.entries(measureChildren(doc, parent))
              .filter(([id]) => !roots.includes(id))
              .map(([, box]) => box),
          ]
        : [];
    const capture = surface.current!;
    const pointerId = event.pointerId;
    const restore = () => {
      for (const [el, style] of originalStyles) {
        if (style === null) el.removeAttribute("style");
        else el.setAttribute("style", style);
        el.dataset.rotation = String(
          resolvedLayout(p.project.nodes[el.id], p.viewport).rotation,
        );
      }
    };
    const clean = () => {
      doc.removeEventListener("pointermove", move);
      doc.removeEventListener("pointerup", up);
      doc.removeEventListener("pointercancel", abort);
      capture.removeEventListener("lostpointercapture", abort);
      if (capture.hasPointerCapture(pointerId))
        capture.releasePointerCapture(pointerId);
      cancel.current = null;
      setMarquee(null);
      setGuides({});
      setDrop(null);
      restore();
      refresh();
    };
    const abort = () => clean();
    const move = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      e.preventDefault();
      if (
        Math.hypot(e.clientX - startX, e.clientY - startY) * p.scale < 3 &&
        !changed
      )
        return;
      changed = true;
      if (!capture.hasPointerCapture(pointerId))
        capture.setPointerCapture(pointerId);
      if (pan) {
        p.onPan?.(
          (lastPan.x - e.clientX) * p.scale,
          (lastPan.y - e.clientY) * p.scale,
        );
        win.scrollBy(0, lastPan.y - e.clientY);
        lastPan = { x: e.clientX, y: e.clientY };
        return;
      }
      if (selectArea && nodeEl) {
        const box = {
          x: Math.min(startX, e.clientX),
          y: Math.min(startY, e.clientY),
          width: Math.abs(e.clientX - startX),
          height: Math.abs(e.clientY - startY),
        };
        setMarquee(box);
        const matched = p.project.nodes[nodeEl.id].children.filter((id) => {
          const el = doc.getElementById(id);
          if (!el || isLocked(p.project, id)) return false;
          const r = el.getBoundingClientRect();
          return (
            r.width &&
            r.height &&
            r.right >= box.x &&
            r.left <= box.x + box.width &&
            r.bottom >= box.y &&
            r.top <= box.y + box.height
          );
        });
        p.onSelection(matched);
        return;
      }
      if (!sameParent || !parentEl || !roots.length) return;
      if (!handle) {
        if (e.clientY < 32) win.scrollBy(0, -14);
        else if (e.clientY > win.innerHeight - 32) win.scrollBy(0, 14);
        const candidate =
          roots.length === 1
            ? findDropTarget(
                p.project,
                doc,
                p.viewport,
                e.clientX,
                e.clientY,
                roots,
              )
            : null;
        flowTarget =
          candidate && (!free || candidate.parent !== parent)
            ? candidate
            : null;
        setDrop(
          flowTarget
            ? {
                ...flowTarget.indicator,
                label: `${p.project.nodes[flowTarget.parent].name} · ${flowTarget.free ? "자유 배치" : "자동 배치"}`,
              }
            : null,
        );
        if (flowTarget || !free) return;
      }
      const point = localPoint(parentEl, e.clientX, e.clientY);
      let dx = point.x - initialPoint.x,
        dy = point.y - initialPoint.y;
      if (!handle && e.shiftKey) {
        if (Math.abs(dx) >= Math.abs(dy)) dy = 0;
        else dx = 0;
      }
      if (handle === "rotate") {
        if (roots.length !== 1) return;
        const box = originalBoxes[roots[0]],
          cx = box.x + box.width / 2,
          cy = box.y + box.height / 2;
        const a = Math.atan2(initialPoint.y - cy, initialPoint.x - cx),
          b = Math.atan2(point.y - cy, point.x - cx);
        rotation =
          resolvedLayout(p.project.nodes[roots[0]], p.viewport).rotation +
          ((b - a) * 180) / Math.PI;
        rotation = ((rotation + 540) % 360) - 180;
        if (e.shiftKey) rotation = Math.round(rotation / 15) * 15;
        doc.getElementById(roots[0])!.style.transform =
          `rotate(${rotation}deg)`;
        doc.getElementById(roots[0])!.dataset.rotation = String(rotation);
        refresh();
        return;
      }
      if (handle) {
        const layout = resolvedLayout(p.project.nodes[roots[0]], p.viewport);
        const resized = resizeBox(
          bounds,
          handle,
          dx,
          dy,
          layout.ratioLocked || e.shiftKey,
          roots.length === 1 ? layout.rotation : 0,
        );
        lastBoxes = Object.fromEntries(
          roots.map((id) => {
            const b = originalBoxes[id];
            return [
              id,
              roots.length === 1
                ? resized
                : {
                    x:
                      resized.x +
                      ((b.x - bounds.x) * resized.width) / bounds.width,
                    y:
                      resized.y +
                      ((b.y - bounds.y) * resized.height) / bounds.height,
                    width: Math.max(
                      1,
                      (b.width * resized.width) / bounds.width,
                    ),
                    height: Math.max(
                      1,
                      (b.height * resized.height) / bounds.height,
                    ),
                  },
            ];
          }),
        );
      } else if (free) {
        let moved = { ...bounds, x: bounds.x + dx, y: bounds.y + dy };
        if (!e.altKey) {
          const snap = snapBox(moved, snapTargets, 5 / p.scale);
          moved = { ...moved, x: snap.x, y: snap.y };
          const r = parentEl.getBoundingClientRect();
          const gaps = snapTargets
            .slice(1)
            .flatMap((b) => [
              ...(b.y < moved.y + moved.height && b.y + b.height > moved.y
                ? [moved.x - b.x - b.width, b.x - moved.x - moved.width]
                : []),
              ...(b.x < moved.x + moved.width && b.x + b.width > moved.x
                ? [moved.y - b.y - b.height, b.y - moved.y - moved.height]
                : []),
            ])
            .filter((gap) => gap >= 0);
          setGuides(
            elementRotation(parentEl)
              ? {}
              : {
                  x: snap.guideX === undefined ? undefined : r.x + snap.guideX,
                  y: snap.guideY === undefined ? undefined : r.y + snap.guideY,
                  spacing: gaps.length
                    ? `간격 ${Math.round(Math.min(...gaps))}px`
                    : undefined,
                },
          );
        } else setGuides({});
        lastBoxes = Object.fromEntries(
          roots.map((id) => [
            id,
            {
              ...originalBoxes[id],
              x: clamp(
                originalBoxes[id].x + moved.x - bounds.x,
                -100000,
                100000,
              ),
              y: clamp(
                originalBoxes[id].y + moved.y - bounds.y,
                -100000,
                100000,
              ),
            },
          ]),
        );
      } else return;
      for (const [id, box] of Object.entries(lastBoxes)) {
        const el = doc.getElementById(id)!;
        Object.assign(el.style, {
          width: `${box.width}px`,
          height: `${box.height}px`,
          minHeight: "0",
          flex: "0 0 auto",
          ...(free ? { left: `${box.x}px`, top: `${box.y}px` } : {}),
        });
      }
      refresh();
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      clean();
      for (const id of roots)
        doc.getElementById(id)!.dataset.rotation = String(
          resolvedLayout(p.project.nodes[id], p.viewport).rotation,
        );
      if (!changed || selectArea || pan || latest.current.project !== p.project)
        return;
      if (
        !flowTarget &&
        rotation === undefined &&
        Object.keys(lastBoxes).every((id) =>
          Object.keys(lastBoxes[id]).every(
            (key) =>
              Math.abs(
                lastBoxes[id][key as keyof Box] -
                  originalBoxes[id][key as keyof Box],
              ) < 0.01,
          ),
        )
      )
        return;
      try {
        if (rotation !== undefined)
          p.commit(
            patchLayouts(p.project, roots, p.viewport, {
              rotation: Math.round(rotation * 10) / 10,
            }),
          );
        else if (flowTarget) {
          let next = relocateNode(
            p.project,
            roots[0],
            flowTarget.parent,
            flowTarget.index,
            p.viewport,
            doc,
          );
          if (flowTarget.free) {
            const box = originalBoxes[roots[0]];
            next = applyBoxes(
              next,
              p.viewport,
              {
                [roots[0]]: {
                  ...box,
                  x: flowTarget.x - (initialPoint.x - box.x),
                  y: flowTarget.y - (initialPoint.y - box.y),
                },
              },
              flowTarget.size,
            );
          }
          p.commit(next);
        } else if (free || handle) {
          if (free)
            p.commit(applyBoxes(p.project, p.viewport, lastBoxes, parentSize));
          else
            p.commit(
              editProject(p.project, (next) => {
                for (const id of roots) {
                  const box = lastBoxes[id];
                  const patch = {
                    width: box.width,
                    height: box.height,
                    widthMode: "fixed" as const,
                    heightMode: "fixed" as const,
                  };
                  if (p.viewport === "mobile")
                    Object.assign(next.nodes[id].layout, patch);
                  else
                    next.nodes[id].responsive[p.viewport] = {
                      ...next.nodes[id].responsive[p.viewport],
                      ...patch,
                    };
                }
              }),
            );
        }
      } catch (error) {
        p.onMessage?.(
          error instanceof Error
            ? error.message
            : "배치를 변경하지 못했습니다.",
        );
      }
    };
    cancel.current = clean;
    doc.addEventListener("pointermove", move, { passive: false });
    doc.addEventListener("pointerup", up);
    doc.addEventListener("pointercancel", abort);
    capture.addEventListener("lostpointercapture", abort);
  }

  const unlocked = outlines.filter(
    (item) => !item.locked && parentId(props.project, item.id),
  );
  const single = unlocked.length === 1 ? unlocked[0] : null;
  const multi =
    unlocked.length > 1 &&
    unlocked.every(
      (o) =>
        !o.rotation &&
        parentId(props.project, o.id) ===
          parentId(props.project, unlocked[0].id),
    )
      ? unionBox(unlocked)
      : null;
  const controls = single ?? (multi ? { ...multi, rotation: 0 } : null);
  const handleSize = 8 / props.scale;
  return (
    <div
      ref={surface}
      tabIndex={-1}
      className="design-surface"
      onPointerDownCapture={start}
      onClickCapture={(e) => {
        if ((e.target as Element).closest("[data-studio-part-action]")) return;
        if (!(e.target as HTMLElement).closest(".design-inline")) {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      onDoubleClickCapture={(e) => {
        const el = (e.target as HTMLElement).closest<HTMLElement>(".ui-node");
        if (!el || isLocked(props.project, el.id)) return;
        const node = props.project.nodes[el.id],
          key = ["text", "heading", "badge"].includes(node.component)
            ? "text"
            : node.component === "button"
              ? "label"
              : "";
        if (!key) return;
        e.preventDefault();
        e.stopPropagation();
        const r = el.getBoundingClientRect(),
          style = el.ownerDocument.defaultView!.getComputedStyle(
            el.firstElementChild!,
          );
        setInline({
          id: el.id,
          key,
          value: String(node.props[key]),
          box: {
            x: r.x,
            y: r.y,
            width: Math.max(120, r.width),
            height: Math.max(48, r.height),
          },
          fontSize: style.fontSize,
          fontWeight: style.fontWeight,
          lineHeight: style.lineHeight,
        });
      }}
    >
      {props.children}
      <div
        className="design-overlay"
        role="group"
        aria-label="캔버스 편집 도구"
      >
        {outlines.map((o) => (
          <div
            key={o.id}
            className={`design-outline ${o.locked ? "is-locked" : ""}`}
            style={{
              left: o.x,
              top: o.y,
              width: o.width,
              height: o.height,
              transform: `rotate(${o.rotation}deg)`,
            }}
          />
        ))}
        {controls && !inline && !props.partSelection && (
          <div
            className="design-outline"
            style={{
              left: controls.x,
              top: controls.y,
              width: controls.width,
              height: controls.height,
              transform: `rotate(${controls.rotation}deg)`,
            }}
          >
            {single && (
              <button
                type="button"
                className="design-move-label"
                data-move-id={single.id}
                aria-label={`${props.project.nodes[single.id].name} 이동`}
                style={{ fontSize: 11 / props.scale }}
              >
                {props.project.nodes[single.id].name} · 이동
              </button>
            )}
            {HANDLES.map((h) => (
              <button
                key={h}
                type="button"
                className="design-handle"
                data-handle={h}
                aria-label={`크기 조절 ${h}`}
                style={{
                  width: handleSize,
                  height: handleSize,
                  left: h.includes("w") ? 0 : h.includes("e") ? "100%" : "50%",
                  top: h.includes("n") ? 0 : h.includes("s") ? "100%" : "50%",
                  cursor: `${h}-resize`,
                }}
              />
            ))}
            {single && (
              <button
                type="button"
                className="design-handle design-rotation"
                data-handle="rotate"
                aria-label="요소 회전"
                style={{
                  width: handleSize + 2,
                  height: handleSize + 2,
                  left: "50%",
                  top: -24 / props.scale,
                }}
              />
            )}
            <span
              className="design-size"
              style={{ fontSize: 10 / props.scale }}
            >
              {Math.round(controls.width)} × {Math.round(controls.height)}
              {guides.spacing && ` · ${guides.spacing}`}
            </span>
          </div>
        )}
        {partBounds && (
          <div
            className="design-outline design-part-outline"
            style={{
              left: partBounds.x,
              top: partBounds.y,
              width: partBounds.width,
              height: partBounds.height,
            }}
          >
            {HANDLES.map((h) => (
              <button
                key={h}
                type="button"
                className="design-handle"
                data-part-handle={h}
                aria-label={`내부 크기 조절 ${h}`}
                style={{
                  width: handleSize,
                  height: handleSize,
                  left: h.includes("w") ? 0 : h.includes("e") ? "100%" : "50%",
                  top: h.includes("n") ? 0 : h.includes("s") ? "100%" : "50%",
                  cursor: `${h}-resize`,
                }}
              />
            ))}
            <span className="design-size">내부 요소</span>
          </div>
        )}
        {marquee && (
          <div
            className="design-marquee"
            style={{
              left: marquee.x,
              top: marquee.y,
              width: marquee.width,
              height: marquee.height,
            }}
          />
        )}
        {drop && (
          <div
            className="design-drop"
            style={{
              left: drop.x,
              top: drop.y,
              width: drop.width,
              height: drop.height,
            }}
          >
            {drop.label && (
              <small
                style={{
                  position: "absolute",
                  left: 0,
                  bottom: "100%",
                  whiteSpace: "nowrap",
                  background: "#5b64e8",
                  color: "#fff",
                  padding: "3px 6px",
                }}
              >
                {drop.label}
              </small>
            )}
          </div>
        )}
        {guides.x !== undefined && (
          <div
            className="design-guide"
            style={{
              left: guides.x,
              top: 0,
              bottom: 0,
              width: 1 / props.scale,
            }}
          />
        )}
        {guides.y !== undefined && (
          <div
            className="design-guide"
            style={{
              top: guides.y,
              left: 0,
              right: 0,
              height: 1 / props.scale,
            }}
          />
        )}
        {inline && (
          <textarea
            ref={textarea}
            className="design-inline"
            aria-label="캔버스 텍스트 편집"
            defaultValue={inline.value}
            maxLength={20000}
            style={{
              left: inline.box.x,
              top: inline.box.y,
              width: inline.box.width,
              height: inline.box.height,
              fontSize: inline.fontSize,
              fontWeight: inline.fontWeight,
              lineHeight: inline.lineHeight,
            }}
            onCompositionStart={() => {
              composing.current = true;
            }}
            onCompositionEnd={() => {
              composing.current = false;
            }}
            onBlur={() => finishText(true)}
            onKeyDown={(e) => {
              e.stopPropagation();
              if (e.nativeEvent.isComposing || composing.current) return;
              if (e.key === "Escape") {
                e.preventDefault();
                finishText(false);
              } else if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                finishText(true);
              }
            }}
          />
        )}
      </div>
    </div>
  );
}
