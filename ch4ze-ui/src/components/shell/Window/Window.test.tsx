import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Window, WindowBody } from './Window';

describe('Window', () => {
  it('renders children', () => {
    render(<Window><WindowBody>hi</WindowBody></Window>);
    expect(screen.getByText('hi')).toBeInTheDocument();
  });
  it('adds a minimized class when minimized', () => {
    const { container } = render(<Window minimized><WindowBody>hi</WindowBody></Window>);
    expect((container.firstChild as HTMLElement).className).toMatch(/minimized/);
  });
});
