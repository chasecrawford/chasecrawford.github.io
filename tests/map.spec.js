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
