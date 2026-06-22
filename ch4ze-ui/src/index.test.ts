import { describe, it, expect } from 'vitest';
import * as UI from './index';

const expected = [
  'Shell','Window','WindowBody','TitleBar','StatusBar',
  'Prompt','Output','OutToken','Banner','Caret','BootLoader',
  'Button','Chip','Ticker',
  'KVList','Card','ExperienceTable','Gallery','ContactLinks','FeedList',
  'Magic8Ball','EquityChart','DisconnectOverlay',
];

describe('barrel', () => {
  it.each(expected)('exports %s', (name) => {
    expect(typeof (UI as Record<string, unknown>)[name]).toBe('function');
  });
});
