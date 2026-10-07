import { DESIGN_PACKS } from "./design-packs";
import { createNode, type Project } from "./model";
import { populateRecipe } from "./component-recipes";
import type { TemplateInfo } from "./template-recipes";
import { PACK_SCOPES } from "./design-pack-schema";

export const PACK_TEMPLATES: TemplateInfo[] = DESIGN_PACKS.map((pack) => ({
  id: `pack-${pack.id}`,
  name: pack.name,
  description: pack.description,
  tag: `${pack.code} · DESIGN PACK`,
  color: pack.theme.light.soft,
  category: "스토어·콘텐츠",
  trends: [pack.use, "미디어 장면", "부분별 편집"],
}));
export function applyPackTemplate(project: Project, template: string) {
  const pack = DESIGN_PACKS.find((pack) => template === `pack-${pack.id}`);
  if (!pack) return false;
  project.theme = structuredClone(pack.theme);
  project.theme.packSources = Object.fromEntries(
    PACK_SCOPES.map((scope) => [scope, pack.id]),
  );
  const root = project.nodes[project.pages[0].rootId];
  Object.assign(root.layout, { padding: 0, gap: 0 });
  const header = createNode("section");
  Object.assign(header.layout, {
    padding: 24,
    gap: 8,
    direction: "row",
    wrap: true,
    justify: "space-between",
    maxWidth: 1280,
    widthMode: "fill",
  });
  const brand = createNode("text");
  brand.props.text = `${pack.code} / ${pack.name.toUpperCase()}`;
  Object.assign(brand.layout, {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: 1.5,
  });
  const issue = createNode("text");
  issue.props.text = "STUDIO COLLECTION · 2026";
  issue.layout.fontSize = 12;
  header.children.push(brand.id, issue.id);
  for (const node of [header, brand, issue]) project.nodes[node.id] = node;
  root.children.push(header.id);
  let firstHeading = true;
  for (const id of pack.scenes.slice(0, 3)) {
    const scene = createNode(id);
    project.nodes[scene.id] = scene;
    root.children.push(scene.id);
    const previous = new Set(Object.keys(project.nodes));
    populateRecipe(project, scene);
    for (const node of Object.values(project.nodes)) {
      if (previous.has(node.id)) continue;
      if (node.component === "heading" && node.props.level === "h1") {
        if (!firstHeading) node.props.level = "h2";
        firstHeading = false;
      }
    }
  }
  const footer = createNode("section");
  Object.assign(footer.layout, {
    padding: 24,
    maxWidth: 1280,
    widthMode: "fill",
  });
  const note = createNode("text");
  note.props.text = `${pack.name} / 창작 이미지와 미디어를 사용한 편집 가능한 샘플 컬렉션`;
  Object.assign(note.layout, { fontSize: 12, textColor: "theme:muted" });
  footer.children.push(note.id);
  project.nodes[footer.id] = footer;
  project.nodes[note.id] = note;
  root.children.push(footer.id);
  return true;
}
