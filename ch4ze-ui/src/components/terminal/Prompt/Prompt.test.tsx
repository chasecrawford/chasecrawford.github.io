import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Prompt } from './Prompt';

describe('Prompt', () => {
  it('renders user, host, path, command, and flags', () => {
    render(<Prompt command="whoami" flags="--verbose" />);
    expect(screen.getByText('chase')).toBeInTheDocument();
    expect(screen.getByText('louisville')).toBeInTheDocument();
    expect(screen.getByText(/whoami/)).toBeInTheDocument();
    expect(screen.getByText('--verbose')).toBeInTheDocument();
  });
});
