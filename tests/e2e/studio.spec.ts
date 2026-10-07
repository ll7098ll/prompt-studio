import { test, expect } from "@playwright/test";
import JSZip from "jszip";
import { readFile, writeFile } from "node:fs/promises";

test("create, edit, undo, redo, persist and reopen a real project", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto("/");
  expect(
    await page
      .locator(".builder-workspace")
      .evaluate((el) => el.getBoundingClientRect().width),
  ).toBe(1600);
  await expect(
    page.getByRole("heading", { name: "생각하던 화면을, 직접 만들어보세요." }),
  ).toBeVisible();
  await page
    .locator(".workspace-template")
    .filter({ hasText: "브랜드 랜딩" })
    .click();
  const frame = page.frameLocator('iframe[title="디자인 미리보기"]');
  await expect(
    frame.getByRole("heading", { name: /좋은 아이디어가/ }),
  ).toBeVisible();
  await frame.getByRole("heading", { name: /좋은 아이디어가/ }).click();
  await page.getByLabel("제목", { exact: true }).fill("나만의 새로운 시작");
  await expect(
    frame.getByRole("heading", { name: "나만의 새로운 시작" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(
    frame.getByRole("heading", { name: /좋은 아이디어가/ }),
  ).toBeVisible();
  await page.getByRole("button", { name: "다시 실행", exact: true }).click();
  await expect(
    frame.getByRole("heading", { name: "나만의 새로운 시작" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "프로젝트 목록", exact: true })
    .click();
  await page.reload();
  await page
    .locator(".workspace-project-main")
    .filter({ hasText: "브랜드 랜딩" })
    .click();
  await expect(
    frame.getByRole("heading", { name: "나만의 새로운 시작" }),
  ).toBeVisible();
  expect(errors).toEqual([]);
  await page.screenshot({
    path: `artifacts/editor-${test.info().project.name}.png`,
  });
});

test("theme, page structure and selected content appear in the AI handoff", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.goto("/");
  await page
    .locator(".workspace-template")
    .filter({ hasText: "앱 대시보드" })
    .click();
  await page.getByRole("tab", { name: "테마", exact: true }).click();
  await page
    .getByRole("button", { name: "웜 에디토리얼", exact: true })
    .click();
  await page.getByRole("button", { name: "다크", exact: true }).click();
  await page.getByRole("button", { name: "페이지 추가", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /설정 페이지/ })
    .click();
  await page.getByRole("button", { name: "페이지 추가", exact: true }).click();
  await page
    .getByRole("dialog")
    .getByRole("button", { name: /브랜드 랜딩/ })
    .click();
  await page.getByRole("button", { name: "AI에 전달", exact: false }).click();
  const data = await page
    .getByLabel("구현 프롬프트", { exact: true })
    .inputValue();
  expect(data).toContain("웜 에디토리얼");
  expect(data).toContain('"mode": "dark"');
  expect(data).toContain('"children"');
  expect(data).toContain("프로필");
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "설계 파일 ZIP" }).click();
  const exported = await download;
  expect(exported.suggestedFilename()).toMatch(/handoff.zip$/);
  const zip = await JSZip.loadAsync(await readFile((await exported.path())!));
  expect(zip.file(/^screenshots\/.*png$/)).toHaveLength(9);
  expect(zip.file("theme.tokens.json")).not.toBeNull();
  expect(zip.file("component-specs.json")).not.toBeNull();
  expect(await zip.file("component-specs.json")!.async("string")).toContain(
    "aria-sort",
  );
  const manifest = JSON.parse(await zip.file("manifest.json")!.async("string"));
  expect(manifest.themeMode).toBe("dark");
  const png = await zip
    .file(/^screenshots\/.*desktop.png$/)[0]
    .async("nodebuffer");
  expect(png.readUInt32BE(16)).toBe(1440);
  await exported.saveAs(`artifacts/ai-handoff-${test.info().project.name}.zip`);
  await writeFile(
    `artifacts/exported-dashboard-${test.info().project.name}.png`,
    png,
  );
});

test("share snapshot opens in a separate browser context without the original storage", async ({
  page,
  browser,
}) => {
  await page.goto("/");
  await page
    .locator(".workspace-template")
    .filter({ hasText: "브랜드 랜딩" })
    .click();
  await page.getByRole("button", { name: "공유", exact: true }).click();
  const link = await page.getByLabel("공유 링크", { exact: true }).inputValue();
  const context = await browser.newContext();
  const viewer = await context.newPage();
  await viewer.goto(link);
  await expect(
    viewer
      .frameLocator('iframe[title="디자인 미리보기"]')
      .getByRole("heading", { name: /좋은 아이디어가/ }),
  ).toBeVisible();
  await expect(
    viewer.getByRole("button", { name: "내 브라우저에 복사" }),
  ).toBeVisible();
  await expect(viewer.frameLocator('iframe[title="디자인 미리보기"]').locator(".ui-edit")).toHaveCount(
    0,
  );
  await viewer.evaluate(() => {
    window.location.hash = "design=broken";
  });
  await expect(viewer.locator("main").getByRole("alert")).toContainText(
    "링크가 손상",
  );
  await expect(viewer.locator("iframe")).toHaveCount(0);
  await expect(viewer.getByRole("button", { name: "파일 백업" })).toHaveCount(
    0,
  );
  await viewer.evaluate((hash) => {
    window.location.hash = hash;
  }, new URL(link).hash);
  await expect(
    viewer
      .frameLocator('iframe[title="디자인 미리보기"]')
      .getByRole("heading", { name: /좋은 아이디어가/ }),
  ).toBeVisible();
  await viewer.getByRole("button", { name: "내 브라우저에 복사" }).click();
  await expect(viewer.locator(".workspace-project-main")).toContainText(
    "브랜드 랜딩 사본",
  );
  await context.close();
});

test("conflicting edits from two tabs never silently overwrite the first save", async ({
  page,
  context,
}) => {
  await page.goto("/");
  await page
    .locator(".workspace-template")
    .filter({ hasText: "빈 페이지" })
    .click();
  const other = await context.newPage();
  await other.goto("/");
  await other.locator(".workspace-project-main").click();
  await page.getByLabel("프로젝트 이름").fill("첫 번째 저장");
  await expect(page.locator(".b-save-state")).toHaveText("브라우저에 저장됨");
  await other.getByLabel("프로젝트 이름").fill("두 번째 저장");
  await expect(other.locator('.builder-error[role="alert"]')).toContainText(
    "다른 탭",
  );
  await expect(
    other.getByRole("button", { name: "파일 백업", exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "프로젝트 목록", exact: true })
    .click();
  await expect(page.locator(".workspace-project-main")).toContainText(
    "첫 번째 저장",
  );
  await other.getByRole("button", { name: "사본 저장 후 목록으로" }).click();
  await expect(other.locator(".workspace-project-main")).toHaveCount(2);
  await expect(
    other
      .locator(".workspace-project-main")
      .filter({ hasText: "두 번째 저장 사본" }),
  ).toBeVisible();
});

test("checkpoints restore complete themes and remain undoable", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator(".workspace-template")
    .filter({ hasText: "브랜드 랜딩" })
    .click();
  await page.getByRole("button", { name: "저장한 버전", exact: true }).click();
  await page.getByLabel("버전 이름").fill("초기 시안");
  await page.getByRole("button", { name: "현재 버전 저장" }).click();
  await expect(page.locator(".b-checkpoint")).toContainText("초기 시안");
  await page.getByRole("button", { name: "닫기", exact: true }).click();
  await page.getByLabel("프로젝트 이름").fill("수정 시안");
  await page.getByRole("button", { name: "저장한 버전", exact: true }).click();
  await page.getByRole("button", { name: "복원", exact: true }).click();
  await expect(page.getByLabel("프로젝트 이름")).not.toHaveValue("수정 시안");
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(page.getByLabel("프로젝트 이름")).toHaveValue("수정 시안");
});

test("one malformed stored project does not hide the healthy library", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator(".workspace-template")
    .filter({ hasText: "빈 페이지" })
    .click();
  await page
    .getByRole("button", { name: "프로젝트 목록", exact: true })
    .click();
  await page.evaluate(async () => {
    localStorage.setItem("prompt-studio:recovery:broken", "{broken recovery");
    await new Promise<void>((resolve, reject) => {
      const request = indexedDB.open("prompt-studio-projects-v2");
      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction("projects", "readwrite");
        tx.objectStore("projects").put({
          project: { id: "corrupt-test", schemaVersion: 999 },
          version: "test",
        });
        tx.oncomplete = () => {
          db.close();
          resolve();
        };
        tx.onabort = () => reject(tx.error);
      };
    });
  });
  await page.reload();
  await expect(page.locator(".workspace-project-main")).toHaveCount(1);
  await expect(page.locator('.builder-error[role="alert"]')).toContainText(
    "읽을 수 없는 프로젝트 1개",
  );
  const downloadEvent = page.waitForEvent("download");
  await page.getByRole("button", { name: "원본 저장소 백업" }).click();
  const download = await downloadEvent;
  expect(download.suggestedFilename()).toBe("studio-storage-recovery.json");
  const backup = JSON.parse(await readFile((await download.path())!, "utf8"));
  expect(backup.recovery.records["prompt-studio:recovery:broken"]).toBe(
    "{broken recovery",
  );
});

test("actual iframe viewport drives responsive layout and component interactions", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator(".workspace-template")
    .filter({ hasText: "브랜드 랜딩" })
    .click();
  await page.getByRole("button", { name: "모바일", exact: true }).click();
  const frame = page.frameLocator('iframe[title="디자인 미리보기"]');
  await expect(frame.locator('.ui-node[data-component="grid"]')).toHaveCSS(
    "grid-template-columns",
    /\d+(?:\.\d+)?px/,
  );
  expect(
    await frame.locator("body").evaluate((body) => body.scrollWidth <= 390),
  ).toBe(true);
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  await frame.getByRole("button", { name: "메뉴 열기" }).click();
  await expect(
    frame.getByRole("navigation", { name: "모바일 메뉴" }),
  ).toBeVisible();
  await expect(frame.locator(".ui-edit")).toHaveCount(0);
  await page.screenshot({
    path: `artifacts/editor-mobile-preview-${test.info().project.name}.png`,
  });
});

test("adding and moving nested elements preserves the page and supports deletion", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator(".workspace-template")
    .filter({ hasText: "빈 페이지" })
    .click();
  await page.getByRole("button", { name: "카드 추가", exact: true }).click();
  await page.getByRole("button", { name: "버튼 추가", exact: true }).click();
  const frame = page.frameLocator('iframe[title="디자인 미리보기"]');
  await expect(
    frame.locator('[data-component="card"] [data-component="button"]'),
  ).toHaveCount(1);
  await page.getByRole("button", { name: "요소 복제", exact: true }).click();
  await expect(
    frame.locator('[data-component="card"] [data-component="button"]'),
  ).toHaveCount(2);
  await page.getByRole("button", { name: "요소 삭제", exact: true }).click();
  await expect(
    frame.locator('[data-component="card"] [data-component="button"]'),
  ).toHaveCount(1);
});

test("workspace is readable without horizontal overflow at mobile width", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await expect(
    page.getByRole("button", { name: "새 프로젝트", exact: false }),
  ).toBeVisible();
  expect(
    await page.locator("body").evaluate((body) => body.scrollWidth <= 390),
  ).toBe(true);
  await page.screenshot({
    path: `artifacts/workspace-mobile-${test.info().project.name}.png`,
    fullPage: true,
  });
  await page.setViewportSize({ width: 320, height: 844 });
  expect(
    await page.locator("body").evaluate((body) => body.scrollWidth <= 320),
  ).toBe(true);
  for (const label of ["파일 열기", "복구 자료"]) {
    const bounds = await page
      .getByRole("button", { name: label, exact: true })
      .boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(16);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(304);
  }
});
