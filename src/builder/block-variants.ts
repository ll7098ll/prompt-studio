import { DEFINITIONS } from "./catalog";
import { populateRecipe } from "./component-recipes";
import {
  descendants,
  editProject,
  createNode,
  isLocked,
  type Project,
} from "./model";
import { APPEARANCE_KEYS } from "./design-schema";
export function changeBlockStructure(
  project: Project,
  id: string,
  component: string,
): Project {
  const original = project.nodes[id];
  if (
    !original?.component.startsWith("block-") ||
    !component.startsWith(original.component.replace(/-\d+$/, "-")) ||
    !DEFINITIONS[component] ||
    isLocked(project, id)
  )
    throw Error("이 블록의 구조를 변경할 수 없습니다.");
  return editProject(project, (next) => {
    const ids = descendants(next, id).slice(1),
      old = ids.map((id) => next.nodes[id]);
    const leaves = old.filter((node) => !DEFINITIONS[node.component].container);
    if (old.some((node) => node.locked))
      throw Error("잠긴 내부 요소를 먼저 해제하세요.");
    const parent = next.nodes[id];
    parent.component = component;
    parent.children = [];
    populateRecipe(next, parent);
    const freshIds = descendants(next, id).slice(1);
    const used = new Set<string>();
    for (const freshId of freshIds) {
      const fresh = next.nodes[freshId];
      const match = old.find(
        (node) => node.component === fresh.component && !used.has(node.id),
      );
      if (!match) continue;
      used.add(match.id);
      if (DEFINITIONS[fresh.component].container) {
        fresh.appearance = match.appearance;
        for (const key of APPEARANCE_KEYS)
          if (key in match.layout)
            Object.assign(fresh.layout, { [key]: match.layout[key] });
        continue;
      }
      const owner = Object.values(next.nodes).find((node) =>
        node.children.includes(freshId),
      )!;
      owner.children[owner.children.indexOf(freshId)] = match.id;
      delete next.nodes[freshId];
    }
    // Keep any unmatched authored content in an extra stack instead of dropping it.
    const unmatched = leaves.filter((node) => !used.has(node.id));
    if (unmatched.length) {
      const extra = createNode("stack");
      next.nodes[extra.id] = extra;
      parent.children.push(extra.id);
      extra.children = unmatched.map((node) => node.id);
    }
    const keep = new Set([...descendants(next, id)]);
    for (const oldId of ids) if (!keep.has(oldId)) delete next.nodes[oldId];
  });
}
