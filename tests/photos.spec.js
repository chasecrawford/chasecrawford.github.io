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
    // Spec §Accessibility: nav anchors move focus, not just scroll position.
    await expect.poll(() => page.evaluate(() => document.activeElement.id)).toBe('photos');
  });
});
