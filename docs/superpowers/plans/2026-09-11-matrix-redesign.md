# Matrix Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace chasecrawford.dev's CRT-window portfolio with the approved Claude Design "Matrix Portfolio" export — four full-height scroll-snapped sections over a digital-rain canvas.

**Architecture:** `index.html` is rewritten in place and stays self-contained (its own `<style>` and `<script>`); the site keeps its no-build, GitHub-Pages-served shape. Two new directories support it: `js/` for the `<matrix-map>` custom element, and `vendor/` for pinned copies of Leaflet, d3, topojson-client and the us-atlas county file. A Playwright suite is added at the repo root so each task has a real red→green cycle.

**Tech Stack:** Hand-written HTML/CSS/vanilla JS (no framework, no bundler) · Leaflet 1.9.4 · d3 7.9.0 · topojson-client 3.1.0 · Esri ArcGIS World_Street_Map raster tiles · `@playwright/test` + `http-server` (dev-only)

**Spec:** `docs/superpowers/specs/2026-09-11-matrix-redesign-design.md`

**Branch:** `feat/matrix-redesign` (already created; commit `e04eaae`)

---

## Global Constraints

Every task's requirements implicitly include this section.

**Source of truth for markup and visual styling** is the approved export. Fetch it whenever you need exact values:

```
DesignSync(method="get_file",
           projectId="a3cd2b07-f849-4b91-a8f4-7b417d052b23",
           path="Matrix Portfolio.dc.html")
```

The export is a Claude Design canvas document. `<x-dc>`, `<sc-if>`, `<sc-for>`, `{{ binding }}` and `style-hover="..."` are **canvas runtime constructs and must never appear in shipped output** — translate them to plain HTML, CSS `:hover` rules, and vanilla JS. `support.js` and `image-slot.js` do not ship.

**The old page is still readable** at `git show main:index.html` — use it for logic being carried over. Do not copy its markup or styling.

**Never reproduce these eight export defects** (spec §"Known defects"):

1. Fabricated equity data — use `json/paper-equity.json`, never the export's hardcoded keyframes.
2. `attributionControl: false` on an Esri tile layer — attribution stays on.
3. Boot skip wired to click only — must also skip on keydown.
4. `setTimeout(wait, 60)` unbounded dependency poll — needs a ~5s deadline.
5. Dead `jobs` array and `glitch()` helper — do not port.
6. `https://chasecrawford.dev/pdf/resume.pdf` absolute self-link — use `pdf/resume.pdf`.
7. `./Blackjack Coach.dc.html` link — use `/blackjack-coach/`.
8. Discord rendered as an inert `<div>` — it is a `<button>` with click-to-copy.

**Preserve verbatim from `git show main:index.html`:**

- GTM head script (`:5-9`) and GTM `<noscript>` iframe (`:685-688`), container `GTM-TMFW9FK`
- `<link rel="icon" href="images/favicon.svg" type="image/svg+xml">`
- `<title>Chase Crawford | Backend Developer | chasecrawford.dev</title>`
- `<meta name="description" content="Chase Crawford — Lead Backend Developer at Hatfield Media. Louisville, KY. PHP/Laravel, Vue, PostgreSQL, AWS. Shipping since 2008.">`
- `<meta name="viewport" content="width=device-width,initial-scale=1">`

**Changed:** `<meta name="theme-color">` becomes `#020803`.

**Do not touch:** `404.html`, `blackjack-coach/`, `resume.pdf/`, `pdf/`, `CNAME`, `.nojekyll`, `ch4ze-ui/`, `json/paper-equity.json`, `.design-sync/`.

**Approved copy — use these strings exactly:**

| Where | String |
|---|---|
| Boot | `The Matrix has you...` |
| Projects subtitle | `2 open source · 1 in closed beta` |
| Contact subtitle | `7 endpoints · reply time ~24h` |
| bot-trader note | `goal: beat SPY over full cycles. 19-yr backtest: +768% vs +615%, drawdown 34% vs 56%.` |
| Photo captions | `01 · LAS VEGAS '26`, `02 · XMAS '25`, `03 · HALLOWEEN '25`, `04 · LILO '25`, `05 · NOX '25` |

**Design tokens** — declare once on `:root` in Task 1; never hardcode these hex values again:

| Token | Value |
|---|---|
| `--bg` | `#020803` |
| `--panel` | `rgba(0,18,7,0.75)` |
| `--panel-solid` | `#001207` |
| `--green` | `#00ff41` |
| `--ink` | `#b6ffc9` |
| `--dim-1` | `#8affa8` |
| `--dim-2` | `#5ec97b` |
| `--dim-3` | `#3fa05c` |
| `--dim-4` | `#2f7a4a` |
| `--amber` | `#ffd75e` |
| `--blue` | `#4aa8d8` |
| `--line` | `rgba(var(--green-rgb),0.25)` |
| `--line-strong` | `rgba(var(--green-rgb),0.5)` |
| `--green-hover` | `#b3ffc9` |
| `--ink-bright` | `#d8ffe4` |
| `--nav-bg` | `#031208` |
| `--nav-bg-hover` | `#06240f` |
| `--panel-deep` | `#020a04` |
| `--amber-line` | `rgba(255,196,0,.5)` |
| `--amber-dim` | `#c9a227` |
| `--chart-strat` | `#3dff6e` |
| `--chart-close` | `#4ad8ff` |

**Fonts:** one Google Fonts request for `VT323`, `Share Tech Mono`, `IBM Plex Mono:wght@400;500;600`, keeping the existing `preconnect` pair. Body font is `'IBM Plex Mono', monospace`.

**ID vocabulary** — these IDs are contracts between tasks and tests. Use exactly these:

`#rain` `#boot` `#bootLine` `#name` `#trace` `#projects` `#photos` `#contact` `#viewResults` `#equity` `#equityToggle` `#equitySvg` `#equityStrat` `#equitySpy` `#equityFill` `#equityOpen` `#equityClose` `#equityHi` `#equityLo` `#equityDates` `#equityCaption` `#equityHolding` `#equityEmpty` `#equityDismiss` `#discordLink`

**CSS class vocabulary** — introduced in the task that first needs them, reused thereafter:

`.rain` `.vignette` `.scanlines` `.wrap` `.boot` `.boot-cursor` `.section` `.hero` `.hero-left` `.hero-right` `.name` `.name-line` `.role` `.nav` `.nav-btn` `.panel` `.panel-head` `.trace-frame` `.prompt` `.prompt-user` `.prompt-path` `.subtitle` `.proj-grid` `.proj` `.proj-head` `.proj-idx` `.proj-name` `.proj-badge` `.proj-badge--live` `.proj-badge--beta` `.proj-desc` `.proj-note` `.proj-stack` `.chip` `.proj-links` `.proj-link` `.equity` `.equity-head` `.equity-title` `.equity-range` `.range-btn` `.range-btn.is-active` `.equity-legend` `.equity-plot` `.equity-hi` `.equity-lo` `.equity-dates` `.equity-stats` `.equity-caption` `.equity-holding` `.equity-empty` `.gal` `.gframe` `.gframe-img` `.gframe-cap` `.contact-grid` `.clink` `.clink-k` `.clink-v`

**No raw palette literals in CSS.** The design export is inline-styled, so it repeats `rgba(0,255,65,…)` at a dozen different alpha values and scatters one-off hexes like `#031208`. Translated verbatim that would leave ~42 untokenized colors across the finished page, defeating the token layer and the repo's own stated styling idiom. Instead: `--green-rgb: 0,255,65` on `:root`, and every translucent green written `rgba(var(--green-rgb), α)`. Every other palette colour gets its own semantic token — see the table above.

Two categories stay literal on purpose, and are **not** findings:

- **The rain canvas's `ctx.fillStyle` strings.** That is JS, not CSS; `var()` cannot resolve there. Leave them with a comment saying why.
- **Scrims and neutral chrome** — `rgba(0,0,0,.22)` (scanlines), `rgba(0,5,2,.6)` (vignette), `rgba(2,8,3,.8)` / `rgba(2,10,4,.8)` / `rgba(0,8,3,.85)` / `rgba(0,18,7,.9)` (label and control backdrops), `rgba(160,180,165,0.5)` (the chart's neutral reference line), and `.boot`'s `#000` / `#22ff55`. These are surface and overlay values, not brand identity; tokenising single-use scrims would be indirection without a second consumer.

**Never assert `toBeHidden()` alone.** Playwright treats a locator matching **zero** elements as hidden, so `await expect(page.locator('#x')).toBeHidden()` passes against a page where `#x` was deleted entirely — the assertion cannot fail for the reason you care about. Everywhere this plan expects an element to exist but be invisible, pair it: `toBeAttached()` first, then `toBeHidden()`. Use a bare `toBeHidden()` only when the element's *absence* is genuinely an acceptable outcome.

**Commit style:** Conventional Commits. Every commit message ends with:

```
Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01JUCDLSSyTgkys9xtoQTaFY
```

**Do not push.** All work stays local on `feat/matrix-redesign`.

---

## File Structure

| File | Responsibility |
|---|---|
| `index.html` | **Rewritten.** The entire page: head/chrome, all CSS, all markup, all page JS (rain, boot, scramble, equity, Discord copy). |
| `js/matrix-map.js` | The `<matrix-map>` custom element. Self-registering, no exports, no page coupling. |
| `vendor/leaflet.js`, `vendor/leaflet.css`, `vendor/d3.min.js`, `vendor/topojson-client.min.js`, `vendor/counties-10m.json` | Pinned third-party assets, unmodified. |
| `images/vegas-26.png` | New gallery asset. |
| `package.json`, `playwright.config.js` | Dev-only test tooling. Not referenced by the site. |
| `tests/helpers.js` | Shared test helpers — boot dismissal, equity-window recomputation. |
| `tests/*.spec.js` | One spec per task deliverable. |
| `.gitignore` | Add `node_modules/`, `test-results/`, `playwright-report/`. |

---

### Task 1: Test harness + page shell

Replaces `index.html` with the new foundation: preserved chrome, tokens, and the three fixed background layers. No boot screen and no content sections yet — those arrive in Tasks 2–7.

**Files:**
- Create: `package.json`, `playwright.config.js`, `tests/helpers.js`, `tests/shell.spec.js`
- Modify: `.gitignore`
- Rewrite: `index.html`

**Interfaces:**
- Consumes: nothing.
- Produces: `#rain` canvas element; `.wrap` content container that every later section is appended into; all `:root` tokens; `tests/helpers.js` exporting `dismissBoot(page)` and `equityWindow(days)`.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "chasecrawford-dev-html",
  "private": true,
  "description": "Dev tooling only. The site itself is static and has no build step.",
  "scripts": {
    "serve": "http-server -p 4173 -c-1 .",
    "test": "playwright test"
  },
  "devDependencies": {
    "@playwright/test": "^1.47.0",
    "http-server": "^14.1.1"
  }
}
```

- [ ] **Step 2: Create `playwright.config.js`**

```js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } } },
  ],
  webServer: {
    command: 'npm run serve',
    url: 'http://127.0.0.1:4173/index.html',
    reuseExistingServer: true,
    timeout: 60000,
  },
});
```

- [ ] **Step 3: Append to `.gitignore`**

```
node_modules/
test-results/
playwright-report/
```

- [ ] **Step 4: Install and verify Playwright runs**

Run: `npm install && npx playwright install chromium`
Expected: completes without error.

- [ ] **Step 5: Create `tests/helpers.js`**

`equityWindow` independently reimplements the newest-snapshot windowing so the tests are not validated by the same code they are testing.

```js
const fs = require('fs');
const path = require('path');

/** Dismiss the boot overlay via keyboard (the path a keyboard user takes). */
async function dismissBoot(page) {
  const boot = page.locator('#boot');
  if (await boot.count()) {
    await page.waitForFunction(() => window.__bootReady === true, null, { timeout: 10000 });
    await page.keyboard.press('Escape');
    await boot.waitFor({ state: 'hidden', timeout: 5000 });
  }
}

/** Snapshots within `days` calendar days of the NEWEST snapshot. */
function equityWindow(days) {
  const file = path.join(__dirname, '..', 'json', 'paper-equity.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const snaps = (data.snapshots || []).filter((s) => typeof s.equity === 'number');
  if (!snaps.length) return { data, snaps: [] };
  const [ly, lm, ld] = snaps[snaps.length - 1].date.split('-').map(Number);
  const cutoff = Date.UTC(ly, lm - 1, ld - (days - 1));
  const win = snaps.filter((s) => {
    const [y, m, d] = s.date.split('-').map(Number);
    return Date.UTC(y, m - 1, d) >= cutoff;
  });
  return { data, snaps: win };
}

const usd2 = (v) =>
  '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

module.exports = { dismissBoot, equityWindow, usd2 };
```

- [ ] **Step 6: Write the failing test — `tests/shell.spec.js`**

```js
const { test, expect } = require('@playwright/test');

test.describe('page shell', () => {
  test.beforeEach(async ({ page }) => { await page.goto('/index.html'); });

  test('preserves SEO chrome', async ({ page }) => {
    await expect(page).toHaveTitle('Chase Crawford | Backend Developer | chasecrawford.dev');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content', /Lead Backend Developer at Hatfield Media/);
    await expect(page.locator('link[rel="icon"]')).toHaveAttribute('href', 'images/favicon.svg');
  });

  test('theme-color is the new Matrix background', async ({ page }) => {
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#020803');
  });

  test('preserves both halves of the GTM container', async ({ page }) => {
    expect(await page.evaluate(() => Array.isArray(window.dataLayer))).toBe(true);
    const ns = await page.locator('noscript').first().textContent();
    expect(ns).toContain('googletagmanager.com/ns.html?id=GTM-TMFW9FK');
  });

  test('paints the Matrix background and mounts the rain canvas', async ({ page }) => {
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe('rgb(2, 8, 3)');
    await expect(page.locator('canvas#rain')).toHaveCount(1);
  });

  test('ships no design-canvas runtime constructs', async ({ page }) => {
    const html = await page.content();
    for (const marker of ['<x-dc', '<sc-if', '<sc-for', 'style-hover', 'support.js', 'image-slot.js']) {
      expect(html).not.toContain(marker);
    }
  });
});
```

- [ ] **Step 7: Run the test to verify it fails**

Run: `npx playwright test tests/shell.spec.js`
Expected: FAIL — the current page's `theme-color` is `#0a0a0a`, body background is `rgb(10, 10, 10)`, and there is no `canvas#rain`.

- [ ] **Step 8: Rewrite `index.html`**

Read the export's `<helmet>` and outer wrapper for exact values. Produce this structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
<!-- Google Tag Manager -->
<!-- ... copy verbatim from `git show main:index.html` lines 4-10 ... -->
<!-- End Google Tag Manager -->
<meta charset="UTF-8">
<title>Chase Crawford | Backend Developer | chasecrawford.dev</title>
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="description" content="Chase Crawford — Lead Backend Developer at Hatfield Media. Louisville, KY. PHP/Laravel, Vue, PostgreSQL, AWS. Shipping since 2008.">
<meta name="theme-color" content="#020803">
<link rel="icon" href="images/favicon.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Share+Tech+Mono&family=VT323&display=swap" rel="stylesheet">
<style>
  :root{
    /* Channel triplet, so every translucent green is rgba(var(--green-rgb), a)
       instead of a fresh literal per alpha value. */
    --green-rgb:0,255,65;
    --bg:#020803; --panel:rgba(0,18,7,0.75); --panel-solid:#001207;
    --green:#00ff41; --ink:#b6ffc9;
    --dim-1:#8affa8; --dim-2:#5ec97b; --dim-3:#3fa05c; --dim-4:#2f7a4a;
    --amber:#ffd75e; --blue:#4aa8d8;
    --nav-bg:#031208; --nav-bg-hover:#06240f;
    --line:rgba(var(--green-rgb),0.25); --line-strong:rgba(var(--green-rgb),0.5);
  }
  *,*::before,*::after{box-sizing:border-box}
  html{overflow-x:hidden}
  body{margin:0;background:var(--bg);color:var(--ink);
       font-family:'IBM Plex Mono',monospace;font-size:13px;line-height:1.6}
  a{color:var(--green);text-decoration:none}
  a:hover{color:var(--green-hover);text-decoration:underline}
  ::selection{background:var(--green);color:var(--bg)}
  @keyframes blink{0%,49%{opacity:1}50%,100%{opacity:0}}
  @keyframes flicker{0%,91%{opacity:1}92%{opacity:.82}93%{opacity:1}96%{opacity:.9}97%,100%{opacity:1}}

  .rain{position:fixed;inset:0;z-index:0}
  .vignette{position:fixed;inset:0;z-index:5;pointer-events:none;
    background:radial-gradient(ellipse at center,transparent 55%,rgba(0,5,2,.6) 100%)}
  .scanlines{position:fixed;inset:0;z-index:6;pointer-events:none;animation:flicker 7s infinite;
    background:repeating-linear-gradient(0deg,rgba(0,0,0,.22) 0,rgba(0,0,0,.22) 1px,transparent 1px,transparent 3px)}
  .wrap{position:relative;z-index:2;max-width:1060px;margin:0 auto;padding:0 24px}

  @media (prefers-reduced-motion:reduce){
    .scanlines{animation:none}
  }
</style>
</head>
<body>
<!-- Google Tag Manager (noscript) -->
<!-- ... copy verbatim from `git show main:index.html` lines 685-688 ... -->
<!-- End Google Tag Manager (noscript) -->

<canvas id="rain" class="rain" aria-hidden="true"></canvas>
<div class="vignette" aria-hidden="true"></div>
<div class="scanlines" aria-hidden="true"></div>

<div class="wrap">
</div>

<script>
(function(){
  'use strict';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== DIGITAL RAIN =====
  var GLYPHS = 'アイウエオカキクケコサシスセソタチツテトナニヌネノ0123456789ZXCVBNM$+*#';
  var PITCH = 18, OPACITY = 0.3, FPS = 24;
  (function rain(){
    var c = document.getElementById('rain');
    if (!c) return;
    var ctx = c.getContext('2d'), drops = [];
    function size(){
      c.width = window.innerWidth; c.height = window.innerHeight;
      var cols = Math.floor(c.width / PITCH);
      drops = Array.from({length: cols}, function(){ return Math.random() * -c.height / PITCH; });
    }
    function draw(){
      ctx.fillStyle = 'rgba(2,8,3,0.12)';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.font = '15px monospace';
      for (var i = 0; i < drops.length; i++){
        var x = i * PITCH, y = drops[i] * PITCH;
        ctx.fillStyle = 'rgba(180,255,200,' + OPACITY + ')';
        ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], x, y);
        ctx.fillStyle = 'rgba(0,255,65,' + (OPACITY * 0.55) + ')';
        ctx.fillText(GLYPHS[(Math.random() * GLYPHS.length) | 0], x, y - PITCH);
        drops[i] = (y > c.height && Math.random() > 0.975) ? 0 : drops[i] + 1;
      }
    }
    size();
    window.addEventListener('resize', size);
    if (reduced) { draw(); return; }   // one static frame, no animation loop
    var last = 0;
    (function step(t){
      requestAnimationFrame(step);
      if (t - last < 1000 / FPS) return;
      last = t; draw();
    })(0);
  })();

  window.__bootReady = true;   // replaced by the real boot flag in Task 2
})();
</script>
</body>
</html>
```

- [ ] **Step 9: Run the test to verify it passes**

Run: `npx playwright test tests/shell.spec.js`
Expected: PASS — 5 tests.

- [ ] **Step 10: Commit**

```bash
git add package.json playwright.config.js .gitignore tests/ index.html
git commit -m "feat(site): Matrix redesign shell + Playwright harness

Rewrites index.html down to the new foundation: preserved GTM/SEO
chrome, the Matrix token palette, and the three fixed background
layers (rain canvas, vignette, scanlines). Content sections follow.

Adds a dev-only Playwright suite so the rest of the redesign has a
real red/green cycle; the site itself still has no build step.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01JUCDLSSyTgkys9xtoQTaFY"
```

---

### Task 2: Boot overlay

**Files:**
- Create: `tests/boot.spec.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `.wrap`, `reduced` flag from Task 1.
- Produces: `#boot` overlay, `#bootLine` text target, `window.__bootReady` (true once listeners are attached), and a global `window.__endBoot()` — idempotent; Task 3's name scramble hooks it.

- [ ] **Step 1: Write the failing test — `tests/boot.spec.js`**

```js
const { test, expect } = require('@playwright/test');

const READY = () => window.__bootReady === true;

test.describe('boot overlay', () => {
  test('types the approved line, then clears itself', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('#boot')).toBeVisible();
    await expect(page.locator('#bootLine')).toHaveText('The Matrix has you...', { timeout: 15000 });
    await expect(page.locator('#boot')).toBeHidden({ timeout: 15000 });
  });

  test('locks scrolling while booting and restores it after', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForFunction(READY);
    expect(await page.evaluate(() => document.documentElement.style.overflowY)).toBe('hidden');
    await page.keyboard.press('Escape');
    await expect(page.locator('#boot')).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.style.overflowY)).toBe('');
  });

  test('skips on click', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForFunction(READY);
    await page.locator('#boot').click();
    await expect(page.locator('#boot')).toBeHidden({ timeout: 5000 });
  });

  test('skips on any key — a keyboard user is never trapped', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForFunction(READY);
    await page.keyboard.press('a');
    await expect(page.locator('#boot')).toBeHidden({ timeout: 5000 });
  });

  test('endBoot is idempotent', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForFunction(READY);
    await page.evaluate(() => { window.__endBoot(); window.__endBoot(); window.__endBoot(); });
    await expect(page.locator('#boot')).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.style.overflowY)).toBe('');
  });
});

test.describe('boot overlay with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('resolves immediately instead of typing', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('#boot')).toBeHidden({ timeout: 3000 });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx playwright test tests/boot.spec.js`
Expected: FAIL — no `#boot` element exists.

- [ ] **Step 3: Add the boot markup**

Insert immediately before `<canvas id="rain">`:

```html
<div id="boot" class="boot"><div><span id="bootLine"></span><span class="boot-cursor"></span></div></div>
```

- [ ] **Step 4: Add the boot CSS**

Append inside the existing `<style>`:

```css
  .boot{position:fixed;inset:0;z-index:60;background:#000;display:flex;align-items:flex-start;
        padding:48px;cursor:pointer;transition:opacity .9s ease;
        font-size:clamp(18px,3vw,30px);color:#22ff55;
        text-shadow:0 0 8px rgba(var(--green-rgb),.8),0 0 24px rgba(var(--green-rgb),.4)}
  .boot-cursor{display:inline-block;width:.55em;height:1.1em;background:#22ff55;
        vertical-align:text-bottom;margin-left:2px;animation:blink 1s infinite;
        box-shadow:0 0 8px rgba(var(--green-rgb),.8)}
  @media (prefers-reduced-motion:reduce){ .boot-cursor{animation:none} }
```

- [ ] **Step 5: Add the boot JS**

Replace the `window.__bootReady = true;` placeholder line from Task 1 with:

```js
  // ===== BOOT =====
  var BOOT_LINE = 'The Matrix has you...';
  (function boot(){
    var el = document.getElementById('boot');
    var line = document.getElementById('bootLine');
    if (!el || !line) { window.__endBoot = function(){}; window.__bootReady = true; return; }

    var done = false, timer = null;
    document.documentElement.style.overflowY = 'hidden';

    function endBoot(){
      if (done) return;
      done = true;
      clearTimeout(timer);
      document.documentElement.style.overflowY = '';
      el.style.opacity = '0';
      setTimeout(function(){ el.style.display = 'none'; }, 950);
      document.dispatchEvent(new CustomEvent('boot:end'));
    }
    window.__endBoot = endBoot;

    el.addEventListener('click', endBoot);
    window.addEventListener('keydown', endBoot);
    window.__bootReady = true;

    if (reduced) { line.textContent = BOOT_LINE; endBoot(); return; }

    var i = 0;
    function type(){
      if (done) return;
      if (i <= BOOT_LINE.length) {
        line.textContent = BOOT_LINE.slice(0, i++);
        timer = setTimeout(type, 70 + Math.random() * 90);
      } else {
        timer = setTimeout(endBoot, 1800);
      }
    }
    timer = setTimeout(type, 2600);
  })();
```

Note: `el.style.display = 'none'` after the fade is what makes Playwright's `toBeHidden()` resolve — opacity 0 alone still counts as visible.

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx playwright test tests/boot.spec.js`
Expected: PASS — 6 tests.

- [ ] **Step 7: Commit**

```bash
git add index.html tests/boot.spec.js
git commit -m "feat(site): Matrix boot overlay

Types 'The Matrix has you...' over a black field, then fades. Fixes
the export's mouse-only skip: the overlay locks page scrolling, so
binding the skip to click alone trapped keyboard users for the full
sequence. Now any keydown ends it, endBoot is idempotent, and
prefers-reduced-motion resolves it immediately.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01JUCDLSSyTgkys9xtoQTaFY"
```

---

### Task 3: Hero — name scramble, role line, nav

**Files:**
- Create: `tests/hero.spec.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `.wrap`, `boot:end` event and `window.__bootReady` from Task 2.
- Produces: `.section` class (used by every later section), `.panel`/`.panel-head` (reused by the equity panel), `#trace` empty frame that Task 8 mounts `<matrix-map>` into, `#name`.

- [ ] **Step 1: Write the failing test — `tests/hero.spec.js`**

```js
const { test, expect } = require('@playwright/test');
const { dismissBoot } = require('./helpers');

test.describe('hero', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
  });

  test('name resolves out of the glyph scramble', async ({ page }) => {
    const lines = page.locator('#name .name-line');
    await expect(lines).toHaveCount(2);
    await expect(lines.nth(0)).toHaveText('CHASE', { timeout: 8000 });
    await expect(lines.nth(1)).toHaveText('CRAWFORD', { timeout: 8000 });
  });

  test('states the role', async ({ page }) => {
    await expect(page.locator('.role')).toContainText('LEAD BACKEND DEVELOPER');
    await expect(page.locator('.role')).toContainText('HATFIELD MEDIA');
  });

  test('nav targets the three sections plus the resume', async ({ page }) => {
    const hrefs = await page.locator('.nav .nav-btn').evaluateAll((els) =>
      els.map((e) => e.getAttribute('href')));
    expect(hrefs).toEqual(['#projects', '#photos', '#contact', 'pdf/resume.pdf']);
  });

  test('resume link is relative, not a hardcoded absolute self-link', async ({ page }) => {
    const href = await page.locator('.nav .nav-btn').last().getAttribute('href');
    expect(href).not.toContain('chasecrawford.dev');
  });

  test('trace panel frame is present and labelled', async ({ page }) => {
    await expect(page.locator('#trace')).toHaveCount(1);
    await expect(page.locator('.hero-right .panel-head')).toContainText('TRACE PROGRAM');
  });
});

test.describe('hero with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('name is plain text, never scrambled', async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
    await expect(page.locator('#name .name-line').nth(0)).toHaveText('CHASE');
    await expect(page.locator('#name .name-line').nth(1)).toHaveText('CRAWFORD');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx playwright test tests/hero.spec.js`
Expected: FAIL — no `#name`.

- [ ] **Step 3: Add the hero markup**

Inside `.wrap`:

```html
<header class="section hero" data-screen-label="hero">
  <div class="hero-left">
    <h1 id="name" class="name"><span class="name-line">CHASE</span><span class="name-line">CRAWFORD</span></h1>
    <div class="role"><span>LEAD BACKEND DEVELOPER</span><span class="role-sep">//</span><span>HATFIELD MEDIA</span></div>
    <nav class="nav">
      <a class="nav-btn" href="#projects">./projects</a>
      <a class="nav-btn" href="#photos">./photos</a>
      <a class="nav-btn" href="#contact">./contact</a>
      <a class="nav-btn" href="pdf/resume.pdf">resume.pdf</a>
    </nav>
  </div>
  <div class="hero-right">
    <div class="panel">
      <div class="panel-head"><span>TRACE PROGRAM</span></div>
      <div id="trace" class="trace-frame"></div>
    </div>
  </div>
</header>
```

- [ ] **Step 4: Add the hero CSS**

Read the export's hero inline styles for exact values; translate to:

```css
  .section{min-height:100vh;box-sizing:border-box;scroll-snap-align:start}
  .hero{display:flex;flex-wrap:wrap;align-items:center;gap:48px;padding:32px 0}
  .hero-left{flex:1 1 480px;min-width:0;display:flex;flex-direction:column;gap:20px}
  .hero-right{flex:1 1 320px;max-width:440px;min-width:280px}
  .name{font-family:'Share Tech Mono',monospace;font-size:clamp(44px,8vw,96px);line-height:1;
        margin:0;color:var(--green);letter-spacing:.01em;
        text-shadow:0 0 24px rgba(var(--green-rgb),.55),0 0 90px rgba(var(--green-rgb),.25)}
  .name-line{display:block;white-space:nowrap}
  .role{display:flex;flex-wrap:wrap;gap:10px;align-items:center;
        font-size:13px;letter-spacing:.14em;color:var(--dim-1)}
  .role-sep{color:var(--dim-4)}
  .nav{display:flex;flex-wrap:wrap;gap:14px;margin-top:12px;font-size:13px}
  .nav-btn{background:var(--nav-bg);border:1px solid rgba(var(--green-rgb),.2);padding:10px 18px;
           color:var(--dim-1);letter-spacing:.1em}
  .nav-btn:hover{background:var(--nav-bg-hover);border-color:rgba(var(--green-rgb),.6);color:var(--green);
           box-shadow:0 0 18px rgba(var(--green-rgb),.35);text-decoration:none}
  .nav-btn:focus-visible{outline:2px solid var(--green);outline-offset:2px}
  .panel{border:1px solid rgba(var(--green-rgb),.3);background:var(--panel);backdrop-filter:blur(3px);
         box-shadow:0 0 32px rgba(var(--green-rgb),.12)}
  .panel-head{display:flex;justify-content:space-between;padding:8px 12px;
         border-bottom:1px solid rgba(var(--green-rgb),.2);
         font-size:10px;letter-spacing:.14em;color:var(--dim-3)}
  .trace-frame{position:relative;aspect-ratio:4/3;overflow:hidden;max-width:100%}
```

- [ ] **Step 5: Add the scramble JS**

Append inside the page `<script>`, after the boot block:

```js
  // ===== NAME SCRAMBLE =====
  (function scramble(){
    var el = document.getElementById('name');
    if (!el || reduced) return;
    var words = ['CHASE', 'CRAWFORD'];
    var spans = el.children;
    document.addEventListener('boot:end', function run(){
      document.removeEventListener('boot:end', run);
      var total = Math.max(words[0].length, words[1].length);
      var revealed = 0, frames = 0;
      var iv = setInterval(function(){
        frames++;
        if (frames % 3 === 0) revealed++;
        for (var w = 0; w < words.length; w++){
          if (!spans[w]) continue;
          spans[w].textContent = words[w].split('').map(function(ch, i){
            return i < revealed ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
          }).join('');
        }
        if (revealed >= total){
          clearInterval(iv);
          for (var k = 0; k < words.length; k++){ if (spans[k]) spans[k].textContent = words[k]; }
        }
      }, 40);
    });
  })();
```

Note: the markup ships the real text, and the scramble only *replaces* it after boot. That ordering matters — it keeps the name correct for crawlers, for no-JS visitors, and under reduced motion.

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx playwright test tests/hero.spec.js`
Expected: PASS — 6 tests.

- [ ] **Step 7: Commit**

```bash
git add index.html tests/hero.spec.js
git commit -m "feat(site): Matrix hero — scramble reveal, role, nav

Name ships as real text and is only overwritten by the glyph
scramble after boot, so crawlers, no-JS visitors and reduced-motion
users always see CHASE CRAWFORD. Resume nav uses a relative path
rather than the export's hardcoded absolute self-link.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01JUCDLSSyTgkys9xtoQTaFY"
```

---

### Task 4: Projects — three cards + scroll snap

**Files:**
- Create: `tests/projects.spec.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `.section`, `.panel` from Task 3.
- Produces: `#projects` section, `.proj-grid` with the six toggle CSS variables declared, `#viewResults` button (inert until Task 5), `.prompt`/`.subtitle` (reused by Tasks 6 and 7), `.chip`.

- [ ] **Step 1: Write the failing test — `tests/projects.spec.js`**

```js
const { test, expect } = require('@playwright/test');
const { dismissBoot } = require('./helpers');

test.describe('projects', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
  });

  test('lists the three featured projects with approved subtitle', async ({ page }) => {
    await expect(page.locator('#projects .subtitle')).toHaveText('2 open source · 1 in closed beta');
    const names = await page.locator('#projects .proj-name').allTextContents();
    expect(names).toEqual(['bot-trader', 'feeds-by-chase', 'blackjack-coach']);
  });

  test('bot-trader carries the approved backtest line verbatim', async ({ page }) => {
    await expect(page.locator('#projects .proj').first().locator('.proj-note')).toHaveText(
      'goal: beat SPY over full cycles. 19-yr backtest: +768% vs +615%, drawdown 34% vs 56%.');
  });

  test('beta link points at the site page, not the design canvas', async ({ page }) => {
    const hrefs = await page.locator('#projects a').evaluateAll((els) =>
      els.map((e) => e.getAttribute('href')));
    expect(hrefs).toContain('/blackjack-coach/');
    expect(hrefs.join(' ')).not.toContain('.dc.html');
  });

  test('external links are safely targeted', async ({ page }) => {
    const bad = await page.locator('#projects a[target="_blank"]').evaluateAll((els) =>
      els.filter((e) => !(e.getAttribute('rel') || '').includes('noopener')).length);
    expect(bad).toBe(0);
  });

  test('scroll-snap is armed on desktop', async ({ page }) => {
    const snap = await page.evaluate(() =>
      getComputedStyle(document.documentElement).scrollSnapType);
    expect(snap).toContain('mandatory');
  });

  test('nav anchor reaches the section', async ({ page }) => {
    await page.locator('.nav-btn[href="#projects"]').click();
    await expect(page.locator('#projects')).toBeInViewport({ timeout: 5000 });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx playwright test tests/projects.spec.js`
Expected: FAIL — no `#projects`.

- [ ] **Step 3: Add the projects markup**

Read the three card blocks from the export and translate each. Structure per card:

```html
<section id="projects" class="section proj-section" data-screen-label="projects">
  <div>
    <div class="prompt"><span class="prompt-user">chase@localhost</span><span class="prompt-path">:~/projects</span> ❯ <span>ls --featured</span></div>
    <div class="subtitle">2 open source · 1 in closed beta</div>
  </div>
  <div class="proj-grid">

    <div class="proj">
      <div class="proj-head">
        <span class="proj-idx">001</span>
        <span class="proj-name">bot-trader</span>
        <span class="proj-badge">OSS</span>
      </div>
      <p class="proj-desc">Two-sleeve systematic momentum trader for Alpaca paper trading — Dual Momentum (Antonacci GEM) on broad ETFs plus an EMA trend-state strategy across a 234-name equity universe.</p>
      <p class="proj-note">goal: beat SPY over full cycles. 19-yr backtest: +768% vs +615%, drawdown 34% vs 56%.</p>
      <div class="proj-stack"><span class="chip">PYTHON</span><span class="chip">SQLITE</span><span class="chip">ALPACA</span><span class="chip">YFINANCE</span></div>
      <div class="proj-links">
        <a class="proj-link" href="https://github.com/chasecrawford/bot-trader" target="_blank" rel="noopener">→ github.com/chasecrawford/bot-trader</a>
        <button type="button" id="viewResults" class="proj-link proj-toggle">→ view results</button>
      </div>
    </div>

    <!-- equity panel is inserted here in Task 5 -->

    <div class="proj proj--other">
      <div class="proj-head">
        <span class="proj-idx">002</span>
        <span class="proj-name">feeds-by-chase</span>
        <span class="proj-badge proj-badge--live">● LIVE</span>
      </div>
      <p class="proj-desc">Self-hosted Bluesky keyword feed generator. Streams the firehose via Jetstream, matches per-feed include/exclude rules in SQLite, serves getFeedSkeleton — a self-owned SkyFeed replacement.</p>
      <p class="proj-note"><span class="lbl">running:</span> 3 live feeds — <a href="https://bsky.app/profile/chasecrawford.dev/feed/aaaps4w6ssniy" target="_blank" rel="noopener">UofL Football</a>, <a href="https://bsky.app/profile/chasecrawford.dev/feed/aaalxyswlqxco" target="_blank" rel="noopener">UofL Basketball</a>, <a href="https://bsky.app/profile/chasecrawford.dev/feed/aaaf2gyhpeav6" target="_blank" rel="noopener">Alien: Earth</a>.</p>
      <div class="proj-stack"><span class="chip">TYPESCRIPT</span><span class="chip">AT PROTOCOL</span><span class="chip">JETSTREAM</span><span class="chip">SQLITE</span></div>
      <div class="proj-links">
        <a class="proj-link" href="https://github.com/chasecrawford/feeds-by-chase" target="_blank" rel="noopener">→ github.com/chasecrawford/feeds-by-chase</a>
      </div>
    </div>

    <div class="proj proj--other">
      <div class="proj-head">
        <span class="proj-idx">003</span>
        <span class="proj-name">blackjack-coach</span>
        <span class="proj-badge proj-badge--beta">CLOSED BETA</span>
      </div>
      <p class="proj-desc">Blackjack trainer that grades you while you play. Real hands at a 6-deck Vegas table; a coach reviews every decision against basic strategy and names the correct play. Strategy chart, accuracy stats, hand log — play money, no ads, offline.</p>
      <p class="proj-note proj-note--beta"><span class="lede">RECRUITING TESTERS · NEEDS 12</span> <span class="rest">— Android phone + two minutes: opt in on Google Play, install, play now and then.</span></p>
      <div class="proj-stack"><span class="chip">REACT</span><span class="chip">PWA</span><span class="chip">TWA</span><span class="chip">CLOUDFLARE</span></div>
      <div class="proj-links">
        <a class="proj-link" href="/blackjack-coach/">→ how to join the beta</a>
        <a class="proj-link" href="https://blackjack.chasecrawford.dev/" target="_blank" rel="noopener">→ play in any browser</a>
      </div>
    </div>
  </div>
</section>
```

Note `/blackjack-coach/` is same-origin, so it correctly has no `target`/`rel`. Every `target="_blank"` above carries `rel="noopener"` — the export omitted it throughout, and Task 4's test enforces it.

- [ ] **Step 4: Add the projects CSS**

```css
  html{scroll-snap-type:y mandatory}
  .proj-section{display:flex;flex-direction:column;justify-content:center;padding:48px 0;gap:18px}
  .prompt{font-size:14px;color:var(--green);margin-bottom:6px}
  .prompt-user{color:var(--dim-2)} .prompt-path{color:var(--dim-4)}
  .subtitle{font-size:12px;color:var(--dim-3)}
  .proj-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));
             grid-auto-rows:var(--proj-row,minmax(480px,auto));gap:16px;align-items:stretch}
  .proj{border:1px solid var(--line);background:var(--panel);backdrop-filter:blur(3px);
        padding:22px 20px;display:flex;flex-direction:column;gap:12px;min-width:0}
  .proj:hover{border-color:rgba(var(--green-rgb),.7);box-shadow:0 0 32px rgba(var(--green-rgb),.15)}
  .proj-head{display:flex;flex-wrap:wrap;gap:10px;align-items:baseline}
  .proj-idx{color:var(--dim-4);font-size:12px}
  .proj-name{font-family:'VT323',monospace;font-size:26px;color:var(--green)}
  .proj-badge{border:1px solid rgba(var(--green-rgb),.35);padding:2px 8px;font-size:10px;
              color:var(--dim-1);letter-spacing:.1em}
  .proj-badge--live{color:var(--green)}
  .proj-badge--beta{border-color:var(--amber-line);color:var(--amber)}
  .proj-desc{margin:0;font-size:13px;line-height:1.6;color:var(--ink);text-wrap:pretty}
  .proj-note{margin:0;font-size:12px;line-height:1.6;color:var(--dim-1)}
  .proj-note .lbl{color:var(--dim-3)}
  .proj-note--beta{color:var(--amber)}
  .proj-note--beta .lede{letter-spacing:.1em}
  .proj-note--beta .rest{color:var(--dim-1)}
  .proj-stack{display:flex;flex-wrap:wrap;gap:6px;margin-top:auto}
  .chip{background:rgba(var(--green-rgb),.08);padding:3px 9px;font-size:10px;
        color:var(--dim-2);letter-spacing:.08em}
  .proj-links{display:flex;flex-direction:column;gap:6px;font-size:12px;align-items:flex-start;
              border-top:1px solid rgba(var(--green-rgb),.15);padding-top:12px}
  .proj-toggle{display:var(--vr-disp,block);background:none;border:none;padding:0;
               font-family:inherit;font-size:12px;color:var(--green);cursor:pointer;text-align:left}
  /* A class rule setting `display` beats the UA stylesheet's [hidden]{display:none},
     so the hidden attribute Task 5 uses needs an explicit override or the button
     shows before its data has loaded. */
  .proj-toggle[hidden]{display:none}
  .proj-toggle:hover{color:var(--green-hover);text-decoration:underline}
  .proj--other{display:var(--others-disp,flex)}

  @media (max-width:768px){
    html{scroll-snap-type:none}
    :root{--proj-row:auto;--graph-col:auto;--graph-row:auto;--vr-disp:none}
  }
  @media (prefers-reduced-motion:reduce){ html{scroll-snap-type:none} }
```

Note the rename: the export used `--others-hid` as a *value* holder. Here `.proj--other` reads `--others-disp` directly, which is clearer and is what Task 5's JS sets.

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx playwright test tests/projects.spec.js`
Expected: PASS — 6 tests.

- [ ] **Step 6: Commit**

```bash
git add index.html tests/projects.spec.js
git commit -m "feat(site): Matrix projects section

Three project cards on a scroll-snapped full-height section. Beta
link retargets from the export's ./Blackjack Coach.dc.html canvas
reference to /blackjack-coach/. Snap and the results toggle are both
disabled under 768px and under prefers-reduced-motion.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01JUCDLSSyTgkys9xtoQTaFY"
```

---

### Task 5: Equity panel — real data + results toggle

The export's chart is fabricated. This task wires the panel to `json/paper-equity.json`, reusing the data logic from `git show main:index.html` lines **1305–1534**.

**Files:**
- Create: `tests/equity.spec.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `#viewResults`, `.proj--other`, `--others-disp` from Task 4; `equityWindow`/`usd2` from `tests/helpers.js`.
- Produces: `#equity` panel and its child IDs; `window.__equityRendered` promise-free boolean flag set once the first render completes (tests await it).

- [ ] **Step 1: Write the failing test — `tests/equity.spec.js`**

```js
const { test, expect } = require('@playwright/test');
const { dismissBoot, equityWindow, usd2 } = require('./helpers');

async function openResults(page) {
  await page.locator('#viewResults').click();
  await expect(page.locator('#equity')).toBeVisible();
  await page.waitForFunction(() => window.__equityRendered === true);
}

test.describe('equity panel', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
  });

  test('is hidden until results are requested', async ({ page }) => {
    await expect(page.locator('#equity')).toBeAttached();
    await expect(page.locator('#equity')).toBeHidden();
  });

  test('toggling results swaps the other two cards out and back', async ({ page }) => {
    await expect(page.locator('.proj--other').first()).toBeVisible();
    await openResults(page);
    await expect(page.locator('.proj--other').first()).toBeAttached();
    await expect(page.locator('.proj--other').first()).toBeHidden();
    await page.locator('#equityDismiss').click();
    await expect(page.locator('#equity')).toBeHidden();
    await expect(page.locator('.proj--other').first()).toBeVisible();
  });

  test('renders REAL data from paper-equity.json, not the export mock', async ({ page }) => {
    await openResults(page);
    const { snaps } = equityWindow(60);            // 60D is the default window
    expect(snaps.length).toBeGreaterThan(1);
    await expect(page.locator('#equityOpen')).toHaveText(usd2(snaps[0].equity));
    await expect(page.locator('#equityClose')).toHaveText(usd2(snaps[snaps.length - 1].equity));
  });

  test('each range button re-windows against the newest snapshot', async ({ page }) => {
    await openResults(page);
    for (const days of [7, 30, 60]) {
      await page.locator(`#equityToggle button[data-days="${days}"]`).click();
      await page.waitForFunction((d) => window.__equityDays === d, days);
      const { snaps } = equityWindow(days);
      if (snaps.length < 2) continue;
      await expect(page.locator('#equityOpen')).toHaveText(usd2(snaps[0].equity));
      await expect(page.locator('#equityClose')).toHaveText(usd2(snaps[snaps.length - 1].equity));
    }
  });

  test('caption dates come from the JSON, never hardcoded', async ({ page }) => {
    await openResults(page);
    const { data, snaps } = equityWindow(60);
    const caption = await page.locator('#equityCaption').textContent();
    expect(caption).toContain(data.start_date);
    expect(caption).toContain('data through');
    // The export hardcoded "Sep 04" — assert we are not echoing a frozen literal.
    const last = snaps[snaps.length - 1].date;
    const [, m, d] = last.split('-').map(Number);
    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    expect(caption).toContain(`${MONTHS[m - 1]} ${String(d).padStart(2, '0')}`);
  });

  test('holdings come from the positions array', async ({ page }) => {
    await openResults(page);
    const { data } = equityWindow(60);
    const shown = await page.locator('#equityHolding span.sym').allTextContents();
    expect(shown).toEqual(data.positions || []);
  });

  test('draws both the strategy line and the SPY benchmark', async ({ page }) => {
    await openResults(page);
    expect((await page.locator('#equityStrat').getAttribute('points')).length).toBeGreaterThan(10);
    expect((await page.locator('#equitySpy').getAttribute('points')).length).toBeGreaterThan(10);
  });

  test('a failed fetch hides the panel without breaking the other cards', async ({ page }) => {
    await page.route('**/json/paper-equity.json', (r) => r.abort());
    await page.reload();
    await dismissBoot(page);
    // The button must still exist and merely be hidden — a bare toBeHidden()
    // would also pass if the whole card vanished.
    await expect(page.locator('#viewResults')).toBeAttached();
    await expect(page.locator('#viewResults')).toBeHidden();
    await expect(page.locator('.proj--other').first()).toBeVisible();
    await expect(page.locator('#projects .proj-name').first()).toHaveText('bot-trader');
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx playwright test tests/equity.spec.js`
Expected: FAIL — no `#equity`.

- [ ] **Step 3: Add the equity markup**

Insert into `.proj-grid` immediately after the bot-trader card (replacing the Task 4 comment):

```html
<div id="equity" class="equity" hidden>
  <div class="equity-head">
    <span class="equity-title">PAPER TRADING TRIAL NO. 2</span>
    <div class="equity-range" id="equityToggle" role="group" aria-label="Chart window">
      <button type="button" class="range-btn" data-days="7">7D</button>
      <button type="button" class="range-btn" data-days="30">30D</button>
      <button type="button" class="range-btn is-active" data-days="60">60D</button>
      <button type="button" id="equityDismiss" class="range-btn equity-close" aria-label="Close results">✕</button>
    </div>
  </div>
  <div class="equity-strategy">EMA trend-state strategy</div>
  <div class="equity-legend"><span class="lg-strat">— Strategy</span><span class="lg-spy">-- SPY benchmark</span></div>
  <div class="equity-plot">
    <svg id="equitySvg" viewBox="0 0 600 220" preserveAspectRatio="none" aria-hidden="true">
      <line x1="0" y1="10" x2="600" y2="10" stroke="rgba(160,180,165,0.5)" stroke-width="1.5" stroke-dasharray="7 6"></line>
      <polygon id="equityFill" points="" fill="rgba(var(--green-rgb),0.07)"></polygon>
      <polyline id="equitySpy" points="" fill="none" stroke="var(--blue)" stroke-width="2" stroke-dasharray="6 5"></polyline>
      <polyline id="equityStrat" points="" fill="none" stroke="var(--chart-strat)" stroke-width="2.5"></polyline>
    </svg>
    <span id="equityHi" class="equity-hi">—</span>
    <span id="equityLo" class="equity-lo">—</span>
  </div>
  <div id="equityDates" class="equity-dates"></div>
  <div class="equity-stats">
    <div><span class="lbl">open:</span> <b id="equityOpen">—</b> <span class="lbl">close:</span> <b id="equityClose">—</b></div>
    <div id="equityCaption" class="equity-caption"></div>
  </div>
  <div id="equityHolding" class="equity-holding"></div>
</div>
```

`hidden` on the container is the initial state; the toggle JS manages it thereafter.

- [ ] **Step 4: Add the equity CSS**

```css
  .equity{grid-column:var(--graph-col,2 / -1);grid-row:var(--graph-row,1);z-index:3;
          border:1px solid var(--line-strong);background:var(--panel-deep);
          box-shadow:0 0 40px rgba(var(--green-rgb),.2);
          flex-direction:column;gap:10px;padding:20px 22px;min-width:0}
  .equity:not([hidden]){display:flex}
  .equity-head{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
  .equity-title{font-size:12px;letter-spacing:.18em;color:var(--green)}
  .equity-range{display:flex;gap:6px;align-items:center}
  .range-btn{background:rgba(0,18,7,.9);color:var(--dim-1);border:1px solid rgba(var(--green-rgb),.4);
             font-family:inherit;font-size:11px;font-weight:600;padding:4px 10px;
             cursor:pointer;letter-spacing:.08em}
  .range-btn.is-active{background:var(--green);color:var(--bg)}
  .range-btn:focus-visible{outline:2px solid var(--green);outline-offset:2px}
  .equity-close{margin-left:6px;border-color:rgba(var(--green-rgb),.3)}
  .equity-strategy{font-family:'Share Tech Mono',monospace;font-size:20px;color:var(--ink-bright)}
  .equity-legend{display:flex;gap:18px;font-size:12px}
  .lg-strat{color:var(--chart-strat)} .lg-spy{color:var(--blue)}
  .equity-plot{position:relative;flex:1;min-height:180px}
  .equity-plot svg{position:absolute;inset:0;width:100%;height:100%;display:block}
  .equity-hi,.equity-lo{position:absolute;left:6px;font-size:11px;color:var(--dim-1);
             background:rgba(2,10,4,.8);padding:0 4px}
  .equity-hi{top:2px} .equity-lo{bottom:2px}
  .equity-dates{display:flex;justify-content:space-between;font-size:12px;color:var(--ink)}
  .equity-stats{border-top:1px solid rgba(var(--green-rgb),.2);padding-top:10px;font-size:12px;
             color:var(--dim-1);display:flex;flex-direction:column;gap:5px}
  .equity-stats .lbl{color:var(--dim-3)}
  .equity-stats #equityClose{color:var(--chart-close)}
  .equity-stats #equityOpen{color:var(--green)}
  .equity-caption{color:var(--dim-2)}
  .equity-holding{border-top:1px solid rgba(var(--green-rgb),.2);padding-top:10px;font-size:12px;
             letter-spacing:.1em;color:var(--amber);display:flex;flex-wrap:wrap;gap:10px}
  .equity-holding .lbl{color:var(--amber-dim)}
  .equity-empty{font-size:12px;color:var(--dim-3);padding:24px 0;text-align:center}
```

- [ ] **Step 5: Add the equity JS**

Append inside the page `<script>`:

```js
  // ===== EQUITY PANEL =====
  // Data from json/paper-equity.json (refreshed weekly by a scheduled job on
  // another machine). Windows anchor to the NEWEST snapshot, not wall-clock
  // today -- a wall-clock window starves to zero points by Friday. The
  // "data through" caption is what discloses staleness instead.
  (function equity(){
    var panel  = document.getElementById('equity');
    var btn    = document.getElementById('viewResults');
    var toggle = document.getElementById('equityToggle');
    if (!panel || !btn || !toggle) return;

    var MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var usd2 = function(v){ return '$' + v.toLocaleString('en-US',
      {minimumFractionDigits:2, maximumFractionDigits:2}); };
    var usd0 = function(v){ return '$' + Math.round(v).toLocaleString('en-US'); };
    var fmtDate = function(iso){
      var p = iso.split('-').map(Number);
      return MONTHS[p[1] - 1] + ' ' + String(p[2]).padStart(2, '0');
    };

    var snaps = [];

    function sliceByDays(days){
      if (!snaps.length) return snaps;
      var last = snaps[snaps.length - 1].date.split('-').map(Number);
      var cutoff = Date.UTC(last[0], last[1] - 1, last[2] - (days - 1));
      return snaps.filter(function(s){
        var p = s.date.split('-').map(Number);
        return Date.UTC(p[0], p[1] - 1, p[2]) >= cutoff;
      });
    }

    function setOthers(hidden){
      document.documentElement.style.setProperty('--others-disp', hidden ? 'none' : 'flex');
    }

    function render(days){
      var win = sliceByDays(days);
      var strat = document.getElementById('equityStrat');
      var spy   = document.getElementById('equitySpy');
      var fill  = document.getElementById('equityFill');
      var dates = document.getElementById('equityDates');
      var prevEmpty = panel.querySelector('.equity-empty');
      if (prevEmpty) prevEmpty.remove();

      if (win.length < 2){
        strat.setAttribute('points', ''); spy.setAttribute('points', '');
        fill.setAttribute('points', ''); dates.textContent = '';
        document.getElementById('equityOpen').textContent =
          win.length === 1 ? usd2(win[0].equity) : '—';
        document.getElementById('equityClose').textContent =
          win.length === 1 ? usd2(win[0].equity) : '—';
        var empty = document.createElement('div');
        empty.className = 'equity-empty';
        empty.textContent = win.length === 0
          ? 'awaiting first snapshot'
          : 'awaiting second snapshot · curve renders at 2 points';
        panel.querySelector('.equity-plot').insertAdjacentElement('afterend', empty);
        window.__equityDays = days; window.__equityRendered = true;
        return;
      }

      var eq  = win.map(function(s){ return s.equity; });
      var bm  = win.map(function(s){ return typeof s.spy_equity === 'number' ? s.spy_equity : null; })
                   .filter(function(v){ return v !== null; });
      var all = eq.concat(bm);
      var min = Math.min.apply(null, all), max = Math.max.apply(null, all);
      var span = (max - min) || 1;
      var pts = function(arr){
        return arr.map(function(v, i){
          return (i / (arr.length - 1) * 600).toFixed(1) + ',' +
                 (10 + (1 - (v - min) / span) * 200).toFixed(1);
        }).join(' ');
      };
      var stratPts = pts(eq);
      strat.setAttribute('points', stratPts);
      spy.setAttribute('points', bm.length > 1 ? pts(bm) : '');
      fill.setAttribute('points', '0,220 ' + stratPts + ' 600,220');

      document.getElementById('equityHi').textContent = usd0(max);
      document.getElementById('equityLo').textContent = usd0(min);
      document.getElementById('equityOpen').textContent = usd2(eq[0]);
      document.getElementById('equityClose').textContent = usd2(eq[eq.length - 1]);

      dates.textContent = '';
      [0, 1/3, 2/3, 1].forEach(function(f){
        var s = document.createElement('span');
        s.textContent = fmtDate(win[Math.round(f * (win.length - 1))].date);
        dates.appendChild(s);
      });

      window.__equityDays = days;
      window.__equityRendered = true;
    }

    fetch('json/paper-equity.json', {cache: 'no-cache'})
      .then(function(r){ if (!r.ok) throw new Error('http ' + r.status); return r.json(); })
      .then(function(data){
        snaps = (data.snapshots || []).filter(function(s){ return typeof s.equity === 'number'; });

        var cap = document.getElementById('equityCaption');
        cap.textContent = '$5,000 paper account · opened ' + data.start_date +
          (snaps.length ? ' · data through ' + fmtDate(snaps[snaps.length - 1].date) : '');

        var hold = document.getElementById('equityHolding');
        var positions = Array.isArray(data.positions) ? data.positions : [];
        if (positions.length){
          var lbl = document.createElement('span');
          lbl.className = 'lbl'; lbl.textContent = 'HOLDING';
          hold.appendChild(lbl);
          positions.forEach(function(sym){
            var s = document.createElement('span');
            s.className = 'sym'; s.textContent = sym;
            hold.appendChild(s);
          });
        } else {
          hold.hidden = true;
        }

        toggle.addEventListener('click', function(e){
          var b = e.target.closest('button[data-days]');
          if (!b) return;
          toggle.querySelectorAll('button[data-days]').forEach(function(x){
            x.classList.remove('is-active');
          });
          b.classList.add('is-active');
          render(Number(b.dataset.days));
        });

        btn.addEventListener('click', function(){
          panel.hidden = false; setOthers(true); render(60);
        });
        document.getElementById('equityDismiss').addEventListener('click', function(){
          panel.hidden = true; setOthers(false);
        });

        btn.hidden = false;
      })
      .catch(function(){
        // Silent: no chart is better than a half-rendered one. The other two
        // project cards must still render.
        panel.remove();
        btn.hidden = true;
      });
  })();
```

Add `hidden` to the `#viewResults` button in the Task 4 markup so it only appears once data has loaded.

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx playwright test tests/equity.spec.js`
Expected: PASS — 8 tests.

- [ ] **Step 7: Commit**

```bash
git add index.html tests/equity.spec.js
git commit -m "feat(site): equity panel on real paper-trading data

The export's chart was hardcoded keyframes with a sin() wobble baked
in. This wires the panel to json/paper-equity.json instead, carrying
over the newest-snapshot windowing from the old site -- wall-clock
windows starve to zero points between weekly publishes.

Failed fetch removes the panel and hides the toggle rather than
showing an empty chart; the other two project cards are unaffected.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01JUCDLSSyTgkys9xtoQTaFY"
```

---

### Task 6: Photos section

Four frames now; `vegas-26.png` is added in Task 10 when the asset lands.

**Files:**
- Create: `tests/photos.spec.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `.section`, `.prompt` from Tasks 3–4.
- Produces: `#photos`, `.gal`, `.gframe`, `.gframe-img`, `.gframe-cap`.

- [ ] **Step 1: Write the failing test — `tests/photos.spec.js`**

```js
const { test, expect } = require('@playwright/test');
const { dismissBoot } = require('./helpers');

test.describe('photos', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
  });

  test('captions are numbered and approved', async ({ page }) => {
    const caps = await page.locator('#photos .gframe-cap').allTextContents();
    expect(caps).toEqual(["02 · XMAS '25", "03 · HALLOWEEN '25", "04 · LILO '25", "05 · NOX '25"]);
  });

  test('every frame has real alt text', async ({ page }) => {
    const alts = await page.locator('#photos .gframe-img').evaluateAll((els) =>
      els.map((e) => e.getAttribute('alt')));
    expect(alts.every((a) => a && a.trim().length > 0)).toBe(true);
  });

  test('images actually load', async ({ page }) => {
    // The frames are lazy-loaded and below the fold, so they must be scrolled
    // into view before `complete`/`naturalWidth` mean anything.
    await page.locator('#photos').scrollIntoViewIfNeeded();
    await expect
      .poll(async () =>
        page.locator('#photos .gframe-img').evaluateAll((els) =>
          els.every((e) => e.complete && e.naturalWidth > 0)),
        { timeout: 15000 })
      .toBe(true);
  });

  test('frames are lazy-loaded below the fold', async ({ page }) => {
    const loading = await page.locator('#photos .gframe-img').evaluateAll((els) =>
      els.map((e) => e.getAttribute('loading')));
    expect(loading.every((l) => l === 'lazy')).toBe(true);
  });

  test('nav anchor reaches the section', async ({ page }) => {
    await page.locator('.nav-btn[href="#photos"]').click();
    await expect(page.locator('#photos')).toBeInViewport({ timeout: 5000 });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx playwright test tests/photos.spec.js`
Expected: FAIL — no `#photos`.

- [ ] **Step 3: Add the photos markup**

```html
<section id="photos" class="section gal-section" data-screen-label="photos">
  <div class="prompt"><span class="prompt-user">chase@localhost</span><span class="prompt-path">:~/photos</span> ❯ <span>open *.jpg</span></div>
  <div class="gal">
    <figure class="gframe">
      <div class="gframe-box"><img class="gframe-img" src="images/xmas-25.jpg" alt="Christmas 2025" loading="lazy" decoding="async"></div>
      <figcaption class="gframe-cap">02 · XMAS '25</figcaption>
    </figure>
    <figure class="gframe">
      <div class="gframe-box"><img class="gframe-img" src="images/halloween-25.jpg" alt="Halloween 2025" loading="lazy" decoding="async"></div>
      <figcaption class="gframe-cap">03 · HALLOWEEN '25</figcaption>
    </figure>
    <figure class="gframe">
      <div class="gframe-box"><img class="gframe-img" src="images/lilo-25.jpg" alt="Lilo 2025" loading="lazy" decoding="async"></div>
      <figcaption class="gframe-cap">04 · LILO '25</figcaption>
    </figure>
    <figure class="gframe">
      <div class="gframe-box"><img class="gframe-img" src="images/nox-25.jpg" alt="Nox 2025" loading="lazy" decoding="async"></div>
      <figcaption class="gframe-cap">05 · NOX '25</figcaption>
    </figure>
  </div>
</section>
```

Numbering starts at 02 because `01 · LAS VEGAS '26` is reserved for Task 10.

- [ ] **Step 4: Add the photos CSS**

```css
  .gal-section{display:flex;flex-direction:column;justify-content:center;padding:48px 0}
  .gal{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px}
  .gframe{margin:0}
  .gframe-box{aspect-ratio:1;border:1px solid var(--line);max-width:100%;overflow:hidden}
  .gframe-img{width:100%;height:100%;object-fit:cover;display:block;
      filter:grayscale(1) sepia(1) hue-rotate(65deg) saturate(1.6) brightness(.95)}
  .gframe-cap{font-size:11px;color:var(--dim-3);letter-spacing:.12em;margin-top:8px}
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx playwright test tests/photos.spec.js`
Expected: PASS — 5 tests.

- [ ] **Step 6: Commit**

```bash
git add index.html tests/photos.spec.js
git commit -m "feat(site): Matrix photo gallery

Four green-duotone frames, numbered from 02 -- 01 is reserved for
the Las Vegas '26 frame, which lands with its asset. Uses
figure/figcaption with real alt text rather than the export's
background-image divs, which carried no accessible name.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01JUCDLSSyTgkys9xtoQTaFY"
```

---

### Task 7: Contact section

**Files:**
- Create: `tests/contact.spec.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `.section`, `.prompt`, `.subtitle`.
- Produces: `#contact`, `.contact-grid`, `.clink`, `#discordLink`.

- [ ] **Step 1: Write the failing test — `tests/contact.spec.js`**

```js
const { test, expect } = require('@playwright/test');
const { dismissBoot } = require('./helpers');

test.describe('contact', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
  });

  test('shows seven endpoints, matching the stated count', async ({ page }) => {
    await expect(page.locator('#contact .subtitle')).toHaveText('7 endpoints · reply time ~24h');
    await expect(page.locator('#contact .clink')).toHaveCount(7);
  });

  test('labels the endpoints', async ({ page }) => {
    const keys = await page.locator('#contact .clink-k').allTextContents();
    expect(keys).toEqual(['EMAIL','PHONE','LINKEDIN','BLUESKY','STEAM','XBOX','DISCORD']);
  });

  test('mail and tel links are wired', async ({ page }) => {
    await expect(page.locator('#contact a[href="mailto:chase@ch4ze.com"]')).toHaveCount(1);
    await expect(page.locator('#contact a[href="tel:+15024388129"]')).toHaveCount(1);
  });

  test('external links are safely targeted', async ({ page }) => {
    const bad = await page.locator('#contact a[target="_blank"]').evaluateAll((els) =>
      els.filter((e) => !(e.getAttribute('rel') || '').includes('noopener')).length);
    expect(bad).toBe(0);
  });

  test('Discord is an interactive copy button, not an inert div', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const el = page.locator('#discordLink');
    expect(await el.evaluate((e) => e.tagName)).toBe('BUTTON');
    await el.click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('chase_22');
  });

  test('nav anchor reaches the section', async ({ page }) => {
    await page.locator('.nav-btn[href="#contact"]').click();
    await expect(page.locator('#contact')).toBeInViewport({ timeout: 5000 });
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx playwright test tests/contact.spec.js`
Expected: FAIL — no `#contact`.

- [ ] **Step 3: Add the contact markup**

```html
<section id="contact" class="section contact-section" data-screen-label="contact">
  <div class="prompt"><span class="prompt-user">chase@localhost</span><span class="prompt-path">:~</span> ❯ <span>contact --all</span></div>
  <div class="subtitle">7 endpoints · reply time ~24h</div>
  <div class="contact-grid">
    <a class="clink" href="mailto:chase@ch4ze.com"><span class="clink-k">EMAIL</span><span class="clink-v">chase@ch4ze.com</span></a>
    <a class="clink" href="tel:+15024388129"><span class="clink-k">PHONE</span><span class="clink-v">502-438-8129</span></a>
    <a class="clink" href="https://www.linkedin.com/in/chasecrawford" target="_blank" rel="noopener"><span class="clink-k">LINKEDIN</span><span class="clink-v">/in/chasecrawford</span></a>
    <a class="clink" href="https://bsky.app/profile/chasecrawford.dev" target="_blank" rel="noopener"><span class="clink-k">BLUESKY</span><span class="clink-v">@chasecrawford.dev</span></a>
    <a class="clink" href="https://steamcommunity.com/id/ch4ze/" target="_blank" rel="noopener"><span class="clink-k">STEAM</span><span class="clink-v">/id/ch4ze</span></a>
    <a class="clink" href="https://www.xbox.com/en-US/play/user/Adalius" target="_blank" rel="noopener"><span class="clink-k">XBOX</span><span class="clink-v">Adalius</span></a>
    <button type="button" class="clink" id="discordLink" data-handle="chase_22" title="Click to copy"><span class="clink-k">DISCORD</span><span class="clink-v">chase_22</span></button>
  </div>
</section>
```

- [ ] **Step 4: Add the contact CSS**

```css
  .contact-section{display:flex;flex-direction:column;justify-content:center;padding:48px 0}
  .contact-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));
                gap:12px;font-size:13px;margin-top:18px}
  .clink{border:1px solid var(--line);background:var(--panel-solid);padding:16px 18px;
         display:flex;flex-direction:column;gap:4px;text-align:left;
         font-family:inherit;font-size:13px;cursor:pointer;color:inherit}
  .clink:hover{border-color:var(--green);box-shadow:0 0 20px rgba(var(--green-rgb),.2);text-decoration:none}
  .clink:focus-visible{outline:2px solid var(--green);outline-offset:2px}
  .clink-k{font-size:11px;letter-spacing:.14em;color:var(--dim-3)}
  .clink-v{color:var(--ink-bright)}
```

- [ ] **Step 5: Add the Discord copy JS**

```js
  // ===== DISCORD CLICK-TO-COPY =====
  (function discord(){
    var btn = document.getElementById('discordLink');
    if (!btn) return;
    var val = btn.querySelector('.clink-v');
    btn.addEventListener('click', function(){
      var handle = btn.dataset.handle;
      var restore = function(){
        val.textContent = 'copied!';
        setTimeout(function(){ val.textContent = handle; }, 1200);
      };
      if (navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(handle).then(restore, function(){});
      }
    });
  })();
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx playwright test tests/contact.spec.js`
Expected: PASS — 6 tests.

- [ ] **Step 7: Commit**

```bash
git add index.html tests/contact.spec.js
git commit -m "feat(site): Matrix contact section

Seven endpoint cards matching the stated count. Discord keeps the
old site's click-to-copy: the export rendered it as an inert div,
but that is a canvas limitation rather than a design decision -- the
endpoint itself survives the redesign.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01JUCDLSSyTgkys9xtoQTaFY"
```

---

### Task 8: Vendored dependencies + `<matrix-map>`

**Files:**
- Create: `vendor/leaflet.js`, `vendor/leaflet.css`, `vendor/d3.min.js`, `vendor/topojson-client.min.js`, `vendor/counties-10m.json`, `js/matrix-map.js`, `tests/map.spec.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: `#trace` frame from Task 3.
- Produces: `<matrix-map>` custom element; sets `window.__mapState` to `'acquiring' | 'locked' | 'failed'` so tests can observe it without racing the 11s animation.

- [ ] **Step 1: Vendor the pinned dependencies**

```bash
mkdir -p vendor js
curl -fsSL https://unpkg.com/leaflet@1.9.4/dist/leaflet.js               -o vendor/leaflet.js
curl -fsSL https://unpkg.com/leaflet@1.9.4/dist/leaflet.css              -o vendor/leaflet.css
curl -fsSL https://unpkg.com/d3@7.9.0/dist/d3.min.js                     -o vendor/d3.min.js
curl -fsSL https://unpkg.com/topojson-client@3.1.0/dist/topojson-client.min.js -o vendor/topojson-client.min.js
curl -fsSL https://cdn.jsdelivr.net/npm/us-atlas@3.0.1/counties-10m.json -o vendor/counties-10m.json
```

Verify each file is non-empty and that `counties-10m.json` parses:

```bash
ls -l vendor/
node -e "const t=require('./vendor/counties-10m.json');console.log('objects:',Object.keys(t.objects))"
```

Expected: `objects: [ 'counties', 'states', 'nation' ]`

- [ ] **Step 2: Write the failing test — `tests/map.spec.js`**

```js
const { test, expect } = require('@playwright/test');
const { dismissBoot } = require('./helpers');

test.describe('trace map', () => {
  test('acquires, then locks on Louisville', async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
    await expect(page.locator('#trace matrix-map')).toHaveCount(1);
    await page.waitForFunction(() => window.__mapState === 'locked', null, { timeout: 45000 });
    await expect(page.locator('#trace .map-label')).toContainText('SIGNAL LOCKED');
    await expect(page.locator('#trace .map-label')).toContainText('LOUISVILLE, KY');
  });

  test('keeps tile attribution visible', async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
    await page.waitForFunction(() => window.__mapState === 'locked', null, { timeout: 45000 });
    await expect(page.locator('#trace .leaflet-control-attribution')).toContainText(/Esri/i);
  });

  test('loads dependencies locally, never from a public CDN', async ({ page }) => {
    const external = [];
    page.on('request', (r) => {
      const u = r.url();
      if (/unpkg\.com|cdn\.jsdelivr\.net/.test(u)) external.push(u);
    });
    await page.goto('/index.html');
    await dismissBoot(page);
    await page.waitForTimeout(3000);
    expect(external).toEqual([]);
  });

  test('a blocked vendor bundle hides the panel instead of hanging', async ({ page }) => {
    await page.route('**/vendor/**', (r) => r.abort());
    await page.goto('/index.html');
    await dismissBoot(page);
    await page.waitForFunction(() => window.__mapState === 'failed', null, { timeout: 15000 });
    await expect(page.locator('.hero-right')).toBeAttached();
    await expect(page.locator('.hero-right')).toBeHidden();
    await expect(page.locator('#name')).toBeVisible();
  });
});

test.describe('trace map with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('skips the 11s trace and locks immediately', async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
    await page.waitForFunction(() => window.__mapState === 'locked', null, { timeout: 10000 });
  });
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx playwright test tests/map.spec.js`
Expected: FAIL — no `matrix-map` element.

- [ ] **Step 4: Create `js/matrix-map.js`**

Start from the export's `matrix-map.js` (fetch it via DesignSync) and apply these six changes:

1. Fetch the atlas from `vendor/counties-10m.json`, not jsDelivr.
2. Replace the unbounded `wait()` poll with a deadline:

```js
    connectedCallback(){
      if (this._init) return;
      this._init = true;
      this.style.display = 'block';
      this.style.position = 'relative';
      var self = this, deadline = Date.now() + 5000;
      (function wait(){
        if (window.d3 && window.topojson && window.L) return self.build();
        if (Date.now() > deadline) return self.fail();
        setTimeout(wait, 60);
      })();
    }
    fail(){
      window.__mapState = 'failed';
      var panel = this.closest('.hero-right');
      if (panel) panel.hidden = true;
    }
```

3. Wrap `build()`'s atlas fetch in try/catch and call `this.fail()` on error.
4. Keep `attributionControl: true` (drop the `false`) and set the tile layer's attribution:

```js
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19,
        attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, USGS, NRCAN'
      }).addTo(map);
```

5. Give the label element `class="map-label"` in addition to its inline styles, and set `window.__mapState` at each stage — `'acquiring'` before the zoom, `'locked'` in the transition's `end` handler.
6. Honor reduced motion — skip the trace entirely:

```js
      var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (reduced){
        svgWrap.style.opacity = '0';
        mapEl.style.opacity = '1';
        label.className = 'map-label';
        label.textContent = 'SIGNAL LOCKED > LOUISVILLE, KY · 38.2527°N 85.7585°W';
        window.__mapState = 'locked';
        return;
      }
```

Everything else — the `geoAlbersUsa` projection, the `interpolateZoom` tween, the county-mesh opacity ramp, the end-scale matching, click-to-replay — is carried over unchanged.

- [ ] **Step 5: Wire it into `index.html`**

In `<head>`, after the fonts link:

```html
<link rel="stylesheet" href="vendor/leaflet.css">
<link rel="preload" as="fetch" href="vendor/counties-10m.json" crossorigin>
```

Before the closing `</body>`, after the page script:

```html
<script defer src="vendor/d3.min.js"></script>
<script defer src="vendor/topojson-client.min.js"></script>
<script defer src="vendor/leaflet.js"></script>
<script defer src="js/matrix-map.js"></script>
```

`defer` matters here and is not cosmetic. The spec requires the map never block first paint or the boot sequence; deferring keeps ~700 KB of libraries off the critical path while still guaranteeing execution order, so `d3`/`topojson`/`L` are always defined before `matrix-map.js` runs. The `<matrix-map>` element already in the DOM is upgraded at definition time, so nothing is lost by running late.

And put the element inside the Task 3 frame:

```html
<div id="trace" class="trace-frame"><matrix-map></matrix-map></div>
```

Add to the `<style>` block:

```css
  #trace matrix-map{position:absolute;inset:0}
  .map-label{position:absolute;left:0;right:0;bottom:0;z-index:500;
    font:11px 'IBM Plex Mono',monospace;letter-spacing:.1em;color:var(--green);
    padding:8px 12px;background:linear-gradient(transparent,rgba(0,8,3,.85));pointer-events:none}
  .leaflet-control-attribution{background:rgba(2,8,3,.8)!important;color:var(--dim-3)!important;
    font-size:9px!important}
  .leaflet-control-attribution a{color:var(--dim-2)!important}
```

- [ ] **Step 6: Run the test to verify it passes**

Run: `npx playwright test tests/map.spec.js`
Expected: PASS — 5 tests.

- [ ] **Step 7: Commit**

```bash
git add vendor/ js/ index.html tests/map.spec.js
git commit -m "feat(site): TRACE PROGRAM map with vendored deps

Vector US map zooms into Louisville, then crossfades to street
tiles. Leaflet, d3, topojson and the us-atlas county file are
vendored so the hero is not hostage to unpkg and jsDelivr uptime;
the atlas is kept whole per the owner's fidelity call.

Fixes two export defects: Esri attribution was switched off while
consuming Esri tiles, and the dependency poll had no deadline, so a
failed load span forever. It now gives up after 5s and hides the
panel. Reduced motion skips the 11s trace.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01JUCDLSSyTgkys9xtoQTaFY"
```

---

### Task 9: Responsive + accessibility sweep

**Files:**
- Create: `tests/responsive.spec.js`
- Modify: `index.html`

**Interfaces:**
- Consumes: every section from Tasks 3–8.
- Produces: no new API — hardens existing markup.

- [ ] **Step 1: Write the failing test — `tests/responsive.spec.js`**

```js
const { test, expect } = require('@playwright/test');
const { dismissBoot } = require('./helpers');

const WIDTHS = [390, 768, 1440];

for (const width of WIDTHS) {
  test.describe(`at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('never scrolls horizontally', async ({ page }) => {
      await page.goto('/index.html');
      await dismissBoot(page);
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });

    test('all four sections are present', async ({ page }) => {
      await page.goto('/index.html');
      await dismissBoot(page);
      for (const id of ['#projects', '#photos', '#contact']) {
        await expect(page.locator(id)).toHaveCount(1);
      }
      await expect(page.locator('.hero')).toHaveCount(1);
    });
  });
}

test.describe('mobile layout rules', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('scroll-snap is off and the results toggle is hidden', async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
    const snap = await page.evaluate(() =>
      getComputedStyle(document.documentElement).scrollSnapType);
    expect(snap === 'none' || snap === '').toBe(true);
    await expect(page.locator('#viewResults')).toBeAttached();
    await expect(page.locator('#viewResults')).toBeHidden();
  });
});

test.describe('page health', () => {
  test('logs no console errors', async ({ page }) => {
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto('/index.html');
    await dismissBoot(page);
    await page.waitForFunction(() => window.__mapState === 'locked', null, { timeout: 45000 });
    expect(errors).toEqual([]);
  });

  test('has exactly one h1 and it names the owner', async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(/CHASE\s*CRAWFORD/);
  });

  test('interactive controls are keyboard reachable', async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
    await page.keyboard.press('Tab');
    const tag = await page.evaluate(() => document.activeElement.tagName);
    expect(['A', 'BUTTON']).toContain(tag);
  });

  // Spec §Accessibility: body text on --bg and label text on card fills must
  // both be checked. Contrast is computed here rather than eyeballed.
  test('text meets WCAG AA contrast on its own surface', async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);

    const ratios = await page.evaluate(() => {
      const lum = (rgb) => {
        const [r, g, b] = rgb.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number).map((v) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const ratio = (fg, bg) => {
        const a = lum(fg), b = lum(bg);
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      };
      // Card fills are translucent over the rain canvas; measure against the
      // opaque page background, which is the darkest thing behind them.
      const pageBg = getComputedStyle(document.body).backgroundColor;
      const probe = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        return { sel, r: ratio(getComputedStyle(el).color, pageBg) };
      };
      return ['.proj-desc', '.clink-k', '.subtitle', '.gframe-cap', '.proj-idx']
        .map(probe).filter(Boolean);
    });

    const failures = ratios.filter((x) => x.r < 4.5);
    expect(failures, JSON.stringify(ratios, null, 2)).toEqual([]);
  });
});
```

If a selector fails, **darken the card fill rather than lightening the brand green** — `--green` and the dim-green ramp are the design's identity. `--dim-4` (`#2f7a4a`, used for `.proj-idx` and separators) is the most likely failure; if it does fail, either raise it toward `--dim-3` or demote those elements to decorative (`aria-hidden`) and exclude them from the probe list with a comment saying why.

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx playwright test tests/responsive.spec.js`
Expected: FAIL on at least the 390px overflow check — `.name` uses `white-space:nowrap` at `clamp(44px,8vw,96px)`, and "CRAWFORD" at 44px overflows a 390px viewport minus the 24px gutters.

- [ ] **Step 3: Fix the overflow and harden focus**

Add to the `<style>` block:

```css
  @media (max-width:480px){
    .name{font-size:clamp(30px,11vw,44px)}
  }
  .wrap :focus-visible{outline:2px solid var(--green);outline-offset:2px}
```

Then re-run and fix any remaining overflow the test reports — the likely candidates are `.equity-holding` (long symbol list) and `.equity-dates`; both already wrap or space-between, but confirm rather than assume.

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx playwright test tests/responsive.spec.js`
Expected: PASS — 10 tests.

- [ ] **Step 5: Run the whole suite**

Run: `npx playwright test`
Expected: PASS — all specs green.

- [ ] **Step 6: Commit**

```bash
git add index.html tests/responsive.spec.js
git commit -m "fix(site): responsive + a11y sweep for the Matrix redesign

Locks in no horizontal scroll at 390/768/1440, a single h1, visible
focus rings on every interactive control, and a clean console. The
hero name needed a smaller clamp floor under 480px -- nowrap
'CRAWFORD' at 44px overflowed a 390px viewport.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01JUCDLSSyTgkys9xtoQTaFY"
```

---

### Task 10: Vegas frame + final verification

**Blocked on the asset.** `images/vegas-26.png` exists only in the design project. `DesignSync` caps reads at 256 KB and cannot write to disk, so attempt the pull first and ask the owner to supply the file if it fails. Tasks 1–9 are complete and reviewable without this.

**Files:**
- Create: `images/vegas-26.png`
- Modify: `index.html`, `tests/photos.spec.js`

**Interfaces:**
- Consumes: `.gal`, `.gframe` from Task 6.
- Produces: final gallery of five frames.

- [ ] **Step 1: Obtain the asset**

Try:

```
DesignSync(method="get_file",
           projectId="a3cd2b07-f849-4b91-a8f4-7b417d052b23",
           path="images/vegas-26.png")
```

If it returns base64, decode to `images/vegas-26.png`. If it fails the size cap, **stop and ask the owner** to place the file at `images/vegas-26.png`. Do not substitute a placeholder.

Verify: `node -e "console.log(require('fs').statSync('images/vegas-26.png').size)"` → non-zero.

- [ ] **Step 2: Update the failing test in `tests/photos.spec.js`**

Replace the captions assertion:

```js
  test('captions are numbered and approved', async ({ page }) => {
    const caps = await page.locator('#photos .gframe-cap').allTextContents();
    expect(caps).toEqual([
      "01 · LAS VEGAS '26", "02 · XMAS '25", "03 · HALLOWEEN '25",
      "04 · LILO '25", "05 · NOX '25",
    ]);
  });
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npx playwright test tests/photos.spec.js`
Expected: FAIL — four captions found, five expected.

- [ ] **Step 4: Add the frame**

Insert as the first child of `.gal`:

```html
<figure class="gframe">
  <div class="gframe-box"><img class="gframe-img" src="images/vegas-26.png" alt="Las Vegas 2026" loading="lazy" decoding="async"></div>
  <figcaption class="gframe-cap">01 · LAS VEGAS '26</figcaption>
</figure>
```

- [ ] **Step 5: Run the test to verify it passes**

Run: `npx playwright test tests/photos.spec.js`
Expected: PASS — 5 tests.

- [ ] **Step 6: Full suite + screenshots for owner review**

```bash
npx playwright test
```

Expected: all specs green.

Then capture review screenshots:

```bash
npx playwright screenshot --viewport-size=1440,900 --wait-for-timeout=20000 \
  http://127.0.0.1:4173/index.html /tmp/matrix-1440.png
npx playwright screenshot --viewport-size=390,844 --wait-for-timeout=20000 \
  http://127.0.0.1:4173/index.html /tmp/matrix-390.png
```

(Requires `npm run serve` in another shell.) Send both to the owner with `SendUserFile`.

- [ ] **Step 7: Commit**

```bash
git add images/vegas-26.png index.html tests/photos.spec.js
git commit -m "feat(site): add Las Vegas '26 gallery frame

Completes the five-frame gallery from the approved export.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_01JUCDLSSyTgkys9xtoQTaFY"
```

- [ ] **Step 8: Verify the retired content is actually gone**

```bash
grep -c -i -E 'banner-sm|titlebar|wctl|closeOverlay|ticker|statusbar|cc8|experience\.log|8ball' index.html
```

Expected: `0`.

Confirm nothing outside scope moved:

```bash
git diff --stat main..HEAD -- 404.html blackjack-coach/ resume.pdf/ pdf/ CNAME .nojekyll ch4ze-ui/ json/
```

Expected: empty output.

---

## Deferred

Not part of this plan; raise with the owner after merge.

- `ch4ze-ui/` still mirrors the retired CRT design (Shell, TitleBar, Magic8Ball, Ticker…). It does not ship, so nothing breaks, but it now documents a site that no longer exists.
- No deploy. `feat/matrix-redesign` stays local until reviewed. Pushing requires switching to the `chasecrawford` GitHub account and a `pull --rebase` first.
