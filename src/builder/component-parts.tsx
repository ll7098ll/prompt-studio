"use client";
import {
  useLayoutEffect,
  useRef,
  useState,
  useCallback,
  useContext,
  type ReactNode,
  type CSSProperties,
} from "react";
import { DEFAULT_LAYOUT, type Node, type Part, type Viewport } from "./model";
import { DEFINITIONS } from "./catalog";
import { FONT_STACKS } from "./theme";
import { useAssetURLs } from "./AssetProvider";
import { referencedAssetId, safeMediaURL } from "./asset-model";
import { PreviewEnvironment } from "./vendor/shadcn/environment";

export type PartInfo = {
  path: string;
  label: string;
  tag: string;
  text: string;
  canText: boolean;
  parent: string | null;
  depth: number;
  visible: boolean;
};
export const PART_EVENT = "studio-parts-changed";
type PartIndex = { roles: Map<string, number>; authored: Map<Element, string> };
const pinnedPartTargets = new WeakMap<Element, Map<string, HTMLElement | SVGElement>>();
// Temporary text animation markup must not retarget saved child-index paths.
export function preservePartTargets(root: Element, parts: Node["parts"]) {
  const targets = new Map<string, HTMLElement | SVGElement>();
  for (const path of Object.keys(parts ?? {})) {
    const target = partElement(root, path);
    if (target) targets.set(path, target);
  }
  pinnedPartTargets.set(root, targets);
  return () => { if (pinnedPartTargets.get(root) === targets) pinnedPartTargets.delete(root); };
}
export function partPath(
  element: Element,
  root: Element,
  existing?: Node["parts"],
  index?: PartIndex,
): string | null {
  if (index?.authored.has(element)) return index.authored.get(element)!;
  if (!index)
    for (const path of Object.keys(existing ?? {}))
      if (partElement(root, path) === element) return path;
  const count = (role: string) =>
    index
      ? (index.roles.get(role) ?? 0)
      : root.querySelectorAll(`[data-part-id="${role}"],[data-slot="${role}"]`)
          .length;
  const slot =
    element.getAttribute("data-part-id") ?? element.getAttribute("data-slot");
  if (slot && /^[a-zA-Z0-9_.-]{1,100}$/.test(slot) && count(slot) === 1)
    return `slot.${slot}`;
  const stable = element.getAttribute("data-part-path");
  if (stable && /^p(?:\.\d{1,4}){1,24}$/.test(stable)) return stable;
  const indices: number[] = [];
  let current: Element | null = element;
  while (current && current !== root) {
    if (!current.parentElement) return null;
    indices.unshift(
      Array.from(current.parentElement.children).indexOf(current),
    );
    current = current.parentElement;
    if (current !== root && current) {
      const role =
        current.getAttribute("data-part-id") ??
        current.getAttribute("data-slot");
      if (role && /^[a-zA-Z0-9_.-]{1,70}$/.test(role) && count(role) === 1) {
        const path = `slot.${role}.child.${indices.join(".")}`;
        if (path.length <= 105) return path;
      }
    }
  }
  return current === root && indices.length ? `p.${indices.join(".")}` : null;
}
export function partElement(
  root: Element,
  path: string,
): HTMLElement | SVGElement | null {
  const pinned = pinnedPartTargets.get(root)?.get(path);
  if (pinned && root.contains(pinned)) return pinned;
  if (/^slot\.[a-zA-Z0-9_.-]{1,100}$/.test(path)) {
    const direct = root.querySelector(
      `[data-part-id="${path.slice(5)}"],[data-slot="${path.slice(5)}"]`,
    );
    if (direct) return direct as HTMLElement | SVGElement;
    const legacy = /^(slot\..+)\.child((?:\.\d+)+)$/.exec(path);
    let element: Element | null | undefined = legacy
      ? partElement(root, legacy[1])
      : null;
    for (const index of legacy?.[2].slice(1).split(".") ?? [])
      element = element?.children[Number(index)];
    return (element as HTMLElement | SVGElement | null) ?? null;
  }
  if (!/^p(?:\.\d{1,4}){1,24}$/.test(path)) return null;
  const stable = root.querySelector(`[data-part-path="${path}"]`);
  if (stable) return stable as HTMLElement | SVGElement;
  let element: Element | undefined = root;
  for (const index of path.split(".").slice(1))
    element = element?.children[Number(index)];
  return (element as HTMLElement | SVGElement) ?? null;
}
export function directText(element: Element): Text | undefined {
  // Playback time and other live values can be styled, but must remain bound
  // to their runtime rather than becoming a frozen authored text override.
  if (element.hasAttribute("data-part-dynamic")) return undefined;
  return Array.from(element.childNodes).find(
    (n): n is Text => n.nodeType === 3 && !!n.textContent?.trim(),
  );
}
export function boundTextChange(
  node: Node,
  element: Element,
  text: string,
): { key: string; value: string } | null {
  if (
    node.component === "table" &&
    element.getAttribute("data-text-prop") === "rows"
  ) {
    const row = Number(element.getAttribute("data-text-row")),
      col = Number(element.getAttribute("data-text-col"));
    const rows = String(node.props.rows)
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    if (rows[row] !== undefined) {
      const cells = rows[row].split("|");
      cells[col] = text.replace(/[\r\n]+/g, " ").replace(/\|/g, "｜");
      rows[row] = cells.join("|");
      return { key: "rows", value: rows.join("\n") };
    }
  }
  const original = directText(element)?.textContent?.trim();
  if (!original) return null;
  const candidates = DEFINITIONS[node.component].fields
    .filter((field) => field.type === "text" || field.type === "textarea")
    .flatMap((field) => {
      const source = String(node.props[field.key]);
      if (source.trim() === original) return [{ key: field.key, value: text }];
      const segments = source.split(/(\n|\|)/);
      const matches = segments.flatMap((value, index) =>
        index % 2 === 0 && value.trim() === original ? [index] : [],
      );
      if (matches.length !== 1) return [];
      segments[matches[0]] = text.replace(/[\r\n]+/g, " ").replace(/\|/g, "｜");
      return [{ key: field.key, value: segments.join("") }];
    });
  return candidates.length === 1 ? candidates[0] : null;
}
const names: Record<string, string> = {
  H1: "제목",
  H2: "제목",
  H3: "소제목",
  H4: "소제목",
  P: "본문",
  BUTTON: "버튼",
  A: "링크",
  IMG: "이미지",
  SVG: "아이콘",
  INPUT: "입력창",
  TEXTAREA: "입력 영역",
  SELECT: "선택 메뉴",
  LABEL: "입력 제목",
  LI: "목록 항목",
  TH: "열 제목",
  TD: "표 셀",
  SPAN: "문구",
  STRONG: "강조 문구",
  SMALL: "보조 문구",
  DIV: "영역",
  SECTION: "구역",
  ARTICLE: "카드",
  NAV: "탐색 영역",
  FORM: "폼",
  SUMMARY: "펼침 제목",
  BLOCKQUOTE: "인용문",
  UL: "목록",
  TABLE: "표",
  HEADER: "헤더",
  FOOTER: "하단",
  B: "강조 문구",
  I: "장식",
  HR: "구분선",
  PROGRESS: "진행률",
  H5: "작은 제목",
  H6: "작은 제목",
  FIGURE: "미디어 영역",
  FIGCAPTION: "캡션",
  VIDEO: "영상",
  AUDIO: "오디오",
  CANVAS: "그래픽 캔버스",
  DIALOG: "대화상자",
  DETAILS: "펼침 영역",
  OL: "순서 목록",
  DL: "설명 목록",
  DT: "용어",
  DD: "설명",
  TBODY: "표 본문",
  THEAD: "표 머리",
  TR: "표 행",
  EM: "기울임 문구",
  CODE: "코드",
  PRE: "코드 영역",
  TIME: "시간",
  MARK: "강조",
  OUTPUT: "결과",
  PATH: "벡터 경로",
  RECT: "벡터 사각형",
  CIRCLE: "벡터 원",
  ELLIPSE: "벡터 타원",
  LINE: "벡터 선",
  POLYLINE: "벡터 연결선",
  POLYGON: "벡터 다각형",
  G: "벡터 그룹",
  TEXT: "벡터 문구",
};
export function discoverParts(
  root: HTMLElement,
  existing?: Node["parts"],
): PartInfo[] {
  const elements = Array.from(root.querySelectorAll("*"));
  const index: PartIndex = { roles: new Map(), authored: new Map() };
  for (const el of elements)
    for (const role of new Set([
      el.getAttribute("data-part-id"),
      el.getAttribute("data-slot"),
    ]))
      if (role) index.roles.set(role, (index.roles.get(role) ?? 0) + 1);
  for (const path of Object.keys(existing ?? {})) {
    const el = partElement(root, path);
    if (el && !index.authored.has(el)) index.authored.set(el, path);
  }
  return elements
    .filter((el) => {
      const tag = el.tagName.toUpperCase();
      return (
        !!names[tag] &&
        !el.classList.contains("ui-parts-marker") &&
        !el.closest("defs,clipPath,mask,symbol") &&
        el.closest(".ui-node") === root
      );
    })
    .flatMap((el) => {
      const path = partPath(el, root, existing, index);
      if (!path) return [];
      const text = directText(el)?.textContent ?? "",
        tag = el.tagName.toUpperCase();
      return [
        {
          path,
          tag,
          text,
          canText: !!directText(el),
          parent:
            el.parentElement && el.parentElement !== root
              ? partPath(el.parentElement, root, existing, index)
              : null,
          depth: (() => {
            let n = 0,
              p = el.parentElement;
            while (p && p !== root) {
              n++;
              p = p.parentElement;
            }
            return n;
          })(),
          visible:
            !!el.getClientRects().length &&
            root.ownerDocument.defaultView?.getComputedStyle(el).visibility !==
              "hidden",
          label: `${names[tag]}${el.getAttribute("data-part-label") ? ` · ${el.getAttribute("data-part-label")}` : text.trim() ? ` · ${text.trim().slice(0, 32)}` : el.getAttribute("aria-label") ? ` · ${el.getAttribute("aria-label")}` : ""}`,
        },
      ];
    });
}
export function resolvedPart(part: Part | undefined, viewport: Viewport) {
  return {
    ...DEFAULT_LAYOUT,
    ...part?.layout,
    ...(viewport !== "mobile" ? part?.responsive.tablet : {}),
    ...(viewport === "desktop" ? part?.responsive.desktop : {}),
  };
}
function color(value: string) {
  return value.startsWith("theme:") ? `var(--ui-${value.slice(6)})` : value;
}
export function partStyles(part: Part, viewport: Viewport): CSSProperties {
  const l = resolvedPart(part, viewport);
  const authored = {
    ...part.layout,
    ...(viewport !== "mobile" ? part.responsive.tablet : {}),
    ...(viewport === "desktop" ? part.responsive.desktop : {}),
  };
  return {
    ...(l.x || l.y || l.rotation
      ? {
          transform: `translate(${l.x}px,${l.y}px) rotate(${l.rotation}deg)`,
          transformOrigin: "center",
        }
      : {}),
    ...(l.widthMode === "fixed"
      ? { width: l.width, maxWidth: "none", minWidth: 0, flex: "0 0 auto" }
      : {}),
    ...(l.widthMode === "fixed" || l.heightMode === "fixed"
      ? { boxSizing: "border-box" }
      : {}),
    ...(authored.widthMode === "fill"
      ? { width: "100%", maxWidth: "100%", minWidth: 0 }
      : {}),
    ...(authored.widthMode === "content"
      ? { width: "fit-content", maxWidth: "100%" }
      : {}),
    ...(l.heightMode === "fixed" ? { height: l.height, minHeight: 0 } : {}),
    ...(l.fillColor ? { background: color(l.fillColor) } : {}),
    ...(l.textColor ? { color: color(l.textColor) } : {}),
    ...(l.strokeColor || l.strokeWidth
      ? {
          border: `${l.strokeWidth}px solid ${color(l.strokeColor) || "currentColor"}`,
        }
      : {}),
    ...(l.cornerRadius >= 0 ? { borderRadius: l.cornerRadius } : {}),
    ...(authored.opacity !== undefined ? { opacity: l.opacity } : {}),
    ...(l.fontSize ? { fontSize: l.fontSize } : {}),
    ...(l.fontWeight ? { fontWeight: l.fontWeight } : {}),
    ...(l.lineHeight ? { lineHeight: l.lineHeight } : {}),
    ...(authored.letterSpacing !== undefined
      ? { letterSpacing: l.letterSpacing }
      : {}),
    ...(l.textAlign !== "inherit" ? { textAlign: l.textAlign } : {}),
    ...(l.shadow !== "inherit"
      ? {
          boxShadow:
            l.shadow === "none"
              ? "none"
              : l.shadow === "soft"
                ? "0 4px 16px #00000012"
                : l.shadow === "medium"
                  ? "0 12px 32px #00000024"
                  : "0 24px 56px #00000038",
        }
      : {}),
    ...(authored.imageFit ? { objectFit: l.imageFit } : {}),
    ...(authored.imageX !== undefined || authored.imageY !== undefined
      ? { objectPosition: `${l.imageX}% ${l.imageY}%` }
      : {}),
    ...(authored.padding !== undefined ? { padding: l.padding } : {}),
    ...(authored.gap !== undefined ? { gap: l.gap } : {}),
    ...(authored.margin !== undefined ? { margin: l.margin } : {}),
    ...Object.fromEntries(
      [
        "paddingTop",
        "paddingRight",
        "paddingBottom",
        "paddingLeft",
        "marginTop",
        "marginRight",
        "marginBottom",
        "marginLeft",
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius",
      ].flatMap((key) =>
        authored[key as keyof typeof authored] !== undefined
          ? [[key, authored[key as keyof typeof authored]]]
          : [],
      ),
    ),
    ...(authored.fontFamily && authored.fontFamily !== "inherit"
      ? {
          fontFamily:
            authored.fontFamily === "body"
              ? "var(--ui-font)"
              : authored.fontFamily === "heading"
                ? "var(--ui-heading-font)"
                : authored.fontFamily === "numeric"
                  ? "var(--ui-numeric-font)"
                  : FONT_STACKS[authored.fontFamily],
        }
      : {}),
    ...(authored.display && authored.display !== "original"
      ? { display: authored.display }
      : {}),
    ...(authored.overflow && authored.overflow !== "original"
      ? { overflow: authored.overflow }
      : {}),
    ...(authored.direction ? { flexDirection: authored.direction } : {}),
    ...(authored.align
      ? {
          alignItems: {
            start: "flex-start",
            end: "flex-end",
            center: "center",
            stretch: "stretch",
          }[authored.align],
        }
      : {}),
    ...(authored.justify
      ? {
          justifyContent: {
            start: "flex-start",
            end: "flex-end",
            center: "center",
            "space-between": "space-between",
            "space-around": "space-around",
          }[authored.justify],
        }
      : {}),
    ...(authored.wrap !== undefined
      ? { flexWrap: authored.wrap ? "wrap" : "nowrap" }
      : {}),
    ...(authored.columns
      ? { gridTemplateColumns: `repeat(${authored.columns},minmax(0,1fr))` }
      : {}),
    ...(authored.svgFill ? { fill: color(authored.svgFill) } : {}),
    ...(authored.svgStroke ? { stroke: color(authored.svgStroke) } : {}),
    ...(authored.svgStrokeWidth !== undefined
      ? { strokeWidth: authored.svgStrokeWidth }
      : {}),
  };
}
// Authored part edits are applied to the same content in editor, preview and export.
// Only direct text nodes and validated CSS properties change; no HTML is accepted.
export default function ComponentParts({
  node,
  viewport,
  children,
}: {
  node: Node;
  viewport: Viewport;
  children: ReactNode;
}) {
  const root = useRef<HTMLSpanElement>(null);
  const outerEnvironment = useContext(PreviewEnvironment);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null,
  );
  const markerRef = useCallback((element: HTMLSpanElement | null) => {
    root.current = element;
    setPortalContainer(element?.parentElement ?? null);
  }, []);
  const urls = useAssetURLs();
  useLayoutEffect(() => {
    if (!node.parts || !Object.keys(node.parts).length) return;
    const el = root.current!.parentElement!;
    const originals = new Map<
      Element,
      {
        properties: Map<
          string,
          { value: string; priority: string; applied: string }
        >;
        text?: Text;
        value?: string;
        appliedText?: string;
        attributes: Map<
          string,
          { value: string | null; applied: string | null }
        >;
      }
    >();
    const apply = () => {
      for (const [path, part] of Object.entries(node.parts ?? {})) {
        const target = partElement(el, path);
        if (!target) continue;
        const text = directText(target);
        if (!originals.has(target))
          originals.set(target, {
            properties: new Map(),
            text,
            value: text?.textContent ?? undefined,
            attributes: new Map(),
          });
        const styles = partStyles(part, viewport);
        if (
          !styles.display &&
          (styles.width || styles.height) &&
          el.ownerDocument.defaultView!.getComputedStyle(target).display ===
            "inline"
        )
          styles.display = "inline-block";
        for (const [key, value] of Object.entries(styles)) {
          const property = key.replace(
            /[A-Z]/g,
            (char) => `-${char.toLowerCase()}`,
          );
          const unitless = [
            "opacity",
            "fontWeight",
            "lineHeight",
            "strokeWidth",
          ].includes(key);
          const css =
            typeof value === "number" && !unitless
              ? `${value}px`
              : String(value);
          const original = originals.get(target)!;
          if (!original.properties.has(property))
            original.properties.set(property, {
              value: target.style.getPropertyValue(property),
              priority: target.style.getPropertyPriority(property),
              applied: "",
            });
          if (target.style.getPropertyValue(property) !== css)
            target.style.setProperty(property, css, "important");
          original.properties.get(property)!.applied =
            target.style.getPropertyValue(property);
        }
        if (text && part.text !== undefined && text.textContent !== part.text)
          text.textContent = part.text;
        if (part.text !== undefined)
          originals.get(target)!.appliedText = part.text;
        for (const [key, raw] of Object.entries(part.attributes ?? {})) {
          if (key === "src" && target.tagName !== "IMG") continue;
          if (key === "alt" && target.tagName !== "IMG") continue;
          if (key === "href" && target.tagName !== "A") continue;
          if (
            key === "placeholder" &&
            !["INPUT", "TEXTAREA"].includes(target.tagName)
          )
            continue;
          const id = key === "src" ? referencedAssetId(raw) : undefined;
          const value =
            key === "src" ? (id ? (urls[id] ?? "") : safeMediaURL(raw)) : raw;
          const attrs = originals.get(target)!.attributes;
          if (!attrs.has(key))
            attrs.set(key, { value: target.getAttribute(key), applied: "" });
          if (key === "src" && !value) target.removeAttribute(key);
          else target.setAttribute(key, value);
          attrs.get(key)!.applied = target.getAttribute(key);
        }
      }
    };
    apply();
    const observer = new el.ownerDocument.defaultView!.MutationObserver(() => {
      observer.disconnect();
      apply();
      observer.observe(el, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    });
    observer.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
    });
    el.ownerDocument.dispatchEvent(new Event(PART_EVENT));
    return () => {
      observer.disconnect();
      for (const [target, original] of originals) {
        for (const [key, saved] of original.attributes)
          if (target.getAttribute(key) === saved.applied) {
            if (saved.value === null) target.removeAttribute(key);
            else target.setAttribute(key, saved.value);
          }
        const styled = target as HTMLElement | SVGElement;
        for (const [property, saved] of original.properties) {
          if (styled.style.getPropertyValue(property) !== saved.applied)
            continue;
          if (saved.value)
            styled.style.setProperty(property, saved.value, saved.priority);
          else styled.style.removeProperty(property);
        }
        if (
          original.text?.isConnected &&
          original.value !== undefined &&
          original.text.textContent === original.appliedText
        )
          original.text.textContent = original.value;
      }
    };
  }, [node.parts, node.props, node.content, viewport, urls]);
  return (
    <PreviewEnvironment.Provider
      value={{ container: portalContainer ?? outerEnvironment.container }}
    >
      {children}
      <span
        ref={markerRef}
        hidden
        aria-hidden="true"
        className="ui-parts-marker"
        style={{ display: "none" }}
      />
    </PreviewEnvironment.Provider>
  );
}
