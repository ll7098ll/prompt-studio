"use client";
import { useEffect, useState } from "react";
import {
  discoverParts,
  PART_EVENT,
  partElement,
  resolvedPart,
  type PartInfo,
} from "./component-parts";
import {
  isLocked,
  type Part,
  type PartLayout,
  type Project,
  type Viewport,
} from "./model";
import { DEFINITIONS } from "./catalog";
import { elementSize } from "./geometry";
import { AssetField } from "./AssetPanel";
import { editProject } from "./model";

export type PartSelection = { id: string; path: string } | null;
function authored(
  part: Part | undefined,
  viewport: Viewport,
  key: keyof PartLayout,
) {
  if (viewport === "desktop" && part?.responsive.desktop?.[key] !== undefined)
    return "desktop";
  if (viewport !== "mobile" && part?.responsive.tablet?.[key] !== undefined)
    return "tablet";
  if (part?.layout[key] !== undefined) return "mobile";
  return "default";
}
const originNames = {
  desktop: "데스크톱 수정",
  tablet: "태블릿 수정",
  mobile: "기본 화면 수정",
  default: "원래 스타일",
};
export default function PartsPanel({
  project,
  id,
  doc,
  viewport,
  selected,
  onSelect,
  onPatch,
  onReset,
  commit,
}: {
  project: Project;
  id: string | null;
  doc: Document | null;
  viewport: Viewport;
  selected: PartSelection;
  onSelect: (part: PartSelection) => void;
  onPatch: (path: string, patch: PartLayout, text?: string) => void;
  onReset: (path: string, key?: keyof PartLayout) => void;
  commit: (project: Project) => void;
}) {
  const [parts, setParts] = useState<PartInfo[]>([]),
    [query, setQuery] = useState(""),
    [onlyChanged, setOnlyChanged] = useState(false),
    [listPage, setListPage] = useState({ key: "", index: 0 });
  useEffect(() => {
    if (!doc) return;
    let request = 0;
    const refresh = () => {
      cancelAnimationFrame(request);
      request = requestAnimationFrame(() => {
        const root = id ? doc.getElementById(id) : null,
          next = root
            ? discoverParts(root, id ? project.nodes[id]?.parts : undefined)
            : [];
        setParts((old) =>
          JSON.stringify(old) === JSON.stringify(next) ? old : next,
        );
      });
    };
    refresh();
    doc.addEventListener(PART_EVENT, refresh);
    const root = id ? doc.getElementById(id) : null;
    const observer =
      root && doc.defaultView
        ? new doc.defaultView.MutationObserver(refresh)
        : null;
    if (root)
      observer?.observe(root, {
        subtree: true,
        childList: true,
        attributes: true,
        attributeFilter: ["hidden", "open", "data-state"],
      });
    return () => {
      cancelAnimationFrame(request);
      observer?.disconnect();
      doc.removeEventListener(PART_EVENT, refresh);
    };
  }, [doc, id, project, viewport]);
  if (
    !id ||
    !project.nodes[id] ||
    DEFINITIONS[project.nodes[id].component].container
  )
    return null;
  const node = project.nodes[id],
    part =
      selected?.id === id
        ? parts.find((p) => p.path === selected.path)
        : undefined;
  const override = part ? node.parts?.[part.path] : undefined,
    layout = resolvedPart(override, viewport);
  const root = doc?.getElementById(id),
    target = root && part ? partElement(root, part.path) : null;
  const computed = target
    ? doc?.defaultView?.getComputedStyle(target)
    : undefined;
  const size = target ? elementSize(target as HTMLElement) : null;
  const current =
    viewport === "mobile" ? override?.layout : override?.responsive[viewport];
  const chain: PartInfo[] = [];
  for (let p = part, count = 0; p && count < 24; count++) {
    chain.unshift(p);
    p = parts.find((candidate) => candidate.path === p!.parent);
  }
  const hasOverride = (path: string) => {
    const value = node.parts?.[path];
    return (
      !!value &&
      (!!Object.keys(value.layout).length ||
        Object.values(value.responsive).some(
          (item) => Object.keys(item).length,
        ) ||
        value.text !== undefined ||
        !!Object.keys(value.attributes ?? {}).length)
    );
  };
  const source = (key: keyof PartLayout) => (
    <span className="parts-property-source">
      <small>{originNames[authored(override, viewport, key)]}</small>
      <button
        type="button"
        className="b-text-button"
        aria-label={`내부 ${propertyLabel(key)} 초기화`}
        disabled={current?.[key] === undefined}
        onClick={() => part && onReset(part.path, key)}
      >
        ↺
      </button>
    </span>
  );
  const numeric = (
    key: keyof PartLayout,
    label: string,
    min: number,
    max: number,
    step = 1,
  ) => {
    let value = layout[key];
    if (authored(override, viewport, key) === "default" && computed) {
      const actual = Number.parseFloat(
        computed.getPropertyValue(
          key.replace(/[A-Z]/g, (char) => `-${char.toLowerCase()}`),
        ),
      );
      if (key === "width" || key === "height") value = size?.[key];
      else if (key === "lineHeight")
        value = Number.isFinite(actual)
          ? actual / Number.parseFloat(computed.fontSize)
          : undefined;
      else if (key === "cornerRadius")
        value = Number.parseFloat(computed.borderTopLeftRadius);
      else if (key === "strokeWidth")
        value = Number.parseFloat(computed.borderTopWidth);
      else if (key === "svgStrokeWidth")
        value = Number.parseFloat(computed.strokeWidth);
      else if (Number.isFinite(actual)) value = actual;
    }
    const shown =
      typeof value === "number" && Number.isFinite(value)
        ? Math.round(value * 100) / 100
        : "";
    return (
      <div className="parts-property" key={key}>
        <label className="b-field">
          {label}
          <input
            key={`${part?.path}-${key}-${shown}`}
            aria-label={`내부 ${label}`}
            type="number"
            defaultValue={shown}
            placeholder="자동"
            min={min}
            max={max}
            step={step}
            onBlur={(e) => {
              if (!e.currentTarget.value.trim() || !part) return;
              const n = Number(e.currentTarget.value);
              if (Number.isFinite(n) && n !== shown)
                onPatch(part.path, {
                  [key]: Math.max(min, Math.min(max, n)),
                  ...(key === "width"
                    ? { widthMode: "fixed" }
                    : key === "height"
                      ? { heightMode: "fixed" }
                      : {}),
                });
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") e.currentTarget.blur();
            }}
          />
        </label>
        {source(key)}
      </div>
    );
  };
  const choice = (
    key: keyof PartLayout,
    label: string,
    options: [string, string][],
  ) => (
    <div className="parts-property" key={key}>
      <label className="b-field">
        {label}
        <select
          aria-label={`내부 ${label}`}
          value={String(layout[key] ?? options[0][0])}
          onChange={(e) =>
            part && onPatch(part.path, { [key]: e.target.value })
          }
        >
          {options.map(([value, name]) => (
            <option key={value} value={value}>
              {name}
            </option>
          ))}
        </select>
      </label>
      {source(key)}
    </div>
  );
  const filtered = parts.filter(
    (p) =>
      p.label.toLowerCase().includes(query.toLowerCase()) &&
      (!onlyChanged || hasOverride(p.path)),
  );
  const listKey = `${id}-${query}-${onlyChanged}`,
    lastPage = Math.max(0, Math.ceil(filtered.length / 100) - 1);
  const pageIndex =
    listPage.key === listKey ? Math.min(listPage.index, lastPage) : 0;
  return (
    <div className="builder-panel-content parts-panel">
      <div className="b-section-title">
        컴포넌트 내부 편집<span>{parts.length}개 부분</span>
      </div>
      <p className="b-help">
        부분 목록 또는 Ctrl/⌘+클릭으로 선택하세요. 아이콘의 선·도형도 목록에서
        각각 편집할 수 있습니다.
      </p>
      {["video-player", "audio-player"].includes(node.component) &&
        node.props.editableControls !== true && (
          <div className="b-notice">
            현재 브라우저 기본 재생기를 사용합니다. 편집용 컨트롤로 바꾸면 재생
            버튼과 막대도 각각 조절할 수 있습니다.
            <button
              type="button"
              className="b-button b-button-small"
              disabled={isLocked(project, id)}
              onClick={() =>
                commit(
                  editProject(project, (next) => {
                    next.nodes[id].props.editableControls = true;
                  }),
                )
              }
            >
              재생 컨트롤 편집 켜기
            </button>
          </div>
        )}
      <input
        className="parts-search"
        aria-label="내부 요소 검색"
        placeholder="제목, 버튼, 아이콘 검색"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <label className="parts-filter">
        <input
          type="checkbox"
          checked={onlyChanged}
          onChange={(e) => setOnlyChanged(e.target.checked)}
        />
        수정한 부분만
      </label>
      <div className="parts-list" role="group" aria-label="컴포넌트 내부 요소">
        {filtered.slice(pageIndex * 100, (pageIndex + 1) * 100).map((p) => (
          <button
            key={p.path}
            aria-pressed={part?.path === p.path}
            onClick={() => onSelect({ id, path: p.path })}
            className={part?.path === p.path ? "active" : ""}
            style={{ paddingLeft: 9 + Math.min(p.depth, 6) * 9 }}
          >
            <span>{p.label}</span>
            <small>
              {!p.visible ? "숨겨짐 · " : ""}
              {hasOverride(p.path) ? "수정됨" : p.tag.toLowerCase()}
            </small>
          </button>
        ))}
        {!filtered.length && (
          <p className="b-help">검색 조건에 맞는 부분이 없습니다.</p>
        )}
      </div>
      {lastPage > 0 && (
        <nav
          className="parts-pagination"
          aria-label="내부 요소 목록 페이지"
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            justifyContent: "space-between",
            marginBlock: 8,
          }}
        >
          <button
            className="b-button b-button-small"
            disabled={pageIndex === 0}
            onClick={() => setListPage({ key: listKey, index: pageIndex - 1 })}
          >
            이전 부분
          </button>
          <span className="b-help">
            {pageIndex * 100 + 1}–
            {Math.min((pageIndex + 1) * 100, filtered.length)} /{" "}
            {filtered.length}
          </span>
          <button
            className="b-button b-button-small"
            disabled={pageIndex === lastPage}
            onClick={() => setListPage({ key: listKey, index: pageIndex + 1 })}
          >
            다음 부분
          </button>
        </nav>
      )}
      {part && (
        <fieldset disabled={isLocked(project, id)} className="b-fieldset">
          {!!Object.keys(override?.attributes ?? {}).length && (
            <button
              className="b-button b-button-small"
              onClick={() =>
                commit(
                  editProject(project, (next) => {
                    const value = next.nodes[id].parts?.[part.path];
                    if (value) delete value.attributes;
                  }),
                )
              }
            >
              부분 파일·링크 설정 복원
            </button>
          )}
          {part.tag === "IMG" && (
            <AssetField
              project={project}
              nodeId={id}
              partPath={part.path}
              field={{
                key: "src",
                label: "내부 이미지",
                type: "asset",
                assetKinds: ["image"],
              }}
              commit={commit}
            />
          )}
          {(
            [
              "title",
              ...(part.tag === "IMG" ? ["alt"] : []),
              ...(part.tag === "A" ? ["href"] : []),
              ...(["INPUT", "TEXTAREA"].includes(part.tag)
                ? ["placeholder"]
                : []),
            ] as (keyof NonNullable<Part["attributes"]>)[]
          ).map((key) => (
            <label className="b-field" key={key}>
              {
                {
                  title: "도움말",
                  alt: "대체 설명",
                  href: "링크",
                  placeholder: "입력 안내",
                  src: "이미지",
                }[key]
              }
              <input
                aria-label={`내부 ${{ title: "도움말", alt: "대체 설명", href: "링크", placeholder: "입력 안내", src: "이미지" }[key]}`}
                key={`${part.path}-${key}-${override?.attributes?.[key]}`}
                defaultValue={
                  override?.attributes?.[key] ?? target?.getAttribute(key) ?? ""
                }
                maxLength={2000}
                onBlur={(event) => {
                  const value = event.currentTarget.value;
                  if (
                    value ===
                    (override?.attributes?.[key] ??
                      target?.getAttribute(key) ??
                      "")
                  )
                    return;
                  if (
                    key === "href" &&
                    value &&
                    !/^(https?:\/\/|mailto:|tel:|#|\/(?!\/))[^\s<>]*$/i.test(
                      value,
                    )
                  ) {
                    event.currentTarget.setCustomValidity(
                      "HTTPS 주소 또는 /페이지 경로를 입력하세요.",
                    );
                    event.currentTarget.reportValidity();
                    return;
                  }
                  commit(
                    editProject(project, (next) => {
                      const n = next.nodes[id];
                      n.parts ??= {};
                      n.parts[part.path] ??= { layout: {}, responsive: {} };
                      n.parts[part.path].attributes ??= {};
                      n.parts[part.path].attributes![key] = value;
                    }),
                  );
                }}
                onChange={(event) => event.currentTarget.setCustomValidity("")}
              />
            </label>
          ))}
          <nav className="parts-breadcrumbs" aria-label="내부 선택 경로">
            <button onClick={() => onSelect(null)}>{node.name}</button>
            {chain.map((item) => (
              <button
                key={item.path}
                aria-current={item.path === part.path ? "location" : undefined}
                onClick={() => onSelect({ id, path: item.path })}
              >
                › {item.label.split(" · ")[0]}
              </button>
            ))}
          </nav>
          {["BUTTON", "SUMMARY"].includes(part.tag) && (
            <button
              className="b-button b-button-small"
              onClick={() => {
                if (
                  !target ||
                  !doc?.defaultView ||
                  !(target instanceof doc.defaultView.HTMLElement)
                )
                  return;
                target.setAttribute("data-studio-part-action", "true");
                try {
                  target.dispatchEvent(
                    new doc.defaultView.PointerEvent("pointerdown", {
                      bubbles: true,
                      button: 0,
                      pointerType: "mouse",
                      isPrimary: true,
                    }),
                  );
                  target.dispatchEvent(
                    new doc.defaultView.PointerEvent("pointerup", {
                      bubbles: true,
                      button: 0,
                      pointerType: "mouse",
                      isPrimary: true,
                    }),
                  );
                  target.click();
                } finally {
                  target.removeAttribute("data-studio-part-action");
                }
              }}
            >
              이 부분의 동작 실행
            </button>
          )}
          <div className="b-section-title">
            {part.label}
            <button
              className="b-button b-button-small"
              onClick={() => onSelect(null)}
            >
              전체 선택
            </button>
          </div>
          {!part.visible && (
            <p className="b-notice">
              숨겨진 부분입니다. 목록에서 스타일을 수정하거나 표시 방식을 복원할
              수 있습니다.
            </p>
          )}
          {part.canText && (
            <label className="b-field">
              부분 문구
              <textarea
                key={`${part.path}-${override?.text ?? part.text}`}
                aria-label="내부 문구"
                defaultValue={override?.text ?? part.text}
                maxLength={20000}
                onBlur={(e) => {
                  if (e.currentTarget.value !== (override?.text ?? part.text))
                    onPatch(part.path, {}, e.currentTarget.value);
                }}
              />
            </label>
          )}
          <p className="b-help">
            현재 범위:{" "}
            {viewport === "mobile"
              ? "기본 화면 · 모든 크기에 상속"
              : viewport === "tablet"
                ? "태블릿 이상"
                : "데스크톱"}
            . ↺는 현재 범위의 해당 수정만 지웁니다.
          </p>
          <div className="b-field-pair">
            {numeric("x", "가로 이동", -100000, 100000, 0.1)}
            {numeric("y", "세로 이동", -100000, 100000, 0.1)}
          </div>
          <div className="b-field-pair">
            {numeric("width", "너비", 1, 20000, 0.1)}
            {numeric("height", "높이", 1, 20000, 0.1)}
          </div>
          <div className="b-field-pair">
            {choice("widthMode", "너비 방식", [
              ["auto", "원래 크기"],
              ["content", "내용 맞춤"],
              ["fill", "부모 채움"],
              ["fixed", "고정 크기"],
            ])}
            {choice("heightMode", "높이 방식", [
              ["auto", "원래 높이"],
              ["fixed", "고정 높이"],
            ])}
          </div>
          <div className="b-field-pair">
            {numeric("rotation", "회전", -360, 360, 0.1)}
            {numeric("opacity", "불투명도", 0, 1, 0.05)}
          </div>
          <div className="b-field-pair">
            {numeric("fontSize", "글자 크기", 0, 400)}
            {numeric("fontWeight", "글자 굵기", 0, 900, 100)}
          </div>
          <div className="b-field-pair">
            {numeric("lineHeight", "행간", 0, 4, 0.05)}
            {numeric("letterSpacing", "자간", -20, 100, 0.1)}
          </div>
          {choice("fontFamily", "서체", [
            ["inherit", "원래 서체"],
            ["body", "테마 본문"],
            ["heading", "테마 제목"],
            ["numeric", "테마 숫자"],
            ["sans", "산세리프"],
            ["serif", "세리프"],
            ["mono", "고정폭"],
          ])}
          {choice("textAlign", "글자 정렬", [
            ["inherit", "원래 정렬"],
            ["left", "왼쪽"],
            ["center", "가운데"],
            ["right", "오른쪽"],
          ])}
          {(
            [
              ["fillColor", "배경"],
              ["textColor", "글자색"],
              ["strokeColor", "테두리색"],
            ] as const
          ).map(([key, label]) => (
            <div className="design-color" key={key}>
              <label>
                {label}
                <input
                  aria-label={`내부 ${label}`}
                  type="color"
                  value={layout[key].startsWith("#") ? layout[key] : "#7060cf"}
                  onChange={(e) =>
                    onPatch(part.path, { [key]: e.target.value })
                  }
                />
              </label>
              {source(key)}
            </div>
          ))}
          <div className="b-field-pair">
            {numeric("strokeWidth", "테두리 두께", 0, 30)}
            {numeric("cornerRadius", "모서리", -1, 1000)}
          </div>
          {choice("shadow", "그림자", [
            ["inherit", "원래 그림자"],
            ["none", "없음"],
            ["soft", "약하게"],
            ["medium", "중간"],
            ["strong", "강하게"],
          ])}
          <div className="b-field-pair">
            {numeric("padding", "안쪽 여백", 0, 240)}
            {numeric("gap", "요소 간격", 0, 160)}
          </div>
          <details className="parts-detail">
            <summary>방향별 여백과 모서리</summary>
            <div className="b-field-pair">
              {(
                [
                  ["paddingTop", "위 안쪽 여백"],
                  ["paddingRight", "오른쪽 안쪽 여백"],
                  ["paddingBottom", "아래 안쪽 여백"],
                  ["paddingLeft", "왼쪽 안쪽 여백"],
                  ["marginTop", "위 바깥 여백"],
                  ["marginRight", "오른쪽 바깥 여백"],
                  ["marginBottom", "아래 바깥 여백"],
                  ["marginLeft", "왼쪽 바깥 여백"],
                  ["borderTopLeftRadius", "왼쪽 위 모서리"],
                  ["borderTopRightRadius", "오른쪽 위 모서리"],
                  ["borderBottomLeftRadius", "왼쪽 아래 모서리"],
                  ["borderBottomRightRadius", "오른쪽 아래 모서리"],
                ] as const
              ).map(([key, label]) => numeric(key, label, 0, 1000))}
            </div>
          </details>
          <details className="parts-detail">
            <summary>내부 배치와 표시</summary>
            {choice("display", "표시 방식", [
              ["original", "원래 방식"],
              ["block", "블록"],
              ["inline-block", "인라인 블록"],
              ["flex", "가로·세로 배치"],
              ["grid", "그리드"],
              ["none", "숨기기"],
            ])}
            {choice("direction", "배치 방향", [
              ["column", "세로"],
              ["row", "가로"],
            ])}
            {numeric("columns", "그리드 열", 1, 6)}
            {choice("align", "교차축 정렬", [
              ["stretch", "채우기"],
              ["start", "시작"],
              ["center", "가운데"],
              ["end", "끝"],
            ])}
            {choice("justify", "주축 정렬", [
              ["start", "시작"],
              ["center", "가운데"],
              ["end", "끝"],
              ["space-between", "양 끝"],
              ["space-around", "균등 간격"],
            ])}
            <label className="parts-filter">
              <input
                type="checkbox"
                checked={layout.wrap}
                onChange={(e) => onPatch(part.path, { wrap: e.target.checked })}
              />
              여러 줄 배치
            </label>
            {choice("overflow", "넘친 내용", [
              ["original", "원래 방식"],
              ["visible", "보이기"],
              ["hidden", "자르기"],
              ["auto", "스크롤"],
            ])}
          </details>
          {["IMG", "VIDEO"].includes(part.tag) && (
            <details className="parts-detail" open>
              <summary>미디어 맞춤</summary>
              {choice("imageFit", "이미지 맞춤", [
                ["cover", "영역 채움"],
                ["contain", "전체 보임"],
              ])}
              <div className="b-field-pair">
                {numeric("imageX", "이미지 가로 초점", 0, 100)}
                {numeric("imageY", "이미지 세로 초점", 0, 100)}
              </div>
            </details>
          )}
          {[
            "SVG",
            "PATH",
            "RECT",
            "CIRCLE",
            "ELLIPSE",
            "LINE",
            "POLYLINE",
            "POLYGON",
            "G",
            "TEXT",
          ].includes(part.tag) && (
            <details className="parts-detail" open>
              <summary>벡터 색상과 선</summary>
              {(
                [
                  ["svgFill", "벡터 채움"],
                  ["svgStroke", "벡터 선 색"],
                ] as const
              ).map(([key, label]) => (
                <div className="parts-property" key={key}>
                  <label className="b-field">
                    {label}
                    <input
                      aria-label={`내부 ${label}`}
                      key={`${part.path}-${key}-${layout[key]}`}
                      defaultValue={layout[key] ?? ""}
                      placeholder="#RRGGBB / none / currentColor"
                      onBlur={(e) => {
                        const value = e.currentTarget.value.trim();
                        if (
                          /^(|none|currentColor|#[0-9a-fA-F]{6}|theme:(background|surface|foreground|muted|border|primary|onPrimary|soft))$/.test(
                            value,
                          )
                        ) {
                          if (value !== (layout[key] ?? ""))
                            onPatch(part.path, { [key]: value });
                        } else e.currentTarget.value = layout[key] ?? "";
                      }}
                    />
                  </label>
                  {source(key)}
                </div>
              ))}
              {numeric("svgStrokeWidth", "벡터 선 두께", 0, 30, 0.1)}
            </details>
          )}
          <button
            className="b-button b-button-small"
            onClick={() => onReset(part.path)}
          >
            부분 스타일 초기화
          </button>
          <p className="b-help">
            전체 초기화는 이 부분의 모든 화면 크기별 외형을 복원합니다. 문구는
            유지합니다. 영상 재생 막대처럼 브라우저가 그리는 기본 제어기는
            브라우저의 모양을 따릅니다.
          </p>
        </fieldset>
      )}
    </div>
  );
}
function propertyLabel(key: keyof PartLayout): string {
  const labels: Partial<Record<keyof PartLayout, string>> = {
    fontSize: "글자 크기",
    fontWeight: "글자 굵기",
    width: "너비",
    height: "높이",
    fillColor: "배경",
    textColor: "글자색",
    strokeColor: "테두리색",
    opacity: "불투명도",
    padding: "안쪽 여백",
    gap: "요소 간격",
    fontFamily: "서체",
    letterSpacing: "자간",
    lineHeight: "행간",
    display: "표시 방식",
    svgFill: "벡터 채움",
    svgStroke: "벡터 선 색",
    svgStrokeWidth: "벡터 선 두께",
    x: "가로 이동",
    y: "세로 이동",
    rotation: "회전",
    widthMode: "너비 방식",
    heightMode: "높이 방식",
    cornerRadius: "모서리",
    strokeWidth: "테두리 두께",
    shadow: "그림자",
    textAlign: "글자 정렬",
    paddingTop: "위 안쪽 여백",
    paddingRight: "오른쪽 안쪽 여백",
    paddingBottom: "아래 안쪽 여백",
    paddingLeft: "왼쪽 안쪽 여백",
    marginTop: "위 바깥 여백",
    marginRight: "오른쪽 바깥 여백",
    marginBottom: "아래 바깥 여백",
    marginLeft: "왼쪽 바깥 여백",
    borderTopLeftRadius: "왼쪽 위 모서리",
    borderTopRightRadius: "오른쪽 위 모서리",
    borderBottomLeftRadius: "왼쪽 아래 모서리",
    borderBottomRightRadius: "오른쪽 아래 모서리",
    direction: "배치 방향",
    columns: "그리드 열",
    align: "교차축 정렬",
    justify: "주축 정렬",
    overflow: "넘친 내용",
    imageFit: "이미지 맞춤",
    imageX: "이미지 가로 초점",
    imageY: "이미지 세로 초점",
  };
  return labels[key] ?? key;
}
