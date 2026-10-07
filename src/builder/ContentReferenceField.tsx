"use client";
import type { Field } from "./catalog";
import { descendants, type Project } from "./model";
export default function ContentReferenceField({
  project,
  nodeId,
  field,
  label,
  value,
  onChange,
}: {
  project: Project;
  nodeId: string;
  field: Field;
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const node = project.nodes[nodeId],
    page = project.pages.find((p) =>
      descendants(project, p.rootId).includes(nodeId),
    );
  const choices =
    field.type === "item-ref"
      ? (node.content?.[field.refCollection ?? ""] ?? []).map(
          (item, index) => ({
            id: item.id,
            label: `${index + 1}. ${String(item.values.title || item.values.label || "항목")}`,
          }),
        )
      : (page ? descendants(project, page.rootId) : [])
          .filter((id) => !descendants(project, id).includes(nodeId))
          .map((id) => ({
            id,
            label: `${project.nodes[id].name}${project.nodes[id].hidden ? " · 숨김" : ""}`,
          }));
  const missing = !!value && !choices.some((c) => c.id === value);
  return (
    <label className="b-field">
      {field.label}
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">
          {field.type === "item-ref" ? "첫 단계에 표시" : "연결할 요소 선택"}
        </option>
        {missing && <option value={value}>연결된 항목 없음</option>}
        {choices.map((choice) => (
          <option key={choice.id} value={choice.id}>
            {choice.label}
          </option>
        ))}
      </select>
      {missing && (
        <small className="b-notice">
          {field.type === "item-ref"
            ? "단계가 삭제되어 첫 단계에 표시합니다. 다른 단계를 선택할 수 있습니다."
            : "이 페이지에 대상이 없습니다. 이동할 요소를 다시 연결하세요."}
        </small>
      )}
    </label>
  );
}
