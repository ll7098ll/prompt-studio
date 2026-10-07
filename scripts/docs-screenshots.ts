import { chromium, expect } from "@playwright/test";
import { mkdir } from "node:fs/promises";

async function main() {
  const baseURL = process.env.STUDIO_DOCS_URL || "http://127.0.0.1:3200";
  await mkdir("docs/images", { recursive: true });
  const browser = await chromium.launch({ channel: "msedge" });
  try {
    const context = await browser.newContext({
      viewport: { width: 1600, height: 1000 },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(baseURL);
    await page
      .locator(".workspace-template")
      .filter({ hasText: "브랜드 랜딩" })
      .click();
    const frame = page.frameLocator('iframe[title="디자인 미리보기"]');
    await expect(
      frame.getByRole("heading", { name: /좋은 아이디어가/ }),
    ).toBeVisible();
    await expect(
      page.getByText("브라우저에 저장됨", { exact: true }),
    ).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    await frame.locator("body").evaluate(() => document.fonts.ready);
    await page.screenshot({
      path: "docs/images/studio-editor.png",
      animations: "disabled",
    });
    await page.getByRole("tab", { name: "테마", exact: true }).click();
    await expect(
      page.getByText("Quiet Editorial", { exact: true }),
    ).toBeVisible();
    await page.screenshot({
      path: "docs/images/studio-theme.png",
      animations: "disabled",
    });
    if (errors.length) throw Error(`Page errors: ${errors.join("; ")}`);
    console.log(
      "Captured docs/images/studio-editor.png and studio-theme.png; no page errors.",
    );
    await context.close();
  } finally {
    await browser.close();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
