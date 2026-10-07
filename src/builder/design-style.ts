import type { CSSProperties } from "react";
import type { Layout } from "./model";

function color(value: string) {
  return value.startsWith("theme:")
    ? `var(--ui-${value.slice(6)})`
    : value || undefined;
}
function axis(
  position: number,
  size: number,
  basis: number,
  anchor: Required<Layout>["anchorX"],
) {
  if (anchor === "end")
    return { position: `calc(100% - ${basis - position}px)`, size };
  if (anchor === "center")
    return { position: `calc(50% + ${position - basis / 2}px)`, size };
  if (anchor === "stretch")
    return { position, size: `max(1px, calc(100% - ${basis - size}px))` };
  if (anchor === "scale")
    return {
      position: `${(position / basis) * 100}%`,
      size: `${(size / basis) * 100}%`,
    };
  return { position, size };
}
export function designStyle(
  layout: Required<Layout>,
  freeChild: boolean,
  container: boolean,
): CSSProperties {
  const style: CSSProperties & Record<string, string | number | undefined> = {
    opacity: layout.opacity,
    transform: layout.rotation ? `rotate(${layout.rotation}deg)` : undefined,
    transformOrigin: "center center",
    ...(layout.heightMode === "fixed"
      ? { height: layout.height, minHeight: 0 }
      : {}),
    ...(layout.mode === "free" && container
      ? {
          display: "block",
          height: layout.height,
          minHeight: 0,
          overflow: layout.clip ? "hidden" : "visible",
          isolation: "isolate",
        }
      : {}),
    "--node-fill": color(layout.fillColor),
    "--node-color": color(layout.textColor),
    "--node-stroke": color(layout.strokeColor),
    "--node-stroke-width":
      layout.strokeColor || layout.strokeWidth
        ? `${layout.strokeWidth}px`
        : undefined,
    "--node-radius":
      layout.cornerRadius >= 0 ? `${layout.cornerRadius}px` : undefined,
    "--node-font-size": layout.fontSize ? `${layout.fontSize}px` : undefined,
    "--node-font-weight": layout.fontWeight || undefined,
    "--node-line-height": layout.lineHeight || undefined,
    "--node-letter-spacing": layout.letterSpacing
      ? `${layout.letterSpacing}px`
      : undefined,
    "--node-text-align":
      layout.textAlign !== "inherit" ? layout.textAlign : undefined,
    "--node-image-fit": layout.imageFit,
    "--node-image-position": `${layout.imageX}% ${layout.imageY}%`,
    "--node-shadow":
      layout.shadow === "inherit"
        ? undefined
        : layout.shadow === "none"
          ? "none"
          : layout.shadow === "soft"
            ? "0 4px 16px #00000012"
            : layout.shadow === "medium"
              ? "0 12px 32px #00000024"
              : "0 24px 56px #00000038",
  };
  if (container)
    Object.assign(style, {
      background: color(layout.fillColor),
      color: color(layout.textColor),
      borderColor: color(layout.strokeColor),
      borderWidth:
        layout.strokeColor || layout.strokeWidth
          ? layout.strokeWidth
          : undefined,
      borderStyle:
        layout.strokeColor || layout.strokeWidth ? "solid" : undefined,
      borderRadius: layout.cornerRadius >= 0 ? layout.cornerRadius : undefined,
      boxShadow: style["--node-shadow"],
    });
  if (freeChild) {
    const horizontal = axis(
      layout.x,
      layout.width,
      layout.basisWidth,
      layout.anchorX,
    );
    const vertical = axis(
      layout.y,
      layout.height,
      layout.basisHeight,
      layout.anchorY,
    );
    Object.assign(style, {
      position: "absolute",
      left: horizontal.position,
      top: vertical.position,
      width: horizontal.size,
      height: layout.heightMode === "fixed" ? vertical.size : undefined,
      maxWidth: "none",
      minWidth: 0,
      margin: 0,
      flex: "none",
      gridColumn: "auto",
      alignSelf: "auto",
    });
  }
  return style;
}

// Per-node variables must reset at every wrapper; styles never leak into children.
export const DESIGN_CSS = `
.ui-node{--node-fill:initial;--node-color:initial;--node-stroke:initial;--node-stroke-width:initial;--node-radius:initial;--node-font-size:initial;--node-font-weight:initial;--node-line-height:initial;--node-letter-spacing:initial;--node-text-align:initial;--node-shadow:initial;--node-image-fit:initial;--node-image-position:initial}
.ui-node[data-design=true]>:not(.ui-node){background:var(--node-fill,revert-layer);color:var(--node-color,revert-layer)}
.ui-node[data-custom-fill=true]>:not(.ui-node){background:var(--node-fill)!important}
.ui-node[data-custom-color=true]>:not(.ui-node){color:var(--node-color)!important}
.ui-node[data-custom-stroke=true]>:not(.ui-node){border:var(--node-stroke-width,0px) solid var(--node-stroke,var(--ui-border))!important}
.ui-node[data-custom-radius=true]>:not(.ui-node){border-radius:var(--node-radius)!important}
.ui-node[data-custom-shadow=true]>:not(.ui-node){box-shadow:var(--node-shadow)!important}
.ui-node[data-custom-font-size=true]>:not(.ui-node){font-size:var(--node-font-size)!important}
.ui-node[data-custom-font-weight=true]>:not(.ui-node){font-weight:var(--node-font-weight)!important}
.ui-node[data-custom-line-height=true]>:not(.ui-node){line-height:var(--node-line-height)!important}
.ui-node[data-custom-letter-spacing=true]>:not(.ui-node){letter-spacing:var(--node-letter-spacing)!important}
.ui-node[data-custom-text-align=true]>:not(.ui-node){text-align:var(--node-text-align)!important}
.ui-node[data-sized=true]>:not(.ui-node){width:100%;height:100%;min-height:0}
.ui-node[data-component=image][data-sized=true]>.ui-image{aspect-ratio:auto!important}
.ui-node[data-component=image] img{object-fit:var(--node-image-fit,cover);object-position:var(--node-image-position,50% 50%);border-radius:var(--node-radius,var(--ui-radius))}
.ui-shape{width:100%;height:100%;min-height:1px;background:var(--node-fill,var(--ui-primary))}
.ui-shape[data-kind=ellipse]{border-radius:50%!important}.ui-shape[data-kind=line]{height:2px!important;position:relative;top:50%}
.ui-node[data-layout=free]>.ui-empty-container{position:absolute;inset:16px;display:grid;place-items:center;pointer-events:none}
.design-surface .ui-edit .ui-node[data-selected=true]:after{display:none}
.design-surface .ui-edit .ui-node:hover{outline:none}
.design-surface .ui-edit .ui-node[data-selected=true]{outline:none}
.design-surface .ui-edit .ui-node{touch-action:none}
.design-overlay{position:fixed;inset:0;pointer-events:none;z-index:2147483000;font:12px Arial,sans-serif;color:#6752cc}
.design-outline{position:absolute;border:1.5px solid #7864dd;box-sizing:border-box;pointer-events:none}
.design-outline.is-locked{border-style:dashed;border-color:#7a8192}
.design-handle{position:absolute;border:1.5px solid #7864dd;background:white;border-radius:2px;padding:0;pointer-events:auto;touch-action:none;transform:translate(-50%,-50%);min-width:0;min-height:0}
.design-handle:focus-visible{outline:3px solid #bbadff}
.design-rotation{border-radius:50%;cursor:grab}
.design-size{position:absolute;top:100%;left:50%;transform:translate(-50%,8px);white-space:nowrap;background:#6752cc;color:white;padding:3px 7px;border-radius:4px}
.design-marquee{position:absolute;border:1px solid #7864dd;background:#7864dd18}
.design-guide{position:absolute;background:#ee5caa;pointer-events:none}
.design-drop{position:absolute;border:2px dashed #7864dd;background:#7864dd12}
.design-inline{position:absolute;pointer-events:auto;resize:none;border:2px solid #7864dd;outline:none;background:var(--ui-surface);color:var(--ui-foreground);padding:3px;white-space:pre-wrap;overflow:auto;box-sizing:border-box;font:inherit}
`;
