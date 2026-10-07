import { expect, test, type Page } from "@playwright/test";
import { blankProject, createNode } from "../../src/builder/model";
import { componentExample } from "../../src/builder/library";
import { THEME_PRESETS } from "../../src/builder/theme";
import { CATALOG } from "../../src/builder/catalog";
import { populateRecipe } from "../../src/builder/component-recipes";

function fixture() {
  const project = blankProject();
  project.name = "자유 편집 검사";
  const root = project.nodes[project.pages[0].rootId];
  const frame = createNode("frame", "free-frame");
  frame.layout.height = 650;
  root.children.push(frame.id);
  project.nodes[frame.id] = frame;
  for (let i = 0; i < 3; i++) {
    const node = createNode("text", `sample-${i}`);
    node.props.text = `편집할 내용 ${i + 1}`;
    Object.assign(node.layout, {
      x: 80 + i * 240,
      y: 80 + i * 60,
      width: 180,
      height: 80,
      widthMode: "fixed",
      heightMode: "fixed",
      fillColor: "theme:soft",
      cornerRadius: 12,
    });
    frame.children.push(node.id);
    project.nodes[node.id] = node;
  }
  return project;
}
async function open(page: Page) {
  await page.goto("/");
  await page.locator('input[type="file"]').setInputFiles({
    name: "free.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(fixture())),
  });
  await expect(
    page.frameLocator('iframe[title="디자인 미리보기"]').locator("#sample-0"),
  ).toBeVisible();
}
async function drag(page: Page, selector: string, dx: number, dy: number) {
  const element = page
    .frameLocator('iframe[title="디자인 미리보기"]')
    .locator(selector);
  const box = await element.boundingBox();
  const x = box!.x + box!.width / 2,
    y = box!.y + box!.height / 2;
  await page.mouse.move(x, y);
  await page.mouse.down();
  await page.keyboard.down("Alt");
  await page.mouse.move(x + dx, y + dy, { steps: 8 });
  await page.mouse.up();
  await page.keyboard.up("Alt");
}

test("direct drag, resize, cancellation, keyboard, undo and reload preserve free layout", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await open(page);
  await page.getByLabel("캔버스 배율").selectOption("0.5");
  const frame = page.frameLocator('iframe[title="디자인 미리보기"]');
  await frame.locator("#sample-0").click();
  await drag(page, "#sample-0", 40, 20);
  await expect(page.getByLabel("X 위치", { exact: true })).toHaveValue("160");
  await expect(page.getByLabel("Y 위치", { exact: true })).toHaveValue("120");
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(page.getByLabel("X 위치", { exact: true })).toHaveValue("80");
  await page.getByRole("button", { name: "다시 실행", exact: true }).click();
  await drag(page, '[data-handle="se"]', 20, 10);
  await expect(page.getByLabel("W 너비", { exact: true })).toHaveValue("220");
  await expect(page.getByLabel("H 높이", { exact: true })).toHaveValue("100");
  const box = await frame.locator("#sample-0").boundingBox();
  await page.mouse.move(box!.x + 20, box!.y + 20);
  await page.mouse.down();
  await page.mouse.move(box!.x + 70, box!.y + 50);
  await page.keyboard.press("Escape");
  await page.mouse.up();
  await frame.locator("#sample-0").click();
  await expect(page.getByLabel("X 위치", { exact: true })).toHaveValue("160");
  await page.keyboard.press("Shift+ArrowRight");
  await expect(page.getByLabel("X 위치", { exact: true })).toHaveValue("170");
  await page
    .getByRole("button", { name: "프로젝트 목록", exact: true })
    .click();
  await page.reload();
  await page
    .locator(".workspace-project-main")
    .filter({ hasText: "자유 편집 검사" })
    .click();
  await frame.locator("#sample-0").click();
  await expect(page.getByLabel("X 위치", { exact: true })).toHaveValue("170");
  await expect(page.getByLabel("W 너비", { exact: true })).toHaveValue("220");
  expect(errors).toEqual([]);
  await page.screenshot({
    path: `artifacts/design-editor-${test.info().project.name}.png`,
  });
});

test("multiple selection, alignment, grouping, style editing and inline Korean text", async ({
  page,
}) => {
  await open(page);
  const frame = page.frameLocator('iframe[title="디자인 미리보기"]');
  await frame.locator("#sample-0").click();
  await frame.locator("#sample-1").click({ modifiers: ["Shift"] });
  await frame.locator("#sample-2").click({ modifiers: ["Shift"] });
  await expect(page.getByText("3개 함께 편집")).toBeVisible();
  await page.getByRole("button", { name: "위쪽", exact: true }).click();
  await expect(page.getByLabel("Y 위치", { exact: true })).toHaveValue("80");
  await page.getByRole("button", { name: "그룹 만들기", exact: true }).click();
  await expect(frame.locator('[data-component="group"]')).toBeVisible();
  await page.getByRole("button", { name: "그룹 해제", exact: true }).click();
  await expect(frame.locator('[data-component="group"]')).toHaveCount(0);
  await frame.locator("#sample-0").dblclick();
  await frame.getByLabel("캔버스 텍스트 편집").fill("자유롭게 편집하는 한글");
  await frame.getByLabel("캔버스 텍스트 편집").press("Control+Enter");
  await expect(frame.locator("#sample-0")).toHaveText("자유롭게 편집하는 한글");
  await page.getByLabel("글자 크기", { exact: true }).fill("24");
  await page.getByLabel("글자 크기", { exact: true }).press("Enter");
  await expect(frame.locator("#sample-0 > p")).toHaveCSS("font-size", "24px");
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(frame.locator("#sample-0 > p")).toHaveCSS("font-size", "14px");
});

test("flow conversion preview can cancel or commit without changing mobile", async ({
  page,
}) => {
  await open(page);
  await page.getByRole("tab", { name: "레이어", exact: true }).click();
  await page
    .getByRole("button", { name: "자유 배치 영역", exact: true })
    .click();
  await page.getByLabel("영역 배치 방식").selectOption("flow");
  await expect(
    page.getByText("자동 배치 미리보기 · 레이어 순서대로 정렬됩니다."),
  ).toBeVisible();
  await page.getByRole("button", { name: "취소", exact: true }).click();
  await expect(page.getByLabel("영역 배치 방식")).toHaveValue("free");
  await page.getByLabel("영역 배치 방식").selectOption("flow");
  await page.getByRole("button", { name: "이 배치 적용", exact: true }).click();
  await expect(page.getByLabel("영역 배치 방식")).toHaveValue("flow");
  await page.getByRole("button", { name: "모바일", exact: true }).click();
  await expect(page.getByLabel("영역 배치 방식")).toHaveValue("free");
});

test("every component exposes inner parts and preserves a table cell edit in preview and storage", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const project = componentExample("table", THEME_PRESETS[0]);
  await page.goto("/");
  await page.locator('input[type="file"]').setInputFiles({
    name: "table.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(project)),
  });
  const frame = page.frameLocator('iframe[title="디자인 미리보기"]');
  await frame.getByText("브랜드 웹사이트", { exact: true }).click();
  await expect(
    page.getByText("컴포넌트 내부 편집", { exact: false }).first(),
  ).toBeVisible();
  await page
    .getByRole("group", { name: "컴포넌트 내부 요소" })
    .getByRole("button", { name: /표 셀 · 브랜드 웹사이트/ })
    .click();
  await page.getByLabel("내부 문구", { exact: true }).fill("수정한 프로젝트명");
  await page.getByLabel("내부 문구", { exact: true }).press("Tab");
  await expect(
    frame.getByText("수정한 프로젝트명", { exact: true }),
  ).toBeVisible();
  await page.getByLabel("내부 글자 크기", { exact: true }).fill("20");
  await page.getByLabel("내부 글자 크기", { exact: true }).press("Enter");
  await expect(frame.getByText("수정한 프로젝트명", { exact: true })).toHaveCSS(
    "font-size",
    "20px",
  );
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  await frame.locator("th button").first().click();
  await frame.locator("th button").first().click();
  await expect(frame.getByText("수정한 프로젝트명", { exact: true })).toHaveCSS(
    "font-size",
    "20px",
  );
  await expect(
    frame.getByText("수정한 프로젝트명", { exact: true }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "프로젝트 목록", exact: true })
    .click();
  await page.reload();
  await page.locator(".workspace-project-main").first().click();
  await expect(frame.getByText("수정한 프로젝트명", { exact: true })).toHaveCSS(
    "font-size",
    "20px",
  );
  expect(errors).toEqual([]);
});

test("inner elements can be selected directly, moved, resized and undone", async ({
  page,
}) => {
  await open(page);
  const frame = page.frameLocator('iframe[title="디자인 미리보기"]');
  await frame.locator("#sample-0 p").click({ modifiers: ["Control"] });
  await expect(page.getByLabel("내부 문구", { exact: true })).toHaveValue(
    "편집할 내용 1",
  );
  await drag(page, "#sample-0 p", 20, 10);
  await expect(
    page.getByLabel("내부 가로 이동", { exact: true }),
  ).not.toHaveValue("0");
  await drag(page, '[data-part-handle="se"]', 30, 20);
  const width = Number(
    await page.getByLabel("내부 너비", { exact: true }).inputValue(),
  );
  expect(width).toBeGreaterThan(180);
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(frame.locator("#sample-0 p")).not.toHaveCSS(
    "width",
    `${width}px`,
  );
});

test("all new composed blocks fit mobile and desktop with independently editable children", async ({
  page,
}) => {
  const project = blankProject(),
    root = project.nodes[project.pages[0].rootId];
  const recipes = CATALOG.filter((d) => d.recipe);
  for (const definition of recipes) {
    const node = createNode(definition.id);
    root.children.push(node.id);
    project.nodes[node.id] = node;
    populateRecipe(project, node);
  }
  await page.goto("/");
  await page
    .locator('input[type="file"]')
    .setInputFiles({
      name: "recipes.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(project)),
    });
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  const frame = page.frameLocator('iframe[title="디자인 미리보기"]');
  for (const definition of recipes)
    await expect(
      frame.locator(`[data-component="${definition.id}"] > .ui-node`).first(),
    ).toBeAttached();
  for (const width of [390, 1440]) {
    await page.getByLabel("미리보기 너비").fill(String(width));
    await page.getByLabel("미리보기 너비").press("Tab");
    await expect
      .poll(() =>
        frame
          .locator("body")
          .evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
  }
});

test("new composed blocks insert editable children and new controls actually work", async ({
  page,
}) => {
  await open(page);
  await page.getByRole("button", { name: "페이지 설정", exact: true }).click();
  await page.getByLabel("컴포넌트 검색").fill("로그인 카드");
  await page
    .getByRole("button", { name: "로그인 카드 추가", exact: true })
    .click();
  const frame = page.frameLocator('iframe[title="디자인 미리보기"]');
  const login = frame.locator('[data-component="login-form"]');
  await expect(login.locator(".ui-node")).toHaveCount(7);
  await login.getByRole("heading", { name: "다시 만나 반가워요" }).click();
  await page
    .getByLabel("텍스트", { exact: true })
    .fill("우리 서비스에 오신 걸 환영해요");
  await expect(
    login.getByRole("heading", { name: "우리 서비스에 오신 걸 환영해요" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "페이지 설정", exact: true }).click();
  await page.getByLabel("컴포넌트 검색").fill("수량 조절");
  await page
    .getByRole("button", { name: "수량 조절 추가", exact: true })
    .click();
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  await frame.getByRole("button", { name: "수량 늘리기" }).click();
  await expect(frame.locator('[data-component="quantity"] output')).toHaveText(
    "2",
  );
});
