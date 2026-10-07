import { test } from "node:test";
import assert from "node:assert/strict";
import {
  applyDesignPack,
  DESIGN_PACKS,
  packOverrideImpact,
} from "../src/builder/design-packs";
import { PACK_SCOPES } from "../src/builder/design-pack-schema";
import { parseProject, createNode, blankProject } from "../src/builder/model";
import { createTemplate } from "../src/builder/templates";
import { partStyles } from "../src/builder/component-parts";
import { themeVariables } from "../src/builder/theme";

test("all eight packs validate and preserve exact authored tree, assets, breakpoints and mode", () => {
  const original = createTemplate("landing");
  const node = Object.values(original.nodes).find(
    (n) => n.component === "hero",
  )!;
  node.layout.fillColor = "#bb2299";
  node.parts = {
    "slot.title": {
      layout: { fontSize: 31, paddingLeft: 7 },
      responsive: { desktop: { fontSize: 44 } },
      text: "나만의 제목",
    },
  };
  for (const pack of DESIGN_PACKS) {
    const applied = parseProject(applyDesignPack(original, pack));
    assert.deepEqual(applied.nodes, original.nodes);
    assert.deepEqual(applied.assets, original.assets);
    assert.deepEqual(applied.pages, original.pages);
    assert.equal(applied.theme.mode, original.theme.mode);
    assert.equal(applied.theme.density, original.theme.density);
    assert.deepEqual(
      applied.theme.packSources,
      Object.fromEntries(PACK_SCOPES.map((scope) => [scope, pack.id])),
    );
    assert.match(
      themeVariables(applied.theme)["--pack-heading-size"],
      /^clamp\(/,
    );
  }
});
test("selective pack application changes only chosen channels", () => {
  const base = applyDesignPack(createTemplate("landing"), DESIGN_PACKS[0]);
  for (const scope of PACK_SCOPES) {
    const applied = applyDesignPack(base, DESIGN_PACKS[5], [scope]);
    for (const other of PACK_SCOPES.filter((item) => item !== scope)) {
      assert.equal(
        applied.theme.packSources?.[other],
        base.theme.packSources?.[other],
      );
      if (other === "colors") {
        assert.deepEqual(applied.theme.light, base.theme.light);
        assert.deepEqual(applied.theme.dark, base.theme.dark);
      } else assert.deepEqual(applied.theme[other], base.theme[other]);
    }
  }
});
test("explicit reset is scoped, retains text and geometry, and respects locked ancestors", () => {
  const base = blankProject(),
    root = base.nodes[base.pages[0].rootId],
    card = createNode("card"),
    text = createNode("text");
  root.children.push(card.id);
  card.children.push(text.id);
  base.nodes[card.id] = card;
  base.nodes[text.id] = text;
  text.parts = {
    "p.0": {
      text: "보존",
      layout: { fontSize: 41, textColor: "#aa1122", x: 12 },
      responsive: { desktop: { fontSize: 53 } },
    },
  };
  assert.equal(packOverrideImpact(base, ["typography"]).length, 1);
  const next = applyDesignPack(base, DESIGN_PACKS[1], ["typography"], true);
  assert.equal(next.nodes[text.id].parts!["p.0"].text, "보존");
  assert.deepEqual(next.nodes[text.id].parts!["p.0"].layout, {
    textColor: "#aa1122",
    x: 12,
  });
  card.locked = true;
  assert.deepEqual(
    applyDesignPack(base, DESIGN_PACKS[1], ["typography"], true).nodes,
    base.nodes,
  );
});
test("part sides, vector appearance, intrinsic sizing and viewport inheritance roundtrip", () => {
  const base = blankProject(),
    node = createNode("icon");
  base.nodes[node.id] = node;
  base.nodes[base.pages[0].rootId].children.push(node.id);
  node.parts = {
    "p.0.0": {
      layout: {
        paddingLeft: 9,
        svgFill: "#ffee22",
        svgStrokeWidth: 2,
        widthMode: "fill",
        display: "flex",
        fontFamily: "heading",
      },
      responsive: {
        tablet: { paddingLeft: 15 },
        desktop: { paddingLeft: 24, svgStrokeWidth: 3 },
      },
    },
  };
  const parsed = parseProject(JSON.parse(JSON.stringify(base))),
    part = parsed.nodes[node.id].parts!["p.0.0"];
  assert.equal(partStyles(part, "mobile").paddingLeft, 9);
  assert.equal(partStyles(part, "tablet").paddingLeft, 15);
  const style = partStyles(part, "desktop");
  assert.equal(style.paddingLeft, 24);
  assert.equal(style.strokeWidth, 3);
  assert.equal(style.fill, "#ffee22");
  assert.equal(style.width, "100%");
  assert.equal(style.fontFamily, "var(--ui-heading-font)");
  const bad = structuredClone(base);
  (
    bad.nodes[node.id].parts!["p.0.0"].layout as Record<string, unknown>
  ).svgFill = "url(https://external.test/x)";
  assert.throws(() => parseProject(bad));
});

test("part attributes validate image references, count asset use and preserve source metadata", async () => {
  const { inspectAsset, assetRef } = await import("../src/builder/asset-model");
  const { assetUsage } = await import("../src/builder/asset-usage");
  const { pngFixture } = await import("./asset-fixtures");
  const project = blankProject(),
    node = createNode("image"),
    asset = await inspectAsset(
      new Blob([new Uint8Array(pngFixture()).buffer]),
      "part.png",
    );
  project.nodes[node.id] = node;
  project.nodes[project.pages[0].rootId].children.push(node.id);
  project.assets[asset.id] = asset;
  node.parts = {
    "p.0.0": {
      layout: {},
      responsive: {},
      attributes: {
        src: assetRef(asset.id),
        alt: "개별 이미지",
        href: "https://example.test/work",
      },
    },
  };
  assert.equal(assetUsage(parseProject(project)).get(asset.id), 1);
  const broken = structuredClone(project);
  delete broken.assets[asset.id];
  assert.throws(() => parseProject(broken));
  const unsafe = structuredClone(project);
  unsafe.nodes[node.id].parts!["p.0.0"].attributes!.href =
    "javascript:alert(1)";
  assert.throws(() => parseProject(unsafe));
  const preserved = applyDesignPack(
    project,
    DESIGN_PACKS[2],
    [...PACK_SCOPES],
    true,
  );
  assert.deepEqual(
    preserved.nodes[node.id].parts!["p.0.0"].attributes,
    node.parts["p.0.0"].attributes,
  );
});

test("pack text roles meet 4.5:1 contrast in both modes", () => {
  const luminance = (hex: string) => {
    const rgb = [1, 3, 5]
      .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
      .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
    return rgb[0] * 0.2126 + rgb[1] * 0.7152 + rgb[2] * 0.0722;
  };
  for (const pack of DESIGN_PACKS)
    for (const mode of ["light", "dark"] as const) {
      const c = pack.theme[mode];
      for (const [foreground, background] of [
        ["foreground", "background"],
        ["muted", "background"],
        ["foreground", "surface"],
        ["muted", "surface"],
        ["onPrimary", "primary"],
        ["muted", "soft"],
      ] as const) {
        const a = luminance(c[foreground]),
          b = luminance(c[background]),
          ratio = (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
        assert.ok(
          ratio >= 4.5,
          `${pack.id} ${mode} ${foreground}/${background}: ${ratio}`,
        );
      }
    }
});
