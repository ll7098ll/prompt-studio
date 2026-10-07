// Run against the local static server after building. Rebuild to ship the PNGs.
import { chromium, expect } from "@playwright/test";
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
    for (const template of TEMPLATES.filter(
      (t) =>
        t.id !== "blank" &&
        (!process.env.TEMPLATE_PREFIX ||
          t.id.startsWith(process.env.TEMPLATE_PREFIX)),
    )) {
      const project = createTemplate(template.id);
      await page.goto(
        `http://127.0.0.1:${process.env.PORT || 3200}/view/${await encodeShare(project)}`,
      );
      await page
        .frameLocator("iframe")
        .locator(".ui-root > .ui-node")
        .waitFor();
      const frame = page.locator("iframe");
      await expect
        .poll(() => frame.contentFrame().locator(".ui-root").innerText())
        .not.toContain("이미지를 불러오는 중");
      await frame
        .contentFrame()
        .locator("img")
        .evaluateAll(async (images) => {
          images.forEach(
            (image) => ((image as HTMLImageElement).loading = "eager"),
          );
          await Promise.all(
            images.map((image) =>
              (image as HTMLImageElement).decode().catch(() => {}),
            ),
          );
        });
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
      // A thumbnail is a still, not a screenshot of a browser-owned loading UI.
      // Seek the actual sample once; playback controls remain intact in the app.
      await frame
        .contentFrame()
        .locator("video")
        .evaluateAll(async (videos) => {
          await Promise.all(
          videos.map(async (element) => {
            const video = element as HTMLVideoElement;
              video.muted = true;
              await video.play();
              video.pause();
              video.controls = false;
              for (const track of Array.from(video.textTracks))
                track.mode = "hidden";
            }),
          );
        });
      await frame.screenshot({
        path: `public/template-previews/${template.id}.png`,
        animations: "disabled",
        style: ".studio-motion-controls { visibility: hidden !important; }",
      });
      console.log(`Captured ${template.id}`);
    }
  } finally {
    await browser.close();
  }
}
void main();
