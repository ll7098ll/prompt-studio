// Low-specificity defaults allow node and stable-part overrides to win.
export const DESIGN_PACK_CSS = `
:where(.ui-root[data-pack-type=true]) :where(.ui-node:not([data-custom-font-size=true]):not([data-family]:not([data-family=legacy])):not([data-family]:not([data-family=legacy]) *))>.ui-heading-h1{font-size:var(--pack-heading-size)}
:where(.ui-root[data-pack-type=true]) :where(.ui-node:not([data-custom-font-weight=true]):not([data-family]:not([data-family=legacy])):not([data-family]:not([data-family=legacy]) *))>.ui-heading{font-weight:var(--pack-heading-weight)}
:where(.ui-root[data-pack-type=true]) :where(.ui-node:not([data-custom-line-height=true]):not([data-family]:not([data-family=legacy])):not([data-family]:not([data-family=legacy]) *))>.ui-heading{line-height:var(--pack-heading-leading)}
:where(.ui-root[data-pack-type=true]) :where(.ui-node:not([data-custom-letter-spacing=true]):not([data-family]:not([data-family=legacy])):not([data-family]:not([data-family=legacy]) *))>.ui-heading{letter-spacing:var(--pack-heading-tracking)}
:where(.ui-root[data-pack-type=true]) :where(.ui-node:not([data-custom-font-size=true]):not([data-family]:not([data-family=legacy])):not([data-family]:not([data-family=legacy]) *))>.ui-text{font-size:var(--pack-body-size)}
:where(.ui-root[data-pack-type=true]) :where(.ui-node:not([data-custom-line-height=true]):not([data-family]:not([data-family=legacy])):not([data-family]:not([data-family=legacy]) *))>.ui-text{line-height:var(--pack-body-leading)}
:where(.ui-root[data-pack-type=true]) :where(.ui-node:not([data-custom-font-size=true]):not([data-family]:not([data-family=legacy])):not([data-family]:not([data-family=legacy]) *))>.ui-hero h1{font-size:var(--pack-heading-size)}
:where(.ui-root[data-pack-type=true]) :where(.ui-node:not([data-custom-font-weight=true]):not([data-family]:not([data-family=legacy])):not([data-family]:not([data-family=legacy]) *))>.ui-hero h1{font-weight:var(--pack-heading-weight)}
:where(.ui-root[data-pack-type=true]) :where(.ui-node:not([data-custom-line-height=true]):not([data-family]:not([data-family=legacy])):not([data-family]:not([data-family=legacy]) *))>.ui-hero h1{line-height:var(--pack-heading-leading)}
:where(.ui-root[data-pack-type=true]) :where(.ui-node:not([data-custom-letter-spacing=true]):not([data-family]:not([data-family=legacy])):not([data-family]:not([data-family=legacy]) *))>.ui-hero h1{letter-spacing:var(--pack-heading-tracking)}
:where(.ui-root[data-pack-type=true]) :where(.ui-node:not([data-custom-font-size=true]):not([data-family]:not([data-family=legacy])):not([data-family]:not([data-family=legacy]) *))>.ui-hero p{font-size:var(--pack-body-size)}
:where(.ui-root[data-pack-type=true]) :where(.ui-stat strong,.ui-price,.ui-table td){font-family:var(--ui-numeric-font);font-variant-numeric:tabular-nums}
:where(.ui-root[data-pack-surface=true]) :where(.ui-node:not([data-custom-shadow=true]):not([data-family]:not([data-family=legacy])):not([data-family]:not([data-family=legacy]) *)):is(.ui-card),
:where(.ui-root[data-pack-surface=true]) :where(.ui-node:not([data-custom-shadow=true]):not([data-family]:not([data-family=legacy])):not([data-family]:not([data-family=legacy]) *))>:is(.ui-feature,.ui-stat,.ui-pricing,.ui-testimonial){box-shadow:var(--pack-shadow)}
:where(.ui-root[data-pack-surface=true]) :where(.ui-node:not([data-custom-stroke=true]):not([data-family]:not([data-family=legacy])):not([data-family]:not([data-family=legacy]) *)):is(.ui-card),
:where(.ui-root[data-pack-surface=true]) :where(.ui-node:not([data-custom-stroke=true]):not([data-family]:not([data-family=legacy])):not([data-family]:not([data-family=legacy]) *))>:is(.ui-feature,.ui-stat,.ui-pricing,.ui-testimonial){border-style:var(--pack-border-style)}
.ui-root[data-pack-texture=paper]{background-image:radial-gradient(color-mix(in srgb,var(--ui-foreground) 7%,transparent) .7px,transparent .7px);background-size:5px 5px}
.ui-root[data-pack-texture=dots]{background-image:radial-gradient(color-mix(in srgb,var(--ui-primary) 25%,transparent) 1px,transparent 1px);background-size:22px 22px}
.ui-root[data-pack-texture=grid]{background-image:linear-gradient(color-mix(in srgb,var(--ui-border) 25%,transparent) 1px,transparent 1px),linear-gradient(90deg,color-mix(in srgb,var(--ui-border) 25%,transparent) 1px,transparent 1px);background-size:64px 64px}
.ui-node[data-motion-source=pack]{animation-duration:var(--pack-motion-duration);transition-duration:var(--pack-motion-duration)}
.ui-root[data-capture=true] [data-motion]{animation:none!important;transition:none!important;translate:none!important;scale:none!important;rotate:none!important}
@media(max-width:767px){.ui-root [data-motion-mobile=still]{animation:none!important;transition:none!important;translate:none!important;scale:none!important;rotate:none!important}}
`;
