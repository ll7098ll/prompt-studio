import { test } from "node:test";
import assert from "node:assert/strict";
import {
  blankProject,
  createNode,
  parseProject,
  resolvedLayout,
} from "../src/builder/model";
import { DESIGN_DEFAULTS } from "../src/builder/design-schema";
import {
  alignBoxes,
  convertLayout,
  copyNodes,
  groupNodes,
  pasteNodes,
  ungroupNode,
} from "../src/builder/design-commands";
import { resizeBox, snapBox } from "../src/builder/geometry";
import { designStyle } from "../src/builder/design-style";
import { changeBlockStructure } from "../src/builder/block-variants";
import { componentExample } from "../src/builder/library";
import { THEME_PRESETS } from "../src/builder/theme";

function sample() {
  const doc = blankProject(),
    frame = createNode("frame", "frame");
  doc.nodes[doc.pages[0].rootId].children.push(frame.id);
  doc.nodes.frame = frame;
  const boxes = {
    a: { x: 20, y: 30, width: 100, height: 50 },
    b: { x: 200, y: 120, width: 80, height: 80 },
    c: { x: 500, y: 60, width: 60, height: 70 },
  };
  for (const [id, box] of Object.entries(boxes)) {
    const node = createNode("text", id);
    Object.assign(node.layout, box, {
      widthMode: "fixed",
      heightMode: "fixed",
    });
    frame.children.push(id);
    doc.nodes[id] = node;
  }
  return { doc, boxes };
}
test("v2 migrates without mutating its source, while invalid v2 and future documents are rejected", () => {
  const { doc } = sample();
  const old = { ...structuredClone(doc), schemaVersion: 2 };
  delete (old as Partial<typeof old>).assets;
  for (const node of Object.values(old.nodes))
    for (const layout of [node.layout, ...Object.values(node.responsive)])
      for (const key of Object.keys(DESIGN_DEFAULTS))
        delete (layout as Record<string, unknown>)[key];
  const before = JSON.stringify(old),
    migrated = parseProject(old);
  assert.equal(migrated.schemaVersion, 5);
  assert.equal(JSON.stringify(old), before);
  assert.equal(resolvedLayout(migrated.nodes.a, "mobile").mode, "flow");
  assert.throws(() => parseProject({ ...old, schemaVersion: 6 }));
  old.nodes.a.layout.width = Infinity;
  assert.throws(() => parseProject(old));
});
test("group, ungroup and paste preserve coordinates and independent descendant IDs", () => {
  const { doc, boxes } = sample();
  const group = groupNodes(doc, ["a", "b", "c"], "desktop", boxes);
  assert.equal(group.project.nodes[group.ids[0]].children.length, 3);
  assert.equal(resolvedLayout(group.project.nodes.a, "desktop").x, 0);
  const restored = ungroupNode(group.project, group.ids[0]);
  for (const view of ["mobile", "tablet", "desktop"] as const)
    for (const id of ["a", "b", "c"]) {
      assert.equal(
        resolvedLayout(restored.project.nodes[id], view).x,
        boxes[id as keyof typeof boxes].x,
      );
      assert.equal(
        resolvedLayout(restored.project.nodes[id], view).y,
        boxes[id as keyof typeof boxes].y,
      );
    }
  const pasted = pasteNodes(
    group.project,
    copyNodes(group.project, group.ids),
    "frame",
  );
  assert.notEqual(pasted.ids[0], group.ids[0]);
  assert.ok(
    pasted.project.nodes[pasted.ids[0]].children.every(
      (id) => !["a", "b", "c"].includes(id),
    ),
  );
  parseProject(pasted.project);
});
test("v3 migration preserves original part overrides and validates new semantic styles", () => {
  const { doc } = sample();
  doc.nodes.a.parts = {
    "p.0": {
      text: "원래 내용",
      layout: { fontSize: 20 },
      responsive: { desktop: { x: 12 } },
    },
  };
  const old = { ...structuredClone(doc), schemaVersion: 3 };
  delete (old as Partial<typeof old>).assets;
  const snapshot = JSON.stringify(old);
  const migrated = parseProject(old);
  assert.equal(migrated.schemaVersion, 5);
  assert.deepEqual(migrated.nodes.a.parts, old.nodes.a.parts);
  assert.equal(JSON.stringify(old), snapshot);
  migrated.nodes.a.appearance = {
    family: "brutal",
    motion: "float",
    renderer: "classic",
  };
  migrated.nodes.a.parts!["slot.title"] = {
    layout: { textColor: "#112233" },
    responsive: {},
  };
  assert.deepEqual(parseProject(migrated), migrated);
  assert.throws(() =>
    parseProject({
      ...migrated,
      nodes: {
        ...migrated.nodes,
        a: { ...migrated.nodes.a, appearance: { family: "unknown" } },
      },
    }),
  );
});
test("structure changes keep exact authored leaves and retain unmatched content", () => {
  const p = componentExample("block-hero-1", THEME_PRESETS[0]);
  const id = p.nodes[p.pages[0].rootId].children[0];
  const button = Object.values(p.nodes).find((n) => n.component === "button")!;
  button.props.label = "그대로 유지";
  button.parts = { "p.0": { layout: { fontSize: 22 }, responsive: {} } };
  button.appearance = { family: "soft", renderer: "classic" };
  const extra = createNode("badge");
  p.nodes[extra.id] = extra;
  p.nodes[id].children.push(extra.id);
  const original = JSON.stringify(p);
  const next = changeBlockStructure(p, id, "block-hero-5");
  assert.deepEqual(next.nodes[button.id], button);
  assert.deepEqual(next.nodes[extra.id], extra);
  assert.equal(next.nodes[id].component, "block-hero-5");
  assert.equal(JSON.stringify(p), original);
  assert.deepEqual(parseProject(next), next);
  p.nodes[button.id].locked = true;
  assert.throws(() => changeBlockStructure(p, id, "block-hero-2"));
});
test("layout conversion at mobile isolates later breakpoints and reuses measured geometry", () => {
  const { doc, boxes } = sample();
  doc.nodes.frame.layout.mode = "flow";
  const converted = convertLayout(doc, "frame", "mobile", "free", boxes, {
    width: 600,
    height: 480,
  });
  assert.equal(resolvedLayout(converted.nodes.frame, "mobile").mode, "free");
  assert.equal(resolvedLayout(converted.nodes.frame, "tablet").mode, "flow");
  assert.equal(resolvedLayout(converted.nodes.frame, "desktop").mode, "flow");
  assert.equal(resolvedLayout(converted.nodes.b, "mobile").x, 200);
});
test("resize keeps the opposite corner, ratio and rotated center consistent", () => {
  const box = { x: 100, y: 100, width: 200, height: 100 };
  assert.deepEqual(resizeBox(box, "nw", -20, -10, true), {
    x: 80,
    y: 90,
    width: 220,
    height: 110,
  });
  assert.deepEqual(resizeBox(box, "se", 40, 20, true), {
    x: 100,
    y: 100,
    width: 240,
    height: 120,
  });
  const rotated = resizeBox(box, "e", 0, 40, false, 90);
  assert.deepEqual(rotated, { x: 80, y: 120, width: 240, height: 100 });
  assert.ok(resizeBox(box, "w", 1000, 0, false).width >= 1);
});
test("snap and equal spacing use edges and actual element sizes", () => {
  const { boxes } = sample();
  const aligned = alignBoxes(boxes, "horizontal");
  assert.equal(
    aligned.b.x - aligned.a.x - aligned.a.width,
    aligned.c.x - aligned.b.x - aligned.b.width,
  );
  const snap = snapBox(
    { x: 97, y: 20, width: 50, height: 40 },
    [{ x: 100, y: 80, width: 50, height: 40 }],
    5,
  );
  assert.equal(snap.x, 100);
  assert.equal(snap.guideX, 100);
});
test("free geometry and anchors ignore density and disable flow spacing", () => {
  const { doc } = sample();
  const layout = resolvedLayout(doc.nodes.a, "desktop");
  const style = designStyle(
    { ...layout, anchorX: "end", basisWidth: 600 },
    true,
    false,
  );
  assert.equal(style.position, "absolute");
  assert.equal(style.left, "calc(100% - 580px)");
  assert.equal(style.margin, 0);
  assert.equal(style.maxWidth, "none");
});
