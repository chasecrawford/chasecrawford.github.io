import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BootLoader } from './BootLoader';

describe('BootLoader', () => {
  beforeEach(() => vi.useFakeTimers({ shouldAdvanceTime: true }));
  afterEach(() => vi.useRealTimers());

  it('skip jumps to 100% and calls onComplete', async () => {
    const onComplete = vi.fn();
    render(<BootLoader onComplete={onComplete} autoStart={false} />);
    await userEvent.click(screen.getByRole('button', { name: /skip/i }));
    expect(onComplete).toHaveBeenCalled();
    expect(screen.getByTestId('boot-pct').textContent).toBe('100');
  });
});
