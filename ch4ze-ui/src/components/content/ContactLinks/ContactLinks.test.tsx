import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ContactLinks } from './ContactLinks';

describe('ContactLinks', () => {
  it('copies on click for copy links', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    render(<ContactLinks />);
    await userEvent.click(screen.getByText('DISCORD').closest('button')!);
    expect(writeText).toHaveBeenCalledWith('chase_22');
  });
});
