import manifest from "./builtin-assets.json";
import type { Asset } from "./asset-model";
import type { Node, Project } from "./model";

export const BUILTIN_ASSETS = manifest as Record<
  keyof typeof manifest,
  { path: string; asset: Asset }
>;
export const BUILTIN_BY_ID = new Map(
  Object.values(BUILTIN_ASSETS).map((entry) => [entry.asset.id, entry]),
);
export const builtinSource = (key: keyof typeof manifest) =>
  `asset:${BUILTIN_ASSETS[key].asset.id}`;

// Metadata travels with the document. Bytes are imported lazily from the local
// installation, then use the same immutable storage and ZIP path as uploads.
export function attachBuiltinAssets(project: Project, node: Node) {
  const values = [
    ...Object.values(node.props),
    ...Object.values(node.content ?? {}).flatMap((items) =>
      items.flatMap((item) => Object.values(item.values)),
    ),
    ...Object.values(node.parts ?? {}).flatMap((part) =>
      Object.values(part.attributes ?? {}),
    ),
  ];
  for (const value of values) {
    if (typeof value !== "string" || !value.startsWith("asset:")) continue;
    const entry = BUILTIN_BY_ID.get(value.slice(6));
    if (entry) project.assets[entry.asset.id] = structuredClone(entry.asset);
  }
}
