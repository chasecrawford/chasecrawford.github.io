# Matrix redesign — chasecrawford.dev v4

**Date:** 2026-09-11
**Status:** approved
**Branch:** `feat/matrix-redesign`

## Problem

The site currently presents as a CRT terminal *window* — an ASCII banner, a fake PowerShell
title bar with minimize/maximize/close, a ticker marquee, a status bar, and a long scrolling
column of `command → output` blocks. It has accreted features (Magic 8-Ball, whoami table,
experience log, feeds list, beta-steps card) until the page reads as a list of everything
rather than a portfolio.

A redesign was produced in Claude Design and approved:

> `https://claude.ai/design/p/a3cd2b07-f849-4b91-a8f4-7b417d052b23` — `Matrix Portfolio.dc.html`

It replaces the window metaphor with a full-bleed Matrix treatment: digital rain behind
everything, four full-height scroll-snapped sections, and a near-monochrome green palette.
This spec defines how that export becomes the live site.

## What the export actually is

`.dc.html` is **not shippable HTML**. It is a Claude Design canvas document, and the
distinction drives most of the porting work:

- `support.js` supplies the canvas runtime — `DCLogic`, `<x-dc>`, `<sc-if>`, `<sc-for>`,
  `{{ binding }}` interpolation, and `style-hover="..."` pseudo-attributes. **None of it
  ships.** Every one of those constructs must be translated to plain HTML/CSS/JS.
- `image-slot.js` is the canvas image-placeholder element. Does not ship.
- `matrix-map.js` is the only genuinely reusable file — framework-free custom-element code.
- Styling is serialized as ~200 inline `style=` attributes. `style-hover` is not real HTML;
  shipping the export verbatim would produce a site with no working hover states and no
  maintainable stylesheet.

### Known defects in the export, to be corrected on port

These are artifacts of the design canvas, not design decisions. Implementation must not
reproduce them.

1. **Fabricated equity data.** `chartData()` builds the chart from hardcoded keyframes with a
   `Math.sin(i * 7.3) * 14` wobble baked in. The real site reads `json/paper-equity.json`.
   The port uses real data; the export's numbers are discarded entirely.
2. **Missing tile attribution.** The Leaflet map sets `attributionControl: false` while
   consuming Esri ArcGIS tiles. Esri's terms require visible attribution. Restore it.
3. **Boot screen is mouse-only.** `skipBoot` is wired to `onClick` alone, while
   `document.documentElement.style.overflowY = 'hidden'` locks scrolling. A keyboard user is
   trapped for the full sequence. Port must also skip on keydown.
4. **Infinite dependency poll.** `matrix-map.js` does `setTimeout(wait, 60)` forever waiting
   for `d3`/`topojson`/`L` globals. A failed load spins indefinitely. Needs a timeout.
5. **Dead code.** The script computes a `jobs` array and a `glitch()` helper that no markup
   renders — residue of the dropped experience table. Do not port either.
6. **Absolute self-link.** `resume.pdf` is linked as
   `https://chasecrawford.dev/pdf/resume.pdf`. Use a relative path.
7. **Canvas-internal link.** The beta link points at `./Blackjack Coach.dc.html`. Retarget to
   `/blackjack-coach/`.
8. **Inert Discord card.** Rendered as a non-interactive `<div>`. The live site's
   click-to-copy is behavior on a surviving element, not re-homed content — keep it.

## Decisions

Settled with the site owner before implementation.

| Question | Decision |
|---|---|
| Content the export drops | **Port as-is.** Retired sections stay retired. |
| Map dependencies | **Vendor the libs**, keep live street tiles, restore attribution. |
| New copy + Vegas photo | **All approved as written.** |
| File structure | **Rewrite `index.html` in place, self-contained.** |

### Content retired by this redesign

Removed deliberately, not by oversight: ASCII banner (`.banner` / `.banner-sm`), window chrome
(title bar, minimize/maximize/close, `#closeOverlay` disconnect screen), ticker marquee,
status bar, live clock, copyright year, `whoami --verbose` KV list (location, timezone,
uptime, skills, status, pronouns), the ASCII Magic 8-Ball, the `cat experience.log` work
history table, the standalone Bluesky feeds card, and the standalone Blackjack beta-steps
card. Feeds and beta each survive as a single line inside their project card.

### Content added

Approved verbatim:

- Boot line: `The Matrix has you...`
- Gallery frame `01 · LAS VEGAS '26` (`images/vegas-26.png`)
- bot-trader: `goal: beat SPY over full cycles. 19-yr backtest: +768% vs +615%, drawdown 34% vs 56%.`
- Projects counter: `2 open source · 1 in closed beta`
- Contact counter: `7 endpoints · reply time ~24h`

## Constraints from the existing site

- One hand-written `index.html`, no build step, served by GitHub Pages (`.nojekyll`, `CNAME`).
  The page *is* the file.
- `ch4ze-ui/` is a mirrored React component library that **does not ship**. It mirrors the
  *old* design and will be stale after this change. Out of scope — see Out of scope.
- `json/paper-equity.json` is refreshed weekly by a scheduled task **on a different machine**.
  Its shape is fixed and must not be changed by this work:
  `{ start_date, as_of, snapshots: [{ date, equity, spy_equity }], positions }`.
- `404.html`, `blackjack-coach/`, `resume.pdf/`, `pdf/`, `CNAME`, `.nojekyll` are not touched.

## Section A — foundation

Replace the `:root` token block and all component CSS.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#020803` | page surface |
| `--panel` | `rgba(0,18,7,0.75)` | card fill (over rain, with `backdrop-filter: blur(3px)`) |
| `--panel-solid` | `#001207` | contact cards |
| `--green` | `#00ff41` | primary accent |
| `--ink` | `#b6ffc9` | body text |
| `--dim-1` | `#8affa8` | secondary text |
| `--dim-2` | `#5ec97b` | tertiary / stack chips |
| `--dim-3` | `#3fa05c` | labels |
| `--dim-4` | `#2f7a4a` | separators, index numbers |
| `--amber` | `#ffd75e` | closed-beta badge, HOLDING list |
| `--blue` | `#4aa8d8` | SPY benchmark line |

Fonts: one Google Fonts request for `VT323` (project names), `Share Tech Mono` (display name,
strategy heading), `IBM Plex Mono` 400/500/600 (everything else). Keep the existing
`preconnect` pair.

**All inline styles from the export become CSS classes.** `style-hover="..."` becomes real
`:hover` rules.

## Section B — chrome preserved

Carried over from the current `index.html` unchanged:

- Google Tag Manager container `GTM-TMFW9FK` — **both** the head script (currently
  `index.html:5-9`) and the `<noscript>` iframe immediately after `<body>`
  (`index.html:685-688`).
- `<link rel="icon" href="images/favicon.svg">`
- `<title>Chase Crawford | Backend Developer | chasecrawford.dev</title>`
- `<meta name="description" content="Chase Crawford — Lead Backend Developer at Hatfield Media. Louisville, KY. PHP/Laravel, Vue, PostgreSQL, AWS. Shipping since 2008.">`
- `<meta name="viewport" content="width=device-width,initial-scale=1">`

Changed: `<meta name="theme-color">` from `#0a0a0a` to `#020803`.

## Section C — boot + hero

**Boot overlay.** Fixed, `z-index:60`, black. Types `The Matrix has you...` one character at a
time (70–160ms jitter) after a 2.6s delay, holds 1.8s, then fades opacity over 0.9s and sets
`display:none`. Blinking block cursor alongside.

`document.documentElement.style.overflowY = 'hidden'` during boot; restored on end.
Dismissable by **click anywhere on the overlay or any keydown** — both call the same
idempotent `endBoot()`.

**Background layers**, all `position:fixed`:

- `z-index:0` — `<canvas>` digital rain. Katakana + digits + `ZXCVBNM$+*#`, 18px column
  pitch, ~24fps, trail via `rgba(2,8,3,0.12)` overdraw. Resizes with the window.
- `z-index:5` — vignette, `radial-gradient(ellipse at center, transparent 55%, rgba(0,5,2,0.6) 100%)`.
- `z-index:6` — scanlines, 1px/3px repeating gradient with a 7s `flicker`. Pointer-events none.

Content wrapper: `z-index:2`, `max-width:1060px`, centered, `padding:0 24px`.

**Hero** (`min-height:100vh`, `scroll-snap-align:start`): two flex columns.

Left — `<h1>` with two `<span>` lines, CHASE / CRAWFORD, `Share Tech Mono`,
`clamp(44px, 8vw, 96px)`, green with two-layer glow. On boot end, each line resolves via
glyph-scramble (40ms interval, one character locked every 3 frames). Beneath: role line
`LEAD BACKEND DEVELOPER // HATFIELD MEDIA`, then four nav buttons — `./projects`, `./photos`,
`./contact`, `resume.pdf`. The last uses the **relative** path `pdf/resume.pdf`.

Right — `TRACE PROGRAM` panel, `aspect-ratio:4/3`, containing `<matrix-map>`.

## Section D — TRACE PROGRAM map

`js/matrix-map.js`, lifted from the export with the corrections below.

Behavior retained: a d3 `geoAlbersUsa` vector US map zooms and rotates into Louisville over
11s (`d3.interpolateZoom`, `easeCubicInOut`), county lines fading in as scale passes ~2.5×,
end-scale computed to match the Leaflet layer's zoom so the crossfade is seamless. Label
reads `ACQUIRING SIGNAL...` then `SIGNAL LOCKED > LOUISVILLE, KY · 38.2527°N 85.7585°W`.
Click replays.

Changes:

1. **Vendored dependencies.** Commit pinned Leaflet 1.9.4 (JS + CSS), d3 7.9.0, and
   topojson-client 3.1.0 under `vendor/`. Load from there, not unpkg.
2. **Vendored atlas, unmodified.** Commit `us-atlas@3.0.1/counties-10m.json` (~1 MB) whole to
   `vendor/` and load it from there instead of jsDelivr. Trimming to Kentucky-only counties
   was considered and **rejected** — full national county geometry is kept for fidelity.
   Note that **both** the state outlines and the county mesh come from this one file, so the
   entire vector layer waits on it — the trace cannot start early. The panel holds on
   `ACQUIRING SIGNAL...` until the atlas resolves, then begins the zoom. This is confined to
   the map custom element and must never block first paint or the boot sequence. Give the
   file a `<link rel="preload" as="fetch" crossorigin>` hint so it starts early. GitHub Pages
   serves it gzipped (~400 KB over the wire).
3. **Attribution restored.** Leave `attributionControl` on, or render an equivalent static
   credit line for Esri World_Street_Map.
4. **Bounded dependency wait.** Replace the unbounded `setTimeout(wait, 60)` poll with a
   ~5s deadline; on expiry hide the panel rather than spinning.
5. **Reduced motion.** Under `prefers-reduced-motion: reduce`, skip the 11s trace and render
   the Leaflet layer already locked on Louisville.

## Section E — projects

`min-height:100vh`, `scroll-snap-align:start`. Prompt line
`chase@localhost:~/projects ❯ ls --featured`, subtitle `2 open source · 1 in closed beta`.

Grid: `repeat(auto-fit, minmax(280px, 1fr))`, `grid-auto-rows: var(--proj-row, minmax(480px, auto))`.

Three cards — `001 bot-trader` (OSS), `002 feeds-by-chase` (● LIVE), `003 blackjack-coach`
(CLOSED BETA) — each with index, VT323 name, badge, description, a highlight line, stack
chips, and a bordered link footer.

**Results toggle.** bot-trader's `→ view results` flips a boolean that swaps cards 002/003
out and the equity panel in, via the export's CSS-variable mechanism:
`--graph-col`, `--graph-row`, `--others-hid`, `--graph-hid`, `--vr-disp`. Below 768px those
variables are redefined so everything simply stacks and the toggle is hidden.

**Equity panel — real data.** Port the existing loader from `index.html`
(`renderEquity`, currently around line 1309). Requirements:

- `fetch('json/paper-equity.json', {cache:'no-cache'})`; on any failure **hide the panel
  silently**, matching current behavior.
- Windows 7D / 30D / 60D, anchored to the **newest** snapshot (behavior established by commit
  `2358727`, must be preserved).
- Strategy line from `equity`, dashed benchmark line from `spy_equity`, filled area under
  strategy, dashed reference line at top.
- `open:` / `close:` values, hi/lo axis labels, four date labels across the x-axis.
- Caption: `$5,000 paper account · opened {start_date} · data through {as_of}` — dates derived
  from the JSON, never hardcoded.
- `HOLDING` row rendered from `positions`.

Link retargets: beta link → `/blackjack-coach/`.

## Section F — photos + contact

**Photos.** `chase@localhost:~/photos ❯ open *.jpg`. Grid
`repeat(auto-fit, minmax(200px, 1fr))`, square frames, each
`filter: grayscale(1) sepia(1) hue-rotate(65deg) saturate(1.6) brightness(0.95)` with a
caption below. Order: `01 · LAS VEGAS '26`, `02 · XMAS '25`, `03 · HALLOWEEN '25`,
`04 · LILO '25`, `05 · NOX '25`. Every `<img>` keeps a real `alt`, plus `loading="lazy"` on
frames below the fold.

**Contact.** `chase@localhost:~ ❯ contact --all`, subtitle `7 endpoints · reply time ~24h`.
Grid `repeat(auto-fit, minmax(220px, 1fr))` of label/value cards: EMAIL, PHONE, LINKEDIN,
BLUESKY, STEAM, XBOX, DISCORD. All external links keep `target="_blank" rel="noopener"`.
Discord is a `<button>` with click-to-copy, carried over from the current site.

## Accessibility / responsive requirements

- `prefers-reduced-motion: reduce` disables: rain animation (render one static frame or hide
  the canvas), scanline flicker, the name scramble, and the map trace. Boot still shows but
  resolves immediately.
- Scroll-snap `y mandatory` on `<html>`; **off** at ≤768px, per the export.
- No horizontal scroll at 390px or 1440px.
- Nav anchors move focus, not just scroll position.
- Contrast: body text `--ink` on `--bg` and label text `--dim-3` on card fills must both be
  checked; darken card fills rather than lightening brand green if a label falls short.

## Assets

| Path | Status |
|---|---|
| `images/vegas-26.png` | **Missing from repo.** In the design project only. |
| `images/xmas-25.jpg`, `halloween-25.jpg`, `lilo-25.jpg`, `nox-25.jpg` | present |
| `images/favicon.svg` | present, reused |
| `vendor/leaflet.js`, `vendor/leaflet.css`, `vendor/d3.min.js`, `vendor/topojson-client.min.js` | to add |
| `vendor/counties-10m.json` | to add — `us-atlas@3.0.1`, unmodified (~1 MB) |

`vegas-26.png` blocks only the photos section. `DesignSync` reads cap at 256 KB with no
download-to-disk, so it may need to be supplied manually. Implementation proceeds around it
and the frame is added last.

## Verification

No test framework in this repo. Verify with Playwright against a local static server:

1. Boot overlay appears, types the line, and clears on its own; also clears on click; also
   clears on keydown. Scrolling is restored afterward.
2. All four sections reachable via nav anchors and by scrolling.
3. Equity panel values match `json/paper-equity.json` for each of 7D/30D/60D; caption dates
   match `start_date` and `as_of`. With the fetch blocked, the panel is hidden and the other
   two project cards still render.
4. Map reaches `SIGNAL LOCKED`. With `vendor/` blocked, the panel hides within ~5s instead of
   hanging.
5. Zero console errors.
6. No horizontal scroll at 390px and at 1440px.
7. Screenshots at both widths for owner review.

## Out of scope

- `ch4ze-ui/` is not updated. It mirrors the retired design and does not ship, so nothing
  breaks — but it will describe a site that no longer exists. Follow-up work.
- `json/paper-equity.json` shape and its refresh task (runs on another machine) are unchanged.
- `404.html`, `/blackjack-coach/`, `/resume.pdf/`, `pdf/resume.pdf` are unchanged.
- No deploy. Work stays on `feat/matrix-redesign` until reviewed.

## Notes

The current `index.html` is the only record of several behaviors being retired. It remains in
git history on `main`; no separate archive copy is kept.
