import { test, expect, type Page } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { blankProject } from "../../src/builder/model";
import { pngFixture, wavFixture } from "../asset-fixtures";
import { readProjectArchive } from "../../src/builder/project-archive";

const frame = (page: Page) =>
  page.frameLocator('iframe[title="디자인 미리보기"]').first();

test("asset storage failures are atomic and removing unused metadata remains undoable", async ({
  page,
}) => {
  await openBlank(page);
  await uploadImage(page);
  await page
    .getByRole("button", {
      name: "테스트 이미지.png 목록에서 제거",
      exact: true,
    })
    .click();
  await expect(page.locator(".b-asset-tile")).toHaveCount(0);
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(page.locator(".b-asset-tile")).toHaveCount(1);
  await page.getByRole("button", { name: "화면에 추가", exact: true }).click();
  await expect(
    page.getByRole("button", {
      name: "테스트 이미지.png 목록에서 제거",
      exact: true,
    }),
  ).toBeDisabled();
  const source = await page.getByLabel("이미지 자산 선택").inputValue();
  await page.evaluate(() => {
    const put = IDBObjectStore.prototype.put;
    IDBObjectStore.prototype.put = function (...args) {
      if (this.name === "assets")
        throw new DOMException("Simulated quota failure", "QuotaExceededError");
      return put.apply(this, args);
    };
  });
  await page
    .getByLabel("이미지 파일로 교체")
    .setInputFiles({
      name: "실패한 교체.png",
      mimeType: "image/png",
      buffer: pngFixture(10, 20, 30),
    });
  await expect(page.locator(".b-asset-field [role=alert]")).toContainText(
    "파일을 보관하지 못했습니다",
  );
  await expect(page.getByLabel("이미지 자산 선택")).toHaveValue(source);
  await expect(page.locator(".b-asset-tile")).toHaveCount(1);
  await expect
    .poll(() =>
      frame(page)
        .locator(".ui-image img")
        .evaluate((image: HTMLImageElement) => image.naturalWidth),
    )
    .toBe(80);
});
async function openBlank(page: Page) {
  await page.goto("/");
  await page.locator("input[type=file]").setInputFiles({
    name: "assets.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(blankProject())),
  });
  await page.getByRole("tab", { name: "자산", exact: true }).click();
}
async function uploadImage(page: Page, red = 85, name = "테스트 이미지.png") {
  await page
    .getByLabel("자산 파일 등록")
    .setInputFiles({ name, mimeType: "image/png", buffer: pngFixture(red) });
  await expect(
    page.locator(".b-asset-tile").filter({ hasText: name }),
  ).toBeVisible();
}

test("local images replace, undo, reload and restore with their exact bytes in a new browser profile", async ({
  page,
  browser,
}, info) => {
  await openBlank(page);
  await uploadImage(page);
  await page.getByRole("button", { name: "화면에 추가", exact: true }).click();
  const image = frame(page).locator(".ui-image img");
  await expect(image).toHaveAttribute("src", /^blob:/);
  await expect
    .poll(() => image.evaluate((el: HTMLImageElement) => el.naturalWidth))
    .toBe(80);
  const original = await image.getAttribute("src");
  await page.getByLabel("이미지 파일로 교체").setInputFiles({
    name: "두 번째.png",
    mimeType: "image/png",
    buffer: pngFixture(220),
  });
  await expect(page.getByLabel("이미지 자산 선택")).toHaveValue(/^asset:/);
  await expect.poll(() => image.getAttribute("src")).not.toBe(original);
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(
    page.getByLabel("이미지 자산 선택").locator("option:checked"),
  ).toHaveText("테스트 이미지.png");
  await expect(page.locator(".b-save-state")).toHaveText("브라우저에 저장됨");
  await page
    .getByRole("button", { name: "프로젝트 목록", exact: true })
    .click();
  await page.reload();
  await page.locator(".workspace-project-main").first().click();
  await expect
    .poll(() => image.evaluate((el: HTMLImageElement) => el.naturalWidth))
    .toBe(80);
  await page.getByRole("tab", { name: "자산", exact: true }).click();
  const download = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "자산 포함 ZIP 백업", exact: true })
    .click();
  const saved = await download,
    bytes = await readFile((await saved.path())!);
  const restored = await readProjectArchive(
    new Blob([new Uint8Array(bytes).buffer]),
  );
  expect(restored.assets).toHaveLength(1);
  expect(Buffer.from(await restored.assets[0].blob.arrayBuffer())).toEqual(
    pngFixture(),
  );
  const context = await browser.newContext(),
    other = await context.newPage();
  try {
    await other.goto(new URL("/", page.url()).href);
    await other.locator("input[type=file]").setInputFiles({
      name: "restored.zip",
      mimeType: "application/zip",
      buffer: bytes,
    });
    await expect
      .poll(() =>
        frame(other)
          .locator(".ui-image img")
          .evaluate((el: HTMLImageElement) => el.naturalWidth),
      )
      .toBe(80);
    await other.screenshot({
      path: info.outputPath("restored-assets.png"),
      fullPage: true,
    });
  } finally {
    await context.close();
  }
});

test("same bytes deduplicate and restore a missing local original without changing the authored reference", async ({
  page,
}) => {
  await openBlank(page);
  await uploadImage(page);
  await page.getByRole("button", { name: "화면에 추가", exact: true }).click();
  await page.getByLabel("자산 파일 등록").setInputFiles({
    name: "별도 이름.png",
    mimeType: "image/png",
    buffer: pngFixture(),
  });
  await expect(page.getByLabel("자산 파일 등록")).toBeEnabled();
  // Content identity, not filename, determines deduplication.
  await expect(page.locator(".b-asset-tile")).toHaveCount(1);
  const authoredRef = await page.getByLabel("이미지 자산 선택").inputValue();
  await page.evaluate(
    () =>
      new Promise<void>((resolve, reject) => {
        const request = indexedDB.open("prompt-studio-projects-v2");
        request.onerror = () => reject(request.error);
        request.onsuccess = () => {
          const db = request.result,
            tx = db.transaction("assets", "readwrite");
          tx.objectStore("assets").clear();
          tx.oncomplete = () => {
            db.close();
            window.dispatchEvent(new Event("studio-assets-changed"));
            resolve();
          };
          tx.onabort = () => reject(tx.error);
        };
      }),
  );
  await expect(
    frame(page).getByText("원본 없음 · 자산 포함 ZIP을 가져오세요"),
  ).toBeVisible();
  await page.getByLabel("자산 파일 등록").setInputFiles({
    name: "복구.png",
    mimeType: "image/png",
    buffer: pngFixture(),
  });
  await expect
    .poll(() =>
      frame(page)
        .locator(".ui-image img")
        .evaluate((el: HTMLImageElement) => el.naturalWidth),
    )
    .toBe(80);
  await expect(page.getByLabel("이미지 자산 선택")).toHaveValue(authoredRef);
});

test("audio playback or unsupported-codec fallback remains editable", async ({
  page,
}, info) => {
  await openBlank(page);
  await page.getByLabel("자산 파일 등록").setInputFiles({
    name: "목소리.wav",
    mimeType: "audio/wav",
    buffer: wavFixture(),
  });
  await expect(page.locator(".b-asset-tile")).toHaveCount(1);
  await page.getByRole("button", { name: "화면에 추가", exact: true }).click();
  await expect(frame(page).locator("audio")).toHaveCount(0);
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  const audio = frame(page).locator("audio");
  if (process.platform === "win32" && info.project.name === "desktop-webkit") {
    info.annotations.push({
      type: "platform",
      description:
        "Windows Playwright WebKit returns MEDIA_ERR_SRC_NOT_SUPPORTED for the WAV/WebM fixtures, also in an isolated native element. Verify fallback instead of claiming decoding.",
    });
    await expect(
      frame(page).getByText(
        "미디어를 재생할 수 없습니다. 파일 형식과 주소를 확인하세요.",
      ),
    ).toBeVisible();
  } else {
    await expect
      .poll(() => audio.evaluate((el: HTMLAudioElement) => el.readyState))
      .toBeGreaterThan(0);
    await audio.evaluate((el: HTMLAudioElement) => el.play());
    await expect
      .poll(() => audio.evaluate((el: HTMLAudioElement) => el.currentTime))
      .toBeGreaterThan(0);
  }
  await page
    .getByRole("button", { name: "편집으로 돌아가기", exact: true })
    .click();
  await expect(frame(page).locator("audio")).toHaveCount(0);
  await page.getByRole("tab", { name: "컴포넌트", exact: true }).click();
  await page.getByLabel("컴포넌트 검색").fill("영상 플레이어");
  await page
    .getByRole("button", { name: "영상 플레이어 추가", exact: true })
    .click();
  await page
    .getByLabel("영상 HTTPS URL", { exact: true })
    .fill("https://invalid.example/video.mp4");
  await page.route("https://invalid.example/**", (route) => route.abort());
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  await expect(
    frame(page).locator('.ui-media-video').getByText(
      "미디어를 재생할 수 없습니다. 파일 형식과 주소를 확인하세요.",
    ),
  ).toBeVisible();
});

test("local video uses a still poster in edit and native controls in preview", async ({
  page,
}, info) => {
  await openBlank(page);
  await page
    .getByLabel("자산 파일 등록")
    .setInputFiles("tests/fixtures/studio-motion.webm");
  await expect(page.locator(".b-asset-tile")).toHaveCount(1);
  await page.getByRole("button", { name: "화면에 추가", exact: true }).click();
  await page.getByLabel("대표 이미지 파일로 교체").setInputFiles({
    name: "포스터.png",
    mimeType: "image/png",
    buffer: pngFixture(),
  });
  await page.getByLabel("재생 버튼·막대 개별 편집", { exact: true }).uncheck();
  await expect(frame(page).locator(".ui-media-poster img")).toHaveAttribute(
    "src",
    /^blob:/,
  );
  await expect(frame(page).locator("video")).toHaveCount(0);
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  const video = frame(page).locator("video");
  if (process.platform === "win32" && info.project.name === "desktop-webkit") {
    info.annotations.push({
      type: "platform",
      description:
        "Windows WebKit codec fallback; actual decoding is tested in Edge/Firefox.",
    });
    await expect(
      frame(page).getByText(
        "미디어를 재생할 수 없습니다. 파일 형식과 주소를 확인하세요.",
      ),
    ).toBeVisible();
    await expect(frame(page).locator(".ui-media-poster img")).toBeVisible();
  } else {
    await expect(video).toHaveAttribute("controls", "");
    await expect
      .poll(() => video.evaluate((el: HTMLVideoElement) => el.readyState))
      .toBeGreaterThan(0);
    await video.evaluate((el: HTMLVideoElement) => el.play());
    await expect
      .poll(() => video.evaluate((el: HTMLVideoElement) => el.currentTime))
      .toBeGreaterThan(0);
  }
  await page.screenshot({
    path: info.outputPath("video-preview.png"),
    fullPage: true,
  });
});

test("invalid uploads leave the current project and library intact", async ({
  page,
}) => {
  await openBlank(page);
  await uploadImage(page);
  await page.getByLabel("자산 파일 등록").setInputFiles({
    name: "위장.png",
    mimeType: "image/png",
    buffer: Buffer.from("<script>throw new Error('bad')</script>"),
  });
  await expect(page.locator(".b-assets-panel [role=alert]")).toContainText(
    "지원하지 않는 파일",
  );
  await expect(page.locator(".b-asset-tile")).toHaveCount(1);
  await page.getByRole("button", { name: "화면에 추가", exact: true }).click();
  await expect(frame(page).locator(".ui-image img")).toHaveAttribute(
    "src",
    /^blob:/,
  );
});

test("uploaded WOFF2 renders in both font roles and survives PNG and archive export", async ({
  page,
}) => {
  await openBlank(page);
  await page
    .getByLabel("자산 파일 등록")
    .setInputFiles(
      "node_modules/next/dist/next-devtools/server/font/geist-latin.woff2",
    );
  await expect(page.locator(".b-asset-tile")).toHaveCount(1);
  await page.getByRole("tab", { name: "컴포넌트", exact: true }).click();
  await page.getByLabel("컴포넌트 검색").fill("텍스트");
  await page.getByRole("button", { name: "텍스트", exact: true }).click();
  await page.getByRole("tab", { name: "테마", exact: true }).click();
  await page
    .getByLabel("본문 사용자 서체", { exact: true })
    .selectOption({ label: "geist-latin.woff2" });
  await page
    .getByLabel("제목 사용자 서체", { exact: true })
    .selectOption({ label: "geist-latin.woff2" });
  const assetId = await page
    .getByLabel("본문 사용자 서체", { exact: true })
    .inputValue();
  await expect
    .poll(() =>
      frame(page)
        .locator(".ui-root")
        .evaluate(async (el, id) => {
          const doc = el.ownerDocument;
          await doc.fonts.load(`16px "StudioAsset_${id}"`, "Hello");
          return (
            doc.fonts.check(`16px "StudioAsset_${id}"`, "Hello") &&
            doc.defaultView!.getComputedStyle(el).fontFamily.includes(id)
          );
        }, assetId),
    )
    .toBe(true);
  await page.getByRole("button", { name: "AI에 전달", exact: true }).click();
  const pngDownload = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "현재 화면 PNG", exact: true })
    .click();
  const png = await readFile((await (await pngDownload).path())!);
  expect(png.readUInt32BE(16)).toBe(1440);
  const archiveDownload = page.waitForEvent("download");
  await page
    .getByRole("button", { name: "자산 포함 ZIP 백업", exact: true })
    .click();
  const archive = await readFile((await (await archiveDownload).path())!);
  const restored = await readProjectArchive(
    new Blob([new Uint8Array(archive).buffer]),
  );
  expect(restored.project.theme.bodyFontAsset).toBe(assetId);
  expect(restored.project.theme.headingFontAsset).toBe(assetId);
  expect(restored.assets[0].asset.kind).toBe("font");
});
