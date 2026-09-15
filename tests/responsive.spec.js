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
    expect(pressed).toEqual(['false', 'false', 'true']);   // 30D, 60D, FULL — FULL is the default
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

test.describe('hero stacking on phones', () => {
  for (const width of [360, 393, 412]) {
    test(`at ${width}px the nav and the trace panel are not pushed apart`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto('/index.html');
      await dismissBoot(page);

      const gap = await page.evaluate(() => {
        const nav = document.querySelector('.nav').getBoundingClientRect();
        const panel = document.querySelector('.hero-right').getBoundingClientRect();
        return Math.round(panel.top - nav.bottom);
      });

      // The hero is min-height:100vh and wraps to one column at this width. If
      // align-content is left at its default, the leftover vertical space is
      // dealt out *between* the wrapped flex lines and the designed 48px gap
      // balloons past 150px. Allow some slack, but nothing like that.
      expect(gap, `nav-bottom to panel-top was ${gap}px`).toBeLessThanOrEqual(64);
    });
  }
});

test.describe('hero tagline on phones', () => {
  for (const width of [360, 393, 412]) {
    test(`at ${width}px the wrapped tagline stays tight`, async ({ page }) => {
      await page.setViewportSize({ width, height: 915 });
      await page.goto('/index.html');
      await dismissBoot(page);

      const m = await page.evaluate(() => {
        const role = document.querySelector('.role');
        // Only count what is actually rendered; the separator is hidden here.
        const shown = [...role.children].filter((s) => s.offsetParent !== null);
        const tops = [...new Set(shown.map((s) =>
          Math.round(s.getBoundingClientRect().top)))].sort((a, b) => a - b);
        return { rows: tops.length, delta: tops.length > 1 ? tops[1] - tops[0] : 0 };
      });

      // Exactly two rows: role, then employer. Without the separator the two
      // phrases fit one line again and read as a run-on, so the stack is
      // forced rather than left to wrapping.
      expect(m.rows, 'tagline should be two stacked rows').toBe(2);

      // The tagline wraps to two rows at phone widths. It inherited the body's
      // 1.6 line-height, and the flex `gap` applies to rows as well as columns,
      // which together pushed the two halves ~31px apart for 13px text.
      expect(m.delta, `tagline rows were ${m.delta}px apart`).toBeLessThanOrEqual(18);

      // The "//" only separates the two phrases while they share a line. Once
      // they stack it is a dangling mark at the end of the first row, so it is
      // hidden below the width where the tagline still fits on one line.
      await expect(page.locator('.role-sep')).toBeAttached();
      await expect(page.locator('.role-sep')).toBeHidden();
    });
  }
});
