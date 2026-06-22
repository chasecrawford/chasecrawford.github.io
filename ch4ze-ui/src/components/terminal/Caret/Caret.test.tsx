import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Caret } from './Caret';

describe('Caret', () => {
  it('renders a blinking caret span', () => {
    const { container } = render(<Caret />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
