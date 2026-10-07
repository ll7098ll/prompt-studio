import { test, expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import {
  blankProject,
  createNode,
  type Project,
} from "../../src/builder/model";
import { itemSlot } from "../../src/builder/content-items";
const frame = (page: Page) =>
  page.frameLocator('iframe[title="디자인 미리보기"]').first();
function sample(component: string) {
  const project = blankProject(),
    node = createNode(component);
  project.nodes[node.id] = node;
  project.nodes[project.pages[0].rootId].children.push(node.id);
  return { project, node };
}
async function open(page: Page, project: Project) {
  await page.goto("/");
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "story.json",
      mimeType: "application/json",
      buffer: Buffer.from(JSON.stringify(project)),
    });
  await expect(frame(page).locator(".ui-root")).toBeVisible();
}
test("step form validates, preserves values through previous/next, focuses errors and reviews without requests", async ({
  page,
}, info) => {
  const { project, node } = sample("multi-step-form");
  await open(page, project);
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  const form = frame(page).locator(".ui-step-form");
  await form.getByRole("button", { name: "다음", exact: true }).click();
  await expect(form.locator("[aria-invalid=true]")).toHaveCount(2);
  await expect(form.getByLabel("이름")).toBeFocused();
  await form.getByLabel("이름").fill("김디자인");
  await form.getByLabel("이메일").fill("invalid@");
  await form.getByRole("button", { name: "다음", exact: true }).click();
  await expect(form.getByLabel("이메일")).toBeFocused();
  await expect(form.getByRole("alert")).toContainText("이메일 주소");
  await form.getByLabel("이메일").fill("design@example.com");
  await form.getByRole("button", { name: "다음", exact: true }).click();
  await expect(form.getByRole("heading", { name: "관심사" })).toBeFocused();
  await form.getByLabel("관심 분야").selectOption("모션 그래픽");
  await form.getByLabel("추가 이야기").fill("<script>alert(1)</script>");
  await form.getByRole("button", { name: "이전", exact: true }).click();
  await expect(form.getByLabel("이름")).toHaveValue("김디자인");
  await expect(form.getByLabel("이메일")).toHaveValue("design@example.com");
  await form.getByRole("button", { name: "다음", exact: true }).click();
  await expect(form.getByLabel("관심 분야")).toHaveValue("모션 그래픽");
  let sent = false;
  page.on("request", (request) => {
    if (request.method() === "POST") sent = true;
  });
  await form.getByRole("button", { name: "완료", exact: true }).click();
  await expect(
    form.getByRole("heading", { name: String(node.props.successTitle) }),
  ).toBeFocused();
  await expect(form.locator("dl")).toContainText("design@example.com");
  await expect(form.locator("dl")).toContainText("<script>alert(1)</script>");
  await expect(form.locator("script")).toHaveCount(0);
  expect(sent).toBe(false);
  const doc = page
    .frames()
    .find((f) => f.name() !== "" || f.url() === "about:srcdoc");
  expect(doc).toBeTruthy();
  await page.screenshot({ path: info.outputPath("step-form.png") });
  await form.getByRole("button", { name: "다시 작성" }).click();
  await expect(form.getByLabel("이름")).toHaveValue("");
  const axe = await new AxeBuilder({ page })
    .include('iframe[title="디자인 미리보기"]')
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  expect(axe.violations).toEqual([]);
});
test("chapter navigation uses iframe scroll, follows position, handles missing targets and restores focus", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const { project, node } = sample("scroll-chapters"),
    root = project.nodes[project.pages[0].rootId];
  for (let i = 0; i < 3; i++) {
    const content = createNode("rich-text");
    content.name = `챕터 ${i + 1}`;
    content.layout.minHeight = 1000;
    content.content!.blocks[0].values.text = `장면 ${i + 1}`;
    project.nodes[content.id] = content;
    root.children.push(content.id);
    node.content!.chapters[i].values.target =
      i === 2 ? "missing-target" : content.id;
  }
  await open(page, project);
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  const nav = frame(page).getByRole("navigation", { name: "이야기의 순서" });
  await expect(nav.getByRole("button", { name: /다음 이야기/ })).toBeDisabled();
  await expect(nav.getByRole("button", { name: /시작/ })).toHaveAttribute(
    "aria-current",
    "location",
  );
  await nav.getByRole("button", { name: /디테일/ }).click();
  await expect(
    frame(page).getByRole("heading", { name: "장면 2" }),
  ).toBeFocused();
  await expect(nav.getByRole("button", { name: /디테일/ })).toHaveAttribute(
    "aria-current",
    "location",
  );
  expect(
    await frame(page)
      .locator(`#${node.id}`)
      .evaluate((el) => el.getBoundingClientRect().top),
  ).toBeGreaterThanOrEqual(20);
  expect(await nav.getByRole("progressbar").getAttribute("value")).not.toBe(
    "0",
  );
  await nav.getByRole("button", { name: /시작/ }).click();
  await expect(
    frame(page).getByRole("heading", { name: "장면 1" }),
  ).toBeFocused();
});
test("rich fragment editing preserves sibling formatting and block styles through reorder and Undo", async ({
  page,
}, info) => {
  const { project, node } = sample("rich-text"),
    body = node.content!.blocks[1];
  body.values.text =
    "Before **굵은 문구** and *기울임* [링크](https://example.com) <img src=x>";
  node.parts = {
    [`slot.${itemSlot(body.id)}`]: { layout: { padding: 19 }, responsive: {} },
  };
  await open(page, project);
  await frame(page)
    .locator(".ui-rich-text strong")
    .click({ modifiers: ["Control"] });
  await page.getByLabel("내부 문구", { exact: true }).fill("수정한 * 문구");
  await page.getByLabel("내부 문구", { exact: true }).press("Tab");
  await expect(frame(page).locator(".ui-rich-text strong")).toHaveText(
    "수정한 * 문구",
  );
  await expect(frame(page).locator(".ui-rich-text em")).toHaveText("기울임");
  await expect(frame(page).locator(".ui-rich-text a")).toHaveAttribute(
    "href",
    "https://example.com",
  );
  await expect(frame(page).locator(".ui-rich-text img")).toHaveCount(0);
  await frame(page).locator(".ui-rich-text h2").click();
  const items = page.getByRole("region", { name: "본문 블록", exact: true });
  await items.locator("details").nth(1).locator("summary").click();
  await expect(page.getByLabel("2번 본문", { exact: true })).toHaveValue(
    /Before \*\*수정한 \\\* 문구\*\* and/,
  );
  await items
    .getByRole("button", { name: "2번 항목 아래로", exact: true })
    .click();
  await expect(
    frame(page).locator(`[data-part-id="${itemSlot(body.id)}"]`),
  ).toHaveCSS("padding", "19px");
  await expect(frame(page).locator(".ui-rich-text strong")).toHaveText(
    "수정한 * 문구",
  );
  await page.getByRole("button", { name: "실행 취소", exact: true }).click();
  await expect(items.locator("details").nth(1)).toContainText("소개");
  await page.screenshot({
    path: info.outputPath("rich-editor.png"),
    fullPage: true,
  });
  await page
    .getByRole("button", { name: "프로젝트 목록", exact: true })
    .click();
  await page.reload();
  await page.locator(".workspace-project-main").first().click();
  await expect(frame(page).locator(".ui-rich-text strong")).toHaveText(
    "수정한 * 문구",
  );
});
test("rich toolbar applies formats and rejects unsafe links; 320px story previews fit", async ({
  page,
}) => {
  const { project, node } = sample("rich-text");
  await open(page, project);
  await frame(page).locator(".ui-rich-text h2").click();
  const items = page.getByRole("region", { name: "본문 블록", exact: true });
  await items.locator("details").first().locator("summary").click();
  const input = page.getByLabel("1번 본문", { exact: true });
  await input.fill("새 제목");
  await input.selectText();
  await page
    .getByRole("button", { name: "1번 본문 굵게", exact: true })
    .click();
  await expect(frame(page).locator(".ui-rich-text h2 strong")).toHaveText(
    "새 제목",
  );
  await page
    .getByRole("button", { name: "1번 본문 링크", exact: true })
    .click();
  await page
    .getByLabel("1번 본문 링크 주소", { exact: true })
    .fill("javascript:alert(1)");
  await page.getByRole("button", { name: "링크 적용", exact: true }).click();
  await expect(items.getByRole("alert")).toContainText("웹 주소");
  await expect(frame(page).locator(".ui-rich-text a")).toHaveCount(0);
  expect(node.component).toBe("rich-text");
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  const width = page.getByLabel("미리보기 너비", { exact: true });
  await width.fill("320");
  await width.press("Enter");
  expect(
    await frame(page)
      .locator(".ui-root")
      .evaluate((el) => el.scrollWidth <= 320),
  ).toBe(true);
});
test("all internal parts remain searchable beyond 500 descendants", async ({
  page,
}) => {
  const { project, node } = sample("rich-text"),
    seed = node.content!.blocks[1];
  node.content!.blocks = Array.from({ length: 100 }, (_, i) => ({
    id: `block-${i}`,
    values: {
      ...seed.values,
      title: `문단 ${i}`,
      text: `문단 ${i} **${i === 99 ? "마지막 조각 찾기" : "강조"}** 일반 *기울임* 마무리`,
    },
  }));
  await open(page, project);
  await frame(page).locator(".ui-rich-text p").first().click();
  const parts = page.getByRole("group", { name: "컴포넌트 내부 요소" });
  await expect(
    page.getByRole("navigation", { name: "내부 요소 목록 페이지" }),
  ).toContainText("601");
  await expect(parts.getByRole("button")).toHaveCount(100);
  await page
    .getByLabel("내부 요소 검색", { exact: true })
    .fill("마지막 조각 찾기");
  await expect(parts.getByRole("button")).toHaveCount(1);
  await parts.getByRole("button").click();
  await page.getByLabel("내부 글자 크기", { exact: true }).fill("27");
  await page.getByLabel("내부 글자 크기", { exact: true }).press("Enter");
  await expect(frame(page).locator(".ui-rich-text strong").last()).toHaveCSS(
    "font-size",
    "27px",
  );
});
test("step duplication copies linked questions and inner styles, deletion preserves questions, widths fit", async ({
  page,
}, info) => {
  const { project, node } = sample("multi-step-form"),
    field = node.content!.fields[0];
  node.parts = {
    [`slot.${itemSlot(field.id, "label")}`]: {
      layout: { fontSize: 19 },
      responsive: {},
    },
  };
  await open(page, project);
  await frame(page).locator(".ui-step-form h2").click();
  const steps = page.getByRole("region", { name: "폼 단계", exact: true }),
    questions = page.getByRole("region", { name: "폼 질문", exact: true });
  await steps.locator("summary").first().click();
  await steps
    .getByRole("button", { name: "1번 항목 복제", exact: true })
    .click();
  await expect(steps.locator("details")).toHaveCount(3);
  await expect(questions.locator("details")).toHaveCount(6);
  await page.getByLabel("처음 표시할 단계", { exact: true }).fill("2");
  await page.getByLabel("처음 표시할 단계", { exact: true }).press("Tab");
  await expect(
    frame(page).locator('.ui-step-field [data-content-field="label"]').first(),
  ).toHaveCSS("font-size", "19px");
  await steps.locator("summary").nth(1).click();
  await steps
    .getByRole("button", { name: "2번 항목 삭제", exact: true })
    .click();
  await expect(questions.locator("details")).toHaveCount(6);
  await questions.locator("summary").nth(4).click();
  await expect(questions).toContainText("단계가 삭제되어 첫 단계에 표시합니다");
  await page.getByLabel("처음 표시할 단계", { exact: true }).fill("1");
  await page.getByLabel("처음 표시할 단계", { exact: true }).press("Tab");
  await page.getByRole("button", { name: "미리보기", exact: true }).click();
  await expect(frame(page).getByLabel("이름")).toHaveCount(2);
  const width = page.getByLabel("미리보기 너비", { exact: true });
  for (const size of [320, 390, 768, 1440]) {
    await width.fill(String(size));
    await width.press("Enter");
    await expect
      .poll(() =>
        frame(page)
          .locator(".ui-root")
          .evaluate((el) => el.scrollWidth),
      )
      .toBeLessThanOrEqual(size);
    if (size === 320)
      await page.screenshot({ path: info.outputPath("step-mobile.png") });
  }
});
