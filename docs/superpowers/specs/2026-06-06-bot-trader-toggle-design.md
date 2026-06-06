# 7D / 30D Toggle for Equity Sparkline

**Date:** 2026-06-06  
**Repos affected:** `chasecrawford-dev-html` (site), `bot-trader` (private, sea-cow-company)

---

## Problem

`paper-equity.json` currently exports only the last 5 trading days. The equity chart has no way to show longer history even though the SQLite `equity_snapshots` table holds a full rolling year (backfilled from Alpaca on every publish run).

---

## Goal

Add a 7D / 30D toggle pill to the equity card so visitors can see either the current week's detail or the full 30-day trend. Default stays 7D — no visual change on first load.

---

## Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| Toggle placement | Replaces "X Days Traded" badge in card header (Option A) | Minimal — no extra row; badge was redundant |
| Days-traded text | Removed entirely | Redundant with `start_date` already in caption |
| Footer caption | `$5,000 paper account · opened YYYY-MM-DD` (unchanged) | Clean, unambiguous |
| Stats labels | `open:` / `close:` (drop "week") | Period-agnostic; toggle communicates the window |
| Stats + caption layout | Both rows centered | User-approved in mockup v3 |
| X-axis at 30D | 4 labels only: first, ~1/3, ~2/3, last | Avoids crowding at ~20 data points |
| Data source | Accumulate in `paper-equity.json` (Option 1) | Single file, no schema change, toggle is pure JS slice |
| Backfill method | Alpaca API via existing `equity-seed --days 365` | Already runs on every publish; no new code needed |

---

## Changes Required

### 1. `bot-trader` (private) — `scripts/publish_equity.ps1`

One line change:

```diff
-    "--trading-days" "5" "--benchmark" "SPY" "--output" "$jsonAbs"
+    "--trading-days" "30" "--benchmark" "SPY" "--output" "$jsonAbs"
```

`equity-seed --days 365` already runs before this line on every publish, so Alpaca history is always current in SQLite. The next scheduled Friday run will automatically backfill and publish 30 trading days to the site. To backfill immediately, run `publish_equity.ps1` manually once.

### 2. `chasecrawford-dev-html` — `index.html`

#### HTML changes (equity card)

- **Remove** `<span id="equityCadence">7D</span>` from `proj-head`
- **Add** toggle pill in its place:
  ```html
  <div class="equity-toggle" id="equityToggle" role="group" aria-label="Chart window">
    <button class="active" data-days="7">7D</button>
    <button data-days="30">30D</button>
  </div>
  ```
- **Update** `aria-label` on `#equityCard`: `"Paper-trading equity chart"`
- **Remove** `id="equitySince"` element from `proj-stats` (caption moves to its own `<div class="equity-caption">` below `.proj-stats`)
- **Add** `<div class="equity-caption" id="equitySince"></div>` below `.proj-stats`
- **Change** stat labels from `week open:` / `week close:` to `open:` / `close:`

#### CSS changes

- **Remove** `.equity-caption` rule from `.proj-stats` (it was `margin-left:auto` — the right-push rule)
- **Add** centered layout to `.proj-stats`: `justify-content: center`
- **Add** `.equity-caption` as a standalone centered block below stats
- **Add** `.equity-toggle` pill styles (matches site palette: `#30363d` border, `#00ff88` active bg, monospace 9px)
- **Remove** `.proj-chart .proj-stats` flex override rules that pushed caption right

#### JS changes (`renderEquity` IIFE)

Refactor into two phases:

**Phase 1 — fetch + setup** (runs once on load):
- Fetch `paper-equity.json`
- Store full `snaps` array in closure
- Populate `#equitySince` caption (`$5,000 paper account · opened …`)
- Wire toggle click handlers → call `renderWindow(days)`
- Call `renderWindow(7)` for default state

**Phase 2 — `renderWindow(days)`** (called on toggle):
- Filter `snaps` to entries where `date >= (lastDate - days calendar days)`
- Clear `#equitySpark` children, `#equityXAxis` children, y-axis text
- Re-run SVG path calculation + axis label logic on filtered set
- Update `#equityStart` / `#equityNow` (open/close for the selected window)
- Update toggle button `active` class
- X-axis thinning: when `filteredSnaps.length > 8`, render only 4 labels (indices 0, ⌊n/3⌋, ⌊2n/3⌋, n−1) to avoid crowding

**Removed from JS:**
- `cadenceEl` / `equityCadence` references (element no longer exists)

---

## Data Flow

```
Alpaca API
    │  equity-seed --days 365 (every Friday, idempotent)
    ▼
trades.db (equity_snapshots table, rolling year)
    │  equity-history --trading-days 30 --benchmark SPY
    ▼
json/paper-equity.json  (30 trading days, ~6 calendar weeks)
    │  git commit + push (weekly, Friday post-close)
    ▼
chasecrawford.dev/json/paper-equity.json
    │  fetch() on page load
    ▼
renderWindow(7 or 30)  — client-side date filter + SVG re-render
```

---

## Compatibility Notes

- JSON schema is **unchanged** — just more entries in `snapshots[]`. The site's existing empty/one-point guard paths still work.
- If the JSON has fewer than 30 days of data (e.g., right after the change), the 30D view shows all available data — no error, no empty state.
- The `--trading-days 30` flag is already a valid argument to `trades_cli.py equity-history`; no Python changes needed.
- `benchmark.py`'s `simulate_spy_equity` is anchored to `log.first()` (the account start), so SPY benchmark scales correctly regardless of how many snapshots are exported.

---

## Out of Scope

- Storing snapshots older than 30 trading days in the JSON (no consumer for it)
- Any change to the public `bot-trader-public` repo
- Mobile-specific toggle layout (existing responsive CSS handles card reflow)
