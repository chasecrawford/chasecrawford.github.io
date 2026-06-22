import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Ticker } from './Ticker';

describe('Ticker', () => {
  it('renders each item twice (group + aria-hidden clone) for a seamless loop', () => {
    render(<Ticker items={['REAL HUMAN']} />);
    expect(screen.getAllByText('REAL HUMAN')).toHaveLength(2);
  });
});
