const { test, expect } = require('@playwright/test');
const { dismissBoot } = require('./helpers');

test.describe('contact', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
  });

  test('shows seven endpoints, matching the stated count', async ({ page }) => {
    await expect(page.locator('#contact .subtitle')).toHaveText('7 endpoints · reply time ~24h');
    await expect(page.locator('#contact .clink')).toHaveCount(7);
  });

  test('labels the endpoints', async ({ page }) => {
    const keys = await page.locator('#contact .clink-k').allTextContents();
    expect(keys).toEqual(['EMAIL','PHONE','LINKEDIN','BLUESKY','STEAM','XBOX','DISCORD']);
  });

  test('mail and tel links are wired', async ({ page }) => {
    await expect(page.locator('#contact a[href="mailto:chase@ch4ze.com"]')).toHaveCount(1);
    await expect(page.locator('#contact a[href="tel:+15024388129"]')).toHaveCount(1);
  });

  test('external links are safely targeted', async ({ page }) => {
    const bad = await page.locator('#contact a[target="_blank"]').evaluateAll((els) =>
      els.filter((e) => !(e.getAttribute('rel') || '').includes('noopener')).length);
    expect(bad).toBe(0);
  });

  test('Discord is an interactive copy button, not an inert div', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    const el = page.locator('#discordLink');
    expect(await el.evaluate((e) => e.tagName)).toBe('BUTTON');
    await el.click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe('chase_22');
  });

  test('nav anchor reaches the section', async ({ page }) => {
    await page.locator('.nav-btn[href="#contact"]').click();
    await expect(page.locator('#contact')).toBeInViewport({ timeout: 5000 });
  });
});
