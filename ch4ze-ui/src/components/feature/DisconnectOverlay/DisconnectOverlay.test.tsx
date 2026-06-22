import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { DisconnectOverlay } from './DisconnectOverlay';

describe('DisconnectOverlay', () => {
  it('renders CONNECTION TERMINATED when open', () => {
    render(<DisconnectOverlay open onReconnect={() => {}} />);
    expect(screen.getByText('CONNECTION TERMINATED')).toBeInTheDocument();
  });

  it('renders nothing when open={false}', () => {
    const { container } = render(<DisconnectOverlay open={false} onReconnect={() => {}} />);
    expect(container.firstChild).toBeNull();
  });

  it('calls onReconnect when RECONNECT button is clicked', async () => {
    const onReconnect = vi.fn();
    render(<DisconnectOverlay open onReconnect={onReconnect} />);
    await userEvent.click(screen.getByRole('button', { name: /reconnect/i }));
    expect(onReconnect).toHaveBeenCalledOnce();
  });

  it('calls onReconnect when Enter is pressed', async () => {
    const onReconnect = vi.fn();
    render(<DisconnectOverlay open onReconnect={onReconnect} />);
    await userEvent.keyboard('{Enter}');
    expect(onReconnect).toHaveBeenCalledOnce();
  });

  it('calls onReconnect when Escape is pressed', async () => {
    const onReconnect = vi.fn();
    render(<DisconnectOverlay open onReconnect={onReconnect} />);
    await userEvent.keyboard('{Escape}');
    expect(onReconnect).toHaveBeenCalledOnce();
  });
});
