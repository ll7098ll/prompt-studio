import { test, expect, type Page } from "@playwright/test";
import {
  blankProject,
  createNode,
  parseProject,
  type Project,
} from "../../src/builder/model";
import { componentExample } from "../../src/builder/library";
import { THEME_PRESETS } from "../../src/builder/theme";
import { BLOCK_PRESETS } from "../../src/builder/block-presets";
import { populateRecipe } from "../../src/builder/component-recipes";
const frame = (page: Page) =>
  page.frameLocator('iframe[title="디자인 미리보기"]').first();
async function open(page: Page, p: Project) {
  await page.goto("/");
  await page.locator("input[type=file]").setInputFiles({
    name: "expansion.json",
    mimeType: "application/json",
    buffer: Buffer.from(JSON.stringify(p)),
  });
  await expect(frame(page).locator(".ui-root")).toBeVisible();
}
function frames() {
  const p = blankProject(),
    root = p.nodes[p.pages[0].rootId];
  root.layout.direction = "row";
  root.layout.padding = 24;
  for (const id of ["left-frame", "right-frame"]) {
    const n = createNode("frame", id);
    Object.assign(n.layout, { widthMode: "fixed", width: 620, height: 500 });
    p.nodes[id] = n;
    root.children.push(id);
  }
  return p;
}
test("library drag respects zoom, cross-frame movement and a single undo", async ({
  page,
}) => {
  const p = frames();
  await open(page, p);
  await page.getByLabel("캔버스 배율").selectOption("0.5");
  await page.getByLabel("컴포넌트 검색").fill("버튼");
  await page.getByLabel("라이브러리 디자인").selectOption("brutal");
  await page
    .getByRole("button", { name: "버튼 추가", exact: true })
    .dragTo(frame(page).locator("#left-frame"), {
      targetPosition: { x: 90, y: 80 },
    });
  const node = frame(page).locator("#left-frame>[data-component=button]");
  await expect(node).toHaveCount(1);
  await expect(node).toHaveAttribute("data-family", "brutal");
  await expect(node.locator("[data-slot=button]")).toHaveCSS(
    "background-color",
    "rgb(217, 249, 104)",
  );
  await node.click();
  const initial = await node.boundingBox(),
    target = await frame(page).locator("#right-frame").boundingBox();
  await page.mouse.move(initial!.x + 10, initial!.y + 10);
  await page.mouse.down();
  await page.mouse.move(target!.x + 100, target!.y + 100, { steps: 12 });
  await page.mouse.up();
  await expect(
    frame(page).locator("#right-frame>[data-component=button]"),
  ).toHaveCount(1);
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(node).toHaveCount(1);
  await page.screenshot({
    path: `artifacts/expanded-drag-${test.info().project.name}.png`,
  });
});
test("design changes keep semantic part edits, my blocks and reload", async ({
  page,
}) => {
  const p = componentExample("button", THEME_PRESETS[0]);
  const id = p.nodes[p.pages[0].rootId].children[0];
  p.nodes[id].appearance = { family: "soft", renderer: "shadcn" };
  await open(page, p);
  await frame(page).locator(`#${id}`).click();
  await page.getByLabel("버튼 문구", { exact: true }).fill("우리 팀 시작하기");
  await page
    .getByRole("group", { name: "컴포넌트 내부 요소" })
    .getByRole("button", { name: /^버튼/ })
    .click();
  await page.getByLabel("내부 글자 크기", { exact: true }).fill("21");
  await page.getByLabel("내부 글자 크기", { exact: true }).press("Enter");
  await page.getByRole("button", { name: "뉴브루탈", exact: true }).click();
  await expect(frame(page).locator("[data-part-id=action]")).toHaveCSS(
    "font-size",
    "21px",
  );
  await expect(frame(page).locator("[data-part-id=action]")).toContainText(
    "우리 팀 시작하기",
  );
  await page.getByRole("button", { name: "내 블록으로 저장" }).click();
  await page.getByRole("button", { name: "내 블록", exact: true }).click();
  await page.locator(".b-my-blocks .b-button").first().click();
  await expect(frame(page).locator("[data-component=button]")).toHaveCount(2);
  await page
    .getByRole("button", { name: "프로젝트 목록", exact: true })
    .click();
  await page.reload();
  await page.locator(".workspace-project-main").first().click();
  await expect(frame(page).locator("[data-part-id=action]")).toHaveCount(2);
  await expect(frame(page).locator("[data-part-id=action]").first()).toHaveCSS(
    "font-size",
    "21px",
  );
});
test("official combobox, dialog and sheet work inside the preview document", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const p = blankProject(),
    root = p.nodes[p.pages[0].rootId];
  for (const component of [
    "combobox",
    "dialog",
    "sheet",
    "date-range-picker",
    "input-otp",
  ]) {
    const n = createNode(component, `check-${component}`);
    n.appearance = { family: "soft", renderer: "shadcn" };
    p.nodes[n.id] = n;
    root.children.push(n.id);
  }
  await open(page, p);
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  await frame(page).getByRole("combobox").click();
  await frame(page).getByRole("option", { name: "개발", exact: false }).click();
  await expect(frame(page).getByRole("combobox")).toContainText("개발");
  const trigger = frame(page).locator("#check-dialog button");
  await trigger.click();
  await expect(frame(page).getByRole("dialog")).toBeVisible();
  await frame(page).getByRole("button", { name: "확인했어요" }).click();
  await expect(frame(page).getByRole("dialog")).toHaveCount(0);
  await expect(trigger).toBeFocused();
  await frame(page).locator("#check-sheet button").click();
  await expect(frame(page).getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(frame(page).getByRole("dialog")).toHaveCount(0);
  await frame(page).locator("#check-date-range-picker button").click();
  await expect(frame(page).getByRole("grid")).toBeVisible();
  await page.keyboard.press("Escape");
  await frame(page).getByRole("textbox", { name: "인증 코드" }).fill("123456");
  await expect(
    frame(page).getByRole("textbox", { name: "인증 코드" }),
  ).toHaveValue("123456");
  expect(errors).toEqual([]);
});
test("all 72 structural blocks retain editable children and fit phone and desktop", async ({
  page,
}) => {
  test.setTimeout(120000);
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  for (let batch = 0; batch < 6; batch++) {
    const p = blankProject(),
      root = p.nodes[p.pages[0].rootId];
    for (const def of BLOCK_PRESETS.slice(batch * 12, batch * 12 + 12)) {
      const n = createNode(def.id);
      p.nodes[n.id] = n;
      root.children.push(n.id);
      populateRecipe(p, n);
    }
    parseProject(p);
    await open(page, p);
    await page.getByRole("button", { name: "미리보기", exact: true }).click();
    for (const width of [390, 1440]) {
      await page.getByLabel("미리보기 너비").fill(String(width));
      await page.getByLabel("미리보기 너비").press("Tab");
      await expect
        .poll(() =>
          frame(page)
            .locator("body")
            .evaluate(() => document.documentElement.scrollWidth <= innerWidth),
        )
        .toBe(true);
    }
    await expect(frame(page).locator("[data-component^=block-]")).toHaveCount(
      12,
    );
  }
  expect(errors).toEqual([]);
});
test("block structure previews and preserves authored content with undo", async ({
  page,
}) => {
  const p = componentExample("block-hero-1", THEME_PRESETS[0]);
  const heading = Object.values(p.nodes).find(
    (n) => n.component === "heading",
  )!;
  heading.props.text = "보존해야 하는 제목";
  await open(page, p);
  const root = frame(page).locator("[data-component=block-hero-1]");
  await root.click({ position: { x: 5, y: 5 } });
  await page
    .getByLabel("블록 구조", { exact: true })
    .selectOption("block-hero-2");
  const modal = page.getByRole("dialog");
  await expect(
    modal
      .frameLocator('iframe[title="디자인 미리보기"]')
      .getByText("보존해야 하는 제목"),
  ).toBeVisible();
  await modal.getByRole("button", { name: "이 구조 적용" }).click();
  await expect(
    frame(page).locator("[data-component=block-hero-2]"),
  ).toHaveCount(1);
  await expect(frame(page).getByText("보존해야 하는 제목")).toBeVisible();
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(root).toHaveCount(1);
});
test("motion is paused while editing and respects reduced motion", async ({
  page,
}) => {
  const p = componentExample("button", THEME_PRESETS[0]);
  const n = p.nodes[p.nodes[p.pages[0].rootId].children[0]];
  n.appearance = { motion: "float", family: "dark", renderer: "shadcn" };
  await open(page, p);
  const node = frame(page).locator("[data-component=button]");
  await expect(node).toHaveCSS("animation-name", "none");
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  await expect(node).toHaveCSS("animation-name", "studio-float");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(node).toHaveCSS("animation-name", "none");
});
test("library pointer cancellation leaves no change and flow drop inserts at the shown position", async ({
  page,
}) => {
  const p = blankProject(),
    root = p.nodes[p.pages[0].rootId];
  for (const id of ["first-line", "last-line"]) {
    const n = createNode("text", id);
    p.nodes[id] = n;
    root.children.push(id);
  }
  await open(page, p);
  await page.getByLabel("캔버스 배율").selectOption("0.5");
  await page.getByLabel("컴포넌트 검색").fill("버튼");
  const source = page.getByRole("button", { name: "버튼 추가", exact: true });
  async function move() {
    const a = await source.boundingBox(),
      b = await frame(page).locator("#first-line").boundingBox();
    await page.mouse.move(a!.x + a!.width / 2, a!.y + a!.height / 2);
    await page.mouse.down();
    await page.mouse.move(b!.x + 30, b!.y + 1, { steps: 10 });
  }
  await move();
  await page.keyboard.press("Escape");
  await page.mouse.up();
  await expect(frame(page).locator("[data-component=button]")).toHaveCount(0);
  await source.click();
  await expect(frame(page).locator("[data-component=button]")).toHaveCount(1);
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(frame(page).locator("[data-component=button]")).toHaveCount(0);
  await move();
  await page.mouse.up();
  await expect(
    frame(page).locator(".ui-page>.ui-node").first(),
  ).toHaveAttribute("data-component", "button");
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(frame(page).locator("[data-component=button]")).toHaveCount(0);
});
