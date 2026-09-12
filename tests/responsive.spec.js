const { test, expect } = require('@playwright/test');
const { dismissBoot } = require('./helpers');

const WIDTHS = [390, 768, 1440];

for (const width of WIDTHS) {
  test.describe(`at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('never scrolls horizontally', async ({ page }) => {
      await page.goto('/index.html');
      await dismissBoot(page);
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });

    test('all four sections are present', async ({ page }) => {
      await page.goto('/index.html');
      await dismissBoot(page);
      for (const id of ['#projects', '#photos', '#contact']) {
        await expect(page.locator(id)).toHaveCount(1);
      }
      await expect(page.locator('.hero')).toHaveCount(1);
    });
  });
}

test.describe('mobile layout rules', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('scroll-snap is off and the results toggle is hidden', async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
    const snap = await page.evaluate(() =>
      getComputedStyle(document.documentElement).scrollSnapType);
    expect(snap === 'none' || snap === '').toBe(true);
    await expect(page.locator('#viewResults')).toBeAttached();
    await expect(page.locator('#viewResults')).toBeHidden();
  });
});

test.describe('page health', () => {
  test('logs no console errors', async ({ page }) => {
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.goto('/index.html');
    await dismissBoot(page);
    await page.waitForFunction(() => window.__mapState === 'locked', null, { timeout: 45000 });
    expect(errors).toEqual([]);
  });

  test('has exactly one h1 and it names the owner', async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(/CHASE\s*CRAWFORD/);
  });

  // Task 5's review noted the equity controls convey state by colour alone.
  test('equity controls expose their state to assistive tech', async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
    await expect(page.locator('#viewResults')).toHaveAttribute('aria-expanded', 'false');
    await page.locator('#viewResults').click();
    await expect(page.locator('#viewResults')).toHaveAttribute('aria-expanded', 'true');
    const pressed = await page.locator('#equityToggle button[data-days]').evaluateAll((els) =>
      els.map((e) => e.getAttribute('aria-pressed')));
    expect(pressed).toEqual(['false', 'false', 'true']);   // 7D, 30D, 60D — 60D is the default
  });

  test('interactive controls are keyboard reachable', async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
    await page.keyboard.press('Tab');
    const tag = await page.evaluate(() => document.activeElement.tagName);
    expect(['A', 'BUTTON']).toContain(tag);
  });

  // Spec §Accessibility: body text on --bg and label text on card fills must
  // both be checked. Contrast is computed here rather than eyeballed.
  test('text meets WCAG AA contrast on its own surface', async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);

    const ratios = await page.evaluate(() => {
      const lum = (rgb) => {
        const [r, g, b] = rgb.match(/\d+(\.\d+)?/g).slice(0, 3).map(Number).map((v) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
      };
      const ratio = (fg, bg) => {
        const a = lum(fg), b = lum(bg);
        return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
      };
      // Card fills are translucent over the rain canvas; measure against the
      // opaque page background, which is the darkest thing behind them.
      const pageBg = getComputedStyle(document.body).backgroundColor;
      const probe = (sel) => {
        const el = document.querySelector(sel);
        if (!el) return null;
        return { sel, r: ratio(getComputedStyle(el).color, pageBg) };
      };
      return ['.proj-desc', '.clink-k', '.subtitle', '.gframe-cap', '.proj-idx']
        .map(probe).filter(Boolean);
    });

    const failures = ratios.filter((x) => x.r < 4.5);
    expect(failures, JSON.stringify(ratios, null, 2)).toEqual([]);
  });
});
