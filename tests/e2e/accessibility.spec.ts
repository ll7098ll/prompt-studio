import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { writeFile, mkdir } from "node:fs/promises";

for (const screen of ["workspace", "editor", "theme", "handoff", "versions"]) {
  test(`${screen} has no automated WCAG AA accessibility violations`, async ({
    page,
  }) => {
    await page.goto("/");
    if (screen !== "workspace") {
      await page
        .locator(".workspace-template")
        .filter({ hasText: "브랜드 랜딩" })
        .click();
      await expect(
        page
          .frameLocator('iframe[title="디자인 미리보기"]')
          .getByRole("heading", { name: /좋은 아이디어가/ }),
      ).toBeVisible();
    }
    if (screen === "theme")
      await page.getByRole("tab", { name: "테마", exact: true }).click();
    if (screen === "handoff")
      await page.getByRole("button", { name: "AI에 전달" }).click();
    if (screen === "versions")
      await page
        .getByRole("button", { name: "저장한 버전", exact: true })
        .click();
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    await mkdir("artifacts", { recursive: true });
    await writeFile(
      `artifacts/a11y-${screen}-${test.info().project.name}.json`,
      JSON.stringify(result.violations, null, 2),
    );
    expect(
      result.violations.map((v) => ({
        id: v.id,
        targets: v.nodes.map((n) => n.target),
      })),
    ).toEqual([]);
  });
}
