const { test, expect } = require('@playwright/test');
const { dismissBoot } = require('./helpers');

test.describe('hero', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
  });

  test('name resolves out of the glyph scramble', async ({ page }) => {
    const lines = page.locator('#name .name-line');
    await expect(lines).toHaveCount(2);
    await expect(lines.nth(0)).toHaveText('CHASE', { timeout: 8000 });
    await expect(lines.nth(1)).toHaveText('CRAWFORD', { timeout: 8000 });
  });

  test('states the role', async ({ page }) => {
    await expect(page.locator('.role')).toContainText('LEAD BACKEND DEVELOPER');
    await expect(page.locator('.role')).toContainText('HATFIELD MEDIA');
  });

  test('nav targets the three sections plus the resume', async ({ page }) => {
    const hrefs = await page.locator('.nav .nav-btn').evaluateAll((els) =>
      els.map((e) => e.getAttribute('href')));
    expect(hrefs).toEqual(['#projects', '#photos', '#contact', 'pdf/resume.pdf']);
  });

  test('resume link is relative, not a hardcoded absolute self-link', async ({ page }) => {
    const href = await page.locator('.nav .nav-btn').last().getAttribute('href');
    expect(href).not.toContain('chasecrawford.dev');
  });

  test('trace panel frame is present and labelled', async ({ page }) => {
    await expect(page.locator('#trace')).toHaveCount(1);
    await expect(page.locator('.hero-right .panel-head')).toContainText('TRACE PROGRAM');
  });
});

test.describe('hero with reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('name is plain text, never scrambled', async ({ page }) => {
    await page.goto('/index.html');
    await dismissBoot(page);
    await expect(page.locator('#name .name-line').nth(0)).toHaveText('CHASE');
    await expect(page.locator('#name .name-line').nth(1)).toHaveText('CRAWFORD');
  });
});
