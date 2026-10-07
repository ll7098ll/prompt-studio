import { test, expect } from "@playwright/test";
import { blankProject, createNode } from "../../src/builder/model";

test("focus reveals a masked control and the view-once setting resets through Undo", async ({
  page,
}) => {
  const project = blankProject(),
    node = createNode("button", "focus-control");
  node.appearance = {
    motion: "mask",
    motionSettings: { duration: 10, trigger: "load" },
  };
  project.nodes[node.id] = node;
  project.nodes[project.pages[0].rootId].children.push(node.id);
  await page.goto("/");
  await page.locator("input[type=file]").setInputFiles({
    name: "focus.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(project)),
  });
  const frame = page.frameLocator('iframe[title="디자인 미리보기"]').first(),
    outer = frame.locator("#focus-control");
  await expect(outer).toBeVisible();
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  await expect(outer).toHaveAttribute("data-motion-status", "ready");
  const button = outer.locator("button");
  await button.focus();
  await expect(button).toBeFocused();
  await expect(outer).toHaveAttribute("data-motion-paused", "true");
  await expect(button).toHaveCSS(
    "clip-path",
    /^inset\(0(?:px|%)?(?: 0(?:px|%)?){0,3}\)$/,
  );
  await page
    .getByRole("button", { name: "편집으로 돌아가기", exact: true })
    .click();
  await button.click();
  await page.getByLabel("모션 시작 조건", { exact: true }).selectOption("view");
  const once = page.getByLabel("처음 들어올 때만 실행", { exact: true });
  await once.uncheck();
  await expect(once).not.toBeChecked();
  await page
    .getByRole("button", { name: "모션 once 기본값 복원", exact: true })
    .click();
  await expect(once).toBeChecked();
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(once).not.toBeChecked();
});
