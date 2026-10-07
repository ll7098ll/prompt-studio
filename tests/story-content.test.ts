import test from "node:test";
import assert from "node:assert/strict";
import {
  blankProject,
  createNode,
  duplicateNode,
  parseProject,
  editProject,
} from "../src/builder/model";
import {
  copyNodes,
  pasteNodes,
  deleteNodes,
} from "../src/builder/design-commands";
import { fieldsForStep, fieldError } from "../src/builder/form-content";
import {
  inlineRuns,
  replaceRichRun,
  safeRichLink,
} from "../src/builder/rich-text";

test("new story components are valid documents and form seeds resolve to stable step IDs", () => {
  const project = blankProject();
  for (const id of ["scroll-chapters", "multi-step-form", "rich-text"]) {
    const node = createNode(id);
    project.nodes[node.id] = node;
    project.nodes[project.pages[0].rootId].children.push(node.id);
    if (id === "multi-step-form") {
      const { steps, fields } = node.content!;
      assert.equal(fieldsForStep(fields, steps, steps[0].id).length, 2);
      assert.equal(fieldsForStep(fields, steps, steps[1].id).length, 2);
      assert.ok(fields.every((f) => steps.some((s) => s.id === f.values.step)));
      const removed = steps.slice(1);
      assert.equal(
        fieldsForStep(fields, removed, removed[0].id).length,
        4,
        "deleted step retains its fields on the first step",
      );
    }
  }
  assert.deepEqual(parseProject(project), project);
});
test("chapter targets track duplicated and pasted subtrees while deleted targets remain repairable", () => {
  const project = blankProject(),
    root = project.pages[0].rootId;
  const group = createNode("section"),
    nav = createNode("scroll-chapters"),
    content = createNode("rich-text");
  group.children = [nav.id, content.id];
  nav.content!.chapters[0].values.target = content.id;
  Object.assign(project.nodes, {
    [group.id]: group,
    [nav.id]: nav,
    [content.id]: content,
  });
  project.nodes[root].children.push(group.id);
  const duplicate = duplicateNode(project, group.id),
    children = duplicate.project.nodes[duplicate.id].children;
  assert.equal(
    duplicate.project.nodes[children[0]].content!.chapters[0].values.target,
    children[1],
  );
  const pasted = pasteNodes(project, copyNodes(project, [group.id]), root),
    pastedChildren = pasted.project.nodes[pasted.ids[0]].children;
  assert.equal(
    pasted.project.nodes[pastedChildren[0]].content!.chapters[0].values.target,
    pastedChildren[1],
  );
  const deleted = deleteNodes(project, [content.id]);
  assert.equal(
    parseProject(deleted).nodes[nav.id].content!.chapters[0].values.target,
    content.id,
  );
  assert.throws(
    () =>
      editProject(project, (p) => {
        p.nodes[nav.id].content!.chapters[0].values.target = "__proto__";
      }),
    /연결 ID/,
  );
  assert.throws(
    () =>
      editProject(project, (p) => {
        p.nodes[nav.id].content!.chapters[0].values.target = 'x\"]button';
      }),
    /연결 ID/,
  );
});
test("form checks required values and typed inputs without discarding valid optional values", () => {
  const field = createNode("multi-step-form").content!.fields[0];
  assert.ok(fieldError(field, "  "));
  assert.equal(fieldError(field, "Lee"), "");
  field.values.kind = "email";
  assert.ok(fieldError(field, "a@"));
  assert.equal(fieldError(field, "a@example.com"), "");
  field.values.kind = "number";
  assert.ok(fieldError(field, "NaN"));
  assert.equal(fieldError(field, "-1.25"), "");
  field.values.kind = "checkbox";
  assert.ok(fieldError(field, false));
  assert.ok(fieldError(field, "true"));
  assert.equal(fieldError(field, true), "");
  field.values.kind = "select";
  field.values.options = "One\nTwo";
  assert.ok(fieldError(field, "Three"));
  assert.equal(fieldError(field, "Two"), "");
  field.values.required = false;
  assert.equal(fieldError(field, ""), "");
});
test("more than 500 independently edited parts survive document validation", () => {
  const project = blankProject(),
    node = createNode("rich-text");
  node.parts = Object.fromEntries(
    Array.from({ length: 601 }, (_, i) => [
      `slot.test-${i}`,
      { layout: { fontSize: 10 + (i % 30) }, responsive: {} },
    ]),
  );
  project.nodes[node.id] = node;
  project.nodes[project.pages[0].rootId].children.push(node.id);
  assert.equal(
    Object.keys(parseProject(project).nodes[node.id].parts!).length,
    601,
  );
});
test("rich text retains source ranges and changes only the selected fragment", () => {
  const source =
    "Hello **bold** and *soft* with `code` or [link](https://example.com).";
  const runs = inlineRuns(source);
  assert.equal(
    inlineRuns("[Reference](https://example.com/Design_(visual))")[0].href,
    "https://example.com/Design_(visual)",
  );
  assert.deepEqual(
    runs.filter((r) => r.kind !== "text").map((r) => r.kind),
    ["strong", "em", "code", "link"],
  );
  const bold = runs.find((r) => r.kind === "strong")!;
  const replaced = replaceRichRun(source, bold.start, bold.end, "safe * text");
  assert.ok(replaced.startsWith("Hello **safe \\* text** and *soft*"));
  assert.equal(
    inlineRuns(replaced).find((r) => r.kind === "strong")!.text,
    "safe * text",
  );
  assert.equal(replaceRichRun(source, -1, 20, "x"), source);
  assert.equal(inlineRuns("\\*literal\\*")[0].text, "*literal*");
  assert.ok(
    !inlineRuns("[bad](javascript:alert(1))").some((r) => r.kind === "link"),
  );
  assert.ok(
    !inlineRuns("<img src=x onerror=alert(1)>").some((r) => r.kind !== "text"),
  );
  for (const url of [
    "javascript:alert(1)",
    "//evil.example",
    "https://ok.example/\n",
    "data:text/html,x",
    "/\\evil",
  ])
    assert.equal(safeRichLink(url), undefined);
  for (const url of [
    "https://example.com",
    "mailto:a@example.com",
    "#intro",
    "/story",
  ])
    assert.equal(safeRichLink(url), url);
});
