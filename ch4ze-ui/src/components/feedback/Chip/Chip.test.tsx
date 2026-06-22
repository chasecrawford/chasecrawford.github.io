import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Chip } from './Chip';

describe('Chip', () => {
  it('renders its label', () => {
    render(<Chip>PHP</Chip>);
    expect(screen.getByText('PHP')).toBeInTheDocument();
  });
  it('applies a tone class when given a tone', () => {
    const { container } = render(<Chip tone="green">LIVE</Chip>);
    expect((container.firstChild as HTMLElement).className).toMatch(/green/);
  });
});
