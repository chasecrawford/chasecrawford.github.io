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
