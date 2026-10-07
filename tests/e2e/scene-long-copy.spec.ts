import { test, expect } from "@playwright/test";
import { PACK_TEMPLATES } from "../../src/builder/pack-templates";
import { createTemplate } from "../../src/builder/templates";
import { encodeShare } from "../../src/builder/share";

test("scene library inserts a real editable subtree with media and one Undo removes the whole insertion", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator(".workspace-template")
    .filter({ hasText: "빈 페이지" })
    .click();
  const modes = page.locator(".b-library-modes");
  await modes.getByRole("button", { name: "장면", exact: true }).click();
  await expect(page.locator(".b-component-tile")).toHaveCount(12);
  await page.getByLabel("컴포넌트 검색").fill("시네마틱");
  await expect(page.locator(".b-component-tile")).toHaveCount(1);
  await modes.getByRole("button", { name: "컴포넌트", exact: true }).click();
  await expect(page.locator(".b-component-tile")).toHaveCount(0);
  await modes.getByRole("button", { name: "장면", exact: true }).click();
  await page.getByLabel("컴포넌트 검색").fill("");
  await page
    .getByRole("button", { name: "디테일 룩북 추가", exact: true })
    .click();
  const frame = page.frameLocator('iframe[title="디자인 미리보기"]').first();
  await expect(
    frame.locator('[data-component="scene-hotspot-lookbook"]'),
  ).toHaveCount(1);
  await expect(
    frame.locator('[data-component="image-hotspot"] img'),
  ).toHaveAttribute("src", /^blob:/);
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(
    frame.locator('[data-component="scene-hotspot-lookbook"]'),
  ).toHaveCount(0);
  await page.getByRole("button", { name: "다시 실행", exact: true }).click();
  await expect(
    frame.getByRole("heading", { name: "가까이 보면, 더 새롭게", exact: true }),
  ).toBeVisible();
});

test("all eight representative pages wrap long Korean and English titles at three widths with motion reduced", async ({
  page,
}) => {
  test.setTimeout(120000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const template of PACK_TEMPLATES) {
    const project = createTemplate(template.id);
    const heading = Object.values(project.nodes).find(
      (node) => node.component === "heading" && node.props.level === "h1",
    )!;
    heading.props.text =
      "더 많은 생각과 서로 다른 감각을 한곳에 담는 아주 긴 한국어 제목입니다\nA longer international collection of interdisciplinary ideas and everyday observations";
    await page.goto(`/view/${await encodeShare(project)}`);
    const frame = page.frameLocator('iframe[title="디자인 미리보기"]').first();
    await expect(frame.locator("h1")).toContainText("아주 긴 한국어");
    for (const [label, width] of [
      ["모바일", 390],
      ["태블릿", 768],
      ["데스크톱", 1440],
    ] as const) {
      await page.getByRole("button", { name: label, exact: true }).click();
      await expect
        .poll(() => frame.locator("body").evaluate(() => innerWidth))
        .toBe(width);
      expect(
        await frame
          .locator("body")
          .evaluate(() => document.documentElement.scrollWidth),
        `${template.id} ${width}`,
      ).toBeLessThanOrEqual(width + 1);
      const metrics = await frame.locator("h1").evaluate((element) => ({
        overflow: element.scrollWidth - element.clientWidth,
        height: element.getBoundingClientRect().height,
        text: element.textContent,
      }));
      expect(metrics.overflow).toBeLessThanOrEqual(2);
      expect(metrics.height).toBeGreaterThan(40);
      expect(metrics.text).toBe(heading.props.text);
      expect(
        await frame
          .locator(".ui-root")
          .evaluate(
            (root) =>
              root
                .getAnimations({ subtree: true })
                .filter((animation) => animation.playState === "running")
                .length,
          ),
      ).toBe(0);
    }
  }
});
