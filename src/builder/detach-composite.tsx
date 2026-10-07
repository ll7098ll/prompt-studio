import { createRoot } from "react-dom/client";
import { flushSync } from "react-dom";
import { Renderer } from "./Renderer";
import { PREVIEW_CSS } from "./preview-css";
import { boxInParent, elementSize } from "./geometry";
import {
  createNode,
  editProject,
  isLocked,
  resolvedLayout,
  type Layout,
  type Project,
  type Viewport,
} from "./model";
import { writeLayout } from "./design-commands";

function hex(value: string) {
  const parts = value.match(/[\d.]+/g)?.map(Number);
  if (!parts || parts.length < 3 || parts[3] === 0) return "";
  return (
    "#" +
    parts
      .slice(0, 3)
      .map((n) => Math.round(n).toString(16).padStart(2, "0"))
      .join("")
  );
}
export async function detachComposite(
  project: Project,
  id: string,
): Promise<Project> {
  const source = project.nodes[id];
  if (!source || isLocked(project, id)) return project;
  const p = source.props;
  const parts =
    source.component === "hero"
      ? [
          {
            selector: ".ui-eyebrow",
            component: "decoration",
            props: { kind: "eyebrow", text: p.eyebrow },
          },
          {
            selector: "h1",
            component: "heading",
            props: { text: p.title, level: "h1" },
          },
          {
            selector: ".ui-hero>div>p",
            component: "text",
            props: { text: p.body },
          },
          {
            selector: ".ui-hero-actions>:first-child",
            component: "button",
            props: { label: p.label },
          },
          {
            selector: ".ui-hero-actions>:last-child",
            component: "button",
            props: { label: p.secondary, variant: "ghost" },
          },
          ...(p.visual
            ? [
                {
                  selector: ".ui-art",
                  component: "decoration",
                  props: { kind: "hero" },
                },
              ]
            : []),
        ]
      : source.component === "feature"
        ? [
            {
              selector: ".ui-feature-icon",
              component: "decoration",
              props: { kind: "icon", icon: p.icon },
            },
            {
              selector: "h3",
              component: "heading",
              props: { text: p.title, level: "h3" },
            },
            { selector: "p", component: "text", props: { text: p.body } },
          ]
        : source.component === "cta"
          ? [
              {
                selector: "h2",
                component: "heading",
                props: { text: p.title, level: "h2" },
              },
              { selector: "p", component: "text", props: { text: p.body } },
              {
                selector: ".ui-button",
                component: "button",
                props: { label: p.label },
              },
            ]
          : source.component === "stat"
            ? [
                {
                  selector: ".ui-stat-label",
                  component: "text",
                  props: { text: p.label },
                },
                {
                  selector: "strong",
                  component: "text",
                  props: { text: p.value },
                },
                {
                  selector: "small",
                  component: "decoration",
                  props: {
                    kind: "stat-detail",
                    text: p.change,
                    detail: p.body,
                  },
                },
              ]
            : [];
  if (!parts.length)
    throw new Error("이 요소는 콘텐츠 속성에서 편집할 수 있습니다.");
  const children = parts.map((part) => {
    const node = createNode(part.component);
    Object.assign(node.props, part.props);
    return node;
  });
  const layouts: Record<string, Partial<Layout>> = {};
  const rootPage = project.pages.find((page) => {
    const visit = (key: string): boolean =>
      key === id || project.nodes[key].children.some(visit);
    return visit(page.rootId);
  })!;
  for (const [view, width] of [
    ["mobile", 390],
    ["tablet", 768],
    ["desktop", 1440],
  ] as [Viewport, number][]) {
    const frame = document.createElement("iframe");
    frame.title = "내부 요소 배치 측정";
    frame.setAttribute("aria-hidden", "true");
    Object.assign(frame.style, {
      position: "fixed",
      left: "-20000px",
      width: `${width}px`,
      height: "1200px",
      visibility: "hidden",
      pointerEvents: "none",
    });
    const loaded = new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(
        () => reject(new Error("내부 요소를 측정하지 못했습니다.")),
        8000,
      );
      frame.onload = () => {
        clearTimeout(timeout);
        resolve();
      };
    });
    frame.srcdoc = `<!doctype html><html><head><style>${PREVIEW_CSS}</style></head><body><div id="root"></div></body></html>`;
    document.body.append(frame);
    let root: ReturnType<typeof createRoot> | undefined;
    try {
      await loaded;
      const doc = frame.contentDocument!;
      root = createRoot(doc.getElementById("root")!);
      // Reveal a hidden component only in this measurement copy.
      const sample = structuredClone(project);
      sample.nodes[id].hidden = false;
      sample.nodes[id].responsive.tablet = {
        ...sample.nodes[id].responsive.tablet,
        hidden: false,
      };
      sample.nodes[id].responsive.desktop = {
        ...sample.nodes[id].responsive.desktop,
        hidden: false,
      };
      flushSync(() =>
        root!.render(
          <Renderer
            project={sample}
            pageId={rootPage.id}
            viewport={view}
            preview
            capture
          />,
        ),
      );
      await doc.fonts.ready;
      const wrapper = doc.getElementById(id);
      if (!wrapper)
        throw new Error("숨겨진 부모를 표시한 뒤 내부 요소 편집을 시작하세요.");
      const surface = wrapper.firstElementChild as HTMLElement;
      const size = elementSize(wrapper),
        style = doc.defaultView!.getComputedStyle(surface);
      layouts[view] = {
        ...resolvedLayout(source, view),
        mode: "free",
        heightMode: "fixed",
        height: Math.max(1, size.height),
        padding: 0,
        gap: 0,
        fillColor: hex(style.backgroundColor),
        strokeColor: hex(style.borderTopColor),
        strokeWidth: parseFloat(style.borderTopWidth) || 0,
        cornerRadius: parseFloat(style.borderRadius) || 0,
      };
      parts.forEach((part, index) => {
        const element = wrapper.querySelector<HTMLElement>(part.selector);
        if (!element) throw new Error("내부 요소를 찾지 못했습니다.");
        const box = boxInParent(element, wrapper),
          s = doc.defaultView!.getComputedStyle(element);
        writeLayout(children[index], view, {
          ...box,
          height: Math.max(1, box.height),
          width: Math.max(1, box.width),
          widthMode: "fixed",
          heightMode: "fixed",
          margin: 0,
          minHeight: 0,
          basisWidth: Math.max(1, size.width),
          basisHeight: Math.max(1, size.height),
          fontSize: Math.min(400, parseFloat(s.fontSize) || 0),
          fontWeight: Number(s.fontWeight) || 400,
          lineHeight: Math.min(
            4,
            (parseFloat(s.lineHeight) || parseFloat(s.fontSize) * 1.5) /
              parseFloat(s.fontSize),
          ),
          textColor: hex(s.color),
          textAlign:
            s.textAlign === "center"
              ? "center"
              : s.textAlign === "right"
                ? "right"
                : "left",
        });
      });
    } finally {
      root?.unmount();
      frame.remove();
    }
  }
  return editProject(project, (next) => {
    const node = next.nodes[id];
    node.component = "frame";
    node.props = {};
    node.children = children.map((child) => child.id);
    for (const view of ["mobile", "tablet", "desktop"] as const)
      writeLayout(node, view, layouts[view]);
    for (const child of children) next.nodes[child.id] = child;
  });
}
