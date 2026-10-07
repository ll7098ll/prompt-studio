import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { blankProject, createNode } from "../../src/builder/model";
import { pngFixture } from "../asset-fixtures";

const frame = (page: Page) =>
  page.frameLocator('iframe[title="디자인 미리보기"]').first();
async function openExample(page: Page, component: string) {
  const p = blankProject(),
    node = createNode(component);
  p.nodes[node.id] = node;
  p.nodes[p.pages[0].rootId].children.push(node.id);
  if (component === "gallery")
    node.parts = {
      "p.0.1.0.2": {
        text: "보존할 제목",
        layout: { textColor: "#aa1122" },
        responsive: {},
      },
    };
  await page.goto("/");
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "image-content.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(p)),
    });
  await frame(page)
    .locator(`#${node.id}`)
    .click({ position: { x: 10, y: 10 } });
  return node.id;
}

test("gallery conversion, image replacement, reorder, duplicate and Undo preserve stable content and styles", async ({
  page,
}, info) => {
  await openExample(page, "gallery");
  await page.getByRole("button", { name: "항목별 편집 시작" }).click();
  const first = page.locator(".b-content-item").first();
  await first.locator("summary").click();
  await expect(page.getByLabel("1번 제목", { exact: true })).toHaveValue(
    "보존할 제목",
  );
  await page
    .getByLabel("1번 이미지 파일로 교체")
    .setInputFiles({
      name: "작품.png",
      mimeType: "image/png",
      buffer: pngFixture(),
    });
  const authoredTitle = frame(page).locator(
    '[data-part-id="item-legacy-0.title"]',
  );
  await expect(authoredTitle).toHaveCSS("color", "rgb(170, 17, 34)");
  await page
    .getByLabel("1번 제목", { exact: true })
    .fill("순서가 바뀌어도 유지");
  await expect(authoredTitle).toHaveText("순서가 바뀌어도 유지");
  await page
    .getByRole("button", { name: "1번 항목 아래로", exact: true })
    .click();
  await expect(
    frame(page).locator(".ui-image-collection article").nth(1).locator("h3"),
  ).toHaveText("순서가 바뀌어도 유지");
  await expect(authoredTitle).toHaveCSS("color", "rgb(170, 17, 34)");
  await expect(
    frame(page).locator(".ui-image-collection article").nth(1).locator("img"),
  ).toHaveAttribute("src", /^blob:/);
  await page
    .getByRole("button", { name: "2번 항목 복제", exact: true })
    .click();
  await expect(frame(page).locator(".ui-image-collection article")).toHaveCount(
    4,
  );
  await expect(
    frame(page).locator(".ui-image-collection article").nth(2).locator("h3"),
  ).toHaveCSS("color", "rgb(170, 17, 34)");
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(frame(page).locator(".ui-image-collection article")).toHaveCount(
    3,
  );
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  await page.screenshot({
    path: info.outputPath("gallery.png"),
    fullPage: true,
  });
});

test("lightbox supports keyboard navigation, escape, focus return and mobile layout", async ({
  page,
}, info) => {
  await openExample(page, "image-lightbox");
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  const first = frame(page).getByRole("button", {
    name: "사진 크게 보기: 시선의 시작",
  });
  await first.click();
  const dialog = frame(page).getByRole("dialog");
  await expect(dialog).toBeVisible();
  await dialog.press("ArrowRight");
  await expect(dialog.locator("figcaption strong")).toHaveText("새로운 균형");
  await dialog.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(first).toBeFocused();
  await page.getByRole("button", { name: "모바일", exact: true }).click();
  await first.click();
  await expect(dialog).toBeVisible();
  expect(
    await dialog.evaluate((el) => el.getBoundingClientRect().width),
  ).toBeLessThanOrEqual(390);
  await page.screenshot({
    path: info.outputPath("lightbox-mobile.png"),
    fullPage: true,
  });
  const results = await new AxeBuilder({ page })
    .include('iframe[title="디자인 미리보기"]')
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(results.violations).toEqual([]);
});

test("image comparison and hotspots remain keyboard operable", async ({
  page,
}) => {
  await openExample(page, "image-compare");
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  const slider = frame(page).getByRole("slider", { name: "이미지 분할 위치" });
  await slider.focus();
  await slider.press("Home");
  await expect(slider).toHaveValue("0");
  await slider.press("End");
  await expect(slider).toHaveValue("100");
  await page
    .getByRole("button", { name: "프로젝트 목록", exact: true })
    .click();
  await openExample(page, "image-hotspot");
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  const dot = frame(page).getByRole("button", {
    name: "1. 재료의 질감",
    exact: true,
  });
  await dot.focus();
  await dot.press("Enter");
  await expect(dot).toHaveAttribute("aria-expanded", "true");
  await expect(
    frame(page).locator(".ui-hotspot-descriptions details").first(),
  ).toHaveAttribute("open", "");
  await dot.press("Enter");
  await expect(dot).toHaveAttribute("aria-expanded", "false");
});
