import { test } from "node:test";
import assert from "node:assert/strict";
import { blankProject, createNode, parseProject } from "../src/builder/model";
import {
  resolveMotion,
  motionSettingsSchema,
  scrollMotionProgress,
} from "../src/builder/motion-settings";
import { handoffSpec } from "../src/builder/export";

test("motion defaults preserve legacy documents and explicit none beats theme", () => {
  const project = blankProject(),
    node = createNode("heading");
  node.appearance = { motion: "float" };
  project.nodes[node.id] = node;
  project.nodes[project.pages[0].rootId].children.push(node.id);
  assert.deepEqual(parseProject(project), project);
  assert.equal(resolveMotion(node, project.theme).duration, 3);
  assert.equal(resolveMotion(node, project.theme).iterations, 0);
  assert.equal(node.appearance.motionSettings, undefined);
  project.theme.motion = { preset: "fade", duration: 1.2, mobile: "still" };
  node.appearance = {};
  assert.equal(resolveMotion(node, project.theme).duration, 1.2);
  assert.equal(resolveMotion(node, project.theme).mobile, "still");
  node.appearance.motionSettings = { duration: 2, mobile: "inherit" };
  assert.equal(resolveMotion(node, project.theme).duration, 2);
  assert.equal(resolveMotion(node, project.theme).mobile, "inherit");
  node.appearance.motion = "none";
  assert.equal(resolveMotion(node, project.theme).preset, "none");
});

test("motion schema rejects invalid bounds, unsupported triggers and nonfinite settings", () => {
  for (const value of [
    { duration: 0 },
    { delay: -1 },
    { intensity: Infinity },
    { iterations: 1.5 },
    { scrollStart: 80, scrollEnd: 20 },
    { scrollEnd: 0 },
    { trigger: "arbitrary-code" },
    { script: "alert(1)" },
  ])
    assert.equal(motionSettingsSchema.safeParse(value).success, false);
  assert.equal(
    motionSettingsSchema.safeParse({
      scrollStart: 30,
      scrollEnd: 70,
      trigger: "scroll",
    }).success,
    true,
  );
});

test("scroll progress maps entry/exit and custom ranges without zero-size errors", () => {
  assert.equal(scrollMotionProgress(900, 300, 900), 0);
  assert.equal(scrollMotionProgress(300, 300, 900), 0.5);
  assert.equal(scrollMotionProgress(-300, 300, 900), 1);
  assert.equal(scrollMotionProgress(300, 300, 900, 25, 75), 0.5);
  assert.equal(scrollMotionProgress(800, 300, 900, 25, 75), 0);
  assert.equal(scrollMotionProgress(-100, 300, 900, 25, 75), 1);
  assert.ok(Number.isFinite(scrollMotionProgress(0, 0, 0)));
});

test("handoff carries resolved motion and runtime requirements with source overrides", () => {
  const project = blankProject(),
    node = createNode("heading");
  node.appearance = {
    motion: "words",
    motionSettings: {
      duration: 1.8,
      stagger: 0.09,
      trigger: "view",
      threshold: 0.5,
      once: false,
    },
  };
  project.nodes[node.id] = node;
  project.nodes[project.pages[0].rootId].children.push(node.id);
  const spec = handoffSpec(project),
    motion = spec.resolvedMotions[node.id];
  assert.equal(motion.engine, "motion/mini");
  assert.equal(motion.duration, 1.8);
  assert.equal(motion.threshold, 0.5);
  assert.equal(motion.once, false);
  assert.match(spec.layoutRules.motion, /reference.css만으로/);
  assert.deepEqual(
    parseProject(spec.source).nodes[node.id].appearance,
    node.appearance,
  );
});
