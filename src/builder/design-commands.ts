import { DEFINITIONS } from "./catalog";
import { remapNodeReferences } from "./content-references";
import { APPEARANCE_KEYS } from "./design-schema";
import {
  createNode,
  descendants,
  editProject,
  isLocked,
  parentId,
  resolvedLayout,
  uid,
  type Layout,
  type Node,
  type Project,
  type Viewport,
} from "./model";
import { clamp, rotatePoint, unionBox, type Box } from "./geometry";

export function writeLayout(
  node: Node,
  view: Viewport,
  patch: Partial<Layout>,
) {
  const { hidden, ...layout } = patch as Partial<Layout> & { hidden?: boolean };
  if (view === "mobile") {
    Object.assign(node.layout, layout);
    if (hidden !== undefined) node.hidden = hidden;
  } else
    node.responsive[view] = {
      ...node.responsive[view],
      ...layout,
      ...(hidden !== undefined ? { hidden } : {}),
    };
}
export function selectionRoots(project: Project, ids: string[]) {
  const existing = [...new Set(ids)].filter((id) => project.nodes[id]);
  return existing.filter(
    (id) =>
      !existing.some(
        (other) => other !== id && descendants(project, other).includes(id),
      ),
  );
}
export function editableRoots(project: Project, ids: string[]) {
  return selectionRoots(project, ids).filter((id) => !isLocked(project, id));
}
export function patchLayouts(
  project: Project,
  ids: string[],
  view: Viewport,
  patch: Partial<Layout>,
) {
  return editProject(project, (next) => {
    for (const id of editableRoots(project, ids))
      writeLayout(next.nodes[id], view, patch);
  });
}
export function applyBoxes(
  project: Project,
  view: Viewport,
  boxes: Record<string, Box>,
  parentSize?: { width: number; height: number },
) {
  return editProject(project, (next) => {
    for (const [id, box] of Object.entries(boxes)) {
      if (!next.nodes[id] || isLocked(project, id)) continue;
      writeLayout(next.nodes[id], view, {
        x: clamp(box.x, -100000, 100000),
        y: clamp(box.y, -100000, 100000),
        width: clamp(box.width, 1, 20000),
        height: clamp(box.height, 1, 20000),
        widthMode: "fixed",
        heightMode: "fixed",
        ...(parentSize
          ? {
              basisWidth: clamp(parentSize.width, 1, 20000),
              basisHeight: clamp(parentSize.height, 1, 20000),
            }
          : {}),
      });
    }
  });
}
function preserveOtherViews(node: Node, view: Viewport) {
  // Materialize only later breakpoints before a conversion changes inheritance.
  const desktop = resolvedLayout(node, "desktop"),
    tablet = resolvedLayout(node, "tablet");
  if (view === "mobile") node.responsive.tablet = tablet;
  if (view !== "desktop") node.responsive.desktop = desktop;
}
export function convertLayout(
  project: Project,
  id: string,
  view: Viewport,
  mode: "flow" | "free",
  boxes: Record<string, Box>,
  size: { width: number; height: number },
) {
  if (
    isLocked(project, id) ||
    !DEFINITIONS[project.nodes[id].component].container
  )
    return project;
  if (project.nodes[id].children.some((child) => isLocked(project, child)))
    throw new Error("잠긴 자식 요소를 해제한 뒤 배치를 전환하세요.");
  return editProject(project, (next) => {
    const node = next.nodes[id];
    preserveOtherViews(node, view);
    writeLayout(node, view, {
      mode,
      heightMode: mode === "free" ? "fixed" : "auto",
      height: clamp(size.height || 480, 1, 20000),
    });
    for (const child of node.children) {
      const target = next.nodes[child],
        box = boxes[child];
      preserveOtherViews(target, view);
      if (mode === "free" && box)
        writeLayout(target, view, {
          ...box,
          widthMode: "fixed",
          heightMode: "fixed",
          anchorX: "start",
          anchorY: "start",
          basisWidth: clamp(size.width, 1, 20000),
          basisHeight: clamp(size.height, 1, 20000),
          margin: 0,
        });
      else if (mode === "flow")
        writeLayout(target, view, {
          widthMode: "auto",
          heightMode: "auto",
          rotation: 0,
        });
    }
  });
}
export function reorderSelection(
  project: Project,
  ids: string[],
  action: "front" | "back" | "forward" | "backward",
) {
  const roots = editableRoots(project, ids),
    parent = parentId(project, roots[0]);
  if (!parent || roots.some((id) => parentId(project, id) !== parent))
    return project;
  return editProject(project, (next) => {
    const children = next.nodes[parent].children;
    const selected = new Set(roots);
    if (action === "front" || action === "back") {
      const a = children.filter((id) => selected.has(id)),
        b = children.filter((id) => !selected.has(id));
      next.nodes[parent].children =
        action === "front" ? [...b, ...a] : [...a, ...b];
    } else if (action === "forward") {
      for (let i = children.length - 2; i >= 0; i--)
        if (selected.has(children[i]) && !selected.has(children[i + 1]))
          [children[i], children[i + 1]] = [children[i + 1], children[i]];
    } else {
      for (let i = 1; i < children.length; i++)
        if (selected.has(children[i]) && !selected.has(children[i - 1]))
          [children[i], children[i - 1]] = [children[i - 1], children[i]];
    }
  });
}
export type Alignment =
  | "left"
  | "center"
  | "right"
  | "top"
  | "middle"
  | "bottom"
  | "horizontal"
  | "vertical";
export function alignBoxes(
  boxes: Record<string, Box>,
  action: Alignment,
): Record<string, Box> {
  const entries = Object.entries(boxes),
    bounds = unionBox(Object.values(boxes));
  if (action === "horizontal" || action === "vertical") {
    if (entries.length < 3) return boxes;
    const axis = action === "horizontal" ? "x" : "y",
      dimension = axis === "x" ? "width" : "height";
    entries.sort((a, b) => a[1][axis] - b[1][axis]);
    const gap =
      (bounds[dimension] -
        entries.reduce((sum, [, b]) => sum + b[dimension], 0)) /
      (entries.length - 1);
    let position = bounds[axis];
    return Object.fromEntries(
      entries.map(([id, box]) => {
        const result = { ...box, [axis]: position };
        position += box[dimension] + gap;
        return [id, result];
      }),
    );
  }
  return Object.fromEntries(
    entries.map(([id, box]) => [
      id,
      {
        ...box,
        ...(action === "left"
          ? { x: bounds.x }
          : action === "center"
            ? { x: bounds.x + (bounds.width - box.width) / 2 }
            : action === "right"
              ? { x: bounds.x + bounds.width - box.width }
              : {}),
        ...(action === "top"
          ? { y: bounds.y }
          : action === "middle"
            ? { y: bounds.y + (bounds.height - box.height) / 2 }
            : action === "bottom"
              ? { y: bounds.y + bounds.height - box.height }
              : {}),
      },
    ]),
  );
}
export function groupNodes(
  project: Project,
  ids: string[],
  view: Viewport,
  boxes: Record<string, Box>,
) {
  const roots = editableRoots(project, ids),
    parent = parentId(project, roots[0]);
  if (
    roots.length < 2 ||
    !parent ||
    roots.some((id) => parentId(project, id) !== parent) ||
    resolvedLayout(project.nodes[parent], view).mode !== "free"
  )
    throw new Error("같은 자유 배치 영역 안의 요소를 두 개 이상 선택하세요.");
  if (roots.some((id) => !boxes[id]))
    throw new Error("숨겨진 요소는 그룹으로 묶을 수 없습니다.");
  const group = createNode("group"),
    bounds = unionBox(roots.map((id) => boxes[id]));
  group.name = "새 그룹";
  const result = editProject(project, (next) => {
    next.nodes[group.id] = group;
    const siblings = next.nodes[parent].children;
    group.children = siblings.filter((id) => roots.includes(id));
    const at = Math.min(...roots.map((id) => siblings.indexOf(id)));
    next.nodes[parent].children = siblings.filter((id) => !roots.includes(id));
    next.nodes[parent].children.splice(at, 0, group.id);
    // Other breakpoints keep a flow group, or preserve their free coordinates.
    for (const v of ["mobile", "tablet", "desktop"] as const) {
      const parentLayout = resolvedLayout(project.nodes[parent], v);
      const local =
        v === view
          ? boxes
          : Object.fromEntries(
              roots.map((id) => {
                const l = resolvedLayout(project.nodes[id], v);
                return [
                  id,
                  { x: l.x, y: l.y, width: l.width, height: l.height },
                ];
              }),
            );
      const b = v === view ? bounds : unionBox(roots.map((id) => local[id]));
      writeLayout(group, v, {
        mode: parentLayout.mode,
        x: b.x,
        y: b.y,
        width: Math.max(1, b.width),
        height: Math.max(1, b.height),
        widthMode: parentLayout.mode === "free" ? "fixed" : "auto",
        heightMode: parentLayout.mode === "free" ? "fixed" : "auto",
        gap: 0,
        padding: 0,
        margin: 0,
      });
      for (const id of roots)
        writeLayout(next.nodes[id], v, {
          ...resolvedLayout(project.nodes[id], v),
          ...(parentLayout.mode === "free"
            ? {
                x: local[id].x - b.x,
                y: local[id].y - b.y,
                width: local[id].width,
                height: local[id].height,
                anchorX: "start",
                anchorY: "start",
              }
            : {}),
        });
    }
  });
  return { project: result, ids: [group.id] };
}
export function ungroupNode(project: Project, id: string) {
  const node = project.nodes[id],
    parent = parentId(project, id);
  if (
    !parent ||
    node.component !== "group" ||
    isLocked(project, id) ||
    node.children.some((child) => isLocked(project, child))
  )
    throw new Error("잠기지 않은 그룹을 선택하세요.");
  const result = editProject(project, (next) => {
    const index = next.nodes[parent].children.indexOf(id);
    next.nodes[parent].children.splice(index, 1, ...node.children);
    for (const child of node.children)
      for (const view of ["mobile", "tablet", "desktop"] as const) {
        const g = resolvedLayout(node, view),
          c = resolvedLayout(project.nodes[child], view);
        const center = rotatePoint(
          c.x + c.width / 2 - g.width / 2,
          c.y + c.height / 2 - g.height / 2,
          g.rotation,
        );
        writeLayout(next.nodes[child], view, {
          ...c,
          ...(resolvedLayout(project.nodes[parent], view).mode === "free"
            ? {
                x: g.x + g.width / 2 + center.x - c.width / 2,
                y: g.y + g.height / 2 + center.y - c.height / 2,
                rotation: ((c.rotation + g.rotation + 540) % 360) - 180,
              }
            : {}),
        });
      }
    delete next.nodes[id];
  });
  return { project: result, ids: node.children };
}
export type ClipboardNodes = { roots: string[]; nodes: Record<string, Node>; assets?: Project["assets"] };
export function copyNodes(project: Project, ids: string[]): ClipboardNodes {
  const roots = selectionRoots(project, ids).filter((id) =>
    parentId(project, id),
  );
  return {
    roots,
    assets: structuredClone(project.assets),
    nodes: Object.fromEntries(
      roots
        .flatMap((id) => descendants(project, id))
        .map((id) => [id, structuredClone(project.nodes[id])]),
    ),
  };
}
export function pasteNodes(
  project: Project,
  clipboard: ClipboardNodes,
  parent: string,
  offset = 24,
) {
  if (
    !DEFINITIONS[project.nodes[parent]?.component]?.container ||
    isLocked(project, parent)
  )
    throw new Error("붙여넣을 수 있는 영역을 선택하세요.");
  const mapping = Object.fromEntries(
    Object.keys(clipboard.nodes).map((id) => [id, uid("node")]),
  );
  const result = editProject(project, (next) => {
    Object.assign(next.assets, clipboard.assets ?? {});
    for (const [id, node] of Object.entries(clipboard.nodes)) {
      const copy = structuredClone(node);
      copy.id = mapping[id];
      copy.children = copy.children.map((child) => mapping[child]);
      remapNodeReferences(copy, DEFINITIONS[copy.component], mapping);
      if (clipboard.roots.includes(id)) {
        copy.name = `${copy.name} 사본`.slice(0, 100);
        for (const view of ["mobile", "tablet", "desktop"] as const) {
          const layout = resolvedLayout(node, view);
          writeLayout(copy, view, {
            ...layout,
            x: clamp(layout.x + offset, -100000, 100000),
            y: clamp(layout.y + offset, -100000, 100000),
          });
        }
      }
      next.nodes[copy.id] = copy;
    }
    next.nodes[parent].children.push(
      ...clipboard.roots.map((id) => mapping[id]),
    );
  });
  return { project: result, ids: clipboard.roots.map((id) => mapping[id]) };
}
export function deleteNodes(project: Project, ids: string[]) {
  return editProject(project, (next) => {
    for (const id of editableRoots(project, ids)) {
      const parent = parentId(project, id);
      if (!parent) continue;
      next.nodes[parent].children = next.nodes[parent].children.filter(
        (child) => child !== id,
      );
      for (const child of descendants(project, id)) delete next.nodes[child];
    }
  });
}
export function appearanceOf(node: Node, view: Viewport): Partial<Layout> {
  const layout = resolvedLayout(node, view);
  return Object.fromEntries(APPEARANCE_KEYS.map((key) => [key, layout[key]]));
}
