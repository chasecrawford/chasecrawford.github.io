import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Output, OutToken } from './Output';

describe('Output', () => {
  it('renders children and applies dim', () => {
    const { container } = render(<Output dim>total 2 · open source</Output>);
    expect(screen.getByText(/total 2/)).toBeInTheDocument();
    expect((container.firstChild as HTMLElement).className).toMatch(/dim/);
  });
  it('OutToken applies its tone class', () => {
    const { container } = render(<OutToken tone="success">ok</OutToken>);
    expect((container.firstChild as HTMLElement).className).toMatch(/success/);
  });
});
