import type { Definition } from "./catalog";
import type { Node } from "./model";
/** Seeds are resolved once, after every collection has received stable IDs. */
export function resolveInitialReferences(node: Node, definition: Definition) {
  for (const [key, collection] of Object.entries(definition.collections ?? {}))
    for (const item of node.content?.[key] ?? [])
      for (const field of collection.fields) {
        if (field.type !== "item-ref" || !field.refCollection) continue;
        const match = /^@([a-zA-Z0-9_-]+)\.(\d+)$/.exec(
          String(item.values[field.key]),
        );
        if (match?.[1] === field.refCollection)
          item.values[field.key] =
            node.content?.[field.refCollection]?.[Number(match[2]) - 1]?.id ??
            "";
      }
}
export function remapNodeReferences(
  node: Node,
  definition: Definition,
  mapping: Record<string, string>,
) {
  const remapLink = (value: string) =>
    value.startsWith("#") && Object.hasOwn(mapping, value.slice(1))
      ? `#${mapping[value.slice(1)]}`
      : value;
  if (typeof node.props.href === "string")
    node.props.href = remapLink(node.props.href);
  for (const part of Object.values(node.parts ?? {}))
    if (part.attributes?.href)
      part.attributes.href = remapLink(part.attributes.href);
  for (const field of definition.fields)
    if (
      field.type === "node-ref" &&
      Object.hasOwn(mapping, String(node.props[field.key]))
    )
      node.props[field.key] = mapping[String(node.props[field.key])];
  for (const [key, collection] of Object.entries(definition.collections ?? {}))
    for (const item of node.content?.[key] ?? [])
      for (const field of collection.fields)
        if (
          field.type === "node-ref" &&
          Object.hasOwn(mapping, String(item.values[field.key]))
        )
          item.values[field.key] = mapping[String(item.values[field.key])];
}
