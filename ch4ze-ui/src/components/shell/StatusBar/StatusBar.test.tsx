import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { StatusBar } from './StatusBar';

describe('StatusBar', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());
  it('renders a live clock that ticks', () => {
    render(<StatusBar />);
    const clock = screen.getByTestId('statusbar-clock');
    const first = clock.textContent;
    expect(first).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    act(() => { vi.advanceTimersByTime(1000); });
    expect(clock.textContent).toMatch(/^\d{2}:\d{2}:\d{2}$/);
  });
});
