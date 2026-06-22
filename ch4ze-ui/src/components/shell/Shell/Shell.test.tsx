import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Shell } from './Shell';

describe('Shell', () => {
  it('renders children inside the shell wrapper', () => {
    render(<Shell><div data-testid="x">test content</div></Shell>);
    expect(screen.getByTestId('x')).toBeInTheDocument();
  });
});
