// Run against the local static server with no other browser tests in progress.
import { chromium, firefox, webkit, expect } from "@playwright/test";
import { cpus, platform, release, totalmem } from "node:os";
import { mkdir, writeFile } from "node:fs/promises";
import { blankProject, createNode } from "../src/builder/model";
import { encodeShare } from "../src/builder/share";
import { RUNTIME_MOTIONS } from "../src/builder/motion-settings";

async function main() {
  const project = blankProject(),
    root = project.nodes[project.pages[0].rootId];
  const grid = createNode("grid");
  grid.layout.columns = 2;
  grid.layout.gap = 24;
  project.nodes[grid.id] = grid;
  root.children.push(grid.id);
  root.layout.padding = 24;
  for (const preset of RUNTIME_MOTIONS) {
    const node = createNode("heading", `benchmark-${preset}`);
    node.props.text =
      "작은 움직임으로 전하는 새로운 이야기. Make room for ideas and thoughtful details.";
    Object.assign(node.layout, {
      heightMode: "fixed",
      height: 160,
      fontSize: 28,
    });
    node.appearance = {
      motion: preset,
      motionSettings: {
        trigger: "load",
        duration: 2,
        iterations: 0,
        stagger: 0.015,
      },
    };
    project.nodes[node.id] = node;
    grid.children.push(node.id);
  }
  await mkdir("artifacts", { recursive: true });
  for (const [name, engine] of [
    ["edge", chromium],
    ["firefox", firefox],
    ["webkit", webkit],
  ] as const) {
    if (process.env.MOTION_BROWSER && process.env.MOTION_BROWSER !== name)
      continue;
    const browser = await engine.launch(
      name === "edge" ? { channel: "msedge" } : {},
    );
    try {
      const page = await browser.newPage({
        viewport: { width: 1600, height: 1000 },
        deviceScaleFactor: 1,
      });
      const results = [];
      for (const animated of [false, true]) {
        const sample = structuredClone(project);
        if (!animated)
          for (const node of Object.values(sample.nodes))
            node.appearance = { motion: "none" };
        await page.goto(
          `http://127.0.0.1:${process.env.PORT || 3201}/view/${await encodeShare(sample)}`,
        );
        const frame = page
          .frameLocator('iframe[title="디자인 미리보기"]')
          .first();
        await expect(frame.locator("#benchmark-words")).toBeVisible();
        if (animated)
          for (const preset of RUNTIME_MOTIONS)
            await expect(frame.locator(`#benchmark-${preset}`)).toHaveAttribute(
              "data-motion-status",
              "ready",
            );
        await page.waitForTimeout(500);
        const measurement = await frame
          .locator(".ui-root")
          .evaluate(async (element) => {
            const view = element.ownerDocument.defaultView!;
            const samples: number[] = [];
            let previous = await new Promise<number>((resolve) =>
              view.requestAnimationFrame(resolve),
            );
            while (samples.length < 120) {
              const time = await new Promise<number>((resolve) =>
                view.requestAnimationFrame(resolve),
              );
              samples.push(time - previous);
              previous = time;
            }
            const sorted = [...samples].sort((a, b) => a - b);
            return {
              samples,
              p50: sorted[59],
              p95: sorted[113],
              max: sorted[119],
              activeAnimations: element
                .getAnimations({ subtree: true })
                .filter((animation) => animation.playState === "running")
                .length,
              viewport: [view.innerWidth, view.innerHeight],
              hardwareConcurrency: view.navigator.hardwareConcurrency,
            };
          });
        if (animated && !measurement.activeAnimations)
          throw new Error(`${name}: measurement had no active animation`);
        results.push({
          animated,
          concurrentEffects: animated ? 4 : 0,
          targetP95: 20,
          meetsTarget: measurement.p95 <= 20,
          ...measurement,
        });
      }
      const result = {
        browser: name,
        version: browser.version(),
        capturedAt: new Date().toISOString(),
        environment: {
          platform: platform(),
          release: release(),
          cpu: cpus()[0]?.model,
          logicalCPUs: cpus().length,
          memoryGiB: Math.round(totalmem() / 1024 ** 3),
          headless: true,
          trace: false,
          deviceScaleFactor: 1,
        },
        results,
      };
      await writeFile(
        `artifacts/motion-frames-${name}${process.env.MOTION_RUN ? `-run${process.env.MOTION_RUN}` : ""}.json`,
        JSON.stringify(result, null, 2),
      );
      console.log(
        JSON.stringify({
          browser: name,
          measurements: results.map(({ samples: _samples, ...value }) => value),
        }),
      );
    } finally {
      await browser.close();
    }
  }
}
void main();
