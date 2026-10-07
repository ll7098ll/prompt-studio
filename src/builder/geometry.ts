export type Box = { x: number; y: number; width: number; height: number };
export type Handle = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";
export const HANDLES: Handle[] = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];
export const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, n));
export const rounded = (n: number) => Math.round(n * 100) / 100;
export function unionBox(boxes: Box[]): Box {
  if (!boxes.length) return { x: 0, y: 0, width: 0, height: 0 };
  const x = Math.min(...boxes.map((b) => b.x)),
    y = Math.min(...boxes.map((b) => b.y));
  return {
    x,
    y,
    width: Math.max(...boxes.map((b) => b.x + b.width)) - x,
    height: Math.max(...boxes.map((b) => b.y + b.height)) - y,
  };
}
export function rotatePoint(x: number, y: number, degrees: number) {
  const a = (degrees * Math.PI) / 180;
  return {
    x: x * Math.cos(a) - y * Math.sin(a),
    y: x * Math.sin(a) + y * Math.cos(a),
  };
}
export function resizeBox(
  box: Box,
  handle: Handle,
  dx: number,
  dy: number,
  ratio: boolean,
  rotation = 0,
): Box {
  const d = rotatePoint(dx, dy, -rotation);
  let width = clamp(
    box.width + (handle.includes("e") ? d.x : handle.includes("w") ? -d.x : 0),
    1,
    20000,
  );
  let height = clamp(
    box.height + (handle.includes("s") ? d.y : handle.includes("n") ? -d.y : 0),
    1,
    20000,
  );
  if (ratio) {
    const aspect = box.width / Math.max(1, box.height);
    if (
      handle === "n" ||
      handle === "s" ||
      Math.abs(height / box.height - 1) > Math.abs(width / box.width - 1)
    )
      width = height * aspect;
    else height = width / aspect;
    const limit = Math.min(1, 20000 / width, 20000 / height);
    width = Math.max(1, width * limit);
    height = Math.max(1, height * limit);
  }
  const shift = rotatePoint(
    handle.includes("w")
      ? (box.width - width) / 2
      : handle.includes("e")
        ? (width - box.width) / 2
        : 0,
    handle.includes("n")
      ? (box.height - height) / 2
      : handle.includes("s")
        ? (height - box.height) / 2
        : 0,
    rotation,
  );
  return {
    x: rounded(box.x + (box.width - width) / 2 + shift.x),
    y: rounded(box.y + (box.height - height) / 2 + shift.y),
    width: rounded(width),
    height: rounded(height),
  };
}
export function snapBox(box: Box, targets: Box[], distance: number) {
  let dx = distance + 1,
    dy = distance + 1;
  let guideX: number | undefined, guideY: number | undefined;
  for (const target of targets) {
    for (const a of [
      target.x,
      target.x + target.width / 2,
      target.x + target.width,
    ])
      for (const b of [box.x, box.x + box.width / 2, box.x + box.width])
        if (Math.abs(a - b) <= distance && Math.abs(a - b) < Math.abs(dx)) {
          dx = a - b;
          guideX = a;
        }
    for (const a of [
      target.y,
      target.y + target.height / 2,
      target.y + target.height,
    ])
      for (const b of [box.y, box.y + box.height / 2, box.y + box.height])
        if (Math.abs(a - b) <= distance && Math.abs(a - b) < Math.abs(dy)) {
          dy = a - b;
          guideY = a;
        }
  }
  return {
    x: box.x + (guideX === undefined ? 0 : dx),
    y: box.y + (guideY === undefined ? 0 : dy),
    guideX,
    guideY,
  };
}
export function elementRotation(el: HTMLElement): number {
  let rotation = 0;
  for (let node: HTMLElement | null = el; node; node = node.parentElement) {
    if (node.matches(".ui-node"))
      rotation += Number(node.dataset.rotation ?? 0);
  }
  return rotation;
}
export function elementSize(el: HTMLElement) {
  const style = el.ownerDocument.defaultView!.getComputedStyle(el);
  return {
    width: parseFloat(style.width) || el.offsetWidth,
    height: parseFloat(style.height) || el.offsetHeight,
  };
}
// iframe pointer coordinates and DOM rects are already in its own CSS pixels.
export function localPoint(el: HTMLElement, x: number, y: number) {
  const r = el.getBoundingClientRect(),
    size = elementSize(el);
  const p = rotatePoint(
    x - r.x - r.width / 2,
    y - r.y - r.height / 2,
    -elementRotation(el),
  );
  return {
    x: p.x + size.width / 2 - el.clientLeft + el.scrollLeft,
    y: p.y + size.height / 2 - el.clientTop + el.scrollTop,
  };
}
export function boxInParent(el: HTMLElement, parent: HTMLElement): Box {
  const r = el.getBoundingClientRect(),
    size = elementSize(el);
  const center = localPoint(parent, r.x + r.width / 2, r.y + r.height / 2);
  return {
    x: rounded(center.x - size.width / 2),
    y: rounded(center.y - size.height / 2),
    width: size.width,
    height: size.height,
  };
}
export function measureChildren(
  doc: Document,
  parentId: string,
): Record<string, Box> {
  const parent = doc.getElementById(parentId);
  if (!parent) return {};
  return Object.fromEntries(
    Array.from(parent.children)
      .filter(
        (el): el is HTMLElement =>
          el instanceof doc.defaultView!.HTMLElement &&
          el.classList.contains("ui-node"),
      )
      .map((el) => [el.id, boxInParent(el, parent)]),
  );
}
