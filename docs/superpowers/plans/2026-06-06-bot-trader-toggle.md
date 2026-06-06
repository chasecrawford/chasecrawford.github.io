# 7D/30D Equity Chart Toggle Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a 7D/30D toggle pill to the equity sparkline card header so visitors can switch between one week and one month of trading history.

**Architecture:** Two independent changes in two repos — a one-line flag bump in the bot-trader publish script (so the JSON carries 30 trading days instead of 5), and a three-part edit in `index.html` (HTML structure, CSS layout, JS re-render logic). The JSON schema does not change; the site JS slices the full snapshot array by calendar-day window on every toggle click.

**Tech Stack:** Vanilla HTML/CSS/JS (no build step), Python/PowerShell (bot-trader)

---

## Files

| File | Change |
|---|---|
| `bot-trader/scripts/publish_equity.ps1` | `--trading-days 5` → `--trading-days 30` |
| `chasecrawford-dev-html/index.html` | HTML: toggle pill, label text, caption placement |
| `chasecrawford-dev-html/index.html` | CSS: centered footer, toggle pill styles, remove caption push rule |
| `chasecrawford-dev-html/index.html` | JS: refactor `renderEquity` into fetch/setup + `renderWindow(days)` |

---

## Task 1: bot-trader — bump equity-history export window

**Repo:** `C:\Users\Chase\Repos\Personal\active\bot-trader`

**Files:**
- Modify: `scripts/publish_equity.ps1:57-58`

- [ ] **Step 1: Make the change**

In `scripts/publish_equity.ps1`, find the `equity-history` invocation (lines 57–58) and change `--trading-days 5` to `--trading-days 30`:

```powershell
# Before:
& "$repo\.venv\Scripts\python.exe" "trades_cli.py" "equity-history" `
    "--trading-days" "5" "--benchmark" "SPY" "--output" "$jsonAbs"

# After:
& "$repo\.venv\Scripts\python.exe" "trades_cli.py" "equity-history" `
    "--trading-days" "30" "--benchmark" "SPY" "--output" "$jsonAbs"
```

- [ ] **Step 2: Verify the CLI accepts the new value (dry run)**

In the `bot-trader` directory, run:

```powershell
.\.venv\Scripts\python.exe trades_cli.py equity-history --trading-days 30 --benchmark SPY
```

Expected: JSON printed to stdout with up to 30 snapshot entries and `spy_equity` on each. No errors. (If `trades.db` doesn't exist on this machine, expected: `RuntimeError: Cannot compute benchmark -- no equity snapshots recorded`; that's fine — the flag is accepted. The real run happens on the machine with the live DB.)

- [ ] **Step 3: Commit in the bot-trader repo**

```bash
cd "C:/Users/Chase/Repos/Personal/active/bot-trader"
git add scripts/publish_equity.ps1
git commit -m "feat: export 30 trading days to paper-equity.json (was 5)"
git push origin main
```

---

## Task 2: site HTML — toggle pill, label text, caption placement

**Repo:** `C:\Users\Chase\Repos\Personal\active\chasecrawford-dev-html`

**Files:**
- Modify: `index.html:796-831` (equity card markup)

- [ ] **Step 1: Update the card opening tag aria-label**

Find:
```html
<div class="proj proj-chart" id="equityCard" aria-label="Paper-trading equity, last 7 days">
```
Replace with:
```html
<div class="proj proj-chart" id="equityCard" aria-label="Paper-trading equity chart">
```

- [ ] **Step 2: Replace the cadence badge with the toggle pill**

Find:
```html
<div class="proj-head"><span class="id">Paper Trading Trial No. 2</span><span id="equityCadence">7D</span></div>
```
Replace with:
```html
<div class="proj-head"><span class="id">Paper Trading Trial No. 2</span><div class="equity-toggle" id="equityToggle" role="group" aria-label="Chart window"><button class="active" data-days="7">7D</button><button data-days="30">30D</button></div></div>
```

- [ ] **Step 3: Change stat labels from "week open/close" to "open/close" and move caption out of proj-stats**

Find the entire `proj-stats` + `equity-positions` block:
```html
          <div class="proj-stats" id="equityStats">
            <div>week open: <b id="equityStart">&mdash;</b></div>
            <div>week close: <b id="equityNow">&mdash;</b></div>
            <div class="equity-caption" id="equitySince">&mdash;</div>
          </div>
          <div class="equity-positions" id="equityPositions" style="display:none">
```
Replace with:
```html
          <div class="proj-stats" id="equityStats">
            <div>open: <b id="equityStart">&mdash;</b></div>
            <div>close: <b id="equityNow">&mdash;</b></div>
          </div>
          <div class="equity-caption" id="equitySince"></div>
          <div class="equity-positions" id="equityPositions" style="display:none">
```

- [ ] **Step 4: Verify HTML structure visually**

Open `index.html` in a browser (or live server). The equity card should show:
- Header: "Paper Trading Trial No. 2" on left, two small buttons "7D" and "30D" on right (unstyled at this point — that's fine)
- Footer stats area: "open: —" and "close: —" side by side, followed by an empty line where the caption will go
- No visual regressions in other cards

---

## Task 3: site CSS — toggle pill styles, centered footer, remove caption push

**Files:**
- Modify: `index.html` CSS block (~lines 448–451 and ~lines 596–601)

- [ ] **Step 1: Replace the footer caption push rule and add toggle + centered-footer CSS**

Find the two-line block:
```css
  /* footer wraps to a 2nd row only on viewports where the caption doesn't fit
     alongside the stats (mobile single-column at ~328px content width). */
  .proj-chart .proj-stats{flex-wrap:wrap}
  /* push the caption to the right edge of the footer */
  .proj-chart .proj-stats .equity-caption{margin-left:auto}
```
Replace with:
```css
  /* footer stats centered; caption is its own row below */
  .proj-chart .proj-stats{justify-content:center}
  .equity-caption{
    font-size:9px;color:var(--ink2);letter-spacing:.05em;
    text-align:center;margin-top:4px;
  }
  /* 7D / 30D toggle pill in the card header */
  .equity-toggle{display:inline-flex;border:1px solid var(--line);border-radius:3px;overflow:hidden}
  .equity-toggle button{
    background:none;border:none;cursor:pointer;
    padding:2px 7px;font-family:inherit;font-size:9px;
    letter-spacing:.06em;color:var(--ink2);line-height:1.4;
  }
  .equity-toggle button.active{background:var(--green);color:#0d1117;font-weight:700}
  .equity-toggle button:not(.active):hover{color:var(--ink)}
```

- [ ] **Step 2: Remove the mobile override rules that referenced the old caption placement**

Find the mobile override block for the equity footer (inside a `@media` rule, around line 596–601):
```css
    /* Footer stats: stack vertically and center. justify-content:center
       alone wasn't enough because the week-open/week-close pair happen to
       fill the row almost exactly at this width — so the row looked
       "left/right anchored" even when it was technically centered. */
    .proj-chart .proj-stats{flex-direction:column;align-items:center;gap:6px}
    .proj-chart .proj-stats .equity-caption{margin-left:0}
```
Replace with (keep the stack behaviour, remove the now-irrelevant caption margin):
```css
    .proj-chart .proj-stats{flex-direction:column;align-items:center;gap:6px}
```

- [ ] **Step 3: Verify styling**

Open `index.html` in a browser. Check:
- Toggle pill renders as two small buttons in the card header, right-aligned. "7D" is green/active, "30D" is dimmed.
- Footer shows "open: —" and "close: —" centered on one row.
- Below that: empty caption row (will populate once JS runs).
- At narrow width (< 360px): stats stack vertically and center.
- No regressions in other `.proj-stats` instances (the detail cards still render their stats flush-left because the `.proj-chart .proj-stats` selector is scoped).

---

## Task 4: site JS — refactor renderEquity into fetch/setup + renderWindow(days)

**Files:**
- Modify: `index.html` JS block, the `renderEquity` IIFE (~lines 1224–1423)

- [ ] **Step 1: Replace the entire renderEquity IIFE**

Find the block that starts with:
```javascript
  // =========== EQUITY SPARKLINE ===========
```
and ends with:
```javascript
  })();
```
(the closing of the renderEquity IIFE, around line 1423)

Replace the entire block with the following:

```javascript
  // =========== EQUITY SPARKLINE ===========
  // Fetches paper-equity.json (refreshed by the bot-trader scheduled task)
  // and draws an SVG line + reference line + axis labels into the equity card.
  // Silent on failure: a broken fetch hides the card rather than showing
  // a half-rendered chart.
  (async function renderEquity() {
    const card    = document.getElementById('equityCard');
    if (!card) return;
    const startEl  = document.getElementById('equityStart');
    const nowEl    = document.getElementById('equityNow');
    const sinceEl  = document.getElementById('equitySince');
    const yMaxEl   = document.getElementById('equityYMax');
    const yMinEl   = document.getElementById('equityYMin');
    const yStartEl = document.getElementById('equityYStart');
    const xAxis    = document.getElementById('equityXAxis');
    const frame    = document.getElementById('equityFrame');
    const svg      = document.getElementById('equitySpark');
    const toggle   = document.getElementById('equityToggle');

    let data;
    try {
      const res = await fetch('json/paper-equity.json', {cache: 'no-cache'});
      if (!res.ok) throw new Error('http ' + res.status);
      data = await res.json();
    } catch (_) {
      card.style.display = 'none';
      return;
    }

    const allSnaps = (data.snapshots || []).filter(s => typeof s.equity === 'number');

    const fmtUSD2 = v => '$' + v.toLocaleString(undefined, {
      minimumFractionDigits: 2, maximumFractionDigits: 2,
    });
    const fmtUSD0 = v => '$' + Math.round(v).toLocaleString();
    const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const fmtDate = iso => {
      const [, m, d] = iso.split('-').map(Number);
      return `${MONTHS[m - 1]} ${String(d).padStart(2, '0')}`;
    };

    // Filter allSnaps to entries whose date falls within `days` calendar days
    // of the most recent snapshot. "7D" means today and the 6 days before it.
    function sliceByDays(days) {
      if (!allSnaps.length) return allSnaps;
      const last = allSnaps[allSnaps.length - 1].date;
      const [ly, lm, ld] = last.split('-').map(Number);
      const cutoff = new Date(Date.UTC(ly, lm - 1, ld - (days - 1)));
      return allSnaps.filter(s => {
        const [y, m, d] = s.date.split('-').map(Number);
        return new Date(Date.UTC(y, m - 1, d)) >= cutoff;
      });
    }

    if (data.start_date) {
      sinceEl.textContent = '$5,000 paper account · opened ' + data.start_date;
    }

    // Wire toggle buttons before first render so clicks work immediately.
    if (toggle) {
      toggle.addEventListener('click', e => {
        const btn = e.target.closest('button[data-days]');
        if (!btn) return;
        toggle.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        renderWindow(Number(btn.dataset.days));
      });
    }

    // ---- renderWindow -------------------------------------------------------
    // Clears the SVG + axes and re-draws for the given calendar-day window.
    // Called on page load (days=7) and on every toggle click.
    function renderWindow(days) {
      const snaps = sliceByDays(days);

      // Clear previous render.
      while (svg.childElementCount > 1) svg.removeChild(svg.lastChild); // keep <defs>
      xAxis.textContent = '';
      yMaxEl.textContent = yMinEl.textContent = '—';
      yStartEl.style.display = 'none';
      yStartEl.textContent = '—';

      if (snaps.length < 2) {
        const empty = document.createElement('div');
        empty.className = 'equity-empty';
        empty.textContent = snaps.length === 0
          ? 'awaiting first snapshot'
          : 'awaiting second snapshot · curve renders at 2 points';
        // Only replace the frame on first call; on subsequent calls the frame
        // may already have been replaced.
        if (frame.parentNode) frame.replaceWith(empty);
        xAxis.style.display = 'none';
        if (snaps.length === 1) {
          startEl.textContent = nowEl.textContent = fmtUSD2(snaps[0].equity);
        }
        return;
      }

      const W = 320, H = 100, padX = 4, padY = 8;
      const equities = snaps.map(s => s.equity);
      const startEq  = equities[0];
      const nowEq    = equities[equities.length - 1];

      const spyVals  = snaps.map(s => typeof s.spy_equity === 'number' ? s.spy_equity : null);
      const validSpy = spyVals.filter(v => v !== null);
      const hasSpy   = validSpy.length >= 2;

      const yMin   = Math.min(...equities, ...(hasSpy ? validSpy : []));
      const yMax   = Math.max(...equities, ...(hasSpy ? validSpy : []));
      const yRange = (yMax - yMin) || 1;
      const yPad   = yRange * 0.15;
      const yLo    = yMin - yPad;
      const yHi    = yMax + yPad;

      const xAt = i => padX + (i / (snaps.length - 1)) * (W - 2 * padX);
      const yAt = v => padY + (1 - (v - yLo) / (yHi - yLo)) * (H - 2 * padY);

      const linePts = snaps
        .map((s, i) => `${i === 0 ? 'M' : 'L'}${xAt(i).toFixed(2)} ${yAt(s.equity).toFixed(2)}`)
        .join(' ');
      const areaD = linePts +
        ` L${xAt(snaps.length - 1).toFixed(2)} ${(H - padY).toFixed(2)}` +
        ` L${xAt(0).toFixed(2)} ${(H - padY).toFixed(2)} Z`;
      const refY = yAt(startEq).toFixed(2);

      const SVG_NS = 'http://www.w3.org/2000/svg';
      function el(tag, attrs) {
        const node = document.createElementNS(SVG_NS, tag);
        for (const k in attrs) node.setAttribute(k, attrs[k]);
        return node;
      }
      svg.appendChild(el('line', {class: 'ref', x1: padX, y1: refY, x2: W - padX, y2: refY}));
      svg.appendChild(el('path', {class: 'area', d: areaD}));

      if (hasSpy) {
        let spyD = '';
        let prevIdx = -2;
        spyVals.forEach((v, i) => {
          if (v === null) return;
          spyD += (i === prevIdx + 1 ? 'L' : 'M') +
                  xAt(i).toFixed(2) + ' ' + yAt(v).toFixed(2) + ' ';
          prevIdx = i;
        });
        svg.appendChild(el('path', {class: 'spy-line', d: spyD.trim()}));
        const legend = document.getElementById('equityLegend');
        if (legend) { legend.style.display = ''; legend.setAttribute('aria-hidden', 'false'); }
      }
      svg.appendChild(el('path', {class: 'line', d: linePts}));

      // Y-axis labels.
      yMaxEl.textContent = fmtUSD0(yMax);
      yMinEl.textContent = fmtUSD0(yMin);
      const refPos = yAt(startEq);
      const tooCloseToBound = Math.abs(refPos - padY) < 10
                           || Math.abs(refPos - (H - padY)) < 10;
      if (!tooCloseToBound) {
        yStartEl.style.display = '';
        yStartEl.style.top = refPos + '%';
        yStartEl.textContent = fmtUSD0(startEq);
      }

      // X-axis labels. When there are more than 8 points, thin to 4 labels
      // (first, ~1/3, ~2/3, last) to avoid crowding at 30D density.
      const n = snaps.length;
      const xIndices = n > 8
        ? [0, Math.floor((n - 1) / 3), Math.floor(2 * (n - 1) / 3), n - 1]
        : snaps.map((_, i) => i);
      // Deduplicate in case rounding produces the same index twice at small n.
      const uniqueIndices = [...new Set(xIndices)];
      // Build a Set for O(1) lookup when iterating all snaps.
      const labelSet = new Set(uniqueIndices);
      snaps.forEach((s, i) => {
        if (!labelSet.has(i)) return;
        const span = document.createElement('span');
        span.textContent = fmtDate(s.date);
        xAxis.appendChild(span);
      });

      startEl.textContent = fmtUSD2(startEq);
      nowEl.textContent   = fmtUSD2(nowEq);
    }
    // ---- end renderWindow ---------------------------------------------------

    // Render positions (static — doesn't change with the toggle window).
    const positions = Array.isArray(data.positions) ? data.positions : [];
    if (positions.length) {
      const row  = document.getElementById('equityPositions');
      const list = document.getElementById('equityPositionsList');
      list.textContent = '';
      positions.forEach((sym, i) => {
        if (i > 0) {
          const sep = document.createElement('span');
          sep.className = 'sep';
          sep.textContent = ' · ';
          list.appendChild(sep);
        }
        const link = document.createElement('a');
        link.className = 'symbol';
        link.textContent = sym;
        link.href = 'https://finance.yahoo.com/quote/' + encodeURIComponent(sym);
        link.target = '_blank';
        link.rel = 'noopener';
        link.title = 'View ' + sym + ' on Yahoo Finance';
        list.appendChild(link);
      });
      row.style.display = '';
    }

    // Default render — 7D matches current published JSON window.
    renderWindow(7);
  })();
```

- [ ] **Step 2: Verify the 7D default renders correctly**

Open `index.html` in a browser with a local server (e.g. `npx serve .` or VS Code Live Server).

Check:
- Chart renders with current week's data (same as before this change)
- "open: $X,XXX.XX" and "close: $X,XXX.XX" show correct values, centered
- Caption "$5,000 paper account · opened 2026-04-22" appears below stats, centered
- "7D" button is green/active, "30D" is dimmed
- SPY benchmark line and legend appear if `spy_equity` is present in the JSON
- Positions row appears if positions are in the JSON

- [ ] **Step 3: Verify 30D toggle with the live JSON**

The current `paper-equity.json` only has ~5 entries (one week). Clicking "30D" should:
- Show the same data as 7D (all available snapshots fall within 30 days)
- NOT error or blank the chart
- "open:" and "close:" update to the first/last of all available snaps

To fully test the 30D view with real data, either:
- Run `publish_equity.ps1` manually in the bot-trader repo after Task 1 is committed (requires the live trading machine with `trades.db`)
- Or temporarily replace `json/paper-equity.json` with the multi-week test fixture below and verify the chart renders ~20 points with 4 x-axis labels:

<details>
<summary>Test fixture (paste into json/paper-equity.json temporarily)</summary>

```json
{
  "start_date": "2026-04-22",
  "as_of": "2026-05-29T00:00:00+00:00",
  "snapshots": [
    {"date":"2026-05-01","equity":5194.94,"spy_equity":5066.37},
    {"date":"2026-05-05","equity":5235.88,"spy_equity":5088.30},
    {"date":"2026-05-06","equity":5460.58,"spy_equity":5159.02},
    {"date":"2026-05-07","equity":5565.00,"spy_equity":5143.21},
    {"date":"2026-05-08","equity":5398.16,"spy_equity":5185.67},
    {"date":"2026-05-12","equity":5886.89,"spy_equity":5189.61},
    {"date":"2026-05-13","equity":5745.43,"spy_equity":5218.64},
    {"date":"2026-05-14","equity":5838.10,"spy_equity":5259.84},
    {"date":"2026-05-15","equity":5813.12,"spy_equity":5196.57},
    {"date":"2026-05-19","equity":5750.00,"spy_equity":5210.00},
    {"date":"2026-05-20","equity":5680.00,"spy_equity":5220.00},
    {"date":"2026-05-21","equity":5720.00,"spy_equity":5230.00},
    {"date":"2026-05-22","equity":5677.80,"spy_equity":5242.05},
    {"date":"2026-05-23","equity":5700.00,"spy_equity":5250.00},
    {"date":"2026-05-26","equity":5906.12,"spy_equity":5276.85},
    {"date":"2026-05-27","equity":6070.80,"spy_equity":5275.94},
    {"date":"2026-05-28","equity":6021.37,"spy_equity":5305.04},
    {"date":"2026-05-29","equity":6025.65,"spy_equity":5318.26}
  ],
  "positions": ["ADI","AMAT","AMD","DELL","GLW","INTC","LRCX","MU","SLB","TXN"]
}
```

</details>

Expected in 30D mode: ~18 data points, 4 x-axis labels (May 01, ~May 13, ~May 22, May 29), SPY dashed line visible.
Expected in 7D mode: 5 data points (May 22–29), all x-axis dates shown.

- [ ] **Step 4: Commit**

```bash
cd "C:/Users/Chase/Repos/Personal/active/chasecrawford-dev-html"
git add index.html
git commit -m "feat: add 7D/30D toggle to equity sparkline card"
```

---

## Task 5: smoke-test end-to-end with the live site

- [ ] **Step 1: Push the site**

```bash
cd "C:/Users/Chase/Repos/Personal/active/chasecrawford-dev-html"
git push origin main
```

- [ ] **Step 2: Verify on chasecrawford.dev**

Visit the live site. Confirm:
- Equity card loads with 7D selected by default
- Toggle responds to clicks (7D ↔ 30D)
- Until next Friday's publish run, both views show the same ~5 data points (expected — the live JSON hasn't been regenerated yet)

- [ ] **Step 3: After the next Friday publish run (or manual run)**

On the trading machine, run `publish_equity.ps1` manually once to immediately publish 30 trading days:

```powershell
cd C:\path\to\bot-trader
.\scripts\publish_equity.ps1
```

Then verify on the live site that 30D shows the full history and 7D shows only the last week.

---

## Self-Review Checklist

**Spec coverage:**
- ✅ Toggle placement: Option A (replaces badge) — Task 2 Step 2
- ✅ Days-traded text removed — Task 2 Step 2 (badge gone), no replacement added
- ✅ Footer caption restored — Task 4 Step 1 (`sinceEl.textContent = '$5,000 paper account...'`)
- ✅ Stats labels "open/close" — Task 2 Step 3
- ✅ Stats + caption centered — Task 3 Step 1
- ✅ X-axis thinning at >8 points — Task 4 Step 1 (`n > 8` branch)
- ✅ bot-trader `--trading-days 30` — Task 1 Step 1
- ✅ Alpaca backfill: `equity-seed` already runs in publish script, no code change needed
- ✅ Compatibility: JSON schema unchanged, empty/one-point guard preserved

**Placeholder scan:** No TBDs, no "similar to above", all code blocks complete.

**Type consistency:**
- `sliceByDays(days)` defined before `toggle.addEventListener` and before `renderWindow` — ✓
- `renderWindow(days)` defined before `renderWindow(7)` call — ✓
- `el(tag, attrs)` helper defined inside `renderWindow` (same scope as original) — ✓
- `fmtUSD2`, `fmtUSD0`, `fmtDate` defined in outer scope, used in `renderWindow` via closure — ✓
- `allSnaps` defined in outer scope, consumed by `sliceByDays` — ✓
