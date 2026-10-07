import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { SCENE_CATALOG } from "../src/builder/scene-catalog";
import { componentExample } from "../src/builder/library";
import { THEME_PRESETS } from "../src/builder/theme";
import { BUILTIN_ASSETS, BUILTIN_BY_ID } from "../src/builder/builtin-assets";
import { assetSchema, sha256 } from "../src/builder/asset-model";
import { createTemplate, appendPage } from "../src/builder/templates";
import { PACK_TEMPLATES } from "../src/builder/pack-templates";
import {
  parseProject,
  duplicateNode,
  blankProject,
} from "../src/builder/model";
import { assetUsage } from "../src/builder/asset-usage";
import {
  exportProjectArchive,
  readProjectArchive,
} from "../src/builder/project-archive";

test("scene originals match declared file hashes and dimensions", async () => {
  for (const { path, asset } of Object.values(BUILTIN_ASSETS)) {
    assetSchema.parse(asset);
    const bytes = await readFile(`public${path}`);
    assert.equal(bytes.length, asset.bytes);
    assert.equal(await sha256(new Uint8Array(bytes).buffer), asset.sha256);
    if (asset.mime === "image/png") {
      assert.equal(bytes.readUInt32BE(16), asset.width);
      assert.equal(bytes.readUInt32BE(20), asset.height);
    }
  }
});
test("all composed scenes use independent children, valid assets and remappable chapter targets", () => {
  for (const definition of SCENE_CATALOG) {
    const project = componentExample(definition.id, THEME_PRESETS[0]);
    assert.deepEqual(parseProject(project), project);
    assert.ok(Object.keys(project.nodes).length >= 8, definition.id);
    for (const id of assetUsage(project).keys()) assert.ok(project.assets[id]);
    const scene =
      project.nodes[project.nodes[project.pages[0].rootId].children[0]];
    const copied = duplicateNode(project, scene.id);
    assert.ok(copied);
    parseProject(copied.project);
    const originalLinks = Object.values(project.nodes)
      .filter(
        (node) =>
          typeof node.props.href === "string" &&
          node.props.href.startsWith("#"),
      )
      .map((node) => node.props.href);
    const copiedLinks = Object.values(copied.project.nodes)
      .filter(
        (node) =>
          !project.nodes[node.id] &&
          typeof node.props.href === "string" &&
          node.props.href.startsWith("#"),
      )
      .map((node) => node.props.href);
    for (const link of copiedLinks) {
      assert.ok(!originalLinks.includes(link));
      assert.ok(copied.project.nodes[String(link).slice(1)]);
    }
    const chapters = Object.values(copied.project.nodes).filter(
      (node) => node.component === "scroll-chapters",
    );
    if (chapters.length) {
      assert.equal(chapters.length, 2);
      const original = chapters[0].content!.chapters.map(
        (item) => item.values.target,
      );
      for (const item of chapters[1].content!.chapters) {
        assert.ok(copied.project.nodes[String(item.values.target)]);
        assert.ok(!original.includes(item.values.target));
      }
    }
  }
});
test("pack pages contain three scenes, one main title and append all required asset metadata", () => {
  for (const template of PACK_TEMPLATES) {
    const project = createTemplate(template.id);
    assert.equal(
      Object.values(project.nodes).filter((node) =>
        node.component.startsWith("scene-"),
      ).length,
      3,
    );
    assert.equal(
      Object.values(project.nodes).filter(
        (node) => node.component === "heading" && node.props.level === "h1",
      ).length,
      1,
    );
    const blank = blankProject(),
      appended = appendPage(blank, template.id);
    assert.deepEqual(appended.theme, blank.theme);
    assert.equal(appended.pages.length, 2);
    assert.deepEqual(appended.assets, project.assets);
    parseProject(appended);
  }
});
test("pack ZIP includes exact local sample bytes and restores with no server URLs", async () => {
  const project = createTemplate(PACK_TEMPLATES[0].id);
  const read = async (id: string) => {
    const entry = BUILTIN_BY_ID.get(id)!;
    return new Blob(
      [new Uint8Array(await readFile(`public${entry.path}`)).buffer],
      { type: entry.asset.mime },
    );
  };
  const zip = await exportProjectArchive(project, read);
  const restored = await readProjectArchive(zip);
  assert.deepEqual(restored.project, project);
  for (const item of restored.assets)
    assert.equal(
      await sha256(await item.blob.arrayBuffer()),
      item.asset.sha256,
    );
});
