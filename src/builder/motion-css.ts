// Keep authored layout transforms and legacy animation names stable.
export const MOTION_CSS = `
.ui-root .ui-node[data-motion]{animation-duration:var(--motion-duration,.7s);animation-delay:var(--motion-delay,0s);animation-timing-function:var(--motion-easing,ease);animation-iteration-count:var(--motion-iterations,1);transition-duration:var(--motion-duration,.25s)}
.ui-node[data-motion=lift]{animation-name:studio-lift;animation-fill-mode:both;transition:none}
.ui-node[data-motion=tilt]{animation-name:studio-tilt;animation-fill-mode:both;transition:none}
.ui-root:not(.ui-edit) .ui-node[data-motion=lift]:hover{translate:0 0}
.ui-root:not(.ui-edit) .ui-node[data-motion=tilt]:hover{rotate:0deg}
.ui-root .ui-node[data-motion-paused=true]{animation-play-state:paused!important}
.ui-root .ui-node[data-motion-status=still]{animation:none!important;transition:none!important;translate:none!important;rotate:none!important;scale:none!important}
@keyframes studio-fade{from{opacity:calc(var(--motion-opacity,1)*var(--motion-start-opacity,0))}to{opacity:var(--motion-opacity,1)}}
@keyframes studio-slide{from{opacity:calc(var(--motion-opacity,1)*var(--motion-start-opacity,0));translate:0 var(--motion-distance,20px)}to{opacity:var(--motion-opacity,1);translate:0 0}}
@keyframes studio-scale{from{opacity:calc(var(--motion-opacity,1)*var(--motion-start-opacity,0));scale:var(--motion-scale,.92)}to{opacity:var(--motion-opacity,1);scale:1}}
@keyframes studio-float{50%{translate:0 var(--motion-float,-8px)}}
@keyframes studio-pulse{50%{opacity:calc(var(--motion-opacity,1)*var(--motion-pulse,.7))}}
@keyframes studio-gradient{50%{background-position:var(--motion-travel,100%) 0}}
@keyframes studio-border{50%{outline:var(--motion-outline,2px) solid var(--ui-primary);outline-offset:3px}}
@keyframes studio-reveal{from{clip-path:inset(0 var(--motion-mask,100%) 0 0)}to{clip-path:inset(0 0 0 0)}}
@keyframes studio-glow{50%{box-shadow:0 0 var(--motion-glow,24px) color-mix(in srgb,var(--ui-primary) 40%,transparent)}}
@keyframes studio-lift{from{translate:0 0}to{translate:0 var(--motion-lift,-6px)}}
@keyframes studio-tilt{from{rotate:0deg}to{rotate:var(--motion-tilt,2deg)}}
.studio-motion-word{display:inline-block;max-width:100%;overflow-wrap:anywhere}
.ui-root[data-capture=true] .studio-motion-controls{display:none}
.studio-motion-controls{position:fixed;z-index:10000;bottom:12px;left:50%;transform:translateX(-50%);display:flex;align-items:center;gap:8px;max-width:calc(100% - 16px);padding:8px 10px;border:1px solid #455164;border-radius:10px;background:#17202f;color:#f4f7fb;font:12px/1.3 system-ui,sans-serif;box-shadow:0 4px 20px #0003}
.studio-motion-controls select{max-width:145px;min-width:0;background:#17202f;color:#f4f7fb;border:1px solid #657187;border-radius:4px;padding:4px;font:inherit}
.studio-motion-controls button{display:grid;place-items:center;flex-shrink:0;width:32px;height:32px;background:transparent;color:inherit;border:0;border-radius:4px;cursor:pointer}
.studio-motion-controls button:disabled{opacity:.45;cursor:default}.studio-motion-controls button:hover:not(:disabled){background:#35445b}
.studio-motion-controls :focus-visible{outline:2px solid #d9f968;outline-offset:3px}.studio-motion-controls output{min-width:84px;max-width:155px}
.studio-motion-slider{position:relative;display:flex;align-items:center;width:120px;min-width:50px;height:32px;touch-action:none;user-select:none}
.studio-motion-track{position:relative;flex-grow:1;background:#657187;height:4px;border-radius:3px}.studio-motion-range{position:absolute;background:#d9f968;height:100%;border-radius:3px}.studio-motion-thumb{display:block;width:14px;height:14px;border-radius:50%;background:#f4f7fb}
@media(max-width:480px){.studio-motion-controls{gap:4px;flex-wrap:wrap;justify-content:center;width:max-content}.studio-motion-controls select{max-width:115px}.studio-motion-slider{width:75px}.studio-motion-controls output{min-width:70px}}
@media(max-width:767px){.ui-root .ui-node[data-motion-mobile=still]{animation:none!important;transition:none!important;translate:none!important;scale:none!important;rotate:none!important}}
`;
