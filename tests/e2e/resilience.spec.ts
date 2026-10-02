import { expect, test } from "@playwright/test";

test("keyboard panel navigation and dialog focus return work without a mouse", async ({
  page,
}) => {
  await page.goto("/");
  await page
    .locator(".workspace-template")
    .filter({ hasText: "브랜드 랜딩" })
    .click();
  const components = page.getByRole("tab", { name: "컴포넌트", exact: true });
  await components.focus();
  await page.keyboard.press("End");
  await expect(
    page.getByRole("tab", { name: "테마", exact: true }),
  ).toBeFocused();
  await expect(
    page.getByRole("tab", { name: "테마", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  const exportButton = page.getByRole("button", { name: "AI에 전달" });
  await exportButton.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(exportButton).toBeFocused();
});
