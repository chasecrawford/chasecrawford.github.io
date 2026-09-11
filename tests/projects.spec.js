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
