import type { Node, Part } from "./model";
import type { Collection, Prop } from "./catalog";

export type ContentItem = { id: string; values: Record<string, Prop> };
export function contentItems(
  node: Node,
  key: string,
  collection: Collection,
): ContentItem[] {
  if (node.content?.[key]) return node.content[key];
  if (!collection.legacy) return [];
  return String(node.props[collection.legacy.prop] ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((line, index) => {
      const cells = line.split("|");
      return {
        id: `legacy-${index}`,
        values: {
          ...collection.defaults,
          ...Object.fromEntries(
            collection.legacy!.keys.map((key, i) => [key, cells[i] ?? ""]),
          ),
        },
      };
    });
}
export const itemSlot = (id: string, field?: string) =>
  `item-${id}${field ? `.${field}` : ""}`;

/** Preserve every legacy gallery descendant override when switching to item IDs. */
export function migrateGalleryParts(node: Node, items: ContentItem[]) {
  if (node.component !== "gallery" || node.content?.items || !node.parts)
    return;
  const parts: Record<string, Part> = {};
  for (const [path, part] of Object.entries(node.parts)) {
    const match = /^p\.0\.1\.(\d+)(.*)$/.exec(path);
    if (match && items[Number(match[1])]) {
      const item = items[Number(match[1])],
        field =
          match[2] === ".1"
            ? "category"
            : match[2] === ".2"
              ? "title"
              : undefined;
      if (field && part.text !== undefined) {
        item.values[field] = part.text;
        delete part.text;
      }
      parts[
        `slot.${itemSlot(item.id)}${field ? `.${field}` : match[2] ? `.child${match[2]}` : ""}`
      ] = part;
    } else parts[path] = part;
  }
  node.parts = parts;
}
