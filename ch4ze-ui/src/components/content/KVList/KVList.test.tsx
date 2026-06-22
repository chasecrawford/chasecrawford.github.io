import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KVList } from './KVList';

describe('KVList', () => {
  it('renders with default WHOAMI_ROWS', () => {
    render(<KVList />);
    expect(screen.getByText('Chase Crawford')).toBeInTheDocument();
  });

  it('renders a skill chip', () => {
    render(<KVList />);
    expect(screen.getByText('PHP')).toBeInTheDocument();
  });
});
