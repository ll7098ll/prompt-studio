import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { createTemplate } from "../../src/builder/templates";
import {
  createNode,
  type Project,
  blankProject,
} from "../../src/builder/model";
import { DESIGN_PACKS, applyDesignPack } from "../../src/builder/design-packs";
const frame = (page: Page) =>
  page.frameLocator('iframe[title="디자인 미리보기"]').first();
async function open(page: Page, project: Project) {
  await page.goto("/");
  await page.locator("input[type=file]").setInputFiles({
    name: "parts.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(project)),
  });
  await expect(frame(page).locator(".ui-root")).toBeVisible();
}
async function number(page: Page, name: string, value: string) {
  await page.getByLabel(name, { exact: true }).fill(value);
  await page.getByLabel(name, { exact: true }).press("Enter");
}

test("measured inner size, per-property responsive reset, layout controls, hiding and Undo preserve text", async ({
  page,
}, info) => {
  const project = blankProject(),
    node = createNode("feature");
  node.id = "part-sample";
  project.nodes[node.id] = node;
  project.nodes[project.pages[0].rootId].children.push(node.id);
  node.parts = {
    "p.0.1": {
      layout: { fontSize: 21 },
      responsive: { desktop: { fontSize: 32 } },
    },
  };
  await open(page, project);
  await frame(page)
    .locator("#part-sample h3")
    .click({ modifiers: ["Control"] });
  await expect(page.getByLabel("내부 글자 크기", { exact: true })).toHaveValue(
    "32",
  );
  await expect(
    page.getByRole("navigation", { name: "내부 선택 경로" }),
  ).toContainText("소제목");
  await page
    .getByRole("button", { name: "내부 글자 크기 초기화", exact: true })
    .click();
  await expect(frame(page).locator("#part-sample h3")).toHaveCSS(
    "font-size",
    "21px",
  );
  await expect(page.getByLabel("내부 글자 크기", { exact: true })).toHaveValue(
    "21",
  );
  await expect(
    page.getByRole("button", { name: "내부 글자 크기 초기화", exact: true }),
  ).toBeDisabled();
  await page.getByLabel("내부 서체", { exact: true }).selectOption("mono");
  await expect(frame(page).locator("#part-sample h3")).toHaveCSS(
    "font-family",
    /Consolas/,
  );
  await page.getByText("방향별 여백과 모서리", { exact: true }).click();
  await number(page, "내부 왼쪽 안쪽 여백", "23");
  await number(page, "내부 오른쪽 위 모서리", "17");
  await expect(frame(page).locator("#part-sample h3")).toHaveCSS(
    "padding-left",
    "23px",
  );
  await expect(frame(page).locator("#part-sample h3")).toHaveCSS(
    "border-top-right-radius",
    "17px",
  );
  await page.getByText("내부 배치와 표시", { exact: true }).click();
  await page.getByLabel("내부 표시 방식", { exact: true }).selectOption("none");
  await expect(frame(page).locator("#part-sample h3")).toBeHidden();
  await expect(page.locator(".parts-panel .b-notice")).toContainText(
    "숨겨진 부분",
  );
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(frame(page).locator("#part-sample h3")).toBeVisible();
  const result = await new AxeBuilder({ page })
    .include(".parts-panel")
    .analyze();
  expect(result.violations).toEqual([]);
  await page.screenshot({
    path: info.outputPath("inner-editor.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  await expect(frame(page).locator("#part-sample h3")).toHaveCSS(
    "padding-left",
    "23px",
  );
  await page
    .getByRole("button", { name: "프로젝트 목록", exact: true })
    .click();
  await page.reload();
  await page.locator(".workspace-project-main").first().click();
  await expect(frame(page).locator("#part-sample h3")).toHaveCSS(
    "border-top-right-radius",
    "17px",
  );
});

test("individual SVG geometry exposes independent appearance and resets through Undo", async ({
  page,
}) => {
  const project = blankProject(),
    node = createNode("feature");
  node.id = "vector-sample";
  project.nodes[node.id] = node;
  project.nodes[project.pages[0].rootId].children.push(node.id);
  await open(page, project);
  await frame(page).locator("#vector-sample h3").click();
  const paths = page
    .getByRole("group", { name: "컴포넌트 내부 요소" })
    .getByRole("button", { name: /벡터 경로/ });
  await paths.first().click();
  await page.getByLabel("내부 벡터 선 색", { exact: true }).fill("#c32277");
  await page.getByLabel("내부 벡터 선 색", { exact: true }).press("Tab");
  await number(page, "내부 벡터 선 두께", "4");
  await expect(
    frame(page).locator("#vector-sample svg path").first(),
  ).toHaveCSS("stroke", "rgb(195, 34, 119)");
  await expect(
    frame(page).locator("#vector-sample svg path").first(),
  ).toHaveCSS("stroke-width", "4px");
  await page
    .getByRole("button", { name: "내부 벡터 선 색 초기화", exact: true })
    .click();
  await expect(
    frame(page).locator("#vector-sample svg path").first(),
  ).not.toHaveCSS("stroke", "rgb(195, 34, 119)");
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(
    frame(page).locator("#vector-sample svg path").first(),
  ).toHaveCSS("stroke", "rgb(195, 34, 119)");
});

test("design pack preview is reversible and selective application preserves inner overrides", async ({
  page,
}, info) => {
  const project = createTemplate("landing"),
    heading = createNode("heading");
  heading.id = "pack-heading";
  heading.props.level = "h1";
  heading.props.text = "계속 유지되는 제목";
  heading.parts = {
    "p.0": { layout: { fontSize: 43, textColor: "#b12365" }, responsive: {} },
  };
  project.nodes[heading.id] = heading;
  project.nodes[project.pages[0].rootId].children.unshift(heading.id);
  await open(page, project);
  await page.getByRole("tab", { name: "테마", exact: true }).click();
  await page
    .getByRole("button", { name: "Swiss Kinetic 미리보기", exact: true })
    .click();
  const dialog = page.getByRole("dialog", {
    name: "Swiss Kinetic 적용 미리보기",
  });
  await dialog.getByRole("button", { name: "390px", exact: true }).click();
  await expect(
    dialog.frameLocator("iframe").locator("#pack-heading h1"),
  ).toHaveCSS("font-size", "43px");
  await dialog.getByLabel("서체", { exact: true }).uncheck();
  await dialog.getByLabel("표면", { exact: true }).uncheck();
  await dialog.getByLabel("모션", { exact: true }).uncheck();
  const beforeRadius = await frame(page)
    .locator(".ui-root")
    .evaluate((el) => getComputedStyle(el).getPropertyValue("--ui-radius"));
  await dialog
    .getByRole("button", { name: "선택 항목 적용", exact: true })
    .click();
  await expect(frame(page).locator("#pack-heading h1")).toHaveCSS(
    "color",
    "rgb(177, 35, 101)",
  );
  expect(
    await frame(page)
      .locator(".ui-root")
      .evaluate((el) => getComputedStyle(el).getPropertyValue("--ui-radius")),
  ).toBe(beforeRadius);
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await page
    .getByRole("button", { name: "Quiet Editorial 미리보기", exact: true })
    .click();
  const editorial = page.getByRole("dialog", {
    name: "Quiet Editorial 적용 미리보기",
  });
  await editorial.getByLabel("선택 항목의 개별 외형도 초기화").check();
  await expect(editorial.getByText(/초기화 영향:/)).toContainText("1개 요소");
  await editorial
    .getByRole("button", { name: "선택 항목 적용", exact: true })
    .click();
  await expect(frame(page).locator(".ui-root")).toHaveAttribute(
    "data-pack-texture",
    "paper",
  );
  await expect(frame(page).locator("#pack-heading h1")).not.toHaveCSS(
    "font-size",
    "43px",
  );
  await page.screenshot({
    path: info.outputPath("design-packs.png"),
    fullPage: true,
  });
});

test("eight packs render at three widths with reduced motion and no horizontal overflow", async ({
  page,
}) => {
  test.setTimeout(90000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const pack of DESIGN_PACKS) {
    const p = applyDesignPack(blankProject(), pack),
      root = p.nodes[p.pages[0].rootId];
    for (const kind of ["heading", "feature", "stat"]) {
      const node = createNode(kind);
      if (kind === "heading") {
        node.props.level = "h1";
        node.props.text = `${pack.name}\n새로운 생각의 시작`;
      }
      root.children.push(node.id);
      p.nodes[node.id] = node;
    }
    await open(page, p);
    await page.getByRole("button", { name: "미리보기", exact: true }).click();
    for (const name of ["모바일", "태블릿", "데스크톱"]) {
      await page.getByRole("button", { name, exact: true }).click();
      const metrics = await frame(page)
        .locator(".ui-root")
        .evaluate((el) => ({ scroll: el.scrollWidth, width: el.clientWidth }));
      expect(metrics.scroll, `${pack.name} ${name}`).toBeLessThanOrEqual(
        metrics.width + 1,
      );
      await expect(frame(page).locator(".ui-heading")).toHaveCSS(
        "animation-name",
        "none",
      );
    }
  }
});

test("opened dialog content is selectable and its internal edits survive closing and reopening", async ({
  page,
}) => {
  const project = blankProject(),
    node = createNode("dialog");
  node.id = "editable-dialog";
  node.appearance = { renderer: "shadcn" };
  project.nodes[node.id] = node;
  project.nodes[project.pages[0].rootId].children.push(node.id);
  await open(page, project);
  await frame(page)
    .locator("#editable-dialog button")
    .first()
    .click({ modifiers: ["Control"] });
  await page
    .getByRole("button", { name: "이 부분의 동작 실행", exact: true })
    .click();
  await expect(frame(page).getByRole("dialog")).toBeVisible();
  const title = page
    .getByRole("group", { name: "컴포넌트 내부 요소" })
    .getByRole("button", { name: /제목 ·/ })
    .first();
  await title.click();
  await number(page, "내부 글자 크기", "29");
  await expect(frame(page).locator("[data-slot=dialog-title]")).toHaveCSS(
    "font-size",
    "29px",
  );
  await page
    .getByLabel("내부 문구", { exact: true })
    .fill("내가 편집한 대화상자");
  await page.getByLabel("내부 문구", { exact: true }).press("Tab");
  await expect(frame(page).getByRole("dialog")).toContainText(
    "내가 편집한 대화상자",
  );
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  const dialog = frame(page).getByRole("dialog");
  if (await dialog.isVisible())
    await frame(page).locator("[data-slot=dialog-close]").last().click();
  await frame(page)
    .locator("#editable-dialog [data-slot=dialog-trigger]")
    .click();
  await expect(frame(page).locator("[data-slot=dialog-title]")).toHaveCSS(
    "font-size",
    "29px",
  );
  await expect(dialog).toContainText("내가 편집한 대화상자");
});

test("inner image replacement is one Undo and its original bytes survive reload", async ({
  page,
}) => {
  const { pngFixture } = await import("../asset-fixtures");
  const p = blankProject(),
    node = createNode("image");
  node.id = "inner-photo";
  p.nodes[node.id] = node;
  p.nodes[p.pages[0].rootId].children.push(node.id);
  await open(page, p);
  await frame(page).locator("#inner-photo").click();
  await page.getByLabel("이미지 파일로 교체", { exact: true }).setInputFiles({
    name: "original.png",
    mimeType: "image/png",
    buffer: pngFixture(),
  });
  const img = frame(page).locator("#inner-photo img");
  await expect(img).toHaveAttribute("src", /^blob:/);
  const bytes = () =>
    img.evaluate(async (el) => {
      try {
        return [
          ...new Uint8Array(
            await (await fetch((el as HTMLImageElement).src)).arrayBuffer(),
          ),
        ];
      } catch {
        return null;
      } // Asset sessions intentionally replace and revoke temporary URLs.
    });
  const original = [...pngFixture()];
  await expect.poll(bytes).toEqual(original);
  await img.click({ modifiers: ["Control"] });
  await page
    .getByLabel("내부 이미지 파일로 교체", { exact: true })
    .setInputFiles({
      name: "replaced.png",
      mimeType: "image/png",
      buffer: pngFixture(200, 40, 80),
    });
  const replacement = [...pngFixture(200, 40, 80)];
  await expect.poll(bytes).toEqual(replacement);
  await img.click({ modifiers: ["Control"] });
  await page
    .getByLabel("내부 이미지 자산 선택", { exact: true })
    .selectOption("");
  await page
    .getByLabel("내부 이미지 HTTPS URL", { exact: true })
    .pressSequentially("https:");
  await page.getByLabel("내부 이미지 HTTPS URL", { exact: true }).press("Tab");
  await expect(
    page.getByLabel("내부 이미지 HTTPS URL", { exact: true }),
  ).toHaveAttribute("aria-invalid", "true");
  await expect.poll(bytes).toEqual(replacement);
  await page
    .getByRole("button", { name: "파일 선택 유지", exact: true })
    .click();
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect.poll(bytes).toEqual(original);
  await page.getByRole("button", { name: "다시 실행", exact: true }).click();
  await page
    .getByLabel("내부 대체 설명", { exact: true })
    .fill("교체한 붉은 작품");
  await page.getByLabel("내부 대체 설명", { exact: true }).press("Tab");
  await expect(img).toHaveAttribute("alt", "교체한 붉은 작품");
  await page
    .getByRole("button", { name: "프로젝트 목록", exact: true })
    .click();
  await page.reload();
  await page.locator(".workspace-project-main").first().click();
  await expect(img).toHaveAttribute("alt", "교체한 붉은 작품");
  await expect.poll(bytes).toEqual(replacement);
});
