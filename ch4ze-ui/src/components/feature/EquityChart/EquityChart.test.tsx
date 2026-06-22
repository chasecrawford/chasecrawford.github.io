import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { EquityChart } from './EquityChart';

const data = { start_date: '2026-06-01', positions: ['AAPL'], snapshots: [
  { date: '2026-06-01', equity: 5000 }, { date: '2026-06-02', equity: 5100 },
]};

describe('EquityChart', () => {
  it('renders the strategy title and toggles windows', async () => {
    render(<EquityChart data={data} />);
    expect(screen.getByText(/EMA trend-state strategy/)).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: '7D' }));
    expect(screen.getByRole('button', { name: '7D' }).className).toMatch(/active/);
  });
  it('shows an empty state with a single snapshot', () => {
    render(<EquityChart data={{ snapshots: [{ date: '2026-06-01', equity: 5000 }] }} />);
    expect(screen.getByText(/awaiting/i)).toBeInTheDocument();
  });
});
