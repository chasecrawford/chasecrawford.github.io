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

  test('fills its frame — actual layout, not just DOM/state', async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
    await page.waitForFunction(() => window.__mapState === 'locked', null, { timeout: 45000 });
    const frameBox = await page.locator('#trace').boundingBox();
    const mapBox = await page.locator('#trace matrix-map').boundingBox();
    expect(mapBox.width).toBeGreaterThan(0);
    expect(mapBox.height).toBeGreaterThan(0);
    expect(Math.abs(mapBox.width - frameBox.width)).toBeLessThanOrEqual(2);
    expect(Math.abs(mapBox.height - frameBox.height)).toBeLessThanOrEqual(2);
  });

  test('renders a legible, unfiltered Esri credit — not the occluded Leaflet control', async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
    await page.waitForFunction(() => window.__mapState === 'locked', null, { timeout: 45000 });

    // The old mechanism (Leaflet's own attribution control) must be gone —
    // it rendered inside the invert-filtered tile layer, under the
    // .map-label gradient, entirely illegible.
    await expect(page.locator('#trace .leaflet-control-attribution')).toHaveCount(0);

    const credit = page.locator('#trace .map-label-credit');
    await expect(credit).toBeAttached();
    await expect(credit).toBeVisible();
    await expect(credit).toHaveText('Leaflet | Tiles © Esri');

    const box = await credit.boundingBox();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);

    // The credit must escape the swatch-inverting filter on the tile layer —
    // walk its ancestors up to <matrix-map> and confirm none of them (nor it)
    // carries a CSS filter. This is what would catch a regression where the
    // credit gets moved back inside the filtered mapEl.
    const escapesFilter = await page.evaluate(() => {
      const el = document.querySelector('#trace .map-label-credit');
      const root = document.querySelector('#trace matrix-map');
      let node = el;
      while (node && node !== root) {
        if (getComputedStyle(node).filter !== 'none') return false;
        node = node.parentElement;
      }
      return true;
    });
    expect(escapesFilter).toBe(true);

    // .map-label's bounding rect and the credit are the same element family
    // now (credit is a child span of .map-label) — confirm the credit's own
    // rect doesn't collapse to zero inside it (the failure mode when a
    // sibling status line pushes it off or a gradient box occludes it).
    const labelBox = await page.locator('#trace .map-label').boundingBox();
    expect(box.y + box.height).toBeLessThanOrEqual(labelBox.y + labelBox.height + 1);
    expect(box.y).toBeGreaterThanOrEqual(labelBox.y - 1);
  });

  test('the Esri credit stays legible at phone width', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/index.html');
    await dismissBoot(page);
    await page.waitForFunction(() => window.__mapState === 'locked', null, { timeout: 45000 });
    const credit = page.locator('#trace .map-label-credit');
    await expect(credit).toBeAttached();
    await expect(credit).toBeVisible();
    const box = await credit.boundingBox();
    expect(box.width).toBeGreaterThan(0);
    expect(box.height).toBeGreaterThan(0);
    const traceBox = await page.locator('#trace').boundingBox();
    // Fully inside the visible trace frame, not clipped off-screen or
    // squeezed to nothing by the status text next to it.
    expect(box.x).toBeGreaterThanOrEqual(traceBox.x - 1);
    expect(box.x + box.width).toBeLessThanOrEqual(traceBox.x + traceBox.width + 1);
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

test.describe('trace replay control', () => {
  test('header button restarts the trace', async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
    await page.waitForFunction(() => window.__mapState === 'locked', null, { timeout: 45000 });

    const btn = page.locator('#traceReplay');
    await expect(btn).toBeVisible();
    await btn.click();

    // Back to acquiring, with the label agreeing, then locking again on its own.
    await page.waitForFunction(() => window.__mapState === 'acquiring', null, { timeout: 5000 });
    await expect(page.locator('#trace .map-label-status')).toContainText('ACQUIRING SIGNAL');
    await page.waitForFunction(() => window.__mapState === 'locked', null, { timeout: 45000 });
  });

  test('button is keyboard reachable and labelled', async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
    const btn = page.locator('#traceReplay');
    expect(await btn.evaluate((e) => e.tagName)).toBe('BUTTON');
    expect(await btn.getAttribute('aria-label')).toBeTruthy();
    await btn.focus();
    expect(await page.evaluate(() => document.activeElement.id)).toBe('traceReplay');
  });
});

test.describe('trace replay with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('replay control is hidden — there is no animation to replay', async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
    await expect(page.locator('#traceReplay')).toBeAttached();
    await expect(page.locator('#traceReplay')).toBeHidden();
  });
});
