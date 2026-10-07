import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { blankProject, createNode } from "../../src/builder/model";
import {
  attachBuiltinAssets,
  builtinSource,
} from "../../src/builder/builtin-assets";

const frame = (page: Page) =>
  page.frameLocator('iframe[title="디자인 미리보기"]').first();
function sample(type = "video-player") {
  const project = blankProject(),
    node = createNode(type);
  node.id = "media-test";
  node.props.src = builtinSource(type === "video-player" ? "orbit" : "notes");
  node.props.start = 1;
  node.props.end = 5;
  node.props.poster = builtinSource("speaker");
  if (type === "video-player") node.props.captions = builtinSource("captions");
  project.nodes[node.id] = node;
  project.nodes[project.pages[0].rootId].children.push(node.id);
  attachBuiltinAssets(project, node);
  return project;
}
async function open(page: Page, project = sample()) {
  await page.goto("/");
  await page.locator("input[type=file]").setInputFiles({
    name: "controls.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(project)),
  });
  await expect(
    frame(page).locator("#media-test .ui-media-controls"),
  ).toBeVisible();
}
async function numeric(page: Page, name: string, value: string) {
  await page.getByLabel(name, { exact: true }).fill(value);
  await page.getByLabel(name, { exact: true }).press("Enter");
}
test("playback subparts retain separate styles through undo, preview and reopening", async ({
  page,
}, info) => {
  await open(page);
  const parts = frame(page).locator("#media-test");
  const play = parts.locator('[data-part-id="media-play"]');
  await play.click({ modifiers: ["Control"], position: { x: 4, y: 20 } });
  await numeric(page, "내부 너비", "58");
  await page.getByLabel("내부 배경", { exact: true }).fill("#236b45");
  await expect(play).toHaveCSS("width", "58px");
  await expect(play).toHaveCSS("background-color", "rgb(35, 107, 69)");
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(play).not.toHaveCSS("background-color", "rgb(35, 107, 69)");
  await page.getByRole("button", { name: "다시 실행", exact: true }).click();
  const track = parts.locator('[data-part-id="media-seek-track"]');
  await track.click({ modifiers: ["Control"] });
  await numeric(page, "내부 높이", "10");
  await expect(track).toHaveCSS("height", "10px");
  await parts
    .locator('[data-part-id="media-current"]')
    .click({ modifiers: ["Control"] });
  await expect(page.getByLabel("내부 문구", { exact: true })).toHaveCount(0);
  await numeric(page, "내부 글자 크기", "15");
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  await expect(play).toHaveCSS("width", "58px");
  await expect(track).toHaveCSS("height", "10px");
  await expect(parts.locator('[data-part-id="media-current"]')).toHaveCSS(
    "font-size",
    "15px",
  );
  await page
    .getByRole("button", { name: "편집으로 돌아가기", exact: true })
    .click();
  await expect(page.locator(".b-save-state")).toHaveText("브라우저에 저장됨");
  await page
    .getByRole("button", { name: "프로젝트 목록", exact: true })
    .click();
  await page.reload();
  await page.locator(".workspace-project-main").first().click();
  await expect(play).toHaveCSS("background-color", "rgb(35, 107, 69)");
  await expect(track).toHaveCSS("height", "10px");
  await page.screenshot({
    path: info.outputPath("editable-media-parts.png"),
    fullPage: true,
  });
});

for (const type of ["video-player", "audio-player"])
  test(`${type} controls play, seek within the clip, change volume and pause offscreen`, async ({
    page,
  }, info) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    const project = sample(type);
    if (type === "video-player")
      project.nodes["media-test"].props.autoplay = true;
    await open(page, project);
    await page.getByRole("button", { name: "미리보기", exact: true }).click();
    const root = frame(page).locator("#media-test"),
      media = root.locator(type === "video-player" ? "video" : "audio");
    if (
      process.platform === "win32" &&
      info.project.name === "desktop-webkit"
    ) {
      info.annotations.push({
        type: "platform",
        description:
          "Windows WebKit lacks fixture codec support; verify disabled controls and editable fallback.",
      });
      await expect(
        root.getByText(
          "미디어를 재생할 수 없습니다. 파일 형식과 주소를 확인하세요.",
        ),
      ).toBeVisible();
      await expect(
        root.getByRole("button", { name: "재생", exact: true }),
      ).toBeDisabled();
      await expect(
        root.locator('[data-part-id="media-seek-track"]'),
      ).toBeVisible();
      return;
    }
    await expect(
      root.getByRole("button", { name: "재생", exact: true }),
    ).toBeEnabled();
    await expect
      .poll(() => media.evaluate((el: HTMLMediaElement) => el.paused))
      .toBe(true);
    await expect(media).not.toHaveAttribute("controls", "");
    await root.getByRole("button", { name: "재생", exact: true }).click();
    await expect
      .poll(() => media.evaluate((el: HTMLMediaElement) => el.currentTime))
      .toBeGreaterThan(1.1);
    await root.getByRole("button", { name: "일시 정지", exact: true }).click();
    const slider = root.getByRole("slider", { name: "재생 위치", exact: true });
    await slider.focus();
    await slider.press("Home");
    await expect
      .poll(() => media.evaluate((el: HTMLMediaElement) => el.currentTime))
      .toBeCloseTo(1, 1);
    await slider.press("End");
    await expect
      .poll(() => media.evaluate((el: HTMLMediaElement) => el.currentTime))
      .toBeCloseTo(5, 1);
    await root.getByRole("button", { name: "재생", exact: true }).click();
    await expect
      .poll(() => media.evaluate((el: HTMLMediaElement) => el.currentTime))
      .toBeLessThan(3);
    await root.getByRole("button", { name: "일시 정지", exact: true }).click();
    const volume = root.getByRole("slider", { name: "음량", exact: true });
    await volume.focus();
    await volume.press("End");
    await volume.press("Home");
    await expect
      .poll(() => media.evaluate((el: HTMLMediaElement) => el.volume))
      .toBe(0);
    await root.getByRole("button", { name: "소리 켜기", exact: true }).click();
    await expect
      .poll(() => media.evaluate((el: HTMLMediaElement) => el.volume))
      .toBe(1);
    await root
      .getByRole("button", { name: "재생 속도 1배 · 누르면 변경", exact: true })
      .click();
    await expect
      .poll(() => media.evaluate((el: HTMLMediaElement) => el.playbackRate))
      .toBe(1.25);
    if (type === "video-player") {
      const captions = root.getByRole("button", { name: "자막", exact: true });
      await expect
        .poll(() =>
          media.evaluate((el: HTMLVideoElement) => el.textTracks.length),
        )
        .toBe(1);
      await captions.click();
      await expect
        .poll(() =>
          media.evaluate((el: HTMLVideoElement) => el.textTracks[0].mode),
        )
        .toBe("hidden");
      await captions.click();
      await expect
        .poll(() =>
          media.evaluate((el: HTMLVideoElement) => el.textTracks[0].mode),
        )
        .toBe("showing");
      const fullscreen = root.getByRole("button", {
        name: "전체 화면",
        exact: true,
      });
      if (await fullscreen.isEnabled()) {
        await fullscreen.click();
        await expect
          .poll(() =>
            root.evaluate(
              (el) =>
                el.ownerDocument.fullscreenElement?.classList.contains(
                  "ui-media",
                ) ?? false,
            ),
          )
          .toBe(true);
        await root
          .getByRole("button", { name: "전체 화면 닫기", exact: true })
          .click();
        await expect
          .poll(() =>
            root.evaluate((el) => el.ownerDocument.fullscreenElement === null),
          )
          .toBe(true);
      }
    }
    await root.getByRole("button", { name: "재생", exact: true }).click();
    await root.evaluate((el) => {
      el.style.visibility = "hidden";
      el.style.transform = "translateY(10000px)";
    });
    await expect
      .poll(() => media.evaluate((el: HTMLMediaElement) => el.paused))
      .toBe(true);
    await root.evaluate((el) => {
      el.style.visibility = "";
      el.style.transform = "";
    });
    await page
      .getByRole("button", { name: "편집으로 돌아가기", exact: true })
      .click();
    await expect(media).toHaveCount(0);
  });

test("editable controls fit narrow layouts, pass keyboard accessibility and retain legacy native mode", async ({
  page,
}, info) => {
  await open(page);
  for (const width of [320, 390, 768]) {
    await page.getByLabel("미리보기 너비", { exact: true }).fill(String(width));
    await page.getByLabel("미리보기 너비", { exact: true }).press("Enter");
    await expect
      .poll(() =>
        frame(page)
          .locator(".ui-media-controls")
          .evaluate((el) => el.scrollWidth - el.clientWidth),
      )
      .toBeLessThanOrEqual(1);
    if (width === 320)
      await page.screenshot({
        path: info.outputPath("media-controls-320.png"),
      });
  }
  const axe = await new AxeBuilder({ page })
    .include('iframe[title="디자인 미리보기"]')
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
  await page.screenshot({ path: info.outputPath("media-controls-narrow.png") });
  await frame(page).locator("#media-test strong").click();
  await page.getByLabel("재생 버튼·막대 개별 편집", { exact: true }).uncheck();
  await expect(frame(page).locator(".ui-media-controls")).toHaveCount(0);
  await page
    .getByRole("button", { name: "재생 컨트롤 편집 켜기", exact: true })
    .click();
  await expect(frame(page).locator(".ui-media-controls")).toBeVisible();
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(frame(page).locator(".ui-media-controls")).toHaveCount(0);
  await page.getByRole("button", { name: "다시 실행", exact: true }).click();
  await expect(frame(page).locator(".ui-media-controls")).toBeVisible();
});
