import { test, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { createTemplate, TEMPLATES } from "../../src/builder/templates";
import { CATALOG } from "../../src/builder/catalog";
import { createNode, parseProject } from "../../src/builder/model";

test("an offscreen element in a large page remains selectable and editable", async ({
  page,
}) => {
  const project = createTemplate("blank"),
    root = project.nodes[project.pages[0].rootId];
  for (let i = 0; i < 199; i++) {
    const node = createNode("text");
    node.props.text = `긴 페이지 내용 ${i}`;
    project.nodes[node.id] = node;
    root.children.push(node.id);
  }
  const table = createNode("table");
  table.props.rows = Array.from(
    { length: 50 },
    (_, i) => `작업 ${i}|진행 중|담당 ${i}|오늘`,
  ).join("\n");
  project.nodes[table.id] = table;
  root.children.splice(1, 0, table.id);
  await page.goto("/");
  await page.locator('input[type="file"]').setInputFiles({
    name: "large.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(project)),
  });
  const frame = page.frameLocator('iframe[title="디자인 미리보기"]');
  const last = frame.getByText("긴 페이지 내용 198", { exact: true });
  await last.scrollIntoViewIfNeeded();
  await last.click();
  await expect(page.getByLabel("텍스트", { exact: true })).toHaveValue(
    "긴 페이지 내용 198",
  );
  await page
    .getByLabel("텍스트", { exact: true })
    .fill("마지막 요소도 편집됩니다");
  await expect(
    frame.getByText("마지막 요소도 편집됩니다", { exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(
    frame.getByText("긴 페이지 내용 198", { exact: true }),
  ).toBeVisible();
});

test("preset gallery filters, previews both widths and opens an editable copy", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator(".workspace-template")).toHaveCount(
    TEMPLATES.length,
  );
  await page
    .getByRole("button", { name: "스토어·콘텐츠", exact: true })
    .click();
  await expect(page.locator(".workspace-template")).toHaveCount(TEMPLATES.filter(template => template.category === '스토어·콘텐츠').length);
  await page
    .getByRole("button", { name: "에디토리얼 포트폴리오 크게 보기" })
    .click();
  const modal = page.getByRole("dialog");
  const frame = modal.frameLocator('iframe[title="디자인 미리보기"]');
  await expect(
    frame.getByRole("heading", { name: /오래 바라보는 것들/ }),
  ).toBeVisible();
  await modal.getByRole("button", { name: "모바일", exact: true }).click();
  await expect
    .poll(() => frame.locator("body").evaluate(() => innerWidth))
    .toBe(390);
  await modal.getByRole("button", { name: "이 프리셋으로 시작" }).click();
  const editorFrame = page.frameLocator('iframe[title="디자인 미리보기"]');
  await editorFrame
    .getByRole("heading", { name: /오래 바라보는 것들/ })
    .click();
  await page
    .getByLabel("제목", { exact: true })
    .fill("내 작업의 새로운 이야기");
  await expect(
    editorFrame.getByRole("heading", { name: "내 작업의 새로운 이야기" }),
  ).toBeVisible();
  await page
    .getByRole("button", { name: "프로젝트 목록", exact: true })
    .click();
  await expect(page.locator(".workspace-project-main")).toHaveCount(1);
});

test("every catalog tile has a visual example and large preview inserts its real component", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator(".workspace-template")
    .filter({ hasText: "빈 페이지" })
    .click();
  await expect(page.locator(".b-live-thumbnail")).toHaveCount(24);
  while (await page.getByRole("button", { name: /더 보기 ·/ }).count()) {
    const previous = await page.locator(".b-live-thumbnail").count();
    await page.getByRole("button", { name: /더 보기 ·/ }).click();
    await expect(page.locator(".b-live-thumbnail")).toHaveCount(
      Math.min(CATALOG.length - 1, previous + 24),
    );
  }
  await expect(page.locator(".b-live-thumbnail")).toHaveCount(
    CATALOG.length - 1,
  );
  await page.getByLabel("컴포넌트 검색").fill("팝업 창");
  await page.getByRole("button", { name: "팝업 창 미리보기" }).click();
  const modal = page.getByRole("dialog");
  const demo = modal.frameLocator('iframe[title="디자인 미리보기"]');
  const open = demo.getByRole("button", { name: "자세히 보기", exact: true });
  await open.click();
  await expect(demo.getByRole("dialog")).toBeVisible();
  await demo.getByRole("button", { name: "확인했어요" }).press("Escape");
  await expect(demo.getByRole("dialog")).not.toBeVisible();
  await expect(open).toBeFocused();
  await modal.getByRole("button", { name: "이 요소 추가" }).click();
  await expect(
    page
      .frameLocator('iframe[title="디자인 미리보기"]')
      .locator('[data-component="dialog"]'),
  ).toHaveCount(1);
});

test("extended controls work independently and all components render without page overflow", async ({
  page,
}) => {
  test.setTimeout(90_000);
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  const project = createTemplate("blank");
  const root = project.nodes[project.pages[0].rootId];
  root.layout.padding = 24;
  for (const definition of CATALOG.filter((d) => !d.container)) {
    const node = createNode(definition.id);
    project.nodes[node.id] = node;
    root.children.push(node.id);
  }
  parseProject(project);
  await page.goto("/");
  await page.locator('input[type="file"]').setInputFiles({
    name: "all-components.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(project)),
  });
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  const frame = page.frameLocator('iframe[title="디자인 미리보기"]');
  await expect(frame.locator("[data-component]")).toHaveCount(
    root.children.length + 1,
  );
  for (const width of [320, 390, 768, 1440]) {
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
  const search = frame.locator('[data-component="search"]');
  await search.getByRole("searchbox").fill("모바일");
  await expect(search.getByRole("listitem")).toHaveCount(1);
  await search.getByRole("searchbox").fill("없는 검색어");
  await expect(search.getByRole("status")).toContainText(
    "검색 결과가 없습니다",
  );
  const radio = frame.locator('[data-component="radio"]');
  await radio.getByRole("radio", { name: "개발" }).check();
  await expect(radio.getByRole("radio", { name: "디자인" })).not.toBeChecked();
  const range = frame.locator('[data-component="range"]').getByRole("slider");
  await range.focus();
  await range.press("ArrowRight");
  await expect(range).toHaveValue("61");
  const menu = frame.locator('[data-component="dropdown"]');
  await menu.locator("summary").click();
  await menu.getByRole("button", { name: "복사하기" }).click();
  await expect(menu.getByRole("status")).toHaveText("선택: 복사하기");
  await expect(menu.locator("summary")).toBeFocused();
  const tooltip = frame.locator('[data-component="tooltip"]');
  await tooltip.getByRole("button").focus();
  await expect(tooltip.getByRole("tooltip")).toBeVisible();
  await tooltip.getByRole("button").press("Escape");
  await expect(tooltip.getByRole("tooltip")).not.toBeVisible();
  const calendar = frame.locator('[data-component="calendar"]');
  await calendar.getByRole("button", { name: "다음 달" }).click();
  await calendar
    .getByRole("button", { name: "2026년 11월 12일", exact: true })
    .click();
  await expect(calendar.getByRole("status")).toContainText("2026-11-12");
  const form = frame.locator('[data-component="contact"]');
  await form.getByRole("button", { name: "문의 보내기" }).click();
  await expect(form.getByRole("status")).not.toContainText("완료됐습니다");
  await form.getByLabel("이름", { exact: true }).fill("테스트");
  await form.getByLabel("이메일", { exact: true }).fill("test@example.com");
  await form.getByLabel("문의 내용").fill("새로운 사이트를 만들고 싶어요.");
  await form.getByRole("button", { name: "문의 보내기" }).click();
  await expect(form.getByRole("status")).toContainText(
    "실제 전송되지는 않습니다",
  );
  const chat = frame.locator('[data-component="chat"]');
  await chat.getByLabel("보낼 메시지").fill("안녕하세요");
  await chat.getByRole("button", { name: "보내기" }).click();
  await expect(chat.getByRole("log")).toContainText("샘플 응답입니다");
  await expect(chat.getByLabel("보낼 메시지")).toHaveValue("");
  const rating = frame.locator('[data-component="rating"]');
  await rating.getByRole("radio", { name: "2점", exact: true }).check();
  await expect(rating.locator("output")).toHaveText("2/5");
  const segmented = frame.locator('[data-component="segmented"]');
  await segmented.getByRole("button", { name: "완료", exact: true }).click();
  await expect(
    segmented.getByRole("button", { name: "완료", exact: true }),
  ).toHaveAttribute("aria-pressed", "true");
  const tags = frame.locator('[data-component="tag-input"]');
  await tags.getByRole("textbox").fill("협업");
  await tags.getByRole("textbox").press("Enter");
  await expect(tags.getByRole("button", { name: "협업 삭제" })).toBeVisible();
  await tags.getByRole("button", { name: "협업 삭제" }).click();
  await expect(tags.getByRole("button", { name: "협업 삭제" })).toHaveCount(0);
  const file = frame.locator('[data-component="file-upload"]');
  await file.locator('input[type="file"]').setInputFiles({
    name: "sample.txt",
    mimeType: "text/plain",
    buffer: Buffer.from("preview"),
  });
  await expect(file.getByRole("listitem")).toHaveText("sample.txt");
  expect(errors).toEqual([]);
});

test("custom viewport follows breakpoint boundaries independently of zoom and PNG has exact width", async ({
  page,
}) => {
  test.setTimeout(60_000);
  await page.goto("/");
  await page
    .locator(".workspace-template")
    .filter({ hasText: "브랜드 랜딩" })
    .click();
  const frame = page.frameLocator('iframe[title="디자인 미리보기"]');
  for (const [width, columns] of [
    [767, 1],
    [768, 2],
    [1023, 2],
    [1024, 3],
  ]) {
    await page.getByLabel("미리보기 너비").fill(String(width));
    await page.getByLabel("미리보기 너비").press("Tab");
    await expect
      .poll(() =>
        frame
          .locator(".ui-grid")
          .evaluate(
            (grid) =>
              getComputedStyle(grid).gridTemplateColumns.split(" ").length,
          ),
      )
      .toBe(columns);
  }
  await page.getByLabel("캔버스 배율").selectOption("0.5");
  await expect
    .poll(() => frame.locator("body").evaluate(() => innerWidth))
    .toBe(1024);
  await page.getByRole("button", { name: "AI에 전달" }).click();
  const download = page.waitForEvent("download");
  await page.getByRole("button", { name: "현재 화면 PNG" }).click();
  const png = await readFile((await (await download).path())!);
  expect(png.readUInt32BE(16)).toBe(1024);
});

test("fixed and fill widths, wrapping and grid spans produce the specified geometry", async ({
  page,
}) => {
  const project = createTemplate("blank");
  const root = project.nodes[project.pages[0].rootId];
  const row = createNode("stack");
  row.layout = {
    ...row.layout,
    direction: "row",
    widthMode: "fixed",
    width: 600,
    gap: 10,
    wrap: true,
  };
  const fixed = createNode("card");
  fixed.layout = {
    ...fixed.layout,
    widthMode: "fixed",
    width: 200,
    minHeight: 100,
  };
  const fill = createNode("card");
  fill.layout = { ...fill.layout, widthMode: "fill", minHeight: 100 };
  row.children = [fixed.id, fill.id];
  const grid = createNode("grid");
  grid.layout.gap = 10;
  const wide = createNode("card");
  wide.layout.span = 2;
  const narrow = createNode("card");
  grid.children = [wide.id, narrow.id];
  root.children = [row.id, grid.id];
  for (const n of [row, fixed, fill, grid, wide, narrow])
    project.nodes[n.id] = n;
  await page.goto("/");
  await page.locator('input[type="file"]').setInputFiles({
    name: "layout.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(project)),
  });
  const frame = page.frameLocator('iframe[title="디자인 미리보기"]');
  const width = (id: string) =>
    frame
      .locator(`[id="${id}"]`)
      .evaluate((n) => n.getBoundingClientRect().width);
  await expect.poll(() => width(fixed.id)).toBe(200);
  await expect.poll(() => width(fill.id)).toBe(390);
  const a = await width(wide.id),
    b = await width(narrow.id);
  expect(Math.abs(a - (2 * b + 10))).toBeLessThan(1);
  await page.getByRole("button", { name: "모바일", exact: true }).click();
  await expect.poll(() => width(wide.id)).toBe(390);
  await expect.poll(() => width(narrow.id)).toBe(390);
  const rowStyle = await frame
    .locator(`[id="${row.id}"]`)
    .evaluate((n) => getComputedStyle(n).flexWrap);
  expect(rowStyle).toBe("wrap");
  await expect
    .poll(() =>
      frame
        .locator("body")
        .evaluate(() => document.documentElement.scrollWidth <= innerWidth),
    )
    .toBe(true);
});
