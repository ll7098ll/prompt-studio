import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import JSZip from "jszip";
import {
  assetRef,
  assetsSchema,
  inspectAsset,
  safeMediaURL,
} from "../src/builder/asset-model";
import {
  exportProjectArchive,
  inspectZipDirectory,
  readProjectArchive,
} from "../src/builder/project-archive";
import { blankProject, createNode, parseProject } from "../src/builder/model";
import { copyNodes, pasteNodes } from "../src/builder/design-commands";
import { createTemplate } from "../src/builder/templates";
import { pngFixture, wavFixture } from "./asset-fixtures";
import {
  contentItems,
  migrateGalleryParts,
} from "../src/builder/content-items";
import { DEFINITIONS } from "../src/builder/catalog";
import { mediaBounds, mediaTime } from "../src/builder/media-playback";

test("media clip bounds stay finite and old players keep their native controls", () => {
  assert.deepEqual(mediaBounds(3, 8, 6), { from: 3, to: 6, length: 3 });
  assert.deepEqual(mediaBounds(0, 0, NaN), { from: 0, to: 0, length: 0 });
  assert.deepEqual(mediaBounds(4, 2, 12), { from: 4, to: 12, length: 8 });
  assert.ok(mediaBounds(20, 22, 10).length > 0);
  assert.equal(mediaTime(Infinity), "0:00");
  assert.equal(mediaTime(3661.9), "1:01:01");
  for (const type of ["video-player", "audio-player"]) {
    const project = blankProject(), node = createNode(type);
    assert.equal(node.props.editableControls, true);
    delete node.props.editableControls;
    project.nodes[node.id] = node;
    project.nodes[project.pages[0].rootId].children.push(node.id);
    assert.equal(parseProject(project).nodes[node.id].props.editableControls, undefined);
  }
});

test("v4 upgrade preserves the whole authored tree, parts, theme and source bytes", () => {
  const old = { ...createTemplate("landing"), schemaVersion: 4 };
  delete (old as Partial<typeof old>).assets;
  const original = JSON.stringify(old),
    current = parseProject(old);
  assert.equal(current.schemaVersion, 5);
  assert.deepEqual(current.assets, {});
  assert.deepEqual(current.nodes, old.nodes);
  assert.deepEqual(current.theme, old.theme);
  assert.equal(JSON.stringify(old), original);
});

test("six fixed v4 documents migrate with exact content, geometry, parts and tokens", () => {
  const directory = new URL("./fixtures/v4/", import.meta.url);
  const files = readdirSync(directory).filter((name) => name.endsWith(".json"));
  assert.equal(files.length, 6);
  for (const file of files) {
    const bytes = readFileSync(new URL(file, directory), "utf8"),
      original = JSON.parse(bytes),
      current = parseProject(original);
    assert.equal(current.schemaVersion, 5, file);
    assert.deepEqual(current.nodes, original.nodes, file);
    assert.deepEqual(current.theme, original.theme, file);
    assert.deepEqual(current.pages, original.pages, file);
    assert.equal(readFileSync(new URL(file, directory), "utf8"), bytes, file);
  }
});
test("file inspection identifies bytes, deduplicates content and rejects disguised content", async () => {
  const image = new Blob([new Uint8Array(pngFixture()).buffer]);
  const first = await inspectAsset(image, "한글 사진.png"),
    second = await inspectAsset(image, "different-name.png");
  assert.equal(first.mime, "image/png");
  assert.equal(first.id, second.id);
  assert.equal(
    (
      await inspectAsset(
        new Blob([new Uint8Array(wavFixture()).buffer]),
        "voice.wav",
      )
    ).kind,
    "audio",
  );
  await assert.rejects(
    inspectAsset(
      new Blob(["<script>alert(1)</script>"], { type: "image/png" }),
      "fake.png",
    ),
  );
  await assert.rejects(inspectAsset(new Blob([]), "empty.png"));
  await assert.rejects(
    inspectAsset(new Blob([new Uint8Array(50_000_001)]), "large.mp4"),
  );
  assert.throws(() =>
    assetsSchema.parse({ [first.id]: { ...first, kind: "video" } }),
  );
});
test("asset ZIP restores exact metadata, document and file bytes in an independent reader", async () => {
  const bytes = new Uint8Array(pngFixture()).buffer,
    blob = new Blob([bytes]),
    asset = await inspectAsset(blob, "브랜드 이미지.png");
  const p = blankProject(),
    node = createNode("image");
  p.nodes[node.id] = node;
  p.nodes[p.pages[0].rootId].children.push(node.id);
  p.assets[asset.id] = {
    ...asset,
    description: "보라색 화면",
    credit: "테스트 자체 제작",
  };
  node.props.src = assetRef(asset.id);
  const archive = await exportProjectArchive(p, async (id) =>
    id === asset.id ? blob : undefined,
  );
  const restored = await readProjectArchive(archive);
  assert.deepEqual(restored.project, p);
  assert.equal(restored.assets.length, 1);
  assert.deepEqual(await restored.assets[0].blob.arrayBuffer(), bytes);
  const other = blankProject(),
    pasted = pasteNodes(other, copyNodes(p, [node.id]), other.pages[0].rootId);
  assert.deepEqual(pasted.project.assets[asset.id], p.assets[asset.id]);
  assert.equal(pasted.project.nodes[pasted.ids[0]].props.src, node.props.src);
});
test("ZIP export fails explicitly for missing bytes and import rejects corrupted originals", async () => {
  const blob = new Blob([new Uint8Array(pngFixture()).buffer]),
    asset = await inspectAsset(blob, "image.png"),
    p = blankProject();
  p.assets[asset.id] = asset;
  await assert.rejects(
    exportProjectArchive(p, async () => undefined),
    /원본이 없습니다/,
  );
  const archive = await exportProjectArchive(p, async () => blob),
    zip = await JSZip.loadAsync(await archive.arrayBuffer());
  zip.file(`assets/${asset.id}`, pngFixture(220, 10, 10));
  await assert.rejects(
    readProjectArchive(await zip.generateAsync({ type: "blob" })),
    /크기가 다릅니다|손상/,
  );
});
test("archive inspection rejects traversal, missing documents and declared decompression overflow", async () => {
  const zip = new JSZip();
  zip.file("project.json", JSON.stringify(blankProject()));
  zip.file("../escape.txt", "bad");
  assert.throws(() => inspectZipDirectory(new ArrayBuffer(0)), /ZIP/);
  await assert.rejects(
    readProjectArchive(await zip.generateAsync({ type: "blob" })),
    /경로/,
  );
  const missing = new JSZip();
  missing.file("hello.txt", "none");
  await assert.rejects(
    readProjectArchive(await missing.generateAsync({ type: "blob" })),
    /문서/,
  );
  const safe = new JSZip();
  safe.file("project.json", JSON.stringify(blankProject()));
  const bytes = await safe.generateAsync({ type: "arraybuffer" });
  const view = new DataView(bytes);
  for (let i = 0; i < bytes.byteLength - 46; i++)
    if (view.getUint32(i, true) === 0x02014b50) {
      view.setUint32(i + 24, 500_000_000, true);
      break;
    }
  assert.throws(() => inspectZipDirectory(bytes), /크기/);
});
test("media URLs exclude script, temporary blob URLs and credential-bearing origins", () => {
  for (const ref of [
    "javascript:alert(1)",
    "data:text/html,hello",
    "blob:https://test/id",
    "https://secret:password@example.com/",
    "/studio-assets/../config",
  ])
    assert.equal(safeMediaURL(ref), "");
  assert.equal(
    safeMediaURL("https://example.com/video.mp4"),
    "https://example.com/video.mp4",
  );
});

test("legacy gallery migration keeps item-bound text and styles across reorder and serialization", () => {
  const p = blankProject(),
    node = createNode("gallery");
  node.parts = {
    "p.0.1.0.2": {
      text: "수정했던 작품명",
      layout: { textColor: "#ff0000" },
      responsive: {},
    },
  };
  p.nodes[node.id] = node;
  p.nodes[p.pages[0].rootId].children.push(node.id);
  const items = contentItems(
    node,
    "items",
    DEFINITIONS.gallery.collections!.items,
  );
  migrateGalleryParts(node, items);
  node.content = { items };
  items.reverse();
  const restored = parseProject(JSON.parse(JSON.stringify(p))).nodes[node.id];
  assert.equal(restored.content!.items[2].values.title, "수정했던 작품명");
  assert.equal(
    restored.parts!["slot.item-legacy-0.title"].layout.textColor,
    "#ff0000",
  );
  assert.equal(restored.parts!["slot.item-legacy-0.title"].text, undefined);
  const duplicate = structuredClone(p);
  duplicate.nodes[node.id].content!.items[0].id =
    duplicate.nodes[node.id].content!.items[1].id;
  assert.throws(() => parseProject(duplicate), /ID가 중복/);
});
