import { applyBoxes, patchLayouts } from "./design-commands";
import { boxInParent, elementRotation, elementSize } from "./geometry";
import {
  moveNode,
  parentId,
  resolvedLayout,
  type Project,
  type Viewport,
} from "./model";

export function relocateNode(
  project: Project,
  id: string,
  target: string,
  index: number,
  view: Viewport,
  doc: Document | null,
) {
  if (parentId(project, id) === target)
    return moveNode(project, id, target, index);
  const element = doc?.getElementById(id),
    parent = doc?.getElementById(target);
  const box = element && parent ? boxInParent(element, parent) : null;
  let next = moveNode(project, id, target, index);
  if (
    box &&
    parent &&
    element &&
    resolvedLayout(project.nodes[target], view).mode === "free"
  ) {
    next = applyBoxes(next, view, { [id]: box }, elementSize(parent));
    next = patchLayouts(next, [id], view, {
      rotation:
        ((elementRotation(element) - elementRotation(parent) + 540) % 360) -
        180,
      anchorX: "start",
      anchorY: "start",
    });
  }
  return next;
}
