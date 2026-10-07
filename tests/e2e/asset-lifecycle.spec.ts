import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { blankProject } from "../../src/builder/model";
import { pngFixture } from "../asset-fixtures";

test("asset panel is accessible and repeated preview sessions release owned object URLs", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const active = new Set<string>();
    Object.assign(window, { studioTestURLs: active });
    const create = URL.createObjectURL.bind(URL),
      revoke = URL.revokeObjectURL.bind(URL);
    URL.createObjectURL = (object) => {
      const url = create(object);
      active.add(url);
      return url;
    };
    URL.revokeObjectURL = (url) => {
      active.delete(url);
      revoke(url);
    };
  });
  await page.goto("/");
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "lifecycle.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(blankProject())),
    });
  await page.getByRole("tab", { name: "자산", exact: true }).click();
  await page
    .getByLabel("자산 파일 등록")
    .setInputFiles({
      name: "검증.png",
      mimeType: "image/png",
      buffer: pngFixture(),
    });
  await expect(page.locator(".b-asset-tile")).toHaveCount(1);
  await page.getByRole("button", { name: "화면에 추가", exact: true }).click();
  const count = () =>
    page.evaluate(
      () =>
        (window as unknown as { studioTestURLs: Set<string> }).studioTestURLs
          .size,
    );
  await expect.poll(count).toBe(2); // Renderer plus the library thumbnail.
  const result = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(
    result.violations.map((v) => ({
      id: v.id,
      targets: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  for (let i = 0; i < 6; i++) {
    await page.getByRole("button", { name: "미리보기", exact: true }).click();
    await expect.poll(count).toBe(1);
    await page
      .getByRole("button", { name: "편집으로 돌아가기", exact: true })
      .click();
    await expect.poll(count).toBe(2);
  }
  await page
    .getByRole("button", { name: "프로젝트 목록", exact: true })
    .click();
  await expect.poll(count).toBe(0);
});
