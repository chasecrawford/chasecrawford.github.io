import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Gallery } from './Gallery';

describe('Gallery', () => {
  it('renders default Gallery with 4 frames', () => {
    render(<Gallery />);
    // Check that all 4 frame IDs are present
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
  });

  it('renders XMAS \'25 label', () => {
    render(<Gallery />);
    expect(screen.getByText("XMAS '25")).toBeInTheDocument();
  });
});
