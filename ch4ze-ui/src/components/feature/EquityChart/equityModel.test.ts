import { describe, it, expect } from 'vitest';
import { sliceByDays, buildGeometry } from './equityModel';

const snaps = [
  { date: '2026-06-01', equity: 5000 },
  { date: '2026-06-05', equity: 5100 },
  { date: '2026-06-08', equity: 5050 },
];

describe('equityModel', () => {
  it('sliceByDays keeps snapshots within N calendar days of the last', () => {
    expect(sliceByDays(snaps, 7).length).toBe(3);
    expect(sliceByDays(snaps, 4).map(s => s.date)).toEqual(['2026-06-05', '2026-06-08']);
  });
  it('buildGeometry returns null for <2 points', () => {
    expect(buildGeometry(snaps.slice(0, 1))).toBeNull();
  });
  it('buildGeometry produces a line path and bounds for >=2 points', () => {
    const g = buildGeometry(snaps)!;
    expect(g.linePts.startsWith('M')).toBe(true);
    expect(g.yMax).toBeGreaterThanOrEqual(5100);
    expect(g.startEq).toBe(5000);
    expect(g.nowEq).toBe(5050);
  });
});
