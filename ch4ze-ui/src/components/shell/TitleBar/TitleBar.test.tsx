import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TitleBar } from './TitleBar';

describe('TitleBar', () => {
  it('renders the title and fires control callbacks', async () => {
    const onClose = vi.fn();
    render(<TitleBar title="t" onClose={onClose} />);
    expect(screen.getByText('t')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
