import { DEFINITIONS } from "./catalog";
import { createNode, uid, type Node, type Project } from "./model";
import type { Recipe } from "./more-catalog";
import { attachBuiltinAssets } from "./builtin-assets";

export function populateRecipe(project: Project, parent: Node): boolean {
  const recipe = DEFINITIONS[parent.component].recipe;
  if (!recipe) return false;
  const keys = new Map<string, string>();
  const created: Node[] = [];
  function add(target: Node, parts: Recipe[]) {
    for (const part of parts) {
      const node = createNode(part.component);
      created.push(node);
      if (part.key) keys.set(part.key, node.id);
      Object.assign(node.props, part.props);
      Object.assign(node.layout, part.layout);
      if (parent.component.startsWith("block-") || node.component === "grid") {
        if (node.layout.columns > 1) {
          node.responsive.desktop = {
            ...node.responsive.desktop,
            columns: node.layout.columns,
          };
          node.responsive.tablet = {
            ...node.responsive.tablet,
            columns: Math.min(2, node.layout.columns),
          };
          node.layout.columns = 1;
        }
      }
      if (part.responsive) node.responsive = structuredClone(part.responsive);
      if (part.appearance) node.appearance = structuredClone(part.appearance);
      if (part.parts) node.parts = structuredClone(part.parts);
      for (const [key, values] of Object.entries(part.content ?? {})) {
        const collection = DEFINITIONS[node.component].collections?.[key];
        if (!collection)
          throw Error(`Unknown recipe collection: ${node.component}.${key}`);
        node.content ??= {};
        node.content[key] = values.map((values) => ({
          id: uid("item"),
          values: { ...collection.defaults, ...values },
        }));
      }
      attachBuiltinAssets(project, node);
      project.nodes[node.id] = node;
      target.children.push(node.id);
      if (part.children) add(node, part.children);
    }
  }
  add(parent, recipe);
  for (const node of created) {
    const definition = DEFINITIONS[node.component];
    for (const [key, collection] of Object.entries(
      definition.collections ?? {},
    )) {
      for (const field of collection.fields.filter(
        (field) => field.type === "node-ref",
      )) {
        for (const item of node.content?.[key] ?? []) {
          const value = item.values[field.key];
          if (typeof value === "string" && value.startsWith("@")) {
            const target = keys.get(value.slice(1));
            if (!target) throw Error(`Unknown recipe reference: ${value}`);
            item.values[field.key] = target;
          }
        }
      }
    }
    for (const field of ["href"]) {
      const value = node.props[field];
      if (typeof value === "string" && value.startsWith("@")) {
        const target = keys.get(value.slice(1));
        if (!target) throw Error(`Unknown recipe link: ${value}`);
        node.props[field] = `#${target}`;
      }
    }
  }
  return true;
}
