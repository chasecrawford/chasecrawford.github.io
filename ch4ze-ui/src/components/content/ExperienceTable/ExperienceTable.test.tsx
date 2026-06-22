import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ExperienceTable } from './ExperienceTable';

describe('ExperienceTable', () => {
  it('renders default with ROLE header', () => {
    render(<ExperienceTable />);
    expect(screen.getByText('ROLE')).toBeInTheDocument();
  });

  it('renders current role "Lead Backend Developer"', () => {
    render(<ExperienceTable />);
    expect(screen.getByText('Lead Backend Developer')).toBeInTheDocument();
  });

  it('renders a CURRENT status cell with bullet', () => {
    render(<ExperienceTable />);
    expect(screen.getByText('● CURRENT')).toBeInTheDocument();
  });

  it('renders all column headers', () => {
    render(<ExperienceTable />);
    expect(screen.getByText('DATES')).toBeInTheDocument();
    expect(screen.getByText('ROLE')).toBeInTheDocument();
    expect(screen.getByText('NOTES')).toBeInTheDocument();
    expect(screen.getByText('STATUS')).toBeInTheDocument();
  });
});
