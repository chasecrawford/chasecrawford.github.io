import { describe, it, expect } from 'vitest';
import { sliceByDays, buildGeometry } from './equityModel';

const snaps = [
  { date: '2026-06-01', equity: 5000 },
  { date: '2026-06-05', equity: 5100 },
  { date: '2026-06-08', equity: 5050 },
];

describe('equityModel', () => {
  it('sliceByDays keeps the last day + (N-1) days before it', () => {
    // last = 2026-06-08. "7D" cutoff = 06-08 - 6 = 06-02, so 06-01 is excluded.
    expect(sliceByDays(snaps, 7).map(s => s.date)).toEqual(['2026-06-05', '2026-06-08']);
    // "4D" cutoff = 06-08 - 3 = 06-05.
    expect(sliceByDays(snaps, 4).map(s => s.date)).toEqual(['2026-06-05', '2026-06-08']);
    // A wide window keeps everything.
    expect(sliceByDays(snaps, 30).length).toBe(3);
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
