import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  blankProject,
  createNode,
  type Project,
} from "../../src/builder/model";
import type { MotionId } from "../../src/builder/visual-presets";
import { createTemplate } from "../../src/builder/templates";
import { encodeShare } from "../../src/builder/share";

const frame = (page: Page) =>
  page.frameLocator('iframe[title="디자인 미리보기"]').first();
function sample(preset: MotionId = "words") {
  const project = blankProject(),
    node = createNode("heading", "motion-heading");
  node.props.text = "개별 문구와 위치를 보존하는 모션";
  node.appearance = {
    motion: preset,
    motionSettings: { duration: 3, delay: 0.2, intensity: 0.8 },
  };
  project.nodes[node.id] = node;
  const root = project.nodes[project.pages[0].rootId];
  root.children.push(node.id);
  root.layout.padding = 24;
  return project;
}
async function open(page: Page, project: Project) {
  await page.goto("/");
  await page.locator("input[type=file]").setInputFiles({
    name: "motion.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(project)),
  });
  await expect(frame(page).locator("#motion-heading")).toBeVisible();
}
const preview = (page: Page) =>
  page.getByRole("button", { name: "미리보기", exact: true }).click();
async function numeric(page: Page, label: string, value: string) {
  await page.getByLabel(label, { exact: true }).fill(value);
  await page.getByLabel(label, { exact: true }).press("Enter");
}

test("motion settings inherit, reset, undo and persist without changing legacy effects", async ({
  page,
}) => {
  const project = sample("float");
  project.nodes["motion-heading"].appearance = { motion: "float" };
  await open(page, project);
  const node = frame(page).locator("#motion-heading");
  await node.click();
  await expect(page.getByLabel("모션 시간 · 초", { exact: true })).toHaveValue(
    "3",
  );
  await numeric(page, "모션 시간 · 초", "1.7");
  await numeric(page, "모션 강도", "1.5");
  await expect(node).toHaveCSS("animation-name", "none");
  await preview(page);
  await expect(node).toHaveAttribute("data-motion-status", "ready");
  await expect(node).toHaveCSS("animation-duration", "1.7s");
  await frame(page)
    .getByRole("button", { name: "모션 일시 정지", exact: true })
    .click();
  await expect
    .poll(() => node.evaluate((el) => el.getAnimations()[0]?.playState))
    .toBe("paused");
  await page
    .getByRole("button", { name: "편집으로 돌아가기", exact: true })
    .click();
  await page.getByLabel("모션 duration 기본값 복원", { exact: true }).click();
  await expect(page.getByLabel("모션 시간 · 초", { exact: true })).toHaveValue(
    "3",
  );
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(page.getByLabel("모션 시간 · 초", { exact: true })).toHaveValue(
    "1.7",
  );
  await expect(page.locator(".b-save-state")).toHaveText("브라우저에 저장됨");
  await page
    .getByRole("button", { name: "프로젝트 목록", exact: true })
    .click();
  await page.reload();
  await page.locator(".workspace-project-main").first().click();
  await frame(page).locator("#motion-heading").click();
  await expect(page.getByLabel("모션 시간 · 초", { exact: true })).toHaveValue(
    "1.7",
  );
});

test("Motion mini animates iframe words, seeks and restores authored parts and layout", async ({
  page,
}, info) => {
  const project = sample();
  const node = project.nodes["motion-heading"];
  node.layout.rotation = 5;
  node.layout.widthMode = "fixed";
  node.layout.width = 600;
  project.nodes[project.pages[0].rootId].layout.padding = 100;
  node.parts = {
    "p.0": {
      text: "보존되는 내부 문구와 긴 한국어 제목",
      layout: { textColor: "#236b45", x: 7, rotation: 3 },
      responsive: {},
    },
  };
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await open(page, project);
  const outer = frame(page).locator("#motion-heading"),
    heading = outer.locator("h1,h2,h3");
  const before = await outer.evaluate((el) => ({
    outer: getComputedStyle(el).transform,
    inner: getComputedStyle(el.querySelector("h1,h2,h3")!).transform,
  }));
  await preview(page);
  await expect(outer).toHaveAttribute("data-motion-status", "ready");
  await expect(heading.locator(".studio-motion-word")).toHaveCount(6);
  await expect
    .poll(() =>
      heading.evaluate((el) => el.getAnimations({ subtree: true }).length),
    )
    .toBeGreaterThan(0);
  await frame(page)
    .getByRole("button", { name: "모션 일시 정지", exact: true })
    .click();
  const slider = frame(page).getByRole("slider", {
    name: "모션 진행 위치",
    exact: true,
  });
  await slider.focus();
  await slider.press("Home");
  await expect(slider).toHaveAttribute("aria-valuenow", "0");
  await slider.press("End");
  await expect(slider).toHaveAttribute("aria-valuenow", "100");
  await expect(heading).toHaveCSS("color", "rgb(35, 107, 69)");
  expect(
    await outer.evaluate((el) => ({
      outer: getComputedStyle(el).transform,
      inner: getComputedStyle(el.querySelector("h1,h2,h3")!).transform,
    })),
  ).toEqual(before);
  await frame(page)
    .getByRole("button", { name: "모션 처음부터", exact: true })
    .click();
  await expect
    .poll(() =>
      heading.evaluate((el) =>
        el
          .getAnimations({ subtree: true })
          .some((animation) => animation.playState === "running"),
      ),
    )
    .toBe(true);
  await page.screenshot({ path: info.outputPath("words-playback.png") });
  await page
    .getByRole("button", { name: "편집으로 돌아가기", exact: true })
    .click();
  await expect(heading.locator(".studio-motion-word")).toHaveCount(0);
  await expect(heading).toHaveText("보존되는 내부 문구와 긴 한국어 제목");
  await expect(heading).toHaveCSS("color", "rgb(35, 107, 69)");
  await preview(page);
  await expect(outer).toHaveAttribute("data-motion-status", "ready");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(outer).toHaveAttribute("data-motion-status", "still");
  await expect(heading.locator(".studio-motion-word")).toHaveCount(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await expect(outer).toHaveAttribute("data-motion-status", "ready");
  await expect(heading.locator(".studio-motion-word")).toHaveCount(6);
  expect(errors).toEqual([]);
});

test("Swiss scene words fit narrow shared pages and legacy lift returns smoothly", async ({
  page,
}, info) => {
  const project = createTemplate("pack-swiss-kinetic");
  const heading = Object.values(project.nodes).find(
    (node) => node.appearance?.motion === "words",
  )!;
  expect(heading).toBeTruthy();
  heading.appearance!.motionSettings = {
    duration: 0.4,
    stagger: 0.02,
    mobile: "inherit",
  };
  heading.props.text =
    "아주긴한국어문구도좁은화면에서읽기좋게유지합니다\nMAKE ROOM FOR IDEAS.";
  await page.goto(`/view/${await encodeShare(project)}`);
  const node = frame(page).locator(`#${heading.id}`);
  for (const [label, width] of [
    ["데스크톱", 1440],
    ["모바일", 390],
    ["태블릿", 768],
  ] as const) {
    await page.getByRole("button", { name: label, exact: true }).click();
    await expect(node).toHaveAttribute("data-motion-status", "ready");
    await frame(page)
      .getByRole("slider", { name: "모션 진행 위치", exact: true })
      .focus();
    await frame(page)
      .getByRole("slider", { name: "모션 진행 위치", exact: true })
      .press("End");
    expect(
      await frame(page)
        .locator("body")
        .evaluate(() => document.documentElement.scrollWidth),
    ).toBeLessThanOrEqual(width + 1);
    await page.screenshot({
      path: info.outputPath(`swiss-motion-${width}.png`),
    });
  }
  await open(page, sample("lift"));
  const lifted = frame(page).locator("#motion-heading");
  await lifted.click();
  await numeric(page, "모션 시간 · 초", ".25");
  await preview(page);
  await lifted.focus();
  await expect(lifted).toHaveCSS("translate", "0px -4.8px");
  await frame(page)
    .getByRole("slider", { name: "모션 진행 위치", exact: true })
    .focus();
  await expect(lifted).toHaveCSS("translate", "0px");
});

test("scroll parallax and zoom affect only inner content and pause at a chosen frame", async ({
  page,
}) => {
  const project = sample("parallax"),
    root = project.nodes[project.pages[0].rootId];
  root.layout.minHeight = 2000;
  const zoom = createNode("heading", "motion-zoom");
  zoom.appearance = { motion: "scroll-zoom" };
  root.children.push(zoom.id);
  project.nodes[zoom.id] = zoom;
  await open(page, project);
  await preview(page);
  const node = frame(page).locator("#motion-heading"),
    inner = node.locator("h1,h2,h3");
  await expect(node).toHaveAttribute("data-motion-status", "ready");
  const original = await inner.evaluate((el) => getComputedStyle(el).translate);
  await node.evaluate((el) => el.ownerDocument.defaultView!.scrollTo(0, 180));
  await expect
    .poll(() => inner.evaluate((el) => getComputedStyle(el).translate))
    .not.toBe(original);
  await expect(node).toHaveCSS("translate", "none");
  const scaled = frame(page).locator(
    "#motion-zoom h1,#motion-zoom h2,#motion-zoom h3",
  );
  await expect
    .poll(() => scaled.evaluate((el) => getComputedStyle(el).scale))
    .not.toBe("none");
  await frame(page)
    .getByRole("button", { name: "모션 일시 정지", exact: true })
    .click();
  const paused = await inner.evaluate((el) => getComputedStyle(el).translate);
  await node.evaluate((el) => el.ownerDocument.defaultView!.scrollTo(0, 260));
  await page.waitForTimeout(150);
  expect(await inner.evaluate((el) => getComputedStyle(el).translate)).toBe(
    paused,
  );
  const slider = frame(page).getByRole("slider", {
    name: "모션 진행 위치",
    exact: true,
  });
  await slider.focus();
  await slider.press("Home");
  await expect(inner).toHaveCSS("translate", "0px 32px");
});

test("view, focus and press triggers work and mobile still can be overridden", async ({
  page,
}, info) => {
  const project = sample("mask"),
    root = project.nodes[project.pages[0].rootId],
    node = project.nodes["motion-heading"];
  project.theme.motion = { preset: "float", duration: 2, mobile: "still" };
  node.appearance!.motionSettings = {
    trigger: "hover",
    duration: 2,
    mobile: "still",
  };
  const other = createNode("heading", "motion-other");
  root.children.push(other.id);
  project.nodes[other.id] = other;
  other.appearance = { motionSettings: { mobile: "inherit" } };
  await open(page, project);
  await preview(page);
  const outer = frame(page).locator("#motion-heading"),
    heading = outer.locator("h1,h2,h3");
  await expect(outer).toHaveAttribute("data-motion-status", "ready");
  await outer.focus();
  await expect
    .poll(() =>
      heading.evaluate((el) =>
        el
          .getAnimations()
          .some((animation) => animation.playState === "running"),
      ),
    )
    .toBe(true);
  await numeric(page, "미리보기 너비", "320");
  await expect(outer).toHaveAttribute("data-motion-status", "still");
  await expect(frame(page).locator("#motion-other")).toHaveAttribute(
    "data-motion-status",
    "ready",
  );
  await expect(frame(page).locator("#motion-other")).toHaveCSS(
    "animation-name",
    "studio-float",
  );
  const bar = frame(page).getByRole("complementary", {
    name: "모션 재생 제어",
  });
  expect(
    await bar.evaluate((el) => el.getBoundingClientRect().width),
  ).toBeLessThanOrEqual(304);
  const axe = await new AxeBuilder({ page })
    .include('iframe[title="디자인 미리보기"]')
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
  await page.screenshot({ path: info.outputPath("motion-mobile.png") });
  await page
    .getByRole("button", { name: "편집으로 돌아가기", exact: true })
    .click();
  await numeric(page, "미리보기 너비", "1440");
  await outer.click();
  await page
    .getByLabel("모션 시작 조건", { exact: true })
    .selectOption("press");
  await preview(page);
  await outer.focus();
  await outer.press("Enter");
  await expect
    .poll(() =>
      heading.evaluate((el) =>
        el
          .getAnimations()
          .some((animation) => animation.playState === "running"),
      ),
    )
    .toBe(true);
  await page
    .getByRole("button", { name: "편집으로 돌아가기", exact: true })
    .click();
  await page.getByLabel("모션 시작 조건", { exact: true }).selectOption("view");
  await numeric(page, "화면에 보이는 비율 · 0–1", "0.5");
  await preview(page);
  await expect
    .poll(() =>
      heading.evaluate((el) =>
        el
          .getAnimations()
          .some((animation) => animation.playState === "running"),
      ),
    )
    .toBe(true);
});

test("selected scope and reentry pause offscreen motion without changing another track", async ({
  page,
}) => {
  const project = sample("float"),
    root = project.nodes[project.pages[0].rootId];
  const spacer = createNode("frame", "motion-spacer");
  Object.assign(spacer.layout, { heightMode: "fixed", height: 1200 });
  const target = createNode("heading", "motion-reentry");
  target.appearance = {
    motion: "mask",
    motionSettings: {
      trigger: "view",
      duration: 4,
      once: false,
      threshold: 0.5,
    },
  };
  project.nodes[spacer.id] = spacer;
  project.nodes[target.id] = target;
  root.children.push(spacer.id, target.id);
  await open(page, project);
  const first = frame(page).locator("#motion-heading"),
    last = frame(page).locator("#motion-reentry"),
    inner = last.locator("h1,h2,h3");
  await first.click();
  await preview(page);
  await expect(last).toHaveAttribute("data-motion-status", "ready");
  await frame(page)
    .getByLabel("모션 재생 범위", { exact: true })
    .selectOption("selected");
  await frame(page)
    .getByRole("button", { name: "모션 일시 정지", exact: true })
    .click();
  await expect(first).toHaveAttribute("data-motion-paused", "true");
  await last.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await expect
    .poll(() =>
      inner.evaluate((el) =>
        el
          .getAnimations()
          .some((animation) => animation.playState === "running"),
      ),
    )
    .toBe(true);
  await expect(first).toHaveAttribute("data-motion-paused", "true");
  await page.waitForTimeout(200);
  await last.evaluate((el) => el.ownerDocument.defaultView!.scrollTo(0, 0));
  await expect(last).toHaveAttribute("data-motion-paused", "true");
  await expect
    .poll(() =>
      inner.evaluate((el) => Number(el.getAnimations()[0]?.currentTime)),
    )
    .toBe(0);
  await last.evaluate((el) => el.scrollIntoView({ block: "center" }));
  await expect
    .poll(() =>
      inner.evaluate((el) =>
        el
          .getAnimations()
          .some((animation) => animation.playState === "running"),
      ),
    )
    .toBe(true);
  await expect(first).toHaveAttribute("data-motion-paused", "true");
});
