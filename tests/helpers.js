const fs = require('fs');
const path = require('path');

/** Dismiss the boot overlay via keyboard (the path a keyboard user takes). */
async function dismissBoot(page) {
  const boot = page.locator('#boot');
  if (await boot.count()) {
    await page.waitForFunction(() => window.__bootReady === true, null, { timeout: 10000 });
    await page.keyboard.press('Escape');
    await boot.waitFor({ state: 'hidden', timeout: 5000 });
  }
}

/** Snapshots within `days` calendar days of the NEWEST snapshot. */
function equityWindow(days) {
  const file = path.join(__dirname, '..', 'json', 'paper-equity.json');
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  const snaps = (data.snapshots || []).filter((s) => typeof s.equity === 'number');
  if (!snaps.length) return { data, snaps: [] };
  const [ly, lm, ld] = snaps[snaps.length - 1].date.split('-').map(Number);
  const cutoff = Date.UTC(ly, lm - 1, ld - (days - 1));
  const win = snaps.filter((s) => {
    const [y, m, d] = s.date.split('-').map(Number);
    return Date.UTC(y, m - 1, d) >= cutoff;
  });
  return { data, snaps: win };
}

const usd2 = (v) =>
  '$' + v.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

module.exports = { dismissBoot, equityWindow, usd2 };
