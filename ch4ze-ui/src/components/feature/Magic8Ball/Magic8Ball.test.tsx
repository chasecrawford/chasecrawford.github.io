import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Magic8Ball } from './Magic8Ball';

describe('Magic8Ball', () => {
  it('shows an answer after shaking (reduced-motion fast path)', async () => {
    // jsdom matchMedia returns matches:false by default; stub reduced-motion = true
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener() {}, removeEventListener() {} }) as never;
    render(<Magic8Ball rng={() => 0} />);   // index 0 → 'It is certain'
    await userEvent.click(screen.getByRole('button', { name: /shake/i }));
    expect(await screen.findByText(/It is certain/)).toBeInTheDocument();
  });
});
