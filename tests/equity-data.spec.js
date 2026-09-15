const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Integrity guards on the published series itself, not on the panel that
// draws it. The publisher runs off-box and has silently trimmed history
// before: it held a rolling cap (5 -> 30 -> 60) and, once at the cap, evicted
// the oldest snapshot on every weekly publish. Between 2026-07-24 and
// 2026-09-11 that quietly ate the first two months of the account. These
// tests turn that silent data loss into a red build.
const data = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', 'json', 'paper-equity.json'), 'utf8')
);
const snaps = data.snapshots || [];

test.describe('paper-equity.json integrity', () => {
  test('the series still reaches back to the account start date', () => {
    // The caption prints start_date, so a trimmed file makes the site claim
    // an opening date it no longer has a curve for.
    expect(snaps.length).toBeGreaterThan(0);
    expect(snaps[0].date).toBe(data.start_date);
  });

  test('retains every snapshot, not a rolling window', () => {
    // 98 trading days recovered from git history, 2026-04-22 -> 2026-09-11.
    // This must only ever grow. A drop means the publisher trimmed again.
    expect(snaps.length).toBeGreaterThanOrEqual(98);
  });

  test('snapshots are unique and in ascending date order', () => {
    const dates = snaps.map((s) => s.date);
    expect(new Set(dates).size).toBe(dates.length);
    expect([...dates].sort()).toEqual(dates);
  });

  test('every snapshot carries a numeric equity', () => {
    const bad = snaps.filter((s) => typeof s.equity !== 'number');
    expect(bad).toEqual([]);
  });
});
