import { describe, it, expect } from 'vitest';
import { makeBall } from './makeBall';

describe('makeBall', () => {
  it('renders a 25-row sphere of the expected width', () => {
    const out = makeBall(-2.35);
    const rows = out.split('\n');
    expect(rows.length).toBe(25);        // H = R*2+1 = 25
    expect(rows[0].length).toBe(47);     // W = COLS*2+1 = 47
  });
  it('is deterministic for a given angle', () => {
    expect(makeBall(1)).toBe(makeBall(1));
  });
});
