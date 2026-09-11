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
    for (const marker of ['<x-dc', '<sc-if', '<sc-for', '{{', 'style-hover', 'support.js', 'image-slot.js']) {
      expect(html).not.toContain(marker);
    }
  });
});
