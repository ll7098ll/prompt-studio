import { DEFINITIONS } from "./catalog";
import {
  descendants,
  isLocked,
  resolvedLayout,
  type Project,
  type Viewport,
} from "./model";
import { localPoint, elementSize, type Box } from "./geometry";
export type DropTarget = {
  parent: string;
  index: number;
  x: number;
  y: number;
  free: boolean;
  size: { width: number; height: number };
  indicator: Box;
};
export function findDropTarget(
  project: Project,
  doc: Document,
  viewport: Viewport,
  x: number,
  y: number,
  exclude: string[] = [],
): DropTarget | null {
  const excluded = new Set(exclude.flatMap((id) => descendants(project, id)));
  let hit: HTMLElement | null = null;
  for (const element of doc.elementsFromPoint(x, y)) {
    const node = element.closest<HTMLElement>(".ui-node");
    if (node && project.nodes[node.id] && !excluded.has(node.id)) {
      hit = node;
      break;
    }
  }
  const target = hit?.closest<HTMLElement>(".ui-container");
  if (!target || excluded.has(target.id) || isLocked(project, target.id))
    return null;
  const node = project.nodes[target.id];
  if (!node || !DEFINITIONS[node.component].container) return null;
  const layout = resolvedLayout(node, viewport),
    free = layout.mode === "free";
  const children = node.children.filter((id) => !excluded.has(id));
  const point = localPoint(target, x, y),
    size = elementSize(target),
    r = target.getBoundingClientRect();
  if (free)
    return {
      parent: node.id,
      index: children.length,
      ...point,
      size,
      free,
      indicator: { x, y, width: Math.min(240, size.width), height: 80 },
    };
  const row = layout.direction === "row" || node.component === "grid";
  let index = children.findIndex((id) => {
    const rect = doc.getElementById(id)?.getBoundingClientRect();
    return (
      rect &&
      (row
        ? y < rect.bottom && x < rect.x + rect.width / 2
        : y < rect.y + rect.height / 2)
    );
  });
  if (index < 0) index = children.length;
  const edge = doc
    .getElementById(children[index] ?? children.at(-1) ?? "")
    ?.getBoundingClientRect();
  const indicator = edge
    ? row
      ? {
          x: index === children.length ? edge.right : edge.left,
          y: edge.y,
          width: 3,
          height: edge.height,
        }
      : {
          x: edge.x,
          y: index === children.length ? edge.bottom : edge.top,
          width: edge.width,
          height: 3,
        }
    : {
        x: r.x + 12,
        y: r.y + 12,
        width: Math.max(20, r.width - 24),
        height: 3,
      };
  return { parent: node.id, index, ...point, size, free, indicator };
}
