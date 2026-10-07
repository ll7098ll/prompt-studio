import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import {
  blankProject,
  createNode,
  parseProject,
  type Project,
} from "../src/builder/model";
import { createTemplate } from "../src/builder/templates";

const folder = "tests/fixtures/v4";
if (existsSync(folder))
  throw Error(
    "Fixed migration fixtures already exist; do not overwrite the compatibility baseline.",
  );
mkdirSync(folder, { recursive: true });
const withNode = (p: Project, component: string) => {
  const n = createNode(component);
  p.nodes[n.id] = n;
  p.nodes[p.pages[0].rootId].children.push(n.id);
  return n;
};
const samples: Record<string, Project> = { flow: createTemplate("landing") };
samples.free = createTemplate("free-canvas");
const free = withNode(samples.free, "text");
free.layout = {
  ...free.layout,
  mode: "free",
  x: 80,
  y: 120,
  widthMode: "fixed",
  width: 240,
  height: 80,
  heightMode: "fixed",
  rotation: -8,
};
samples["legacy-parts"] = blankProject();
const gallery = withNode(samples["legacy-parts"], "gallery");
gallery.parts = {
  "p.0.1.0.2": {
    text: "이전 편집 문구",
    layout: { textColor: "#aa1122" },
    responsive: { desktop: { fontSize: 28 } },
  },
};
samples["role-parts"] = blankProject();
const button = withNode(samples["role-parts"], "button");
button.appearance = { renderer: "shadcn", family: "outline" };
button.parts = {
  "slot.action": {
    layout: { fillColor: "#eeeeff", cornerRadius: 18 },
    responsive: {},
  },
};
samples["table-list"] = createTemplate("dashboard");
const table = Object.values(samples["table-list"].nodes).find(
  (n) => n.component === "table",
)!;
table.props.rows = Array.from(
  { length: 50 },
  (_, i) => `항목 ${i + 1}|홍길동|진행 중|2026-10-06`,
).join("\n");
samples.large = blankProject();
for (let i = 0; i < 200; i++)
  withNode(samples.large, "text").props.text =
    `검증할 긴 한국어 콘텐츠 ${i + 1}`;
for (const [name, p] of Object.entries(samples)) {
  const { assets: _assets, ...document } = p;
  void _assets;
  const v4 = { ...document, schemaVersion: 4 };
  parseProject(v4);
  writeFileSync(`${folder}/${name}.json`, JSON.stringify(v4, null, 2) + "\n");
}
console.log("Saved six fixed v4 migration fixtures.");
