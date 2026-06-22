import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Banner } from './Banner';

describe('Banner', () => {
  it('renders the full and small art blocks and a subtitle', () => {
    const { container } = render(<Banner subtitle="v3.0" />);
    const pres = container.querySelectorAll('pre');
    expect(pres.length).toBe(2); // full + small
    expect(container.textContent).toContain('v3.0');
  });
});
