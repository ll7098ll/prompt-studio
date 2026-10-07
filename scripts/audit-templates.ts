import { chromium, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { mkdir, writeFile } from "node:fs/promises";
import { TEMPLATES, createTemplate } from "../src/builder/templates";
import { encodeShare } from "../src/builder/share";

async function main() {
  await mkdir("artifacts", { recursive: true });
  const browser = await chromium.launch({ channel: "msedge" });
  const issues: unknown[] = [];
  try {
    const context = await browser.newContext({
      baseURL: "http://127.0.0.1:3200",
      viewport: { width: 1600, height: 1000 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    page.on("pageerror", (e) => issues.push({ error: e.message }));
    for (const template of TEMPLATES.filter((t) => t.id !== "blank")) {
      await page.goto(
        `http://127.0.0.1:3200/view/${await encodeShare(createTemplate(template.id))}`,
      );
      const frame = page.frameLocator("iframe");
      await frame.locator(".ui-root").waitFor();
      for (const width of ["데스크톱", "모바일"]) {
        await page.getByRole("button", { name: width, exact: true }).click();
        await expect
          .poll(() =>
            frame
              .locator("body")
              .evaluate(
                () => document.documentElement.scrollWidth <= innerWidth,
              ),
          )
          .toBe(true);
        const report = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        if (report.violations.length)
          issues.push({
            template: template.id,
            width,
            violations: report.violations,
          });
      }
      console.log(`Audited ${template.id}`);
    }
    await page.goto("/");
    await page.locator(".workspace-template-grid").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: "artifacts/preset-gallery.png",
      fullPage: true,
    });
  } finally {
    await writeFile(
      "artifacts/template-audit.json",
      JSON.stringify(issues, null, 2),
    );
    await browser.close();
  }
  console.log(`${issues.length} template issues`);
  if (issues.length) process.exitCode = 1;
}
void main();
