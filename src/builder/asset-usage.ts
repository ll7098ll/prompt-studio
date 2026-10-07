import type { Project } from "./model";
import { DEFINITIONS } from "./catalog";
import { referencedAssetId } from "./asset-model";

export function assetUsage(project: Project): Map<string, number> {
  const counts = new Map<string, number>();
  const add = (id?: string) => {
    if (id) counts.set(id, (counts.get(id) ?? 0) + 1);
  };
  add(project.theme.bodyFontAsset);
  add(project.theme.headingFontAsset);
  for (const node of Object.values(project.nodes)) {
    for (const part of Object.values(node.parts ?? {})) add(referencedAssetId(part.attributes?.src ?? ""));
    const definition = DEFINITIONS[node.component];
    for (const field of definition.fields)
      if (field.type === "asset")
        add(referencedAssetId(String(node.props[field.key] ?? "")));
    for (const [key, collection] of Object.entries(
      definition.collections ?? {},
    ))
      for (const item of node.content?.[key] ?? [])
        for (const field of collection.fields)
          if (field.type === "asset")
            add(referencedAssetId(String(item.values[field.key] ?? "")));
  }
  return counts;
}
