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
    // 7, 30, 7 (not 7, 30, 60) -- openResults() already leaves __equityDays at
    // 60 from the initial render, so ending back on 60 here would pass even if
    // the button click did nothing at all. Ending on a re-click of 7 proves
    // each click actually re-renders.
    for (const days of [7, 30, 7]) {
      await page.evaluate(() => { window.__equityDays = undefined; });
      await page.locator(`#equityToggle button[data-days="${days}"]`).click();
      await page.waitForFunction((d) => window.__equityDays === d, days);
      const { snaps } = equityWindow(days);
      if (snaps.length < 2) continue;
      await expect(page.locator('#equityOpen')).toHaveText(usd2(snaps[0].equity));
      await expect(page.locator('#equityClose')).toHaveText(usd2(snaps[snaps.length - 1].equity));
    }
  });

  test('dismissing and reopening resets the active range button to 60D', async ({ page }) => {
    await openResults(page);
    await page.locator('#equityToggle button[data-days="7"]').click();
    await page.waitForFunction(() => window.__equityDays === 7);
    await expect(page.locator('#equityToggle button[data-days="7"]')).toHaveClass(/is-active/);
    await expect(page.locator('#equityToggle button[data-days="60"]')).not.toHaveClass(/is-active/);

    await page.locator('#equityDismiss').click();
    await page.evaluate(() => { window.__equityDays = undefined; });
    await page.locator('#viewResults').click();
    await page.waitForFunction(() => window.__equityDays === 60);

    await expect(page.locator('#equityToggle button[data-days="60"]')).toHaveClass(/is-active/);
    await expect(page.locator('#equityToggle button[data-days="7"]')).not.toHaveClass(/is-active/);
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

  test('the strategy polyline is numerically correct for the 60D window', async ({ page }) => {
    await openResults(page);
    const { snaps } = equityWindow(60);
    const points = (await page.locator('#equityStrat').getAttribute('points')).trim().split(' ');
    expect(points).toHaveLength(snaps.length);

    const [firstX] = points[0].split(',');
    const [lastX] = points[points.length - 1].split(',');
    expect(firstX).toBe('0.0');
    expect(lastX).toBe('600.0');

    const maxEquity = Math.max(...snaps.map((s) => s.equity));
    const maxIndex = snaps.findIndex((s) => s.equity === maxEquity);
    const [, maxY] = points[maxIndex].split(',');
    expect(maxY).toBe('10.0');
  });

  test('a missing spy_equity mid-window does not desync the benchmark x-scale from the strategy', async ({ page }) => {
    // Deliberately gapped payload — index 2 carries no spy_equity, the way a
    // partial SPY fetch on the off-box publish job would look. Does not touch
    // json/paper-equity.json; this is a stubbed response only.
    const payload = {
      start_date: '2026-01-01',
      as_of: '2026-01-05T00:00:00+00:00',
      snapshots: [
        { date: '2026-01-01', equity: 5000, spy_equity: 5000 },
        { date: '2026-01-02', equity: 5100, spy_equity: 5050 },
        { date: '2026-01-03', equity: 5050 },
        { date: '2026-01-04', equity: 5200, spy_equity: 5150 },
        { date: '2026-01-05', equity: 5300, spy_equity: 5200 },
      ],
      positions: ['AMD'],
    };
    await page.route('**/json/paper-equity.json', (r) => r.fulfill({ json: payload }));
    await page.goto('/index.html');
    await dismissBoot(page);
    await openResults(page);

    const stratPoints = (await page.locator('#equityStrat').getAttribute('points')).trim().split(' ');
    const spyPoints = (await page.locator('#equitySpy').getAttribute('points')).trim().split(' ');
    expect(stratPoints).toHaveLength(5);
    expect(spyPoints).toHaveLength(4); // the gap at index 2 drops one point

    const stratX = stratPoints.map((p) => p.split(',')[0]);
    const spyX = spyPoints.map((p) => p.split(',')[0]);
    // The benchmark must keep the strategy's x for every date it actually
    // has data for -- indices 0, 1, 3, 4 (index 2 is the gap) -- not its own
    // compressed 0..600 spread across only 4 points.
    expect(spyX).toEqual([stratX[0], stratX[1], stratX[3], stratX[4]]);
  });

  test('switching to a too-small window clears hi/lo labels left over from a larger one', async ({ page }) => {
    // Two snapshots 40 days apart: both are inside the 60D cutoff (>=2
    // points, chart renders) but only the newest is inside the 7D cutoff
    // (<2 points, empty-state branch).
    const payload = {
      start_date: '2026-01-01',
      as_of: '2026-02-10T00:00:00+00:00',
      snapshots: [
        { date: '2026-01-01', equity: 5000, spy_equity: 5000 },
        { date: '2026-02-10', equity: 5500, spy_equity: 5300 },
      ],
      positions: [],
    };
    await page.route('**/json/paper-equity.json', (r) => r.fulfill({ json: payload }));
    await page.goto('/index.html');
    await dismissBoot(page);
    await openResults(page); // default 60D — both points render, hi/lo populated

    await expect(page.locator('#equityHi')).toHaveText('$5,500');
    await expect(page.locator('#equityLo')).toHaveText('$5,000');

    await page.locator('#equityToggle button[data-days="7"]').click();
    await page.waitForFunction(() => window.__equityDays === 7);

    await expect(page.locator('.equity-empty')).toHaveText(
      'awaiting second snapshot · curve renders at 2 points'
    );
    await expect(page.locator('#equityHi')).toHaveText('—');
    await expect(page.locator('#equityLo')).toHaveText('—');
  });

  test('the panel is visible without interaction on phone widths', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/index.html');
    await dismissBoot(page);
    await expect(page.locator('#equity')).toBeVisible();
    await expect(page.locator('#projects .proj-name')).toHaveCount(3);
    // Stacked with the panel, not swapped out for it — mobile has no toggle
    // to bring them back.
    await expect(page.locator('.proj--other').first()).toBeVisible();
    await expect(page.locator('.proj--other').last()).toBeVisible();
  });

  // The ✕ used to be a dead control at this width: it visually sat outside
  // the --vr-disp:none mechanism that hides #viewResults, so a mobile
  // visitor could tap a close button that did nothing (the mobile CSS
  // override always forces the panel back open). It must disappear with the
  // rest of the open/close affordance instead of staying as inert chrome.
  test('the close control disappears with the rest of the toggle affordance on phone widths', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/index.html');
    await dismissBoot(page);
    await expect(page.locator('#equityDismiss')).toBeAttached();
    await expect(page.locator('#equityDismiss')).toBeHidden();
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
