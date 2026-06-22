import { describe, it, expect } from 'vitest';
import * as Ch4zeUI from './index';

describe('barrel', () => {
  it('exports a version string', () => {
    expect(typeof Ch4zeUI.version).toBe('string');
  });
});
