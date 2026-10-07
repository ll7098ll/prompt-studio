# Vendored shadcn/ui

Official `new-york-v4` Radix registry snapshot retrieved on 2026-10-06. Each registry URL and upstream file path is recorded in `sources.json`; upstream MIT terms are preserved in `LICENSE.md` and published as `/shadcn-license.txt`. Dependency versions are pinned by the repository lockfile.

Local adaptations:

- Imports resolve locally through `utils.ts` and `use-mobile.ts`.
- Portals use the current preview document through `PreviewEnvironment`, including captures and shared views.
- Responsive queries and sidebar shortcuts use the preview's window. Sidebar examples do not persist cookies in the editor.
- Carousel initialization subscribes to the Embla API and cleans up both event subscriptions and the deferred initial update.
- Sidebar skeleton width is deterministic for previews and captures.

`scripts/import-shadcn.mjs` refuses to overwrite an existing snapshot. Review and preserve these adaptations when updating source. `npm run styles` compiles the referenced Tailwind utilities into the generated `public/studio-ui.css`; both preview iframes and image capture load the same CSS.

The custom chart, tree, and swatch renderers belong to Prompt Studio. Other compound controls combine these imported primitives; they are not represented as separately published official shadcn components.
