import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFile } from "node:fs/promises";
import { createTemplate } from "../../src/builder/templates";
import { PACK_TEMPLATES } from "../../src/builder/pack-templates";
import { componentExample } from "../../src/builder/library";
import { THEME_PRESETS } from "../../src/builder/theme";
import { type Project } from "../../src/builder/model";
import { encodeShare } from "../../src/builder/share";
import { readProjectArchive } from "../../src/builder/project-archive";
const frame = (page: Page) =>
  page.frameLocator('iframe[title="디자인 미리보기"]').first();
async function open(page: Page, project: Project) {
  await page.goto("/");
  await page.locator("input[type=file]").setInputFiles({
    name: "scenes.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(project)),
  });
  await expect(frame(page).locator(".ui-root")).toBeVisible();
}
for (const template of PACK_TEMPLATES) {
  test(`${template.id}: complete media, independent children and responsive scenes`, async ({
    page,
  }, info) => {
    test.setTimeout(60000);
    await page.emulateMedia({ reducedMotion: "reduce" });
    const project = createTemplate(template.id);
    await page.goto(`/view/${await encodeShare(project)}`);
    await expect(frame(page).locator(".ui-root")).toBeVisible();
    const images = frame(page).locator('[data-component="image"] img, [data-component="image-compare"] img, [data-component="image-hotspot"] img');
    const expectedImages = Object.values(project.nodes).reduce((count,node)=>count+(node.component==='image-compare'?2:['image','image-hotspot'].includes(node.component)?1:0),0);
    await expect(images).toHaveCount(expectedImages);
    for (const image of await images.all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate((image: HTMLImageElement) => image.naturalWidth),
        )
        .toBeGreaterThan(0);
    }
    await frame(page)
      .locator("body")
      .evaluate(() => scrollTo(0, 0));
    await expect
      .poll(() =>
        images.evaluateAll((images) =>
            images.every(
              (image) =>
                (image as HTMLImageElement).complete &&
                (image as HTMLImageElement).naturalWidth > 0,
            ),
          ),
      )
      .toBe(true);
    await expect(frame(page).locator('[data-component^="scene-"]')).toHaveCount(
      3,
    );
    for (const [label, width] of [
      ["모바일", 390],
      ["태블릿", 768],
      ["데스크톱", 1440],
    ] as const) {
      await page.getByRole("button", { name: label, exact: true }).click();
      await expect
        .poll(() =>
          frame(page)
            .locator("body")
            .evaluate(() => innerWidth),
        )
        .toBe(width);
      expect(
        await frame(page)
          .locator("body")
          .evaluate(() => document.documentElement.scrollWidth),
      ).toBeLessThanOrEqual(width + 1);
      expect(
        await frame(page)
          .locator("h1,h2,h3,p")
          .evaluateAll((elements) =>
            elements
              .filter(
                (element) => element.scrollWidth > element.clientWidth + 2,
              )
              .map((element) => element.textContent),
          ),
      ).toEqual([]);
      expect(await frame(page).locator(".ui-root").innerText()).not.toContain(
        "원본 없음",
      );
      await page.screenshot({
        path: info.outputPath(`${template.id}-${width}.png`),
      });
    }
    const axe = await new AxeBuilder({ page })
      .include('iframe[title="디자인 미리보기"]')
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(axe.violations).toEqual([]);
  });
}
test("scene child text and inner hotspot style edit independently, undo and round-trip", async ({
  page,
}) => {
  const project = componentExample("scene-hotspot-lookbook", THEME_PRESETS[0]);
  const headline = Object.values(project.nodes).find(
    (node) => node.component === "heading",
  )!;
  const hotspot = Object.values(project.nodes).find(
    (node) => node.component === "image-hotspot",
  )!;
  await open(page, project);
  await frame(page).locator(`#${headline.id} h1`).click();
  await page
    .getByLabel("텍스트", { exact: true })
    .fill("각 부분을 자유롭게 편집");
  await expect(
    frame(page).getByRole("heading", { name: "각 부분을 자유롭게 편집" }),
  ).toBeVisible();
  const marker = frame(page).locator(`#${hotspot.id} button`).first();
  await marker.click({ modifiers: ["Control"] });
  await page.getByLabel("내부 글자 크기", { exact: true }).fill("22");
  await page.getByLabel("내부 글자 크기", { exact: true }).press("Enter");
  await expect(marker).toHaveCSS("font-size", "22px");
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(marker).not.toHaveCSS("font-size", "22px");
  await expect(
    frame(page).getByRole("heading", { name: "각 부분을 자유롭게 편집" }),
  ).toBeVisible();
  await expect(page.locator(".b-save-state")).toHaveText("브라우저에 저장됨");
  await page
    .getByRole("button", { name: "프로젝트 목록", exact: true })
    .click();
  await page.reload();
  await page.locator(".workspace-project-main").first().click();
  await expect(
    frame(page).getByRole("heading", { name: "각 부분을 자유롭게 편집" }),
  ).toBeVisible();
});
test("built-in originals fetch once and ZIP restores offline in a new browser context", async ({
  page,
  browser,
}) => {
  test.setTimeout(60000);
  const project = componentExample("scene-before-after", THEME_PRESETS[0]);
  const requests: string[] = [];
  page.on("request", (request) => {
    if (request.url().includes("/studio-assets/")) requests.push(request.url());
  });
  await open(page, project);
  await expect
    .poll(() =>
      frame(page)
        .locator("img")
        .evaluateAll(
          (images) =>
            images.length === 2 &&
            images.every(
              (image) => (image as HTMLImageElement).naturalWidth > 0,
            ),
        ),
    )
    .toBe(true);
  expect(requests.length).toBe(2);
  await page.getByRole("tab", { name: "자산", exact: true }).click();
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "자산 포함 ZIP 백업", exact: true })
    .click();
  const bytes = await readFile((await (await download).path())!);
  const restored = await readProjectArchive(
    new Blob([new Uint8Array(bytes).buffer]),
  );
  expect(Object.keys(restored.project.assets)).toHaveLength(2);
  expect(restored.assets).toHaveLength(2);
  const context = await browser.newContext();
  try {
    await context.route("**/studio-assets/**", (route) => route.abort());
    const target = await context.newPage();
    await target.goto(page.url().split("/").slice(0, 3).join("/"));
    await target.locator("input[type=file]").setInputFiles({
      name: "scene.zip",
      mimeType: "application/zip",
      buffer: bytes,
    });
    await expect(frame(target).locator('.ui-root')).toBeVisible({timeout:15000});
    await expect(frame(target).locator('.ui-image-compare img')).toHaveCount(2);
    for (const image of await frame(target).locator('.ui-image-compare img').all()) await image.scrollIntoViewIfNeeded();
    await expect
      .poll(() =>
        frame(target)
          .locator("img")
          .evaluateAll(
            (images) =>
              images.length === 2 &&
              images.every(
                (image) => (image as HTMLImageElement).naturalWidth > 0,
              ),
          ),
      )
      .toBe(true);
  } finally {
    await context.close();
  }
});
