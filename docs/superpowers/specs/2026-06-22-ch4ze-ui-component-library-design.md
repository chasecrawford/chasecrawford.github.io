# ch4ze-ui — Component Library Design

**Date:** 2026-06-22
**Status:** Approved (design); pending implementation plan
**Author:** Chase Crawford (with Claude)

## Purpose

Extract the design language and UI patterns of the `chasecrawford.dev` static site
(`index.html`) into a real, buildable React + TypeScript component library. The end goal
is to run `/design-sync` against the *library* (not the static site) so the
claude.ai/design agent can build on-brand "terminal/CRT"-themed UIs out of Chase's actual
components.

The static site is a single hand-authored `index.html` with inline CSS/JS. It is **not**
a design system `/design-sync` can consume (no `package.json`, no `dist/`, no components).
This project produces that consumable library.

### Intent: faithful capture

Every visible piece of the site is ported 1:1 in look and behavior — including the
signature showpieces (Magic-8-Ball, equity sparkline, ASCII banner, boot loader). The
library is **faithful but reusable**: components are prop-driven, with Chase's real content
as the default sample data, so the design agent can rebuild *chasecrawford.dev-style* pages
rather than only the exact existing page.

## Decisions (locked during brainstorming)

| Decision | Choice |
|---|---|
| Scope | Faithful capture of the whole site |
| Framework | React + TypeScript (claude.ai/design renders React; design-sync emits `.d.ts`) |
| Build tool | Vite (library mode) |
| Component explorer / verification | Storybook (design-sync gold path — previews diffed vs true screenshots) |
| Styling | CSS custom-property tokens + CSS Modules (per-component scoped) |
| Package name | `@chasecrawford/ch4ze-ui` |
| Global name | `Ch4zeUI` (the design agent references `window.Ch4zeUI.*`) |
| Granularity bias | More, smaller primitives where a pattern repeats |

## Location

The library lives in a new subdirectory of this repo: `ch4ze-ui/`. This keeps the design
source-of-truth (`index.html`) adjacent to the extraction. The library is a self-contained
package (own `package.json`, build, Storybook) so `/design-sync` runs cleanly inside it.
The existing static site is untouched.

## Architecture

```
ch4ze-ui/
  package.json            @chasecrawford/ch4ze-ui; ESM + UMD/IIFE (window.Ch4zeUI) builds
  vite.config.ts          library build → dist/ exposing window.Ch4zeUI.*
  tsconfig.json           strict
  .storybook/             Storybook config
  src/
    tokens/tokens.css     :root custom properties — SINGLE source of truth for tokens
    styles.css            public entry: @imports tokens + global resets + component CSS
    components/
      <Component>/
        <Component>.tsx
        <Component>.module.css
        <Component>.stories.tsx
        index.ts
    index.ts              barrel — re-exports all components; populates Ch4zeUI global
  sample-data/            paper-equity.json snapshot, default experience rows, 8-ball answers
  dist/                   build output consumed by /design-sync
```

### Core principle: prop-driven, content as default

Components take data through props; Chase's real content is the **default sample**. Examples:

- `<ExperienceTable rows={...} />` — defaults to Chase's job history.
- `<EquityChart data={...} />` — defaults to the bundled `paper-equity.json` snapshot.
- `<Banner text={...} />` — renders ASCII art, defaults to the CHASECRAWFORD DEV banner.

### Behavior is self-contained

No global scripts. Each behavior-heavy piece owns its state inside the component
(8-ball shake/flip, boot sequence + progress, live clock, copy-to-clipboard, ticker
self-cloning loop, gallery hover-to-color, equity 7D/30D toggle). Each is independently
renderable as a Storybook story — which is what design-sync screenshots for verification.

## Styling

- **Tokens** (`src/tokens/tokens.css`) hold the site's `:root` custom properties verbatim:
  colors `--bg #0a0a0a`, `--bg2 #0f0f0f`, `--ink #d8e4d8`, `--ink2 #6a7a6a`,
  `--line #1d2a1d`, `--green #00ff88`, `--cyan #00d4ff`, `--yellow #ffd60a`,
  `--magenta #ff4db8`, `--red #ff5c5c`; plus type scale (JetBrains Mono, base 13px,
  line-height 1.6) and a small spacing / letter-spacing set lifted from repeated values.
- Every component CSS Module references `var(--*)` — **no hard-coded hex**. This keeps the
  eventual design-sync conventions header honest (names that resolve).
- **CSS Modules** scope each component's styles to prevent class collisions when the design
  agent composes pages.
- **`src/styles.css`** is the public entry: it `@import`s the token layer + global resets
  (box-sizing, body font/color/bg, `::selection`). design-sync delivers only `styles.css`'s
  transitive `@import` closure to rendered designs, so the token layer MUST be reachable
  from it.
- **JetBrains Mono** is loaded via `@import` in the token layer (mirroring the current
  Google Fonts `<link>`), fallback `ui-monospace, monospace`.

## Build

- `vite.config.ts` builds `src/index.ts` in **library mode** with two outputs:
  - ESM build for normal consumers.
  - **UMD/IIFE build exposing `window.Ch4zeUI`** — the global design-sync's bundler reads.
- `react` / `react-dom` externalized as peer dependencies.
- Output → `dist/` (consumed by design-sync's converter).

## Component inventory (21 components, 5 groups)

Groups become folder names in the synced output (`components/<group>/<Name>/`).
**B** = ports behavior/state.

### `shell` — page frame & chrome
- `Shell` — CRT outer wrapper (scanline gradient bg, padding).
- `Window` — bordered window container (flex column); optional minimized state. **B**
- `TitleBar` — left status (`● LIVE`), center title, min/max/close controls
  (`onMinimize` / `onMaximize` / `onClose`). Window controls fold in here. **B**
- `StatusBar` — left / center / right segments + live clock. **B**

### `terminal` — command-line vocabulary
- `Prompt` — `user@host:path ❯ command --flags` line (repeats 6× on the site).
- `Output` — `.out` block; `dim` variant + inline `success / warn / info / key` token styling.
- `Banner` — ASCII art (full + responsive small); accepts text, defaults to site banner.
- `Caret` — blinking cursor. **B**
- `BootLoader` — full-screen boot sequence: log lines, percent, progress bar, skip. **B**

### `feedback` — controls & motion
- `Button` — terminal button (cc8 / skip / reconnect style); `variant`, `disabled`.
- `Chip` — bordered tag/label.
- `Ticker` — seamless infinite marquee (self-cloning loop). **B**

### `content` — data display (prop-driven, Chase's data as defaults)
- `KVList` — key/value grid (whoami); values may hold chips/links.
- `Card` — project card (`.proj-detail`): id, name, href, description, stack[], stats[],
  thesis callout (`Thesis` is a subpart of `Card`, not a separate export).
- `ExperienceTable` — job-history table; `rows[]`, defaults to Chase's log.
- `Gallery` — duotone photo grid; `frames[]` {src, label, hue}, hover-to-color. **B**
- `ContactLinks` — link grid + copy-to-clipboard variant. **B**
- `FeedList` — Bluesky feed link list (distinct layout from `ContactLinks`).

### `feature` — signature showpieces (full behavior ported)
- `Magic8Ball` — ASCII ball, shake→flip animation, `answers[]` (defaults to the 20 answers). **B**
- `EquityChart` — SVG sparkline + SPY benchmark, 7D/30D toggle, legend, holdings;
  `data` defaults to bundled `paper-equity.json`. **B**
- `DisconnectOverlay` — "CONNECTION TERMINATED" reconnect screen. **B**

## Testing & verification

Layered, appropriate to a visual component library:

1. **TypeScript strict** — clean `.d.ts` contracts (design-sync ships these as the API contract).
2. **Storybook builds without error**; every story renders.
3. **Story smoke test** — Vitest + Storybook test runner (or Playwright against static
   Storybook) asserts each story mounts without throwing.
4. **Interaction tests** for behavior-heavy components: 8-ball shake→answer, boot sequence
   completion, copy-to-clipboard, equity 7D/30D toggle, gallery hover.
5. **Visual fidelity** confirmed against the original `index.html` (ground truth).

TDD where it fits: write the story / render assertion before the component, since "the story
renders this state" is the testable contract for visual components.

## Out of scope

- Modifying the existing static site (`index.html` stays as-is, serving as ground truth).
- Running `/design-sync` itself — that is the *follow-up* once the library builds and its
  Storybook is green. This spec covers building the library only.
- Publishing the package to npm.

## Success criteria

- `ch4ze-ui/` builds: `dist/` contains an ESM build and a UMD/IIFE build exposing `window.Ch4zeUI`.
- All 21 components implemented, each with at least one Storybook story; behavior-heavy
  components have stories for their key states.
- Token layer reachable through `styles.css`'s `@import` closure; no hard-coded colors in
  component CSS.
- TypeScript strict passes; Storybook builds; story smoke tests pass.
- Each component visually matches its counterpart in `index.html`.
- The library is in a state where `/design-sync` can be run against it as the next step.
