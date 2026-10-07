import type { ContentItem } from "./content-items";
export function fieldsForStep(
  fields: ContentItem[],
  steps: ContentItem[],
  step: string,
) {
  return fields.filter((field) => {
    const assigned = String(field.values.step);
    return (
      (steps.some((s) => s.id === assigned) ? assigned : steps[0]?.id) === step
    );
  });
}
export function fieldError(
  field: ContentItem,
  value: string | boolean | undefined,
): string {
  const text = typeof value === "string" ? value.trim() : "";
  if (
    field.values.required &&
    (field.values.kind === "checkbox" ? value !== true : !text)
  )
    return "이 항목을 입력해 주세요.";
  if (!text) return "";
  if (field.values.kind === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(text))
    return "이메일 주소를 확인해 주세요.";
  if (field.values.kind === "number" && !Number.isFinite(Number(text)))
    return "숫자를 입력해 주세요.";
  if (
    field.values.kind === "select" &&
    !String(field.values.options)
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean)
      .includes(text)
  )
    return "목록에서 선택해 주세요.";
  return "";
}
