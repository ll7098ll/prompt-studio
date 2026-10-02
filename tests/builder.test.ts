import { test } from "node:test";
import assert from "node:assert/strict";
import {
  createTemplate,
  appendPage,
  TEMPLATES,
} from "../src/builder/templates";
import {
  createNode,
  parseProject,
  parseProjectText,
  moveNode,
  duplicateNode,
  removeNode,
  resolvedLayout,
  parentId,
} from "../src/builder/model";
import {
  handoffSpec,
  generatePrompt,
  exportBundle,
} from "../src/builder/export";
import JSZip from "jszip";
import { createHash } from "node:crypto";
import { themeTokens } from "../src/builder/tokens";
import { themeVariables } from "../src/builder/theme";
import { encodeShare, decodeShare } from "../src/builder/share";
import { CATALOG } from "../src/builder/catalog";
import { componentExample } from "../src/builder/library";
import { THEME_PRESETS } from "../src/builder/theme";
import { previewWidth, viewportForWidth } from "../src/builder/viewport";

test("all starter templates round-trip with complete nested structure", () => {
  for (const template of TEMPLATES) {
    const doc = createTemplate(template.id);
    assert.deepEqual(parseProjectText(JSON.stringify(doc)), doc);
  }
});
test("every visual component example is valid and survives an exact JSON round-trip", () => {
  for (const definition of CATALOG.filter((d) => d.id !== "page")) {
    const example = componentExample(definition.id, THEME_PRESETS[0]);
    assert.deepEqual(
      parseProjectText(JSON.stringify(example)),
      example,
      definition.id,
    );
  }
  for (const theme of THEME_PRESETS) {
    const example = createTemplate("landing");
    example.theme = theme;
    assert.deepEqual(parseProject(example).theme, theme);
  }
});
test("custom widths select exact breakpoints and reject invalid screenshot dimensions", () => {
  for (const [width, expected] of [
    [320, "mobile"],
    [767, "mobile"],
    [768, "tablet"],
    [1023, "tablet"],
    [1024, "desktop"],
    [2560, "desktop"],
  ] as const) {
    assert.equal(previewWidth(width), width);
    assert.equal(viewportForWidth(width), expected);
  }
  for (const width of [0, 319, 2561, 768.5, Infinity, NaN])
    assert.throws(() => previewWidth(width));
});
test("previous schema v2 layouts load without new fields and preserve their original data", () => {
  const previous = createTemplate("landing");
  for (const n of Object.values(previous.nodes)) {
    for (const layout of [n.layout, ...Object.values(n.responsive)]) {
      for (const key of [
        "justify",
        "wrap",
        "widthMode",
        "width",
        "span",
        "margin",
        "minHeight",
      ] as const)
        delete layout[key];
    }
  }
  const restored = parseProjectText(JSON.stringify(previous));
  assert.deepEqual(restored, previous);
  const root = restored.nodes[restored.pages[0].rootId];
  assert.equal(resolvedLayout(root, "desktop").widthMode, "auto");
  assert.equal(resolvedLayout(root, "desktop").margin, 0);
});
test("layout additions inherit by breakpoint and append templates without replacing the project theme", () => {
  const doc = createTemplate("blank");
  const n = createNode("card");
  n.layout = {
    ...n.layout,
    widthMode: "fixed",
    width: 210,
    wrap: true,
    justify: "space-between",
    margin: 8,
  };
  n.responsive.tablet = { span: 2, minHeight: 180 };
  n.responsive.desktop = { widthMode: "fill" };
  doc.nodes[n.id] = n;
  doc.nodes[doc.pages[0].rootId].children.push(n.id);
  const loaded = parseProjectText(JSON.stringify(doc));
  assert.equal(resolvedLayout(loaded.nodes[n.id], "mobile").span, 1);
  assert.equal(resolvedLayout(loaded.nodes[n.id], "desktop").span, 2);
  assert.equal(resolvedLayout(loaded.nodes[n.id], "desktop").widthMode, "fill");
  const next = appendPage(loaded, "retro");
  assert.deepEqual(next.theme, doc.theme);
  assert.equal(next.pages.length, 2);
  parseProject(next);
});
test("custom theme values survive serialization and reach the handoff", () => {
  const doc = createTemplate("landing");
  doc.theme.light.primary = "#123456";
  doc.theme.radius = 23;
  const loaded = parseProjectText(JSON.stringify(doc));
  assert.equal(handoffSpec(loaded).source.theme.light.primary, "#123456");
  assert.match(generatePrompt(loaded), /#123456/);
});
test("nested move preserves descendants and rejects cycles", () => {
  const doc = createTemplate("landing");
  const grid = Object.values(doc.nodes).find((n) => n.component === "grid")!;
  const child = grid.children[0];
  const section = parentId(doc, grid.id)!;
  const moved = moveNode(doc, child, section, 0);
  assert.equal(moved.nodes[section].children[0], child);
  assert(!moved.nodes[grid.id].children.includes(child));
  assert.throws(() => moveNode(doc, section, grid.id, 0), /이 위치/);
});
test("duplicate creates independent IDs for every descendant and remove removes a subtree", () => {
  const doc = createTemplate("landing");
  const grid = Object.values(doc.nodes).find((n) => n.component === "grid")!;
  const { project, id } = duplicateNode(doc, grid.id);
  assert.equal(project.nodes[id].children.length, 3);
  project.nodes[id].children.forEach((child) =>
    assert(!grid.children.includes(child)),
  );
  const removed = removeNode(project, id);
  assert.equal(
    Object.keys(removed.nodes).length,
    Object.keys(doc.nodes).length,
  );
});
test("a locked ancestor prevents descendant changes through move/remove", () => {
  const doc = createTemplate("landing");
  const grid = Object.values(doc.nodes).find((n) => n.component === "grid")!;
  grid.locked = true;
  assert.throws(() => removeNode(doc, grid.children[0]), /잠긴/);
  assert.throws(() => duplicateNode(doc, grid.children[0]), /잠긴/);
});
test("responsive values inherit tablet changes on desktop, while mobile retains base", () => {
  const node = createNode("grid");
  node.responsive.tablet = { columns: 2, gap: 18 };
  node.responsive.desktop = { columns: 4 };
  assert.equal(resolvedLayout(node, "mobile").columns, 1);
  assert.equal(resolvedLayout(node, "desktop").columns, 4);
  assert.equal(resolvedLayout(node, "desktop").gap, 18);
});
test("reject malformed, cyclic, orphaned, duplicate-page and invalid prop documents", () => {
  const doc = createTemplate("landing");
  const root = doc.pages[0].rootId;
  assert.throws(() => parseProject({ ...doc, schemaVersion: 1 }));
  const orphan = structuredClone(doc);
  orphan.nodes.extra = createNode("text", "extra");
  assert.throws(() => parseProject(orphan), /속하지/);
  const cycle = structuredClone(doc);
  cycle.nodes[root].children.push(root);
  assert.throws(() => parseProject(cycle), /순환|페이지/);
  const duplicate = structuredClone(doc);
  duplicate.pages.push(duplicate.pages[0]);
  assert.throws(() => parseProject(duplicate), /중복/);
  const bad = structuredClone(doc);
  const hero = Object.values(bad.nodes).find((n) => n.component === "hero")!;
  hero.props.visual = "yes";
  assert.throws(() => parseProject(bad), /속성/);
});
test("new pages retain unique roots, slugs and handoff entries", () => {
  const doc = appendPage(
    appendPage(createTemplate("landing"), "dashboard"),
    "settings",
  );
  parseProject(doc);
  assert.equal(handoffSpec(doc).source.pages.length, 3);
  assert.equal(new Set(doc.pages.map((p) => p.slug)).size, 3);
});

test("share links preserve custom colors and nested pages without relying on a server", async () => {
  const doc = appendPage(createTemplate("landing"), "settings");
  doc.theme.light.primary = "#123456";
  const hash = await encodeShare(doc);
  assert(hash.length < 12_000);
  assert.deepEqual(await decodeShare(hash), doc);
  await assert.rejects(() => decodeShare("#design=v1.aaa"));
  await assert.rejects(() => decodeShare("#design=v2.invalid"));
});

test("handoff manifest verifies the exact original document and reference styles", async () => {
  const project = createTemplate("landing");
  project.theme.light.primary = "#123456";
  const bundle = await exportBundle(project);
  const zip = await JSZip.loadAsync(await bundle.arrayBuffer());
  const manifest = JSON.parse(await zip.file("manifest.json")!.async("string"));
  assert.equal(manifest.revision, project.revision);
  assert.match(await zip.file("reference.css")!.async("string"), /\.ui-hero/);
  assert(zip.file("component-specs.json"));
  assert(zip.file("theme.tokens.json"));
  assert.deepEqual(
    JSON.parse(await zip.file("project.json")!.async("string")),
    project,
  );
  for (const [name, expected] of Object.entries(manifest.files) as [
    string,
    { sha256: string; bytes: number },
  ][]) {
    const actual = await zip.file(name)!.async("nodebuffer");
    assert.equal(actual.length, expected.bytes);
    assert.equal(
      createHash("sha256").update(actual).digest("hex"),
      expected.sha256,
    );
  }
});

test("DTCG token aliases resolve to the renderer's exact light and dark values", () => {
  const project = createTemplate("landing");
  project.theme.light.primary = "#123456";
  project.theme.dark.primary = "#aBcDeF";
  project.theme.radius = 23;
  project.theme.density = 1.2;
  for (const mode of ["light", "dark"] as const) {
    project.theme.mode = mode;
    const tokens = JSON.parse(JSON.stringify(themeTokens(project.theme)));
    const byPath = new Map<string, { $type: string; $value: unknown }>();
    const walk = (value: Record<string, unknown>, path: string[] = []) => {
      if ("$value" in value) {
        assert.equal(typeof value.$type, "string");
        byPath.set(path.join("."), value as { $type: string; $value: unknown });
        return;
      }
      for (const [key, child] of Object.entries(value))
        if (
          !key.startsWith("$") &&
          child &&
          typeof child === "object" &&
          !Array.isArray(child)
        )
          walk(child as Record<string, unknown>, [...path, key]);
    };
    walk(tokens);
    const resolve = (path: string, seen = new Set<string>()): unknown => {
      assert(!seen.has(path), `Circular token reference: ${path}`);
      seen.add(path);
      const token = byPath.get(path);
      assert(token, `Missing token: ${path}`);
      if (typeof token.$value === "string" && token.$value.startsWith("{")) {
        const target = token.$value.slice(1, -1);
        assert.equal(byPath.get(target)?.$type, token.$type);
        return resolve(target, seen);
      }
      return token.$value;
    };
    for (const path of byPath.keys()) resolve(path);
    const color = resolve("component.button.background") as {
      hex: string;
      components: number[];
    };
    assert.equal(color.hex, project.theme[mode].primary.toLowerCase());
    assert.equal(
      "#" +
        color.components
          .map((c) =>
            Math.round(c * 255)
              .toString(16)
              .padStart(2, "0"),
          )
          .join(""),
      color.hex,
    );
    const radius = resolve("semantic.radius") as {
      value: number;
      unit: string;
    };
    assert.equal(
      `${radius.value}${radius.unit}`,
      themeVariables(project.theme)["--ui-radius"],
    );
    const spacing = resolve("semantic.spacing") as {
      value: number;
      unit: string;
    };
    assert.equal(
      `${spacing.value}${spacing.unit}`,
      themeVariables(project.theme)["--ui-space"],
    );
  }
});
