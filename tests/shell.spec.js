const { test, expect } = require('@playwright/test');
const { dismissBoot } = require('./helpers');

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

test.describe('digital rain with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  // The reduced-motion path draws exactly one static frame and never runs
  // the rAF loop. A resize reassigns canvas width/height, which clears it —
  // without an explicit redraw on resize, that frame is lost for good and
  // the canvas stays blank until the next full reload.
  test('redraws the static frame after a resize', async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
    await page.setViewportSize({ width: 800, height: 700 });
    await page.waitForTimeout(150);
    const hasPaintedPixels = await page.evaluate(() => {
      const c = document.getElementById('rain');
      const ctx = c.getContext('2d');
      const data = ctx.getImageData(0, 0, c.width, c.height).data;
      for (let i = 3; i < data.length; i += 4) {
        if (data[i] > 0) return true;
      }
      return false;
    });
    expect(hasPaintedPixels).toBe(true);
  });
});
