"use client";
import { useState } from "react";
import { DEFINITIONS } from "./catalog";
import { boxInParent, elementSize } from "./geometry";
import { APPEARANCE_KEYS, DESIGN_DEFAULTS } from "./design-schema";
import {
  appearanceOf,
  editableRoots,
  patchLayouts,
  type Alignment,
} from "./design-commands";
import {
  isLocked,
  parentId,
  resolvedLayout,
  type Layout,
  type Project,
  type Viewport,
} from "./model";

export type DesignAction =
  | "group"
  | "ungroup"
  | "copy"
  | "paste"
  | "front"
  | "back"
  | "forward"
  | "backward"
  | "fit-content"
  | "focus"
  | "detach"
  | Alignment;
type Props = {
  project: Project;
  ids: string[];
  viewport: Viewport;
  commit: (p: Project, group?: string) => void;
  onMode: (id: string, mode: "flow" | "free") => void;
  onAction: (action: DesignAction) => void;
  onPatch?: (patch: Partial<Layout>) => void;
  document?: Document | null;
};
const colorOptions = [
  "primary",
  "foreground",
  "background",
  "surface",
  "muted",
  "border",
  "soft",
  "onPrimary",
];
export default function DesignPanel({
  project,
  ids,
  viewport,
  commit,
  onMode,
  onAction,
  onPatch,
  document,
}: Props) {
  const [copiedStyle, setCopiedStyle] = useState<Partial<Layout> | null>(null);
  const nodes = ids.map((id) => project.nodes[id]).filter(Boolean);
  if (!nodes.length) return null;
  const layouts = nodes.map((node) => resolvedLayout(node, viewport)),
    first = nodes[0],
    layout = layouts[0];
  const disabled = nodes.some((node) => isLocked(project, node.id));
  const parent = parentId(project, first.id);
  const free =
    !!parent && resolvedLayout(project.nodes[parent], viewport).mode === "free";
  const sameParent =
    !!parent && nodes.every((node) => parentId(project, node.id) === parent);
  const element = document?.getElementById(first.id),
    parentElement = parent ? document?.getElementById(parent) : null;
  const measured =
    nodes.length === 1 && element
      ? free && parentElement
        ? boxInParent(element, parentElement)
        : elementSize(element)
      : null;
  const common = (key: keyof Layout) =>
    layouts.every((item) => item[key] === layout[key])
      ? layout[key]
      : undefined;
  const patch = (value: Partial<Layout>, group = "") => {
    if (disabled) return;
    if (onPatch) onPatch(value);
    else
      commit(
        patchLayouts(project, editableRoots(project, ids), viewport, value),
        group,
      );
  };
  function number(
    key: keyof Layout,
    label: string,
    min: number,
    max: number,
    step = 1,
  ) {
    const stored = common(key);
    const value =
      measured && key in measured
        ? Math.round(measured[key as keyof typeof measured] * 10) / 10
        : stored;
    return (
      <label className="b-field" key={key}>
        {label}
        <input
          key={`${ids.join()}-${key}-${String(value)}`}
          type="number"
          aria-label={label}
          defaultValue={typeof value === "number" ? value : ""}
          placeholder="혼합"
          min={min}
          max={max}
          step={step}
          onBlur={(e) => {
            const text = e.currentTarget.value;
            if (!text.trim()) return;
            const n = Number(text);
            if (Number.isFinite(n) && n !== value)
              patch({
                [key]: Math.min(max, Math.max(min, n)),
                ...(key === "width"
                  ? { widthMode: "fixed" as const }
                  : key === "height"
                    ? { heightMode: "fixed" as const }
                    : {}),
              });
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
          }}
        />
      </label>
    );
  }
  function choice(
    key: keyof Layout,
    label: string,
    options: [string, string][],
  ) {
    return (
      <label className="b-field" key={key}>
        {label}
        <select
          aria-label={label}
          value={String(common(key) ?? "mixed")}
          onChange={(e) => patch({ [key]: e.target.value })}
        >
          {common(key) === undefined && (
            <option value="mixed" disabled>
              혼합
            </option>
          )}
          {options.map(([value, text]) => (
            <option key={value} value={value}>
              {text}
            </option>
          ))}
        </select>
      </label>
    );
  }
  function color(
    key: "fillColor" | "textColor" | "strokeColor",
    label: string,
  ) {
    const value = common(key) as string | undefined;
    return (
      <div className="design-color" key={key}>
        <label>
          {label}
          <input
            aria-label={`${label} 직접 선택`}
            type="color"
            value={value?.startsWith("#") ? value : "#7864dd"}
            onChange={(e) => patch({ [key]: e.target.value })}
          />
        </label>
        <select
          aria-label={`${label} 테마 연결`}
          value={value?.startsWith("#") ? "custom" : (value ?? "mixed")}
          onChange={(e) => patch({ [key]: e.target.value })}
        >
          <option value="">기본값</option>
          {value === undefined && (
            <option value="mixed" disabled>
              혼합
            </option>
          )}
          {value?.startsWith("#") && <option value="custom">{value}</option>}
          {colorOptions.map((token) => (
            <option key={token} value={`theme:${token}`}>
              {token}
            </option>
          ))}
        </select>
      </div>
    );
  }
  return (
    <div className="builder-panel-content design-panel">
      <div className="b-section-title">
        {nodes.length > 1 ? `${nodes.length}개 함께 편집` : "직접 편집"}
        <span>
          {viewport === "mobile"
            ? "모바일 기본값"
            : viewport === "tablet"
              ? "태블릿"
              : "데스크톱"}
        </span>
      </div>
      <p className="b-help">
        {free
          ? "끌어서 이동 · 모서리로 크기 조절 · Alt로 스냅 해제"
          : "자동 배치에서 끌면 순서를 바꿉니다. 자유 배치 영역에서는 원하는 위치로 이동합니다."}
      </p>
      <div className="design-quick-actions">
        <button
          className="b-button b-button-small"
          onClick={() => onAction("focus")}
        >
          선택 위치 보기
        </button>
        <button
          className="b-button b-button-small"
          onClick={() => onAction("copy")}
        >
          복사
        </button>
        <button
          className="b-button b-button-small"
          disabled={disabled}
          onClick={() => onAction("paste")}
        >
          붙여넣기
        </button>
      </div>
      <fieldset className="b-fieldset" disabled={disabled}>
        {nodes.length === 1 && DEFINITIONS[first.component].container && (
          <>
            <label className="b-field">
              영역 배치 방식
              <select
                aria-label="영역 배치 방식"
                value={layout.mode}
                onChange={(e) =>
                  onMode(first.id, e.target.value as "flow" | "free")
                }
              >
                <option value="flow">자동 배치</option>
                <option value="free">자유 배치</option>
              </select>
            </label>
            {layout.mode === "free" && (
              <>
                <label className="b-field b-field-toggle">
                  영역 밖 자르기
                  <input
                    type="checkbox"
                    checked={layout.clip}
                    onChange={(e) => patch({ clip: e.target.checked })}
                  />
                </label>
                <button
                  className="b-button b-button-small"
                  onClick={() => onAction("fit-content")}
                >
                  내용에 맞춰 영역 크기
                </button>
              </>
            )}
          </>
        )}
        {free && (
          <div className="b-field-pair">
            {number("x", "X 위치", -100000, 100000, 0.1)}
            {number("y", "Y 위치", -100000, 100000, 0.1)}
          </div>
        )}
        <div className="b-field-pair">
          {number("width", "W 너비", 1, 20000, 0.1)}
          {number("height", "H 높이", 1, 20000, 0.1)}
        </div>
        <div className="b-field-pair">
          {choice("widthMode", "너비 맞춤", [
            ["auto", "기본값"],
            ["content", "내용 맞춤"],
            ["fill", "공간 채우기"],
            ["fixed", "고정"],
          ])}
          {choice("heightMode", "높이 맞춤", [
            ["auto", "내용 맞춤"],
            ["fixed", "고정"],
          ])}
        </div>
        <label className="b-field b-field-toggle">
          가로세로 비율 유지
          <input
            aria-label="가로세로 비율 유지"
            type="checkbox"
            checked={common("ratioLocked") === true}
            onChange={(e) => patch({ ratioLocked: e.target.checked })}
          />
        </label>
        <div className="b-field-pair">
          {number("rotation", "회전 각도", -360, 360, 0.1)}
          {number("opacity", "불투명도", 0, 1, 0.05)}
        </div>
        {free && (
          <details>
            <summary>화면 크기 변화에 맞추기</summary>
            <div className="b-field-pair">
              {choice("anchorX", "가로 고정 기준", [
                ["start", "왼쪽"],
                ["center", "중앙"],
                ["end", "오른쪽"],
                ["stretch", "양쪽 늘리기"],
                ["scale", "비례 조절"],
              ])}
              {choice("anchorY", "세로 고정 기준", [
                ["start", "위"],
                ["center", "중앙"],
                ["end", "아래"],
                ["stretch", "양쪽 늘리기"],
                ["scale", "비례 조절"],
              ])}
            </div>
            <p className="b-help">
              현재 부모 크기를 기준으로 화면이 변할 때 위치와 크기를 조정합니다.
            </p>
          </details>
        )}
        <div className="b-section-title">정렬과 레이어</div>
        <div className="design-align-grid">
          {(
            [
              ["left", "왼쪽"],
              ["center", "가로 중앙"],
              ["right", "오른쪽"],
              ["top", "위쪽"],
              ["middle", "세로 중앙"],
              ["bottom", "아래쪽"],
              ["horizontal", "가로 같은 간격"],
              ["vertical", "세로 같은 간격"],
            ] as [Alignment, string][]
          ).map(([action, label]) => (
            <button
              key={action}
              className="b-button b-button-small"
              disabled={
                !free ||
                !sameParent ||
                nodes.length <
                  (action === "horizontal" || action === "vertical" ? 3 : 2)
              }
              onClick={() => onAction(action)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="design-quick-actions">
          <button
            className="b-button b-button-small"
            disabled={!free || !sameParent || nodes.length < 2}
            onClick={() => onAction("group")}
          >
            그룹 만들기
          </button>
          <button
            className="b-button b-button-small"
            disabled={nodes.length !== 1 || first.component !== "group"}
            onClick={() => onAction("ungroup")}
          >
            그룹 해제
          </button>
        </div>
        <div className="design-quick-actions">
          {(
            [
              ["front", "맨 앞으로"],
              ["forward", "한 단계 앞으로"],
              ["backward", "한 단계 뒤로"],
              ["back", "맨 뒤로"],
            ] as [DesignAction, string][]
          ).map(([action, label]) => (
            <button
              className="b-button b-button-small"
              key={action}
              disabled={!sameParent}
              onClick={() => onAction(action)}
            >
              {label}
            </button>
          ))}
        </div>
        <details open>
          <summary>외형과 텍스트</summary>
          {color("fillColor", "채우기")}
          {color("textColor", "글자색")}
          {color("strokeColor", "테두리색")}
          <div className="b-field-pair">
            {number("strokeWidth", "테두리 두께", 0, 30)}
            {number("cornerRadius", "모서리 반경", -1, 1000)}
          </div>
          <p className="b-help">
            모서리 -1, 글자 크기·굵기·행간 0은 테마 기본값입니다.
          </p>
          {choice("shadow", "그림자", [
            ["inherit", "기본값"],
            ["none", "없음"],
            ["soft", "은은하게"],
            ["medium", "보통"],
            ["strong", "진하게"],
          ])}
          <div className="b-field-pair">
            {number("fontSize", "글자 크기", 0, 400)}
            {number("fontWeight", "글자 굵기", 0, 900, 100)}
          </div>
          <div className="b-field-pair">
            {number("lineHeight", "행간 배수", 0, 4, 0.1)}
            {number("letterSpacing", "자간", -20, 100, 0.1)}
          </div>
          {choice("textAlign", "글자 정렬", [
            ["inherit", "기본값"],
            ["left", "왼쪽"],
            ["center", "가운데"],
            ["right", "오른쪽"],
          ])}
          <div className="design-quick-actions">
            <button
              className="b-button b-button-small"
              onClick={() => setCopiedStyle(appearanceOf(first, viewport))}
            >
              스타일 복사
            </button>
            <button
              className="b-button b-button-small"
              disabled={!copiedStyle}
              onClick={() => copiedStyle && patch(copiedStyle)}
            >
              스타일 붙여넣기
            </button>
            <button
              className="b-button b-button-small"
              onClick={() =>
                patch(
                  Object.fromEntries(
                    APPEARANCE_KEYS.map((key) => [key, DESIGN_DEFAULTS[key]]),
                  ),
                )
              }
            >
              테마 외형으로 초기화
            </button>
          </div>
        </details>
        {nodes.every((node) => node.component === "image") && (
          <details open>
            <summary>이미지 자르기와 초점</summary>
            {choice("imageFit", "이미지 맞춤", [
              ["cover", "영역 채우기 · 자르기"],
              ["contain", "전체 이미지 맞춤"],
            ])}
            <div className="b-field-pair">
              {number("imageX", "이미지 가로 초점", 0, 100)}
              {number("imageY", "이미지 세로 초점", 0, 100)}
            </div>
            <p className="b-help">
              고정 높이를 지정한 뒤 초점 위치를 조절하세요.
            </p>
          </details>
        )}
        {nodes.length === 1 &&
          ["hero", "feature", "cta", "stat"].includes(first.component) && (
            <button
              className="b-button b-button-small"
              onClick={() => onAction("detach")}
            >
              내부 요소를 개별 편집
            </button>
          )}
        {disabled && (
          <p className="b-help">
            잠긴 요소를 선택했습니다. 레이어 잠금을 해제해 편집하세요.
          </p>
        )}
      </fieldset>
    </div>
  );
}
