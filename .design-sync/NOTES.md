# ch4ze-ui design-sync notes

Storybook-shape sync of `@chasecrawford/ch4ze-ui` (global `Ch4zeUI`) → claude.ai/design project `ch4ze-ui` (d43bb73c-72f4-4bfa-bac0-e43fd96c5fc2).

## Build invariants
- The DS ships a single Vite-compiled stylesheet at `ch4ze-ui/dist/ch4ze-ui.css` (tokens + all CSS-Module component styles). It is NOT auto-discovered — `cfg.cssEntry` MUST be `dist/ch4ze-ui.css` (resolved relative to the package root `ch4ze-ui/`), else previews render unstyled (`[CSS_RUNTIME]`).
- Converter entry: `--entry ch4ze-ui/dist/ch4ze-ui.js` (ESM), `--node-modules ch4ze-ui/node_modules` (has react/react-dom). The package's own source repo has no `node_modules/<pkg>`, hence `--entry`.
- Re-sync build: `npm --prefix ch4ze-ui run build` (dist) then the converter.

## Solo-phase learnings
- [GENERAL] Full-screen `position:fixed` overlays (DisconnectOverlay, BootLoader) don't center in the preview card's containment wrapper — the fixed element has no height to fill, so content collapses to the top. Fix: an OWNED preview (`.design-sync/previews/<Name>.tsx`) wrapping the component in `<div style={{position:'relative',height:700,overflow:'hidden',transform:'translateZ(0)'}}>` — the transform makes that box the containing block for the fixed overlay and the height gives it room to center. DisconnectOverlay uses this and matches.
- [GENERAL] `[RENDER_BLANK]` on a mostly-black card (dark DS) is usually a false positive: an almost-entirely-black overlay PNG compresses below the 5KB heuristic. Verify via the per-story compare, not the byte count.
- Component fix: `DisconnectOverlay` `btnRef.focus()` → `focus({ preventScroll: true })` so auto-focusing the reconnect button doesn't scroll the overlay (was clipping the title/message in capture). Committed to the library.
- Magic8Ball: `[RENDER_THIN]` (variants identical) is expected — the answer only appears after a click; static capture shows the idle ball, and the storybook reference is identically idle, so stories match.

## Skipped stories (with justification)
- `BootLoader` (both stories `Playing`, `Static`): a timer/animation-driven full-screen boot overlay with no meaningful static frame — its OWN storybook reference renders blank/black under the capture harness (animations fast-forwarded past anything visible). The component still ships fully functional in the bundle (`window.Ch4zeUI.BootLoader`) and animates live when the design agent uses it; only the static preview card is omitted.

## Re-sync risks
- The conventions header / README accuracy depends on the token + component names in `dist/ch4ze-ui.css` and the `components/<group>/<Name>/` tree — re-validate names if components are renamed.
- Gallery sample images load from `https://chasecrawford.dev/images/*.jpg` at runtime — if those move, the Gallery previews break (the design agent's renders too).
- JetBrains Mono is a remote `@import` (Google Fonts) — `[FONT_REMOTE]`, assumed served at runtime (same as the live site).

## Wave-1 [GENERAL] (folded)
- Preview cards render on the card template's hardcoded `body{background:#fff}` (emit.mjs, no config knob, no-fork). The DS is dark — its `html,body{background:var(--bg)}` loses to the template's inline rule on source order. GLOBAL FIX: `src/styles.css` adds `html body{background:var(--bg)}` (specificity 0,0,2 > the template's `body` 0,0,1) so the dark surface wins on every card. Do NOT fix this per-component (owned previews shadow the generated ones forever).
- The storybook reference gets its dark bg from `.storybook/preview.ts` `parameters.backgrounds.default='crt'` (#0a0a0a); the converter's compose() does not honor `backgrounds`, hence the need for the DS-CSS fix above so previews match without per-component wrappers.
