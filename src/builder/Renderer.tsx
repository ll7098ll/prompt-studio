"use client";
import { designStyle } from "./design-style";
import ComponentParts from "./component-parts";
import MoreContent from "./MoreContent";
import { MORE_CATALOG } from "./more-catalog";
import AdvancedContent from "./AdvancedContent";
import ShadcnContent, { SHADCN_COMPONENTS } from "./ShadcnContent";
import { NEW_COMPONENT_IDS } from "./visual-presets";
import { PreviewEnvironment } from "./vendor/shadcn/environment";
import { Card } from "./vendor/shadcn/card";
import { AssetProvider, useAssetSource } from "./AssetProvider";
import type { AssetSession } from "./asset-repository";
import MediaContent from "./MediaContent";
import ImageContent from "./ImageContent";
import StoryContent from "./StoryContent";
import MotionPlayback from "./MotionPlayback";
import { motionVariables, resolveMotion } from "./motion-settings";
/* eslint-disable @next/next/no-img-element -- This renderer previews user-authored external images at their specified dimensions. */

import {
  memo,
  useState,
  type CSSProperties,
  type ReactNode,
  useRef,
} from "react";
import {
  ArrowRight,
  Sparkles,
  Layers,
  Zap,
  Globe,
  ShieldCheck,
  ChartNoAxesCombined,
  Check,
  CircleCheck,
  LayoutDashboard,
  Folder,
  Users,
  Settings,
  Menu,
  Image as ImageIcon,
  Inbox,
} from "lucide-react";
import { DEFINITIONS } from "./catalog";
import { ExtendedContent } from "./ExtendedContent";
import {
  resolvedLayout,
  type Node,
  type Project,
  type Viewport,
} from "./model";
import { themeVariables } from "./theme";

const icons = {
  sparkles: Sparkles,
  layers: Layers,
  bolt: Zap,
  globe: Globe,
  shield: ShieldCheck,
  chart: ChartNoAxesCombined,
};
const list = (value: unknown) =>
  String(value ?? "")
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
const value = (node: Node, key: string) => String(node.props[key] ?? "");
export function safeHref(href: string): string | undefined {
  return /^(https:\/\/|#[a-zA-Z0-9_-])/.test(href) ? href : undefined;
}
function Brand({ name }: { name: string }) {
  return (
    <span className="ui-brand">
      <span className="ui-brand-mark" aria-hidden="true">
        <i />
        <i />
        <i />
        <i />
      </span>
      {name}
    </span>
  );
}
function Button({
  label,
  variant = "primary",
  href,
  disabled,
}: {
  label: string;
  variant?: string;
  href?: string;
  disabled?: boolean;
}) {
  const className = `ui-button ui-button-${variant}`;
  return safeHref(href ?? "") && !disabled ? (
    <a
      className={className}
      href={safeHref(href!)}
      target={href?.startsWith("https:") ? "_blank" : undefined}
      rel="noopener noreferrer"
    >
      {label}
      <ArrowRight size={16} />
    </a>
  ) : (
    <button type="button" className={className} disabled={disabled}>
      {label}
      {variant === "primary" && <ArrowRight size={16} />}
    </button>
  );
}
function Tabs({ node }: { node: Node }) {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const items = list(node.props.items).map((item) => item.split("|"));
  const selected = Math.min(active, items.length - 1);
  return (
    <div>
      <div className="ui-tabs-list" role="tablist" aria-label={node.name}>
        {items.map(([label], index) => (
          <button
            key={index}
            ref={(el) => {
              refs.current[index] = el;
            }}
            role="tab"
            id={`${node.id}-tab-${index}`}
            aria-controls={`${node.id}-panel-${index}`}
            aria-selected={selected === index}
            tabIndex={selected === index ? 0 : -1}
            onClick={() => setActive(index)}
            onKeyDown={(event) => {
              let next = index;
              if (event.key === "ArrowRight") next = (index + 1) % items.length;
              else if (event.key === "ArrowLeft")
                next = (index - 1 + items.length) % items.length;
              else if (event.key === "Home") next = 0;
              else if (event.key === "End") next = items.length - 1;
              else return;
              event.preventDefault();
              setActive(next);
              refs.current[next]?.focus();
            }}
          >
            {label}
          </button>
        ))}
      </div>
      {items.map(([, content], index) => (
        <div
          key={index}
          className="ui-tab-panel"
          id={`${node.id}-panel-${index}`}
          role="tabpanel"
          aria-labelledby={`${node.id}-tab-${index}`}
          hidden={index !== selected}
          tabIndex={0}
        >
          {content}
        </div>
      ))}
    </div>
  );
}
function Switch({ node }: { node: Node }) {
  const [checked, setChecked] = useState(Boolean(node.props.checked));
  return (
    <div className="ui-switch">
      <label id={`${node.id}-label`}>{value(node, "label")}</label>
      <button
        type="button"
        role="switch"
        aria-labelledby={`${node.id}-label`}
        aria-checked={checked}
        onClick={() => setChecked(!checked)}
      >
        <span />
      </button>
    </div>
  );
}
function DataTable({ node }: { node: Node }) {
  const [sort, setSort] = useState<{ col: number; desc: boolean }>({
    col: -1,
    desc: false,
  });
  const columns = value(node, "columns").split("|");
  const rows = list(node.props.rows).map((row, index) => ({
    cells: row.split("|"),
    sourceIndex: index,
  }));
  if (sort.col >= 0)
    rows.sort(
      (a, b) =>
        (a.cells[sort.col] ?? "").localeCompare(b.cells[sort.col] ?? "", "ko", {
          numeric: true,
        }) * (sort.desc ? -1 : 1),
    );
  return (
    <div className="ui-table">
      <div className="ui-table-title">{value(node, "title")}</div>
      {node.props.state === "default" ? (
        <div className="ui-table-scroll">
          <table>
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th
                    key={i}
                    aria-sort={
                      sort.col === i
                        ? sort.desc
                          ? "descending"
                          : "ascending"
                        : "none"
                    }
                  >
                    <button
                      onClick={() =>
                        setSort({ col: i, desc: sort.col === i && !sort.desc })
                      }
                    >
                      {col} {sort.col === i ? (sort.desc ? "↓" : "↑") : "↕"}
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map(({ cells: row, sourceIndex }) => (
                <tr
                  key={sourceIndex}
                  data-part-path={`p.0.1.0.1.${sourceIndex}`}
                >
                  {columns.map((_, j) => (
                    <td
                      key={j}
                      data-part-path={`p.0.1.0.1.${sourceIndex}.${j}`}
                      data-text-prop="rows"
                      data-text-row={sourceIndex}
                      data-text-col={j}
                    >
                      {row[j] ?? ""}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="ui-table-state" role="status">
          {node.props.state === "loading"
            ? "데이터를 불러오는 중…"
            : node.props.state === "error"
              ? "데이터를 불러오지 못했습니다."
              : "표시할 데이터가 없습니다."}
        </div>
      )}
    </div>
  );
}
function ImageBlock({ node }: { node: Node }) {
  const [failedSrc, setFailedSrc] = useState("");
  const { src, pending, missing } = useAssetSource(value(node, "src"));
  const failed = !!src && failedSrc === src;
  return (
    <div className="ui-image" style={{ aspectRatio: value(node, "ratio") }}>
      {src && !failed ? (
        <img
          src={src}
          alt={value(node, "alt")}
          onError={() => setFailedSrc(src)}
          style={{ aspectRatio: value(node, "ratio") }}
        />
      ) : (
        <div className="ui-placeholder" style={{ height: "100%" }}>
          <span>
            <ImageIcon size={26} />
            {pending ? "이미지를 불러오는 중…" : missing ? "원본 없음 · 자산 포함 ZIP을 가져오세요" : failed ? "이미지를 불러올 수 없습니다" : value(node, "alt")}
          </span>
        </div>
      )}
    </div>
  );
}
function Navbar({ node }: { node: Node }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <header className="ui-nav">
        <Brand name={value(node, "brand")} />
        <nav className="ui-nav-links" aria-label="주 메뉴">
          {list(node.props.items).map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </nav>
        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
          <Button label={value(node, "label")} />
          <button
            className="ui-nav-mobile ui-nav-link"
            aria-label="메뉴 열기"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <Menu size={20} />
          </button>
        </div>
      </header>
      {open && (
        <nav
          aria-label="모바일 메뉴"
          style={{ padding: "16px 24px", display: "grid", gap: 14 }}
        >
          {list(node.props.items).map((item, i) => (
            <span key={i}>{item}</span>
          ))}
        </nav>
      )}
    </>
  );
}
function Sidebar({ node }: { node: Node }) {
  const [active, setActive] = useState(0);
  const symbols = [
    LayoutDashboard,
    Folder,
    ChartNoAxesCombined,
    Users,
    Settings,
  ];
  return (
    <aside className="ui-sidebar">
      <Brand name={value(node, "brand")} />
      <nav aria-label="작업 공간 메뉴">
        {list(node.props.items).map((item, i) => {
          const Icon = symbols[i % symbols.length];
          return (
            <button
              key={i}
              aria-current={active === i ? "page" : undefined}
              onClick={() => setActive(i)}
            >
              <Icon />
              {item}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}

function Content({ node, preview }: { node: Node; preview: boolean }): ReactNode {
  if (["scroll-chapters", "multi-step-form", "rich-text"].includes(node.component)) return <StoryContent node={node} />;
  if (["image-lightbox", "image-compare", "image-hotspot"].includes(node.component) || (node.component === "gallery" && node.content?.items)) return <ImageContent node={node} preview={preview}/>;
  if (["video-player", "audio-player"].includes(node.component))
    return <MediaContent node={node} preview={preview} />;
  if ((NEW_COMPONENT_IDS as readonly string[]).includes(node.component))
    return <AdvancedContent node={node} />;
  if (
    node.appearance &&
    (node.appearance.renderer === "shadcn" ||
      (node.appearance.family && node.appearance.family !== "legacy")) &&
    SHADCN_COMPONENTS.includes(node.component) &&
    node.appearance.renderer !== "classic" &&
    (node.appearance.renderer === "shadcn" ||
      !Object.keys(node.parts ?? {}).some((key) => key.startsWith("p.")))
  )
    return <ShadcnContent node={node} />;
  const p = node.props;
  switch (node.component) {
    case "decoration": {
      const Icon = icons[p.icon as keyof typeof icons] ?? Sparkles;
      if (p.kind === "icon")
        return (
          <div className="ui-feature-icon">
            <Icon />
          </div>
        );
      if (p.kind === "eyebrow")
        return <span className="ui-eyebrow">{value(node, "text")}</span>;
      if (p.kind === "stat-detail")
        return (
          <small>
            <b style={{ color: "var(--ui-primary)", marginRight: 8 }}>
              {value(node, "text")}
            </b>
            {value(node, "detail")}
          </small>
        );
      return (
        <div className="ui-art" aria-label="프로젝트 성장 지표 예시">
          <div className="ui-orbit" />
          <div className="ui-orbit" />
          <div className="ui-orbit" />
          <div className="ui-art-card">
            <b>Your ideas, in motion.</b>
            <small>A LITTLE PROGRESS, EVERY DAY.</small>
            <div className="ui-art-line" />
            <div className="ui-art-line" />
            <div className="ui-art-chart">
              {[30, 45, 38, 62, 55, 80, 96].map((height, i) => (
                <i key={i} style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
          <div className="ui-art-chip">
            {value(node, "text")}
            <strong>{value(node, "detail")}</strong>
          </div>
        </div>
      );
    }
    case "shape":
      return (
        <div
          className="ui-shape"
          data-kind={String(p.kind)}
          aria-label={node.name}
        />
      );
    case "heading": {
      const Tag = p.level as "h1" | "h2" | "h3";
      return (
        <Tag className={`ui-heading ui-heading-${p.level}`}>
          {value(node, "text")}
        </Tag>
      );
    }
    case "text":
      return <p className="ui-text">{value(node, "text")}</p>;
    case "button":
      return (
        <Button
          label={p.state === "loading" ? "처리 중…" : value(node, "label")}
          variant={value(node, "variant")}
          href={value(node, "href")}
          disabled={p.state !== "default"}
        />
      );
    case "badge":
      return (
        <span className={`ui-badge ui-badge-${p.tone}`}>
          {value(node, "text")}
        </span>
      );
    case "input":
      return (
        <label className="ui-field">
          {value(node, "label")}
          <input
            type={value(node, "type")}
            placeholder={value(node, "placeholder")}
            required={Boolean(p.required)}
          />
        </label>
      );
    case "checkbox":
      return (
        <label className="ui-check">
          <input
            key={String(p.checked)}
            type="checkbox"
            defaultChecked={Boolean(p.checked)}
          />
          {value(node, "label")}
        </label>
      );
    case "switch":
      return <Switch key={`${node.id}-${p.checked}`} node={node} />;
    case "select":
      return (
        <label className="ui-field">
          {value(node, "label")}
          <select>
            {list(p.items).map((item, i) => (
              <option key={i}>{item}</option>
            ))}
          </select>
        </label>
      );
    case "divider":
      return <hr className="ui-divider" />;
    case "image":
      return <ImageBlock key={value(node, "src")} node={node} />;
    case "feature": {
      const Icon = icons[p.icon as keyof typeof icons] ?? Sparkles;
      return (
        <article className="ui-feature">
          <div className="ui-feature-icon">
            <Icon />
          </div>
          <h3>{value(node, "title")}</h3>
          <p>{value(node, "body")}</p>
        </article>
      );
    }
    case "stat":
      return (
        <div className="ui-stat">
          <span className="ui-stat-label">{value(node, "label")}</span>
          <strong>{value(node, "value")}</strong>
          <small>
            <b>{value(node, "change")}</b>
            {value(node, "body")}
          </small>
        </div>
      );
    case "tabs":
      return <Tabs node={node} />;
    case "accordion":
      return (
        <div className="ui-accordion">
          {list(p.items).map((item, i) => {
            const [question, ...answer] = item.split("|");
            return (
              <details key={i}>
                <summary>{question}</summary>
                <p>{answer.join("|")}</p>
              </details>
            );
          })}
        </div>
      );
    case "alert":
      return (
        <div className="ui-alert" data-tone={p.tone}>
          <CircleCheck size={20} />
          <div>
            <strong>{value(node, "title")}</strong>
            <p>{value(node, "body")}</p>
          </div>
        </div>
      );
    case "table":
      return <DataTable node={node} />;
    case "pricing":
      return (
        <article className="ui-pricing" data-featured={p.featured}>
          <h3>{value(node, "title")}</h3>
          <p>{value(node, "body")}</p>
          <div className="ui-price">
            {value(node, "price")} <small>{value(node, "period")}</small>
          </div>
          <ul>
            {list(p.items).map((item, i) => (
              <li key={i}>
                <Check />
                {item}
              </li>
            ))}
          </ul>
          <Button label={value(node, "label")} />
        </article>
      );
    case "testimonial":
      return (
        <article className="ui-testimonial">
          <blockquote>“{value(node, "quote")}”</blockquote>
          <b>{value(node, "name")}</b>
          <br />
          <small>{value(node, "role")}</small>
        </article>
      );
    case "empty":
      return (
        <div className="ui-empty">
          <Inbox />
          <h3>{value(node, "title")}</h3>
          <p>{value(node, "body")}</p>
        </div>
      );
    case "navbar":
      return <Navbar node={node} />;
    case "sidebar":
      return <Sidebar node={node} />;
    case "hero":
      return (
        <section className="ui-hero" data-visual={p.visual}>
          <div>
            <span className="ui-eyebrow">{value(node, "eyebrow")}</span>
            <h1>{value(node, "title")}</h1>
            <p>{value(node, "body")}</p>
            <div className="ui-hero-actions">
              <Button label={value(node, "label")} />
              <Button label={value(node, "secondary")} variant="ghost" />
            </div>
          </div>
          {p.visual && (
            <div className="ui-art" aria-label="프로젝트 성장 지표 예시">
              <div className="ui-orbit" />
              <div className="ui-orbit" />
              <div className="ui-orbit" />
              <div className="ui-art-card">
                <b>Your ideas, in motion.</b>
                <small>A LITTLE PROGRESS, EVERY DAY.</small>
                <div className="ui-art-line" />
                <div className="ui-art-line" />
                <div className="ui-art-chart">
                  {[30, 45, 38, 62, 55, 80, 96].map((height, i) => (
                    <i key={i} style={{ height: `${height}%` }} />
                  ))}
                </div>
              </div>
              <div className="ui-art-chip">
                작은 시작, 큰 변화<strong>+128% ↗</strong>
              </div>
            </div>
          )}
        </section>
      );
    case "cta":
      return (
        <section className="ui-cta">
          <h2>{value(node, "title")}</h2>
          <p>{value(node, "body")}</p>
          <Button label={value(node, "label")} />
        </section>
      );
    case "footer":
      return (
        <footer className="ui-footer">
          <div>
            <Brand name={value(node, "brand")} />
            <p>{value(node, "body")}</p>
          </div>
          <div className="ui-footer-links">
            {list(p.items).map((item, i) => (
              <span key={i}>{item}</span>
            ))}
          </div>
        </footer>
      );
    default:
      return MORE_CATALOG.some((def) => def.id === node.component) ? (
        <MoreContent key={JSON.stringify(node.props)} node={node} />
      ) : (
        <ExtendedContent node={node} />
      );
  }
}

// Document edits clone the tree. Compare primitive authored props so changing
// one text field does not rerender unrelated charts, forms or table rows.
const NodeContent = memo(Content, (previous, next) => {
  const a = previous.node,
    b = next.node;
  if (
    previous.preview !== next.preview ||
    a.id !== b.id ||
    a.component !== b.component ||
    JSON.stringify(a.content) !== JSON.stringify(b.content) ||
    a.appearance?.family !== b.appearance?.family ||
    a.appearance?.renderer !== b.appearance?.renderer ||
    Object.keys(a.parts ?? {}).some((k) => k.startsWith("p.")) !==
      Object.keys(b.parts ?? {}).some((k) => k.startsWith("p."))
  )
    return false;
  const keys = Object.keys(a.props);
  return (
    keys.length === Object.keys(b.props).length &&
    keys.every((key) => a.props[key] === b.props[key])
  );
});

export function Renderer({
  project,
  pageId,
  viewport,
  selected,
  selectedIds,
  onSelect,
  preview = false,
  capture = false,
  assetSession,
}: {
  project: Project;
  pageId: string;
  viewport: Viewport;
  selected?: string | null;
  selectedIds?: string[];
  onSelect?: (id: string) => void;
  preview?: boolean;
  capture?: boolean;
  assetSession?: AssetSession;
}) {
  const [portalRoot, setPortalRoot] = useState<HTMLDivElement | null>(null);
  const page =
    project.pages.find((item) => item.id === pageId) ?? project.pages[0];
  function render(id: string, parent?: Node): ReactNode {
    const node = project.nodes[id];
    const layout = resolvedLayout(node, viewport);
    const motion = resolveMotion(node, project.theme);
    if (layout.hidden) return null;
    const container = DEFINITIONS[node.component].container;
    const parentLayout = parent ? resolvedLayout(parent, viewport) : undefined;
    const style: CSSProperties = {
      ...({ "--motion-opacity": layout.opacity } as CSSProperties),
      ...motionVariables(motion),
      ...(container
        ? {
            display: node.component === "grid" ? "grid" : "flex",
            flexDirection: layout.direction,
            flexWrap: layout.wrap ? "wrap" : "nowrap",
            justifyContent:
              layout.justify === "start"
                ? "flex-start"
                : layout.justify === "end"
                  ? "flex-end"
                  : layout.justify,
            gridTemplateColumns: `repeat(${layout.columns},minmax(0,1fr))`,
            gap: layout.gap * project.theme.density,
            padding: layout.padding * project.theme.density,
            alignItems:
              layout.align === "start"
                ? "flex-start"
                : layout.align === "end"
                  ? "flex-end"
                  : layout.align,
            ...(node.component === "section"
              ? { maxWidth: layout.maxWidth }
              : {}),
          }
        : {}),
      ...(layout.margin
        ? {
            margin: layout.margin * project.theme.density,
            maxWidth:
              node.component === "section"
                ? `min(${layout.maxWidth}px, calc(100% - ${2 * layout.margin * project.theme.density}px))`
                : `calc(100% - ${2 * layout.margin * project.theme.density}px)`,
          }
        : {}),
      ...(layout.minHeight ? { minHeight: layout.minHeight } : {}),
      ...(parent?.component === "grid"
        ? { gridColumn: `span ${Math.min(layout.span, parentLayout!.columns)}` }
        : {}),
      ...(layout.widthMode !== "auto"
        ? {
            width:
              layout.widthMode === "fixed"
                ? layout.width
                : layout.widthMode === "content"
                  ? "fit-content"
                  : "100%",
            flex:
              layout.widthMode === "fill" && parentLayout?.direction === "row"
                ? "1 1 0%"
                : "0 0 auto",
            marginInline: layout.margin * project.theme.density,
            ...(layout.widthMode === "fill" ? { alignSelf: "stretch" } : {}),
          }
        : {}),
      ...designStyle(layout, parentLayout?.mode === "free", !!container),
      ...(node.component === "scroll-chapters" && node.props.sticky && parentLayout?.mode !== "free" ? { position: "sticky", top: Number(node.props.offset), zIndex: 5, alignSelf: "stretch" } : {}),
    };
    const Element =
      node.component === "card" &&
      node.appearance?.family &&
      node.appearance.family !== "legacy"
        ? Card
        : "div";
    return (
      <Element
        key={id}
        id={id}
        className={`ui-node ${container ? `ui-container ui-${node.component}` : ""}`}
        data-component={node.component}
        data-family={node.appearance?.family}
        data-motion={motion.preset}
        data-motion-source={motion.source}
        data-motion-mobile={motion.mobile}
        data-name={node.name}
        data-selected={
          !preview && (selectedIds ? selectedIds.includes(id) : selected === id)
        }
        data-layout={layout.mode}
        data-rotation={layout.rotation}
        data-sized={layout.heightMode === "fixed"}
        data-width-mode={layout.widthMode}
        data-custom-fill={!!layout.fillColor}
        data-custom-color={!!layout.textColor}
        data-custom-stroke={!!layout.strokeColor || !!layout.strokeWidth}
        data-custom-radius={layout.cornerRadius >= 0}
        data-custom-shadow={layout.shadow !== "inherit"}
        data-custom-font-size={!!layout.fontSize}
        data-custom-font-weight={!!layout.fontWeight}
        data-custom-line-height={!!layout.lineHeight}
        data-custom-letter-spacing={!!layout.letterSpacing}
        data-custom-text-align={layout.textAlign !== "inherit"}
        style={style}
        onClickCapture={
          preview
            ? undefined
            : (event) => {
                if ((event.target as Element).closest("[data-studio-part-action]")) return;
                const target = (
                  event.target as HTMLElement
                ).closest<HTMLElement>(".ui-node");
                if (target?.id !== id) return;
                event.preventDefault();
                event.stopPropagation();
                onSelect?.(id);
              }
        }
      >
        {container ? (
          node.children.length ? (
            node.children.map((child) => render(child, node))
          ) : !preview ? (
            <div className="ui-empty-container">
              {node.component === "page"
                ? "왼쪽 라이브러리에서 첫 요소를 추가하세요"
                : "이 영역을 선택하고 요소를 추가하세요"}
            </div>
          ) : null
        ) : (
          <ComponentParts node={node} viewport={viewport}>
            <NodeContent node={node} preview={preview && !capture} />
          </ComponentParts>
        )}
      </Element>
    );
  }
  return (
    <AssetProvider assets={project.assets} session={assetSession} eager={capture}>
    <PreviewEnvironment.Provider value={{ container: portalRoot }}>
      <div
        ref={setPortalRoot}
        className={`ui-root ${preview ? "" : "ui-edit"} ${project.theme.mode === "dark" ? "studio-dark" : ""}`}
        data-pack-type={!!project.theme.typography}
        data-pack-surface={!!project.theme.surface}
        data-pack-texture={project.theme.surface?.texture}
        data-pack-mobile-motion={project.theme.motion?.mobile}
        data-capture={capture}
        style={themeVariables(project.theme) as CSSProperties}
      >
        {render(page.rootId)}
        {preview && !capture && <MotionPlayback root={portalRoot} project={project} selectedIds={selectedIds}/>}
      </div>
    </PreviewEnvironment.Provider>
    </AssetProvider>
  );
}
