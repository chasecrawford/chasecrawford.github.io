import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Card } from './Card';
import { BOT_TRADER, FEEDS_BY_CHASE } from '../../../sample-data/projects';

describe('Card', () => {
  it('renders BOT_TRADER with name, thesis label, and stack tag', () => {
    render(<Card {...BOT_TRADER} />);
    expect(screen.getByText('bot-trader')).toBeInTheDocument();
    expect(screen.getByText('Goal')).toBeInTheDocument();
    expect(screen.getByText('PYTHON')).toBeInTheDocument();
  });

  it('renders as an <a> element when href is provided', () => {
    const { container } = render(<Card {...BOT_TRADER} />);
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', BOT_TRADER.href);
  });

  it('renders as a <div> element when href is not provided', () => {
    const cardProps = { ...FEEDS_BY_CHASE, href: undefined };
    const { container } = render(<Card {...cardProps} />);
    const div = container.querySelector('div[class*="proj"]');
    expect(div).toBeInTheDocument();
  });

  it('renders badge when present', () => {
    render(<Card {...BOT_TRADER} />);
    expect(screen.getByText('OSS')).toBeInTheDocument();
  });

  it('renders id in proj-head', () => {
    render(<Card {...BOT_TRADER} />);
    expect(screen.getByText('001')).toBeInTheDocument();
  });
});
