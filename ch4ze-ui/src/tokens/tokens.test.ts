import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const css = readFileSync(resolve(__dirname, 'tokens.css'), 'utf8');

describe('tokens.css', () => {
  const required = ['--bg', '--bg2', '--ink', '--ink2', '--line', '--green',
    '--cyan', '--yellow', '--magenta', '--red'];
  it.each(required)('declares %s', (name) => {
    expect(css).toContain(`${name}:`);
  });
  it('imports JetBrains Mono', () => {
    expect(css).toMatch(/JetBrains\+Mono/);
  });
});
