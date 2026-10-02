import { expect, test } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { createTemplate } from "../../src/builder/templates";
import { createNode } from "../../src/builder/model";

// Trace screenshots add raster work (measured +46ms at DPR 2 in WebKit).
// Measure the real editor workload; functional scenarios still retain traces.
test.use({ trace: "off" });
test("200 nodes including a 50-row table remain responsive while editing Korean content", async ({
  page,
}) => {
  const project = createTemplate("blank");
  const root = project.nodes[project.pages[0].rootId];
  for (let i = 0; i < 199; i++) {
    const node = createNode("text");
    node.props.text = `내용 ${i}`;
    root.children.push(node.id);
    project.nodes[node.id] = node;
  }
  const table = createNode("table");
  table.props.rows = Array.from(
    { length: 50 },
    (_, index) => `프로젝트 ${index + 1}|진행 중|담당자 ${index + 1}|오늘`,
  ).join("\n");
  root.children.splice(1, 0, table.id);
  project.nodes[table.id] = table;
  await page.goto("/");
  await page.locator('input[type="file"]').setInputFiles({
    name: "large-project.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(project)),
  });
  await page
    .frameLocator("iframe")
    .getByText("내용 0", { exact: true })
    .click();
  await expect(page.getByLabel("텍스트", { exact: true })).toBeVisible();
  // Match a real edit: focus the inspector, rather than dispatching input while
  // focus remains in the preview iframe (a different document).
  await page.getByLabel("텍스트", { exact: true }).click();
  const result = await page.evaluate(async () => {
    const field = document.querySelector(
      ".builder-inspector textarea",
    ) as HTMLTextAreaElement;
    const setValue = Object.getOwnPropertyDescriptor(
      HTMLTextAreaElement.prototype,
      "value",
    )!.set!;
    const target = document
      .querySelector("iframe")!
      .contentDocument!.querySelector(".ui-text")!;
    const times: number[] = [];
    const dispatchTimes: number[] = [];
    const domTimes: number[] = [];
    for (let i = 0; i < 25; i++) {
      const text = `한글 조립 테스트 ${i}`;
      const start = performance.now();
      setValue.call(field, text);
      field.dispatchEvent(new Event("input", { bubbles: true }));
      const dispatched = performance.now();
      await new Promise<void>((resolve, reject) => {
        const deadline = setTimeout(() => {
          observer.disconnect();
          reject(new Error("Preview did not update"));
        }, 1000);
        const observer = new MutationObserver(() => {
          if (target.textContent === text) {
            if (i >= 5) domTimes.push(performance.now() - start);
            clearTimeout(deadline);
            observer.disconnect();
            requestAnimationFrame(() => resolve());
          }
        });
        observer.observe(target, {
          childList: true,
          subtree: true,
          characterData: true,
        });
        if (target.textContent === text) {
          if (i >= 5) domTimes.push(performance.now() - start);
          clearTimeout(deadline);
          observer.disconnect();
          requestAnimationFrame(() => resolve());
        }
      });
      if (i >= 5) {
        times.push(performance.now() - start);
        dispatchTimes.push(dispatched - start);
      }
    }
    times.sort((a, b) => a - b);
    return {
      nodeCount: 200,
      tableRows: 50,
      sampleCount: times.length,
      p95ms: times[Math.ceil(times.length * 0.95) - 1],
      maxMs: times.at(-1),
      dispatchP95ms: dispatchTimes.sort((a, b) => a - b)[18],
      domP95ms: domTimes.sort((a, b) => a - b)[18],
      browser: navigator.userAgent,
      deviceScaleFactor: devicePixelRatio,
      instrumentation: "no trace screenshots; dispatch to next animation frame",
    };
  });
  await mkdir("artifacts", { recursive: true });
  await writeFile(
    `artifacts/performance-${test.info().project.name}.json`,
    JSON.stringify(result, null, 2),
  );
  expect(result.p95ms).toBeLessThan(100);
  await expect(
    page
      .frameLocator("iframe")
      .getByText("한글 조립 테스트 24", { exact: true }),
  ).toBeVisible();
});
