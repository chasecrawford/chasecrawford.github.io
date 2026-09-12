const { test, expect } = require('@playwright/test');

const PAGE = '/blackjack-coach/index.html';

const ACTION_URLS = {
  group: 'https://groups.google.com/g/blackjack-coach-testers',
  optIn: 'https://play.google.com/apps/testing/dev.chasecrawford.blackjack.twa',
  install: 'https://play.google.com/store/apps/details?id=dev.chasecrawford.blackjack.twa',
};

test.describe('blackjack-coach action links', () => {
  test.beforeEach(async ({ page }) => { await page.goto(PAGE); });

  test('all three tester-flow URLs survive exactly', async ({ page }) => {
    await expect(page.locator(`a[href="${ACTION_URLS.group}"]`)).toHaveCount(1);
    await expect(page.locator(`a[href="${ACTION_URLS.optIn}"]`)).toHaveCount(1);
    await expect(page.locator(`a[href="${ACTION_URLS.install}"]`)).toHaveCount(1);
  });

  test('external tester-flow links are safe new-tab links', async ({ page }) => {
    for (const url of Object.values(ACTION_URLS)) {
      const link = page.locator(`a[href="${url}"]`);
      await expect(link).toHaveAttribute('target', '_blank');
      await expect(link).toHaveAttribute('rel', /noopener/);
    }
  });
});

test.describe('blackjack-coach navigation', () => {
  test.beforeEach(async ({ page }) => { await page.goto(PAGE); });

  test('both back links point at the site root', async ({ page }) => {
    const backLinks = page.locator('a[href="/"]');
    expect(await backLinks.count()).toBeGreaterThanOrEqual(2);
  });

  test('no canvas-internal .dc.html reference survives anywhere', async ({ page }) => {
    const html = await page.content();
    expect(html).not.toContain('.dc.html');
  });

  test('ships no design-canvas runtime constructs', async ({ page }) => {
    const html = await page.content();
    for (const marker of ['<x-dc', '<sc-if', '<sc-for', '{{', 'style-hover', 'support.js', 'image-slot.js']) {
      expect(html).not.toContain(marker);
    }
  });
});

test.describe('blackjack-coach images', () => {
  test.beforeEach(async ({ page }) => { await page.goto(PAGE); });

  test('icon, play, and coach screenshots all load', async ({ page }) => {
    const icon = page.locator('img[src="/images/bjc-icon.png"]');
    await expect(icon).toHaveCount(1);
    expect(await icon.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);

    const play = page.locator('img[src="/images/bjc-play.png"]');
    const coach = page.locator('img[src="/images/bjc-coach.png"]');
    await expect(play).toHaveCount(1);
    await expect(coach).toHaveCount(1);

    // Below-the-fold lazy images need to be scrolled into view before
    // complete/naturalWidth mean anything.
    await play.scrollIntoViewIfNeeded();
    await coach.scrollIntoViewIfNeeded();
    await expect.poll(() => play.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
    await expect.poll(() => coach.evaluate((img) => img.complete && img.naturalWidth > 0)).toBe(true);
  });

  test('images carry real alt text', async ({ page }) => {
    for (const src of ['/images/bjc-icon.png', '/images/bjc-play.png', '/images/bjc-coach.png']) {
      const alt = await page.locator(`img[src="${src}"]`).getAttribute('alt');
      expect(alt && alt.length).toBeGreaterThan(10);
    }
  });
});

test.describe('blackjack-coach head metadata', () => {
  test.beforeEach(async ({ page }) => { await page.goto(PAGE); });

  test('preserves title, description, canonical, viewport, icon', async ({ page }) => {
    await expect(page).toHaveTitle('Join the Blackjack Coach beta — chasecrawford.dev');
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      'content', /closed testing on Google Play/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href', 'https://chasecrawford.dev/blackjack-coach/');
    await expect(page.locator('meta[name="viewport"]')).toHaveAttribute(
      'content', 'width=device-width,initial-scale=1');
    await expect(page.locator('link[rel="icon"]')).toHaveCount(1);
  });

  test('theme-color is the Matrix background, not the old CRT one', async ({ page }) => {
    await expect(page.locator('meta[name="theme-color"]')).toHaveAttribute('content', '#020803');
  });

  test('the OG/Twitter card block is intact', async ({ page }) => {
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'website');
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content', 'https://chasecrawford.dev/blackjack-coach/');
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content', 'Join the Blackjack Coach beta');
    await expect(page.locator('meta[property="og:description"]')).toHaveAttribute(
      'content', /free blackjack trainer/);
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      'content', 'https://chasecrawford.dev/images/bjc-og.png');
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1024');
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '500');
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      'content', 'summary_large_image');
    await expect(page.locator('meta[name="twitter:title"]')).toHaveAttribute(
      'content', 'Join the Blackjack Coach beta');
    await expect(page.locator('meta[name="twitter:description"]')).toHaveAttribute(
      'content', /free blackjack trainer/);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute(
      'content', 'https://chasecrawford.dev/images/bjc-og.png');
  });

  test('GTM head script installs dataLayer and the noscript iframe is present', async ({ page }) => {
    expect(await page.evaluate(() => Array.isArray(window.dataLayer))).toBe(true);
    const ns = await page.locator('noscript').first().textContent();
    expect(ns).toContain('googletagmanager.com/ns.html?id=GTM-TMFW9FK');
  });
});

test.describe('blackjack-coach page health', () => {
  test.beforeEach(async ({ page }) => { await page.goto(PAGE); });

  test('has exactly one h1 and it names the app', async ({ page }) => {
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveText(/blackjack coach/i);
  });

  test('logs no console errors', async ({ page }) => {
    const errors = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    await page.reload();
    await page.waitForTimeout(300);
    expect(errors).toEqual([]);
  });

  test('mounts the Matrix rain canvas and vignette/scanline chrome', async ({ page }) => {
    await expect(page.locator('canvas#rain')).toHaveCount(1);
    const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
    expect(bg).toBe('rgb(2, 8, 3)');
  });
});

const WIDTHS = [390, 1440];
for (const width of WIDTHS) {
  test.describe(`blackjack-coach responsive at ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('never scrolls horizontally', async ({ page }) => {
      await page.goto(PAGE);
      // Scroll to bottom to force lazy images to load and lay out.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(100);
      const overflow = await page.evaluate(() =>
        document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow).toBeLessThanOrEqual(0);
    });
  });
}

test.describe('blackjack-coach with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('still renders the page content', async ({ page }) => {
    await page.goto(PAGE);
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator(`a[href="${ACTION_URLS.group}"]`)).toBeVisible();
    const scanAnim = await page.evaluate(() => {
      const el = document.querySelector('.scanlines');
      return el ? getComputedStyle(el).animationName : 'none';
    });
    expect(scanAnim === 'none' || scanAnim === '').toBe(true);
  });
});

test.describe('tap targets', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('the three action buttons clear the 44px touch guidance', async ({ page }) => {
    // This page's entire function is three tap-throughs on a phone.
    await page.goto('/blackjack-coach/');
    const boxes = await page.locator('a.btn').evaluateAll((els) =>
      els.map((e) => ({ t: e.textContent.trim().slice(0, 24), h: e.getBoundingClientRect().height })));
    expect(boxes.length).toBe(3);
    const short = boxes.filter((b) => b.h < 44);
    expect(short, JSON.stringify(boxes)).toEqual([]);
  });
});
