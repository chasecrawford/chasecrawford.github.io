import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders its label and fires onClick', async () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Shake</Button>);
    await userEvent.click(screen.getByRole('button', { name: 'Shake' }));
    expect(onClick).toHaveBeenCalledOnce();
  });
  it('is disabled when disabled prop set', () => {
    render(<Button disabled>Shake</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
