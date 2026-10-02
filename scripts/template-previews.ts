// Run against the local static server after building. Rebuild to ship the PNGs.
import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { TEMPLATES, createTemplate } from "../src/builder/templates";
import { encodeShare } from "../src/builder/share";

async function main() {
  await mkdir("public/template-previews", { recursive: true });
  const browser = await chromium.launch({ channel: "msedge" });
  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 960 },
      deviceScaleFactor: 1,
      reducedMotion: "reduce",
    });
    for (const template of TEMPLATES.filter((t) => t.id !== "blank")) {
      const project = createTemplate(template.id);
      await page.goto(
        `http://127.0.0.1:3200/view/${await encodeShare(project)}`,
      );
      await page
        .frameLocator("iframe")
        .locator(".ui-root > .ui-node")
        .waitFor();
      const frame = page.locator("iframe");
      await frame.evaluate((element) => {
        for (
          let parent = element.parentElement;
          parent;
          parent = parent.parentElement
        ) {
          Object.assign(parent.style, {
            contain: "none",
            overflow: "visible",
            transform: "none",
            isolation: "auto",
          });
        }
        Object.assign(element.style, {
          position: "fixed",
          left: "0",
          top: "0",
          width: "1440px",
          height: "960px",
          transform: "none",
          zIndex: "999",
        });
      });
      await frame.screenshot({
        path: `public/template-previews/${template.id}.png`,
        animations: "disabled",
      });
      console.log(`Captured ${template.id}`);
    }
  } finally {
    await browser.close();
  }
}
void main();
