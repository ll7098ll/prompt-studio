"use client";
import { useState } from "react";
import { ArrowUp, ArrowDown, Copy, Trash2 } from "lucide-react";
import { AssetField } from "./AssetPanel";
import {
  contentItems,
  itemSlot,
  migrateGalleryParts,
  type ContentItem,
} from "./content-items";
import { editProject, uid, type Project } from "./model";
import type { Collection } from "./catalog";
import NumberInput from "./NumberInput";
import RichTextField from "./RichTextField";
import ContentReferenceField from "./ContentReferenceField";

export default function ContentItemsPanel({
  project,
  nodeId,
  collectionKey,
  collection,
  commit,
}: {
  project: Project;
  nodeId: string;
  collectionKey: string;
  collection: Collection;
  commit: (p: Project, group?: string) => void;
}) {
  const node = project.nodes[nodeId],
    items = contentItems(node, collectionKey, collection);
  const [error, setError] = useState("");
  const apply = (
    fn: (items: ContentItem[], next: Project) => void,
    group?: string,
  ) => {
    try {
      setError("");
      commit(
        editProject(project, (next) => {
          const target = next.nodes[nodeId];
          const current = contentItems(target, collectionKey, collection);
          migrateGalleryParts(target, current);
          target.content ??= {};
          target.content[collectionKey] = current;
          fn(current, next);
        }),
        group,
      );
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "항목을 수정하지 못했습니다.",
      );
    }
  };
  if (!node.content?.[collectionKey] && collection.legacy)
    return (
      <div className="b-item-editor">
        <p className="b-help">
          사진과 설명을 항목별로 편집하고 순서를 바꿀 수 있습니다. 기존 문구와
          내부 스타일을 그대로 가져옵니다.
        </p>
        {items.length > 100 && (
          <p className="b-notice">
            항목별 편집은 100개까지 지원합니다. 아래 기존 목록에서 항목을 나눈
            뒤 전환하세요.
          </p>
        )}
        {error && (
          <p className="b-notice" role="alert">
            {error}
          </p>
        )}
        <button
          className="b-button"
          disabled={items.length > 100}
          onClick={() => apply(() => {})}
        >
          항목별 편집 시작
        </button>
      </div>
    );
  return (
    <section className="b-item-editor" aria-label={collection.label}>
      {error && (
        <p className="b-notice" role="alert">
          {error}
        </p>
      )}
      <div className="b-section-title">
        {collection.label}
        <span>{items.length} / 100</span>
      </div>
      {items.map((item, index) => (
        <details
          className="b-content-item"
          key={item.id}
          open={items.length === 1 || undefined}
        >
          <summary>
            {index + 1}.{" "}
            {String(item.values.title || item.values.label || "새 항목")}
          </summary>
          <div className="b-item-actions">
            <button
              type="button"
              className="b-icon"
              aria-label={`${index + 1}번 항목 위로`}
              disabled={!index}
              onClick={() =>
                apply((list) => {
                  [list[index - 1], list[index]] = [
                    list[index],
                    list[index - 1],
                  ];
                })
              }
            >
              <ArrowUp size={14} />
            </button>
            <button
              type="button"
              className="b-icon"
              aria-label={`${index + 1}번 항목 아래로`}
              disabled={index === items.length - 1}
              onClick={() =>
                apply((list) => {
                  [list[index], list[index + 1]] = [
                    list[index + 1],
                    list[index],
                  ];
                })
              }
            >
              <ArrowDown size={14} />
            </button>
            <button
              type="button"
              className="b-icon"
              aria-label={`${index + 1}번 항목 복제`}
              disabled={items.length >= 100}
              onClick={() =>
                apply((list, next) => {
                  const copy = structuredClone(list[index]);
                  copy.id = uid("item");
                  list.splice(index + 1, 0, copy);
                  const target = next.nodes[nodeId],
                    parts = target.parts;
                  const mapping: Record<string, string> = {
                    [item.id]: copy.id,
                  };
                  if (
                    target.component === "multi-step-form" &&
                    collectionKey === "steps"
                  ) {
                    const fields = target.content?.fields ?? [],
                      copies = fields
                        .filter((field) => field.values.step === item.id)
                        .map((field) => {
                          const cloned = structuredClone(field);
                          cloned.id = uid("item");
                          cloned.values.step = copy.id;
                          mapping[field.id] = cloned.id;
                          return cloned;
                        });
                    if (fields.length + copies.length > 100)
                      throw Error(
                        "질문이 100개를 넘어 이 단계를 복제할 수 없습니다.",
                      );
                    fields.push(...copies);
                  }
                  for (const [oldId, newId] of Object.entries(mapping))
                    for (const [key, part] of Object.entries(parts ?? {}))
                      if (
                        key === `slot.${itemSlot(oldId)}` ||
                        key.startsWith(`slot.${itemSlot(oldId)}.`)
                      )
                        parts![
                          key.replace(
                            `slot.${itemSlot(oldId)}`,
                            `slot.${itemSlot(newId)}`,
                          )
                        ] = structuredClone(part);
                })
              }
            >
              <Copy size={14} />
            </button>
            <button
              type="button"
              className="b-icon b-danger"
              aria-label={`${index + 1}번 항목 삭제`}
              onClick={() =>
                apply((list, next) => {
                  list.splice(index, 1);
                  for (const key of Object.keys(next.nodes[nodeId].parts ?? {}))
                    if (
                      key === `slot.${itemSlot(item.id)}` ||
                      key.startsWith(`slot.${itemSlot(item.id)}.`)
                    )
                      delete next.nodes[nodeId].parts![key];
                })
              }
            >
              <Trash2 size={14} />
            </button>
          </div>
          {collection.fields.map((field) => {
            const label = `${index + 1}번 ${field.label}`,
              value = item.values[field.key];
            const set = (value: string | number | boolean) =>
              apply((list) => {
                list.find((i) => i.id === item.id)!.values[field.key] = value;
              }, `${nodeId}-${item.id}-${field.key}`);
            if (field.type === "rich")
              return (
                <RichTextField
                  key={field.key}
                  label={label}
                  value={String(value)}
                  onChange={set}
                />
              );
            if (field.type === "node-ref" || field.type === "item-ref")
              return (
                <ContentReferenceField
                  key={field.key}
                  project={project}
                  nodeId={nodeId}
                  field={field}
                  label={label}
                  value={String(value)}
                  onChange={set}
                />
              );
            if (field.type === "asset")
              return (
                <AssetField
                  key={field.key}
                  project={project}
                  nodeId={nodeId}
                  field={{ ...field, label }}
                  collectionKey={collectionKey}
                  itemId={item.id}
                  commit={commit}
                />
              );
            return (
              <label
                className={`b-field ${field.type === "toggle" ? "b-field-toggle" : ""}`}
                key={field.key}
              >
                {field.label}
                {field.type === "textarea" ? (
                  <textarea
                    aria-label={label}
                    value={String(value)}
                    maxLength={20000}
                    onChange={(e) => set(e.target.value)}
                  />
                ) : field.type === "select" ? (
                  <select
                    aria-label={label}
                    value={String(value)}
                    onChange={(e) => set(e.target.value)}
                  >
                    {field.options?.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                ) : field.type === "toggle" ? (
                  <input
                    aria-label={label}
                    type="checkbox"
                    checked={Boolean(value)}
                    onChange={(e) => set(e.target.checked)}
                  />
                ) : field.type === "number" ? (
                  <NumberInput
                    aria-label={label}
                    value={Number(value)}
                    min={field.min ?? 0}
                    max={field.max ?? 100}
                    onChange={set}
                  />
                ) : (
                  <input
                    aria-label={label}
                    value={String(value)}
                    maxLength={20000}
                    onChange={(e) => set(e.target.value)}
                  />
                )}
              </label>
            );
          })}
        </details>
      ))}
      <button
        className="b-button"
        disabled={items.length >= 100}
        onClick={() =>
          apply((list) => {
            list.push({ id: uid("item"), values: { ...collection.defaults } });
          })
        }
      >
        항목 추가
      </button>
    </section>
  );
}
