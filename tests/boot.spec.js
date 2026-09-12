const { test, expect } = require('@playwright/test');

const READY = () => window.__bootReady === true;

test.describe('boot overlay', () => {
  test('types the approved line, then clears itself', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('#boot')).toBeVisible();
    await expect(page.locator('#bootLine')).toHaveText('The Matrix has you...', { timeout: 15000 });
    await expect(page.locator('#boot')).toBeAttached();
    await expect(page.locator('#boot')).toBeHidden({ timeout: 15000 });
  });

  test('locks scrolling while booting and restores it after', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForFunction(READY);
    expect(await page.evaluate(() => document.documentElement.style.overflowY)).toBe('hidden');
    await page.keyboard.press('Escape');
    await expect(page.locator('#boot')).toBeAttached();
    await expect(page.locator('#boot')).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.style.overflowY)).toBe('');
  });

  test('skips on click', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForFunction(READY);
    await page.locator('#boot').click();
    await expect(page.locator('#boot')).toBeAttached();
    await expect(page.locator('#boot')).toBeHidden({ timeout: 5000 });
  });

  test('skips on any key — a keyboard user is never trapped', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForFunction(READY);
    await page.keyboard.press('a');
    await expect(page.locator('#boot')).toBeAttached();
    await expect(page.locator('#boot')).toBeHidden({ timeout: 5000 });
  });

  test('endBoot is idempotent', async ({ page }) => {
    await page.goto('/index.html');
    await page.waitForFunction(READY);
    await page.evaluate(() => { window.__endBoot(); window.__endBoot(); window.__endBoot(); });
    await expect(page.locator('#boot')).toBeAttached();
    await expect(page.locator('#boot')).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.style.overflowY)).toBe('');
  });
});

test.describe('boot overlay with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('resolves immediately instead of typing', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('#boot')).toBeAttached();
    await expect(page.locator('#boot')).toBeHidden({ timeout: 3000 });
  });
});

test.describe('boot overlay with JavaScript disabled', () => {
  test.use({ javaScriptEnabled: false });

  // Without JS, endBoot() never runs -- #boot is the only thing standing
  // between a no-JS visitor and an otherwise fully-degrading page. The
  // <noscript><style> rule must hide it, and every other section must
  // still be there and usable underneath.
  test('the page is usable — no permanently black rectangle', async ({ page }) => {
    await page.goto('/index.html');
    await expect(page.locator('#boot')).toBeAttached();
    await expect(page.locator('#boot')).toBeHidden();
    await expect(page.locator('#contact .clink')).toHaveCount(7);
    await expect(page.locator('#name')).toBeVisible();
  });
});

test.describe('boot runs once per tab session', () => {
  test('coming back from another page does not replay the intro', async ({ page }) => {
    // First arrival in this tab: the intro plays.
    await page.goto('/index.html');
    await expect(page.locator('#boot')).toBeVisible();
    await page.waitForFunction(() => window.__bootReady === true);
    await page.keyboard.press('Escape');
    await expect(page.locator('#boot')).toBeHidden();

    // Navigate to the beta page and back, same tab.
    await page.goto('/blackjack-coach/');
    await page.goto('/index.html');

    // The overlay must not stand between the visitor and the page again.
    await expect(page.locator('#boot')).toBeAttached();
    await expect(page.locator('#boot')).toBeHidden();
    expect(await page.evaluate(() => document.documentElement.style.overflowY)).toBe('');

    // And everything gated on boot ending must still be released.
    await page.waitForFunction(() => window.__bootDone === true, null, { timeout: 5000 });
    await expect(page.locator('#name .name-line').nth(1)).toHaveText('CRAWFORD', { timeout: 8000 });
  });

  test('a session with no record of it still gets the intro', async ({ page }) => {
    // Exercise the mechanism directly rather than the browser's tab model:
    // wipe the flag and reload, which is what a genuinely new visit looks like.
    await page.goto('/index.html');
    await page.evaluate(() => { try { sessionStorage.clear(); } catch (_) {} });
    await page.reload();
    await expect(page.locator('#boot')).toBeVisible();
    await expect(page.locator('#bootLine')).toHaveText('The Matrix has you...', { timeout: 15000 });
  });
});
