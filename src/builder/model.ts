import { z } from "zod";
import { motionSettingsSchema } from "./motion-settings";
import { DEFINITIONS } from "./catalog";
import { resolveInitialReferences, remapNodeReferences } from "./content-references";
import { THEME_PRESETS } from "./theme";
import { designFields, DESIGN_DEFAULTS } from "./design-schema";
import { DESIGN_FAMILIES, MOTIONS } from "./visual-presets";
import { assetIdSchema, assetsSchema, referencedAssetId } from "./asset-model";
import { typographySchema, surfaceSchema, themeMotionSchema, packSourcesSchema } from "./design-pack-schema";
import { partFields, partAttributesSchema } from "./part-schema";

export const CURRENT_SCHEMA_VERSION = 5;

const safeId = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-zA-Z0-9_-]+$/)
  .refine((id) => !["__proto__", "prototype", "constructor"].includes(id));
const colors = z
  .strictObject({
    background: z.string(),
    surface: z.string(),
    foreground: z.string(),
    muted: z.string(),
    border: z.string(),
    primary: z.string(),
    onPrimary: z.string(),
    soft: z.string(),
  })
  .refine(
    (c) => Object.values(c).every((value) => /^#[0-9a-f]{6}$/i.test(value)),
    "색상은 #RRGGBB 형식이어야 합니다.",
  );
const legacyLayoutSchema = z.strictObject({
  direction: z.enum(["row", "column"]),
  columns: z.number().int().min(1).max(6),
  gap: z.number().min(0).max(160),
  padding: z.number().min(0).max(240),
  maxWidth: z.number().min(240).max(2400),
  align: z.enum(["start", "center", "end", "stretch"]),
  justify: z
    .enum(["start", "center", "end", "space-between", "space-around"])
    .optional(),
  wrap: z.boolean().optional(),
  widthMode: z.enum(["auto", "content", "fill", "fixed"]).optional(),
  width: z.number().min(1).max(2400).optional(),
  span: z.number().int().min(1).max(6).optional(),
  margin: z.number().min(0).max(240).optional(),
  minHeight: z.number().min(0).max(2000).optional(),
});
const layoutSchema = legacyLayoutSchema.extend({
  ...designFields,
  width: z.number().min(1).max(20000).optional(),
});
const overrideSchema = layoutSchema
  .partial()
  .extend({ hidden: z.boolean().optional() });
const partLayoutSchema = layoutSchema.partial().extend(partFields);
const partSchema = z.strictObject({
  attributes: partAttributesSchema.optional(),
  text: z.string().max(20000).optional(),
  label: z.string().max(120).optional(),
  layout: partLayoutSchema,
  responsive: z.strictObject({
    tablet: partLayoutSchema.optional(),
    desktop: partLayoutSchema.optional(),
  }),
});
const nodeSchema = z.strictObject({
  id: safeId,
  component: z
    .string()
    .refine(
      (id) => Object.hasOwn(DEFINITIONS, id),
      "알 수 없는 컴포넌트입니다.",
    ),
  name: z.string().min(1).max(100),
  children: z.array(safeId).max(500),
  props: z.record(
    z.string().max(100),
    z.union([z.string().max(20000), z.number().finite(), z.boolean()]),
  ),
  layout: layoutSchema,
  responsive: z.strictObject({
    tablet: overrideSchema.optional(),
    desktop: overrideSchema.optional(),
  }),
  hidden: z.boolean(),
  locked: z.boolean(),
  parts: z
    .record(
      z
        .string()
        .regex(/^(?:p(?:\.\d{1,4}){1,24}|slot\.[a-zA-Z0-9_.-]{1,100})$/),
      partSchema,
    )
    .refine((parts) => Object.keys(parts).length <= 5000, "한 컴포넌트의 개별 부분 수정은 5,000개까지 저장할 수 있습니다.")
    .optional(),
  appearance: z
    .strictObject({
      renderer: z.enum(["classic", "shadcn"]).optional(),
      family: z
        .enum(["legacy", ...DESIGN_FAMILIES.map((f) => f.id)])
        .optional(),
      motion: z.enum(MOTIONS.map((m) => m[0])).optional(),
      motionSettings: motionSettingsSchema.optional(),
      blockPreset: z
        .string()
        .regex(/^[a-z0-9-]{1,80}$/)
        .optional(),
    })
    .optional(),
});
const v4DocumentSchema = z.strictObject({
  schemaVersion: z.literal(4),
  id: safeId,
  name: z.string().min(1).max(100),
  revision: z.number().int().nonnegative(),
  updatedAt: z.string().datetime(),
  pages: z
    .array(
      z.strictObject({
        id: safeId,
        name: z.string().min(1).max(100),
        slug: z
          .string()
          .regex(/^\/[a-zA-Z0-9/_-]*$/)
          .max(150),
        rootId: safeId,
      }),
    )
    .min(1)
    .max(30),
  nodes: z.record(safeId, nodeSchema),
  theme: z.strictObject({
    name: z.string().max(100),
    mode: z.enum(["light", "dark"]),
    light: colors,
    dark: colors,
    radius: z.number().min(0).max(48),
    density: z.number().min(0.5).max(1.5),
    font: z.enum(["sans", "serif", "mono"]),
  }),
});
export const documentSchema = v4DocumentSchema.extend({
  schemaVersion: z.literal(CURRENT_SCHEMA_VERSION),
  assets: assetsSchema,
  nodes: z.record(safeId, nodeSchema.extend({
    content: z.record(safeId, z.array(z.strictObject({ id: safeId, values: z.record(safeId, z.union([z.string().max(20000), z.number().finite(), z.boolean()])) })).max(100)).optional(),
  })),
  theme: v4DocumentSchema.shape.theme.extend({
    headingFont: z.enum(["sans", "serif", "mono"]).optional(),
    bodyFontAsset: assetIdSchema.optional(),
    headingFontAsset: assetIdSchema.optional(),
    typography: typographySchema.optional(),
    surface: surfaceSchema.optional(),
    motion: themeMotionSchema.optional(),
    packSources: packSourcesSchema.optional(),
  }),
});
const v3DocumentSchema = v4DocumentSchema.extend({
  schemaVersion: z.literal(3),
  nodes: z.record(safeId, nodeSchema.omit({ appearance: true })),
});
const legacyDocumentSchema = v4DocumentSchema.extend({
  schemaVersion: z.literal(2),
  nodes: z.record(
    safeId,
    nodeSchema.extend({
      layout: legacyLayoutSchema,
      responsive: z.strictObject({
        tablet: legacyLayoutSchema
          .partial()
          .extend({ hidden: z.boolean().optional() })
          .optional(),
        desktop: legacyLayoutSchema
          .partial()
          .extend({ hidden: z.boolean().optional() })
          .optional(),
      }),
    }),
  ),
});
export type Project = z.infer<typeof documentSchema>;
export type Node = Project["nodes"][string];
export type Layout = Node["layout"];
export type Part = z.infer<typeof partSchema>;
export type PartLayout = z.infer<typeof partLayoutSchema>;
export type Viewport = "mobile" | "tablet" | "desktop";
export const DEFAULT_LAYOUT: Required<Layout> = {
  ...DESIGN_DEFAULTS,
  direction: "column",
  columns: 1,
  gap: 24,
  padding: 0,
  maxWidth: 1120,
  align: "stretch",
  justify: "start",
  wrap: false,
  widthMode: "auto",
  width: 240,
  span: 1,
  margin: 0,
  minHeight: 0,
};
export function uid(prefix = "node"): string {
  return `${prefix}-${crypto.randomUUID()}`;
}
export function createNode(component: string, id = uid()): Node {
  const def = DEFINITIONS[component];
  if (!def) throw new Error("지원하지 않는 컴포넌트입니다.");
  const node: Node = {
    id,
    component,
    name: def.name,
    children: [],
    props: { ...def.defaults },
    ...(def.collections && !Object.values(def.collections).some(c => c.legacy) ? { content: Object.fromEntries(Object.entries(def.collections).map(([key, c]) => [key, (c.initial ?? []).map(values => ({ id: uid("item"), values: { ...c.defaults, ...values } }))])) } : {}),
    layout: {
      ...DEFAULT_LAYOUT,
      padding: component === "section" ? 48 : component === "card" ? 24 : 0,
      ...(["frame", "group"].includes(component)
        ? { mode: "free" as const, heightMode: "fixed" as const, height: 480 }
        : {}),
      ...(component === "shape"
        ? {
            widthMode: "fixed" as const,
            width: 160,
            heightMode: "fixed" as const,
            height: 120,
            fillColor: "theme:primary",
          }
        : {}),
      ...def.initialLayout,
    },
    responsive:
      component === "grid"
        ? { tablet: { columns: 2 }, desktop: { columns: 3 } }
        : {},
    hidden: false,
    locked: false,
  };
  resolveInitialReferences(node, def);
  return node;
}
export function parseProject(value: unknown): Project {
  let source = value;
  if (
    value &&
    typeof value === "object" &&
    "schemaVersion" in value &&
    value.schemaVersion === 2
  ) {
    const legacy = legacyDocumentSchema.safeParse(value);
    if (!legacy.success)
      throw new Error("이전 프로젝트의 구조나 속성 값이 올바르지 않습니다.");
    source = { ...legacy.data, schemaVersion: 4 };
  }
  if (
    source &&
    typeof source === "object" &&
    "schemaVersion" in source &&
    source.schemaVersion === 3
  ) {
    const legacy = v3DocumentSchema.safeParse(source);
    if (!legacy.success)
      throw new Error("이전 프로젝트의 구조나 속성 값이 올바르지 않습니다.");
    source = { ...legacy.data, schemaVersion: 4 };
  }
  if (source && typeof source === "object" && "schemaVersion" in source && source.schemaVersion === 4) {
    const previous = v4DocumentSchema.safeParse(source);
    if (!previous.success) throw new Error("이전 프로젝트의 구조나 속성 값이 올바르지 않습니다.");
    source = { ...previous.data, schemaVersion: CURRENT_SCHEMA_VERSION, assets: {} };
  }
  const result = documentSchema.safeParse(source);
  if (!result.success) {
    if (result.error.issues.some((issue) => issue.path.includes("slug")))
      throw new Error(
        "페이지 경로는 /로 시작하고 영문, 숫자, /, -, _만 사용할 수 있습니다.",
      );
    throw new Error(
      "프로젝트의 구조나 속성 값이 올바르지 않습니다. Prompt Studio에서 내보낸 파일인지 확인해주세요.",
    );
  }
  const p = result.data;
  const ids = Object.keys(p.nodes);
  if (ids.length > 2000)
    throw new Error("프로젝트는 최대 2,000개 요소를 지원합니다.");
  const seen = new Set<string>();
  const pageIds = new Set<string>();
  const slugs = new Set<string>();
  function visit(id: string, depth: number, root = false) {
    const node = p.nodes[id];
    if (!node || node.id !== id)
      throw new Error("참조하는 요소를 찾을 수 없습니다.");
    if (depth > 24) throw new Error("요소 중첩은 최대 24단계입니다.");
    if (seen.has(id)) throw new Error("순환 또는 중복된 요소 참조가 있습니다.");
    if ((node.component === "page") !== root)
      throw new Error("페이지 루트 구조가 올바르지 않습니다.");
    if (node.children.length && !DEFINITIONS[node.component].container)
      throw new Error("이 요소에는 자식을 넣을 수 없습니다.");
    const def = DEFINITIONS[node.component];
    for (const part of Object.values(node.parts ?? {})) {
      const id = referencedAssetId(part.attributes?.src ?? "");
      if (id && p.assets[id]?.kind !== "image") throw Error("내부 이미지에 연결된 자산을 찾을 수 없습니다.");
    }
    for (const [key, items] of Object.entries(node.content ?? {})) {
      const collection = def.collections?.[key];
      if (!collection) throw Error(`${node.name}의 항목 목록이 올바르지 않습니다.`);
      if (new Set(items.map(item => item.id)).size !== items.length) throw Error("항목 ID가 중복됩니다.");
      for (const item of items) {
        if (Object.keys(item.values).length !== Object.keys(collection.defaults).length) throw Error("항목에 필요한 값이 없습니다.");
        for (const [fieldKey, value] of Object.entries(item.values)) {
          if (!Object.hasOwn(collection.defaults, fieldKey) || typeof value !== typeof collection.defaults[fieldKey]) throw Error("항목의 값이 올바르지 않습니다.");
          const field = collection.fields.find(f => f.key === fieldKey);
          if ((field?.type === "node-ref" || field?.type === "item-ref") && value !== "" && !safeId.safeParse(value).success) throw Error("항목의 연결 ID가 올바르지 않습니다.");
          if (field?.options && !field.options.includes(String(value))) throw Error("항목의 선택 값이 올바르지 않습니다.");
          if (field?.type === "number" && (Number(value) < (field.min ?? -Infinity) || Number(value) > (field.max ?? Infinity))) throw Error("항목의 값이 허용 범위를 벗어났습니다.");
          const assetId = field?.type === "asset" ? referencedAssetId(String(value)) : undefined;
          if (assetId && (!p.assets[assetId] || !field?.assetKinds?.includes(p.assets[assetId].kind))) throw Error("항목의 자산이 없거나 종류가 다릅니다.");
        }
      }
    }
    for (const [key, value] of Object.entries(node.props)) {
      if (
        !Object.hasOwn(def.defaults, key) ||
        typeof value !== typeof def.defaults[key]
      )
        throw new Error(`${node.name}의 속성이 올바르지 않습니다.`);
      const field = def.fields.find((f) => f.key === key);
      const assetId = typeof value === "string" && field?.type === "asset" ? referencedAssetId(value) : undefined;
      if (assetId && (!p.assets[assetId] || !field?.assetKinds?.includes(p.assets[assetId].kind)))
        throw new Error(`${node.name}에 연결된 자산이 없거나 파일 종류가 다릅니다.`);
      if (field?.options && !field.options.includes(String(value)))
        throw new Error(`${node.name}의 선택 값이 올바르지 않습니다.`);
      if (
        field?.type === "number" &&
        typeof value === "number" &&
        ((field.min !== undefined && value < field.min) ||
          (field.max !== undefined && value > field.max))
      )
        throw new Error(
          `${node.name}의 ${field.label} 값이 허용 범위를 벗어났습니다.`,
        );
    }
    for (const key of Object.keys(def.defaults))
      if (!Object.hasOwn(node.props, key) && !def.optionalProps?.includes(key))
        throw new Error(`${node.name}에 필요한 속성이 없습니다.`);
    seen.add(id);
    node.children.forEach((child) => visit(child, depth + 1));
  }
  for (const page of p.pages) {
    if (pageIds.has(page.id) || slugs.has(page.slug))
      throw new Error("페이지 ID 또는 경로가 중복됩니다.");
    pageIds.add(page.id);
    slugs.add(page.slug);
    visit(page.rootId, 0, true);
  }
  if (seen.size !== ids.length)
    throw new Error("페이지에 속하지 않은 요소가 있습니다.");
  for (const id of [p.theme.bodyFontAsset, p.theme.headingFontAsset])
    if (id && p.assets[id]?.kind !== "font") throw new Error("테마에 연결된 서체 자산을 찾을 수 없습니다.");
  return p;
}
export function parseProjectText(text: string): Project {
  if (new TextEncoder().encode(text).length > 3_000_000)
    throw new Error("프로젝트 파일은 3MB 이하여야 합니다.");
  return parseProject(JSON.parse(text));
}
export function resolvedLayout(
  node: Node,
  viewport: Viewport,
): Required<Layout> & { hidden: boolean } {
  return {
    ...DEFAULT_LAYOUT,
    ...node.layout,
    hidden: node.hidden,
    ...(viewport !== "mobile" ? node.responsive.tablet : {}),
    ...(viewport === "desktop" ? node.responsive.desktop : {}),
  };
}
export function parentId(p: Project, id: string): string | undefined {
  return Object.values(p.nodes).find((n) => n.children.includes(id))?.id;
}
export function descendants(p: Project, id: string): string[] {
  return [
    id,
    ...p.nodes[id].children.flatMap((child) => descendants(p, child)),
  ];
}
export function isLocked(p: Project, id: string): boolean {
  let current: string | undefined = id;
  while (current) {
    if (p.nodes[current].locked) return true;
    current = parentId(p, current);
  }
  return false;
}
export function editProject(
  p: Project,
  mutate: (next: Project) => void,
): Project {
  const next = structuredClone(p);
  mutate(next);
  if (JSON.stringify(next) === JSON.stringify(p)) return p;
  next.revision++;
  next.updatedAt = new Date().toISOString();
  return parseProject(next);
}
export function moveNode(
  p: Project,
  id: string,
  target: string,
  index: number,
): Project {
  const parent = parentId(p, id);
  if (!parent || isLocked(p, id) || isLocked(p, target))
    throw new Error("잠긴 요소 또는 페이지는 이동할 수 없습니다.");
  if (
    !p.nodes[target] ||
    !DEFINITIONS[p.nodes[target].component].container ||
    descendants(p, id).includes(target)
  )
    throw new Error("이 위치로 이동할 수 없습니다.");
  return editProject(p, (next) => {
    next.nodes[parent].children = next.nodes[parent].children.filter(
      (child) => child !== id,
    );
    next.nodes[target].children.splice(Math.max(0, index), 0, id);
  });
}
export function removeNode(p: Project, id: string): Project {
  const parent = parentId(p, id);
  if (!parent || isLocked(p, id))
    throw new Error("페이지 또는 잠긴 요소는 삭제할 수 없습니다.");
  return editProject(p, (next) => {
    next.nodes[parent].children = next.nodes[parent].children.filter(
      (child) => child !== id,
    );
    descendants(p, id).forEach((child) => delete next.nodes[child]);
  });
}
export function duplicateNode(
  p: Project,
  id: string,
): { project: Project; id: string } {
  const parent = parentId(p, id);
  if (!parent || isLocked(p, id))
    throw new Error("페이지 또는 잠긴 요소는 복제할 수 없습니다.");
  const mapping = Object.fromEntries(
    descendants(p, id).map((old) => [old, uid()]),
  );
  const project = editProject(p, (next) => {
    for (const old of Object.keys(mapping)) {
      next.nodes[mapping[old]] = {
        ...structuredClone(p.nodes[old]),
        id: mapping[old],
        children: p.nodes[old].children.map((child) => mapping[child]),
      };
      remapNodeReferences(next.nodes[mapping[old]], DEFINITIONS[p.nodes[old].component], mapping);
    }
    next.nodes[mapping[id]].name = `${p.nodes[id].name} 사본`.slice(0, 100);
    next.nodes[parent].children.splice(
      next.nodes[parent].children.indexOf(id) + 1,
      0,
      mapping[id],
    );
  });
  return { project, id: mapping[id] };
}
export function blankProject(id = uid("project")): Project {
  const root = createNode("page");
  return {
    schemaVersion: CURRENT_SCHEMA_VERSION,
    assets: {},
    id,
    name: "새 프로젝트",
    revision: 0,
    updatedAt: new Date().toISOString(),
    pages: [{ id: uid("page"), name: "홈", slug: "/", rootId: root.id }],
    nodes: { [root.id]: root },
    theme: structuredClone(THEME_PRESETS[0]),
  };
}
