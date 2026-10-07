import { expect, test, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { createTemplate } from "../../src/builder/templates";
import { parseProjectText } from "../../src/builder/model";
import { DESIGN_DEFAULTS } from "../../src/builder/design-schema";

for (const version of [2, 3, 4])
  test(`saving an existing v${version} project keeps the original in a checkpoint`, async ({
    page,
  }) => {
    const legacy = { ...createTemplate("landing"), schemaVersion: version };
    delete (legacy as Partial<typeof legacy>).assets;
    if (version === 2)
      for (const node of Object.values(legacy.nodes)) {
        for (const layout of [node.layout, ...Object.values(node.responsive)]) {
          for (const key of Object.keys(DESIGN_DEFAULTS))
            delete (layout as Record<string, unknown>)[key];
        }
      }
    legacy.name = "이전 형식 원본";
    await page.goto("/");
    await page.evaluate(
      (project) =>
        new Promise<void>((resolve, reject) => {
          const request = indexedDB.open("prompt-studio-projects-v2");
          request.onerror = () => reject(request.error);
          request.onupgradeneeded = () => {
            const db = request.result;
            if (!db.objectStoreNames.contains("projects"))
              db.createObjectStore("projects", { keyPath: "project.id" });
            if (!db.objectStoreNames.contains("checkpoints"))
              db.createObjectStore("checkpoints", { keyPath: "id" });
          };
          request.onsuccess = () => {
            const db = request.result,
              tx = db.transaction("projects", "readwrite");
            tx.objectStore("projects").put({ project, version: "original-v2" });
            tx.oncomplete = () => {
              db.close();
              resolve();
            };
            tx.onabort = () => {
              db.close();
              reject(tx.error);
            };
          };
        }),
      legacy,
    );
    await page.reload();
    await page
      .locator(".workspace-project-main")
      .filter({ hasText: "이전 형식 원본" })
      .click();
    await page.getByLabel("프로젝트 이름").fill("변환 후 편집");
    await expect(page.locator(".b-save-state")).toHaveText("브라우저에 저장됨");
    const stored = await page.evaluate(
      ({ id, version }) =>
        new Promise<{
          current: { schemaVersion: number; name: string };
          original: unknown;
        }>((resolve, reject) => {
          const request = indexedDB.open("prompt-studio-projects-v2");
          request.onerror = () => reject(request.error);
          request.onsuccess = () => {
            const db = request.result,
              tx = db.transaction(["projects", "checkpoints"], "readonly");
            const current = tx.objectStore("projects").get(id),
              backup = tx
                .objectStore("checkpoints")
                .get(`v${version}-backup-${id}`);
            tx.oncomplete = () => {
              db.close();
              resolve({
                current: current.result.project,
                original: backup.result?.project,
              });
            };
            tx.onabort = () => {
              db.close();
              reject(tx.error);
            };
          };
        }),
      { id: legacy.id, version },
    );
    expect(stored.current.schemaVersion).toBe(5);
    expect(stored.current.name).toBe("변환 후 편집");
    expect(stored.original).toEqual(legacy);
  });

async function blockWrites(page: Page, blockRecovery = false) {
  await page.evaluate((blockRecovery) => {
    const original = IDBDatabase.prototype.transaction;
    IDBDatabase.prototype.transaction = function (
      ...args: Parameters<IDBDatabase["transaction"]>
    ) {
      if (args[1] === "readwrite")
        throw new DOMException(
          "Simulated quota exhaustion",
          "QuotaExceededError",
        );
      return original.apply(this, args);
    };
    window.addEventListener(
      "restore-test-storage",
      () => {
        IDBDatabase.prototype.transaction = original;
      },
      { once: true },
    );
    if (blockRecovery) {
      const originalSet = Storage.prototype.setItem;
      Storage.prototype.setItem = function (key, value) {
        if (key.startsWith("prompt-studio:recovery:"))
          throw new DOMException(
            "Simulated full localStorage",
            "QuotaExceededError",
          );
        originalSet.call(this, key, value);
      };
    }
  }, blockRecovery);
}

test("one tab saving never clears another tab's unsaved recovery", async ({
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
  await blockWrites(page);
  await blockWrites(other);
  await page.getByLabel("프로젝트 이름").fill("첫 탭 미저장");
  await other.getByLabel("프로젝트 이름").fill("둘째 탭 미저장");
  await expect(page.locator(".b-save-state")).toHaveText("저장되지 않음");
  await expect(other.locator(".b-save-state")).toHaveText("저장되지 않음");
  const drafts = () =>
    page.evaluate(() =>
      Object.keys(localStorage)
        .filter((key) => key.startsWith("prompt-studio:recovery:"))
        .map((key) => JSON.parse(localStorage.getItem(key)!).project.name)
        .sort(),
    );
  expect(await drafts()).toEqual(["둘째 탭 미저장", "첫 탭 미저장"]);
  await page.evaluate(() =>
    window.dispatchEvent(new Event("restore-test-storage")),
  );
  await page.getByRole("button", { name: "다시 저장", exact: true }).click();
  await expect(page.locator(".b-save-state")).toHaveText("브라우저에 저장됨");
  expect(await drafts()).toEqual(["둘째 탭 미저장"]);
  other.on("dialog", (dialog) => dialog.accept());
  await other.reload();
  await other.locator(".workspace-project-main").click();
  await expect(other.getByRole("dialog")).toContainText("저장되지 않은 작업");
  await expect(other.getByLabel("복구본 선택")).toContainText("둘째 탭 미저장");
  await other.getByRole("button", { name: "복구본을 사본으로 열기" }).click();
  await expect(other.getByLabel("프로젝트 이름")).toHaveValue(
    "둘째 탭 미저장 사본",
  );
  expect(await drafts()).toEqual([]);
});

test("failed primary and recovery storage still allow a valid file backup", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator(".workspace-template")
    .filter({ hasText: "브랜드 랜딩" })
    .click();
  await blockWrites(page, true);
  await page.getByLabel("프로젝트 이름").fill("백업해야 할 작업");
  await expect(page.locator('.builder-error[role="alert"]')).toContainText(
    "임시 복구본도 저장하지 못했습니다",
  );
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "파일 백업", exact: true }).click();
  const file = await download;
  expect(file.suggestedFilename()).toBe("백업해야 할 작업.json");
  const backup = parseProjectText(await readFile((await file.path())!, "utf8"));
  expect(backup.name).toBe("백업해야 할 작업");
  expect(
    Object.values(backup.nodes).some((node) => node.component === "hero"),
  ).toBe(true);
});

test("a legacy recovery draft can be restored even when its original project is missing", async ({
  page,
}) => {
  const project = createTemplate("settings");
  project.name = "남아 있는 설정 시안";
  const key = `prompt-studio:recovery:${project.id}`;
  await page.goto("/");
  await page.evaluate(
    ({ key, project }) => {
      localStorage.setItem(
        key,
        JSON.stringify({
          project,
          baseVersion: "missing",
          savedAt: project.updatedAt,
        }),
      );
    },
    { key, project },
  );
  await expect(page.locator(".workspace-project-main")).toHaveCount(0);
  await page.getByRole("button", { name: "복구 자료", exact: true }).click();
  await expect(page.getByLabel("복구본 선택")).toContainText(project.name);
  const downloaded = page.waitForEvent("download");
  await page.getByRole("button", { name: "복구본 다운로드" }).click();
  expect(
    parseProjectText(
      await readFile((await (await downloaded).path())!, "utf8"),
    ),
  ).toEqual(project);
  await page.getByRole("button", { name: "복구본을 사본으로 열기" }).click();
  await expect(page.getByLabel("프로젝트 이름")).toHaveValue(
    `${project.name} 사본`,
  );
  expect(
    await page.evaluate((key) => localStorage.getItem(key), key),
  ).toBeNull();
  await page
    .getByRole("button", { name: "프로젝트 목록", exact: true })
    .click();
  await page.reload();
  await expect(page.locator(".workspace-project-main")).toHaveCount(1);
  await page.getByRole("button", { name: "복구 자료", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "미저장 작업이 없습니다",
  );
});
